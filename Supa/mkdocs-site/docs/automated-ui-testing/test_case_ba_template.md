# Template Test Case Cho BA

> Copy file này và điền thông tin trong dấu `[...]`.
> Không ghi mật khẩu thật vào tài liệu dùng chung. Mật khẩu nên gửi qua kênh bảo mật hoặc dùng biến môi trường khi chạy test.

## Thông Tin Chung

| Trường | Nội dung |
|--------|----------|
| Feature | [...] |
| Test case ID | [...] |
| Tên test case | [...] |
| Người viết | [...] |
| Ngày tạo | [...] |
| Mức độ ưu tiên | [High / Medium / Low] |
| Loại test | [Happy path / Edge case / Negative case / Regression] |

## Mục Tiêu

[Mô tả ngắn gọn test case này xác nhận điều gì.]

Ví dụ:

```text
Xác nhận user đổi đúng domain staging và đăng nhập thành công với tài khoản chỉ có 1 tenant.
```

## Tiền Điều Kiện

- Domain: [...]
- Trạng thái app ban đầu: [guest / đã login / đã có dữ liệu X / ...]
- Loại tài khoản: [1 tenant / nhiều tenant / admin / staff / ...]
- Quyền cần có: [...]
- Dữ liệu đã tồn tại trên hệ thống: [...]
- Thiết bị/môi trường nếu có yêu cầu riêng: [...]

## Dữ Liệu Test

| Dữ liệu | Giá trị |
|---------|---------|
| Username/email | [...] |
| Password | [Không ghi mật khẩu thật trong tài liệu dùng chung] |
| Tenant kỳ vọng | [...] |
| Site/Project/Task/Checklist liên quan | [...] |
| Ngày/giờ test nếu có | [...] |
| Dữ liệu khác | [...] |

## Các Bước Thực Hiện

1. [...]
2. [...]
3. [...]
4. [...]
5. [...]

Ví dụ:

```text
1. Mở app ở trạng thái guest.
2. Mở màn đổi domain.
3. Nhập domain https://sstage.supa.vn.
4. Xác nhận đổi domain thành công.
5. Restart app.
6. Mở form đăng nhập.
7. Nhập username/password.
8. Bấm Đăng nhập.
```

## Kết Quả Mong Đợi

- [...]
- [...]
- [...]

Ví dụ:

```text
- User đăng nhập thành công.
- App chuyển sang trạng thái authenticated.
- Vì tài khoản chỉ có 1 tenant nên không hiển thị màn chọn tenant.
```

## Điểm Dừng Test

[Mô tả rõ test nên dừng ở đâu để không bị kéo sang luồng khác.]

Ví dụ:

```text
Dừng ngay sau khi app xác nhận user đã authenticated. Không kiểm tra dashboard trong test case này.
```

## Edge Cases Liên Quan

- [...]
- [...]
- [...]

Ví dụ:

```text
- Sai domain.
- Sai mật khẩu.
- Account có nhiều tenant.
- Account không có quyền truy cập app.
```

## Ghi Chú Cho Developer/AI

- Có cần thêm `Key` cho UI không: [Có / Không / Không rõ]
- Có API/network nào cần lưu ý không: [...]
- Có dữ liệu nào cần reset sau test không: [...]
- Test có được chạy độc lập không: [Có / Không]
- Test có phụ thuộc test case khác không: [Có / Không]

## Gherkin Draft

```gherkin
Feature: [...]

  Scenario: [...]
    Given [...]
    When [...]
    And [...]
    Then [...]
```
