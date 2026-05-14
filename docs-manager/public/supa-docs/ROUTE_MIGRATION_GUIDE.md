# Route Migration Documentation (Supa Work)

Tài liệu chi tiết về việc thay đổi cấu trúc đường dẫn (route) từ `/work` sang `/work-new` và làm phẳng các sub-paths.

## Chi tiết Thay đổi Trang

| STT   | Tên Trang (Tiếng Việt)                  | Tên Tệp Tin                                                      | Đường dẫn Cũ                                   | Đường dẫn Mới                                      |
| :---- | :-------------------------------------- | :--------------------------------------------------------------- | :--------------------------------------------- | :------------------------------------------------- |
| **1** | **Cấu hình Router chính**               | `router.dart`                                                    | `/work`                                        | `/work-new`                                        |
| **2** | **Trang chủ Công việc**                 | `work_home_page.dart`                                            | `/work/home`                                   | `/work-new/home`                                   |
| **3** | **Chi tiết Kiểm tra**                   | `inspection_detail_new_page.dart`                                | `/work/inspection/inspection-detail`           | `/work-new/inspection-detail`                      |
| **4** | **Chi tiết Sự vụ**                      | `issue_edit_page.dart`                                           | `/work/issue/issue-detail`                     | `/work-new/issue-detail`                           |
| **5** | **Danh mục Lịch trình**                 | `inspection_page.dart`                                           | `/work/schedule/schedule-master`               | `/work-new/schedule/schedule-list`                 |
| **6** | **Giao việc**                           | `task_assignment_page.dart`                                      | `/work/task-assignment/task-assignment-master` | `/work-new/task-assignment/task-assignment-master` |
| **7** | **Thông báo (Heads Up)**                | `heads_up_page.dart`                                             | `/work/heads-up/master`                        | `/work-new/heads-up`                               |
| **8** | **Báo cáo Kiểm tra (Site Report)**      | `site_report_page.dart`                                          | `/report/site-report`                          | `/work-new/inspection-report`                      |
| **9** | **Thực hiện Checklist (Questionnaire)** | `questionnaire_page.dart` → `inspection_questionnaire_page.dart` | `/general/questionnaire`                       | `/work-new/inspection/questionnaire`               |

## Thay đổi Cấu trúc Permissions

Các hằng số quyền trong module đã được cập nhật để tương ứng với cấu trúc path mới:

- **Tệp tin**: `packages/supa_work/lib/core/constants/work_permission_paths.dart`
- **Tệp tin**: `packages/supa_work/lib/pages/issues/constants/issue_permission_paths.dart`
- **Thay đổi**: Tất cả các key quyền chuyển từ `work/` thành `work-new/`.
  - Ví dụ: `work/task-assignment` -> `work-new/task-assignment`

## Lưu ý về Thông báo (Notifications)

Tệp `lib/config/notification_handlers.dart` đã được bổ sung prefix `/work-new` để đảm bảo các thông báo cũ và mới đều có thể mở đúng module Work:

```dart
NotificationHandlerFactory.registerPrefix(
  '/work-new',
  (context) => WorkNotificationHandler(context),
);
```

## Các Trang Được Di Chuyển Từ General Sang Work

### Thực hiện Checklist (QuestionnairePage)

- **Tệp tin cũ**: `packages/supa_work/lib/pages/questionnaire/questionnaire_page.dart`
- **Tệp tin mới**: `packages/supa_work/lib/pages/inspection/inspection_questionnaire_page.dart`
- **Route cũ**: `/general/questionnaire` (sử dụng `resolveGeneralPath`)
- **Route mới**: `/work-new/inspection/questionnaire` (sử dụng `resolveWorkPath`)
- **Lý do**: Trang này thuộc về module Work/Inspection, nên được chuyển từ general route sang work route
- **Files đã cập nhật**:
  - `packages/supa_work/lib/widgets/dashboard_floating_actions.dart` - Cập nhật navigation khi bấm "Thực hiện checklist"
  - `lib/modules/general/router/router.dart` - Đăng ký route mới trong general router
  - `lib/config/main_tabs.dart` - Cập nhật tab navigation

## Các Repository/API Paths Đã Cập Nhật

### Filter View Repository

- **Tệp tin**: `packages/supa_work/lib/repositories/util_filter_vilew_repository.dart`
- **Path cũ**: `/work/task-assignment/task-assignment-master`
- **Path mới**: `/work-new/task-assignment/task-assignment-master`
- **Mục đích**: API path gửi lên backend để lấy filter views cho trang task assignment

---

_Tài liệu được cập nhật vào ngày 07/04/2026._
