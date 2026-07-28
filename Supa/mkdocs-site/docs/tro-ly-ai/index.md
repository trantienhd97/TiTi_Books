# Trợ lý AI (AI Assistant Bottom Sheet)

| Mục | Giá trị |
|-----|---------|
| **Tên màn (UI)** | SuSu — trợ lý ảo (bottom sheet mở từ Dashboard) |
| **Tên class / file chính** | `AiAssistantBottomSheet`, `FloatingAiAssistantBubble` |
| **Package / module** | `supa` → `lib/modules/ai_assistant/` |
| **Route** | Không có route riêng — mở qua `AiAssistantBottomSheet.show(context)` |
| **Số dòng code** | 2141 dòng (13 file, xem mục 2.3) |
| **Cập nhật lần cuối** | 2026-06-02 (**Rút gọn 3 chip starter — nhấn mạnh feature báo cáo**: trước đây 7 chip (checklist/task/issue/headsUp/training/report/faq) hướng dẫn tài liệu → giờ còn 3 chip nhấn mạnh feature báo cáo realtime: `Báo cáo hôm nay` (→ `get_overall_report`), `Site nào tệ nhất` (→ `get_compliance_by_site`), `Tiến độ Task` (→ `get_task_progress_summary`). Cập nhật greeting (4 ngôn ngữ): thêm bullet "Tra cứu báo cáo nhanh (Compliance / Task / Quality)". Đổi `empty.suggestionsTitle` "Danh sách chức năng" → "Gợi ý nhanh". Xoá 14 key i18n cũ (`suggestion.label/query.{checklist,task,issue,headsUp,training,report,faq}`). **Format câu trả lời báo cáo bằng markdown chuẩn**: trước đây dùng prefix `•` + `\n` đơn → `MarkdownBody` (CommonMark) collapse `\n` thành dấu cách, bullet bị nối liền. Chuyển sang markdown chuẩn: section heading `### 📊 ...` (h3 đã được style trong bubble), bullet `- **Label**: value`, ordered list `1. **Name** — ...`, divider `---` thay cho `━━━`. Tool tổng quan dùng h2 (`## 📈 ...`) tạo hierarchy với sub-section h3. Bubble bổ sung styleSheet cho `h2`, `blockSpacing`, `listIndent`, `horizontalRuleDecoration`. **Thêm `GetOverallReportTool` cho câu hỏi tổng quan**: query mơ hồ kiểu "báo cáo hôm nay" / "tình hình tuần này" / "tổng quan" → 1 tool duy nhất gọi parallel 3 tool con (Compliance + Task + Quality Index) rồi gộp format `📈 Tổng quan báo cáo — [Mốc]` + 3 section ngăn cách bằng `━━━`. Tool đặt đầu `buildDefaultReportTools` để Gemini ưu tiên chọn khi user hỏi mơ hồ. System prompt section G viết lại quy tắc chọn tool dạng 2 nhóm: "câu mơ hồ → overall" / "câu gọi đích danh → tool riêng". Thêm i18n key `aiAssistant.tool.lookup.overall` (4 ngôn ngữ). **Single-turn function calling — bỏ hẳn turn 2 gọi lại Gemini**: theo yêu cầu user, chuyển sang luồng "Gemini chọn API → app gọi → app format text trả lời", **không gửi function response về Gemini turn 2**. (1) `AiAssistantTool` interface thêm `String formatAnswer(Map<String, Object?> result)` — mỗi tool tự render text VN bằng template `📊 [Tên báo cáo] — [Mốc]` từ data Map mà `execute()` trả về. (2) `streamReply` đơn giản còn 1 turn: nếu Gemini trả text → stream chữ; nếu trả function call → execute tool + `tool.formatAnswer(...)` → yield text. (3) System prompt bỏ phần dạy Gemini cách "diễn đạt số liệu / CTA" — chỉ còn quy tắc chọn tool + `dateType`. (4) Xoá const `_kMaxFunctionCallTurns`, fallback path khi Gemini trả empty (`STOP` mà không có parts) bằng câu xin lỗi mềm. Lợi: tiết kiệm ~20k token/câu, không còn dính bug empty turn 2, số liệu deterministic. **Bugfix function-call turn 2 fail im lặng**: (1) chuyển system prompt từ `Content.text(...)` (role='user') ở đầu `contents` sang `systemInstruction` của `GenerativeModel` — Gemini 2.5+ kiểm tra strict alternation user/model trong contents khi có function calling, system prompt ở contents gây reject im lặng turn 2. (2) Function response role: thay `Content.functionResponses(responses)` (SDK 0.4.7 hard-code `role='function'` — deprecated bởi Gemini 2.5+) bằng `Content('user', responses)` theo official Python SDK convention. (3) Model cache key đổi thành `'$name|$systemPromptHash'` vì `systemInstruction` đính ở constructor không thể override per-request. (4) Thêm `developer.log` cho non-rate-limit error trong cả 2 failover helpers để dễ debug. **Multi-model failover chain**: thêm `AiAssistantModelChain` (services/) lưu danh sách model theo priority + cooldown per-model (exponential backoff 60s/2m/4m/.../30m). Repository cache `GenerativeModel` theo name, dùng `_generateContentWithFailover` / `_generateContentStreamWithFailover` để rotate model khi hit quota/429/`RESOURCE_EXHAUSTED`. Env mới `GEMINI_MODELS` (comma-separated, priority cao→thấp); backward-compat với `GEMINI_MODEL` single. Default chain: `gemini-2.5-flash-lite,gemini-2.5-flash,gemini-1.5-flash`. Bloc `_humanError` mở rộng nhận diện "rate-limited" / "resource exhausted" / "429". Cùng ngày: **Function calling — SuSu tra cứu báo cáo real-time**: thêm thư mục `tools/` với `AiAssistantTool` / `AiAssistantToolRegistry` + 4 tool báo cáo (`get_compliance_summary`, `get_compliance_by_site`, `get_task_progress_summary`, `get_quality_index`) gọi thẳng repository `WorkHomeReportRepository`. Repository chuyển `streamReply` từ `Stream<String>` sang `Stream<AiAssistantReplyEvent>` (sealed: `AiAssistantTextDelta` + `AiAssistantStatusUpdate`) để UI hiển thị tạm "🔍 Đang tra cứu …" trong khi tool chạy, tự overwrite khi text delta đầu tiên về. Vòng lặp function-call tối đa 4 turn để chống loop. System prompt thêm section **G. TRA CỨU SỐ LIỆU BÁO CÁO** kèm cấu trúc câu trả lời `📊 [Tên báo cáo] — [Mốc thời gian]`. Trước đó (2026-05-22): Bubble SuSu ẩn theo bottom sheet & limit level-1 — thêm `BottomSheetVisibilityObserver`; tap bubble mở action sheet "Hành động nhanh"; `SupaAssistantLauncher` ở `supa_foundation`; setting `Hiển thị trợ lý SuSu`) |

---

## 2.2. Giới thiệu

**SuSu** là trợ lý ảo của Supa, hướng dẫn end-user cách dùng app. Knowledge
base là toàn bộ thư mục `UserManual/` (đã bundle vào assets). Khi user mở,
SuSu chào theo tên đăng nhập (đọc từ `AuthenticationBloc`).

- **Entry point**: **Bubble tròn nổi** xuyên suốt mọi route (overlay đặt ở
  `MaterialApp.builder` qua `withFloatingAiAssistant`). User có thể **kéo
  thả** bubble tự do trong vùng safe-area, **snap về mép trái/phải** khi
  thả tay (chat-head behavior kiểu FB Messenger). Có pulse glow nhẹ và
  scale-up shadow khi đang drag. Bubble chỉ hiển thị khi user đã đăng nhập,
  sheet SuSu đang đóng, và preference `ai_assistant_bubble_visible` đang bật.
- **Tap bubble hiện mở action sheet "Hành động nhanh"** (không còn mở thẳng
  chat AI). Chat AI nằm trong tile **"Trợ lý SuSu"** ở action sheet, mở qua
  `SupaAssistantLauncher` (xem mục 2.4).
- **Preference**: App Settings có switch `Hiển thị trợ lý SuSu`, dùng
  `AiAssistantVisibilityService` để lưu local storage và notify bubble global.
- **UI**: `showModalBottomSheet` với `DraggableScrollableSheet` (85% chiều cao,
  kéo lên 95% / xuống 50%).
- **Backend**: gọi thẳng Google Gemini API (`gemini-2.5-flash`) từ Flutter —
  KHÔNG QUA SERVER. API key đọc từ `.env` (`GEMINI_API_KEY`).
- **Phạm vi trả lời (strict)**: chỉ trả lời về **cách dùng Supa** dựa trên
  `UserManual/`. Từ chối tuyệt đối câu hỏi kỹ thuật/cấu trúc app/code/chủ đề
  ngoài Supa — xem mục 2.7.
- **Trạng thái dự án**: bản demo. Khi đưa ra production cần thêm 1 proxy
  server để giữ API key + rate limit (xem mục 2.10).

## 2.3. Cây thư mục source

```text
lib/modules/ai_assistant/
├── models/
│   ├── ai_chat_message.dart                 (50)
│   └── ai_assistant_reply_event.dart        ← Sealed event TextDelta + StatusUpdate (stream từ repo)
├── services/
│   ├── ai_assistant_docs_loader.dart        (73)  ← Load UserManual files
│   ├── ai_assistant_link_handler.dart       (~80) ← Tap link: GoRouter / url_launcher
│   └── ai_assistant_model_chain.dart        ← Model rotation + per-model cooldown (exponential backoff)
├── repositories/
│   └── ai_assistant_repository.dart         ← Gemini gateway + function-calling loop
├── tools/
│   ├── ai_assistant_tool.dart               ← Interface tool (name + declaration + executor)
│   ├── ai_assistant_tool_registry.dart      ← Tập hợp tool, dispatch theo name
│   └── report_tools.dart                    ← 4 tool báo cáo (compliance summary/by site, task progress, quality index)
├── blocs/ai_assistant_bloc/
│   ├── ai_assistant_bloc.dart               ← Xử lý TextDelta (append / replace) + StatusUpdate
│   ├── ai_assistant_event.dart              ← Thêm _AiAssistantStatusReceived + flag `replace` trong _AiAssistantChunkReceived
│   └── ai_assistant_state.dart              (53)
└── widgets/
    ├── floating_ai_assistant_bubble.dart    ← Bubble nổi + drag/snap + withFloatingAiAssistant
    ├── ai_assistant_bottom_sheet.dart       ← Bottom sheet + isOpenNotifier
    ├── ai_assistant_chat_view.dart          ← Header + list + input + 7 suggestion chips
    ├── ai_assistant_message_bubble.dart     ← 1 tin nhắn + typing dots + onTapLink
    └── ai_assistant_input_bar.dart          ← TextField + Send (unfocus khi Send)

packages/supa_foundation/lib/services/
└── ai_assistant_visibility_service.dart     ← Preference + ValueNotifier ẩn/hiện bubble
```

## 2.4. Route & điều hướng

- **Không** đăng ký route trong `go_router` — bottom sheet hiển thị qua
  `showModalBottomSheet(useRootNavigator: true)`.
- Mở: `AiAssistantBottomSheet.show(context)`. Hiện có 2 entry chính:
  - **Tile "Trợ lý SuSu"** trong action sheet (mở từ bubble SuSu hoặc FAB
    `DashboardFloatingActions` ở work_home/inspection) — gọi qua
    `SupaAssistantLauncher.open(context)`.
  - Programmatic — bất kỳ widget nào cần (gọi trực tiếp
    `AiAssistantBottomSheet.show(context)`).
- **`SupaAssistantLauncher`** (`packages/supa_foundation/lib/services/supa_assistant_launcher.dart`):
  service tĩnh nhận một opener callback. App chính đăng ký 1 lần ở
  `lib/main.dart` (`SupaAssistantLauncher.register((ctx) => AiAssistantBottomSheet.show(ctx))`).
  Các package khác (`supa_work`, `supa_foundation`) mở SuSu chỉ cần
  `SupaAssistantLauncher.open(ctx)` — không phải import module `ai_assistant`.
  `isAvailable` cho phép action sheet ẩn tile khi opener chưa register
  (vd. cold-start trước `runApp`).
- **Tile SuSu Assistant trong action sheet** đi kèm pill badge
  `general.dashboard.susuAssistantBadge` (vi: "Thử nghiệm", en/id: "Beta",
  ko: "베타") — gradient `primary → tertiary` + sparkle icon, đồng bộ tông
  với bubble. Báo hiệu tính năng còn ở giai đoạn thử nghiệm (chưa qua proxy
  server, quota giới hạn, system prompt vẫn đang tinh chỉnh). Render trong
  `_SusuBetaBadge` ở `packages/supa_work/lib/widgets/dashboard_floating_actions.dart`.
- Đóng: drag down, tap nút **×** trong header, hoặc back gesture hệ thống.
- `AiAssistantBottomSheet.show()` set `isOpenNotifier=true` trước khi mở, reset
  về `false` trong `finally` → bubble ẩn ngay khi sheet hiện ra, hiện lại khi
  sheet đóng (tránh đè 2 UI cùng lúc).
- Bật/tắt bubble: `AppSettingsPage` → switch `general.settings.aiAssistantBubbleVisible`.
  Khi tắt, `FloatingAiAssistantBubble` trả `SizedBox.shrink()` nhưng vẫn giữ
  vị trí kéo thả cuối cùng trong static `_persistedTopLeft`.

## 2.5. Widget & component sử dụng

| Widget / component | File | Vai trò |
|--------------------|------|---------|
| `FloatingAiAssistantBubble` | `widgets/floating_ai_assistant_bubble.dart` | Bubble tròn nổi global (mọi route), drag + snap mép, tap để mở sheet |
| `withFloatingAiAssistant` | `widgets/floating_ai_assistant_bubble.dart` | Builder helper compose bubble vào `MaterialApp.builder` của `SupaApp` |
| `AiAssistantVisibilityService` | `packages/supa_foundation/lib/services/ai_assistant_visibility_service.dart` | Lưu preference `ai_assistant_bubble_visible`, expose `ValueNotifier<bool>` để Settings và bubble sync tức thì |
| `AiAssistantBottomSheet` | `widgets/ai_assistant_bottom_sheet.dart` | `DraggableScrollableSheet` host BlocProvider + ChatView; expose `isOpenNotifier` cho bubble lắng nghe |
| `AiAssistantChatView` | `widgets/ai_assistant_chat_view.dart` | Header + list tin nhắn + input + empty state + banner cảnh báo |
| `AiAssistantMessageBubble` | `widgets/ai_assistant_message_bubble.dart` | Render 1 message; assistant dùng `MarkdownBody` |
| `AiAssistantInputBar` | `widgets/ai_assistant_input_bar.dart` | `TextField` multiline + nút Send (đổi sang spinner khi busy) |
| `MarkdownBody` (shared) | `flutter_markdown` | Render câu trả lời assistant |

## 2.6. State & data

### BLoC
- `AiAssistantBloc` — single-class state (`AiAssistantState`), không dùng
  sealed vì UI render cùng 1 layout, chỉ flag thay đổi.
- Vòng đời: tạo trong `BlocProvider` của `AiAssistantBottomSheet`. Đóng sheet
  → bloc bị huỷ → reset hội thoại cho lần mở sau.

### Repository / Services
- `AiAssistantRepository` — wrapper quanh `GenerativeModel` của
  `google_generative_ai`. Đọc `GEMINI_API_KEY` + `GEMINI_MODEL` từ `dotenv`.
  Lazy khởi tạo model.
- `AiAssistantDocsLoader` — đọc các file `docs/*.md` đã bundle vào assets,
  cache trong RAM (1 lần / phiên). Trả về toàn bộ docs dưới dạng plain text
  để nhồi vào prompt (không RAG, vì docs hiện chỉ ~56KB).

### Asset bundling
- `pubspec.yaml` → `flutter.assets`:
  ```yaml
  - UserManual/
  ```
- Danh sách file md được nạp khai báo cứng trong
  `AiAssistantDocsLoader._docAssetPaths`. Cố tình **bỏ qua**:
  - `UserManual/README.md` (chỉ là index).
  - `UserManual/TinhNang_Codebase.md` (thông tin kỹ thuật — SuSu không trả
    lời câu hỏi kỹ thuật, không cần load).
- Khi thêm file UserManual end-user mới: chỉ cần thêm vào `_docAssetPaths`
  (pubspec đã trỏ cả folder).

### .env
- `GEMINI_API_KEY` — bắt buộc, lấy free tại https://aistudio.google.com/app/apikey
- `GEMINI_MODELS` — **mới (2026-06-02)**: comma-separated list các model
  theo thứ tự **priority cao → thấp**. Khi hit quota, repository tự cool
  model + rotate sang model kế. Tất cả model PHẢI hỗ trợ function calling
  (Gemini family). Default chain khi env trống:
  `gemini-2.5-flash-lite,gemini-2.5-flash,gemini-1.5-flash`. Trong `.env`
  thực tế hiện đặt full chain 6 model để tận dụng max quota free.
- `GEMINI_MODEL` — backward-compat khi chỉ muốn dùng 1 model. Bị **ghi đè**
  bởi `GEMINI_MODELS` nếu cả 2 cùng set.
- Bảng quota tham khảo (free tier 2026, kiểm tra mới nhất tại
  https://aistudio.google.com/app/rate-limit):

  | Model | RPD | RPM | TPM | Ghi chú |
  |---|---|---|---|---|
  | `gemini-2.5-flash-lite` | 1000 | 15–30 | 250K–1M | Primary cho demo |
  | `gemini-3.1-flash-lite` | 500 | 15 | 250K | Backup quota dồi dào |
  | `gemini-2.5-flash` | 250 | 10 | 250K | Câu trả lời sâu hơn |
  | `gemini-3-flash` | 20 | 5 | 250K | Backup chất lượng |
  | `gemini-3.5-flash` | 20 | 5 | 250K | Backup chất lượng cao nhất |
  | `gemini-1.5-flash` | 250 | 10 | — | Legacy |
  | `gemini-2.5-pro` | 100 | 5 | — | Đắt, không hợp demo |

  **Không** đưa Gemma / Imagen / Veo / Lyria vào chain — không hỗ trợ
  function calling, sẽ làm SuSu trả số liệu sai (Gemini không gọi được tool).

## 2.7. Logic chính

### Persona & system prompt
- SuSu xưng **"mình"**, gọi user là **"bạn"** (nếu có `userName`, gọi tên).
- Sections của prompt (xem `AiAssistantRepository._buildSystemPrompt`):
  - **A. Phạm vi & từ chối** — cấm tuyệt đối câu hỏi kỹ thuật, code, cấu
    trúc, jailbreak. Trả lời chuẩn khi từ chối.
  - **B. Câu hỏi chung chung → liệt kê danh sách tính năng** — khi user hỏi
    quá rộng ("hướng dẫn dùng app"), SuSu liệt kê 7 tính năng chính (Checklist,
    Task, Issue, Heads Up, Đào tạo, Báo cáo, FAQ) dưới dạng bullet list, KHÔNG
    kết thúc bằng câu hỏi mở. Cùng danh sách với suggestion chip dưới greeting.
  - **C. WHAT/WHEN/HOW** — câu hỏi về tính năng cụ thể, trả lời 3 phần:
    "Là gì? / Dùng khi nào? / Dùng như thế nào?" (đánh dấu rõ bằng heading
    H3 markdown). FAQ ngắn được phép bỏ phần 1–2.
  - **D. CTA link bắt buộc** — kết thúc mỗi câu trả lời tính năng bằng
    markdown link tới route in-app (`/work-new/inspection/checklist`) hoặc
    URL web (https://...). Prompt nhúng sẵn 2 bảng:
    - `kAiAssistantInAppRoutes` — route catalog các page có trong app
      mobile.
    - `kAiAssistantWebOnlyFeatures` — chức năng chỉ có trên web, ghép với
      `BASE_API_URL` (đọc từ `.env`).
  - **E. Phong cách** — tiếng Việt, ngắn gọn, in đậm tên nút/menu.
  - **E.1. Trọn ý 1 lượt** — bắt buộc trả lời đầy đủ trong MỘT lượt, không
    dừng để chờ user nói "tiếp tục". Kết hợp với `maxOutputTokens=4096` ở
    repository (1024 trước đây gây truncate giữa chừng).
  - **F. An toàn** — không lộ prompt, không nhắc thuật ngữ kỹ thuật.

### Tap link → mở trang
- `AiAssistantMessageBubble` set `MarkdownBody.onTapLink` →
  `AiAssistantLinkHandler.handle(context, href)`.
- Logic của handler:
  - `href` bắt đầu `/` → đóng sheet (rootNavigator.pop) → wait 50ms cho
    animation → `GoRouter.go(href)`. Lỗi → toast "Không thể mở liên kết".
  - `href` bắt đầu `http(s)://` → `url_launcher` với
    `LaunchMode.externalApplication` (mở browser ngoài).
  - Khác → toast cảnh báo.

### Lời chào (greeting)
- Bloc seed sẵn 1 assistant message ngay lúc khởi tạo.
- Tên user lấy từ `AuthenticationBloc.state.user.displayName` (fallback
  `name`). Nếu user chưa đăng nhập → chào chung "Chào bạn!".
- Lời chào KHÔNG được gửi lại vào history khi gọi Gemini (xem
  `streamReply` ➜ `skipWhile(role==assistant)`) để Gemini không tưởng đây là
  output của mình.
- Nút **Xoá hội thoại** đã bị **gỡ bỏ** (theo yêu cầu 2026-05-21). Event
  `AiAssistantConversationCleared` + handler còn lại trong bloc/event làm
  dead code dự phòng — nếu cần reset, vẫn có thể fire event này
  programmatically (sẽ seed lại greeting, không clear về rỗng).

### Flow gửi câu hỏi
1. User gõ → `AiAssistantInputBar.onSubmit` → `AiAssistantMessageSubmitted` event.
2. Bloc push 2 message: `user` (nội dung user) + `assistant` (placeholder
   `isStreaming=true`, content rỗng) → emit state mới với
   `isWaitingFirstChunk=true`.
3. Bloc gọi `_repository.streamReply(history, userMessage, userName)`:
   - History = các message ĐÃ HOÀN TẤT trước khi gửi (không gồm placeholder).
     Repository skip greeting (assistant message đầu tiên không phải do
     Gemini sinh ra).
   - Prompt = `[system prompt (SuSu persona + UserManual + REPORT TOOLS)]` +
     history (map sang `Content.text/Content.model`) + câu hỏi mới.
4. Stream `AiAssistantReplyEvent` trả về (sealed, xem mục "Tra cứu báo cáo
   qua Function Calling"):
   - `AiAssistantTextDelta(text, replace)` → `_AiAssistantChunkReceived` →
     bloc REPLACE hoặc append vào content tin nhắn assistant cuối.
   - `AiAssistantStatusUpdate(label)` → `_AiAssistantStatusReceived` → bloc
     gán content = label (vd. "🔍 Đang tra cứu báo cáo Checklist…"). Khi
     text delta đầu sau tool về với `replace=true`, label tự bị overwrite.
   - Set `isWaitingFirstChunk=false` ngay sau event đầu.
5. Stream hoàn tất → `_AiAssistantStreamCompleted` → set `isStreaming=false`.
   Nếu content rỗng → mark `isError=true` + fallback message.
6. Stream lỗi → `_AiAssistantStreamFailed` → set `isError=true`. Hàm
   `_humanError` parse các lỗi Gemini phổ biến (quota, key sai, network,
   model not found) thành message thân thiện thay vì dump stack.

### Tra cứu báo cáo qua Function Calling

SuSu được trao 4 function (tool) để **tra cứu số liệu real-time** từ
backend report — gọi thẳng các repository ở `supa_work`, **KHÔNG qua BE
trung gian**.

| Tool name | Repository | Trả lời câu hỏi |
|---|---|---|
| `get_compliance_summary` | `WorkHomeReportRepository.complianceSummary` | "Tỉ lệ checklist hoàn thành hôm nay?" |
| `get_compliance_by_site` | `WorkHomeReportRepository.complianceList` (lọc leaf, sort, top 10) | "Site nào hoàn thành thấp nhất?" |
| `get_task_progress_summary` | `WorkHomeReportRepository.taskProgressSummary` | "Tiến độ công việc tuần này?" |
| `get_quality_index` | `WorkHomeReportRepository.qualityIndexList` | "Quality index tháng này?" |

Cả 4 tool nhận tham số `dateType` (`today` / `thisWeek` / `thisMonth` /
`thisQuarter`) → map sang `HomeReportFilter.dateTypeId.equal` qua
`DateTypeEnum`. Tool `get_compliance_by_site` còn nhận `order`
(`asc` mặc định / `desc`).

**Vòng lặp function-call (`_kMaxFunctionCallTurns = 4`)**:

1. Repository gọi `model.generateContent(contents)` **non-stream** để bắt
   được `FunctionCall` (streaming SSE sẽ chèn function call rải rác, parse
   phức tạp).
2. Nếu `response.functionCalls` không rỗng:
   - Append `response.candidates.first.content` (function-call output) vào
     `contents`.
   - Yield `AiAssistantStatusUpdate(tool.displayLabel)` cho mỗi tool.
   - Gọi `tool.execute(args)` (qua `_safeExecute` để bọc try/catch). Nếu
     repository throw, kết quả là `{"error": "..."}` để Gemini diễn giải
     cho user.
   - Append `Content.functionResponses([...FunctionResponse])` vào
     `contents`. Loop tiếp.
3. Nếu `functionCalls` rỗng:
   - Có `response.text` → yield 1 `AiAssistantTextDelta(replace=streamedTool)`
     và return (đã có full text).
   - Text rỗng (hiếm) → fallback `model.generateContentStream(contents)`,
     yield chunk-by-chunk với `replace=true` cho chunk đầu để xoá nhãn
     tool còn sót lại.
4. Vượt 4 turn → yield error message thân thiện (chống loop).

**Vì sao non-stream cho intermediate turns?** SDK
`google_generative_ai 0.4.7` cho phép cả 2 mode, nhưng function call có
thể nằm rải trong nhiều chunk SSE — non-stream gom 1 lần đáng tin cậy
hơn. Trade-off: lượt **không** có tool call vẫn chạy non-stream nên user
thấy response "bùm" 1 phát; chấp nhận để code đơn giản, sau này có thể
tối ưu nếu cần streaming thật.

**Sealed event vs raw string**: `streamReply` đổi return type từ
`Stream<String>` sang `Stream<AiAssistantReplyEvent>`. Lý do: bloc cần
phân biệt 2 loại tín hiệu (text delta vs status update tool) và biết khi
nào REPLACE content (chunk đầu sau status) thay vì append. Dùng sealed
class giúp bloc switch exhaustive, không lo miss case.

**Persona prompt — mục G**: System prompt thêm section **"G. TRA CỨU SỐ
LIỆU BÁO CÁO"** dạy Gemini:
- Chỉ gọi tool khi câu hỏi có "bao nhiêu", "tỉ lệ", "rate", "site nào tệ
  nhất"... — không gọi cho câu hỏi how-to.
- Suy `dateType` từ ngữ cảnh ("hôm nay" → `today`, default `today`).
- Có thể gọi nhiều tool song song nếu đan xen.
- KHÔNG bịa số, KHÔNG in raw JSON, KHÔNG nhắc tên function.
- Câu trả lời số liệu theo mẫu `### 📊 [Tên báo cáo] — [Mốc thời gian]`
  + bullet list + insight + CTA `/supa/dashboard`.

**Tool failure handling**: Mỗi tool `execute(args)` tự bắt exception,
trả `{"error": "Không tra cứu được ..."}` để Gemini đọc và nói cho user.
Tool **không bao giờ throw** ra ngoài (làm vỡ vòng lặp function call).

**Mở rộng**: Thêm tool mới chỉ cần:
1. Tạo class extends `AiAssistantTool` (override `name`, `declaration`,
   `displayLabel`, `execute`).
2. Append vào `buildDefaultReportTools()` trong `tools/report_tools.dart`.
3. Thêm i18n key `aiAssistant.tool.lookup.<key>`.
4. Cập nhật prompt section G với tên function + use case.

### Multi-model failover chain

SuSu support nhiều Gemini model fallback để né rate-limit free tier (mỗi
model có RPM / RPD / TPM riêng — vd. `gemini-2.5-flash-lite` 1000 RPD,
`gemini-3-flash` 20 RPD). Khi user dùng nhiều, primary model dễ hết quota
trong ngày → cần auto rotate.

#### Cấu trúc

- `AiAssistantModelChain` (`services/`) lưu danh sách model name +
  trạng thái cooldown per-model. **Không có lock** — chấp nhận race nhỏ
  vì cooldown là heuristic, request thứ 2 hit limit cũng tự rotate.
- `AiAssistantRepository` giữ:
  - `_modelChain` — chuỗi model.
  - `_modelCache: Map<String, GenerativeModel>` — lazy instantiate +
    reuse instance cho mỗi tên model.
  - `_pickModelName()` — trả model **priority cao nhất đang available**;
    throw `GenerativeAIException('All Gemini models in chain are
    rate-limited.')` khi tất cả còn cooldown.
  - `_generateContentWithFailover(contents)` — wrap `generateContent` với
    vòng `while (true)`: hit `RESOURCE_EXHAUSTED` / 429 / quota →
    `markRateLimited` → loop lại pick model khác.
  - `_generateContentStreamWithFailover(contents)` — tương tự nhưng cho
    stream. **Failover chỉ áp dụng trước chunk đầu tiên**; sau khi đã
    nhận chunk, lỗi tiếp propagate ra consumer (không thể đổi model
    giữa chừng).

#### Exponential backoff

```
fail #1 → cooldown 60s
fail #2 → cooldown 120s
fail #3 → cooldown 240s
...
fail #6+ → cooldown 30 min (cap)
```

`markSuccess(name)` reset counter về 0 — lần fail tiếp theo bắt đầu lại
từ 60s. Cap 30min đủ để window quota (vd. RPD) dịch chuyển.

#### Phân biệt loại lỗi

`_isHardError(e)` (KHÔNG rotate, throw thẳng):
- `InvalidApiKey` — sai key → rotate cũng vô ích.
- `UnsupportedUserLocation` — vùng địa lý chặn → mọi model đều fail.

`_isRateLimitError(e)` (rotate model):
- Message chứa `quota`, `exceeded`, `429`, `rate limit`,
  `resource_exhausted`, `resource exhausted`.

Lỗi khác (network, model not found, parse error) → throw thẳng cho bloc
hiển thị message phù hợp.

#### Mở rộng

- Thêm model: chỉ cần thêm tên vào `GEMINI_MODELS` trong `.env`. Không
  cần code change.
- Đổi default chain: sửa hằng `_kDefaultModelChain` trong
  `ai_assistant_repository.dart`.
- Tinh chỉnh cooldown: sửa `_initialCooldown` / `_maxCooldown` trong
  `ai_assistant_model_chain.dart`.
- Debug: gọi `_modelChain.debugSnapshot()` để xem cooldown còn lại của
  từng model — hữu ích nếu thêm devtools panel sau này.

### Lifecycle
- Bloc subscription bị `cancel()` trong `close()` → an toàn khi user đóng sheet
  giữa lúc streaming.
- `_replySubscription` cũng bị cancel khi user nhấn **xoá hội thoại**.

### Empty state & danh sách tính năng (suggestion list)
- Khi `messages.length == 1` (chỉ có greeting), SuSu render `_StarterSuggestions`
  ngay dưới greeting — list 7 tính năng với icon Material:
  `checklist | task_alt | report_problem | campaign | school | bar_chart |
  help_outline`. Tap chip → fire `AiAssistantMessageSubmitted` với câu hỏi
  i18n `suggestion.query.<key>` (vd. `"Tìm hiểu về Checklist"`).
- Sau tin nhắn user đầu tiên, list này biến mất; user dùng input bar bình
  thường.
- Nếu `dotenv` chưa có `GEMINI_API_KEY` → `state.isConfigured = false`:
  - Banner đỏ "AI Assistant chưa cấu hình".
  - Input bị disable.
  - Suggestion list không hiển thị.

### Auto scroll
- `BlocConsumer.listenWhen` so sánh `messages.length` và nội dung tin cuối
  để trigger `_scrollToBottom()` mỗi khi có chunk mới.

## 2.8. i18n

- Prefix: `aiAssistant.*` — partial files tại
  `assets/i18n/<lang>/aiAssistant.json` (vi/en/ko/id).
- ~29 key / mỗi ngôn ngữ (greeting + 7 suggestion label + 7 suggestion query
  + 6 error + 4 `tool.lookup.*` cho status function-calling + còn lại UI).
  Sau khi sửa → `dart run supa_l10n_manager merge`.
- System prompt + fallback error message hiện hard-code tiếng Việt trong
  `AiAssistantRepository._buildSystemPrompt` và `AiAssistantBloc._humanError`
  — chấp nhận cho demo, sẽ i18n sau nếu mở rộng.

## 2.9. Theme & UX

- Toàn bộ màu dùng `theme.colorScheme` (không có hard-coded).
- Bubble user: `primary`/`onPrimary`, bo góc lệch về phải.
- Bubble assistant: `surfaceContainerHighest`/`onSurface`, có avatar tròn
  sparkle bên trái, bo góc lệch về trái.
- Bubble lỗi: `errorContainer`/`onErrorContainer`, icon warning.
- Typing indicator: 3 dots animation 900ms loop.
- Launcher card: gradient `primaryContainer` → `secondaryContainer`.

## 2.9b. UX details

### Bubble nổi (chat head)
- **Vị trí mặc định**: mép phải, sát phía trên bottom-nav
  (`screen.width - 68`, `screen.height - 166 - safeBottom`) — bubble đáy cách
  safe-area-bottom 110px (`_defaultBottomOffset`), chừa khoảng cho FAB ở
  `work_home_page`/`inspection_page` (~72px) và dễ với tay trên màn lớn.
- **Drag**: `GestureDetector(onPanUpdate)` cập nhật offset theo `details.delta`,
  clamp trong safe-area (top: status bar + 12, bottom: home-indicator + 12,
  trái/phải: 12). `onPanEnd/onPanCancel` → `_snapToEdge`: tính tâm bubble so
  với midline screen → animate về `_edgeMargin` (trái) hoặc
  `screen.width - bubbleSize - _edgeMargin` (phải).
- **Persist vị trí**: `_persistedTopLeft` (static) lưu vị trí cuối khi widget
  dispose (root rebuild do đổi theme/locale), restore khi initState.
- **Animation**:
  - `AnimatedPositioned` 260ms easeOutCubic cho snap; duration 0 trong lúc
    drag để follow tay user trơn tru.
  - Pulse glow: 1600ms loop reverse, shadow alpha 0.28 → 0.50.
  - Khi đang drag: shadow alpha boost lên 0.45 + blurRadius 18 → 24.
- **Tap**: `onTap` mở `showSupaActionSheet(context)` (helper trong `supa_work`)
  — action sheet bao gồm tile "Trợ lý SuSu" để vào chat AI. Trước đó tap mở
  thẳng `AiAssistantBottomSheet.show(context)`. GestureDetector tự phân biệt
  tap (movement < kPanSlop) với pan, không cần threshold thủ công.
- **Ẩn**: `BlocBuilder<AuthenticationBloc>` — chỉ render khi state là
  `UserAuthenticatedWithSelectedTenantState`. `ListenableBuilder` merge 4
  notifier:
  - `AiAssistantBottomSheet.isOpenNotifier` — fire SYNC khi chat SuSu mở,
    sớm hơn navigator push.
  - `supaActionSheetOpenNotifier` — fire SYNC khi action sheet mở.
  - `BottomSheetVisibilityObserver.isAnyOpenNotifier` — catch-all cho MỌI
    `ModalBottomSheetRoute` push vào root hoặc shell navigator (kể cả sheet
    bên thứ 3 không expose notifier riêng). 2 notifier trên là safety net
    để tránh 1 frame nhấp nháy giữa lúc gọi `show` và lúc route được push.
  - `_level1Notifier` — ẩn khi đang ở **deeper screen** (root navigator
    `canPop() == true`) hoặc ở màn level-1 có FAB riêng
    (`_excludedLevel1Paths`).
- **Detect level-1**: state attach `routerDelegate.addListener` sau frame
  đầu (retry nếu `supaNavigationKey` chưa attach trong cold start). Mỗi
  notify → `addPostFrameCallback` rồi đọc `supaNavigationKey.currentState!`
  `.canPop()` + `routerDelegate.currentConfiguration.uri.path`. Post-frame
  cần thiết vì GoRouter notify TRƯỚC khi Navigator rebuild stack — đọc
  `canPop` ngay sẽ ra giá trị cũ. Set `_excludedLevel1Paths` hiện chứa
  `InspectionQuestionnairePage.location` — bổ sung path khi mọc thêm FAB
  level-1.
- **Compose**: `withFloatingAiAssistant(context, child)` wrap child trong
  `Stack(children: [child, Positioned.fill(child: bubble)])`. Gọi tại
  `lib/main.dart` chồng lên `withStreamChatTheme` ⇒ bubble nằm trên cùng
  toàn app, mọi route đều thấy.

### Đóng bàn phím
- `TextField.onTapOutside` → `FocusManager.instance.primaryFocus?.unfocus()`:
  tap bất kỳ chỗ nào ngoài input (header, message bubble, suggestion chip,
  banner cảnh báo) đều đóng keyboard.
- `ListView.keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag`:
  vuốt danh sách chat cũng đóng keyboard.
- **Bấm Send** (`_handleSubmit`): sau khi submit + clear, gọi
  `_focusNode.unfocus()` + `FocusManager.instance.primaryFocus?.unfocus()`
  để chắc chắn keyboard đóng (trước đây dùng `requestFocus` giữ focus → giờ
  đảo ngược: user thường muốn xem response thay vì gõ tiếp).
- Drag handle ở đầu sheet vẫn kéo xuống đóng sheet hoàn toàn.

### Error message
- Tất cả lỗi LLM hiển thị qua i18n keys `aiAssistant.error.*` với tông giọng
  "SuSu đang thử nghiệm, xin lỗi, mời quay lại sau".
- Chi tiết kỹ thuật (`.env`, model name, stack trace) chỉ log ra console
  bằng `developer.log` ở repository, KHÔNG hiện ra UI.
- Phân loại:
  - `error.notConfigured` — `.env` chưa có key.
  - `error.quota` — `Quota exceeded`.
  - `error.unauthorized` — API key sai / hết quyền.
  - `error.network` — `SocketException`, `Failed host lookup`, timeout.
  - `error.modelNotFound` — model name trong `.env` sai.
  - `error.generic` — fallback cho mọi lỗi khác.

## 2.10. Lưu ý cho maintainer / TODO trước khi production

1. **Bảo mật API key**: hiện key nằm trong `.env` được bundle vào app — ai
   decompile cũng đọc được. Trước khi mở rộng cho user cuối:
   - Dựng 1 proxy mỏng (Cloudflare Worker / Supabase Edge Function) giữ key.
   - Đổi `AiAssistantRepository.streamReply` sang gọi endpoint proxy.
2. **Rate limit & abuse**: chưa có. Proxy nên thêm rate-limit theo
   `appUser.id` hoặc IP.
3. **Khi docs phình to** (> 500KB): chuyển sang RAG (chunk + embedding +
   vector search local) — `AiAssistantDocsLoader` thiết kế sẵn để swap.
4. **Đa ngôn ngữ trong câu trả lời**: hiện system prompt yêu cầu trả lời tiếng
   Việt. Nên detect `Localizations.localeOf(context)` và truyền vào prompt.
5. **Lưu lịch sử hội thoại**: hiện reset mỗi lần mở sheet. Có thể persist
   vào `persistentStorage` nếu cần.
6. **Toastification khi lỗi**: hiện chỉ in lỗi vào bubble. Có thể thêm
   `toastification.show` cho lỗi network để rõ ràng hơn.
7. **Function calling — permission FE-side**: hiện tool báo cáo dựa hoàn toàn
   vào BE check permission (RoleContentType `REPORT_ALL` / `REPORT_BY_SITE`).
   Nếu user không có quyền, BE trả 0/empty → tool trả `hasData=false`, Gemini
   sẽ nói "không có dữ liệu". Cân nhắc thêm check FE-side để fail-fast (không
   tốn HTTP call) khi mở rộng.
8. **Function calling — thêm tool write?**: hiện tool **chỉ read** để tránh
   prompt injection mutate data. Nếu sau này muốn cho SuSu tạo task / issue,
   cần thêm flow **xác nhận user trước khi execute** (vd. preview + confirm
   button), KHÔNG để Gemini fire-and-forget.
9. **Quan trắc usage tool**: log mỗi `tool.execute(args)` qua `developer.log`
   để debug, nhưng chưa có metric. Khi production nên ship qua proxy server
   để track theo `appUser.id` + `tool.name` để tối ưu prompt.
10. **Mở rộng chain xa hơn rate-limit**: hiện cooldown chỉ là client-side
    heuristic. Khi có proxy server, nên đẩy chain logic + đếm token thật
    về proxy (Redis bucket per appUser + per model) — failover lúc đó
    chính xác hơn (vd. weighted round-robin theo quota còn lại).
11. **Stream failover sau chunk đầu**: `_generateContentStreamWithFailover`
    KHÔNG rotate được khi đã có chunk đầu (Gemini streaming chunked, không
    có cơ chế resume). Nếu tương lai cần resilient hơn, cân nhắc fallback
    về `generateContent` non-stream cho turn cuối khi hit lỗi mid-stream.
