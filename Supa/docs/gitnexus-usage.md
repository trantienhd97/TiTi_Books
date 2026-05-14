# Hướng dẫn sử dụng GitNexus

GitNexus là công cụ tạo knowledge graph cho codebase, giúp AI agents hiểu sâu về kiến trúc, call chain và execution flow của project.

---

## Cài đặt

```bash
# Cài global (khuyến nghị)
npm install -g gitnexus

# Cài lại với đầy đủ native parsers (Dart, Swift, ...)
npm install -g gitnexus
# Sau đó cài thêm Dart parser vào thư mục gitnexus:
cd $(npm root -g)/gitnexus && npm install tree-sitter-dart
```

---

## Thiết lập ban đầu (chạy 1 lần)

```bash
gitnexus setup
```

Tự động phát hiện editor đang dùng (Claude Code, Cursor, Windsurf, ...) và ghi cấu hình MCP vào đúng file config. Chỉ cần chạy **một lần duy nhất**, sau đó MCP server hoạt động với mọi project đã index.

---

## Index codebase

### Index cơ bản

```bash
# Index repo hiện tại (tự động bỏ qua nếu đã up-to-date)
gitnexus analyze

# Index một repo cụ thể theo đường dẫn
gitnexus analyze /path/to/repo
```

### Các tuỳ chọn nâng cao

```bash
# Buộc index lại toàn bộ từ đầu (bỏ qua cache)
gitnexus analyze --force

# Tạo skill files theo từng module/community trong project
# Sinh ra .claude/skills/generated/*.md cho AI agent đọc
gitnexus analyze --skills

# Bỏ qua bước tạo embeddings (nhanh hơn, giảm bộ nhớ)
gitnexus analyze --skip-embeddings

# Bật embeddings để tìm kiếm ngữ nghĩa tốt hơn (chậm hơn)
gitnexus analyze --embeddings

# Giữ nguyên nội dung tuỳ chỉnh trong AGENTS.md / CLAUDE.md
# (không để gitnexus ghi đè phần đã chỉnh sửa tay)
gitnexus analyze --skip-agents-md

# Index thư mục không phải Git repository
gitnexus analyze --skip-git

# Hiện log chi tiết các file bị bỏ qua (parser không hỗ trợ)
gitnexus analyze --verbose

# Tăng timeout cho worker khi parse file lớn/phức tạp (giây)
gitnexus analyze --worker-timeout 60
```

---

## Xem thông tin index

```bash
# Liệt kê tất cả repo đã index
gitnexus list

# Xem trạng thái index của repo hiện tại
# (số nodes, edges, thời gian index gần nhất, có stale không)
gitnexus status
```

---

## MCP Server

```bash
# Khởi động MCP server qua stdio (dùng cho Claude Code, Cursor, ...)
gitnexus mcp

# Khởi động HTTP server để kết nối với Web UI
gitnexus serve
# Sau đó mở: https://gitnexus.vercel.app — trang web tự phát hiện server local
```

---

## Xoá index

```bash
# Xoá index của repo hiện tại
gitnexus clean

# Xoá toàn bộ index của tất cả repo
gitnexus clean --all --force
```

---

## Tạo Wiki tự động

GitNexus có thể đọc knowledge graph và tạo tài liệu Markdown cho toàn bộ project (cần API key của LLM).

```bash
# Tạo wiki cho repo hiện tại (dùng model mặc định: gpt-4o-mini)
gitnexus wiki

# Tạo wiki cho repo theo đường dẫn cụ thể
gitnexus wiki /path/to/repo

# Dùng model LLM tuỳ chỉnh
gitnexus wiki --model gpt-4o
gitnexus wiki --model claude-3-5-sonnet-20241022

# Dùng provider LLM tuỳ chỉnh (ví dụ: Anthropic, local Ollama, ...)
gitnexus wiki --base-url https://api.anthropic.com/v1

# Tạo lại wiki từ đầu (bỏ qua cache)
gitnexus wiki --force
```

> Cần set `OPENAI_API_KEY` (hoặc key tương ứng của provider) trong environment trước khi chạy.

---

## Publish (tuỳ chọn)

```bash
# Thông báo cập nhật lên registry understand-quickly (opt-in)
gitnexus publish
```

Cần set `UNDERSTAND_QUICKLY_TOKEN` (GitHub PAT với quyền `Repository dispatches: write`). Không làm gì nếu không có token.

---

## Quản lý nhóm repo (Multi-repo / Monorepo)

Dùng khi cần theo dõi nhiều repo liên quan nhau (microservices, monorepo, ...).

```bash
# Tạo một nhóm repo mới
gitnexus group create <tên-nhóm>

# Thêm repo vào nhóm
# <groupPath>: đường dẫn phân cấp, ví dụ: backend/auth/api
# <registryName>: tên repo trong registry (xem bằng `gitnexus list`)
gitnexus group add <tên-nhóm> <groupPath> <registryName>
# Ví dụ:
gitnexus group add supa-services backend/auth SupaMobileApp

# Xoá repo khỏi nhóm theo groupPath
gitnexus group remove <tên-nhóm> <groupPath>

# Liệt kê tất cả nhóm, hoặc xem chi tiết một nhóm
gitnexus group list
gitnexus group list <tên-nhóm>

# Trích xuất contracts (API, interface) và khớp giữa các repo
gitnexus group sync <tên-nhóm>

# Xem các contracts và cross-links đã được trích xuất
gitnexus group contracts <tên-nhóm>

# Tìm kiếm execution flows qua tất cả repo trong nhóm
gitnexus group query <tên-nhóm> "authentication flow"

# Kiểm tra xem repo nào trong nhóm đang stale (cần re-index)
gitnexus group status <tên-nhóm>
```

---

## MCP Tools (dùng trong AI agent)

Sau khi index xong, các tools sau khả dụng qua MCP:

| Tool                      | Mô tả                                                               |
| ------------------------- | ------------------------------------------------------------------- |
| `gitnexus_query`          | Tìm kiếm code theo concept, trả về kết quả nhóm theo execution flow |
| `gitnexus_context`        | Xem 360° về một symbol: callers, callees, processes tham gia        |
| `gitnexus_impact`         | Phân tích blast radius — cái gì sẽ bị ảnh hưởng nếu sửa symbol này  |
| `gitnexus_detect_changes` | Map các thay đổi git hiện tại sang affected processes và risk level |
| `gitnexus_rename`         | Đổi tên symbol an toàn trên toàn bộ codebase theo call graph        |
| `gitnexus_cypher`         | Chạy Cypher query trực tiếp trên knowledge graph                    |

### Ví dụ sử dụng trong workflow

```
# Trước khi sửa một function, luôn chạy impact analysis:
gitnexus_impact({ target: "tênFunction", direction: "upstream" })

# Tìm hiểu một luồng xử lý:
gitnexus_query({ query: "authentication middleware" })

# Xem đầy đủ context của một class:
gitnexus_context({ name: "UserRepository" })

# Kiểm tra tác động trước khi commit:
gitnexus_detect_changes({ scope: "all" })
```

---

## Workflow khuyến nghị

```bash
# 1. Lần đầu setup (chỉ chạy 1 lần)
gitnexus setup
gitnexus analyze

# 2. Sau khi thêm/sửa nhiều code
gitnexus analyze          # tự động chỉ index phần thay đổi

# 3. Khi index bị stale hoặc có lỗi
gitnexus analyze --force

# 4. Tạo skill files giúp AI hiểu từng module
gitnexus analyze --skills
```

---

## Cấu trúc file sinh ra

```
.gitnexus/           # Index database (gitignored, lưu local)
.claude/
  skills/
    gitnexus/        # Skill files hướng dẫn AI dùng GitNexus
    generated/       # Skill files tự động theo module (--skills)
AGENTS.md            # Context file cho AI agents (tự động cập nhật)
CLAUDE.md            # Context file riêng cho Claude Code
```
