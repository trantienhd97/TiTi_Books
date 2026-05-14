# Hướng Dẫn Cấu Trúc Dữ Liệu Learning Overview: Summary By Site

Tài liệu này giải thích cấu trúc dữ liệu trả về từ API `summary-by-site` của backend và cách thiết kế Model tại các module liên quan (`supa_training` và `supa_work/analytics`).

## 1. Background (Vấn đề & Context)

Trong module **Analytics > Learning Overview**, khi gọi API lấy chỉ số đào tạo chi tiết của từng điểm (`PersonalReportRepository.summaryBySite` - Endpoint: `/rpc/training/personal-report/mobile/summary-by-site`), Backend trả về dữ liệu của từng địa điểm (Site). Tuy nhiên, các chỉ số đo lường (metrics) như số khoá học, tỷ lệ đào tạo hoàn thành, lại **không nằm ở lớp root**.

Thay vì đó, dữ liệu của Backend được tổ chức dưới dạng danh sách các `Site`, với một thuộc tính JSON nested tên là `data` chứa các metrics:

```json
[
  {
    "id": 176321051123712,
    "code": "SITE.2025.00006",
    "name": "My Kingdom Nguyễn Chí Thanh",
    "parentId": 218429725310976,
    "level": 0,
    "hasChildren": false,
    "siteLevelId": 5,
    "data": {
      "siteId": 176321051123712,
      "numberOfTrainingPath": 3,
      "numberOfCompletedTrainingPath": 0,
      "trainingPathCompletedRate": 0.0,
      "numberOfCourse": 14,
      "numberOfCompletedCourse": 0,
      "courseCompletedRate": 0.0,
      "numberOfQuiz": 4,
      "numberOfCompletedQuiz": 0,
      "quizCompletedRate": 0.0
    }
  }
]
```

## 2. Giải pháp Ánh Xạ Model (Model Mapping)

Với thư viện `supa_architecture` (Sử dụng `JsonModel`), các model đã được tái cấu trúc (khác so với thiết kế cũ) để map 1-1 với response trả về:

### 2.1 Model `PersonalReportMobileSummaryBySiteData`
Tạo một `JsonModel` xử lý riêng phần `data` (metrics).
```dart
class PersonalReportMobileSummaryBySiteData extends JsonModel {
  @override
  List<JsonField> get fields => [
        siteId,
        numberOfTrainingPath,
        numberOfCompletedTrainingPath,
        trainingPathCompletedRate,
        numberOfCourse,
        numberOfCompletedCourse,
        courseCompletedRate,
        numberOfQuiz,
        numberOfCompletedQuiz,
        quizCompletedRate,
      ];
      // (Các khai báo JsonInteger, JsonDouble...)
}
```

### 2.2 Model `PersonalReportMobileSummaryBySite` 
Thay vì khởi tạo lại toàn bộ các trường `name`, `code`, `id`, ta cho `PersonalReportMobileSummaryBySite` **kế thừa trực tiếp từ `Site`** (`class PersonalReportMobileSummaryBySite extends Site`).
```dart
class PersonalReportMobileSummaryBySite extends Site {
  @override
  List<JsonField> get fields => [
        ...super.fields, // Map sẵn id, code, name...
        level,
        hasChildren,
        siteLevelId,
        data, // Chứa obj metrics phía trên
      ];
      // (Khai báo JsonObject<PersonalReportMobileSummaryBySiteData> data...)
}
```

## 3. Cách lấy dữ liệu (Truy xất trên UI)

Khi sử dụng Model này ở các Widget giao diện UI (ví dụ như `LearningOverviewSiteItem`, `PersonalReportSiteItemWidget`):

- **Lấy thông tin của Địa điểm (Site Info):** Truy xuất trực tiếp vì Model này thực chất là một `Site`.
  - ✔️ ĐÚNG: `siteSummary.name.value`
  - ❌ SAI: `siteSummary.site.value.name.value`
- **Lấy thông tin Chỉ số Metrics:** Truy xuất qua thuộc tính `.data.value`.
  - ✔️ ĐÚNG: `siteSummary.data.value.courseCompletedRate.value`
  - ❌ SAI: `siteSummary.courseCompletedRate.value`
- **Truyền tham số qua Router/Location:** Nếu màn `DetailPage` yêu cầu parameter loại truyền vào là `Site`, thì ta cứ việc truyền `siteSummary`.
  - ✔️ ĐÚNG: `extra: {'site': siteSummary}`

### 4. Xử lý An Toàn Null (Null Safety)
Trong hệ thống `JsonObject<T>`, khi Obj `data` từ BE gửi về null hoặc trống rỗng, thư viện thiết kế sẽ tự tạo một *bản sao rỗng* (empty fallback) thay vì crash. Các trường JsonField `int` hoặc `double` có giá trị mặc định là `0` hoặc `0.0`.
Do đó, các truy cập chuỗi `siteSummary.data.value.courseCompletedRate.value` là hoàn toàn crash-safe.
