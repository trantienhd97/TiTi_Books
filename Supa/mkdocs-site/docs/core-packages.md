# Core Packages: supa_architecture và supa_foundation

## 1. Tổng quan

Dự án SupaMobileApp sử dụng 2 core packages quan trọng:
- **`supa_architecture`**: Thư viện core chứa các class và object cơ bản cho tất cả Flutter apps thuộc hệ sinh thái Supa
- **`supa_foundation`**: Package chứa các pages, utilities và widgets dùng chung cho tất cả sub-apps

## 2. supa_architecture

### 2.1. Mục đích

`supa_architecture` là thư viện core cung cấp:
- Các loại storage (persistent, cookie, secure)
- API client với repository pattern
- Models dùng chung
- Widgets dùng chung
- JSON serialization system tối ưu
- Data filter system

### 2.2. Storage Systems

#### 2.2.1. PersistentStorage

**Mục đích**: Lưu trữ dữ liệu không nhạy cảm (key-value pairs)

**Cách sử dụng:**
```dart
import 'package:supa_architecture/supa_architecture.dart';

// Lưu giá trị
persistentStorage.setValue('key', 'value');

// Lấy giá trị
final value = persistentStorage.getValue('key');

// Xóa giá trị
persistentStorage.removeValue('key');

// Xóa tất cả
persistentStorage.clear();

// Base API URL
persistentStorage.baseApiUrl = 'https://api.example.com';

// Tenant và AppUser
persistentStorage.tenant = currentTenant;
persistentStorage.appUser = appUser;
```

**Lưu trữ:**
- **Web**: LocalStorage
- **Mobile**: SharedPreferences (Android) / UserDefaults (iOS)

#### 2.2.2. SecureStorage

**Mục đích**: Lưu trữ dữ liệu nhạy cảm (tokens, credentials)

**Cách sử dụng:**
```dart
import 'package:supa_architecture/supa_architecture.dart';

// Lưu authentication info
await secureStorage.saveAuthenticationInfo(
  SecureAuthenticationInfo(
    refreshToken: 'refresh_token',
    accessToken: 'access_token',
    tenantId: 123,
  ),
);

// Lấy authentication info
final authInfo = await secureStorage.getSavedAuthenticationInfo();

// Xóa authentication info
await secureStorage.deleteAuthenticationInfo();
```

**Lưu trữ:**
- Sử dụng `flutter_secure_storage` package
- Encrypted storage trên cả web và mobile

#### 2.2.3. CookieManager

**Mục đích**: Quản lý cookies cho HTTP requests

**Cách sử dụng:**
```dart
import 'package:supa_architecture/supa_architecture.dart';

// Lấy interceptor để thêm vào Dio
final interceptor = cookieManager.interceptor;

// Load cookies cho URI
final cookies = cookieManager.loadCookies(uri);

// Lấy single cookie
final cookie = cookieManager.getSingleCookie(uri, 'cookieName');

// Lưu cookies
cookieManager.saveCookies(uri, cookies);

// Xóa cookies
cookieManager.deleteCookies(uri);
cookieManager.deleteAllCookies();

// Build URL với token (mobile only)
final urlWithToken = cookieManager.buildUrlWithToken('https://api.example.com');
```

**Platform behavior:**
- **Web**: Sử dụng browser cookie handling
- **Mobile**: Custom cookie management với token-in-URL support

### 2.3. ApiClient

#### 2.3.1. Định nghĩa

`ApiClient` là abstract class extends từ Dio, cung cấp:
- Repository pattern
- Sẵn có các interceptors quan trọng
- File upload/download support
- Cross-platform compatibility

#### 2.3.2. Cách sử dụng

**Tạo Repository:**
```dart
import 'package:supa_architecture/supa_architecture.dart';

class MyRepository extends ApiClient {
  @override
  String get baseUrl => '${persistentStorage.baseApiUrl}/rpc/my-app';

  // Custom methods
  Future<List<MyEntity>> getMyData() async {
    return dio.post('/get-data', data: {}).then(
      (response) => response.bodyAsList<MyEntity>(),
    );
  }
}
```

**Với BaseRepository (CRUD operations):**
```dart
class MyEntityRepository extends BaseRepository<MyEntity, MyEntityFilter> {
  @override
  String get baseUrl => '${persistentStorage.baseApiUrl}/rpc/my-app/entity';

  // BaseRepository cung cấp sẵn:
  // - list(filter)
  // - count(filter)
  // - getById(id)
  // - create(entity)
  // - update(entity)
  // - deleteByEntity(entity)
  // - deleteById(id)
  // - approve(entity)
  // - reject(entity)
}
```

#### 2.3.3. Interceptors

ApiClient tự động thêm các interceptors:

1. **DeviceInfoInterceptor** (nếu `shouldUseDeviceInfo: true`)
   - Thêm device information vào headers

2. **LanguageInterceptor** (mặc định: enabled)
   - Thêm language header từ user preferences

3. **Cookie Storage Interceptor** (native platforms)
   - Tự động quản lý cookies

4. **Base URL Interceptor** (nếu `shouldUsePersistentUrl: true`)
   - Dynamic base URL switching

5. **TimezoneInterceptor** (luôn enabled)
   - Thêm timezone và timestamp headers

6. **GeneralErrorLogInterceptor** (luôn enabled)
   - Log errors cho debugging

7. **RefreshInterceptor** (luôn enabled)
   - Tự động refresh token khi nhận 401

#### 2.3.4. File Upload/Download

**Upload single file:**
```dart
// Native: sử dụng filePath
final file = await repository.uploadFile(
  filePath: '/path/to/file.jpg',
  uploadUrl: '/upload',
);

// Web: sử dụng bytes
final file = await repository.uploadFile(
  bytes: fileBytes,
  filename: 'file.jpg',
  uploadUrl: '/upload',
);
```

**Upload multiple files:**
```dart
// Native
final files = await repository.uploadFiles(
  filePaths: ['/path/to/file1.jpg', '/path/to/file2.jpg'],
);

// Web
final files = await repository.uploadFiles(
  filesBytes: [bytes1, bytes2],
  filenames: ['file1.jpg', 'file2.jpg'],
);
```

**Download:**
```dart
// Download as bytes
final bytes = await repository.downloadBytes('/files/document.pdf');

// Download to file
final file = await repository.downloadFile(
  url: '/files/document.pdf',
  savePath: '/Downloads',
  filename: 'document.pdf',
);
```

### 2.4. Models dùng chung

#### 2.4.1. AppUser

Model đại diện cho user trong hệ thống:

```dart
class AppUser extends JsonModel {
  JsonInteger id = JsonInteger("id");
  JsonString email = JsonString("email");
  JsonString username = JsonString("username");
  JsonString displayName = JsonString("displayName");
  JsonString name = JsonString("name");
  JsonString phone = JsonString("phone");
  JsonString avatar = JsonString("avatar");
  // ... các fields khác
}
```

#### 2.4.2. Tenant

Model đại diện cho tenant (organization):

```dart
class Tenant extends JsonModel {
  JsonInteger id = JsonInteger("id");
  JsonString name = JsonString("name");
  JsonString code = JsonString("code");
  // ...
}
```

#### 2.4.3. CurrentTenant

Model chứa thông tin tenant hiện tại:

```dart
class CurrentTenant extends JsonModel {
  JsonObject<Tenant> tenant = JsonObject<Tenant>("tenant");
  JsonInteger tenantId = JsonInteger("tenantId");
  // ...
}
```

#### 2.4.4. Các models khác

- `AppUserGroup`: User groups
- `File`: File metadata
- `Image`: Image metadata
- `Discussion`: Discussion/comment
- `UserNotification`: Push notification
- `EnumModel`: Base class cho enum models
- Và nhiều models khác...

### 2.5. JSON Model và Data Filter

#### 2.5.1. JsonModel

**Mục đích**: 
- Chuẩn hóa JSON serialization
- Tối ưu code generation
- Giảm thiểu code generation làm pollute source code
- Hỗ trợ error/warning/information messages từ server

**Cách sử dụng:**
```dart
import 'package:supa_architecture/supa_architecture.dart';

class MyModel extends JsonModel {
  @override
  List<JsonField> get fields => [
    name,
    age,
    email,
  ];

  JsonString name = JsonString('name');
  JsonInteger age = JsonInteger('age');
  JsonString email = JsonString('email');
}

// Sử dụng
final model = MyModel();
model.fromJson({
  'name': 'John Doe',
  'age': 30,
  'email': 'john@example.com',
});

// Access values
print(model.name.value); // 'John Doe'
print(model['name']); // 'John Doe' (bracket notation)

// Serialize
final json = model.toJson();
```

**JsonField Types:**
- `JsonString`: String fields
- `JsonInteger`: Integer fields
- `JsonNumber`: Number fields (int/double)
- `JsonDouble`: Double fields
- `JsonBoolean`: Boolean fields
- `JsonDate`: DateTime fields
- `JsonObject<T>`: Nested objects
- `JsonList<T>`: Lists

**Error/Warning/Information:**
```dart
// Từ server response
model.fromJson({
  'name': 'John',
  'errors': {'email': 'Invalid email'},
  'warnings': {'age': 'Age seems unusual'},
  'generalErrors': ['Account verification required'],
});

// Kiểm tra errors
if (model.name.hasError) {
  print(model.name.error);
}

if (model.hasError) {
  print(model.error); // First general error
}
```

#### 2.5.2. DataFilter

**Mục đích**:
- Chuẩn hóa filter structure cho API calls
- Hỗ trợ pagination, sorting, search
- Type-safe filter fields

**Cách sử dụng:**
```dart
import 'package:supa_architecture/supa_architecture.dart';

class MyEntityFilter extends DataFilter {
  @override
  List<FilterField> get fields => [
    nameFilter,
    statusFilter,
  ];

  StringFilter nameFilter = StringFilter('name');
  IntFilter statusFilter = IntFilter('statusId');
}

// Sử dụng
final filter = MyEntityFilter()
  ..skip = 0
  ..take = 20
  ..orderBy = 'name'
  ..orderType = DataFilter.orderAsc
  ..search = 'John'
  ..nameFilter.contain = 'Doe'
  ..statusFilter.equal = 1;

// Serialize
final json = filter.toJson();
```

**FilterField Types:**
- `StringFilter`: String operations (equal, contain, startWith, etc.)
- `IntFilter`: Integer operations (equal, greater, less, inList, etc.)
- `DoubleFilter`: Double operations
- `IdFilter`: ID operations
- `DateFilter`: Date operations
- `EnumModelFilter`: Enum model operations

**Operations:**
- `equal`, `notEqual`
- `greater`, `greaterEqual`, `less`, `lessEqual`
- `contain`, `notContain`
- `startWith`, `notStartWith`
- `endWith`, `notEndWith`
- `inList`, `notInList`
- `search`

### 2.6. DioImageProvider

**Mục đích**: Custom ImageProvider sử dụng Dio và Supa token để load private images

**Cách sử dụng:**
```dart
import 'package:supa_architecture/supa_architecture.dart';
import 'package:flutter/material.dart';

Image(
  image: DioImageProvider(
    imageUrl: Uri.parse('https://api.example.com/private/image.jpg'),
    fallbackAssetPath: 'assets/images/image_placeholder.png',
  ),
)
```

**Features:**
- Tự động thêm Supa token vào request
- Fallback to asset image nếu load fail
- Sử dụng Dio interceptors (device info, timezone, refresh token)
- Cookie support (native platforms)

### 2.7. Widgets dùng chung

#### 2.7.1. StatusBadge

**TextStatusBadge**: Badge hiển thị status text với màu tự động

```dart
import 'package:supa_architecture/supa_architecture.dart';

TextStatusBadge(
  status: 'Active',
  backgroundColorKey: 'success', // Theme token
  textColorKey: 'onSuccess',
)

// Hoặc với hex colors
TextStatusBadge(
  status: 'Pending',
  backgroundColorKey: '#FFA500',
)
```

**EnumStatusBadge**: Badge từ EnumModel

```dart
EnumStatusBadge(
  status: statusEnumModel, // EnumModel với color và backgroundColor
)
```

#### 2.7.2. ConfirmationDialog

Dialog xác nhận với icon, title, content:

```dart
import 'package:supa_architecture/supa_architecture.dart';

showDialog(
  context: context,
  builder: (context) => ConfirmationDialog(
    title: 'Delete Item',
    content: 'Are you sure you want to delete this item?',
    onConfirm: () {
      // Handle confirmation
    },
    onCancel: () {
      // Handle cancellation (optional)
    },
    okText: 'Delete', // Optional
    cancelText: 'Cancel', // Optional
  ),
)
```

#### 2.7.3. Các widgets khác

- `EmptyComponent`: Empty state widget
- `ForbiddenComponent`: 403 Forbidden widget
- `LoadingIndicator`: Loading indicator
- `AppImage`: Network image với error handling
- Và nhiều widgets khác...

## 3. supa_foundation

### 3.1. Mục đích

`supa_foundation` cung cấp:
- Các pages quan trọng dùng chung
- Utilities và services
- Widgets templates
- Router configuration
- Theme và localization setup

### 3.2. AppLoader

**Mục đích**: Bootstrap app với initialization sequence chuẩn

**Cách sử dụng:**
```dart
import 'package:supa_foundation/app_loader.dart';

final loader = AppLoader(
  configureDependencies: configureDependencies,
  firebaseOptionsProvider: () => DefaultFirebaseOptions.currentPlatform,
);

await loader.bootstrap();
```

**Loader làm gì:**
1. Initialize Flutter binding
2. Set URL strategy (web)
3. Load environment variables (.env)
4. Initialize Hive
5. Clear temp directory
6. Initialize Firebase (nếu có)
7. Initialize SupaArchitecturePlatform
8. Configure dependencies (GetIt)
9. Initialize ErrorHandlingBloc
10. Load saved theme
11. Register LoginApp
12. Configure Azure AD (nếu enabled)
13. Handle authentication initialization

### 3.3. SupaApp

**Mục đích**: Main app widget với theme, localization, và BLoC providers

**Cách sử dụng:**
```dart
import 'package:supa_foundation/supa_app.dart';

runApp(
  SupaApp(
    routerConfig: createRouterConfig(
      homePage: HomePage.location,
      errorBuilder: (context, state) => const PageNotFound(),
    ),
  ),
);
```

**Features:**
- Theme management (light/dark)
- Localization (4 languages: vi, en, ko, id)
- BLoC providers (Authentication, Tenant, PushNotification, ErrorHandling)
- Toastification wrapper
- System UI overlay style

### 3.4. Router Configuration

#### 3.4.1. createRouterConfig

Tạo router config với authentication awareness:

```dart
import 'package:supa_foundation/router/create_router_config.dart';

final routerConfig = createRouterConfig(
  homePage: HomePage.location,
  specificRoutes: adminRoutes, // Optional
  errorBuilder: (context, state) => const PageNotFound(),
);
```

**Features:**
- Tự động redirect dựa trên authentication state
- Map routes từ AppRegistry
- Error handling với logging
- Router observers

#### 3.4.2. AppRegistry

Quản lý đăng ký sub-apps:

```dart
import 'package:supa_foundation/router/app_registry.dart';

// Đăng ký app
AppRegistry.registerApp('/work', WorkApp());

// Lấy app theo prefix
final app = AppRegistry.getAppByPrefix('/work/some-page');

// Lấy tất cả routes
final routes = AppRegistry.getAllRoutes();
```

### 3.5. Pages quan trọng

#### 3.5.1. Login Pages

Trong `packages/supa_foundation/lib/modules/login/pages/`:
- `LoginPage`: Trang đăng nhập chính
- `LoginServerPage`: Chọn server
- `LoginTenantList`: Chọn tenant
- `PasswordForgotPage`: Quên mật khẩu
- `PasswordResetPage`: Reset mật khẩu

#### 3.5.2. Common Pages

Trong `packages/supa_foundation/lib/widgets/pages/`:
- `TenantSelectionPage`: Chọn tenant
- `ThemeSelectionPage`: Chọn theme
- `AppSettingsPage`: Settings page
- `AppInformationPage`: App info page
- `OtherUserProfilePage`: User profile page
- `FilePreviewPage`: Preview files
- `MediaGalleryScreen`: Media gallery
- `ImageEditorScreen`: Image editor
- `CameraCapturePage`: Camera capture
- Và nhiều pages khác...

### 3.6. Widget Templates

#### 3.6.1. ScaffoldNavbar

Bottom navigation bar template (đã được mô tả trong sub-app development)

#### 3.6.2. PageDefault

Template page với AppBar và body:

```dart
import 'package:supa_foundation/widgets/templates/page_default.dart';

PageDefault(
  title: 'My Page',
  body: MyContent(),
  actions: [
    IconButton(icon: Icon(Icons.add), onPressed: () {}),
  ],
  onGoBack: () {
    // Custom back handler
  },
)
```

#### 3.6.3. LanguageAwareNavbar

Wrapper để rebuild navbar khi language thay đổi:

```dart
import 'package:supa_foundation/widgets/templates/language_aware_navbar.dart';

LanguageAwareNavbar(
  child: MyNavbar(child: child),
)
```

#### 3.6.4. AppThemeWrapper

Wrapper để apply theme cho sub-app:

```dart
import 'package:supa_foundation/widgets/templates/app_theme_wrapper.dart';

AppThemeWrapper(
  appConfig: subApp,
  child: MyPage(),
)
```

#### 3.6.5. PushNotificationWrapper

Wrapper để handle push notifications:

```dart
import 'package:supa_foundation/widgets/templates/push_notification_wrapper.dart';

PushNotificationWrapper(
  onNotificationTap: (notification) {
    // Handle notification tap
  },
  child: MyApp(),
)
```

### 3.7. Services

#### 3.7.1. ThemeService

Quản lý theme (light/dark mode):

```dart
import 'package:supa_foundation/services/theme_service.dart';

// Load saved theme
await ThemeService.loadSavedTheme();

// Change theme
ThemeService().changeTheme(ThemeMode.dark);

// Listen to theme changes
ThemeService.listenable.addListener(() {
  // Theme changed
});
```

#### 3.7.2. MediaService

Quản lý media (images, videos, files):

```dart
import 'package:supa_foundation/services/media_service.dart';

final mediaService = getIt.get<MediaService>();

// Pick image
final image = await mediaService.pickImage();

// Pick multiple images
final images = await mediaService.pickImages();

// Capture photo
final photo = await mediaService.capturePhoto();
```

#### 3.7.3. GeoLocationService

Quản lý location:

```dart
import 'package:supa_foundation/services/geolocation_service.dart';

final geoService = getIt.get<GeoLocationService>();

// Request permission
final hasPermission = await geoService.requestLocationPermission();

// Get current position
final position = await geoService.getCurrentPosition();

// Calculate distance
final distance = geoService.calculateDistance(point1, point2);
```

#### 3.7.4. BadgeService

Quản lý app badge count:

```dart
import 'package:supa_foundation/services/badge_service.dart';

final badgeService = getIt.get<BadgeService>();

// Update badge count
await badgeService.updateBadgeCount();
```

### 3.8. Utilities

#### 3.8.1. Error Handler

Xử lý errors một cách tập trung:

```dart
import 'package:supa_foundation/utils/error_handler.dart';

// Handle error
ErrorHandler.handleError(context, error);
```

#### 3.8.2. File Utils

Utilities cho file operations:

```dart
import 'package:supa_foundation/utils/file_utils.dart';

// Get file extension
final ext = FileUtils.getExtension('file.pdf');

// Format file size
final size = FileUtils.formatFileSize(1024);
```

#### 3.8.3. Number Format Utils

Format numbers:

```dart
import 'package:supa_foundation/utils/number_format_utils.dart';

// Format currency
final formatted = NumberFormatUtils.formatCurrency(1000000);

// Format number
final formatted = NumberFormatUtils.formatNumber(1234.56);
```

#### 3.8.4. Time Format Utils

Format time:

```dart
import 'package:supa_foundation/utils/time_format_utils.dart';

// Format duration
final formatted = TimeFormatUtils.formatDuration(Duration(minutes: 90));
```

#### 3.8.5. Color Utils

Utilities cho colors:

```dart
import 'package:supa_foundation/utils/color_utils.dart';

// Parse hex color
final color = ColorUtils.fromHex('#FF0000');
```

### 3.9. Widgets

#### 3.9.1. Atoms

Các atomic components:
- `AppFilledButton`: Filled button
- `Input`: Text input field
- `AppNetworkImage`: Network image với error handling
- `AppBadge`: Badge widget
- `MoneyText`: Money display
- Và nhiều components khác...

#### 3.9.2. Molecules

Composite components:
- `AppBarSearchField`: Search field trong AppBar
- `AppUserAvatar`: User avatar
- `ProfileButton`: Profile button
- `SettingTile`: Setting tile
- Và nhiều components khác...

#### 3.9.3. Organisms

Complex components:
- `GenericFilterWidget`: Generic filter widget
- `DateFilterBottomSheet`: Date filter bottom sheet
- `MultiSelectionModal`: Multi-selection modal
- `SelectionSearchModal`: Selection với search
- `MediaViewWidget`: Media viewer
- Và nhiều components khác...

#### 3.9.4. Comment System

Widgets cho comment/discussion system:
- `CommentInputWidget`: Input cho comments
- `CommentsListWidget`: List comments
- `ChatMessageItem`: Chat message item
- `EmojiReactionPicker`: Emoji picker
- Và nhiều components khác...

### 3.10. Repositories

#### 3.10.1. MobilePortalRepository

Repository cho portal operations:

```dart
import 'package:supa_foundation/repositories/mobile_portal_repository.dart';

final repo = getIt.get<MobilePortalRepository>();

// Get app version
final version = await repo.getAppVersion();
```

#### 3.10.2. MobileCommentRepository

Repository cho comments:

```dart
import 'package:supa_foundation/repositories/mobile_comment_repository.dart';

final repo = getIt.get<MobileCommentRepository>();

// Get comments
final comments = await repo.getComments(discussionId);
```

#### 3.10.3. UtilsDiscussionRepository

Repository cho discussion utilities:

```dart
import 'package:supa_foundation/repositories/utils_discussion_repository.dart';

final repo = getIt.get<UtilsDiscussionRepository>();

// Get discussions
final discussions = await repo.getDiscussions(filter);
```

### 3.11. Config

#### 3.11.1. AppSubSystem

Enum định nghĩa các subsystems:

```dart
import 'package:supa_foundation/config/sub_system.dart';

enum AppSubSystem {
  work(id: 5, code: 'WORK'),
  project(id: 8, code: 'PROJECT'),
  training(id: 7, code: 'TRAINING'),
  // ...
}
```

#### 3.11.2. Navigation Key

Global navigation key:

```dart
import 'package:supa_foundation/config/navigation_key.dart';

// Sử dụng trong code
final navigator = supaNavigationKey.currentState;
```

## 4. So sánh và Phân biệt

### 4.1. supa_architecture vs supa_foundation

| Aspect         | supa_architecture                               | supa_foundation                            |
| -------------- | ----------------------------------------------- | ------------------------------------------ |
| **Mục đích**   | Core library cho tất cả Supa apps               | Shared components cho SupaMobileApp        |
| **Scope**      | Rộng hơn (có thể dùng cho apps khác)            | Cụ thể cho SupaMobileApp                   |
| **Storage**    | PersistentStorage, SecureStorage, CookieManager | Sử dụng storage từ supa_architecture       |
| **API Client** | ApiClient, BaseRepository                       | Sử dụng ApiClient từ supa_architecture     |
| **Models**     | AppUser, Tenant, File, etc.                     | Sử dụng models từ supa_architecture        |
| **Widgets**    | Basic widgets (StatusBadge, ConfirmationDialog) | Complex widgets (Pages, Templates)         |
| **Pages**      | Không có                                        | Login pages, Common pages                  |
| **Services**   | Basic services                                  | App-specific services (Theme, Media, etc.) |

### 4.2. Khi nào dùng gì?

**Dùng supa_architecture khi:**
- Cần storage (persistent, secure, cookie)
- Cần tạo repository mới
- Cần tạo model mới (extend JsonModel)
- Cần tạo filter mới (extend DataFilter)
- Cần basic widgets (StatusBadge, ConfirmationDialog)
- Cần load private images (DioImageProvider)

**Dùng supa_foundation khi:**
- Cần pages dùng chung (Login, Settings, etc.)
- Cần widgets templates (PageDefault, ScaffoldNavbar)
- Cần services (Theme, Media, GeoLocation)
- Cần utilities (ErrorHandler, FileUtils, etc.)
- Cần router configuration
- Cần AppLoader để bootstrap

## 5. Best Practices

### 5.1. Storage

- **PersistentStorage**: Dùng cho data không nhạy cảm (preferences, settings)
- **SecureStorage**: Dùng cho tokens, credentials, sensitive data
- **CookieManager**: Tự động được sử dụng bởi ApiClient, không cần gọi trực tiếp

### 5.2. Models

- **Luôn extend JsonModel**: Không tạo model từ scratch
- **Sử dụng JsonField types**: Sử dụng JsonString, JsonInteger, etc.
- **Handle errors**: Kiểm tra `hasError`, `hasWarning` sau khi deserialize

### 5.3. Filters

- **Extend DataFilter**: Không tạo filter từ scratch
- **Sử dụng FilterField types**: StringFilter, IntFilter, etc.
- **Pagination**: Sử dụng `skip`, `take`, `nextPage()`

### 5.4. Repositories

- **Extend BaseRepository**: Nếu cần CRUD operations
- **Extend ApiClient**: Nếu cần custom operations
- **Sử dụng interceptors**: ApiClient tự động thêm interceptors cần thiết

### 5.5. Widgets

- **Sử dụng widgets từ supa_architecture**: Cho basic components
- **Sử dụng widgets từ supa_foundation**: Cho complex components và templates
- **Tái sử dụng**: Không tạo lại widgets đã có

## 6. Tóm tắt

1. **supa_architecture**: Core library với storage, API client, models, JSON system, basic widgets
2. **supa_foundation**: Shared package với pages, services, utilities, templates cho SupaMobileApp
3. **Storage**: PersistentStorage (non-sensitive), SecureStorage (sensitive), CookieManager (HTTP)
4. **ApiClient**: Repository pattern với interceptors tự động
5. **JsonModel**: JSON serialization system tối ưu với error handling
6. **DataFilter**: Filter system chuẩn hóa cho API calls
7. **DioImageProvider**: Load private images với Supa token
8. **Widgets**: StatusBadge, ConfirmationDialog từ supa_architecture; Templates từ supa_foundation

---

**Lưu ý quan trọng:**
- supa_architecture là core library, có thể dùng cho apps khác
- supa_foundation là app-specific, chỉ dùng trong SupaMobileApp
- Luôn sử dụng JsonModel và DataFilter thay vì json_serializable trực tiếp
- ApiClient tự động handle interceptors, không cần config thủ công
- Sử dụng widgets và services từ foundation thay vì tạo mới
