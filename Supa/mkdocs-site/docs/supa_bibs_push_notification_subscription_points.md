# PushNotificationBloc Subscription Points in supa_bibs

This document lists all the places in the supa_bibs sub-application where the `PushNotificationBloc` is subscribed to reload data when notifications are received.

## 1. Retail Order Detail Page
**File:** `packages/supa_bibs/lib/pages/booking/retail_order/retail_order_detail_page.dart`

**Location:** Line 143-147

**Implementation:**
```dart
return BlocListener<PushNotificationBloc, PushNotificationState>(
  listener: (context, state) {
    if (state is PushNotificationReceived) {
      _getDetails();
    }
  },
  child: ...
```

**Purpose:** Reloads retail order details when a push notification is received, ensuring the UI reflects any updates to the order.

## 2. Sales Order Table List Page
**File:** `packages/supa_bibs/lib/pages/booking/sales_order/sales_order_table_list_page.dart`

**Location:** Line 81-85

**Implementation:**
```dart
return BlocListener<PushNotificationBloc, PushNotificationState>(
  listener: (context, state) {
    if (state is PushNotificationReceived) {
      _refreshTableList();
    }
  },
  child: ...
```

**Purpose:** Refreshes the list of billiard tables when a push notification is received, showing any changes to table statuses.

## 3. Sales Order Detail Page
**File:** `packages/supa_bibs/lib/pages/booking/sales_order/sales_order_detail_page.dart`

**Location:** Line 60-64

**Implementation:**
```dart
child: BlocListener<PushNotificationBloc, PushNotificationState>(
  listener: (context, state) {
    if (state is PushNotificationReceived) {
      _bookingBloc.add(BookingTableGetDetailEvent());
    }
  },
  child: ...
```

**Purpose:** Triggers a refresh of the booking table details when a push notification is received by dispatching a `BookingTableGetDetailEvent()` to the `BookingBloc`.

## Summary
All three subscription points follow the same pattern of listening for `PushNotificationReceived` state and then triggering a data reload method to update the UI with fresh information from the backend. This ensures that users see real-time updates when push notifications are received.