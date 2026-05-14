# Entity-Chat Integration Guide

How to embed a live GetStream chat inside an entity edit page (e.g. TaskAssignment,
Issue, Checklist). This documents the pattern established by **TaskAssignment** and
is the reference for adding chat to any new entity.

---

## Table of Contents

1. [Architecture overview](#1-architecture-overview)
2. [Key components](#2-key-components)
3. [Step-by-step integration](#3-step-by-step-integration)
4. [Reference implementation – TaskAssignment](#4-reference-implementation--taskassignment)
5. [Core System Rules (Tenant & Upload)](chat-core-rules.md)
6. [Checklist](#6-checklist)

---

## 1. Architecture overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  XxxEditPage  (pure entity logic – data, form, actions)             │
│                                                                     │
│    build()                                                          │
│      └── _XxxChatShell(                                             │
│            streamRequest: _currentStreamRequest,   ◄─ resolved CID │
│            messageListHeaderBuilder: _buildHeader, ◄─ entity UI    │
│          )                                                          │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ owns EntityChatMixin
┌──────────────────────────▼──────────────────────────────────────────┐
│  _XxxChatShell  (chat infrastructure only)                          │
│                                                                     │
│    getStreamRequest → widget.streamRequest                          │
│    initState()      → initChat()                                    │
│    dispose()        → disposeChat()                                 │
│    build()          → buildChatWidget(                              │
│                          messageListHeaderBuilder: …)               │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│  EntityChatMixin  (packages/supa_communication)                     │
│                                                                     │
│  • ConversationChatBloc – loads/creates the GetStream channel       │
│  • StreamMessageInputController – message input state               │
│  • AudioPlayer + HapticFeedback – incoming message feedback         │
│  • ActiveChatTracker – marks channel as "currently open"            │
│  • ConversationMetadataCubit – pinned messages, metadata            │
│                                                                     │
│  Exposes:                                                           │
│    String get getStreamRequest  ← must override                     │
│    void initChat()              ← call in initState                 │
│    void disposeChat()           ← call in dispose                   │
│    Widget buildChatWidget(...)  ← renders the full chat UI          │
│    Widget buildStickyChatSection(...)  ← bottom-anchored variant    │
└─────────────────────────────────────────────────────────────────────┘
```

### Channel resolution priority (inside the entity page)

```
widget.cid (passed from router/navigator)
  │ non-empty?  →  use directly
  ▼
taskAssignment.getStreamRequest.value  (from entity model)
  │ non-empty?  →  use directly
  ▼
taskAssignment.requestProperty.value
  │ non-empty?  →  use directly
  ▼
'<EntityType>:<entityId>'  (fallback, triggers server-side channel creation)
```

If the resolved request is **not** a Stream CID (i.e. does not start with a
known channel type like `messaging:`, `team:`, etc.) the page calls
`GetStreamConversationRepository.getConversation()` once to resolve the real
CID and then rebuilds via `setState`.

---

## 2. Key components

### `EntityChatMixin<T>` — `packages/supa_communication/lib/widgets/abstract_entity_chat.dart`

The mixin that any `State<T>` class can use to get a full chat experience.

| Member | Description |
|---|---|
| `String get getStreamRequest` | **Abstract.** Return the channel identifier: either a raw CID (`messaging:abc`) or a typed request (`TaskAssignment:123`). |
| `bool get showPinnedMessagesBanner` | Override to hide the banner. Default `true`. |
| `void onChannelReady(Channel)` | Override to react when the channel is loaded. |
| `void initChat()` | Call once in `initState`. |
| `void disposeChat()` | Call once in `dispose`. |
| `Widget buildChatWidget({headerBuilder, messageListHeaderBuilder})` | Renders the complete embedded chat. Pass `messageListHeaderBuilder` to show entity content above the message list. |
| `Widget buildStickyChatSection({height, headerBuilder})` | Bottom-anchored variant with a fixed height and a top divider. |

### `_XxxChatShell` — private widget inside the entity page file

A thin `StatefulWidget` that owns `EntityChatMixin` and delegates rendering to
`buildChatWidget`. Separates chat infrastructure from entity business logic.
See [step 2](#step-2-create-the-chat-shell-widget) below.

### `MessageOpener` — `packages/supa_communication/lib/message_openers/message_opener.dart`

Controls what happens when a user taps a conversation in the global channel list
page. Each entity type registers its own opener.

```dart
abstract class MessageOpener {
  bool canOpen(Channel channel);            // return true to claim this channel
  Future<void> open(BuildContext context, Channel channel);
}
```

### `MessageOpenerRegistry` — singleton

```dart
// Registration (done once, during DI setup)
MessageOpenerRegistry.instance.register(XxxMessageOpener());

// Usage (channel list tap handler – already wired up)
MessageOpenerRegistry.instance.open(context, channel);
```

Openers are checked in **reverse registration order** (last registered = first
checked). The built-in `DefaultMessageOpener` (always returns `canOpen = true`)
is always at the end of the chain as a fallback.

---

## 3. Step-by-step integration

> Assumed: you have an existing `XxxEditPage` with a standard CRUD form and a
> GoRouter route.

### Step 1 — Add `cid` parameter to the page widget

```dart
class XxxEditPage extends StatefulWidget {
  static final location = resolveXxxPath('/xxx/edit');

  // ✅ NEW: builds URL with optional channel CID
  static String locationWithId(int id, {String? cid}) {
    final base = location.withId(id);
    if (cid == null || cid.isEmpty) return base;
    return '$base&cid=${Uri.encodeQueryComponent(cid)}';
  }

  final int id;
  final Xxx? xxx;
  final String? cid;  // ✅ NEW

  const XxxEditPage({super.key, required this.id, this.xxx, this.cid});

  @override
  State<XxxEditPage> createState() => _XxxEditPageState();
}
```

### Step 2 — Create the chat shell widget

Add this **at the bottom of the same file** as `XxxEditPage`. It is private to
the file (`_` prefix) to keep the public API clean.

```dart
class _XxxChatShell extends StatefulWidget {
  final String streamRequest;
  final WidgetBuilder messageListHeaderBuilder;

  const _XxxChatShell({
    required this.streamRequest,
    required this.messageListHeaderBuilder,
  });

  @override
  State<_XxxChatShell> createState() => _XxxChatShellState();
}

class _XxxChatShellState extends State<_XxxChatShell>
    with EntityChatMixin<_XxxChatShell> {
  @override
  String get getStreamRequest => widget.streamRequest;

  @override
  void initState() {
    super.initState();
    initChat();
  }

  @override
  void dispose() {
    disposeChat();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return buildChatWidget(
      messageListHeaderBuilder: widget.messageListHeaderBuilder,
    );
  }
}
```

### Step 3 — Keep entity state clean (no EntityChatMixin)

`_XxxEditPageState` should **not** use `EntityChatMixin`. The state class only
handles entity-specific logic: fetching data, form controllers, status updates.

```dart
class _XxxEditPageState extends State<XxxEditPage> with SaveStatusMixin {
  // CID resolution fields
  String? _resolvedStreamCid;
  String? _lastResolvedByRequest;
  bool _isInitialLoad = true;

  // Computed request passed down to the shell
  String get _currentStreamRequest {
    if (_resolvedStreamCid != null && _resolvedStreamCid!.isNotEmpty) {
      return _resolvedStreamCid!;
    }
    // Fallback chain: model field → type:id
    final modelRequest = xxx.getStreamRequest.value.trim();
    if (modelRequest.isNotEmpty) return modelRequest;
    return 'Xxx:${widget.id}';
  }

  @override
  void initState() {
    super.initState();
    _resolvedStreamCid = widget.cid?.trim();  // ← seed from navigation
    // ... other init
  }
```

### Step 4 — Resolve the channel CID after data loads

Call this after the main data fetch. It resolves a typed request like
`Xxx:123` to a real channel CID and triggers a rebuild so the shell
reloads with the correct channel.

```dart
Future<void> _resolveChatChannelByRequest() async {
  final request = _currentStreamRequest.trim();
  // Skip if it's already a CID (contains known channel type prefix)
  if (request.isEmpty || _isLikelyStreamChannelCid(request)) return;
  if (_lastResolvedByRequest == request) return;

  _lastResolvedByRequest = request;
  try {
    final payload = GetStreamGetConversationPayload()
      ..getStreamRequest.value = request;
    final response = await GetIt.instance
        .get<GetStreamConversationRepository>()
        .getConversation(payload);
    final cid = response.channel.value.cid.value.trim();
    if (!mounted || cid.isEmpty || cid == _resolvedStreamCid) return;
    setState(() => _resolvedStreamCid = cid);
  } catch (_) {
    // Keep fallback if resolution fails
  }
}

bool _isLikelyStreamChannelCid(String request) {
  const streamChannelTypes = {
    'messaging', 'team', 'livestream', 'commerce', 'gaming', 'video',
  };
  final parts = request.split(':');
  if (parts.length != 2) return false;
  return streamChannelTypes.contains(parts.first.trim().toLowerCase());
}
```

### Step 5 — Use the shell in the page body

Wrap the scaffold body in the shell. Use `KeyedSubtree` with the current
request as the key so the chat reloads automatically when the resolved CID
changes.

```dart
body: _isInitialLoad
    ? const Center(child: CircularProgressIndicator())
    : KeyedSubtree(
        key: ValueKey(_currentStreamRequest),
        child: _XxxChatShell(
          streamRequest: _currentStreamRequest,
          messageListHeaderBuilder: (context) {
            // Entity form content rendered above the message list
            return _buildEntityHeader(hasUpdatePermission);
          },
        ),
      ),
```

### Step 6 — Update the router

Extract `cid` from query parameters and pass it to the page.

```dart
GoRoute(
  path: XxxEditPage.location,
  builder: (context, state) {
    final id = state.id;
    final Xxx? xxx = state.extra as Xxx?;
    final cid = state.uri.queryParameters['cid'];  // ✅
    return XxxEditPage(id: id, xxx: xxx, cid: cid);
  },
),
```

### Step 7 — Update all navigation call sites

Replace `.location.withId(id)` with `locationWithId(id, cid: xxx.getStreamRequest.value)`:

```dart
// Before
GoRouter.of(context).push(
  XxxEditPage.location.withId(xxx.id.value),
  extra: xxx,
);

// After
GoRouter.of(context).push(
  XxxEditPage.locationWithId(
    xxx.id.value,
    cid: xxx.getStreamRequest.value,  // empty string is safely ignored
  ),
  extra: xxx,
);
```

> When the entity object is a fresh stub (no `getStreamRequest` populated),
> omit the `cid` argument. The page falls back to the typed-request format.

### Step 8 — Create a `MessageOpener`

This controls what happens when the user taps the conversation in the global
**Messages** tab. Create the file in `packages/<your_module>/lib/message_openers/`:

```dart
// packages/xxx_module/lib/message_openers/xxx_message_opener.dart

class XxxMessageOpener implements MessageOpener {
  @override
  bool canOpen(Channel channel) {
    final requestType = channel.extraData['requestType'] as String?;
    final requestId   = channel.extraData['requestId']   as int?;
    return requestType == 'Xxx' && requestId != null;
  }

  @override
  Future<void> open(BuildContext context, Channel channel) async {
    final requestId = channel.extraData['requestId'] as int?;
    if (requestId == null) return;

    // Resolve CID robustly (channel may not be fully initialized)
    final String cid;
    final channelCid = channel.cid;
    if (channelCid != null && channelCid.isNotEmpty) {
      cid = channelCid;
    } else {
      final id = channel.id;
      if (id == null) return;
      cid = '${channel.type}:$id';
    }

    await GoRouter.of(context).push(
      XxxEditPage.locationWithId(requestId, cid: cid),
    );
  }
}
```

### Step 9 — Register the opener during DI setup

In your module's `get_it.dart` (or equivalent configuration entry point):

```dart
Future<void> configureXxxDependencies() async {
  // Register before other DI setup so it takes precedence
  MessageOpenerRegistry.instance.register(XxxMessageOpener());

  getIt.init();
}
```

---

## 4. Reference implementation – TaskAssignment

| Concern | File |
|---|---|
| Entity page + chat shell | `packages/supa_work/lib/pages/task_assignment/task_assignment_edit_page.dart` |
| Message opener | `packages/supa_work/lib/message_openers/task_assignment_message_opener.dart` |
| Opener registration | `packages/supa_work/lib/config/get_it.dart` |
| Router route | `packages/supa_work/lib/router/router.dart` |
| Core mixin | `packages/supa_communication/lib/widgets/abstract_entity_chat.dart` |

### Channel resolution in TaskAssignment

```
widget.cid  (from navigator / message opener)
  ↓ empty
taskAssignment.getStreamRequest.value   ← populated by list API
  ↓ empty
taskAssignment.requestProperty.value
  ↓ empty
'TaskAssignment:<id>'                   ← triggers server-side creation
  ↓ after getData() resolves the typed request
_resolvedStreamCid  (real CID, triggers KeyedSubtree rebuild)
```

### Navigation call pattern

All places that navigate to `TaskAssignmentEditPage` via GoRouter use:

```dart
GoRouter.of(context).push(
  TaskAssignmentEditPage.locationWithId(
    taskAssignment.id.value,
    cid: taskAssignment.getStreamRequest.value,
  ),
  extra: taskAssignment,
);
```

If the `TaskAssignment` object is a fresh stub with no `getStreamRequest`
(e.g. calendar page), the `cid` argument is omitted and the fallback chain
handles it transparently.

---

## 5. Checklist

- [ ] `XxxEditPage` has a `String? cid` constructor parameter
- [ ] `XxxEditPage` has a `static String locationWithId(int id, {String? cid})` helper
- [ ] `_XxxChatShell` widget added at the bottom of the page file
- [ ] `_XxxEditPageState` does **not** use `EntityChatMixin` (no chat logic in state)
- [ ] `_resolvedStreamCid` seeded from `widget.cid` in `initState`
- [ ] `_resolveChatChannelByRequest()` called after `getData()` completes
- [ ] `KeyedSubtree(key: ValueKey(_currentStreamRequest), …)` wraps the shell
- [ ] Router route extracts `cid` from `state.uri.queryParameters`
- [ ] All GoRouter navigation sites use `locationWithId(id, cid: …)`
- [ ] `XxxMessageOpener` created and implements `canOpen` / `open`
- [ ] `XxxMessageOpener` registered in the module's DI config
