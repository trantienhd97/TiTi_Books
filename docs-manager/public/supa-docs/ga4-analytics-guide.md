# Hướng dẫn kiểm tra GA4 Analytics

## ⚠️ QUAN TRỌNG: Automatic Screen Tracking đã bị TẮT

App đã **TẮT automatic screen tracking** từ native platform và **CHỈ dùng manual tracking từ Flutter**.

### Lý do:

- Native automatic tracking ghi nhận tên class (FlutterViewController, MainActivity) thay vì route paths
- Manual tracking từ Flutter cung cấp tên màn hình có ý nghĩa hơn (như `/work-new/inspection/list`)

### Cấu hình đã thêm:

**iOS (Info.plist):**

```xml
<key>FirebaseAutomaticScreenReportingEnabled</key>
<false/>
```

**Android (AndroidManifest.xml):**

```xml
<meta-data
    android:name="google_analytics_automatic_screen_reporting_enabled"
    android:value="false" />
```

## Tổng quan

App đã được tích hợp Firebase Analytics (GA4) tự động cho tất cả màn hình thông qua `GA4AnalyticsObserver`.

## Cách hoạt động

### 1. Tự động tracking

- **GA4AnalyticsObserver** được thêm vào `routerObservers` trong `create_router_config.dart`
- Tự động log mỗi khi:
  - Push màn hình mới (`didPush`)
  - Thay thế màn hình (`didReplace`)
  - Pop về màn hình trước (`didPop`)

### 2. Screen name

- Lấy từ `route.settings.name` (= path của GoRouter)
- Ví dụ: `/work-new/inspection/detail/:id`
- Skip route `/` (redirect route)

### 3. Cấu hình

```dart
GA4AnalyticsObserver({
  FirebaseAnalytics? analytics,
  this.verboseLogging = true, // Bật log chi tiết
})
```

## Kiểm tra GA4 trong Dev Mode

### 1. Xem logs trong Console

Khi chạy app ở debug mode, bạn sẽ thấy các log sau:

```
✅ [GA4] Analytics collection enabled
📊 [GA4] Screen view logged: /work-new/inspection/list
📊 [GA4] Screen view logged: /work-new/inspection/detail/123
⚠️ [GA4] Failed to log screen view "/some/path": <error>
```

### 2. Kiểm tra trong Firebase Console

#### Bước 1: Bật Debug View

**iOS:**

```bash
# Enable debug mode
adb shell setprop debug.firebase.analytics.app com.supabase.app

# Hoặc thêm vào schema arguments trong Xcode:
-FIRDebugEnabled
```

**Android:**

```bash
# Enable debug mode
adb shell setprop debug.firebase.analytics.app com.supabase.app

# Disable debug mode
adb shell setprop debug.firebase.analytics.app .none.
```

#### Bước 2: Truy cập Firebase Console

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project: **truesight-cloud-apps**
3. Vào **Analytics** > **DebugView**
4. Chạy app trên thiết bị/emulator
5. Bạn sẽ thấy events realtime:
   - `screen_view` events
   - `screen_name` parameter
   - `screen_class` = "FlutterPage"

### 3. Xác minh tất cả routes được track

#### Tổng số routes trong hệ thống: ~204 routes

**Modules chính:**

- `/work-new/*` - Supa Work (68+ routes)
- `/training/*` - Supa Training (25+ routes)
- `/bibs/*` - Supa Bibs (14+ routes)
- `/communication/*` - Supa Communication (12+ routes)
- `/spend/*` - Supa Spend (21+ routes)
- `/serving/*` - Supa Serving (14+ routes)
- `/attendance/*` - Supa Attendance (17+ routes)
- `/project/*` - Supa Project (20+ routes)

## Kiểm tra trong Production

### 1. Firebase Console - Realtime View

1. Vào **Analytics** > **Realtime**
2. Xem số users đang active
3. Xem screens hiện tại

### 2. Firebase Console - Events

1. Vào **Analytics** > **Events**
2. Tìm event: `screen_view`
3. Xem số lượng events trong 30 ngày qua
4. Xem breakdown theo `screen_name`

### 3. BigQuery (nếu đã enable)

```sql
SELECT
  event_name,
  user_pseudo_id,
  event_timestamp,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'screen_name') as screen_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'screen_class') as screen_class
FROM `truesight-cloud-apps.analytics_XXXXXX.events_*`
WHERE event_name = 'screen_view'
  AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
  AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
ORDER BY event_timestamp DESC
LIMIT 100
```

## Troubleshooting

### Vấn đề: Không thấy events trong Firebase Console

**Giải pháp:**

1. Kiểm tra Firebase có được khởi tạo:

   ```dart
   await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
   ```

2. Kiểm tra Analytics collection đã enable:

   ```dart
   await FirebaseAnalytics.instance.setAnalyticsCollectionEnabled(true);
   ```

   ✅ Code đã tự động enable trong `GA4AnalyticsObserver._initialize()`

3. Kiểm tra logs trong console:
   - ✅ `[GA4] Analytics collection enabled`
   - ⚠️ Nếu thấy error, xem chi tiết lỗi

### Vấn đề: Events bị delay

**Lý do:**

- Firebase Analytics gửi events theo batch (không realtime)
- Debug view: realtime
- Events view: delay 24-48h

**Giải pháp:**

- Dùng DebugView để test realtime
- Đợi 24-48h để xem data trong Events

### Vấn đề: Thiếu screen_view events

**Kiểm tra:**

1. Route có path name không?

   ```dart
   GoRoute(
     path: '/some/path', // ✅ Có path
     builder: ...
   )
   ```

2. Route có bị skip không?

   ```dart
   if (name == '/') return null; // ❌ Root route bị skip
   ```

3. Check logs:
   ```
   📊 [GA4] Screen view logged: /some/path
   ```

## Tùy chỉnh

### Tắt verbose logging trong production

```dart
// In create_router_config.dart
final routerObservers = observers ?? [
  SupaRouterObserver(),
  GA4AnalyticsObserver(
    verboseLogging: kDebugMode, // Chỉ log trong debug mode
  ),
];
```

### Thêm custom parameters

Nếu cần thêm parameters cho screen_view:

```dart
Future<void> _sendScreenView(Route<dynamic> route) async {
  // ... existing code ...

  await _analytics.logEvent(
    name: 'screen_view',
    parameters: {
      'screen_name': screenName,
      'screen_class': 'FlutterPage',
      'firebase_screen': screenName,
      'firebase_screen_class': 'FlutterPage',
      // Add custom params here
      'app_version': packageInfo.version,
      'build_number': packageInfo.buildNumber,
    },
  );
}
```

## Thống kê hiện tại

- ✅ **204+ routes** đã được config
- ✅ **Tất cả routes tự động tracked** via NavigatorObserver
- ✅ **Analytics collection enabled** mặc định
- ✅ **Debug logs** để verify
- ✅ **Error handling** khi log fail

## Links tham khảo

- [Firebase Analytics Events](https://firebase.google.com/docs/analytics/events)
- [Debug View](https://firebase.google.com/docs/analytics/debugview)
- [Screen View Event](https://firebase.google.com/docs/analytics/screenviews)
