# Inspection System Documentation

## Overview

Hệ thống inspection cho phép người dùng thực hiện đánh giá, kiểm tra công việc với các loại câu hỏi đa dạng, media attachments, và offline support. Đây là module core của work package với kiến trúc event-sourced sync và UI component hierarchy rõ ràng.

## Table of Contents

### Core Architecture

- [Architecture Overview](./architecture-overview.md) - Component hierarchy và data flow
- [Upload Progress Implementation](./upload-progress-implementation.md) - Real-time upload progress tracking
- [Answer Types System](./answer-types-system.md) - Tất cả 12 loại câu trả lời
- [Widget Component Tree](./widget-component-tree.md) - UI component structure

### Data Models

- [Models Overview](./models-overview.md) - Core entities và relationships
- [Inspection Question](./inspection-question-model.md) - Question structure
- [Question Answer](./question-answer-model.md) - Answer data models

### API & Sync

- [Sync APIs](./sync-apis.md) - Event-sourced sync endpoints
- [Repository Layer](./repository-layer.md) - MobileInspectionRepository methods

### Components Deep Dive

- [Answer Type Item](./answer-type-item.md) - Base wrapper cho mọi answer type
- [Answer Field](./answer-field.md) - Input field component với media support
- [Media View Widget](./media-view-widget.md) - Image/video display và upload

## Quick Start

### Navigate to Inspection Answer Page

```dart
// From inspection list
context.push(
  '/inspection/answer',
  extra: {
    'inspectionId': inspection.id.value,
    'inspection': inspection,
  },
);
```

### Answer Question Flow

```dart
// 1. User selects/inputs answer
// 2. Widget calls syncQuestionAnswer
await MobileInspectionRepository().syncQuestionAnswer(
  question.toAnswerHistory()
);

// 3. UI updates optimistically (fire-and-forget)
// 4. Server processes in background
```

### Upload Media with Progress

```dart
// In AbstractInspectionMediaState
final files = await WorkFileRepository().uploadInspectionFiles(
  images,
  onUploadProgress: (sent, total) {
    onUpdateUploadProgress(sent / total);
  },
);
```

## Key Features

### 1. Real-time Upload Progress ✨ NEW

- Hiển thị % upload cho ảnh/video
- Progress bar cho từng file
- Average progress cho multi-file uploads
- See: [Upload Progress Implementation](./upload-progress-implementation.md)

### 2. Event-Sourced Sync

- Fire-and-forget API calls
- Optimistic UI updates
- Background sync queue
- Conflict resolution

### 3. Offline Support

- Local storage với Drift
- Sync when online
- Conflict handling
- Queue management

### 4. Question Types

- Text input
- Number input
- Single choice
- Multiple choice
- Date/DateTime
- Location
- Image/Video
- Instructions

### 5. Conditional Logic

- Show/hide questions based on answers
- Dynamic scoring
- Auto-create tasks
- Custom validation rules

### 6. Validation

- Client-side validation
- Server-side validation
- Real-time error display
- Field-level warnings

## File Structure

```
packages/supa_work/
├── lib/
│   ├── core/
│   │   └── models/
│   │       ├── inspection_question_answer.dart
│   │       └── inspection_question_file_mapping.dart
│   ├── pages/
│   │   └── inspection/
│   │       ├── inspection_answer_page.dart
│   │       └── widgets/
│   │           ├── abstract_inspection_media_state.dart
│   │           ├── inspection_answer/
│   │           │   ├── answer_field.dart
│   │           │   └── answer_type_item.dart
│   │           └── media_view_widget/
│   │               └── media_view_widget_control.dart
│   └── repositories/
│       └── work_file_repository.dart
```

## API Endpoints

### Sync APIs (Event-Sourced)

```
POST /sync-question-answer     - Save answer + files
POST /sync-question             - Save question note/files
POST /sync-inspection-information - Save general info
```

### Legacy APIs (Deprecated)

```
POST /update-inspection-question-answer
POST /update-inspection-question
POST /update-inspection-information
```

## Common Tasks

### Add New Question Type

1. Define enum in `AnswerTypeEnum`
2. Add UI widget in `inspection_answer/`
3. Add validation rules in `InspectionValidator`
4. Update score calculator if needed

### Add Upload Progress to New Component

1. Extend `AbstractInspectionMediaState`
2. Override `onUpdateUploadProgress(progress)`
3. Update placeholders in `setState()`
4. Convert data to `InspectionQuestionFileMapping`

### Debug Upload Issues

```dart
// Enable debug logs
debugPrint('[UPLOAD] Starting upload...');
debugPrint('[UPLOAD] Progress: ${(progress * 100).toInt()}%');
debugPrint('[UPLOAD] Completed: ${files.length} files');
```

## Migration Notes

### Sync API Migration

Đang thay thế legacy APIs với sync APIs:

- ✅ `syncQuestionAnswer` - Complete
- ⏳ `syncQuestion` - In progress
- ⏳ `syncInspectionInformation` - In progress

### Upload Progress Migration

- ✅ Added to `InspectionQuestionAnswer` type
- ⏳ TODO: Add to `InspectionQuestionFileMapping` type (direct file uploads)
- ⏳ TODO: Add to Information page uploads

## Troubleshooting

### Issue: Upload progress not showing

**Check**:

1. `uploadProgress` field exists in model
2. `onUpdateUploadProgress` override implemented
3. Widget converts answers to mappings correctly
4. `setState()` called on progress update

### Issue: Images not displaying after upload

**Check**:

1. `onNewAttachmentAdded` removes placeholders
2. `imageId` set to positive value
3. Conversion filter: `imageId != 0`
4. Widget receives updated `fileMappings`

### Issue: Upload returns empty array

**Check**:

1. FormData key is `"files"` (not `files[0]`, `files[1]`)
2. Backend endpoint `/multi-upload-file`
3. Content-Type: `multipart/form-data`

## Performance Tips

1. **Throttle Progress Updates**: Update UI every 5% instead of every chunk
2. **Watermark in Isolate**: Move watermark processing off main thread
3. **Lazy Load Images**: Only load visible images in grid
4. **Debounce Validation**: Don't validate on every keystroke

## Testing

### Unit Tests

```dart
// Test progress calculation
test('calculates upload progress correctly', () {
  final progress = 500 / 1000; // sent / total
  expect(progress, equals(0.5));
});
```

### Widget Tests

```dart
testWidgets('shows progress percentage', (tester) async {
  await tester.pumpWidget(/* widget with progress */);
  expect(find.text('50%'), findsOneWidget);
});
```

### Integration Tests

```dart
// Test full upload flow
testWidgets('uploads image with progress', (tester) async {
  // 1. Pick image
  // 2. Verify placeholder shows 0%
  // 3. Wait for upload
  // 4. Verify progress updates
  // 5. Verify final image shows
});
```

## Contributing

When adding new features to inspection system:

1. Update this documentation
2. Add unit tests
3. Update UI components doc if applicable
4. Test offline mode
5. Consider performance impact

## Related Links

- [Main App Documentation](../)
- [Widget Components](../widgets/)
- [Architecture Overview](../architecture/)
