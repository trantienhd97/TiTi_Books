# Android 16KB Page Size Support

## 🎯 Status: CONFIGURED & READY

Starting with Android 15, Google is introducing support for devices with 16KB memory page sizes (up from the traditional 4KB). Beginning **November 1, 2025**, all new apps and updates targeting Android 15+ on Google Play must be compatible with 16KB page sizes on 64-bit devices.

---

## 📊 Quick Configuration Status

| Component       | Requirement | Your Config         | Status |
| --------------- | ----------- | ------------------- | ------ |
| **AGP**         | >= 8.5.1    | 8.9.1               | ✅      |
| **NDK**         | >= r28      | 28.2.13676358 (r28) | ✅      |
| **Target SDK**  | >= 35       | 36                  | ✅      |
| **64-bit ABIs** | Required    | arm64-v8a, x86_64   | ✅      |

---

## 🚀 Benefits

- 🚀 **Faster app launches**
- 🔋 **Reduced power consumption**
- 📸 **Quicker camera starts**
- ⚡ **Better overall performance**
- ✅ **Google Play requirement for Android 15+ apps**
- 📱 **Required for newer devices (Pixel 8, etc.)**

---

## ⚙️ Configuration Details

This project has been configured for 16KB page size support with the following changes:

### 1. ✅ Android Gradle Plugin (AGP)
- **Version**: 8.9.1 (>= 8.5.1 required)
- **Location**: `android/settings.gradle` (line 21)
- **Status**: Already compatible, no changes needed
- **Benefit**: Automatically handles 16KB alignment for uncompressed shared libraries

### 2. ✅ NDK Version
- **Version**: 28.2.13676358 (NDK r28)
- **Locations**: 
  - `android/app/build.gradle` (line 34)
  - `android/gradle.properties` (line 10)
- **Change**: Updated from NDK r27 to r28 in gradle.properties
- **Benefit**: Compiles native code with 16KB alignment by default

### 3. ✅ ABI Filters
- **Location**: `android/app/build.gradle` (lines 57-64)
- **Configuration**: 64-bit only for SDK 35+
- **Code**:
```gradle
// 16KB page size support for Android 15+
// Required for Google Play starting November 2025
if (targetSdk >= 35) {
    ndk {
        // Specify ABIs for 64-bit architectures (required for 16KB support)
        abiFilters 'arm64-v8a', 'x86_64'
    }
}
```
- **Why**: Ensures only 64-bit architectures are built for SDK 35+, which is required for 16KB support

### 4. ✅ Native Library Handling
- **Property**: `android.bundle.enableUncompressedNativeLibs=true`
- **Location**: `android/gradle.properties` (line 14)
- **Code**:
```properties
# Enable uncompressed native libs for better 16KB page alignment
# This is handled automatically by AGP 8.5.1+ but can be explicitly set
android.bundle.enableUncompressedNativeLibs=true
```
- **Benefit**: Optimizes native library packaging for 16KB alignment

### 5. ✅ Target SDK
- **Version**: 36 (Android 15+)
- **Location**: `android/app/build.gradle` (line 51)
- **Status**: Already compatible, no changes needed

### 6. ✅ Compile SDK
- **Version**: 36
- **Location**: `android/app/build.gradle` (line 33)
- **Status**: Already compatible, no changes needed

---

## 📂 Modified Files

The following files were created or modified for 16KB support:

1. ✅ `android/app/build.gradle` - Added ABI filters for SDK 35+
2. ✅ `android/gradle.properties` - Updated NDK to r28, enabled uncompressed libs
3. ✅ `docs/android-16kb-support.md` - Comprehensive documentation (this file)
4. ✅ `scripts/verify_16kb_support.sh` - Automated verification script

---

## 🧪 Verification & Testing

### Quick Test

```bash
# Run automated verification script
./scripts/verify_16kb_support.sh

# Or manually build
flutter build appbundle --release
```

### Automated Verification Script

The verification script (`./scripts/verify_16kb_support.sh`) will:
1. ✅ Check your AGP version (8.9.1)
2. ✅ Check your NDK version (28.2.13676358)
3. ✅ Check your target SDK (36)
4. ✅ Build an app bundle
5. ✅ Verify 16KB alignment (if zipalign is available)

### Manual Verification Steps

#### 1. Build App Bundle

```bash
# Development build
flutter build apk --debug

# Release build (recommended to test 16KB)
flutter build appbundle --release
```

#### 2. Verify Alignment (requires Android SDK build-tools)

```bash
zipalign -c -P 16 -v 4 build/app/outputs/bundle/release/app-release.aab
```

#### 3. Test on Emulator

1. Open Android Studio SDK Manager
2. Download Android 15 system image with 16KB support
3. Create an emulator with the 16KB image
4. Run: `flutter run --release`
5. Verify with: `adb shell getconf PAGE_SIZE` (should show `16384`)

#### 4. Test on Physical Device

**Compatible devices**: Pixel 8, 8a, 8 Pro (Android 15 QPR1+)

1. Enable Developer Options
2. Enable 16KB memory mode
3. Reboot device
4. Verify page size: `adb shell getconf PAGE_SIZE` (should return `16384`)
5. Test all app features thoroughly

### Google Play Console Check

1. Upload your app bundle to Google Play Console
2. Navigate to **Test and release** section
3. Check the 16KB page size compatibility status
4. Follow any recommendations provided

---

## ✅ Testing Checklist

- [ ] Build passes: `flutter build appbundle --release`
- [ ] Test on Android 15 emulator (16KB image)
- [ ] Test on Pixel 8 device with 16KB mode enabled
- [ ] All app features work correctly
- [ ] Native libraries are properly aligned
- [ ] Google Play Console shows "16KB compatible"
- [ ] Performance is as expected or improved

---

## 💡 Important Notes

### Page Size Agnostic Code

If your app uses native code (C/C++), ensure:
- ❌ Don't hardcode `PAGE_SIZE` as 4096
- ✅ Use system calls to get page size dynamically
- ✅ Make code work on both 4KB and 16KB systems

### Dependencies

Ensure all third-party SDKs and plugins are updated to their latest versions for 16KB compatibility. Check each dependency's release notes.

### Tips

1. **Always test on 16KB before releasing**
2. **Update all dependencies regularly**
3. **Check Google Play Console after upload**
4. **Keep AGP and NDK versions updated**

---

## ⚠️ Troubleshooting

### Build Failures

If you encounter build issues:

```bash
flutter clean
cd android && ./gradlew clean && cd ..
flutter pub get
flutter build appbundle
```

Or more thorough cleanup:
```bash
rm -rf android/build android/app/build
flutter clean
flutter pub get
flutter build appbundle
```

### Alignment Issues

If zipalign verification fails:
1. Ensure AGP version is 8.5.1+
2. Verify NDK version is r28+
3. Check that `android.bundle.enableUncompressedNativeLibs=true` is set
4. Clean and rebuild

### Runtime Crashes on 16KB Devices

If your app crashes on 16KB devices:
1. Check logcat for memory alignment errors
2. Review native code for hardcoded page sizes (should use `PAGE_SIZE` constant)
3. Update all native plugins to latest versions
4. Check for plugins that may not support 16KB pages
5. Review dependency compatibility

---

## 📚 Resources

- [Official Android 16KB Page Support Guide](https://developer.android.com/guide/practices/page-sizes)
- [Google Play Requirements](https://support.google.com/googleplay/android-developer/answer/13840309)
- [Android Developers Blog](https://android-developers.googleblog.com/2024/12/16kb-page-size-support-in-android.html)
- [Testing on 16KB Devices](https://developer.android.com/guide/practices/page-sizes#test-16kb)

---

## 🚨 Important Dates & Timeline

- **December 25, 2024**: Configuration completed ✅
- **Now - November 2025**: Test your app on 16KB devices/emulators
- **November 1, 2025**: Google Play requirement goes into effect for all new apps and updates targeting Android 15+
- **Future**: More devices with 16KB pages will be released

---

## 📋 Configuration Changes Summary

### What was already compatible:
- ✅ AGP 8.9.1 (well above 8.5.1 requirement)
- ✅ NDK r28 in build.gradle
- ✅ Target SDK 36 (Android 15+)
- ✅ Compile SDK 36

### What we added:
- ✅ Updated NDK version in gradle.properties to r28 (from r27)
- ✅ Added 64-bit ABI filter for SDK 35+ builds
- ✅ Added uncompressed native libs flag
- ✅ Created automated verification script
- ✅ Created comprehensive documentation

### Result:
- ✅ **Fully configured for 16KB page size support**
- ✅ **Compliant with Google Play requirements (November 2025)**
- ✅ **Ready for testing on 16KB devices/emulators**

---

## ✅ You're All Set!

Your app is configured for 16KB page size support. Just test it and you're ready for the November 2025 deadline! 🎉

### Next Steps:

1. **Test**: Run `./scripts/verify_16kb_support.sh` to verify configuration
2. **Build**: Create app bundle with `flutter build appbundle --release`
3. **Test on Emulator**: Use Android 15 emulator with 16KB system image
4. **Test on Device**: Test on Pixel 8/8a/8 Pro with 16KB mode enabled
5. **Upload**: Upload to Google Play Console and check compatibility status
