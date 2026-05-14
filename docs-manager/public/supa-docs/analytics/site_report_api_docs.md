# Tài liệu Tích hợp Báo cáo Địa điểm (Site Report Analytics API)

Tài liệu này mô tả chi tiết quá trình nâng cấp hệ thống báo cáo (Site Report) từ việc sử dụng một danh sách địa điểm cố định (flat array) sang **Cấu trúc dữ liệu cây dẹt (Flat tree data structure)**. Điều này cho phép ứng dụng hỗ trợ tính năng nhóm địa điểm và hiển thị dữ liệu drill-down (khoan lồng) nhiều cấp bậc.

---

## 1. Tổng quan vấn đề (Context)
Trước đây, API `rpc/work/report/site-report/list` trả về danh sách phẳng các địa điểm sử dụng model `AnalyticSiteReport`. Với luồng dữ liệu mới, Back-end tiến hành tổng hợp số liệu (aggregate) từ các nhóm chi nhánh, tỉnh/thành, khu vực lên tới công ty (cấu trúc hình cây). Trả về dưới dạng một danh sách dẹt liên kết với nhau bằng thuộc tính `parentId`.

**Yêu cầu kỹ thuật đạt được:**
1. Ánh xạ dữ liệu trả về kiểu mới với Model `AnalyticSiteReportData`.
2. Truy xuất các thông số báo cáo thông qua object nội bộ `data`.
3. Không làm gián đoạn Business logic của `AnalyticsInspectionBloc`.
4. Cập nhật Layout hiển thị để tương thích với cấu hình Drill-down.

---

## 2. Hệ thống Models (Data Layer)
Thay vì sử dụng class cũ, một bộ class mới được tạo ra ở **Shared Core** để đồng bộ parsing dữ liệu.

### `AnalyticSiteReportData`
Class đại diện cho một Node địa điểm (hoặc cụm địa điểm). Nằm tại đường dẫn: 
`packages/supa_work/lib/core/models/analytic_site_report_data.dart`

**Các trường quan trọng:**
- `id` (int): Khóa chính của Node.
- `parentId` (int?): trỏ đến `id` của Node cha. Bằng `null` nếu là Root Node.
- `hasChildren` (bool): `true` nếu Node chứa các phân nhánh con bên trong. Cờ này đặc biệt quan trọng cho UI Drill-down.
- `name` (String): Tên nhóm/địa điểm.
- `code` (String), `alternateCode` (String): Mã định danh trạm khảo sát.
- `data` (JsonObject<AnalyticSiteReportItemData>?): Object chứa kết quả pre-calculated % phần trăm số lượng task, form khai báo. 

### `AnalyticSiteReportItemData`
Nằm lồng trong field `data` chứa ba trường dữ liệu mảng quan trọng nhất:
- `contents` (`JsonList<AnalyticSiteReportContent>`): Thông tin đếm biểu mẫu hoàn thành (countCompleted, countDoing, countLate, countIncompleted).
- `taskAssignments` (`JsonList<TaskAssignment>`): Các công việc phân công.
- `detailByDays` (`JsonList<AnalyticSiteReportDetailByDay>`): Thống kê theo ngày.

---

## 3. Kiến trúc BLoC (Business Logic)
Module `AnalyticsInspectionBloc` hoạt động bằng cách fetch toàn bộ danh sách Cây ở lần gọi `LoadAnalyticsData`.

**File:** `analytics_inspection_state.dart`
- Trạng thái `AnalyticsInspectionLoaded` được thay đổi để chứa `List<AnalyticSiteReportData> reports`. Toàn bộ dữ liệu hiển thị đã được cache lại ở state này sau một lần gọi duy nhất.
- Không cần fetch lại API khi chuyển cấp, UI chỉ cần gọi filter từ mảng `reports` bằng `parentId`.

---

## 4. UI và Flow Điều hướng (Presentation Layer)
Do cấu trúc trả vể thay đổi, toàn bộ danh sách truy cập vào `report.contents` hay `report.site` đều được thay thế cho phù hợp với Object `data`.

### 4.1. Thay đổi trường Parsing Màn hình
* **Biểu đồ tỷ lệ (%):** Tính toán bằng biến được tính gộp.
  Tính bằng: `report.data.value.contents.value`
* **Thông tin định danh nhánh:** `report.name.value`, `report.code.value`
* **ID:** `report.data.value.siteId.value` (hoặc trực tiếp `report.id.value`).

Các màn hình đã được cập nhật chuẩn format này gồm:
- `SiteReportPage`
- `SiteComplianceDetailsListPage`
- `SiteReportDetailsListPage`
- `SiteReportDetailsPage`
- `SiteReportScheduleDetails`

### 4.2. Khuyến nghị Hỗ trợ Drill-down (Khoan lồng dữ liệu)
Vì Backend trả về cấu trúc cha / con. Luồng chạm vào UI (chữ `onTap`) ở màn hình danh sách địa điểm cần tuân thủ rule sau để UX app tự nhiên:

```dart
// Code Logic Đề Xuất
void onReportItemTapped(AnalyticSiteReportData report) {
  if (report.hasChildren.value == true) {
    // -> Đây là Nhóm địa điểm (Ví dụ: Miền Nam)
    // Hành động: Cập nhật biến parentId == report.id hiện tại.
    // Lọc và render lại danh sách List với các Node thuộc lớp con này.
  } else {
    // -> Đây là Địa điểm cơ sở (Node Lá)
    // Hành động: Chuyển hướng sang màn hình SiteReportDetailsPage
    Navigator.of(context).push(
       MaterialPageRoute(builder: (c) => SiteReportDetailsPage(siteId: report.id.value))
    );
  }
}
```
**Bổ sung UX List Item:** Thêm `Trailing Icon: Icons.chevron_right` dành riêng cho điều kiện `report.hasChildren == true` để người dùng ý thức được hành động bấm vào để sổ ra lớp bên trong. Cần thêm một thanh Breadcrumbs (Thanh điều hướng phân cấp ví dụ `Toàn công ty > Hà Nội > Cầu Giấy`) để có thể lùi về lớp trên.
