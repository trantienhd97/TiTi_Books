# Hướng dẫn sử dụng SearchTab và TabContent

`SearchTab` và `TabContent` là bộ đôi widget mạnh mẽ dùng để tạo giao diện chọn nhiều đối tượng (Multi-selection) phân theo từng Tab dữ liệu khác nhau (ví dụ: Cá nhân, Nhóm, Địa điểm).

## 1. Thành phần chính

### SearchTab
Là widget bao ngoài, quản lý các Tab và nút "Lưu tất cả" (`onSaveAll`).

| Thuộc tính | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `title` | `String` | Tiêu đề của modal. |
| `tabs` | `List<Tab>` | Danh sách các header cho từng tab. |
| `initialSelectedList` | `List<List<dynamic>>` | Dữ liệu đã chọn ban đầu cho từng tab tương ứng. |
| `tabContentBuilder` | `Function` | Hàm xây dựng nội dung cho từng tab (thường dùng cùng `TabContent`). |
| `onSaveAll` | `Function(List<dynamic>)` | Callback khi bấm nút Lưu, trả về danh sách dữ liệu của tất cả các tab. |
| `footer` | `Widget?` | Widget hiển thị ở dưới cùng (ví dụ: checkbox tùy chọn thêm). |

### TabContent<T>
Là nội dung chi tiết bên trong mỗi tab, xử lý việc tìm kiếm, chọn/bỏ chọn và hiển thị các Chip đã chọn.

| Thuộc tính | Mô tả |
| :--- | :--- |
| `initialSelected` | Danh sách các đối tượng đã chọn ban đầu của tab này. |
| `fetchItems` | Hàm async để tải dữ liệu từ API (hỗ trợ phân trang và tìm kiếm). |
| `itemLabel` | Hàm lấy chuỗi hiển thị cho đối tượng. |
| `getAvatarUrl` | (Tùy chọn) Hàm lấy URL ảnh đại diện. Nếu cung cấp sẽ hiện Avatar. |
| `isSameItem` | Hàm so sánh 2 đối tượng (thường dựa trên `id`). |
| `onChanged` | Callback gọi mỗi khi dữ liệu của tab này thay đổi. |

---

## 2. Các tính năng nổi bật
1.  **Giao diện tối ưu**: Vùng hiển thị các Chip đã chọn giới hạn tối đa ~2 dòng (70-76px). Nếu nhiều hơn sẽ tự động cuộn bên trong để không chiếm hết nội dung chính.
2.  **Tự động cuộn (Auto-scroll)**: Khi chọn thêm một mục mới, vùng hiển thị Chip sẽ tự động cuộn xuống cuối cùng để người dùng thấy mục vừa chọn.
3.  **Hàng rào Hit-test**: Vùng cuộn Chip bao phủ toàn bộ chiều ngang màn hình, giúp việc kéo cuộn dễ dàng hơn.
4.  **Lazy Loading**: Hỗ trợ tải thêm dữ liệu khi cuộn xuống cuối danh sách tìm kiếm.

---

## 3. Ví dụ mã triển khai

Dưới đây là cách tích hợp `SearchTab` và `TabContent` trong một Modal Bottom Sheet:

```dart
await showCustomModalBottomSheet(
  context: context,
  builder: (context) {
    return SearchTab(
      title: 'Thêm người thực hiện',
      tabs: [
        Tab(text: 'Cá nhân'),
        Tab(text: 'Nhóm'),
      ],
      initialSelectedList: [tempUsers, tempGroups],
      onSaveAll: (list) {
        // list[0] là dữ liệu từ tab 'Cá nhân'
        // list[1] là dữ liệu từ tab 'Nhóm'
        final users = list[0] as List<AppUser>;
        // Xử lý lưu dữ liệu...
        Navigator.pop(context);
      },
      tabContentBuilder: (tabIndex, selected, onChanged) {
        if (tabIndex == 0) {
          return TabContent<AppUser>(
            initialSelected: List<AppUser>.from(selected),
            onChanged: (val) {
              tempUsers = val; // cập nhật state tạm
              onChanged(val);  // báo cho SearchTab cập nhật
            },
            fetchItems: (search, skip, take) async {
              return await MobileTaskAssignmentRepository().singleListAppUser(
                AppUserFilter()..search = search..skip = skip..take = take
              );
            },
            itemLabel: (user) => user.name.value,
            getAvatarUrl: (user) => user.avatar.value, // Có mục này sẽ hiện Avatar
            isSameItem: (a, b) => a.id.value == b.id.value,
          );
        }
        // ... build TabContent cho các index khác
      },
    );
  },
);
```

---

## 4. Lưu ý quan trọng
-   **Kiểm tra Avatar**: `TabContent` (và cả `MultiSelectionSearchModal`) chỉ hiển thị vòng tròn Avatar nếu bạn truyền callback `getAvatarUrl`. Với các loại dữ liệu như Địa điểm hay Thẻ (Tag), bạn chỉ cần không truyền thuộc tính này, giao diện sẽ tự động thu gọn lại.
-   **Đồng bộ dữ liệu**: Luôn gọi `onChanged(val)` bên trong `TabContent.onChanged` để `SearchTab` có thể thu thập đủ dữ liệu từ tất cả các tab khi người dùng bấm nút Save.
