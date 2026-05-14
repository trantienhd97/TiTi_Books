# Supa Communication Chat — Tài liệu kỹ thuật

## Tổng quan kiến trúc

```
CommunicationConversationsPage       ← Danh sách hội thoại
    └── _onChannelTap()
        └── MessageOpenerRegistry.open()
            └── DefaultMessageOpener (hoặc custom opener từ module khác)
                └── CommunicationConversationChatPage  ← Trang chat
                    ├── ConversationChatBloc           ← State management
                    ├── JiffySafeMessageListView       ← Message list (custom)
                    └── CustomChatInput                ← Input (custom)
```

---

## Luồng mở chat

### 1. Bấm vào channel đã có trong danh sách

```
_onChannelTap(channel)
  → MessageOpenerRegistry.open()
    → DefaultMessageOpener.open()
      → router.push(locationForChannel(channel))
        → ConversationChatBloc._onChatOpened()
          → resolveAndWatchChannel()  ← lấy từ client.state.channels[cid]
            → channel.watch()         ← SDK (không gọi BE)
              → emit ConversationChatReady
```

### 2. Tạo DM mới (từ search / danh bạ)

```
CommunicationConversationService.createConversationWithUser()
  → push isPendingConversation: true
    → ConversationChatBloc._onChatOpened()
      → emit ConversationChatPending (hiện UI ngay)
      → add ConversationChatEnsureInitialized
        → _channelService.createConversation()
          → BE API: POST /api/v1/get-stream/conversations  ✅ (idempotent)
            → channel.watch()
              → emit ConversationChatReady
```

### 3. Bấm vào thông báo push notification

```
CommunicationNotificationHandler.handle()
  → _openConversationFromUri(uri)
    → _tryBuildChannelFromUri()   ← parse cid từ URL
      → channel.watch()            ← SDK (không gọi BE)
        → router.push(locationForChannelWithMessage(channel, messageId))
          → StreamChannel(initialMessageId: messageId)  ← SDK scroll đúng vị trí
```

### 4. Mở entity chat (TaskAssignment, Inspection...)

```
AbstractEntityChat._createChannelOrData()
  → {getStreamRequest: 'TaskAssignment:123'}
    → ConversationChatBloc._onChatOpened()
      → resolveAndWatchChannel()
        → _resolveConversationByRequest()
          → BE API: GET /api/v1/get-stream/conversations?request=TaskAssignment:123
            → nếu chưa có: BE API POST /api/v1/get-stream/conversations
              → channel.watch()
```

---

## CommunicationConversationChatPage

**File:** `lib/pages/chat/communication_conversation_chat_page.dart`

### Các phần custom so với SDK mặc định

#### AppBar

- **Dùng `StreamChannelHeader` custom** thay vì mặc định
- Hỗ trợ hiển thị ảnh relative URL từ BE (không phải http) qua `AppImage`
- Hiển thị `StreamChannelName` + `StreamChannelInfo` (online status)
- Bot conversation: hiển thị `EnumStatusBadge` thay vì online status
- Nút **Info** (→ `CommunicationConversationDetailPage`)
- **Pending AppBar** riêng khi channel chưa được tạo — hiển thị icon person/people

#### Feedback khi nhận tin nhắn mới

```dart
// Âm thanh (Telegram notification sound)
_audioPlayer.play(AssetSource('sounds/telegram_notification.mp3'), volume: 0.5)

// Haptic
HapticFeedback.lightImpact()
```

- Chỉ kích hoạt khi: tin nhắn từ người khác + channel không bị mute

#### Tracking trạng thái đang xem

- **`ActiveChatTracker`**: lưu `channelCid` đang xem → dùng để không hiện in-app notification khi user đang trong chat đó
- **`ActiveNotificationTracker`**: dismiss notification đã hiển thị khi user mở đúng channel

#### Pending conversation flow

- Khi gõ tin đầu tiên → chặn gửi → gọi BE tạo channel → sau đó mới gửi
- Tương tự khi mở attachment picker

#### Optimization (tránh redundant work)

- `_subscribedChannelCid`: chỉ re-subscribe message events khi đổi channel
- `_preloadedMetadataCid`: chỉ preload metadata 1 lần per channel

---

## JiffySafeMessageListView

**File:** `lib/pages/chat/widgets/jiffy_safe_message_list_view.dart`

### Các phần custom

#### 1. Date header nổi (floating date)

- Overlay ở phía trên list, hiện khi scroll, tự ẩn sau 3 giây
- Debounce update: chỉ update 1 lần/frame (`addPostFrameCallback`)
- Format: "Hôm nay", "Hôm qua", ngày trong tuần, hoặc dd/MM/yyyy

#### 2. Scroll to bottom button

- FAB nhỏ hiện khi `extentBefore > 200px`
- Scroll về index 0 (tin nhắn mới nhất)

#### 3. Double-tap reaction ❤️

- Double tap vào tin nhắn → toggle reaction `love`
- Nếu đã có → xóa; nếu chưa → thêm

#### 4. Swipe to reply (`_SwipeToReply`)

- Vuốt trái → trigger reply (LTR layout)
- Trigger khi: kéo > 72px hoặc velocity > 650
- Animation: icon reply xuất hiện dần, tin nhắn dịch tối đa 10px
- Chỉ hiển thị icon reply cho tin nhắn của người khác

#### 5. Pin / Unpin message

- Custom action trong context menu (giữ tin nhắn)
- Toast notification khi thành công/thất bại

#### 6. Forward message

- Custom action trong context menu
- Mở search delegate để chọn channel đích

#### 7. HTML renderer

- Detect HTML bằng regex `<[a-zA-Z][^>]*>`
- Render bằng `HtmlWidget` nếu có HTML, dùng text thuần nếu không
- Cache kết quả detect per `message.id` → tránh re-run regex

#### 8. Bot message handling

- Detect bot qua `channel.extraData['botId']` hoặc `user.extraData['isBot']`
- Text: qua `resolveMessageText()` — có thể dịch/transform nội dung bot
- Tap: gọi `handleBotMessage()` thay vì default behavior

#### 9. Custom attachment builders

| Builder                     | Mô tả                    |
| --------------------------- | ------------------------ |
| `LocationAttachmentBuilder` | Hiển thị bản đồ/địa điểm |
| `PollAttachmentBuilder`     | Hiển thị bình chọn       |

#### 10. Quoted message (Reply preview)

- `SupaQuotedMessageWidget` — UI custom cho tin nhắn được quote khi reply

#### 11. Mark as read

- Tự động `channel.markRead()` khi vào chat
- Tự động mark read khi có tin nhắn mới (`EventType.messageNew`)

#### 12. Translated username

- `resolveUserName(user, context)` — dịch tên user theo locale hiện tại

#### 13. Full-screen media (`_JiffyGuardedFullScreenMedia`)

- Wrap `StreamFullScreenMediaBuilder` với Jiffy locale guard
- Tránh crash khi mở media trước khi Jiffy locale được init

---

## CustomChatInput

**File:** `lib/widgets/custom_chat_input.dart`

Wrap `StreamMessageInput` với:

- `preMessageSending`: callback trước khi gửi — dùng để ensure channel được tạo (pending flow)
- `preAttachmentPickerOpen`: callback trước khi mở picker — tương tự

---

## ConversationChatBloc

**File:** `lib/blocs/conversation_chat/conversation_chat_bloc.dart`

| Event                                       | Xử lý                                           |
| ------------------------------------------- | ----------------------------------------------- |
| `ConversationChatOpened`                    | Resolve channel từ nhiều loại data khác nhau    |
| `ConversationChatEnsureInitialized`         | Tạo pending channel qua BE, emit Ready          |
| `ConversationChatRetryRequested`            | Retry khi lỗi                                   |
| `ConversationChatHighlightMessageRequested` | Cập nhật highlightMessageId trong state         |
| `ConversationChatChannelInvalidated`        | User bị kick hoặc channel bị xóa → về danh sách |

---

## MessageOpenerRegistry

**File:** `lib/message_openers/message_opener_registry.dart`

Pattern chain-of-responsibility: các module khác (TaskAssignment, Checklist...) có thể đăng ký `MessageOpener` riêng để override behavior mặc định khi tap vào channel.

```dart
// Đăng ký (trong module init)
MessageOpenerRegistry.instance.register(TaskAssignmentMessageOpener());

// Fallback mặc định (luôn xử lý)
class DefaultMessageOpener implements MessageOpener {
  bool canOpen(Channel channel) => true;  // Luôn true
  Future<void> open(BuildContext context, Channel channel) async {
    router.push(CommunicationConversationChatPage.locationForChannel(channel));
  }
}
```

---

## Các file liên quan

| File                                                            | Vai trò                                        |
| --------------------------------------------------------------- | ---------------------------------------------- |
| `lib/pages/conversations/communication_conversations_page.dart` | Danh sách hội thoại, badge, filter chips       |
| `lib/pages/chat/communication_conversation_chat_page.dart`      | Trang chat chính                               |
| `lib/pages/chat/widgets/jiffy_safe_message_list_view.dart`      | Message list có custom features                |
| `lib/widgets/custom_chat_input.dart`                            | Input bar custom                               |
| `lib/blocs/conversation_chat/conversation_chat_bloc.dart`       | State management cho chat page                 |
| `lib/services/conversation_channel_service.dart`                | Resolve / tạo channel                          |
| `lib/services/communication_conversation_service.dart`          | Navigation + tạo conversation                  |
| `lib/notification/communication_notification_handler.dart`      | Xử lý bấm vào push notification                |
| `lib/cubits/chat_client/communication_chat_client_cubit.dart`   | Lifecycle StreamChatClient                     |
| `lib/message_openers/`                                          | Registry pattern để mở channel                 |
| `lib/widgets/abstract_entity_chat.dart`                         | Base class cho entity chat (TaskAssignment...) |
