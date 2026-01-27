# 🎯 Quick API Connection Summary

## How the Frontend Connects to Backend

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR BROWSER                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Vue.js Application (Frontend)               │   │
│  │                                                       │   │
│  │  ┌─────────────────┐                                │   │
│  │  │  LoginView.vue  │  User enters username/password │   │
│  │  └────────┬────────┘                                │   │
│  │           │ calls authStore.login()                 │   │
│  │           ↓                                          │   │
│  │  ┌─────────────────┐                                │   │
│  │  │   auth.js       │  Handles login logic           │   │
│  │  │   (Pinia Store) │                                │   │
│  │  └────────┬────────┘                                │   │
│  │           │ calls authService.login()               │   │
│  │           ↓                                          │   │
│  │  ┌─────────────────┐                                │   │
│  │  │ authService.js  │  Makes actual API call         │   │
│  │  └────────┬────────┘                                │   │
│  │           │ uses api.post()                         │   │
│  │           ↓                                          │   │
│  │  ┌─────────────────┐                                │   │
│  │  │    api.js       │  Axios HTTP client             │   │
│  │  │  (Interceptors) │  - Adds auth token             │   │
│  │  │                 │  - Handles errors              │   │
│  │  └────────┬────────┘                                │   │
│  │           │                                          │   │
│  └───────────┼──────────────────────────────────────────┘   │
│              │                                              │
└──────────────┼──────────────────────────────────────────────┘
               │ HTTPS Request
               │ POST /api/v1/login/
               │ { username, password }
               ↓
┌──────────────────────────────────────────────────────────────┐
│              🌐 INTERNET                                      │
└──────────────┬───────────────────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────────────────┐
│   🖥️  Backend Server (Django)                                │
│   https://dnsc-systems-api.onrender.com                      │
│                                                               │
│   ┌────────────────────────────────────────┐                │
│   │  /api/v1/login/                        │                │
│   │  - Receives username & password        │                │
│   │  - Checks database                     │                │
│   │  - Creates JWT tokens                  │                │
│   │  - Returns: { access, refresh }        │                │
│   └────────────────────────────────────────┘                │
│                                                               │
└──────────────┬───────────────────────────────────────────────┘
               │ Response
               │ { data: { access: "token", refresh: "token" }}
               ↓
┌──────────────────────────────────────────────────────────────┐
│                    YOUR BROWSER                              │
│   Tokens saved to localStorage                               │
│   User redirected to dashboard                               │
└──────────────────────────────────────────────────────────────┘
```

## Key Files Involved

### 1. `.env` - Configuration
```env
VITE_API_BASE_URL=https://dnsc-systems-api.onrender.com
```
**Purpose**: Tells the app where the backend is located

---

### 2. `src/config/api.js` - API Endpoints
```javascript
export const API_CONFIG = {
  BASE_URL: 'https://dnsc-systems-api.onrender.com',
  ENDPOINTS: {
    LOGIN: '/api/v1/login/',
    STUDENTS: '/api/v1/students/',
    // ... other endpoints
  }
}
```
**Purpose**: Central place for all API URLs

---

### 3. `src/services/api.js` - HTTP Client
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000
})

// Auto-add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```
**Purpose**: Reusable HTTP client with automatic token handling

---

### 4. `src/services/authService.js` - Auth API Calls
```javascript
import api from './api'

export const authService = {
  async login(username, password) {
    const response = await api.post('/api/v1/login/', {
      username,
      password
    })
    return response.data
  }
}
```
**Purpose**: Specific functions for authentication

---

### 5. `src/stores/auth.js` - State Management
```javascript
import { authService } from '@/services/authService.wrapper'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  
  const login = async (username, password) => {
    const response = await authService.login(username, password)
    localStorage.setItem('accessToken', response.data.access)
    localStorage.setItem('refreshToken', response.data.refresh)
    await fetchCurrentUser()
  }
  
  return { user, login }
})
```
**Purpose**: Manages user state across the entire app

---

### 6. `src/views/auth/LoginView.vue` - UI Component
```vue
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const form = ref({ email: '', password: '' })

const handleLogin = async () => {
  const result = await authStore.login(form.value.email, form.value.password)
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="form.email" placeholder="Username" />
    <input v-model="form.password" type="password" placeholder="Password" />
    <button type="submit">Login</button>
  </form>
</template>
```
**Purpose**: User interface for login

---

## The Data Flow

### Logging In
```
User types credentials
     ↓
LoginView.vue → authStore.login()
     ↓
auth.js → authService.login()
     ↓
authService.js → api.post('/api/v1/login/', data)
     ↓
api.js → Adds headers, sends HTTPS request
     ↓
Backend receives, validates, returns tokens
     ↓
Tokens saved to localStorage
     ↓
Fetch user profile (api.get('/api/v1/me/'))
     ↓
User data saved to store
     ↓
Redirect to dashboard
```

### Getting Student List
```
Admin visits /admin/students page
     ↓
Component calls: api.get('/api/v1/students/')
     ↓
api.js interceptor adds: Authorization: Bearer <token>
     ↓
Request sent to backend
     ↓
Backend verifies token
     ↓
Backend returns student list
     ↓
Component displays students in table
```

### Creating New Student
```
Admin fills form, clicks "Add Student"
     ↓
Component calls: api.post('/api/v1/students/', studentData)
     ↓
api.js adds token and sends request
     ↓
Backend creates student in database
     ↓
Backend returns new student with ID
     ↓
Component adds new student to list
     ↓
UI updates to show new student
```

---

## Why This Structure?

### ✅ Separation of Concerns
- **Views**: Handle UI and user interactions
- **Stores**: Manage state (data that multiple components need)
- **Services**: Handle API communication
- **api.js**: Central HTTP client with auth

### ✅ Reusability
```javascript
// Can use api anywhere!
import api from '@/services/api'

// In any component:
await api.get('/api/v1/students/')
await api.post('/api/v1/events/', data)
```

### ✅ Automatic Token Management
You never have to manually add tokens:
```javascript
// ❌ Don't do this
fetch(url, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})

// ✅ Just do this
api.get(url)  // Token added automatically!
```

### ✅ Easy to Switch Mock/Real API
```javascript
// In authService.wrapper.js
if (API_CONFIG.USE_MOCK) {
  return mockAuthService  // Use fake data
} else {
  return realAuthService  // Use real backend
}
```

---

## HTTP Requests Explained

### GET - Retrieve Data
```javascript
// Get all students
const response = await api.get('/api/v1/students/')
// URL: https://dnsc-systems-api.onrender.com/api/v1/students/
// Method: GET
// Data: None (just asking for data)
// Returns: { results: [...students] }
```

### POST - Create New Data
```javascript
// Create new student
const response = await api.post('/api/v1/students/', {
  first_name: 'Juan',
  last_name: 'Cruz'
})
// URL: https://dnsc-systems-api.onrender.com/api/v1/students/
// Method: POST
// Data: { first_name, last_name }
// Returns: { id: 123, first_name: 'Juan', last_name: 'Cruz' }
```

### PATCH - Update Existing Data
```javascript
// Update student email
const response = await api.patch('/api/v1/students/5/', {
  email: 'newemail@dnsc.edu.ph'
})
// URL: https://dnsc-systems-api.onrender.com/api/v1/students/5/
// Method: PATCH
// Data: { email: 'newemail@dnsc.edu.ph' }
// Returns: Updated student object
```

### DELETE - Remove Data
```javascript
// Delete student
await api.delete('/api/v1/students/5/')
// URL: https://dnsc-systems-api.onrender.com/api/v1/students/5/
// Method: DELETE
// Data: None
// Returns: 204 No Content
```

---

## Request Headers

Every request includes:
```javascript
{
  'Content-Type': 'application/json',        // We're sending JSON
  'Authorization': 'Bearer eyJ0eXAiOiJKV1Q...'  // Auth token (auto-added)
}
```

---

## Response Structure

Backend always returns:
```javascript
{
  status_code: 200,
  message: "Success",
  data: {
    // Actual data here
  },
  errors: null
}
```

In our code, we access it with:
```javascript
const response = await api.get('/api/v1/students/')
const students = response.data.data  // or response.data.results
```

---

## 🎓 Summary

1. **Frontend** (Vue.js) runs in your browser
2. **Backend** (Django) runs on a server (dnsc-systems-api.onrender.com)
3. **API** is how they communicate (like phone calls)
4. **Axios** makes the API calls easier
5. **Tokens** prove you're logged in
6. **Interceptors** automatically add tokens to every request

---

## Next Steps

1. ✅ Read `API_EXPLAINED_FOR_BEGINNERS.md` for detailed explanations
2. ✅ Open browser DevTools (F12) → Network tab to see requests
3. ✅ Look at `src/services/authService.js` - simple real examples
4. ✅ Try adding a `console.log(response.data)` in a component
5. ✅ Visit https://dnsc-systems-api.onrender.com/api/docs/swagger/ to see all endpoints

**Questions?** Check the browser console - every request is logged! 🚀
