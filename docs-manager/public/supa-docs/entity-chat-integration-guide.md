# Entity Chat UI/UX Integration Guide

This guide explains how to replace legacy comment UI with the Stream-based entity chat UI for any business entity page (for example `TaskAssignment`, `Inspection`).

## 1. What to Use

Use these building blocks:

- `EntityChatMixin` in `packages/supa_communication/lib/widgets/abstract_entity_chat.dart`
- `buildChatWidget(messageListHeaderBuilder: ...)` to make entity form/content the top of chat scroll
- `MessageOpener` + `MessageOpenerRegistry` for opening entity pages from conversation list
- `ConversationChannelService` request resolution (`getStreamRequest`) for direct page access

Do not add new `AbstractComment` usage for entity detail pages.

## 2. Integration Pattern (Page Level)

### Step A: Migrate page state to `EntityChatMixin`

```dart
class _MyEntityPageState extends State<MyEntityPage>
    with EntityChatMixin<MyEntityPage> {
  @override
  void initState() {
    super.initState();
    initChat();
    // existing init logic
  }

  @override
  void dispose() {
    // existing cleanup
    disposeChat();
    super.dispose();
  }
```

### Step B: Implement `getStreamRequest`

Prefer this order:

1. `cid` from route query (when opened from conversation list)
2. existing `requestProperty` from entity payload
3. fallback `"<RequestType>:<EntityId>"`

```dart
@override
String get getStreamRequest {
  if (widget.cid != null && widget.cid!.isNotEmpty) {
    return widget.cid!;
  }
  final requestProperty = entity.requestProperty.value;
  if (requestProperty.isNotEmpty) {
    return requestProperty;
  }
  return 'MyEntity:${entity.id.value}';
}
```

### Step C: Replace body with chat widget

Use `messageListHeaderBuilder` and render the entity UI there.

```dart
body: buildChatWidget(
  messageListHeaderBuilder: (context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // entity form/details widgets
        ],
      ),
    );
  },
),
```

This creates one unified vertical scroll: entity UI at top, messages below.

## 3. Layout Rules (Important)

`buildChatWidget()` contains internal `Expanded` sections. It must live in a bounded-height parent.

If the page uses `PageActionsDefault`, set:

```dart
isBodyScrollable: false,
```

Reason: placing chat inside outer `SingleChildScrollView` causes unbounded height and can crash with `RenderBox was not laid out`.

## 4. Open From Conversation List (CID passthrough)

### Step A: Create entity `MessageOpener`

- Check `channel.extraData['requestType']`
- Extract `requestId`
- Build/passthrough `cid`
- Navigate to entity page with `id` + `cid` query params

Reference implementations:

- `packages/supa_work/lib/message_openers/task_assignment_message_opener.dart`
- `packages/supa_work/lib/message_openers/inspection_message_opener.dart`

### Step B: Register opener in DI/bootstrap

Register in module setup (example):

- `packages/supa_work/lib/config/get_it.dart`

## 5. Router Contract

Entity route should read `cid` from query params and pass into page constructor.

Example reference:

- `packages/supa_work/lib/router/router.dart`

Pattern:

```dart
final cid = state.uri.queryParameters['cid'];
return MyEntityPage(id: id, entity: entity, cid: cid);
```

## 6. Direct Access Contract (No CID)

When entity page is opened directly (no conversation list), chat still must initialize.

`ConversationChannelService` already supports resolving channel by `getStreamRequest` through backend `/get` (`GetStreamConversationRepository.getConversation(...)`).

Reference:

- `packages/supa_communication/lib/services/conversation_channel_service.dart`

As long as `getStreamRequest` is correct (`RequestType:Id` or existing request property), channel resolution should work.

## 7. UI/UX Rules

- Keep entity content and chat in one scroll context via `messageListHeaderBuilder`.
- Do not split into two fixed rows unless product explicitly asks.
- Keep input behavior from `CustomChatInput` (already inside mixin).
- Keep Jiffy-safe message list behavior (already in `JiffySafeMessageListView` used by mixin).

## 8. Known Failure Modes and Fixes

1. **Only first pinned conversation/channel appears after state change**
- Verify `getStreamRequest` is stable and not overwritten with wrong value.
- Ensure opener passes correct `cid` for channel-bound navigation.

2. **`You must have a StreamChatTheme widget at the top of your widget tree`**
- Use `buildChatWidget()` / `EntityChatMixin` as-is.
- Do not render low-level Stream widgets outside provided wrappers.

3. **`RenderBox was not laid out` for `StreamChat`/`Column`/`SingleChildScrollView`**
- Remove outer unbounded scroll container around chat.
- In `PageActionsDefault`, use `isBodyScrollable: false`.

## 9. Developer/Agent Checklist

Before PR:

1. Page migrated to `EntityChatMixin` with `initChat()`/`disposeChat()`.
2. `getStreamRequest` implemented with `cid -> requestProperty -> RequestType:Id` fallback.
3. Entity UI moved to `messageListHeaderBuilder`.
4. Route accepts and passes `cid`.
5. Message opener implemented and registered.
6. Direct route opening tested (no `cid`) and chat resolves channel.
7. Conversation list opening tested (with `cid`) and opens correct entity chat.
8. `dart format` run on changed Dart files.
9. `flutter analyze` passes for affected package(s).

## 10. Suggested Validation Scenarios

- Open from conversation list and verify correct channel messages appear.
- Open entity page directly by URL/route and verify chat initializes.
- Send text + attachment from entity page.
- Verify entity header/form still renders during chat loading/error states.
- Verify no layout assertions when navigating in/out repeatedly.
