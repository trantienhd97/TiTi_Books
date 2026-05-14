# supa_communication Integration: v1.24-safe Re-wiring Guide

> **Scope**: Cherry-pick only `supa_communication` wiring. Excludes unreleased `supa_work`/`supa_project` route changes. `packages/supa_communication/` is copied verbatim.
>
> **Applies to**: `packages/supa_foundation/` + root `lib/` + `android/` + `assets/`.

---

## 1. `pubspec.yaml` — Dependencies & Assets

### Add under `dependencies:`
```yaml
  supa_communication:
    path: packages/supa_communication

  # Stream Chat SDK
  stream_chat_flutter: ^9.23.0
  stream_chat_persistence: ^9.22.0
  stream_chat_localizations: ^9.22.0
  stream_video: ^1.2.2
  stream_video_flutter: ^1.2.2

  # Media (needed by supa_communication video player)
  media_kit: ^1.1.10+1
  media_kit_video: ^2.0.0
  media_kit_libs_video: ^1.0.4

  # Utilities required by supa_communication
  cross_file: ^0.3.5+2
  collection: ^1.19.1
  firebase_analytics: ^12.1.1
  flutter_map: ^8.2.2
  latlong2: ^0.9.1
```

Upgrade: `media_picker_plus: ^1.1.0-rc.10` → `^1.1.0-rc.15`

### Add under `flutter: assets:`
```yaml
    - assets/sounds/telegram_notification.mp3
    - assets/images/announcement_camera.svg
    - assets/images/announcement_video.svg
    - assets/images/announcement_document.svg
    - assets/images/face-id.svg
    - assets/images/check.svg
    - assets/images/quizz_default.jpg
    - assets/images/course_default.jpg
    - assets/images/headup_default.jpg
    - assets/images/welcome-slide-01.png
    - assets/images/welcome-slide-02.png
    - assets/images/welcome-slide-03.png
    - assets/images/welcome-slide-04.png
```

Also add `flutter_local_notifications` to `supa_foundation/pubspec.yaml` if not already present.

---

## 2. `lib/main.dart` — Bootstrap

```dart
// Add imports
import 'package:media_kit/media_kit.dart';
import 'package:supa_communication/communication_app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();  // ADD before AppLoader
  MediaKit.ensureInitialized();               // ADD

  final loader = AppLoader(...);
  // rest unchanged
}

void _registerApps() {
  // ... existing ...
  AppRegistry.registerApp('/communication', CommunicationApp()); // ADD
  // Keep /project and /work registrations unchanged from v1.24
}
```

---

## 3. `lib/config/get_it.dart` — Dependency Injection

```dart
import 'package:supa_communication/config/get_it.dart'; // ADD

Future<void> configureDependencies() async {
  // ... existing calls ...
  configureCommunicationDependencies(); // ADD (alphabetically after configureBibsDependencies)
}
```

---

## 4. `lib/config/notification_handlers.dart` — Notification Prefix Registration

```dart
import 'package:supa_communication/notification/communication_notification_handler.dart'; // ADD

void registerNotificationHandlers() {
  // ... existing prefixes ...

  NotificationHandlerFactory.registerPrefix(   // ADD
    '/communication',
    (context) => CommunicationNotificationHandler(context),
  );
}
```

---

## 5. `lib/modules/general/router/router.dart` — Add Communication Route Only

> **Do NOT** import or register `supa_work`/`supa_project` routes — those are unreleased.

Add only the communication conversations route:

```dart
// ADD import
import 'package:supa_communication/pages/conversations/communication_conversations_page.dart';

// ADD route definition
final GoRoute _generalCommunicationRoute = GoRoute(
  path: CommunicationConversationsPage.location,
  builder: (context, state) => const CommunicationConversationsPage(),
);

// ADD to ShellRoute routes list (alongside existing _generalDashboardRoute etc.)
ShellRoute(
  routes: [
    _generalAppsRoute,
    _generalDashboardRoute,
    _generalDiscussionRoute,
    _generalNotificationRoute,
    _generalCommunicationRoute, // ADD
  ],
  builder: ...
)
```

Also add `CustomizeNavbarPage` route to `_generalRootRoutes`:
```dart
// ADD import
import 'package:supa/modules/general/pages/customize_navbar/customize_navbar_page.dart';

// ADD to _generalRootRoutes
GoRoute(
  path: CustomizeNavbarPage.location,
  builder: (context, state) => const CustomizeNavbarPage(),
),
```

---

## 6. `lib/modules/general/pages/customize_navbar/customize_navbar_page.dart` — New File

**Copy verbatim from current branch.** This is a new file not present in v1.24.

Key details:
- Route: `resolveSupaPath('/customize-navbar')`
- Reads/writes `pinned_navbar_tabs` and `hidden_navbar_tabs` keys in `persistentStorage`
- Limits pinned items to 2; shows all tabs from `buildDefaultMainTabs()`

---

## 7. `lib/modules/general/pages/general_navbar.dart` — Navbar Overhaul

**Copy verbatim from current branch.**

This replaces `DiscussionPage` with `CommunicationConversationsPage` (Messages tab), adds real-time unread count badge via `CommunicationChatClientCubit`, and supports customizable pinned tabs.

Key dependencies from `supa_communication` that must be present:
- `package:supa_communication/config/dotenv.dart` → `dotenv.streamApiKey`
- `package:supa_communication/cubits/chat_client/communication_chat_client_cubit.dart`
- `package:supa_communication/cubits/chat_client/communication_chat_client_state.dart`
- `package:supa_communication/pages/conversations/communication_conversations_page.dart`

> **Note**: `ScaffoldNavbar` in `supa_foundation` must be patched first (§11) or this file will not compile.

---

## 8. `lib/modules/general/pages/main_tabs_bottom_sheet.dart` — Refactor

**Copy verbatim from current branch.**

Key changes from v1.24:
- Now reads `pinned_navbar_tabs` and `hidden_navbar_tabs` to filter tabs displayed
- "Customize Navbar" button now navigates to `CustomizeNavbarPage` (was a TODO)
- Requires `hiddenSubsystemIdsInMainTabsBottomSheet` from `supa_foundation/config/sub_system.dart` (§14)
- `_MainTabItem` renamed to `_MainTabDestinationItem` with active state

---

## 9. `lib/config/main_tabs.dart` — Add activeIcon Field

Add the optional `activeIcon` field to `MainTab` and populate each tab:

```dart
class MainTab {
  const MainTab({
    required this.title,
    required this.icon,
    this.activeIcon,        // ADD
    required this.path,
  });

  final String title;
  final IconData icon;
  final IconData? activeIcon;  // ADD
  final String path;
}
```

Add `activeIcon` to each tab definition (filled variant of each icon, e.g.,
`FluentIcons.clipboard_task_list_ltr_24_filled`). **Do NOT** change the page routes —
keep all existing v1.24 page references unchanged.

---

## 10. `android/app/src/main/AndroidManifest.xml` — POST_NOTIFICATIONS Permission

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

Add after existing `<uses-permission>` entries.

---

## 11. `packages/supa_foundation/lib/widgets/templates/scaffold_navbar.dart` — API Extension

`general_navbar.dart` uses two new named parameters that must be added:

```dart
class ScaffoldNavbar extends StatelessWidget {
  // ADD these two fields:
  final int? Function(List<ScaffoldNavbarItem> items, String currentLocation)?
      selectedIndexBuilder;
  final void Function(BuildContext bodyContext)? onBodyContextReady;

  const ScaffoldNavbar({
    // ... existing params ...
    this.selectedIndexBuilder,   // ADD
    this.onBodyContextReady,     // ADD
  });
```

**`build` changes:**
1. Replace `_getCurrentIndex(items, currentLocation)` with:
   ```dart
   final currentIndex = selectedIndexBuilder?.call(items, currentLocation)
       ?? _getCurrentIndex(items, currentLocation);
   ```
2. Wrap `child` in an inner `Navigator` when `onBodyContextReady` is set:
   ```dart
   final Widget bodyContent = onBodyContextReady != null
       ? Navigator(
           pages: [MaterialPage<void>(child: Builder(builder: (bodyCtx) {
             WidgetsBinding.instance.addPostFrameCallback((_) {
               onBodyContextReady!(bodyCtx);
             });
             return child;
           }))],
           onDidRemovePage: (_) {},
         )
       : child;
   // use bodyContent in Scaffold body:
   body: bodyContent,
   ```
3. Extract `onDestinationSelected` logic into a private method `_onDestinationSelected` to keep `build` readable (see diff).

---

## 12. `packages/supa_foundation/lib/router/app_registry.dart` — Recursive Child Route Mapping

Required so nested communication routes (chat detail, files, links, members, search) are correctly wrapped with `AppThemeWrapper`.

**Two places in `mapRoute`** — add recursive child mapping:

```dart
// In the GoRoute branch (line ~55):
GoRoute(
  path: appConfig.prefix + route.path,
  builder: (context, state) { ... },
  routes: route.routes.map((child) => mapRoute(child)).toList(), // ADD
);

// In the ShellRoute sub-routes loop (line ~79):
GoRoute(
  path: subRoute.path,
  builder: (context, state) { ... },
  routes: subRoute.routes.map((child) => mapRoute(child)).toList(), // ADD
);
```

Also remove the `ModuleRouteCollection`/`ModuleRouteProvider` references that are now gone:
- Remove `static final Map<String, ModuleRouteCollection> _moduleCollections = {};`
- Remove `moduleRouteCollections` getter
- Remove `excludeModuleProviders` parameter from `getRoutes()`
- Remove `ModuleRouteProvider` check in `registerApp`

Replace `state.data.toUserNotification()` with `resolveUserNotificationForRouting(state.data)` in `PushNotificationOpened` handler, and add the `PushNotificationDataOnlyOpened` branch (see §13).

---

## 13. Push Notification Pipeline — Four Files in `supa_foundation`

These four files must all be updated together for GetStream data-only notifications to work.

### 13a. NEW: `packages/supa_foundation/lib/utils/push_notification_user_notification_resolver.dart`

**Copy verbatim from current branch.** This new file provides:
- `resolveUserNotificationForRouting(NotificationData)` — builds `linkMobile` for GetStream chat notifications
- `resolveUserNotificationForDataOnlyPayload(PushNotificationPayload, String?)` — handles Android FCM data-only payloads

### 13b. NEW: `packages/supa_foundation/lib/services/local_notification_service.dart`

**Copy verbatim from current branch.** This new file:
- Shows local notifications for data-only FCM messages (GetStream on Android)
- Handles notification tap → emits `DidUserOpenedDataOnlyNotificationEvent`
- Requires `flutter_local_notifications` package in `supa_foundation/pubspec.yaml`

### 13c. UPDATE: `packages/supa_foundation/lib/app_loader.dart`

```dart
// Change import:
// OLD: import 'package:supa_foundation/services/badge_service.dart';
// NEW:
import 'package:supa_foundation/services/local_notification_service.dart';

// Add @pragma annotation to class:
@pragma('vm:entry-point')
class AppLoader { ... }

// In _initializeCommon(), after Firebase init:
if (firebaseOptionsProvider != null) {
  initializers.add(LocalNotificationService.initialize());
}

// Replace _firebaseMessagingBackgroundHandler body:
@pragma('vm:entry-point')
static Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await LocalNotificationService.initialize();
  await LocalNotificationService.showNotificationForDataMessage(message);
}
```

### 13d. UPDATE: `packages/supa_foundation/lib/widgets/templates/push_notification_wrapper.dart`

**Copy verbatim from current branch.** Key additions:
- Import `ActiveChatTracker` and `push_notification_user_notification_resolver.dart`
- In `PushNotificationReceived` handler: suppress toast when `ActiveChatTracker.isActiveChannel(incomingCid)` is true (user is already viewing that chat)
- Use `resolveUserNotificationForRouting` instead of `.toUserNotification()`
- Add handler for `PushNotificationDataOnlyReceived` state

Also update `app_registry.dart`'s `PushNotificationOpened` handler to use `resolveUserNotificationForRouting`, and add `PushNotificationDataOnlyOpened` handling (see §12).

---

## 14. `packages/supa_foundation/lib/config/sub_system.dart` — Hidden Subsystem IDs

Add at the end of the file:

```dart
/// Subsystems hidden from MainTabsBottomSheet (shown in dedicated navbar tabs).
final Set<int> hiddenSubsystemIdsInMainTabsBottomSheet = {
  AppSubSystem.work.id,
  AppSubSystem.training.id,
  AppSubSystem.project.id,
};
```

---

## 15. New Foundation Files (Compile Blockers for `supa_communication`)

### 15a. NEW: `packages/supa_foundation/lib/config/logout_hook.dart`

```dart
/// Hook invoked before user logout so features (e.g. chat client) can clean up.
abstract class ILogoutHook {
  Future<void> onBeforeLogout();
}
```

### 15b. NEW: `packages/supa_foundation/lib/services/active_chat_tracker.dart`

```dart
class ActiveChatTracker {
  String? _activeChannelCid;

  bool isActiveChannel(String? cid) {
    if (cid == null || cid.isEmpty) return false;
    return _activeChannelCid == cid;
  }

  void setActiveChannelCid(String? cid) {
    _activeChannelCid = cid;
  }
}
```

### 15c. UPDATE: `packages/supa_foundation/lib/config/get_it.dart`

```dart
import 'package:supa_foundation/services/active_chat_tracker.dart'; // ADD

Future<void> configureFoundationDependencies() async {
  getIt.registerLazySingleton<FileHandler>(() => FileHandler());
  getIt.registerLazySingleton<ActiveChatTracker>(() => ActiveChatTracker()); // ADD
  getIt.init();
}
```

---

## 16. Translation Files

`assets/i18n/*/communication.json` **already exist in v1.24** but need to be updated with new keys added in this branch. Copy the content from the current branch for all 4 locales:
- `assets/i18n/en/communication.json`
- `assets/i18n/vi/communication.json`
- `assets/i18n/ko/communication.json`
- `assets/i18n/id/communication.json`

Update `assets/i18n/*/general.json` partial files — add missing keys (copy translated values from current branch for each locale):
```json
"mainTabs.actionHide": "...",
"mainTabs.actionPin": "...",
"mainTabs.actionShow": "...",
"mainTabs.actionUpdate": "...",
"mainTabs.customizeNavbarPageTitle": "...",
"mainTabs.hiddenSection": "...",
"mainTabs.maxPinnedReached": "...",
"mainTabs.othersSection": "...",
"mainTabs.pinnedSection": "...",
"tabs.messages": "...",
"tabs.mytasks": "..."
```

After editing partial files, regenerate merged files:
```sh
dart run supa_l10n_manager merge
```

---

## 17. Verification Checklist

- [ ] `flutter pub get` succeeds in root and `packages/supa_foundation`
- [ ] `flutter analyze` passes (no new errors)
- [ ] `dart format lib/ packages/supa_foundation/lib/` passes
- [ ] App builds for Android and iOS
- [ ] Messages tab appears in bottom navbar with unread badge counter
- [ ] Tapping "Others" opens `MainTabsBottomSheet`
- [ ] "Customize Navbar" → `CustomizeNavbarPage` opens and saves preferences
- [ ] Pinning tabs updates navbar on next hot-restart / didChangeDependencies
- [ ] Push notification from GetStream routes to correct chat page
- [ ] GetStream data-only notification (Android) shows local notification
- [ ] Chat client initializes on login; logs out on sign-out / tenant switch
- [ ] `CommunicationConversationsPage` loads and navigation to chat detail works
- [ ] No route errors for nested chat routes (detail, files, links, members)
