# Tệp đính kèm công việc — Task Assignment Attachment

| Mục | Giá trị |
|-----|---------|
| **Tên màn (UI)** | Tệp đính kèm / media công việc |
| **Class chính** | `TaskAssignmentAttachmentPage` |
| **Package** | `supa_work` → `packages/supa_work/lib/pages/task_assignment/` |
| **Route** | `resolveProjectPath('/work/file')` — `TaskAssignmentAttachmentPage.location` |
| **Tổng số dòng** | **206** (`task_assignment_attachment_page.dart`) |
| **Cập nhật lần cuối** | **2026-07-28** — Doc màn riêng. |

---

## Giới thiệu

Màn xem / quản lý file media gắn với task (hoặc task lấy từ inspection). Kế thừa `AbstractInspectionMediaState` + `MediaViewWidget`.

**Vào màn từ:** edit page / inspection flow với `taskAssignmentInput` và `source`.

> Trên edit page hiện đại, bằng chứng thường nằm trong panel (`TaskAssignmentAttachmentsSection`). Màn này vẫn dùng cho full-screen media / nguồn inspection.

---

## Cây thư mục source

```text
packages/supa_work/lib/pages/task_assignment/
└── task_assignment_attachment_page.dart

# Shared
packages/supa_project/.../abstract_inspection_media_state.dart
packages/supa_foundation/.../media_view_widget.dart
```

---

## Route & điều hướng

| Mục | Giá trị |
|-----|---------|
| Path | `/work/file` (`resolveProjectPath`) |
| Tham số | `taskAssignmentInput`, `source` (`AttachmentPageSource.taskAssignment` \| `.inspection`) |
| Router | `packages/supa_work/lib/router/router.dart` |

---

## Widget & component

| Thành phần | Vai trò |
|------------|---------|
| `AbstractInspectionMediaState` | State chung media (pick/upload/delete pattern inspection) |
| `MediaViewWidget` | Grid / viewer media |
| `PageDefault` | Scaffold |
| `toastification` | Feedback lỗi |

---

## State & data

| Source | API load |
|--------|----------|
| `AttachmentPageSource.taskAssignment` | `MobileTaskAssignmentRepository.getById` |
| `AttachmentPageSource.inspection` | `MobileInspectionRepository.getTaskAssignment` |

File mappings lấy từ entity sau load.

---

## Logic chính

1. `getData()` theo `source`.
2. UI media kế thừa abstract state (thêm/xoá/xem).
3. Lỗi → toast (không silent fail trên thao tác user).

---

## Lưu ý khi sửa

- Phân biệt `source` — sai source sẽ gọi sai repository.
- Đồng bộ hành vi với `TaskAssignmentAttachmentsSection` trên edit (upload compress, link evidence) nếu thay đổi quy tắc bằng chứng.
- Path `/work/file` dùng `resolveProjectPath` — chú ý deep link.

---

## Liên kết

- Tổng quan: [`README.md`](./README.md)
- Chi tiết / sửa (section Bằng chứng): [`chi-tiet.md`](./chi-tiet.md)
- Tạo task (đính kèm lúc tạo): [`tao-moi.md`](./tao-moi.md)
- Danh sách: [`danh-sach.md`](./danh-sach.md)
- Quy ước: [`HUONG-DAN-VIET-DOC.md`](../HUONG-DAN-VIET-DOC.md)
