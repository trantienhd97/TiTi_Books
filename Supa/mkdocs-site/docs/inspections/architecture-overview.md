# Inspection Architecture Overview

## Component Hierarchy

```
InspectionAnswerPage (Stateful Page)
├── InspectionHeader (Header với info/actions)
├── TabBarView (Pages/Sections)
│   └── ListView (Questions)
│       └── buildInspectionQuestion() → Chọn widget type
│           ├── InspectionQuestionTypeTextAndNumber
│           ├── InspectionQuestionTypeSelectOptions
│           ├── InspectionQuestionResponseSetTypeSelectOptions
│           ├── InspectionQuestionTypeMedia
│           ├── InspectionQuestionTypeDateTime
│           ├── InspectionQuestionTypeLocation
│           └── InspectionQuestionTypeInstruction
└── InspectionAnswerFooter (Actions: Complete, Export)
```

## Widget Type Selection Logic

```dart
Widget buildInspectionQuestion(InspectionQuestion question) {
  final answerTypeId = question.answerTypeId.value;

  // TEXT (1) hoặc NUMBER (2)
  if (answerTypeId == AnswerTypeEnum.TEXT.value ||
      answerTypeId == AnswerTypeEnum.NUMBER.value) {
    return InspectionQuestionTypeTextAndNumber(...);
  }

  // SINGLE_CHOICE (5) hoặc MULTIPLE_CHOICE (6)
  if (answerTypeId == AnswerTypeEnum.SINGLE_CHOICE.value ||
      answerTypeId == AnswerTypeEnum.MULTIPLE_CHOICE.value) {
    // Có ResponseSet → dùng ResponseSet widget
    if (question.questionnaireResponseSetId.value != 0) {
      return InspectionQuestionResponseSetTypeSelectOptions(...);
    }
    // Không có → dùng Options widget
    return InspectionQuestionTypeSelectOptions(...);
  }

  // IMAGE (3)
  if (answerTypeId == AnswerTypeEnum.IMAGE.value) {
    return InspectionQuestionTypeMedia(...);
  }

  // DATETIME (4)
  if (answerTypeId == AnswerTypeEnum.DATETIME.value) {
    return InspectionQuestionTypeDateTime(...);
  }

  // LOCATION (8)
  if (answerTypeId == AnswerTypeEnum.LOCATION.value) {
    return InspectionQuestionTypeLocation(...);
  }

  // INSTRUCTION (7)
  if (answerTypeId == AnswerTypeEnum.INSTRUCTION.value) {
    return InspectionQuestionTypeInstruction(...);
  }
}
```

## Data Flow

### 1. Answer Input Flow

```
User Input/Selection
  ↓
InspectionQuestionType[X] Widget
  ↓
AnswerTypeItem (Wrapper)
  ↓
AnswerField (Input component)
  ↓
onChanged/onSelectOption callback
  ↓
InspectionAnswerPage state update
  ↓
currentInspectionQuestion = updated question
  ↓
_handleUpdateInspectionQuestionAnswer()
  ↓
MobileInspectionRepository.syncQuestionAnswer()
  ↓
Fire-and-forget API call
```

### 2. Media Upload Flow

```
User picks images
  ↓
AbstractInspectionMediaState.onImagesPicked()
  ↓
Create placeholders (imageId = -1, uploadProgress = 0.0)
  ↓
Update UI với placeholders
  ↓
WorkFileRepository.uploadInspectionFiles()
  ├─> onUploadProgress callback (0% → 100%)
  │   └─> onUpdateUploadProgress() → setState()
  └─> Returns uploaded files
  ↓
onNewAttachmentAdded(files)
  ├─> Remove placeholders
  └─> Add real answers/mappings
  ↓
syncQuestionAnswer() hoặc syncQuestion()
```

### 3. File Attachment Flow

```
User adds note/files to question
  ↓
AnswerTypeItem footer actions
  ↓
onUpdateNote() / updateFiles()
  ↓
Update question.note / question.inspectionQuestionFileMappings
  ↓
_handleUpdateQuestion()
  ↓
MobileInspectionRepository.syncQuestion()
  ↓
Fire-and-forget API call
```

## Key Components

### InspectionAnswerPage

**Path**: `lib/pages/inspection/inspection_answer_page.dart`

**Responsibilities**:

- Quản lý toàn bộ inspection state
- Build question widgets theo type
- Handle validation và scoring
- Coordinate API calls
- Manage page/section navigation

**Key State**:

```dart
Inspection? inspectionDetail;
InspectionQuestion? currentInspectionQuestion;
Map<int, GlobalKey> _questionKeys;
final InspectionValidator _validator;
final InspectionScoreCalculator _scoreCalculator;
```

**Key Methods**:

- `buildInspectionQuestion()` - Chọn widget type theo answerTypeId
- `_handleUpdateInspectionQuestionAnswer()` - Sync answer to server
- `_handleUpdateQuestion()` - Sync note/files to server
- `_addAttachment()` - Add uploaded files to question
- `_pickImageFromGallery()` - Trigger image picker

### AnswerTypeItem

**Path**: `lib/pages/inspection/widgets/inspection_answer/answer_type_item.dart`

**Responsibilities**:

- Wrapper chung cho tất cả answer types
- Render title, required badge, error/warning messages
- Footer với note input, file attachments, task list
- Media display grid
- Handle file upload/delete actions

**Props**:

```dart
final Widget child;                 // Actual input widget (AnswerField, etc)
final String title;                 // Question content
final bool isRequired;              // Show required badge
final bool isAnswered;              // Show answered badge
final bool isError;                 // Show error state
final String textError;             // Error message
final String textWarning;           // Warning message
final List<InspectionQuestionFileMapping> files;  // Attached files
final String note;                  // Question note
final InspectionType type;          // Answer vs Question vs Information
```

**Key Features**:

- Conditional rendering (show/hide based on answer logic)
- Task assignment integration
- Media grid display
- Note editing
- File upload/delete

### AnswerField

**Path**: `lib/pages/inspection/widgets/inspection_answer/answer_field.dart`

**Extends**: `AbstractInspectionMediaState`

**Responsibilities**:

- Render actual input field theo answerTypeId
- Handle text/number input
- Handle single/multiple choice selection
- Handle date/time picker
- Handle image upload với progress
- Location picker integration

**Answer Type Rendering**:

```dart
// TEXT (1)
TextField(
  controller: _textController,
  onChanged: widget.onChanged,
  decoration: InputDecoration(hintText: translate.general.pleaseInput),
)

// NUMBER (2)
TextField(
  controller: _textController,
  keyboardType: TextInputType.number,
  inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[0-9.,]'))],
)

// SINGLE_CHOICE (5) / MULTIPLE_CHOICE (6)
InkWell(
  onTap: _selectOptions,
  child: Text(selectedOptions display),
)

// IMAGE (3)
MediaViewWidgetControl(
  files: fileMappings,
  onUploadProgress: ...,
)

// DATETIME (4)
InkWell(
  onTap: widget.onTapDate,
  child: Text(formatted date),
)

// LOCATION (8)
InkWell(
  onTap: _showLocationPicker,
  child: Text(address or coordinates),
)
```

**Media Upload Integration**:

```dart
@override
Future<void> onUpdateUploadProgress(double progress) async {
  if (mounted) {
    setState(() {
      // Update placeholders (imageId == -1)
      for (var answer in widget.inspectionQuestion!.inspectionQuestionAnswers.value) {
        if (answer.imageId.value == -1) {
          answer.uploadProgress.value = progress;
        }
      }
    });
  }
}

@override
FutureOr<void> onNewAttachmentAdded(List<File> files) async {
  // Remove placeholders
  final withoutPlaceholders = widget.inspectionQuestion!
      .inspectionQuestionAnswers.value
      .where((a) => a.imageId.value != -1)
      .toList();

  // Create real answers from uploaded files
  final newAnswers = files.map((file) {
    final answer = InspectionQuestionAnswer();
    answer.imageId.value = file.id.value;
    answer.image.value = file;
    answer.uploadProgress.value = 1.0;
    return answer;
  }).toList();

  // Update state
  await widget.onUpdateInspectionQuestionAnswer!([
    ...withoutPlaceholders,
    ...newAnswers
  ]);
}
```

### InspectionQuestionType Widgets

Mỗi answer type có widget riêng kế thừa pattern chung:

**Common Structure**:

```dart
class InspectionQuestionType[X] extends StatefulWidget {
  final InspectionQuestion inspectionQuestion;
  final Inspection inspectionDetail;
  final int answerTypeId;
  final String nameImageCustom;

  // Callbacks
  final Future<void> Function(InspectionQuestion) updateInspectionQuestion;
  final Future<void> Function(InspectionQuestion) onUpdateInspectionFileMapping;
  final Future<void> Function(List<File>) updateFiles;
  final Future<void> Function(InspectionQuestionFileMapping) onDelete;
  // ... more callbacks
}

class _InspectionQuestionType[X]State extends State<...> {
  @override
  Widget build(BuildContext context) {
    return AnswerTypeItem(
      // Common props
      title: widget.inspectionQuestion.content.value,
      isRequired: widget.inspectionQuestion.isRequired.value,
      isAnswered: /* check if has answer */,
      isError: widget.inspectionQuestion.errors.isNotEmpty,
      textError: widget.inspectionQuestion.errors['id'] ?? '',
      textWarning: widget.inspectionQuestion.warnings['id'] ?? '',
      files: widget.inspectionQuestion.inspectionQuestionFileMappings.value,
      note: widget.inspectionQuestion.note.value,
      type: InspectionType.InsoectionQuestionAnswer,

      // Specific child widget
      child: AnswerField(
        answerTypeId: widget.answerTypeId,
        // Type-specific props
        ...
      ),
    );
  }
}
```

**Widget List**:

1. **InspectionQuestionTypeTextAndNumber** - TEXT (1) + NUMBER (2)
2. **InspectionQuestionTypeSelectOptions** - SINGLE/MULTIPLE_CHOICE (5,6) với options
3. **InspectionQuestionResponseSetTypeSelectOptions** - SINGLE/MULTIPLE_CHOICE với ResponseSet
4. **InspectionQuestionTypeMedia** - IMAGE (3)
5. **InspectionQuestionTypeDateTime** - DATETIME (4)
6. **InspectionQuestionTypeLocation** - LOCATION (8)
7. **InspectionQuestionTypeInstruction** - INSTRUCTION (7)

## State Management

### Question State

```dart
InspectionQuestion {
  // Metadata
  id, content, answerTypeId, isRequired

  // Answers
  inspectionQuestionAnswers: List<InspectionQuestionAnswer>

  // Attachments (note/files)
  note: String
  inspectionQuestionFileMappings: List<InspectionQuestionFileMapping>

  // Validation
  errors: Map<String, String>
  warnings: Map<String, String>

  // Options (cho choice questions)
  inspectionAnswerOptions: List<InspectionAnswerOption>

  // Response set (cho choice questions with response set)
  questionnaireResponseSetId: int
  inspectionQuestionResponseContents: List<InspectionQuestionResponseContent>
}
```

### Answer State

```dart
InspectionQuestionAnswer {
  // Reference
  inspectionQuestionId: int
  inspectionId: int

  // Answer data (based on type)
  textValue: String        // TEXT
  numberValue: double      // NUMBER
  date: DateTime          // DATETIME
  latitude: double        // LOCATION
  longitude: double       // LOCATION
  address: String         // LOCATION

  // Choice answer
  inspectionAnswerOptionId: int
  inspectionAnswerOption: InspectionAnswerOption

  // Image answer (IMAGE type)
  imageId: int
  image: File
  uploadProgress: double  // 0.0 - 1.0
}
```

### File Mapping State

```dart
InspectionQuestionFileMapping {
  fileId: int
  file: File
  uploadProgress: double    // 0.0 - 1.0
  isLoading: bool          // true when uploading
  isSuccess: bool          // true when uploaded
}
```

## Validation & Scoring

### Validation

```dart
// InspectionValidator service
final validationResult = _validator.validateQuestionAnswer(question);

// Result
ValidationResult {
  errors: List<ValidationError>    // Blocking errors
  warnings: List<ValidationWarning> // Non-blocking warnings
}

// Update question state
question.errors = {
  for (var e in validationResult.errors) e.field: e.message,
};
question.warnings = {
  for (var w in validationResult.warnings) w.field: w.message,
};
```

### Scoring

```dart
// InspectionScoreCalculator service
await _scoreCalculator.calculatePageScore(inspectionPage);
await _scoreCalculator.calculateTotalScore(inspection);

// Updates
inspectionPage.score.value = calculatedScore;
inspection.score.value = totalScore;
```

## API Integration

### Sync APIs (Event-Sourced)

```dart
// Answer change
await MobileInspectionRepository().syncQuestionAnswer(
  question.toAnswerHistory()
);

// Note/file change
await MobileInspectionRepository().syncQuestion(
  question.toNoteFileHistory()
);

// Information change
await MobileInspectionRepository().syncInspectionInformation(
  information.toHistory()
);
```

**Fire-and-Forget Pattern**:

- API calls không block UI
- Optimistic updates
- Server processes async
- No waiting for response

### Legacy APIs (Being Replaced)

```dart
// ❌ Deprecated
await MobileInspectionRepository().updateInspectionQuestionAnswer(question);
await MobileInspectionRepository().updateInspectionQuestion(question);
await MobileInspectionRepository().updateInspectionInformation(information);
```

## Conditional Logic

### Question Visibility

```dart
// AnswerTypeItem checks conditionals
bool _shouldShowQuestion() {
  if (widget.inspectionQuestion.inspectionQuestionConditionals.value.isEmpty) {
    return true; // No conditions = always show
  }

  // Check if parent question answered correctly
  for (var conditional in conditionals) {
    final parentQuestion = _findQuestion(conditional.parentQuestionId);
    final hasMatchingAnswer = _checkAnswer(parentQuestion, conditional);
    if (!hasMatchingAnswer) return false;
  }

  return true;
}
```

### Score Conditions

```dart
// Based on selected answer options
for (var answer in question.inspectionQuestionAnswers.value) {
  if (answer.inspectionAnswerOption.value.score != null) {
    totalScore += answer.inspectionAnswerOption.value.score.value;
  }
}
```

### Task Auto-Creation

```dart
// When answer matches condition
if (shouldCreateTask(answer)) {
  await MobileInspectionRepository().createTaskAssignment(
    TaskAssignment()../* task details */
  );
}
```

## Performance Considerations

### Widget Keys

```dart
// InspectionAnswerPage maintains GlobalKeys for questions
Map<int, GlobalKey> _questionKeys = {};

// Used for scrolling to specific questions
_questionKeys[question.id.value] = GlobalKey();

Widget buildInspectionQuestion(InspectionQuestion question) {
  return Container(
    key: _questionKeys[question.id.value],
    child: /* question widget */,
  );
}
```

### State Updates

```dart
// Only update affected questions
void _updateQuestionInPage(InspectionQuestion updatedQuestion) {
  setState(() {
    final pageIndex = /* find page */;
    final questionIndex = /* find question */;
    currentInspectionPage!.inspectionQuestions.value[questionIndex] = updatedQuestion;
  });
}
```

### Lazy Loading

- Questions rendered on-demand trong ListView
- TabBarView loads pages khi switch
- Images lazy-loaded trong MediaViewWidget

## Error Handling

### Validation Errors

```dart
// Display in AnswerTypeItem
if (widget.isError) {
  Container(
    padding: EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Colors.red.withOpacity(0.1),
      borderRadius: BorderRadius.circular(8),
    ),
    child: Text(widget.textError, style: TextStyle(color: Colors.red)),
  )
}
```

### Upload Errors

```dart
// AbstractInspectionMediaState
catch (error) {
  setState(() {
    // Remove placeholders
    question.inspectionQuestionAnswers.value =
      question.inspectionQuestionAnswers.value
        .where((a) => a.imageId.value != -1)
        .toList();
  });

  // Show error toast
  toastification.show(
    context: context,
    title: Text('Upload failed'),
    type: ToastificationType.error,
  );
}
```

## Testing Points

### Unit Tests

- Answer type logic
- Validation rules
- Score calculation
- Conditional logic

### Widget Tests

- Question rendering
- Input handling
- State updates
- Error display

### Integration Tests

- Full answer flow
- Upload flow
- Page navigation
- API integration

## Related Documentation

- [Answer Types System](./answer-types-system.md)
- [Upload Progress Implementation](./upload-progress-implementation.md)
- [Models Overview](./models-overview.md)
- [Sync APIs](./sync-apis.md)
