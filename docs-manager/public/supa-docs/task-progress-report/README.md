# Báo cáo tiến độ công việc — Task Progress Report

**Main class**: `TaskProgressDetailsListPage`  
**Package**: `packages/supa_work`  
**Location**: `/work/report/home-report/task-progress-details`  
**Navigation**: Triggered by "Xem chi tiết" (View Details) button on the Dashboard Task Progress card  
**Cập nhật lần cuối**: 2026-07-27 — Trang chi tiết dùng `POST /task-overal-progress/list-by-site`; dashboard vẫn `/list` theo user.

## Overview

This page displays a detailed breakdown of task progress **grouped by site**. It shows:

- **Summary metrics** (4-column grid):
  - Done: Count of completed tasks
  - Doing: Count of tasks in progress
  - In Progress (Planned): Count of scheduled tasks
  - Can't do (Blocked): Count of blocked/terminated tasks

- **Per-site task list** từ `POST /task-overal-progress/list-by-site`:
  - Site icon + name (+ code)
  - Badge: còn lại (NEW/DOING) hoặc tổng `numberOfTasks` khi không còn dang dở
  - Tap → bottom sheet danh sách `taskAssignments` của địa điểm

The page supports the same **date filtering** as the dashboard card. When the user opens the page, data is fetched with the currently applied dashboard filter.

## Architecture

### Data Flow

- **Repository**: `WorkHomeReportRepository`
  - `taskProgressSummary(HomeReportFilter)` → `HomeReportTaskOveralProgressSummary`
  - `taskProgressListBySite(HomeReportFilter)` → `List<HomeReportTaskOveralProgressSite>`
  - Dashboard card vẫn dùng `taskProgressList` (theo user) — không đổi.

Both API calls are made in parallel during page load via `Future.wait()`.

### Filter Model

- **Input**: `ManagerDashboardFilter?` (passed as route extra)
- **Conversion**: Converted to `HomeReportFilter` for API calls
- **Defaults**: Today's date if not provided

### Models

| Model | Purpose |
|-------|---------|
| `HomeReportTaskOveralProgressSummary` | Summary: completed, doing, todo, terminated counts |
| `HomeReportTaskOveralProgressSite` | API list-by-site: id, code, name, address, numberOfTasks, taskAssignments |
| `HomeReportTaskOveralProgressUser` | API list theo user (dashboard) |

## UI Components

### _buildSummaryMetrics()

Displays 4 status cards in a responsive GridView:
- Uses `summary.completed`, `summary.doing`, `summary.todo`, `summary.terminated`
- Each card shows count + translated label
- Uses `colorScheme.surfaceContainer` background

### _buildStatusCard()

Single metric card with:
- Large bold count (titleMedium font weight)
- Label text (labelSmall font, centered, ellipsis)

### _buildUserCard()

Per-user row with:
- **Avatar section**: Circular image or initial badge (40×40)
- **User info**: Name (w600), subtitle (email · code), in expanded column
- **Task count**: Right-aligned remaining task count with label

## Localization Keys

| Key | Default |
|-----|---------|
| `general.dashboard.taskProgress.done` | "Done" |
| `general.dashboard.taskProgress.doing` | "Doing" |
| `general.dashboard.taskProgress.inProgress` | "In Progress" |
| `general.dashboard.taskProgress.cantDo` | "Can't do" |
| `general.dashboard.taskProgress.remaining` | "Remaining" |
| `general.dashboard.taskProgress.title` (AppBar) | "Task Progress" |
| `work.analytics.noData` | No data message |
| `work.navbar.taskProgressReport` | Page title |

## Routing

Defined in `packages/supa_work/lib/router/router.dart`:

```dart
GoRoute(
  path: TaskProgressDetailsListPage.location,
  builder: (context, state) {
    final filter = state.extra as ManagerDashboardFilter?;
    return TaskProgressDetailsListPage(filter: filter);
  },
),
```

## Integration Points

### Dashboard ("Của tôi" page)

- **Widget**: `DashboardTaskProgressSection`
- **Callback**: `onTapDetail` → `_openTaskProgressReport()`
- **Navigation**: Creates a default `ManagerDashboardFilter(today)` and pushes route

### General Dashboard Page

Method `_openTaskProgressReport()` in `lib/modules/general/pages/general_dashboard/general_dashboard_page.dart`:

```dart
void _openTaskProgressReport(BuildContext context) {
  final filter = ManagerDashboardFilter(
    dateLabel: translate('general.dateTime.today'),
  )..dateTypeId.equal = DateTypeEnum.today.id;

  GoRouter.of(context).push(
    TaskProgressDetailsListPage.location,
    extra: filter,
  );
}
```

## States

| State | UI |
|-------|-----|
| **Loading** | `CircularProgressIndicator()` centered |
| **Empty** | Centered message: `translate('work.analytics.noData')` |
| **Loaded** | CustomScrollView with summary + user list |

## Refresh

- **Pull-to-refresh**: Enabled via `RefreshIndicator`
- **Handler**: `_load()` method, debounced via `_inflight` future

## Notes

- Data loading is parallelized for better UX
- The `mounted` check prevents memory leaks when disposing
- User avatars gracefully fall back to initials if missing
- Remaining tasks count per user comes from the API's `numberOfRemainingTasks` field (represents overdue task count in current context)
