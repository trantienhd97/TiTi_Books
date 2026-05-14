# Phát triển Sub-App

## 1. Tổng quan

Tài liệu này mô tả cách phát triển một sub-app hoàn chỉnh trong SupaMobileApp, bao gồm:
- Tạo SubApp class
- Cấu hình dependencies với Get It
- Tạo navbar tùy chỉnh
- Tạo bộ routing
- Đăng ký routing và login
- Đăng ký discussion adapters
- Đăng ký notification handlers
- Cấu trúc thư mục

## 2. Cấu trúc thư mục Sub-App

### 2.1. Cấu trúc chuẩn

```
packages/supa_<app_name>/lib/
├── <app_name>_app.dart              # SubApp implementation
├── config/
│   └── get_it.dart                  # Dependency injection config
├── router/
│   └── router.dart                  # Routing configuration
├── pages/
│   ├── home/
│   │   └── <app_name>_home_page.dart
│   ├── <feature>/
│   │   └── <feature>_page.dart
│   └── <app_name>_navbar.dart      # Navbar widget
├── widgets/
│   ├── atoms/                       # Atomic components
│   ├── molecules/                   # Composite components
│   └── organisms/                   # Complex components
├── repositories/
│   └── <entity>_repository.dart
├── blocs/                           # State management
│   └── <feature>_bloc/
├── core/
│   ├── models/                      # Models generated from backend
│   │   └── models.dart
│   └── filters/                     # Filter classes
├── models/                          # Custom models
│   └── <model>.dart
├── filters/                         # Additional filters
│   └── <filter>.dart
├── notification/                    # Notification handlers
│   └── <app_name>_notification_handler.dart
└── utils/                           # Utility functions
    └── <utility>.dart
```

### 2.2. Giải thích các thư mục

**`config/`**: Cấu hình dependencies injection (GetIt)

**`router/`**: Định nghĩa tất cả routes của sub-app

**`pages/`**: Tất cả các pages/screens của app
- `home/`: Trang chủ của sub-app
- `<feature>/`: Các pages theo feature
- `<app_name>_navbar.dart`: Navbar widget

**`widgets/`**: Reusable widgets, tổ chức theo Atomic Design
- `atoms/`: Components nhỏ nhất (buttons, inputs, etc.)
- `molecules/`: Components kết hợp từ atoms
- `organisms/`: Components phức tạp kết hợp từ molecules

**`repositories/`**: Data access layer, giao tiếp với API

**`blocs/`**: State management (BLoC pattern)

**`core/`**: Core functionality
- `models/`: Models được generate từ backend
- `filters/`: Filter classes cho API calls

**`models/`**: Custom models không được generate từ backend

**`filters/`**: Additional filter classes

**`notification/`**: Notification handlers cho push notifications

**`utils/`**: Utility functions và helpers

## 3. Tạo SubApp Class

### 3.1. Implement SubApp Class

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
  String? get appIcon => 'assets/images/<app_name>-icon.png';

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

### 3.2. Định nghĩa Sub-System ID

Thêm sub-system mới vào enum `AppSubSystem` trong `packages/supa_foundation/lib/config/sub_system.dart`:

```dart
enum AppSubSystem {
  portal(
    id: 1,
    code: 'PORTAL',
  ),
  // ... existing systems
  <app_name>(
    id: <new_id>,
    code: '<APP_NAME_UPPERCASE>',
  ),
}
```

### 3.3. Giải thích các thuộc tính

- **`homePage`**: Route path của trang chủ (ví dụ: `'/<app_name>/home'`)
- **`label`**: Tên hiển thị của app (dùng trong UI)
- **`appIcon`**: Đường dẫn đến icon của app (optional)
- **`routes`**: Danh sách routes của sub-app
- **`subsystemId`**: ID của subsystem (từ `AppSubSystem` enum)
- **`routePrefix`**: Prefix cho tất cả routes (ví dụ: `'/work'`, `'/project'`)
- **`lightTheme`** và **`darkTheme`**: Theme cho app (light và dark mode)

## 4. Cấu hình Dependencies với Get It

### 4.1. Tạo Get It Configuration

Tạo file `packages/supa_<app_name>/lib/config/get_it.dart`:

```dart
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:supa_<app_name>/core/models/models.dart';

import 'get_it.config.dart';

final getIt = GetIt.instance;

@InjectableInit()
Future<void> configure<AppName>Dependencies() async {
  registerGenerated<AppName>Models();
  getIt.init();
}
```

### 4.2. Thêm Dependencies vào Main Configuration

Trong file `lib/config/get_it.dart` của main app, import và gọi hàm configuration:

```dart
import 'package:supa_<app_name>/config/get_it.dart';

// Trong hàm configureDependencies:
Future<void> configureDependencies() async {
  // ... existing code ...
  
  /// Business-specific dependencies
  // ... existing dependencies ...
  await configure<AppName>Dependencies();  // Thêm dòng này

  getIt.init();
}
```

### 4.3. Định nghĩa Models

Tạo models trong thư mục `core/models`. Sử dụng `JsonModel` và `JsonField` từ architecture package:

```dart
// Trong supa_<app_name>/core/models/models.dart
export 'models.g.dart'; // Generated file

// Trong supa_<app_name>/core/models/<model_name>.dart
import 'package:supa_architecture/supa_architecture.dart';

part 'models.g.dart';

@jsonModel
class <ModelName> extends JsonModel<<ModelName>> {
  <ModelName>({super.rawValue});

  @jsonField
  late final JsonField<String> name = createField<String>('name', '');
  
  @jsonField
  late final JsonField<int> count = createField<int>('count', 0);
}
```

## 5. Đăng ký Sub-App trong Main App

### 5.1. Import Sub-App

Trong file `lib/main.dart`, thêm import:

```dart
import 'package:supa_<app_name>/<app_name>_app.dart';
```

### 5.2. Đăng ký Sub-App

Trong hàm `_registerApps()` trong `lib/main.dart`:

```dart
void _registerApps() {
  AppRegistry.registerApp('/supa', MainApp());

  // ... existing registrations ...
  AppRegistry.registerApp('/<app_name>', <AppName>App());  // Thêm dòng này
}
```

## 6. Tạo Navbar

### 3.1. ScaffoldNavbar

`ScaffoldNavbar` là widget template từ `supa_foundation` cung cấp bottom navigation bar. Bạn cần tạo một widget wrapper để customize navbar cho sub-app.

### 3.2. Tạo Navbar Widget

Tạo file `packages/supa_<app_name>/lib/pages/<app_name>_navbar.dart`:

```dart
import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:supa_foundation/widgets/templates/scaffold_navbar.dart';
import 'package:supa_l10n_manager/translator.dart';
import 'package:supa_<app_name>/pages/home/<app_name>_home_page.dart';
import 'package:supa_<app_name>/pages/<feature>/<feature>_page.dart';

class <AppName>Navbar extends StatelessWidget {
  const <AppName>Navbar({
    super.key,
    required this.child,
  });

  final Widget child;

  List<ScaffoldNavbarItem> _buildNavbarItems() {
    return [
      ScaffoldNavbarItem(
        path: <AppName>HomePage.location,
        icon: FluentIcons.home_24_regular,
        activeIcon: FluentIcons.home_24_filled,
        label: translate('<app_name>.navbar.home'),
      ),
      ScaffoldNavbarItem(
        path: <Feature>Page.location,
        icon: FluentIcons.<icon>_24_regular,
        activeIcon: FluentIcons.<icon>_24_filled,
        label: translate('<app_name>.navbar.<feature>'),
      ),
      // Thêm các items khác...
    ];
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldNavbar(
      shouldShowNavbar: true,
      buildItems: _buildNavbarItems,
      child: child,
    );
  }
}
```

### 3.3. Navbar với Dynamic Items (Permission-based)

Nếu navbar items phụ thuộc vào permissions, sử dụng StatefulWidget với BlocBuilder:

```dart
import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:supa_foundation/widgets/templates/scaffold_navbar.dart';
import 'package:supa_l10n_manager/supa_l10n_manager.dart';
import 'package:supa_<app_name>/blocs/<app_name>_profile_bloc/<app_name>_profile_bloc.dart';
import 'package:supa_<app_name>/pages/home/<app_name>_home_page.dart';
import 'package:supa_<app_name>/pages/<feature>/<feature>_page.dart';

class <AppName>Navbar extends StatefulWidget {
  const <AppName>Navbar({
    super.key,
    required this.child,
  });

  final Widget child;

  @override
  State<<AppName>Navbar> createState() => _<AppName>NavbarState();
}

class _<AppName>NavbarState extends State<<AppName>Navbar> {
  final <AppName>ProfileBloc _bloc = <AppName>ProfileBloc();

  @override
  void initState() {
    super.initState();
    _bloc.add(const Fetch<AppName>ProfileEvent());
  }

  List<ScaffoldNavbarItem> _buildNavbarItems(<AppName>ProfileState state) {
    // Kiểm tra permissions
    final hasFeaturePermission = state is <AppName>ProfileLoaded &&
        state.paths.any((path) => path == '<app_name>/<feature>/<path>');

    final items = List<ScaffoldNavbarItem>.from(_buildBaseNavbarItems());
    
    // Thêm items dựa trên permissions
    if (hasFeaturePermission) {
      items.add(
        ScaffoldNavbarItem(
          path: <Feature>Page.location,
          icon: FluentIcons.<icon>_24_regular,
          activeIcon: FluentIcons.<icon>_24_filled,
          label: translate('<app_name>.navbar.<feature>'),
        ),
      );
    }
    
    return items;
  }

  List<ScaffoldNavbarItem> _buildBaseNavbarItems() {
    return [
      ScaffoldNavbarItem(
        path: <AppName>HomePage.location,
        icon: FluentIcons.home_24_regular,
        activeIcon: FluentIcons.home_24_filled,
        label: translate('<app_name>.navbar.home'),
      ),
      // Các items luôn hiển thị...
    ];
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider<<AppName>ProfileBloc>(
      create: (context) => _bloc,
      child: BlocBuilder<<AppName>ProfileBloc, <AppName>ProfileState>(
        bloc: _bloc,
        builder: (context, state) {
          return ScaffoldNavbar(
            shouldShowNavbar: true,
            buildItems: () => _buildNavbarItems(state),
            child: widget.child,
          );
        },
      ),
    );
  }
}
```

### 3.4. ScaffoldNavbarItem Properties

- **`path`**: Route path của page (ví dụ: `HomePage.location`)
- **`icon`**: Icon hiển thị khi không active
- **`activeIcon`**: Icon hiển thị khi active (optional, mặc định dùng `icon`)
- **`activeAssetImage`**: Asset image cho active state (optional)
- **`label`**: Text label hiển thị dưới icon
- **`badgeCount`**: Số badge hiển thị trên icon (optional)

## 7. Tạo Bộ Routing

### 4.1. File Router

Tạo file `packages/supa_<app_name>/lib/router/router.dart`:

```dart
import 'package:go_router/go_router.dart';
import 'package:supa_foundation/widgets/templates/language_aware_navbar.dart';
import 'package:supa_<app_name>/pages/home/<app_name>_home_page.dart';
import 'package:supa_<app_name>/pages/<app_name>_navbar.dart';
import 'package:supa_<app_name>/pages/<feature>/<feature>_page.dart';
import 'package:supa_<app_name>/pages/<feature>/<feature>_detail_page.dart';

final List<RouteBase> <appName>Routes = [
  // Shell route với navbar
  ShellRoute(
    builder: (context, state, child) {
      return LanguageAwareNavbar(
        child: <AppName>Navbar(child: child),
      );
    },
    routes: [
      // Home page
      GoRoute(
        path: <AppName>HomePage.location,
        builder: (context, state) => const <AppName>HomePage(),
      ),
      
      // Feature pages trong navbar
      GoRoute(
        path: <Feature>Page.location,
        builder: (context, state) => const <Feature>Page(),
      ),
      
      // Redirect từ prefix về home page
      GoRoute(
        path: '/<app_name>',
        redirect: (context, state) => <AppName>HomePage.location,
      ),
    ],
  ),
  
  // Các routes ngoài navbar (detail pages, modals, etc.)
  GoRoute(
    path: <Feature>DetailPage.location,
    builder: (context, state) {
      final id = state.id; // Lấy ID từ path parameter
      return <Feature>DetailPage(id: id);
    },
  ),
  
  // Routes với query parameters
  GoRoute(
    path: <AnotherFeature>Page.location,
    builder: (context, state) {
      final param1 = state.uri.queryParameters['param1'];
      final param2 = state.uri.queryParameters['param2'];
      return <AnotherFeature>Page(
        param1: param1,
        param2: param2,
      );
    },
  ),
  
  // Routes với extra data
  GoRoute(
    path: <Feature>EditPage.location,
    builder: (context, state) {
      final id = state.id;
      final entity = state.extra as <Entity>?;
      return <Feature>EditPage(
        id: id,
        entity: entity,
      );
    },
  ),
];
```

### 4.2. Route Redirect từ Prefix

**Quan trọng**: Mỗi sub-app router nên có một route redirect từ prefix của sub-app về home page mặc định:

```dart
GoRoute(
  path: '/<app_name>',  // Prefix của sub-app
  redirect: (context, state) => <AppName>HomePage.location,
),
```

**Ví dụ từ Training app:**
```dart
GoRoute(
  path: '/training',
  redirect: (context, state) => TrainingHomePage.location,
),
```

**Ví dụ từ Chat app:**
```dart
GoRoute(
  path: '/chat',
  redirect: (context, state) => MessagesPage.location,
),
```

### 4.3. ShellRoute với Navbar

Sử dụng `ShellRoute` để wrap các routes cần navbar:

```dart
ShellRoute(
  builder: (context, state, child) {
    return LanguageAwareNavbar(
      child: <AppName>Navbar(child: child),
    );
  },
  routes: [
    // Các routes trong navbar
  ],
)
```

**`LanguageAwareNavbar`**: Wrapper để rebuild navbar khi language thay đổi (từ `supa_foundation`)

### 4.4. Route Types

**Simple Route:**
```dart
GoRoute(
  path: HomePage.location,
  builder: (context, state) => const HomePage(),
)
```

**Route với Path Parameters:**
```dart
GoRoute(
  path: '/<app_name>/feature/:id',
  builder: (context, state) {
    final id = state.pathParameters['id'];
    // Hoặc sử dụng state.id nếu path kết thúc bằng :id
    return FeatureDetailPage(id: int.parse(id!));
  },
)
```

**Route với Query Parameters:**
```dart
GoRoute(
  path: FeaturePage.location,
  builder: (context, state) {
    final filter = state.uri.queryParameters['filter'];
    return FeaturePage(filter: filter);
  },
)
```

**Route với Extra Data:**
```dart
GoRoute(
  path: EditPage.location,
  builder: (context, state) {
    final entity = state.extra as Entity;
    return EditPage(entity: entity);
  },
)
```

### 4.5. Location Constants

Mỗi page nên có constant `location`:

```dart
class <AppName>HomePage extends StatelessWidget {
  static const location = '/<app_name>/home';
  
  // ...
}
```

## 8. Đăng ký Routing và Login trong Main File

### 5.1. Main File cho Sub-App

Tạo file `lib/main_<app_name>.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:supa/config/get_it.dart';
import 'package:supa/config/notification_handlers.dart';
import 'package:supa/firebase_options.dart';
import 'package:supa_<app_name>/<app_name>_app.dart';
import 'package:supa_foundation/app_loader.dart';
import 'package:supa_foundation/router/app_registry.dart';
import 'package:supa_foundation/router/create_router_config.dart';
import 'package:supa_foundation/router/page_not_found.dart';
import 'package:supa_foundation/supa_app.dart';

Future<void> main() async {
  // 1. Tạo AppLoader với configureDependencies
  final loader = AppLoader(
    configureDependencies: configureDependencies,
    firebaseOptionsProvider: () => DefaultFirebaseOptions.currentPlatform,
  );

  // 2. Bootstrap app (initialize dependencies, Firebase, etc.)
  await loader.bootstrap();

  // 3. Tạo và đăng ký sub-app
  final <appName>App = <AppName>App();
  AppRegistry.registerApp(<appName>App.routePrefix, <appName>App);

  // 4. Đăng ký notification handlers
  registerNotificationHandlers();

  // 5. Run app với router config
  runApp(
    SupaApp(
      routerConfig: createRouterConfig(
        homePage: <appName>App.homePage,  // Home page của sub-app
        errorBuilder: (context, state) => const PageNotFound(),
      ),
    ),
  );
}
```

### 5.2. Giải thích

**1. AppLoader:**
- Khởi tạo dependencies (GetIt)
- Khởi tạo Firebase
- Các setup khác cần thiết

**2. Bootstrap:**
- Chờ tất cả initialization hoàn tất

**3. Đăng ký Sub-App:**
- Tạo instance của SubApp
- Đăng ký vào AppRegistry với routePrefix

**4. Notification Handlers:**
- Đăng ký handlers cho push notifications

**5. Router Config:**
- `homePage`: Route của home page (sẽ được redirect khi authenticated)
- `errorBuilder`: Widget hiển thị khi có lỗi routing (404, etc.)

### 5.3. Login Routes

Login routes được tự động thêm vào router thông qua `commonRoutes` trong `createRouterConfig()`. Các routes login bao gồm:
- `/supa/login` - Login page
- `/supa/login/server` - Server selection
- `/supa/login/tenant` - Tenant selection
- `/supa/login/password-forgot` - Forgot password
- `/supa/login/password-reset` - Reset password

### 5.4. Authentication Flow

Router tự động redirect dựa trên authentication state:

```dart
// Trong create_router_config()
GoRoute(
  path: '/',
  redirect: (context, state) {
    final target = getIt.get<AuthenticationBloc>().state.isAuthenticated
        ? homePage  // Home page của sub-app nếu đã login
        : LoginPage.location;  // Login page nếu chưa login
    return target;
  },
),
```

### 5.5. Ví dụ hoàn chỉnh

**File: `lib/main_work.dart`**
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
import 'package:supa_work/work_app.dart';

Future<void> main() async {
  final loader = AppLoader(
    configureDependencies: configureDependencies,
    firebaseOptionsProvider: () => DefaultFirebaseOptions.currentPlatform,
  );

  await loader.bootstrap();

  final workApp = WorkApp();
  AppRegistry.registerApp(workApp.routePrefix, workApp);

  registerNotificationHandlers();

  runApp(
    SupaApp(
      routerConfig: createRouterConfig(
        homePage: workApp.homePage,
        errorBuilder: (context, state) {
          return const PageNotFound();
        },
      ),
    ),
  );
}
```

## 9. Đăng ký Discussion Adapters

### 9.1. Tạo Discussion Adapter

Nếu sub-app của bạn có discussion feature, bạn cần tạo một adapter để xử lý navigation đến detail page của entity.

Tạo file adapter trong sub-app hoặc trong discussion module:

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supa_architecture/supa_architecture.dart';
import 'package:supa_<app_name>/pages/detail/<detail_page>.dart'; // Detail page của bạn
import 'package:supa_foundation/blocs/unread_comment/unread_comment_bloc.dart';
import 'package:supa_foundation/config/get_it.dart';
import 'package:supa_l10n_manager/translator.dart';

import '../discussion_entity_adapter.dart';

/// Adapter cho xử lý discussions của [App Name]
class <AppName>Adapter extends DiscussionEntityAdapter {
  @override
  String get entityCode => '<EntityCode>'; // Code cho entity type của bạn

  @override
  Future<void> navigateToDetail(
    BuildContext context,
    Discussion discussion,
  ) async {
    // Tạo entity instance từ discussion data (nếu cần)
    final entity = <EntityName>()
      ..id.value = discussion.requestId.value
      ..isScroll.value = true; // Optional: để scroll đến comment khi mở page

    // Navigate đến detail page
    await GoRouter.of(context).push(
      <DetailPage>.location.withId(discussion.requestId.value),
      extra: entity,  // Pass entity data nếu cần
    );

    // Update unread comments sau khi navigate
    getIt.get<UnreadCommentCubit>().loadUnreadComment();
  }

  @override
  String getEntityDisplayName(Discussion discussion) {
    // Trả về tên hiển thị cho discussion type này
    return discussion.requisitionEntity.value.code.value.isNotEmpty &&
            discussion.requisitionEntity.value.code.value == '<EntityCode>'
        ? translate('<app_name>.navbar.<entity_name>') // Key translation
        : '<EntityName>'; // Fallback
  }
}
```

### 9.2. Đăng ký Adapter

Thêm adapter vào `DiscussionEntityFactory` trong discussion module:

```dart
// Trong lib/modules/discussion/discussion_entity_factory.dart
import 'package:supa_<app_name>/adapters/<app_name>_adapter.dart'; // Import adapter của bạn

class DiscussionEntityFactory {
  // ... existing code ...

  /// Danh sách tất cả các adapters đã đăng ký
  static final List<DiscussionEntityAdapter> _adapters = [
    WorkTaskAdapter(),
    InspectionAdapter(),
    <AppName>Adapter(),  // Thêm adapter của bạn vào danh sách
  ];
  
  // ... rest of the code ...
}
```

**Lưu ý**: Nếu bạn muốn đăng ký adapter tại runtime, có thể sử dụng:

```dart
DiscussionEntityFactory.registerAdapter(<AppName>Adapter());
```

## 10. Đăng ký Notification Handlers

### 10.1. Tạo Notification Handler

Tạo notification handler trong thư mục `notification` của sub-app:

```dart
import 'dart:async';

import 'package:go_router/go_router.dart';
import 'package:supa_architecture/supa_architecture.dart';
import 'package:supa_<app_name>/pages/detail/<detail_page>.dart'; // Detail page của bạn

class <AppName>NotificationHandler extends NotificationHandler {
  <AppName>NotificationHandler(super.context);

  @override
  FutureOr<void> handle(UserNotification userNotification) {
    final uri = Uri.parse(userNotification.linkMobile.value);

    // Xử lý các paths cụ thể cho app của bạn
    if (uri.path.startsWith('/<app_name>')) {
      if (uri.path.contains('detail')) {
        // Navigate đến detail page
        return GoRouter.of(context).push(
          <DetailPage>.location.withId(uri.pathSegments.last),
        );
      }
      // Thêm các loại notification khác cho app của bạn
    }

    // Fallback về default link navigation
    return _goToLink(userNotification.linkMobile.value);
  }

  _goToLink(String uri) {
    return GoRouter.of(context).push(uri);
  }
}
```

### 10.2. Đăng ký Notification Handler

Thêm notification handler vào main notification registration trong `lib/config/notification_handlers.dart`:

```dart
import 'package:supa_<app_name>/notification/<app_name>_notification_handler.dart';

void registerNotificationHandlers() {
  // ... existing registrations ...
  
  NotificationHandlerFactory.registerPrefix(
    '/<app_name>',
    (context) => <AppName>NotificationHandler(context),
  );
}
```

## 11. Ví dụ Hoàn chỉnh

### 11.1. Ví dụ: Chat App

**Navbar: `packages/supa_chat/lib/pages/chat_navbar.dart`**
```dart
import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:supa_chat/pages/contacts/contacts_page.dart';
import 'package:supa_chat/pages/messages/messages_page.dart';
import 'package:supa_foundation/widgets/templates/scaffold_navbar.dart';
import 'package:supa_l10n_manager/translator.dart';

class ChatNavbar extends StatelessWidget {
  final Widget child;

  const ChatNavbar({
    super.key,
    required this.child,
  });

  List<ScaffoldNavbarItem> _buildNavbarItems() {
    return [
      ScaffoldNavbarItem(
        path: MessagesPage.location,
        icon: FluentIcons.chat_24_regular,
        activeIcon: FluentIcons.chat_24_filled,
        label: translate('chat.navbar.messages'),
      ),
      ScaffoldNavbarItem(
        path: ContactsPage.location,
        icon: FluentIcons.people_24_regular,
        activeIcon: FluentIcons.people_24_filled,
        label: translate('chat.navbar.contacts'),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldNavbar(
      shouldShowNavbar: true,
      buildItems: _buildNavbarItems,
      child: child,
    );
  }
}
```

**Router: `packages/supa_chat/lib/router/router.dart`**
```dart
import 'package:go_router/go_router.dart';
import 'package:supa_chat/pages/chat/chat_page.dart';
import 'package:supa_chat/pages/chat_navbar.dart';
import 'package:supa_chat/pages/contacts/contacts_page.dart';
import 'package:supa_chat/pages/conversation_info/conversation_information_page.dart';
import 'package:supa_chat/pages/home/chat_home_page.dart';
import 'package:supa_chat/pages/messages/messages_page.dart';
import 'package:supa_foundation/widgets/templates/language_aware_navbar.dart';

final List<RouteBase> chatRoutes = [
  // Shell routes for navbar
  ShellRoute(
    builder: (context, state, child) {
      return LanguageAwareNavbar(
        child: ChatNavbar(child: child),
      );
    },
    routes: [
      GoRoute(
        path: ChatHomePage.location,
        builder: (context, state) => const ChatHomePage(),
      ),
      GoRoute(
        path: MessagesPage.location,
        builder: (context, state) => const MessagesPage(),
      ),
      GoRoute(
        path: ContactsPage.location,
        builder: (context, state) => const ContactsPage(),
      ),
    ],
  ),
  // Routes ngoài navbar
  GoRoute(
    path: ChatPage.location,
    builder: (context, state) {
      final conversationId = state.uri.queryParameters['conversationId'];
      final conversationName = state.uri.queryParameters['name'];
      return ChatPage(
        conversationId: conversationId,
        conversationName: conversationName,
      );
    },
  ),
  GoRoute(
    path: ConversationInformationPage.location,
    builder: (context, state) => const ConversationInformationPage(),
  ),
  // Redirect từ prefix về home
  GoRoute(
    path: '/chat',
    redirect: (context, state) => MessagesPage.location,
  ),
];
```

### 11.2. Ví dụ: Training App với Permissions

**Router: `packages/supa_training/lib/router/router.dart`**
```dart
// ... imports ...

final List<RouteBase> trainingRoutes = [
  // ... các routes khác ...
  
  // Shell route với navbar
  ShellRoute(
    builder: (context, state, child) {
      return LanguageAwareNavbar(
        child: TrainingNavbar(child: child),
      );
    },
    routes: [
      GoRoute(
        path: TrainingHomePage.location,
        builder: (context, state) {
          final idStr = state.uri.queryParameters['id'];
          final id = idStr != null ? int.tryParse(idStr) : null;
          return TrainingHomePage(id: id);
        },
      ),
      GoRoute(
        path: CourseAssignmentEvaluationPage.location,
        builder: (context, state) => const CourseAssignmentEvaluationPage(),
      ),
      GoRoute(
        path: RankingPage.location,
        builder: (context, state) => const RankingPage(),
      ),
      // Redirect từ prefix về home
      GoRoute(
        path: '/training',
        redirect: (context, state) => TrainingHomePage.location,
      ),
    ],
  ),
];
```

### 11.3. Ví dụ: Documents App (Complete Example)

**1. Tạo package structure:**
```
packages/supa_documents/
├── lib/
│   ├── config/
│   │   ├── get_it.dart
│   │   └── get_it.config.dart
│   ├── core/
│   │   └── models/
│   │       ├── models.dart
│   │       └── document.dart
│   ├── notification/
│   │   └── documents_notification_handler.dart
│   ├── pages/
│   │   └── documents_home/
│   │       ├── documents_home_page.dart
│   │       └── documents_home_controller.dart
│   └── router/
│       └── router.dart
└── documents_app.dart
```

**2. Tạo DocumentsApp class:**
```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supa_architecture/supa_architecture.dart';
import 'package:supa_foundation/config/sub_system.dart';
import 'package:supa_foundation/theme/supa_material_theme.dart' as supa_theme;
import 'package:supa_foundation/theme/supa_theme_extension.dart';
import 'package:supa_documents/pages/documents_home/documents_home_page.dart';
import 'package:supa_documents/router/router.dart';

class DocumentsApp extends SubApp {
  @override
  String get homePage => DocumentsHomePage.location;

  @override
  String get label => 'Documents';

  @override
  String? get appIcon => 'assets/images/documents-icon.png';

  @override
  final List<RouteBase> routes = documentsRoutes;

  @override
  int? get subsystemId => AppSubSystem.documents.id;

  @override
  String get routePrefix => '/documents';

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

**3. Đăng ký trong main app:**
```dart
// Trong lib/main.dart
import 'package:supa_documents/documents_app.dart';

void _registerApps() {
  AppRegistry.registerApp('/supa', MainApp());
  // ... existing apps ...
  AppRegistry.registerApp('/documents', DocumentsApp()); // Thêm dòng này
}
```

**4. Cấu hình dependencies:**
```dart
// Thêm vào AppSubSystem enum
documents(
  id: 13,
  code: 'DOCUMENTS',
),

// Trong lib/config/get_it.dart
import 'package:supa_documents/config/get_it.dart';

// Trong configureDependencies():
await configureDocumentsDependencies(); // Thêm dòng này
```

## 12. Best Practices

### 12.1. SubApp Class

- **Subsystem ID**: Luôn định nghĩa subsystem ID trong `AppSubSystem` enum
- **Theme**: Sử dụng `SupaThemeExtension.withValues()` để tạo theme nhất quán
- **Route Prefix**: Prefix nên match với tên app (ví dụ: `/work`, `/project`)
- **Home Page**: Home page nên là route đầu tiên trong navbar

### 12.2. Dependencies

- **Get It Config**: Tạo file `get_it.dart` riêng cho mỗi sub-app
- **Models**: Sử dụng `JsonModel` và `JsonField` cho tất cả models từ backend
- **Registration**: Luôn gọi `configure<AppName>Dependencies()` trong main `configureDependencies()`

### 12.3. Navbar

- **Sử dụng `LanguageAwareNavbar`**: Wrap navbar để rebuild khi language thay đổi
- **Dynamic Items**: Sử dụng StatefulWidget + BlocBuilder nếu items phụ thuộc permissions
- **Translation Keys**: Luôn sử dụng translation keys cho labels
- **Icons**: Sử dụng FluentIcons từ `fluentui_system_icons` package

### 12.4. Routing

- **Location Constants**: Mỗi page nên có `static const location`
- **Path Prefix**: Routes nên bắt đầu bằng prefix của sub-app (ví dụ: `/work/...`)
- **Redirect Route**: Luôn có redirect từ prefix về home page
- **ShellRoute**: Sử dụng ShellRoute cho routes cần navbar
- **Type Safety**: Sử dụng `state.id`, `state.pathParameters`, `state.uri.queryParameters` thay vì string parsing

### 12.5. Main File

- **Bootstrap**: Luôn chờ `bootstrap()` hoàn tất
- **Register App**: Đăng ký app trước khi tạo router
- **Notification Handlers**: Đăng ký handlers sau khi register app
- **Error Builder**: Luôn cung cấp error builder cho router

### 12.6. Discussion Adapters

- **Entity Code**: Sử dụng entity code chính xác từ backend
- **Navigation**: Luôn update unread comments sau khi navigate
- **Display Name**: Sử dụng translation keys cho display names
- **Registration**: Đăng ký adapter trong `DiscussionEntityFactory._adapters`

### 12.7. Notification Handlers

- **Prefix Matching**: Sử dụng `registerPrefix()` để match routes theo prefix
- **Error Handling**: Luôn có fallback về default link navigation
- **Context Safety**: Kiểm tra `context.mounted` trước khi navigate

### 12.8. Cấu trúc thư mục

- **Tổ chức theo feature**: Nhóm các files liên quan lại với nhau
- **Atomic Design**: Tổ chức widgets theo atoms/molecules/organisms
- **Separation of Concerns**: Tách biệt pages, widgets, repositories, blocs

## 13. Tóm tắt

Quy trình phát triển sub-app hoàn chỉnh:

1. **Tạo SubApp Class**: Implement `SubApp` với các thuộc tính cần thiết
2. **Định nghĩa Sub-System**: Thêm vào `AppSubSystem` enum
3. **Cấu hình Dependencies**: Tạo `get_it.dart` và đăng ký trong main config
4. **Đăng ký Sub-App**: Đăng ký trong `main.dart` với `AppRegistry`
5. **Navbar**: Tạo widget extend `ScaffoldNavbar`, sử dụng `ScaffoldNavbarItem`
6. **Routing**: Tạo router với `ShellRoute` cho navbar routes, có redirect từ prefix
7. **Main File**: Bootstrap → Register app → Register handlers → Create router
8. **Discussion Adapters**: Tạo và đăng ký adapter nếu có discussion feature
9. **Notification Handlers**: Tạo và đăng ký handler cho push notifications
10. **Cấu trúc**: Tổ chức theo feature với các thư mục chuẩn (pages, widgets, repositories, etc.)

---

**Lưu ý quan trọng:**
- Luôn có redirect route từ prefix về home page
- Sử dụng `LanguageAwareNavbar` để wrap navbar
- Đăng ký app trong AppRegistry trước khi tạo router
- Routes nên có location constants
- Tổ chức code theo cấu trúc thư mục chuẩn
- Định nghĩa subsystem ID trong `AppSubSystem` enum
- Cấu hình dependencies với Get It cho mỗi sub-app
