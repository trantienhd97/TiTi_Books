# INSPECTION LOGIC SYSTEM - PHÂN TÍCH CHI TIẾT

## 📋 NGUỒN DỮ LIỆU

**Google Sheets:** [Logic Specification](https://docs.google.com/spreadsheets/d/1Dvza9nF_M0DVo7milYam8teOeexMuWe4r_BakTTWkbc/edit?gid=224356272#gid=224356272)

**Sheet:** Logic (Sheet thứ 3)

**Ngày phân tích:** 2026-01-26

---

## 🎯 TỔNG QUAN HỆ THỐNG LOGIC

Inspection system có **8 loại logic** có thể được trigger khi user trả lời câu hỏi. Logic này áp dụng cho **4 loại câu hỏi chính** và **KHÔNG** áp dụng cho 4 loại câu hỏi còn lại.

---

## 📊 LOGIC THEO LOẠI CÂU HỎI

### ✅ Nhóm 1: CÓ LOGIC ĐẦY ĐỦ (8 loại)

Áp dụng cho các loại câu hỏi:

| STT | Loại Câu Trả Lời | Answer Type Enum | Hỗ trợ Logic |
|-----|------------------|------------------|--------------|
| 1 | **Chọn 1 đáp án** | SINGLE_CHOICE | ✅ 8 loại |
| 2 | **Chọn nhiều đáp án** | MULTIPLE_CHOICE | ✅ 8 loại |
| 3 | **Nhập chữ** | TEXT | ✅ 8 loại |
| 4 | **Nhập số** | NUMBER | ✅ 8 loại |

**8 loại Logic có thể trigger:**

#### 1. **Bắt buộc thêm hành động** (Required Task)
**Mô tả:** User BẮT BUỘC phải tạo một Task Assignment để có thể tiếp tục

**Use case:**
- Khi chọn đáp án "Không đạt" → Phải tạo task "Khắc phục"
- Khi nhập số < 5 → Phải tạo task "Cải thiện điểm số"

**UI Behavior:**
- Hiển thị nút "Thêm hành động"
- Block navigation cho đến khi task được tạo
- Task có thể được gán cho user khác

**Implementation:**
```dart
class ConditionalLogic {
  LogicType type = LogicType.REQUIRE_TASK;
  bool isBlocking = true;  // Block until task created
  String promptMessage = "Bạn cần tạo hành động để tiếp tục";
}
```

---

#### 2. **Bắt buộc thêm bằng chứng: Hình ảnh hoặc/và ghi chú** (Required Evidence)
**Mô tả:** User BẮT BUỘC phải upload hình ảnh và/hoặc nhập ghi chú

**Use case:**
- Chọn "Có sự cố" → Phải chụp hình + ghi chú mô tả
- Nhập số ngoài range → Phải giải thích bằng ghi chú

**UI Behavior:**
- Show required indicator (*) trên Note field
- Show required indicator (*) trên Media section
- Block navigation nếu chưa có evidence
- Validate trước khi cho phép next page

**Implementation:**
```dart
class ConditionalLogic {
  LogicType type = LogicType.REQUIRE_EVIDENCE;
  bool requirePhoto = true;
  bool requireNote = true;
  String notePrompt = "Vui lòng giải thích chi tiết";
  String photoPrompt = "Vui lòng chụp hình bằng chứng";
}
```

---

#### 3. **Tự tạo hành động** (Auto-Create Task) ⭐
**Mô tả:** Hệ thống TỰ ĐỘNG tạo Task Assignment với template có sẵn

**Use case:**
- Chọn "Kém" → Tự động tạo task "QC kiểm tra lại" assign cho QC Manager
- Nhập nhiệt độ > 30°C → Tự động tạo task "Kiểm tra hệ thống làm mát"

**UI Behavior:**
- Task được tạo ngay lập tức
- Task hiển thị trong danh sách tasks của question
- User có thể view/edit task
- Assignee nhận notification

**Implementation:**
```dart
class ConditionalLogic {
  LogicType type = LogicType.AUTO_CREATE_TASK;
  int taskTemplateId = 100;
  String taskName = "Khắc phục sản phẩm kém chất lượng";
  String taskDescription = "Kiểm tra và sửa chữa...";
  List<int> assignToUserIds = [5, 10];  // QC Manager, Supervisor
  List<int> assignToGroupIds = [2];  // QC Team
  bool requireNoteOnTask = true;
  bool requireMediaOnTask = true;
}
```

**Đây chính là logic ta đã phân tích trong TASK_ASSIGNMENT_TRIGGER_ANALYSIS.md!**

---

#### 4. **Cảnh báo** (Warning)
**Mô tả:** Hiển thị thông báo cảnh báo cho user

**Use case:**
- Chọn "Tạm chấp nhận" → Warning: "Cần theo dõi trong lần kiểm tra tiếp theo"
- Nhập số gần ngưỡng → Warning: "Giá trị gần vượt ngưỡng cho phép"

**UI Behavior:**
- Show warning banner dưới question
- Icon warning màu vàng/cam
- User có thể tiếp tục nhưng được nhắc nhở

**Implementation:**
```dart
class ConditionalLogic {
  LogicType type = LogicType.WARNING;
  String warningMessage = "Giá trị này cần được theo dõi";
  WarningLevel level = WarningLevel.MEDIUM;  // LOW, MEDIUM, HIGH
  bool dismissable = true;
}
```

---

#### 5. **Trừ toàn bộ điểm của trang** (Zero Page Score)
**Mô tả:** Điểm của TOÀN BỘ TRANG hiện tại = 0

**Use case:**
- Câu hỏi critical: "Có giấy phép hoạt động?" → Chọn "Không" → Trang = 0 điểm
- Câu hỏi an toàn: "Có biển cảnh báo?" → Chọn "Không" → Trang an toàn = 0 điểm

**UI Behavior:**
- Page score hiển thị 0/maxScore
- Các câu hỏi khác trong page vẫn có thể trả lời
- Điểm page được tính lại nếu user thay đổi answer

**Scoring Logic:**
```dart
class ScoringService {
  double calculatePageScore(InspectionPage page) {
    // Check if any question has ZERO_PAGE logic triggered
    for (final question in page.questions) {
      if (hasTriggeredLogic(question, LogicType.ZERO_PAGE_SCORE)) {
        return 0.0;  // Entire page = 0
      }
    }
    
    // Normal scoring
    return sumQuestionScores(page.questions);
  }
}
```

---

#### 6. **Trừ toàn bộ điểm của phân đoạn** (Zero Section Score)
**Mô tả:** Điểm của TOÀN BỘ PHÂN ĐOẠN (section/segment) = 0

**Use case:**
- Section "Vệ sinh" có câu hỏi critical → Không đạt → Section vệ sinh = 0 điểm
- Section "An toàn lao động" → Vi phạm nghiêm trọng → Section = 0 điểm

**UI Behavior:**
- Section score = 0/maxScore
- Các section khác vẫn giữ điểm bình thường
- Có thể có nhiều sections = 0

**Scoring Logic:**
```dart
class ScoringService {
  double calculateSectionScore(List<InspectionQuestion> sectionQuestions) {
    // Check if any question has ZERO_SECTION logic triggered
    for (final question in sectionQuestions) {
      if (hasTriggeredLogic(question, LogicType.ZERO_SECTION_SCORE)) {
        return 0.0;  // Entire section = 0
      }
    }
    
    // Normal scoring
    return sumQuestionScores(sectionQuestions);
  }
}
```

**Note:** Section = Parent question có nested questions

---

#### 7. **Trừ toàn bộ điểm của kiểm tra** (Zero Inspection Score)
**Mô tả:** Điểm của TOÀN BỘ INSPECTION = 0

**Use case:**
- Câu hỏi CRITICAL nhất: "Có vi phạm pháp luật?" → Chọn "Có" → Toàn bộ inspection = 0 điểm
- Câu hỏi knockout: "Sản phẩm đạt tiêu chuẩn bắt buộc?" → "Không" → Inspection fail = 0 điểm

**UI Behavior:**
- Total inspection score = 0/maxScore
- Màu đỏ, icon fail
- User vẫn có thể tiếp tục trả lời (để ghi nhận thông tin)
- Inspection tự động đánh dấu "Failed"

**Scoring Logic:**
```dart
class ScoringService {
  double calculateInspectionScore(Inspection inspection) {
    // Check ALL questions in ALL pages
    for (final page in inspection.pages) {
      for (final question in page.questions) {
        if (hasTriggeredLogic(question, LogicType.ZERO_INSPECTION_SCORE)) {
          return 0.0;  // ENTIRE INSPECTION = 0
        }
      }
    }
    
    // Normal scoring
    return sumPageScores(inspection.pages);
  }
}
```

---

#### 8. **Không tính điểm câu** (Question Not Scored)
**Mô tả:** Câu hỏi này KHÔNG được tính vào tổng điểm (N/A)

**Use case:**
- Câu hỏi thông tin: "Họ tên người kiểm tra?" → Không tính điểm
- Câu hỏi optional: "Ghi chú bổ sung?" → Không tính điểm
- Câu hỏi conditional: Chỉ tính điểm nếu điều kiện X thỏa mãn, nếu không thì N/A

**UI Behavior:**
- Không hiển thị điểm cho question này
- MaxScore của page/section không bao gồm question này
- Score indicator show "N/A" hoặc "-"

**Scoring Logic:**
```dart
class ScoringService {
  double calculateQuestionScore(InspectionQuestion question) {
    // Check if this question should be scored
    if (hasTriggeredLogic(question, LogicType.NOT_SCORED)) {
      return 0.0;  // But also maxScore = 0
    }
    
    // Normal scoring
    return getScoreFromAnswer(question);
  }
  
  double getQuestionMaxScore(InspectionQuestion question) {
    if (hasTriggeredLogic(question, LogicType.NOT_SCORED)) {
      return 0.0;  // Max score also = 0 (not counted)
    }
    
    return question.maxScore;
  }
}
```

---

### ❌ Nhóm 2: KHÔNG CÓ LOGIC

Các loại câu hỏi sau **KHÔNG** hỗ trợ logic conditional:

| STT | Loại Câu Trả Lời | Answer Type Enum | Logic |
|-----|------------------|------------------|-------|
| 5 | **Đa phương tiện** | IMAGE (MEDIA) | ❌ Không có logic |
| 6 | **Ngày giờ** | DATETIME | ❌ Không có logic |
| 7 | **Hướng dẫn** | INSTRUCTION | ❌ Không có logic |
| 8 | **Xác định vị trí** | LOCATION | ❌ Không có logic |

**Lý do:**
- **Đa phương tiện**: Chỉ upload file, không có điều kiện logic
- **Ngày giờ**: Chỉ chọn date/time, có thể có validation range nhưng không có logic phức tạp
- **Hướng dẫn**: Chỉ hiển thị text, không nhận input
- **Xác định vị trí**: Chỉ capture GPS coordinates

**Note:** Có thể có validation nhưng không có conditional logic như trừ điểm, tạo task, etc.

---

## 🔧 CONDITIONAL OPERATOR TYPES

Để trigger logic, cần check điều kiện với các operators:

| ID | Operator | Áp dụng cho | Mô tả |
|----|----------|-------------|-------|
| 1 | **EQUALS** (=) | Text, Number, Options | Giá trị bằng |
| 2 | **NOT_EQUALS** (≠) | Text, Number, Options | Giá trị khác |
| 3 | **GREATER_THAN** (>) | Number | Lớn hơn |
| 4 | **LESS_THAN** (<) | Number | Nhỏ hơn |
| 5 | **GREATER_OR_EQUAL** (≥) | Number | Lớn hơn hoặc bằng |
| 6 | **LESS_OR_EQUAL** (≤) | Number | Nhỏ hơn hoặc bằng |
| 7 | **BETWEEN** | Number | Trong khoảng [from, to] |
| 8 | **NOT_BETWEEN** | Number | Ngoài khoảng [from, to] |
| 9 | **CONTAINS** | Text | Chứa chuỗi |
| 10 | **NOT_CONTAINS** | Text | Không chứa chuỗi |

---

## 📐 CONFIG STRUCTURE CHO INSPECTION LOCAL

### ConditionalRule Model

```dart
class ConditionalRule extends JsonModel {
  // Target question
  JsonInteger questionId;
  
  // Condition
  JsonInteger operatorId;  // EQUALS, GREATER_THAN, etc.
  JsonString textValue;    // For text comparison
  JsonDouble numberValue;  // For number comparison  
  JsonDouble numberFrom;   // For BETWEEN operator
  JsonDouble numberTo;     // For BETWEEN operator
  JsonList<int> triggerAnswerOptionIds;  // For SINGLE/MULTIPLE_CHOICE
  
  // Logic actions (có thể có nhiều logic cùng lúc)
  JsonBoolean requireTask;
  JsonBoolean requireEvidence;
  JsonBoolean requirePhoto;
  JsonBoolean requireNote;
  
  JsonBoolean autoCreateTask;
  JsonInteger taskTemplateId;
  JsonString taskName;
  JsonString taskDescription;
  JsonList<int> assignToUserIds;
  JsonList<int> assignToGroupIds;
  JsonBoolean taskRequireNote;
  JsonBoolean taskRequireMedia;
  
  JsonBoolean showWarning;
  JsonString warningMessage;
  JsonString warningLevel;  // LOW, MEDIUM, HIGH
  
  JsonBoolean zeroPageScore;
  JsonBoolean zeroSectionScore;
  JsonBoolean zeroInspectionScore;
  JsonBoolean notScored;
}
```

### Example Configs

#### Example 1: Chọn "Kém" → Auto-create task + Require evidence + Zero page score

```json
{
  "questionId": 50,
  "operatorId": 1,  // EQUALS
  "triggerAnswerOptionIds": [103],  // Option "Kém"
  
  "autoCreateTask": true,
  "taskName": "Khắc phục sản phẩm kém chất lượng",
  "taskDescription": "Kiểm tra và sửa chữa sản phẩm không đạt tiêu chuẩn",
  "assignToUserIds": [5],  // QC Manager
  "taskRequireNote": true,
  "taskRequireMedia": true,
  
  "requireEvidence": true,
  "requirePhoto": true,
  "requireNote": true,
  
  "zeroPageScore": true
}
```

**Kết quả khi chọn "Kém":**
1. ✅ Task tự động được tạo, assign cho QC Manager
2. ✅ Question bắt buộc phải upload ảnh + ghi chú
3. ✅ Toàn bộ page = 0 điểm

#### Example 2: Nhập nhiệt độ > 30°C → Warning + Auto-create task

```json
{
  "questionId": 75,
  "operatorId": 3,  // GREATER_THAN
  "numberValue": 30.0,
  
  "showWarning": true,
  "warningMessage": "Nhiệt độ vượt ngưỡng cho phép (30°C)",
  "warningLevel": "HIGH",
  
  "autoCreateTask": true,
  "taskName": "Kiểm tra hệ thống điều hòa",
  "taskDescription": "Nhiệt độ phòng vượt quá 30°C",
  "assignToGroupIds": [3]  // Maintenance Team
}
```

**Kết quả khi nhập 35°C:**
1. ✅ Warning hiển thị: "Nhiệt độ vượt ngưỡng..."
2. ✅ Task tự động tạo cho Maintenance Team

#### Example 3: Không có giấy phép → Zero inspection + Require task

```json
{
  "questionId": 10,
  "operatorId": 1,  // EQUALS
  "triggerAnswerOptionIds": [203],  // Option "Không"
  
  "requireTask": true,
  
  "zeroInspectionScore": true
}
```

**Kết quả khi chọn "Không":**
1. ✅ Toàn bộ inspection = 0 điểm
2. ✅ Phải tạo task để có thể tiếp tục

---

## 💻 IMPLEMENTATION CHO PHASE 1

### 1. ConditionalService - Evaluate Logic

```dart
class InspectionLocalConditionalService {
  ConditionalResult evaluateConditionals(
    InspectionQuestion question,
    List<InspectionQuestionAnswer> answers,
    List<ConditionalRule> rules,
  ) {
    final result = ConditionalResult();
    
    // Find rules for this question
    final questionRules = rules.where((r) => r.questionId == question.id.value);
    
    for (final rule in questionRules) {
      if (_checkCondition(rule, answers)) {
        // Condition matched, apply logic
        _applyLogic(rule, result);
      }
    }
    
    return result;
  }
  
  bool _checkCondition(ConditionalRule rule, List<InspectionQuestionAnswer> answers) {
    switch (rule.operatorId) {
      case 1: // EQUALS
        if (rule.triggerAnswerOptionIds.isNotEmpty) {
          return answers.any((a) => 
            rule.triggerAnswerOptionIds.contains(a.inspectionAnswerOptionId.value)
          );
        }
        if (rule.numberValue != null) {
          return answers.any((a) => a.numberValue.value == rule.numberValue);
        }
        if (rule.textValue != null) {
          return answers.any((a) => a.textValue.value == rule.textValue);
        }
        break;
        
      case 3: // GREATER_THAN
        return answers.any((a) => a.numberValue.value > rule.numberValue);
        
      case 4: // LESS_THAN
        return answers.any((a) => a.numberValue.value < rule.numberValue);
        
      case 7: // BETWEEN
        return answers.any((a) => 
          a.numberValue.value >= rule.numberFrom &&
          a.numberValue.value <= rule.numberTo
        );
        
      // ... other operators
    }
    
    return false;
  }
  
  void _applyLogic(ConditionalRule rule, ConditionalResult result) {
    if (rule.requireTask) {
      result.requireTask = true;
    }
    
    if (rule.requireEvidence) {
      result.requirePhoto = rule.requirePhoto;
      result.requireNote = rule.requireNote;
    }
    
    if (rule.autoCreateTask) {
      final task = _createTask(rule);
      result.tasksToCreate.add(task);
    }
    
    if (rule.showWarning) {
      result.warnings.add(rule.warningMessage);
    }
    
    if (rule.zeroPageScore) {
      result.zeroPageScore = true;
    }
    
    if (rule.zeroSectionScore) {
      result.zeroSectionScore = true;
    }
    
    if (rule.zeroInspectionScore) {
      result.zeroInspectionScore = true;
    }
    
    if (rule.notScored) {
      result.notScored = true;
    }
  }
  
  TaskAssignment _createTask(ConditionalRule rule) {
    final task = TaskAssignment()
      ..name.value = rule.taskName
      ..description.value = rule.taskDescription
      ..isIgnoreNote.value = !rule.taskRequireNote
      ..isIgnoreAttachment.value = !rule.taskRequireMedia;
    
    // Add assignees
    final assignees = rule.assignToUserIds.map((userId) {
      return TaskAssignmentAssignee()..appUserId.value = userId;
    }).toList();
    
    task.taskAssignmentAssignees.value = assignees;
    
    return task;
  }
}

class ConditionalResult {
  bool requireTask = false;
  bool requirePhoto = false;
  bool requireNote = false;
  
  List<TaskAssignment> tasksToCreate = [];
  List<String> warnings = [];
  
  bool zeroPageScore = false;
  bool zeroSectionScore = false;
  bool zeroInspectionScore = false;
  bool notScored = false;
}
```

### 2. ScoringService - Apply Logic to Scores

```dart
class InspectionLocalScoringService {
  double calculatePageScore(
    InspectionPage page,
    Map<int, ConditionalResult> conditionalResults,
  ) {
    // Check if any question triggered ZERO_PAGE_SCORE
    for (final question in page.questions) {
      final result = conditionalResults[question.id.value];
      if (result?.zeroPageScore == true) {
        return 0.0;  // Entire page = 0
      }
    }
    
    // Normal scoring
    double totalScore = 0.0;
    double totalMaxScore = 0.0;
    
    for (final question in page.questions) {
      final result = conditionalResults[question.id.value];
      
      // Skip if NOT_SCORED
      if (result?.notScored == true) {
        continue;
      }
      
      totalScore += calculateQuestionScore(question);
      totalMaxScore += question.maxScore.value;
    }
    
    return totalScore;
  }
  
  double calculateInspectionScore(
    Inspection inspection,
    Map<int, ConditionalResult> conditionalResults,
  ) {
    // Check if any question triggered ZERO_INSPECTION_SCORE
    for (final page in inspection.pages) {
      for (final question in page.questions) {
        final result = conditionalResults[question.id.value];
        if (result?.zeroInspectionScore == true) {
          return 0.0;  // ENTIRE INSPECTION = 0
        }
      }
    }
    
    // Normal scoring - sum page scores
    return inspection.pages
      .map((page) => calculatePageScore(page, conditionalResults))
      .fold(0.0, (sum, score) => sum + score);
  }
}
```

### 3. Integration với Bloc

```dart
Future<void> _onUpdateAnswer(
  UpdateAnswerLocal event,
  Emitter<InspectionLocalState> emit,
) async {
  final currentState = state as InspectionLocalLoaded;
  
  // ... update answer
  
  // ⭐ EVALUATE CONDITIONALS ⭐
  final conditionalResult = conditionalService.evaluateConditionals(
    question,
    event.answers,
    currentState.config.conditionalRules,
  );
  
  // Apply logic effects
  
  // 1. Auto-create tasks
  if (conditionalResult.tasksToCreate.isNotEmpty) {
    question.taskAssignments.value.addAll(conditionalResult.tasksToCreate);
  }
  
  // 2. Set required fields
  question.requireNote.value = conditionalResult.requireNote;
  question.requireMedia.value = conditionalResult.requirePhoto;
  
  // 3. Add warnings
  question.warnings.value = conditionalResult.warnings;
  
  // 4. Recalculate scores (với logic zero scores)
  final allConditionalResults = <int, ConditionalResult>{};
  // ... evaluate all questions to get all conditional results
  
  final updatedScores = scoringService.calculateAllScores(
    updatedInspection,
    allConditionalResults,  // Pass conditional results
  );
  
  // ... save to DB, fire API
}
```

---

## 📝 SUMMARY

### Các Điểm Quan Trọng:

1. **8 loại logic** cho 4 loại câu hỏi (SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT, NUMBER)

2. **4 loại câu hỏi không có logic** (IMAGE, DATETIME, INSTRUCTION, LOCATION)

3. **Logic có thể kết hợp:** Một câu hỏi có thể trigger nhiều logic cùng lúc
   - Ví dụ: Chọn "Kém" → Auto-create task + Require evidence + Zero page score

4. **Priority scoring:**
   - ZERO_INSPECTION_SCORE > ZERO_SECTION_SCORE > ZERO_PAGE_SCORE > NOT_SCORED

5. **Config-driven:** Tất cả logic được config từ BE, client chỉ evaluate

6. **Real-time:** Phase 1 evaluate ngay lập tức, không chờ BE

---

**Document này là foundation cho Implementation Phase 1!** 🚀
