# UI Components

Tài liệu này cung cấp tổng quan về các UI components được sử dụng trong dự án SupaMobileApp. Dự án tuân theo các nguyên tắc của **Atomic Design** để tạo ra một thư viện component có thể mở rộng và dễ bảo trì.

## Cấu trúc Atomic Design

Các UI components được tổ chức theo các cấp độ sau của hệ thống phân cấp atomic design:

-   **Atoms:** Các khối xây dựng cơ bản của UI. Đây là các components nhỏ nhất, không thể chia nhỏ.
-   **Molecules:** Các nhóm đơn giản của atoms tạo thành các components phức tạp hơn.
-   **Organisms:** Các UI components phức tạp được tạo thành từ molecules và atoms.
-   **Templates:** Các đối tượng cấp page đặt components vào layout.
-   **Pages:** Các instance cụ thể của templates hiển thị những gì người dùng sẽ thấy.

Các UI components có thể tái sử dụng được đặt trong thư mục `packages/supa_foundation/lib/widgets`.

## Component Library

### Atoms

#### AppBadge

Badge để hiển thị thông báo hoặc số đếm. Tự động định dạng số đếm trên 99 thành "99+".

**Cách sử dụng:**

```dart
const AppBadge({
  super.key,
  required this.count,
  this.containerPadding = 0,
  this.color,
});
```

**Tham số:**
- `count` (num, required): Số đếm để hiển thị. Giá trị >= 100 sẽ hiển thị là "99+".
- `containerPadding` (double?, optional): Padding xung quanh container của badge. Mặc định: 0.
- `color` (Color?, optional): Màu nền của badge. Mặc định: màu lỗi của theme.

**Ví dụ:**

```dart
AppBadge(
  count: 5,
  color: Colors.blue,
)
```

**Khi nào sử dụng:** Hiển thị số đếm thông báo, chỉ báo tin nhắn chưa đọc, hoặc số lượng items.

---

#### AppBadgeIcon

Icon với badge overlay tùy chọn để hiển thị số đếm hoặc thông báo.

**Cách sử dụng:**

```dart
const AppBadgeIcon({
  super.key,
  required this.icon,
  this.badgeCount,
});
```

**Tham số:**
- `icon` (Widget, required): Widget icon để hiển thị.
- `badgeCount` (int?, optional): Số đếm để hiển thị trong badge. null sẽ ẩn badge.

**Ví dụ:**

```dart
AppBadgeIcon(
  icon: Icon(Icons.notifications),
  badgeCount: 5,
)
```

**Khi nào sử dụng:** Icon navigation với số đếm thông báo, menu items với chỉ báo.

---

#### AppFilledButton

Button filled với nhiều biến thể và styles. Hỗ trợ trạng thái loading, icons, và các loại button khác nhau.

**Cách sử dụng:**

```dart
AppFilledButton({
  super.key,
  required this.onPressed,
  this.isLoading = false,
  this.child,
  this.label = '',
  this.style,
  this.icon,
  this.rounded = false,
  this.isDisabled = false,
  this.compactMode = false,
  this.type = AppFilledButtonType.primary,
});
```

**Tham số:**
- `onPressed` (VoidCallback, required): Callback khi button được nhấn.
- `isLoading` (bool, optional): Hiển thị loading indicator. Mặc định: false.
- `child` (Widget?, optional): Nội dung widget tùy chỉnh. Nếu được cung cấp, `label` sẽ bị bỏ qua.
- `label` (String, optional): Text label của button. Mặc định: ''.
- `style` (ButtonStyle?, optional): Style tùy chỉnh cho button.
- `icon` (IconData?, optional): Icon để hiển thị trước label.
- `rounded` (bool, optional): Sử dụng góc bo tròn. Mặc định: false.
- `isDisabled` (bool, optional): Vô hiệu hóa button. Mặc định: false.
- `compactMode` (bool, optional): Sử dụng kích thước compact. Mặc định: false.
- `type` (AppFilledButtonType, optional): Biến thể loại button. Mặc định: primary.

**Các loại Button:**
- `primary` - Button hành động chính
- `secondary` - Hành động phụ
- `tertiary` - Hành động bậc ba
- `danger` - Các hành động phá hủy
- `warning` - Các hành động cảnh báo
- `success` - Các hành động thành công/xác nhận
- `info` - Các hành động thông tin
- `primaryContainer` - Biến thể primary container
- `secondaryContainer` - Biến thể secondary container
- `tertiaryContainer` - Biến thể tertiary container
- `errorContainer` - Biến thể error container

**Factory Constructors:**

```dart
AppFilledButton.primary({...})
AppFilledButton.secondary({...})
AppFilledButton.tertiary({...})
AppFilledButton.danger({...})
AppFilledButton.warning({...})
AppFilledButton.success({...})
AppFilledButton.info({...})
```

**Ví dụ:**

```dart
AppFilledButton.primary(
  label: 'Submit',
  icon: Icons.check,
  onPressed: () {
    // Handle submit
  },
  isLoading: isSubmitting,
)

AppFilledButton.danger(
  label: 'Delete',
  onPressed: () {
    // Handle delete
  },
)
```

**Khi nào sử dụng:** Các hành động chính, submit form, xác nhận, hoặc bất kỳ hành động nào cần nhấn mạnh.

---

#### AppNetworkImage

Widget hiển thị ảnh từ network với xử lý loading và lỗi.

**Cách sử dụng:**

```dart
const AppNetworkImage({
  super.key,
  required this.url,
  this.fit = BoxFit.cover,
  this.width,
  this.height,
  this.errorWidget,
  this.placeholderWidget,
});
```

**Tham số:**
- `url` (String, required): URL của ảnh cần load
- `fit` (BoxFit, optional): Cách ghi ảnh vào không gian
- `width` (double?, optional): Ràng buộc chiều rộng
- `height` (double?, optional): Ràng buộc chiều cao
- `errorWidget` (Widget?, optional): Widget hiển thị khi ảnh load thất bại
- `placeholderWidget` (Widget?, optional): Widget hiển thị khi ảnh đang load

**Ví dụ:**

```dart
AppNetworkImage(
  url: 'https://example.com/image.jpg',
  fit: BoxFit.cover,
)
```

**Khi nào sử dụng:** Khi hiển thị ảnh từ nguồn network với các trạng thái loading phù hợp.

---

#### AppNetworkImageFit

Widget hiển thị ảnh từ network tự động fit vào container với xử lý loading và lỗi.

**Cách sử dụng:**

```dart
const AppNetworkImageFit({
  super.key,
  required this.url,
  this.fit = BoxFit.cover,
  this.errorWidget,
  this.placeholderWidget,
});
```

**Tham số:**
- `url` (String, required): URL của ảnh cần load
- `fit` (BoxFit, optional): Cách ghi ảnh vào không gian
- `errorWidget` (Widget?, optional): Widget hiển thị khi ảnh load thất bại
- `placeholderWidget` (Widget?, optional): Widget hiển thị khi ảnh đang load

**Ví dụ:**

```dart
AppNetworkImageFit(
  url: 'https://example.com/image.jpg',
  fit: BoxFit.cover,
)
```

**Khi nào sử dụng:** Khi hiển thị ảnh từ network cần tự động fit vào container.

---

#### AppbarBottomBorder

Border dưới tùy chỉnh cho app bar để styling nhất quán.

**Cách sử dụng:**

```dart
const AppbarBottomBorder({
  super.key,
  this.borderWidth = 1.0,
  this.borderColor,
});
```

**Tham số:**
- `borderWidth` (double, optional): Độ rộng của border. Mặc định: 1.0
- `borderColor` (Color?, optional): Màu của border. Mặc định: màu divider của theme

**Ví dụ:**

```dart
AppBar(
  bottom: PreferredSize(
    preferredSize: const Size.fromHeight(1.0),
    child: AppbarBottomBorder(),
  ),
  ...
)
```

**Khi nào sử dụng:** Để thêm border dưới nhất quán cho các AppBar widgets.

---

#### CustomSlider

Widget slider tùy chỉnh với styling và chức năng nâng cao.

**Cách sử dụng:**

```dart
CustomSlider({
  super.key,
  required this.value,
  required this.onChanged,
  this.min = 0.0,
  this.max = 1.0,
  this.divisions,
  this.activeColor,
  this.inactiveColor,
});
```

**Tham số:**
- `value` (double, required): Giá trị hiện tại của slider
- `onChanged` (ValueChanged<double>, required): Được gọi khi người dùng thay đổi giá trị
- `min` (double, optional): Giá trị tối thiểu. Mặc định: 0.0
- `max` (double, optional): Giá trị tối đa. Mặc định: 1.0
- `divisions` (int?, optional): Số lượng phân chia rời rạc
- `activeColor` (Color?, optional): Màu của track đang active
- `inactiveColor` (Color?, optional): Màu của track không active

**Ví dụ:**

```dart
CustomSlider(
  value: _sliderValue,
  onChanged: (value) {
    setState(() {
      _sliderValue = value;
    });
  },
  min: 0,
  max: 100,
)
```

**Khi nào sử dụng:** Khi cần một slider với giao diện và chức năng tùy chỉnh.

---

#### DropdownChip

Chip hiển thị label và mũi tên dropdown, thường được sử dụng cho filtering hoặc selection.

**Cách sử dụng:**

```dart
const DropdownChip({
  super.key,
  required this.label,
  required this.isSelected,
  required this.onTap,
});
```

**Tham số:**
- `label` (String, required): Text để hiển thị trong chip.
- `isSelected` (bool, required): Chip có đang ở trạng thái được chọn không.
- `onTap` (VoidCallback, required): Callback khi chip được tap.

**Ví dụ:**

```dart
DropdownChip(
  label: 'Status',
  isSelected: isStatusFilterActive,
  onTap: () {
    // Show filter options
  },
)
```

**Khi nào sử dụng:** Filter chips, dropdown triggers, hoặc selection indicators.

---

#### ElevatedIconButton

Button elevated với icon và text tùy chọn.

**Cách sử dụng:**

```dart
const ElevatedIconButton({
  super.key,
  required this.icon,
  this.text,
  required this.onPressed,
  this.color,
  this.borderColor,
  this.textStyle,
});
```

**Tham số:**
- `icon` (IconData, required): Icon để hiển thị
- `text` (String?, optional): Text label tùy chọn
- `onPressed` (VoidCallback?, required): Callback khi button được nhấn
- `color` (Color?, optional): Màu nền của button
- `borderColor` (Color?, optional): Màu border của button
- `textStyle` (TextStyle?, optional): Style cho text label

**Ví dụ:**

```dart
ElevatedIconButton(
  icon: Icons.add,
  text: 'Add',
  onPressed: () {
    // Handle add action
  },
)
```

**Khi nào sử dụng:** Khi cần một elevated button với icon và text tùy chọn.

---

#### EllipsisText

Widget text cắt ngắn text dài với ellipsis và tooltip tùy chọn.

**Cách sử dụng:**

```dart
const EllipsisText({
  super.key,
  required this.data,
  this.style,
  this.tooltip,
  this.maxLines = 1,
});
```

**Tham số:**
- `data` (String, required): Text để hiển thị
- `style` (TextStyle?, optional): Style cho text
- `tooltip` (String?, optional): Tooltip để hiển thị khi text bị cắt ngắn
- `maxLines` (int, optional): Số dòng tối đa. Mặc định: 1

**Ví dụ:**

```dart
EllipsisText(
  data: 'This is a very long text that will be truncated',
  tooltip: 'This is a very long text that will be truncated',
)
```

**Khi nào sử dụng:** Khi hiển thị text có thể dài cần được cắt ngắn.

---

#### FirstPageIndicator

Widget để chỉ báo nếu người dùng đang ở trang đầu tiên của danh sách.

**Cách sử dụng:**

```dart
const FirstPageIndicator({
  super.key,
  this.showIndicator = true,
});
```

**Tham số:**
- `showIndicator` (bool, optional): Có hiển thị chỉ báo không. Mặc định: true

**Ví dụ:**

```dart
FirstPageIndicator(
  showIndicator: true,
)
```

**Khi nào sử dụng:** Để chỉ báo trang đầu tiên trong các danh sách có phân trang.

---

#### FullScreenImage

Widget để hiển thị ảnh ở chế độ toàn màn hình với chức năng đóng.

**Cách sử dụng:**

```dart
const FullScreenImage({
  super.key,
  required this.imageUrl,
  this.onClose,
});
```

**Tham số:**
- `imageUrl` (String, required): URL của ảnh để hiển thị
- `onClose` (VoidCallback?, optional): Callback khi ảnh được đóng

**Ví dụ:**

```dart
FullScreenImage(
  imageUrl: 'https://example.com/image.jpg',
  onClose: () {
    Navigator.pop(context);
  },
)
```

**Khi nào sử dụng:** Khi hiển thị ảnh ở chế độ toàn màn hình để trải nghiệm xem tốt hơn.

---

#### GenericBottomSheetSelector

Bottom sheet selector generic cho việc chọn một item.

**Cách sử dụng:**

```dart
const GenericBottomSheetSelector({
  super.key,
  required this.items,
  required this.onSelected,
  this.title = 'Select an option',
  this.selectedId,
  this.itemBuilder,
});
```

**Tham số:**
- `items` (List<T>, required): Danh sách items để chọn
- `onSelected` (Function(T), required): Callback khi item được chọn
- `title` (String, optional): Tiêu đề cho bottom sheet. Mặc định: 'Select an option'
- `selectedId` (dynamic, optional): ID của item hiện đang được chọn
- `itemBuilder` (Widget Function(T)?, optional): Function để build widget item tùy chỉnh

**Ví dụ:**

```dart
GenericBottomSheetSelector<String>(
  items: ['Option 1', 'Option 2', 'Option 3'],
  title: 'Choose an option',
  onSelected: (selected) {
    print('Selected: $selected');
  },
)
```

**Khi nào sử dụng:** Khi cần một bottom sheet selector cho việc chọn một item.

---

#### GenericBottomSheetSelectorIosStyle

Bottom sheet selector generic kiểu iOS cho việc chọn một item.

**Cách sử dụng:**

```dart
const GenericBottomSheetSelectorIosStyle({
  super.key,
  required this.items,
  required this.onSelected,
  this.title = 'Select an option',
  this.selectedId,
  this.itemBuilder,
});
```

**Tham số:**
- `items` (List<T>, required): Danh sách items để chọn
- `onSelected` (Function(T), required): Callback khi item được chọn
- `title` (String, optional): Tiêu đề cho bottom sheet. Mặc định: 'Select an option'
- `selectedId` (dynamic, optional): ID của item hiện đang được chọn
- `itemBuilder` (Widget Function(T)?, optional): Function để build widget item tùy chỉnh

**Ví dụ:**

```dart
GenericBottomSheetSelectorIosStyle<String>(
  items: ['Option 1', 'Option 2', 'Option 3'],
  title: 'Choose an option',
  onSelected: (selected) {
    print('Selected: $selected');
  },
)
```

**Khi nào sử dụng:** Khi cần một bottom sheet selector kiểu iOS cho việc chọn một item.

---

#### Input

Trường nhập text có thể tùy chỉnh với label, xử lý lỗi, và nhiều tùy chọn styling.

**Cách sử dụng:**

```dart
const Input({
  super.key,
  required this.controller,
  required this.label,
  this.errorText,
  this.isBorder = true,
  this.paddingLeft = 0,
  this.maxLines = 1,
  this.onChanged,
  this.readOnly = false,
  this.keyboardType,
  this.suffix,
  this.textInputAction,
  this.focusNode,
  this.hintText,
  this.isRequired,
  this.onUpdate,
});
```

**Tham số:**
- `controller` (TextEditingController, required): Controller cho text field.
- `label` (String, required): Text label hiển thị phía trên input.
- `errorText` (String?, optional): Thông báo lỗi hiển thị phía dưới input.
- `isBorder` (bool, optional): Hiển thị border xung quanh input. Mặc định: true.
- `paddingLeft` (double, optional): Padding trái cho input. Mặc định: 0.
- `maxLines` (int?, optional): Số dòng tối đa. null cho không giới hạn. Mặc định: 1.
- `onChanged` (Function(String)?, optional): Callback khi text thay đổi.
- `readOnly` (bool, optional): Làm cho field chỉ đọc. Mặc định: false.
- `keyboardType` (TextInputType?, optional): Loại bàn phím (email, number, etc.).
- `suffix` (Widget?, optional): Widget suffix tùy chỉnh. Mặc định: nút clear khi có text.
- `textInputAction` (TextInputAction?, optional): Nút hành động trên bàn phím.
- `focusNode` (FocusNode?, optional): Focus node cho quản lý focus.
- `hintText` (String?, optional): Text gợi ý. Mặc định: sử dụng label.
- `isRequired` (bool?, optional): Hiển thị chỉ báo bắt buộc (*). Mặc định: null.
- `onUpdate` (Function(String)?, optional): Callback khi field mất focus.

**Ví dụ:**

```dart
final _controller = TextEditingController();

Input(
  controller: _controller,
  label: 'Email',
  keyboardType: TextInputType.emailAddress,
  isRequired: true,
  errorText: emailError,
  onChanged: (value) {
    // Handle text change
  },
)
```

**Khi nào sử dụng:** Form inputs, text fields, search fields, hoặc bất kỳ nhu cầu nhập text nào.

---

#### LineItem

Widget line item để hiển thị các items trong danh sách với styling nhất quán.

**Cách sử dụng:**

```dart
const LineItem({
  super.key,
  required this.child,
  this.showTopBorder = false,
});
```

**Tham số:**
- `child` (Widget, required): Widget con để hiển thị
- `showTopBorder` (bool, optional): Có hiển thị border trên không. Mặc định: false

**Ví dụ:**

```dart
LineItem(
  child: Text('Item content'),
)
```

**Khi nào sử dụng:** Khi hiển thị các list items nhất quán với border tùy chọn.

---

#### LineSingleSelected

Line item với dấu checkmark chỉ báo trạng thái được chọn.

**Cách sử dụng:**

```dart
const LineSingleSelected({
  super.key,
  required this.child,
  this.isSelected = false,
  this.showTopBorder = false,
});
```

**Tham số:**
- `child` (Widget, required): Widget con để hiển thị
- `isSelected` (bool, optional): Item có được chọn không. Mặc định: false
- `showTopBorder` (bool, optional): Có hiển thị border trên không. Mặc định: false

**Ví dụ:**

```dart
LineSingleSelected(
  child: Text('Item content'),
  isSelected: true,
)
```

**Khi nào sử dụng:** Khi hiển thị các list items có thể chọn đơn với chỉ báo selection trực quan.

---

#### ListTileWithBadge

List tile với badge để hiển thị thông báo hoặc số đếm.

**Cách sử dụng:**

```dart
const ListTileWithBadge({
  super.key,
  required this.title,
  this.subtitle,
  this.trailing,
  this.badgeCount,
  this.onTap,
});
```

**Tham số:**
- `title` (Widget, required): Widget tiêu đề
- `subtitle` (Widget?, optional): Widget phụ đề
- `trailing` (Widget?, optional): Widget trailing
- `badgeCount` (int?, optional): Số đếm để hiển thị trong badge
- `onTap` (VoidCallback?, optional): Callback khi tile được tap

**Ví dụ:**

```dart
ListTileWithBadge(
  title: Text('Messages'),
  badgeCount: 5,
  onTap: () {
    // Handle tap
  },
)
```

**Khi nào sử dụng:** Khi hiển thị list tiles với notification badges.

---

#### MoneyText

Widget để hiển thị giá trị tiền tệ với định dạng phù hợp.

**Cách sử dụng:**

```dart
const MoneyText({
  super.key,
  required this.amount,
  required this.currency,
  this.style,
});
```

**Tham số:**
- `amount` (double, required): Số tiền để hiển thị
- `currency` (String, required): Mã tiền tệ (ví dụ: USD, EUR)
- `style` (TextStyle?, optional): Style cho text

**Ví dụ:**

```dart
MoneyText(
  amount: 100.50,
  currency: 'USD',
)
```

**Khi nào sử dụng:** Khi hiển thị giá trị tiền tệ đã được định dạng.

---

#### MultipleLine

Widget để hiển thị nhiều dòng text với styling nhất quán.

**Cách sử dụng:**

```dart
const MultipleLine({
  super.key,
  required this.children,
  this.mainAxisAlignment = MainAxisAlignment.start,
  this.crossAxisAlignment = CrossAxisAlignment.start,
});
```

**Tham số:**
- `children` (List<Widget>, required): Danh sách các widget con
- `mainAxisAlignment` (MainAxisAlignment, optional): Căn chỉnh trục chính. Mặc định: start
- `crossAxisAlignment` (CrossAxisAlignment, optional): Căn chỉnh trục phụ. Mặc định: start

**Ví dụ:**

```dart
MultipleLine(
  children: [
    Text('Line 1'),
    Text('Line 2'),
  ],
)
```

**Khi nào sử dụng:** Khi hiển thị nhiều dòng text với căn chỉnh nhất quán.

---

#### PercentageBadge

Widget badge để hiển thị giá trị phần trăm.

**Cách sử dụng:**

```dart
const PercentageBadge({
  super.key,
  required this.percentage,
  this.backgroundColor,
  this.textColor,
});
```

**Tham số:**
- `percentage` (double, required): Giá trị phần trăm để hiển thị
- `backgroundColor` (Color?, optional): Màu nền của badge
- `textColor` (Color?, optional): Màu text

**Ví dụ:**

```dart
PercentageBadge(
  percentage: 75.5,
)
```

**Khi nào sử dụng:** Khi hiển thị giá trị phần trăm ở định dạng badge.

---

#### SelectChip

Chip có thể được chọn/bỏ chọn với styling phù hợp.

**Cách sử dụng:**

```dart
const SelectChip({
  super.key,
  required this.label,
  required this.isSelected,
  required this.onPressed,
});
```

**Tham số:**
- `label` (String, required): Text để hiển thị trong chip
- `isSelected` (bool, required): Chip có đang được chọn không
- `onPressed` (VoidCallback, required): Callback khi chip được nhấn

**Ví dụ:**

```dart
SelectChip(
  label: 'Option',
  isSelected: true,
  onPressed: () {
    // Handle selection
  },
)
```

**Khi nào sử dụng:** Khi implement filter chips hoặc các tùy chọn selection.

---

#### SupaLogo

Widget hiển thị logo Supa với kích thước có thể cấu hình.

**Cách sử dụng:**

```dart
const SupaLogo({
  super.key,
  this.size = 100,
});
```

**Tham số:**
- `size` (double, optional): Kích thước của logo. Mặc định: 100

**Ví dụ:**

```dart
SupaLogo(
  size: 150,
)
```

**Khi nào sử dụng:** Khi hiển thị logo Supa trong ứng dụng.

---

#### VideoThumbnail

Widget hiển thị thumbnail video với overlay nút play.

**Cách sử dụng:**

```dart
const VideoThumbnail({
  super.key,
  required this.url,
  this.width,
  this.height,
  this.onTap,
});
```

**Tham số:**
- `url` (String, required): URL của video
- `width` (double?, optional): Chiều rộng của thumbnail
- `height` (double?, optional): Chiều cao của thumbnail
- `onTap` (VoidCallback?, optional): Callback khi thumbnail được tap

**Ví dụ:**

```dart
VideoThumbnail(
  url: 'https://example.com/video.mp4',
  width: 200,
  height: 150,
  onTap: () {
    // Play video
  },
)
```

**Khi nào sử dụng:** Khi hiển thị video thumbnails với chỉ báo play.

---

### Molecules

#### ActionLine

Hàng có thể tap với label và widget con tùy chọn, thường được sử dụng cho navigation hoặc actions.

**Cách sử dụng:**

```dart
const ActionLine({
  super.key,
  required this.label,
  this.child,
  this.onTap,
  this.showTopBorder = false,
  this.disabled = false,
});
```

**Tham số:**
- `label` (String, required): Text label ở phía bên trái.
- `child` (Widget?, optional): Widget để hiển thị ở phía bên phải.
- `onTap` (VoidCallback?, optional): Callback khi hàng được tap.
- `showTopBorder` (bool, optional): Hiển thị border trên. Mặc định: false.
- `disabled` (bool, optional): Vô hiệu hóa action line. Mặc định: false.

**Ví dụ:**

```dart
ActionLine(
  label: 'Settings',
  child: Switch(
    value: isEnabled,
    onChanged: (value) {},
  ),
  onTap: () {
    // Navigate to settings
  },
)

ActionLine(
  label: 'Profile',
  onTap: () {
    // Navigate to profile
  },
)
```

**Khi nào sử dụng:** Danh sách settings, navigation items, các tùy chọn có thể toggle, hoặc bất kỳ hành động dựa trên hàng nào.

---

#### AppBarSearchField

Widget search field phù hợp để sử dụng trong app bars.

**Cách sử dụng:**

```dart
const AppBarSearchField({
  super.key,
  required this.controller,
  required this.onChanged,
  this.onSubmitted,
  this.hintText = 'Search...',
  this.onCancel,
});
```

**Tham số:**
- `controller` (TextEditingController, required): Controller cho search field
- `onChanged` (Function(String), required): Được gọi khi search text thay đổi
- `onSubmitted` (Function(String)?, optional): Được gọi khi search được submit
- `hintText` (String, optional): Text gợi ý cho search field. Mặc định: 'Search...'
- `onCancel` (VoidCallback?, optional): Được gọi khi search bị hủy

**Ví dụ:**

```dart
AppBarSearchField(
  controller: _searchController,
  onChanged: (value) {
    // Update search results
  },
  onCancel: () {
    setState(() {
      _searchController.clear();
    });
  },
)
```

**Khi nào sử dụng:** Khi implement chức năng search trong app bars.

---

#### AppBarTitle

Widget tiêu đề app bar có style với typography nhất quán.

**Cách sử dụng:**

```dart
const AppBarTitle({
  super.key,
  required this.title,
});
```

**Tham số:**
- `title` (String, required): Text tiêu đề để hiển thị

**Ví dụ:**

```dart
AppBar(
  title: AppBarTitle(title: 'My Page'),
)
```

**Khi nào sử dụng:** Khi hiển thị tiêu đề app bar nhất quán trong toàn bộ ứng dụng.

---

#### AppCircleAvatar

Widget avatar tròn với khả năng load ảnh và fallback.

**Cách sử dụng:**

```dart
const AppCircleAvatar({
  super.key,
  this.imageUrl,
  this.name,
  this.radius = 20,
  this.backgroundColor,
  this.foregroundColor,
});
```

**Tham số:**
- `imageUrl` (String?, optional): URL của ảnh avatar
- `name` (String?, optional): Tên để sử dụng cho initials fallback
- `radius` (double, optional): Bán kính của hình tròn. Mặc định: 20
- `backgroundColor` (Color?, optional): Màu nền khi không có ảnh
- `foregroundColor` (Color?, optional): Màu text cho initials

**Ví dụ:**

```dart
AppCircleAvatar(
  imageUrl: 'https://example.com/avatar.jpg',
  name: 'John Doe',
  radius: 25,
)
```

**Khi nào sử dụng:** Khi hiển thị user avatars với styling tròn nhất quán.

---

#### AppDrawerButton

Widget button được thiết kế để sử dụng trong app drawers với styling nhất quán.

**Cách sử dụng:**

```dart
const AppDrawerButton({
  super.key,
  required this.text,
  required this.onPressed,
  required this.icon,
  this.isSelected = false,
});
```

**Tham số:**
- `text` (String, required): Text để hiển thị trên button
- `onPressed` (VoidCallback, required): Callback khi button được nhấn
- `icon` (IconData, required): Icon để hiển thị trên button
- `isSelected` (bool, optional): Button có đang được chọn không. Mặc định: false

**Ví dụ:**

```dart
AppDrawerButton(
  text: 'Home',
  icon: Icons.home,
  isSelected: true,
  onPressed: () {
    // Navigate to home
  },
)
```

**Khi nào sử dụng:** Khi tạo các navigation buttons trong app drawers.

---

#### AppUserAvatar

Widget user avatar với khả năng load ảnh và fallback cho users.

**Cách sử dụng:**

```dart
const AppUserAvatar({
  super.key,
  this.imageUrl,
  this.name,
  this.size = 40,
  this.backgroundColor,
  this.foregroundColor,
});
```

**Tham số:**
- `imageUrl` (String?, optional): URL của ảnh avatar của user
- `name` (String?, optional): Tên của user cho initials fallback
- `size` (double, optional): Kích thước của avatar. Mặc định: 40
- `backgroundColor` (Color?, optional): Màu nền khi không có ảnh
- `foregroundColor` (Color?, optional): Màu text cho initials

**Ví dụ:**

```dart
AppUserAvatar(
  imageUrl: 'https://example.com/user.jpg',
  name: 'John Doe',
  size: 50,
)
```

**Khi nào sử dụng:** Khi hiển thị user avatars với styling nhất quán.

---

#### DataLine

Hàng để hiển thị label và giá trị tương ứng, thường được sử dụng trong detail views.

**Cách sử dụng:**

```dart
const DataLine({
  super.key,
  required this.label,
  this.labelStyle,
  this.value,
  this.child,
  this.crossAxisAlignment = CrossAxisAlignment.start,
});
```

**Tham số:**
- `label` (String, required): Text label ở bên trái.
- `labelStyle` (TextStyle?, optional): Style tùy chỉnh cho label.
- `value` (String?, optional): Text giá trị để hiển thị. Phải cung cấp `value` hoặc `child`.
- `child` (Widget?, optional): Widget tùy chỉnh cho giá trị. Phải cung cấp `value` hoặc `child`.
- `crossAxisAlignment` (CrossAxisAlignment, optional): Căn chỉnh trục phụ. Mặc định: start.

**Ví dụ:**

```dart
DataLine(
  label: 'Email',
  value: 'user@example.com',
)

DataLine(
  label: 'Status',
  child: Chip(label: Text('Active')),
)
```

**Khi nào sử dụng:** Detail pages, hiển thị thông tin, profile views, hoặc bất kỳ cặp label-value nào.

---

#### Expansion

Widget expansion panel với header và body content.

**Cách sử dụng:**

```dart
const Expansion({
  super.key,
  required this.header,
  required this.body,
  this.initiallyExpanded = false,
});
```

**Tham số:**
- `header` (Widget, required): Widget để sử dụng làm expansion header
- `body` (Widget, required): Widget để sử dụng làm expansion body
- `initiallyExpanded` (bool, optional): Expansion có được mở rộng ban đầu không. Mặc định: false

**Ví dụ:**

```dart
Expansion(
  header: Text('More Information'),
  body: Text('Detailed information here...'),
  initiallyExpanded: true,
)
```

**Khi nào sử dụng:** Khi cung cấp các sections có thể thu gọn với thông tin chi tiết.

---

#### FileListWidget

Widget để hiển thị danh sách files với các tùy chọn download/view.

**Cách sử dụng:**

```dart
const FileListWidget({
  super.key,
  required this.files,
  this.onFileTap,
  this.showTitle = true,
});
```

**Tham số:**
- `files` (List<FileModel>, required): Danh sách files để hiển thị
- `onFileTap` (Function(FileModel)?, optional): Callback khi một file được tap
- `showTitle` (bool, optional): Có hiển thị tiêu đề 'Attachments' không. Mặc định: true

**Ví dụ:**

```dart
FileListWidget(
  files: fileList,
  onFileTap: (file) {
    // Handle file tap
  },
)
```

**Khi nào sử dụng:** Khi hiển thị danh sách files với các hành động liên quan.

---

#### MultipleSelectChip

Chip hiển thị các tùy chọn đã chọn, thường được sử dụng cho multi-select filters.

**Cách sử dụng:**

```dart
const MultipleSelectChip({
  super.key,
  required this.selectedOptions,
  required this.defaultLabel,
  required this.isSelected,
  required this.onTap,
});
```

**Tham số:**
- `selectedOptions` (List<String>, required): Danh sách labels của các tùy chọn đã chọn.
- `defaultLabel` (String, required): Label để hiển thị khi không có tùy chọn nào được chọn.
- `isSelected` (bool, required): Filter có đang active không.
- `onTap` (VoidCallback, required): Callback khi chip được tap.

**Logic hiển thị:**
- Không có selection: Hiển thị `defaultLabel`
- Một selection: Hiển thị tùy chọn đã chọn
- Nhiều selections: Hiển thị tùy chọn đầu tiên + định dạng "(+N)"

**Ví dụ:**

```dart
MultipleSelectChip(
  selectedOptions: ['Active', 'Pending'],
  defaultLabel: 'All Statuses',
  isSelected: true,
  onTap: () {
    // Show multi-select modal
  },
)
```

**Khi nào sử dụng:** Multi-select filters, tag selectors, hoặc category filters.

---

#### ProfileButton

Widget button hiển thị thông tin user profile.

**Cách sử dụng:**

```dart
const ProfileButton({
  super.key,
  required this.name,
  required this.email,
  this.avatarUrl,
  this.onPressed,
});
```

**Tham số:**
- `name` (String, required): Tên của user
- `email` (String, required): Email của user
- `avatarUrl` (String?, optional): URL của ảnh avatar của user
- `onPressed` (VoidCallback?, optional): Callback khi button được nhấn

**Ví dụ:**

```dart
ProfileButton(
  name: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'https://example.com/avatar.jpg',
  onPressed: () {
    // Navigate to profile
  },
)
```

**Khi nào sử dụng:** Khi hiển thị thông tin user profile ở định dạng button.

---

#### SettingTile

Widget tile cho settings với styling nhất quán và switch tùy chọn.

**Cách sử dụng:**

```dart
const SettingTile({
  super.key,
  required this.title,
  this.subtitle,
  this.trailing,
  this.onTap,
  this.showTopBorder = false,
});
```

**Tham số:**
- `title` (String, required): Tiêu đề của setting
- `subtitle` (String?, optional): Phụ đề tùy chọn
- `trailing` (Widget?, optional): Widget để hiển thị ở cuối (ví dụ: switch)
- `onTap` (VoidCallback?, optional): Callback khi tile được tap
- `showTopBorder` (bool, optional): Có hiển thị border trên không. Mặc định: false

**Ví dụ:**

```dart
SettingTile(
  title: 'Notifications',
  subtitle: 'Allow notifications',
  trailing: Switch(value: _notificationsEnabled, onChanged: _toggleNotifications),
  onTap: () {
    // Handle tap if no switch
  },
)
```

**Khi nào sử dụng:** Khi hiển thị settings với styling nhất quán.

---

#### TenantSelectionItem

Widget để hiển thị một tenant trong màn hình chọn tenant.

**Cách sử dụng:**

```dart
const TenantSelectionItem({
  super.key,
  required this.tenant,
  required this.onTap,
});
```

**Tham số:**
- `tenant` (Tenant, required): Tenant để hiển thị
- `onTap` (VoidCallback, required): Callback khi item được tap

**Ví dụ:**

```dart
TenantSelectionItem(
  tenant: selectedTenant,
  onTap: () {
    // Handle tenant selection
  },
)
```

**Khi nào sử dụng:** Khi hiển thị các tùy chọn tenant trong màn hình chọn tenant.

---

#### UserButton

Widget button hiển thị thông tin user với avatar tùy chọn.

**Cách sử dụng:**

```dart
const UserButton({
  super.key,
  required this.name,
  required this.email,
  this.avatarUrl,
  this.onPressed,
});
```

**Tham số:**
- `name` (String, required): Tên của user
- `email` (String, required): Email của user
- `avatarUrl` (String?, optional): URL của ảnh avatar của user
- `onPressed` (VoidCallback?, optional): Callback khi button được nhấn

**Ví dụ:**

```dart
UserButton(
  name: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'https://example.com/avatar.jpg',
  onPressed: () {
    // Handle user button tap
  },
)
```

**Khi nào sử dụng:** Khi hiển thị thông tin user ở định dạng button.

---

### Organisms

#### ContainerCard

Widget container với styling nhất quán để nhóm nội dung liên quan.

**Cách sử dụng:**

```dart
const ContainerCard({
  super.key,
  required this.child,
  this.padding = const EdgeInsets.all(16),
  this.margin = const EdgeInsets.all(8),
  this.decoration,
  this.clipBehavior = Clip.none,
});
```

**Tham số:**
- `child` (Widget, required): Widget con để hiển thị bên trong container
- `padding` (EdgeInsetsGeometry, optional): Padding bên trong container. Mặc định: all(16)
- `margin` (EdgeInsetsGeometry, optional): Margin bên ngoài container. Mặc định: all(8)
- `decoration` (BoxDecoration?, optional): Decoration cho container
- `clipBehavior` (Clip, optional): Hành vi clip của container. Mặc định: none

**Ví dụ:**

```dart
ContainerCard(
  child: Text('Content'),
)
```

**Khi nào sử dụng:** Khi nhóm nội dung liên quan với styling nhất quán.

---

#### DateFilterBottomSheet

Bottom sheet để chọn date filters.

**Cách sử dụng:**

```dart
const DateFilterBottomSheet({
  super.key,
  required this.onDateSelected,
  this.initialDate,
});
```

**Tham số:**
- `onDateSelected` (Function(DateTime), required): Callback khi một ngày được chọn
- `initialDate` (DateTime?, optional): Ngày ban đầu để hiển thị

**Ví dụ:**

```dart
DateFilterBottomSheet(
  onDateSelected: (date) {
    print('Selected date: $date');
  },
  initialDate: DateTime.now(),
)
```

**Khi nào sử dụng:** Khi chọn ngày trong giao diện bottom sheet.

---

#### DateRangeCustomSheet

Bottom sheet tùy chỉnh để chọn date ranges.

**Cách sử dụng:**

```dart
const DateRangeCustomSheet({
  super.key,
  required this.onDateRangeSelected,
  this.initialStartDate,
  this.initialEndDate,
});
```

**Tham số:**
- `onDateRangeSelected` (Function(DateTimeRange), required): Callback khi date range được chọn
- `initialStartDate` (DateTime?, optional): Ngày bắt đầu ban đầu
- `initialEndDate` (DateTime?, optional): Ngày kết thúc ban đầu

**Ví dụ:**

```dart
DateRangeCustomSheet(
  onDateRangeSelected: (dateRange) {
    print('Selected range: ${dateRange.start} to ${dateRange.end}');
  },
)
```

**Khi nào sử dụng:** Khi chọn date ranges trong bottom sheet tùy chỉnh.

---

#### DateRangeFilterCustomSheet

Bottom sheet tùy chỉnh đặc biệt cho date range filtering.

**Cách sử dụng:**

```dart
const DateRangeFilterCustomSheet({
  super.key,
  required this.onApply,
  this.initialDateRange,
});
```

**Tham số:**
- `onApply` (Function(DateTimeRange), required): Callback khi range được áp dụng
- `initialDateRange` (DateTimeRange?, optional): Date range ban đầu để hiển thị

**Ví dụ:**

```dart
DateRangeFilterCustomSheet(
  onApply: (dateRange) {
    // Apply the selected date range
  },
  initialDateRange: DateTimeRange(start: DateTime.now(), end: DateTime.now().add(Duration(days: 7))),
)
```

**Khi nào sử dụng:** Khi implement date range filtering trong bottom sheet tùy chỉnh.

---

#### GenericFilterWidget

Widget có thể cuộn ngang để hiển thị nhiều filter chips (cả ID filters và date filters).

**Cách sử dụng:**

```dart
const GenericFilterWidget({
  super.key,
  required this.filters,
  this.padding = const EdgeInsets.only(left: 16, right: 16, top: 8),
  this.spacing = 8.0,
});
```

**Tham số:**
- `filters` (List<FilterItem>, required): Danh sách filter items để hiển thị.
- `padding` (EdgeInsetsGeometry?, optional): Padding cho scroll view.
- `spacing` (double, optional): Khoảng cách giữa các filter chips. Mặc định: 8.0.

**Các loại FilterItem:**

1. **IdFilterItem** - Cho multiple selection filters:
```dart
IdFilterItem(
  selectedOptions: ['Option1', 'Option2'],
  defaultLabel: 'All Options',
  onTap: (context) {
    // Show multi-select modal
  },
  isSelected: true,
)
```

2. **DateFilterItem** - Cho date range filters:
```dart
DateFilterItem(
  label: 'Last 7 days',
  onTap: (context) {
    // Show date picker
  },
  isSelected: true,
)
```

**Helper Builder:**

```dart
FilterItemBuilder.createIdFilter(
  selectedOptions: selectedStatuses,
  defaultLabel: 'All Statuses',
  onTap: (context) => showStatusFilter(context),
  isSelected: selectedStatuses.isNotEmpty,
)

FilterItemBuilder.createDateFilter(
  label: formatDateRange(startDate, endDate),
  onTap: (context) => showDatePicker(context),
  isSelected: startDate != null,
)
```

**Ví dụ:**

```dart
GenericFilterWidget(
  filters: [
    FilterItemBuilder.createIdFilter(
      selectedOptions: selectedStatuses,
      defaultLabel: 'All Statuses',
      onTap: (context) => showStatusFilter(context),
      isSelected: selectedStatuses.isNotEmpty,
    ),
    FilterItemBuilder.createDateFilter(
      label: 'Date Range',
      onTap: (context) => showDateRangePicker(context),
      isSelected: dateRange != null,
    ),
  ],
)
```

**Khi nào sử dụng:** Filter bars, giao diện search, hoặc bất kỳ tình huống nào yêu cầu nhiều tùy chọn filter.

---

#### InformationalBadge

A badge widget for displaying informational messages.

**Usage:**

```dart
const InformationalBadge({
  super.key,
  required this.title,
  required this.description,
  this.backgroundColor,
  this.foregroundColor,
  this.icon,
});
```

**Parameters:**
- `title` (String, required): Title of the informational badge
- `description` (String, required): Description of the informational message
- `backgroundColor` (Color?, optional): Background color of the badge
- `foregroundColor` (Color?, optional): Foreground color of the badge
- `icon` (Widget?, optional): Icon to display

**Example:**

```dart
InformationalBadge(
  title: 'Information',
  description: 'This is an informational message',
)
```

**When to use:** When displaying informational messages with consistent styling.

---

#### MediaViewHorizontal

A widget for displaying media files horizontally with navigation.

**Usage:**

```dart
const MediaViewHorizontal({
  super.key,
  required this.files,
  this.initialIndex = 0,
  this.onFileTap,
});
```

**Parameters:**
- `files` (List<MediaFile>, required): List of media files to display
- `initialIndex` (int, optional): Index of the initially displayed file. Default: 0
- `onFileTap` (Function(MediaFile)?, optional): Callback when a file is tapped

**Example:**

```dart
MediaViewHorizontal(
  files: mediaFiles,
  initialIndex: 1,
  onFileTap: (file) {
    // Handle file tap
  },
)
```

**When to use:** When displaying media files in a horizontal scrolling view.

---

#### MediaViewWidget

A widget for displaying media files with navigation controls.

**Usage:**

```dart
const MediaViewWidget({
  super.key,
  required this.files,
  this.initialIndex = 0,
  this.onFileTap,
});
```

**Parameters:**
- `files` (List<MediaFile>, required): List of media files to display
- `initialIndex` (int, optional): Index of the initially displayed file. Default: 0
- `onFileTap` (Function(MediaFile)?, optional): Callback when a file is tapped

**Example:**

```dart
MediaViewWidget(
  files: mediaFiles,
  initialIndex: 1,
  onFileTap: (file) {
    // Handle file tap
  },
)
```

**When to use:** When displaying media files with navigation controls.

---

#### MultiSelectionModal

A bottom sheet modal for selecting multiple items from a list.

**Usage:**

```dart
const MultiSelectionModal({
  super.key,
  required this.title,
  required this.items,
  required this.selectedItems,
  required this.getId,
  required this.getName,
  required this.onSelect,
  this.getSubtitle,
  this.getLeading,
  this.getTrailing,
  this.getEnabled,
});
```

**Parameters:**
- `title` (String, required): Modal title
- `items` (List<T>, required): List of items to select from
- `selectedItems` (List<dynamic>, required): List of currently selected item IDs
- `getId` (dynamic Function(T), required): Function to get item ID
- `getName` (String Function(T), required): Function to get item display name
- `onSelect` (Function(List<dynamic>), required): Callback when selection is changed
- `getSubtitle` (String? Function(T)?, optional): Function to get item subtitle
- `getLeading` (Widget? Function(T)?, optional): Function to get leading widget
- `getTrailing` (Widget? Function(T)?, optional): Function to get trailing widget
- `getEnabled` (bool Function(T)?, optional): Function to determine if item is enabled

**Static Method:**

```dart
MultiSelectionModal.show<T>({
  required BuildContext context,
  required String title,
  required List<T> items,
  required List<dynamic> selectedItems,
  required dynamic Function(T) getId,
  required String Function(T) getName,
  required Function(List<dynamic>) onSelect,
  String? Function(T)? getSubtitle,
  Widget? Function(T)? getLeading,
  Widget? Function(T)? getTrailing,
  bool Function(T)? getEnabled,
});
```

**Example:**

```dart
MultiSelectionModal.show<User>(
  context: context,
  title: 'Select Users',
  items: users,
  selectedItems: selectedUserIds,
  getId: (user) => user.id,
  getName: (user) => user.name,
  onSelect: (selectedIds) {
    setState(() {
      selectedUserIds = selectedIds;
    });
  },
)
```

**When to use:** Multiple selection from a list, multi-select filters, or multi-picker modals.

---

#### MultiSelectionSearchModal

A bottom sheet modal with search functionality for selecting multiple items.

**Usage:**

```dart
const MultiSelectionSearchModal({
  super.key,
  required this.items,
  required this.selectedItems,
  required this.getId,
  required this.getName,
  required this.onSelect,
  required this.fetchData,
  this.getSubtitle,
  this.getLeading,
  this.getTrailing,
  this.getEnabled,
});
```

**Parameters:**
- All parameters from `MultiSelectionModal` plus:
- `fetchData` (Future<List<T>> Function(String query), required): Function to fetch/search items based on query.

**Static Method:**

```dart
MultiSelectionSearchModal.show<T>({
  required BuildContext context,
  required List<T> items,
  required List<dynamic> selectedItems,
  required dynamic Function(T) getId,
  required String Function(T) getName,
  required Function(List<dynamic>) onSelect,
  required Future<List<T>> Function(String query) fetchData,
  String? Function(T)? getSubtitle,
  Widget? Function(T)? getLeading,
  Widget? Function(T)? getTrailing,
  bool Function(T)? getEnabled,
});
```

**Example:**

```dart
MultiSelectionSearchModal.show<User>(
  context: context,
  items: initialUsers,
  selectedItems: selectedUserIds,
  getId: (user) => user.id,
  getName: (user) => user.name,
  onSelect: (selectedIds) {
    // Handle selection
  },
  fetchData: (query) async {
    return await userRepository.searchUsers(query);
  },
)
```

**When to use:** Large lists requiring search for multiple selection, dynamic filtering, or remote data multiple selection.

---

#### SelectionModal

A bottom sheet modal for selecting a single item from a list.

**Usage:**

```dart
const SelectionModal({
  super.key,
  required this.title,
  required this.items,
  required this.selectedId,
  required this.getId,
  required this.getName,
  required this.onSelect,
  this.getSubtitle,
  this.getLeading,
  this.getTrailing,
  this.getEnabled,
});
```

**Parameters:**
- `title` (String, required): Modal title.
- `items` (List<T>, required): List of items to select from.
- `selectedId` (dynamic, required): ID of currently selected item.
- `getId` (dynamic Function(T), required): Function to get item ID.
- `getName` (String Function(T), required): Function to get item display name.
- `onSelect` (Function(T), required): Callback when item is selected.
- `getSubtitle` (String? Function(T)?, optional): Function to get item subtitle.
- `getLeading` (Widget? Function(T)?, optional): Function to get leading widget.
- `getTrailing` (Widget? Function(T)?, optional): Function to get trailing widget.
- `getEnabled` (bool Function(T)?, optional): Function to determine if item is enabled.

**Static Method:**

```dart
SelectionModal.show<T>({
  required BuildContext context,
  required String title,
  required List<T> items,
  required dynamic selectedId,
  required dynamic Function(T) getId,
  required String Function(T) getName,
  required Function(T) onSelect,
  String? Function(T)? getSubtitle,
  Widget? Function(T)? getLeading,
  Widget? Function(T)? getTrailing,
  bool Function(T)? getEnabled,
});
```

**Example:**

```dart
SelectionModal.show<User>(
  context: context,
  title: 'Select User',
  items: users,
  selectedId: currentUserId,
  getId: (user) => user.id,
  getName: (user) => user.name,
  onSelect: (user) {
    setState(() {
      selectedUser = user;
    });
  },
  getSubtitle: (user) => user.email,
)
```

**When to use:** Single selection from a list, dropdown alternatives, or picker modals.

---

#### SelectionSearchModal

A bottom sheet modal with search functionality for selecting a single item.

**Usage:**

```dart
const SelectionSearchModal({
  super.key,
  required this.items,
  required this.selectedId,
  required this.getId,
  required this.getName,
  required this.onSelect,
  required this.fetchData,
  this.getSubtitle,
  this.getLeading,
  this.getTrailing,
  this.getEnabled,
});
```

**Parameters:**
- All parameters from `SelectionModal` plus:
- `fetchData` (Future<List<T>> Function(String query), required): Function to fetch/search items based on query.

**Static Method:**

```dart
SelectionSearchModal.show<T>({
  required BuildContext context,
  required List<T> items,
  required dynamic selectedId,
  required dynamic Function(T) getId,
  required String Function(T) getName,
  required Function(T) onSelect,
  required Future<List<T>> Function(String query) fetchData,
  String? Function(T)? getSubtitle,
  Widget? Function(T)? getLeading,
  Widget? Function(T)? getTrailing,
  bool Function(T)? getEnabled,
});
```

**Example:**

```dart
SelectionSearchModal.show<User>(
  context: context,
  items: initialUsers,
  selectedId: currentUserId,
  getId: (user) => user.id,
  getName: (user) => user.name,
  onSelect: (user) {
    // Handle selection
  },
  fetchData: (query) async {
    return await userRepository.searchUsers(query);
  },
)
```

**When to use:** Large lists requiring search, dynamic filtering, or remote data selection.

---

#### TreeSelectionSearchModal

A bottom sheet modal with search functionality and tree structure for selecting an item.

**Usage:**

```dart
const TreeSelectionSearchModal({
  super.key,
  required this.data,
  required this.onSelect,
  this.selectedId,
});
```

**Parameters:**
- `data` (List<TreeItem>, required): Tree structured data to display
- `onSelect` (Function(dynamic), required): Callback when item is selected
- `selectedId` (dynamic, optional): ID of currently selected item

**Example:**

```dart
TreeSelectionSearchModal(
  data: treeData,
  selectedId: currentId,
  onSelect: (selectedId) {
    // Handle selection
  },
)
```

**When to use:** When selecting from hierarchical data with search functionality.

---

### Templates

#### AppThemeWrapper

A wrapper widget that applies the app theme to child widgets.

**Usage:**

```dart
const AppThemeWrapper({
  super.key,
  required this.child,
});
```

**Parameters:**
- `child` (Widget, required): Child widget to wrap with the app theme

**Example:**

```dart
AppThemeWrapper(
  child: MyApp(),
)
```

**When to use:** When applying the app theme to the root of the application.

---

#### GenericSearchDelegate

A generic search delegate for implementing search functionality in app bars.

**Usage:**

```dart
class MySearchDelegate extends GenericSearchDelegate<T> {
  @override
  Future<List<T>> searchResults(String query) async {
    // Implement search logic
  }

  @override
  Widget buildResultItem(BuildContext context, T item) {
    // Build widget for each search result
  }
}
```

**Example:**

```dart
showSearch(
  context: context,
  delegate: MySearchDelegate(),
);
```

**When to use:** When implementing consistent search functionality across the app.

---

#### LanguageAwareNavbar

A navigation bar that takes into account language direction for proper layout.

**Usage:**

```dart
const LanguageAwareNavbar({
  super.key,
  required this.items,
  required this.currentIndex,
  required this.onTap,
});
```

**Parameters:**
- `items` (List<BottomNavigationBarItem>, required): List of navigation items
- `currentIndex` (int, required): Index of the currently selected item
- `onTap` (Function(int), required): Callback when an item is tapped

**Example:**

```dart
LanguageAwareNavbar(
  items: [
    BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
    BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
  ],
  currentIndex: _selectedIndex,
  onTap: _onItemTapped,
)
```

**When to use:** When implementing navigation bars with language direction awareness.

---

#### MultipleSearchPage

A page template for multiple search functionality.

**Usage:**

```dart
const MultipleSearchPage({
  super.key,
  required this.title,
  required this.items,
  required this.selectedItems,
  required this.getId,
  required this.getName,
  required this.onSelect,
  this.onSearch,
  this.onSave,
});
```

**Parameters:**
- `title` (String, required): Title for the page
- `items` (List<T>, required): List of items to search/selection from
- `selectedItems` (List<dynamic>, required): Currently selected items
- `getId` (dynamic Function(T), required): Function to get item ID
- `getName` (String Function(T), required): Function to get item name
- `onSelect` (Function(List<dynamic>), required): Callback when selection changes
- `onSearch` (Function(String)?, optional): Callback when search is performed
- `onSave` (Function()?, optional): Callback when save action is triggered

**Example:**

```dart
MultipleSearchPage<User>(
  title: 'Select Users',
  items: users,
  selectedItems: selectedUserIds,
  getId: (user) => user.id,
  getName: (user) => user.name,
  onSelect: (selectedIds) {
    setState(() {
      selectedUserIds = selectedIds;
    });
  },
)
```

**When to use:** When implementing pages that require filtering and selection of multiple items.

---

#### PageDefault

A standard page layout with app bar, back button, title, and optional actions.

**Usage:**

```dart
const PageDefault({
  super.key,
  required this.body,
  required this.title,
  this.actions,
  this.backgroundColor,
  this.isCenterTitle,
  this.bottomNavigationBar,
  this.onGoBack,
});
```

**Parameters:**
- `body` (Widget, required): Main content of the page.
- `title` (String, required): Page title displayed in app bar.
- `actions` (List<Widget>?, optional): Action buttons in app bar.
- `backgroundColor` (Color?, optional): Background color. Default: theme surface color.
- `isCenterTitle` (bool?, optional): Center the title. Default: false.
- `bottomNavigationBar` (Widget?, optional): Bottom navigation bar.
- `onGoBack` (VoidCallback?, optional): Custom back button handler.

**Example:**

```dart
PageDefault(
  title: 'User Profile',
  actions: [
    IconButton(
      icon: Icon(Icons.edit),
      onPressed: () {
        // Edit action
      },
    ),
  ],
  body: ListView(
    children: [
      // Page content
    ],
  ),
)
```

**When to use:** Standard detail pages, forms, or any page requiring a consistent layout with app bar.

---

#### PageFooterButton

A widget that provides a standard layout with a footer button.

**Usage:**

```dart
const PageFooterButton({
  super.key,
  required this.body,
  required this.buttonLabel,
  required this.onButtonPressed,
  this.buttonType = AppFilledButtonType.primary,
  this.isLoading = false,
});
```

**Parameters:**
- `body` (Widget, required): Main content of the page
- `buttonLabel` (String, required): Label for the footer button
- `onButtonPressed` (VoidCallback, required): Callback when button is pressed
- `buttonType` (AppFilledButtonType, optional): Type of button. Default: primary
- `isLoading` (bool, optional): Whether the button is in loading state. Default: false

**Example:**

```dart
PageFooterButton(
  body: ListView(
    children: [
      // Page content
    ],
  ),
  buttonLabel: 'Submit',
  onButtonPressed: () {
    // Handle submission
  },
)
```

**When to use:** When implementing pages with a consistent footer button layout.

---

#### PushNotificationWrapper

A wrapper widget that handles push notifications in the app.

**Usage:**

```dart
const PushNotificationWrapper({
  super.key,
  required this.child,
});
```

**Parameters:**
- `child` (Widget, required): Child widget to wrap with push notification handling

**Example:**

```dart
PushNotificationWrapper(
  child: MyApp(),
)
```

**When to use:** When implementing push notification handling at the app level.

---

#### ScaffoldNavbar

A scaffold with bottom navigation bar that automatically highlights the current route.

**Usage:**

```dart
const ScaffoldNavbar({
  super.key,
  required this.child,
  required this.buildItems,
  required this.shouldShowNavbar,
});
```

**Parameters:**
- `child` (Widget, required): Main content widget.
- `buildItems` (List<ScaffoldNavbarItem> Function(), required): Function that returns navigation items.
- `shouldShowNavbar` (bool, required): Whether to show the navigation bar.

**ScaffoldNavbarItem:**

```dart
ScaffoldNavbarItem({
  required this.path,
  required this.icon,
  required this.label,
  this.activeIcon,
  this.activeAssetImage,
  this.badgeCount,
});
```

**Example:**

```dart
ScaffoldNavbar(
  shouldShowNavbar: true,
  buildItems: () => [
    ScaffoldNavbarItem(
      path: '/home',
      icon: Icons.home,
      label: 'Home',
      badgeCount: 3,
    ),
    ScaffoldNavbarItem(
      path: '/profile',
      icon: Icons.person,
      activeIcon: Icons.person_outline,
      label: 'Profile',
    ),
  ],
  child: YourPageContent(),
)
```

**When to use:** Main app navigation, tab-based navigation, or multi-section apps.

---

#### SingleSearchPage

A page template for single search functionality.

**Usage:**

```dart
const SingleSearchPage({
  super.key,
  required this.title,
  required this.items,
  required this.selectedId,
  required this.getId,
  required this.getName,
  required this.onSelect,
  this.onSearch,
  this.onSave,
});
```

**Parameters:**
- `title` (String, required): Title for the page
- `items` (List<T>, required): List of items to search/select from
- `selectedId` (dynamic, required): Currently selected item ID
- `getId` (dynamic Function(T), required): Function to get item ID
- `getName` (String Function(T), required): Function to get item name
- `onSelect` (Function(dynamic), required): Callback when selection changes
- `onSearch` (Function(String)?, optional): Callback when search is performed
- `onSave` (Function()?, optional): Callback when save action is triggered

**Example:**

```dart
SingleSearchPage<User>(
  title: 'Select User',
  items: users,
  selectedId: selectedUserId,
  getId: (user) => user.id,
  getName: (user) => user.name,
  onSelect: (id) {
    setState(() {
      selectedUserId = id;
    });
  },
)
```

**When to use:** When implementing pages that require filtering and selection of a single item.

---

#### SupaUpgradeAlert

An alert widget to notify users about app upgrades.

**Usage:**

```dart
const SupaUpgradeAlert({
  super.key,
  this.onUpdate,
});
```

**Parameters:**
- `onUpdate` (VoidCallback?, optional): Callback when update is initiated

**Example:**

```dart
SupaUpgradeAlert(
  onUpdate: () {
    // Handle update
  },
)
```

**When to use:** When notifying users about available app updates.

---

#### WorkspaceDrawer

A drawer widget for workspace navigation with tenant selection.

**Usage:**

```dart
const WorkspaceDrawer({
  super.key,
  required this.currentTenant,
  required this.onTenantChanged,
  this.additionalItems = const [],
});
```

**Parameters:**
- `currentTenant` (Tenant, required): The currently selected tenant
- `onTenantChanged` (Function(Tenant), required): Callback when tenant is changed
- `additionalItems` (List<Widget>, optional): Additional items to include in the drawer

**Example:**

```dart
WorkspaceDrawer(
  currentTenant: currentTenant,
  onTenantChanged: (tenant) {
    // Handle tenant change
  },
  additionalItems: [
    DrawerItem(text: 'Settings', icon: Icons.settings, onPressed: () {}),
  ],
)
```

**When to use:** When implementing workspace navigation with tenant switching.

---

### Sheets

#### LanguageBottomSheet

A bottom sheet for selecting the app's language.

**Usage:**

```dart
const LanguageBottomSheet({
  super.key,
  required this.currentLanguage,
  required this.onLanguageChanged,
});
```

**Parameters:**
- `currentLanguage` (String, required): Currently selected language
- `onLanguageChanged` (Function(String), required): Callback when language is changed

**Example:**

```dart
LanguageBottomSheet(
  currentLanguage: 'en',
  onLanguageChanged: (language) {
    // Handle language change
  },
)
```

**When to use:** When providing a language selection interface in a bottom sheet.

---

### Comment System

The `comment/` directory contains a comprehensive set of widgets for implementing a comment and discussion feature, including:

#### AbstractComment

Base abstract comment widget providing common functionality.

**Usage:**

```dart
abstract class AbstractComment extends StatefulWidget {
  final Comment comment;
  final Function(Comment)? onCommentUpdate;
  final Function(Comment)? onCommentDelete;

  const AbstractComment({
    super.key,
    required this.comment,
    this.onCommentUpdate,
    this.onCommentDelete,
  });
}
```

#### CommentsListWidget

A widget that displays a list of comments with loading and error states.

**Usage:**

```dart
const CommentsListWidget({
  super.key,
  required this.comments,
  this.onCommentUpdate,
  this.onCommentDelete,
  this.onLoadMore,
  this.hasMore = false,
  this.isLoading = false,
});
```

#### CommentInputWidget

A widget for inputting new comments with text, attachments, and mentions.

**Usage:**

```dart
const CommentInputWidget({
  super.key,
  required this.onSubmit,
  this.placeholder = 'Write a comment...',
  this.initialText = '',
});
```

#### ChatMessageItem

A widget that displays a single chat message with proper user identification.

**Usage:**

```dart
const ChatMessageItem({
  super.key,
  required this.message,
  required this.isCurrentUser,
  this.onMessageUpdate,
  this.onMessageDelete,
});
```

#### EmojiReactionPicker

A widget that allows users to pick emojis to react to comments or messages.

**Usage:**

```dart
const EmojiReactionPicker({
  super.key,
  required this.onEmojiSelected,
});
```

Additional components include:

- `app_user_avatar_comment.dart` - User avatars for comment system
- `attachment_picker_bottom_sheet.dart` - Attachment picker for comments
- `audio_player_view.dart` - Audio player for comment attachments
- `chat_message_item_current.dart` - Specialized chat message for current user
- `comment_skeleton_loader.dart` - Loading skeleton for comments
- `media_file_view.dart` - Media file viewer for comment attachments
- `message_content_widget.dart` - Content renderer for messages
- `message_reactions_display.dart` - Display reactions on messages
- `reaction_users_bottom_sheet.dart` - Show users who reacted to a message
- `text_avatar_comment.dart` - Text-based avatars for comments
- `user_tag_overlay.dart` - Overlay for user tags in comments
- `voice_recording_state.dart` - Voice recording state management
- `helpers/tag_text_helper.dart` - Helper for tagging in comments
- `mixins/comment_tag_mixin.dart` - Mixin for comment tagging

### Pages

The `pages/` directory contains full-page implementations:

#### AppSettingsPage

Application settings page with various configuration options.

**Usage:**

```dart
const AppSettingsPage({super.key});
```

#### AppInformationPage

Page displaying application information and about details.

**Usage:**

```dart
const AppInformationPage({super.key});
```

#### FilePreviewPage

Page for previewing files with download functionality.

**Usage:**

```dart
const FilePreviewPage({
  super.key,
  required this.file,
});
```

#### TenantSelectionPage

Page for selecting the active tenant in multi-tenant applications.

**Usage:**

```dart
const TenantSelectionPage({
  super.key,
  this.onTenantSelected,
});
```

#### MediaGalleryScreen

Screen for viewing and selecting media files from gallery.

**Usage:**

```dart
const MediaGalleryScreen({
  super.key,
  this.onFileSelected,
});
```

#### CameraCapturePageNew

Enhanced camera capture page for taking photos.

**Usage:**

```dart
const CameraCapturePageNew({
  super.key,
  this.onImageCaptured,
});
```

Additional page components include:

- `app_media_gallery_control_screen.dart`
- `camera_capture_page_new.dart`
- `device_camera_page.dart`
- `image_editor_local_screen.dart`
- `image_editor_screen.dart`
- `media_gallery_control_screen.dart`
- `media_gallery_local_screen.dart`
- `media_gallery_screen.dart`
- `media_navigation_controls.dart`
- `media_view_item.dart`
- `other_user_profile_page.dart`
- `simple_camera_capture_page.dart`
- `tenant_selection_page.dart`
- `theme_selection_page.dart`
- `video_capture_page.dart`

## Additional Widgets in Sub-Projects

### Supa Attendance Widgets

#### AttendanceAppTitle

The `AttendanceAppTitle` widget displays the user's name as the title and a given subtitle. It is used in the app bar.

**Usage:**

```dart
const AttendanceAppTitle({
  super.key,
  required this.subtitle,
});
```

**Example:**

```dart
Scaffold(
  appBar: AppBar(
    title: const AttendanceAppTitle(subtitle: 'Today'),
  ),
  body: ...
)
```

#### AttendanceCurrentTime

The `AttendanceCurrentTime` widget displays the current time, automatically updating every second.

**Usage:**

```dart
const AttendanceCurrentTime({
  super.key,
  this.style,
  this.textAlign = TextAlign.center,
});
```

**Example:**

```dart
const Center(
  child: AttendanceCurrentTime(
    style: TextStyle(fontSize: 24),
  ),
)
```

#### AttendanceIconField

The `AttendanceIconField` widget displays a field with an icon, a label, and a value. It can be tappable.

**Usage:**

```dart
const AttendanceIconField({
  super.key,
  required this.label,
  required this.value,
  required this.icon,
  this.onTap,
  this.color,
});
```

**Example:**

```dart
AttendanceIconField(
  icon: FluentIcons.clock_24_regular,
  label: 'Time',
  value: '10:00 AM',
  onTap: () {
    // Handle tap
  },
)
```

#### AttendanceSetupTitle

The `AttendanceSetupTitle` widget displays the title of a time clock setup and an info button to show the attendance rules.

**Usage:**

```dart
const AttendanceSetupTitle({
  super.key,
  required this.clockSetup,
});
```

**Example:**

```dart
AttendanceSetupTitle(
  clockSetup: timeClockSetup,
)
```

#### AttendanceShiftName

The `AttendanceShiftName` widget displays the name of a shift.

**Usage:**

```dart
const AttendanceShiftName({
  super.key,
  required this.shift,
});
```

**Example:**

```dart
AttendanceShiftName(
  shift: shift,
)
```

#### AttendanceStatusBanner

The `AttendanceStatusBanner` widget displays a banner with a message and a status.

**Usage:**

```dart
const AttendanceStatusBanner({
  super.key,
  required this.message,
  required this.status,
  this.onClose,
});
```

**Example:**

```dart
AttendanceStatusBanner(
  message: 'This is an information message.',
  status: AttendanceBannerStatus.info,
  onClose: () {
    // Handle close
  },
)
```

### Supa Bibs Widgets

#### ActionLine (Bibs)

The `ActionLine` widget is a tappable row, typically used for navigation or actions. It displays a label on the left, an optional value on the right, and a chevron icon to indicate it's tappable.

**Usage:**

```dart
const ActionLine({
  super.key,
  required this.label,
  this.value,
  this.onPressed,
});
```

**Example:**

```dart
ActionLine(
  label: 'Profile',
  value: 'View and edit',
  onPressed: () {
    // Navigate to profile page
  },
)
```

#### DataLine (Bibs)

The `DataLine` widget is a simple row for displaying a label and a corresponding value.

**Usage:**

```dart
const DataLine({
  super.key,
  required this.label,
  this.value,
});
```

**Example:**

```dart
DataLine(
  label: 'Email',
  value: 'test@example.com',
)
```

#### FilterSelectionField

The `FilterSelectionField` widget is a non-editable text field that is used to trigger a selection, typically for filtering. It displays a label, hint text, and a suffix icon. Tapping on it triggers the `onTap` callback.

**Usage:**

```dart
const FilterSelectionField({
  super.key,
  required this.controller,
  required this.labelText,
  required this.hintText,
  required this.suffixIcon,
  required this.onTap,
});
```

**Example:**

```dart
FilterSelectionField(
  controller: _filterController,
  labelText: 'Status',
  hintText: 'Select a status',
  suffixIcon: Icons.arrow_drop_down,
  onTap: () {
    // Show a dialog to select a status
  },
)
```

#### MasterListItem

The `MasterListItem` widget is a container for a list item that provides a consistent styling and a tappable area.

**Usage:**

```dart
const MasterListItem({
  super.key,
  required this.onPressed,
  required this.child,
});
```

**Example:**

```dart
MasterListItem(
  onPressed: () {
    // Handle item tap
  },
  child: const Padding(
    padding: EdgeInsets.all(16.0),
    child: Text('This is a list item'),
  ),
)
```

#### SearchModal

The `SearchModal` is a generic and reusable widget for searching and selecting an entity from a list. It provides a search field, handles fetching and filtering data, and displays the results in a list.

**Usage:**

```dart
const SearchModal({
  super.key,
  required this.onSelected,
  this.branchId,
  required this.filterList,
  required this.filter,
  required this.renderTile,
  required this.label,
  required this.title,
  this.floatingActionButton,
});
```

**Example:**

```dart
SearchModal<User, UserFilter>(
  title: 'Search User',
  label: 'Search by name',
  filter: UserFilter(),
  filterList: (filter) => userRepository.getUsers(filter),
  onSelected: (user) {
    // Handle selected user
  },
  renderTile: (user) => Text(user.name),
)
```

### Supa Serving Widgets

#### ServingBottomGroupActions

The `ServingBottomGroupActions` widget displays a group of actions at the bottom of the screen. It typically includes a primary "continue" button and an optional "cancel" button.

**Usage:**

```dart
const ServingBottomGroupActions({
  super.key,
  required this.onContinue,
  required this.continueLabel,
  this.continueIcon,
  this.onCancel,
  this.cancelLabel,
  this.cancelIcon,
  this.isLoading = false,
});
```

**Example:**

```dart
ServingBottomGroupActions(
  onContinue: () {
    // Handle continue action
  },
  continueLabel: 'Submit',
  onCancel: () {
    // Handle cancel action
  },
  cancelLabel: 'Cancel',
)
```

#### ServingTicketDetailView

The `ServingTicketDetailView` widget is a comprehensive view for displaying the details of a serving ticket. It manages loading states, provides a refresh indicator, and shows various pieces of information related to the ticket. It also includes slots for custom bottom actions and extra content.

**Usage:**

```dart
const ServingTicketDetailView({
  super.key,
  required this.initialTicket,
  this.bottomActions,
  this.extraContent,
  this.showRating = false,
});
```

**Example:**

```dart
ServingTicketDetailView(
  initialTicket: ticket,
  bottomActions: ServingBottomGroupActions(
    onContinue: () {},
    continueLabel: 'Confirm',
  ),
  extraContent: Text('Extra content here'),
)
```

#### ServingFormInfo

The `ServingFormInfo` widget is a tappable field that displays an icon, a label, and a value. It's used to show information in a form-like structure.

**Usage:**

```dart
const ServingFormInfo({
  super.key,
  required this.label,
  required this.value,
  required this.icon,
  required this.onTap,
  this.color,
});
```

**Example:**

```dart
ServingFormInfo(
  icon: FluentIcons.person_24_regular,
  label: 'Customer',
  value: 'John Doe',
  onTap: () {
    // Handle tap
  },
)
```

#### ServingInformationBadge

The `ServingInformationBadge` widget displays a badge with a title, a description, and a warning icon. It is used to highlight important information.

**Usage:**

```dart
const ServingInformationBadge({
  super.key,
  required this.title,
  required this.description,
  this.backgroundColor,
  this.foregroundColor,
});
```

**Example:**

```dart
ServingInformationBadge(
  title: 'Important Information',
  description: 'Please read this before proceeding.',
)
```

#### ServingTicketRating

The `ServingTicketRating` widget provides a star rating bar, allowing users to rate a serving ticket.

**Usage:**

```dart
const ServingTicketRating({
  super.key,
  required this.ticket,
  this.rating,
  this.onRatingChanged,
  this.size = 40,
  this.color,
});
```

**Example:**

```dart
ServingTicketRating(
  ticket: ticket,
  onRatingChanged: (rating) {
    // Handle rating change
  },
)
```

#### ServingWarningBadge

The `ServingWarningBadge` widget displays a dismissible warning message.

**Usage:**

```dart
const ServingWarningBadge({
  super.key,
  required this.warning,
  required this.onDismiss,
});
```

**Example:**

```dart
ServingWarningBadge(
  warning: 'This is a warning message.',
  onDismiss: () {
    // Handle dismiss
  },
)
```

#### TicketTerminationDialog

The `TicketTerminationDialog` provides a static method `showCancelDialog` to display a dialog for confirming ticket termination.

**Usage:**

```dart
static Future<void> showCancelDialog(
  BuildContext context, {
  required Ticket ticket,
  VoidCallback? onCancelSuccess,
  VoidCallback? onCancelError,
})
```

**Example:**

```dart
TicketTerminationDialog.showCancelDialog(
  context,
  ticket: ticket,
  onCancelSuccess: () {
    // Handle success
  },
  onCancelError: () {
    // Handle error
  },
);
```

### Supa Spend Widgets

#### ApprovalHistoryWidget

The `ApprovalHistoryWidget` widget displays the approval history of a request, showing each step of the approval process.

**Usage:**

```dart
const ApprovalHistoryWidget({
  super.key,
  required this.history,
});
```

**Example:**

```dart
ApprovalHistoryWidget(
  history: approvalHistory,
)
```

#### AttachmentItem

The `AttachmentItem` widget displays a single attachment, which can be either a file or a link. It shows an appropriate icon, the attachment name, and for files, it displays the file size and a download/open button.

**Usage:**

```dart
const AttachmentItem({
  super.key,
  required this.item,
});
```

**Example:**

```dart
AttachmentItem(
  item: attachment,
)
```

#### AttachmentList

The `AttachmentList` widget displays a list of attachments using the `AttachmentItem` widget for each item in the list.

**Usage:**

```dart
const AttachmentList({
  super.key,
  required this.files,
  this.showTitle = true,
});
```

**Example:**

```dart
AttachmentList(
  files: attachments,
)
```

#### CatalogImage

The `CatalogImage` widget displays an image from a catalog, handling loading and error states gracefully.

**Usage:**

```dart
const CatalogImage({
  super.key,
  required this.url,
  this.height,
  this.width,
  this.boxFit,
  this.alignment = Alignment.center,
  this.errorWidget,
});
```

**Example:**

```dart
CatalogImage(
  url: 'https://example.com/image.jpg',
  width: 100,
  height: 100,
  boxFit: BoxFit.cover,
)
```

#### FormAttachmentTab

The `FormAttachmentTab` widget provides a user interface for managing attachments within a form. It allows users to add attachments by taking photos with the camera, selecting images from the gallery, or picking various file types, and then displays these attachments in an `AttachmentList`.

**Usage:**

```dart
const FormAttachmentTab({
  super.key,
  required this.repository,
  required this.attachments,
  required this.onAddFiles,
});
```

**Example:**

```dart
FormAttachmentTab(
  repository: myApiClient,
  attachments: myAttachmentsList,
  onAddFiles: (files) {
    // Handle adding new files
)
```

#### ItemContentTemplate

The `ItemContentTemplate` widget is designed to display the content of an item in a standardized list format. It features an item image (or a text avatar if no image is available), the item's name and code, its total price, quantity, and unit of measure.

**Usage:**

```dart
const ItemContentTemplate({
  super.key,
  this.onPressed,
  required this.catalogImageMappings,
  required this.item,
  this.itemName = '',
  required this.total,
  required this.quantity,
  required this.unitOfMeasure,
  required this.currency,
  this.showTopBorder = false,
});
```

**Example:**

```dart
ItemContentTemplate(
  item: item,
  catalogImageMappings: item.catalogImageMappings.value,
  total: 100.0,
  quantity: 1,
  unitOfMeasure: UnitOfMeasure(name: 'Each'),
  currency: Currency(code: 'USD'),
  onPressed: () {
    // Handle item tap
  },
)
```

#### QuickSlidableApprovalActions

The `QuickSlidableApprovalActions` widget provides a slidable interface for performing quick approval or rejection actions on a document. It integrates with `flutter_slidable` to reveal "Approve" and "Reject" buttons.

**Usage:**

```dart
const QuickSlidableApprovalActions({
  super.key,
  required this.child,
  required this.onApprove,
  required this.onReject,
  this.onDissmissed,
  required this.item,
});
```

**Example:**

```dart
QuickSlidableApprovalActions(
  item: approvableDocument,
  onApprove: () async {
    // Handle approval
  },
  onReject: () async {
    // Handle rejection
  },
  child: ListTile(
    title: Text('Document Title'),
    subtitle: Text('Document Details'),
  ),
)
```

#### RejectionModal

The `RejectionModal` widget is a modal dialog that prompts the user to provide a reason for rejecting an item. It includes a text input field for the reason and action buttons for submission and cancellation.

**Usage:**

```dart
const RejectionModal({
  super.key,
  required this.title,
  this.description,
  this.descriptionWidget,
  required this.onReject,
  this.onCancel,
});
```

**Example:**

```dart
showDialog(
  context: context,
  builder: (context) => RejectionModal(
    title: 'Reject Request',
    description: 'Please provide a reason for rejecting this request.',
    onReject: (reason) async {
      // Handle rejection with reason
    },
    onCancel: () {
      // Handle cancellation
    },
  ),
);
```

#### TextAreaModal

The `TextAreaModal` widget provides a full-screen modal with a multi-line text input area. It includes a title, a "Cancel" button, and a "Done" button, and a callback for when the input is submitted.

**Usage:**

```dart
const TextAreaModal({
  super.key,
  required this.title,
  required this.onSubmit,
});
```

**Example:**

```dart
showModalBottomSheet(
  context: context,
  isScrollControlled: true,
  builder: (context) {
    return TextAreaModal(
      title: 'Enter Reason',
      onSubmit: (value) {
        // Handle submitted text
      },
    );
  },
);
```

### Supa Training Widgets

#### AudioPlayerWidget

The `AudioPlayerWidget` provides a robust audio player with play/pause functionality, a progress bar that allows seeking, and comprehensive handling for loading and error states. It is designed to play audio from a given URL.

**Usage:**

```dart
const AudioPlayerWidget({
  super.key,
  required this.audioUrl,
  this.onPlaybackComplete,
  required this.isProcessing,
  this.audioName,
  this.onPlayerCreated,
});
```

**Example:**

```dart
AudioPlayerWidget(
  audioUrl: 'https://example.com/audio.mp3',
  isProcessing: false,
  audioName: 'My Audio Track',
  onPlaybackComplete: () {
    print('Playback completed!');
  },
)
```

#### ContentWidget

The `ContentWidget` is responsible for displaying HTML content fetched from a specified URL. It provides visual feedback for loading states and error conditions, with a retry mechanism.

**Usage:**

```dart
const ContentWidget({
  super.key,
  required this.title,
  required this.fileUrl,
  required this.fileName,
});
```

**Example:**

```dart
ContentWidget(
  title: 'Lesson 1: Introduction',
  fileUrl: 'https://example.com/lesson1.html',
  fileName: 'lesson1.html',
)
```

#### CourseCard

The `CourseCard` widget displays a compact overview of a training course, featuring its image, name, type, and (if applicable) end date. It's designed to be tappable for further interaction.

**Usage:**

```dart
const CourseCard({
  super.key,
  required this.course,
  required this.onTap,
  this.itemHeight = 280,
  this.isSmall,
});
```

**Example:**

```dart
CourseCard(
  course: course,
  onTap: () {
    // Navigate to course details
  },
)
```

#### CustomSelectionGroup

The `CustomSelectionGroup` widget allows users to select one or multiple options from a provided list of `QuestionAnswer` objects. It supports both single and multi-selection modes and provides visual feedback for correct answers once the question has been answered.

**Usage:**

```dart
const CustomSelectionGroup({
  super.key,
  required this.options,
  required this.onChanged,
  required this.answered,
  required this.answerMappings,
  this.isMultiSelect = false,
});
```

**Example:**

```dart
CustomSelectionGroup(
  options: [
    QuestionAnswer(id: 1, content: 'Option 1', isCorrectAnswer: false),
    QuestionAnswer(id: 2, content: 'Option 2', isCorrectAnswer: true),
  ],
  onChanged: (selectedOptions) {
    print('Selected options: $selectedOptions');
  },
  answered: false,
  answerMappings: [],
  isMultiSelect: false,
)
```

#### OptionChoice

The `OptionChoice` widget is an interactive component designed for presenting multiple-choice or single-choice questions within training modules. It features a countdown timer, displays question content (including a title and an optional image), and allows users to select answers with visual feedback. It supports both single and multiple answer selections.

**Usage:**

```dart
const OptionChoice({
  super.key,
  required this.contents,
  this.file,
  required this.title,
  required this.time,
  required this.selecteds,
  this.onUpdateOption,
  this.onTimeUp,
  required this.courseSectionId,
  required this.courseSectionContentId,
  required this.isCompleted,
  required this.isMultipleChoice,
});
```

**Example:**

```dart
OptionChoice(
  title: 'What is Flutter?',
  time: 60,
  contents: [
    CourseSectionContentAnswerOption(id: 1, content: 'A bird', isCorrect: false),
    CourseSectionContentAnswerOption(id: 2, content: 'A UI toolkit', isCorrect: true),
  ],
  selecteds: [],
  courseSectionId: 1,
  courseSectionContentId: 1,
  isCompleted: false,
  isMultipleChoice: false,
  onUpdateOption: (selected) {
    print('Selected: $selected');
  },
  onTimeUp: (timeUp) {
    print('Time up: $timeUp');
  },
)
```

#### PathCard

The `PathCard` widget displays a card representing a training path, showcasing its image, name, and the total number of courses it encompasses. It is designed to be tappable for user interaction.

**Usage:**

```dart
const PathCard({
  super.key,
  required this.trainingPath,
  required this.onTap,
  this.itemHeight = 132,
});
```

**Example:**

```dart
PathCard(
  trainingPath: trainingPath,
  onTap: () {
    // Navigate to training path details
  },
)
```

#### QuestionAnswerResult

The `QuestionAnswerResult` widget displays the outcome of a question and answer, visually indicating whether the answer was correct or incorrect through an icon and corresponding text.

**Usage:**

```dart
const QuestionAnswerResult({
  super.key,
  required this.isCorrect,
  required this.content,
});
```

**Example:**

```dart
QuestionAnswerResult(
  isCorrect: true,
)
```

#### QuizCard

The `QuizCard` widget displays a quiz entry, showing its name, deadline, and a visual indicator (lock icon) if prerequisite courses are not completed. It handles user interaction, including navigation to course previews when required.

**Usage:**

```dart
const QuizCard({
  super.key,
  required this.quiz,
  required this.onTap,
  this.itemHeight = 240,
});
```

**Example:**

```dart
QuizCard(
  quiz: quizPartition,
  onTap: () {
    // Navigate to quiz details
  },
)
```

#### ResponsiveGridView

The `ResponsiveGridView` widget arranges a list of items in a grid layout, dynamically adjusting the number of columns based on the available screen width to provide a responsive user interface.

**Usage:**

```dart
const ResponsiveGridView({
  super.key,
  required this.items,
  required this.itemHeight,
  this.padding,
});
```

**Example:**

```dart
ResponsiveGridView(
  items: const [
    Card(child: Center(child: Text('Item 1'))),
    Card(child: Center(child: Text('Item 2'))),
    Card(child: Center(child: Text('Item 3'))),
  ],
  itemHeight: 150,
)
```

#### SidleImage

The `SidleImage` widget presents a series of images as slides, optionally accompanied by notes. It provides a `PageView` for navigation, a page indicator, and functionality for full-screen image viewing, suitable for step-by-step training content.

**Usage:**

```dart
const SidleImage({
  super.key,
  required this.contents,
  required this.hasAudioFile,
});
```

**Example:**

```dart
SidleImage(
  contents: [
    CourseSectionContentSlide(
      image: File(url: 'https://example.com/slide1.jpg'),
      note: 'This is the first slide.',
    ),
    CourseSectionContentSlide(
      image: File(url: 'https://example.com/slide2.jpg'),
      note: 'This is the second slide.',
    ),
  ],
)
```

#### TextBorderButton

The `TextBorderButton` widget provides a customizable button with a text label, a border, and optional features like an icon and a loading indicator.

**Usage:**

```dart
const TextBorderButton({
  super.key,
  required this.text,
  required this.onPressed,
  this.isLoading = false,
  this.mainAxisAlignment = MainAxisAlignment.start,
  this.icon,
  this.textStyle,
});
```

**Example:**

```dart
TextBorderButton(
  text: 'Submit',
  onPressed: () {
    // Handle button press
  },
)
```

#### TrainingAttachmentItem

The `TrainingAttachmentItem` widget displays a single attachment, which can be either a file or a link. It shows an appropriate icon, the attachment name, and for files, it displays the file size and a download/open button. This widget is functionally identical to `AttachmentItem` in `supa_spend`.

**Usage:**

```dart
const TrainingAttachmentItem({
  super.key,
  required this.item,
});
```

**Example:**

```dart
TrainingAttachmentItem(
  item: attachment,
)
```

#### TrueFalseChoice

The `TrueFalseChoice` widget is a specialized interactive component designed for presenting true/false questions within training modules. It shares similar functionalities with `OptionChoice` but is optimized for binary answer selections. It includes a timer, displays content (title, optional image), and allows users to make true/false selections.

**Usage:**

```dart
const TrueFalseChoice({
  super.key,
  required this.contents,
  this.file,
  required this.title,
  required this.time,
  required this.selecteds,
  this.onUpdateOption,
  this.onTimeUp,
  required this.courseSectionId,
  required this.courseSectionContentId,
  required this.isCompleted,
  required this.isMultipleChoice,
  required this.content,
});
```

**Example:**

```dart
TrueFalseChoice(
  title: 'Is Flutter a UI framework?',
  time: 30,
  contents: [
    CourseSectionContentAnswerOption(id: 1, content: 'True', isCorrect: true),
    CourseSectionContentAnswerOption(id: 2, content: 'False', isCorrect: false),
  ],
  selecteds: [],
  courseSectionId: 1,
  courseSectionContentId: 1,
  isCompleted: false,
  isMultipleChoice: false,
  content: 'Select true or false.',
  onUpdateOption: (selected) {
    print('Selected: $selected');
  },
)
```

#### YoutubeVideoPlayerWidget

The `YoutubeVideoPlayerWidget` embeds and plays YouTube videos, providing playback controls and handling various video states.

**Usage:**

```dart
const YoutubeVideoPlayerWidget({
  super.key,
  required this.videoUrl,
  this.onVideoComplete,
  this.isAutoplay = true,
  this.isRewind = false,
  this.isLandscape = false,
});
```

**Example:**

```dart
YoutubeVideoPlayerWidget(
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
  isAutoplay: true,
  onVideoComplete: () {
    print('Video playback completed!');
  },
)
```

### Supa Work Widgets

#### Atoms

##### EnumBadge

The `EnumBadge` widget displays a status badge based on an `EnumModel`. It uses `TextStatusBadge` internally to render the badge with appropriate colors and text.

**Usage:**

```dart
const EnumBadge({
  super.key,
  required this.status,
  this.backgroundColor,
});
```

**Example:**

```dart
EnumBadge(
  status: someEnumValue,
)
```

##### LocationRichText

The `LocationRichText` widget displays a rich text string, highlighting a specific portion of the text. It is typically used for presenting location-related information.

**Usage:**

```dart
const LocationRichText({
  super.key,
  required this.firstText,
  required this.highlightedText,
  this.lastText,
});
```

**Example:**

```dart
LocationRichText(
  firstText: 'You are currently at ',
  highlightedText: 'Building A',
  lastText: ', Floor 3.',
)
```

##### OutOfRangeWarning

The `OutOfRangeWarning` widget displays a warning message indicating that the user is outside a predefined geographical range. It shows the current distance, the maximum allowed distance, and provides an option to navigate to Google Maps.

**Usage:**

```dart
const OutOfRangeWarning({
  super.key,
  required this.distance,
  required this.maxAllowedDistance,
  required this.onNavigateToGoogleMaps,
  required this.formattedDistance,
});
```

**Example:**

```dart
OutOfRangeWarning(
  distance: 150.0,
  maxAllowedDistance: 100.0,
  formattedDistance: '150 meters',
  onNavigateToGoogleMaps: () {
    // Navigate to Google Maps
  },
)
```

#### Molecules

##### AnalyticsIconButton

The `AnalyticsIconButton` widget is an icon button that, when tapped, navigates the user to the analytics page associated with a specific board ID.

**Usage:**

```dart
const AnalyticsIconButton({
  super.key,
  required this.boardId,
});
```

**Example:**

```dart
AnalyticsIconButton(
  boardId: 123,
)
```

##### WorkCalendarSwitchViewButton

The `WorkCalendarSwitchViewButton` widget is an icon button used to toggle between a calendar view and a list view. The icon changes dynamically based on the current view.

**Usage:**

```dart
const WorkCalendarSwitchViewButton({
  super.key,
  required this.isCalendar,
  required this.onPressed,
});
```

**Example:**

```dart
WorkCalendarSwitchViewButton(
  isCalendar: true, // Assuming current view is calendar
  onPressed: () {
    // Toggle view
  },
)
```

#### Organisms

##### AppSearchBarAnalytics

The `AppSearchBarAnalytics` widget is a custom `AppBar` that integrates an analytics icon button, a search field, and a profile button. It provides a consistent header for pages requiring these functionalities.

**Usage:**

```dart
AppSearchBarAnalytics({
  super.key,
  required this.searchHint,
  this.onProfilePressed,
  this.onSearch,
  required this.boardId,
});
```

**Example:**

```dart
AppSearchBarAnalytics(
  searchHint: 'Search tasks',
  boardId: 123,
  onSearch: () {
    // Handle search action
  },
  onProfilePressed: () {
    // Handle profile button press
  },
)
```

##### WorkInspectionEmptyState

The `WorkInspectionEmptyState` widget displays a clear message and a relevant SVG illustration when there are no inspection tasks to show. It includes a title and a subtitle to inform the user.

**Usage:**

```dart
const WorkInspectionEmptyState({super.key});
```

**Example:**

```dart
WorkInspectionEmptyState()
```

##### WorkTaskAssignmentEmptyState

The `WorkTaskAssignmentEmptyState` widget provides a visual indication with an SVG image and a subtitle when there are no task assignments to display, guiding the user in an empty state.

**Usage:**

```dart
const WorkTaskAssignmentEmptyState({super.key});
```

**Example:**

```dart
WorkTaskAssignmentEmptyState()
```

#### Templates

##### PageActionsDefault

The `PageActionsDefault` widget provides a standard page layout with a customizable app bar. This app bar includes a back button, a title, and an optional list of actions. The main content of the page is provided through its `body` property and is scrollable.

**Usage:**

```dart
const PageActionsDefault({
  super.key,
  required this.body,
  required this.title,
  this.actions,
  this.onGoBack,
  this.backgroundColor,
  this.controller,
});
```

**Example:**

```dart
PageActionsDefault(
  title: 'My Page',
  onGoBack: () {
    // Handle custom back action
  },
  actions: [
    IconButton(
      icon: Icon(Icons.settings),
      onPressed: () {
        // Handle settings action
      },
    ),
  ],
  body: Center(
    child: Text('Page Content'),
  ),
)
```

## Component Relationships

### Filter Components

- `GenericFilterWidget` uses `DropdownChip` and `MultipleSelectChip`
- `MultipleSelectChip` uses `DropdownChip` internally
- Filter modals (`SelectionModal`, `SelectionSearchModal`) are used by filter chips

### Navigation Components

- `ScaffoldNavbar` uses `AppBadgeIcon` for navigation items with badges
- `PageDefault` provides standard page layout used throughout the app

### Form Components

- `Input` is the primary text input component
- `AppFilledButton` is used for form submissions
- `ActionLine` can be used for form settings or options

## Component Selection Guide

### When to use Atoms vs Molecules vs Organisms

- **Atoms**: Use for simple, single-purpose components (buttons, inputs, badges)
- **Molecules**: Use for combinations of atoms that form a functional unit (label + value, icon + badge)
- **Organisms**: Use for complex, feature-complete components (modals, filters, navigation)

### Common Patterns

1. **Form Input**: Use `Input` atom
2. **Form Submission**: Use `AppFilledButton` atom
3. **Data Display**: Use `DataLine` molecule
4. **Navigation**: Use `ActionLine` molecule or `ScaffoldNavbar` template
5. **Selection**: Use `SelectionModal` or `SelectionSearchModal` organisms
6. **Filtering**: Use `GenericFilterWidget` organism with appropriate filter items

## Sub-Project Component Libraries

-   [Supa Attendance Widgets](supa_attendance_widgets.md)
-   [Supa Bibs Widgets](supa_bibs_widgets.md)
-   [Supa Serving Widgets](supa_serving_widgets.md)
-   [Supa Spend Widgets](supa_spend_widgets.md)
-   [Supa Training Widgets](supa_training_widgets.md)
-   [Supa Work Widgets](supa_work_widgets.md)
