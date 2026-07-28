# Tài liệu màn hình — Supa Mobile App

Quy ước viết doc: [`HUONG-DAN-VIET-DOC.md`](HUONG-DAN-VIET-DOC.md).

## Danh sách màn hình

| Folder | Tên màn (UI) | Class chính | Cập nhật |
|--------|----------------|-------------|----------|
| [`automated-ui-testing`](automated-ui-testing/README.md) | Khung Automated UI Testing | `integration_test` + Page Object | 2026-05-25 |
| [`cua-toi`](cua-toi/README.md) | Của tôi (tab đầu navbar) | `GeneralDashboardPage` | 2026-06-22 (Compliance detail: filter icon header + bottom sheet) |
| [`dang-ky-tai-khoan`](dang-ky-tai-khoan/README.md) | Đăng ký tài khoản / Thiết lập workspace | `SignupFlowPage`, `WorkspaceSetupPage` | 2026-06-17 (Step 2 đổi ngôn ngữ load bản dịch và đồng bộ auth state trước khi rebuild app) |
| [`hoc-khoa-hoc`](hoc-khoa-hoc/README.md) | Học khoá học | `CourseStudyPage` | 2026-05-28 (Video/Youtube hỗ trợ `allowFirstTimeSkipping`) |
| [`ho-so-nguoi-dung`](ho-so-nguoi-dung/README.md) | Hồ sơ người dùng / Profile | `UserProfilePage` | 2026-06-04 (Thêm xác nhận nhập `DELETE` trước khi xoá tài khoản) |
| [`task-progress-report`](task-progress-report/README.md) | Báo cáo tiến độ công việc | `TaskProgressDetailsListPage` | 2026-05-27 (Detail page khi bấm "Xem chi tiết" từ dashboard Task Progress card) |
| [`tin-nhan`](tin-nhan/README.md) | Tin nhắn | `CommunicationConversationsPage` | 2026-06-12 (Avatar header mở hồ sơ người dùng) |
| [`personal-report-by-grouping`](personal-report-by-grouping/README.md) | Báo cáo theo công việc | `PersonalReportDetailByGroupingPage`, `PersonalReportGroupingDetailPage` | 2026-05-27 (Thêm xem báo cáo tiến độ theo công việc, accessible từ dashboard "Xem chi tiết") |
| [`checklist`](checklist/README.md) | Checklist (navbar) | `InspectionChecklistPage` | 2026-06-12 (Avatar header mở hồ sơ người dùng) |
| [`chi-tiet-checklist`](chi-tiet-checklist/README.md) | Chi tiết checklist | `InspectionDetailNewPage` | 2026-05-22 (Panel thu gọn surface luôn nút **Tiếp tục** khi DOING — không chỉ Evaluate) |
| [`tra-loi-checklist`](tra-loi-checklist/README.md) | Trả lời / đánh giá checklist | `InspectionAnswerPage` | 2026-06-29 (Tối ưu render đáp án inline ≤5 options — không remount toàn list) |
| [`tra-loi-checklist-offline`](tra-loi-checklist-offline/README.md) | Trả lời checklist — chế độ offline | `InspectionAnswerPage` + `lib/offline/` | 2026-07-01 (Spec triển khai: cache snapshot, queue sync, chặn task thủ công) |
| [`cong-viec`](cong-viec/README.md) | Công việc (navbar) | `TaskAssignmentPage` | 2026-06-12 (Avatar header mở hồ sơ người dùng) |
| [`chi-tiet-cong-viec`](chi-tiet-cong-viec/README.md) | Chi tiết / sửa công việc | `TaskAssignmentEditPage` | 2026-06-30 (Quyền đổi status qua API action list, không dùng canUpdate) |
| [`tro-ly-ai`](tro-ly-ai/README.md) | SuSu — trợ lý ảo (bubble global) | `AiAssistantBottomSheet` | 2026-06-02 (Multi-model failover chain + Function calling — SuSu rotate Gemini model khi hit quota; tra cứu báo cáo real-time qua 4 tool: compliance summary/by-site, task progress, quality index) |
