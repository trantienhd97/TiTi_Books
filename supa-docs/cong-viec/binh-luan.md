# Bình luận công việc — Task Assignment Comment

| Mục | Giá trị |
|-----|---------|
| **Tên màn (UI)** | Bình luận công việc |
| **Class chính** | `TaskAssignmentCommentPage` |
| **Package** | `supa_work` → `packages/supa_work/lib/pages/task_assignment/` |
| **Route** | `resolveProjectPath('/project/comment')` — `TaskAssignmentCommentPage.location` |
| **Tổng số dòng** | **78** (`task_assignment_comment_page.dart`) |
| **Cập nhật lần cuối** | **2026-07-28** — Doc màn riêng. |

---

## Giới thiệu

Màn (hoặc shell) hiển thị tab bình luận / lịch sử request quanh một task. Body chính: `TaskAssignmentCommentTab`.

**Vào màn từ:** điều hướng từ edit / project flow với `taskAssignmentInput`.

> Chat realtime chính của task nằm trên [`chi-tiet.md`](./chi-tiet.md) (`ChatWithOverlayPanel`). Màn này là luồng comment/history riêng (request history).

---

## Cây thư mục source

```text
packages/supa_work/lib/pages/task_assignment/
├── task_assignment_comment_page.dart
└── widgets/detail/tabs/task_assignment_comment_tab.dart
```

---

## Route & điều hướng

| Mục | Giá trị |
|-----|---------|
| Path | `/project/comment` (`resolveProjectPath`) |
| Tham số | `taskAssignmentInput` (`TaskAssignment`) |
| Router | `packages/supa_work/lib/router/router.dart` |

---

## Widget & component

| Widget | Vai trò |
|--------|---------|
| `TaskAssignmentCommentTab` | UI comment / history tab |
| `MobileRequestHistoryRepository` | Load `RequestHistory` theo `requestProperty` |

---

## State & data

| State | Vai trò |
|-------|---------|
| `taskAssignment` | Copy từ `taskAssignmentInput` |
| `requestHistorys` | List từ repository |

Load: `RequestHistoryFilter.withRequestProperty(...)` → `list(filter)`.

---

## Logic chính

- `initState` → `getData()` nếu `taskAssignmentInput.id` hợp lệ.
- Không tự fetch task full qua `getById` — dựa vào object truyền vào.

---

## Lưu ý khi sửa

- Path thuộc **project** router (`resolveProjectPath`) — khác prefix work.
- Phân biệt với chat GetStream trên edit page; đừng gộp hai luồng comment khi refactor.
- Bottom sheet comment trên edit (`task_assignment_comments_bottom_sheet.dart`) có thể là entry khác — kiểm tra call site trước khi đổi UX.

---

## Liên kết

- Tổng quan: [`README.md`](./README.md)
- Chi tiết / sửa + chat: [`chi-tiet.md`](./chi-tiet.md)
- Danh sách: [`danh-sach.md`](./danh-sach.md)
- Quy ước: [`HUONG-DAN-VIET-DOC.md`](../HUONG-DAN-VIET-DOC.md)
