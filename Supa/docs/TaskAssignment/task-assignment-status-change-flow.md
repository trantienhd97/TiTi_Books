# Task Assignment Status Change Flow

Tài liệu mô tả luồng chuyển trạng thái nhanh (Quick Status Change) cho Task Assignment.

## Tổng quan

Widget `TaskAssignmentStatusIcon` cho phép user tap vào icon để chuyển trạng thái công việc nhanh chóng.

## Luồng thực hiện

### 1. Kiểm tra điều kiện hiển thị

**File:** `task_assignment_status_icon.dart` - `build()`

```dart
if (widget.item.canQuickComplete.value == true) {
  // Hiển thị icon có thể tap
  return GestureDetector(onTapDown: ..., child: _buildStatusIcon(...));
}
// Hiển thị icon không tap được
return _buildStatusIcon(Theme.of(context));
```

**Điều kiện:**

- `canQuickComplete = true` → Icon có thể tap để chuyển trạng thái
- `canQuickComplete = false` → Icon chỉ hiển thị, không tương tác

---

### 2. Hiển thị icon theo trạng thái hiện tại

**File:** `task_assignment_status_icon.dart` - `_buildStatusIcon()`

**Icons theo status:**

- **NEW (Cần làm):** `FluentIcons.circle_hint_24_regular` - Tròn rỗng
- **DOING (Đang làm):** `FluentIcons.circle_hint_half_vertical_20_regular` - Nửa tròn xanh
- **COMPLETED (Hoàn thành):** `FluentIcons.checkmark_circle_24_filled` - Check xanh
- **TERMINATED (Không thể):** `FluentIcons.circle_hint_dismiss_20_regular` - X đỏ

---

### 3. User tap vào icon

**File:** `task_assignment_status_icon.dart` - `_onStatusIconTap()`

#### 3.1. Gọi API lấy danh sách actions có thể thực hiện

```dart
final statuses = await repository.singleListTaskChangeStatusActionType(
  item.id.value,
  isQuickAction: true,
);
```

**API:** `POST /rpc/work/task-assignment/single-list-task-change-status-action-type`

**Request:**

```json
{
  "taskAssignmentId": 123,
  "isQuickAction": true
}
```

**Response:** Danh sách `TaskAssignmentStatus[]` - Các action user được phép thực hiện

**Backend logic xử lý:**

- Check quyền của user (assignee/supporter)
- Check completion mode (ONE/ALL)
- Check trạng thái hiện tại của task và user
- Trả về list actions phù hợp theo Decision Table

---

#### 3.2. Xử lý theo số lượng actions

**Trường hợp 1: Không có action nào (`statuses.isEmpty`)**

```dart
// Hiển thị popup "..." (placeholder) - User không có quyền hoặc không thể chuyển
await showMenu(items: [PopupMenuItem(child: Text('...'))]);
```

**Trường hợp 2: Có nhiều actions (`statuses.length > 1`)**

```dart
// Hiển thị popup menu cho user chọn action
final selectedStatus = await showMenu<TaskAssignmentStatus>(
  items: statuses.map((status) => PopupMenuItem(
    value: status,
    child: Text(status.name.value), // Ví dụ: "Hoàn thành", "Mở lại"
  )).toList(),
);
```

**Ví dụ menu hiển thị:**

- "Tôi đã hoàn thành" (I_COMPLETED)
- "Hoàn thành cho tất cả" (COMPLETE_FOR_ALL)

**Trường hợp 3: Chỉ có 1 action (`statuses.length == 1`)**

```dart
// Chuyển trạng thái trực tiếp không cần menu
await _onStatusActionSelected(buildContext, statuses.first, item);
```

---

### 4. User chọn action (hoặc auto chọn nếu chỉ 1 action)

**File:** `task_assignment_status_icon.dart` - `_onStatusActionSelected()`

#### 4.1. Kiểm tra yêu cầu form/media

```dart
if (status.isMediaRequired.value || status.isNoteRequired.value) {
  // Hiển thị modal để nhập note và/hoặc upload media
  await showCustomModalBottomSheet(...);
}
```

**Nếu cần form:**

- Hiển thị `FormChangeStatus` modal
- User nhập note (nếu `isNoteRequired = true`)
- User upload ảnh (nếu `isMediaRequired = true`)
- Tap "Submit"

#### 4.2. Chuẩn bị input data

```dart
final TaskAssignment input = TaskAssignment()
  ..id.value = item.id.value
  ..taskChangeStatusActionTypeId.value = status.id.value
  ..comment.value = note; // Nếu có

if (file != null) {
  // Upload file trước
  final uploadedFiles = await WorkFileRepository()
      .uploadFilesFromImagePicker([file]);
  input.image.value = uploadedFiles[0];
  input.imageId.value = uploadedFiles[0].id.value;
}
```

---

### 5. Gọi API cập nhật trạng thái

**File:** `task_assignment_status_icon.dart` - `_performUpdateStatus()`

```dart
final updatedItem = await repository.updateStatus(input);
```

**API:** `POST /rpc/work/task-assignment/update-status`

**Request:**

```json
{
  "id": 123,
  "taskChangeStatusActionTypeId": 5,
  "comment": "Đã hoàn thành công việc",
  "imageId": 456
}
```

**Response:** `TaskAssignment` object đã được cập nhật

---

### 6. Cập nhật UI và thông báo

```dart
// Cập nhật local state
item.taskAssignmentStatusId.value = updatedItem.taskAssignmentStatusId.value;

// Gọi callback để refresh list
widget.onStatusUpdated?.call();

// Hiển thị toast success
toastification.show(
  title: Text('Thành công'),
  description: Text('Cập nhật trạng thái thành công'),
  type: ToastificationType.success,
);
```

**Kết quả:**

- Icon đổi màu/hình dạng theo trạng thái mới
- Task list refresh
- Toast hiển thị thông báo thành công

---

## Sơ đồ tổng quan

```
User tap icon
    ↓
Check canQuickComplete?
    ↓
Gọi API: singleListTaskChangeStatusActionType(taskId, isQuickAction: true)
    ↓
Backend trả về danh sách actions (Decision Table logic)
    ↓
    ├─ 0 actions → Hiển thị popup "..."
    ├─ 1 action → Chuyển trạng thái trực tiếp
    └─ 2+ actions → Hiển thị menu cho user chọn
        ↓
    User chọn action
        ↓
    Check isMediaRequired / isNoteRequired?
        ↓
        ├─ Yes → Hiển thị FormChangeStatus modal
        │         ↓
        │     User nhập note/upload media
        │         ↓
        │     Upload file (nếu có)
        │         ↓
        └─ No → Tiếp tục
            ↓
    Gọi API: updateStatus(input)
        ↓
    Backend xử lý và trả về updated item
        ↓
    Update UI + Show toast success
```

---

## Các API sử dụng

### 1. GET Available Actions

**Endpoint:** `POST /rpc/work/task-assignment/single-list-task-change-status-action-type`

**Mục đích:** Lấy danh sách actions mà user có thể thực hiện

**Request:**

```json
{
  "taskAssignmentId": number,
  "isQuickAction": boolean  // Mặc định true cho quick action
}
```

**Response:**

```json
[
  {
    "id": number,
    "name": string,
    "isMediaRequired": boolean,
    "isNoteRequired": boolean,
    "code": string, // "COMPLETE", "REOPEN", etc.
    "isQuickAction": boolean  // Mặc định true
  }
]
```

**Backend xử lý:**

- Check `CanComplete`, `CanTodo` của user
- Check `IsAssignee`, `IsSupporter`, `IsAdmin`
- Check `TaskAssignmentSelfStatusId` (S)
- Check `TaskAssignmentStatusId` (T)
- Check `IsRequiredChecklist` (F)
- Check `TaskAssignmentCompleteTypeId` (M)
- Check `IsLastPendingUser` (LC)
- Áp dụng Decision Table logic
- Trả về danh sách actions phù hợp

### 2. Update Status

**Endpoint:** `POST /rpc/work/task-assignment/update-status`

**Mục đích:** Cập nhật trạng thái task

**Request:**

```json
{
  "id": number,
  "taskChangeStatusActionTypeId": number,
  "comment": string?, // Optional
  "imageId": number?  // Optional
}
```

**Response:**

```json
{
  "id": number,
  "taskAssignmentStatusId": number,
  // ... other TaskAssignment fields
}
```

---

## Models & Enums

### TaskAssignmentStatusEnum

```dart
enum TaskAssignmentStatusEnum {
  NEW(1),        // Cần làm
  DOING(2),      // Đang làm
  COMPLETED(3),  // Hoàn thành
  TERMINATED(4); // Không thể
}
```

### TaskAssignmentCompleteType

```dart
// SELF_OPEN (id: 3, code: "ONE")
// - Chỉ cần 1 người hoàn thành
// - User có thể mark "Hoàn thành" hoặc "Mở lại"

// ALL_OPEN (id: 2, code: "ALL")
// - Tất cả assignees phải hoàn thành
// - User có thể mark "Tôi đã hoàn thành" hoặc "Hoàn thành cho tất cả" (nếu có quyền)
```

### Các điều kiện từ Backend

**CanComplete (R):** User có quyền đổi trạng thái sang Hoàn thành

**CanTodo:** User có quyền đổi trạng thái về Cần làm

**TaskAssignmentSelfStatusId (S):** Trạng thái của user trong task (giá trị giống TaskAssignmentStatus enum). Chỉ có giá trị khi user thuộc nhóm được giao việc/hỗ trợ. User bên ngoài nhìn thấy task nhưng không nằm trong nhóm này thì trường này không có giá trị.

**TaskAssignmentStatusId (T):** Trạng thái task hiện tại

**IsRequiredChecklist (F):** `= true` khi có yêu cầu hoàn thành checklist VÀ user chưa hoàn thành xong. Ngược lại là đã hoàn thành hoặc không yêu cầu checklist.

**TaskAssignmentCompleteTypeId (M):** Completion mode (ONE/ALL)

**IsLastPendingUser (LC):** User là người cuối cùng cần hoàn thành

**IsAssignee:** `= true` nếu user là người thực hiện

**IsSupporter:** `= true` nếu user là người hỗ trợ

**IsAdmin:** Check từ response của API `get-info`

**Lưu ý:** API `SingleListTaskChangeStatusActionType` mặc định có `IsQuickAction = true`

---

## Files liên quan

- `packages/supa_work/lib/pages/task_assignment/widgets/task_assignment_status_icon.dart` - Widget chính
- `packages/supa_work/lib/pages/task_assignment/widgets/task_assignment_item.dart` - Sử dụng TaskAssignmentStatusIcon
- `packages/supa_work/lib/pages/task_assignment/widgets/form_change_status/form_change_status.dart` - Modal form nhập note/media
- `packages/supa_work/lib/repositories/mobile_task_assignment_repository.dart` - API calls
- `packages/supa_work/lib/core/extensions/task_assignment_extensions.dart` - Helper methods
- `docs/quick-status-change-implementation.md` - Tài liệu chi tiết về Decision Table

---

## Testing Checklist

- [ ] User với `canQuickComplete = false` không tap được icon
- [ ] User với 0 actions thấy popup "..."
- [ ] User với 1 action chuyển trạng thái trực tiếp
- [ ] User với 2+ actions thấy menu chọn
- [ ] Action yêu cầu media/note → hiển thị modal form
- [ ] Upload media thành công trước khi update status
- [ ] API updateStatus gọi thành công
- [ ] UI update đúng icon sau khi chuyển trạng thái
- [ ] Toast success hiển thị
- [ ] Callback `onStatusUpdated` được gọi để refresh list
- [ ] Kiểm tra các trường hợp ONE mode: Complete, Reopen
- [ ] Kiểm tra các trường hợp ALL mode: I_COMPLETED, COMPLETE_FOR_ALL, REOPEN_FOR_ME, REOPEN_FOR_ALL
