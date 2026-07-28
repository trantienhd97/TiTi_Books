# Báo cáo tiến độ công việc — Task Progress Report

**Main class**: `TaskProgressDetailsListPage`  
**Package**: `packages/supa_work`  
**Location**: `/work/report/home-report/task-progress-details`  
**Navigation**: Triggered by "Xem chi tiết" (View Details) button on the Dashboard Task Progress card

## Overview

This page displays a detailed breakdown of task progress for all users. It shows:

- **Summary metrics** (4-column grid):
  - Done: Count of completed tasks
  - Doing: Count of tasks in progress
  - In Progress (Planned): Count of scheduled tasks
  - Can't do (Blocked): Count of blocked/terminated tasks

- **Per-user task list**:
  - User avatar (with fallback to initials)
  - User name and subtitle (email and employee code)
  - Number of remaining tasks for that user

The page supports the same **date filtering** as the dashboard card. When the user opens the page, data is fetched with the currently applied dashboard filter.

## Architecture

### Data Flow

- **Repository**: `WorkHomeReportRepository`
  - `taskProgressSummary(HomeReportFilter)` → `HomeReportTaskOveralProgressSummary`
  - `taskProgressList(HomeReportFilter)` → `List<HomeReportTaskOveralProgressUser>`

Both API calls are made in parallel during page load via `Future.wait()`.

### Filter Model

- **Input**: `ManagerDashboardFilter?` (passed as route extra)
- **Conversion**: Converted to `HomeReportFilter` for API calls
- **Defaults**: Today's date if not provided

### Models

| Model | Purpose |
|-------|---------|
| `HomeReportTaskOveralProgressSummary` | Summary: completed, doing, todo, terminated counts |
| `HomeReportTaskOveralProgressUser` | Per-user: id, name, email, employeeCode, avatar, numberOfRemainingTasks |

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
