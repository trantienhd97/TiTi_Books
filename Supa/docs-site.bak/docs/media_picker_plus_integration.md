# media_picker_plus Integration Guide

## Overview

`media_picker_plus` is a comprehensive Flutter plugin for media selection and processing with advanced features including timestamp watermarking, resizing, cropping, and quality control.

**Current Version:** 0.2.0+4

## Key Features

- ✅ Pick/capture images and videos from gallery or camera
- ✅ Multiple file selection support
- ✅ Interactive image cropping (square, circle, freeform, etc.)
- ✅ Image resizing with aspect ratio preservation
- ✅ **Customizable watermarking with 9 position options** (Perfect for timestamps!)
- ✅ Quality control for media files
- ✅ FFmpeg integration for video processing
- ✅ Smart permission handling
- ✅ Cross-platform: Android, iOS, Web, macOS

## Platform Support Matrix

| Feature | Android | iOS | Web | macOS |
|---------|---------|-----|-----|-------|
| Pick/Capture Image | ✅ | ✅ | ✅ | ✅ |
| Crop Image | ✅ | ✅ | ✅ | ✅ |
| Pick/Capture Video | ✅ | ✅ | ✅ | ✅ |
| Watermark Video | ❌ | ✅ | ✅ | ✅ |

## Installation

### 1. Add Dependency

Add to `pubspec.yaml`:
```yaml
dependencies:
  media_picker_plus: ^0.2.0+4
```

Or via command:
```bash
flutter pub add media_picker_plus
```

### 2. Platform Configuration

#### Android (API 21+)

Add permissions to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<!-- For API 33+ use granular permissions -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
```

Configure FileProvider in `AndroidManifest.xml`:
```xml
<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="${applicationId}.fileprovider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/file_paths" />
</provider>
```

Create `android/app/src/main/res/xml/file_paths.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<paths>
    <external-path name="external_files" path="." />
    <cache-path name="cache" path="." />
</paths>
```

#### iOS (11.0+)

Add privacy descriptions to `Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select images</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access to record videos</string>
```

Set minimum deployment target in `ios/Podfile`:
```ruby
platform :ios, '11.0'
```

#### macOS (11.0+)

Add privacy descriptions to `macos/Runner/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture photos</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access to record videos</string>
```

Configure entitlements in `macos/Runner/DebugProfile.entitlements` and `Release.entitlements`:
```xml
<key>com.apple.security.device.camera</key>
<true/>
<key>com.apple.security.device.audio-input</key>
<true/>
```

## Usage Examples

### Basic Image Capture with Timestamp

```dart
import 'package:media_picker_plus/media_picker_plus.dart';
import 'package:intl/intl.dart';

Future<String?> capturePhotoWithTimestamp(BuildContext context) async {
  final timestamp = DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now());

  final String? imagePath = await MediaPickerPlus.capturePhoto(
    context: context,
    options: MediaOptions(
      imageQuality: 85,
      watermark: timestamp,
      watermarkPosition: WatermarkPosition.bottomRight,
    ),
  );

  return imagePath;
}
```

### Pick Image from Gallery with Timestamp

```dart
Future<String?> pickImageWithTimestamp(BuildContext context) async {
  final timestamp = DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now());

  final String? imagePath = await MediaPickerPlus.pickImage(
    context: context,
    options: MediaOptions(
      imageQuality: 85,
      maxWidth: 1920,
      maxHeight: 1080,
      watermark: timestamp,
      watermarkPosition: WatermarkPosition.bottomRight,
    ),
  );

  return imagePath;
}
```

### Advanced Options

```dart
final String? imagePath = await MediaPickerPlus.capturePhoto(
  context: context,
  options: MediaOptions(
    // Image quality (0-100)
    imageQuality: 90,

    // Resize constraints
    maxWidth: 1920,
    maxHeight: 1080,

    // Timestamp watermark
    watermark: 'Custom Text or Timestamp',
    watermarkPosition: WatermarkPosition.bottomRight,

    // Enable cropping
    cropOptions: CropOptions.square, // or CropOptions.circle, CropOptions.free
  ),
);
```

### Watermark Positions

The package supports 9 watermark positions:
- `WatermarkPosition.topLeft`
- `WatermarkPosition.topCenter`
- `WatermarkPosition.topRight`
- `WatermarkPosition.centerLeft`
- `WatermarkPosition.center`
- `WatermarkPosition.centerRight`
- `WatermarkPosition.bottomLeft`
- `WatermarkPosition.bottomCenter`
- `WatermarkPosition.bottomRight`

### Standalone Watermarking

The plugin provides dedicated methods to add watermarks to existing media files without going through the media picker workflow. These methods are perfect for post-processing or batch operations on your existing media library.

#### Add Watermark to Existing Image

```dart
// Add watermark to an existing image file
final String? watermarkedImagePath = await MediaPickerPlus.addWatermarkToImage(
  '/path/to/your/image.jpg',
  options: const MediaOptions(
    watermark: '© MyApp 2025',
    watermarkPosition: WatermarkPosition.bottomRight,
    watermarkFontSize: 32,
    imageQuality: 90, // Output quality
  ),
);

if (watermarkedImagePath != null) {
  // Use the watermarked image
  File watermarkedFile = File(watermarkedImagePath);
}
```

#### Add Watermark to Existing Video

```dart
// Add watermark to an existing video file
final String? watermarkedVideoPath = await MediaPickerPlus.addWatermarkToVideo(
  '/path/to/your/video.mp4',
  options: const MediaOptions(
    watermark: '🎬 MyApp Productions',
    watermarkPosition: WatermarkPosition.topLeft,
    watermarkFontSize: 28,
  ),
);

if (watermarkedVideoPath != null) {
  // Use the watermarked video
  File watermarkedFile = File(watermarkedVideoPath);
}
```

#### Batch Watermarking Example

```dart
// Process multiple images with the same watermark
Future<List<String>> batchWatermarkImages(List<String> imagePaths) async {
  final List<String> watermarkedPaths = [];
  
  const watermarkOptions = MediaOptions(
    watermark: 'Batch Processed ${DateTime.now().year}',
    watermarkPosition: WatermarkPosition.bottomCenter,
    watermarkFontSize: 24,
    imageQuality: 85,
  );
  
  for (final imagePath in imagePaths) {
    try {
      final watermarkedPath = await MediaPickerPlus.addWatermarkToImage(
        imagePath,
        options: watermarkOptions,
      );
      if (watermarkedPath != null) {
        watermarkedPaths.add(watermarkedPath);
      }
    } catch (e) {
      print('Failed to watermark $imagePath: $e');
    }
  }
  
  return watermarkedPaths;
}
```

#### Platform Support for Standalone Watermarking

| Feature | Android | iOS | macOS | Web |
|---------|:-------:|:---:|:-----:|:---:|
| **Image Watermarking** | ✅ | ✅ | ✅ | ✅ |
| **Video Watermarking** | ✅ | ✅ | ✅ | ✅* |

*Web video watermarking requires FFmpeg.js to be included in your project.

#### Error Handling for Watermarking

```dart
try {
  final watermarkedPath = await MediaPickerPlus.addWatermarkToImage(
    '/path/to/image.jpg',
    options: const MediaOptions(
      watermark: 'Test Watermark',
      watermarkPosition: WatermarkPosition.bottomRight,
    ),
  );
  
  if (watermarkedPath != null) {
    // Success - use the watermarked file
    print('Watermarked image saved to: $watermarkedPath');
  }
} catch (e) {
  // Handle specific errors
  if (e.toString().contains('file does not exist')) {
    print('Source file not found');
  } else if (e.toString().contains('watermark text is required')) {
    print('Please provide watermark text');
  } else {
    print('Watermarking failed: $e');
  }
}
```

### Video Capture with Timestamp

```dart
Future<String?> captureVideoWithTimestamp() async {
  final timestamp = DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now());

  final String? videoPath = await MediaPickerPlus.captureVideo(
    options: MediaOptions(
      maxDuration: Duration(minutes: 5),
      watermark: timestamp,
      watermarkPosition: WatermarkPosition.topRight,
    ),
  );

  return videoPath;
}
```

### Permission Handling

```dart
// Check camera permission
bool hasCameraPermission = await MediaPickerPlus.hasCameraPermission();

// Request camera permission
if (!hasCameraPermission) {
  await MediaPickerPlus.requestCameraPermission();
}

// Check gallery permission
bool hasGalleryPermission = await MediaPickerPlus.hasGalleryPermission();

// Request gallery permission
if (!hasGalleryPermission) {
  await MediaPickerPlus.requestGalleryPermission();
}
```

## Integration with Existing Camera Widgets

### Replacing simple_camera_capture_page.dart

Instead of using the custom camera implementation, you can replace it with:

```dart
import 'package:media_picker_plus/media_picker_plus.dart';
import 'package:intl/intl.dart';

Future<XFile?> navigateToSimpleCameraCapturePage(
  BuildContext context, {
  CameraLensDirection initialLens = CameraLensDirection.back,
  bool fullscreenDialog = false,
  bool includeTimestamp = true,
}) async {
  final timestamp = includeTimestamp
      ? DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now())
      : null;

  final String? imagePath = await MediaPickerPlus.capturePhoto(
    context: context,
    options: MediaOptions(
      imageQuality: 85,
      watermark: timestamp,
      watermarkPosition: WatermarkPosition.bottomRight,
    ),
  );

  return imagePath != null ? XFile(imagePath) : null;
}
```

## Best Practices

### 1. Timestamp Formatting

Use consistent timestamp formats across the app:

```dart
// Recommended formats
final timestampDateTime = DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now());
final timestampDate = DateFormat('yyyy-MM-dd').format(DateTime.now());
final timestampFull = DateFormat('yyyy-MM-dd HH:mm:ss.SSS').format(DateTime.now());
```

### 2. Image Quality Settings

- **High quality** (90-100): For important documentation
- **Medium quality** (70-85): For general use
- **Low quality** (50-70): For previews or bandwidth-constrained scenarios

### 3. Error Handling

```dart
try {
  final imagePath = await MediaPickerPlus.capturePhoto(
    context: context,
    options: MediaOptions(
      imageQuality: 85,
      watermark: DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now()),
    ),
  );

  if (imagePath == null) {
    // User cancelled
    return;
  }

  // Process the image
} catch (e) {
  // Handle error
  debugPrint('Error capturing photo: $e');
}
```

### 4. Resource Management

The package handles file cleanup automatically, but ensure proper error handling to avoid orphaned files.

## Limitations

1. **Video watermarking not supported on Android** - Only images can be watermarked on Android
2. **Web camera access requires HTTPS** in production
3. **Minimum platform versions:**
   - Android: API 21+
   - iOS: 11.0+
   - macOS: 11.0+

## Migration Guide

### From camera package to media_picker_plus

**Before:**
```dart
final XFile photo = await controller.takePicture();
```

**After:**
```dart
final String? photo = await MediaPickerPlus.capturePhoto(
  context: context,
  options: MediaOptions(
    imageQuality: 85,
    watermark: DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now()),
  ),
);
```

## Troubleshooting

### Camera permission denied on Android

Ensure all permissions are properly declared in `AndroidManifest.xml` and request them at runtime.

### Image quality issues

Adjust `imageQuality` parameter and `maxWidth`/`maxHeight` constraints based on your requirements.

### Watermark not visible

- Check watermark text color contrasts with image background
- Try different `WatermarkPosition` values
- Ensure watermark text is not empty

## Additional Resources

- [Package on pub.dev](https://pub.dev/packages/media_picker_plus)
- [GitHub Repository](https://github.com/example/media_picker_plus) *(Check pub.dev for actual link)*
- [API Documentation](https://pub.dev/documentation/media_picker_plus/latest/)

## License

MIT License - See package documentation for details.

---

**Last Updated:** 2025-12-23
**Package Version:** 0.2.0+4
