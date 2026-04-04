# IC Student Portal - Action Plan

> **Created:** April 4, 2026  
> **Status:** Active Development Roadmap  
> **Current Completion:** ~93%

---

## Executive Summary

This action plan addresses 10 major gaps identified in the IC Student Portal codebase. The project is 93% complete with strong foundations in authentication, routing, and API integration. Key remaining work focuses on:

1. **Announcements feature** (blocking both portals)
2. **Testing & validation** (quality assurance)
3. **Admin CRUD operations** (administrative workflows)
4. **Code quality improvements** (maintainability)

**Estimated effort:** 2-3 weeks for priority items, 4-6 weeks for full completion

---

## Phase 1: Critical Path (Week 1) 🔴

### Task 1.1: Implement Announcements Feature

**Priority:** 🔴 BLOCKING  
**Complexity:** Medium  
**Estimated Time:** 3-5 days  
**Status:** Waiting on backend endpoint confirmation

#### Why It Matters
Core feature missing from both student and admin portals. Currently shows "Coming Soon" placeholder, blocking user communication needs.

#### Prerequisites
- [ ] Verify `/api/v1/announcements/` endpoint exists with backend team
- [ ] Confirm API response format (pagination, fields, permissions)

#### Subtasks

**Backend Verification (0.5 day)**
- [ ] Test GET `/api/v1/announcements/` with Postman/curl
- [ ] Document response structure
- [ ] Verify pagination parameters (page, per_page)
- [ ] Check permission requirements (student vs admin)

**Service Layer (0.5 day)**
- [ ] Update `src/services/announcementService.js`
  - Fix response parsing for backend format
  - Add error handling for 404/403/500
  - Test with real API calls

**Student View (1 day)**
- [ ] Replace "Coming Soon" in `src/views/student/AnnouncementsView.vue`
- [ ] Add announcement list with:
  - Title, content preview (truncated)
  - Publish date, author
  - Read more modal
- [ ] Add pagination controls
- [ ] Add loading skeleton

**Admin View (1.5 days)**
- [ ] Replace "Coming Soon" in `src/views/admin/AnnouncementsView.vue`
- [ ] Add announcement management table
- [ ] Create "New Announcement" modal with form:
  - Title (required, max 200 chars)
  - Content (required, rich text or textarea)
  - Publish date (optional, defaults to now)
  - Target audience (all students, specific programs)
- [ ] Add edit/delete actions
- [ ] Add confirmation dialogs for destructive actions

**Testing & Polish (0.5 day)**
- [ ] Test create/edit/delete flows
- [ ] Test pagination
- [ ] Verify permission checks (admin-only access)
- [ ] Add success/error toasts

#### Files to Modify
```
src/services/announcementService.js
src/views/student/AnnouncementsView.vue
src/views/admin/AnnouncementsView.vue
```

#### Success Criteria
- [ ] Students can view announcements list
- [ ] Admins can create, edit, delete announcements
- [ ] Pagination works correctly
- [ ] No console errors
- [ ] Backend integration confirmed working

#### Risks & Blockers
- **Risk:** Backend endpoint doesn't exist → Use mock data temporarily
- **Risk:** Permission errors → Coordinate with backend team on role requirements

---

### Task 1.2: Test & Fix Profile Update

**Priority:** 🟡 IMPORTANT  
**Complexity:** Low  
**Estimated Time:** 1 day  
**Status:** Ready to start

#### Why It Matters
User-facing feature exists but is untested. Could have bugs affecting user experience.

#### Subtasks

**Manual Testing (0.5 day)**
- [ ] Test PATCH `/api/v1/me/` endpoint manually
  ```bash
  curl -X PATCH https://dnsc-systems-api.onrender.com/api/v1/me/ \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"first_name":"John","last_name":"Doe","email":"john@example.com"}'
  ```
- [ ] Document accepted fields and validation rules
- [ ] Test edge cases:
  - Empty fields
  - Invalid email format
  - Very long strings (>255 chars)
  - Special characters in names

**Component Testing (0.25 day)**
- [ ] Update `src/views/student/ProfileView.vue`:
  - Verify form submission calls `updateProfile()`
  - Check error display for 400/422 responses
  - Confirm success message appears
  - Ensure profile reloads after update

**Error Handling Improvements (0.25 day)**
- [ ] Update `src/services/studentService.js`:
  - Parse validation errors from backend
  - Return field-specific errors
  - Handle network failures gracefully

#### Files to Modify
```
src/views/student/ProfileView.vue (lines 108-112, 292-320)
src/services/studentService.js (lines 65-88)
```

#### Success Criteria
- [ ] Profile update works end-to-end
- [ ] Validation errors display correctly
- [ ] Success message shows after save
- [ ] Profile data refreshes
- [ ] Comment on line 1 of ProfileView.vue removed

#### Test Cases
| Case | Input | Expected |
|------|-------|----------|
| Valid update | All fields valid | Success toast, data saves |
| Invalid email | `invalid-email` | Error: "Invalid email format" |
| Empty required | `first_name: ""` | Error: "First name required" |
| Network failure | Disconnect API | Error: "Connection failed" |

---

## Phase 2: Quality & Validation (Week 2) 🟡

### Task 2.1: Add Client-Side Form Validation

**Priority:** 🟡 IMPORTANT  
**Complexity:** Medium  
**Estimated Time:** 2-3 days

#### Why It Matters
Improves UX with instant feedback, reduces unnecessary API calls, prevents backend errors.

#### Implementation Strategy

**Create Validation Composable (1 day)**

Create `src/composables/useValidation.js`:

```javascript
export function useValidation() {
  const required = (value) => {
    return value?.trim() ? true : 'This field is required'
  }
  
  const email = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !value || regex.test(value) ? true : 'Invalid email format'
  }
  
  const minLength = (min) => (value) => {
    return !value || value.length >= min ? true : `Minimum ${min} characters`
  }
  
  const maxLength = (max) => (value) => {
    return !value || value.length <= max ? true : `Maximum ${max} characters`
  }
  
  const fileSize = (maxMB) => (file) => {
    const maxBytes = maxMB * 1024 * 1024
    return !file || file.size <= maxBytes ? true : `File must be under ${maxMB}MB`
  }
  
  const fileType = (allowedTypes) => (file) => {
    if (!file) return true
    return allowedTypes.includes(file.type) ? true : `Only ${allowedTypes.join(', ')} allowed`
  }
  
  return {
    required,
    email,
    minLength,
    maxLength,
    fileSize,
    fileType
  }
}
```

**Apply to Forms (1-2 days)**

Forms to validate:
- [ ] Login form (`src/views/auth/LoginView.vue`)
  - Email: required, email format
  - Password: required, min 6 chars
- [ ] Profile edit (`src/views/student/ProfileView.vue`)
  - First/last name: required, max 100 chars
  - Email: required, email format
- [ ] Announcement create (`src/views/admin/AnnouncementsView.vue`)
  - Title: required, max 200 chars
  - Content: required, max 5000 chars
- [ ] Attendance upload (`src/views/admin/AttendanceView.vue`)
  - Event: required
  - File: required, CSV only, max 5MB

#### Files to Create/Modify
```
src/composables/useValidation.js (new)
src/views/auth/LoginView.vue
src/views/student/ProfileView.vue
src/views/admin/AnnouncementsView.vue
src/views/admin/AttendanceView.vue
```

#### Success Criteria
- [ ] All forms validate before submission
- [ ] Error messages display next to fields
- [ ] Submit buttons disabled when invalid
- [ ] Validation clears on input change

---

### Task 2.2: Fix Student Record Linking

**Priority:** 🟡 IMPORTANT  
**Complexity:** Low  
**Estimated Time:** 1 day

#### Current Issue
Auto-linking via username search (e.g., `lastname.firstname`) may fail if:
- Username format is different
- Student record has different name spelling
- API search returns no results

#### Solution

**Option A: Backend Fix (Recommended)**
- Request backend to link `user.student` during authentication
- Eliminates frontend workaround

**Option B: Enhanced Frontend Fallback**
Update `src/stores/auth.js` (lines 150-175):
```javascript
// Try multiple search strategies
const strategies = [
  // Strategy 1: Username parts
  () => searchByNameParts(nameParts),
  // Strategy 2: User's email domain
  () => searchByEmail(user.value.email),
  // Strategy 3: User ID direct lookup
  () => searchByUserId(user.value.id)
]

for (const strategy of strategies) {
  const match = await strategy()
  if (match) {
    user.value = { ...user.value, student: match }
    break
  }
}
```

#### Files to Modify
```
src/stores/auth.js (lines 150-175)
```

---

### Task 2.3: Add Error Handling Improvements

**Priority:** 🟢 NICE-TO-HAVE  
**Complexity:** Medium  
**Estimated Time:** 2 days

#### Components

**1. Create Toast Notification System (1 day)**

Create `src/composables/useToast.js`:
```javascript
import { ref } from 'vue'

const toasts = ref([])
let idCounter = 0

export function useToast() {
  const show = (message, type = 'info', duration = 5000) => {
    const id = idCounter++
    toasts.value.push({ id, message, type })
    
    if (duration > 0) {
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, duration)
    }
    
    return id
  }
  
  const success = (msg) => show(msg, 'success')
  const error = (msg) => show(msg, 'error')
  const warning = (msg) => show(msg, 'warning')
  const info = (msg) => show(msg, 'info')
  
  return { toasts, show, success, error, warning, info }
}
```

**2. Add Global Error Handler (0.5 day)**

Update `src/services/api.js`:
```javascript
import { useToast } from '@/composables/useToast'

api.interceptors.response.use(
  response => response,
  error => {
    const toast = useToast()
    
    // Network error
    if (!error.response) {
      toast.error('Network error. Please check your connection.')
      return Promise.reject(error)
    }
    
    // Server errors
    const status = error.response.status
    const message = error.response.data?.message || error.response.data?.detail
    
    if (status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (status === 404) {
      toast.error('Resource not found.')
    } else if (status === 403) {
      toast.error('You don\'t have permission to perform this action.')
    } else if (message) {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)
```

**3. Add Retry Logic (0.5 day)**

Create `src/utils/retryRequest.js`:
```javascript
export async function retryRequest(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1 || error.response?.status < 500) {
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
    }
  }
}
```

#### Files to Create/Modify
```
src/composables/useToast.js (new)
src/components/ToastNotification.vue (new)
src/utils/retryRequest.js (new)
src/services/api.js
src/App.vue (add toast container)
```

---

## Phase 3: Admin CRUD Operations (Week 3) 🟢

### Task 3.1: Add Student Management CRUD

**Priority:** 🟢 NICE-TO-HAVE  
**Complexity:** High  
**Estimated Time:** 3-4 days

#### Why It Matters
Admins currently can only view students. Adding CRUD enables complete student management.

#### Backend Requirements
Verify these endpoints exist:
- `POST /api/v1/students/` - Create student
- `PATCH /api/v1/students/:id/` - Update student
- `DELETE /api/v1/students/:id/` - Delete student

#### Subtasks

**Create Student Modal (1 day)**
- [ ] Add "Add Student" button to `StudentsView.vue`
- [ ] Create modal component with form:
  - Student ID (required, unique)
  - First/last/middle name (required)
  - Email (required, email format)
  - Program/Course (dropdown)
  - Year level (1-4)
  - Section (text input)
  - RFID (optional)
- [ ] Add form validation
- [ ] Call `POST /api/v1/students/` on submit
- [ ] Refresh table on success

**Edit Student Modal (1 day)**
- [ ] Add "Edit" button to each student row
- [ ] Reuse create modal, pre-populate fields
- [ ] Call `PATCH /api/v1/students/:id/` on submit

**Delete Student (0.5 day)**
- [ ] Add "Delete" button to each student row
- [ ] Show confirmation dialog:
  - "Are you sure you want to delete [Student Name]?"
  - Warning: "This action cannot be undone"
- [ ] Call `DELETE /api/v1/students/:id/` on confirm
- [ ] Remove from table on success

**Service Methods (0.5 day)**

Add to `src/services/studentService.js`:
```javascript
export const createStudent = async (studentData) => {
  try {
    const response = await api.post('/api/v1/students/', studentData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message }
  }
}

export const updateStudent = async (id, studentData) => {
  try {
    const response = await api.patch(`/api/v1/students/${id}/`, studentData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message }
  }
}

export const deleteStudent = async (id) => {
  try {
    await api.delete(`/api/v1/students/${id}/`)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.response?.data?.message }
  }
}
```

**Testing (1 day)**
- [ ] Test create with valid data
- [ ] Test create with duplicate student ID (should fail)
- [ ] Test edit updates correctly
- [ ] Test delete removes student
- [ ] Test permission checks (admin-only)

#### Files to Modify
```
src/views/admin/StudentsView.vue
src/services/studentService.js
src/components/StudentFormModal.vue (new)
```

---

### Task 3.2: Add Event Management CRUD

**Priority:** 🟢 NICE-TO-HAVE  
**Complexity:** High  
**Estimated Time:** 3-4 days

Similar structure to Student CRUD. Details omitted for brevity.

---

## Phase 4: Testing Infrastructure (Weeks 4-5) 🟢

### Task 4.1: Setup Test Framework

**Priority:** 🟢 NICE-TO-HAVE  
**Complexity:** Medium  
**Estimated Time:** 3-5 days

#### Install Dependencies
```bash
npm install -D vitest @vue/test-utils happy-dom
npm install -D @testing-library/vue @testing-library/user-event
npm install -D @vitest/ui
```

#### Configure Vitest

Create `vitest.config.js`:
```javascript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'dist/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

#### Add Test Scripts

Update `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

#### Write Initial Tests (2-3 days)

**Unit Tests:**
- `src/services/authService.spec.js` - Auth service methods
- `src/services/studentService.spec.js` - Student service methods
- `src/stores/auth.spec.js` - Auth store logic
- `src/composables/useValidation.spec.js` - Validation helpers

**Component Tests:**
- `src/views/auth/LoginView.spec.js` - Login form
- `src/components/ToastNotification.spec.js` - Toast component

Example test:
```javascript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '@/views/auth/LoginView.vue'

describe('LoginView', () => {
  it('displays error on invalid credentials', async () => {
    const wrapper = mount(LoginView)
    
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('wrong')
    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.text()).toContain('Invalid credentials')
  })
})
```

#### Success Criteria
- [ ] Test suite runs with `npm test`
- [ ] Coverage report generates
- [ ] At least 50% coverage on services
- [ ] At least 30% overall coverage

---

## Phase 5: Documentation (Week 6) 📚

### Task 5.1: Create Developer Onboarding Guide

Create `docs/DEVELOPER_GUIDE.md` with:
- Project overview
- Setup instructions (detailed)
- Architecture diagram
- Code style guide
- Common tasks (add feature, debug API, etc.)
- Troubleshooting FAQ

### Task 5.2: Add JSDoc Comments

Add documentation to all service files:
- Function purpose
- Parameter descriptions
- Return value format
- Example usage
- Error conditions

Example:
```javascript
/**
 * Authenticate user with username and password
 * @param {string} username - User's email or username
 * @param {string} password - User's password
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 * @throws {Error} If network request fails
 * @example
 * const result = await login('user@example.com', 'password123')
 * if (result.success) {
 *   console.log('Logged in:', result.data.user)
 * }
 */
export const login = async (username, password) => {
  // ...
}
```

### Task 5.3: Create .env.example

Create `.env.example`:
```env
# API Configuration
VITE_API_BASE_URL=https://dnsc-systems-api.onrender.com
VITE_APP_NAME=Student Portal

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# External Systems
VITE_CMS_URL=http://localhost:5174
VITE_VOTING_URL=http://localhost:5175
VITE_LOCKER_URL=http://localhost:5176

# Development
VITE_USE_MOCK_API=false
```

---

## Quick Wins (Can Do Anytime) ⚡

These are small improvements that can be done independently:

1. **Add Loading States** (2 hours)
   - Disable buttons during API calls
   - Show spinner on submit
   
2. **Add Confirmation Dialogs** (2 hours)
   - Before delete actions
   - Before navigation with unsaved changes

3. **Improve Mobile Responsiveness** (4 hours)
   - Make admin tables scrollable on mobile
   - Adjust sidebar for small screens

4. **Add Keyboard Shortcuts** (3 hours)
   - ESC to close modals
   - CTRL+S to save forms

5. **Add Empty State Illustrations** (2 hours)
   - Better empty state messages
   - Add icons/illustrations

---

## Resource Estimates

| Phase | Tasks | Estimated Time | Priority |
|-------|-------|----------------|----------|
| Phase 1 | Announcements + Profile Testing | 1 week | 🔴 Critical |
| Phase 2 | Validation + Error Handling | 1 week | 🟡 Important |
| Phase 3 | Admin CRUD | 1 week | 🟢 Enhancement |
| Phase 4 | Testing | 1 week | 🟢 Enhancement |
| Phase 5 | Documentation | 0.5 week | 🟢 Enhancement |
| **Total** | - | **4.5 weeks** | - |

**Minimum Viable:** Phase 1 (1 week) gets project to production-ready  
**Recommended:** Phase 1 + 2 (2 weeks) ensures quality  
**Complete:** All phases (4.5 weeks) full feature set

---

## Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Backend endpoints don't exist | High | Medium | Coordinate early with backend team; use mock data temporarily |
| Permission errors on API | Medium | Low | Document required roles; add permission checks frontend |
| Testing takes longer than expected | Low | High | Start with critical path tests only; expand coverage gradually |
| Breaking changes during development | Medium | Low | Use git branches; thorough testing before merge |

---

## Success Metrics

**Code Quality:**
- [ ] Zero console errors in production
- [ ] All forms validated
- [ ] Error messages user-friendly
- [ ] Loading states on all async operations

**Test Coverage:**
- [ ] 50%+ coverage on services
- [ ] Critical user flows tested
- [ ] No broken tests in CI/CD

**User Experience:**
- [ ] All features accessible to intended users
- [ ] Mobile responsive
- [ ] Fast page loads (<2s)
- [ ] Clear error messages

**Documentation:**
- [ ] README up to date
- [ ] Developer guide complete
- [ ] API services documented
- [ ] .env.example provided

---

## Next Steps

1. **Review this plan** with the team
2. **Prioritize tasks** based on business needs
3. **Assign owners** for each phase
4. **Set milestones** and check-in points
5. **Start with Phase 1** (Announcements)

---

*This action plan is a living document. Update as tasks complete or priorities shift.*
