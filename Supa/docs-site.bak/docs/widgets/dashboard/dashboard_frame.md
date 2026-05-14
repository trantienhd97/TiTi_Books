# DashboardFrame

`DashboardFrame` là một component khung (frame) được thiết kế để hiển thị các danh sách item trên Dashboard với hỗ trợ phân trang ngang (horizontal paging) và tự động điều chỉnh chiều cao.

## Tính năng chính

1.  **Horizontal Paging**: Chia danh sách item (mặc định 5 item/trang) thành các trang có thể vuốt ngang.
2.  **Dynamic Max Height**: Tự động tính toán chiều cao của tất cả các trang và cố định khung theo trang có chiều cao lớn nhất (Max Height). Điều này giúp giao diện không bị giật cục khi người dùng vuốt giữa các trang có độ dài nội dung khác nhau.
3.  **Hàng rào chống lỗi Overflow**: Tự động bọc nội dung trong `SingleChildScrollView` với `NeverScrollableScrollPhysics` để tránh lỗi "RenderFlex overflowed" trong giai đoạn đo đạc kích thước (measurement phase).
4.  **Premium Animation**: Sử dụng `AnimatedContainer` để giãn nở khung một cách mượt mà khi dữ liệu được load xong.

## Cách sử dụng

```dart
DashboardFrame(
  title: 'Tiêu đề block',
  itemCount: items.length,
  onTapDetail: () => _goToDetailPage(),
  pageBuilder: (pageIndex, startIndex, endIndex) {
    final pageItems = items.sublist(startIndex, endIndex);
    return MyListWidget(items: pageItems);
  },
  child: MyListWidget(items: items), // Fallback nếu không có pageBuilder
)
```

## Cơ chế hoạt động (Technical Details)

*   **Pre-calculation**: Khi dữ liệu load xong, một lớp ẩn (`Offstage`) sẽ render toàn bộ các trang để đo kích thước thông qua widget `_MeasureSize`.
*   **Batching Update**: Kết quả đo đạc được gom lại và chỉ cập nhật trạng thái (`setState`) một lần duy nhất thông qua `Future.microtask` sau khi frame đầu tiên được render xong.
*   **Safe sublist**: Luôn sử dụng `clamp` khi thực hiện `sublist` trong `pageBuilder` để đảm bảo không bị crash nếu dữ liệu bị thay đổi bất ngờ.
