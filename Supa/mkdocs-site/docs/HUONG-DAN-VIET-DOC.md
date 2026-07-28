# Hướng dẫn viết tài liệu màn hình

Tài liệu trong thư mục `docs/` mô tả **từng màn hình** của app. Mỗi màn hình có một folder riêng, bên trong là file mô tả chi tiết màn đó.

Tài liệu cũ (trước khi tái cấu trúc) nằm tại `docsold/` và **không** được commit (đã ignore trong `.gitignore`).

---

## 1. Cấu trúc thư mục

```text
docs/
├── HUONG-DAN-VIET-DOC.md          ← File này — quy ước chung
├── README.md                       ← Index các màn đã có doc
└── <ten-man-hinh>/                 ← Một folder = một màn hình
    └── README.md                   ← Doc chi tiết của màn đó
```

**Quy tắc đặt tên folder màn hình**

- Dùng **kebab-case**, tiếng Việt không dấu hoặc tên ngắn gọn dễ hiểu.
- Ví dụ: `cua-toi`, `tin-nhan`, `bang-tin`, `checklist-hom-nay`.
- Trùng với tab/navbar nếu có thể (tab **Của tôi** → folder `cua-toi`).

**Quy tắc file**

- Mỗi folder màn hình chỉ cần **một** file chính: `README.md`.
- Nếu màn quá lớn, có thể thêm file phụ (ví dụ `flows.md`, `api.md`) nhưng vẫn giữ `README.md` làm entry point.

---

## 2. Nội dung bắt buộc trong `README.md` của từng màn

Copy template dưới đây khi tạo doc màn mới. **Càng chi tiết càng tốt**, đặc biệt phần logic và flow.

### 2.1. Metadata (đầu file)

| Mục | Mô tả |
|-----|--------|
| **Tên màn (UI)** | Tên hiển thị trên app (tab, title, …) |
| **Tên class / file chính** | Ví dụ `GeneralDashboardPage` |
| **Package / module** | Ví dụ `supa` → `lib/modules/general/...` |
| **Route** | Path đầy đủ, ví dụ `/supa/dashboard` |
| **Số dòng code** | Tổng dòng module + file chính (cập nhật khi sửa lớn) |
| **Cập nhật lần cuối** | `YYYY-MM-DD` + ghi chú ngắn nếu có |

### 2.2. Giới thiệu màn hình

- Màn này dùng để làm gì?
- User vào màn này từ đâu (tab, deep link, notification, …)?
- Màn thuộc super-app tab nào?

### 2.3. Cây thư mục source

```text
lib/.../<ten-page>/
├── <page>.dart
├── ...
└── widgets/
```

Liệt kê đủ file `.dart` và số dòng (có thể chạy `wc -l`).

### 2.4. Route & điều hướng

- Khai báo route ở file nào (`router.dart`, …).
- `ShellRoute` / `StatefulShellRoute` / `go()` / `push()` liên quan.
- Các màn con điều hướng từ màn này (tap section → màn nào).

### 2.5. Widget & component sử dụng

Bảng hoặc list:

| Widget / component | File | Vai trò |
|--------------------|------|---------|
| … | … | … |

Gồm widget local (`widgets/`), widget shared (`supa_foundation`, package khác), BLoC/Cubit.

### 2.6. State & data

- State local (`setState`), BLoC, cache, repository nào.
- API / repository gọi từ màn (endpoint, filter quan trọng).
- Dữ liệu nào load song song, nhóm nào block UI.

### 2.7. Logic chính

Mô tả theo lifecycle:

- `initState` / `dispose` / `didChangeDependencies`
- Load data lần đầu vs refresh
- Điều kiện hiển thị / ẩn section
- Xử lý lỗi (giữ stale data hay không)

### 2.8. Luồng đặc biệt (flows)

**Bắt buộc** nếu màn có:

- Pull-to-refresh
- Tab switch destroy/recreate widget
- Tutorial / dialog / permission
- Pagination / infinite scroll
- Race condition đã fix hoặc cần lưu ý

Dùng **mermaid** hoặc sơ đồ text khi hợp lý.

### 2.9. Lưu ý khi sửa (maintainer checklist)

- Anti-pattern cần tránh
- Lệnh analyze/test sau khi sửa
- Link doc package liên quan (ví dụ Heads Up trong `supa_work`)

### 2.10. Liên kết

- Doc màn khác
- Doc package (`packages/.../DOCS.md` nếu có)

---

## 3. Template copy-paste

```markdown
# <Tên màn UI>

| Mục | Giá trị |
|-----|---------|
| Tên màn (UI) | |
| Class chính | |
| Module | |
| Route | |
| Tổng số dòng | |
| Cập nhật lần cuối | YYYY-MM-DD |

## Giới thiệu

## Cây thư mục source

## Route & điều hướng

## Widget & component

## State & data

## Logic chính

## Luồng đặc biệt

## Lưu ý khi sửa

## Liên kết
```

---

## 4. Quy trình mỗi lần tạo / cập nhật doc

1. Tạo folder `docs/<ten-man-hinh>/`.
2. Tạo `README.md` theo mục 2.
3. Chạy `wc -l` trên folder source để cập nhật số dòng.
4. Thêm link vào `docs/README.md` (index).
5. Cập nhật **Cập nhật lần cuối** khi merge thay đổi logic lớn.

---

## 5. Index màn hình

Danh sách màn đã có doc: xem [`README.md`](README.md).
