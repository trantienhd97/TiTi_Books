# Học khoá học

| Mục | Giá trị |
|-----|---------|
| Tên màn (UI) | Học khoá học |
| Class chính | `CourseStudyPage` |
| Module | `packages/supa_training` |
| Route | `/training/home-course/home-course-study/:id` |
| Tổng số dòng | 5.322 dòng (`pages/course/*.dart`, `youtube_video_player_widget.dart`, `option_choice.dart`, `true_false_choice.dart`, `course_section_content.dart`, `course_section.dart`, `app_user_course_section_content.dart`) |
| Cập nhật lần cuối | 2026-06-19 — Hiển thị loading tới khi YouTube iframe thực sự sẵn sàng |

## Giới thiệu

Màn **Học khoá học** hiển thị từng nội dung trong một course section: nội dung HTML/file, video, YouTube, slide ảnh, câu hỏi trắc nghiệm/đúng-sai và PDF. User vào màn này từ course actions/list hoặc từ luồng training path.

## Cây thư mục source

```text
packages/supa_training/lib/pages/course/
├── course_study_page.dart              — Màn học chính
├── course_list_page.dart               — Danh sách nội dung trong section
├── course_study_end_page.dart          — Kết thúc section
├── course_actions_page.dart            — Entry actions của course
├── course_preview_page.dart            — Preview course
├── course_assignment_page.dart         — Assignment course
├── course_documents_page.dart
└── audio_player_utils.dart

packages/supa_training/lib/widgets/
├── youtube_video_player_widget.dart    — Player YouTube có kiểm soát tua
├── option_choice.dart                  — Câu hỏi chọn đáp án, countdown timer
└── true_false_choice.dart              — Câu hỏi đúng/sai, countdown timer

packages/supa_training/lib/models/
├── course_section_content.dart         — JsonModel nội dung course section
└── course_section.dart                 — JsonModel section, có getter hiển thị tiến độ

packages/supa_training/lib/core/models/
└── app_user_course_section_content.dart — Response submit đáp án của user
```

## Route & điều hướng

`CourseStudyPage.location` được khai báo trong `packages/supa_training/lib/router/router.dart` với path `/training/home-course/home-course-study`. Route nhận `id` từ path và `extra` gồm `courseSection`, `index`, `isOnlyView`, `trainingPathId`.

Các điều hướng chính:

- Back ở nội dung đầu tiên mở `CourseListPage.location`.
- Continue gọi `TrainingHomePageRepository.nextCourseSectionContent` khi không phải chỉ xem.
- Nội dung cuối chuyển sang `CourseStudyEndPage.location`.

## Widget & component

| Widget / component | File | Vai trò |
|--------------------|------|---------|
| `CourseStudyPage` | `pages/course/course_study_page.dart` | Điều phối load section, render content hiện tại, navigation và fullscreen |
| `VideoPlayerWidget` | `packages/supa_foundation/lib/widgets/video_player_widget.dart` | Player video file/API, nhận `isRewind` để bật/tắt scrubbing |
| `YoutubeVideoPlayerWidget` | `widgets/youtube_video_player_widget.dart` | Player YouTube, chặn seek khi `isRewind == false`; phủ loading tới khi player `cued/playing/paused/ended` |
| `OptionChoice`, `TrueFalseChoice` | `widgets/option_choice.dart`, `widgets/true_false_choice.dart` | Câu hỏi trắc nghiệm/đúng-sai và timer |
| `AudioPlayerWidget` | `widgets/audio_player_widget.dart` | Audio đính kèm cho content |

## State & data

Màn dùng local state trong `_CourseStudyPageState`. Data chính load từ `TrainingHomePageRepository.getCourseSection(id)`, sau đó chọn `_courseSectionContentCurrent` theo `index`. Khi chuyển tiếp trong mode học thật, màn gọi `nextCourseSectionContent(currentContentId, sectionId)` để BE ghi nhận tiến độ.

`CourseSectionContent` deserialize các field nội dung từ BE. Field `allowFirstTimeSkipping` là rule cho video/Youtube: nếu `true`, user được tua ngay cả khi `isCompleted` vẫn `false`; nếu `false` hoặc BE không gửi, behavior giữ nguyên.

`CourseSection.displayProgressPercentage` ưu tiên `completedRate`; nếu BE không trả `completedRate` cho từng lesson thì fallback sang `currentScorePercentage`. `CoursePreviewPage` và `CourseActionsPage` dùng getter này để tránh hiển thị `0%` khi section đã hoàn thành hoặc đã có điểm hiện tại.

Khi submit câu hỏi trắc nghiệm/đúng-sai qua `submitAnswerCourseSectionContent`, một số response BE chỉ trả `isCompleted`, `isCorrect` và nested `courseSectionContent.answeredMessage`, không echo lại `appUserCourseSectionContentAnswerOptions`. `CourseStudyPage` giữ lại danh sách đáp án local vừa chọn nếu response không trả danh sách đáp án để tránh nhầm trạng thái completed-with-empty-answer thành hết thời gian.

## Logic chính

- `initState` load course section, cho phép portrait/landscape và check orientation sau khi mount.
- `buildContent` chọn widget theo `courseSectionContentTypeId`.
- Video file và YouTube truyền `isRewind = isCompleted || allowFirstTimeSkipping`.
- Với video chưa hoàn thành và không được tua lần đầu, player giữ rule cũ: progress không cho scrub/seek trước.
- YouTube giữ lớp loading theo theme sau khi tạo controller và chỉ bỏ lớp phủ khi iframe phát trạng thái sẵn sàng (`cued`, `playing`, `paused` hoặc `ended`), tránh lộ màn hình đen trong lúc tải chậm.
- Bottom navigation của video vẫn bị ẩn cho tới khi video hoàn thành hoặc content đã completed; `allowFirstTimeSkipping` chỉ điều khiển quyền tua, không tự mở nút continue.
- Badge phần trăm ở danh sách lesson và action bar không đọc trực tiếp `completedRate`; dùng `displayProgressPercentage` để tương thích response chỉ có `currentScorePercentage`.
- Sau khi submit đáp án, chỉ thay `appUserCourseSectionContentAnswerOptions` bằng dữ liệu response khi response có danh sách; nếu rỗng thì giữ selection local. Điều kiện "hết thời gian" vẫn dựa trên `_isTimeUp` hoặc completed nhưng không có đáp án thực sự.

## Luồng đặc biệt

```text
Load section
  → chọn content hiện tại
  → render theo type
  → nếu VIDEO/YOUTUBE:
       isRewind = isCompleted || allowFirstTimeSkipping
       onVideoComplete → _isVideoComplete = true
  → Continue → next content hoặc màn kết thúc
```

## Lưu ý khi sửa

- Không dùng `ScaffoldMessenger`; feedback phải đi qua `toastification`.
- Sau khi sửa Dart, chạy `dart format` cho file thay đổi và analyze phạm vi liên quan.
- Nếu thêm UI text mới, dùng `translate('training...')` và partial i18n, không sửa file merge trực tiếp.
- Với video/YouTube, giữ rule `allowFirstTimeSkipping` chỉ tác động quyền tua; không gộp với logic hoàn thành nội dung nếu BE chưa yêu cầu.
- Không dùng `_isInitialized` như tín hiệu duy nhất để ẩn loading YouTube: controller có thể đã được tạo nhưng iframe vẫn chưa sẵn sàng.

## Liên kết

- [Của tôi](../cua-toi/README.md) — Dashboard có section Đào tạo.
