# Personal Report - Default Filter & Label Display

## Tóm Tắt Thay Đổi

### 1. Set Filter Mặc Định Theo Tháng Hiện Tại

**File:** `lib/pages/personal_report/personal_report_page.dart`

Khi vào `PersonalReportPage`, filter sẽ tự động được set theo tháng hiện tại (từ ngày đầu tiên đến ngày cuối cùng của tháng).

**Code:**
```dart
void _initializeDefaultFilter() {
  final now = DateTime.now();
  final firstDayOfMonth = DateTime(now.year, now.month, 1);
  final lastDayOfMonth = DateTime(now.year, now.month + 1, 0);

  filter.dateFilter.greaterEqual = firstDayOfMonth;
  filter.dateFilter.lessEqual = lastDayOfMonth;
}
```

### 2. Hiển Thị Label Đúng Khi Filter Đã Có Giá Trị

**File:** `lib/pages/personal_report/widgets/personal_report_filter_scroll.dart`

Widget filter giờ đây sẽ:
- Kiểm tra xem filter đã có giá trị date không
- Nếu có, tìm preset option tương ứng (Today, This Week, This Month, This Quarter)
- Nếu match với preset, hiển thị label của preset đó
- Nếu không match (custom date range), format và hiển thị khoảng ngày tùy chỉnh

**Code:**
```dart
void _initializeFilterLabels() {
  // Check if filter already has date values
  if (_filter.dateFilter.greaterEqual != null &&
      _filter.dateFilter.lessEqual != null) {
    final currentRange = DateTimeRange(
      start: _filter.dateFilter.greaterEqual!,
      end: _filter.dateFilter.lessEqual!,
    );

    // Try to find a matching preset option
    final option = DateFilterBottomSheet.getCurrentDateRangeOption(currentRange);
    
    if (option != null) {
      // Use the preset option label
      final (_, label) = DateFilterBottomSheet.getDateRangeFromOption(option);
      _dateLabel = label;
    } else {
      // Custom date range - format it
      final dateFormatter = DateFormat(DateTimeFormatsVN.dateOnly);
      _dateLabel =
          '${dateFormatter.format(currentRange.start)} - ${dateFormatter.format(currentRange.end)}';
    }
  } else {
    _dateLabel = translate('training.personalReport.filter.allDateTypes');
  }
}
```

**Added imports:**
```dart
import 'package:intl/intl.dart';
import 'package:supa_architecture/supa_architecture.dart';
```

## Kết Quả

### Trước Khi Thay Đổi
- ❌ Filter không có giá trị mặc định
- ❌ Label hiển thị "Tất cả thời gian" ngay cả khi đã có filter

### Sau Khi Thay Đổi  
- ✅ Filter mặc định là tháng hiện tại
- ✅ Label hiển thị "Tháng này" (hoặc khoảng ngày tương ứng)
- ✅ Màu của chip đổi sang selected state
- ✅ Data được load với filter đúng ngay từ đầu

## Testing

- ✅ `dart format` - All files formatted
- ✅ `flutter analyze` - No issues found

## Ví Dụ

Nếu hôm nay là **14/01/2026**:
- Filter sẽ được set: `01/01/2026 00:00:00` → `31/01/2026 23:59:59`
- Label hiển thị: **"Tháng này"**
- Chip màu primary (selected)
- API được gọi với filter tháng 1/2026

## Flow Hoạt Động

```
PersonalReportPage khởi tạo
    ↓
_initializeDefaultFilter() được gọi
    ↓
Set filter.dateFilter.greaterEqual = 01/01/2026
Set filter.dateFilter.lessEqual = 31/01/2026
    ↓
PersonalReportFilterScroll khởi tạo
    ↓
_initializeFilterLabels() được gọi
    ↓
Phát hiện filter có giá trị
    ↓
Check với getCurrentDateRangeOption()
    ↓
Match với DateRangeOption.thisMonth
    ↓
Set _dateLabel = "Tháng này"
    ↓
Widget render với label đúng và màu selected
```

## Lợi Ích

1. **UX tốt hơn**: Người dùng thấy ngay dữ liệu của tháng hiện tại, thường là thông tin họ quan tâm nhất
2. **Consistency**: Filter state và UI display luôn đồng bộ
3. **Performance**: Giảm lượng data load ban đầu bằng cách chỉ load dữ liệu tháng hiện tại
4. **Clarity**: Label rõ ràng cho người dùng biết đang xem dữ liệu của khoảng thời gian nào
