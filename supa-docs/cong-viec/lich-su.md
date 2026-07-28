# Lịch sử công việc — Task Assignment History

| Mục | Giá trị |
|-----|---------|
| **Tên màn (UI)** | Lịch sử công việc |
| **Class chính** | `TaskAssignmentHistoryPage` |
| **Package** | `supa_work` → `packages/supa_work/lib/pages/task_assignment/` |
| **Route** | `resolveWorkPath('/inspection/history')` — `TaskAssignmentHistoryPage.location` |
| **Tổng số dòng** | **116** (`task_assignment_history_page.dart`) |
| **Cập nhật lần cuối** | **2026-07-28** — Doc màn riêng. |

---

## Giới thiệu

Hiển thị lịch sử thay đổi (`RequestHistory`) của một task assignment.

**Vào màn từ:** menu trên `TaskAssignmentEditPage` (header ︙) hoặc điều hướng có `id` task.

---

## Cây thư mục source

```text
packages/supa_work/lib/pages/task_assignment/
└── task_assignment_history_page.dart
```

Dùng shared: `PageDefault`, `MobileRequestHistoryRepository`.

---

## Route & điều hướng

| Mục | Giá trị |
|-----|---------|
| Path | `/inspection/history` (resolve work) — path lịch sử dùng chung pattern inspection |
| Tham số | `id` (task assignment id) |
| Router | `packages/supa_work/lib/router/router.dart` |

---

## Widget & component

| Thành phần | Vai trò |
|------------|---------|
| `PageDefault` | Scaffold chuẩn |
| List `RequestHistory` | Timeline / list thay đổi (format ngày `intl`) |

---

## State & data

| State | Vai trò |
|-------|---------|
| `taskAssignment` | Task load bằng `getById` |
| `requestHistorys` | Kết quả `MobileRequestHistoryRepository.list` |

### API

1. `MobileTaskAssignmentRepository().getById(id)`
2. `RequestHistoryFilter.withRequestProperty(draft.requestProperty)`
3. `MobileRequestHistoryRepository().list(filter)`

---

## Logic chính

- `initState` → `getData()`.
- Lỗi load: nuốt exception (list có thể trống) — cân nhắc toast nếu sửa UX.

---

## Lưu ý khi sửa

- Path `/inspection/history` dễ nhầm với lịch sử checklist — kiểm tra `resolveWorkPath` và tham số `id` là **task**, không phải inspection.
- Mở từ edit page: đảm bảo truyền đúng `taskAssignment.id`.

---

## Liên kết

- Tổng quan: [`README.md`](./README.md)
- Chi tiết / sửa: [`chi-tiet.md`](./chi-tiet.md)
- Danh sách: [`danh-sach.md`](./danh-sach.md)
- Quy ước: [`HUONG-DAN-VIET-DOC.md`](../HUONG-DAN-VIET-DOC.md)
