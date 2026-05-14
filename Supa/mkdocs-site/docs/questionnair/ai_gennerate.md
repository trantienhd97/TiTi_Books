Dưới đây là **tài liệu final** để gửi team frontend, đã cập nhật theo bản bạn sửa: **SignalR gửi theo `Clients.User($"{TenantId}.{GlobalUserId}")`** và **event name mới** `ReceiveQuestionnaireAIGenerated`.

## Tích hợp tính năng “Tạo biểu mẫu bằng AI” (Final)

### 1) Tổng quan luồng

1. Frontend gọi API `generate-by-ai` với `Description + FileId`.
2. Backend trả về quesionnaire draft và bắt đầu luồng gen. FrontEnd nhận quesionnaire draft update vào state hiện tại và hiện loading trạng thái gen.
3. Frontend subcire channel signalr và đợi event complete để kết thúc việc gen.

---

### 2) API generate-by-ai 
**Endpoint**

```text
POST rpc/work/questionnaire/generate-by-ai
```

**Content-Type**

```text
multipart/form-data
```

**Form fields**

- `Description`: `string` (prompt của user, bất kỳ ngôn ngữ)
- `File`: file upload (`.docx/.xlsx/.pdf/.txt/.md`)

**Giới hạn file**

- Max 15MB

**Response**

- `200 OK`: bắt đầu tiến trình generate (nội dung về qua SignalR)
- `400 BadRequest`: validation lỗi (payload theo DTO response của API, tùy implement hiện tại)

---

### 3) SignalR

**Hub URL**

```text
/rpc/work/setup/signalr
```

**Event name frontend cần subscribe**

```text
ReceiveQuestionnaireAIGenerated
```

**Lưu ý scope**

- Backend **không broadcast toàn hệ thống** nữa.
- Backend gửi theo `Clients.User($"{TenantId}.{GlobalUserId}")`, nên **chỉ user đó** nhận được event.
- Nếu user mở nhiều tab, **mọi tab của user** có thể nhận event → frontend phải lọc theo `questionnaireId`.

---

### 4) Event schema (SignalR payload)

```ts
type QuestionnaireAIGeneratedEvent = {
  questionnaireId: number;
  appUserId: number; // optional, tùy backend gửi
  eventType: string;
  status: "Streaming" | "Completed" | "Error";
  message?: string;
  payload?: any;
};
```

Frontend phải xử lý:

- `status="Error"`: hiển thị message và dừng luồng.
- `status="Completed"`: kết thúc loading/progress.
