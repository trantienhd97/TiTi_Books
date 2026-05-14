# Hướng dẫn Triển khai Ứng dụng

## 1. Tổng quan

Tài liệu này mô tả cách triển khai SupaMobileApp cho các nền tảng khác nhau:
- **Web**: Sử dụng Docker và Nginx
- **iOS/macOS**: Sử dụng Flutter build và Xcode Archive
- **Android**: Sử dụng script build AAB/APK và upload symbols
- **Firebase App Distribution**: Deploy APK lên AppTester

## 2. Triển khai Web (Docker + Nginx)

### 2.1. Build ứng dụng Web

Trước tiên, build ứng dụng Flutter cho web:

```bash
flutter build web --release
```

Output sẽ được tạo trong thư mục `build/web/`.

### 2.2. Dockerfile

File `Dockerfile` sử dụng nginx:alpine image:

```dockerfile
FROM nginx:alpine

EXPOSE 8080

WORKDIR /var/www/html

USER root
RUN chmod -R g+w /var/cache/
RUN chmod -R g+w /var/run/

# Copy built artifacts
COPY ./build/web/ /var/www/html/

# Copy nginx configuration folder
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
```

### 2.3. Nginx Configuration

File `nginx/conf.d/default.conf` cấu hình nginx:

```nginx
server {
    listen 8080;
    server_name _ default_server;

    # Serve iOS web credentials file
    location /.well-known/apple-app-site-association {
        root /var/www/html;
        default_type application/json;
        add_header Content-Type application/json;
        add_header Access-Control-Allow-Origin *;
    }

    # Serve Android Digital Asset Links file
    location /.well-known/assetlinks.json {
        root /var/www/html;
        default_type application/json;
        add_header Content-Type application/json;
        add_header Access-Control-Allow-Origin *;
    }

    location / {
        root /var/www/html;
        index index.html;
        autoindex off;
        try_files $uri $uri/ /index.html;
    }
}
```

**Giải thích:**
- Port 8080: Nginx lắng nghe trên port 8080
- Apple App Site Association: Phục vụ file cho iOS Universal Links
- Android Asset Links: Phục vụ file cho Android App Links
- SPA routing: `try_files` đảm bảo tất cả routes được redirect về `index.html` (cho Flutter web routing)

### 2.4. Build Docker Image

```bash
# Build image
docker build -t supa-web:latest .

# Hoặc với tag version
docker build -t supa-web:v1.0.0 .
```

### 2.5. Chạy Docker Container

```bash
# Chạy container
docker run -d -p 8080:8080 --name supa-web supa-web:latest

# Hoặc với volume mount (nếu cần)
docker run -d -p 8080:8080 -v $(pwd)/build/web:/var/www/html --name supa-web supa-web:latest
```

### 2.6. Kiểm tra

Mở browser và truy cập: `http://localhost:8080`

### 2.7. Deploy lên Production

```bash
# Tag image cho registry
docker tag supa-web:latest your-registry/supa-web:v1.0.0

# Push lên registry
docker push your-registry/supa-web:v1.0.0

# Deploy trên server
docker pull your-registry/supa-web:v1.0.0
docker run -d -p 8080:8080 --name supa-web your-registry/supa-web:v1.0.0
```

## 3. Triển khai iOS

### 3.1. Build ứng dụng

Build ứng dụng Flutter cho iOS ở chế độ release:

```bash
flutter build ios --release
```

**Lưu ý:** 
- Đảm bảo đã cấu hình đúng signing certificates và provisioning profiles
- Kiểm tra `ios/Runner.xcodeproj` có đúng team và bundle identifier

### 3.2. Mở Xcode

```bash
open ios/Runner.xcworkspace
```

**Lưu ý:** Sử dụng `.xcworkspace`, không phải `.xcodeproj`

### 3.3. Archive trong Xcode

1. **Chọn scheme**: Chọn "Runner" từ scheme dropdown
2. **Chọn device**: Chọn "Any iOS Device" (không chọn simulator)
3. **Archive**: 
   - Menu: `Product` → `Archive`
   - Hoặc phím tắt: `Cmd + B` (build) rồi `Product` → `Archive`
4. **Chờ build**: Xcode sẽ build và tạo archive
5. **Organizer**: Sau khi archive xong, Xcode sẽ mở Organizer window

### 3.4. Distribute App

Trong Organizer window:

1. **Chọn archive** vừa tạo
2. **Click "Distribute App"**
3. **Chọn distribution method**:
   - **App Store Connect**: Upload lên App Store
   - **Ad Hoc**: Phân phối cho testers cụ thể
   - **Enterprise**: Phân phối nội bộ (cần Enterprise account)
   - **Development**: Development build
4. **Chọn options**: 
   - Upload symbols (nếu có)
   - Include bitcode (thường là NO cho Flutter)
5. **Review và upload**

### 3.5. Upload lên TestFlight

1. Sau khi upload thành công, vào [App Store Connect](https://appstoreconnect.apple.com)
2. Chọn app → TestFlight tab
3. Chờ processing (thường 10-30 phút)
4. Thêm testers và groups
5. Submit for review (nếu cần)

### 3.6. Lưu ý

- **Version và Build Number**: Đảm bảo version và build number đã được update trong `pubspec.yaml`
- **Signing**: Kiểm tra signing trong Xcode project settings
- **Capabilities**: Kiểm tra các capabilities cần thiết (Push Notifications, Background Modes, etc.)
- **Info.plist**: Kiểm tra các permissions và settings trong `Info.plist`

## 4. Triển khai macOS

### 4.1. Mục đích

Bản macOS chủ yếu dùng cho **admin chạy trên macOS để reset mật khẩu cho user khi cần**.

### 4.2. Build ứng dụng

Build ứng dụng Flutter cho macOS ở chế độ release:

```bash
flutter build macos --release
```

### 4.3. Archive trong Xcode

1. **Mở Xcode**:
   ```bash
   open macos/Runner.xcworkspace
   ```

2. **Chọn scheme**: Chọn "Runner" từ scheme dropdown

3. **Chọn "My Mac"** làm destination

4. **Archive**:
   - Menu: `Product` → `Archive`
   - Chờ build và archive hoàn tất

5. **Distribute App**:
   - Trong Organizer, chọn archive vừa tạo
   - Click "Distribute App"
   - Chọn distribution method phù hợp:
     - **Developer ID**: Để phân phối bên ngoài App Store (khuyến nghị)
     - **Mac App Store**: Để upload lên Mac App Store
     - **Direct Distribution**: Phân phối trực tiếp

### 4.4. Export .app hoặc .dmg

Sau khi distribute, bạn có thể:
- Export `.app` bundle
- Tạo `.dmg` file để phân phối dễ dàng hơn

### 4.5. Lưu ý

- **Notarization**: Nếu distribute bên ngoài App Store, cần notarize app với Apple
- **Gatekeeper**: User có thể cần allow app trong System Preferences → Security & Privacy
- **Permissions**: Đảm bảo các permissions cần thiết đã được khai báo trong entitlements

## 5. Triển khai Android

### 5.1. Script Build

Sử dụng script `scripts/release-android` để build AAB hoặc APK:

```bash
# Build AAB (App Bundle) - khuyến nghị cho Play Store
./scripts/release-android appbundle

# Build APK
./scripts/release-android apk
```

### 5.2. Script làm gì?

Script `scripts/release-android`:

1. **Build ứng dụng** với obfuscation và split debug info:
   ```bash
   flutter build "$1" --obfuscate --split-debug-info=build/symbols --release
   ```

2. **Tạo symbols cho các architectures**:
   - `arm64-v8a` (64-bit ARM)
   - `armeabi-v7a` (32-bit ARM)
   - `x86_64` (64-bit x86)

3. **Tạo file `symbols-upload.zip`**:
   - Package tất cả symbols vào một file zip
   - File này cần upload lên Play Store để track lỗi tốt hơn

### 5.3. Output Files

Sau khi chạy script:

**AAB (App Bundle):**
- `build/app/outputs/bundle/release/app-release.aab`

**APK:**
- `build/app/outputs/flutter-apk/app-release.apk`

**Symbols:**
- `build/symbols/` - Thư mục chứa symbols files
- `symbols-upload.zip` - File zip chứa tất cả symbols, sẵn sàng upload

### 5.4. Upload lên Google Play Store

1. **Đăng nhập** vào [Google Play Console](https://play.google.com/console)

2. **Chọn app** và version cần upload

3. **Upload AAB**:
   - Vào "Production" hoặc "Internal testing" → "Create new release"
   - Upload file `app-release.aab`

4. **Upload Symbols** (quan trọng):
   - Trong "App bundle explorer" hoặc "Release" page
   - Tìm section "Android App Bundle and APK to deobfuscate"
   - Upload file `symbols-upload.zip`
   - **Lý do**: Symbols giúp Google Play Console và Firebase Crashlytics deobfuscate crash reports, giúp debug lỗi trên production dễ dàng hơn

5. **Review và publish**

### 5.5. Tại sao cần Symbols?

- **Obfuscation**: Code đã được obfuscate để bảo vệ source code
- **Crash Reports**: Khi app crash trên production, stack traces sẽ bị obfuscate
- **Deobfuscation**: Symbols file giúp convert stack traces obfuscated về readable format
- **Debugging**: Giúp developers xác định chính xác dòng code gây lỗi

### 5.6. Lưu ý

- **Keystore**: Đảm bảo đã cấu hình đúng keystore file và password
- **Version Code**: Tăng version code trong `pubspec.yaml` hoặc `android/app/build.gradle`
- **Signing**: AAB/APK phải được sign với release keystore
- **Permissions**: Kiểm tra các permissions trong `AndroidManifest.xml`

## 6. Firebase App Distribution (AppTester)

### 6.1. Mục đích

Firebase App Distribution tương tự TestFlight của Apple, cho phép distribute APK cho testers trước khi release lên Play Store.

### 6.2. Script Deploy

Sử dụng script `scripts/firebase-publish`:

```bash
./scripts/firebase-publish
```

### 6.3. Script làm gì?

Script `scripts/firebase-publish`:

1. **Tìm APK file**:
   - Ưu tiên: `android/app/release/app-universal-release.apk`
   - Fallback: `build/app/outputs/flutter-apk/app-release.apk`

2. **Upload lên Firebase App Distribution**:
   ```bash
   firebase appdistribution:distribute \
     "$APK_PATH" \
     --app "1:826136080579:android:846f14f42c4b772bcfb276" \
     --groups supa \
     --release-notes-file RELEASE_NOTES.md
   ```

### 6.4. Prerequisites

1. **Firebase CLI**: Cài đặt Firebase CLI
   ```bash
   npm install -g firebase-tools
   ```

2. **Login Firebase**:
   ```bash
   firebase login
   ```

3. **File RELEASE_NOTES.md**: Tạo file `RELEASE_NOTES.md` ở root project với nội dung release notes

### 6.5. RELEASE_NOTES.md

Tạo file `RELEASE_NOTES.md` với nội dung:

```markdown
# Release Notes - v1.0.0

## New Features
- Feature 1
- Feature 2

## Bug Fixes
- Fix 1
- Fix 2

## Improvements
- Improvement 1
```

### 6.6. Firebase Groups

Script sử dụng group `supa`. Đảm bảo:
- Group đã được tạo trong Firebase Console
- Testers đã được thêm vào group

**Cách tạo group:**
1. Vào [Firebase Console](https://console.firebase.google.com)
2. Chọn project
3. Vào "App Distribution" → "Testers & Groups"
4. Tạo group "supa" và thêm testers

### 6.7. Testers nhận APK

Sau khi upload thành công:
1. Testers sẽ nhận email từ Firebase
2. Click link trong email để download APK
3. Install APK trên device Android

### 6.8. Lưu ý

- **APK phải được build trước**: Chạy `./scripts/release-android apk` trước khi deploy
- **Release notes**: Cập nhật `RELEASE_NOTES.md` trước mỗi lần deploy
- **Firebase project**: Đảm bảo đã cấu hình đúng Firebase project ID

## 7. Quy trình Triển khai Hoàn chỉnh

### 7.1. Pre-release Checklist

- [ ] Update version và build number trong `pubspec.yaml`
- [ ] Update `RELEASE_NOTES.md` (nếu dùng Firebase)
- [ ] Test app trên các platforms
- [ ] Kiểm tra signing certificates và keystores
- [ ] Review permissions và capabilities
- [ ] Test notifications và deep links

### 7.2. Build và Deploy

**Android:**
```bash
# 1. Build AAB và symbols
./scripts/release-android appbundle

# 2. Upload AAB lên Play Store
# 3. Upload symbols-upload.zip lên Play Store

# 4. (Optional) Deploy lên Firebase App Distribution
./scripts/firebase-publish
```

**iOS:**
```bash
# 1. Build
flutter build ios --release

# 2. Mở Xcode và Archive
open ios/Runner.xcworkspace
# Product → Archive

# 3. Distribute qua Xcode Organizer
```

**macOS:**
```bash
# 1. Build
flutter build macos --release

# 2. Mở Xcode và Archive
open macos/Runner.xcworkspace
# Product → Archive

# 3. Distribute qua Xcode Organizer
```

**Web:**
```bash
# 1. Build
flutter build web --release

# 2. Build Docker image
docker build -t supa-web:latest .

# 3. Deploy container
docker run -d -p 8080:8080 supa-web:latest
```

### 7.3. Post-release

- [ ] Monitor crash reports (Firebase Crashlytics)
- [ ] Check analytics (Firebase Analytics)
- [ ] Review user feedback
- [ ] Plan hotfix nếu cần

## 8. Troubleshooting

### 8.1. Android Build Issues

**Lỗi: "Keystore not found"**
- Kiểm tra keystore file path trong `android/key.properties`
- Đảm bảo keystore file tồn tại

**Lỗi: "Signing config not found"**
- Kiểm tra `android/app/build.gradle` có reference đúng signing config

**Lỗi: "Version code already used"**
- Tăng version code trong `pubspec.yaml` hoặc `android/app/build.gradle`

### 8.2. iOS Build Issues

**Lỗi: "No signing certificate"**
- Kiểm tra Xcode → Preferences → Accounts
- Download certificates và provisioning profiles

**Lỗi: "Provisioning profile mismatch"**
- Kiểm tra bundle identifier và team trong Xcode
- Update provisioning profile

**Lỗi: "Archive failed"**
- Đảm bảo đã chọn "Any iOS Device" (không phải simulator)
- Clean build folder: `Product` → `Clean Build Folder`

### 8.3. Web Build Issues

**Lỗi: "Docker build failed"**
- Kiểm tra `build/web/` có tồn tại không
- Đảm bảo đã chạy `flutter build web --release` trước

**Lỗi: "Nginx not serving files"**
- Kiểm tra nginx config file
- Kiểm tra file permissions trong container

### 8.4. Firebase Distribution Issues

**Lỗi: "APK not found"**
- Đảm bảo đã build APK trước: `./scripts/release-android apk`
- Kiểm tra APK path trong script

**Lỗi: "Firebase not authenticated"**
- Chạy `firebase login` để authenticate
- Kiểm tra Firebase project ID

## 9. Best Practices

### 9.1. Version Management

- **Semantic Versioning**: Sử dụng format `MAJOR.MINOR.PATCH` (ví dụ: `1.2.3`)
- **Build Number**: Tăng build number mỗi lần build
- **Changelog**: Giữ changelog chi tiết cho mỗi version

### 9.2. Security

- **Obfuscation**: Luôn enable obfuscation cho Android release builds
- **Signing**: Không commit keystore files vào git
- **Environment Variables**: Sử dụng environment variables cho sensitive data

### 9.3. Testing

- **Internal Testing**: Test trên internal testing tracks trước
- **Beta Testing**: Sử dụng TestFlight và Firebase App Distribution
- **Staging**: Có staging environment để test trước production

### 9.4. Monitoring

- **Crash Reporting**: Sử dụng Firebase Crashlytics
- **Analytics**: Track user behavior với Firebase Analytics
- **Performance**: Monitor app performance metrics

### 9.5. Documentation

- **Release Notes**: Viết release notes chi tiết
- **Changelog**: Maintain changelog file
- **Migration Guides**: Cung cấp migration guides cho breaking changes

## 10. Tóm tắt

1. **Web**: Build → Docker image → Deploy container với Nginx
2. **iOS**: Build → Xcode Archive → Distribute qua Organizer
3. **macOS**: Build → Xcode Archive → Distribute (chủ yếu cho admin tools)
4. **Android**: Script build AAB/APK + symbols → Upload lên Play Store
5. **Firebase**: Script deploy APK lên App Distribution cho testers

---

**Lưu ý quan trọng:**
- Luôn test trên staging/internal testing trước production
- Upload symbols file lên Play Store để track lỗi tốt hơn
- Maintain release notes và changelog
- Monitor crash reports và analytics sau mỗi release
