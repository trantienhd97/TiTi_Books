# Create Announcement (Heads Up) Feature

## 1. Overview
The feature allows authorized users (Manager/Admin) to quickly access a task menu (Bottom Sheet) to draft and send instant announcements to the entire team or specific members in the system. The goal is to convey important information as quickly as possible.

## 2. UI Description
### 2.1. Access Point
- **Location**: Inside the Quick Action Menu (Bottom Sheet) when the user clicks the "Create" (+) or "Menu" button.
- **Order**: 2nd in the list (under "Perform Checklist").

### 2.2. UI Item: Announcement
- **Container**: Tappable row with icon, title, description, and navigation arrow.
- **Icon**: Megaphone icon (purple) on a light purple circular background.
- **Title**: "Thông báo" (Bold).
- **Description**: "Truyền tải thông tin nhanh chóng tới toàn bộ đội ngũ" (Regular, grey).
- **Action Icon**: Right chevron (Chevron right).

## 3. Business Flow & Logic
### 3.1. Main Flow
1. User opens the Quick Action Menu (Bottom Sheet).
2. System displays the list of actions.
3. User selects "Thông báo".
4. System closes the Bottom Sheet and navigates to the "Create Announcement" screen.

### 3.2. Detailed Logic
| No | Field | Type | Description | Business Rules |
|---|---|---|---|---|
| 1 | Close Button | Icon Button | "X" icon at the top left. | Triggers "Cancel Post" popup (See 3.3.A) if data is dirty. |
| 2 | Send Button | Icon Button | Paper plane icon at the top right. | 1. Validate (Title mandatory). 2. Trigger "Post Announcement" popup (See 3.3.B). |
| 3 | Attachment Area | List/Button | "+ Thêm nội dung" (Add Media) button. Supports: png, jpg, jpeg, mp4, doc, docx, xls, xlsx, ppt, pptx, pdf, zip, etc. | 1. Choose from gallery (Photo/Video). 2. Capture from camera (Take Photo / Record Video). 3. Choose File. **Max video duration: 3 minutes**. Horizontal preview scroll. |
| 4 | Title | Text Input | Label: "Tiêu đề thông báo *". Placeholder: "Nhập tên công việc". | Mandatory. Max 550 characters. |
| 5 | Description | Text Area | Label: "Mô tả thông báo". Placeholder: "Thêm mô tả". | Optional. Multi-line. |
| 6 | Recipients | Tag Input | Label: "Người nhận". | Tags for individuals, groups, sites. Defaults to "All" or user config. |
| 7 | Acknowledgment | Toggle | Label: "Yêu cầu xác nhận". | Default: ON. |

### 3.3. Modals
#### A. Popup "Hủy đăng bài" (Cancel Post)
- **Title**: "Hủy đăng bài"
- **Content**: "Bạn đang hủy bài đăng thông báo. Toàn bộ nội dung đã soạn sẽ bị mất. Tiếp tục?"
- **Left Button**: "Đóng" -> Close popup, keep editing.
- **Right Button**: "Hủy đăng bài" -> Close popup, close editor, discard data.

#### B. Popup "Đăng thông báo" (Post Announcement)
- **Title**: "Đăng thông báo"
- **Content**: "Thông báo được đăng sẽ hiển thị ngay lập tức trên bảng tin của những người được gán. Đăng thông báo ngay?"
- **Left Button**: "Đóng" -> Close popup, keep editing.
- **Right Button**: "Đăng thông báo" -> Call API, show success toast, navigate back.

## 4. Technical Details
- **API Endpoint**: `https://ndev.supa.vn/rpc/work/heads-up/create`
- **Method**: RPC (likely POST)
- **Data Model**: `HeadsUp`
- **Navigation**: After posting, redirect to the Announcement List screen (accessible via "More" -> "Bảng tin").
