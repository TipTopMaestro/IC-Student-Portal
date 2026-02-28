# IC Student Portal — Real API Integration Plan

## Goal
Replace all hardcoded mock data in admin and student pages with real backend API calls.

## Backend
- API: `https://dnsc-systems-api.onrender.com` (Django REST, proxied via Vite)
- Auth: JWT (access + refresh tokens)
- Response wrapper: `{ status_code, message, data: {...}, errors }`

---

## Phase 1: Admin Pages ✅ COMPLETED

### 1. Admin Students → `/api/v1/students/` ✅
- [x] List students with server-side search + pagination
- [x] View student detail modal
- [x] Skeleton loading on pagination
- [x] Client-side year/course filters

### 2. Admin Events → `/api/v1/institute-attendance-event/` ✅
- [x] List events with correct `event_name` field mapping
- [x] Status filter (all/upcoming/ongoing/completed)
- [x] Date-based status calculation
- [x] Modern list UI with academic year/semester

### 3. Admin Announcements ✅
- [x] Graceful "Coming Soon" state (backend endpoint `/api/v1/announcements/` doesn't exist)
- [x] UI ready for when backend adds the endpoint

### 4. Admin Attendance → `/api/v1/attendance-records/` ✅
- [x] Per-student check-in/out table with morning/afternoon times
- [x] Search by student name, filter by date
- [x] Upload attendance via `import_attendance_records/`
- [x] Detail modal with fines and fee status

### 5. Admin Dashboard ✅
- [x] Real student/event/attendance counts from API
- [x] Recent events from `/api/v1/institute-attendance-event/`
- [x] Announcements section with "Coming Soon" placeholder

---

## Phase 2: Student Pages ✅ COMPLETED

### 6. Student Dashboard ✅
- [x] Real events from `/api/v1/institute-attendance-event/`
- [x] Real attendance stats filtered by student ID
- [x] "Coming Soon" for announcements (no backend endpoint)

### 7. Student Attendance → `/api/v1/attendance-records/` ✅
- [x] Per-day records with morning/afternoon check-in/out
- [x] Filtered by logged-in student's ID
- [x] Skeleton loading, pagination

### 8. Student Announcements ✅
- [x] Clean "Coming Soon" page (backend endpoint doesn't exist)

### 9. Student Calendar → `/api/v1/institute-attendance-event/` ✅
- [x] Real events displayed on interactive calendar grid
- [x] Events span across date ranges (start_date → end_date)
- [x] Event list with status badges and date-based status calculation

---

## Phase 3: Lower Priority

### 10. Student Submissions — assess backend needs
### 11. Update dev notes to current architecture
### 12. Tree-shake mock service from production build

---

## Approach for each page
1. Create/extend service functions (in `services/`) with proper API calls
2. Replace hardcoded data in the view with API calls + loading/error states
3. Test that the page works with real data
4. User reviews before committing

## Notes
- All API URLs must use absolute paths (leading slash: `/api/v1/...`)
- Do NOT overwrite `authStore.user` from view components
- Do NOT auto-commit — user reviews and commits manually
