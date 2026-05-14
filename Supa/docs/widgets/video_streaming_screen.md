# VideoStreamingScreen

Widget để stream video trực tiếp với authentication, sử dụng thư viện `media_kit`.

## Tổng quan

`VideoStreamingScreen` cho phép người dùng xem video trực tiếp từ server mà không cần tải về trước. Widget hỗ trợ authentication thông qua cookies và cung cấp các action như tải video về máy hoặc xóa video.

## Dependencies

```yaml
dependencies:
  media_kit: ^1.1.10+1
  media_kit_video: ^2.0.0
  media_kit_libs_video: ^1.0.4
```

### Khởi tạo

Cần khởi tạo `MediaKit` trong `main.dart` trước khi sử dụng:

```dart
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  MediaKit.ensureInitialized();
  // ...
}
```

## Cách sử dụng

### Cơ bản - Chỉ xem video

```dart
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => VideoStreamingScreen(
      videoUrl: 'https://example.com/video.mp4',
      title: 'My Video',
    ),
  ),
);
```

### Với URL relative (sẽ tự động thêm base URL)

```dart
VideoStreamingScreen(
  videoUrl: '/api/files/video/123.mp4',
  title: 'Video từ server',
)
```

### Với action xóa video

Nút xóa chỉ hiển thị khi `onDelete` callback được truyền vào. Điều này cho phép kiểm soát quyền xóa từ bên ngoài.

```dart
VideoStreamingScreen(
  videoUrl: videoFile.url,
  title: videoFile.name,
  // Chỉ truyền onDelete khi user có quyền xóa
  onDelete: canDelete
      ? () async {
          // Logic xóa và đóng màn hình
          await deleteVideo(videoFile.id);
          Navigator.pop(context);
        }
      : null, // null = không hiển thị nút xóa
)
```

### Ví dụ kiểm tra quyền trước khi cho phép xóa

```dart
// Chỉ cho xóa khi:
// 1. Có callback onDelete từ widget cha
// 2. Không phải chế độ view-only
final allowDelete = widget.onDelete != null && !widget.isView;

VideoStreamingScreen(
  videoUrl: videoFile.url,
  title: videoFile.name,
  onDelete: allowDelete ? () async { ... } : null,
)
```

## Parameters

| Parameter  | Type                       | Required | Description                                                         |
| ---------- | -------------------------- | -------- | ------------------------------------------------------------------- |
| `videoUrl` | `String`                   | ✅       | URL của video. Có thể là full URL hoặc relative path                |
| `title`    | `String?`                  | ❌       | Tiêu đề hiển thị ở header. Cũng được dùng làm tên file khi download |
| `onDelete` | `Future<void> Function()?` | ❌       | Callback khi bấm nút xóa. Nếu null, nút xóa sẽ không hiển thị       |

## Tính năng

### Video Controls (built-in từ media_kit)

- advancement Play/Pause
- Seek (kéo thanh tiến trình)
- Fullscreen toggle
- Speed control (0.5x, 1x, 1.5x, 2x)
- Volume control

### Bottom Action Bar

- **Tải về**: Download video về thiết bị sử dụng `FileHandler`
- **Xóa**: Hiển thị khi `onDelete` được truyền vào

### Authentication

Video được stream với authentication thông qua cookies:

- Tự động lấy cookies từ `cookieManager`
- Truyền cookies qua HTTP headers khi load video

## UI Structure

```
┌─────────────────────────────────┐
│ [X]  Video Title                │  ← Header
├─────────────────────────────────┤
│                                 │
│                                 │
│         Video Player            │  ← Video area với controls
│                                 │
│                                 │
│   advancement advancement advancement ──●────────── ⛶  │  ← Video controls
├─────────────────────────────────┤
│    📥          🗑️              │  ← Bottom action bar
│   Tải về       Xóa              │
└─────────────────────────────────┘
```

## Ví dụ tích hợp với InspectionMediaViewWidget

```dart
// Trong media_view_widget_control.dart
void openMediaGallery({
  required List<File> mediaFiles,
  required int initialIndex,
  required bool isVideo,
  required List<File> remainingMediaFiles,
}) {
  if (isVideo && mediaFiles.isNotEmpty) {
    final videoFile = mediaFiles[initialIndex];

    // Tìm mapping để có thể xóa
    final fileMapping = widget.files.firstWhere(
      (f) => f.file.value.id.value == videoFile.id.value,
    );

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (screenContext) => VideoStreamingScreen(
          videoUrl: videoFile.url.value,
          title: videoFile.name.value,
          onDelete: widget.onDelete != null && !widget.isView
              ? () async {
                  await showDialog<void>(
                    context: screenContext,
                    builder: (_) => ConfirmationDialog(
                      title: 'Xác nhận xóa',
                      child: Text('Bạn có chắc muốn xóa video này?'),
                      onConfirm: () async {
                        await widget.onDelete!(fileMapping);
                        if (screenContext.mounted) {
                          Navigator.of(screenContext).pop();
                        }
                      },
                    ),
                  );
                }
              : null,
        ),
      ),
    );
    return;
  }
  // ... handle images
}
```

## Lưu ý

1. **Immersive Mode**: Màn hình tự động chuyển sang immersive mode khi mở và restore khi đóng
2. **Memory Management**: Player được dispose tự động khi màn hình đóng
3. **Error Handling**: Download errors được hiển thị qua SnackBar
4. **Platform Support**: Hỗ trợ iOS, Android, macOS, Windows, Linux (không hỗ trợ Web)

## Xem thêm

- [media_kit documentation](https://pub.dev/packages/media_kit)
- [MediaGalleryScreen](./media_gallery_screen.md) - Cho xem ảnh
