# Quy tắc Styling

Tài liệu này mô tả các quy tắc styling cho dự án SupaMobileApp, bao gồm thông tin về kích thước font, border radius, màu sắc, spacing và typography.

Các quy tắc styling được định nghĩa trong thư mục `packages/supa_foundation/lib/theme`.

## Typography

### Kích thước Font

Ứng dụng sử dụng một bộ kích thước font được định nghĩa trước, được định nghĩa trong class `FontSize` tại `packages/supa_foundation/lib/theme/theme.dart`.

| Tên       | Kích thước | Cách sử dụng                           |
| ---------- | ---- | ------------------------------- |
| `xSmall`   | 10.0 | Badge text, nhãn nhỏ        |
| `small`    | 12.0 | Text phụ, chú thích        |
| `medium`   | 14.0 | Body text, list items           |
| `large`    | 16.0 | Primary body text               |
| `xLarge`   | 18.0 | App bar titles, section headers |
| `xxLarge`  | 20.0 | Page titles                     |
| `xxxLarge` | 22.0 | Large headings                  |

### Font Weights

Ứng dụng sử dụng font weights chuẩn của Material:

- `FontWeight.w400` (normal) - Mặc định cho body text
- `FontWeight.w500` (medium) - Selected items, text được nhấn mạnh
- `FontWeight.w600` (semi-bold) - Titles, headers, nhãn quan trọng

### Text Styles

Các text styles chuẩn có sẵn thông qua `Theme.of(context).textTheme`:

- `labelSmall` - Nhãn nhỏ (10-12px)
- `labelMedium` - Nhãn trung bình (12-14px)
- `labelLarge` - Nhãn lớn (14-16px), dùng cho app bar titles
- `bodySmall` - Body text nhỏ (12px)
- `bodyMedium` - Body text trung bình (14px), mặc định cho hầu hết nội dung
- `bodyLarge` - Body text lớn (16px)
- `titleSmall` - Tiêu đề nhỏ (14px)
- `titleMedium` - Tiêu đề trung bình (16px)
- `titleLarge` - Tiêu đề lớn (20-22px)

## Spacing

Ứng dụng sử dụng hệ thống spacing grid 8px để đảm bảo khoảng cách layout nhất quán.

### Giá trị Spacing thường dùng

| Giá trị | Cách sử dụng                                      |
| ----- | ------------------------------------------ |
| 4px   | Khoảng cách chặt giữa các phần tử liên quan     |
| 8px   | Khoảng cách chuẩn giữa các phần tử          |
| 12px  | Padding cho các components nhỏ               |
| 16px  | Padding chuẩn, khoảng cách giữa các sections |
| 24px  | Khoảng cách lớn, margins của sections             |
| 32px  | Khoảng cách rất lớn, margins của pages          |

### Component Padding

- **List Tiles**: 16px ngang, 0px dọc (minVerticalPadding: 16px)
- **Cards**: 8px margin tất cả các phía
- **Chips**: 8px ngang, 4px dọc
- **Buttons**: Thay đổi theo loại button (xem Button Styles)
- **Input Fields**: 12px padding dưới, padding trái thay đổi

## Border Radius

Border radius chuẩn được sử dụng trong toàn bộ ứng dụng để đảm bảo giao diện nhất quán.

- **Standard Border Radius:** 8px (dùng cho cards, buttons, input fields, bottom sheets)
- **Chip Border Radius:** 28px (chips tròn)
- **Badge Border Radius:** 10px

Các giá trị này được định nghĩa trong `SupaThemeExtension` tại `packages/supa_foundation/lib/theme/supa_theme_extension.dart`.

## Colors

Ứng dụng sử dụng `ColorScheme` chuẩn của Material và mở rộng với một color scheme tùy chỉnh gọi là `SupaExtendedColorScheme`. Điều này cho phép một bảng màu nhất quán trong toàn bộ ứng dụng.

Color scheme được cấu hình trong method `withValues` của `SupaThemeExtension`.

### Material ColorScheme

Ứng dụng sử dụng Material 3 color schemes với các biến thể light và dark. Các màu chính bao gồm:

- **Primary**: `#6D14E0` (light) / `#D4BBFF` (dark) - Màu brand chính
- **Secondary**: `#5C00C4` (light) / `#F6EEFF` (dark) - Các hành động phụ
- **Tertiary**: `#71585D` (light) / `#FFFFFF` (dark) - Màu accent
- **Error**: `#BA1A1A` (light) / `#FFB4AB` (dark) - Trạng thái lỗi
- **Surface**: `#FCF8F8` (light) / `#262628` (dark) - Background surfaces

### SupaExtendedColorScheme

Extended color scheme cung cấp thêm các màu semantic cho status indicators, tags, và thông báo thông tin.

#### Status Colors

Mỗi status color có ba biến thể: text, background, và border.

| Status          | Text Color | Background Color | Border Color | Cách sử dụng                             |
| --------------- | ---------- | ---------------- | ------------ | --------------------------------- |
| **Warning**     | `#FAAD14`  | `#FFFBE6`        | `#FFE58F`    | Thông báo cảnh báo, alerts          |
| **Information** | `#1677FF`  | `#E6F4FF`        | `#91CAFF`    | Thông báo thông tin            |
| **Success**     | `#52C41A`  | `#F6FFED`        | `#B7EB8F`    | Thông báo thành công, xác nhận   |
| **Error**       | `#FF4D4F`  | `#FFF2F0`        | `#FFCCC7`    | Thông báo lỗi, lỗi validation |
| **Default**     | `#000000`  | `#F0F0F0`        | `#D9D9D9`    | Trạng thái mặc định/trung tính            |

#### Tag Colors

Tag colors được sử dụng để phân loại và gắn nhãn nội dung. Mỗi tag color có các biến thể text, background, và border.

| Tag Color    | Text      | Background | Border    | Cách sử dụng                  |
| ------------ | --------- | ---------- | --------- | ---------------------- |
| **Blue**     | `#1668DC` | `#E6F4FF`  | `#91CAFF` | Tags chung           |
| **Cyan**     | `#13A8A8` | `#E6FFFB`  | `#87E8DE` | Tags phụ         |
| **Geekblue** | `#2B4ACB` | `#F0F5FF`  | `#ADC6FF` | Tags kỹ thuật         |
| **Gold**     | `#D89614` | `#FFFBE6`  | `#FFD666` | Tags premium/ưu tiên  |
| **Green**    | `#49AA19` | `#F6FFED`  | `#B7EB8F` | Tags tích cực/đã duyệt |
| **Lime**     | `#8BBB11` | `#FCFFE6`  | `#EAFF8F` | Tags đang hoạt động            |
| **Magenta**  | `#CB2B83` | `#FFF0F6`  | `#FFADD2` | Tags đặc biệt           |
| **Orange**   | `#D87A16` | `#FFF7E6`  | `#FFD591` | Tags cảnh báo           |
| **Purple**   | `#722ED1` | `#F9F0FF`  | `#D3ADF7` | Tags danh mục          |
| **Red**      | `#D32029` | `#FFF2F0`  | `#FFCCC7` | Tags khẩn cấp/quan trọng |
| **Volcano**  | `#D84A1B` | `#FFF2E8`  | `#FFBB96` | Tags nghiêm trọng          |

### Truy cập Extended Colors

Extended colors có thể được truy cập thông qua theme extension:

```dart
final theme = Theme.of(context);
final extendedColors = theme.extension<SupaExtendedColorScheme>();

// Truy cập status colors
final warningColor = extendedColors?.warningText;
final successBg = extendedColors?.successBackground;

// Truy cập tag colors
final blueTagText = extendedColors?.blueTagText;
final greenTagBg = extendedColors?.greenTagBackground;
```

## Component Styles

`SupaThemeExtension` định nghĩa các styles mặc định cho các UI components khác nhau để đảm bảo giao diện nhất quán trong toàn bộ ứng dụng.

### Buttons

#### Filled Buttons

- **Border Radius**: 8px
- **Shape**: RoundedRectangleBorder
- **Alignment**: Center
- **Background**: Sử dụng `colorScheme.primary` theo mặc định
- **Types**: primary, secondary, tertiary, danger, warning, success, info, primaryContainer, secondaryContainer, tertiaryContainer, errorContainer

#### Outlined Buttons

- **Border Radius**: 8px
- **Border Width**: 1px
- **Border Color**: `colorScheme.primary`
- **Shape**: RoundedRectangleBorder

#### Elevated Buttons

- **Border Radius**: 8px
- **Border Width**: 1px
- **Border Color**: `colorScheme.primary`
- **Shape**: RoundedRectangleBorder

### Chips

- **Background**: `colorScheme.surfaceContainerLowest`
- **Padding**: 8px ngang, 4px dọc
- **Border Radius**: 28px (tròn)
- **Border**: 1px solid với `borderColor` (outlineVariant với 16% opacity)

### Search Bars

- **Background**: `colorScheme.surfaceContainerLowest`
- **Elevation**: 0 (shadows tùy chỉnh được áp dụng)
- **Border Radius**: 8px
- **Shape**: RoundedRectangleBorder

### List Tiles

- **Min Vertical Padding**: 16px
- **Content Padding**: 16px ngang, 0px dọc
- **Border Radius**: 0px (vuông)
- **Title Text Style**: 
  - Font size: 14px
  - Font weight: 400 (normal)
  - Color: `colorScheme.onSurface`

### App Bars

- **Background**: `colorScheme.surface`
- **Foreground**: `colorScheme.onSurface`
- **Elevation**: 0 (không có shadow)
- **Scrolled Under Elevation**: 0
- **Center Title**: true (mặc định)
- **Title Spacing**: 4px
- **Title Text Style**:
  - Font size: 18px
  - Font weight: 600 (semi-bold)
  - Color: `colorScheme.onSurface`

### Cards

- **Elevation**: 1
- **Shadow Color**: `colorScheme.onSurface`
- **Margin**: 8px tất cả các phía
- **Background**: `colorScheme.surface`
- **Border Radius**: 8px
- **Shape**: RoundedRectangleBorder

### Bottom Sheets

- **Background**: `colorScheme.surfaceContainer`
- **Border Radius**: 8px (góc trên)
- **Shape**: RoundedRectangleBorder
- **Show Drag Handle**: false

### Drawers

- **Shape**: RoundedRectangleBorder với zero radius (góc vuông)
- **Background**: Sử dụng drawer theme của theme

### Badges

- **Padding**: 0 (không có padding)
- **Offset**: (4, 4) - Đặt cách 4px bên phải và 4px xuống dưới từ anchor

### Navigation Bars

#### Bottom Navigation Bar

- **Type**: Fixed (luôn hiển thị labels)
- **Background**: `colorScheme.surfaceContainer`
- **Selected Item Color**: `colorScheme.onSurface`
- **Unselected Item Color**: `colorScheme.onSurfaceVariant`
- **Icon Size**: 24px
- **Selected Label Style**: Font weight 600 (semi-bold)
- **Unselected Label Style**: Font weight normal
- **Elevation**: 0 (sử dụng border thay vì)

#### Material 3 Navigation Bar

- **Background**: `colorScheme.surfaceContainerLow`
- **Indicator Color**: `colorScheme.secondaryContainer`
- **Icon Theme**: `colorScheme.onSecondaryContainer`
- **Height**: 80px
- **Surface Tint**: Transparent
- **Shadow**: Transparent

### Dividers

- **Color**: `outlineVariant` với 16% opacity
- **Thickness**: 0.5px
- **Indent**: 0
- **End Indent**: 0
- **Space**: 0

### Date Pickers

- **Background**: `colorScheme.surface`
- Sử dụng Material 3 date picker theme

### Tab Bars

- **Divider Height**: 0.5px
- Sử dụng Material 3 tab bar theme

## Shadows and Elevation

- **Shadow Color**: `colorScheme.outlineVariant`
- **Card Elevation**: 1
- **Button Elevation**: 0 (sử dụng borders để định nghĩa)
- **App Bar Elevation**: 0

## Page Transitions

Ứng dụng sử dụng page transitions theo platform:

- **Android**: ZoomPageTransitionsBuilder
- **iOS**: CupertinoPageTransitionsBuilder

## Border Widths

- **Standard Border**: 0.5px (dùng cho input fields, dividers)
- **Button Border**: 1px (dùng cho outlined và elevated buttons)
- **Chip Border**: 1px

## Dark Mode

Ứng dụng hỗ trợ đầy đủ dark mode với các color schemes chuyên dụng. Tất cả màu sắc có các biến thể light và dark được định nghĩa trong `supa_material_theme.dart`. Dark mode color scheme cung cấp độ tương phản và khả năng đọc phù hợp cho môi trường ánh sáng yếu.
