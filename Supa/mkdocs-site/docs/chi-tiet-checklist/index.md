# Chi tiết checklist (Inspection detail)

| Mục | Giá trị |
|-----|---------|
| **Tên màn (UI)** | Checklist Detail |
| **Class chính** | `InspectionDetailNewPage` |
| **Package** | `supa_work` → `lib/pages/inspection/` |
| **Route** | `/work/inspection-detail` (`InspectionDetailNewPage.location`), public report `/work/public-inspection-report?content=...` |
| **Số dòng** | 768 (`inspection_detail_new_page.dart`) + 98 (`public_inspection_report_page.dart`) + 130 (`inspection_share_bottom_sheet.dart`) + `widget_ui_new/` + shared `widgets/detail_panel/` |
| **Cập nhật lần cuối** | 2026-06-18 — Shared `DetailCollapsiblePanel` dùng content flex lỏng để panel Inspection/Task ôm sát nội dung khi ngắn, vẫn giới hạn chiều cao và scroll khi dài. Cùng ngày: lịch sử câu trả lời chuyển thời gian UTC sang timezone local trước khi hiển thị. |

## Giới thiệu

Màn chi tiết một phiên checklist (inspection): xem thông tin tổng quan, đánh giá/sửa tiếp, mở các màn con (câu trả lời, media, công việc, flag) và trò chuyện nhóm gắn với inspection qua GetStream.

Vào từ danh sách checklist, thông báo, deep link, hoặc liên kết từ công việc.

## Cây thư mục

```text
packages/supa_work/lib/pages/inspection/
├── inspection_detail_new_page.dart
└── widget_ui_new/
    ├── entity_detail_collapsible_panel.dart            # layout panel chung cho inspection + task assignment
    ├── inspection_detail_header.dart
    ├── inspection_detail_collapsible_panel.dart       # adapter inspection → EntityDetailCollapsiblePanel
    ├── inspection_detail_status_indicator.dart        # factory dữ liệu inspection → DetailStatusIndicator
    ├── inspection_detail_menu_bottom_sheet.dart
    └── inspection_share_bottom_sheet.dart             # QR + copy/share public link
├── public_inspection_report_page.dart                 # public link → answer detail read-only

packages/supa_work/lib/widgets/detail_panel/           # shared cho inspection + task assignment
├── detail_panel.dart                                  # barrel
├── detail_collapsible_panel.dart                      # shell (shadow, border, animated size, max-height, handle)
├── detail_panel_collapse_handle.dart                  # footer "tap to collapse/expand"
├── detail_meta_row.dart                               # icon + text + trailing
├── detail_metrics_row.dart                            # N-column metric row + DetailMetricColumn
├── detail_status_indicator.dart                       # icon + label + colorKey (BE / hex / theme token)
├── detail_info_row.dart                               # DetailInfoRow + DetailInfoGroup + DetailInfoBadgeStyle (navigate)
├── detail_expandable_info_row.dart                    # tap-to-expand inline (dùng cho task assignment / attachments)
└── detail_action_buttons_row.dart                     # primary FilledButton + secondary OutlinedButton
```

> Tương đương cho task assignment edit page:
> - `pages/task_assignment/widgets/task_assignment_detail_collapsible_panel.dart` — adapter task assignment → `EntityDetailCollapsiblePanel` (title + 3 metric Due date/Frequency/Priority + Mark complete + avatar badge).
> - `pages/task_assignment/widgets/task_assignment_attachments_section.dart` — Attachments redesign: `DetailExpandableInfoRow` + `MediaViewHorizontal` + "+ Add Attachments" primary link.
> - Inspection rows = navigate (`DetailInfoRow`); task assignment rows = inline expand (`DetailExpandableInfoRow`).

## Layout

1. **Header** (`InspectionDetailHeader`): back, title + mã checklist, share link (QR/copy/share), menu ⋮ → bottom sheet (export PDF, xóa nếu `canDelete`).
2. **Panel thu gọn** (`InspectionDetailCollapsiblePanel`): trạng thái mở rộng (scroll trong tối đa ~48% chiều cao màn hình, spacing compact giữa header/metrics/action/info rows/handle) hoặc thanh gọn (tên, %, primary action — **Tiếp tục** nếu DOING + `canUpdate`, fallback **Evaluate** nếu FINISHED/FINISHED_LATE + `canEvaluate`, chevron).
3. **Chat** (`_InspectionChatShell` + `EntityChatMixin`): tin nhắn ghim, danh sách tin, input — chiếm phần còn lại của `Column`.

## Điều hướng con

| Hành động | Đích |
|-----------|------|
| Answer details | `AnswerInformationDetailPage` |
| Related media | `InspectionMediaRelatedPage` |
| Follow-up tasks | `InspectionTaskAssignmentRelatedPage` |
| Flagged items | `FlagDetailPage` |
| Continue / Edit | `InspectionAnswerPage` — xem [`docs/tra-loi-checklist/README.md`](../tra-loi-checklist/README.md) |
| Evaluate | `InspectionAnswerPage.evaluateLocation` — cùng doc trả lời checklist |
| Public report link | `PublicInspectionReportPage` → `AnswerInformationDetailPage(readOnly: true)` |

## Lịch sử câu trả lời

`AnswerInformationDetailPage` mở `InspectionQuestionHistoryBottomSheet` để hiển thị từng lần sửa câu trả lời. API trả `InspectionQuestionHistory.modifiedAt` theo UTC, vì vậy UI phải gọi `.toLocal()` trước `DateFormat`. Với đáp án `DATETIME`, chỉ chuyển local khi câu hỏi bật `useTime`; đáp án date-only không chuyển timezone để tránh nhảy sang ngày trước/sau.

## API chia sẻ

| API | Request | Response | Ghi chú |
|-----|---------|----------|---------|
| `/rpc/work/inspection/get-share-url` | `InspectionShare(id)` | `InspectionShare(url)` | Dùng khi bấm nút share trên header; URL được đưa vào QR/copy/share. |
| `/rpc/work/inspection/get-from-qr` | `InspectionShare(url, requestProperty)` từ query `content` | `Inspection` | Dùng cho route public, render chi tiết câu trả lời read-only và không gọi API protected `getById`. |

## Maintainer

- Panel mặc định **mở** (`_isInfoPanelExpanded = true`); đổi default trong state nếu product yêu cầu.
- Spacing của `EntityDetailCollapsiblePanel` và shared `widgets/detail_panel/` cũng ảnh hưởng task assignment detail; kiểm tra cả hai màn khi chỉnh padding.
- Chat cần `_isChatReady` sau khi resolve GetStream CID (`widget.cid` hoặc API).
- Tài khoản review (`app_review@supa.vn`): ẩn chat, chỉ hiện panel.
- Public report không dùng chat, không đọc `AuthenticationBloc`, và `AnswerInformationDetailPage` phải giữ `readOnly` để tránh route/action tạo hoặc sửa task khi user chưa login.
- Các action **Đánh giá** phải dùng cùng điều kiện quyền: inspection ở trạng thái `FINISHED`/`FINISHED_LATE` và `canEvaluate == true`. Không hiển thị action này trong menu dấu ⋯ của `InspectionAnswerPage` nếu BE không cấp quyền.
