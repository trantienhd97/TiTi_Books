# Release Notes

## Unreleased

## [1.28.0+1280006] - 2026-03-25

### Changed
- **Heads Up Localization**: Fully localized the Heads Up module across 4 languages
  - Replaced hard-coded strings in viewer, detail, and form bottom sheets with `translate()` calls
  - Added new keys (`work.announcement.no_views_yet`, `work.announcement.viewed`, `work.announcement.unconfirmed`) to English, Vietnamese, Korean, and Indonesian language files
  - Merged string maps via `supa_l10n_manager`

### Fixed
- **Project Milestone:** Fixed a bug where updating a milestone's status in `ProjectProjectMilestoneEditPage` would incorrectly map the ID as an object (`milestoneStatus.id`) instead of the numeric value (`milestoneStatus.id.value`), causing the dropdown to display the previous status when reopened.

## [1.28.0+1280005] - 2026-03-24
### Changed
- **Project / Overview Tab:** Redesigned Status Donut Charts and optimized horizontal filter spacing.
  - Refactored `ProjectStatusDonutChart` to display exactly 4 cohesive workflow statuses: Completed (Hoàn thành), Doing (Đang làm), To Do (Cần làm), and Cannot Do (Không thể làm), replacing the previous misleading "overdue" deadline-based metrics.
  - Updated the `ProjectOverview` model to natively consume `numberOfDoing...` and `numberOfTerminated...` fields from the backend `/overview` payload.
  - Implemented dynamic frontend calculation for "To Do" items `(Total - Completed - Doing - Terminated)` since the backend omits the `numberOfNew` counts.
  - Added and merged localized (`vi, en, ko, id`) translations for `overview.status.todo` and `overview.status.cannotDo` via `supa_l10n_manager`.
  - Applied consistent vertical padding (`EdgeInsets.symmetric(horizontal: 16, vertical: 12)`) across `ProjectMilestoneFilterScroll`, `ProjectTaskAssignmentFilterScroll`, and `ProjectFilterScroll` to prevent UI overlap with the top header.

- **Analytics / Manager Dashboard:** Refactor `SiteComplianceDetailsListPage` (Top Weak Compliance Sites details).
  - Changed data source from combined raw analytics APIs (`/summary`, `/list`, `/list-task-assignment`) to the dedicated API `/list-site-by-compliance-rate`.
  - Removed manual frontend compliance rate calculation in favor of backend-provided percentages.
  - Implemented `SiteComplianceDetailsCubit` to fetch up to 200 items in a single request, eliminating the need for `PagingController` (infinite scroll) and streamlining the UI with a lightweight `ListView.separated`.
  - Updated `top_weak_compliance_sites_card.dart` and `router.dart` to navigate using the `ManagerDashboardFilter` directly rather than passing around large Bloc instances.

### Fixed
- **Heads Up / General Dashboard (Bug ID: 18691):** Prevented self-created Heads Up announcements from polluting the author's Home Dashboard unless explicitly assigned.
  - Inserted strict logical checks within `DashboardHeadsUpListWidget`'s `.where` clause for `_fetchPage` and inside the `insertItem` optimistic UI hook.
  - Ensured backend `listMine` payload strictly conforms to targeted delivery requirements without risking backend modifications.
  - Authored official architectural behavior documentation `DOCS.md` distinguishing General Dashboard and Newsfeed menu presentation rules for Heads Up components.

- **Project / Milestones:** Prevented users from modifying the designated Project when creating or editing a Milestone within a project context.
  - Locked the Project selection field by setting `onTap: null` in both `project_milestone_form_page.dart` (creation) and `project_project_milestone_edit_page.dart` (edit).
  - Maintained the default read-only binding to the correct current Project retrieved seamlessly from the underlying database models.

- **Project / Milestones:** Resolved localized UI crashing and data synchronization bugs when linking tasks to milestones.
  - Implemented null-safety checks for `assignee` and `dueAt` fields targeting the inner task iteration loops in `ProjectProjectMilestoneEditPage` and `ProjectMilestoneFormPage` to gracefully display tasks lacking explicit nested join data returned from the backend.
  - Refactored navigational params in `router.dart` and `project_project_milestone_edit_page.dart` to strictly pass down structural IDs, ensuring newly created tasks (`ProjectMilestoneTaskAssignmentFormPage`) inherently bind to their parent `milestoneId`.
  - Replaced the heavy `updateMilestone` overarching submit protocol with localized backend endpoints (`/link-task-assignment`, `/unlink-task-assignment`) inside `ProjectMilestoneEditSelectors` and inline discrete UI action buttons.
  - Introduced the dedicated `ProjectMilestoneLinkTask` data object in the `supa_work` models registry for targeted endpoint linking, drastically optimizing state synchronization size.

- **Images / Overall System:** Implemented Isolate-based background image compression (`ImageCompressUtils`) to fix Out Of Memory (OOM) app crashes when picking or capturing high-resolution photos.
  - Adjusted standard `ImagePickerService` configuration parameters to `1280x1280` max resolution at `80%` quality.
  - Updated `camera_capture_page_new.dart` (Core) and `camera_capture_page.dart` (`supa_project`) to aggressively compress photos via Isolate prior to applying watermark UI overlays.
  - Refactored `abstract_inspection_media_state.dart` across (`supa_project`, `supa_work`) to execute batch background compressions for picker arrays before uploading the payload.
  - Intercepted Task Assignment attachment streams within `task_assignment_form_service.dart`, `task_assignment_edit_selectors.dart`, and `task_assignment_edit_page.dart` (State Updates) to strictly filter and compress `.jpg`, `.jpeg`, `.png` blobs while safely bypassing document extensions like PDFs.

This document contains links to the release notes for each version of the application:

> All version logs go here.

> Note: This file is automatically generated. Do not edit manually.
