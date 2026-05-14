# Form Tạo Lịch (Schedule Creation Form)

## Mục đích
Tính năng **Tạo Lịch (Schedule)** cung cấp giao diện trực quan cho phép người dùng cấu hình chi tiết tần suất và vòng đời của công việc/lịch trình. Mục đích cốt lõi là tạo ra sự linh hoạt khi đặt lịch lặp lại (Hàng ngày, hàng tuần, hàng tháng, v.v...) đi kèm với cách thức kết thúc lặp minh bạch (Không bao giờ, vào một ngày cố định, hoặc sau một số vòng lặp nhất định).

## Bao gồm các trường nào và Mapping tĩnh với Backend (BE)
Form Tạo Lịch hoạt động xoay quanh Model `Schedule` (kế thừa `JsonModel`). Dưới đây là danh sách đầy đủ tất cả các trường dữ liệu trên UI và cách ánh xạ sang Backend từ trên xuống dưới dạng form:

### 1. Thông tin cơ bản
- **Tên lịch checklist**: Text Input bắt buộc. -> Map với `name`.
- **Chọn biểu mẫu sử dụng (Questionnaire)**: Modal chọn form checklist. -> Map với `questionnaireId` và chứa object tại `questionnaire`.

### 2. Thực hiện (Execution)
- **Chọn người thực hiện**: Modal multi-selection cho phép phân công công việc. -> Map với Array `scheduleParticipants` (Gồm danh sách `AppUser` hoặc `AppUserGroup` tùy vào `participantTypeId`).
- **Loại báo cáo/Hoàn thành (Schedule Report Type)**: Có 2 tuỳ chọn Radio Button:
  - *"Chỉ cần một người hoàn thành"*: -> Map với `scheduleReportTypeId = 1`.
  - *"Tất cả cần hoàn thành"*: -> Map với `scheduleReportTypeId = 2`.
- **Tự lấy người theo địa điểm**: Lọc user động theo site. Dạng Checkbox. -> Map với `isValidateSite` (Boolean).
- **Chọn địa điểm (Site)**: Modal search các địa điểm (chi nhánh). -> Map mảng với `scheduleSiteMappings`.

### 3. Thời gian (Time & Frequency)
- **Múi giờ (Group Timezone)**: Mặc định là `Indochina Time (Vietnam)` có `id=269`. Lấy qua API `single-list-group-time-zone` có search. -> Map với `groupTimeZoneId` & object `groupTimeZone`.
- **Ngày bắt đầu / Ngày kết thúc**: Mở Calendar picker. Gắn vào `startDateAt` và `endDateAt`. Trường hợp *"Hàng Tần"* sẽ thay bằng **Thứ bắt đầu / kết thúc** (`startWeekDay`/`endWeekDay`).
- **Giờ bắt đầu / Giờ kết thúc**: Chọn giờ/phút. -> Map với `startTimeUnitId` và `endTimeUnitId`.
- **Tần suất lặp (Frequency Type)**: Ví dụ "Một Lần", "Hàng Tuần", *"Tùy biến"*. -> Map với `frequencyTypeId`.
  - Nếu là **Tuỳ biến (Custom)**, sẽ có modal riêng cấu hình đơn vị độ dài (Ngày/Tuần) ở `subFrequencyTypeId` và `repeatTime`, cùng mảng `scheduleDays`.
- **Kết thúc lặp (Finish Type)**: Chỉ hiển thị khi chọn tần suất lớn hơn/Tuỳ biến. Có "Không bao giờ", "Sau số lần", "Vào ngày". -> Map với `scheduleFinishTypeId` và các trường phụ đi kèm (vd `finishedAfterRepeat`, `finishedAt`).
- **Cho phép thực hiện sau khi hết thời gian**: Switch bật/tắt quyền nộp muộn. -> Map với `hasValidatedTime` (Boolean).

### 4. Phân loại (Categorization)
- **Danh mục lịch (Category)**: Phân loại theo business. -> Map với `scheduleCategory`.
- **Nhãn dán (Tag)**: Thêm tag multiple selection. -> Map array với `scheduleTags`.

## Logic xử lý khi Chọn Tần Suất và Kết Thúc Lặp

### 1. Phân luồng Logic Tần Suất (Modal: CustomType)
Nơi tiếp nhận tương tác cho Tần suất "Tuỳ Biến":
- **Khi Chọn Đơn vị lặp = Tuần (Sub-frequency Weekly)**:
  - Giao diện cung cấp Component để người dùng chọn trực tiếp các **Ngày trong tuần** (Từ Thứ 2 đến Chủ nhật) mà lịch sẽ xảy ra trong tuần đó.
  - Kết quả các ngày được chọn sẽ convert thành list `ScheduleDay` và nạp vào mảng `scheduleDays`.
- **Khi Chọn Đơn vị lặp = Ngày (Sub-frequency Daily)**:
  - Ẩn chọn "Ngày trong tuần".
  - Chỉ yêu cầu cấu hình **Chu kỳ vòng lặp** thông thường (Ví dụ: lặp lại mỗi `x` ngày).
- **Chu kỳ lặp (`repeatTime`)**:
  - Sử dụng Component `DropdownMenu` kết hợp tìm kiếm Local (Search Type) và chọn List (Dropdown List).
  - Tích hợp logic cảnh báo ngay khi người dùng gõ phím quá giới hạn hoặc sai định dạng.
  - Tùy vào đơn vị lặp, giới hạn tuỳ chỉnh sẽ thay đổi linh hoạt:
    - **Ngày (Daily)**: Cho phép nhập/chọn từ 1 đến 45.
    - **Tuần (Weekly)**: Cho phép nhập/chọn từ 1 đến 52.
    - **Tháng (Monthly)**: Cho phép nhập/chọn từ 1 đến 12.
    - **Năm (Yearly)**: Khóa hoàn toàn chức năng gõ nhập, bắt buộc màn hình trở thành DDL tĩnh chỉ cho phép click chọn giá trị `1` hoặc `2`.

### 2. Phân luồng Kết Thúc Lặp (Modal: ScheduleFinishTypeModal)
Phụ trách điểm cuối điều kiện dừng của Schedule:
- **Dạng "Không bao giờ"**: Tự xóa sạch các cấu hình kết thúc trước đó.
- **Dạng "Vào ngày"**: Kích hoạt bộ chọn DatePicker cơ bản từ Material. Tự động cast giá trị thành ISO String tiêu chuẩn qua biến `_finishedAt` khi chọn.
- **Dạng "Sau số vòng lặp"**: 
  - Hiển thị TextField nhập liệu trực tiếp dành cho số.
  - Tích hợp logic **Validation Threshold**: Số tự động chốt nhỏ nhất về 1. Ở mức trần (500), UI cung cấp thông báo đỏ (errorText) cảnh báo "Chỉ được tối đa 500 lần" đối với input từ người dùng lớn hơn 500, nhưng lớp Data đằng sau vẫn được tự động truncate lại chính xác là `500` để đảm bảo hệ thống không bị lỗi crash payload.
- **Tự động lưu (Auto-save instant)**: Kỹ thuật Reactive State. Mỗi thay đổi RadioButton/TextBox được `_notifyChanged()` ghi nhận, parse số, rồi truyền thẳng vào callback `onChanged` bắn ngược lên Entity cha thay vì chờ nút "Save". Trình duyệt modal tự do lướt và đóng bằng kéo thả (Pull-to-dismiss) hoặc focus ra phần tử bên ngoài, tối giản hóa trải nghiệm nhập liệu (User Experience).

### 5. Logic Text Hiển Thị (Display String Builders)
Để người dùng có góc nhìn trực quan về những lựa chọn phức tạp như Tần suất kép hay thời điểm kết thúc, giao diện xử lý parse Data hiển thị ra Text thuần theo các quy định sau:

- **Logic hiển thị Tần suất Tùy biến (`_buildFrequencyString`)**:
  - Dựa trên công thức gốc `Hằng {repeatTime} {subFrequencyType.name}` (Ví dụ: "Hằng 3 ngày", "Hằng 2 tuần").
  - Nếu `subFrequencyTypeId` là **Tuần (EVERY_WEEK)** VÀ mảng `scheduleDays` **có ngày**, hệ thống sẽ nối danh sách toàn bộ các ngày được chọn vào sau công thức gốc.
    - *Ví dụ 1*: Lặp mỗi 2 tuần vào Thứ 2 và Thứ 4 -> UI hiển thị **"Hằng 2 tuần vào các ngày Thứ 2, Thứ 4"**.
  - Nếu không thuộc dạng Lặp theo Tuần có chứa ngày (ví dụ lặp theo Ngày, Tháng, Năm hoặc lặp theo Tuần nhưng chưa chọn ngày), giao diện trả về công thức gốc.
    - *Ví dụ 2*: Chọn Tùy biến -> Lặp theo Ngày -> Chu kỳ lặp 3 -> Hiển thị trên UI là **"Hằng 3 ngày"**.

- **Logic hiển thị Kết thúc lặp (`_buildFinishTypeString`)**:
  - `scheduleFinishTypeId = 1` hoặc `0` (Mặc định không dừng): Luôn trả về `Không bao giờ`.
  - `scheduleFinishTypeId = 2` (Vào ngày cụ thể): Lấy giá trị chuỗi ISO8601 String trong biến `finishedAt`, tự động `tryParse` an toàn nhằm tránh exception khi runtime, convert về Local time và format lại định dạng `dd/MM/yyyy`. (Ví dụ: *"20/11/2026"*). Nếu chưa có dữ liệu hợp lệ thì trả về *"Chọn ngày"*.
  - Các loại khác (Id 3 - Lặp theo số lần cố định): Trả về chuỗi `Sau {finishedAfterRepeat} lần`. 
    - *Ví dụ*: Chọn kết thúc sau 10 vòng lặp -> UI hiển thị **"Sau 10 lần"**.

## Quản lý Data & Giao tiếp API

1. **Khởi tạo dữ liệu ban đầu (Draft / Initial State)**
   - Hiện tại, luồng **Get Draft** từ server (`_service.getDraft()`) đang được khóa (comment out). 
   - Thay vào đó, Object `Schedule` được **khởi tạo nội bộ (Local Initialization)** hoàn toàn thông qua các giá trị default trực tiếp trên code (ví dụ: `defaultSystemTimeZone`, Tần suất mặc định là `ONE_TIME` "Một lần", `startTimeUnit` là 08:00, v.v...). Điều này giúp form tải tức thời ngay lập tức khi mở.

2. **Gửi dữ liệu lên BE (API Create)**
   - Hàm `_onCreateSchedule` sẽ được gọi khi bấm nút **Tạo**.
   - Input Object: Truyền trực tiếp state Object `Schedule` (đã tổng hợp tên, cấu hình vòng lặp, người tham gia...).
   - Action: Thông qua Base Repository gọi hàm `MobileScheduleRepository().create(input)`. Request HTTP Post sẽ mang payload là danh sách các field được parse qua model `JsonModel` đẩy về URL create của hệ thống SupaMobile.
   - Bắt lỗi: Error Handler tiêu chuẩn của dự án hỗ trợ đọc mã `DioException`, đổ Field-level errors đỏ màn hình nếu BE báo valid fails (vd: Trùng tên, cấu hình chưa đúng yêu cầu). Mọi thông báo lỗi sẽ hiển thị trực tiếp bằng Toastification.
