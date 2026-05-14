# Discussion Entity Adapter System

## 1. Tổng quan

Hệ thống Discussion Entity Adapter trong SupaMobileApp cho phép xử lý navigation và hiển thị cho các discussion thuộc các entity types khác nhau. Mỗi entity type (như TaskAssignment, Inspection, v.v.) có adapter riêng để xử lý navigation và hiển thị tên entity.

### 1.1. Kiến trúc

```
Discussion (từ backend)
    ↓
DiscussionEntityFactory.getAdapter() → Tìm adapter dựa trên entityCode
    ↓
DiscussionEntityAdapter.handle() → Navigate và hiển thị
    ↓
Detail Page / Display Name
```

### 1.2. Các thành phần chính

- **`DiscussionEntityAdapter`** (abstract class): Interface cho tất cả adapters
- **`DiscussionEntityFactory`**: Factory để quản lý và tìm adapters
- **`Discussion`**: Model chứa thông tin discussion từ backend
- **Các adapter cụ thể**: Implement `DiscussionEntityAdapter` cho từng entity type

## 2. DiscussionEntityAdapter Interface

### 2.1. Định nghĩa

File: `lib/modules/discussion/discussion_entity_adapter.dart`

```dart
abstract class DiscussionEntityAdapter {
  /// The entity code that this adapter handles
  String get entityCode;

  /// Navigate to the detail page for this entity
  Future<void> navigateToDetail(
    BuildContext context,
    Discussion discussion,
  );

  /// Get the display name for this entity type
  String getEntityDisplayName(Discussion discussion);

  /// Check if this adapter can handle the given discussion
  bool canHandle(Discussion discussion) {
    return discussion.requisitionEntity.value.code.value == entityCode;
  }
}
```

### 2.2. Các phương thức yêu cầu

**`entityCode`**: Mã định danh của entity type (ví dụ: `'TaskAssignment'`, `'Inspection'`)

**`navigateToDetail()`**: Navigate đến trang detail của entity khi user tap vào discussion

**`getEntityDisplayName()`**: Trả về tên hiển thị (localized) của entity type

**`canHandle()`**: Kiểm tra xem adapter có thể xử lý discussion này không (dựa trên entityCode)

### 2.3. Ví dụ cơ bản

```dart
class MyEntityAdapter extends DiscussionEntityAdapter {
  @override
  String get entityCode => 'MyEntity';

  @override
  Future<void> navigateToDetail(
    BuildContext context,
    Discussion discussion,
  ) async {
    // Navigate đến detail page
    await GoRouter.of(context).push(
      MyEntityDetailPage.location.withId(discussion.requestId.value),
    );
  }

  @override
  String getEntityDisplayName(Discussion discussion) {
    return 'My Entity';
  }
}
```

## 3. DiscussionEntityFactory

### 3.1. Định nghĩa

File: `lib/modules/discussion/discussion_entity_factory.dart`

`DiscussionEntityFactory` là một factory class quản lý danh sách adapters và cung cấp adapter phù hợp cho một discussion.

### 3.2. Các phương thức chính

**`getAdapter()`**: Tìm adapter phù hợp cho một discussion

```dart
static DiscussionEntityAdapter? getAdapter(Discussion discussion)
```

**`getAdapterByCode()`**: Tìm adapter theo entity code

```dart
static DiscussionEntityAdapter? getAdapterByCode(String entityCode)
```

**`registerAdapter()`**: Đăng ký adapter mới (runtime registration)

```dart
static void registerAdapter(DiscussionEntityAdapter adapter)
```

**`getSupportedEntityCodes()`**: Lấy danh sách tất cả entity codes được hỗ trợ

```dart
static List<String> getSupportedEntityCodes()
```

### 3.3. Cách hoạt động

1. Factory lưu trữ danh sách các adapters trong `_adapters`
2. Khi cần adapter, factory duyệt qua danh sách và tìm adapter có `canHandle()` return `true`
3. Adapter đầu tiên match sẽ được return
4. Nếu không tìm thấy, return `null`

### 3.4. Đăng ký adapters

Adapters được đăng ký trong `_adapters` list:

```dart
static final List<DiscussionEntityAdapter> _adapters = [
  WorkTaskAdapter(),
  InspectionAdapter(),
];
```

## 4. Đăng ký Discussion Entity Adapter

### 4.1. File đăng ký chính

File: `lib/modules/discussion/discussion_entity_factory.dart`

Đây là nơi tập trung đăng ký tất cả discussion entity adapters:

```dart
import 'adapters/inspection_adapter.dart';
import 'adapters/work_task_adapter.dart';
import 'discussion_entity_adapter.dart';

class DiscussionEntityFactory {
  // ...
  
  static final List<DiscussionEntityAdapter> _adapters = [
    WorkTaskAdapter(),      // Adapter cho TaskAssignment
    InspectionAdapter(),    // Adapter cho Inspection
  ];
  
  // ...
}
```

### 4.2. Thêm adapter mới

**Bước 1: Tạo adapter class**

Trong `lib/modules/discussion/adapters/<entity_name>_adapter.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supa_architecture/supa_architecture.dart';
import 'package:supa_<app_name>/pages/detail/<entity>_detail_page.dart';
import 'package:supa_foundation/blocs/unread_comment/unread_comment_bloc.dart';
import 'package:supa_foundation/config/get_it.dart';
import 'package:supa_l10n_manager/translator.dart';

import '../discussion_entity_adapter.dart';

/// Adapter for handling <EntityName> discussions
class <EntityName>Adapter extends DiscussionEntityAdapter {
  @override
  String get entityCode => '<EntityCode>'; // Ví dụ: 'TaskAssignment', 'Inspection'

  @override
  Future<void> navigateToDetail(
    BuildContext context,
    Discussion discussion,
  ) async {
    // Tạo entity instance từ discussion data
    final entity = <EntityName>()
      ..id.value = discussion.requestId.value
      ..isScroll.value = true; // Optional: để scroll đến comment khi mở page

    // Navigate đến detail page
    await GoRouter.of(context).push(
      <EntityName>DetailPage.location.withId(discussion.requestId.value),
      extra: entity,
    );

    // Update unread comments sau khi navigate
    getIt.get<UnreadCommentCubit>().loadUnreadComment();
  }

  @override
  String getEntityDisplayName(Discussion discussion) {
    // Trả về tên hiển thị localized
    return discussion.requisitionEntity.value.code.value.isNotEmpty &&
            discussion.requisitionEntity.value.code.value == '<EntityCode>'
        ? translate('<app_name>.navbar.<entity_name>') // Key translation
        : '<EntityName>'; // Fallback
  }
}
```

**Bước 2: Import và đăng ký trong factory**

Thêm vào `lib/modules/discussion/discussion_entity_factory.dart`:

```dart
import 'adapters/<entity_name>_adapter.dart';

class DiscussionEntityFactory {
  // ...
  
  static final List<DiscussionEntityAdapter> _adapters = [
    WorkTaskAdapter(),
    InspectionAdapter(),
    <EntityName>Adapter(), // Thêm adapter mới
  ];
  
  // ...
}
```

### 4.3. Đăng ký runtime (tùy chọn)

Bạn cũng có thể đăng ký adapter tại runtime:

```dart
DiscussionEntityFactory.registerAdapter(MyCustomAdapter());
```

**Lưu ý**: Nếu adapter với cùng `entityCode` đã tồn tại, nó sẽ được thay thế.

## 5. Implement Discussion Entity Adapter

### 5.1. Adapter đơn giản

Adapter đơn giản nhất chỉ cần navigate và trả về display name:

```dart
class SimpleEntityAdapter extends DiscussionEntityAdapter {
  @override
  String get entityCode => 'SimpleEntity';

  @override
  Future<void> navigateToDetail(
    BuildContext context,
    Discussion discussion,
  ) async {
    await GoRouter.of(context).push(
      SimpleEntityDetailPage.location.withId(discussion.requestId.value),
    );
  }

  @override
  String getEntityDisplayName(Discussion discussion) {
    return 'Simple Entity';
  }
}
```

### 5.2. Adapter với entity instance

Adapter có thể tạo entity instance và pass vào detail page:

```dart
class WorkTaskAdapter extends DiscussionEntityAdapter {
  @override
  String get entityCode => 'TaskAssignment';

  @override
  Future<void> navigateToDetail(
    BuildContext context,
    Discussion discussion,
  ) async {
    // Tạo TaskAssignment instance từ discussion
    final taskAssignment = TaskAssignment()
      ..id.value = discussion.requestId.value
      ..isScroll.value = true; // Để scroll đến comment

    // Navigate với entity instance
    await GoRouter.of(context).push(
      TaskAssignmentEditPage.location.withId(discussion.requestId.value),
      extra: taskAssignment, // Pass entity instance
    );

    // Reload unread comments
    getIt.get<UnreadCommentCubit>().loadUnreadComment();
  }

  @override
  String getEntityDisplayName(Discussion discussion) {
    return discussion.requisitionEntity.value.code.value.isNotEmpty &&
            discussion.requisitionEntity.value.code.value == 'TaskAssignment'
        ? translate('work.navbar.taskAssignment')
        : 'Work Task';
  }
}
```

### 5.3. Adapter với validation

Adapter có thể validate data trước khi navigate:

```dart
class ValidatedEntityAdapter extends DiscussionEntityAdapter {
  @override
  String get entityCode => 'ValidatedEntity';

  @override
  Future<void> navigateToDetail(
    BuildContext context,
    Discussion discussion,
  ) async {
    // Validate requestId
    if (discussion.requestId.value <= 0) {
      // Show error hoặc return early
      return;
    }

    // Navigate với validated data
    await GoRouter.of(context).push(
      ValidatedEntityDetailPage.location.withId(discussion.requestId.value),
    );
  }

  @override
  String getEntityDisplayName(Discussion discussion) {
    return 'Validated Entity';
  }
}
```

### 5.4. Adapter với unread comment update

Adapter nên update unread comments sau khi navigate:

```dart
class InspectionAdapter extends DiscussionEntityAdapter {
  @override
  String get entityCode => 'Inspection';

  @override
  Future<void> navigateToDetail(
    BuildContext context,
    Discussion discussion,
  ) async {
    final inspection = Inspection()
      ..id.value = discussion.requestId.value
      ..isScroll.value = true;

    await GoRouter.of(context).push(
      InspectionDetailNewPage.location.withId(discussion.requestId.value),
      extra: inspection,
    );

    // Update unread comments sau khi navigate
    // Kiểm tra context.mounted để tránh warning
    if (context.mounted) {
      getIt.get<UnreadCommentCubit>().loadUnreadComment();
    }
  }

  @override
  String getEntityDisplayName(Discussion discussion) {
    return discussion.requisitionEntity.value.code.value.isNotEmpty &&
            discussion.requisitionEntity.value.code.value == 'Inspection'
        ? translate('work.navbar.inspection')
        : 'Inspection';
  }
}
```

## 6. Sử dụng Discussion Entity Adapter

### 6.1. Sử dụng trong DiscussionHelper

`DiscussionHelper` sử dụng factory để tạo callbacks cho discussion page:

```dart
// Trong discussion_helper.dart
static Future<void> Function(BuildContext context, Discussion discussion)
    createOnDiscussionTap() {
  return (BuildContext context, Discussion discussion) async {
    // Kiểm tra subsystem (optional)
    if (discussion.requisitionEntity.value.subSystemId.value ==
            AppSubSystem.work.id ||
        discussion.requisitionEntity.value.subSystemId.value ==
            AppSubSystem.project.id) {
      // Lấy adapter phù hợp
      final adapter = DiscussionEntityFactory.getAdapter(discussion);

      if (adapter != null) {
        // Navigate sử dụng adapter
        await adapter.navigateToDetail(context, discussion);

        // Reload unread comments
        if (context.mounted) {
          getIt.get<UnreadCommentCubit>().loadUnreadComment();
        }
      }
    }
  };
}
```

### 6.2. Sử dụng trực tiếp

Bạn cũng có thể sử dụng factory trực tiếp:

```dart
// Lấy adapter cho một discussion
final adapter = DiscussionEntityFactory.getAdapter(discussion);
if (adapter != null) {
  await adapter.navigateToDetail(context, discussion);
}

// Hoặc lấy adapter theo entity code
final adapter = DiscussionEntityFactory.getAdapterByCode('TaskAssignment');
if (adapter != null) {
  final displayName = adapter.getEntityDisplayName(discussion);
}
```

### 6.3. Sử dụng trong DiscussionPage

`DiscussionPage` sử dụng callbacks từ `DiscussionHelper`:

```dart
// Trong router
DiscussionHelper.createDiscussionRoute()

// Tạo page với callbacks
DiscussionPage(
  onDiscussionTap: DiscussionHelper.createOnDiscussionTap(),
  getEntityDisplayName: DiscussionHelper.createGetEntityDisplayName(),
)
```

## 7. Discussion Model

### 7.1. Cấu trúc

`Discussion` chứa thông tin từ backend, quan trọng nhất là `requisitionEntity` và `requestId`:

```dart
class Discussion extends JsonModel {
  // ...
  JsonInteger requestId = JsonInteger('requestId');
  JsonObject<RequisitionEntity> requisitionEntity = 
      JsonObject<RequisitionEntity>('requisitionEntity');
  // ...
}
```

### 7.2. RequisitionEntity

`RequisitionEntity` chứa thông tin về entity type:

```dart
class RequisitionEntity extends JsonModel {
  JsonString code = JsonString('code'); // Entity code: 'TaskAssignment', 'Inspection', etc.
  JsonString name = JsonString('name'); // Entity name
  JsonInteger subSystemId = JsonInteger('subSystemId'); // Subsystem ID
  // ...
}
```

### 7.3. Sử dụng trong adapter

```dart
// Lấy entity code
final entityCode = discussion.requisitionEntity.value.code.value;

// Lấy request ID
final requestId = discussion.requestId.value;

// Kiểm tra subsystem
final subSystemId = discussion.requisitionEntity.value.subSystemId.value;
```

## 8. Best Practices

### 8.1. Tổ chức code

1. **Mỗi entity type có adapter riêng** trong `lib/modules/discussion/adapters/`
2. **Adapters được đăng ký** trong `discussion_entity_factory.dart`
3. **Entity code** phải match với code từ backend

**Cấu trúc thư mục:**
```
lib/modules/discussion/
├── discussion_entity_adapter.dart      # Abstract class
├── discussion_entity_factory.dart      # Factory với danh sách adapters
├── discussion_helper.dart              # Helper functions
└── adapters/
    ├── work_task_adapter.dart          # Adapter cho TaskAssignment
    ├── inspection_adapter.dart        # Adapter cho Inspection
    └── <entity_name>_adapter.dart    # Adapter mới
```

### 8.2. Entity code

- Entity code phải match chính xác với code từ backend
- Sử dụng constant hoặc enum để tránh typo
- Ví dụ: `'TaskAssignment'`, `'Inspection'` (case-sensitive)

### 8.3. Navigation

- Sử dụng `GoRouter` cho navigation
- Pass entity instance qua `extra` parameter nếu cần
- Set `isScroll.value = true` nếu muốn scroll đến comment khi mở page

### 8.4. Unread comments

- Luôn reload unread comments sau khi navigate
- Kiểm tra `context.mounted` trước khi access GetIt

```dart
if (context.mounted) {
  getIt.get<UnreadCommentCubit>().loadUnreadComment();
}
```

### 8.5. Display name

- Sử dụng translation keys cho display name
- Fallback về entity name nếu không có translation
- Kiểm tra entity code trước khi translate

### 8.6. Error handling

- Validate `requestId` trước khi navigate
- Handle trường hợp adapter không tìm thấy (return null)
- Không throw exception trong adapter

### 8.7. Subsystem filtering

- Có thể filter discussions theo subsystem trong `DiscussionHelper`
- Chỉ xử lý discussions từ các subsystems được hỗ trợ

## 9. Ví dụ hoàn chỉnh

### 9.1. Tạo adapter mới cho entity type

**File: `lib/modules/discussion/adapters/project_task_adapter.dart`**

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supa_architecture/supa_architecture.dart';
import 'package:supa_foundation/blocs/unread_comment/unread_comment_bloc.dart';
import 'package:supa_foundation/config/get_it.dart';
import 'package:supa_l10n_manager/translator.dart';
import 'package:supa_project/pages/tasks/project_task_page.dart';

import '../discussion_entity_adapter.dart';

/// Adapter for handling Project Task discussions
class ProjectTaskAdapter extends DiscussionEntityAdapter {
  @override
  String get entityCode => 'ProjectTask';

  @override
  Future<void> navigateToDetail(
    BuildContext context,
    Discussion discussion,
  ) async {
    // Tạo ProjectTask instance (nếu cần)
    // final projectTask = ProjectTask()
    //   ..id.value = discussion.requestId.value
    //   ..isScroll.value = true;

    // Navigate đến project task page
    await GoRouter.of(context).push(
      ProjectTaskPage.location.withId(discussion.requestId.value),
      // extra: projectTask, // Nếu cần pass entity
    );

    // Update unread comments
    if (context.mounted) {
      getIt.get<UnreadCommentCubit>().loadUnreadComment();
    }
  }

  @override
  String getEntityDisplayName(Discussion discussion) {
    return discussion.requisitionEntity.value.code.value.isNotEmpty &&
            discussion.requisitionEntity.value.code.value == 'ProjectTask'
        ? translate('project.navbar.task')
        : 'Project Task';
  }
}
```

**File: `lib/modules/discussion/discussion_entity_factory.dart`**

```dart
import 'adapters/inspection_adapter.dart';
import 'adapters/work_task_adapter.dart';
import 'adapters/project_task_adapter.dart'; // Import adapter mới
import 'discussion_entity_adapter.dart';

class DiscussionEntityFactory {
  // ...
  
  static final List<DiscussionEntityAdapter> _adapters = [
    WorkTaskAdapter(),
    InspectionAdapter(),
    ProjectTaskAdapter(), // Thêm adapter mới
  ];
  
  // ...
}
```

### 9.2. Adapter với nhiều logic phức tạp

```dart
class ComplexEntityAdapter extends DiscussionEntityAdapter {
  @override
  String get entityCode => 'ComplexEntity';

  @override
  Future<void> navigateToDetail(
    BuildContext context,
    Discussion discussion,
  ) async {
    // Validate data
    if (discussion.requestId.value <= 0) {
      // Log error hoặc show message
      return;
    }

    // Tạo entity với nhiều thông tin
    final entity = ComplexEntity()
      ..id.value = discussion.requestId.value
      ..isScroll.value = true
      ..someProperty.value = discussion.someField.value;

    // Navigate với query parameters
    final location = ComplexEntityDetailPage.location.withId(
      discussion.requestId.value,
    );
    
    await GoRouter.of(context).push(
      location,
      extra: entity,
    );

    // Update unread comments
    if (context.mounted) {
      getIt.get<UnreadCommentCubit>().loadUnreadComment();
    }
  }

  @override
  String getEntityDisplayName(Discussion discussion) {
    // Logic phức tạp để lấy display name
    final code = discussion.requisitionEntity.value.code.value;
    
    if (code == 'ComplexEntity') {
      return translate('complex.entity.name');
    }
    
    // Fallback
    return discussion.requisitionEntity.value.name.value.isNotEmpty
        ? discussion.requisitionEntity.value.name.value
        : 'Complex Entity';
  }
}
```

## 10. Troubleshooting

### 10.1. Adapter không được gọi

**Kiểm tra:**
1. Adapter đã được thêm vào `_adapters` list chưa?
2. `entityCode` có match với code từ backend không?
3. `canHandle()` có return `true` không?

**Debug:**
```dart
// In ra entity code để debug
print('Entity code: ${discussion.requisitionEntity.value.code.value}');

// Kiểm tra adapter có được tìm thấy không
final adapter = DiscussionEntityFactory.getAdapter(discussion);
print('Adapter found: ${adapter != null}');
```

### 10.2. Navigation không hoạt động

**Kiểm tra:**
1. Context có valid không?
2. Route có tồn tại trong router không?
3. `requestId` có hợp lệ không?

**Sử dụng try-catch:**
```dart
@override
Future<void> navigateToDetail(
  BuildContext context,
  Discussion discussion,
) async {
  try {
    await GoRouter.of(context).push(...);
  } catch (e) {
    // Log error
    print('Navigation error: $e');
  }
}
```

### 10.3. Display name không hiển thị đúng

**Kiểm tra:**
1. Translation key có tồn tại không?
2. Entity code có match không?
3. Fallback logic có đúng không?

**Test:**
```dart
final displayName = adapter.getEntityDisplayName(discussion);
print('Display name: $displayName');
```

### 10.4. Unread comments không update

**Kiểm tra:**
1. Đã check `context.mounted` chưa?
2. `UnreadCommentCubit` có được inject đúng không?
3. `loadUnreadComment()` có được gọi sau navigation không?

## 11. Tóm tắt

1. **DiscussionEntityAdapter**: Abstract class cần implement `entityCode`, `navigateToDetail()`, và `getEntityDisplayName()`
2. **DiscussionEntityFactory**: Factory quản lý danh sách adapters và tìm adapter phù hợp
3. **Đăng ký**: Thêm adapter vào `_adapters` list trong factory
4. **Entity code matching**: Factory tìm adapter dựa trên `canHandle()` method
5. **Navigation**: Sử dụng `GoRouter` và pass entity instance qua `extra`
6. **Unread comments**: Luôn reload sau navigation
7. **Display name**: Sử dụng translation keys với fallback

---

**Lưu ý quan trọng:**
- Entity code phải match chính xác với code từ backend (case-sensitive)
- Luôn update unread comments sau khi navigate
- Kiểm tra `context.mounted` trước khi access GetIt
- Mỗi entity type nên có adapter riêng trong `lib/modules/discussion/adapters/`
- Sử dụng translation keys cho display name với fallback logic
