# HƯỚNG DẪN THỰC HIỆN CHUYỂN TRẠNG THÁI NHANH - TASK ASSIGNMENT

> Tài liệu hướng dẫn implementation cho tính năng chuyển trạng thái nhanh ở TaskAssignmentItem trong trang Home và danh sách công việc

---

## 📚 MỤC LỤC

1. [Khái niệm cơ bản](#i-khái-niệm-cơ-bản)
2. [Kiến trúc code](#ii-kiến-trúc-code)
3. [UI Component](#iii-ui-component)
4. [Business Logic](#iv-business-logic)
5. [Validation](#v-validation)
6. [Decision Table](#vi-decision-table)
7. [Usage](#vii-usage)

---

## I. KHÁI NIỆM CƠ BẢN

### 1. Các Trạng Thái

#### User Status (Trạng thái người dùng trong task)

- `TODO` (Cần làm)
- `DOING` (Đang làm)
- `DONE` (Hoàn thành)
- `CANNOT` (Không thể)

#### Task Status (Trạng thái công việc)

- `TODO` (Cần làm)
- `DOING` (Đang làm)
- `DONE` (Hoàn thành)

### 2. Completion Mode

#### ONE Mode

- Chỉ cần **1 người bất kỳ** hoàn thành
- Khi 1 user chuyển sang DONE → Task = DONE
- Thích hợp cho: CV cần 1 người xử lý

#### ALL Mode

- **Tất cả assignees** phải hoàn thành
- Chỉ khi 100% users = DONE → Task = DONE
- Thích hợp cho: CV cần nhiều người cùng thực hiện

### 3. Phân Quyền

#### Các điều kiện kiểm tra:

**IsAssignee:** User là người thực hiện (assignee) của task

**IsSupporter:** User là người hỗ trợ (supporter) của task

**IsAdmin:** Check từ response của API `get-info`

**CanComplete:** User có quyền đổi trạng thái sang Hoàn thành

**CanTodo:** User có quyền đổi trạng thái về Cần làm

User có quyền đổi trạng thái khi đáp ứng **ÍT NHẤT 1** trong các điều kiện:

```
✅ Là Admin (IsAdmin = true)
✅ Là Creator (người tạo task)
✅ Là Assignee (IsAssignee = true)
✅ Là Supporter VÀ có permission UPDATE_TASK_STATUS
```

❌ Ngược lại: Không cho đổi trạng thái, hiển thị thông báo lỗi

### 4. Quy Tắc Validation

#### Required Checklist (F và FD)

**F và FD:** `IsRequiredChecklist = true` có nghĩa là:

- Task có yêu cầu hoàn thành checklist **VÀ**
- User chưa hoàn thành xong checklist

Ngược lại (F = false hoặc FD = true):

- Đã hoàn thành checklist **HOẶC**
- Không yêu cầu checklist

**Khi F = true, FD = false:**

- → **Không cho** chuyển sang DONE
- → Hiển thị popup yêu cầu hoàn thành checklist

#### Required Form

- Nếu task yêu cầu nhập form và user chưa submit
- → **Không cho** chuyển sang DONE
- → Hiển thị popup yêu cầu nhập form

---

## II. KIẾN TRÚC CODE

### 1. Model Extensions

**File:** `packages/supa_work/lib/core/models/task_assignment_extensions.dart`

```dart
import 'package:supa_work/core/models/models.dart';

extension TaskAssignmentStatusHelper on TaskAssignment {
  /// Lấy trạng thái của current user trong task
  TaskStatus? getCurrentUserStatus(int currentUserId) {
    return taskAssignmentUsers.value
        .firstWhereOrNull((u) => u.appUserId.value == currentUserId)
        ?.status.value;
  }

  /// Kiểm tra user có phải assignee (người được giao)
  bool isAssignee(int userId) {
    return taskAssignmentUsers.value
        .any((u) => u.appUserId.value == userId && u.isAssignee.value);
  }

  /// Kiểm tra user có phải supporter (người hỗ trợ)
  bool isSupporter(int userId) {
    return taskAssignmentUsers.value
        .any((u) => u.appUserId.value == userId && !u.isAssignee.value);
  }

  /// Kiểm tra user có quyền update task không
  bool canUserUpdate(AppUser currentUser) {
    return currentUser.isAdmin.value ||
           createdBy.value == currentUser.id.value ||
           isAssignee(currentUser.id.value) ||
           currentUser.hasPermission('UPDATE_TASK_STATUS');
  }

  /// Kiểm tra user có phải người cuối cùng cần hoàn thành (ALL mode)
  bool isLastPersonToComplete(int currentUserId) {
    final assignees = taskAssignmentUsers.value
        .where((u) => u.isAssignee.value)
        .toList();

    final notDoneCount = assignees
        .where((u) => u.status.value != TaskStatus.DONE)
        .length;

    // Chỉ còn 1 người chưa done và đó là current user
    return notDoneCount == 1 &&
           assignees.any((u) =>
             u.appUserId.value == currentUserId &&
             u.status.value != TaskStatus.DONE
           );
  }

  /// Kiểm tra có checklist bắt buộc chưa hoàn thành
  bool get hasIncompleteRequiredChecklist {
    return inspectionAssignments.value.any((ia) =>
      ia.isRequired.value &&
      ia.inspection.value?.status.value != InspectionStatus.DONE
    );
  }

  /// Kiểm tra user đã submit form bắt buộc chưa
  bool hasUserSubmittedForm(int userId) {
    if (!isRequireForm.value) return true;

    return taskAssignmentFormSubmissions.value.any((s) =>
      s.appUserId.value == userId
    );
  }
}
```

### 2. Status Change Options Enum

**File:** `packages/supa_work/lib/core/enums/status_change_option.dart`

```dart
enum StatusChangeOption {
  // === ONE MODE ===
  /// Hoàn thành (từ Todo/Doing/Cannot → Done)
  /// Task status → Done
  COMPLETE,

  /// Mở lại (từ Done → Todo)
  /// Task status → Todo
  REOPEN,

  // === ALL MODE ===
  /// Tôi đã hoàn thành (user status → Done)
  /// Task status → Done (nếu là người cuối) hoặc Doing
  I_COMPLETED,

  /// Hoàn thành cho tất cả (cần quyền sửa)
  /// Tất cả users → Done, Task status → Done
  COMPLETE_FOR_ALL,

  /// Mở lại cho tôi (từ Done → Todo)
  /// User status → Todo, Task status → Doing
  REOPEN_FOR_ME,

  /// Mở lại cho tất cả (cần quyền sửa)
  /// Tất cả users → Todo, Task status → Doing
  REOPEN_FOR_ALL,
}

extension StatusChangeOptionExt on StatusChangeOption {
  String get label {
    switch (this) {
      case StatusChangeOption.COMPLETE:
        return 'Hoàn thành';
      case StatusChangeOption.I_COMPLETED:
        return 'Tôi đã hoàn thành';
      case StatusChangeOption.COMPLETE_FOR_ALL:
        return 'Hoàn thành cho tất cả';
      case StatusChangeOption.REOPEN:
        return 'Mở lại';
      case StatusChangeOption.REOPEN_FOR_ME:
        return 'Mở lại cho tôi';
      case StatusChangeOption.REOPEN_FOR_ALL:
        return 'Mở lại cho tất cả';
    }
  }

  IconData get icon {
    switch (this) {
      case StatusChangeOption.COMPLETE:
      case StatusChangeOption.I_COMPLETED:
      case StatusChangeOption.COMPLETE_FOR_ALL:
        return Icons.check_circle;
      case StatusChangeOption.REOPEN:
      case StatusChangeOption.REOPEN_FOR_ME:
      case StatusChangeOption.REOPEN_FOR_ALL:
        return Icons.refresh;
    }
  }
}
```

---

## III. UI COMPONENT

### 1. Task Status Icon Widget

**File:** `packages/supa_work/lib/widgets/task_status_icon.dart`

```dart
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:supa_work/core/models/models.dart';

class TaskStatusIcon extends StatelessWidget {
  final TaskAssignment task;
  final AppUser currentUser;
  final VoidCallback onTap;
  final double size;

  const TaskStatusIcon({
    Key? key,
    required this.task,
    required this.currentUser,
    required this.onTap,
    this.size = 24,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final userStatus = task.getCurrentUserStatus(currentUser.id.value);
    final canUpdate = task.canUserUpdate(currentUser);
    final isAssignee = task.isAssignee(currentUser.id.value);

    // TH: Không có quyền và không phải assignee → disabled
    if (!canUpdate && !isAssignee) {
      return _buildDisabledIcon(userStatus);
    }

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(size / 2),
      child: _buildIconByStatus(userStatus, context),
    );
  }

  Widget _buildIconByStatus(TaskStatus? status, BuildContext context) {
    final theme = Theme.of(context);

    switch (status) {
      case TaskStatus.TODO:
        // Icon tròn rỗng
        return Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: theme.colorScheme.outline,
              width: 2,
            ),
          ),
        );

      case TaskStatus.DOING:
        // Icon nửa tròn
        return CustomPaint(
          size: Size(size, size),
          painter: HalfCirclePainter(
            color: theme.colorScheme.primary,
            borderColor: theme.colorScheme.outline,
          ),
        );

      case TaskStatus.DONE:
        // Icon check xanh
        return Icon(
          Icons.check_circle,
          color: theme.colorScheme.primary,
          size: size,
        );

      case TaskStatus.CANNOT:
        // Icon X đỏ
        return Icon(
          Icons.cancel,
          color: theme.colorScheme.error,
          size: size,
        );

      default:
        return SizedBox(width: size, height: size);
    }
  }

  Widget _buildDisabledIcon(TaskStatus? status) {
    return Opacity(
      opacity: 0.4,
      child: IgnorePointer(
        child: _buildIconByStatus(status, context),
      ),
    );
  }
}

/// Custom painter để vẽ icon nửa tròn (DOING status)
class HalfCirclePainter extends CustomPainter {
  final Color color;
  final Color borderColor;

  HalfCirclePainter({
    required this.color,
    required this.borderColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Vẽ nửa tròn fill
    final fillPaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,  // Bắt đầu từ 12h
      pi,       // Vẽ 180 độ
      true,
      fillPaint,
    );

    // Vẽ viền tròn
    final borderPaint = Paint()
      ..color = borderColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    canvas.drawCircle(center, radius, borderPaint);
  }

  @override
  bool shouldRepaint(covariant HalfCirclePainter oldDelegate) {
    return oldDelegate.color != color ||
           oldDelegate.borderColor != borderColor;
  }
}
```

---

## IV. BUSINESS LOGIC

### 1. Controller - Handle Status Change

**File:** `packages/supa_work/lib/blocs/task_status_change_controller.dart`

```dart
import 'package:flutter/material.dart';
import 'package:supa_architecture/supa_architecture.dart';
import 'package:supa_work/core/models/models.dart';
import 'package:supa_work/repositories/task_assignment_repository.dart';

class TaskStatusChangeController {
  final TaskAssignmentRepository _repository;
  final AppUser currentUser;
  final BuildContext context;

  TaskStatusChangeController({
    required TaskAssignmentRepository repository,
    required this.currentUser,
    required this.context,
  }) : _repository = repository;

  /// Main handler khi user click vào status icon
  Future<void> handleStatusIconTap(TaskAssignment task) async {
    // Step 1: Kiểm tra quyền cơ bản
    if (!_canChangeStatus(task)) {
      _showError('Bạn không có quyền thay đổi trạng thái công việc');
      return;
    }

    final userStatus = task.getCurrentUserStatus(currentUser.id.value);

    // Step 2: Kiểm tra required checklist (nếu đang muốn complete)
    if (_isCompletingStatus(userStatus) &&
        task.hasIncompleteRequiredChecklist) {
      _showChecklistRequiredDialog();
      return;
    }

    // Step 3: Kiểm tra required form (nếu đang muốn complete)
    if (_isCompletingStatus(userStatus) &&
        !task.hasUserSubmittedForm(currentUser.id.value)) {
      _showFormRequiredDialog(task);
      return;
    }

    // Step 4: Lấy available options dựa trên Decision Table
    final options = _getAvailableOptions(task);

    if (options.isEmpty) {
      _showError('Không có hành động khả dụng');
      return;
    }

    // Step 5: Show dropdown hoặc execute luôn
    if (options.length == 1) {
      // Chỉ có 1 option → thực hiện luôn
      await _executeStatusChange(task, options.first);
    } else {
      // Nhiều options → show bottom sheet
      _showOptionsBottomSheet(task, options);
    }
  }

  /// Kiểm tra user có quyền đổi trạng thái
  bool _canChangeStatus(TaskAssignment task) {
    return currentUser.isAdmin.value ||
           task.createdBy.value == currentUser.id.value ||
           task.isAssignee(currentUser.id.value) ||
           (task.isSupporter(currentUser.id.value) &&
            currentUser.hasPermission('UPDATE_TASK_STATUS'));
  }

  /// Kiểm tra action có phải là completing (cần validate checklist/form)
  bool _isCompletingStatus(TaskStatus? currentStatus) {
    return currentStatus == TaskStatus.TODO ||
           currentStatus == TaskStatus.DOING ||
           currentStatus == TaskStatus.CANNOT;
  }

  /// Lấy danh sách options khả dụng theo Decision Table
  List<StatusChangeOption> _getAvailableOptions(TaskAssignment task) {
    final userStatus = task.getCurrentUserStatus(currentUser.id.value);
    final taskStatus = task.status.value;
    final canUpdate = task.canUserUpdate(currentUser);
    final isAssignee = task.isAssignee(currentUser.id.value);
    final isLastPerson = task.isLastPersonToComplete(currentUser.id.value);
    final completionMode = task.completionMode.value;

    List<StatusChangeOption> options = [];

    // === RULE 1: Không có quyền ===
    if (!canUpdate && !isAssignee) {
      return [];
    }

    // === RULE 2: Task đã DONE ===
    if (taskStatus == TaskStatus.DONE) {
      if (completionMode == CompletionMode.ONE) {
        // ONE mode: cho phép mở lại
        if (canUpdate) {
          options.add(StatusChangeOption.REOPEN);
        }
      } else {
        // ALL mode
        if (userStatus == TaskStatus.DONE) {
          if (isAssignee) {
            options.add(StatusChangeOption.REOPEN_FOR_ME);
          }
          if (canUpdate && isLastPerson) {
            options.add(StatusChangeOption.REOPEN_FOR_ALL);
          }
        }
      }
      return options;
    }

    // === RULE 3: Task chưa DONE ===

    if (completionMode == CompletionMode.ONE) {
      // ONE MODE
      if (userStatus == TaskStatus.TODO ||
          userStatus == TaskStatus.DOING ||
          userStatus == TaskStatus.CANNOT) {
        options.add(StatusChangeOption.COMPLETE);
      }
    } else {
      // ALL MODE
      if (userStatus == TaskStatus.TODO || userStatus == TaskStatus.DOING) {
        // Luôn có "Tôi đã hoàn thành"
        options.add(StatusChangeOption.I_COMPLETED);

        // Nếu có quyền update → thêm "Hoàn thành cho tất cả"
        if (canUpdate) {
          options.add(StatusChangeOption.COMPLETE_FOR_ALL);
        }
      } else if (userStatus == TaskStatus.CANNOT) {
        // Từ "Không thể"
        if (isAssignee) {
          options.add(StatusChangeOption.I_COMPLETED);
        }
        if (canUpdate) {
          options.add(StatusChangeOption.COMPLETE_FOR_ALL);
        }
      }
    }

    return options;
  }

  /// Execute status change action
  Future<void> _executeStatusChange(
    TaskAssignment task,
    StatusChangeOption option,
  ) async {
    try {
      switch (option) {
        // === ONE MODE ===
        case StatusChangeOption.COMPLETE:
          await _completeTaskOneMode(task);
          break;

        case StatusChangeOption.REOPEN:
          await _reopenTaskOneMode(task);
          break;

        // === ALL MODE ===
        case StatusChangeOption.I_COMPLETED:
          await _markUserCompleted(task);
          break;

        case StatusChangeOption.COMPLETE_FOR_ALL:
          await _completeTaskAllMode(task);
          break;

        case StatusChangeOption.REOPEN_FOR_ME:
          await _reopenForUser(task);
          break;

        case StatusChangeOption.REOPEN_FOR_ALL:
          await _reopenTaskAllMode(task);
          break;
      }

      _showSuccess('Đã cập nhật trạng thái');

    } catch (e) {
      _showError('Có lỗi xảy ra: ${e.toString()}');
    }
  }

  // === API CALL METHODS ===

  /// ONE MODE: Hoàn thành (user + task → Done)
  Future<void> _completeTaskOneMode(TaskAssignment task) async {
    await _repository.updateTaskStatus(
      taskId: task.id.value,
      userId: currentUser.id.value,
      userStatus: TaskStatus.DONE,
      taskStatus: TaskStatus.DONE,
    );
  }

  /// ONE MODE: Mở lại (user + task → Todo)
  Future<void> _reopenTaskOneMode(TaskAssignment task) async {
    await _repository.updateTaskStatus(
      taskId: task.id.value,
      userId: currentUser.id.value,
      userStatus: TaskStatus.TODO,
      taskStatus: TaskStatus.TODO,
    );
  }

  /// ALL MODE: Tôi đã hoàn thành
  Future<void> _markUserCompleted(TaskAssignment task) async {
    final isLastPerson = task.isLastPersonToComplete(currentUser.id.value);

    await _repository.updateTaskStatus(
      taskId: task.id.value,
      userId: currentUser.id.value,
      userStatus: TaskStatus.DONE,
      taskStatus: isLastPerson ? TaskStatus.DONE : TaskStatus.DOING,
    );
  }

  /// ALL MODE: Hoàn thành cho tất cả
  Future<void> _completeTaskAllMode(TaskAssignment task) async {
    await _repository.completeTaskForAll(
      taskId: task.id.value,
      completedBy: currentUser.id.value,
    );
  }

  /// ALL MODE: Mở lại cho tôi
  Future<void> _reopenForUser(TaskAssignment task) async {
    await _repository.updateTaskStatus(
      taskId: task.id.value,
      userId: currentUser.id.value,
      userStatus: TaskStatus.TODO,
      taskStatus: TaskStatus.DOING,
    );
  }

  /// ALL MODE: Mở lại cho tất cả
  Future<void> _reopenTaskAllMode(TaskAssignment task) async {
    await _repository.reopenTaskForAll(
      taskId: task.id.value,
      reopenedBy: currentUser.id.value,
    );
  }

  // === UI METHODS ===

  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Theme.of(context).colorScheme.error,
      ),
    );
  }

  void _showChecklistRequiredDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Yêu cầu hoàn thành checklist'),
        content: Text(
          'Công việc này yêu cầu hoàn thành checklist trước khi chuyển trạng thái'
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Đóng'),
          ),
        ],
      ),
    );
  }

  void _showFormRequiredDialog(TaskAssignment task) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Yêu cầu nhập form'),
        content: Text(
          'Vui lòng hoàn thành form yêu cầu trước khi đánh dấu hoàn thành'
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Đóng'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: Navigate to form
            },
            child: Text('Nhập form'),
          ),
        ],
      ),
    );
  }

  void _showOptionsBottomSheet(
    TaskAssignment task,
    List<StatusChangeOption> options,
  ) {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'Chọn hành động',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
              ...options.map((option) {
                return ListTile(
                  leading: Icon(option.icon),
                  title: Text(option.label),
                  onTap: () {
                    Navigator.pop(context);
                    _executeStatusChange(task, option);
                  },
                );
              }).toList(),
            ],
          ),
        );
      },
    );
  }
}
```

---

## V. VALIDATION

### Validation Rules

```dart
class TaskStatusValidation {
  /// Rule 1: Kiểm tra quyền
  static bool canChangeStatus(TaskAssignment task, AppUser user) {
    return user.isAdmin.value ||
           task.createdBy.value == user.id.value ||
           task.isAssignee(user.id.value) ||
           (task.isSupporter(user.id.value) &&
            user.hasPermission('UPDATE_TASK_STATUS'));
  }

  /// Rule 2: Kiểm tra required checklist
  static bool hasIncompleteChecklist(TaskAssignment task) {
    return task.inspectionAssignments.value.any((ia) =>
      ia.isRequired.value &&
      ia.inspection.value?.status.value != InspectionStatus.DONE
    );
  }

  /// Rule 3: Kiểm tra required form
  static bool hasSubmittedForm(TaskAssignment task, int userId) {
    if (!task.isRequireForm.value) return true;

    return task.taskAssignmentFormSubmissions.value.any((s) =>
      s.appUserId.value == userId
    );
  }

  /// Rule 4: Task đã Done
  static bool isTaskCompleted(TaskAssignment task) {
    return task.status.value == TaskStatus.DONE;
  }
}
```

---

## VI. DECISION TABLE

### Decision Table Summary

| #   | R<br/>(CanComplete) | S<br/>(Self Status) | T<br/>(Task Status) | F<br/>(Checklist) | M<br/>(Mode) | LC<br/>(Last) | IsAssignee | IsSupporter | **Hành động**                           |
| --- | :-----------------: | :-----------------: | :-----------------: | :---------------: | :----------: | :-----------: | :--------: | :---------: | --------------------------------------- |
| 1   |        ❌ No        |         \*          |         \*          |        \*         |      \*      |      \*       |   ❌ No    |    ❌ No    | ❌ Không cho đổi trạng thái             |
| 2   |       ✅ Yes        |        Done         |        Done         |        \*         |      \*      |      \*       |     \*     |     \*      | ⚠️ Không đổi, show "Task đã hoàn thành" |
| 3   |       ✅ Yes        |     Todo/Doing      |         \*          |       ❌ No       |      \*      |      \*       |   ✅ Yes   |     \*      | ✅ Cho Done                             |
| 4   |       ✅ Yes        |     Todo/Doing      |         \*          |      ✅ Yes       |      \*      |      \*       |   ✅ Yes   |     \*      | ❌ Yêu cầu hoàn thành checklist         |
| 5   |       ✅ Yes        |     Todo/Doing      |         \*          |       ❌ No       |     ONE      |      \*       |   ✅ Yes   |     \*      | ✅ Done → Task=Done                     |
| 6   |       ✅ Yes        |     Todo/Doing      |         \*          |       ❌ No       |     ALL      |     ❌ No     |   ✅ Yes   |     \*      | ✅ Done → Task=Doing                    |
| 7   |       ✅ Yes        |     Todo/Doing      |         \*          |       ❌ No       |     ALL      |    ✅ Yes     |   ✅ Yes   |     \*      | ✅ Done → Task=Done                     |
| 8   |       ✅ Yes        |        Done         |        Doing        |        \*         |     ONE      |      \*       |   ✅ Yes   |     \*      | ✅ Revert → Task=Doing                  |
| 9   |       ✅ Yes        |        Done         |        Doing        |        \*         |     ALL      |    ✅ Yes     |   ✅ Yes   |     \*      | ✅ Revert → Task=Doing                  |
| 10  |       ✅ Yes        |        Done         |        Doing        |        \*         |     ALL      |     ❌ No     |   ✅ Yes   |     \*      | ✅ Revert → Task=Doing                  |
| 11  |       ✅ Yes        |         \*          |        Done         |        \*         |     ONE      |      \*       |   ✅ Yes   |     \*      | ✅ Revert → Task=Doing                  |
| 12  |       ✅ Yes        |         \*          |        Done         |        \*         |     ALL      |    ✅ Yes     |   ✅ Yes   |     \*      | ✅ Revert → Task=Doing                  |

**Chú thích:**

- `*` = Không quan trọng (any value)
- `R (CanComplete)` = User có quyền đổi trạng thái sang Hoàn thành
- `S (TaskAssignmentSelfStatusId)` = Trạng thái của user hiện tại trong task (chỉ có giá trị khi user thuộc nhóm được giao việc/hỗ trợ)
- `T (TaskAssignmentStatusId)` = Trạng thái task hiện tại
- `F (IsRequiredChecklist)` = Có yêu cầu checklist VÀ chưa hoàn thành (true), hoặc đã hoàn thành/không yêu cầu (false)
- `M (TaskAssignmentCompleteTypeId)` = Completion mode (ONE/ALL)
- `LC (IsLastPendingUser)` = User là người cuối cùng cần hoàn thành
- `IsAssignee` = User là người thực hiện
- `IsSupporter` = User là người hỗ trợ

**Lưu ý:**

- API `SingleListTaskChangeStatusActionType` mặc định có `IsQuickAction = true`
- `IsAdmin` được check từ response của API `get-info`

---

## VII. USAGE

### 1. Trong TaskAssignmentItem Widget

```dart
class TaskAssignmentItem extends StatelessWidget {
  final TaskAssignment task;

  @override
  Widget build(BuildContext context) {
    final currentUser = context.read<AuthBloc>().currentUser;
    final controller = TaskStatusChangeController(
      repository: context.read<TaskAssignmentRepository>(),
      currentUser: currentUser,
      context: context,
    );

    return ListTile(
      leading: TaskStatusIcon(
        task: task,
        currentUser: currentUser,
        onTap: () => controller.handleStatusIconTap(task),
      ),
      title: Text(task.title.value),
      subtitle: Text(task.description.value),
      // ... other properties
    );
  }
}
```

### 2. Trong Home Page

```dart
class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: tasks.length,
      itemBuilder: (context, index) {
        final task = tasks[index];
        return TaskAssignmentItem(task: task);
      },
    );
  }
}
```

---

## VIII. TESTING

### Unit Tests

```dart
void main() {
  group('TaskStatusChangeController', () {
    test('should allow status change for assignee', () {
      // Arrange
      final task = TaskAssignment()../* setup */;
      final user = AppUser()../* setup as assignee */;

      // Act
      final canChange = TaskStatusValidation.canChangeStatus(task, user);

      // Assert
      expect(canChange, true);
    });

    test('should block status change if form not submitted', () {
      // Arrange
      final task = TaskAssignment()
        ..isRequireForm.value = true;
      final user = AppUser()..id.value = 1;

      // Act
      final hasSubmitted = TaskStatusValidation.hasSubmittedForm(task, 1);

      // Assert
      expect(hasSubmitted, false);
    });

    test('should calculate correct options for ONE mode', () {
      // Arrange
      final task = TaskAssignment()
        ..completionMode.value = CompletionMode.ONE
        ..status.value = TaskStatus.TODO;

      // Act
      final options = controller._getAvailableOptions(task);

      // Assert
      expect(options, contains(StatusChangeOption.COMPLETE));
    });
  });
}
```

---

## IX. TROUBLESHOOTING

### Common Issues

#### 1. Icon không hiển thị

**Nguyên nhân:** Không có user status trong taskAssignmentUsers
**Giải pháp:** Đảm bảo API trả về đầy đủ taskAssignmentUsers với status

#### 2. Không show dropdown

**Nguyên nhân:** \_getAvailableOptions trả về empty list
**Giải pháp:** Kiểm tra lại quyền và trạng thái trong Decision Table

#### 3. API call failed

**Nguyên nhân:** Backend chưa implement endpoint
**Giải pháp:** Đảm bảo backend đã có các endpoint:

- `PUT /api/task-assignments/{id}/status`
- `PUT /api/task-assignments/{id}/complete-for-all`
- `PUT /api/task-assignments/{id}/reopen-for-all`

---

## X. REFERENCES

- [Trang Home Documentation](./trang-home.md)
- [Task Assignment Models](../../packages/supa_work/lib/core/models/task_assignment.dart)
- [Backend API Specs](../api/task-assignment-api.md)

---

**Last Updated:** February 6, 2026  
**Version:** 1.0.0
