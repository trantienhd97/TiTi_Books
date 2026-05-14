# Notification Handler System

## 1. Tổng quan

Hệ thống Notification Handler trong SupaMobileApp cho phép xử lý các push notification một cách có tổ chức và mở rộng. Mỗi loại notification được route đến handler tương ứng dựa trên URL prefix của notification.

### 1.1. Kiến trúc

```
UserNotification (từ backend)
    ↓
NotificationHandlerFactory.create() → Tìm handler dựa trên linkMobile prefix
    ↓
NotificationHandler.handle() → Xử lý notification cụ thể
    ↓
Navigation/UI Update
```

### 1.2. Các thành phần chính

- **`NotificationHandler`** (abstract class): Interface cho tất cả notification handlers
- **`NotificationHandlerFactory`**: Factory để tạo và quản lý handlers
- **`UserNotification`**: Model chứa thông tin notification từ backend
- **Các handler cụ thể**: Implement `NotificationHandler` cho từng loại notification

## 2. NotificationHandler Interface

### 2.1. Định nghĩa

File: `packages/supa_architecture/lib/services/notification_handler.dart`

```dart
abstract class NotificationHandler {
  final BuildContext context;

  NotificationHandler(this.context);

  FutureOr<void> handle(UserNotification userNofication);
}
```

### 2.2. Yêu cầu

- **`context`**: BuildContext để thực hiện navigation và hiển thị UI
- **`handle()`**: Method xử lý notification, có thể return `FutureOr<void>` hoặc `FutureOr<Object?>` (cho navigation result)

### 2.3. Ví dụ cơ bản

```dart
class MyNotificationHandler extends NotificationHandler {
  MyNotificationHandler(super.context);

  @override
  FutureOr<void> handle(UserNotification userNofication) {
    // Xử lý notification ở đây
    // Ví dụ: Navigate đến một page
    return GoRouter.of(context).push('/some-page');
  }
}
```

## 3. NotificationHandlerFactory

### 3.1. Định nghĩa

File: `packages/supa_notification/lib/src/notification_handler_factory.dart`

`NotificationHandlerFactory` là một factory class quản lý việc đăng ký và tạo handlers dựa trên URL prefix.

### 3.2. Các phương thức chính

**`registerPrefix()`**: Đăng ký handler cho một URL prefix

```dart
static void registerPrefix(
  String prefix,
  NotificationHandlerBuilder builder,
)
```

**`create()`**: Tạo handler phù hợp cho một notification

```dart
static NotificationHandler? create(
  BuildContext context,
  UserNotification userNotification,
)
```

### 3.3. Cách hoạt động

1. Factory lưu trữ danh sách các registration với prefix và builder
2. Khi nhận notification, factory kiểm tra `linkMobile` của notification
3. Tìm registration có prefix khớp với `linkMobile` (sử dụng `startsWith()`)
4. Tạo handler instance bằng builder và return

**Lưu ý**: Factory tự động normalize URL bằng cách thay thế `//` thành `/`

```dart
userNotification.linkMobile.value =
    userNotification.linkMobile.value.replaceAll('//', '/');
```

## 4. Đăng ký Notification Handler

### 4.1. File đăng ký chính

File: `lib/config/notification_handlers.dart`

Đây là nơi tập trung đăng ký tất cả notification handlers:

```dart
import 'package:supa_attendance/notification/clock_notification_handler.dart';
import 'package:supa_notification/supa_notification.dart';
import 'package:supa_project/notification/project_notification_handler.dart';
import 'package:supa_serving/notification/serving_notification_handler.dart';
import 'package:supa_training/notification/training_notification_handler.dart';
import 'package:supa_work/notification/work_notification_handler.dart';

void registerNotificationHandlers() {
  NotificationHandlerFactory.registerPrefix(
    '/project',
    (context) => ProjectNotificationHandler(context),
  );

  NotificationHandlerFactory.registerPrefix(
    '/work',
    (context) => WorkNotificationHandler(context),
  );

  NotificationHandlerFactory.registerPrefix(
    '/training',
    (context) => TrainingNotificationHandler(context),
  );

  NotificationHandlerFactory.registerPrefix(
    '/serving',
    (context) => ServingNotificationHandler(context),
  );

  NotificationHandlerFactory.registerPrefix(
    '/attendance',
    (context) => ClockNotificationHandler(context),
  );

  NotificationHandlerFactory.registerPrefix(
    '/clock',
    (context) => ClockNotificationHandler(context),
  );

  NotificationHandlerFactory.registerPrefix(
    '/spend',
    (context) => DefaultNotificationHandler(context),
  );
}
```

### 4.2. Gọi hàm đăng ký

Trong `lib/main.dart` hoặc các file `main_<app>.dart`:

```dart
Future<void> main() async {
  // ... bootstrap code ...

  registerNotificationHandlers(); // Đăng ký handlers

  runApp(SupaApp(...));
}
```

### 4.3. Thêm handler mới cho sub-app

**Bước 1: Tạo handler class**

Trong `packages/<app_name>/lib/notification/<app_name>_notification_handler.dart`:

```dart
import 'dart:async';
import 'package:go_router/go_router.dart';
import 'package:supa_architecture/supa_architecture.dart';
import 'package:supa_<app_name>/pages/home/<app_name>_home_page.dart';

class <AppName>NotificationHandler extends NotificationHandler {
  <AppName>NotificationHandler(super.context);

  @override
  FutureOr<void> handle(UserNotification userNofication) {
    final uri = Uri.parse(userNofication.linkMobile.value);

    // Xử lý các routes cụ thể
    if (uri.path == <AppName>HomePage.location) {
      return _handleHomeNotification(userNofication);
    }

    // Fallback: Navigate đến link
    return _goToLink(userNofication.linkMobile.value);
  }

  FutureOr<void> _handleHomeNotification(UserNotification userNofication) {
    // Logic xử lý cụ thể
    return GoRouter.of(context).push(<AppName>HomePage.location);
  }

  _goToLink(String uri) {
    return GoRouter.of(context).push(uri);
  }
}
```

**Bước 2: Đăng ký trong `notification_handlers.dart`**

Thêm vào `lib/config/notification_handlers.dart`:

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

## 5. Implement Notification Handler

### 5.1. Handler đơn giản (Default Handler)

Handler đơn giản nhất chỉ cần navigate đến URL:

```dart
import 'dart:async';
import 'package:go_router/go_router.dart';
import 'package:supa_architecture/supa_architecture.dart';

class DefaultNotificationHandler extends NotificationHandler {
  DefaultNotificationHandler(super.context);

  @override
  FutureOr<void> handle(UserNotification userNofication) {
    return _goToLink(userNofication.linkMobile.value);
  }

  _goToLink(String uri) {
    return GoRouter.of(context).push(uri);
  }
}
```

### 5.2. Handler với routing phức tạp

Handler có thể route đến các sub-handlers dựa trên path:

```dart
class WorkNotificationHandler extends NotificationHandler {
  WorkNotificationHandler(super.context);

  @override
  FutureOr<Object?> handle(UserNotification userNofication) {
    final uri = Uri.parse(userNofication.linkMobile.value);

    // Route đến handler cụ thể dựa trên path
    if (uri.path == TaskAssignmentPage.location) {
      return TaskAssignmentNotificationHandler(context).handle(userNofication);
    }

    if (uri.path == InspectionDetailNewPage.location) {
      return InspectionNotificationHandler(context).handle(userNofication);
    }

    if (uri.path == WorkHomePage.location) {
      return HomeInspectionNotificationHandler(context).handle(userNofication);
    }

    // Fallback: Navigate trực tiếp
    return _goToLink(userNofication.linkMobile.value);
  }

  _goToLink(String uri) {
    return GoRouter.of(context).push(uri);
  }
}
```

### 5.3. Handler với validation và error handling

Handler có thể validate parameters và hiển thị error:

```dart
class TaskAssignmentNotificationHandler extends NotificationHandler {
  TaskAssignmentNotificationHandler(super.context);

  @override
  Future<Object?> handle(UserNotification userNofication) async {
    userNofication.linkMobile.value =
        userNofication.linkMobile.value.replaceAll('//', '/');
    final uri = Uri.parse(userNofication.linkMobile.value);

    // Extract và validate parameters
    final String? id = uri.queryParameters['taskAssignmentId'];
    final int? idInt = int.tryParse(id ?? '');

    if (idInt == null) {
      // Hiển thị error message
      toastification.show(
        title: Text(translate('work.taskAssignment.notification')),
        description: Text(translate('work.taskAssignment.taskAssignmentNotFound')),
        type: ToastificationType.warning,
        autoCloseDuration: const Duration(seconds: 2),
      );
      return null;
    }

    // Navigate với validated parameter
    return Navigator.of(context, rootNavigator: true).push(
      MaterialPageRoute(
        fullscreenDialog: true,
        builder: (context) => TaskAssignmentEditPage(
          id: idInt,
        ),
      ),
    );
  }
}
```

### 5.4. Handler với nested routing

Handler có thể xử lý nested routes:

```dart
class TrainingNotificationHandler extends NotificationHandler {
  TrainingNotificationHandler(super.context);

  @override
  FutureOr<void> handle(UserNotification userNofication) {
    final uri = Uri.parse(userNofication.linkMobile.value);

    // Handle quiz notifications
    if (uri.path == QuizPreviewPage.location) {
      return QuizNotificationHandler(context).handle(userNofication);
    }

    // Handle training routes với prefix check
    if (uri.path.startsWith('/training')) {
      if (uri.path == CoursePreviewPage.location) {
        return CourseNotificationHandler(context).handle(userNofication);
      }
    }

    // Fallback
    return _goToLink(userNofication.linkMobile.value);
  }

  _goToLink(String uri) {
    return GoRouter.of(context).push(uri);
  }
}
```

## 6. Sử dụng Notification Handler

### 6.1. Tự động xử lý qua PushNotificationBloc

Handlers được gọi tự động khi có push notification:

```dart
// Trong app_registry.dart
BlocListener<PushNotificationBloc, PushNotificationState>(
  listener: (context, state) async {
    if (state is PushNotificationOpened) {
      final userNotification = state.data.toUserNotification();
      final notificationHandler =
          NotificationHandlerFactory.create(context, userNotification);
      await notificationHandler?.handle(userNotification);
    }
  },
  // ...
)
```

### 6.2. Xử lý thủ công

Bạn cũng có thể xử lý notification thủ công:

```dart
final userNotification = UserNotification(...);
final notificationHandler = 
    NotificationHandlerFactory.create(context, userNotification);
await notificationHandler?.handle(userNotification);
```

### 6.3. Xử lý khi tap vào notification

Trong `PushNotificationWrapper`:

```dart
PushNotificationWrapper(
  onNotificationTap: (userNotification) async {
    final notificationHandler =
        NotificationHandlerFactory.create(context, userNotification);
    await notificationHandler?.handle(userNotification);
  },
  // ...
)
```

## 7. UserNotification Model

### 7.1. Cấu trúc

`UserNotification` chứa thông tin từ backend, quan trọng nhất là `linkMobile`:

```dart
class UserNotification extends JsonModel {
  // ... các fields khác
  JsonString linkMobile = JsonString('linkMobile');
  // ...
}
```

### 7.2. linkMobile format

`linkMobile` thường có format:
- `/work/task-assignment?taskAssignmentId=123`
- `/project/task?projectId=456&taskId=789`
- `/training/course?courseId=101`

### 7.3. Query parameters

Bạn có thể extract query parameters từ `linkMobile`:

```dart
final uri = Uri.parse(userNofication.linkMobile.value);
final taskId = uri.queryParameters['taskAssignmentId'];
final projectId = uri.queryParameters['projectId'];
```

## 8. Best Practices

### 8.1. Tổ chức code

1. **Mỗi sub-app có handler riêng** trong `packages/<app_name>/lib/notification/`
2. **Handler chính** (`<AppName>NotificationHandler`) route đến các sub-handlers
3. **Sub-handlers** xử lý logic cụ thể cho từng loại notification

**Cấu trúc thư mục:**
```
packages/<app_name>/lib/notification/
├── <app_name>_notification_handler.dart      # Handler chính
├── <feature>_notification_handler.dart     # Sub-handlers
└── ...
```

### 8.2. Error handling

Luôn validate parameters và hiển thị error message phù hợp:

```dart
final id = uri.queryParameters['id'];
final idInt = int.tryParse(id ?? '');

if (idInt == null) {
  // Hiển thị error message
  toastification.show(
    title: Text('Error'),
    description: Text('Invalid ID'),
    type: ToastificationType.error,
  );
  return null;
}
```

### 8.3. Navigation

- Sử dụng `GoRouter` cho navigation thông thường
- Sử dụng `Navigator` với `rootNavigator: true` cho fullscreen dialogs
- Luôn có fallback navigation nếu không match route nào

### 8.4. URL normalization

Factory tự động normalize URL, nhưng bạn cũng nên normalize trong handler nếu cần:

```dart
userNofication.linkMobile.value =
    userNofication.linkMobile.value.replaceAll('//', '/');
```

### 8.5. Prefix matching

- Prefix nên match với route prefix của sub-app
- Ví dụ: `/work` cho Work app, `/project` cho Project app
- Có thể đăng ký nhiều prefix cho cùng một handler (ví dụ: `/attendance` và `/clock`)

### 8.6. Handler hierarchy

Tạo hierarchy handlers để tái sử dụng code:

```
MainHandler (WorkNotificationHandler)
  ├── SubHandler1 (TaskAssignmentNotificationHandler)
  ├── SubHandler2 (InspectionNotificationHandler)
  └── SubHandler3 (HomeInspectionNotificationHandler)
```

## 9. Ví dụ hoàn chỉnh

### 9.1. Tạo handler mới cho sub-app

**File: `packages/supa_myapp/lib/notification/myapp_notification_handler.dart`**

```dart
import 'dart:async';
import 'package:go_router/go_router.dart';
import 'package:supa_architecture/supa_architecture.dart';
import 'package:supa_myapp/pages/home/myapp_home_page.dart';
import 'package:supa_myapp/pages/detail/myapp_detail_page.dart';

class MyAppNotificationHandler extends NotificationHandler {
  MyAppNotificationHandler(super.context);

  @override
  FutureOr<void> handle(UserNotification userNofication) {
    final uri = Uri.parse(userNofication.linkMobile.value);

    // Handle home page
    if (uri.path == MyAppHomePage.location) {
      return _handleHome(userNofication);
    }

    // Handle detail page với ID
    if (uri.path == MyAppDetailPage.location) {
      return _handleDetail(userNofication);
    }

    // Fallback
    return _goToLink(userNofication.linkMobile.value);
  }

  FutureOr<void> _handleHome(UserNotification userNofication) {
    return GoRouter.of(context).push(MyAppHomePage.location);
  }

  FutureOr<void> _handleDetail(UserNotification userNofication) {
    final uri = Uri.parse(userNofication.linkMobile.value);
    final id = uri.queryParameters['id'];
    final idInt = int.tryParse(id ?? '');

    if (idInt == null) {
      // Show error
      return null;
    }

    return GoRouter.of(context).push(
      '${MyAppDetailPage.location}?id=$idInt',
    );
  }

  _goToLink(String uri) {
    return GoRouter.of(context).push(uri);
  }
}
```

**File: `lib/config/notification_handlers.dart`**

```dart
import 'package:supa_myapp/notification/myapp_notification_handler.dart';

void registerNotificationHandlers() {
  // ... existing registrations ...
  
  NotificationHandlerFactory.registerPrefix(
    '/myapp',
    (context) => MyAppNotificationHandler(context),
  );
}
```

### 9.2. Handler với sub-handlers

**File: `packages/supa_myapp/lib/notification/myapp_notification_handler.dart`**

```dart
import 'dart:async';
import 'package:go_router/go_router.dart';
import 'package:supa_architecture/supa_architecture.dart';
import 'package:supa_myapp/notification/feature1_notification_handler.dart';
import 'package:supa_myapp/notification/feature2_notification_handler.dart';
import 'package:supa_myapp/pages/home/myapp_home_page.dart';

class MyAppNotificationHandler extends NotificationHandler {
  MyAppNotificationHandler(super.context);

  @override
  FutureOr<void> handle(UserNotification userNofication) {
    final uri = Uri.parse(userNofication.linkMobile.value);

    // Route đến sub-handlers
    if (uri.path.startsWith('/myapp/feature1')) {
      return Feature1NotificationHandler(context).handle(userNofication);
    }

    if (uri.path.startsWith('/myapp/feature2')) {
      return Feature2NotificationHandler(context).handle(userNofication);
    }

    if (uri.path == MyAppHomePage.location) {
      return GoRouter.of(context).push(MyAppHomePage.location);
    }

    return _goToLink(userNofication.linkMobile.value);
  }

  _goToLink(String uri) {
    return GoRouter.of(context).push(uri);
  }
}
```

## 10. Troubleshooting

### 10.1. Handler không được gọi

**Kiểm tra:**
1. Đã gọi `registerNotificationHandlers()` trong `main()` chưa?
2. Prefix có match với `linkMobile` không?
3. URL có được normalize đúng không?

**Debug:**
```dart
// In ra linkMobile để debug
print('linkMobile: ${userNotification.linkMobile.value}');
```

### 10.2. Navigation không hoạt động

**Kiểm tra:**
1. Context có valid không?
2. Route có tồn tại trong router không?
3. Có đang ở đúng navigator context không?

**Sử dụng rootNavigator:**
```dart
Navigator.of(context, rootNavigator: true).push(...);
```

### 10.3. Handler không match prefix

**Kiểm tra:**
1. Prefix có đúng format không? (phải bắt đầu bằng `/`)
2. `linkMobile` có đúng format không?
3. Có nhiều handlers match không? (handler đầu tiên match sẽ được dùng)

## 11. Tóm tắt

1. **NotificationHandler**: Abstract class cần implement method `handle()`
2. **NotificationHandlerFactory**: Factory quản lý đăng ký và tạo handlers dựa trên prefix
3. **Đăng ký**: Sử dụng `NotificationHandlerFactory.registerPrefix()` trong `registerNotificationHandlers()`
4. **Prefix matching**: Factory tìm handler dựa trên `linkMobile.startsWith(prefix)`
5. **Handler hierarchy**: Handler chính route đến sub-handlers dựa trên path
6. **Error handling**: Luôn validate parameters và hiển thị error message
7. **Navigation**: Sử dụng `GoRouter` hoặc `Navigator` tùy vào use case

---

**Lưu ý quan trọng:**
- Luôn normalize URL (`replaceAll('//', '/')`)
- Prefix phải match với route prefix của sub-app
- Handler được gọi tự động qua `PushNotificationBloc`
- Mỗi sub-app nên có handler riêng trong `lib/notification/`
