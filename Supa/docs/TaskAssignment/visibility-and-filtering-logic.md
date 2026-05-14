# Visibility and Filtering Logic

Tài liệu mô tả các quy tắc hiển thị và phương pháp tối ưu hóa danh sách công việc (Task Assignment) trên Dashboard và các trang danh sách cá nhân.

## 1. Quy tắc hiển thị (Visibility Rules)

Để xác định một công việc có nên hiển thị trong danh sách "Việc của tôi" (My Tasks) hay không, hệ thống sử dụng class tiện ích `TaskAssignmentStatusUtils`.

**File:** `packages/supa_work/lib/utils/task_assignment_status_utils.dart`

### 1.1. Logic kiểm tra `shouldShowInPersonalList`

Một công việc sẽ bị ẩn khỏi danh sách cá nhân nếu thỏa mãn một trong các điều kiện sau:

1.  **Trạng thái cá nhân (Self Status) đã hoàn thành:** Nếu `taskAssignmentSelfStatusId` là **31 (SELF_COMPLETED)**. Trường hợp này xảy ra khi công việc yêu cầu nhiều người làm (Completion Mode: ALL), bạn đã xong phần của mình nhưng người khác thì chưa.
2.  **Trạng thái chung của Task đã kết thúc:** Nếu `taskAssignmentStatusId` là **3 (COMPLETED)** hoặc **4 (TERMINATED)**.

```dart
static bool shouldShowInPersonalList(TaskAssignment item) {
  // 1. Kiểm tra trạng thái cá nhân (Self Status)
  final selfStatusId = item.taskAssignmentSelfStatusId.value;
  if (selfStatusId == TaskAssignmentSelfStatusEnum.SELF_COMPLETED.id || // 31
      selfStatusId == TaskAssignmentStatusEnum.COMPLETED.id ||         // 3
      selfStatusId == TaskAssignmentStatusEnum.TERMINATED.id) {        // 4
    return false;
  }

  // 2. Kiểm tra trạng thái chung (Task status)
  final overallStatusId = item.taskAssignmentStatusId.value;
  if (overallStatusId == TaskAssignmentStatusEnum.COMPLETED.id ||
      overallStatusId == TaskAssignmentStatusEnum.TERMINATED.id) {
    return false;
  }

  return true;
}
```

---

## 2. Tối ưu hóa Dashboard (Dashboard Optimization)

Trang Dashboard (`GeneralDashboardPage`) áp dụng cơ chế cập nhật "tại chỗ" (local update) để tránh việc reload toàn bộ dữ liệu trang khi thay đổi trạng thái công việc.

### 2.1. Ẩn Item tại chỗ (Local Hide)

Khi người dùng thực hiện thay đổi trạng thái qua Quick Action hoặc từ trang chi tiết:
1. Widget `DashboardTaskAssignmentListWidget` sử dụng `TaskAssignmentStatusUtils` để kiểm tra xem item đó có còn thuộc diện hiển thị không.
2. Nếu không, nó sẽ gọi callback `onItemRemoved`.
3. `GeneralDashboardPage` sẽ xóa item khỏi danh sách `taskList` và cập nhật các chỉ số đếm (`taskListCount`, `homeStats`) trong `setState`.

### 2.2. Cơ chế nạp thêm (Refill Mechanism)

Để đảm bảo danh sách trên Dashboard không bị trống khi người dùng ẩn nhiều item liên tiếp:
*   Nếu số lượng item còn lại trong `taskList` ít hơn **15** VÀ thực tế ngoài server vẫn còn thêm công việc (`taskList.length < taskListCount`).
*   Hệ thống sẽ tự động gọi API `_refillTasks()` để lấy thêm 20 công việc mới nhất phù hợp với bộ lọc hiện tại.
*   Việc này diễn ra ngầm, người dùng chỉ thấy danh sách được bổ sung thêm mà không bị gián đoạn bởi màn hình skeleton loading của toàn dashboard.

---

## 3. Phân tách Logic giữa các trang

*   **GeneralDashboardPage**: Sử dụng Local Update và Refill Mechanism để đảm bảo tốc độ.
*   **TaskAssignmentPage (Master List)**: Sử dụng logic `refresh()` toàn trang sau khi đóng trang chi tiết để đảm bảo tính search/filter chính xác theo pagination controller.
*   **WorkHomePage**: Giữ nguyên logic reload toàn bộ Tab Data (`_fetchData()`) để đồng bộ dữ liệu giữa các tab.

---

## 4. Danh sách File liên quan

- `lib/modules/general/pages/general_dashboard/general_dashboard_page.dart`: Logic refill và quản lý danh sách.
- `lib/modules/general/pages/general_dashboard/widgets/dashboard_task_assignment_list_widget.dart`: Logic phát hiện item cần ẩn.
- `packages/supa_work/lib/utils/task_assignment_status_utils.dart`: Tiện ích kiểm tra trạng thái hiển thị.
- `packages/supa_work/lib/models/enums/task_assignment_self_status_enum.dart`: Định nghĩa ID 31 (SELF_COMPLETED).
