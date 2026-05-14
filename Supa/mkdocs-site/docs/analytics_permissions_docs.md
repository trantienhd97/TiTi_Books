# Tài liệu Phân quyền Module Báo cáo (Analytics)

Hệ thống phân quyền cho module Báo cáo được thiết kế dựa trên danh sách các đường dẫn (paths) được trả về từ Backend.

## 1. Nguồn dữ liệu phân quyền
Danh sách các `paths` mà người dùng có quyền truy cập được lấy từ API sau:
- **API:** `/rpc/work/profile/get`
- **Phương thức:** `POST`
- **Bloc quản lý:** `WorkProfileBloc`## Quy tắc phân quyền (Visibility Rules)

Hệ thống sử dụng cơ chế phân quyền theo **Phân cấp (Hierarchical)** và hỗ trợ **Đa điều kiện (Multi-condition)**:

1.  **Quyền Root (`work-new/analytics`):** Nếu có quyền này, người dùng sẽ thấy menu "Báo cáo" và xem được **tất cả** các biểu đồ (Công việc và Học tập) trên Dashboard.
2.  **Quyền Nhóm (Parent permissions):** 
    *   `work-new/analytics/work-report`: Cho phép hiển thị menu và xem được **toàn bộ** các báo cáo con thuộc nhóm Công việc.
    *   `work-new/analytics/training-report`: Cho phép hiển thị menu và xem được **toàn bộ** các báo cáo con thuộc nhóm Học tập.
3.  **Quyền cụ thể (Specific permissions):** Nếu chỉ có quyền cho một báo cáo chi tiết (ví dụ: `.../work-report/summary`), người dùng sẽ thấy menu và **chỉ xem được** đúng biểu đồ đó.

### Logic so sánh Path (Path Matching)

*   Hệ thống tự động xử lý dấu gạch chéo `/` ở đầu (ví dụ: `/work-new/analytics` khớp với `work-new/analytics`).
*   Hỗ trợ ký tự đại diện `*` (Wildcards) cho các đường dẫn chi tiết (ví dụ: `/.../user/*`).

---

## Chi tiết Mapping Báo cáo & Path

| Tên Báo cáo (Widget) | Path tương ứng |
| :--- | :--- |
| **Menu "Báo cáo" (Navbar/Others)** | `work-new/analytics` HOẶC `work-new/analytics/work-report` HOẶC bất kỳ báo cáo con nào |
| **Báo cáo Công việc (Tổng quan)** | `work-new/analytics/work-report/summary` |
| **Tỉ lệ tuân thủ theo địa điểm** | `work-new/analytics/work-report/site-report` |
| **Công việc theo địa điểm (Top yếu)** | `work-new/analytics/work-report/task-by-site` |
| **Top 5 nhân viên trễ việc** | `work-new/analytics/work-report/task-by-employee` |
| **Tỉ lệ đánh giá** | `work-new/analytics/work-report/checklist-report` |
| **Tổng quan Học tập** | `work-new/analytics/training-report/summary` |
| **Top 5 nhân viên học tập tốt** | `work-new/analytics/training-report/staff-ranking` |
| **Chi tiết nhân viên (Học tập)** | `work-new/analytics/training-report/user/*` |
 - |
| Điểm theo Site (Score by Site) | `/work-new/analytics/score-by-site` | - |
| Điểm theo User (Score by User) | `/work-new/analytics/score-by-user` | - |
| Top điểm cao (Top Score) | `/work-new/analytics/top-score` | - |
| Top điểm thấp (Bottom Score) | `/work-new/analytics/bottom-score` | - |

## 3. Quy tắc ẩn/hiện và Call API
Hệ thống tuân thủ các quy tắc nghiêm ngặt sau:
- **Menu chính:** Nếu người dùng không có bất kỳ quyền nào trong danh sách trên, mục "Báo cáo" sẽ không xuất hiện ở thanh điều hướng bên dưới hoặc trong menu "Khác".
- **Giao diện Dashboard:** Chỉ những widget báo cáo mà người dùng có quyền mới được render ra màn hình.
- **Tối ưu hóa API:** Nếu một báo cáo bị ẩn do không có quyền, ứng dụng sẽ **KHÔNG** thực hiện gọi các API lấy dữ liệu cho báo cáo đó (ví dụ: không gọi `/rpc/work/analytics/summary` nếu không có quyền tham chiếu).
- **Làm mới dữ liệu (Refresh):** Khi thực hiện kéo để làm mới (`RefreshIndicator`), hệ thống chỉ kích hoạt làm mới cho các widget đang hiển thị.

## 4. Tệp tin cấu hình liên quan
- `packages/supa_work/lib/pages/analytics/analytics_permissions.dart`: Định nghĩa tập trung các hằng số quyền.
- `packages/supa_work/lib/pages/analytics/analytics_page_new.dart`: Logic xử lý ẩn hiện và call API dựa trên quyền.
- `lib/config/main_tabs.dart`: Cấu hình quyền cho mục lục menu chính.
