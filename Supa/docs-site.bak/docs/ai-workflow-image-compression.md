# Hướng Dẫn Kích Hoạt Nén Ảnh (Isolate)

Tài liệu này dùng để AI (Antigravity) hoặc lập trình viên đọc tham khảo và thực thi tự động khi chuyển sang một nhánh (branch) mới cần áp dụng lại cơ chế **Nén Ảnh Bằng Base Dart (Isolate)** (Bỏ qua lỗi văng RAM OutOfMemory từ thư viện).

**Mục tiêu:** Áp dụng xử lý nền (nén ảnh với độ phân giải `1280x1280` và quality `80%`) trên toàn bộ luồng chụp ảnh và tải file của dự án (`supa_foundation`, `supa_project`, `supa_work`).

---

## Các Bước Triển Khai Cho AI

Khi người dùng yêu cầu áp dụng lại tính năng này, AI Antigravity vui lòng **đọc và làm chính xác từng bước sau**:

### BƯỚC 1. Cập Nhật Cấu Hình `ImagePickerService`
**File:** `packages/supa_foundation/lib/services/image_picker_service.dart`
**Hành động:** 
- Đổi `ImagePickerService.maxWidth` thành `1280`
- Đổi `ImagePickerService.maxHeight` thành `1280`
- Đổi `ImagePickerService.imageQuality` thành `80`

### BƯỚC 2. Tạo File Tiện Ích `ImageCompressUtils`
**File:** Tạo file mới tại `packages/supa_foundation/lib/utils/image_compress_utils.dart`
**Hành động:** Viết mã lệnh sau vào file:

```dart
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:image/image.dart' as img;
import 'package:image_picker/image_picker.dart';
import 'package:supa_foundation/services/image_picker_service.dart';

class ImageCompressUtils {
  /// Hàm nén ảnh chạy trên luồng phụ biệt lập để không block màn hình UI
  static Future<XFile> compressImageBackground(String imagePath) async {
    return compute(_resizeImageWorker, imagePath);
  }
}

/// Isolate worker function
XFile _resizeImageWorker(String imagePath) {
  try {
    final bytes = File(imagePath).readAsBytesSync();
    var decoded = img.decodeImage(bytes);
    if (decoded != null) {
      if (decoded.width > ImagePickerService.maxWidth ||
          decoded.height > ImagePickerService.maxHeight) {
        
        int targetWidth = decoded.width;
        int targetHeight = decoded.height;
        final ratio = decoded.width / decoded.height;
        
        if (decoded.width > decoded.height) {
          targetWidth = ImagePickerService.maxWidth.toInt();
          targetHeight = (ImagePickerService.maxWidth / ratio).round();
        } else {
          targetHeight = ImagePickerService.maxHeight.toInt();
          targetWidth = (ImagePickerService.maxHeight * ratio).round();
        }
        
        decoded = img.copyResize(decoded, width: targetWidth, height: targetHeight);
        final resizedBytes = img.encodeJpg(decoded, quality: ImagePickerService.imageQuality);
        File(imagePath).writeAsBytesSync(resizedBytes);
      }
    }
  } catch (e) {
    debugPrint('Error compressing image locally: \$e');
  }
  return XFile(imagePath);
}
```

### BƯỚC 3. Áp Dụng Cho Camera Lõi (`supa_foundation`)
**File:** `packages/supa_foundation/lib/widgets/pages/camera_capture_page_new.dart`
**Hành động:** 
1. Import `package:supa_foundation/utils/image_compress_utils.dart` (Nếu cần).
2. Xóa các parameters `maxWidth`, `maxHeight` và `imageQuality` đang nằm cắm cứng (Hard-code) bên trong đối tượng `MediaOptions`.
3. Trong hàm `Future<XFile> _processImage(XFile originalImage)`, nén ảnh trước khi watermark:
```dart
      final compressedImage = await ImageCompressUtils.compressImageBackground(originalImage.path);
      final processedPath = await MediaPickerPlus.addWatermarkToImage(
        compressedImage.path,
        options: MediaOptions(...
```

### BƯỚC 4. Áp Dụng Cho Camera Project (`supa_project`)
Thực hiện tương tự Bước 3 nhưng trên file của `supa_project`:
- **File 1:** `packages/supa_project/lib/pages/inspection/widgets/camera_capture_page.dart` (Sửa hàm `_processImage`)
- **File 2:** `packages/supa_project/lib/pages/inspection/widgets/abstract_inspection_media_state.dart` (Sửa hàm xử lý hàng loạt `onImagesPicked` và `_applyWatermarkToImages` thay thế việc nén qua `ImageCompressUtils`). Loại bỏ `maxWidth`, `maxHeight`, `imageQuality` thừa ở trong `MediaOptions` nơi gọi watermark (như Bước 3).

### BƯỚC 5. Áp Dụng Cho Thu Thập Dữ Liệu (`supa_work`)
**File:** `packages/supa_work/lib/pages/inspection/widgets/abstract_inspection_media_state.dart`
**Hành động:** Sửa hai vùng (batch upload & watermark) tương tự Bước 4. Lược bỏ `maxWidth` & `imageQuality` trong `MediaOptions` nơi nào áp dụng watermark.

### BƯỚC 6. Áp Dụng Chặn Đính Kèm TaskAssignment (`supa_work`)
File TaskAssignment cho phép người dùng đính kèm file (PDF, MS Word) cho nên hàm upload phải lọc để **CHỈ** truyền isolate nén vào ảnh (`.jpg`, `.jpeg`, `.png`).
**File 1: Tạo Task (Form)** -> `packages/supa_work/lib/pages/task_assignment/service/task_assignment_form_service.dart` 
**File 2: Cập Nhật Task (Utils)** -> `packages/supa_work/lib/pages/task_assignment/utils/task_assignment_edit_selectors.dart`
Sửa đổi hàm `uploadFile()`:
```dart
import 'package:supa_foundation/utils/image_compress_utils.dart'; // [AI hãy nhớ chèn ngay hàng đầu]

Future<List<TaskAssignmentFileMapping>> uploadFile(List<XFile> xfiles) async {
  final List<XFile> compressedImages = [];
  for (var file in xfiles) {
    if (file.path.toLowerCase().endsWith('.png') ||
        file.path.toLowerCase().endsWith('.jpg') ||
        file.path.toLowerCase().endsWith('.jpeg')) {
      compressedImages.add(
          await ImageCompressUtils.compressImageBackground(file.path));
    } else {
      compressedImages.add(file);
    }
  }
  // Đưa compressedImages vào luồng upload
  final listFile = await WorkFileRepository().uploadFilesFromImagePicker(compressedImages);
```

**File 3: Cập nhật Trạng Thái Task (Trạng Thái Bắt Buộc Có Ảnh)** -> `packages/supa_work/lib/pages/task_assignment/task_assignment_edit_page.dart`
Sửa đổi trong `_onUpdateStatus`, vị trí `onSubmit: (note, file)` khi chọn xong trạng thái đính kèm ảnh:
```dart
import 'package:supa_foundation/utils/image_compress_utils.dart';
import 'package:image_picker/image_picker.dart';

// ...
if (file != null) {
  XFile compressedFile = file;
  if (file.path.toLowerCase().endsWith('.png') ||
      file.path.toLowerCase().endsWith('.jpg') ||
      file.path.toLowerCase().endsWith('.jpeg')) {
    compressedFile = await ImageCompressUtils.compressImageBackground(file.path);
  }
  final uploadedFiles = await WorkFileRepository().uploadFilesFromImagePicker([compressedFile]);
// ...
```
