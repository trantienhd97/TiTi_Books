# Task Assignment Items

Thành phần hiển thị danh sách nhiệm vụ (Tasks) trong module Work.

## 1. TaskAssignmentListTile

Widget hiển thị từng item trong danh sách nhiệm vụ trên Dashboard.

*   **Vị trí**: `lib/modules/general/pages/general_dashboard/widgets/task_assignment_list_tile.dart`
*   **Quy tắc hiển thị**:
    *   **Tên nhiệm vụ**: Hiển thị tối đa **2 dòng**, sử dụng ellipsis nếu dài hơn.
    *   **Hạn chót**: Hiển thị ngày đến hạn, tự động chuyển màu đỏ nếu đã quá hạn.
    *   **Icon**: Sử dụng icon mặc định `FluentIcons.circle_hint_24_regular`.

## 2. DashboardTaskAssignmentListWidget

Widget bao ngoài quản lý danh sách nhiệm vụ trong một block của Dashboard.

*   **Vị trí**: `lib/modules/general/pages/general_dashboard/widgets/dashboard_task_assignment_list_widget.dart`
*   **Lưu ý**: Đã loại bỏ `SingleChildScrollView` và bọc nội dung trong `Column` với `MainAxisSize.min` để hỗ trợ việc tính toán chiều cao động của `DashboardFrame`.
