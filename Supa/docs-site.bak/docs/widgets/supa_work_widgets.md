# Supa Work Widgets

This document provides an overview of the reusable widgets in the `supa_work` package, following an atomic design structure.

## Atoms

### EnumBadge

The `EnumBadge` widget displays a status badge based on an `EnumModel`. It uses `TextStatusBadge` internally to render the badge with appropriate colors and text.

#### Usage

```dart
const EnumBadge({
  super.key,
  required this.status,
  this.backgroundColor,
});
```

#### Example

```dart
EnumBadge(
  status: someEnumValue,
)
```

### LocationRichText

The `LocationRichText` widget displays a rich text string, highlighting a specific portion of the text. It is typically used for presenting location-related information.

#### Usage

```dart
const LocationRichText({
  super.key,
  required this.firstText,
  required this.highlightedText,
  this.lastText,
});
```

#### Example

```dart
LocationRichText(
  firstText: 'You are currently at ',
  highlightedText: 'Building A',
  lastText: ', Floor 3.',
)
```

### OutOfRangeWarning

The `OutOfRangeWarning` widget displays a warning message indicating that the user is outside a predefined geographical range. It shows the current distance, the maximum allowed distance, and provides an option to navigate to Google Maps.

#### Usage

```dart
const OutOfRangeWarning({
  super.key,
  required this.distance,
  required this.maxAllowedDistance,
  required this.onNavigateToGoogleMaps,
  required this.formattedDistance,
});
```

#### Example

```dart
OutOfRangeWarning(
  distance: 150.0,
  maxAllowedDistance: 100.0,
  formattedDistance: '150 meters',
  onNavigateToGoogleMaps: () {
    // Navigate to Google Maps
  },
)
```

## Molecules

### AnalyticsIconButton

The `AnalyticsIconButton` widget is an icon button that, when tapped, navigates the user to the analytics page associated with a specific board ID.

#### Usage

```dart
const AnalyticsIconButton({
  super.key,
  required this.boardId,
});
```

#### Example

```dart
AnalyticsIconButton(
  boardId: 123,
)
```

### WorkCalendarSwitchViewButton

The `WorkCalendarSwitchViewButton` widget is an icon button used to toggle between a calendar view and a list view. The icon changes dynamically based on the current view.

#### Usage

```dart
const WorkCalendarSwitchViewButton({
  super.key,
  required this.isCalendar,
  required this.onPressed,
});
```

#### Example

```dart
WorkCalendarSwitchViewButton(
  isCalendar: true, // Assuming current view is calendar
  onPressed: () {
    // Toggle view
  },
)
```

### InspectionMetaWidget

The `InspectionMetaWidget` displays essential metadata for an inspection task, including the location (site name) and the deadline/time remaining. It ensures a consistent layout for these details across different list items.

#### Usage

```dart
const InspectionMetaWidget({
  super.key,
  required this.item,
  this.trailing,
});
```

#### Example

```dart
InspectionMetaWidget(
  item: scheduleTimelineItem,
  trailing: InspectionStatusBadge(status: status),
)
```

## Organisms

### AppSearchBarAnalytics

The `AppSearchBarAnalytics` widget is a custom `AppBar` that integrates an analytics icon button, a search field, and a profile button. It provides a consistent header for pages requiring these functionalities.

#### Usage

```dart
AppSearchBarAnalytics({
  super.key,
  required this.searchHint,
  this.onProfilePressed,
  this.onSearch,
  required this.boardId,
});
```

#### Example

```dart
AppSearchBarAnalytics(
  searchHint: 'Search tasks',
  boardId: 123,
  onSearch: () {
    // Handle search action
  },
  onProfilePressed: () {
    // Handle profile button press
  },
)
```

### WorkInspectionEmptyState

The `WorkInspectionEmptyState` widget displays a clear message and a relevant SVG illustration when there are no inspection tasks to show. It includes a title and a subtitle to inform the user.

#### Usage

```dart
const WorkInspectionEmptyState({super.key});
```

#### Example

```dart
WorkInspectionEmptyState()
```

### WorkTaskAssignmentEmptyState

The `WorkTaskAssignmentEmptyState` widget provides a visual indication with an SVG image and a subtitle when there are no task assignments to display, guiding the user in an empty state.

#### Usage

```dart
const WorkTaskAssignmentEmptyState({super.key});
```

#### Example

```dart
WorkTaskAssignmentEmptyState()
```

## Templates

### PageActionsDefault

The `PageActionsDefault` widget provides a standard page layout with a customizable app bar. This app bar includes a back button, a title, and an optional list of actions. The main content of the page is provided through its `body` property and is scrollable.

#### Usage

```dart
const PageActionsDefault({
  super.key,
  required this.body,
  required this.title,
  this.actions,
  this.onGoBack,
  this.backgroundColor,
  this.controller,
});
```

#### Example

```dart
PageActionsDefault(
  title: 'My Page',
  onGoBack: () {
    // Handle custom back action
  },
  actions: [
    IconButton(
      icon: Icon(Icons.settings),
      onPressed: () {
        // Handle settings action
      },
    ),
  ],
  body: Center(
    child: Text('Page Content'),
  ),
)
```