# Hướng dẫn sử dụng MultiSelectionSearchModal

`MultiSelectionSearchModal<T>` là một widget Generic dùng để tạo modal tìm kiếm và chọn nhiều phần tử. Đây là giải pháp tiêu chuẩn trong ứng dụng cho các danh sách chọn như Người dùng, Địa điểm, Tags, hoặc loại thiết bị.

## 1. Các thuộc tính quan trọng (Props)

| Thuộc tính | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `title` | `String` | Tiêu đề hiển thị trên header của modal. |
| `initialSelected` | `List<T>` | Danh sách các phần tử đã được chọn sẵn. |
| `onSelect` | `Function(List<T>?)` | Callback trả về danh sách được chọn khi bấm "Xong". Trả về `null` nếu không có gì được chọn. |
| `searchFunction` | `Future<List<T>> Function(String)` | Hàm thực hiện tìm kiếm, nhận vào `query` và trả về một `Future` danh sách. |
| `getDisplayText` | `String Function(T)` | Hàm lấy chuỗi hiển thị chính cho mỗi phần tử. |
| `getItemId` | `dynamic Function(T)` | Hàm lấy ID duy nhất để so sánh các phần tử. |
| `getSubtitleText` | `String? Function(T)?` | (Tùy chọn) Hàm lấy chuỗi hiển thị phụ (subtitle). |
| `getAvatarUrl` | `String? Function(T)?` | (Tùy chọn) Hàm lấy URL ảnh đại diện. Nếu không truyền, cột Avatar sẽ được ẩn đi. |
| `itemBuilder` | `Widget Function(...)` | (Tùy chọn) Builder để tùy chỉnh hoàn toàn giao diện mỗi dòng kết quả. |
| `searchHintText` | `String` | Text gợi ý trong ô nhập liệu tìm kiếm. |
| `selectionCountText` | `String` | Text hiển thị số lượng đã chọn (ví dụ: "đã chọn"). |

---

## 2. Đặc điểm nổi bật

1.  **Vùng chọn thông minh**: Danh sách các Chip đã chọn được giới hạn chiều cao tối đa **76px** (~2 dòng). Khi quá giới hạn, vùng này sẽ tự động bật tính năng cuộn nội bộ để không lấn chiếm không gian tìm kiếm.
2.  **Tự động cuộn (Auto-scroll)**: Mỗi khi bạn chọn một mục mới từ danh sách bên dưới, vùng Chip phía trên sẽ tự động cuộn đến cuối cùng để bạn luôn thấy mục mới nhất đã chọn.
3.  **Avatar có điều kiện**: Vòng tròn Avatar chỉ hiện diện nếu bạn cung cấp `getAvatarUrl`. Đối với các danh sách không phải người dùng (ví dụ: Thẻ/Tag, Trạng thái), giao diện sẽ tự động co lại cho phù hợp.
4.  **Tối ưu cảm ứng**: Vùng cuộn Chip hỗ trợ tính năng "full-width hit-test", cho phép bạn kéo cuộn từ bất kỳ đâu trên dòng đó.

---

## 3. Ví dụ triển khai

### A. Chọn Người dùng (Có Avatar và Subtitle)
```dart
showCustomModalBottomSheet(
  context: context,
  builder: (context) {
    return MultiSelectionSearchModal<AppUser>(
      title: 'Chọn người thực hiện',
      initialSelected: currentAssignees,
      onSelect: (selected) {
        // Cập nhật trạng thái...
      },
      searchFunction: (query) async {
        return await repository.filterListAppUser(AppUserFilter()..search = query);
      },
      getDisplayText: (user) => user.name.value,
      getAvatarUrl: (user) => user.avatar.value, // Hiện Avatar
      getSubtitleText: (user) => user.email.value, // Hiện Subtitle
      getItemId: (user) => user.id.value,
      searchHintText: 'Tìm kiếm nhân viên...',
      selectionCountText: 'nhân viên đã chọn',
    );
  },
);
```

### B. Chọn Thẻ/Tags (Giao diện tối giản)
```dart
showCustomModalBottomSheet(
  context: context,
  builder: (context) {
    return MultiSelectionSearchModal<Tag>(
      title: 'Chọn nhãn',
      initialSelected: currentTags,
      onSelect: (tags) => updateTags(tags),
      searchFunction: (query) => repo.searchTags(query),
      getDisplayText: (tag) => tag.name.value,
      getItemId: (tag) => tag.id.value,
      // Không truyền getAvatarUrl và getSubtitleText -> Giao diện sẽ chỉ hiện Text
      searchHintText: 'Tìm nhãn...',
      selectionCountText: 'nhãn đã chọn',
    );
  },
);
```

---

## 4. Lưu ý quan trọng
-   **Kiểm định ID**: Hãy chắc chắn `getItemId` trả về một giá trị duy nhất (thường là ID từ DB) để tránh việc chọn một mục nhưng các mục khác cùng ID cũng bị đánh dấu theo.
-   **L10n**: Nên sử dụng hàm `translate()` cho các thuộc tính `title`, `searchHintText`, và `selectionCountText` để hỗ trợ đa ngôn ngữ.
