# Supa Bibs Widgets

This document provides an overview of the reusable widgets in the `supa_bibs` package, following an atomic design structure.

## Molecules

### ActionLine

The `ActionLine` widget is a tappable row, typically used for navigation or actions. It displays a label on the left, an optional value on the right, and a chevron icon to indicate it's tappable.

#### Usage

```dart
const ActionLine({
  super.key,
  required this.label,
  this.value,
  this.onPressed,
});
```

#### Example

```dart
ActionLine(
  label: 'Profile',
  value: 'View and edit',
  onPressed: () {
    // Navigate to profile page
  },
)
```

### DataLine

The `DataLine` widget is a simple row for displaying a label and a corresponding value.

#### Usage

```dart
const DataLine({
  super.key,
  required this.label,
  this.value,
});
```

#### Example

```dart
DataLine(
  label: 'Email',
  value: 'test@example.com',
)
```

## Organisms

### FilterSelectionField

The `FilterSelectionField` widget is a non-editable text field that is used to trigger a selection, typically for filtering. It displays a label, hint text, and a suffix icon. Tapping on it triggers the `onTap` callback.

#### Usage

```dart
const FilterSelectionField({
  super.key,
  required this.controller,
  required this.labelText,
  required this.hintText,
  required this.suffixIcon,
  required this.onTap,
});
```

#### Example

```dart
FilterSelectionField(
  controller: _filterController,
  labelText: 'Status',
  hintText: 'Select a status',
  suffixIcon: Icons.arrow_drop_down,
  onTap: () {
    // Show a dialog to select a status
  },
)
```

## Templates

### MasterListItem

The `MasterListItem` widget is a container for a list item that provides a consistent styling and a tappable area.

#### Usage

```dart
const MasterListItem({
  super.key,
  required this.onPressed,
  required this.child,
});
```

#### Example

```dart
MasterListItem(
  onPressed: () {
    // Handle item tap
  },
  child: const Padding(
    padding: EdgeInsets.all(16.0),
    child: Text('This is a list item'),
  ),
)
```

### SearchModal

The `SearchModal` is a generic and reusable widget for searching and selecting an entity from a list. It provides a search field, handles fetching and filtering data, and displays the results in a list.

#### Usage

```dart
const SearchModal({
  super.key,
  required this.onSelected,
  this.branchId,
  required this.filterList,
  required this.filter,
  required this.renderTile,
  required this.label,
  required this.title,
  this.floatingActionButton,
});
```

#### Example

```dart
SearchModal<User, UserFilter>(
  title: 'Search User',
  label: 'Search by name',
  filter: UserFilter(),
  filterList: (filter) => userRepository.getUsers(filter),
  onSelected: (user) {
    // Handle selected user
  },
  renderTile: (user) => Text(user.name),
)
```
