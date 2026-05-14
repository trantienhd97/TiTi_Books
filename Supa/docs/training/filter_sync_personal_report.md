# Filter Synchronization for Personal Report Pages

## Summary

Đã triển khai đồng bộ filter giữa 3 màn hình trong Personal Report:
- `PersonalReportPage` (trang chủ báo cáo)
- `PersonalReportDetailPage` (trang chi tiết theo site)
- `PersonalReportSiteDetailPage` (trang chi tiết theo user)

## Changes Made

### 1. Router Configuration (`router/router.dart`)

**Before:**
```dart
GoRoute(
  path: PersonalReportDetailPage.location,
  builder: (context, state) => const PersonalReportDetailPage(),
),
```

**After:**
```dart
GoRoute(
  path: PersonalReportDetailPage.location,
  builder: (context, state) {
    final extra = state.extra as Map<String, dynamic>?;
    final filter = extra?['filter'] as PersonalReportMobileSummaryFilterDTO?;
    return PersonalReportDetailPage(
      filter: filter,
    );
  },
),
```

### 2. PersonalReportDetailPage

**Changes:**
- Added optional `filter` parameter to constructor
- Modified `initState` to use the passed filter if provided
- Added `getData()` call after returning from `PersonalReportSiteDetailPage` to reload data

**Key code:**
```dart
class PersonalReportDetailPage extends StatefulWidget {
  final PersonalReportMobileSummaryFilterDTO? filter;

  const PersonalReportDetailPage({
    super.key,
    this.filter,
  });
}

@override
void initState() {
  super.initState();
  // Initialize filter from widget parameter if provided
  if (widget.filter != null) {
    filter = widget.filter!;
  }
  getData();
}
```

### 3. PersonalReportPage

**Changes:**
- Updated navigation to `PersonalReportDetailPage` to pass current filter
- Added `getData()` call after returning from detail page

**Key code:**
```dart
onViewDetails: () async {
  await GoRouter.of(context).push(
    PersonalReportDetailPage.location,
    extra: {
      'filter': filter,
    },
  );
  // Reload data when returning from detail page
  getData();
},
```

### 4. PersonalReportSiteDetailPage

**Changes:**
- Added `getData()` call after returning from `PersonalReportUserDetailPage`

## How It Works

1. **Forward Navigation:** Khi người dùng điều hướng từ một trang sang trang khác, filter hiện tại được truyền qua tham số `extra` trong navigation.

2. **Filter Initialization:** Trang đích nhận filter từ navigation và sử dụng nó để khởi tạo state của mình.

3. **Backward Navigation:** Khi quay lại từ trang chi tiết, trang cha sẽ gọi `getData()` để tải lại dữ liệu với filter hiện tại.

## Flow Example

```
PersonalReportPage (filter A)
  ↓ (passes filter A)
PersonalReportDetailPage (receives filter A, can modify to filter B)
  ↓ (passes current filter)
PersonalReportSiteDetailPage (receives filter, can modify to filter C)
  ↓ (passes current filter)
PersonalReportUserDetailPage (receives filter)
```

Khi quay lại:
- Filter được giữ nguyên giữa các màn hình
- Mỗi màn hình reload data khi nhận focus trở lại

## Testing

Đã kiểm tra:
- ✅ `dart format` - All files formatted correctly
- ✅ `flutter analyze` - No issues found
- ✅ Các trang có thể nhận và sử dụng filter từ navigation

## Benefits

1. **Consistency:** Filter được đồng bộ giữa các trang
2. **User Experience:** Người dùng không bị mất filter khi điều hướng
3. **Data Accuracy:** Data được reload với filter đúng khi quay lại trang
4. **Maintainability:** Code clean và dễ maintain
