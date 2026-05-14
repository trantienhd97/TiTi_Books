# Inspection & Checklist Items

Thành phần hiển thị danh sách kiểm tra (Checklist) trong module Work.

## 1. WorkplaceCheckListItem

Widget hiển thị từng item trong danh sách Checklist trên Dashboard.

*   **Vị trí**: `lib/modules/general/pages/general_dashboard/widgets/workplace_check_list_item.dart`
*   **Quy tắc hiển thị**:
    *   **Tên lịch trình**: Hiển thị tối đa **2 dòng**, sử dụng ellipsis nếu dài hơn.
    *   **Meta Info**: Sử dụng `InspectionMetaWidget` để hiển thị địa điểm và thời gian.
    *   **Badge**: Sử dụng `EnumStatusBadge` cho trạng thái kiểm tra.

## 2. InspectionMetaWidget (Shared)

Component dùng chung để hiển thị metadata (Địa điểm & Deadline) cho mọi loại item kiểm tra.

*   **Vị trí**: `packages/supa_work/lib/widgets/molecules/inspection_meta_widget.dart`
*   **Quy tắc hiển thị**:
    *   **Địa điểm**: Tối đa **2 dòng**, kèm icon location.
    *   **Deadline**: Hiển thị thời gian còn lại hoặc trạng thái "Quá hạn" (màu đỏ) dựa trên logic `calculateMinutesTo`.

## 3. DashboardInspectionListWidget

Widget bao ngoài quản lý danh sách Checklist trong một block của Dashboard.

*   **Vị trí**: `lib/modules/general/pages/general_dashboard/widgets/dashboard_inspection_list_widget.dart`
*   **Lưu ý**: Đã loại bỏ `SingleChildScrollView` bên trong để `DashboardFrame` có thể đo đạc chiều cao tự nhiên của danh sách.
