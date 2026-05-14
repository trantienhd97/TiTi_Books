# supa

Supa application

## Getting Started

### Environment variables

```env
BASE_API_URL=       # Default API Server

SEED_USERNAME=""    # Default development account
SEED_PASSWORD=""    # Default development password

AZURE_TENANT_ID=    # Azure login credentials
AZURE_CLIENT_ID=
AZURE_OBJECT_ID=
AZURE_REDIRECT_URI=https://login.live.com/oauth20_desktop.srf

APP_ID=SUPA
```

### Generate dependencies

```sh
flutter pub get
dart run build_runner build --delete-conflicting-outputs
```

If you are setting up Flutter for the first time, run this:

```ssh
dart pub global activate flutterfire_cli
```

The project requires Flutterfire CLI

## Managing Dependencies

### Monorepo Structure

This project uses a monorepo structure with multiple packages in the `packages/` directory:
- `supa_foundation` - Shared foundation package
- `supa_attendance` - Attendance module
- `supa_bibs` - BIBS module
- `supa_project` - Project module
- `supa_serving` - Serving module
- `supa_spend` - Spend module
- `supa_training` - Training module
- `supa_work` - Work module

### Syncing Dependencies

To maintain consistency across all packages, use the dependency sync script when updating dependencies in the main `pubspec.yaml`:

```sh
./scripts/sync_dependencies.sh
```

**What it does:**
- Synchronizes all dependency versions from the main `pubspec.yaml` to all submodule `pubspec.yaml` files
- Preserves path-based and git-based dependencies
- Skips SDK dependencies (flutter, flutter_test, etc.)
- Shows which dependencies were updated in each module

**When to use:**
- After updating a dependency version in the main `pubspec.yaml`
- Before running `flutter pub get` to ensure all modules use the same versions
- When onboarding new developers to sync their environment

**After running the script:**
1. Review changes with `git diff`
2. Run `flutter pub get` to update dependencies
3. Test the app to ensure everything works

For more details, see [scripts/README.md](scripts/README.md)

## Chuyển đổi giữa các Sub-App khi phát triển

Khi làm việc trên một sub-app cụ thể, bạn có thể cấu hình Dart analyzer để chỉ tập trung vào module đó, giúp cải thiện hiệu suất và giảm nhiễu từ các module khác.

### Sử dụng Script chuyển đổi

Để chuyển analyzer tập trung vào một sub-app cụ thể:

```sh
./scripts/switch_sub_app.sh <module-name>
```

**Ví dụ:**
```sh
./scripts/switch_sub_app.sh supa_spend
./scripts/switch_sub_app.sh supa_work
./scripts/switch_sub_app.sh supa_attendance
```

**Script làm gì:**
- Copy `analysis_options.backup.yaml` sang `analysis_options.yaml`
- Thêm section `analyzer.exclude` để bỏ qua tất cả các package khác
- Luôn giữ thư mục `lib/` được phân tích
- Không bao giờ loại trừ `packages/supa_foundation` (foundation dùng chung)
- Khi chọn `supa_work` hoặc `supa_project`, giữ cả hai được bao gồm (chúng phụ thuộc lẫn nhau)

**Quan trọng:** Sau khi chạy script, bạn **phải khởi động lại** IDE/editor hoặc Dart analysis server để thay đổi có hiệu lực. Analyzer đọc `analysis_options.yaml` khi khởi động, nên thay đổi sẽ không được áp dụng cho đến khi khởi động lại.

**Cách khởi động lại Dart analysis server:**
- Trong VS Code: Mở Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) → "Dart: Restart Analysis Server"
- Trong Android Studio/IntelliJ: File → Invalidate Caches → Restart
- Hoặc đơn giản là khởi động lại IDE

**Các module có sẵn:**
- `supa_attendance` - Module chấm công
- `supa_bibs` - Module BIBS
- `supa_project` - Module dự án
- `supa_serving` - Module phục vụ
- `supa_spend` - Module chi tiêu
- `supa_training` - Module đào tạo
- `supa_work` - Module công việc

## Generate theme color

```sh
./scripts/theme-color lib/theme/json/project*theme.json lib/theme/generated_project_color_scheme.dart
```

## Build và test AAB

```sh
flutter build appbundle --obfuscate --split-debug-info=build/symbols

java -jar ~/Android/bundletool.jar build-apks \
  --bundle=build/app/outputs/bundle/release/app-release.aab \
  --output=app.apks \
  --ks="${KEY_FILE}" \
  --ks-key-alias="${KEY_ALIAS}" \
  --ks-pass=pass:${KEY_PASS} \
  --key-pass=pass:${KEY_PASS} \
  --mode=universal

java -jar ~/Android/bundletool.jar install-apks --apks=app.apks
```

### MacOS Version

Re-use mobile codebase with custom entry point:

To build the app:

Using the following command to build Dart code first:

```sh
flutter build macos --release --target lib/main_chat.dart
```

Then use XCode to archive the app.

### build app 
flutter build apk
# hoặc
flutter build ios
# hoặc
flutter build aab