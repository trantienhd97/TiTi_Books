# INSPECTION LOGIC - QUICK REFERENCE

## 📊 8 LOẠI LOGIC

### ✅ Logic cho User Actions

| # | Logic | Icon | Khi nào trigger | Hành động |
|---|-------|------|-----------------|-----------|
| 1 | **Bắt buộc thêm hành động** | 📋✓ | Chọn đáp án "Không đạt" | User PHẢI tạo task mới |
| 2 | **Bắt buộc bằng chứng** | 📷📝 | Chọn "Có sự cố" | Bắt buộc upload ảnh + ghi chú |
| 3 | **Tự tạo hành động** ⭐ | ✨⚙️ | Chọn "Kém" | Hệ thống TỰ ĐỘNG tạo task |
| 4 | **Cảnh báo** | ⚠️ | Nhập số gần ngưỡng | Hiển thị warning banner |

### 📉 Logic cho Scoring

| # | Logic | Icon | Khi nào trigger | Scoring Impact |
|---|-------|------|-----------------|----------------|
| 5 | **Trừ điểm Trang** | 📄❌ | Vi phạm critical trang | Page score = 0 |
| 6 | **Trừ điểm Phân đoạn** | 📑❌ | Vi phạm critical section | Section score = 0 |
| 7 | **Trừ điểm Kiểm tra** | 📋❌ | Vi phạm pháp luật | **ENTIRE** inspection = 0 |
| 8 | **Không tính điểm** | ➖ | Câu hỏi thông tin | Question not counted (N/A) |

---

## 🎯 ÁP DỤNG

### ✅ Có Logic (4 loại question):
- Chọn 1 đáp án (SINGLE_CHOICE)
- Chọn nhiều đáp án (MULTIPLE_CHOICE)
- Nhập chữ (TEXT)
- Nhập số (NUMBER)

### ❌ Không có Logic (4 loại question):
- Đa phương tiện (IMAGE/MEDIA)
- Ngày giờ (DATETIME)
- Hướng dẫn (INSTRUCTION)
- Xác định vị trí (LOCATION)

---

## 🔧 OPERATORS

| Operator | Symbol | Use case |
|----------|--------|----------|
| EQUALS | = | answer == "Kém" |
| NOT_EQUALS | ≠ | answer != "Tốt" |
| GREATER_THAN | > | number > 30 |
| LESS_THAN | < | number < 5 |
| GREATER_OR_EQUAL | ≥ | number >= 10 |
| LESS_OR_EQUAL | ≤ | number <= 100 |
| BETWEEN | [a,b] | 5 <= number <= 10 |
| NOT_BETWEEN | !(a,b) | number < 5 OR number > 10 |
| CONTAINS | ∋ | text contains "fail" |
| NOT_CONTAINS | ∌ | text not contains "pass" |

---

## 💡 EXAMPLES

### Example 1: Chất lượng sản phẩm
```
Question: "Chất lượng sản phẩm?"
Options: Tốt (101), Trung bình (102), Kém (103)

IF: User chọn "Kém" (103)
THEN:
  ✅ Tự tạo hành động: "Khắc phục sản phẩm"
  ✅ Bắt buộc bằng chứng: Ảnh + Ghi chú
  ✅ Trừ điểm Trang: Page score = 0
```

### Example 2: Nhiệt độ
```
Question: "Nhiệt độ phòng (°C)?"

IF: number > 30
THEN:
  ✅ Cảnh báo: "Nhiệt độ vượt ngưỡng"
  ✅ Tự tạo hành động: "Kiểm tra điều hòa"
```

### Example 3: Giấy phép
```
Question: "Có giấy phép hoạt động?"
Options: Có (201), Không (202)

IF: User chọn "Không" (202)
THEN:
  ✅ Bắt buộc thêm hành động: Tạo task khắc phục
  ✅ Trừ điểm Kiểm tra: ENTIRE inspection = 0
```

---

## 🚀 PHASE 1 IMPLEMENTATION

### Config từ BE:
```json
{
  "questionId": 50,
  "operatorId": 1,  // EQUALS
  "triggerAnswerOptionIds": [103],  // "Kém"
  
  "autoCreateTask": true,
  "taskName": "Khắc phục sản phẩm kém",
  "assignToUserIds": [5],
  
  "requireEvidence": true,
  "requirePhoto": true,
  "requireNote": true,
  
  "zeroPageScore": true
}
```

### Client Flow:
```
User chọn "Kém"
    ↓
Evaluate conditionals (local)
    ↓
IF matched:
    ├─ Create task (instant)
    ├─ Set require flags
    ├─ Zero page score
    └─ Update UI (real-time)
    ↓
Save to DB
    ↓
Fire API (async)
```

---

## 📝 KEY POINTS

✅ **8 loại logic** có thể combine

✅ **Priority:** ZERO_INSPECTION > ZERO_SECTION > ZERO_PAGE > NOT_SCORED

✅ **Real-time:** Phase 1 evaluate ngay, không chờ BE

✅ **Config-driven:** All logic từ config, client chỉ execute

✅ **Task auto-create** là logic type #3 - quan trọng nhất

---

**Full Details:** `.agent/docs/INSPECTION_LOGIC_SYSTEM.md`
