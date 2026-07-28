# Automated UI Testing

## Metadata

| Thuộc tính | Giá trị |
|------------|---------|
| Phạm vi | Root app `supa` và các sub-app trong `packages/` |
| Công nghệ | `integration_test`, `flutter_test`, Page Object Model, BDD-style steps |
| Entry test mẫu | `integration_test/features/login_smoke_test.dart` |
| Cập nhật lần cuối | 2026-05-25 |

## Mục tiêu

Khung này chuẩn hóa cách viết UI integration test theo hai lớp:

- **BDD-style scenario**: file trong `integration_test/features/` đọc như luồng nghiệp vụ `Given/When/Then`.
- **Page Object Model**: file trong `integration_test/pages/` gom `Finder`, `Key`, hành động người dùng và assertion của từng màn hình.

Luồng test không gọi trực tiếp widget nội bộ của màn hình. Khi UI đổi layout nhưng `Key` và hành vi giữ nguyên, chỉ cần sửa page object.

## Cây thư mục

```text
integration_test/
├── features/
│   └── login_smoke_test.dart
├── pages/
│   └── login_page_object.dart
└── support/
    ├── auth_test_probe.dart
    ├── bdd_step.dart
    ├── test_app.dart
    └── test_waiter.dart
```

## Quy ước Gherkin

Viết đặc tả nghiệp vụ trước khi viết code test:

```gherkin
Feature: Login

  Scenario: User changes domain and logs in
    Given the Supa app is launched
    When the guest changes to the target domain
    And the app is restarted after the domain change
    And the guest logs in with a single-tenant account
    Then the login is completed
```

Khi chuyển sang Dart, giữ cùng ngôn ngữ ở tên test và các step `given`, `when`, `then`. Không đưa `Finder` vào file feature; mọi selector nằm trong page object.

## Page Object

Mỗi màn hình hoặc panel ổn định có một class:

- `Finder` dùng `Key` đã có trong UI, ví dụ `login_button`, `login_username`, `login_password`.
- Hàm hành động mô phỏng người dùng: `openLoginSheet()`, `enterEmail()`, `submit()`.
- Assertion gần màn hình: `expectLoginSheetVisible()`.

Nếu cần thêm `Key` vào UI thật, đặt tên theo domain và hành động, ví dụ `task_assignment_edit_save_button`. Không dùng text hiển thị để tìm widget vì text phụ thuộc localization.

## Bootstrap test app

`integration_test/support/test_app.dart` khởi động `SupaApp` với router thật nhưng reset trạng thái auth về guest trước khi `runApp`. Điều này giúp smoke test login không phụ thuộc phiên đăng nhập đang lưu trên simulator của developer.

Với luồng đổi domain, sau khi domain được lưu thành công, test cần khởi động lại app trước khi đăng nhập. Đây là hành vi bắt buộc vì nhiều service đọc `persistentStorage.baseApiUrl` lúc bootstrap.

## Chạy toàn bộ test case một lần

Script `scripts/run_integration_tests.dart` chạy toàn bộ `integration_test/features`, parse output của Flutter, rồi in summary case nào pass/fail và lý do fail. Luồng login thật cần truyền domain và tài khoản test qua biến môi trường; không ghi thông tin này trực tiếp vào source code.

Script có watchdog mặc định `240s`. Nếu Flutter test hoặc app simulator bị kẹt sau khi test đã chạy xong, script tự dừng `flutter test`/`Runner.app`, đánh dấu case chưa kết thúc là fail, rồi vẫn in báo cáo.

```bash
SUPA_E2E_DOMAIN=https://sstage.supa.vn \
SUPA_E2E_USERNAME=test@example.com \
SUPA_E2E_PASSWORD='***' \
dart run scripts/run_integration_tests.dart
```

Không dùng `http://sstage.supa.vn` cho flow đổi domain hiện tại vì `/rpc/portal/ping` trả `404`. Dùng `https://sstage.supa.vn`.

Với thiết bị/emulator thật:

```bash
flutter devices
SUPA_E2E_DOMAIN=https://sstage.supa.vn \
SUPA_E2E_USERNAME=test@example.com \
SUPA_E2E_PASSWORD='***' \
dart run scripts/run_integration_tests.dart --device <device-id>
```

Chạy một file hoặc một folder khác:

```bash
SUPA_E2E_DOMAIN=https://sstage.supa.vn \
SUPA_E2E_USERNAME=test@example.com \
SUPA_E2E_PASSWORD='***' \
dart run scripts/run_integration_tests.dart --target integration_test/features/login_smoke_test.dart
```

Truyền thêm tham số cho `flutter test` sau dấu `--`:

```bash
SUPA_E2E_DOMAIN=https://sstage.supa.vn \
SUPA_E2E_USERNAME=test@example.com \
SUPA_E2E_PASSWORD='***' \
dart run scripts/run_integration_tests.dart -- --timeout=2m
```

Đổi timeout tổng của runner:

```bash
SUPA_E2E_DOMAIN=https://sstage.supa.vn \
SUPA_E2E_USERNAME=test@example.com \
SUPA_E2E_PASSWORD='***' \
dart run scripts/run_integration_tests.dart --timeout-seconds 360
```

## Đọc kết quả pass/fail

Sau khi chạy, script in summary dạng:

```text
========== Integration Test Summary ==========
Total: 3
Passed: 2
Failed: 1
Skipped: 0

[PASS] TC01 - change domain successfully
[PASS] TC02 - login successfully with single tenant
[FAIL] TC03 - show error when password is wrong
  Step: When the guest logs in with a wrong password
  Reason:
    Expected: exactly one matching candidate
      Actual: _TextWidgetFinder:<Found 0 widgets with text "Invalid password">
==============================================
```

Khi test fail, đọc từ trên xuống:

- Dòng `[FAIL]` cho biết test case nào fail.
- Dòng `Step` cho biết fail đang ở bước BDD nào.
- Dòng `Reason` là lỗi đầu tiên Flutter report cho case đó.

Ví dụ fail ở domain:

```text
When the guest changes to the target domain
DIO ERROR 404 = http://sstage.supa.vn/rpc/portal/ping
```

Ví dụ login đã thành công nhưng dashboard có lỗi nền:

```text
Router Redirect from "/" to "/supa/dashboard"
ClientLocalInfoService: Failed to get location...
Failed to load network image...
```

Trường hợp này nên dừng assertion ở trạng thái authenticated nếu mục tiêu test là login, không assert sâu vào dashboard.

## Lưu log

Script tự lưu raw log vào `build/integration_test_results/`:

- `integration_test_<timestamp>.jsonl`: output `--machine` của Flutter, dùng cho tool parse.
- `integration_test_<timestamp>.stderr.log`: stderr/build log.

Muốn đổi thư mục lưu log:

```bash
SUPA_E2E_OUTPUT_DIR=/tmp/supa-e2e \
SUPA_E2E_DOMAIN=https://sstage.supa.vn \
SUPA_E2E_USERNAME=test@example.com \
SUPA_E2E_PASSWORD='***' \
dart run scripts/run_integration_tests.dart
```

## Viết nhiều test case

Mỗi test case nên là một `testWidgets(...)` riêng để kết quả pass/fail tách bạch:

```dart
testWidgets('TC01 - change domain successfully', (tester) async {});
testWidgets('TC02 - login successfully with single tenant', (tester) async {});
testWidgets('TC03 - show error when password is wrong', (tester) async {});
```

Chạy toàn bộ feature:

```bash
SUPA_E2E_DOMAIN=https://sstage.supa.vn \
SUPA_E2E_USERNAME=test@example.com \
SUPA_E2E_PASSWORD='***' \
dart run scripts/run_integration_tests.dart
```

## Quy trình thêm test case mới

Luồng khuyến nghị khi chạy local-first:

1. BA mô tả test case theo template ở phần bên dưới.
2. Developer/AI chuyển test case thành Gherkin `Given/When/Then`.
3. Nếu màn hình đã có page object, thêm action/assertion vào page object đó.
4. Nếu màn hình chưa có page object, tạo file mới trong `integration_test/pages/`.
5. Thêm `testWidgets(...)` riêng trong `integration_test/features/<feature>_test.dart`.
6. Chạy `dart run scripts/run_integration_tests.dart`.
7. Đọc summary `[PASS]`/`[FAIL]` và raw log nếu cần.

Nguyên tắc quan trọng: test case phải dừng ở đúng mục tiêu kiểm thử. Ví dụ test login chỉ cần dừng ở trạng thái authenticated, không assert sâu vào dashboard nếu dashboard chưa thuộc test case đó.

## Template BA gửi test case

BA có thể copy file template riêng tại [`test_case_ba_template.md`](test_case_ba_template.md), hoặc gửi nhanh theo mẫu này:

```text
Feature: [Tên tính năng]

Test case ID: [TC_LOGIN_001]
Tên test case: [Đăng nhập thành công với tài khoản 1 tenant]
Mục tiêu: [Xác nhận user đổi đúng domain và đăng nhập được]

Tiền điều kiện:
- Domain: [https://sstage.supa.vn]
- Tài khoản: [mô tả loại account, không cần gửi password trong file doc]
- User có [1 tenant / nhiều tenant / quyền cụ thể]
- App ở trạng thái [guest / đã login / có dữ liệu X]

Dữ liệu test:
- Username: [test@example.com]
- Password: [gửi riêng qua kênh bảo mật nếu cần]
- Tenant kỳ vọng: [Tên tenant nếu có]
- Dữ liệu liên quan: [task id, site, checklist, ngày, trạng thái...]

Các bước:
1. Mở app
2. Đổi domain sang [domain]
3. Restart app
4. Bấm Đăng nhập
5. Nhập username/password
6. Bấm nút đăng nhập

Kết quả mong đợi:
- User đăng nhập thành công
- App chuyển sang trạng thái authenticated
- [Nếu test case cần] hiển thị màn hình/trạng thái cụ thể

Điểm dừng test:
- Dừng ngay sau khi [đăng nhập thành công / thấy màn X / lưu thành công]

Edge cases cần test thêm:
- [Sai mật khẩu]
- [Sai domain]
- [Account nhiều tenant]
- [Account không có quyền]
```

## Prompt gửi AI để thêm test case

Bạn có thể gửi cho AI theo mẫu:

```text
Hãy thêm automated UI test cho Flutter integration_test theo kiến trúc hiện tại.

Feature: [...]
Test case ID: [...]
Tên test case: [...]
Tiền điều kiện: [...]
Dữ liệu test: [...]
Các bước: [...]
Kết quả mong đợi: [...]
Điểm dừng test: [...]

Yêu cầu kỹ thuật:
- Dùng Page Object Model trong integration_test/pages.
- Mỗi test case là một testWidgets riêng.
- Không hard-code secret trong source; dùng --dart-define hoặc biến môi trường.
- Test dừng đúng tại điểm hoàn thành của test case, không kéo sang màn/luồng khác.
- Sau khi sửa chạy dart format và flutter analyze integration_test.
- Không sửa app/runtime code nếu chỉ cần thêm test.
```

## Quy ước đặt tên test

File feature:

```text
integration_test/features/login_smoke_test.dart
integration_test/features/task_assignment_test.dart
integration_test/features/inspection_checklist_test.dart
```

Tên test case:

```dart
testWidgets('TC_LOGIN_001 - user changes domain and logs in', (tester) async {});
testWidgets('TC_LOGIN_002 - wrong password shows login error', (tester) async {});
testWidgets('TC_TASK_001 - user creates a task assignment', (tester) async {});
```

Page object:

```text
integration_test/pages/login_page_object.dart
integration_test/pages/task_assignment_page_object.dart
integration_test/pages/inspection_checklist_page_object.dart
```

## Checklist trước khi thêm test case

- Test case có mục tiêu rõ ràng và điểm dừng rõ ràng.
- Account test ổn định, không OTP/captcha/2FA.
- Dữ liệu test có thể lặp lại nhiều lần.
- Không phụ thuộc thứ tự chạy của test case khác.
- Không dùng text nếu có `Key` ổn định; ưu tiên `Key` trong UI.
- Không test quá nhiều thứ trong một case.
- Không để test login fail vì dashboard, test tạo task fail vì notification, hoặc test checklist fail vì chat nếu các phần đó không thuộc mục tiêu.

## CI và Firebase Test Lab

Workflow mẫu nằm ở `.github/workflows/flutter_integration_test.yml`. Luồng chính:

1. Checkout source.
2. Cài Flutter.
3. Tạo `.env` từ GitHub Secret.
4. Build APK debug và APK instrumentation test.
5. Upload lên Firebase Test Lab bằng `gcloud firebase test android run`.

Secrets cần có:

- `FIREBASE_SERVICE_ACCOUNT_JSON`: service account có quyền Firebase Test Lab.
- `FIREBASE_PROJECT_ID`: project id Firebase.
- `SUPA_ENV_FILE`: nội dung file `.env` dùng cho môi trường test.
- `SUPA_E2E_DOMAIN`: domain test, ví dụ `https://sstage.supa.vn`.
- `SUPA_E2E_USERNAME`: tài khoản test.
- `SUPA_E2E_PASSWORD`: mật khẩu tài khoản test.

## Lưu ý khi mở rộng

- Chỉ viết UI integration test cho luồng cốt lõi: đăng nhập, tạo công việc, hoàn tất checklist, duyệt/phê duyệt.
- Logic nhỏ như validate email, tính trạng thái, format ngày phải nằm ở unit test.
- Mỗi scenario nên có dữ liệu test độc lập hoặc tài khoản seed riêng để tránh phụ thuộc thứ tự chạy.
- Không dùng `ScaffoldMessenger` trong app code; test chỉ kiểm tra kết quả người dùng nhìn thấy hoặc state điều hướng cuối cùng.
