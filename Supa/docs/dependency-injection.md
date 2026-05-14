# Dependency Injection với GetIt và Injectable

## 1. Tổng quan

Dự án SupaMobileApp sử dụng **GetIt** làm dependency injection container và **Injectable** để tự động generate code đăng ký dependencies. Hệ thống này cho phép quản lý dependencies một cách có tổ chức và tự động.

### 1.1. Các package liên quan

- **get_it**: Dependency injection container
- **injectable**: Code generation cho GetIt
- **injectable_generator**: Build runner để generate code

### 1.2. Cấu trúc cơ bản

```
lib/config/
├── get_it.dart              # Cấu hình chung, đăng ký tất cả dependencies
└── get_it.config.dart       # File generated (không chỉnh sửa thủ công)

packages/<app_name>/config/
├── get_it.dart              # Cấu hình dependencies của sub-app
└── get_it.config.dart       # File generated (không chỉnh sửa thủ công)

packages/<app_name>/core/models/
└── models.dart              # Entry point đăng ký models được generate từ backend
```

## 2. Cấu hình GetIt chung

### 2.1. File cấu hình chính

File `lib/config/get_it.dart` là nơi tập trung tất cả các dependencies:

```dart
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:supa_architecture/supa_architecture.dart';
import 'package:supa_admin/config/get_it.dart';
import 'package:supa_attendance/config/get_it.dart';
// ... các imports khác

import 'get_it.config.dart';

final getIt = GetIt.instance;

@InjectableInit()
Future<void> configureDependencies() async {
  // Đăng ký các Bloc quan trọng dưới dạng singleton
  getIt.registerSingleton<AuthenticationBloc>(AuthenticationBloc());
  getIt.registerSingleton<ErrorHandlingBloc>(ErrorHandlingBloc());
  getIt.registerSingleton<PushNotificationBloc>(PushNotificationBloc());

  /// Core dependencies
  registerModels();              // Models từ supa_architecture
  registerRepositories();        // Repositories từ supa_architecture

  /// Foundation dependencies
  configureFoundationDependencies();

  /// Business-specific dependencies
  configureAdminDependencies();
  configureAttendanceDependencies();
  configureBibsDependencies();
  configureDiscussionDependencies();
  configureServingDependencies();
  configureSpendDependencies();
  configureProjectDependencies();
  configureTrainingDependencies();
  configureWorkDependencies();

  // Khởi tạo tất cả dependencies được đánh dấu bằng annotation
  getIt.init();
}
```

### 2.2. Cấu hình cho từng sub-app

Mỗi sub-app có file `packages/<app_name>/config/get_it.dart` riêng:

```dart
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:supa_work/core/models/models.dart';

import 'get_it.config.dart';

final getIt = GetIt.instance;

@InjectableInit()
Future<void> configureWorkDependencies() async {
  // Đăng ký models được generate từ backend
  registerGeneratedWorkModels();

  // Khởi tạo dependencies được đánh dấu bằng annotation
  getIt.init();
}
```

### 2.3. Đăng ký trong main app

Trong `lib/config/get_it.dart`, gọi hàm cấu hình của từng sub-app:

```dart
@InjectableInit()
Future<void> configureDependencies() async {
  // ... existing code
  
  /// Business-specific dependencies
  configureWorkDependencies();      // Gọi hàm cấu hình của Work app
  configureProjectDependencies();    // Gọi hàm cấu hình của Project app
  // ... các app khác
  
  getIt.init();
}
```

## 3. Re-generate code cho GetIt

### 3.1. Khi nào cần regenerate?

Bạn cần chạy build runner khi:
- Thêm mới một class với annotation `@injectable`, `@singleton`, hoặc `@lazySingleton`
- Thay đổi annotation của một class (từ `@injectable` sang `@singleton`, v.v.)
- Xóa một class đã được đăng ký
- Thay đổi constructor của một class đã được đăng ký

### 3.2. Cách chạy build runner

**Cách 1: Chạy một lần**
```bash
flutter pub run build_runner build
```

**Cách 2: Chạy và watch (tự động rebuild khi có thay đổi)**
```bash
flutter pub run build_runner watch
```

**Cách 3: Xóa cache và rebuild (khi gặp lỗi)**
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### 3.3. File được generate

Sau khi chạy build runner, các file sau sẽ được generate:
- `lib/config/get_it.config.dart`
- `packages/<app_name>/config/get_it.config.dart`

**⚠️ Lưu ý:** Không chỉnh sửa các file `.config.dart` thủ công. Chúng sẽ bị ghi đè mỗi khi chạy build runner.

### 3.4. Troubleshooting

**Lỗi: "Conflicting outputs"**
```bash
# Xóa cache và rebuild
flutter pub run build_runner build --delete-conflicting-outputs
```

**Lỗi: "No elements found"**
- Kiểm tra xem đã import `injectable` package chưa
- Kiểm tra xem đã thêm annotation đúng chưa
- Đảm bảo file có annotation được import trong file `get_it.dart`

**Lỗi: "Cannot find type"**
- Đảm bảo đã import đầy đủ các dependencies
- Kiểm tra xem class có tồn tại và có thể truy cập được không

## 4. Đánh dấu file là Injectable hoặc Singleton

### 4.1. Các annotation có sẵn

**`@injectable`**
- Tạo một instance mới mỗi khi được inject (factory)
- Sử dụng cho: Models, DTOs, các class cần tạo mới mỗi lần sử dụng

**`@singleton`**
- Tạo một instance duy nhất và chia sẻ cho toàn bộ app
- Instance được tạo ngay khi app khởi động
- Sử dụng cho: Repositories, Services, các class cần duy trì state

**`@lazySingleton`**
- Tạo một instance duy nhất nhưng chỉ tạo khi lần đầu được sử dụng (lazy initialization)
- Sử dụng cho: Services nặng, các class không cần khởi tạo ngay

### 4.2. Cách sử dụng annotation

**Ví dụ 1: Model với `@injectable`**
```dart
import 'package:injectable/injectable.dart';
import 'package:supa_architecture/json/json.dart';

@injectable
class User extends JsonModel {
  final JsonString id = JsonString('id');
  final JsonString name = JsonString('name');
  final JsonString avatarUrl = JsonString('avatarUrl');

  @override
  List<JsonField> get fields => [id, name, avatarUrl];

  static User create() => User();
}
```

**Ví dụ 2: Repository với `@singleton`**
```dart
import 'package:injectable/injectable.dart';
import 'package:supa_architecture/supa_architecture.dart';

@singleton
class IotDeviceRepository extends BaseRepository<Device, DeviceFilter> {
  @override
  String get baseUrl => Uri.parse(persistentStorage.baseApiUrl)
      .replace(
        path: '/rpc/iot/mobile/device',
      )
      .toString();

  // ... các methods khác
}
```

**Ví dụ 3: Service với `@lazySingleton`**
```dart
import 'package:injectable/injectable.dart';

@lazySingleton
class DeviceListBloc extends Bloc<DeviceListEvent, DeviceListState> {
  final IotDeviceRepository _repository;
  
  DeviceListBloc(this._repository) : super(DeviceListInitial()) {
    // ...
  }
}
```

### 4.3. Dependency Injection

Khi một class có dependencies, Injectable sẽ tự động inject chúng:

```dart
@singleton
class MyRepository {
  final SomeService _service;
  
  // Injectable tự động inject SomeService
  MyRepository(this._service);
}

@lazySingleton
class MyBloc {
  final MyRepository _repository;
  final AnotherService _anotherService;
  
  // Injectable tự động inject cả hai dependencies
  MyBloc(this._repository, this._anotherService);
}
```

### 4.4. Sử dụng GetIt để lấy instance

Sau khi đã đăng ký, bạn có thể lấy instance từ GetIt:

```dart
// Lấy singleton
final repository = getIt.get<IotDeviceRepository>();

// Lấy factory (tạo instance mới)
final user = getIt.get<User>();

// Hoặc sử dụng trong constructor (tự động inject)
@injectable
class MyService {
  final IotDeviceRepository _repository;
  
  MyService(this._repository); // Tự động inject
}
```

## 5. Quy tắc chung: Singleton cho Repository, Injectable cho Models

### 5.1. Repository → `@singleton`

**Lý do:**
- Repository thường quản lý kết nối API, cache, hoặc state
- Cần duy trì một instance duy nhất để tránh tạo nhiều kết nối không cần thiết
- Có thể cache dữ liệu và chia sẻ giữa các components

**Ví dụ:**
```dart
@singleton
class WorkProfileRepository extends ApiClient {
  @override
  String get baseUrl => '${persistentStorage.baseApiUrl}/rpc/work/profile';

  Future<List<String>> getPaths() async {
    return dio.post('/get', data: {}).then((response) {
      if (response.data['paths'] is List) {
        return List<String>.from(response.data['paths']);
      }
      return [];
    });
  }
}
```

**Các Repository trong supa_architecture:**
```dart
// packages/supa_architecture/lib/repositories/repositories.dart
void registerRepositories() {
  final getIt = GetIt.instance;

  getIt.registerSingleton<PortalAuthenticationRepository>(
      PortalAuthenticationRepository());
  getIt.registerSingleton<PortalProfileRepository>(PortalProfileRepository());
  getIt.registerSingleton<PortalTenantRepository>(PortalTenantRepository());
  getIt.registerSingleton<UtilsNotificationRepository>(
      UtilsNotificationRepository());
}
```

### 5.2. Models → `@injectable`

**Lý do:**
- Models thường là data classes, không có state
- Cần tạo instance mới mỗi lần để tránh chia sẻ dữ liệu không mong muốn
- Models thường được tạo từ JSON response, mỗi response cần một instance mới

**Ví dụ:**
```dart
@injectable
class User extends JsonModel {
  final JsonString id = JsonString('id');
  final JsonString name = JsonString('name');
  final JsonString avatarUrl = JsonString('avatarUrl');

  @override
  List<JsonField> get fields => [id, name, avatarUrl];

  static User create() => User();
}
```

### 5.3. Services → `@singleton` hoặc `@lazySingleton`

**Services** có thể là singleton hoặc lazySingleton tùy vào trường hợp:

**`@singleton`** - Khi service cần khởi tạo ngay:
```dart
@singleton
class FileHandler {
  Future<void> downloadAndOpen(String url, String filename) async {
    // ...
  }
}
```

**`@lazySingleton`** - Khi service nặng hoặc không cần khởi tạo ngay:
```dart
@lazySingleton
class HeavyService {
  // Service này chỉ được tạo khi lần đầu được sử dụng
}
```

### 5.4. Blocs/Cubits → `@lazySingleton` hoặc `@injectable`

**Blocs/Cubits** thường là `@lazySingleton` hoặc `@injectable` tùy vào lifecycle:

**`@lazySingleton`** - Khi Bloc cần duy trì state:
```dart
@lazySingleton
class TicketListBloc extends Bloc<TicketListEvent, TicketListState> {
  final MobileTicketRepository _repository;
  
  TicketListBloc(this._repository) : super(TicketListInitial());
}
```

**`@injectable`** - Khi Bloc chỉ dùng trong một widget cụ thể:
```dart
@injectable
class TicketScannerBloc extends Bloc<TicketScannerEvent, TicketScannerState> {
  final TicketRequestRepository _repository;
  
  TicketScannerBloc(this._repository) : super(TicketScannerInitial());
}
```

### 5.5. Tóm tắt quy tắc

| Loại class     | Annotation                          | Lý do                                |
| -------------- | ----------------------------------- | ------------------------------------ |
| **Repository** | `@singleton`                        | Duy trì kết nối, cache, state        |
| **Model**      | `@injectable`                       | Data class, cần instance mới mỗi lần |
| **Service**    | `@singleton` hoặc `@lazySingleton`  | Tùy vào nhu cầu khởi tạo             |
| **Bloc/Cubit** | `@lazySingleton` hoặc `@injectable` | Tùy vào lifecycle                    |

## 6. Models được generate từ backend

### 6.1. Cấu trúc thư mục

Các file entity được generate từ backend được đặt trong:
```
packages/<app_name>/core/models/
├── *.dart                    # Các file model được generate
└── models.dart               # File entry point để đăng ký với GetIt
```

### 6.2. File entry point: `models.dart`

File `packages/<app_name>/core/models/models.dart` là nơi tập trung:
- Export tất cả các models
- Hàm `registerGenerated<AppName>Models()` để đăng ký models với GetIt

**Ví dụ từ Work app:**
```dart
// packages/supa_work/lib/core/models/models.dart

// Import tất cả các models
part 'answer_type.dart';
part 'appearance.dart';
part 'area.dart';
// ... các part files khác

// Hàm đăng ký models
void registerGeneratedWorkModels() {
  final getIt = GetIt.instance;
  
  // Đăng ký tất cả models dưới dạng factory
  getIt.registerFactory<TaskAssignmentAppUserCoworking>(
      () => TaskAssignmentAppUserCoworking());
  getIt.registerFactory<InspectionQuestionFileMapping>(
      () => InspectionQuestionFileMapping());
  getIt.registerFactory<Project>(() => Project());
  getIt.registerFactory<Site>(() => Site());
  // ... các models khác
}
```

### 6.3. Quy tắc đăng ký: Không dùng annotation

**⚠️ QUAN TRỌNG:** Các models được generate từ backend **KHÔNG** sử dụng annotation `@injectable`, `@singleton`, v.v. Thay vào đó, chúng được đăng ký thủ công trong hàm `registerGenerated<AppName>Models()`.

**Lý do:**
- Models được generate tự động từ backend schema
- Không thể thêm annotation vào file generated
- Cần kiểm soát cách đăng ký (thường là `registerFactory`)

### 6.4. Cách đăng ký models

**Bước 1: Tạo/Update file `models.dart`**

Sau khi generate models từ backend, cập nhật file `models.dart`:

```dart
// Import các models
part 'model1.dart';
part 'model2.dart';
// ...

// Hàm đăng ký
void registerGenerated<AppName>Models() {
  final getIt = GetIt.instance;
  
  // Đăng ký từng model dưới dạng factory
  getIt.registerFactory<Model1>(() => Model1());
  getIt.registerFactory<Model2>(() => Model2());
  // ...
}
```

**Bước 2: Gọi hàm đăng ký trong `get_it.dart`**

Trong `packages/<app_name>/config/get_it.dart`:

```dart
@InjectableInit()
Future<void> configure<AppName>Dependencies() async {
  // Đăng ký models được generate từ backend
  registerGenerated<AppName>Models();
  
  // Khởi tạo dependencies được đánh dấu bằng annotation
  getIt.init();
}
```

**Bước 3: Gọi trong main app**

Trong `lib/config/get_it.dart`:

```dart
@InjectableInit()
Future<void> configureDependencies() async {
  // ... existing code
  
  configure<AppName>Dependencies(); // Gọi hàm cấu hình
  
  getIt.init();
}
```

### 6.5. Ví dụ hoàn chỉnh

**File: `packages/supa_work/lib/core/models/models.dart`**
```dart
import 'package:get_it/get_it.dart';
import 'package:supa_architecture/supa_architecture.dart';

// Import các models
part 'project.dart';
part 'site.dart';
part 'task_assignment.dart';
// ... các models khác

void registerGeneratedWorkModels() {
  final getIt = GetIt.instance;
  
  // Đăng ký models dưới dạng factory
  getIt.registerFactory<Project>(() => Project());
  getIt.registerFactory<Site>(() => Site());
  getIt.registerFactory<TaskAssignment>(() => TaskAssignment());
  // ... các models khác
}
```

**File: `packages/supa_work/lib/config/get_it.dart`**
```dart
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:supa_work/core/models/models.dart';

import 'get_it.config.dart';

final getIt = GetIt.instance;

@InjectableInit()
Future<void> configureWorkDependencies() async {
  // Đăng ký models được generate từ backend
  registerGeneratedWorkModels();
  
  // Khởi tạo dependencies được đánh dấu bằng annotation
  getIt.init();
}
```

**File: `lib/config/get_it.dart`**
```dart
@InjectableInit()
Future<void> configureDependencies() async {
  // ... existing code
  
  configureWorkDependencies(); // Gọi hàm cấu hình của Work app
  
  getIt.init();
}
```

### 6.6. Models từ supa_architecture

Models trong `packages/supa_architecture/lib/models/models.dart` cũng được đăng ký tương tự:

```dart
// packages/supa_architecture/lib/models/models.dart
void registerModels() {
  final getIt = GetIt.instance;

  getIt.registerFactory<AdminType>(AdminType.new);
  getIt.registerFactory<AppUser>(AppUser.new);
  getIt.registerFactory<CommentReaction>(CommentReaction.new);
  // ... các models khác
}
```

Và được gọi trong `lib/config/get_it.dart`:

```dart
@InjectableInit()
Future<void> configureDependencies() async {
  /// Core dependencies
  registerModels();  // Đăng ký models từ supa_architecture
  registerRepositories();
  // ...
}
```

## 7. Best Practices

### 7.1. Tổ chức code

1. **Mỗi sub-app có file `get_it.dart` riêng** trong `packages/<app_name>/config/`
2. **Models được generate** đặt trong `packages/<app_name>/core/models/`
3. **File entry point** `models.dart` export và đăng ký tất cả models
4. **Repositories** đặt trong `packages/<app_name>/repositories/` hoặc `packages/<app_name>/lib/repositories/`

### 7.2. Naming conventions

- Hàm đăng ký models: `registerGenerated<AppName>Models()`
- Hàm cấu hình dependencies: `configure<AppName>Dependencies()`
- File config: `get_it.dart` và `get_it.config.dart`

### 7.3. Khi thêm dependency mới

1. **Thêm annotation** vào class (`@injectable`, `@singleton`, v.v.)
2. **Chạy build runner**: `flutter pub run build_runner build`
3. **Kiểm tra file generated** trong `get_it.config.dart`
4. **Test** để đảm bảo dependency được inject đúng

### 7.4. Khi thêm model được generate

1. **Generate models** từ backend
2. **Thêm vào `models.dart`**: Import và đăng ký trong `registerGenerated<AppName>Models()`
3. **Không cần chạy build runner** (vì không dùng annotation)
4. **Test** để đảm bảo model có thể được inject

### 7.5. Debugging

**Kiểm tra dependency đã được đăng ký:**
```dart
// Kiểm tra xem dependency có tồn tại không
if (getIt.isRegistered<MyRepository>()) {
  final repo = getIt.get<MyRepository>();
}
```

**Lấy tất cả registered types:**
```dart
// Debug: In ra tất cả types đã đăng ký
print(getIt.allReadySync());
```

## 8. Tóm tắt

1. **Cấu hình chung**: `lib/config/get_it.dart` tập trung tất cả dependencies
2. **Re-generate**: Chạy `flutter pub run build_runner build` sau khi thêm/sửa annotation
3. **Annotation**:
   - `@singleton` cho Repository
   - `@injectable` cho Models
   - `@lazySingleton` cho Services/Blocs nặng
4. **Models từ backend**: Đăng ký thủ công trong `registerGenerated<AppName>Models()`, không dùng annotation
5. **File entry point**: `packages/<app_name>/core/models/models.dart` export và đăng ký models

---

**Lưu ý quan trọng:**
- Không chỉnh sửa file `.config.dart` thủ công
- Luôn chạy build runner sau khi thêm/sửa annotation
- Models được generate từ backend không dùng annotation
- Repository luôn là `@singleton`, Models luôn là `@injectable`
