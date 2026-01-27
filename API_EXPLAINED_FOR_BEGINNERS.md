# 🎓 API Connection Explained (For Beginners)

## What is an API?

**API** = **Application Programming Interface**

Think of it like a **waiter in a restaurant**:
- You (frontend) are the customer
- The kitchen (backend) prepares the food
- The waiter (API) takes your order and brings back your food

You don't go into the kitchen yourself - you ask the waiter!

## How Our App Connects to the Backend

### 1. 📍 Setting the Backend Address

**File**: `.env`
```env
VITE_API_BASE_URL=https://dnsc-systems-api.onrender.com
```

This is like saying: *"Our backend kitchen is located at this address"*

---

### 2. 🛠️ Creating the API Client (Axios)

**File**: `src/services/api.js`

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dnsc-systems-api.onrender.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})
```

**What this means**:
- `axios` is a tool that helps us make HTTP requests (like fetch but better)
- `baseURL` - Every request will start with this URL
- `timeout` - Wait maximum 30 seconds before giving up
- `headers` - Tell the server we're sending JSON data

**Real-world analogy**: 
This is like getting the waiter's phone number so you can call the restaurant!

---

### 3. 🔐 Adding Authentication Automatically

**File**: `src/services/api.js` (Request Interceptor)

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**What this does**:
- Before EVERY request, check if we have a login token
- If yes, attach it to the request
- The backend uses this token to know WHO you are

**Real-world analogy**: 
Like showing your ID card before entering a building - happens automatically every time!

---

### 4. 📞 Making API Calls

#### Example 1: Login (POST Request)

**File**: `src/services/authService.js`

```javascript
async login(username, password) {
  const response = await api.post('/api/v1/login/', {
    username,
    password
  })
  return response.data
}
```

**Breaking it down**:
1. `api.post()` - Send data TO the server (like submitting a form)
2. `'/api/v1/login/'` - The specific endpoint (full URL: https://dnsc-systems-api.onrender.com/api/v1/login/)
3. `{ username, password }` - The data we're sending
4. `await` - Wait for the response before continuing
5. `response.data` - Extract the data from the response

**What happens**:
```
You → Send: { username: "alex", password: "12345" }
     ↓
Backend checks credentials
     ↓
Backend → Returns: { access: "token123", refresh: "token456" }
```

#### Example 2: Get Students List (GET Request)

```javascript
async getStudents() {
  const response = await api.get('/api/v1/students/')
  return response.data
}
```

**Breaking it down**:
1. `api.get()` - ASK the server for data (like asking a question)
2. `'/api/v1/students/'` - Which data we want
3. No data to send - we're just asking for information

**What happens**:
```
You → "Give me the list of students"
     ↓
Backend → Returns: { results: [student1, student2, ...] }
```

#### Example 3: Create New Student (POST Request)

```javascript
async createStudent(studentData) {
  const response = await api.post('/api/v1/students/', {
    first_name: studentData.firstName,
    last_name: studentData.lastName,
    email: studentData.email
  })
  return response.data
}
```

**What happens**:
```
You → Send: { first_name: "Juan", last_name: "Cruz", email: "juan@dnsc.edu.ph" }
     ↓
Backend → Creates new student in database
     ↓
Backend → Returns: { id: 123, first_name: "Juan", ... }
```

#### Example 4: Update Student (PATCH Request)

```javascript
async updateStudent(id, updates) {
  const response = await api.patch(`/api/v1/students/${id}/`, updates)
  return response.data
}
```

**What happens**:
```
You → Update student #5: { email: "newemail@dnsc.edu.ph" }
     ↓
Backend → Updates that specific student
     ↓
Backend → Returns: Updated student data
```

#### Example 5: Delete Student (DELETE Request)

```javascript
async deleteStudent(id) {
  await api.delete(`/api/v1/students/${id}/`)
}
```

**What happens**:
```
You → "Delete student #5"
     ↓
Backend → Removes student from database
     ↓
Backend → Returns: Success (no data needed)
```

---

### 5. 🎯 Using API Calls in Components

**File**: `src/views/admin/StudentsManagement.vue`

```vue
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const students = ref([])
const loading = ref(false)

// Fetch students when page loads
onMounted(async () => {
  loading.value = true
  try {
    const response = await api.get('/api/v1/students/')
    students.value = response.data.results
  } catch (error) {
    console.error('Failed to load students:', error)
  } finally {
    loading.value = false
  }
})

// Add new student
const addStudent = async (studentData) => {
  try {
    const response = await api.post('/api/v1/students/', studentData)
    students.value.push(response.data) // Add to list
    alert('Student added!')
  } catch (error) {
    alert('Failed to add student')
  }
}
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <div v-for="student in students" :key="student.id">
      {{ student.first_name }} {{ student.last_name }}
    </div>
  </div>
</template>
```

---

## 📊 The Complete Flow

### Login Flow (Step by Step)

```
1. User enters username & password
   ↓
2. Vue component calls: authStore.login(username, password)
   ↓
3. Auth store calls: authService.login(username, password)
   ↓
4. Auth service calls: api.post('/api/v1/login/', { username, password })
   ↓
5. Axios interceptor adds headers (Content-Type: application/json)
   ↓
6. Request sent to: https://dnsc-systems-api.onrender.com/api/v1/login/
   ↓
7. Backend receives request, checks credentials
   ↓
8. Backend returns: { data: { access: "token", refresh: "token" } }
   ↓
9. Auth service receives response
   ↓
10. Auth store saves tokens to localStorage
   ↓
11. Auth store calls: authService.getCurrentUser()
   ↓
12. Auth service calls: api.get('/api/v1/me/')
   ↓
13. Axios interceptor adds: Authorization: Bearer <token>
   ↓
14. Backend verifies token and returns user data
   ↓
15. Auth store saves user data
   ↓
16. User is redirected to dashboard
```

---

## 🔑 HTTP Methods (Verbs)

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Read/Retrieve data | Get list of students |
| **POST** | Create new data | Add new student |
| **PATCH** | Update part of data | Change student email |
| **PUT** | Replace entire data | Replace all student info |
| **DELETE** | Remove data | Delete a student |

**Real-world analogy**:
- **GET** = Reading a book
- **POST** = Writing a new book
- **PATCH** = Correcting a typo in a book
- **PUT** = Rewriting an entire chapter
- **DELETE** = Throwing away a book

---

## 🎨 Request & Response Structure

### Request Structure
```javascript
{
  method: 'POST',
  url: 'https://dnsc-systems-api.onrender.com/api/v1/students/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1Q...'
  },
  data: {
    first_name: 'Juan',
    last_name: 'Cruz'
  }
}
```

### Response Structure
```javascript
{
  status: 200,        // Status code (200 = success)
  statusText: 'OK',   // Status message
  data: {             // The actual data we want
    id: 123,
    first_name: 'Juan',
    last_name: 'Cruz',
    created_at: '2024-01-26T10:00:00Z'
  },
  headers: { ... }    // Response headers
}
```

---

## 🚨 HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| **200** | Success | Data retrieved |
| **201** | Created | New student added |
| **400** | Bad Request | Invalid data sent |
| **401** | Unauthorized | Not logged in |
| **403** | Forbidden | No permission |
| **404** | Not Found | Student doesn't exist |
| **500** | Server Error | Backend crashed |

**Analogy**:
- **200** = "Here's what you asked for ✅"
- **401** = "Who are you? Show me your ID! 🚫"
- **404** = "I can't find what you're looking for 🤷"
- **500** = "Oops, I made a mistake! 😵"

---

## 🔐 Token-Based Authentication

### What are tokens?

Tokens are like **temporary ID cards** that prove you're logged in.

### Two types:

1. **Access Token** (Short-lived, ~15 minutes)
   - Used for every request
   - Like a day pass to a building

2. **Refresh Token** (Long-lived, ~7 days)
   - Used to get new access token when it expires
   - Like a membership card that gets you new day passes

### How it works:

```
Login → Get both tokens → Save to localStorage
   ↓
Every request → Include access token in header
   ↓
Access token expires (401 error) → Use refresh token to get new access token
   ↓
Refresh token expires → Must login again
```

**Code Example**:
```javascript
// Login - Get tokens
const response = await api.post('/api/v1/login/', { username, password })
localStorage.setItem('accessToken', response.data.access)
localStorage.setItem('refreshToken', response.data.refresh)

// Every request - Token automatically added by interceptor
await api.get('/api/v1/students/') 
// Axios adds: Authorization: Bearer eyJ0eXAiOiJKV1Q...

// Token expired? Refresh it automatically
if (error.status === 401) {
  const newToken = await refreshToken()
  localStorage.setItem('accessToken', newToken)
  // Retry original request
}
```

---

## 🏗️ Project Structure

```
src/
├── config/
│   └── api.js              # API configuration (base URL, endpoints)
│
├── services/
│   ├── api.js              # Axios instance with interceptors
│   ├── authService.js      # Authentication API calls
│   └── authService.wrapper.js  # Mock/Real API switcher
│
├── stores/
│   └── auth.js             # Authentication state management
│
└── views/
    └── auth/
        └── LoginView.vue   # Login page component
```

---

## 💡 Key Concepts

### 1. **Async/Await**
```javascript
// Without async/await (confusing!)
api.get('/api/v1/students/').then(response => {
  console.log(response.data)
})

// With async/await (cleaner!)
const response = await api.get('/api/v1/students/')
console.log(response.data)
```

### 2. **Try/Catch** (Error Handling)
```javascript
try {
  const response = await api.get('/api/v1/students/')
  console.log('Success!', response.data)
} catch (error) {
  console.error('Failed!', error.message)
  alert('Something went wrong')
}
```

### 3. **Interceptors** (Middleware)
```javascript
// Before every request
api.interceptors.request.use((config) => {
  console.log('Sending request to:', config.url)
  // Add token here
  return config
})

// After every response
api.interceptors.response.use((response) => {
  console.log('Got response:', response.data)
  return response
})
```

---

## 🎯 Quick Reference

### Basic API Call Pattern
```javascript
// 1. Import api
import api from '@/services/api'

// 2. Make request
const response = await api.METHOD('/endpoint/', data)

// 3. Use the data
const result = response.data
```

### Common Patterns

**Get list**:
```javascript
const response = await api.get('/api/v1/students/')
const students = response.data.results
```

**Get single item**:
```javascript
const response = await api.get('/api/v1/students/5/')
const student = response.data
```

**Create**:
```javascript
const response = await api.post('/api/v1/students/', { name: 'Juan' })
const newStudent = response.data
```

**Update**:
```javascript
const response = await api.patch('/api/v1/students/5/', { email: 'new@email.com' })
const updated = response.data
```

**Delete**:
```javascript
await api.delete('/api/v1/students/5/')
// No response data needed
```

---

## 🎓 Learning Path

1. **Start here**: Understand what APIs are
2. **Read this file**: Understand how our app uses APIs
3. **Look at**: `src/services/authService.js` (simple examples)
4. **Try modifying**: Add a console.log in a component to see API response
5. **Build something**: Create a simple page that fetches data from API
6. **Advanced**: Learn about interceptors, error handling, and state management

---

## 📚 Additional Resources

- [What is an API? (Video)](https://www.youtube.com/watch?v=GZvSYJDk-us)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [HTTP Methods Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

## ❓ Common Questions

**Q: Why use Axios instead of fetch?**
A: Axios automatically converts JSON, has better error handling, and interceptors make it easy to add tokens.

**Q: Where are tokens stored?**
A: In `localStorage` - it's like a small database in your browser.

**Q: What if the token expires?**
A: Our app automatically refreshes it using the refresh token!

**Q: Can I test API calls outside the app?**
A: Yes! Use [Postman](https://www.postman.com/) or visit the API docs at https://dnsc-systems-api.onrender.com/api/docs/swagger/

**Q: How do I see what's being sent/received?**
A: Open browser DevTools (F12) → Network tab → Click on a request

---

**Happy Learning!** 🚀

If you have questions, check the browser console - it logs every request and response!
