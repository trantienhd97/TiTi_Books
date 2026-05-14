# Chat Core System Rules

Toàn bộ hệ thống Chat GetStream trong ứng dụng phải tuân thủ các quy tắc kiến trúc sau đây để đảm bảo bảo mật và đồng nhất dữ liệu.

---

## 1. Lọc theo Tenant (Tenant Filtering)

Ứng dụng hỗ trợ đa tenant (Multi-tenant), do đó tất cả dữ liệu chat phải được phân tách nghiêm ngặt.

### Yêu cầu:

- **Tất cả truy vấn Channel**: Mọi phương thức `queryChannels`, `watchChannel` phải bao gồm filter `tenantId`.
- **Tất cả truy vấn User**: Khi tìm kiếm hoặc liệt kê người dùng (`searchUsers`, `listGlobalUser`), bắt buộc phải có filter `tenantId`.
- **Nguồn dữ liệu**: Luôn lấy `tenantId` từ `CommunicationChatClientCubit` hoặc trực tiếp từ `AuthenticationBloc`. Không bao giờ sử dụng `tenantId` cứng hoặc bỏ trống.

### Ví dụ implementation:

```dart
// Query channels
final filter = Filter.and([
  Filter.equal('tenantId', currentTenantId),
  // ... các filter khác
]);
client.queryChannels(filter: filter);
```

---

## 2. Tải File Tùy Chỉnh (Custom File Upload)

Để kiểm soát dung lượng và bảo mật file, chúng ta không sử dụng hệ thống CDN mặc định của GetStream. Toàn bộ file phải được tải qua API của Backend.

### 2.1. Các Endpoint Upload:

| Loại nội dung             | Endpoint API                                  | Repository Method      |
| ------------------------- | --------------------------------------------- | ---------------------- |
| **File trong tin nhắn**   | `/rpc/utils-conversation/get-stream/upload-file` | `uploadStreamFile()`   |
| **Ảnh đại diện Channel** | `/rpc/utils-conversation/get-stream/upload-avatar` | `uploadStreamAvatar()` |

> **Lưu ý**: "File trong tin nhắn" bao gồm: Hình ảnh, Video, Tài liệu (.pdf, .doc...) và Tin nhắn thoại (Voice Recording).

### 2.2. Quy trình Implementation:

- **Bước 1**: Tải file lên Backend thông qua Repository tương ứng để lấy URL.
- **Bước 2 (Quan trọng)**: Chuyển đổi URL tương đối từ server thành **URL tuyệt đối** bằng cách nối với `persistentStorage.baseApiUrl` (xem chi tiết tại phần 3.1).
- **Bước 3**: Gán URL tuyệt đối vào tin nhắn hoặc dữ liệu Channel.
- **Bước 4**: Thiết lập `uploadState: UploadState.success()` đối với Attachment để SDK không tự upload lại lên Stream S3.

### Ví dụ implementation:

```dart
// Upload avatar nhóm
final uploadedFile = await repository.uploadStreamAvatar(file);
final relativeUrl = uploadedFile.url.value;
final absoluteUrl = relativeUrl.startsWith('http')
    ? relativeUrl
    : '${persistentStorage.baseApiUrl}$relativeUrl';
await channel.updateImage(absoluteUrl);

// Upload ảnh trong tin nhắn
final uploadedFile = await repository.uploadStreamFile(file);
final relativeUrl = uploadedFile.url.value;
final absoluteUrl = relativeUrl.startsWith('http')
    ? relativeUrl
    : '${persistentStorage.baseApiUrl}$relativeUrl';

final attachment = Attachment(
  type: AttachmentType.image,
  uploadState: const UploadState.success(),
  imageUrl: absoluteUrl,
);
```

---

## 3. Xử lý Upload Nhiều File (Multiple File Upload)

Khi upload nhiều file cùng lúc (ví dụ: chọn nhiều ảnh từ gallery), cần lưu ý các vấn đề sau:

### 3.1. URL Absolute vs Relative

**Vấn đề**: Server trả về relative URL (ví dụ: `/rpc/utils-storage/global-file/download?fileId=xxx`), nhưng `CachedNetworkImage` trong Stream SDK cần absolute URL để hiển thị.

**Giải pháp**: Luôn nối `persistentStorage.baseApiUrl` với relative URL trước khi gán vào `imageUrl`/`assetUrl`.

```dart
import 'package:supa_architecture/supa_architecture.dart' show persistentStorage;

final relativeUrl = uploadedFile.url.value;
final absoluteUrl = relativeUrl.startsWith('http')
    ? relativeUrl
    : '${persistentStorage.baseApiUrl}$relativeUrl';

final attachment = Attachment(
  imageUrl: isImage ? absoluteUrl : null,
  assetUrl: !isImage ? absoluteUrl : null,
  // ...
);
```

### 3.2. AttachmentFile Assertion

**Vấn đề**: `AttachmentFile` constructor có assertion yêu cầu `path != null || bytes != null`. Nếu cả hai đều null, app sẽ crash.

**Giải pháp**: Khi upload nhiều file, luôn đọc `bytes` thay vì dựa vào `path` vì:

- iOS temp file paths có thể invalid sau khi picker đóng
- `bytes` đảm bảo preview hiển thị đúng ngay cả khi local file không còn

```dart
// ✅ Đúng - luôn đọc bytes
final bytes = await selectedFile.readAsBytes();
final attachment = Attachment(
  file: AttachmentFile(
    size: bytes.length,
    bytes: bytes,  // Sử dụng bytes thay vì path
    name: p.basename(selectedFile.path),
  ),
  // ...
);

// ❌ Sai - có thể gây lỗi assertion hoặc preview không hiển thị
final attachment = Attachment(
  file: AttachmentFile(
    size: size,
    path: null,   // Assertion fail nếu bytes cũng null!
    bytes: null,
    name: name,
  ),
);
```

### 3.3. Single vs Multiple File Flow

| Số lượng file            | Flow xử lý                                                          |
| ------------------------ | ------------------------------------------------------------------- |
| 1 ảnh (không phải video) | Mở `ImageEditorLocalScreen` → edit → tạo attachment với `file.path` |
| 1 video hoặc nhiều file  | Upload trực tiếp → tạo attachment với `bytes` + `absoluteUrl`       |

---

## 4. Hiển thị và Tìm kiếm Cuộc hội thoại (Conversation List & Search)

Để đảm bảo danh sách hội thoại gọn gàng nhưng vẫn cho phép tìm kiếm các nhóm mới, chúng ta áp dụng quy tắc lọc tin nhắn khác nhau cho từng màn hình.

### Yêu cầu:

- **Danh sách Hội thoại chính (Conversations List)**:
  - **Lọc**: Bắt buộc lọc theo `Filter.exists('last_message_at')` (phía API) và `.where((c) => c.lastMessageAt != null)` (phía UI). 
  - **Mục đích**: Chỉ hiển thị các cuộc hội thoại đã có nội dung để tránh làm rác màn hình chính bởi các nhóm trống hoặc các chat 1-1 chưa bắt đầu.
- **Tìm kiếm Hội thoại (Conversation Search)**:
  - **Lọc**: KHÔNG lọc theo sự tồn tại của tin nhắn.
  - **Mục đích**: Cho phép người dùng tìm thấy các nhóm vừa mới tạo hoặc các liên hệ chưa từng chat để bắt đầu cuộc hội thoại.
- **Sắp xếp (Sorting)**:
  - Sử dụng kết hợp `last_message_at: DESC` và `updated_at: DESC` để các hội thoại mới (kể cả khi chưa có tin nhắn) xuất hiện ở đầu kết quả gợi ý hoặc tìm kiếm.

---

_Tài liệu này là bắt buộc đối với tất cả các thay đổi liên quan đến module supa_communication._
