# ĐẶT LỊCH

[ https://www.figma.com/design/jM4Xopoh41pK1UhYEnxWUq/Workplace-Home?node-id=17609-14166&amp;p=f&amp;t=HbmhJyk4P6KSO4pP-0](https://www.figma.com/design/jM4Xopoh41pK1UhYEnxWUq/Workplace-Home?node-id=17609-14166&p=f&t=HbmhJyk4P6KSO4pP-0)

## **1. Màn hình Danh sách Lịch Checklist (Calendar View)**

<figure class="image align-center" id="bkmrk-m%C3%A0n-h%C3%ACnh-1">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-02/Ra1image.png)<figcaption>Màn hình 1</figcaption></figure><table data-path-to-node="5" id="bkmrk-t%C3%AAn-tr%C6%B0%E1%BB%9Dng-%2F-ch%E1%BB%A9c-n%C4%83" style="width: 111.728%;"><thead><tr><td class="align-center" style="width: 15.4512%;">**Tên trường / Chức năng**</td><td class="align-center" style="width: 11.6193%;">**Loại (Type)**</td><td class="align-center" style="width: 31.8912%;">**Mô tả giao diện (UI)**</td><td class="align-center" style="width: 41.0383%;">**Logic xử lý (System/Business Logic)**</td></tr></thead><tbody><tr><td style="width: 15.4512%;"><span data-path-to-node="5,1,0,0">**Tab View**</span></td><td style="width: 11.6193%;"><span data-path-to-node="5,1,1,0">Button Group</span></td><td style="width: 31.8912%;">\- Hiển thị 2 nút: "Lịch" và "Danh sách".

\- Mặc định chọn: Tab "Lịch".  
\- Trạng thái Active: Màu nền tím nhạt, chữ tím đậm.

</td><td style="width: 41.0383%;"><span data-path-to-node="5,1,3,0">Khi switch tab, hệ thống render lại dữ liệu hiển thị theo dạng view tương ứng (Calendar view hoặc List view).</span></td></tr><tr><td style="width: 15.4512%;"><span data-path-to-node="5,2,0,0">**Thanh tìm kiếm**</span></td><td style="width: 11.6193%;"><span data-path-to-node="5,2,1,0">Input Text</span></td><td style="width: 31.8912%;">\- Placeholder: "Tìm theo tên lịch...".

  
\- Icon kính lúp ở bên phải.

</td><td style="width: 41.0383%;">\- **Điều kiện tìm:** So khớp chuỗi ký tự gần đúng (LIKE %keyword%) với trường "Tên lịch checklist".

  
\- **Phạm vi dữ liệu:** Query tất cả các lịch trong quá khứ + Lịch hiện tại + Lịch tương lai (trong phạm vi 30 ngày kể từ ngày hiện tại đối với lịch có tần suất).

</td></tr><tr><td style="width: 15.4512%;"><span data-path-to-node="5,3,0,0">**Bộ lọc Địa điểm**</span></td><td style="width: 11.6193%;"><span data-path-to-node="5,3,1,0">Dropdown (Multi-select)</span></td><td style="width: 31.8912%;">\- Hiển thị danh sách các địa điểm đã được cấu hình (site)

  
\- Cho phép tích chọn nhiều.

</td><td style="width: 41.0383%;">\- Cho phép nhập tìm kiếm theo tên và mã địa điểm

\- Quan hệ OR giữa các giá trị chọn.

</td></tr><tr><td style="width: 15.4512%;"><span data-path-to-node="5,4,0,0">**Bộ lọc Phân loại**</span></td><td style="width: 11.6193%;"><span data-path-to-node="5,4,1,0">Dropdown (Multi-select)</span></td><td style="width: 31.8912%;"><span data-path-to-node="5,4,2,0">- Hiển thị danh sách loại checklist.</span></td><td style="width: 41.0383%;"><span data-path-to-node="5,4,3,0">- Lọc theo `category_id`.</span></td></tr><tr><td style="width: 15.4512%;"><span data-path-to-node="5,5,0,0">**Bộ lọc Nhãn dán**</span></td><td style="width: 11.6193%;"><span data-path-to-node="5,5,1,0">Dropdown (Multi-select)</span></td><td style="width: 31.8912%;"><span data-path-to-node="5,5,2,0">- Hiển thị danh sách Tags/Label.</span></td><td style="width: 41.0383%;"><span data-path-to-node="5,5,3,0">- Lọc theo `tag_id`.</span></td></tr><tr><td style="width: 15.4512%;"><span data-path-to-node="5,6,0,0">**Bộ lọc Năm**</span></td><td style="width: 11.6193%;"><span data-path-to-node="5,6,1,0">Dropdown</span></td><td style="width: 31.8912%;"><span data-path-to-node="5,6,2,0">- Hiển thị số năm (VD: 2025, 2026).</span></td><td style="width: 41.0383%;">\- **Mặc định:** Get `Current Year` của hệ thống để hiển thị.

  
\- Khi thay đổi, reload lại lịch theo năm chọn.

</td></tr><tr><td style="width: 15.4512%;"><span data-path-to-node="5,7,0,0">**Bộ lọc Tháng**</span></td><td style="width: 11.6193%;"><span data-path-to-node="5,7,1,0">Dropdown</span></td><td style="width: 31.8912%;"><span data-path-to-node="5,7,2,0">- Hiển thị tháng (Jan - Dec).</span></td><td style="width: 41.0383%;">\- **Mặc định:** Get `Current Month` của hệ thống.

  
\- Khi thay đổi, reload lại lịch theo tháng chọn.

</td></tr><tr><td style="width: 15.4512%;"><span data-path-to-node="5,8,0,0">**Lưới lịch (Calendar Grid)**</span></td><td style="width: 11.6193%;"><span data-path-to-node="5,8,1,0">UI Component</span></td><td style="width: 31.8912%;">\- Lưới 7 cột (Su - Sa).

  
\- Các ngày có sự kiện: Hiển thị chấm tròn màu (theo trạng thái) hoặc tên vắn tắt.

  
\- Ô ngày hiện tại: Highlight viền hoặc màu nền khác biệt.

</td><td style="width: 41.0383%;">\- **Click vào ô trống (Ngày chưa có lịch):** Gọi sự kiện mở Modal "Tạo mới" (Màn hình 2.1). Truyền tham số `start_date` = Ngày vừa click.

  
\- **Click vào item lịch:** Gọi API lấy chi tiết lịch -&gt; Mở Drawer "Chi tiết" (Màn hình 3).

</td></tr><tr><td style="width: 15.4512%;"><span data-path-to-node="5,9,0,0">**Nút "Đặt lịch"**</span></td><td style="width: 11.6193%;"><span data-path-to-node="5,9,1,0">Button</span></td><td style="width: 31.8912%;">\- Nút màu tím (Primary Color).

  
\- Icon dấu cộng (+).

</td><td style="width: 41.0383%;"><span data-path-to-node="5,9,3,0">- Sự kiện `onClick`: Mở Modal "Tạo mới lịch checklist".</span></td></tr></tbody></table>

---

## 2. Màn hình Tạo mới Đặt lịch

### 2.1. Màn hình tạo mới với tần suất 1 lần

<figure class="image align-center" id="bkmrk-m%C3%A0n-h%C3%ACnh-2">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-02/5Lgimage.png)<figcaption>Màn hình 2.1 - Màn hình mặc định khi bấm Tạo mới Đặt lịch và mặc định là tần suất 1 lần</figcaption></figure><table data-path-to-node="8" id="bkmrk-khu-v%E1%BB%B1c-t%C3%AAn-tr%C6%B0%E1%BB%9Dng-b" style="width: 100%; height: 2784.66px;"><thead><tr style="height: 46.5938px;"><td style="width: 9.2707%; height: 46.5938px;">**Khu vực**</td><td style="width: 11.0012%; height: 46.5938px;">**Tên trường**</td><td style="width: 8.77321%; height: 46.5938px;">**Bắt buộc**</td><td style="width: 26.0846%; height: 46.5938px;">**Mô tả giao diện (UI)**</td><td style="width: 44.8702%; height: 46.5938px;">**Logic xử lý (System/Business Logic)**</td></tr></thead><tbody><tr style="height: 119.359px;"><td style="width: 9.2707%; height: 119.359px;"><span data-path-to-node="8,1,0,0">**Header**</span></td><td style="width: 11.0012%; height: 119.359px;"><span data-path-to-node="8,1,1,0">**Nút Đóng / Lưu**</span></td><td style="width: 8.77321%; height: 119.359px;"><span data-path-to-node="8,1,2,0">-</span></td><td style="width: 26.0846%; height: 119.359px;">\- Nút "Đóng": Góc phải trên.

  
\- Nút "Lưu": Nút màu tím nổi bật.

</td><td style="width: 44.8702%; height: 119.359px;">\- **Đóng:** Đóng modal, không lưu dữ liệu, clear form.

  
\- **Lưu:** Trigger validate form -&gt; Nếu Pass -&gt; Gọi API `CreateSchedule` -&gt; Thông báo thành công -&gt; Reload lại lịch.

</td></tr><tr style="height: 96.9688px;"><td style="width: 9.2707%; height: 96.9688px;"><span data-path-to-node="8,2,0,0">**Thông tin chung**</span></td><td style="width: 11.0012%; height: 96.9688px;"><span data-path-to-node="8,2,1,0">**Tên lịch checklist**</span></td><td style="width: 8.77321%; height: 96.9688px;"><span data-path-to-node="8,2,2,0">Có</span></td><td style="width: 26.0846%; height: 96.9688px;">\- Input text.

  
\- Hiển thị bộ đếm ký tự góc phải (0/200).

</td><td style="width: 44.8702%; height: 96.9688px;">\- Validate: Không được để trống.

  
\- Validate: Max length = 200 ký tự.

</td></tr><tr style="height: 119.359px;"><td style="width: 9.2707%; height: 119.359px;"> </td><td style="width: 11.0012%; height: 119.359px;"><span data-path-to-node="8,3,1,0">**Biểu mẫu sử dụng**</span></td><td style="width: 8.77321%; height: 119.359px;"><span data-path-to-node="8,3,2,0">Có</span></td><td style="width: 26.0846%; height: 119.359px;">\- Dropdown single select.

  
\- Có dòng note hướng dẫn bên dưới.

</td><td style="width: 44.8702%; height: 119.359px;">\- Load danh sách Template đang Active.

  
\- Khi chọn, hệ thống mapping ID questionnaire vào lịch.

\- Validate: Không được để trống.

</td></tr><tr style="height: 981.453px;"><td style="width: 9.2707%; height: 981.453px;"><span data-path-to-node="8,4,0,0">**Thực hiện**</span></td><td style="width: 11.0012%; height: 981.453px;"><span data-path-to-node="8,4,1,0">**Người thực hiện**</span></td><td style="width: 8.77321%; height: 981.453px;"><span data-path-to-node="8,4,2,0">Có</span></td><td style="width: 26.0846%; height: 981.453px;">**1. Trạng thái đóng: Khi chưa chọn**

  
\- Hiển thị input box.

  
\- Placeholder: "Chọn người thực hiện".

  
  
**2. Trạng thái mở (Dropdown):**

  
\- Có 2 Tab: **Cá nhân** và **Nhóm**.

  
\- Có thanh tìm kiếm (Search bar) trên cùng.

  
\- Nút "Lưu" màu tím ở dưới cùng của dropdown.

  
  
**3. Tab Cá nhân (Default):**

  
\- List user (Display name)

  
\- Mỗi dòng cho phép có cơ chế chọn nhiều.

  
\- Đã chọn: Hiển thị dấu tích (Checkmark) bên phải.

  
  
**4. Tab Nhóm:**

  
\- List danh sách các nhóm (Nhóm 1, Nhóm 2...).

  
\- Cơ chế chọn: Single select (Chọn 1).

</td><td style="width: 44.8702%; height: 981.453px;">\- Validate: Không được để trống.

-Mặc định khi bấm tạo mới lịch sẽ hiển thị nút gán người thực hiện mà chưa có các lựa chọn ở phía dưới.

**1. Logic Tìm kiếm:**

<span data-path-to-node="8,4,4,0">  
</span>\- Filter danh sách user/nhóm theo từ khóa nhập vào (Local search hoặc API search).

-Chỉ có thể chọn cá nhân hoặc nhóm, khi đang chọn cá nhân mà đổi sang tab nhóm và chọn 1 giá trị sẽ clear toàn bộ giá trị cá nhân đã chọn tương tự với khi chọn nhóm mà đổi sang và chọn cá nhân.

<span data-path-to-node="8,4,4,0">  
  
</span>**2. Logic Tab Cá nhân (Multi-select):**

<span data-path-to-node="8,4,4,0">  
</span>\- Cho phép tích chọn nhiều User ID vào mảng `selected_users`.

<span data-path-to-node="8,4,4,0">  
</span>\- **Quy tắc Reset:** Ngay khi user thực hiện chọn (click) vào 1 user bất kỳ tại tab này -&gt; Hệ thống tự động **Clear (Xóa rỗng)** giá trị của `selected_group_id` (nếu trước đó đã chọn nhóm).

<span data-path-to-node="8,4,4,0">  
  
</span>**3. Logic Tab Nhóm (Single-select):**

<span data-path-to-node="8,4,4,0">  
</span>\- Chỉ cho phép chọn duy nhất 1 Group ID

<span data-path-to-node="8,4,4,0">  
</span>\- **Quy tắc Reset:** Ngay khi user thực hiện chọn (click) vào 1 nhóm bất kỳ -&gt; Hệ thống tự động **Clear (Xóa rỗng)** toàn bộ mảng `selected_users` (nếu trước đó đã chọn cá nhân).

<span data-path-to-node="8,4,4,0">  
  
</span>**4. Nút Lưu (trong dropdown):**

<span data-path-to-node="8,4,4,0">  
</span>\- Sự kiện: Đóng dropdown.

<span data-path-to-node="8,4,4,0">  
</span>\- Hiển thị text lên input box:

<span data-path-to-node="8,4,4,0">  
</span>\+ Nếu chọn Cá nhân: Hiển thị tên các user (cách nhau dấu phẩy) hoặc dạng Tags.

<span data-path-to-node="8,4,4,0">  
</span>\+ Nếu chọn Nhóm: Hiển thị tên nhóm.

</td></tr><tr style="height: 192.125px;"><td style="width: 9.2707%; height: 192.125px;"><span data-path-to-node="8,4,0,0">  
</span></td><td style="width: 11.0012%; height: 192.125px;"><span data-path-to-node="8,4,1,0">**Tất cả hoàn thành**</span></td><td style="width: 8.77321%; height: 192.125px;"><span data-path-to-node="8,4,2,0">Không</span></td><td style="width: 26.0846%; height: 192.125px;">Quy tắc hoàn thành Chỉ xuất hiện khi trường "Người thực hiện" có dữ liệu chọn **"nhiều người" hoặc "Nhóm thực hiện"**

\- Dạng nút chọn (Radio Button).

</td><td style="width: 44.8702%; height: 192.125px;">**Tất cả hoàn thành:** Khi tạo lịch, hệ thống sẽ yêu cầu *mọi* user được gán đều phải submit checklist thì checklist mới được tính là "Done" . Có nghĩa là hệ thống sinh ra 2 lần kiểm trâ độc lập cùng 1 check list tại cùng 1 thời điểm

Chứ k phải 2 người phối hợp điền chung 1 check list

<figure class="image align-center">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-03/OOMimage.png)<figcaption></figcaption></figure></td></tr><tr style="height: 192.125px;"><td style="width: 9.2707%; height: 192.125px;"><span data-path-to-node="8,4,0,0">  
</span></td><td style="width: 11.0012%; height: 192.125px;"><span data-path-to-node="8,4,1,0">******Chỉ cần 1 người******</span></td><td style="width: 8.77321%; height: 192.125px;"><span data-path-to-node="8,4,2,0">  
</span></td><td style="width: 26.0846%; height: 192.125px;">Quy tắc hoàn thành Chỉ xuất hiện khi trường "Người thực hiện" có dữ liệu chọn nhiều **"người thực hiện" hoặc/và "Nhóm thực hiện"**

\- Dạng nút chọn (Radio Button).

</td><td style="width: 44.8702%; height: 192.125px;">- Giá trị chọn Mặc định

Check list được chia sẻ chung. Chỉ cần 1 trong số các user được gán submit là check list hoàn thành (First-come first-served).

</td></tr><tr><td style="width: 9.2707%;"><span data-path-to-node="8,4,0,0">  
</span></td><td style="width: 11.0012%;"><span data-path-to-node="8,4,1,0">******☑ **Tự lấy người theo địa điểm**.******</span></td><td style="width: 8.77321%;"><span data-path-to-node="8,4,2,0">  
</span></td><td style="width: 26.0846%;">\- Chỉ xuất hiện khi trường "Người thực hiện" có dữ liệu.

\- Dạng Checkbox.

</td><td style="width: 44.8702%;">\- **Khi Uncheck (False):** Giữ nguyên danh sách người/nhóm đã chọn ở trên.

  
\- **Khi Check (True):** Kích hoạt logic giao điểm (Intersection).

  
\+ Hệ thống sẽ lấy danh sách User trong Nhóm/List đã chọn **VÀ (AND)** User đó phải thuộc `Site` được chọn ở trường "Địa điểm thực hiện".

  
\+ *Ví dụ:* Chọn "Nhóm Quản lý" + Check "Tự lấy theo địa điểm" + Địa điểm "Kho A" -&gt; Hệ thống chỉ gán check list cho các Quản lý đang làm việc tại Kho A.

</td></tr><tr style="height: 305.188px;"><td style="width: 9.2707%; height: 305.188px;"> </td><td style="width: 11.0012%; height: 305.188px;"><span data-path-to-node="8,5,1,0">**Địa điểm thực hiện**</span></td><td style="width: 8.77321%; height: 305.188px;"><span data-path-to-node="8,5,2,0">Không</span></td><td style="width: 26.0846%; height: 305.188px;"><span data-path-to-node="8,5,3,0">- Dropdown Multi-select.</span></td><td style="width: 44.8702%; height: 305.188px;">- <span data-path-to-node="8,5,4,0">Lưu danh sách Site\_ID</span>
- <span data-path-to-node="8,5,4,0">Nếu số lượng địa điểm = 1 → hệ thống tạo **1** lịch checklist</span>
- <span data-path-to-node="8,5,4,0">Nếu số lượng địa điểm &gt; 1 → hệ thống tạo N lịch checklist, với N = số địa điểm. Mỗi lịch sinh ra sẽ có:</span>
    - <span data-path-to-node="8,5,4,0">Cùng tên lịch</span>
    - <span data-path-to-node="8,5,4,0">Cùng biểu mẫu checklist</span>
    - <span data-path-to-node="8,5,4,0">Cùng người thực hiện</span>
    - <span data-path-to-node="8,5,4,0">Cùng thời gian &amp; tần suất</span>
    - **<span data-path-to-node="8,5,4,0">Khác địa điểm</span>**
- <span data-path-to-node="8,5,4,0">Các lịch sinh ra được xem là độc lập, có ID riêng</span>
- <span data-path-to-node="8,5,4,0">Nếu tạo lịch lặp (recurring) + nhiều địa điểm → số bản ghi sinh ra = số địa điểm × số lần lặp</span>

</td></tr><tr style="height: 103.625px;"><td style="width: 9.2707%; height: 103.625px;"><span data-path-to-node="8,6,0,0">**Thời gian**</span></td><td style="width: 11.0012%; height: 103.625px;"><span data-path-to-node="8,6,1,0">**Múi giờ**</span></td><td style="width: 8.77321%; height: 103.625px;"><span data-path-to-node="8,6,2,0">Có</span></td><td style="width: 26.0846%; height: 103.625px;"><span data-path-to-node="8,6,3,0">- Dropdown chọn múi giờ.</span>

<span data-path-to-node="8,6,3,0">Các giá trị gồm:</span>

- Múi giờ seting của user hiện tại
- Schedule time zone
- Site timzone
- User device time zone

</td><td style="width: 44.8702%; height: 103.625px;">- Các giá trị enum. Hiện tại **Mặc định:** Auto-detect múi giờ theo setting của User hiện tại (Client time).
- Không xóa
- <span style="color: #e03e2d;">Làm trước Múi giời của user hiện tại , các enum khác để sprintt sau</span>

</td></tr><tr style="height: 141.75px;"><td style="width: 9.2707%; height: 141.75px;"> </td><td style="width: 11.0012%; height: 141.75px;"><span data-path-to-node="8,7,1,0">**Thời lượng thực hiện**</span></td><td style="width: 8.77321%; height: 141.75px;"><span data-path-to-node="8,7,2,0">Có</span></td><td style="width: 26.0846%; height: 141.75px;">\- 2 ô Input: Ngày bắt đầu (Date) + Giờ (Time) và Ngày kết thúc (Date) + Giờ (time)

  
\- Note: "Mỗi lịch được thực hiện trong X giờ".

</td><td style="width: 44.8702%; height: 141.75px;">\- Validate: `End_Time` phải lớn hơn bằng `Start_Time`.

  
\- Hệ thống tự tính toán `Duration` = End - Start để hiển thị gợi ý.

-Mặc định là ngày hiện tại . Giờ mặc định là giờ hiện tại

<div>**Gợi ý "Mỗi lịch được thực hiện trong &lt;Thời gian kết thúc vào - Thời gian bắt đầu&gt; phút /giờ/ngày cụ thể như sau:**</div><div>  
</div><div>**Nếu &lt;Thời gian kết thúc vào - Thời gian bắt đầu&gt; &lt; 60 phút --&gt; Thì trả đơn vị phút**</div><div>**Nếu &lt;Thời gian kết thúc vào - Thời gian bắt đầu&gt; lớn hơn 60 phút và nhỏ hơn 24 giờ thì trả đơn vị giờ + phần lẻ trả theo phút**</div><div>**Nếu &lt;Thời gian kết thúc vào - Thời gian bắt đầu&gt; nhỏ hơn 24 giờ thì trả theo đơn vị ngày + phần lẻ trả theo giờ**</div></td></tr><tr style="height: 254.797px;"><td style="width: 9.2707%; height: 254.797px;"> </td><td style="width: 11.0012%; height: 254.797px;"><span data-path-to-node="8,8,1,0">**Tần suất**</span></td><td style="width: 8.77321%; height: 254.797px;"><span data-path-to-node="8,8,2,0">Có</span></td><td style="width: 26.0846%; height: 254.797px;">- <span data-path-to-node="8,8,3,0">Dropdown select. </span>
- <span data-path-to-node="8,8,3,0">Các giá trị gồm:</span>
    - <span data-path-to-node="8,8,3,0">Một lần</span>
    - <span data-path-to-node="8,8,3,0">Hàng ngày</span>
    - <span data-path-to-node="8,8,3,0">Hàng ngày làm việc </span>
    - <span data-path-to-node="8,8,3,0">Hàng tuần</span>
    - <span data-path-to-node="8,8,3,0">Hàng tháng</span>
    - <span data-path-to-node="8,8,3,0">Hàng năm</span>
    - <span data-path-to-node="8,8,3,0">Tùy biến</span><span data-path-to-node="8,8,3,0"></span>
- <span data-path-to-node="8,8,3,0">Note " Lịch sẽ được lặp đi lặp lại hay không?"</span>

</td><td style="width: 44.8702%; height: 254.797px;">\- **Mặc định:** Set giá trị là "Một lần" (One-time).

LƯU Ý KHI LỰA CHỌN ĐỔI GIÁ TRỊ TỪ MỘT LẦN SANG CÁC TẦN SUẤT KHÁC

- **Nếu thời lượng thực hiện có tổng time &lt; = 24 giờ (Tính từ ngày bắt đầu - giờ bắt đầu đến ngày kết thúc đến giờ kết thúc &lt; =24h) --&gt; THì hiện thị toàn bộ các tần suất**
    - <span data-path-to-node="8,8,3,0">Một lần</span>
    - <span data-path-to-node="8,8,3,0">Hàng ngày</span>
    - <span data-path-to-node="8,8,3,0">Hàng ngày làm việc </span>
    - <span data-path-to-node="8,8,3,0">Hàng tuần</span>
    - <span data-path-to-node="8,8,3,0">Hàng tháng</span>
    - <span data-path-to-node="8,8,3,0">Hàng năm</span>
    - <span data-path-to-node="8,8,3,0">Tùy biến</span>

\--&gt; Lý do : Tần suất hàng ngày và hàng ngày lv cho phép vắt ngày thực hiện . (- Miễn là tổng thời gian thực hiện không quá 1 ngày thì vẫn đảm bảo logic lặp lại hàng ngày được.)

- **Nếu thời lượng thực hiện có tổng time &gt;24h thì chỉ hiển thì các tần suất:**
    - Một lần
    - Hàng tuần
    - Hàng Tháng
    - Hàng năm
    - Tùy biến

\--&gt; Lý do: Nếu một checklist kéo dài &gt; 24h (Ví dụ: Từ 8:00 Thứ 2 đến 8:00 Thứ 4), nó không thể lặp lại "Hàng ngày" vì sẽ gây xung đột chồng chéo thời gian (Overlap) giữa lịch cũ chưa xong và lịch mới sinh ra.)

- **Nếu thời lượng thực hiện : Bắt đầu - kết thúc có tông thời lượng &gt; 7 ngày thì chỉ** hiển thị các tần suát 
    - Một lân
    - Hàng tháng
    - Hàng năm
    - tùy biến

**Lưu ý:**

- Nếu chọn Tùy biến tại lựa chọn: Hàng tuần --&gt; Ẩn block chọn thứ trong tuần.
- Thời gian: Lúc này hệ thống đặt lịch chỉ cần quan tâm đế ngày bắt đầu và thứ của ngày kết thúc để gen ra lịch tương úng với vòng lặp đã chọn
- Hệ thống sẽ chặn tuầ tương ứng

**<span style="color: #e03e2d;">Nếu người dùng đang chọn Tần suất là "Hàng ngày", sau đó quay lại sửa giờ kết thúc thì disable không cho chọn ngày vượt quá 24h. Nếu nhập thời gian &gt;24h thì tự động reset về tần suất 1 lần</span>**

\- Nếu chọn loại khác (Hàng ngày/tuần...), hiển thị thêm UI cấu hình lặp lại (Recurrence Rules).

Các màn hình tiếp theo số: [2.2](#bkmrk-2.2.-m%C3%A0n-h%C3%ACnh-t%E1%BA%A1o-m%E1%BB%9B); 2.3; 2.4; 2.5

</td></tr><tr style="height: 231.312px;"><td style="width: 9.2707%; height: 231.312px;"> </td><td style="width: 11.0012%; height: 231.312px;"><span data-path-to-node="8,9,1,0">**Hoàn thành sau thời hạn**</span></td><td style="width: 8.77321%; height: 231.312px;"><span data-path-to-node="8,9,2,0">Không</span></td><td style="width: 26.0846%; height: 231.312px;">\- Toggle Switch (On/Off).

  
\- Note: "Cho phép ngườii dùng hoàn thành check list sau thời gian quy định lên tới 14 ngày"

</td><td style="width: 44.8702%; height: 231.312px;">\- **OFF (False):** Đến `End_Time` trạng thái chuyển sang "Hết hạn", không cho submit

  
\- **ON (True):** Cho phép submit sau `End_Time` nhưng đánh dấu là "Late".

Cho phép người dùng được làm checklist theo lịch ngay cả khi hết hạn hoàn thành theo thời gian làm khi bật tính năng này.

Sau 14 ngày mà k được thực hiện thì Checklist được tính về Bỏ lỡ.

</td></tr></tbody></table>

### 2.2. Màn hình tạo mới với tần suất "Hằng ngày" 

<figure class="image align-center" id="bkmrk--1">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-02/we7image.png)<figcaption>Màn hình 2.2 - Tạo mới đặt lịch với tần suất hàng ngày</figcaption></figure>Modal tạo mới đặt lịch với tần suất hàng ngày, các cụm thông tin tương tự với tần suất 1 lần gồm

- Thông tin chung
- Thực hiện
- Thời gian

Các thông tin khác khi lựa chọn tần suất hàng ngày , cụ thẻ mô tả chi tiết và logic xử lý như sau:

<table data-path-to-node="6" id="bkmrk-t%C3%AAn-tr%C6%B0%E1%BB%9Dng-%2F-ch%E1%BB%A9c-n%C4%83-1"><thead><tr><td>**Tên trường / Chức năng**</td><td>**Bắt buộc**</td><td>**Mô tả giao diện (UI)**</td><td>**Logic xử lý (System/Business Logic)**</td></tr></thead><tbody><tr><td><span data-path-to-node="6,1,0,0">  
</span></td><td><span data-path-to-node="6,1,1,0">  
</span></td><td></td><td><span data-path-to-node="6,1,3,0">  
</span>

</td></tr><tr><td style="width: 11.0012%; height: 103.625px;"><span data-path-to-node="8,6,1,0">**Múi giờ**</span></td><td style="width: 8.77321%; height: 103.625px;"><span data-path-to-node="8,6,2,0">Có</span></td><td style="width: 26.0846%; height: 103.625px;"><span data-path-to-node="8,6,3,0">- Dropdown chọn múi giờ.</span>

<span data-path-to-node="8,6,3,0">Các giá trị gồm:</span>

- Múi giờ seting của user hiện tại
- Schedule time zone
- Site timzone
- User device time zone

</td><td style="width: 44.8702%; height: 103.625px;">- Các giá trị enum. Hiện tại **Mặc định:** Auto-detect múi giờ theo setting của User hiện tại (Client time).
- Không xóa
- <span style="color: #e03e2d;">Làm trước Múi giời của user hiện tại , các enum khác để sprintt sau</span>

</td></tr><tr><td style="width: 11.0012%; height: 141.75px;"><span data-path-to-node="8,7,1,0">**Thời lượng thực hiện**</span></td><td style="width: 8.77321%; height: 141.75px;"><span data-path-to-node="8,7,2,0">Có</span></td><td style="width: 26.0846%; height: 141.75px;">\- 2 ô Input: Ngày bắt đầu (Date) + Giờ (Time) và Ngày kết thúc (Date) + Giờ (time)

  
\- Note: "Mỗi lịch được thực hiện trong X giờ".

</td><td style="width: 44.8702%; height: 141.75px;">\- Validate: `End_Time` phải lớn hơn bằng `Start_Time`.

  
\- Hệ thống tự tính toán `Duration` = End - Start để hiển thị gợi ý.

-Mặc định là ngày hiện tại . Giờ mặc định là giờ hiện tại

</td></tr><tr><td><span data-path-to-node="6,1,0,0">**Tần suất**</span></td><td><span data-path-to-node="6,1,1,0">Có</span></td><td>\- Dropdown select.

  
\- Giá trị chọn: "Hàng ngày" (Daily).

</td><td><span data-path-to-node="6,1,3,0">- Khi giá trị thay đổi sang **"Hàng ngày"** (hoặc Hàng tuần/tháng) </span>

- Lưu ý trường hợp đặt lịch vắt ngày 
    - **Nếu thời lượng thực hiện có tổng time &lt; = 24 giờ (Tính từ ngày bắt đầu - giờ bắt đầu đến ngày kết thúc đến giờ kết thúc &lt; =24h) --&gt; THì hiện thị toàn bộ các tần suất**
        - <span data-path-to-node="8,8,3,0">Một lần</span>
        - <span data-path-to-node="8,8,3,0">Hàng ngày</span>
        - <span data-path-to-node="8,8,3,0">Hàng ngày làm việc </span>
        - <span data-path-to-node="8,8,3,0">Hàng tuần</span>
        - <span data-path-to-node="8,8,3,0">Hàng tháng</span>
        - <span data-path-to-node="8,8,3,0">Hàng năm</span>
        - <span data-path-to-node="8,8,3,0">Tùy biến</span>
    
    \--&gt; Lý do : Tần suất hàng ngày và hàng ngày lv cho phép vắt ngày thực hiện . (- Miễn là tổng thời gian thực hiện không quá 1 ngày thì vẫn đảm bảo logic lặp lại hàng ngày được.)
    
    
    - **Nếu thời lượng thực hiện có tổng time &gt;24h thì chỉ hiển thì các tần suất:**
        - Một lần
        - Hàng tuần
        - Hàng Tháng
        - Hàng năm
        - Tùy biến
    
    \--&gt; Lý do: Nếu một checklist kéo dài &gt; 24h (Ví dụ: Từ 8:00 Thứ 2 đến 8:00 Thứ 4), nó không thể lặp lại "Hàng ngày" vì sẽ gây xung đột chồng chéo thời gian (Overlap) giữa lịch cũ chưa xong và lịch mới sinh ra.)
    
    -&gt; Giá trị tùy biến thì trong giá trị tùy biển đơn vị "Tuần" ẩn block chọn Thứ . Chỉ chọn lặp lại hàng &lt;nhập số&gt; Tuần
    
    -TH chọn tần suất trước rồi chọn đến ngày bắt đầu và ngày kết thúc &gt;24 giờ thì mặc đinh bay về tần suất 1 lần
    
    **<span style="color: #e03e2d;">Nếu người dùng đang chọn Tần suất là "Hàng ngày", sau đó quay lại sửa giờ kết thúc thì disable không cho chọn ngày vượt quá 24h. Nếu nhập thời gian &gt;24h thì tự động reset về tần suất 1 lần</span>**

</td></tr><tr><td>**Kết thúc**

  
*(Cấu hình vòng lặp)*

</td><td><span data-path-to-node="6,2,1,0">Có</span></td><td>**Hiển thị:**

  
\- Label: "Kết thúc".

  
\- Dạng: Radio Group (Chọn 1 trong 3).

  
  
**Các tùy chọn:**

  
1\. 🔘 **Không bao giờ** (Never). --&gt; Mặc định

  
  
2\. ⚪ **Vào ngày** (On Date):

  
\- Kèm theo 1 Date Picker bên cạnh.

  
\- Placeholder: DD/MM/YYYY.

  
  
3\. ⚪ **Sau** (After):

  
\- Kèm theo 1 Input Number.

  
\- Placeholder: "10".

  
\- Label đuôi: "Vòng lặp" (Occurrences).

</td><td>**1. Tùy chọn "Không bao giờ":**

  
\- Hệ thống sẽ sinh lịch vô hạn (Yêu cầu sinh cho 05 năm tới để tránh ảnh hưởng tới performance hệ thống)

  
  
**2. Tùy chọn "Vào ngày":**

  
\- Cho phép user chọn ngày kết thúc chuỗi lặp.

  
\- **Validate:** `End_Recurrence_Date` phải lớn hơn `Start_Date` của lịch.

  
\- Hệ thống sẽ sinh lịch từ ngày bắt đầu cho đến ngày này thì dừng.

Chỉ cho phép chọn ngày tương lai. Nếu cùng 1 ngày với trên Block thời lượng thì lịch sẽ chỉ diễn ra 1 ngày.

  
  
**3. Tùy chọn "Sau \[N\] vòng lặp":**

  
\- Cho phép user nhập số lần lặp lại mong muốn.

  
\- **Validate:** Input phải là số nguyên dương (Integer &gt; 0) . Tối đa 500 vòng lặp

  
\- *Ví dụ:* Nhập 10 -&gt; Hệ thống sinh đúng 10 bản ghi lịch checklist rồi dừng.

</td></tr></tbody></table>

#### 2.2.1 Cơ chế hiển thị sinh lịch tại trang chủ "Của tôi" (Check list được sinh ra của hôm nay với user hiện tại)

checklist có: `Ngày thực hiện` là **T**, `Giờ bắt đầu` là **Start\_Time**, `Giờ kết thúc` là **End\_Time**.

<table data-path-to-node="8" id="bkmrk-giai-%C4%91o%E1%BA%A1n-%C4%90i%E1%BB%81u-ki%E1%BB%87n-" style="width: 100%;"><thead><tr><td style="width: 9.51533%;">**Giai đoạn**</td><td style="width: 12.6108%;">**Điều kiện thời gian (Current Time)**</td><td style="width: 35.5995%;">**Trạng thái hiển thị** </td><td style="width: 42.2744%;">**Hành động cho phép (Action)**</td></tr></thead><tbody><tr><td style="width: 9.51533%;">**1. Sắp diễn ra**

  
*(Early View)*

</td><td style="width: 12.6108%;"><span data-path-to-node="8,1,1,0">`00:00 Ngày T` ≤ `Hiện tại` &lt; `Start_Time`</span></td><td style="width: 35.5995%;">**👁️ HIỂN THỊ (Visible)**

  
\- **Style:** Màu xám hoặc mờ nhẹ (Dimmed).

  
\- **Label/Badge:** ⚠️ "Chưa đến hạn thực hiện" (hoặc "Sắp diễn ra").

  
\- **Icon:** 🔒 (Ổ khóa - tùy chọn).

</td><td style="width: 42.2744%;">**⛔ KHÓA (Disabled)**

  
\- Không cho phép mở form nhập liệu.

  
\- Khi bấm vào: Hiển thị thông báo (Toast): *"Công việc bắt đầu lúc \[Start\_Time\]. Vui lòng quay lại sau."*

</td></tr><tr><td style="width: 9.51533%;">**2. Đang diễn ra**

  
*(Active)*

</td><td style="width: 12.6108%;"><span data-path-to-node="8,2,1,0">`Start_Time` ≤ `Hiện tại` ≤ `End_Time`</span></td><td style="width: 35.5995%;">**👁️ HIỂN THỊ (Visible)**

  
\- **Style:** Nổi bật, bình thường.

  
\- **Label/Badge:** 🟢 "Cần làm" / "Đang thực hiện".

</td><td style="width: 42.2744%;">**✅ CHO PHÉP (Enabled)**

  
\- Bấm vào để mở form checklist.

  
\- Cho phép thực hiện, lưu nháp, hoàn thành.

</td></tr><tr><td style="width: 9.51533%;">**3. Quá hạn**

  
*(Expired)*

</td><td style="width: 12.6108%;"><span data-path-to-node="8,3,1,0">`Hiện tại` &gt; `End_Time`</span></td><td style="width: 35.5995%;">**❌ ẨN (Hidden)**

  
\- Biến mất khỏi danh sách "Cần làm" ngay lập tức.

  
\- *(Logic Backend)*: Hệ thống update trạng thái bản ghi thành "Missed" (Bỏ lỡ) hoặc "Expired" nếu chưa hoàn thành.

</td><td style="width: 42.2744%;">**⛔ CHẶN**

  
\- Nếu user đang mở form dở dang mà đồng hồ điểm qua `End_Time` -&gt; Khi bấm Submit sẽ báo lỗi: *"Đã hết thời gian thực hiện checklist này".*

</td></tr></tbody></table>

---

#### 2.2.2. Logic Xử lý Lịch Vắt ngày (Straddling Logic)

Áp dụng cho trường hợp checklist bắt đầu từ ngày hôm trước và kéo dài sang sáng hôm sau.

**Ví dụ cụ thể:**

- **Ca làm việc:** Ca 3 (22:00 -&gt; 02:00 sáng hôm sau).
- **Tần suất:** Hàng ngày.

**Mô phỏng hiển thị vào lúc 01:00 sáng ngày 02/01:**

Lúc này là 01:00 sáng, hệ thống sẽ hiển thị **đồng thời 2 checklist** trong danh sách của nhân viên:

<table data-path-to-node="16" id="bkmrk-t%C3%AAn-checklist-th%E1%BB%9Di-g" style="width: 100%;"><thead><tr><td style="width: 15.3219%;">**Tên Checklist**</td><td style="width: 19.4123%;">**Thời gian quy định**</td><td style="width: 10.5068%;">**Trạng thái lúc 01:00**</td><td style="width: 54.759%;">**Giải thích logic**</td></tr></thead><tbody><tr><td style="width: 15.3219%;">**Checklist A**

  
(Của đêm hôm qua)

</td><td style="width: 19.4123%;"><span data-path-to-node="16,1,1,0">22:00 (01/01) -&gt; **02:00 (02/01)**</span></td><td style="width: 10.5068%;"><span data-path-to-node="16,1,2,0"> **Đang diễn ra**</span></td><td style="width: 54.759%;"><span data-path-to-node="16,1,3,0">Vì `Hiện tại (01:00)` vẫn nằm trong khoảng cho phép (`<= 02:00`). User đang thực hiện nốt checklist này.</span></td></tr><tr><td style="width: 15.3219%;">**Checklist B**

  
(Của đêm nay)

</td><td style="width: 19.4123%;"><span data-path-to-node="16,2,1,0">**22:00 (02/01)** -&gt; 02:00 (03/01)</span></td><td style="width: 10.5068%;"><span data-path-to-node="16,2,2,0">**Chưa đến hạn**</span></td><td style="width: 54.759%;"><span data-path-to-node="16,2,3,0">Vì `Hiện tại (01:00)` đã qua mốc 00:00 của ngày 02/01 nên checklist này được **sinh ra và hiển thị sớm**. Tuy nhiên, do chưa đến 22:00 nên bị **Khóa**.</span></td></tr></tbody></table>

**Kết quả UX:** Nhân viên trực ca đêm lúc 1h sáng sẽ thấy:

1. Checklist Ca 3 đang làm dở (để vào check nốt).
2. Checklist Ca 3 của tối nay (để biết tối nay mình vẫn có lịch, nhưng chưa làm được).

---

#### 2.2.3. Lưu ý 

1. **Job sinh lịch (Daily Job):**
    
    
    - Job quét để sinh checklist hàng ngày cần chạy vào lúc **00:00 (Midnight)** của ngày đó (hoặc sớm hơn).
    - Dữ liệu `Start_Time` và `End_Time` phải được lưu chính xác kèm Date (DateTime format).
2. **Real-time Update (Cập nhật thời gian thực):**
    
    
    - Frontend cần có cơ chế `setInterval` hoặc `Timer` để check thời gian mỗi phút.
    - **Mục đích:** Để tự động chuyển trạng thái từ **"Chưa đến hạn"** -&gt; **"Đang diễn ra"** -&gt; **"Ẩn"** mà không cần user phải F5 (Reload) lại trang. Đặc biệt quan trọng với việc **Ẩn** ngay khi quá hạn.

### 2.3. Màn hình tạo mới với tần suất "Hàng ngày làm việc" 

<figure class="image align-center" id="bkmrk-m%C3%A0n-h%C3%ACnh-2.3---%C4%90%E1%BA%B7t-l">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-02/WD9image.png)<figcaption>Màn hình 2.3 - Đặt lịch với tần suất hàng ngày làm việc</figcaption></figure> Modal tạo mới đặt lịch với tần suất hàng ngày, các cụm thông tin tương tự với tần suất 1 lần gồm

- Thông tin chung
- Thực hiện
- Thời gian

Các thông tin khác khi lựa chọn tần suất " hàng ngày làm việc" , cụ thẻ mô tả chi tiết và logic xử lý như sau:

<table data-path-to-node="6" id="bkmrk-t%C3%AAn-tr%C6%B0%E1%BB%9Dng-%2F-ch%E1%BB%A9c-n%C4%83-2" style="width: 100%; height: 703.172px;"><thead><tr style="height: 46.5938px;"><td style="width: 12.2373%; height: 46.5938px;">**Tên trường / Chức năng**</td><td style="width: 6.30408%; height: 46.5938px;">**Bắt buộc**</td><td style="width: 24.9691%; height: 46.5938px;">**Mô tả giao diện (UI)**</td><td style="width: 56.4895%; height: 46.5938px;">**Logic xử lý (System/Business Logic)**</td></tr></thead><tbody><tr style="height: 35.3906px;"><td style="width: 12.2373%; height: 103.625px;"><span data-path-to-node="8,6,1,0">**Múi giờ**</span></td><td style="width: 6.30408%; height: 103.625px;"><span data-path-to-node="8,6,2,0">Có</span></td><td style="width: 24.9691%; height: 103.625px;"><span data-path-to-node="8,6,3,0">- Dropdown chọn múi giờ.</span>

<span data-path-to-node="8,6,3,0">Các giá trị gồm:</span>

- Múi giờ seting của user hiện tại
- Schedule time zone
- Site timzone
- User device time zone

</td><td style="width: 56.4895%; height: 103.625px;">- Các giá trị enum. Hiện tại **Mặc định:** Auto-detect múi giờ theo setting của User hiện tại (Client time).
- Không xóa
- <span style="color: #e03e2d;">Làm trước Múi giời của user hiện tại , các enum khác để sprintt sau</span>

</td></tr><tr style="height: 35.3906px;"><td style="width: 12.2373%; height: 141.75px;"><span data-path-to-node="8,7,1,0">**Thời lượng thực hiện**</span></td><td style="width: 6.30408%; height: 141.75px;"><span data-path-to-node="8,7,2,0">Có</span></td><td style="width: 24.9691%; height: 141.75px;">\- 2 ô Input: Ngày bắt đầu (Date) + Giờ (Time) và Ngày kết thúc (Date) + Giờ (time)

  
\- Note: "Mỗi lịch được thực hiện trong X giờ".

</td><td style="width: 56.4895%; height: 141.75px;">\- Validate: `End_Time` phải lớn hơn bằng `Start_Time`.

  
\- Hệ thống tự tính toán `Duration` = End - Start để hiển thị gợi ý.

-Mặc định là ngày hiện tại . Giờ mặc định là giờ hiện tại

</td></tr><tr style="height: 264.906px;"><td style="width: 12.2373%; height: 264.906px;"><span data-path-to-node="6,1,0,0">**Tần suất**</span></td><td style="width: 6.30408%; height: 264.906px;"><span data-path-to-node="6,1,1,0">Có</span></td><td style="width: 24.9691%; height: 264.906px;">\- Dropdown select.

  
\- Giá trị chọn: **"Hàng ngày làm việc"**.

  
\- Note bên dưới: "Lịch sẽ được lặp đi lặp lại hay không?".

</td><td style="width: 56.4895%; height: 264.906px;">\- Khi chọn giá trị này, hệ thống cũng **Hiển thị (Unhide)** khối cấu hình "Kết thúc" (tương tự như chọn Hàng ngày).

  
\- **Logic sinh lịch (Generation Logic):**

  
\+ Hệ thống xác định "Ngày làm việc" dựa trên cấu hình Lịch làm việc của Công ty (Working Calendar) hoặc mặc định là từ **Thứ 2 đến Thứ 6**.

  
\+ **Bỏ qua (Skip):** Thứ 7, Chủ Nhật và các ngày Lễ/Tết (nếu hệ thống có cấu hình nghỉ lễ).

**HIỆN TẠI CHƯA LÀM CẤU HÌNH NGHỈ LỄ**

LƯU Ý KHI LỰA CHỌN ĐỔI GIÁ TRỊ TỪ MỘT LẦN SANG CÁC TẦN SUẤT KHÁC

- **Nếu thời lượng thực hiện có tổng time &lt; = 24 giờ (Tính từ ngày bắt đầu - giờ bắt đầu đến ngày kết thúc đến giờ kết thúc &lt; =24h) --&gt; THì hiện thị toàn bộ các tần suất**
    - <span data-path-to-node="8,8,3,0">Một lần</span>
    - <span data-path-to-node="8,8,3,0">Hàng ngày</span>
    - <span data-path-to-node="8,8,3,0">Hàng ngày làm việc </span>
    - <span data-path-to-node="8,8,3,0">Hàng tuần</span>
    - <span data-path-to-node="8,8,3,0">Hàng tháng</span>
    - <span data-path-to-node="8,8,3,0">Hàng năm</span>
    - <span data-path-to-node="8,8,3,0">Tùy biến</span>

\--&gt; Lý do : Tần suất hàng ngày và hàng ngày lv cho phép vắt ngày thực hiện . (- Miễn là tổng thời gian thực hiện không quá 1 ngày thì vẫn đảm bảo logic lặp lại hàng ngày được.)

- **Nếu thời lượng thực hiện có tổng time &gt;24h thì chỉ hiển thì các tần suất:**
    - Một lần
    - Hàng tuần
    - Hàng Tháng
    - Hàng năm
    - Tùy biến

\--&gt; Lý do: Nếu một checklist kéo dài &gt; 24h (Ví dụ: Từ 8:00 Thứ 2 đến 8:00 Thứ 4), nó không thể lặp lại "Hàng ngày" vì sẽ gây xung đột chồng chéo thời gian (Overlap) giữa lịch cũ chưa xong và lịch mới sinh ra.)

-&gt; Giá trị tùy biến thì trong giá trị tùy biển đơn vị "Tuần" ẩn block chọn Thứ . Chỉ chọn lặp lại hàng &lt;nhập số&gt; Tuần

-TH chọn tần suất trước rồi chọn đến ngày bắt đầu và ngày kết thúc &gt;24 giờ thì mặc đinh bay về tần suất 1 lần

**<span style="color: #e03e2d;">Nếu người dùng đang chọn Tần suất là "Hàng ngày làm việc", sau đó quay lại sửa giờ kết thúc thì disable không cho chọn ngày vượt quá 24h. Nếu nhập thời gian &gt;24h thì tự động reset về tần suất 1 lần</span>**

</td></tr><tr style="height: 320.891px;"><td style="width: 12.2373%; height: 320.891px;"><span data-path-to-node="6,2,0,0">**Kết thúc**</span></td><td style="width: 6.30408%; height: 320.891px;"><span data-path-to-node="6,2,1,0">Có</span></td><td style="width: 24.9691%; height: 320.891px;">*(Giữ nguyên giao diện như phiên bản 2.4)*

  
\- 🔘 Không bao giờ.

  
\- ⚪ Vào ngày \[Date\].

  
\- ⚪ Sau \[N\] vòng lặp.

</td><td style="width: 56.4895%; height: 320.891px;">**Logic áp dụng cho "Hàng ngày làm việc":**

  
1\. **Không bao giờ:** Sinh lịch vô hạn vào các ngày làm việc. (Yêu cầu sinh cho 05 năm tới để tránh ảnh hưởng tới performance hệ thống)

  
2\. **Vào ngày:** Sinh lịch vào các ngày làm việc cho đến mốc thời gian này.

  
3\. **Sau \[N\] vòng lặp:**

  
\- *Ví dụ:* User nhập "Sau 5 vòng lặp" và bắt đầu từ Thứ 6. Nhập số nguyên dương, tối đa 500 vòng lặp

  
\- Hệ thống sinh: T6, T2, T3, T4, T5 (Bỏ qua T7, CN). Đủ 5 bản ghi thì dừng.

</td></tr></tbody></table>

---

#### 2.3.1. So sánh Logic sinh lịch Hàng ngày vs Hàng ngày làm việc

<table data-path-to-node="10" id="bkmrk-ti%C3%AAu-ch%C3%AD-h%C3%A0ng-ng%C3%A0y-%28"><thead><tr><td>**Tiêu chí**</td><td>**Hàng ngày (Daily)**</td><td>**Hàng ngày làm việc (Daily on Workdays)**</td></tr></thead><tbody><tr><td><span data-path-to-node="10,1,0,0">**Định nghĩa**</span></td><td><span data-path-to-node="10,1,1,0">Lặp lại vào tất cả các ngày trong tuần (Mon - Sun).</span></td><td><span data-path-to-node="10,1,2,0">Chỉ lặp lại vào ngày làm việc (thường là Mon - Fri).</span></td></tr><tr><td><span data-path-to-node="10,2,0,0">**Xử lý T7, CN**</span></td><td><span data-path-to-node="10,2,1,0">**CÓ** sinh lịch.</span></td><td><span data-path-to-node="10,2,2,0">**KHÔNG** sinh lịch (Bỏ qua).</span></td></tr><tr><td><span data-path-to-node="10,3,0,0">**Xử lý ngày Lễ**</span></td><td><span data-path-to-node="10,3,1,0">**CÓ** sinh lịch (trừ khi có rule đặc biệt khác).</span></td><td><span data-path-to-node="10,3,2,0">**KHÔNG** sinh lịch (Nếu lịch làm việc định nghĩa đó là ngày nghỉ). --&gt; **HIỆN TẠI CHƯA CÓ CẤU HÌNH NÀY**</span></td></tr><tr><td><span data-path-to-node="10,4,0,0">**Ví dụ Input**</span></td><td><span data-path-to-node="10,4,1,0">Bắt đầu T6, Lặp 3 lần.</span></td><td><span data-path-to-node="10,4,2,0">Bắt đầu T6, Lặp 3 lần.</span></td></tr><tr><td><span data-path-to-node="10,5,0,0">**Kết quả Output**</span></td><td><span data-path-to-node="10,5,1,0">T6, T7, CN.</span></td><td><span data-path-to-node="10,5,2,0">T6, T2, T3 (Bỏ qua T7, CN).</span></td></tr></tbody></table>

#### 2.3.2. Cơ chế hiển thị sinh lịch tại trang chủ "Của tôi" (Check list được sinh ra của hôm nay với user hiện tại)

<table data-path-to-node="8" id="bkmrk-giai-%C4%91o%E1%BA%A1n-%C4%90i%E1%BB%81u-ki%E1%BB%87n--1" style="width: 100%;"><thead><tr><td style="width: 9.51533%;">**Giai đoạn**</td><td style="width: 12.6108%;">**Điều kiện thời gian (Current Time)**</td><td style="width: 35.5995%;">**Trạng thái hiển thị** </td><td style="width: 42.2744%;">**Hành động cho phép (Action)**</td></tr></thead><tbody><tr><td style="width: 9.51533%;">**1. Sắp diễn ra**

  
*(Early View)*

</td><td style="width: 12.6108%;"><span data-path-to-node="8,1,1,0">`00:00 Ngày T` ≤ `Hiện tại` &lt; `Start_Time`</span></td><td style="width: 35.5995%;">**👁️ HIỂN THỊ (Visible)**

  
\- **Style:** Màu xám hoặc mờ nhẹ (Dimmed).

  
\- **Label/Badge:** ⚠️ "Chưa đến hạn thực hiện" (hoặc "Sắp diễn ra").

  
\- **Icon:** 🔒 (Ổ khóa - tùy chọn).

</td><td style="width: 42.2744%;">**⛔ KHÓA (Disabled)**

  
\- Không cho phép mở form nhập liệu.

  
\- Khi bấm vào: Hiển thị thông báo (Toast): *"Công việc bắt đầu lúc \[Start\_Time\]. Vui lòng quay lại sau."*

</td></tr><tr><td style="width: 9.51533%;">**2. Đang diễn ra**

  
*(Active)*

</td><td style="width: 12.6108%;"><span data-path-to-node="8,2,1,0">`Start_Time` ≤ `Hiện tại` ≤ `End_Time`</span></td><td style="width: 35.5995%;">**👁️ HIỂN THỊ (Visible)**

  
\- **Style:** Nổi bật, bình thường.

  
\- **Label/Badge:** 🟢 "Cần làm" / "Đang thực hiện".

</td><td style="width: 42.2744%;">**✅ CHO PHÉP (Enabled)**

  
\- Bấm vào để mở form checklist.

  
\- Cho phép thực hiện, lưu nháp, hoàn thành.

</td></tr><tr><td style="width: 9.51533%;">**3. Quá hạn**

  
*(Expired)*

</td><td style="width: 12.6108%;"><span data-path-to-node="8,3,1,0">`Hiện tại` &gt; `End_Time`</span></td><td style="width: 35.5995%;">**❌ ẨN (Hidden)**

  
\- Biến mất khỏi danh sách "Cần làm" ngay lập tức.

  
\- *(Logic Backend)*: Hệ thống update trạng thái bản ghi thành "Missed" (Bỏ lỡ) hoặc "Expired" nếu chưa hoàn thành.

</td><td style="width: 42.2744%;">**⛔ CHẶN**

  
\- Nếu user đang mở form dở dang mà đồng hồ điểm qua `End_Time` -&gt; Khi bấm Submit sẽ báo lỗi: *"Đã hết thời gian thực hiện checklist này".*

</td></tr></tbody></table>

#### 2.3.3. Logic Xử lý Lịch Vắt ngày (Straddling Logic)

- Nếu `Start_Date` là **Ngày làm việc** (T2 - T6) -&gt; **SINH LỊCH** (Kể cả khi giờ kết thúc rơi vào T7/CN).
- Nếu `Start_Date` là **Ngày nghỉ** (T7, CN) -&gt; **BỎ QUA** (Không sinh lịch).
- Ví du: Ca làm việc từ 22:00 đêm đến 02:00 sáng hôm sau. Ngày nghỉ là T7, CN. **Bảng kịch bản Sinh lịch (Scenario Table)**
    
    <table data-path-to-node="10" style="width: 100%;"><thead><tr><td style="width: 11.1409%;">**Thứ (Ngày bắt đầu)**</td><td style="width: 23.8764%;">**Thời gian thực hiện**</td><td style="width: 15.4524%;">**Hành động hệ thống**</td><td style="width: 49.6644%;">**Giải thích**</td></tr></thead><tbody><tr><td style="width: 11.1409%;"><span data-path-to-node="10,1,0,0">**Thứ 2**</span></td><td style="width: 23.8764%;"><span data-path-to-node="10,1,1,0">22:00 T2 -&gt; 02:00 T3</span></td><td style="width: 15.4524%;"><span data-path-to-node="10,1,2,0">**Sinh lịch**</span></td><td style="width: 49.6644%;"><span data-path-to-node="10,1,3,0">T2 là ngày làm việc.</span></td></tr><tr><td style="width: 11.1409%;"><span data-path-to-node="10,2,0,0">Thứ 3- Thứ 4</span></td><td style="width: 23.8764%;"><span data-path-to-node="10,2,1,0">...</span></td><td style="width: 15.4524%;"><span data-path-to-node="10,2,2,0">...</span></td><td style="width: 49.6644%;"><span data-path-to-node="10,2,3,0">... tương tự thứ 2</span></td></tr><tr><td style="width: 11.1409%;"><span data-path-to-node="10,3,0,0">**Thứ 5**</span></td><td style="width: 23.8764%;"><span data-path-to-node="10,3,1,0">22:00 T5 -&gt; 02:00 T6</span></td><td style="width: 15.4524%;"><span data-path-to-node="10,3,2,0">**Sinh lịch**</span></td><td style="width: 49.6644%;"><span data-path-to-node="10,3,3,0">T5 là ngày làm việc.</span></td></tr><tr><td style="width: 11.1409%;"><span data-path-to-node="10,4,0,0">**Thứ 6**</span></td><td style="width: 23.8764%;"><span data-path-to-node="10,4,1,0">22:00 T6 -&gt; **02:00 T7**</span></td><td style="width: 15.4524%;"><span data-path-to-node="10,4,2,0">**SINH LỊCH**</span></td><td style="width: 49.6644%;"><span data-path-to-node="10,4,3,0">**Quan trọng:** Dù kết thúc vào sáng T7 (Ngày nghỉ), nhưng ca này bắt đầu vào T6 (Ngày làm việc) nên vẫn hợp lệ. Nhân viên làm ca đêm T6 vẫn phải có checklist.</span></td></tr><tr><td style="width: 11.1409%;"><span data-path-to-node="10,5,0,0">**Thứ 7**</span></td><td style="width: 23.8764%;"><span data-path-to-node="10,5,1,0">22:00 T7 -&gt; 02:00 CN</span></td><td style="width: 15.4524%;"><span data-path-to-node="10,5,2,0"> **Bỏ qua**</span></td><td style="width: 49.6644%;"><span data-path-to-node="10,5,3,0">T7 là ngày nghỉ -&gt; Không có ca đêm bắt đầu vào T7.</span></td></tr><tr><td style="width: 11.1409%;"><span data-path-to-node="10,6,0,0">**Chủ Nhật**</span></td><td style="width: 23.8764%;"><span data-path-to-node="10,6,1,0">22:00 CN -&gt; 02:00 T2</span></td><td style="width: 15.4524%;"><span data-path-to-node="10,6,2,0">**Bỏ qua**</span></td><td style="width: 49.6644%;"><span data-path-to-node="10,6,3,0">CN là ngày nghỉ -&gt; Không có ca đêm bắt đầu vào CN.</span></td></tr><tr><td style="width: 11.1409%;"><span data-path-to-node="10,7,0,0">**Thứ 2 (Tuần sau)**</span></td><td style="width: 23.8764%;"><span data-path-to-node="10,7,1,0">22:00 T2 -&gt; 02:00 T3</span></td><td style="width: 15.4524%;"><span data-path-to-node="10,7,2,0"> **Sinh lịch**</span></td><td style="width: 49.6644%;"><span data-path-to-node="10,7,3,0">Quay lại chu kỳ làm việc</span></td></tr></tbody></table>

### 2.4. Màn hình tạo mới với tần suất "Hàng tuần"

<figure class="image align-center" id="bkmrk-m%C3%A0n-h%C3%ACnh-2.4--%C4%90%E1%BA%B7t-l%E1%BB%8B">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-02/zh2image.png)<figcaption>Màn hình 2.4- Đặt lịch với tần suất Hàng tuần</figcaption></figure> Modal tạo mới đặt lịch với tần suất "Hàng tuần", các cụm thông tin tương tự với tần suất 1 lần gồm

- Thông tin chung
- Thực hiện
- Thời gian

Các thông tin khác khi lựa chọn tần suất " hàng tuần" , cụ thẻ mô tả chi tiết và logic xử lý như sau:

<table data-path-to-node="5" id="bkmrk-t%C3%AAn-tr%C6%B0%E1%BB%9Dng-%2F-ch%E1%BB%A9c-n%C4%83-3"><thead><tr><td>**Tên trường / Chức năng**</td><td>**Bắt buộc**</td><td>**Mô tả giao diện (UI)**</td><td>**Logic xử lý (System/Business Logic)**</td></tr></thead><tbody><tr><td style="width: 12.2373%; height: 103.625px;"><span data-path-to-node="8,6,1,0">**Múi giờ**</span></td><td style="width: 6.30408%; height: 103.625px;"><span data-path-to-node="8,6,2,0">Có</span></td><td style="width: 26.0846%; height: 103.625px;"><span data-path-to-node="8,6,3,0">- Dropdown chọn múi giờ.</span>

<span data-path-to-node="8,6,3,0">Các giá trị gồm:</span>

- Múi giờ seting của user hiện tại
- Schedule time zone
- Site timzone
- User device time zone

</td><td style="width: 44.8702%; height: 103.625px;">- Các giá trị enum. Hiện tại **Mặc định:** Auto-detect múi giờ theo setting của User hiện tại (Client time).
- Không xóa
- <span style="color: #e03e2d;">Làm trước Múi giời của user hiện tại , các enum khác để sprintt sau</span>

</td></tr><tr><td style="width: 12.2373%; height: 141.75px;"><span data-path-to-node="8,7,1,0">**Thời lượng thực hiện**</span></td><td style="width: 6.30408%; height: 141.75px;"><span data-path-to-node="8,7,2,0">Có</span></td><td style="width: 24.9691%; height: 141.75px;">\- 2 ô Input: Ngày bắt đầu (Date) + Giờ (Time) và Ngày kết thúc (Date) + Giờ (time)

  
\- Note: "Mỗi lịch được thực hiện trong X giờ".

</td><td style="width: 56.4895%; height: 141.75px;">\- Validate: `End_Time` phải lớn hơn bằng `Start_Time`.

  
\- Hệ thống tự tính toán `Duration` = End - Start để hiển thị gợi ý.

-Mặc định là ngày hiện tại . Giờ mặc định là giờ hiện tại

</td></tr><tr><td><span data-path-to-node="5,1,0,0">**Tần suất**</span></td><td><span data-path-to-node="5,1,1,0">Có</span></td><td>\- Dropdown select.

  
\- Giá trị chọn: **"Hàng tuần"**.

  
\- *Lưu ý:* Giao diện tối giản, không hiển thị các nút chọn Thứ (T2, T3...) để tránh rối.

</td><td>\- **Sự kiện (On Change):** Khi người dùng chọn "Hàng tuần":

  
1\. Hiển thị (Unhide) khối cấu hình **"Kết thúc"** ngay bên dưới.

  
2\. Kích hoạt logic **"Tự động nhận diện Thứ"**:

  
\- Hệ thống lấy ngày trong trường **"Bắt đầu từ"** để xác định thứ lặp lại.

  
\- *Ví dụ:* Ngày bắt đầu `02/11/2020` là Thứ Hai -&gt; Hệ thống ngầm hiểu lịch sẽ lặp vào **mỗi Thứ Hai**.

</td></tr><tr><td>**Kết thúc**

  
*(Cấu hình vòng lặp)*

</td><td><span data-path-to-node="5,2,1,0">Có</span></td><td>**Dạng Radio Button (Chọn 1 trong 3):**

  
1\. 🔘 **Không bao giờ** (Mặc định).

  
2\. ⚪ **Vào ngày:** Kèm 1 ô Date Picker (chọn ngày).

  
3\. ⚪ **Sau:** Kèm 1 ô nhập số (Input Number) + Label "vòng lặp".

</td><td>**1. Không bao giờ:**

  
\- Hệ thống sinh lịch lặp lại vô hạn vào thứ đã định (Hệ thống tự sinh trước 5 năm dể tránh ảnh hưởng performance).

  
**2. Vào ngày \[Date\]:**

  
\- Sinh lịch lặp lại cho đến khi: `Ngày bắt đầu của phiên lặp` &gt; `Date`.

  
\- *Ví dụ:* Chọn kết thúc 30/11. Lịch lặp T2. Các ngày sinh ra: 02, 09, 16, 23, 30/11.

  
**3. Sau \[N\] vòng lặp:**

  
\- Sinh đúng **N** bản ghi lịch (bao gồm cả bản ghi gốc).

  
\- *Ví dụ:* Nhập 4 -&gt; Sinh ra lịch cho 4 tuần liên tiếp.

</td></tr><tr><td>**Thời lượng thực hiện**

  
*(Liên quan logic tuần)*

</td><td><span data-path-to-node="5,3,1,0">Có</span></td><td><span data-path-to-node="5,3,2,0">- 2 cặp ô nhập liệu: \[Ngày bắt đầu - Giờ\] và \[Ngày kết thúc - Giờ\].</span></td><td>\- **Logic Vắt tuần:**

  
\- Cho phép khoảng thời gian `End - Start` &gt; 24 giờ.

  
\- Cho phép vắt qua tuần (Ví dụ: Từ 10:00 Thứ 6 tuần này đến 10:00 Thứ 2 tuần sau).

  
\- Hệ thống vẫn sinh lịch bình thường theo chu kỳ 7 ngày: `Start_New = Start_Old + 7 days`.

- **Nếu thời lượng thực hiện có tổng time &gt; 7 ngày thì chỉ hiển thì các tần suất:**
    - Một lần
    - Hàng Tháng
    - Hàng năm
    - Tùy biến

\--&gt; Khi chọn tùy biến thì inactive chọn giá trị "Ngày"

</td></tr></tbody></table>

#### 2.4.1. Lưu ý logic sinh lịch

**1: Xác định ngày cơ sở (Base Date)**

- - Lấy `Start_Date` từ ô "Bắt đầu từ".
    - Xác định `Day_Of_Week` (Thứ) của ngày này. (Ví dụ: Thứ Hai).
    - *Lưu ý:* Nếu User sau đó sửa lại ngày bắt đầu sang một ngày là Thứ Ba, hệ thống phải tự động cập nhật logic lặp sang Thứ Ba.

**2: Tính toán chuỗi lặp (Recurrence Series)**

- - - **Interval (Khoảng cách):** 7 ngày.
        - **Công thức:**
            
            
            - `Start_Next` = `Start_Current` + 7 ngày.
            - `End_Next` = `End_Current` + 7 ngày.

**3: Kiểm tra điều kiện dừng (Stop Condition)**

- - Dựa vào cấu hình trường "Kết thúc" để dừng vòng lặp sinh bản ghi.

### 2.5. Màn hình tạo mới với tần suất "Hàng tháng"

<figure class="image align-center" id="bkmrk-m%C3%A0n-h%C3%ACnh-2.5--%C4%90%E1%BA%B7t-l%E1%BB%8B">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-02/hJyimage.png)<figcaption>Màn hình 2.5- Đặt lịch với tần suất Hàng tháng</figcaption></figure>Modal tạo mới đặt lịch với tần suất "Hàng tuần", các cụm thông tin tương tự với tần suất 1 lần gồm

- Thông tin chung
- Thực hiện
- Thời gian

Các thông tin khác khi lựa chọn tần suất " hàng tháng" , cụ thẻ mô tả chi tiết và logic xử lý như sau:

<table data-path-to-node="6" id="bkmrk-t%C3%AAn-tr%C6%B0%E1%BB%9Dng-%2F-ch%E1%BB%A9c-n%C4%83-4"><thead><tr><td>**Tên trường / Chức năng**</td><td>**Bắt buộc**</td><td>**Mô tả giao diện (UI)**</td><td>**Logic xử lý (System/Business Logic)**</td></tr></thead><tbody><tr><td style="width: 12.2373%; height: 103.625px;"><span data-path-to-node="8,6,1,0">**Múi giờ**</span></td><td style="width: 6.30408%; height: 103.625px;"><span data-path-to-node="8,6,2,0">Có</span></td><td style="width: 26.0846%; height: 103.625px;"><span data-path-to-node="8,6,3,0">- Dropdown chọn múi giờ.</span>

<span data-path-to-node="8,6,3,0">Các giá trị gồm:</span>

- Múi giờ seting của user hiện tại
- Schedule time zone
- Site timzone
- User device time zone

</td><td style="width: 44.8702%; height: 103.625px;">- Các giá trị enum. Hiện tại **Mặc định:** Auto-detect múi giờ theo setting của User hiện tại (Client time).
- Không xóa
- <span style="color: #e03e2d;">Làm trước Múi giời của user hiện tại , các enum khác để sprintt sau</span>

</td></tr><tr><td style="width: 12.2373%; height: 141.75px;"><span data-path-to-node="8,7,1,0">**Thời lượng thực hiện**</span></td><td style="width: 6.30408%; height: 141.75px;"><span data-path-to-node="8,7,2,0">Có</span></td><td style="width: 24.9691%; height: 141.75px;">\- 2 ô Input: Ngày bắt đầu (Date) + Giờ (Time) và Ngày kết thúc (Date) + Giờ (time)

  
\- Note: "Mỗi lịch được thực hiện trong X giờ".

</td><td style="width: 56.4895%; height: 141.75px;">\- Validate: `End_Time` phải lớn hơn bằng `Start_Time`.

  
\- Hệ thống tự tính toán `Duration` = End - Start để hiển thị gợi ý.

-Mặc định là ngày hiện tại . Giờ mặc định là giờ hiện tại

</td></tr><tr><td><span data-path-to-node="6,1,0,0">**Tần suất**</span></td><td><span data-path-to-node="6,1,1,0">Có</span></td><td>\- Dropdown select.

  
\- Giá trị chọn: **"Hàng tháng"**.

  
\- *Lưu ý:* Không hiển thị các tùy chọn phức tạp (như "Thứ 2 đầu tiên của tháng") mà dùng logic ngầm định.

</td><td>\- **Cơ chế xác định Ngày (Day of Month Logic):**

  
\+ Hệ thống tự động lấy **Ngày (Day)** của trường "Bắt đầu từ" làm mốc lặp lại.

  
\+ *Ví dụ:* User chọn ngày bắt đầu là `02/11/2020`. Hệ thống xác định ngày lặp là **Ngày mùng 2 hàng tháng**.

  
\+ *Trường hợp đặc biệt:* Xem mục "Xử lý cuối tháng" bên dưới.

Lưu ý: khi chọn thời lương thực hiện với ngày kết thúc chọn vào các ngày 29-30-31 -&gt; Hiển thị cảnh báo Lưu ý: <span style="color: #e03e2d; background-color: #ecf0f1;">**Với các tháng thiếu ngày, lịch sẽ tự động điều chỉnh về ngày cuối cùng của tháng đó**</span>.

\+ TH nếu ngày bắt đầu và ngày kết thúc &gt; số ngày tương ứng trong tháng đã chọn ngày bắt đầu thì chỉ hiển thị các giá trị

- Một lần
- Hàng năm
- Tùy biến

\--&gt; Khi chọn tùy biến thì inactive chọn giá trị "Ngày"

</td></tr><tr><td>**Kết thúc**

  
*(Cấu hình vòng lặp)*

</td><td><span data-path-to-node="6,2,1,0">Có</span></td><td>**Dạng Radio Button (Chọn 1 trong 3):**

  
1\. 🔘 **Không bao giờ** (Mặc định).

  
2\. ⚪ **Vào ngày** \[Date Picker\].

  
3\. ⚪ **Sau** \[Input Number\] vòng lặp.

</td><td>**1. Không bao giờ:**

  
\- Sinh lịch vào ngày định sẵn của các tháng tiếp theo vô hạn. (Mặc định sinh trươc 5 năm để tránh ảnh hưởng performance

  
**2. Vào ngày \[Date\]:**

  
\- Sinh lịch cho đến khi: `Ngày bắt đầu của tháng tiếp theo` &gt; `Date cấu hình`.

  
**3. Sau \[N\] vòng lặp:**

  
\- Sinh đúng **N** bản ghi lịch (bao gồm bản ghi gốc).

  
\- *Ví dụ:* Bắt đầu tháng 11, lặp 3 lần -&gt; Sinh ra tháng 11, 12, 01.

</td></tr></tbody></table>

#### 2.5.1. Logic Sinh Lịch &amp; Xử lý Ngoại lệ với TH số ngày trong các tháng khác nhau

Ví dụ : 28 -29-30-31

##### A. Quy tắc Sinh lịch Cơ bản

- **Khoảng cách lặp:** +1 Tháng (Month).
- **Giữ nguyên giờ:** Giờ bắt đầu và Giờ kết thúc được giữ nguyên, chỉ thay đổi Ngày/Tháng/Năm.

##### B. Quy tắc Xử lý Cuối tháng 

**Bài toán:** User chọn ngày bắt đầu là **31/01**. Tháng 2 không có ngày 31.

1. **Mong muốn Nguyên tắc xử lý:** Nếu ngày lặp lại không tồn tại trong tháng mục tiêu, hệ thống sẽ **lùi về ngày cuối cùng hợp lệ** của tháng đó.
2. **Ví dụ minh họa:**
    
    
    - **Input:** Bắt đầu ngày **31/01/2020**. Tần suất Hàng tháng.
    - **Kết quả sinh lịch:**
        
        
        - Tháng 1: 31/01/2020.
        - Tháng 2 (Năm nhuận): **29/02/2020** (Vì T2 ko có ngày 30, 31).
        - Tháng 3: **31/03/2020** (Quay lại ngày gốc vì T3 có ngày 31).
        - Tháng 4: **30/04/2020** (Lùi về cuối tháng).

##### C. Logic Vắt tháng

Cho phép checklist kéo dài từ tháng này sang tháng sau (Ví dụ: Chốt công từ ngày 25 tháng này đến ngày 05 tháng sau).

- **Công thức:**
    
    
    - `Start_Next = Start_Current + 1 Month`
    - `End_Next = End_Current + 1 Month`
- **Ví dụ:**
    
    
    - Lịch 1: 25/01 -&gt; 05/02.
    - Lịch 2: 25/02 -&gt; 05/03 (Hệ thống tự động tính đúng ngày kể cả tháng 2 thiếu ngày).

#### 2.5.2. Cơ chế hiển thị sinh lịch tại trang chủ "Của tôi" (Check list được sinh ra của hôm nay với user hiện tại)

Áp dụng logic nhất quán với các tần suất trước khi hiển thị ở menu Của tôi

**Ví dụ:** Checklist "Báo cáo tài chính tháng" (Ngày 02 hàng tháng).

- **Thời gian:** 08:00 ngày 02 -&gt; 17:00 ngày 02.

<table data-path-to-node="24" id="bkmrk-th%E1%BB%9Di-%C4%91i%E1%BB%83m-%28current-t"><thead><tr><td>**Thời điểm (Current Time)**</td><td>**Trạng thái hiển thị**</td><td>**Hành vi hệ thống**</td></tr></thead><tbody><tr><td><span data-path-to-node="24,1,0,0">**Ngày 01**</span></td><td><span data-path-to-node="24,1,1,0">**👁️ HIỂN THỊ (Khóa)**</span></td><td><span data-path-to-node="24,1,2,0">Xuất hiện sớm 1 ngày (hoặc từ 00:00 ngày 02 tùy cấu hình) để nhân viên biết sắp đến hạn nộp báo cáo.</span></td></tr><tr><td><span data-path-to-node="24,2,0,0">**08:00 ngày 02**</span></td><td><span data-path-to-node="24,2,1,0">**🟢 ĐANG DIỄN RA**</span></td><td><span data-path-to-node="24,2,2,0">Mở khóa form nhập liệu.</span></td></tr><tr><td><span data-path-to-node="24,3,0,0">**17:01 ngày 02**</span></td><td><span data-path-to-node="24,3,1,0">**❌ ẨN (Quá hạn)**</span></td><td><span data-path-to-node="24,3,2,0">Ẩn khỏi danh sách. Ghi nhận trạng thái Missed nếu chưa nộp.</span></td></tr></tbody></table>

### 2.6. Màn hình tạo mới với tần suất "Hàng năm"

<figure class="image align-center" id="bkmrk--5">![image.png](https://bookstack.supa.vn/uploads/images/gallery/2026-02/EMFimage.png)<figcaption>Màn hình 2.6- Tần suất Hàng năm</figcaption></figure>
<table data-path-to-node="6" id="bkmrk-t%C3%AAn-tr%C6%B0%E1%BB%9Dng-%2F-ch%E1%BB%A9c-n%C4%83-5"><thead><tr><td>**Tên trường / Chức năng**</td><td>**Bắt buộc**</td><td>**Mô tả giao diện (UI)**</td><td>**Logic xử lý (System/Business Logic)**</td></tr></thead><tbody><tr><td><span data-path-to-node="6,1,0,0">**Tần suất**</span></td><td><span data-path-to-node="6,1,1,0">Có</span></td><td>\- Dropdown select.

  
\- Giá trị chọn: **"Hàng năm"**.

  
\- *Note:* Giao diện đơn giản, không yêu cầu người dùng chọn "Ngày nào tháng nào" mà hệ thống tự động lấy từ ngày bắt đầu.

</td><td>\- **Cơ chế xác định Ngày &amp; Tháng (Day &amp; Month Logic):**

  
\+ Hệ thống lấy **Ngày (Day)** và **Tháng (Month)** của trường "Bắt đầu từ" làm mốc lặp lại.

  
\+ *Ví dụ:* User chọn ngày bắt đầu là `02/11/2020`. Hệ thống xác định lịch sẽ lặp lại vào **Ngày 02 Tháng 11 hàng năm**.

  
\+ *Trường hợp đặc biệt:* Xử lý năm nhuận (Xem mục 2.6.1).

</td></tr><tr><td>**Kết thúc**

  
*(Cấu hình vòng lặp)*

</td><td><span data-path-to-node="6,2,1,0">Có</span></td><td>**Dạng Radio Button (Chọn 1 trong 3):**

  
1\. 🔘 **Không bao giờ** (Mặc định).

  
2\. ⚪ **Vào ngày** \[Date Picker\].

  
3\. ⚪ **Sau** \[Input Number\] vòng lặp.

</td><td>**1. Không bao giờ:**

  
\- Sinh lịch vô hạn (hoặc giới hạn server 5-10 năm).

  
**2. Vào ngày \[Date\]:**

  
\- Sinh lịch cho đến khi: `Năm của lịch tiếp theo` &gt; `Năm của Date cấu hình`.

  
**3. Sau \[N\] vòng lặp:**

  
\- Sinh đúng **N** bản ghi.

  
\- *Ví dụ:* Bảo trì máy trong 5 năm khấu hao -&gt; Nhập 5 -&gt; Sinh ra 5 phiếu bảo trì.

</td></tr></tbody></table>

#### 2.6.1. Logic sinh lịch và xử lý các TH đặc biệt

##### A. Quy tắc Sinh lịch Cơ bản

- **Khoảng cách lặp:** +1 Năm (Year).
- **Công thức:**
    
    
    - `Start_Next = Start_Current + 1 Year`
    - `End_Next = End_Current + 1 Year`

##### B. Quy tắc Xử lý Ngày 29/02

**Bài toán:** User tạo lịch chúc mừng sinh nhật hoặc bảo trì vào ngày **29/02/2024** (Năm nhuận). Năm 2025 không có ngày 29/02 thì hệ thống xử lý sao?

**Giải pháp (Standard Logic):**

Hệ thống sẽ lùi về ngày cuối cùng của tháng 2 trong năm không nhuận.

- **Input:** 29/02/2024.
- **Output:**
    
    
    - Năm 2025: **28/02/2025**.
    - Năm 2026: **28/02/2026**.
    - Năm 2027: **28/02/2027**.
    - Năm 2028 (Nhuận): **29/02/2028** (Hệ thống thông minh tự trả lại ngày gốc).

##### C. Logic Vắt năm 

Cho phép checklist kéo dài từ năm cũ sang năm mới (Ví dụ: Tổng kết năm tài chính từ 25/12 năm trước đến 05/01 năm sau).

- **Logic:** Hệ thống cộng 1 năm vào cả `Start_Date` và `End_Date`, giữ nguyên khoảng cách ngày.

---

#### 2.6.2. Vòng đời Hiển thị 

Đối với lịch hàng năm, "tính năng nhắc việc sớm" là cực kỳ quan trọng vì nhân viên dễ bị quên các đầu việc ít lặp lại này.

**Ví dụ:** Bảo trì server định kỳ (Ngày 02/11 hàng năm).

<table data-path-to-node="22" id="bkmrk-th%E1%BB%9Di-%C4%91i%E1%BB%83m-tr%E1%BA%A1ng-th%C3%A1i"><thead><tr><td>**Thời điểm**</td><td>**Trạng thái hiển thị**</td><td>**Hành vi hệ thống**</td></tr></thead><tbody><tr><td><span data-path-to-node="22,1,0,0">**Tháng 10 (Trước 1 tháng)**</span></td><td><span data-path-to-node="22,1,1,0">**👁️ HIỂN THỊ (Khóa)**</span></td><td><span data-path-to-node="22,1,2,0">Xuất hiện trong danh sách với nhãn "Sắp đến hạn" (Tùy chọn cấu hình nhắc trước bao lâu).</span></td></tr><tr><td><span data-path-to-node="22,2,0,0">**00:00 ngày 02/11**</span></td><td><span data-path-to-node="22,2,1,0">**🟢 ĐANG DIỄN RA**</span></td><td><span data-path-to-node="22,2,2,0">Mở khóa. Cho phép thực hiện.</span></td></tr><tr><td><span data-path-to-node="22,3,0,0">**Sau thời hạn**</span></td><td><span data-path-to-node="22,3,1,0">**❌ ẨN (Quá hạn)**</span></td><td><span data-path-to-node="22,3,2,0">Ẩn khỏi danh sách.</span></td></tr></tbody></table>

### 2.7. Màn hình tạo mới với tần suất "Tùy biến"

##### 2.7.1. Tùy biến - Tab Theo ngày

Các trường thông tin khác tương tự như các đặt lịch đã mô tả bên trên. Các trường khác khi chọn Tần suất - Tùy biến

<table id="bkmrk-tr%C6%B0%E1%BB%9Dng-lo%E1%BA%A1i-m%C3%B4-t%E1%BA%A3-l%E1%BA%B7" style="width: 90%; height: 120.188px;"><thead><tr style="height: 29.7969px;"><th style="width: 25.8258%; height: 29.7969px;">Trường</th><th style="width: 20.7207%; height: 29.7969px;">Loại</th><th style="width: 53.4535%; height: 29.7969px;">Mô tả</th></tr></thead><tbody><tr style="height: 29.7969px;"><td style="width: 25.8258%; height: 29.7969px;">Lặp lại mỗi</td><td style="width: 20.7207%; height: 29.7969px;">Number</td><td style="width: 53.4535%; height: 29.7969px;">Số ngày lặp lại - Nhập số

Yêu cầu: &gt; 0

</td></tr><tr style="height: 30.7969px;"><td style="width: 25.8258%; height: 30.7969px;">Đơn vị</td><td style="width: 20.7207%; height: 30.7969px;">Label</td><td style="width: 53.4535%; height: 30.7969px;">"Ngày"</td></tr><tr style="height: 29.7969px;"><td style="width: 25.8258%; height: 29.7969px;">Bắt đầu từ</td><td style="width: 20.7207%; height: 29.7969px;">Date</td><td style="width: 53.4535%; height: 29.7969px;">Ngày bắt đầu tính chu kỳ

Thời gian bắt đầu phải lớn hơn thời gian kết thúc

</td></tr></tbody></table>

Vi dụ: Nhập 10 ngày thì cứ 10 ngày hệ thống sẽ sinh ra đăt lịch

##### 2.7.2. Tùy biến - Tab theo tuần

Các trường thông tin khác tương tự như các đặt lịch đã mô tả bên trên. Các trường khác khi chọn Tần suất - Tùy biến Tuần

<table id="bkmrk-tr%C6%B0%E1%BB%9Dng-lo%E1%BA%A1i-m%C3%B4-t%E1%BA%A3-l%E1%BA%B7-1" style="width: 90%; height: 120.188px;"><thead><tr style="height: 29.7969px;"><th style="width: 25.8258%; height: 29.7969px;">Trường</th><th style="width: 20.7207%; height: 29.7969px;">Loại</th><th style="width: 53.4535%; height: 29.7969px;">Mô tả</th></tr></thead><tbody><tr style="height: 29.7969px;"><td style="width: 25.8258%; height: 29.7969px;">Lặp lại mỗi</td><td style="width: 20.7207%; height: 29.7969px;">Number</td><td style="width: 53.4535%; height: 29.7969px;">Số tuần lặp lại - Nhập số

Yêu cầu: &gt; 0 (nguyên dương)

</td></tr><tr style="height: 30.7969px;"><td style="width: 25.8258%; height: 30.7969px;">Đơn vị</td><td style="width: 20.7207%; height: 30.7969px;">Label</td><td style="width: 53.4535%; height: 30.7969px;">"Tuần"</td></tr><tr><td style="width: 25.8258%;">Thứ</td><td style="width: 20.7207%;">Check box</td><td style="width: 53.4535%;">Tương đương các thứ trong tuần từ thứ 2 đến chủn nhâptj

Thứ 2

Thứ 3

Thứ 4

Thứ 5

Thứ 6

Thứ 7

CN

</td></tr><tr style="height: 29.7969px;"><td style="width: 25.8258%; height: 29.7969px;">Bắt đầu từ</td><td style="width: 20.7207%; height: 29.7969px;">Date</td><td style="width: 53.4535%; height: 29.7969px;">Ngày bắt đầu tính chu kỳ

Thời gian bắt đầu phải lớn hơn thời gian kết thúc

Điều kiện kết thúc:

Cung cấp 3 tùy chọn để hệ thống biết khi nào thì dừng việc lặp lại lịch này:

- **Không bao giờ:** Lịch sẽ lặp lại vô thời hạn theo chu kỳ đã thiết lập.
- **Vào ngày \[ Date \]:** Lịch sẽ tự động kết thúc vào một ngày cụ thể (người dùng chọn qua công cụ chọn ngày). *Ví dụ trong hình: 28/01/2027.*
- **Sau \[ X \] vòng lặp:** Lịch sẽ ngừng lại sau

</td></tr></tbody></table>

Ví dụ:

- Nhập 1 tuần và chọn thứ 2; thứ 3; thứ 4 --&gt; Hàng tuần vào thứ 2, T3, T4 sẽ sinh ra check list
- Nhập 2 tuần và chọn thứ 2; thứ 3; thứ 4 thì lịch sẽ sinh ra như sau: 
    - **Tuần 1 (Tuần hiện tại):** Lịch sẽ được sinh ra vào các ngày Thứ 2, Thứ 3 và Thứ 4 của tuần này.
    - **Tuần 2 (Tuần kế tiếp):** Hệ thống sẽ bỏ qua (không sinh lịch).
    - **Tuần 3 (Tức là 2 tuần sau tính từ tuần hiện tại):** Lịch sẽ tiếp tục được sinh ra vào các ngày Thứ 2, Thứ 3 và Thứ 4 của tuần này.
    - Và cứ tiếp tục chu kỳ tuần hoàn lặp lại cách quãng 1 tuần như vậy cho đến khi đạt điều kiện kết thúc.

##### 2.7.3. Tùy biến - Tab theo tháng

Các trường thông tin khác tương tự như các đặt lịch đã mô tả bên trên. Các trường khác khi chọn Tần suất - Tùy biến tháng

<table id="bkmrk-tr%C6%B0%E1%BB%9Dng-lo%E1%BA%A1i-m%C3%B4-t%E1%BA%A3-l%E1%BA%B7-2" style="width: 90%; height: 423.618px;"><thead><tr style="height: 29.7969px;"><th style="width: 25.8258%; height: 29.7969px;">Trường</th><th style="width: 20.7207%; height: 29.7969px;">Loại</th><th style="width: 53.4535%; height: 29.7969px;">Mô tả</th></tr></thead><tbody><tr style="height: 57.7969px;"><td style="width: 25.8258%; height: 57.7969px;">Lặp lại mỗi</td><td style="width: 20.7207%; height: 57.7969px;">Number</td><td style="width: 53.4535%; height: 57.7969px;">Số tháng lặp lại - Nhập số

Yêu cầu: &gt; 0 (nguyên dương)

</td></tr><tr style="height: 30.7969px;"><td style="width: 25.8258%; height: 30.7969px;">Đơn vị</td><td style="width: 20.7207%; height: 30.7969px;">Label</td><td style="width: 53.4535%; height: 30.7969px;">"Tháng"</td></tr><tr style="height: 305.227px;"><td style="width: 25.8258%; height: 305.227px;">Bắt đầu từ</td><td style="width: 20.7207%; height: 305.227px;">Date</td><td style="width: 53.4535%; height: 305.227px;">Ngày bắt đầu tính chu kỳ

Thời gian bắt đầu phải lớn hơn thời gian kết thúc

Hệ thống cung cấp 3 tùy chọn để kiểm soát việc dừng sinh lịch:

- **Không bao giờ:** Lịch sẽ lặp lại liên tục hàng tháng vô thời hạn.
- **Vào ngày \[ Date \]:** Lịch sẽ tự động dừng sinh thêm sau một ngày cụ thể được chỉ định (ví dụ: 28/01/2027).
- **Sau \[ X \] vòng lặp:** Lịch sẽ tự động dừng sau khi đã sinh ra đủ số lần mong muốn (ví dụ: sau 10 lần/10 tháng).

</td></tr></tbody></table>

Ví dụ:

- Hệ thống đang được cài đặt "Lặp lại hàng **1** Tháng" (nghĩa là lịch sẽ diễn ra đều đặn mỗi tháng).
- **Logic lặp:** Với giao diện này, lịch sẽ tự động lấy ngày bắt đầu (ví dụ : "Bắt đầu từ" đang là ngày **02/11/2020**) làm mốc. Do đó, lịch sẽ tự động sinh ra vào **ngày mùng 2** của các tháng tiếp theo.

##### **Lưu ý: Logic lặp theo Tháng (Monthly) với ngày 29, 30, 31**

Nếu bạn thiết lập lịch lặp lại hàng tháng và ngày bắt đầu rơi vào cuối tháng (29, 30, hoặc 31), hệ thống sẽ tự động điều chỉnh cho các tháng không đủ số ngày đó.

- **Trường hợp bắt đầu vào ngày 31 (VD: 31/01):**
    
    
    - Tháng 2 (thường có 28 ngày): Lịch sinh vào ngày **28/02**.
    - Tháng 2 (năm nhuận có 29 ngày): Lịch sinh vào ngày **29/02**.
    - Tháng 4 (có 30 ngày): Lịch sinh vào ngày **30/04**.
    - Tháng 5 (có 31 ngày): Lịch sinh vào đúng ngày **31/05**.
- **Trường hợp bắt đầu vào ngày 30 (VD: 30/01):**
    
    
    - Tháng 2: Tương tự, lùi về **28/02** (hoặc **29/02** nếu năm nhuận).
    - Các tháng khác có 30 hoặc 31 ngày: Lịch vẫn sinh đều đặn vào ngày **30** hàng tháng.

##### 2.7.4. Tùy biến - Tab theo NĂM

Các trường thông tin khác tương tự như các đặt lịch đã mô tả bên trên. Các trường khác khi chọn Tần suất - Tùy biến tháng

<table id="bkmrk-tr%C6%B0%E1%BB%9Dng-lo%E1%BA%A1i-m%C3%B4-t%E1%BA%A3-l%E1%BA%B7-3" style="width: 90%; height: 423.618px;"><thead><tr style="height: 29.7969px;"><th style="width: 25.8258%; height: 29.7969px;">Trường</th><th style="width: 20.7207%; height: 29.7969px;">Loại</th><th style="width: 53.4535%; height: 29.7969px;">Mô tả</th></tr></thead><tbody><tr style="height: 57.7969px;"><td style="width: 25.8258%; height: 57.7969px;">Lặp lại mỗi</td><td style="width: 20.7207%; height: 57.7969px;">Number</td><td style="width: 53.4535%; height: 57.7969px;">Số năm lặp lại - Nhập số

Yêu cầu: &gt; 0 (nguyên dương)

</td></tr><tr style="height: 30.7969px;"><td style="width: 25.8258%; height: 30.7969px;">Đơn vị</td><td style="width: 20.7207%; height: 30.7969px;">Label</td><td style="width: 53.4535%; height: 30.7969px;">"năm"</td></tr><tr style="height: 305.227px;"><td style="width: 25.8258%; height: 305.227px;">Bắt đầu từ</td><td style="width: 20.7207%; height: 305.227px;">Date</td><td style="width: 53.4535%; height: 305.227px;">Ngày bắt đầu tính chu kỳ

Thời gian bắt đầu phải lớn hơn thời gian kết thúc

Hệ thống cung cấp 3 tùy chọn để kiểm soát việc dừng sinh lịch:

- **Không bao giờ:** Lịch sẽ lặp lại liên tục hàng năm vô thời hạn.
- **Vào ngày \[ Date \]:** Lịch sẽ tự động dừng sinh thêm sau một ngày cụ thể được chỉ định (ví dụ: 28/01/2027).
- **Sau \[ X \] vòng lặp:** Lịch sẽ tự động dừng sau khi đã sinh ra đủ số lần mong muốn (ví dụ: sau 10 lần/10 năm).

</td></tr></tbody></table>

Ví dụ:

- Đang cài đặt **"Lặp lại hàng 1 Năm"** (nghĩa là lịch sẽ lặp lại mỗi năm một lần).
- **Logic ngày lặp:** Hệ thống sẽ dựa vào ngày bắt đầu ở mục "Bắt đầu từ" (ví dụ **02/11/2020**) làm mốc. Do đó, lịch sẽ tự động được sinh ra vào đúng **ngày 02 tháng 11** của các năm tiếp theo.

##### **LƯU Ý: Logic lặp theo Năm (Yearly) với ngày 29/02 (Năm nhuận)**

Năm nhuận xảy ra 4 năm một lần (như 2020, 2024, 2028...). Nếu người dùng tạo một lịch lặp lại hàng năm có **ngày bắt đầu chính xác là 29/02**, hệ thống sẽ xử lý đối với những năm không nhuận như sau:

- **Vào những năm không nhuận (VD: 2025, 2026, 2027):** \* Tháng 2 chỉ có 28 ngày.
    
    
    - Hầu hết các hệ thống chuẩn sẽ tự động lùi lịch về ngày **28/02** của các năm đó.
- **Vào năm nhuận tiếp theo (VD: 2028):** \* Lịch sẽ tự động quay trở lại đúng ngày gốc là **29/02**.

## 3.Tổng kết Logic Hệ thống với các tần suất

Để đảm bảo tính nhất quán cho toàn bộ phân hệ Lịch Checklist, dưới đây là bảng tổng hợp logic

<table data-path-to-node="26" id="bkmrk-t%E1%BA%A7n-su%E1%BA%A5t-%C4%90%C6%A1n-v%E1%BB%8B-c%E1%BB%99ng"><thead><tr><td>**Tần suất**</td><td>**Đơn vị cộng (Plus Unit)**</td><td>**Logic biên (Edge Case)**</td><td>**Ghi chú quan trọng**</td></tr></thead><tbody><tr><td><span data-path-to-node="26,1,0,0">**Hàng ngày**</span></td><td><span data-path-to-node="26,1,1,0">+1 Day</span>

<span data-path-to-node="26,1,1,0">(Kết thúc vào - Bắt đầu từ) &lt;= 24 giờ</span>

</td><td><span data-path-to-node="26,1,2,0">Không</span></td><td><span data-path-to-node="26,1,3,0">Check `Duration > 24h` để chặn. disabale trên giao diện</span></td></tr><tr><td><span data-path-to-node="26,2,0,0">**Hàng ngày làm việc**</span></td><td><span data-path-to-node="26,2,1,0">+1 Day (Check Workday)</span></td><td><span data-path-to-node="26,2,2,0">T7, CN, Lễ</span></td><td><span data-path-to-node="26,2,3,0">Chỉ check `Start_Date` để quyết định sinh hay bỏ qua.</span></td></tr><tr><td><span data-path-to-node="26,3,0,0">**Hàng tuần**</span></td><td><span data-path-to-node="26,3,1,0">+1 Week (+7 Days)</span>

<span data-path-to-node="26,3,1,0">(Kết thúc vào - Bắt đầu từ) &lt;= 7 ngày</span>

</td><td><span data-path-to-node="26,3,2,0">Không</span></td><td><span data-path-to-node="26,3,3,0">Tự động detect Thứ.</span>

<span data-path-to-node="26,3,3,0"><span data-path-to-node="16,2,1,0"> ngày</span><span data-path-to-node="16,2,2,0">Thời gian thực hiện không được vượt quá 7 ngày đối với lịch lặp Hàng tuần.</span></span>

</td></tr><tr><td><span data-path-to-node="26,4,0,0">**Hàng tháng**</span></td><td><span data-path-to-node="26,4,1,0">+1 Month</span></td><td><span data-path-to-node="26,4,2,0">Tháng thiếu ngày (28, 30)</span></td><td><span data-path-to-node="26,4,3,0">Auto lùi về ngày cuối tháng (`LastDayOfMonth`).</span>

<span data-path-to-node="26,4,3,0">Thời gian thực hiện không được vượt quá 1 tháng đối với lịch lặp Hàng tháng.</span>

</td></tr><tr><td><span data-path-to-node="26,5,0,0">**Hàng năm**</span></td><td><span data-path-to-node="26,5,1,0">+1 Year</span></td><td><span data-path-to-node="26,5,2,0">Ngày 29/02</span></td><td><span data-path-to-node="26,5,3,0">Auto lùi về 28/02 nếu năm thường.</span></td></tr><tr><td><span data-path-to-node="26,5,0,0">**Tùy biến**</span></td><td><span data-path-to-node="26,5,1,0">  
</span></td><td><span data-path-to-node="26,5,2,0">  
</span></td><td>**Giá trị lặp lại** *(Trường "Lặp lại hàng..."): Cho phép người dùng nhập hoặc chọn số lượng chu kỳ lặp lại.*

*Quy tắc chặn chọn/nhập (Validation Rules): Giới hạn danh sách giá trị (hoặc range nhập liệu) thay đổi động dựa theo "Đơn vị lặp lại":*

<div>*• Nếu đơn vị là "Ngày": DDL Cho phép chọn/nhập từ 1 đến 365 (365 giá trị).*</div><div>*• Nếu đơn vị là "Tuần": DDL Cho phép chọn/nhập từ 1 đến 52 (52 giá trị).*</div><div>*• Nếu đơn vị là "Tháng": DDL Cho phép chọn/nhập từ 1 đến 12 (12 giá trị).* </div><div>*• Nếu đơn vị là "Năm": Trở thành dạng Dropdown List (DDL) và chỉ cho phép chọn giá trị 1 hoặc 2.*</div><div>  
</div></td></tr></tbody></table>

### 3.1. Các trường hợp ẩn hiện giá trị gặp tần suất khi thiết lập Ngày bắt đầu và ngày kết thúc trong các khoảng thời gian. 

  
**Ta có : &lt;Ngày kết thúc vào - Ngày bắt đầu&gt; = n ngày =&gt; Quy ra tuần thì x tuần ; y tháng**  
**Lưu ý:**   
**- Ngày tính đủ 24h**  
**- Tuần tính đủ 7 ngày**  
**- Tháng theo lịch từng tháng tương ứng của ngày bắt đầu**

####  TH1: &lt;Ngày kết thúc - ngày bắt đầu&gt; &lt;=24 giờ , các tần suất hiển thị:

- **• 1 lần**  
    **• Hàng ngày**  
    **• Hàng ngày trong tuần**  
    **• Hàng tuần**  
    **• Hàng tháng**  
    **• Hàng năm**  
    **• Tùy biến**   
     o Trong tuy biến hiển thị đây đủ các giá trị lựa chọn 
    - - - ***Lặp lại ngày*** : 
                - Repeat &lt;nhập /chọn số ngày từ 1-45 &gt; ngày .
                - Ending:  
                    o Never  
                    o Vào : &lt;ngày kế thúc của năm tiếp theo&gt;  
                    o After : &lt;Nhập số&gt; lần (Nguyên dương nhập từ 1- 500)

- - - - *Lặp **lại tuần :*** 
                - Repeat &lt;nhập số tuần từ 1-52&gt; tuần
                - chọn thứ trong tuần
                - Ending: 
                    - Never
                    - Vào ngày: &lt;ngày kế thúc của năm tiếp theo)
                    - After : &lt;Nhập số&gt; tuần
            - Lặp lại tháng : 
                - Repeat &lt;nhập số tháng từ 1-12&gt; tháng
                - Ending  
                    o Never  
                    o Vào ngày: &lt;ngày kế thúc của năm tiếp theo&gt;  
                    o After : &lt;Nhập số&gt; tháng (Nguyên dương nhập từ 1- 500)
            - Lặp lại năm: 
                - Repeat &lt;nhập số tháng từ 1-2&gt; năm
                - Ending 
                    - Never
                    - Vào ngày: &lt;ngày kế thúc của năm tiếp theo)
                    - After : &lt;Nhập số&gt; năm (Nguyên dương nhập từ 1- 500)

####   
TH2: &lt;khoảng thời gian từ ngày kết thúc – ngày bắt đầu&gt; lớn hơn 1 tuần (7 ngày), nhưng nhỏ hơn sô ngày trong tháng (tháng của ngày bắt đầu&gt; (lớn nhất là 31 ngày) các tần suất hiển thị để lựa chọn gồm:

**• 1 lần**  
**• Hàng tháng**  
**• Hàng năm**  
**• Tùy biến**   
o Trong tuy biến hiển thị đây đủ các giá trị lựa chọn  
 Lặp lại ngày :   
• Repeat &lt;nhập /chọn (từ ngày n) &gt; ngày   
• Ending:  
o Never  
o Vào : &lt;ngày kế thúc của năm tiếp theo&gt;  
o After : &lt;Nhập số&gt; lần lặp (Nguyên dương nhập từ 1- 200)

 Lặp lại tuần :   
• Repeat &lt;nhập số tuần từ 1-52&gt; tuần   
• Ẩn cụm chọn thứ trong tuần  
• Ending:   
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Nguyên dương nhập từ 1- 500)

 Lặp lại tháng :   
• Repeat &lt;nhập số tháng từ 1-12&gt; tháng  
• Ending  
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Nguyên dương nhập từ 1- 500)

 Lặp lại năm:   
• Repeat &lt;nhập số tháng từ 1-2&gt; năm  
• Ending  
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Nguyên dương nhập từ 1- 500)

### TH3: &lt;khoảng thời gian từ ngày kết thúc – ngày bắt đầu&gt; lớn hơn 24 giờ và nhỏ hơn 1 tuần (7 ngày), các tần suất hiển thị để lựa chọn gồm:

**• 1 lần**  
**• Hàng tuần**  
**• Hàng tháng**  
**• Hàng năm**  
**• Tùy biến**   
o Trong tuy biến hiển thị đây đủ các giá trị lựa chọn  
 Lặp lại ngày :   
• Repeat &lt;nhập /chọn (từ ngày n) &gt; ngày   
• Ending:  
o Never  
o Vào : &lt;ngày kế thúc của năm tiếp theo&gt;  
o After : &lt;Nhập số&gt; lần lặp(Nguyên dương nhập từ 1- 500)

 Lặp lại tuần :   
• Repeat &lt;nhập số tuần từ 1-52&gt; tuần   
• Ẩn cụm chọn thứ trong tuần  
• Ending:   
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Nguyên dương nhập từ 1- 500)

 Lặp lại tháng :   
• Repeat &lt;nhập số tháng từ 1-12&gt; tháng  
• Ending  
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Nguyên dương nhập từ 1- 500)

 Lặp lại năm:   
• Repeat &lt;nhập số tháng từ 1-2&gt; năm  
• Ending  
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Nguyên dương nhập từ 1- 500)

#### TH4: &lt;khoảng thời gian từ ngày kết thúc – ngày bắt đầu&gt; lớn hơn 1 tuần (7 ngày) và nhỏ hơn 1 tháng (Tính đủ số ngày theo tháng hiện tại có cả vắt ngày, tối đa 31 ngỳa), các tần suất hiển thị để lựa chọn gồm:

**• 1 lần**  
**• Hàng tháng**  
**• Hàng năm**  
**• Tùy biến**   
o Trong tuy biến hiển thị đây đủ các giá trị lựa chọn  
 Lặp lại ngày :   
• Repeat &lt;nhập /chọn (từ ngày n) &gt; ngày   
• Ending:  
o Never  
o Vào : &lt;ngày kế thúc của năm tiếp theo&gt;  
o After : &lt;Nhập số&gt; lần lặp(Nguyên dương nhập từ 1- 500)

 Lặp lại tuần :   
• Repeat &lt;nhập số tuần từ x-52&gt; tuần   
• Ẩn cụm chọn thứ trong tuần  
• Ending:   
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Nguyên dương nhập từ 1- 500)

 Lặp lại tháng :   
• Repeat &lt;nhập số tháng từ 1-12&gt; tháng  
• Ending  
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Nguyên dương nhập từ 1- 500)

 Lặp lại năm:   
• Repeat &lt;nhập số tháng từ 1-2&gt; năm  
• Ending  
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Nguyên dương nhập từ 1- 500)

#### TH5: &lt;khoảng thời gian từ ngày kết thúc – ngày bắt đầu&gt; lớn hơn hơn 1 tháng (Tính đủ số ngày theo tháng hiện tại có cả vắt ngày), nhỏ hơn 1 năm, các tần suất hiển thị để lựa chọn gồm:

**• 1 lần**  
**• Hàng năm**  
**• Tùy biến**   
o Trong tuy biến hiển thị đây đủ các giá trị lựa chọn  
 Lặp lại ngày  ẨN CỤM  
 Lặp lại tuần :   
• Repeat &lt;nhập số tuần từ x-52&gt; tuần   
• Ẩn cụm chọn thứ trong tuần  
• Ending:   
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Chặn nhập tối đa 500)  
 Lặp lại tháng :   
• Repeat &lt;nhập số tháng từ y-12&gt; tháng  
• Ending  
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Chặn nhập tối đa 500)  
 Lặp lại năm:   
• Repeat &lt;nhập số tháng từ 1-2&gt; năm  
• Ending  
o Never  
o Vào ngày: &lt;ngày kế thúc của năm tiếp theo)  
o After : &lt;Nhập số&gt; lần lặp (Nguyên dương nhập từ 1- 500)

#### TH6: &lt;khoảng thời gian từ ngày kết thúc – ngày bắt đầu&gt; lớn hơn hơn 1 năm, các tần suất hiển thị để lựa chọn gồm:

• 1 lần

## 4. Lưu ý về múi giờ khi đặt lịch

##### 4.1 các câp time zone trong hệ thống

<table border="1" cellpadding="0" cellspacing="0" class="MsoTableGrid" id="bkmrk-c%E1%BA%A5p-%C4%90%E1%BB%91i-t%C6%B0%E1%BB%A3ng-m%E1%BB%A5c-%C4%91%C3%AD" style="width: 481.7pt; border-collapse: collapse; border: none;"><tbody><tr><td style="width: 77.75pt; border: solid windowtext 1.0pt; padding: 0cm 5.4pt 0cm 5.4pt;">**<span style="font-family: 'Times New Roman', serif;">Cấp</span>**

</td><td style="width: 148.8pt; border: solid windowtext 1.0pt; border-left: none; padding: 0cm 5.4pt 0cm 5.4pt;">**<span style="font-family: 'Times New Roman', serif;">Đối tượng</span>**

</td><td style="width: 9.0cm; border: solid windowtext 1.0pt; border-left: none; padding: 0cm 5.4pt 0cm 5.4pt;">**<span style="font-family: 'Times New Roman', serif;">Mục đích</span>**

</td></tr><tr><td style="width: 77.75pt; border: solid windowtext 1.0pt; border-top: none; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">System</span>

</td><td style="width: 148.8pt; border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Hệ thống</span>

</td><td style="width: 9.0cm; border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Lưu DB (UTC)</span>

</td></tr><tr><td style="width: 77.75pt; border: solid windowtext 1.0pt; border-top: none; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Tenant</span>

</td><td style="width: 148.8pt; border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Công ty / tổ chức</span>

</td><td style="width: 9.0cm; border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Timezone mặc định, cho phép sửa</span>

</td></tr><tr><td style="width: 77.75pt; border: solid windowtext 1.0pt; border-top: none; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Site</span>

</td><td style="width: 148.8pt; border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Địa điểm thực hiện checklist</span>

</td><td style="width: 9.0cm; border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Timezone thực tế của địa điểm, lấy theo location</span>

</td></tr><tr><td style="width: 77.75pt; border: solid windowtext 1.0pt; border-top: none; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">User</span>

</td><td style="width: 148.8pt; border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Người dùng</span>

</td><td style="width: 9.0cm; border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 5.4pt 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Timezone cá nhân, khi tạo tự động lấy theo timze tenant</span>

<span style="font-family: 'Times New Roman', serif;">Cho phép sửa</span>

</td></tr></tbody></table>

##### 4.2. Time zone khi đặt lịch

<table border="1" cellpadding="0" cellspacing="0" class="MsoTableGrid" id="bkmrk-option-%C3%9D-ngh%C4%A9a-v%C3%AD-d%E1%BB%A5" style="border-collapse: collapse; border: none; width: 106.296%;"><tbody><tr><td class="align-center" style="width: 43.4003%; border: 1pt solid windowtext; padding: 0cm 5.4pt;">**<span style="font-family: 'Times New Roman', serif;">Giá trị lựa chọn khi đặt lịch  
Tiếng việt /Tiếng Anh</span>**

</td><td class="align-center" style="width: 26.8315%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt;">**<span style="font-family: 'Times New Roman', serif;">Ý nghĩa</span>**

</td><td class="align-center" style="width: 29.6754%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt;" valign="top">**<span style="font-family: 'Times New Roman', serif;">Ví dụ</span>**

</td></tr><tr><td style="width: 43.4003%; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Mặc định múi giờ theo đặt lịch / Schedule timezone</span>

<span style="font-family: 'Times New Roman', serif; color: #e03e2d;">(MỚI - CHƯA LÀM TRONG SPRINT NÀY)</span>

</td><td style="width: 26.8315%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Lịch theo timezone của schedule</span>

</td><td style="width: 29.6754%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;" valign="top"><span style="font-family: 'Times New Roman', serif;">Cố định theo thời gian của đặt lịch.</span>

<span style="font-family: 'Times New Roman', serif;">Ví du: Đặt lịch lúc GMT+ 7 lúc 08 giờ hàng ngày </span>

<span style="font-family: 'Times New Roman', serif;">T</span><span style="font-family: 'Times New Roman', serif;">hì người thực hiện dù ở timezone profile khác nhau hoặc timzone device khác nhau -&gt; cứ GMT+ 7 sẽ hiển thị check list để thực hiện. </span>

<span style="font-family: 'Times New Roman', serif;">Một nhân viên ở Việt Nam sẽ thấy lịch báo lúc 8:00 sáng (local timezone). Nhưng một nhân viên đang ở Nhật Bản (GMT+9) sẽ thấy lịch báo lúc 10:00 sáng (giờ địa phương của Nhật). Cả hai đều nhận check list vào cùng một thời điểm thực tế.</span>

</td></tr><tr><td style="width: 43.4003%; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Tự động chọn múi giờ theo địa đỉểm/ Site timezone</span>

<span style="font-family: 'Times New Roman', serif; color: #e03e2d;">(MỚI - CHƯA LÀM TRONG SPRINT NÀY)</span>

</td><td style="width: 26.8315%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Lịch theo timezone của địa điểm</span>

</td><td style="width: 29.6754%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;" valign="top"><span style="font-family: 'Times New Roman', serif;">Ví dụ 1 địa đỉểm ở việt Nam GMT +7 và thời gian thực hiện 9:00 sáng</span>

<span style="font-family: 'Times New Roman', serif;">Nhân viên đi công tác ÚC (Múi giờ là GMT +10) --&gt; Hệ thống sẽ trả ra lịch cho nhân viên lúc 9:00 sáng (Gmt +7) tại Việt Nam theo giờ của địa điểm </span>

</td></tr><tr><td style="width: 43.4003%; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Tự động chọn múi giờ theo user hiện tại/ User timezone</span>

<span style="font-family: 'Times New Roman', serif; color: #e03e2d;">(LÀM MỚI -LÀM TRONG SPRINT NÀY)</span>

</td><td style="width: 26.8315%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;"><span style="font-family: 'Times New Roman', serif;">Lịch theo time zone của người thực hiện (Lấy theo múi giờ được thiết lập cứng trong **hồ sơ (profile)** của từng nhân viên.)</span>

</td><td style="width: 29.6754%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;" valign="top"><span style="font-family: 'Times New Roman', serif;">Ví dụ: Thiết lập chọn lấy theo múi giờ của user hiện tại, thời gian thực hiên là 9:00 Am hàng ngày</span>

<span style="font-family: 'Times New Roman', serif;">Thì Nhân viên A cài profile là giờ Việt Nam sẽ nhận lúc 9:00 sáng VN. </span>

<span style="font-family: 'Times New Roman', serif;">Nhân viên B cài profile giờ Nhật Bản sẽ nhận lúc 8:00 sáng Nhật Bản. </span>

<span style="font-family: 'Times New Roman', serif;">--&gt; Hai người sẽ làm ở hai thời điểm thực tế lệch nhau 2 tiếng</span>

<span style="color: #e03e2d;">**<span style="font-family: 'Times New Roman', serif;">Lưu ý: Bổ sung tính năng ; Khi lệch timezone profile user và timezone device thì sẽ hỏi để xác nhận cập nhật. </span>**</span>

</td></tr></tbody></table>

## 5. Màn hình Chi tiết Lịch (View Mode)

<table data-path-to-node="11" id="bkmrk-t%C3%AAn-tr%C6%B0%E1%BB%9Dng-%2F-n%C3%BAt-lo%E1%BA%A1"><thead><tr><td>**Tên trường / Nút**</td><td>**Loại hiển thị**</td><td>**Mô tả giao diện (UI)**</td><td>**Logic xử lý (System/Business Logic)**</td></tr></thead><tbody><tr><td><span data-path-to-node="11,1,0,0">**Header**</span></td><td><span data-path-to-node="11,1,1,0">**Nút Action**</span></td><td>\- Nút "Tạm ngừng": Style Danger/Warning.

  
\- Nút "Sửa": Style Primary.

  
\- Mã lịch: Hiển thị ID dạng text (Read-only).

</td><td>\- **Tạm ngừng:** Update `status` = `Inactive` (hoặc `Paused`). Ngăn chặn sinh ra checklist mới từ lịch này.

  
\- **Sửa:** Mở lại form Tạo mới (Màn hình 2) nhưng bind dữ liệu cũ vào các trường để user chỉnh sửa.

</td></tr><tr><td><span data-path-to-node="11,2,0,0">**Thông tin chính**</span></td><td><span data-path-to-node="11,2,1,0">**Tiêu đề &amp; Trạng thái**</span></td><td>\- Tiêu đề: Font to, in đậm.

  
\- Trạng thái: Badge màu (Xanh: Active, Xám: Inactive).

</td><td>\- Hiển thị đúng tên lịch đã lưu.

  
\- Mapping trạng thái từ DB ra màu sắc tương ứng.

</td></tr><tr><td><span data-path-to-node="11,3,0,0">**Chi tiết**</span></td><td><span data-path-to-node="11,3,1,0">**Các trường thông tin**</span></td><td>\- Hiển thị dạng Label: Value.

  
\- Các trường: Biểu mẫu, Người thực hiện, Địa điểm, Múi giờ...

</td><td>\- Tất cả đều ở trạng thái **Read-only** (Chỉ xem).

  
\- Dữ liệu Người thực hiện: Nếu &gt; 5 người, hiển thị Avatar stack (+5) để tiết kiệm diện tích.

</td></tr><tr><td><span data-path-to-node="11,4,0,0">**Cấu hình**</span></td><td><span data-path-to-node="11,4,1,0">**Tần suất &amp; Deadline**</span></td><td>\- Tần suất: Hiển thị text.

  
\- Hoàn thành sau hạn: Text "Cho phép" / "Không".

</td><td><span data-path-to-node="11,4,3,0">- Hiển thị cấu hình hiện tại của lịch.</span></td></tr></tbody></table>