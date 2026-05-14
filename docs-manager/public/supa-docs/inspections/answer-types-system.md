# Answer Types System

## Overview

Inspection system hỗ trợ 12 loại câu trả lời khác nhau, mỗi loại có UI và logic xử lý riêng. Mỗi `InspectionQuestion` có `answerTypeId` quyết định widget type được render.

## Answer Type Enum

**Path**: `lib/models/enums/answer_type_enum.dart`

```dart
enum AnswerTypeEnum {
  TEXT,             // 1 - Nhập text tự do
  NUMBER,           // 2 - Nhập số với format
  IMAGE,            // 3 - Upload ảnh/video
  DATETIME,         // 4 - Chọn ngày/giờ
  SINGLE_CHOICE,    // 5 - Chọn 1 đáp án
  MULTIPLE_CHOICE,  // 6 - Chọn nhiều đáp án
  INSTRUCTION,      // 7 - Hiển thị hướng dẫn (không có answer)
  LOCATION,         // 8 - Chọn/nhập location
  SITE,             // 9 - Chọn site từ danh sách
  DATE_DEFAULT,     // 10 - Date picker mặc định
  USER_DEFAULT,     // 11 - Chọn user từ danh sách
  CODE_DEFAULT,     // 12 - Nhập code
}
```

## Type Details

### 1. TEXT (answerTypeId = 1)

**Widget**: `InspectionQuestionTypeTextAndNumber` → `AnswerField`

**UI Component**:

```dart
TextField(
  controller: _textController,
  onChanged: widget.onChanged,
  decoration: InputDecoration(
    hintText: translate.general.pleaseInput,
    border: OutlineInputBorder(),
  ),
)
```

**Data Storage**:

```dart
InspectionQuestionAnswer {
  textValue: String  // User input
}
```

**Use Cases**:

- Nhập tên, mô tả, ghi chú
- Câu trả lời dạng văn bản tự do
- Comments, observations

**Validation**:

- Required check
- Min/max length (nếu có config)

---

### 2. NUMBER (answerTypeId = 2)

**Widget**: `InspectionQuestionTypeTextAndNumber` → `AnswerField`

**UI Component**:

```dart
TextField(
  controller: _textController,
  keyboardType: TextInputType.number,
  inputFormatters: [
    FilteringTextInputFormatter.allow(RegExp(r'[0-9.,]'))
  ],
  onChanged: (value) {
    // Parse và format number
    final raw = value.replaceAll(',', '');
    final number = double.tryParse(raw);
    if (number != null) {
      // Format: #,##0.#####
      widget.onChanged!(numberFormat.format(number));
    }
  },
)
```

**Data Storage**:

```dart
InspectionQuestionAnswer {
  numberValue: double  // Parsed number
}
```

**Features**:

- Auto-format với dấu phẩy (1,000,000)
- Khi focus: remove format để dễ edit
- Khi unfocus: apply format lại
- Hỗ trợ số thập phân (tối đa 5 chữ số)
- Optional unit display (numberUnit)

**Use Cases**:

- Đo đạc (nhiệt độ, kích thước, khối lượng)
- Đếm số lượng
- Tính toán điểm số

**Validation**:

- Required check
- Min/max value (nếu có config)
- Number format

---

### 3. IMAGE (answerTypeId = 3)

**Widget**: `InspectionQuestionTypeMedia` → `AnswerField` → `MediaViewWidgetControl`

**UI Component**:

```dart
MediaViewWidgetControl(
  files: fileMappings,
  onAdd: () => pickImages(),
  onDelete: (file) => deleteFile(file),
  allowUploadFromLibrary: true,
)
```

**Data Storage**:

```dart
InspectionQuestionAnswer {
  imageId: int         // -1: placeholder, >0: uploaded
  image: File          // Full file object
  uploadProgress: double  // 0.0 - 1.0
}
```

**Upload Flow**:

1. User picks images → Create placeholders (`imageId = -1`)
2. Start upload → Progress callback updates `uploadProgress`
3. Upload complete → Replace placeholders với real files
4. Sync to server → `syncQuestionAnswer()`

**Features**:

- Multi-image upload
- Real-time progress display (%)
- Watermark support
- Gallery preview
- Delete confirmation

**Use Cases**:

- Photo evidence của công việc
- Before/after photos
- Damage reports
- Progress tracking

**Validation**:

- Required check (at least 1 image)
- File size limits
- Image format check

**See Also**: [Upload Progress Implementation](./upload-progress-implementation.md)

---

### 4. DATETIME (answerTypeId = 4)

**Widget**: `InspectionQuestionTypeDateTime` → `AnswerField`

**UI Component**:

```dart
InkWell(
  onTap: widget.onTapDate,
  child: Container(
    padding: EdgeInsets.all(12),
    decoration: BoxDecoration(
      border: Border.all(color: Colors.grey),
      borderRadius: BorderRadius.circular(8),
    ),
    child: Text(
      formattedDate,  // dd/MM/yyyy HH:mm or dd/MM/yyyy
      style: TextStyle(fontSize: 16),
    ),
  ),
)
```

**Data Storage**:

```dart
InspectionQuestionAnswer {
  date: DateTime  // Selected date/time
}

InspectionQuestion {
  useTime: bool   // Include time picker or date only
}
```

**Date Picker**:

```dart
// Date only
final date = await showDatePicker(
  context: context,
  initialDate: DateTime.now(),
  firstDate: DateTime(2000),
  lastDate: DateTime(2100),
);

// With time
final time = await showTimePicker(
  context: context,
  initialTime: TimeOfDay.now(),
);

final dateTime = DateTime(
  date.year, date.month, date.day,
  time.hour, time.minute,
);
```

**Format Display**:

- `useTime = true`: `dd/MM/yyyy HH:mm`
- `useTime = false`: `dd/MM/yyyy`

**Use Cases**:

- Scheduled inspections
- Deadline tracking
- Event logging
- Time-sensitive checks

---

### 5. SINGLE_CHOICE (answerTypeId = 5)

**Widget**: `InspectionQuestionTypeSelectOptions` hoặc `InspectionQuestionResponseSetTypeSelectOptions`

**Decision**:

```dart
if (question.questionnaireResponseSetId.value != 0) {
  // Use ResponseSet widget
  return InspectionQuestionResponseSetTypeSelectOptions(...);
} else {
  // Use Options widget
  return InspectionQuestionTypeSelectOptions(...);
}
```

**UI Component**:

```dart
// Display selected option
InkWell(
  onTap: () => _selectOptions(),
  child: Container(
    child: Text(
      selectedOption?.content ?? translate.general.pleaseSelect,
    ),
  ),
)

// Selection modal
InpectionSelectOptions(
  options: widget.options,
  answerTypeId: AnswerTypeEnum.SINGLE_CHOICE.value,
  onSelectOption: (option, selectedIndexes) {
    // Save selection
  },
)
```

**Data Storage**:

```dart
InspectionQuestionAnswer {
  inspectionAnswerOptionId: int
  inspectionAnswerOption: InspectionAnswerOption {
    id: int
    content: String
    score: double?        // For scoring
    answerOptionId: int
  }
}
```

**Features**:

- Radio button selection
- Clear selection option
- Score-based options
- Conditional logic trigger

**Use Cases**:

- Yes/No questions
- Quality ratings (Good/Fair/Poor)
- Status selection (Pass/Fail)
- Single choice surveys

---

### 6. MULTIPLE_CHOICE (answerTypeId = 6)

**Widget**: Same as SINGLE_CHOICE (logic handles multiple selection)

**UI Component**:

```dart
// Display selected count
InkWell(
  onTap: () => _selectOptions(),
  child: Text(
    '${selectedOptions.length} ${translate.general.itemsSelected}',
  ),
)

// Selection modal with checkboxes
InpectionSelectOptions(
  options: widget.options,
  answerTypeId: AnswerTypeEnum.MULTIPLE_CHOICE.value,
  onSelectOption: (option, selectedIndexes) {
    // Save multiple selections
  },
)
```

**Data Storage**:

```dart
List<InspectionQuestionAnswer> [
  {
    inspectionAnswerOptionId: int
    inspectionAnswerOption: InspectionAnswerOption
  },
  // ... more selections
]
```

**Features**:

- Checkbox selection
- Select all/none
- Score aggregation
- Complex conditional logic

**Use Cases**:

- Checklist items
- Multi-select surveys
- Feature selection
- Inspection categories

---

### 7. INSTRUCTION (answerTypeId = 7)

**Widget**: `InspectionQuestionTypeInstruction`

**UI Component**:

```dart
// No input field - just display content
InstructionContentType(
  file: widget.inspectionQuestion.instructionFile.value,
)
```

**Features**:

- Không có answer data
- Hiển thị text/media instructions
- Optional attached file (PDF, image)
- Can have note/attachments cho question

**Data Storage**:

```dart
InspectionQuestion {
  instructionFile: File?  // Optional attachment
}

// No InspectionQuestionAnswer needed
```

**Use Cases**:

- Safety instructions
- Procedure steps
- Guidelines
- Reference material

---

### 8. LOCATION (answerTypeId = 8)

**Widget**: `InspectionQuestionTypeLocation` → `AnswerField`

**UI Component**:

```dart
InkWell(
  onTap: () => _showLocationPicker(),
  child: Container(
    child: Text(
      displayValue,  // Address or coordinates
    ),
  ),
)
```

**Data Storage**:

```dart
InspectionQuestionAnswer {
  latitude: double
  longitude: double
  address: String      // Geocoded address
}
```

**Location Picker**:

```dart
LocationPickerBottomSheet(
  initialLocation: LatLng(lat, lng),
  onLocationSelected: (LatLng location, String address) {
    // Update answer
  },
)
```

**Display Logic**:

```dart
String _getDisplayValue() {
  final answer = question.inspectionQuestionAnswers.value.first;
  if (answer.address.value.isNotEmpty) {
    return answer.address.value;
  } else if (answer.latitude.value != 0 && answer.longitude.value != 0) {
    return '${answer.latitude.value.toStringAsFixed(6)}, ${answer.longitude.value.toStringAsFixed(6)}';
  }
  return '';
}
```

**Features**:

- Map picker
- GPS auto-detect
- Address search
- Geocoding/reverse geocoding

**Use Cases**:

- Site location verification
- Asset tracking
- Route inspection
- Incident reporting

---

### 9-12. Other Types

**SITE (9)**, **DATE_DEFAULT (10)**, **USER_DEFAULT (11)**, **CODE_DEFAULT (12)** - Similar pattern với TEXT type nhưng có specialized pickers.

---

## Widget Mapping Table

| Answer Type     | Value | Widget Class                        | Input Component    | Data Field               |
| --------------- | ----- | ----------------------------------- | ------------------ | ------------------------ |
| TEXT            | 1     | InspectionQuestionTypeTextAndNumber | TextField          | textValue                |
| NUMBER          | 2     | InspectionQuestionTypeTextAndNumber | TextField (number) | numberValue              |
| IMAGE           | 3     | InspectionQuestionTypeMedia         | MediaViewWidget    | imageId, image           |
| DATETIME        | 4     | InspectionQuestionTypeDateTime      | DatePicker         | date                     |
| SINGLE_CHOICE   | 5     | InspectionQuestionTypeSelectOptions | Modal picker       | inspectionAnswerOptionId |
| MULTIPLE_CHOICE | 6     | InspectionQuestionTypeSelectOptions | Modal picker       | List<Answer>             |
| INSTRUCTION     | 7     | InspectionQuestionTypeInstruction   | Read-only          | (none)                   |
| LOCATION        | 8     | InspectionQuestionTypeLocation      | Map picker         | latitude, longitude      |

## Common Props Pattern

Tất cả InspectionQuestionType widgets nhận common props:

```dart
class InspectionQuestionType[X] extends StatefulWidget {
  // Question data
  final InspectionQuestion inspectionQuestion;
  final Inspection inspectionDetail;
  final int answerTypeId;

  // Callbacks
  final Future<void> Function(InspectionQuestion) updateInspectionQuestion;
  final Future<void> Function(InspectionQuestion) onUpdateInspectionFileMapping;
  final Future<void> Function(List<File>) updateFiles;
  final Future<void> Function(InspectionQuestionFileMapping) onDelete;
  final Future<void> Function() onReload;
  final ValueChanged<String> onChangedNote;
  final Future<void> Function() onUpdateNote;

  // UI state
  final String nameImageCustom;  // Unique key for media
}
```

## Answer Data Access Pattern

```dart
// Get answer based on type
if (answerTypeId == AnswerTypeEnum.TEXT.value) {
  final answer = question.inspectionQuestionAnswers.value[0];
  final text = answer.textValue.value;
}

if (answerTypeId == AnswerTypeEnum.NUMBER.value) {
  final answer = question.inspectionQuestionAnswers.value[0];
  final number = answer.numberValue.value;
}

if (answerTypeId == AnswerTypeEnum.IMAGE.value) {
  // Multiple answers (multiple images)
  for (var answer in question.inspectionQuestionAnswers.value) {
    final imageId = answer.imageId.value;
    final file = answer.image.value;
  }
}

if (answerTypeId == AnswerTypeEnum.SINGLE_CHOICE.value) {
  final answer = question.inspectionQuestionAnswers.value[0];
  final option = answer.inspectionAnswerOption.value;
  final score = option.score.value;
}

if (answerTypeId == AnswerTypeEnum.MULTIPLE_CHOICE.value) {
  // Multiple answers
  for (var answer in question.inspectionQuestionAnswers.value) {
    final option = answer.inspectionAnswerOption.value;
  }
}
```

## Validation Rules by Type

```dart
// TEXT
- Required: textValue.isNotEmpty
- MaxLength: textValue.length <= maxLength

// NUMBER
- Required: numberValue != null
- Range: numberValue >= min && numberValue <= max

// IMAGE
- Required: inspectionQuestionAnswers.length > 0
- Uploaded: all imageId > 0 (no placeholders)

// DATETIME
- Required: date != null
- Range: date >= startDate && date <= endDate

// SINGLE_CHOICE
- Required: inspectionQuestionAnswers.length == 1

// MULTIPLE_CHOICE
- Required: inspectionQuestionAnswers.length > 0
- MinSelect: length >= minSelect
- MaxSelect: length <= maxSelect

// LOCATION
- Required: latitude != 0 && longitude != 0
```

## Adding New Answer Type

### Step 1: Add to Enum

```dart
// lib/models/enums/answer_type_enum.dart
enum AnswerTypeEnum {
  // ... existing
  NEW_TYPE;  // 13

  int get value {
    switch (this) {
      // ... existing
      case AnswerTypeEnum.NEW_TYPE:
        return 13;
    }
  }
}
```

### Step 2: Create Widget

```dart
// lib/pages/inspection/widgets/inspection_answer/inspection_question_types/
// inspection_question_type_new_type.dart

class InspectionQuestionTypeNewType extends StatefulWidget {
  // Common props
  final InspectionQuestion inspectionQuestion;
  // ... all standard props
}

class _InspectionQuestionTypeNewTypeState extends State<...> {
  @override
  Widget build(BuildContext context) {
    return AnswerTypeItem(
      // Wrapper props
      title: widget.inspectionQuestion.content.value,
      isRequired: widget.inspectionQuestion.isRequired.value,
      // ...

      child: AnswerField(
        answerTypeId: widget.answerTypeId,
        // Custom props for this type
        onChanged: (value) {
          // Handle input
        },
      ),
    );
  }
}
```

### Step 3: Add to buildInspectionQuestion

```dart
// lib/pages/inspection/inspection_answer_page.dart
Widget buildInspectionQuestion(InspectionQuestion question) {
  final answerTypeId = question.answerTypeId.value;

  // ... existing types

  if (answerTypeId == AnswerTypeEnum.NEW_TYPE.value) {
    return InspectionQuestionTypeNewType(
      inspectionQuestion: question,
      // ... props
    );
  }
}
```

### Step 4: Add Data Field (if needed)

```dart
// lib/core/models/inspection_question_answer.dart
class InspectionQuestionAnswer extends JsonModel {
  @override
  List<JsonField> get fields => [
    // ... existing
    newTypeValue,
  ];

  JsonString newTypeValue = JsonString('newTypeValue');
}
```

### Step 5: Add Validation

```dart
// lib/services/inspection_validator.dart
ValidationResult validateQuestionAnswer(InspectionQuestion question) {
  if (question.answerTypeId.value == AnswerTypeEnum.NEW_TYPE.value) {
    if (question.isRequired.value) {
      // Check if answered
    }
  }
}
```

## Related Documentation

- [Architecture Overview](./architecture-overview.md)
- [Models Overview](./models-overview.md)
- [Answer Field Component](./answer-field.md)
