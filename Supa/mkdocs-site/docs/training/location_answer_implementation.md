# Thêm Loại Câu Hỏi "Lấy vị trí" (LOCATION) vào AnswerInformationDetailPage

## Tổng quan
Đã thành công thêm hỗ trợ hiển thị loại câu hỏi LOCATION trong trang AnswerInformationDetailPage, cho phép hiển thị thông tin vị trí (địa chỉ và tọa độ) của các câu trả lời trong inspection.

## Các thay đổi đã thực hiện

### 1. File: `answer_information_detail_page.dart`

#### 1.1. Thêm LOCATION vào danh sách answer types được hỗ trợ (dòng 366)
```dart
if (![
  AnswerTypeEnum.TEXT.value,
  AnswerTypeEnum.NUMBER.value,
  AnswerTypeEnum.DATETIME.value,
  AnswerTypeEnum.SINGLE_CHOICE.value,
  AnswerTypeEnum.MULTIPLE_CHOICE.value,
  AnswerTypeEnum.IMAGE.value,
  AnswerTypeEnum.INSTRUCTION.value,
  AnswerTypeEnum.LOCATION.value  // ← Thêm mới
].contains(answerTypeId)) {
  return Container();
}
```

#### 1.2. Thêm helper method `_buildLocationAnswer` (dòng 349-413)
Helper method mới để xây dựng widget hiển thị câu trả lời location với các tính năng:

**Chức năng:**
- Kiểm tra xem câu hỏi có câu trả lời hay không
- Hiển thị địa chỉ (nếu có) với icon `location_on`
- Hiển thị tọa độ (latitude, longitude) với icon `my_location`
- Format tọa độ với 6 chữ số thập phân
- Responsive layout với Expanded widget

**Cấu trúc hiển thị:**
```
📍 [Địa chỉ đầy đủ]
🎯 [latitude], [longitude]
```

**Code:**
```dart
Widget _buildLocationAnswer(InspectionQuestion inspectionQuestion,
    TextTheme textTheme, ColorScheme colorScheme) {
  if (!_service.hasAnswers(inspectionQuestion)) {
    return _buildNoAnswerText(textTheme, colorScheme);
  }

  final answer = inspectionQuestion.inspectionQuestionAnswers.value.first;
  final bool hasAddress = answer.address.value.isNotEmpty;
  final bool hasCoordinates =
      answer.latitude.value != 0 && answer.longitude.value != 0;

  if (!hasAddress && !hasCoordinates) {
    return _buildNoAnswerText(textTheme, colorScheme);
  }

  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      if (hasAddress) ...[
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
              Icons.location_on,
              size: 16,
              color: colorScheme.primary,
            ),
            const SizedBox(width: 4),
            Expanded(
              child: Text(
                answer.address.value,
                style: textTheme.bodySmall?.copyWith(
                  color: colorScheme.onSurface,
                ),
              ),
            ),
          ],
        ),
      ],
      if (hasCoordinates) ...[
        if (hasAddress) const SizedBox(height: 8),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
              Icons.my_location,
              size: 16,
              color: colorScheme.onSurfaceVariant,
            ),
            const SizedBox(width: 4),
            Expanded(
              child: Text(
                '${answer.latitude.value.toStringAsFixed(6)}, ${answer.longitude.value.toStringAsFixed(6)}',
                style: textTheme.bodySmall?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ],
        ),
      ],
    ],
  );
}
```

#### 1.3. Cập nhật `buildInspectionQuestion` để gọi helper (dòng 463-464)
```dart
if (answerTypeId == AnswerTypeEnum.LOCATION.value)
  _buildLocationAnswer(inspectionQuestion, textTheme, colorScheme),
```

## Các rules và giao diện đã tuân theo

### Rules từ AnswerInformationDetailPage:
✅ **Kiểm tra has answers**: Sử dụng `_service.hasAnswers()` để kiểm tra trước khi hiển thị
✅ **No answer text**: Hiển thị `_buildNoAnswerText()` khi không có dữ liệu
✅ **Helper method pattern**: Tạo `_buildLocationAnswer()` theo pattern của `_buildTextBasedAnswer()` và `_buildChoiceAnswer()`
✅ **Theme integration**: Sử dụng `textTheme` và `colorScheme` từ theme
✅ **Widget composition**: Sử dụng Column, Row, Icon, Text với spacing phù hợp

### Giao diện (UI/UX):
✅ **Icons**: Sử dụng Material Icons (`location_on`, `my_location`)
✅ **Layout**: Row với CrossAxisAlignment.start cho responsive
✅ **Spacing**: SizedBox(height: 8) giữa address và coordinates
✅ **Text style**: bodySmall với màu phù hợp (onSurface, onSurfaceVariant)
✅ **Color scheme**: Primary cho address icon, onSurfaceVariant cho coordinates icon
✅ **Responsive**: Expanded widget để text wrap properly

## Cách hoạt động

1. **Validation**: Kiểm tra answer type có phải LOCATION không
2. **Data check**: Kiểm tra có answer data không
3. **Display logic**:
   - Nếu có cả address và coordinates → Hiển thị cả hai
   - Nếu chỉ có address → Hiển thị address
   - Nếu chỉ có coordinates → Hiển thị coordinates
   - Nếu không có gì → Hiển thị "No answer"

## Testing

### Test cases cần kiểm tra:
1. ✅ Câu hỏi LOCATION có đầy đủ address và coordinates
2. ✅ Câu hỏi LOCATION chỉ có address
3. ✅ Câu hỏi LOCATION chỉ có coordinates
4. ✅ Câu hỏi LOCATION không có câu trả lời
5. ✅ Code formatting (dart format) passed
6. ✅ Static analysis (flutter analyze) passed

## Ví dụ dữ liệu hiển thị

```
Câu hỏi: Vị trí công trình
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 123 Đường ABC, Phường XYZ, Quận 1, 
   TP. Hồ Chí Minh

🎯 10.762622, 106.660172
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Tương thích

- ✅ Compatible với existing InspectionQuestion model
- ✅ Compatible với existing InspectionQuestionAnswer model  
- ✅ Sử dụng existing AnswerTypeEnum.LOCATION (value = 8)
- ✅ Tương thích với InspectionQuestionTypeLocation widget trong inspection answer page
- ✅ Không cần thêm translation mới (sử dụng 'work.general.noAnswer' đã có sẵn)

## Tổng kết

Feature "Lấy vị trí" đã được thêm thành công vào AnswerInformationDetailPage với:
- Giao diện đẹp, nhất quán với các loại câu hỏi khác
- Code clean, tuân theo pattern hiện tại
- Đầy đủ validation và error handling
- Không có lint errors
- Sẵn sàng để test và sử dụng
