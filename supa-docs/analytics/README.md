# Tài Liệu Cấu Trúc Báo Cáo Analytics (Manager Dashboard)

## 1. Mục đích là gì?
Cung cấp cái nhìn tổng quan, các số liệu thống kê dành cho các cấp Quản lý (Manager Dashboard). Hiển thị dưới dạng các biểu đồ, danh sách tổng hợp số liệu về:
- Các chỉ số hoàn thành công việc (Tasks, Checklist compliance).
- Đánh giá hiệu suất nhân sự và các khoá học (Top Best Employees, Top Best Courses, Learning overview).
- Các điểm yếu cần khắc phục (Top Late Employees, Top Weak Compliance Sites).

## 2. Đang cấu trúc như thế nào?
Kiến trúc màn hình theo dạng **"Composition"**:
- **Trang cha (`AnalyticsPageNew`)**: Chống kéo dãn màn hình (Scaffold), là nơi tập hợp của nhiều biểu đồ báo cáo con, quản lý khung nền chung và tính năng vuốt để làm mới tất cả thông tin (Kéo thả `RefreshIndicator`).
- **Các báo cáo con (Cards/Charts)**: Chứa trong thư mục `widgets/`. Mỗi báo cáo sẽ quản lý state hoàn toàn độc lập với nhau thông qua `Cubit` hoặc `Bloc`. Điều này giúp màn hình không bị block giao diện và mỗi báo cáo có thể tự gọi API để fetch/tái chuẩn bị dữ liệu (cùng loading độc lập) mà không chờ các báo cáo khác.

## 3. Thứ tự sắp xếp như nào?
Dữ liệu trên trang được sắp xếp dọc (Column) trong một cuộn trang hiển thị (`SingleChildScrollView`) theo trật tự ưu tiên từ trên xuống dưới hiện đang được cài đặt trong `AnalyticsPageNew`:
1. Mức độ tuân thủ quy trình kiểm tra (`ChecklistComplianceChart`)
2. Tỷ lệ đánh giá (`EvaluationRateChart`)
3. Chi nhánh tuân thủ kém nhất (`TopWeakComplianceSitesCard`)
4. Trạng thái các công việc (`TasksByStatusChart`)
5. Tổng quan số liệu công việc (`WorkOverviewChart`)
6. Nhân viên trễ hạn / quá hạn nhiều nhất (`TopLateEmployeesCard`)
7. Tổng quan đào tạo/học tập (`LearningOverviewCard`)
8. Khoá học tối ưu/tốt nhất (`TopBestCoursesCard`)
9. Học viên/nhân sự có thành tích tốt nhất (`TopBestEmployeesCard`)

## 4. Đặt ở đâu?
Thư mục gốc của chức năng này nằm trong package `supa_work`:
- **Trang Tổng**: `packages/supa_work/lib/pages/analytics/analytics_page_new.dart` 
- **Các Widget Báo Cáo (Card)**: Cấu trúc riêng lẻ nằm ở folder: `packages/supa_work/lib/pages/analytics/widgets/`
- **Các màn hình chi tiết** (Click xem tất cả): `packages/supa_work/lib/pages/analytics/dashboard/`

## 5. Dùng chung widget như thế nào?
Để thiết kế đồng bộ cho toàn bộ màn hình báo cáo, hệ thống sử dụng rất nhiều UI Components từ `supa_foundation`:
- **`ContainerCard`**: Bao bọc toàn bộ khung của một báo cáo (có padding và border).
- **`DropdownChip`**: Icon/Text nằm ở góc trên của báo cáo, dùng để nhấn mở bộ lọc.
- **`Skeletonizer`**: Layout Loading hiển thị dạng khung mờ (shimmer) dựa trên chính giao diện nội dung của báo cáo để tạo cảm giác load mượt mà thay vì icon xoay truyền thống (`CircularProgressIndicator`).
- **`DateFilterBottomSheet`**: Bottom sheet hiện ra để lọc báo cáo theo range ngày tháng (VD: "This month", "Last month"...). Được thiết lập riêng ở từng Widget vì mỗi cái có một logic bộ lọc độc lập.
- **`toastification`**: Gói chuẩn dùng để hiển thị Error/Warning Message nếu API lỗi.

## 6. Dùng API nào?
Việc gọi dữ liệu được thực hiện bởi tập hợp các hàm trong repository chung của Manager Dashboard:
- Data Model: `ManagerDashboardModels`
- Repository: `WorkManagerDashboardRepository`
- Quản lý trạng thái: Sử dụng `Cubit` được tạo trong `packages/supa_work/lib/blocs/manager_dashboard_bloc/`
- Filter Model Base: `ManagerDashboardFilter` chứa các tham số (Date, SiteId...).

## 7. Nếu thêm một báo cáo mới thì cần làm gì?

Thao tác thêm một panel báo cáo mới khá đơn giản, hãy tuân theo các bước sau:
1. **Model & API**: Định nghĩa Object model mới và bổ sung Endpoints trong file `WorkManagerDashboardRepository`.
2. **Triển khai Cubit/Bloc**: Tạo mới một Cubit quản lý State (Loading, Loaded, Error) có 1 hàm tên `loadData` và 1 thuộc tính `ManagerDashboardFilter`.
3. **Thiết kế UI cho Widget New Report**: 
    - Tạo file widget mới (ví dụ: `new_report_card.dart` tại thư mục `widgets/`).
    - Widget phải kế thừa class **StatefulWidget** và có func `refresh()` gọi ngược hàm `loadData()`.
    - Inject Cubit, sử dụng `BlocConsumer/BlocBuilder` để lắng nghe dữ liệu.
    - Cấu hình thẻ skeleton trong UI và bọc bằng `Skeletonizer`.
4. **Đăng ký vào AnalyticsPageNew**:
   - Ở `_AnalyticsPageNewState`, tạo thêm một mã hoá chìa khoá State theo tên thẻ mới: `final GlobalKey<NewReportCardState> _newReportKey = GlobalKey<NewReportCardState>();`
   - Bổ sung Object vừa tạo vào mục List Child của `RefreshIndicator` `wait` (Để làm mới khi vuốt Pull-To-Refresh):
     `_newReportKey.currentState?.refresh() ?? Future.value()`
   - Đặt `NewReportCard(key: _newReportKey)` ở vị trí thứ tự bạn muốn trong thẻ `Column` màn hình.
