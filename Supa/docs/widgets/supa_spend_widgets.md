# Supa Spend Widgets

This document provides an overview of the reusable widgets in the `supa_spend` package.

## ApprovalHistoryWidget

The `ApprovalHistoryWidget` widget displays the approval history of a request, showing each step of the approval process.

### Usage

```dart
const ApprovalHistoryWidget({
  super.key,
  required this.history,
});
```

### Example

```dart
ApprovalHistoryWidget(
  history: approvalHistory,
)
```

## AttachmentItem

The `AttachmentItem` widget displays a single attachment, which can be either a file or a link. It shows an appropriate icon, the attachment name, and for files, it displays the file size and a download/open button.

### Usage

```dart
const AttachmentItem({
  super.key,
  required this.item,
});
```

### Example

```dart
AttachmentItem(
  item: attachment,
)
```

## AttachmentList

The `AttachmentList` widget displays a list of attachments using the `AttachmentItem` widget for each item in the list.

### Usage

```dart
const AttachmentList({
  super.key,
  required this.files,
  this.showTitle = true,
});
```

### Example

```dart
AttachmentList(
  files: attachments,
)
```

## CatalogImage

The `CatalogImage` widget displays an image from a catalog, handling loading and error states gracefully.

### Usage

```dart
const CatalogImage({
  super.key,
  required this.url,
  this.height,
  this.width,
  this.boxFit,
  this.alignment = Alignment.center,
  this.errorWidget,
});
```

### Example

```dart
CatalogImage(
  url: 'https://example.com/image.jpg',
  width: 100,
  height: 100,
  boxFit: BoxFit.cover,
)
```

## FormAttachmentTab

The `FormAttachmentTab` widget provides a user interface for managing attachments within a form. It allows users to add attachments by taking photos with the camera, selecting images from the gallery, or picking various file types, and then displays these attachments in an `AttachmentList`.

### Usage

```dart
const FormAttachmentTab({
  super.key,
  required this.repository,
  required this.attachments,
  required this.onAddFiles,
});
```

### Example

```dart
FormAttachmentTab(
  repository: myApiClient,
  attachments: myAttachmentsList,
  onAddFiles: (files) {
    // Handle adding new files
)
```

## ItemContentTemplate

The `ItemContentTemplate` widget is designed to display the content of an item in a standardized list format. It features an item image (or a text avatar if no image is available), the item's name and code, its total price, quantity, and unit of measure.

### Usage

```dart
const ItemContentTemplate({
  super.key,
  this.onPressed,
  required this.catalogImageMappings,
  required this.item,
  this.itemName = '',
  required this.total,
  required this.quantity,
  required this.unitOfMeasure,
  required this.currency,
  this.showTopBorder = false,
});
```

### Example

```dart
ItemContentTemplate(
  item: item,
  catalogImageMappings: item.catalogImageMappings.value,
  total: 100.0,
  quantity: 1,
  unitOfMeasure: UnitOfMeasure(name: 'Each'),
  currency: Currency(code: 'USD'),
  onPressed: () {
    // Handle item tap
  },
)
```

## QuickSlidableApprovalActions

The `QuickSlidableApprovalActions` widget provides a slidable interface for performing quick approval or rejection actions on a document. It integrates with `flutter_slidable` to reveal "Approve" and "Reject" buttons.

### Usage

```dart
const QuickSlidableApprovalActions({
  super.key,
  required this.child,
  required this.onApprove,
  required this.onReject,
  this.onDissmissed,
  required this.item,
});
```

### Example

```dart
QuickSlidableApprovalActions(
  item: approvableDocument,
  onApprove: () async {
    // Handle approval
  },
  onReject: () async {
    // Handle rejection
  },
  child: ListTile(
    title: Text('Document Title'),
    subtitle: Text('Document Details'),
  ),
)
```

## RejectionModal

The `RejectionModal` widget is a modal dialog that prompts the user to provide a reason for rejecting an item. It includes a text input field for the reason and action buttons for submission and cancellation.

### Usage

```dart
const RejectionModal({
  super.key,
  required this.title,
  this.description,
  this.descriptionWidget,
  required this.onReject,
  this.onCancel,
});
```

### Example

```dart
showDialog(
  context: context,
  builder: (context) => RejectionModal(
    title: 'Reject Request',
    description: 'Please provide a reason for rejecting this request.',
    onReject: (reason) async {
      // Handle rejection with reason
    },
    onCancel: () {
      // Handle cancellation
    },
  ),
);
```

## TextAreaModal

The `TextAreaModal` widget provides a full-screen modal with a multi-line text input area. It includes a title, a "Cancel" button, and a "Done" button, and a callback for when the input is submitted.

### Usage

```dart
const TextAreaModal({
  super.key,
  required this.title,
  required this.onSubmit,
});
```

### Example

```dart
showModalBottomSheet(
  context: context,
  isScrollControlled: true,
  builder: (context) {
    return TextAreaModal(
      title: 'Enter Reason',
      onSubmit: (value) {
        // Handle submitted text
      },
    );
  },
);
```

