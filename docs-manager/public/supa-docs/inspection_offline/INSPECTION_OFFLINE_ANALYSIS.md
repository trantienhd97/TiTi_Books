# INSPECTION OFFLINE - PHÂN TÍCH VÀ ĐỀ XUẤT GIẢI PHÁP

## 📋 MỤC TIÊU

Chuyển đổi hệ thống Inspection hiện tại từ việc phụ thuộc Backend để tính toán điểm (scoring) và logic sang việc xử lý locally trên client, cho phép tính toán điểm và cảnh báo ngay lập tức mà không cần chờ response từ Backend.

## 🔍 PHÂN TÍCH HỆ THỐNG HIỆN TẠI

### 1. Cấu Trúc Trang Inspection Answer

#### 1.1. Cấu Trúc File Chính
**File:** `inspection_answer_page.dart` (~2034 dòng)

**Chức năng chính:**
- Hiển thị và quản lý các câu hỏi inspection
- Auto-save câu trả lời lên Backend
- Nhận điểm số và logic validation từ Backend sau mỗi lần update
- Quản lý navigation giữa các trang/sections

#### 1.2. Cấu Trúc Dữ Liệu

**Model chính:**
```dart
class InspectionQuestion extends JsonModel {
  // Thông tin cơ bản
  JsonInteger id;
  JsonInteger inspectionId;
  JsonInteger inspectionPageId;
  JsonInteger questionId;
  JsonInteger parentId;
  JsonInteger questionTypeId;
  JsonInteger answerTypeId;
  
  // Cấu hình scoring
  JsonBoolean useScore;
  JsonBoolean useFlag;
  JsonBoolean isRequired;
  JsonDouble score;           // Điểm hiện tại (từ BE)
  JsonDouble maxScore;        // Điểm tối đa (từ BE)
  JsonBoolean isDeductedPageScore;
  JsonBoolean isDeductedSectionScore;
  JsonBoolean isDeductedInspectionScore;
  
  // Dữ liệu câu trả lời
  JsonList<InspectionQuestionAnswer> inspectionQuestionAnswers;
  JsonList<InspectionAnswerOption> inspectionAnswerOptions;
  JsonList<InspectionQuestionResponseContent> inspectionQuestionResponseContents;
  
  // Logic conditionals
  JsonList<InspectionQuestionConditional> inspectionQuestionConditionals;
  
  // Nested questions (sections)
  JsonList<InspectionQuestion> inspectionQuestions;
  
  // Cấu hình khác
  JsonInteger numberUnitId;
  JsonBoolean useLoop;
  JsonBoolean useDate;
  JsonBoolean useTime;
  JsonString content;
  JsonString description;
  JsonString note;
  
  // Files
  JsonList<InspectionQuestionFileMapping> inspectionQuestionFileMappings;
  
  // Task assignments
  JsonList<TaskAssignment> taskAssignments;
  
  // Errors & Warnings từ BE
  Map<String, String> errors;
  Map<String, String> warnings;
}
```

**Các Model Liên Quan:**
- `Inspection` - Chứa thông tin tổng thể inspection
- `InspectionPage` - Trang/section
- `InspectionQuestionAnswer` - Câu trả lời
- `InspectionAnswerOption` - Lựa chọn cho single/multiple choice
- `InspectionQuestionConditional` - Logic điều kiện
- `InspectionQuestionScore` - Chi tiết điểm số (page, section, total)

### 2. Các Trang Chính Trong Inspection

#### 2.1. Information Page (Optional)
**File:** `widgets/information_answer/information_answer_page.dart`

**Chức năng:**
- Hiển thị thông tin chung: Site, Date, Creator, Code
- Có thể ẩn/hiện dựa trên `isHideGeneralInformation`
- Cho phép chọn site, user, date
- Upload media với watermark

**Đặc điểm:**
- Không có scoring
- Có validation cơ bản (required fields)
- Auto-save lên BE

#### 2.2. Question Pages
**Phân loại theo Answer Type:**

1. **TEXT & NUMBER** (`inspection_question_type_text_and_number.dart`)
   - Input text/số
   - Có thể có đơn vị (numberUnit)
   - Upload files đi kèm
   - Note field

2. **DATE_TIME** (`inspection_question_type_date_time.dart`)
   - Chọn ngày/giờ
   - Có thể chỉ ngày hoặc cả giờ (useTime)
   - Upload files đi kèm
   - Note field

3. **SINGLE_CHOICE / MULTIPLE_CHOICE** 
   - 2 loại: ResponseSet (`inspection_question_response_set_type_select_options.dart`) hoặc AnswerOptions (`inspection_question_type_select_options.dart`)
   - Mỗi option có thể có:
     - Scoring khác nhau
     - Conditional logic
     - Task assignment trigger
   - Upload files đi kèm
   - Note field

4. **INSTRUCTION** (`inspection_question_type_instruction.dart`)
   - Hiển thị hướng dẫn
   - Upload proof files (InsoectionQuestionAnswer)
   - Upload reference files (InspectionQuestion)
   - Note field

5. **IMAGE** (`inspection_question_type_media.dart`)
   - Bắt buộc upload ảnh/video
   - Upload proof files
   - Upload reference files
   - Note field

6. **LOCATION** (`inspection_question_type_location.dart`)
   - Lấy GPS coordinates
   - Upload files
   - Note field

### 3. Phân Đoạn (Sections)

**Cấu trúc:**
- Questions có thể có nested questions thông qua `inspectionQuestions` list
- Parent question có thể là một section
- Section có thể có điểm riêng (aggregated từ child questions)

**Widget:** `InspectionQuestionAnswerWidget`
- Quản lý expand/collapse state
- Build tất cả child questions

### 4. Scoring System (Hiện Tại)

#### 4.1. Flow Hiện Tại

```
User nhập liệu
    ↓
Auto-save lên BE (_handleUpdateInspectionQuestionAnswer)
    ↓
BE tính toán:
    - Score cho question
    - Score cho parent (nếu có)
    - Score cho page/section
    - Score cho toàn bộ inspection
    - Validation (errors)
    - Warnings
    - Task assignment triggers
    ↓
Response trả về InspectionQuestion với:
    - inspectionQuestionScore (chứa tất cả scores)
    - errors map
    - warnings map
    - taskAssignments list
    ↓
Client cập nhật UI (updateInspectionQuestion)
```

#### 4.2. Các Hàm Scoring Chính

**`updateInspectionQuestion(InspectionQuestion inspectionQuestionAnswer)`**
- Update score cho question
- Update score cho parent question (nếu có)
- Update score cho page
- Update score cho inspection
- Update errors, warnings
- Update task assignments

**`_handleUpdateInspectionQuestionAnswer()`**
- Call API update answer
- Nhận response với scores
- Gọi `updateInspectionQuestion()` để update UI

### 5. Logic Conditionals

**`InspectionQuestionConditional`:**
- Chứa logic điều kiện để:
  - Hiển thị/ẩn questions
  - Trigger task assignments
  - Apply specific scoring rules
  - Show warnings

**Hiện tại:**
- Logic được BE quản lý
- Client chỉ hiển thị kết quả từ BE

### 6. Validation & Errors

**2 loại:**

1. **Field-level errors** (`errors` map)
   - Key-value pairs: fieldName → errorMessage
   - Hiển thị dưới input field
   - Ví dụ: required field, invalid format

2. **General errors** (`generalErrors` array)
   - Errors không thuộc về field cụ thể
   - Hiển thị trong toast notification

**Scroll to Error:**
- Khi submit/validate, tự động scroll đến question có error đầu tiên
- Expand parent section nếu error ở child question

### 7. Auto-save Mechanism

**Các điểm trigger auto-save:**
- Text/Number input (onSubmit)
- Date/Time selection
- Option selection (Single/Multiple choice)
- Location capture
- Note update
- File upload/delete

**Vấn đề:**
- Phải chờ BE response để có score
- Network lag gây UX không mượt
- Không thể offline

## 🎯 YÊU CẦU MỚI

1. **Local Scoring:** Tính điểm ngay lập tức trên client
2. **Local Validation:** Validate và hiển thị warnings mà không cần BE
3. **Offline Support:** Có thể làm việc offline, sync sau
4. **Giữ nguyên hệ thống cũ:** Clone thành InspectionOffline/InspectionLocal
5. **Config-based:** Nhận config từ đầu để có đầy đủ logic

## 📐 ĐỀ XUẤT GIẢI PHÁP

### 1. Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────┐
│           INSPECTION SYSTEMS                         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────┐      ┌───────────────────┐   │
│  │   Inspection     │      │  InspectionLocal  │   │
│  │   (Current)      │      │  (New - Offline)  │   │
│  │                  │      │                   │   │
│  │  - BE Scoring    │      │  - Local Scoring  │   │
│  │  - Online Only   │      │  - Offline Ready  │   │
│  │  - Auto-save     │      │  - Batch Save     │   │
│  └──────────────────┘      └───────────────────┘   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 2. Cấu Trúc Thư Mục Đề Xuất

```
packages/supa_work/lib/pages/inspection_local/
├── inspection_local_answer_page.dart          # Clone của inspection_answer_page
├── blocs/
│   ├── inspection_local_bloc.dart             # State management
│   ├── inspection_local_event.dart
│   └── inspection_local_state.dart
├── services/
│   ├── inspection_local_scoring_service.dart  # Local scoring engine
│   ├── inspection_local_validation_service.dart
│   ├── inspection_local_conditional_service.dart
│   └── inspection_local_sync_service.dart     # Sync với BE
├── models/
│   ├── inspection_local_config.dart           # Config từ BE
│   ├── inspection_local_scoring_rule.dart
│   ├── inspection_local_validation_rule.dart
│   └── inspection_local_conditional_rule.dart
└── widgets/
    ├── information_answer_local/              # Clone widgets
    │   ├── information_answer_page_local.dart
    │   └── information_type_item_local.dart
    ├── inspection_answer_local/
    │   ├── inspection_question_answer_widget_local.dart
    │   └── inspection_question_types_local/
    │       ├── inspection_question_type_text_and_number_local.dart
    │       ├── inspection_question_type_date_time_local.dart
    │       ├── inspection_question_type_select_options_local.dart
    │       ├── inspection_question_type_response_set_local.dart
    │       ├── inspection_question_type_instruction_local.dart
    │       ├── inspection_question_type_media_local.dart
    │       └── inspection_question_type_location_local.dart
    └── inspection_local_score_display.dart    # Hiển thị real-time score
```

### 3. Model Mới: Config Structure

#### 3.1. InspectionLocalConfig

```dart
class InspectionLocalConfig extends JsonModel {
  // Metadata
  JsonInteger inspectionId;
  JsonInteger questionnaireId;
  JsonString version;
  JsonDateTime lastUpdated;
  
  // Scoring Rules
  JsonList<ScoringRule> scoringRules;
  
  // Validation Rules
  JsonList<ValidationRule> validationRules;
  
  // Conditional Rules
  JsonList<ConditionalRule> conditionalRules;
  
  // Task Assignment Rules
  JsonList<TaskAssignmentRule> taskAssignmentRules;
}
```

#### 3.2. ScoringRule

```dart
class ScoringRule extends JsonModel {
  JsonInteger questionId;
  JsonString scoringType; // 'option_based', 'range_based', 'formula_based'
  
  // Option-based scoring
  JsonList<OptionScore> optionScores; // answerOptionId → score
  
  // Range-based scoring (for numbers)
  JsonList<RangeScore> rangeScores;
  
  // Formula-based scoring
  JsonString formula; // Expression string: "Q1 + Q2 * 0.5"
  
  // Score aggregation
  JsonString aggregationType; // 'sum', 'average', 'max', 'min', 'weighted'
  JsonDouble weight; // For weighted average
  
  // Deduction settings
  JsonBoolean isDeductedPageScore;
  JsonBoolean isDeductedSectionScore;
  JsonBoolean isDeductedInspectionScore;
  
  JsonDouble maxScore;
}
```

#### 3.3. ValidationRule

```dart
class ValidationRule extends JsonModel {
  JsonInteger questionId;
  JsonString validationType; // 'required', 'range', 'pattern', 'custom'
  
  // Required validation
  JsonBoolean isRequired;
  JsonString requiredMessage;
  
  // Range validation (for numbers)
  JsonDouble minValue;
  JsonDouble maxValue;
  JsonString rangeMessage;
  
  // Pattern validation (for text)
  JsonString pattern; // Regex pattern
  JsonString patternMessage;
  
  // Custom validation
  JsonString customExpression; // Boolean expression
  JsonString customMessage;
  
  // Severity
  JsonString severity; // 'error', 'warning'
}
```

#### 3.4. ConditionalRule

```dart
class ConditionalRule extends JsonModel {
  JsonInteger questionId;
  JsonString conditionType; // 'visibility', 'required', 'scoring', 'task'
  
  // Condition expression
  JsonString conditionExpression; // Boolean: "Q1 == 'Yes' && Q2 > 10"
  
  // Actions
  JsonList<Integer> targetQuestionIds; // Questions affected
  JsonString action; // 'show', 'hide', 'enable', 'disable', 'set_required'
  
  // For scoring conditionals
  JsonDouble conditionalScore;
  JsonString conditionalFormula;
  
  // For task conditionals
  JsonInteger taskTemplateId;
  JsonObject taskParams;
}
```

### 4. Services - Core Logic

#### 4.1. InspectionLocalScoringService

**Chức năng:**
- Tính điểm cho từng question dựa vào answer và scoring rules
- Aggregate scores cho sections/pages/inspection
- Apply deduction rules
- Real-time score updates

**Key Methods:**
```dart
class InspectionLocalScoringService {
  // Tính điểm cho 1 question
  double calculateQuestionScore(
    InspectionQuestion question,
    List<InspectionQuestionAnswer> answers,
    ScoringRule rule,
  );
  
  // Tính điểm cho section (parent question)
  double calculateSectionScore(
    InspectionQuestion section,
    List<ScoringRule> rules,
  );
  
  // Tính điểm cho page
  double calculatePageScore(
    InspectionPage page,
    List<ScoringRule> rules,
  );
  
  // Tính tổng điểm inspection
  double calculateInspectionScore(
    Inspection inspection,
    List<ScoringRule> rules,
  );
  
  // Evaluate formula-based scoring
  double evaluateFormula(
    String formula,
    Map<String, double> questionScores,
  );
  
  // Apply score weights
  double applyWeightedScoring(
    List<double> scores,
    List<double> weights,
  );
}
```

**Implementation Notes:**
- Sử dụng expression parser cho formulas (package: `expressions`)
- Cache scores để tránh tính lại
- Emit events khi score thay đổi

#### 4.2. InspectionLocalValidationService

**Chức năng:**
- Validate answers theo rules
- Generate errors/warnings
- Real-time validation feedback

**Key Methods:**
```dart
class InspectionLocalValidationService {
  // Validate 1 question
  ValidationResult validateQuestion(
    InspectionQuestion question,
    List<InspectionQuestionAnswer> answers,
    List<ValidationRule> rules,
  );
  
  // Validate toàn bộ inspection
  Map<int, ValidationResult> validateInspection(
    Inspection inspection,
    List<ValidationRule> rules,
  );
  
  // Check required fields
  bool checkRequired(
    InspectionQuestion question,
    List<InspectionQuestionAnswer> answers,
  );
  
  // Validate range
  bool validateRange(
    double value,
    double? min,
    double? max,
  );
  
  // Validate pattern
  bool validatePattern(
    String value,
    String pattern,
  );
  
  // Evaluate custom expression
  bool evaluateCustomValidation(
    String expression,
    Map<String, dynamic> context,
  );
}

class ValidationResult {
  bool isValid;
  Map<String, String> errors;      // fieldName → errorMessage
  Map<String, String> warnings;    // fieldName → warningMessage
  List<String> generalErrors;
  List<String> generalWarnings;
}
```

#### 4.3. InspectionLocalConditionalService

**Chức năng:**
- Evaluate conditional rules
- Quản lý visibility/required state
- Trigger task assignments
- Apply conditional scoring

**Key Methods:**
```dart
class InspectionLocalConditionalService {
  // Evaluate conditions
  Map<int, ConditionalAction> evaluateConditionals(
    Inspection inspection,
    List<ConditionalRule> rules,
  );
  
  // Check if question should be visible
  bool isQuestionVisible(
    int questionId,
    Map<int, ConditionalAction> actions,
  );
  
  // Check if question is required
  bool isQuestionRequired(
    int questionId,
    Map<int, ConditionalAction> actions,
  );
  
  // Get conditional score
  double? getConditionalScore(
    int questionId,
    Map<int, ConditionalAction> actions,
  );
  
  // Get triggered tasks
  List<TaskTemplate> getTriggeredTasks(
    Map<int, ConditionalAction> actions,
  );
  
  // Evaluate expression
  bool evaluateExpression(
    String expression,
    Map<String, dynamic> context,
  );
}

class ConditionalAction {
  bool? isVisible;
  bool? isRequired;
  double? overrideScore;
  List<TaskTemplate> triggeredTasks;
}
```

#### 4.4. InspectionLocalSyncService

**Chức năng:**
- Quản lý offline/online state
- Queue changes khi offline
- Batch sync lên BE khi online
- Conflict resolution

**Key Methods:**
```dart
class InspectionLocalSyncService {
  // Lưu change vào queue
  Future<void> queueChange(InspectionChange change);
  
  // Sync tất cả changes lên BE
  Future<SyncResult> syncAll();
  
  // Sync 1 inspection
  Future<void> syncInspection(int inspectionId);
  
  // Load config từ BE
  Future<InspectionLocalConfig> loadConfig(int questionnaireId);
  
  // Check online status
  bool isOnline();
  
  // Handle conflicts
  Future<Inspection> resolveConflict(
    Inspection local,
    Inspection remote,
  );
}

class InspectionChange {
  int inspectionId;
  int questionId;
  DateTime timestamp;
  String changeType; // 'answer', 'file', 'note'
  Map<String, dynamic> data;
  bool synced;
}
```

### 5. Bloc Pattern cho State Management

#### 5.1. InspectionLocalBloc

```dart
// Events
abstract class InspectionLocalEvent {}

class LoadInspectionLocal extends InspectionLocalEvent {
  final int inspectionId;
}

class LoadConfigLocal extends InspectionLocalEvent {
  final int questionnaireId;
}

class UpdateAnswerLocal extends InspectionLocalEvent {
  final int questionId;
  final List<InspectionQuestionAnswer> answers;
}

class UpdateNoteLocal extends InspectionLocalEvent {
  final int questionId;
  final String note;
}

class UploadFileLocal extends InspectionLocalEvent {
  final int questionId;
  final List<File> files;
}

class DeleteFileLocal extends InspectionLocalEvent {
  final int questionId;
  final int fileId;
}

class CalculateScoresLocal extends InspectionLocalEvent {}

class ValidateInspectionLocal extends InspectionLocalEvent {}

class SyncInspectionLocal extends InspectionLocalEvent {}

// States
abstract class InspectionLocalState {}

class InspectionLocalInitial extends InspectionLocalState {}

class InspectionLocalLoading extends InspectionLocalState {}

class InspectionLocalLoaded extends InspectionLocalState {
  final Inspection inspection;
  final InspectionLocalConfig config;
  final Map<int, double> questionScores;   // questionId → score
  final Map<int, ValidationResult> validations;
  final Map<int, ConditionalAction> conditionals;
  final bool hasUnsyncedChanges;
}

class InspectionLocalError extends InspectionLocalState {
  final String message;
}

class InspectionLocalSyncing extends InspectionLocalState {}

class InspectionLocalSynced extends InspectionLocalState {
  final SyncResult result;
}

// Bloc
class InspectionLocalBloc extends Bloc<InspectionLocalEvent, InspectionLocalState> {
  final InspectionLocalScoringService scoringService;
  final InspectionLocalValidationService validationService;
  final InspectionLocalConditionalService conditionalService;
  final InspectionLocalSyncService syncService;
  
  InspectionLocalBloc({
    required this.scoringService,
    required this.validationService,
    required this.conditionalService,
    required this.syncService,
  }) : super(InspectionLocalInitial()) {
    on<LoadInspectionLocal>(_onLoadInspection);
    on<LoadConfigLocal>(_onLoadConfig);
    on<UpdateAnswerLocal>(_onUpdateAnswer);
    on<UpdateNoteLocal>(_onUpdateNote);
    on<UploadFileLocal>(_onUploadFile);
    on<DeleteFileLocal>(_onDeleteFile);
    on<CalculateScoresLocal>(_onCalculateScores);
    on<ValidateInspectionLocal>(_onValidate);
    on<SyncInspectionLocal>(_onSync);
  }
  
  Future<void> _onLoadInspection(
    LoadInspectionLocal event,
    Emitter<InspectionLocalState> emit,
  ) async {
    emit(InspectionLocalLoading());
    try {
      final inspection = await loadInspection(event.inspectionId);
      final config = await syncService.loadConfig(inspection.questionnaireId.value);
      
      // Initial calculations
      final scores = await _calculateAllScores(inspection, config);
      final validations = await _validateAll(inspection, config);
      final conditionals = await _evaluateAllConditionals(inspection, config);
      
      emit(InspectionLocalLoaded(
        inspection: inspection,
        config: config,
        questionScores: scores,
        validations: validations,
        conditionals: conditionals,
        hasUnsyncedChanges: false,
      ));
    } catch (e) {
      emit(InspectionLocalError(e.toString()));
    }
  }
  
  Future<void> _onUpdateAnswer(
    UpdateAnswerLocal event,
    Emitter<InspectionLocalState> emit,
  ) async {
    if (state is! InspectionLocalLoaded) return;
    
    final currentState = state as InspectionLocalLoaded;
    
    // Update answer in inspection
    final updatedInspection = _updateQuestionAnswer(
      currentState.inspection,
      event.questionId,
      event.answers,
    );
    
    // Recalculate affected scores
    final updatedScores = await _recalculateScores(
      updatedInspection,
      currentState.config,
      event.questionId,
    );
    
    // Revalidate
    final updatedValidations = await _revalidate(
      updatedInspection,
      currentState.config,
      event.questionId,
    );
    
    // Re-evaluate conditionals
    final updatedConditionals = await _reevaluateConditionals(
      updatedInspection,
      currentState.config,
    );
    
    // Queue change for sync
    await syncService.queueChange(InspectionChange(
      inspectionId: updatedInspection.id.value,
      questionId: event.questionId,
      timestamp: DateTime.now(),
      changeType: 'answer',
      data: {'answers': event.answers.map((a) => a.toJson()).toList()},
      synced: false,
    ));
    
    emit(InspectionLocalLoaded(
      inspection: updatedInspection,
      config: currentState.config,
      questionScores: updatedScores,
      validations: updatedValidations,
      conditionals: updatedConditionals,
      hasUnsyncedChanges: true,
    ));
  }
  
  // ... các handlers khác
}
```

### 6. Widgets - UI Components

#### 6.1. Thay Đổi Chính

**Từ:**
```dart
// Current: Wait for BE response
await _handleUpdateInspectionQuestionAnswer();
// Score updated from BE response
```

**Sang:**
```dart
// New: Immediate local update
context.read<InspectionLocalBloc>().add(UpdateAnswerLocal(
  questionId: question.id.value,
  answers: [answer],
));
// Score updated immediately from bloc state
```

#### 6.2. Score Display Widget (New)

```dart
class InspectionLocalScoreDisplay extends StatelessWidget {
  final InspectionQuestion question;
  final double? currentScore;
  final double? maxScore;
  
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<InspectionLocalBloc, InspectionLocalState>(
      builder: (context, state) {
        if (state is! InspectionLocalLoaded) return SizedBox.shrink();
        
        final score = state.questionScores[question.id.value];
        final validationResult = state.validations[question.id.value];
        
        return Container(
          padding: EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: _getScoreColor(score, maxScore),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              Icon(_getScoreIcon(score, maxScore)),
              SizedBox(width: 8),
              Text('${score?.toStringAsFixed(1) ?? '0'} / ${maxScore?.toStringAsFixed(1) ?? '0'}'),
              if (validationResult?.warnings.isNotEmpty ?? false)
                Icon(Icons.warning, color: Colors.orange),
              if (validationResult?.errors.isNotEmpty ?? false)
                Icon(Icons.error, color: Colors.red),
            ],
          ),
        );
      },
    );
  }
}
```

### 7. Migration Strategy - 2 Phases

#### 📌 Phase 1: Local Logic + Fire-and-Forget API (2-3 Weeks)

**Mục tiêu:** 
- Instant feedback cho user (tính điểm, validation ngay lập tức)
- Lưu data vào local database
- Call API lưu lên BE nhưng KHÔNG CHỜ response
- User có thể thoát ra/vào lại mà không mất data

**Architecture Overview:**
```
User Input
    ↓
Local Calculation (Instant)
    ↓
├─ Update UI (Real-time)
├─ Save to Local DB
└─ Fire-and-Forget API Call (không chờ response)
```

##### 7.1.1. Database Setup

**Package:** `drift` (SQLite cho Flutter)

**Tables:**
```sql
-- Inspection cache
CREATE TABLE inspections (
  id INTEGER PRIMARY KEY,
  questionnaire_id INTEGER,
  data TEXT,  -- JSON serialized
  last_updated INTEGER,
  synced_at INTEGER
);

-- Config cache
CREATE TABLE inspection_configs (
  questionnaire_id INTEGER PRIMARY KEY,
  version TEXT,
  config_data TEXT,  -- JSON serialized
  last_updated INTEGER
);

-- Pending changes (for fire-and-forget tracking)
CREATE TABLE pending_api_calls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inspection_id INTEGER,
  question_id INTEGER,
  api_endpoint TEXT,
  payload TEXT,
  timestamp INTEGER,
  retry_count INTEGER DEFAULT 0,
  last_error TEXT
);
```

##### 7.1.2. Implementation Steps

**Week 1: Infrastructure**
1. ✅ Setup drift database
   ```dart
   // database.dart
   @DriftDatabase(
     tables: [Inspections, InspectionConfigs, PendingApiCalls],
     daos: [InspectionDao, ConfigDao, ApiCallDao]
   )
   class AppDatabase extends _$AppDatabase {
     AppDatabase() : super(_openConnection());
   }
   ```

2. ✅ Create config models
   - `InspectionLocalConfig`
   - `ScoringRule`
   - `ValidationRule`
   - `ConditionalRule`

3. ✅ Implement core services
   - `InspectionLocalScoringService` - Tính điểm local
   - `InspectionLocalValidationService` - Validate local
   - `InspectionLocalConditionalService` - Logic điều kiện
   - `InspectionLocalPersistenceService` - Lưu/load từ DB
   - `InspectionFireAndForgetService` - Fire-and-forget API calls

4. ✅ Setup Bloc pattern
   - Events: UpdateAnswer, UpdateNote, UploadFile, etc.
   - States: Loaded với real-time scores/validations
   - Side effects: Save to DB, Fire API call

**Week 2: Widgets & Integration**
1. ✅ Clone & adapt main page
   - `inspection_local_answer_page.dart`
   - Load data from DB on init
   - Use Bloc for state management
   - Real-time score display

2. ✅ Clone question type widgets
   - Each widget type với local logic
   - Immediate UI updates
   - No loading spinners for scoring

3. ✅ Implement auto-save to DB
   - Save on every change
   - Throttle/debounce nếu cần
   - Background save (không block UI)

4. ✅ Implement fire-and-forget API
   ```dart
   Future<void> fireAndForgetUpdate(
     InspectionQuestion question,
     List<InspectionQuestionAnswer> answers,
   ) async {
     // Log pending call
     await _apiCallDao.insert(PendingApiCall(
       inspectionId: question.inspectionId.value,
       questionId: question.id.value,
       apiEndpoint: '/api/inspections/update-answer',
       payload: jsonEncode({
         'question': question.toJson(),
         'answers': answers.map((a) => a.toJson()).toList(),
       }),
       timestamp: DateTime.now().millisecondsSinceEpoch,
     ));
     
     // Fire API (don't wait)
     unawaited(
       _apiClient.updateAnswer(question, answers)
         .then((_) {
           // Success: remove from pending
           _apiCallDao.deleteByQuestionId(question.id.value);
         })
         .catchError((error) {
           // Error: keep in pending for retry
           _apiCallDao.incrementRetryCount(question.id.value);
         }),
     );
   }
   ```

**Week 3: Testing & Polish**
1. ✅ Unit tests
   - Test scoring calculations
   - Test validation logic
   - Test conditional logic
   - Test DB operations

2. ✅ Integration tests
   - Test complete user flow
   - Test data persistence (thoát/vào lại)
   - Test API failures (data vẫn safe)

3. ✅ Background retry mechanism
   ```dart
   class BackgroundApiRetryService {
     Timer? _retryTimer;
     
     void startPeriodicRetry() {
       _retryTimer = Timer.periodic(Duration(minutes: 5), (_) async {
         final pendingCalls = await _apiCallDao.getAll();
         for (final call in pendingCalls) {
           if (call.retryCount < 3) {
             await _retryApiCall(call);
           } else {
             // Too many retries, log error
             logger.error('Failed to sync: ${call.payload}');
           }
         }
       });
     }
   }
   ```

4. ✅ UI/UX enhancements
   - Loading indicator khi load từ DB
   - Success toast khi save to DB
   - Small indicator khi API call pending
   - Error indicator nếu API fail nhiều lần

##### 7.1.3. Phase 1 Deliverables

✅ **Functional:**
- Instant score calculation
- Real-time validation feedback
- Data persisted to local DB
- Fire-and-forget API calls
- Auto-retry failed API calls
- User có thể thoát/vào lại không mất data

✅ **Technical:**
- Drift database setup
- All services implemented
- Bloc pattern integrated
- All widgets cloned & adapted
- Unit & integration tests

✅ **UX:**
- Zero loading time cho scoring
- Smooth real-time updates
- Data safety guaranteed
- Transparent API state

---

#### 📌 Phase 2: Full Offline + Batch Sync (2-3 Weeks)

**Mục tiêu:**
- Hoàn toàn offline-capable
- Smart sync strategy
- Conflict resolution
- Network-aware behavior

**Architecture Overview:**
```
Offline Mode
    ↓
All changes queued locally
    ↓
Detect network availability
    ↓
Batch sync to BE
    ↓
Conflict resolution
    ↓
Update local state
```

##### 7.2.1. Enhanced Database Schema

**New Tables:**
```sql
-- Change queue for batch sync
CREATE TABLE change_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inspection_id INTEGER,
  question_id INTEGER,
  change_type TEXT,  -- 'answer', 'note', 'file', 'delete'
  data TEXT,
  timestamp INTEGER,
  synced BOOLEAN DEFAULT FALSE,
  sync_error TEXT
);

-- Sync metadata
CREATE TABLE sync_metadata (
  inspection_id INTEGER PRIMARY KEY,
  last_sync_timestamp INTEGER,
  pending_changes_count INTEGER,
  last_conflict_timestamp INTEGER
);

-- File upload queue
CREATE TABLE file_upload_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inspection_id INTEGER,
  question_id INTEGER,
  file_path TEXT,
  file_type TEXT,
  uploaded BOOLEAN DEFAULT FALSE,
  remote_file_id INTEGER
);
```

##### 7.2.2. Implementation Steps

**Week 1: Sync Infrastructure**
1. ✅ Implement `InspectionSyncService`
   ```dart
   class InspectionSyncService {
     Future<SyncResult> syncInspection(int inspectionId) async {
       // 1. Check network
       if (!await _isOnline()) {
         return SyncResult.offline();
       }
       
       // 2. Get all pending changes
       final changes = await _changeQueueDao.getPending(inspectionId);
       
       // 3. Batch sync to BE
       final response = await _apiClient.batchSync(
         inspectionId: inspectionId,
         changes: changes,
       );
       
       // 4. Handle response
       if (response.hasConflicts) {
         return await _resolveConflicts(response.conflicts);
       }
       
       // 5. Mark as synced
       await _changeQueueDao.markSynced(changes);
       
       // 6. Update local data with BE response
       await _updateLocalData(response.updatedInspection);
       
       return SyncResult.success();
     }
   }
   ```

2. ✅ Network connectivity monitoring
   ```dart
   class NetworkMonitor {
     final _connectivity = Connectivity();
     StreamSubscription? _subscription;
     
     void startMonitoring(Function(bool isOnline) onStatusChanged) {
       _subscription = _connectivity.onConnectivityChanged.listen((result) {
         final isOnline = result != ConnectivityResult.none;
         onStatusChanged(isOnline);
         
         if (isOnline) {
           // Auto-sync when back online
           _syncService.syncAll();
         }
       });
     }
   }
   ```

3. ✅ Conflict resolution strategy
   ```dart
   enum ConflictResolution {
     useLocal,    // Keep local changes
     useRemote,   // Discard local, use remote
     merge,       // Merge both (if possible)
     askUser,     // Show UI to let user decide
   }
   
   class ConflictResolver {
     Future<Inspection> resolve(
       Inspection local,
       Inspection remote,
       List<ConflictDetail> conflicts,
     ) async {
       // Default: Last Write Wins (by timestamp)
       for (final conflict in conflicts) {
         if (conflict.localTimestamp > conflict.remoteTimestamp) {
           // Keep local
           continue;
         } else {
           // Use remote
           _applyRemoteChange(conflict);
         }
       }
       
       // For critical conflicts, ask user
       if (conflicts.any((c) => c.isCritical)) {
         return await _showConflictDialog(local, remote, conflicts);
       }
       
       return local;
     }
   }
   ```

**Week 2: UI & User Experience**
1. ✅ Offline indicator
   ```dart
   class OfflineIndicator extends StatelessWidget {
     @override
     Widget build(BuildContext context) {
       return StreamBuilder<bool>(
         stream: networkMonitor.isOnlineStream,
         builder: (context, snapshot) {
           final isOnline = snapshot.data ?? true;
           if (isOnline) return SizedBox.shrink();
           
           return Container(
             color: Colors.orange,
             padding: EdgeInsets.all(8),
             child: Row(
               children: [
                 Icon(Icons.cloud_off, color: Colors.white),
                 SizedBox(width: 8),
                 Text('Offline - Changes will sync when connected'),
               ],
             ),
           );
         },
       );
     }
   }
   ```

2. ✅ Sync status widget
   ```dart
   class SyncStatusWidget extends StatelessWidget {
     @override
     Widget build(BuildContext context) {
       return BlocBuilder<SyncBloc, SyncState>(
         builder: (context, state) {
           if (state is Syncing) {
             return LinearProgressIndicator();
           }
           
           if (state is SyncCompleted) {
             return Text(
               'Last synced: ${_formatTime(state.timestamp)}',
               style: TextStyle(color: Colors.green),
             );
           }
           
           if (state is SyncError) {
             return TextButton(
               onPressed: () => context.read<SyncBloc>().add(RetrySync()),
               child: Text('Sync failed - Tap to retry'),
             );
           }
           
           return SizedBox.shrink();
         },
       );
     }
   }
   ```

3. ✅ Conflict resolution UI
   ```dart
   class ConflictResolutionDialog extends StatelessWidget {
     final List<ConflictDetail> conflicts;
     
     @override
     Widget build(BuildContext context) {
       return AlertDialog(
         title: Text('Sync Conflicts Detected'),
         content: Column(
           children: conflicts.map((conflict) {
             return ConflictItem(
               question: conflict.questionContent,
               localValue: conflict.localValue,
               remoteValue: conflict.remoteValue,
               onResolve: (resolution) {
                 // Apply resolution
               },
             );
           }).toList(),
         ),
       );
     }
   }
   ```

**Week 3: Advanced Features & Testing**
1. ✅ Intelligent sync strategy
   ```dart
   class SmartSyncStrategy {
     Future<void> sync() async {
       // Sync priority queue
       final criticalChanges = await _getCriticalChanges();
       final normalChanges = await _getNormalChanges();
       
       // Sync critical changes first
       if (criticalChanges.isNotEmpty) {
         await _syncBatch(criticalChanges);
       }
       
       // Batch normal changes (every 5 minutes or 10 changes)
       if (normalChanges.length >= 10 || _timeSinceLastSync > 5.minutes) {
         await _syncBatch(normalChanges);
       }
     }
   }
   ```

2. ✅ File upload optimization
   ```dart
   class FileUploadService {
     Future<void> uploadPendingFiles() async {
       final queue = await _fileUploadQueueDao.getPending();
       
       // Upload in background with progress
       for (final item in queue) {
         try {
           final fileId = await _apiClient.uploadFile(
             filePath: item.filePath,
             onProgress: (progress) {
               _progressController.add(progress);
             },
           );
           
           await _fileUploadQueueDao.markUploaded(item.id, fileId);
         } catch (e) {
           // Retry later
           logger.error('File upload failed: ${item.filePath}');
         }
       }
     }
   }
   ```

3. ✅ Comprehensive testing
   - Unit tests for sync logic
   - Integration tests for offline flow
   - E2E tests for conflict resolution
   - Performance tests for large datasets

##### 7.2.3. Phase 2 Deliverables

✅ **Functional:**
- Full offline capability
- Smart batch sync
- Conflict resolution
- Automatic retry
- File upload queue
- Network-aware behavior

✅ **Technical:**
- Enhanced database schema
- Sync service implemented
- Network monitoring
- Conflict resolver
- Background workers

✅ **UX:**
- Offline indicator
- Sync status display
- Conflict resolution UI
- Smooth online/offline transitions
- Transparent sync process

---

#### 📊 Comparison: Phase 1 vs Phase 2

| Feature | Phase 1 | Phase 2 |
|---------|---------|---------|
| **Network Required** | Yes (for API calls) | No |
| **Data Persistence** | ✅ Local DB | ✅ Local DB |
| **Instant Feedback** | ✅ Yes | ✅ Yes |
| **API Strategy** | Fire-and-forget | Queued batch sync |
| **Conflict Handling** | Auto-retry | Smart resolution |
| **Offline Support** | Partial (data saved) | Full |
| **File Uploads** | Immediate attempt | Queued |
| **Network Monitoring** | Basic | Advanced |
| **Sync UI** | Simple indicators | Full status & controls |
| **Complexity** | Medium | High |
| **Development Time** | 2-3 weeks | 2-3 weeks |

---

#### 🎯 Recommended Rollout Strategy

1. **Phase 1 First**
   - Ship to production
   - Gather user feedback
   - Monitor API success/failure rates
   - Tune retry logic

2. **Evaluate Need for Phase 2**
   - If Phase 1 works well (high API success rate), Phase 2 may not be urgent
   - If users frequently lose network, Phase 2 becomes critical

3. **Phase 2 as Enhancement**
   - Can be developed in parallel with other features
   - Non-breaking upgrade from Phase 1
   - Existing Phase 1 users automatically benefit

### 8. Sự Khác Biệt Chính

| Aspect | Inspection (Current) | InspectionLocal (New) |
|--------|---------------------|----------------------|
| **Scoring** | BE calculates | Local calculates |
| **Validation** | BE validates | Local validates |
| **Auto-save** | Each change → API call | Queue changes |
| **Sync** | Real-time | Batch sync |
| **Offline** | ❌ Không hỗ trợ | ✅ Full support |
| **Performance** | Network dependent | Instant feedback |
| **Config** | Implicit in BE | Explicit local config |
| **State** | setState() | Bloc pattern |

### 9. API Changes Required

#### 9.1. Get Config API

Sử dụng API lấy chi tiết Questionnaire hiện tại và thêm tham số `isIncludeConditional=true` để Backend trả về đầy đủ các quy tắc cấu hình.

```
GET /api/v1/questionnaires/{questionnaireId}?isIncludeConditional=true

Response:
{
  "inspectionId": 123,
  "questionnaireId": 456,
  "version": "1.0.0",
  "lastUpdated": "2026-01-26T10:00:00Z",
  "scoringRules": [...],
  "validationRules": [...],
  "conditionalRules": [...],
  "taskAssignmentRules": [...]
}
```

#### 9.2. Modified Endpoint: Batch Sync

```
POST /api/v1/inspections/{inspectionId}/sync

Request:
{
  "changes": [
    {
      "questionId": 1,
      "timestamp": "2026-01-26T09:30:00Z",
      "changeType": "answer",
      "data": {...}
    },
    ...
  ],
  "localScores": {
    "questionScores": {...},
    "pageScores": {...},
    "inspectionScore": 85.5
  }
}

Response:
{
  "synced": true,
  "conflicts": [],
  "updatedInspection": {...}
}
```

## 🔧 IMPLEMENTATION NOTES

### 1. Expression Parser
**Package:** `expressions` or `math_expressions`

**Usage:**
```dart
// Scoring formula: "Q1 + Q2 * 0.5"
final expression = Expression.parse("Q1 + Q2 * 0.5");
final context = {
  'Q1': 10.0,
  'Q2': 20.0,
};
final result = expression.evaluate(context); // 20.0
```

### 2. Local Storage
**Package:** `hive` or `drift`

**Usage:**
- Cache inspection data
- Store config locally
- Queue unsynced changes
- Offline data persistence

### 3. Network Connectivity
**Package:** `connectivity_plus`

**Usage:**
- Detect online/offline
- Auto-sync when back online
- Show network status

### 4. Conflict Resolution Strategy
**Approach:** Last Write Wins (LWW) với timestamp
- Client timestamp cho mỗi change
- BE so sánh timestamp
- Nếu conflict, BE wins (có thể customize)
- Notify user về conflicts

## 📝 CHECKLIST IMPLEMENTATION

### ✅ Phase 1: Local Logic + Fire-and-Forget API

#### Week 1: Infrastructure
- [ ] **Database Setup**
  - [ ] Add drift dependency
  - [ ] Create database.dart
  - [ ] Define Inspections table
  - [ ] Define InspectionConfigs table
  - [ ] Define PendingApiCalls table
  - [ ] Create DAOs (Data Access Objects)
  - [ ] Test database operations

- [ ] **Models & Config**
  - [ ] Create InspectionLocalConfig model
  - [ ] Create ScoringRule model
  - [ ] Create ValidationRule model
  - [ ] Create ConditionalRule model
  - [ ] Add JSON serialization/deserialization

- [ ] **Core Services**
  - [ ] Implement InspectionLocalScoringService
    - [ ] Option-based scoring
    - [ ] Range-based scoring
    - [ ] Formula-based scoring
    - [ ] Section aggregation
  - [ ] Implement InspectionLocalValidationService
    - [ ] Required field validation
    - [ ] Range validation
    - [ ] Pattern validation
    - [ ] Custom expression validation
  - [ ] Implement InspectionLocalConditionalService
    - [ ] Expression parser integration
    - [ ] Visibility rules
    - [ ] Required rules
    - [ ] Scoring conditionals
    - [ ] Task triggers
  - [ ] Implement InspectionLocalPersistenceService
    - [ ] Save inspection to DB
    - [ ] Load inspection from DB
    - [ ] Update inspection in DB
    - [ ] Cache config in DB
  - [ ] Implement InspectionFireAndForgetService
    - [ ] Log API calls to pending table
    - [ ] Fire API without waiting
    - [ ] Handle success (remove from pending)
    - [ ] Handle error (keep for retry)

- [ ] **Bloc Pattern**
  - [ ] Define events (UpdateAnswer, UpdateNote, etc.)
  - [ ] Define states (Loading, Loaded, Error)
  - [ ] Implement bloc logic
  - [ ] Add side effects (DB save, API fire)

#### Week 2: Widgets & Integration
- [ ] **Main Page**
  - [ ] Clone inspection_answer_page → inspection_local_answer_page
  - [ ] Load data from DB on init
  - [ ] Integrate with Bloc
  - [ ] Add real-time score display
  - [ ] Remove loading spinners for scoring
  - [ ] Add DB save indicators

- [ ] **Question Type Widgets**
  - [ ] Clone Text/Number widget
  - [ ] Clone DateTime widget
  - [ ] Clone Single Choice widget
  - [ ] Clone Multiple Choice widget
  - [ ] Clone ResponseSet widgets
  - [ ] Clone Instruction widget
  - [ ] Clone Media widget
  - [ ] Clone Location widget
  - [ ] Update all to use Bloc events

- [ ] **Supporting Widgets**
  - [ ] Clone information answer widgets
  - [ ] Clone question answer widget
  - [ ] Create score display widget
  - [ ] Create validation feedback widget

- [ ] **Auto-save Implementation**
  - [ ] Save on answer change
  - [ ] Save on note change
  - [ ] Save on file upload
  - [ ] Debounce/throttle if needed
  - [ ] Background save (non-blocking)

- [ ] **Fire-and-Forget API**
  - [ ] Integrate with all update points
  - [ ] Add to pending_api_calls table
  - [ ] Fire asynchronously
  - [ ] Handle success/error callbacks

#### Week 3: Testing & Polish
- [ ] **Unit Tests**
  - [ ] Test scoring calculations
  - [ ] Test validation logic
  - [ ] Test conditional evaluation
  - [ ] Test DB operations
  - [ ] Test fire-and-forget logic

- [ ] **Integration Tests**
  - [ ] Test complete user flow
  - [ ] Test data persistence (exit/reenter)
  - [ ] Test API failure scenarios
  - [ ] Test config loading

- [ ] **Background Services**
  - [ ] Implement periodic retry service
  - [ ] Test retry logic (max 3 attempts)
  - [ ] Add logging for failed syncs

- [ ] **UI/UX Polish**
  - [ ] Loading indicator for DB operations
  - [ ] Success feedback on save
  - [ ] Small indicator for pending API calls
  - [ ] Error indicator for failed syncs
  - [ ] Smooth transitions

- [ ] **QA & Bug Fixes**
  - [ ] Test on multiple devices
  - [ ] Test with poor network
  - [ ] Test with large datasets
  - [ ] Performance optimization
  - [ ] Memory leak checks

---

### ✅ Phase 2: Full Offline + Batch Sync

#### Week 1: Sync Infrastructure
- [ ] **Enhanced Database**
  - [ ] Add change_queue table
  - [ ] Add sync_metadata table
  - [ ] Add file_upload_queue table
  - [ ] Create migration scripts
  - [ ] Test new tables

- [ ] **Sync Service**
  - [ ] Implement InspectionSyncService
  - [ ] Batch sync logic
  - [ ] Conflict detection
  - [ ] Conflict resolution
  - [ ] Update local from remote
  - [ ] Mark changes as synced

- [ ] **Network Monitoring**
  - [ ] Add connectivity_plus dependency
  - [ ] Implement NetworkMonitor
  - [ ] Stream online/offline status
  - [ ] Auto-sync when back online

- [ ] **Conflict Resolution**
  - [ ] Define ConflictResolution enum
  - [ ] Implement ConflictResolver
  - [ ] Last Write Wins logic
  - [ ] User decision UI (for critical conflicts)

#### Week 2: UI & User Experience
- [ ] **Offline Indicator**
  - [ ] Create OfflineIndicator widget
  - [ ] Show when offline
  - [ ] Position in app bar or top of page

- [ ] **Sync Status Widget**
  - [ ] Show sync progress
  - [ ] Show last sync time
  - [ ] Show pending changes count
  - [ ] Retry button for failed syncs

- [ ] **Conflict Resolution UI**
  - [ ] Create ConflictResolutionDialog
  - [ ] Show local vs remote values
  - [ ] Allow user to choose
  - [ ] Apply resolution

- [ ] **Sync Controls**
  - [ ] Manual sync button
  - [ ] Sync all button
  - [ ] Sync settings page

#### Week 3: Advanced Features & Testing
- [ ] **Smart Sync Strategy**
  - [ ] Priority queue for critical changes
  - [ ] Batch changes (10 items or 5 minutes)
  - [ ] Optimize network usage

- [ ] **File Upload Queue**
  - [ ] Implement FileUploadService
  - [ ] Queue files when offline
  - [ ] Background upload with progress
  - [ ] Retry failed uploads

- [ ] **Testing**
  - [ ] Unit tests for sync logic
  - [ ] Integration tests for offline flow
  - [ ] E2E tests for conflict resolution
  - [ ] Performance tests with large data
  - [ ] Network transition tests

- [ ] **Performance Optimization**
  - [ ] Optimize DB queries
  - [ ] Batch DB operations
  - [ ] Background processing
  - [ ] Memory optimization

- [ ] **Documentation**
  - [ ] Update user guide
  - [ ] Document sync behavior
  - [ ] Document conflict resolution
  - [ ] API documentation for BE team

---

## ❓ FAQ - Database Persistence

### Q1: Tại sao cần lưu vào database local?

**A:** Có 4 lý do chính:

1. **User Experience:** 
   - User có thể thoát app bất cứ lúc nào (phone call, switch app, etc.)
   - Khi quay lại, data vẫn còn đó, không phải nhập lại
   - Giống như draft email

2. **Data Safety:**
   - App có thể crash (memory issue, OS kill)
   - Network có thể fail
   - Device có thể reboot
   - Data trong memory sẽ mất, nhưng DB vẫn an toàn

3. **Network Resilience:**
   - API call có thể fail
   - Network có thể chậm hoặc mất hoàn toàn
   - DB đảm bảo data không bao giờ mất

4. **Foundation for Phase 2:**
   - Database structure sẵn sàng
   - Không cần refactor lớn
   - Smooth transition sang full offline

### Q2: Khi nào thì save vào DB?

**A:** Save sau **MỖI** thay đổi:

```dart
// Sau khi user nhập answer
bloc.add(UpdateAnswerLocal(...));
  ↓
Bloc handler:
  1. Calculate score locally (instant)
  2. Update UI immediately
  3. Save to DB (background)
  4. Fire API call (don't wait)
```

**Debouncing:**
- Nếu user đang gõ text liên tục → debounce 500ms
- Nếu user chọn option → save ngay lập tức
- Nếu user upload file → save ngay lập tức

### Q3: DB có làm chậm app không?

**A:** **KHÔNG** nếu implement đúng cách:

**Good Practices:**
```dart
// ✅ Save in background, don't block UI
Future<void> saveToDb(Inspection inspection) async {
  // Run in isolate or with compute()
  await compute(_saveInBackground, inspection);
  // Or use Drift's background executor
}

// ✅ Batch operations
await db.batch((batch) {
  batch.insert(inspections, inspection);
  batch.insertAll(answers, answersList);
  batch.update(config, newConfig);
});

// ✅ Use indexes for fast queries
CREATE INDEX idx_inspection_id ON inspections(id);
CREATE INDEX idx_questionnaire_id ON inspection_configs(questionnaire_id);
```

**Performance:**
- Drift/SQLite rất nhanh: ~1-2ms cho simple insert
- Batch operations: ~5-10ms cho 100 records
- Queries với index: ~1ms
- **So với network call (100-500ms)** → DB nhanh hơn 100x

### Q4: Có cần clean up DB không?

**A:** **CÓ**, nên có strategy:

**Option 1: Keep for 30 days**
```dart
// Clean old completed inspections
await db.delete(inspections)
  .where((tbl) => tbl.syncedAt.isSmallerThan(
    DateTime.now().subtract(Duration(days: 30))
  ));
```

**Option 2: Keep only incomplete**
```dart
// Only keep inspections that are:
// 1. Not yet completed, OR
// 2. Completed but not synced
await db.delete(inspections)
  .where((tbl) => 
    tbl.isCompleted.equals(true) & 
    tbl.synced.equals(true)
  );
```

**Option 3: User-controlled**
```dart
// Let user decide in settings
Settings:
  - Keep data for: 7 days / 30 days / Forever
  - Clear cache button
```

### Q5: Conflict giữa DB và Memory state?

**A:** **Bloc pattern** giải quyết vấn đề này:

**Single Source of Truth:**
```
Database (Persistent)
    ↓
Load into Bloc State (Memory)
    ↓
UI reads from Bloc State
    ↓
User makes changes
    ↓
Bloc State updates (immediate)
    ↓
Save to DB (background)
```

**Rule:**
- **UI ALWAYS reads from Bloc State** (memory)
- **Bloc State ALWAYS syncs to DB** (persistent)
- On app restart: Load DB → Bloc State

### Q6: Size của DB có vấn đề không?

**A:** Phụ thuộc vào data size:

**Typical Sizes:**
- 1 inspection với 50 questions: ~50KB
- Config cho 1 questionnaire: ~20KB
- 100 inspections: ~5MB
- Với 1000 files (chỉ metadata): ~10MB

**Management:**
```dart
// Monitor DB size
final dbFile = File(dbPath);
final sizeInMB = dbFile.lengthSync() / (1024 * 1024);

if (sizeInMB > 100) {
  // Show warning, suggest cleanup
  showCleanupDialog();
}

// Media files stored separately (not in DB)
// Only store file paths and metadata
```

**Best Practices:**
- Store file paths, not file content
- Store JSON strings compressed if needed
- Regular cleanup of old data
- Monitor size and warn user

### Q7: Migrations khi schema changes?

**A:** Drift handles này rất tốt:

```dart
@DriftDatabase(
  tables: [...],
  version: 2,  // Increment version
)
class AppDatabase extends _$AppDatabase {
  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onUpgrade: (m, from, to) async {
        if (from == 1) {
          // Add new column in version 2
          await m.addColumn(inspections, inspections.syncedAt);
        }
      },
    );
  }
}
```

**Version Control:**
- v1: Initial schema
- v2: Add synced_at, change_queue
- v3: Add file_upload_queue
- etc.

### Q8: Phase 1 vs Phase 2 - DB khác nhau gì?

**A:** Phase 2 thêm tables cho sync:

**Phase 1:**
```
inspections
inspection_configs  
pending_api_calls
```

**Phase 2 adds:**
```
change_queue         ← Queue all changes for batch sync
sync_metadata        ← Track sync status
file_upload_queue    ← Queue file uploads
```

**Migration:**
- Phase 1 → Phase 2: Chỉ cần add tables mới
- Existing data vẫn giữ nguyên
- Zero downtime migration

---

## 💡 BEST PRACTICES - Database

### 1. Transaction for Related Operations
```dart
await db.transaction(() async {
  // All or nothing
  await db.inspectionDao.insert(inspection);
  await db.answersDao.insertAll(answers);
  await db.filesDao.insertAll(files);
});
```

### 2. Optimistic Updates
```dart
// Update UI immediately
state = state.copyWith(score: newScore);

// Save to DB in background
unawaited(db.save(inspection));

// Fire API (don't wait)
unawaited(api.update(inspection));
```

### 3. Error Recovery
```dart
try {
  await db.save(inspection);
} catch (e) {
  // Log error
  logger.error('DB save failed: $e');
  
  // Retry once
  await Future.delayed(Duration(seconds: 1));
  await db.save(inspection);
}
```

### 4. Background Operations
```dart
// Use Dart isolates for heavy operations
await compute(_heavyDbOperation, data);

// Or use Drift's background executor
final db = AppDatabase.background();
await db.heavyQuery();
```

### 5. Testing
```dart
test('DB persistence', () async {
  // Save to DB
  await db.save(inspection);
  
  // Clear memory
  inspection = null;
  
  // Load from DB
  final loaded = await db.load(inspectionId);
  
  // Verify data intact
  expect(loaded.score, equals(expectedScore));
});
```

## 🎓 EXAMPLE USE CASES

### Use Case 1: Simple Option-Based Scoring

**Question:** "Chất lượng sản phẩm?"
**Options:**
- Tốt → 10 điểm
- Trung bình → 5 điểm
- Kém → 0 điểm

**Config:**
```json
{
  "questionId": 1,
  "scoringType": "option_based",
  "optionScores": [
    {"answerOptionId": 101, "score": 10},
    {"answerOptionId": 102, "score": 5},
    {"answerOptionId": 103, "score": 0}
  ],
  "maxScore": 10
}
```

### Use Case 2: Range-Based Scoring

**Question:** "Nhiệt độ (°C)?"
**Ranges:**
- 18-22°C → 10 điểm
- 15-18°C hoặc 22-25°C → 5 điểm
- < 15°C hoặc > 25°C → 0 điểm

**Config:**
```json
{
  "questionId": 2,
  "scoringType": "range_based",
  "rangeScores": [
    {"minValue": 18, "maxValue": 22, "score": 10},
    {"minValue": 15, "maxValue": 18, "score": 5},
    {"minValue": 22, "maxValue": 25, "score": 5},
    {"minValue": null, "maxValue": 15, "score": 0},
    {"minValue": 25, "maxValue": null, "score": 0}
  ],
  "maxScore": 10
}
```

### Use Case 3: Conditional with Task Trigger

**Logic:**
- Nếu chọn "Kém" → Hiển thị câu hỏi "Nguyên nhân?"
- Nếu chọn "Kém" → Tạo task assignment "Khắc phục"

**Config:**
```json
{
  "questionId": 1,
  "conditionType": "task",
  "conditionExpression": "Q1.answer == 'Kém'",
  "targetQuestionIds": [5],
  "action": "show",
  "taskTemplateId": 200,
  "taskParams": {
    "priority": "high",
    "dueInHours": 24
  }
}
```

### Use Case 4: Formula-Based Section Score

**Section:** "An toàn"
**Questions:**
- Q1: Đội bảo hộ (10 điểm)
- Q2: Biển cảnh báo (10 điểm)
- Q3: Lối thoát hiểm (10 điểm)

**Formula:** Average with Q3 weighted 2x
**Score = (Q1 + Q2 + Q3*2) / 4**

**Config:**
```json
{
  "questionId": 100,
  "scoringType": "formula_based",
  "formula": "(Q1 + Q2 + Q3*2) / 4",
  "maxScore": 10
}
```

## 🚀 NEXT STEPS

1. **Review & Approval**
   - Đọc kỹ document
   - Thảo luận với team
   - Approve approach

2. **Backend Support**
   - Design config structure
   - Implement config endpoint
   - Implement batch sync endpoint
   - Document API changes

3. **Frontend Implementation**
   - Bắt đầu Phase 1
   - Tạo models và services
   - Setup infrastructure

4. **Iterative Development**
   - Implement từng widget type
   - Test riêng biệt
   - Integrate dần dần

## 📚 REFERENCES

- Current Inspection Page: `packages/supa_work/lib/pages/inspection/inspection_answer_page.dart`
- Models: `packages/supa_work/lib/core/models/`
- Question Types: `packages/supa_work/lib/pages/inspection/widgets/inspection_answer/inspection_question_types/`
- Expression Parser: https://pub.dev/packages/expressions
- Bloc Pattern: https://bloclibrary.dev/

---

**Tài liệu được tạo bởi:** Antigravity AI  
**Ngày tạo:** 2026-01-26  
**Phiên bản:** 1.0  
**Trạng thái:** Draft - Chờ review và phê duyệt
