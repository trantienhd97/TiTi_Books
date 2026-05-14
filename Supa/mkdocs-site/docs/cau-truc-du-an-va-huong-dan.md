# Cấu trúc dự án và hướng dẫn phát triển

## 1. Cấu trúc chung của dự án

### 1.1. Tổng quan

SupaMobileApp là một **super app** được xây dựng bằng Flutter, cho phép tích hợp nhiều module (sub-app) độc lập vào một ứng dụng duy nhất. Mỗi sub-app có thể hoạt động độc lập hoặc được tích hợp vào app chính.

### 1.2. Cấu trúc thư mục

```
SupaMobileApp/
├── lib/                          # Main app code
│   ├── main.dart                # Entry point chính của app
│   ├── main_<sub_app>.dart      # Entry point riêng cho từng sub-app
│   ├── config/                  # Cấu hình chung
│   ├── modules/                 # Modules của main app
│   └── router/                  # Router chính
│
├── packages/                    # Các sub-packages (sub-apps)
│   ├── supa_architecture/       # Core architecture package
│   ├── supa_foundation/         # Foundation package (shared)
│   ├── supa_work/               # Work sub-app
│   ├── supa_project/            # Project sub-app
│   ├── supa_attendance/         # Attendance sub-app
│   ├── supa_spend/              # Spend sub-app
│   ├── supa_training/           # Training sub-app
│   ├── supa_serving/            # Serving sub-app
│   ├── supa_bibs/               # BIBS sub-app
│   ├── supa_chat/               # Chat sub-app
│   ├── supa_discussion/         # Discussion package (shared)
│   ├── supa_notification/       # Notification package (shared)
│   └── supa_admin/              # Admin sub-app
│
├── assets/                      # Assets chung (images, fonts, i18n)
├── scripts/                     # Utility scripts
│   └── switch_sub_app.sh       # Script chuyển đổi sub-app
├── .vscode/                     # VSCode configuration
│   └── launch.json              # Debug configurations
└── docs/                        # Tài liệu
```

### 1.3. Main Project vs Sub-Packages

**Main Project (`lib/`):**
- Chứa code chính của ứng dụng
- Quản lý việc đăng ký và điều hướng giữa các sub-apps
- Xử lý authentication, routing chính
- Cung cấp dashboard và các tính năng chung

**Sub-Packages (`packages/`):**
- Mỗi package là một sub-app độc lập
- Có cấu trúc riêng: `lib/`, `pubspec.yaml`
- Implement interface `SubApp` từ `supa_architecture`
- Có thể chạy độc lập hoặc tích hợp vào main app

**Shared Packages:**
- `supa_architecture`: Core architecture, models, utilities
- `supa_foundation`: Shared widgets, services, themes
- `supa_notification`: Notification handling
- `supa_discussion`: Discussion features

### 1.4. Cấu trúc Main Application (`lib/`)

Thư mục `lib/` chứa code chính của ứng dụng, được tổ chức thành các thư mục con:

- **`config/`**: Chứa các file cấu hình, bao gồm dependency injection setup (`get_it.dart`)
- **`modules/`**: Chứa các module logic nghiệp vụ chính, như `admin`, `discussion`, `general`, và `notifications`
- **`router/`**: Xử lý navigation và routing cho main application
- **`theme/`**: Định nghĩa theme và styling của ứng dụng

### 1.5. Dependency Graph giữa các Packages

#### 1.5.1. Foundation Package (Core)

`supa_foundation` là package cơ sở, không có internal dependencies. Package này chứa:
- Shared utilities
- UI components
- Firebase integration
- Media handling
- Authentication

#### 1.5.2. Packages phụ thuộc vào Foundation

Tất cả các packages khác đều phụ thuộc vào `supa_foundation`:
- `supa_training` → `supa_foundation`
- `supa_attendance` → `supa_foundation`
- `supa_serving` → `supa_foundation`
- `supa_spend` → `supa_foundation`
- `supa_work` → `supa_foundation`
- `supa_project` → `supa_foundation`
- `supa_bibs` → `supa_foundation`
- `supa_chat` → `supa_foundation`

#### 1.5.3. Cross-Package Dependencies

Một số packages có dependencies trên các feature packages khác:

1. **supa_training:**
   - Depends on: `supa_foundation`, `supa_work`, `supa_project`

2. **supa_attendance:**
   - Depends on: `supa_foundation`, `supa_work`, `supa_training`

3. **supa_work:**
   - Depends on: `supa_foundation`, `supa_project`, `supa_spend`

4. **supa_project:**
   - Depends on: `supa_foundation`, `supa_work`, `supa_attendance`

#### 1.5.4. Dependency Graph Visualization

```
supa_foundation (Base)
├── supa_training
│   ├── depends on: supa_work
│   └── depends on: supa_project
├── supa_attendance
│   ├── depends on: supa_work
│   └── depends on: supa_training
├── supa_serving
├── supa_spend
├── supa_work
│   ├── depends on: supa_project
│   └── depends on: supa_spend
├── supa_project
│   ├── depends on: supa_work
│   └── depends on: supa_attendance
└── supa_bibs
```

#### 1.5.5. Circular Dependencies (Cảnh báo)

**⚠️ CẢNH BÁO:** Có circular dependencies được phát hiện trong codebase:

1. **supa_work ↔ supa_project** (bidirectional)
   - `supa_work` depends on `supa_project`
   - `supa_project` depends on `supa_work`

2. **supa_attendance → supa_training → supa_project → supa_attendance**
   - Tạo thành một vòng phụ thuộc gián tiếp

**Khuyến nghị:**
- Circular dependencies nên được giải quyết để cải thiện khả năng bảo trì và ổn định của codebase
- Nên tách các phần chung ra thành shared packages hoặc refactor để loại bỏ circular dependencies

#### 1.5.6. Khuyến nghị về Dependencies

Nhiều sub-modules có danh sách dependencies lớn và trùng lặp. Để giảm duplication và đơn giản hóa việc bảo trì, nên:
- Consolidate các dependencies chung vào `supa_foundation` package
- Đảm bảo tất cả modules sử dụng cùng version của dependencies
- Dễ dàng quản lý updates trong tương lai

### 1.6. Navigation và Routing Structure

#### 1.6.1. Router Configuration

Dự án sử dụng package `go_router` cho navigation. Cấu hình routing chính được tạo trong hàm `createRouterConfig` tại `packages/supa_foundation/lib/router/create_router_config.dart`.

Hàm `createRouterConfig` tạo một instance `GoRouter` với các tính năng:

- **Error Handling**: Bao gồm error builder để log lỗi 404 "Page Not Found", hữu ích cho debugging
- **Initial Location**: Vị trí ban đầu được set là `/`
- **Authentication-based Redirection**: Redirect user dựa trên authentication status
  - Nếu user **đã authenticated**, redirect đến `homePage` được cung cấp cho `createRouterConfig`
  - Nếu user **chưa authenticated**, redirect đến `LoginPage`
- **Route Observers**: Sử dụng `SupaRouterObserver` để track navigation events

#### 1.6.2. Route Types

Router được cấu hình với 3 loại routes:

1. **Specific Routes**: Routes cụ thể cho một sub-app. Được truyền vào `createRouterConfig` như parameter `specificRoutes`
2. **Common Routes**: Routes chung cho tất cả sub-apps. Được định nghĩa trong file `common_routes.dart`
3. **App Registry Routes**: Routes có thể được đăng ký trong `AppRegistry`. Cung cấp cách quản lý routes tập trung từ các phần khác nhau của ứng dụng

#### 1.6.3. Common Routes

Các routes sau đây có sẵn trong tất cả sub-apps:

| Path                | Page                  | Description                                |
| ------------------- | --------------------- | ------------------------------------------ |
| `/app-settings`     | `AppSettingsPage`     | Trang cài đặt ứng dụng                     |
| `/app-information`  | `AppInformationPage`  | Trang thông tin ứng dụng                   |
| `/change-password`  | `ChangePasswordPage`  | Trang đổi mật khẩu                         |
| `/tenant-selection` | `TenantSelectionPage` | Trang chọn tenant                          |
| `/file-preview`     | `FilePreviewPage`     | Trang preview file                         |

## 2. Cách chạy app chính và các sub-app

### 2.1. Chạy app chính

**Cách 1: Sử dụng terminal**
```bash
flutter run -t lib/main.dart
```

**Cách 2: Sử dụng VSCode Run & Debug**

1. Mở VSCode
2. Nhấn `F5` hoặc vào menu **Run and Debug** (Ctrl+Shift+D / Cmd+Shift+D)
3. Chọn configuration **"supa_main"** từ dropdown
4. Nhấn nút **Start Debugging** (▶️)

Hoặc sử dụng Command Palette:
- `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux)
- Gõ "Debug: Start Debugging"
- Chọn "supa_main"

### 2.2. Chạy các sub-app độc lập

Mỗi sub-app có một file `main_<sub_app>.dart` riêng trong thư mục `lib/`:

**Các sub-app có sẵn:**
- `lib/main_work.dart` - Work app
- `lib/main_project.dart` - Project app
- `lib/main_attendance.dart` - Attendance app
- `lib/main_spend.dart` - Spend app
- `lib/main_training.dart` - Training app
- `lib/main_serving.dart` - Serving app
- `lib/main_bibs.dart` - BIBS app
- `lib/main_chat.dart` - Chat app

**Cách chạy:**

**Terminal:**
```bash
# Ví dụ: Chạy Work app
flutter run -t lib/main_work.dart

# Ví dụ: Chạy Project app
flutter run -t lib/main_project.dart
```

**VSCode Run & Debug:**

1. Mở VSCode
2. Vào **Run and Debug** (Ctrl+Shift+D / Cmd+Shift+D)
3. Chọn configuration tương ứng:
   - `supa_work` - cho Work app
   - `supa_project` - cho Project app
   - `supa_attendance` - cho Attendance app
   - `supa_spend` - cho Spend app
   - `supa_training` - cho Training app
   - `supa_serving` - cho Serving app
   - `supa_bibs` - cho BIBS app
   - `supa_chat` - cho Chat app
4. Nhấn **Start Debugging** (▶️)

### 2.3. Cấu hình Debug trong VSCode

File `.vscode/launch.json` chứa tất cả các debug configurations:

```json
{
  "configurations": [
    {
      "name": "supa_main",
      "request": "launch",
      "type": "dart",
      "program": "lib/main.dart"
    },
    {
      "name": "supa_work",
      "request": "launch",
      "type": "dart",
      "program": "lib/main_work.dart"
    },
    // ... các configurations khác
  ]
}
```

Bạn có thể thêm configuration mới hoặc chỉnh sửa các configuration hiện có trong file này.

## 3. Cách đăng ký thêm một sub-app mới

### 3.1. Tạo Sub-App Package

**Bước 1: Tạo package mới**

Tạo thư mục mới trong `packages/` với tên `supa_<app_name>`:

```bash
mkdir -p packages/supa_<app_name>/lib
```

**Bước 2: Tạo `pubspec.yaml`**

Tạo file `packages/supa_<app_name>/pubspec.yaml`:

```yaml
name: supa_<app_name>
description: "<App Name> sub-app"
version: 1.0.0
publish_to: "none"

environment:
  sdk: ">=3.2.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  supa_architecture:
    path: ../supa_architecture
  supa_foundation:
    path: ../supa_foundation
  # ... các dependencies khác
```

**Bước 3: Implement SubApp interface**

Tạo file `packages/supa_<app_name>/lib/<app_name>_app.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supa_architecture/supa_architecture.dart';
import 'package:supa_foundation/config/sub_system.dart';
import 'package:supa_foundation/theme/supa_material_theme.dart' as supa_theme;
import 'package:supa_foundation/theme/supa_theme_extension.dart';
import 'package:supa_<app_name>/pages/home/<app_name>_home_page.dart';
import 'package:supa_<app_name>/router/router.dart';

class <AppName>App extends SubApp {
  @override
  String get homePage => <AppName>HomePage.location;

  @override
  String get label => '<App Name>';

  @override
  String? get appIcon => 'assets/images/<app-name>-icon.png';

  @override
  final List<RouteBase> routes = <appName>Routes;

  @override
  int? get subsystemId => AppSubSystem.<app_name>.id;

  @override
  String get routePrefix => '/<app_name>';

  @override
  final ThemeData lightTheme = SupaThemeExtension.withValues(
    colorScheme: supa_theme.lightColorScheme,
    extendedColorScheme: supa_theme.lightExtendedColorScheme,
  );

  @override
  final ThemeData darkTheme = SupaThemeExtension.withValues(
    colorScheme: supa_theme.darkColorScheme,
    extendedColorScheme: supa_theme.darkExtendedColorScheme,
  );
}
```

**Lưu ý:** Interface `SubApp` yêu cầu các thuộc tính sau:
- `homePage`: Route path của trang chủ
- `label`: Tên hiển thị của app
- `appIcon`: Đường dẫn đến icon (optional)
- `routes`: Danh sách routes của app
- `subsystemId`: ID của subsystem (từ `AppSubSystem` enum)
- `routePrefix`: Prefix cho tất cả routes (ví dụ: `/work`, `/project`)
- `lightTheme` và `darkTheme`: Theme cho app

### 3.2. Đăng ký Sub-App trong Main App

**Bước 1: Thêm vào `AppSubSystem` enum**

Mở file `packages/supa_foundation/lib/config/sub_system.dart` và thêm:

```dart
enum AppSubSystem {
  // ... existing subsystems
  <app_name>(
    id: <next_id>,
    code: '<APP_NAME>',
  ),
}
```

**Bước 2: Import và đăng ký trong `main.dart`**

Mở file `lib/main.dart`:

```dart
// Thêm import
import 'package:supa_<app_name>/<app_name>_app.dart';

// Trong hàm _registerApps()
void _registerApps() {
  AppRegistry.registerApp('/supa', MainApp());
  
  // ... existing registrations
  AppRegistry.registerApp('/<app_name>', <AppName>App()); // Thêm dòng này
}
```

**Bước 3: Cấu hình dependencies (nếu cần)**

Nếu sub-app có dependencies riêng, thêm vào `lib/config/get_it.dart`:

```dart
import 'package:supa_<app_name>/config/get_it.dart';

// Trong hàm configureDependencies()
Future<void> configureDependencies() async {
  // ... existing code
  configure<AppName>Dependencies(); // Thêm dòng này
  getIt.init();
}
```

**Bước 4: Thêm vào `pubspec.yaml` chính**

Mở `pubspec.yaml` ở root và thêm dependency:

```yaml
dependencies:
  # ... existing dependencies
  supa_<app_name>:
    path: packages/supa_<app_name>
```

**Bước 5: Tạo entry point riêng (tùy chọn)**

Nếu muốn chạy sub-app độc lập, tạo `lib/main_<app_name>.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:supa/config/get_it.dart';
import 'package:supa/config/notification_handlers.dart';
import 'package:supa/firebase_options.dart';
import 'package:supa_foundation/app_loader.dart';
import 'package:supa_foundation/router/app_registry.dart';
import 'package:supa_foundation/router/create_router_config.dart';
import 'package:supa_foundation/router/page_not_found.dart';
import 'package:supa_foundation/supa_app.dart';
import 'package:supa_<app_name>/<app_name>_app.dart';

Future<void> main() async {
  final loader = AppLoader(
    configureDependencies: configureDependencies,
    firebaseOptionsProvider: () => DefaultFirebaseOptions.currentPlatform,
  );

  await loader.bootstrap();

  final <appName>App = <AppName>App();
  AppRegistry.registerApp(<appName>App.routePrefix, <appName>App);

  registerNotificationHandlers();

  runApp(
    SupaApp(
      routerConfig: createRouterConfig(
        homePage: <appName>App.homePage,
        errorBuilder: (context, state) {
          return const PageNotFound();
        },
      ),
    ),
  );
}
```

**Bước 6: Thêm vào VSCode launch.json (tùy chọn)**

Thêm configuration vào `.vscode/launch.json`:

```json
{
  "name": "supa_<app_name>",
  "request": "launch",
  "type": "dart",
  "program": "lib/main_<app_name>.dart"
}
```

### 3.3. Ví dụ hoàn chỉnh

Xem file `packages/supa_work/lib/work_app.dart` để tham khảo implementation mẫu:

```dart
class WorkApp extends SubApp {
  @override
  String get homePage => WorkHomePage.location;

  @override
  String get label => 'Work';

  @override
  String? get appIcon => 'assets/images/work-icon.png';

  @override
  final List<RouteBase> routes = workRoutes;

  @override
  int? get subsystemId => AppSubSystem.work.id;

  @override
  String get routePrefix => '/work';

  @override
  final ThemeData lightTheme = SupaThemeExtension.withValues(
    colorScheme: supa_theme.lightColorScheme,
    extendedColorScheme: supa_theme.lightExtendedColorScheme,
  );

  @override
  final ThemeData darkTheme = SupaThemeExtension.withValues(
    colorScheme: supa_theme.darkColorScheme,
    extendedColorScheme: supa_theme.darkExtendedColorScheme,
  );
}
```

## 4. Cách switch sub-app để tối ưu hiệu năng

Khi phát triển trên một sub-app cụ thể, bạn có thể cấu hình Dart analyzer để chỉ tập trung vào module đó, giúp:
- Cải thiện hiệu suất phân tích code
- Giảm thời gian phản hồi của IDE
- Giảm nhiễu từ các module khác
- Đặc biệt hữu ích trên các máy cấu hình thấp

### 4.1. Sử dụng Script chuyển đổi

**Cách sử dụng:**

```bash
./scripts/switch_sub_app.sh <module-name>
```

**Ví dụ:**
```bash
# Chuyển sang focus vào supa_work
./scripts/switch_sub_app.sh supa_work

# Chuyển sang focus vào supa_spend
./scripts/switch_sub_app.sh supa_spend

# Chuyển sang focus vào supa_attendance
./scripts/switch_sub_app.sh supa_attendance
```

**Các module có sẵn:**
- `supa_attendance` - Module chấm công
- `supa_bibs` - Module BIBS
- `supa_project` - Module dự án
- `supa_serving` - Module phục vụ
- `supa_spend` - Module chi tiêu
- `supa_training` - Module đào tạo
- `supa_work` - Module công việc
- `supa_chat` - Module chat
- `supa_admin` - Module admin

### 4.2. Script làm gì?

Script `switch_sub_app.sh` thực hiện các bước sau:

1. **Copy backup file**: Copy `analysis_options.backup.yaml` sang `analysis_options.yaml`
2. **Thêm exclude rules**: Thêm section `analyzer.exclude` để loại trừ các package không cần thiết
3. **Giữ các package quan trọng**:
   - Luôn giữ thư mục `lib/` được phân tích
   - Không bao giờ loại trừ `packages/supa_foundation` (foundation dùng chung)
   - Không bao giờ loại trừ `packages/supa_architecture` (core dependency)
   - Không bao giờ loại trừ `packages/supa_notification` (dùng chung)
   - Không bao giờ loại trừ `packages/supa_discussion` (dùng chung)
   - Khi chọn `supa_work` hoặc `supa_project`, giữ cả hai được bao gồm (chúng phụ thuộc lẫn nhau)

### 4.3. Khởi động lại Analysis Server

**⚠️ QUAN TRỌNG:** Sau khi chạy script, bạn **phải khởi động lại** IDE/editor hoặc Dart analysis server để thay đổi có hiệu lực. Analyzer đọc `analysis_options.yaml` khi khởi động, nên thay đổi sẽ không được áp dụng cho đến khi khởi động lại.

**Cách khởi động lại Dart analysis server:**

**VSCode:**
1. Mở Command Palette: `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux)
2. Gõ: `Dart: Restart Analysis Server`
3. Nhấn Enter

**Android Studio/IntelliJ:**
1. Menu: `File` → `Invalidate Caches...`
2. Chọn `Invalidate and Restart`

**Hoặc đơn giản:**
- Khởi động lại IDE

### 4.4. Ví dụ output

Sau khi chạy script:

```bash
$ ./scripts/switch_sub_app.sh supa_work
✅ Analyzer configured for supa_work

Excluded modules:
  supa_attendance
  supa_bibs
  supa_chat
  supa_project
  supa_serving
  supa_spend
  supa_training
```

### 4.5. Khôi phục về trạng thái ban đầu

Để khôi phục về trạng thái phân tích tất cả modules:

```bash
cp analysis_options.backup.yaml analysis_options.yaml
```

Sau đó khởi động lại Dart analysis server.

## 5. Cách kiểm tra phân quyền dựa vào AppUserProfile và list paths

Hệ thống phân quyền trong SupaMobileApp sử dụng **paths** (danh sách đường dẫn) để xác định quyền truy cập của người dùng vào các tính năng cụ thể. Mỗi path đại diện cho một quyền truy cập vào một tính năng hoặc trang.

### 5.1. AppUserProfile và Paths

**AppUserProfile** là class mở rộng từ `AppUser`, chứa thông tin profile của người dùng bao gồm danh sách paths mà người dùng có quyền truy cập:

```dart
class AppUserProfile extends AppUser {
  // ... các fields khác
  List<String> paths = []; // Danh sách paths mà user có quyền
}
```

**Paths** là danh sách các đường dẫn string, ví dụ:
- `'work/report/site-report'` - Quyền truy cập báo cáo site
- `'work/schedule/schedule-master'` - Quyền truy cập lịch trình
- `'work/inspection/inspection-master'` - Quyền truy cập inspection

### 5.2. Lấy danh sách Paths

Mỗi sub-app có một repository riêng để lấy paths của user. Ví dụ với Work app:

**WorkProfileRepository:**
```dart
class WorkProfileRepository extends ApiClient {
  @override
  String get baseUrl => '${persistentStorage.baseApiUrl}/rpc/work/profile';

  Future<List<String>> getPaths() async {
    return dio.post(
      '/get',
      data: {},
    ).then((response) {
      if (response.data['paths'] is List) {
        return List<String>.from(response.data['paths']);
      }
      return [];
    });
  }
}
```

### 5.3. Sử dụng Bloc để quản lý Paths

Thông thường, paths được quản lý thông qua Bloc pattern. Ví dụ với `WorkProfileBloc`:

**WorkProfileBloc:**
```dart
class WorkProfileBloc extends Bloc<WorkProfileEvent, WorkProfileState> {
  final WorkProfileRepository _repository = WorkProfileRepository();

  WorkProfileBloc() : super(WorkProfileInitial()) {
    on<FetchWorkProfileEvent>(_onFetchWorkProfile);
  }

  Future<void> _onFetchWorkProfile(
    FetchWorkProfileEvent event,
    Emitter<WorkProfileState> emit,
  ) async {
    add(const WorkProfileLoadingEvent());
    await _repository.getPaths().then((paths) {
      add(WorkProfileLoadedEvent(paths: paths));
    }).catchError((error) {
      emit(WorkProfileInitial());
    });
  }
}
```

**WorkProfileState:**
```dart
final class WorkProfileLoaded extends WorkProfileState {
  final List<String> paths;

  const WorkProfileLoaded({
    required this.paths,
  });
}
```

### 5.4. Ví dụ cụ thể: Kiểm tra phân quyền trong WorkNavbar

File `packages/supa_work/lib/pages/work_navbar.dart` minh họa cách kiểm tra phân quyền dựa vào paths:

```dart
class WorkNavbar extends StatefulWidget {
  // ...
}

class _WorkNavbarState extends State<WorkNavbar> {
  final WorkProfileBloc _bloc = WorkProfileBloc();

  @override
  void initState() {
    super.initState();
    _bloc.add(const FetchWorkProfileEvent());
  }

  /// Builds navbar items dynamically to ensure labels update when language changes
  List<ScaffoldNavbarItem> _buildNavbarItems(WorkProfileState state) {
    // Kiểm tra quyền truy cập Analytics
    final hasAnalyticPermission = state is WorkProfileLoaded &&
        state.paths.any((path) => path == 'work/report/site-report');
    
    // Kiểm tra quyền truy cập Schedule
    final hasSchedulePermission = state is WorkProfileLoaded &&
        state.paths.any((path) => path == 'work/schedule/schedule-master');

    // Bắt đầu với các items cơ bản
    final items = List<ScaffoldNavbarItem>.from(_buildBaseNavbarItems());
    
    // Chỉ thêm Analytics item nếu user có quyền
    if (hasAnalyticPermission) {
      items.add(_buildAnalyticsNavbarItem());
    }
    
    // Chỉ thêm Others item nếu user có quyền Schedule
    if (hasSchedulePermission) {
      items.add(
        ScaffoldNavbarItem(
          path: WorkOthersPage.location,
          icon: FluentIcons.app_folder_24_regular,
          activeIcon: FluentIcons.app_folder_24_filled,
          label: translate('work.navbar.others'),
        ),
      );
    }
    
    return items;
  }

  List<ScaffoldNavbarItem> _buildBaseNavbarItems() {
    // Các items luôn hiển thị (không cần kiểm tra quyền)
    return [
      ScaffoldNavbarItem(
        path: WorkHomePage.location,
        icon: FluentIcons.home_24_regular,
        activeIcon: FluentIcons.home_24_filled,
        label: translate('work.navbar.home'),
      ),
      ScaffoldNavbarItem(
        path: InspectionPageWidget.location,
        icon: FluentIcons.clipboard_task_list_rtl_24_regular,
        activeIcon: FluentIcons.clipboard_task_list_rtl_24_filled,
        label: translate('work.navbar.inspection'),
      ),
      ScaffoldNavbarItem(
        path: TaskAssignmentPage.location,
        icon: FluentIcons.checkbox_person_24_regular,
        activeIcon: FluentIcons.checkbox_person_24_filled,
        label: translate('work.navbar.taskAssignment'),
      ),
    ];
  }

  ScaffoldNavbarItem _buildAnalyticsNavbarItem() {
    return ScaffoldNavbarItem(
      path: SiteReportPage.location,
      icon: FluentIcons.chart_multiple_24_regular,
      activeIcon: FluentIcons.chart_multiple_24_filled,
      label: translate('work.navbar.analytics'),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider<WorkProfileBloc>(
      create: (context) => _bloc,
      child: BlocBuilder<WorkProfileBloc, WorkProfileState>(
        bloc: _bloc,
        builder: (context, state) {
          return ScaffoldNavbar(
            shouldShowNavbar: true,
            buildItems: () => _buildNavbarItems(state), // Build items dựa vào state
            child: widget.child,
          );
        },
      ),
    );
  }
}
```

### 5.5. Giải thích chi tiết

**1. Khởi tạo Bloc và fetch paths:**
```dart
final WorkProfileBloc _bloc = WorkProfileBloc();

@override
void initState() {
  super.initState();
  _bloc.add(const FetchWorkProfileEvent()); // Fetch paths khi widget khởi tạo
}
```

**2. Kiểm tra quyền trong `_buildNavbarItems`:**
```dart
// Kiểm tra xem state có phải WorkProfileLoaded không
// và paths có chứa path cần kiểm tra không
final hasAnalyticPermission = state is WorkProfileLoaded &&
    state.paths.any((path) => path == 'work/report/site-report');
```

**3. Điều kiện hiển thị:**
```dart
// Chỉ thêm item vào navbar nếu user có quyền
if (hasAnalyticPermission) {
  items.add(_buildAnalyticsNavbarItem());
}
```

**4. Sử dụng BlocBuilder để rebuild khi state thay đổi:**
```dart
BlocBuilder<WorkProfileBloc, WorkProfileState>(
  bloc: _bloc,
  builder: (context, state) {
    return ScaffoldNavbar(
      buildItems: () => _buildNavbarItems(state), // Rebuild khi state thay đổi
      // ...
    );
  },
)
```

### 5.6. Pattern chung để kiểm tra phân quyền

**Bước 1: Fetch paths khi cần**
```dart
final bloc = WorkProfileBloc();
bloc.add(const FetchWorkProfileEvent());
```

**Bước 2: Kiểm tra quyền trong BlocBuilder**
```dart
BlocBuilder<WorkProfileBloc, WorkProfileState>(
  builder: (context, state) {
    if (state is WorkProfileLoaded) {
      final hasPermission = state.paths.any(
        (path) => path == 'work/report/site-report'
      );
      
      if (hasPermission) {
        // Hiển thị tính năng
      }
    }
    return Widget();
  },
)
```

**Bước 3: Sử dụng điều kiện để hiển thị/ẩn UI**
```dart
if (hasPermission) {
  return SomeWidget();
} else {
  return SizedBox.shrink(); // hoặc widget khác
}
```

### 5.7. Best Practices

1. **Luôn kiểm tra state type**: Đảm bảo state là `WorkProfileLoaded` trước khi truy cập `paths`
2. **Sử dụng `any()` cho exact match**: `state.paths.any((path) => path == 'exact-path')`
3. **Sử dụng `contains()` cho partial match**: `state.paths.any((path) => path.contains('partial'))`
4. **Cache paths nếu cần**: Tránh fetch nhiều lần không cần thiết
5. **Handle loading state**: Hiển thị loading indicator khi đang fetch paths
6. **Handle error state**: Xử lý trường hợp lỗi khi fetch paths

### 5.8. Ví dụ khác: Kiểm tra quyền trong Page

```dart
class SomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<WorkProfileBloc, WorkProfileState>(
      builder: (context, state) {
        if (state is WorkProfileLoaded) {
          final canViewReports = state.paths.any(
            (path) => path == 'work/report/site-report'
          );
          
          if (!canViewReports) {
            return ForbiddenPage(); // Hoặc redirect
          }
          
          return ReportPage();
        }
        
        return LoadingIndicator();
      },
    );
  }
}
```

---

## 6. Tóm tắt

1. **Cấu trúc**: Main app + sub-packages, mỗi sub-app là một package độc lập
2. **Dependencies**: Tất cả packages phụ thuộc vào `supa_foundation`; có circular dependencies cần được giải quyết
3. **Navigation**: Sử dụng `go_router` với 3 loại routes (Specific, Common, App Registry)
4. **Chạy app**: Sử dụng VSCode Run & Debug hoặc terminal với các file `main*.dart`
5. **Đăng ký sub-app**: Implement `SubApp` interface và đăng ký trong `AppRegistry`
6. **Tối ưu hiệu năng**: Sử dụng script `switch_sub_app.sh` để giảm analysis scope
7. **Phân quyền**: Sử dụng paths từ `AppUserProfile` và kiểm tra bằng `state.paths.any()`

---

**Lưu ý quan trọng:**
- ⚠️ Có circular dependencies giữa `supa_work` và `supa_project` cần được giải quyết
- Tất cả packages nên phụ thuộc vào `supa_foundation` như base layer
- Common routes có sẵn trong tất cả sub-apps
- Router tự động redirect dựa trên authentication status
