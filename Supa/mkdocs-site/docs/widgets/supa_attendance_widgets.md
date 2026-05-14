# Supa Attendance Widgets

This document provides an overview of the reusable widgets in the `supa_attendance` package.

## AttendanceAppTitle

The `AttendanceAppTitle` widget displays the user's name as the title and a given subtitle. It is used in the app bar.

### Usage

```dart
const AttendanceAppTitle({
  super.key,
  required this.subtitle,
});
```

### Example

```dart
Scaffold(
  appBar: AppBar(
    title: const AttendanceAppTitle(subtitle: 'Today'),
  ),
  body: ...
)
```

## AttendanceCurrentTime

The `AttendanceCurrentTime` widget displays the current time, automatically updating every second.

### Usage

```dart
const AttendanceCurrentTime({
  super.key,
  this.style,
  this.textAlign = TextAlign.center,
});
```

### Example

```dart
const Center(
  child: AttendanceCurrentTime(
    style: TextStyle(fontSize: 24),
  ),
)
```

## AttendanceIconField

The `AttendanceIconField` widget displays a field with an icon, a label, and a value. It can be tappable.

### Usage

```dart
const AttendanceIconField({
  super.key,
  required this.label,
  required this.value,
  required this.icon,
  this.onTap,
  this.color,
});
```

### Example

```dart
AttendanceIconField(
  icon: FluentIcons.clock_24_regular,
  label: 'Time',
  value: '10:00 AM',
  onTap: () {
    // Handle tap
  },
)
```

## AttendanceSetupTitle

The `AttendanceSetupTitle` widget displays the title of a time clock setup and an info button to show the attendance rules.

### Usage

```dart
const AttendanceSetupTitle({
  super.key,
  required this.clockSetup,
});
```

### Example

```dart
AttendanceSetupTitle(
  clockSetup: timeClockSetup,
)
```

## AttendanceShiftName

The `AttendanceShiftName` widget displays the name of a shift.

### Usage

```dart
const AttendanceShiftName({
  super.key,
  required this.shift,
});
```

### Example

```dart
AttendanceShiftName(
  shift: shift,
)
```

## AttendanceStatusBanner

The `AttendanceStatusBanner` widget displays a banner with a message and a status.

### Usage

```dart
const AttendanceStatusBanner({
  super.key,
  required this.message,
  required this.status,
  this.onClose,
});
```

### Enums

#### AttendanceBannerStatus
- `info`
- `error`
- `warning`
- `success`

### Example

```dart
AttendanceStatusBanner(
  message: 'This is an information message.',
  status: AttendanceBannerStatus.info,
  onClose: () {
    // Handle close
  },
)
```
