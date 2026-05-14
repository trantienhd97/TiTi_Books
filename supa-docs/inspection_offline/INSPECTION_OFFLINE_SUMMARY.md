# INSPECTION OFFLINE - QUICK SUMMARY

## 🎯 2 PHASES STRATEGY

### 📌 Phase 1: Local Logic + Fire-and-Forget API (2-3 Weeks)

**Mục tiêu:**
- ✅ Instant feedback (tính điểm ngay lập tức)
- ✅ Lưu data vào local DB
- ✅ Call API lưu lên BE nhưng KHÔNG CHỜ response
- ✅ User thoát/vào lại không mất data

**Flow:**
```
User Input → Local Calc (Instant) → Update UI + Save DB + Fire API (không chờ)
```

**Deliverables:**
- Drift database setup (inspections, configs, pending_api_calls tables)
- 5 services: Scoring, Validation, Conditional, Persistence, FireAndForget
- Bloc pattern cho state management
- Clone tất cả widgets sang `inspection_local/`
- Real-time score display
- Background retry cho failed API calls

**Timeline:**
- Week 1: Infrastructure (DB, models, services, bloc)
- Week 2: Widgets & Integration (clone, adapt, auto-save)
- Week 3: Testing & Polish (unit tests, retry logic, UX)

---

### 📌 Phase 2: Full Offline + Batch Sync (2-3 Weeks)

**Mục tiêu:**
- ✅ Hoàn toàn offline-capable
- ✅ Smart batch sync
- ✅ Conflict resolution
- ✅ Network-aware behavior

**Flow:**
```
Offline → Queue changes → Detect network → Batch sync → Resolve conflicts
```

**Deliverables:**
- Enhanced DB schema (change_queue, sync_metadata, file_upload_queue)
- InspectionSyncService với conflict resolution
- Network monitoring (auto-sync when online)
- Offline indicator + Sync status UI
- Smart sync strategy (priority queue, batch)
- File upload queue

**Timeline:**
- Week 1: Sync infrastructure (DB tables, sync service, network monitor)
- Week 2: UI & UX (offline indicator, sync status, conflict UI)
- Week 3: Advanced features & testing (smart sync, file queue, E2E tests)

---

## 🗂️ DATABASE SCHEMA

### Phase 1 Tables:
```sql
inspections           -- Cache inspection data (JSON)
inspection_configs    -- Cache config từ BE
pending_api_calls     -- Track fire-and-forget API calls
```

### Phase 2 Adds:
```sql
change_queue          -- Queue tất cả changes cho batch sync
sync_metadata         -- Track sync status
file_upload_queue     -- Queue file uploads
```

---

## 🔑 KEY DECISIONS

### ✅ SỬ DỤNG DATABASE LOCAL
**Lý do:**
1. User thoát/vào lại → không mất data
2. App crash → data vẫn safe
3. Network fail → data vẫn được lưu
4. Foundation cho Phase 2

**Performance:**
- SQLite insert: ~1-2ms
- Batch 100 records: ~5-10ms
- Network call: 100-500ms
- **→ DB nhanh hơn 100x so với network**

### ✅ FIRE-AND-FORGET PATTERN (Phase 1)
```dart
// Update UI ngay
bloc.add(UpdateAnswer(...));

// Save DB background
unawaited(db.save(inspection));

// Fire API (không chờ)
unawaited(api.update(inspection)
  .then((_) => removeFromPending())
  .catchError((_) => keepForRetry())
);
```

**Benefits:**
- Zero wait time cho user
- Data luôn được persist
- Auto-retry nếu API fail
- Smooth UX

### ✅ BLOC PATTERN
**Single Source of Truth:**
```
DB (Persistent) 
  ↓ Load on init
Bloc State (Memory) 
  ↓ UI reads
User changes 
  ↓ Update immediate
Save to DB (Background)
```

---

## 📊 PHASE 1 vs PHASE 2

| Feature | Phase 1 | Phase 2 |
|---------|---------|---------|
| **Network Required** | Yes | No |
| **Instant Feedback** | ✅ | ✅ |
| **Data Persistence** | ✅ DB | ✅ DB |
| **API Strategy** | Fire-forget | Batch sync |
| **Offline Work** | Partial | Full |
| **Conflict Resolution** | Auto-retry | Smart resolver |
| **Complexity** | Medium | High |
| **Dev Time** | 2-3 weeks | 2-3 weeks |

---

## 🚀 GETTING STARTED

### Step 1: Backend Requirements
Backend cần cung cấp:

1. **Get Config API:**
Dùng API lấy chi tiết questionnaire hiện tại nhưng thêm tham số `IsIncludeConditional=true` để lấy đầy đủ cấu hình scoring, validation và conditionals.

```
GET /api/v1/questionnaires/{id}?IsIncludeConditional=true

Response: {
  // Bao gồm questionnaire details + full config rules
  "scoringRules": [...],
  "validationRules": [...],
  "conditionalRules": [...]
}
```

2. **Existing Update Endpoints:**
- Keep current update APIs
- Phase 1 sẽ call chúng theo fire-and-forget pattern

3. **Batch Sync Endpoint (Phase 2 only):**
```
POST /api/v1/inspections/{id}/sync

Request: {
  "changes": [...]
}

Response: {
  "synced": true,
  "conflicts": [...],
  "updatedInspection": {...}
}
```

### Step 2: Frontend Implementation

**Phase 1 - Week 1:**
```bash
# 1. Add dependencies
flutter pub add drift drift_dev build_runner
flutter pub add expressions  # For formula parsing

# 2. Create database
packages/supa_work/lib/database/
  ├── database.dart
  ├── tables.dart
  └── daos.dart

# 3. Create config models
packages/supa_work/lib/pages/inspection_local/models/
  ├── inspection_local_config.dart
  ├── scoring_rule.dart
  ├── validation_rule.dart
  └── conditional_rule.dart

# 4. Create services
packages/supa_work/lib/pages/inspection_local/services/
  ├── inspection_local_scoring_service.dart
  ├── inspection_local_validation_service.dart
  ├── inspection_local_conditional_service.dart
  ├── inspection_local_persistence_service.dart
  └── inspection_fire_and_forget_service.dart

# 5. Create bloc
packages/supa_work/lib/pages/inspection_local/blocs/
  ├── inspection_local_bloc.dart
  ├── inspection_local_event.dart
  └── inspection_local_state.dart
```

**Phase 1 - Week 2:**
```bash
# Clone widgets
packages/supa_work/lib/pages/inspection_local/widgets/
  ├── inspection_local_answer_page.dart
  ├── information_answer_local/
  └── inspection_answer_local/
      └── inspection_question_types_local/
```

**Phase 1 - Week 3:**
```bash
# Testing & Polish
packages/supa_work/test/inspection_local/
  ├── services/
  ├── blocs/
  └── widgets/
```

---

## 📝 QUICK CHECKLIST

### Phase 1 Essentials:
- [ ] Drift database setup
- [ ] Config models (ScoringRule, ValidationRule, ConditionalRule)
- [ ] 5 core services
- [ ] Bloc pattern
- [ ] Clone all widgets
- [ ] Real-time score display
- [ ] Fire-and-forget API
- [ ] Background retry
- [ ] Unit & integration tests

### Phase 2 Essentials:
- [ ] Enhanced DB schema
- [ ] Sync service
- [ ] Network monitor
- [ ] Conflict resolver
- [ ] Offline indicator
- [ ] Sync status UI
- [ ] Smart sync strategy
- [ ] File upload queue

---

## 💡 BEST PRACTICES

### 1. Database Operations
```dart
// ✅ Save in background
unawaited(db.save(inspection));

// ✅ Batch operations
await db.batch((batch) {
  batch.insert(...);
  batch.insertAll(...);
});

// ✅ Use indexes
CREATE INDEX idx_inspection_id ON inspections(id);
```

### 2. Optimistic Updates
```dart
// Update UI first (instant)
state = state.copyWith(score: newScore);

// Then persist (background)
unawaited(db.save(inspection));
unawaited(api.update(inspection));
```

### 3. Error Handling
```dart
try {
  await db.save(inspection);
} catch (e) {
  logger.error('DB save failed: $e');
  await Future.delayed(Duration(seconds: 1));
  await db.save(inspection); // Retry once
}
```

---

## 📚 REFERENCES

- Full Analysis: `.agent/docs/INSPECTION_OFFLINE_ANALYSIS.md`
- Current Inspection: `packages/supa_work/lib/pages/inspection/inspection_answer_page.dart`
- Drift Documentation: https://drift.simonbinder.eu/
- Bloc Pattern: https://bloclibrary.dev/

---

**Created:** 2026-01-26  
**Version:** 1.0  
**Status:** Ready for Implementation
