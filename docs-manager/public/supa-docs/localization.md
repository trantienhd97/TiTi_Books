# Localization

Dự án này sử dụng `supa_l10n_manager` cho localization. Quy trình làm việc là "code-first", nghĩa là bạn định nghĩa translation keys trong code, sau đó extract chúng ra các file JSON.

## Cách sử dụng

### 1. Thêm Translation Keys

Import `supa_l10n_manager` và sử dụng function `translate` trong code Dart của bạn:

```dart
import 'package:supa_l10n_manager/supa_l10n_manager.dart';

// ...

Text(translate('serving.home.title'))
```

Định dạng key là `namespace.feature.key` (ví dụ: `serving.home.title`). Phần đầu tiên của key (`serving`) xác định tên file partial (`serving.json`).

### 2. Extract Keys

Chạy script extraction để quét code và cập nhật các file JSON trong `assets/i18n/`:

```bash
./scripts/locale-extract
```

Script này chạy `dart run supa_l10n_manager extract --locale <lang>` cho tất cả các locale được hỗ trợ (`en`, `vi`, `id`, `ko`).
Nó sẽ tạo hoặc cập nhật các file như `assets/i18n/en/serving.json` với các keys mới.

### 3. Dịch

Mở các file JSON đã được tạo/cập nhật trong `assets/i18n/<lang>/` và thêm các bản dịch.

Ví dụ `assets/i18n/en/serving.json`:
```json
{
  "home": {
    "title": "Serving Home"
  }
}
```

### 4. Merge

Sau khi dịch, chạy script merge để merge các file partial vào các file translation chính:

```bash
./scripts/locale-merge
```

Điều này merge các file JSON partial vào các file JSON master được sử dụng bởi ứng dụng.

## Cấu trúc thư mục

- `assets/i18n/`: Chứa các file translation.
    - `<lang>/`: Các thư mục con cho mỗi ngôn ngữ (ví dụ: `en`, `vi`).
        - `<namespace>.json`: Các file translation partial (ví dụ: `serving.json`).
- `scripts/`: Các script hỗ trợ.
    - `locale-extract`: Extract keys từ code.
    - `locale-merge`: Merge các bản dịch.

## Shared Translations & Sub-modules

Dự án được cấu trúc thành nhiều sub-modules độc lập (packages). Tuy nhiên, do legacy code, một số translations được chia sẻ giữa các modules này.

- **Module-specific translations**: Keys bắt đầu bằng tên module (ví dụ: `serving.title` -> `serving.json`) nên được sử dụng cho nội dung cụ thể của module.
- **Shared translations**: Các keys chung (ví dụ: `general.save`, `user.name`) được lưu trong các file chia sẻ như `general.json` và `user.json`. Chúng có thể truy cập và được sử dụng bởi nhiều sub-modules.

Khi làm việc trên một module cụ thể, hãy cố gắng giữ translations trong namespace của module đó trừ khi đó là một thuật ngữ thực sự generic được sử dụng ở mọi nơi.

## Dependencies

- `supa_l10n_manager`: Cung cấp function `translate` và các công cụ CLI cho extraction và merging.
