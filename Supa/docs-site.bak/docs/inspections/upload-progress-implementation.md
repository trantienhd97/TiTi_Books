# Upload Progress Implementation - Inspection Media

## Overview

Triển khai hiển thị tiến trình tải ảnh/video theo thời gian thực (%) khi upload media trong inspection, thay vì chỉ hiển thị loading spinner.

## Architecture

### 1. Data Model Layer

#### InspectionQuestionFileMapping

```dart
// packages/supa_work/lib/entities/inspection_question_file_mapping.dart
class InspectionQuestionFileMapping {
  JsonDouble uploadProgress = JsonDouble('uploadProgress'); // 0.0 - 1.0
  JsonBoolean isLoading = JsonBoolean('isLoading');
  JsonBoolean isSuccess = JsonBoolean('isSuccess');
}
```

#### InspectionQuestionAnswer

```dart
// packages/supa_work/lib/core/models/inspection_question_answer.dart
class InspectionQuestionAnswer {
  JsonDouble uploadProgress = JsonDouble('uploadProgress'); // 0.0 - 1.0
}
```

**Purpose**: Lưu trữ progress value từ 0.0 (0%) đến 1.0 (100%) cho từng file đang upload.

### 2. Repository Layer

#### WorkFileRepository

```dart
// packages/supa_work/lib/repositories/work_file_repository.dart
Future<List<File>> uploadInspectionFiles(
  List<XFile> files, {
  String uploadUrl = '/multi-upload-file',
  void Function(int sent, int total)? onUploadProgress,
})
```

**Key Implementation**:

- Sử dụng Dio's `onSendProgress` callback để track upload progress
- FormData format: Tất cả files dùng key `"files"` (backend requirement)
- Support cả Web và Mobile/Desktop platforms

**FormData Structure**:

```dart
final formData = FormData();
for (var file in files) {
  formData.files.add(
    MapEntry('files', MultipartFile.fromFile(...))
  );
}
```

### 3. State Management Layer

#### AbstractInspectionMediaState

**Callback Chain**:

```dart
abstract class AbstractInspectionMediaState<T> extends State<T> {
  // Override in child class to update progress
  Future<void> onUpdateUploadProgress(double progress) async {}

  Future<void> onImagesPicked(List<XFile> images) async {
    final uploadedImages = await _fileRepository.uploadInspectionFiles(
      watermarkedImages,
      onUploadProgress: (sent, total) {
        final progress = sent / total;
        onUpdateUploadProgress(progress);
      },
    );
  }
}
```

**Flow**:

1. User picks images → Create placeholders với `uploadProgress = 0.0`
2. Start upload → Callback receives `(sent, total)` từ Dio
3. Calculate progress → `sent / total`
4. Call `onUpdateUploadProgress(progress)` → Child widget updates state
5. Widget rebuilds → UI shows percentage

#### Answer Field Implementation

```dart
// packages/supa_work/lib/pages/inspection/widgets/inspection_answer/answer_field.dart
class _AnswerFieldState extends AbstractInspectionMediaState<AnswerField> {
  @override
  Future<void> onUpdateUploadProgress(double progress) async {
    if (mounted) {
      setState(() {
        for (var answer in widget.inspectionQuestion!.inspectionQuestionAnswers.value) {
          if (answer.imageId.value == -1) { // Placeholder
            answer.uploadProgress.value = progress;
          }
        }
      });
    }
  }

  @override
  FutureOr<void> onNewAttachmentAdded(List<File> files) async {
    // Remove placeholders (imageId == -1)
    final withoutPlaceholders = widget.inspectionQuestion!
        .inspectionQuestionAnswers.value
        .where((a) => a.imageId.value != -1)
        .toList();

    // Add real uploaded files
    final newAnswers = files.map((file) {
      final answer = InspectionQuestionAnswer();
      answer.imageId.value = file.id.value;
      answer.image.value = file;
      answer.uploadProgress.value = 1.0; // Complete
      return answer;
    }).toList();

    await widget.onUpdateInspectionQuestionAnswer!([
      ...withoutPlaceholders,
      ...newAnswers
    ]);
  }
}
```

### 4. UI Layer

#### Data Conversion

```dart
// inspection_question_type_select_options.dart
Widget build(BuildContext context) {
  // Convert InspectionQuestionAnswer → InspectionQuestionFileMapping
  final fileMappings = widget.inspectionQuestion
      .inspectionQuestionAnswers.value
      .where((answer) => answer.imageId.value != 0) // Exclude empty
      .map((answer) {
    final mapping = InspectionQuestionFileMapping();
    mapping.fileId.value = answer.imageId.value;
    mapping.file.value = answer.image.value;
    mapping.uploadProgress.value = answer.uploadProgress.value;
    mapping.isLoading.value = answer.imageId.value == -1; // Placeholder
    mapping.isSuccess.value = answer.imageId.value > 0; // Uploaded
    return mapping;
  }).toList();

  return AnswerTypeItem(files: fileMappings, ...);
}
```

#### Progress Display Widget

```dart
// media_view_widget_control.dart
// Grid "+N" overlay - average progress của tất cả loading files
final loadingFiles = widget.files.where((f) => f.fileId.value == -1).toList();
final loadingProgress = loadingFiles.isEmpty
    ? 0.0
    : loadingFiles.map((f) => f.uploadProgress.value).reduce((a, b) => a + b) /
      loadingFiles.length;

if (hasLoadingItems)
  Positioned(
    bottom: 10,
    right: 10,
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.7),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        '${(loadingProgress * 100).toInt()}%',
        style: const TextStyle(
          color: Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
  )

// Individual file - per-file progress
Container(
  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
  decoration: BoxDecoration(
    color: Colors.black.withOpacity(0.8),
    borderRadius: BorderRadius.circular(12),
  ),
  child: Text(
    '${(file.uploadProgress.value * 100).toInt()}%',
    style: const TextStyle(
      color: Colors.white,
      fontSize: 12,
      fontWeight: FontWeight.bold,
    ),
  ),
)
```

## Upload Flow

### Complete Upload Sequence

```
1. User Action
   └─> pickImages() called
       └─> ImagePickerService returns List<XFile>

2. Create Placeholders
   └─> onUpdateImageLocal(placeholderMappings)
       ├─> mapping.fileId = -1
       ├─> mapping.uploadProgress = 0.0
       ├─> mapping.isLoading = true
       └─> Convert to InspectionQuestionAnswer
           └─> Add to inspectionQuestionAnswers

3. Start Upload
   └─> onImagesPicked(images)
       ├─> Apply watermark
       └─> uploadInspectionFiles(watermarkedImages)
           ├─> Build FormData
           ├─> dio.post(data: formData, onSendProgress: callback)
           └─> Callback fires: (sent, total) => {}

4. Progress Updates (0% → 100%)
   └─> onUploadProgress: (sent, total)
       ├─> progress = sent / total
       ├─> onUpdateUploadProgress(progress)
       └─> setState(() {
             for placeholders: uploadProgress = progress
           })
       └─> Widget rebuilds
           └─> UI shows percentage

5. Upload Complete
   └─> onNewAttachmentAdded(uploadedFiles)
       ├─> Remove placeholders: filter(imageId != -1)
       ├─> Create real answers from uploaded files
       │   ├─> imageId = file.id (> 0)
       │   ├─> image = file
       │   └─> uploadProgress = 1.0
       └─> Update inspectionQuestionAnswers

6. Final Render
   └─> Widget rebuild
       ├─> Convert answers → fileMappings
       │   └─> Only include imageId != 0
       └─> MediaViewWidget displays uploaded images
```

## File States

### State Machine

```
EMPTY (imageId = 0)
  ↓ User picks image
PLACEHOLDER (imageId = -1, uploadProgress = 0.0, isLoading = true)
  ↓ Upload starts
UPLOADING (imageId = -1, uploadProgress = 0.0 → 1.0, isLoading = true)
  ↓ Upload completes
UPLOADED (imageId > 0, uploadProgress = 1.0, isSuccess = true)
```

### State Indicators

- **imageId == 0**: No image, không hiển thị
- **imageId == -1**: Placeholder đang upload, show progress %
- **imageId > 0**: Uploaded thành công, show image

## Key Design Decisions

### 1. Why Two Model Types?

**InspectionQuestionFileMapping**:

- Used for file operations (upload, display)
- Has `isLoading`, `isSuccess`, `uploadProgress`
- Generic file representation

**InspectionQuestionAnswer**:

- Business model for inspection answers
- Contains answer data (imageId, image, text, number, etc)
- Added `uploadProgress` for UI consistency

**Conversion**: Widget layer converts `Answer → Mapping` để reuse existing display components.

### 2. Why Clone uploadInspectionFiles?

- Original `uploadFilesFromImagePicker` không có progress callback
- Tạo method mới để không affect existing code
- Có thể future merge khi stable

### 3. Why Average Progress for Grid Overlay?

- Multiple files upload simultaneously
- Show overall progress instead of per-file
- Better UX for batch uploads

### 4. Progress Callback Design

```dart
// Why use callback chain instead of direct access?
onUploadProgress: (sent, total) {
  onUpdateUploadProgress(progress); // Abstract method
}

// Benefits:
// 1. Decoupling: AbstractState không cần biết concrete implementation
// 2. Flexibility: Child widgets tự quyết định update logic
// 3. Testability: Dễ mock và test
```

## Testing Scenarios

### 1. Single Image Upload

- ✅ Show 0% initially
- ✅ Progress increases smoothly 0% → 100%
- ✅ Image displays after upload
- ✅ Placeholder removed

### 2. Multiple Images Upload

- ✅ All show 0% initially
- ✅ Grid overlay shows average progress
- ✅ Individual items show per-file progress
- ✅ All placeholders removed after upload

### 3. Upload Failure

- ⚠️ TODO: Handle error state
- ⚠️ TODO: Show retry option
- ⚠️ TODO: Remove failed placeholders

### 4. Network Interruption

- ⚠️ TODO: Pause/resume support
- ⚠️ TODO: Retry mechanism

## Performance Considerations

### 1. setState Frequency

- Progress callback fires frequently (every chunk uploaded)
- Each call triggers `setState()` → rebuild
- **Optimization**: Consider throttling updates (e.g., every 5%)

```dart
double _lastReportedProgress = 0.0;
onUploadProgress: (sent, total) {
  final progress = sent / total;
  if ((progress - _lastReportedProgress) >= 0.05) { // 5% threshold
    _lastReportedProgress = progress;
    onUpdateUploadProgress(progress);
  }
}
```

### 2. Large File Uploads

- Watermark processing blocks UI
- **Optimization**: Move to isolate
- **Optimization**: Show watermark progress separately

### 3. Memory Management

- XFile paths held in memory during upload
- **Optimization**: Release after watermark
- **Optimization**: Stream-based upload for very large files

## Debugging

### Enable Debug Logs

```dart
// abstract_inspection_media_state.dart
debugPrint('[ABSTRACT_MEDIA] 📊 Upload progress: ${(progress * 100).toStringAsFixed(1)}%');
```

### Common Issues

**Issue 1: Progress stuck at 0%**

- Check: `onUpdateUploadProgress` được override?
- Check: `setState()` được gọi?
- Check: `mounted` check passed?

**Issue 2: Images không hiển thị sau upload**

- Check: `onNewAttachmentAdded` có remove placeholders?
- Check: `imageId` được set > 0?
- Check: Conversion logic trong widget có đúng?

**Issue 3: "Uploaded 0 images"**

- Check: FormData format (key phải là `"files"`)
- Check: Backend endpoint
- Check: Response parsing

## Future Improvements

### 1. Unified Progress System

```dart
// Create shared progress manager
class UploadProgressManager {
  final Map<String, double> _progress = {};

  void updateProgress(String fileId, double progress) { }
  double getProgress(String fileId) { }
  double getAverageProgress(List<String> fileIds) { }
}
```

### 2. Upload Queue

```dart
// Handle multiple uploads gracefully
class UploadQueue {
  final Queue<UploadTask> _queue = Queue();
  int maxConcurrent = 3;

  Future<void> enqueue(UploadTask task) { }
  void cancel(String taskId) { }
  void pause(String taskId) { }
  void resume(String taskId) { }
}
```

### 3. Offline Support

- Cache failed uploads
- Retry when online
- Sync progress across app restarts

## Related Documentation

- [Media Picker Plus Integration](../media_picker_plus_integration.md)
- [Inspection Offline Architecture](../inspection_offline/)
- [UI Components - Media View Widget](../widgets/media-view-widget.md)
