# Trang HOME

Link thiết kế [https://www.figma.com/design/jM4Xopoh41pK1UhYEnxWUq/Workplace-Home?node-id=17332-9867&amp;t=dP7ebSyjPiKduZBj-4](https://www.figma.com/design/jM4Xopoh41pK1UhYEnxWUq/Workplace-Home?node-id=17332-9867&t=dP7ebSyjPiKduZBj-4)

# TÀI LIỆU MÔ TẢ MÀN HÌNH: TRANG HOMEPAGE (SUPA)

<figure class="image align-center" id="bkmrk-">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/vyfimage.png)<figcaption></figcaption></figure>## 1. Thông tin chung

- **Tên màn hình:** Của tôi / My space
- **Mục đích:** Cung cấp cái nhìn tổng quan về các đầu việc cần xử lý trong ngày, truy cập nhanh các chức năng tạo mới và theo dõi trạng thái checklist/công việc/đào tạo...
- **Đối tượng sử dụng:** Nhân viên, Quản lý (User có quyền truy cập hệ thống).

## 2. Mô tả Giao diện (UI Components)

### 2.1. Thanh điều hướng (Sidebar)

- Hiển thị danh sách các chức năng chính gồm:

<table border="1" cellpadding="0" cellspacing="0" data-sheets-baot="1" data-sheets-root="1" dir="ltr" id="bkmrk-menu-ti%E1%BA%BFng-vi%E1%BB%87t-menu" style="width: 996px; height: 482.547px;"><colgroup><col style="width: 289.333px;" width="100"></col><col style="width: 316.333px;" width="243"></col><col style="width: 217.333px;" width="100"></col></colgroup><tbody><tr style="height: 29.7969px;"><td style="height: 29.7969px;">**Menu Tiếng Việt**</td><td style="height: 29.7969px;">**Menu English (Standard)**</td><td style="height: 29.7969px;">**Ghi chú**</td></tr><tr style="height: 29.7969px;"><td style="height: 29.7969px;">Của tôi</td><td style="height: 29.7969px;"> My Space</td><td style="height: 29.7969px;">Tab mặc định</td></tr><tr style="height: 46.5938px;"><td style="height: 46.5938px;">Nhắn tin</td><td style="height: 46.5938px;">Messages</td><td style="height: 46.5938px;">Điều hướng sang chức năng nhắn tín/chat</td></tr><tr style="height: 57.7969px;"><td style="height: 57.7969px;">Báo cáo</td><td style="height: 57.7969px;">Reports</td><td style="height: 57.7969px;">Điều hướng sang chức năng báo cáo tổng hợp

</td></tr><tr style="height: 46.5938px;"><td style="height: 46.5938px;">Biểu mẫu</td><td style="height: 46.5938px;">Forms</td><td style="height: 46.5938px;">Điều hướng sang chức năng biểu mẫu (WORK)</td></tr><tr style="height: 46.5938px;"><td style="height: 46.5938px;">Checklist</td><td style="height: 46.5938px;">Checklist</td><td style="height: 46.5938px;">Điều hướng sang chức năng check list (WORK)</td></tr><tr style="height: 46.5938px;"><td style="height: 46.5938px;">Lịch checklist</td><td style="height: 46.5938px;">Checklist Schedule</td><td style="height: 46.5938px;">Điều hướng sang chức năng Đặt lịch (WORK)</td></tr><tr style="height: 29.7969px;"><td style="height: 29.7969px;">Công việc</td><td style="height: 29.7969px;">Tasks</td><td style="height: 29.7969px;">Điều hướng sang chức năng Công việc (WORK)</td></tr><tr style="height: 29.7969px;"><td style="height: 29.7969px;">Lịch</td><td style="height: 29.7969px;">Calendar</td><td style="height: 29.7969px;">Điều hướng sang chức năng calender </td></tr><tr style="height: 29.7969px;"><td style="height: 29.7969px;">Đào tạo</td><td style="height: 29.7969px;">Training</td><td style="height: 29.7969px;">Điều hướng sang chức năng Đào tạo (Traing)</td></tr><tr style="height: 29.7969px;"><td style="height: 29.7969px;">Dự án</td><td style="height: 29.7969px;">Projects</td><td style="height: 29.7969px;">Điều hướng sang chức năng Dự án</td></tr><tr style="height: 29.7969px;"><td style="height: 29.7969px;">Cài đặt</td><td style="height: 29.7969px;">Settings</td><td style="height: 29.7969px;">Điều hướng sang chức năng Cài đặt</td></tr><tr style="height: 29.7969px;"><td style="height: 29.7969px;">Ứng dụng</td><td style="height: 29.7969px;">Apps</td><td style="height: 29.7969px;">Điều hướng sang ds các phân hệ trong ứng dụng</td></tr></tbody></table>

- **Active State:** Highlight menu "Của tôi".

### 2.2. Thanh công cụ phía trên (Top Bar)

- **Logo:** Click về trang chủ.
- **Search bar:** Tìm kiếm toàn cục trong hệ thống. Tìm kiếm theo các trường thông tin:
    
    
    - Tên check list
    - Tên công việc
    - Tên khóa học
    - Tên training path
    - Tiêu đề quizzes
    - Tên địa điểm
- **Tên đơn vị:** Hiển thị tên công ty/chi nhánh hiện tại.
- **User Profile:** Avatar người dùng và các thiết lập tài khoản. Bẩm vào avatar, hiển thị block thông tin
    
    
    - Tên hiển thị - Email
    - Các action: 
        - Quản lý tài khoản --&gt; Bấm vào điều hướng sang trang quản lý hồ sơ và tài khoản của user đó
        - Cài đặt thông. báo
        - Đổi công ty --&gt; Bấm vào quay ra màn hình list danh sách các tenant
- **Nút "Tạo nhanh" (+):** Điểm nhấn chính để thực hiện nhanh các tác vụ.

---

## 3. Đặc tả Chức năng "Tạo nhanh"

Khi người dùng Click vào button **\[+ Tạo nhanh\]**, hệ thống hiển thị một Dropdown Menu chứa các hành động sau:

<table data-path-to-node="14" id="bkmrk-stt-h%C3%A0nh-%C4%91%E1%BB%99ng-m%C3%B4-t%E1%BA%A3-"><thead><tr><td>**STT**</td><td>**Hành động**</td><td>**Mô tả**</td><td>**Điều hướng**</td></tr></thead><tbody><tr><td><span data-path-to-node="14,1,0,0">1</span></td><td><span data-path-to-node="14,1,1,0">Tạo biểu mẫu mới</span></td><td><span data-path-to-node="14,1,2,0">Mở màn hình thiết kế/chọn template biểu mẫu.</span></td><td><span data-path-to-node="14,1,3,0">Màn hình Tạo biểu mẫu.</span></td></tr><tr><td><span data-path-to-node="14,2,0,0">2</span></td><td><span data-path-to-node="14,2,1,0">Thực hiện checklist</span></td><td><span data-path-to-node="14,2,2,0">Chọn danh mục checklist cần thực hiện ngay.</span></td><td><span data-path-to-node="14,2,3,0">Pop-up/Màn hình Checklist.</span></td></tr><tr><td><span data-path-to-node="14,3,0,0">3</span></td><td><span data-path-to-node="14,3,1,0">Tạo công việc</span></td><td><span data-path-to-node="14,3,2,0">Mở form tạo task mới (Assignee, Deadline, Nội dung).</span></td><td><span data-path-to-node="14,3,3,0">Pop-up Tạo công việc.</span></td></tr><tr><td><span data-path-to-node="14,4,0,0">4</span></td><td><span data-path-to-node="14,4,1,0">Đặt lịch thực hiện checklist</span></td><td><span data-path-to-node="14,4,2,0">Lên lịch định kỳ hoặc lịch cụ thể cho một checklist.</span></td><td><span data-path-to-node="14,4,3,0">Màn hình Lập lịch.</span></td></tr><tr><td><span data-path-to-node="14,5,0,0">5</span></td><td><span data-path-to-node="14,5,1,0">Tạo khóa học</span></td><td><span data-path-to-node="14,5,2,0">Mở form tạo mới nội dung đào tạo.</span></td><td><span data-path-to-node="14,5,3,0">Màn hình Quản trị Đào tạo.</span></td></tr><tr><td><span data-path-to-node="14,6,0,0">6</span></td><td><span data-path-to-node="14,6,1,0">Tạo quiz</span></td><td><span data-path-to-node="14,6,2,0">Mở form thiết kế câu hỏi kiểm tra.</span></td><td><span data-path-to-node="14,6,3,0">Màn hình Tạo Quiz.</span></td></tr></tbody></table>

## 4. Mô tả Khu vực nội dung (Main Content - Dynamic Blocks)

Khu vực này được thiết kế theo dạng các **Block (Khối nội dung)**. Hệ thống sẽ hiển thị tối đa 05 loại Block sau (nếu có dữ liệu).

### 4.1. Logic hiển thị chung (Business Rules)

- **Quy tắc ẩn/hiện:** Hệ thống thực hiện kiểm tra dữ liệu của từng Block. Nếu Block nào **không có bản ghi** nào cần xử lý (Count = 0), hệ thống sẽ **ẩn hoàn toàn** Block đó khỏi giao diện để tối ưu không gian.
- **Sắp xếp:** Thứ tự ưu tiên hiển thị: Checklist &gt; Công việc &gt; Lộ trình học &gt; Khóa học &gt; Quizzes.
- **Số lượng bản ghi:** Mỗi Block hiển thị tối đa 5 bản ghi mới nhất/ưu tiên nhất.
- **Nút "Xem tất cả":** Click để điều hướng đến màn hình danh sách đầy đủ của phân hệ đó.
- **Nút "Xem thêm":** Mở rộng danh sách ngay tại Dashboard (Lazy loading)--&gt; Cho phép scroll tại từng khung của các thông tin.

### 4.2. Chi tiết các Block dữ liệu

<table data-path-to-node="21" id="bkmrk-t%C3%AAn-block-c%C3%A1c-tr%C6%B0%E1%BB%9Dng" style="width: 109.506%;"><thead><tr><td style="width: 23.8404%;">**Tên Block**</td><td style="width: 29.0644%;">**Các trường thông tin hiển thị**</td><td style="width: 47.0952%;">**Ghi chú**</td></tr></thead><tbody><tr><td style="width: 23.8404%;"><span data-path-to-node="21,1,0,0">**Checklist**</span>

kèm tag hiển thị SL check list hôm nay mà user cần thực hiện

</td><td style="width: 29.0644%;"><span data-path-to-node="21,1,1,0">Tên Checklist, Thời gian (Deadline), Địa điểm.</span></td><td style="width: 47.0952%;">- <span data-path-to-node="21,1,2,0">Danh sách Hiển thị 05 check list cần thực hiện có thời gian đến hạn gần nhất với hiện tại </span>
- Hiển thị các trạng tái của từng check list
- Bấm. vào mở ra modal thông tin check list
- Bấm "xem thêm" để Mở rộng danh sách ngay tại Dashboard (Lazy loading)--&gt; Cho phép scroll tại từng khung của các thông tin.

</td></tr><tr><td style="width: 23.8404%;"><span data-path-to-node="21,2,0,0">**Công việc**</span>

<span data-path-to-node="21,2,0,0">Kèm tag hiển thị toàn bộ số lượng CV <span data-path-to-node="21,2,2,0"> của ng dùng hiện ở trạng thái ở trạng thái cần làm và đang làm hôm nay và cv gần nhất. (view mặc định) mà user hiện tại là người thực hiện và ng hỗ trợ</span></span>

</td><td style="width: 29.0644%;"><span data-path-to-node="21,2,1,0">Checkbox, Tên công việc, Mã ID, Avatar người tham gia, Deadline.</span></td><td style="width: 47.0952%;">- <span data-path-to-node="21,2,2,0">Danh sách Hiện thị 05 công việc của ng dùng hiện ở trạng thái ở trạng thái cần làm của cv hôm nay và cv gần nhất. (view mặc định) mà user hiện tại là người thực hiện và ng hỗ trợ</span>
- <span data-path-to-node="21,2,2,0">Bấm vào icon đầu công việc để chuyển trạng thái</span>
- <span data-path-to-node="21,2,2,0">Bấm vào dòng công việc để mở ra công việc</span>
- <span data-path-to-node="21,2,2,0">Bấm vào icon chat để mở ra khung chat</span>
- Bấm "xem thêm" để Mở rộng danh sách ngay tại Dashboard (Lazy loading)--&gt; Cho phép scroll tại từng khung của các thông tin. <span data-path-to-node="21,2,2,0"></span>

</td></tr><tr><td style="width: 23.8404%;"><span data-path-to-node="21,3,0,0">**Lộ trình học**</span>

<span data-path-to-node="21,3,0,0">Hiển thị tag số lượng toàn bộ lộ trình học mà đến hiện tại user cần học tập</span>

</td><td style="width: 29.0644%;"><span data-path-to-node="21,3,1,0">Tên lộ trình, Tiến độ (%), Ngày bắt đầu/kết thúc.</span></td><td style="width: 47.0952%;">- 04 lộ trình trên 1 scroll ngang
- <span data-path-to-node="21,3,2,0">Bấm vào mở ra màn học tập lộ trình</span>

</td></tr><tr><td style="width: 23.8404%;"><span data-path-to-node="21,4,0,0">**Khóa học**</span>

<span data-path-to-node="21,4,0,0">+ kèm tag tổng số khóa học mà user cần học đến hiện tại</span>

</td><td style="width: 29.0644%;"><span data-path-to-node="21,4,1,0">Tên khóa học, Giảng viên, Thời lượng.</span></td><td style="width: 47.0952%;">- <span data-path-to-node="21,4,2,0">Bấm vào mở ra màn hình học tập khóa học</span>
- <span data-path-to-node="21,4,2,0">Khóa học đã đc đưa vào lộ trình thì k hiển thị ở list khóa học nữa</span>
- <span data-path-to-node="21,4,2,0">Scroll ngang đển </span>

</td></tr><tr><td style="width: 23.8404%;"><span data-path-to-node="21,5,0,0">**Quizzes**</span></td><td style="width: 29.0644%;"><span data-path-to-node="21,5,1,0">Tên bài Quiz, Số câu hỏi, Thời gian làm bài.</span></td><td style="width: 47.0952%;"><span data-path-to-node="21,5,2,0">Bám vào mở ra màn thi quiz</span></td></tr></tbody></table>

---

## 5. Thanh slider bên phải --&gt; Overfloating 

1. Calender : Click vào mở ra lịch thực hiện
2. Chat : Click vào mở ra khung chat - &gt; Hệ thống mở ra một Khung danh sách hội thoại đồng thời đẩy chiều rộng của Content chính bé lại.

## 6. Mô tả Tương tác &amp; Điều hướng (User Flow)

**6.1. TỔNG QUAN**

1. **Click vào Tiêu đề Block hoặc "Xem tất cả":**
    
    
    - Hệ thống điều hướng người dùng đến màn hình Index (Danh sách) của phân hệ tương ứng.
2. **Click vào một Bản ghi cụ thể:**
    
    
    - **Đối với Checklist:** Điều hướng vào màn hình thực hiện chi tiết checklist đó.
    - 
    - **Đối với Công việc:** Mở Slide-over hoặc Màn hình chi tiết công việc để xem/comment/update trạng thái.
    - **Đối với Khóa học/Lộ trình/Quiz:** Điều hướng vào màn hình học tập hoặc màn hình bắt đầu bài kiểm tra tương ứng.
3. **Tương tác nhanh trên Block Công việc:**
    
    
    - Cho phép người dùng click vào Checkbox ở đầu dòng để đánh dấu "Hoàn thành" ngay tại icon đầu mỗi dòng công việc.
    - Danh sách công việc <span data-path-to-node="21,2,2,0">trạng thái ở trạng thái <span style="color: #e03e2d;">**cần làm <span style="color: #000000;">và</span> đang làm** </span>hôm nay và cv gần nhất. (view mặc định) mà user hiện tại là người thực hiện và ng có quyền sửa công việc</span>
    - <span data-path-to-node="21,2,2,0" style="color: #e03e2d;">Các icon tròn ở màn hình list thì các công việc bỏ qua hiển thị trạng thái trung gian mà cho phep user hoàn thành trực tiếp trên giao diện này. (Nếu muốn chuyển trạng thái trung gian thì bấm vào detail để chuyển trạng thái trung gian) --&gt; Giống nhau ở màn Của tôi &amp; menu Công việc</span>
    - **<span data-path-to-node="21,2,2,0">Các TH cụ thể như sau (</span>**<span data-path-to-node="21,2,2,0">Lưu ý tài liệu sẽ mô tả chung cho việc chuyển trạng thái ở các trạng thái --&gt; BE sẽ order riêng với màn của tôi sẽ chỉ hiển thị CV ở trạng thái <span style="color: #e03e2d;">cần làm <span style="color: #000000;">và </span>đang làm</span>) </span><span data-path-to-node="21,2,2,0"></span>

##### **<span data-path-to-node="21,2,2,0">A. CÔNG VIỆC CHỈ CẦN 1 NGƯỜI HOÀN THÀNH</span>**

**<span data-path-to-node="21,2,2,0">TH1: Công việc chỉ cần 1 người hoàn thành, user hiện tại là ng thực hiện</span>**

<table id="bkmrk-tr%E1%BA%A1ng-th%C3%A1i-hi%E1%BB%83n-th%E1%BB%8B-" style="width: 810px; height: 1545.12px;"><tbody><tr style="height: 57.7812px;"><td style="width: 169.297px; height: 57.7812px;">**Trạng thái hiển thị**

</td><td style="width: 187.281px; height: 57.7812px;">**Icon tương tác**

</td><td style="width: 264.375px; height: 57.7812px;">**Action tương tác**

</td><td style="width: 188.047px; height: 57.7812px;">**Trạng thái sau khi chuyển đổi**

</td></tr><tr style="height: 577.375px;"><td style="width: 169.297px; height: 577.375px;">Cần làm

</td><td style="width: 187.281px; height: 577.375px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/juyimage.png)<figcaption></figcaption></figure></td><td style="width: 264.375px; height: 577.375px;">Bấm vào nút để chuyển trạng thái sang hoàn thành.

Lưu ý: Vấn tuân thủ các quy tắc theo cấu hình (Cần bằng chứng, ghi chú...)

</td><td style="width: 188.047px; height: 577.375px;">- **Hoàn thành**

</td></tr><tr style="height: 295.078px;"><td style="width: 169.297px; height: 295.078px;"> Cần làm</td><td style="width: 187.281px; height: 295.078px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/x3Vimage.png)<figcaption></figcaption></figure></td><td style="width: 264.375px; height: 295.078px;"> Bấm vào nút hiển thị popup yêu cầu hoàn thành check list trong công việc trước khi đổi trạng thái

<figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/C81image.png)<figcaption></figcaption></figure></td><td style="width: 188.047px; height: 295.078px;">Cần làm</td></tr><tr style="height: 252.344px;"><td style="width: 169.297px; height: 252.344px;">Đang làm </td><td style="width: 187.281px; height: 252.344px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/ZvXimage.png)<figcaption></figcaption></figure></td><td style="width: 264.375px; height: 252.344px;">Bấm vào nút để chuyển trạng thái sang hoàn thành.

Lưu ý: Vấn tuân thủ các quy tắc theo cấu hình (Cần bằng chứng, ghi chú...)

</td><td style="width: 188.047px; height: 252.344px;">Hoàn thành</td></tr><tr style="height: 179.375px;"><td style="width: 169.297px; height: 179.375px;">Không thể </td><td style="width: 187.281px; height: 179.375px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/Zxhimage.png)<figcaption></figcaption></figure></td><td style="width: 264.375px; height: 179.375px;">Bấm vào thì chuyển trạng thái Hoàn thành

</td><td style="width: 188.047px; height: 179.375px;">Hoàn thành</td></tr><tr style="height: 147.781px;"><td style="width: 169.297px; height: 147.781px;">Hoàn thành</td><td style="width: 187.281px; height: 147.781px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/wzHimage.png)<figcaption></figcaption></figure></td><td style="width: 264.375px; height: 147.781px;">Bấm vào chuyển trạng thái "Cần làm"

</td><td style="width: 188.047px; height: 147.781px;">Cần làm</td></tr></tbody></table>

**<span data-path-to-node="21,2,2,0">TH2: Công việc chỉ cần 1 người hoàn thành, user hiện tại là hỗ trợ, có quyền sửa công việc</span>**

<table id="bkmrk-tr%E1%BA%A1ng-th%C3%A1i-hi%E1%BB%83n-th%E1%BB%8B--1" style="width: 797px; height: 472.352px;"><tbody><tr style="height: 35.3984px;"><td style="width: 198.969px; height: 35.3984px;">**Trạng thái hiển thị**

</td><td style="width: 198.969px; height: 35.3984px;">**Icon tương tác**

</td><td style="width: 198.969px; height: 35.3984px;">**Action tương tác**

</td><td style="width: 199.094px; height: 35.3984px;">**Trạng thái sau khi chuyển đổi**

</td></tr><tr style="height: 126.031px;"><td style="width: 198.969px; height: 126.031px;">Cần làm

</td><td style="width: 198.969px; height: 126.031px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/juyimage.png)<figcaption></figcaption></figure></td><td style="width: 198.969px; height: 126.031px;">1. Bấm vào nút để chuyển trạng thái sang hoàn thành.

**-**  Vấn tuân thủ các quy tắc theo cấu hình (Cần bằng chứng, ghi chú...)

2\. Với những công việc ở trạng thái cần làm nhưng có yêu cầu hoàn thành check list trong CV -&gt; Bấm vào nút trạng thái hiển thị pop-up cảnh báo

<figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/C81image.png)<figcaption></figcaption></figure></td><td style="width: 199.094px; height: 126.031px;">- **Hoàn thành**

</td></tr><tr><td style="width: 198.969px;">Đang làm </td><td style="width: 198.969px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/ZvXimage.png)<figcaption></figcaption></figure></td><td style="width: 198.969px;">Bấm vào nút để chuyển trạng thái sang hoàn thành.

Lưu ý: Vấn tuân thủ các quy tắc theo cấu hình (Cần bằng chứng, ghi chú...)

</td><td style="width: 199.094px;">Hoàn thành</td></tr><tr><td style="width: 198.969px; height: 179.375px;">Không thể </td><td style="width: 198.969px; height: 179.375px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/Zxhimage.png)<figcaption></figcaption></figure></td><td style="width: 198.969px; height: 179.375px;">Bấm vào thì chuyển trạng thái Hoàn thành

</td><td style="width: 199.094px; height: 179.375px;">Hoàn thành</td></tr><tr><td style="width: 198.969px; height: 147.781px;">Hoàn thành</td><td style="width: 198.969px; height: 147.781px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/wzHimage.png)<figcaption></figcaption></figure></td><td style="width: 198.969px; height: 147.781px;">Bấm vào chuyển trạng thái "Cần làm"

</td><td style="width: 199.094px; height: 147.781px;">Cần làm</td></tr></tbody></table>

**<span data-path-to-node="21,2,2,0">TH3: Công việc chỉ cần 1 người hoàn thành, user hiện tại là hỗ trợ, không có quyền thay đổi ;sửa công việc</span>**

- Bấm vào các icon không có response --&gt; Click vào chi tiết chỉ view công việc

##### **<span data-path-to-node="21,2,2,0">B. CÔNG VIỆC CHỈ CẦN TOÀN BỘ HOÀN THÀNH</span>**

**<span data-path-to-node="21,2,2,0">TH1: User là người thực hiện và có quyền sửa công việc</span>**

<table id="bkmrk-tr%E1%BA%A1ng-th%C3%A1i-hi%E1%BB%83n-th%E1%BB%8B--2" style="width: 797px; height: 1451.45px;"><tbody><tr style="height: 57.7812px;"><td style="width: 139.969px; height: 57.7812px;">**Trạng thái hiển thị**

</td><td style="width: 161.969px; height: 57.7812px;">**Icon tương tác**

</td><td style="width: 294.969px; height: 57.7812px;">**Action tương tác**

</td><td style="width: 199.094px; height: 57.7812px;">**Trạng thái sau khi chuyển đổi**

</td></tr><tr style="height: 526.359px;"><td style="width: 139.969px; height: 526.359px;">Cần làm

</td><td style="width: 161.969px; height: 526.359px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/CX1image.png)<figcaption></figcaption></figure><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/I4vimage.png)<figcaption></figcaption></figure></td><td style="width: 294.969px; height: 526.359px;">1/Dropdown trả 2 trạng thái để user lựa chọn

- Tôi đã hoàn thành
- Hoàn thành cho tất cả.

Lưu ý: Vấn tuân thủ các quy tắc theo cấu hình (Cần bằng chứng, ghi chú...)

2/ Đối với những Cv chưa hoàn thành check list bên trong, khi click vào icon, hiển thị pop-up hoàn thành cv trước khi thay đổi trạng thái

<figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/C81image.png)<figcaption></figcaption></figure>3/ Khi người bấm là người cuối cùng cần hoàn thành công việc thì sẽ có UX tương ứng với việc công việc được hoàn thành này. !!!!!

</td><td style="width: 199.094px; height: 526.359px;">Trạng thái thay đổi tương ứng với lựa chọn:

- **Tôi Hoàn thành**
- **Hoàn thành**

</td></tr><tr style="height: 526.359px;"><td style="width: 139.969px; height: 526.359px;">Đang làm

</td><td style="width: 161.969px; height: 526.359px;">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/ZvXimage.png)

</td><td style="width: 294.969px; height: 526.359px;">1/Dropdown trả 2 trạng thái để user lựa chọn

- Tôi đã hoàn thành
- Hoàn thành cho tất cả.

Lưu ý: Vấn tuân thủ các quy tắc theo cấu hình (Cần bằng chứng, ghi chú...)

2/ Đối với những Cv chưa hoàn thành check list bên trong, khi click vào icon, hiển thị pop-up hoàn thành cv trước khi thay đổi trạng thái

<figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/C81image.png)<figcaption></figcaption></figure>3/ Khi người bấm là người cuối cùng cần hoàn thành công việc thì sẽ có UX tương ứng với việc công việc được hoàn thành này. !!!!!

</td><td style="width: 199.094px; height: 526.359px;">Trạng thái thay đổi tương ứng với lựa chọn:

- **Tôi Hoàn thành**
- **Hoàn thành**

</td></tr><tr style="height: 177.375px;"><td style="width: 139.969px; height: 177.375px;">Không thể </td><td style="width: 161.969px; height: 177.375px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/Zxhimage.png)<figcaption></figcaption></figure></td><td style="width: 294.969px; height: 177.375px;">Tùy vào từng TH :

TH1: User là ng đã chọn "Tôi Không thể"

Bấm vào thì dropdown 2 trạng thái:

- Tôi hoàn thành
- Hoàn thành cho tất cả

TH2: User là người đã chuyển trạng thái "Tôi hoàn thành",. Bấm vào thì DDL trạng thái

- Hoàn thành cho tất cả

</td><td style="width: 199.094px; height: 177.375px;">Hoàn thành</td></tr><tr style="height: 163.578px;"><td style="width: 139.969px; height: 163.578px;">Hoàn thành</td><td style="width: 161.969px; height: 163.578px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/wzHimage.png)<figcaption></figcaption></figure></td><td style="width: 294.969px; height: 163.578px;">Bấm vào chuyển trạng thái

- Mở lại cho tất cả

</td><td style="width: 199.094px; height: 163.578px;">Cần làm</td></tr></tbody></table>

TH 2 **<span data-path-to-node="21,2,2,0">: User là người thực hiện và không có quyền sửa công việc</span>**

<table id="bkmrk-tr%E1%BA%A1ng-th%C3%A1i-hi%E1%BB%83n-th%E1%BB%8B--3" style="width: 797px; height: 472.352px;"><tbody><tr style="height: 35.3984px;"><td style="width: 139.969px; height: 35.3984px;">**Trạng thái hiển thị**

</td><td style="width: 161.969px; height: 35.3984px;">**Icon tương tác**

</td><td style="width: 294.969px; height: 35.3984px;">**Action tương tác**

</td><td style="width: 199.094px; height: 35.3984px;">**Trạng thái sau khi chuyển đổi**

</td></tr><tr style="height: 126.031px;"><td style="width: 139.969px; height: 126.031px;">Cần làm

</td><td style="width: 161.969px; height: 126.031px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/CX1image.png)<figcaption></figcaption></figure><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/I4vimage.png)<figcaption></figcaption></figure></td><td style="width: 294.969px; height: 126.031px;">1/Dropdown trả 2 trạng thái để user lựa chọn

- Tôi đã hoàn thành

Lưu ý: Vấn tuân thủ các quy tắc theo cấu hình (Cần bằng chứng, ghi chú...)

2/ Đối với những Cv chưa hoàn thành check list bên trong, khi click vào icon, hiển thị pop-up hoàn thành cv trước khi thay đổi trạng thái

<figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/C81image.png)<figcaption></figcaption></figure>3/ Khi người bấm là người cuối cùng cần hoàn thành công việc thì sẽ có UX tương ứng với việc công việc được hoàn thành này. !!!!!

</td><td style="width: 199.094px; height: 126.031px;">Trạng thái thay đổi tương ứng với lựa chọn:

- **Tôi Hoàn thành**

</td></tr><tr><td style="width: 139.969px;">Đang làm

</td><td style="width: 161.969px;">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/ZvXimage.png)

</td><td style="width: 294.969px;">1/Dropdown trả 2 trạng thái để user lựa chọn

- Tôi đã hoàn thành
- Hoàn thành cho tất cả.

Lưu ý: Vấn tuân thủ các quy tắc theo cấu hình (Cần bằng chứng, ghi chú...)

2/ Đối với những Cv chưa hoàn thành check list bên trong, khi click vào icon, hiển thị pop-up hoàn thành cv trước khi thay đổi trạng thái

<figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/C81image.png)<figcaption></figcaption></figure>3/ Khi người bấm là người cuối cùng cần hoàn thành công việc thì sẽ có UX tương ứng với việc công việc được hoàn thành này. !!!!!

</td><td style="width: 199.094px;">Trạng thái thay đổi tương ứng với lựa chọn:

- **Tôi Hoàn thành**

</td></tr><tr><td style="width: 139.969px; height: 177.375px;">Không thể </td><td style="width: 161.969px; height: 177.375px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/Zxhimage.png)<figcaption></figcaption></figure></td><td style="width: 294.969px; height: 177.375px;">Không có DDL --&gt; Hệ thống tự chuyển trạng thái task của user sang Tôi Hoàn thành

</td><td style="width: 199.094px; height: 177.375px;">**Tôi Hoàn thành**</td></tr><tr><td style="width: 139.969px; height: 163.578px;">Hoàn thành</td><td style="width: 161.969px; height: 163.578px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/wzHimage.png)<figcaption></figcaption></figure></td><td style="width: 294.969px; height: 163.578px;">Bấm vào chuyển trạng thái task của user sang

</td><td style="width: 199.094px; height: 163.578px;">Cần làm</td></tr></tbody></table>

TH3 **<span data-path-to-node="21,2,2,0">: User là không phải người thực hiện và có quyền sửa công việc</span>**

<table id="bkmrk-tr%E1%BA%A1ng-th%C3%A1i-hi%E1%BB%83n-th%E1%BB%8B--4" style="width: 797px; height: 472.352px;"><tbody><tr style="height: 35.3984px;"><td style="width: 139.969px; height: 35.3984px;">**Trạng thái hiển thị**

</td><td style="width: 161.969px; height: 35.3984px;">**Icon tương tác**

</td><td style="width: 294.969px; height: 35.3984px;">**Action tương tác**

</td><td style="width: 199.094px; height: 35.3984px;">**Trạng thái sau khi chuyển đổi**

</td></tr><tr style="height: 126.031px;"><td style="width: 139.969px; height: 126.031px;">Cần làm

</td><td style="width: 161.969px; height: 126.031px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/CX1image.png)<figcaption></figcaption></figure><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/I4vimage.png)<figcaption></figcaption></figure></td><td style="width: 294.969px; height: 126.031px;">1/Dropdown trả 2 trạng thái để user lựa chọn

- Hoàn thành cho tất cả

Lưu ý: Vấn tuân thủ các quy tắc theo cấu hình (Cần bằng chứng, ghi chú...)

2/ Đối với những Cv chưa hoàn thành check list bên trong, khi click vào icon, hiển thị pop-up hoàn thành cv trước khi thay đổi trạng thái

<figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/C81image.png)<figcaption></figcaption></figure>3/ Khi người bấm là người cuối cùng cần hoàn thành công việc thì sẽ có UX tương ứng với việc công việc được hoàn thành này. !!!!!

</td><td style="width: 199.094px; height: 126.031px;">Trạng thái thay đổi tương ứng với lựa chọn:

- **Hoàn thành**

</td></tr><tr><td style="width: 139.969px;">Đang làm

</td><td style="width: 161.969px;">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/ZvXimage.png)

</td><td style="width: 294.969px;">1/Dropdown trả 2 trạng thái để user lựa chọn

- Hoàn thành cho tất cả.

Lưu ý: Vấn tuân thủ các quy tắc theo cấu hình (Cần bằng chứng, ghi chú...)

2/ Đối với những Cv chưa hoàn thành check list bên trong, khi click vào icon, hiển thị pop-up hoàn thành cv trước khi thay đổi trạng thái

<figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/C81image.png)<figcaption></figcaption></figure>3/ Khi người bấm là người cuối cùng cần hoàn thành công việc thì sẽ có UX tương ứng với việc công việc được hoàn thành này. !!!!!

</td><td style="width: 199.094px;">Trạng thái thay đổi tương ứng với lựa chọn:

- **Hoàn thành**

</td></tr><tr><td style="width: 139.969px; height: 177.375px;">Không thể </td><td style="width: 161.969px; height: 177.375px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/Zxhimage.png)<figcaption></figcaption></figure></td><td style="width: 294.969px; height: 177.375px;">Không có DDL --&gt; Hệ thống tự chuyển trạng thái task của user sang Hoàn thành

</td><td style="width: 199.094px; height: 177.375px;">**Hoàn thành**</td></tr><tr><td style="width: 139.969px; height: 163.578px;">Hoàn thành</td><td style="width: 161.969px; height: 163.578px;"><figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-01/wzHimage.png)<figcaption></figcaption></figure></td><td style="width: 294.969px; height: 163.578px;">Bấm vào chuyển trạng thái task của user sang Cần làm

</td><td style="width: 199.094px; height: 163.578px;">Cần làm</td></tr></tbody></table>

### C. BUSSINES RULE CHUYỂN TRẠNG THÁI

[https://app.xmind.com/tOE3ATdO](https://app.xmind.com/tOE3ATdO)

Cụ thể như sau:

#### PHẦN 1 — DECISION TABLE 

 **INPUT (Điều kiện)**

<div id="bkmrk-k%C3%BD-hi%E1%BB%87u-m%C3%B4-t%E1%BA%A3-r-user"><div tabindex="-1"><table data-end="683" data-start="320"><thead data-end="339" data-start="320"><tr data-end="339" data-start="320"><th data-col-size="sm" data-end="330" data-start="320">Ký hiệu</th><th data-col-size="md" data-end="339" data-start="330">Mô tả</th></tr></thead><tbody data-end="683" data-start="358"><tr data-end="404" data-start="358"><td data-col-size="sm" data-end="362" data-start="358">R</td><td data-col-size="md" data-end="404" data-start="362">User có quyền đổi trạng thái? (Yes/No)</td></tr><tr data-end="462" data-start="405"><td data-col-size="sm" data-end="409" data-start="405">S</td><td data-col-size="md" data-end="462" data-start="409">Trạng thái hiện tại của user: Todo / Doing / Done</td></tr><tr data-end="516" data-start="463"><td data-col-size="sm" data-end="467" data-start="463">T</td><td data-col-size="md" data-end="516" data-start="467">Trạng thái task hiện tại: Todo / Doing / Done</td></tr><tr data-end="551" data-start="517"><td data-col-size="sm" data-end="521" data-start="517">F</td><td data-col-size="md" data-end="551" data-start="521">Có Required Form? (Yes/No)</td></tr><tr data-end="590" data-start="552"><td data-col-size="sm" data-end="557" data-start="552">FD</td><td data-col-size="md" data-end="590" data-start="557">User đã submit form? (Yes/No)</td></tr><tr data-end="625" data-start="591"><td data-col-size="sm" data-end="595" data-start="591">M</td><td data-col-size="md" data-end="625" data-start="595">Completion Mode: ONE / ALL</td></tr><tr data-end="683" data-start="626"><td data-col-size="sm" data-end="631" data-start="626">LC</td><td data-col-size="md" data-end="683" data-start="631">User là người cuối cùng cần hoàn thành? (Yes/No)</td></tr></tbody></table>

</div></div>---

📊 **DECISION TABLE**

<div id="bkmrk-%23-r-s-t-f-fd-m-lc-h%C3%A0"><div tabindex="-1"><table data-end="1804" data-start="712" style="width: 105.926%; height: 417.157px;"><thead data-end="759" data-start="712"><tr data-end="759" data-start="712" style="height: 29.7969px;"><th data-col-size="sm" data-end="716" data-start="712" style="width: 4.32633%; height: 29.7969px;">\#</th><th data-col-size="sm" data-end="720" data-start="716" style="width: 5.43881%; height: 29.7969px;">R</th><th data-col-size="sm" data-end="724" data-start="720" style="width: 12.2373%; height: 29.7969px;">S</th><th data-col-size="sm" data-end="728" data-start="724" style="width: 7.41656%; height: 29.7969px;">T</th><th data-col-size="sm" data-end="732" data-start="728" style="width: 5.43881%; height: 29.7969px;">F</th><th data-col-size="sm" data-end="737" data-start="732" style="width: 5.43881%; height: 29.7969px;">FD</th><th data-col-size="sm" data-end="741" data-start="737" style="width: 6.18047%; height: 29.7969px;">M</th><th data-col-size="sm" data-end="746" data-start="741" style="width: 5.43881%; height: 29.7969px;">LC</th><th data-col-size="md" data-end="759" data-start="746" style="width: 48.0841%; height: 29.7969px;">Hành động</th></tr></thead><tbody data-end="1804" data-start="809"><tr data-end="895" data-start="809" style="height: 29.7969px;"><td data-col-size="sm" data-end="813" data-start="809" style="width: 4.32633%; height: 29.7969px;">1</td><td data-col-size="sm" data-end="818" data-start="813" style="width: 5.43881%; height: 29.7969px;">No</td><td data-col-size="sm" data-end="822" data-start="818" style="width: 12.2373%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="826" data-start="822" style="width: 7.41656%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="830" data-start="826" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="834" data-start="830" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="838" data-start="834" style="width: 6.18047%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="842" data-start="838" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="md" data-end="895" data-start="842" style="width: 48.0841%; height: 29.7969px;">❌ Không cho đổi trạng thái, show “Không có quyền”</td></tr><tr data-end="976" data-start="896" style="height: 29.7969px;"><td data-col-size="sm" data-end="900" data-start="896" style="width: 4.32633%; height: 29.7969px;">2</td><td data-col-size="sm" data-end="906" data-start="900" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="913" data-start="906" style="width: 12.2373%; height: 29.7969px;">Done</td><td data-col-size="sm" data-end="920" data-start="913" style="width: 7.41656%; height: 29.7969px;">Done</td><td data-col-size="sm" data-end="924" data-start="920" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="928" data-start="924" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="932" data-start="928" style="width: 6.18047%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="936" data-start="932" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="md" data-end="976" data-start="936" style="width: 48.0841%; height: 29.7969px;">Không đổi, show “Task đã hoàn thành”</td></tr><tr data-end="1042" data-start="977" style="height: 29.7969px;"><td data-col-size="sm" data-end="981" data-start="977" style="width: 4.32633%; height: 29.7969px;">3</td><td data-col-size="sm" data-end="987" data-start="981" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1000" data-start="987" style="width: 12.2373%; height: 29.7969px;">Todo/Doing</td><td data-col-size="sm" data-end="1004" data-start="1000" style="width: 7.41656%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1009" data-start="1004" style="width: 5.43881%; height: 29.7969px;">No</td><td data-col-size="sm" data-end="1013" data-start="1009" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1017" data-start="1013" style="width: 6.18047%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1021" data-start="1017" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="md" data-end="1042" data-start="1021" style="width: 48.0841%; height: 29.7969px;">Cho đổi sang Done</td></tr><tr data-end="1128" data-start="1043" style="height: 29.7969px;"><td data-col-size="sm" data-end="1047" data-start="1043" style="width: 4.32633%; height: 29.7969px;">4</td><td data-col-size="sm" data-end="1053" data-start="1047" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1066" data-start="1053" style="width: 12.2373%; height: 29.7969px;">Todo/Doing</td><td data-col-size="sm" data-end="1070" data-start="1066" style="width: 7.41656%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1076" data-start="1070" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1081" data-start="1076" style="width: 5.43881%; height: 29.7969px;">No</td><td data-col-size="sm" data-end="1085" data-start="1081" style="width: 6.18047%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1089" data-start="1085" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="md" data-end="1128" data-start="1089" style="width: 48.0841%; height: 29.7969px;">❌ Không cho Done, yêu cầu nhập form</td></tr><tr data-end="1204" data-start="1129" style="height: 29.7969px;"><td data-col-size="sm" data-end="1133" data-start="1129" style="width: 4.32633%; height: 29.7969px;">5</td><td data-col-size="sm" data-end="1139" data-start="1133" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1152" data-start="1139" style="width: 12.2373%; height: 29.7969px;">Todo/Doing</td><td data-col-size="sm" data-end="1156" data-start="1152" style="width: 7.41656%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1162" data-start="1156" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1168" data-start="1162" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1174" data-start="1168" style="width: 6.18047%; height: 29.7969px;">ONE</td><td data-col-size="sm" data-end="1178" data-start="1174" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="md" data-end="1204" data-start="1178" style="width: 48.0841%; height: 29.7969px;">Cho Done → Task = Done</td></tr><tr data-end="1282" data-start="1205" style="height: 29.7969px;"><td data-col-size="sm" data-end="1209" data-start="1205" style="width: 4.32633%; height: 29.7969px;">6</td><td data-col-size="sm" data-end="1215" data-start="1209" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1228" data-start="1215" style="width: 12.2373%; height: 29.7969px;">Todo/Doing</td><td data-col-size="sm" data-end="1232" data-start="1228" style="width: 7.41656%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1238" data-start="1232" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1244" data-start="1238" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1250" data-start="1244" style="width: 6.18047%; height: 29.7969px;">ALL</td><td data-col-size="sm" data-end="1255" data-start="1250" style="width: 5.43881%; height: 29.7969px;">No</td><td data-col-size="md" data-end="1282" data-start="1255" style="width: 48.0841%; height: 29.7969px;">Cho Done → Task = Doing</td></tr><tr data-end="1360" data-start="1283" style="height: 29.7969px;"><td data-col-size="sm" data-end="1287" data-start="1283" style="width: 4.32633%; height: 29.7969px;">7</td><td data-col-size="sm" data-end="1293" data-start="1287" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1306" data-start="1293" style="width: 12.2373%; height: 29.7969px;">Todo/Doing</td><td data-col-size="sm" data-end="1310" data-start="1306" style="width: 7.41656%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1316" data-start="1310" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1322" data-start="1316" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1328" data-start="1322" style="width: 6.18047%; height: 29.7969px;">ALL</td><td data-col-size="sm" data-end="1334" data-start="1328" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="md" data-end="1360" data-start="1334" style="width: 48.0841%; height: 29.7969px;">Cho Done → Task = Done</td></tr><tr data-end="1433" data-start="1361" style="height: 29.7969px;"><td data-col-size="sm" data-end="1365" data-start="1361" style="width: 4.32633%; height: 29.7969px;">8</td><td data-col-size="sm" data-end="1371" data-start="1365" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1378" data-start="1371" style="width: 12.2373%; height: 29.7969px;">Done</td><td data-col-size="sm" data-end="1386" data-start="1378" style="width: 7.41656%; height: 29.7969px;">Doing</td><td data-col-size="sm" data-end="1390" data-start="1386" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1394" data-start="1390" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1400" data-start="1394" style="width: 6.18047%; height: 29.7969px;">ONE</td><td data-col-size="sm" data-end="1404" data-start="1400" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="md" data-end="1433" data-start="1404" style="width: 48.0841%; height: 29.7969px;">Cho revert → Task = Doing</td></tr><tr data-end="1508" data-start="1434" style="height: 29.7969px;"><td data-col-size="sm" data-end="1438" data-start="1434" style="width: 4.32633%; height: 29.7969px;">9</td><td data-col-size="sm" data-end="1444" data-start="1438" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1451" data-start="1444" style="width: 12.2373%; height: 29.7969px;">Done</td><td data-col-size="sm" data-end="1459" data-start="1451" style="width: 7.41656%; height: 29.7969px;">Doing</td><td data-col-size="sm" data-end="1463" data-start="1459" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1467" data-start="1463" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1473" data-start="1467" style="width: 6.18047%; height: 29.7969px;">ALL</td><td data-col-size="sm" data-end="1479" data-start="1473" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="md" data-end="1508" data-start="1479" style="width: 48.0841%; height: 29.7969px;">Cho revert → Task = Doing</td></tr><tr data-end="1582" data-start="1509" style="height: 29.7969px;"><td data-col-size="sm" data-end="1513" data-start="1509" style="width: 4.32633%; height: 29.7969px;">10</td><td data-col-size="sm" data-end="1519" data-start="1513" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1526" data-start="1519" style="width: 12.2373%; height: 29.7969px;">Done</td><td data-col-size="sm" data-end="1534" data-start="1526" style="width: 7.41656%; height: 29.7969px;">Doing</td><td data-col-size="sm" data-end="1538" data-start="1534" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1542" data-start="1538" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1548" data-start="1542" style="width: 6.18047%; height: 29.7969px;">ALL</td><td data-col-size="sm" data-end="1553" data-start="1548" style="width: 5.43881%; height: 29.7969px;">No</td><td data-col-size="md" data-end="1582" data-start="1553" style="width: 48.0841%; height: 29.7969px;">Cho revert → Task = Doing</td></tr><tr data-end="1651" data-start="1583" style="height: 29.7969px;"><td data-col-size="sm" data-end="1587" data-start="1583" style="width: 4.32633%; height: 29.7969px;">11</td><td data-col-size="sm" data-end="1593" data-start="1587" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1597" data-start="1593" style="width: 12.2373%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1604" data-start="1597" style="width: 7.41656%; height: 29.7969px;">Done</td><td data-col-size="sm" data-end="1608" data-start="1604" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1612" data-start="1608" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1618" data-start="1612" style="width: 6.18047%; height: 29.7969px;">ONE</td><td data-col-size="sm" data-end="1622" data-start="1618" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="md" data-end="1651" data-start="1622" style="width: 48.0841%; height: 29.7969px;">Nếu revert → Task = Doing</td></tr><tr data-end="1722" data-start="1652" style="height: 29.7969px;"><td data-col-size="sm" data-end="1656" data-start="1652" style="width: 4.32633%; height: 29.7969px;">12</td><td data-col-size="sm" data-end="1662" data-start="1656" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1666" data-start="1662" style="width: 12.2373%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1673" data-start="1666" style="width: 7.41656%; height: 29.7969px;">Done</td><td data-col-size="sm" data-end="1677" data-start="1673" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1681" data-start="1677" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1687" data-start="1681" style="width: 6.18047%; height: 29.7969px;">ALL</td><td data-col-size="sm" data-end="1693" data-start="1687" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="md" data-end="1722" data-start="1693" style="width: 48.0841%; height: 29.7969px;">Nếu revert → Task = Doing</td></tr><tr data-end="1804" data-start="1723" style="height: 29.7969px;"><td data-col-size="sm" data-end="1727" data-start="1723" style="width: 4.32633%; height: 29.7969px;">13</td><td data-col-size="sm" data-end="1733" data-start="1727" style="width: 5.43881%; height: 29.7969px;">Yes</td><td data-col-size="sm" data-end="1737" data-start="1733" style="width: 12.2373%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1741" data-start="1737" style="width: 7.41656%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1745" data-start="1741" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1749" data-start="1745" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1753" data-start="1749" style="width: 6.18047%; height: 29.7969px;">\*</td><td data-col-size="sm" data-end="1757" data-start="1753" style="width: 5.43881%; height: 29.7969px;">\*</td><td data-col-size="md" data-end="1804" data-start="1757" style="width: 48.0841%; height: 29.7969px;">Sau mỗi hành động → Re-calc trạng thái task</td></tr></tbody></table>

</div></div>(\* = không quan trọng)

---

####  PHẦN 2 — BUSINESS RULE (HOÀN CHỈNH)

Bạn có thể đưa nguyên khối này vào mục **Business Rule – Task Status**

---

#### 1. Định nghĩa

##### 1.1. Trạng thái User trong Task

- Todo (Cần làm)
- Doing (Đang làm)
- Done (Hoàn thành)

##### 1.2. Trạng thái Task

- Todo
- Doing
- Done

##### 1.3. Completion Mode

- ONE: Chỉ cần 1 người hoàn thành
- ALL: Tất cả người được giao phải hoàn thành

---

#### 2. Quyền đổi trạng thái

User được phép đổi trạng thái khi:

- Là Admin  
    HOẶC
- Là Creator  
    HOẶC
- Là Assignee  
    HOẶC
- Có permission `UPDATE_TASK_STATUS (Phần cấu hình công việc "Cài dặt cơ chế chuyển trạng thái")`

 Ngược lại:  
→ Không cho đổi trạng thái  
→ Thông báo: “Bạn không có quyền thay đổi trạng thái công việc.”

---

#### 3. Rule Required Form

Nếu task có Required Form:

- User chỉ được chuyển sang Done khi:
    
    
    - Đã submit form hợp lệ
- Nếu chưa submit:  
    → Không cho hoàn thành  
    → Hiển thị popup yêu cầu nhập form

---

#### 4. Rule chuyển trạng thái User

User có thể chuyển:

- Todo → Doing
- Todo → Done
- Doing → Done
- Done → Doing
- Done → Todo (nếu có quyền)

---

#### 5. Rule xác định trạng thái Task

##### 5.1. Mode = ONE

Task = Done khi:

- Có ít nhất 1 user = Done

Ngược lại:

- Task = Doing/Todo

---

##### 5.2. Mode = ALL

Task = Done khi:

- 100% user = Done

Nếu còn user chưa Done:

- Task = Doing

---

#### 6. Rule khi User hoàn thành

Khi user chuyển sang Done:

- Hệ thống kiểm tra:
    
    
    - Required Form
    - Completion Mode
- Sau đó:
    
    
    - Re-calc trạng thái Task

---

#### 7. Rule khi User revert (Done → Doing/Todo)

Khi user đổi từ Done về Doing/Todo:

- Task phải được tính lại theo:
    
    
    - Completion Mode
- Nếu đang là Task Done:  
    → Task chuyển về Doing

---

#### 8. Rule thêm / xoá người tham gia

##### 8.1. Thêm assignee

Nếu thêm assignee vào task đang Done:

- Task chuyển về Doing
- Assignee mới = Todo

##### 8.2. Xoá assignee

- Xoá user chưa Done → không ảnh hưởng
- Xoá user đã Done → re-calc trạng thái task

---

#### 9. Rule đặc biệt

- User bấm Done khi đã Done:  
    → Không đổi trạng thái  
    → Show “Task đã hoàn thành”
- Sau mỗi hành động đổi trạng thái:  
    → Hệ thống luôn re-calc trạng thái Task