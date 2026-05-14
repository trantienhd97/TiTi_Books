# Supa Serving Widgets

This document provides an overview of the reusable widgets in the `supa_serving` package.

## ServingBottomGroupActions

The `ServingBottomGroupActions` widget displays a group of actions at the bottom of the screen. It typically includes a primary "continue" button and an optional "cancel" button.

### Usage

```dart
const ServingBottomGroupActions({
  super.key,
  required this.onContinue,
  required this.continueLabel,
  this.continueIcon,
  this.onCancel,
  this.cancelLabel,
  this.cancelIcon,
  this.isLoading = false,
});
```

### Example

```dart
ServingBottomGroupActions(
  onContinue: () {
    // Handle continue action
  },
  continueLabel: 'Submit',
  onCancel: () {
    // Handle cancel action
  },
  cancelLabel: 'Cancel',
)
```

## ServingTicketDetailView

The `ServingTicketDetailView` widget is a comprehensive view for displaying the details of a serving ticket. It manages loading states, provides a refresh indicator, and shows various pieces of information related to the ticket. It also includes slots for custom bottom actions and extra content.

### Usage

```dart
const ServingTicketDetailView({
  super.key,
  required this.initialTicket,
  this.bottomActions,
  this.extraContent,
  this.showRating = false,
});
```

### Example

```dart
ServingTicketDetailView(
  initialTicket: ticket,
  bottomActions: ServingBottomGroupActions(
    onContinue: () {},
    continueLabel: 'Confirm',
  ),
  extraContent: Text('Extra content here'),
)
```

## ServingFormInfo

The `ServingFormInfo` widget is a tappable field that displays an icon, a label, and a value. It's used to show information in a form-like structure.

### Usage

```dart
const ServingFormInfo({
  super.key,
  required this.label,
  required this.value,
  required this.icon,
  required this.onTap,
  this.color,
});
```

### Example

```dart
ServingFormInfo(
  icon: FluentIcons.person_24_regular,
  label: 'Customer',
  value: 'John Doe',
  onTap: () {
    // Handle tap
  },
)
```

## ServingInformationBadge

The `ServingInformationBadge` widget displays a badge with a title, a description, and a warning icon. It is used to highlight important information.

### Usage

```dart
const ServingInformationBadge({
  super.key,
  required this.title,
  required this.description,
  this.backgroundColor,
  this.foregroundColor,
});
```

### Example

```dart
ServingInformationBadge(
  title: 'Important Information',
  description: 'Please read this before proceeding.',
)
```

## ServingTicketRating

The `ServingTicketRating` widget provides a star rating bar, allowing users to rate a serving ticket.

### Usage

```dart
const ServingTicketRating({
  super.key,
  required this.ticket,
  this.rating,
  this.onRatingChanged,
  this.size = 40,
  this.color,
});
```

### Example

```dart
ServingTicketRating(
  ticket: ticket,
  onRatingChanged: (rating) {
    // Handle rating change
  },
)
```

## ServingWarningBadge

The `ServingWarningBadge` widget displays a dismissible warning message.

### Usage

```dart
const ServingWarningBadge({
  super.key,
  required this.warning,
  required this.onDismiss,
});
```

### Example

```dart
ServingWarningBadge(
  warning: 'This is a warning message.',
  onDismiss: () {
    // Handle dismiss
  },
)
```

## TicketTerminationDialog

The `TicketTerminationDialog` provides a static method `showCancelDialog` to display a dialog for confirming ticket termination.

### Usage

```dart
static Future<void> showCancelDialog(
  BuildContext context, {
  required Ticket ticket,
  VoidCallback? onCancelSuccess,
  VoidCallback? onCancelError,
})
```

### Example

```dart
TicketTerminationDialog.showCancelDialog(
  context,
  ticket: ticket,
  onCancelSuccess: () {
    // Handle success
  },
  onCancelError: () {
    // Handle error
  },
);
```
