# 🚀 Your First API Call - Tutorial

## Let's Make Your First API Call Together!

This is a step-by-step tutorial to help you understand API calls by doing it yourself.

---

## Tutorial 1: View All Students

### Step 1: Open Admin Students Page
1. Run `npm run dev`
2. Login as admin
3. Go to `/admin/students`

### Step 2: Look at the Code
Open: `src/views/admin/StudentsManagement.vue`

Find this code (around line 200):
```javascript
const fetchStudents = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/v1/students/')
    students.value = response.data.results || []
  } catch (error) {
    console.error('Error fetching students:', error)
  } finally {
    loading.value = false
  }
}
```

### Step 3: Add Console Logs
Let's see what's happening! Add these lines:

```javascript
const fetchStudents = async () => {
  loading.value = true
  
  console.log('🔍 About to fetch students...')  // ADD THIS
  
  try {
    const response = await api.get('/api/v1/students/')
    
    console.log('📦 Full response:', response)              // ADD THIS
    console.log('📊 Response data:', response.data)         // ADD THIS
    console.log('👥 Students array:', response.data.results) // ADD THIS
    
    students.value = response.data.results || []
  } catch (error) {
    console.error('❌ Error fetching students:', error)
  } finally {
    loading.value = false
  }
}
```

### Step 4: Open Browser Console
1. Press `F12` or right-click → "Inspect"
2. Go to "Console" tab
3. Refresh the page
4. Look at the logs!

### What You'll See:
```
🔍 About to fetch students...
📤 API Request: { method: 'GET', url: '/api/v1/students/', hasAuth: true }
📥 API Response: { status: 200, url: '/api/v1/students/', data: {...} }
📦 Full response: {data: {...}, status: 200, statusText: 'OK', ...}
📊 Response data: {status_code: 200, message: 'Success', data: {...}, errors: null}
👥 Students array: [{id: 1, name: 'Juan'}, {id: 2, name: 'Maria'}, ...]
```

### Understanding the Output:

1. **API Request** - Shows what we're asking for
   - `method: 'GET'` - We're asking for data
   - `url: '/api/v1/students/'` - Where we're asking
   - `hasAuth: true` - We're including our login token

2. **API Response** - Shows what the backend sent back
   - `status: 200` - Success!
   - `data` - The actual information

3. **Students array** - The list of students we can now display

---

## Tutorial 2: Create a New Student

### Step 1: Find the Add Student Function
In the same file, find the `addStudent` function:

```javascript
const addStudent = async () => {
  try {
    const response = await api.post('/api/v1/students/', newStudent.value)
    students.value.push(response.data)
    // ... rest of code
  } catch (error) {
    console.error('Error adding student:', error)
  }
}
```

### Step 2: Add Console Logs

```javascript
const addStudent = async () => {
  console.log('➕ Adding new student...', newStudent.value)  // ADD THIS
  
  try {
    const response = await api.post('/api/v1/students/', newStudent.value)
    
    console.log('✅ Student created!', response.data)  // ADD THIS
    console.log('🆔 New student ID:', response.data.id)  // ADD THIS
    
    students.value.push(response.data)
    // ... rest of code
  } catch (error) {
    console.error('❌ Error adding student:', error)
    console.error('🔍 Error details:', error.response?.data)  // ADD THIS
  }
}
```

### Step 3: Try Adding a Student
1. Click "Add Student" button
2. Fill in the form
3. Click "Save"
4. Watch the console!

### What You'll See:
```
➕ Adding new student... {first_name: 'Juan', last_name: 'Cruz', ...}
📤 API Request: { method: 'POST', url: '/api/v1/students/', hasAuth: true }
📥 API Response: { status: 201, url: '/api/v1/students/', data: {...} }
✅ Student created! {id: 123, first_name: 'Juan', last_name: 'Cruz', ...}
🆔 New student ID: 123
```

### Understanding:
- `POST` method = Create new data
- `status: 201` = Created successfully
- `response.data.id: 123` = Backend assigned ID 123 to this student

---

## Tutorial 3: See Network Traffic

### Step 1: Open Network Tab
1. Press `F12`
2. Click "Network" tab
3. Filter by "Fetch/XHR"

### Step 2: Make an Action
- Navigate to students page
- Or add a new student
- Or edit a student

### Step 3: Click on a Request
You'll see:

**Headers Tab:**
```
Request URL: https://dnsc-systems-api.onrender.com/api/v1/students/
Request Method: GET
Status Code: 200 OK

Request Headers:
  Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
  Content-Type: application/json
```

**Response Tab:**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "results": [
      {
        "id": 1,
        "first_name": "Juan",
        "last_name": "Cruz",
        "email": "juan@dnsc.edu.ph"
      }
    ]
  }
}
```

**Timing Tab:**
- Shows how long the request took
- Useful for debugging slow requests

---

## Tutorial 4: Create Your Own API Call

Let's create a simple page that fetches and displays data!

### Step 1: Create a Test Component

Create: `src/views/test/MyFirstApiPage.vue`

```vue
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

// State
const students = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch students when page loads
onMounted(async () => {
  console.log('🚀 Page loaded, fetching students...')
  
  loading.value = true
  error.value = null
  
  try {
    console.log('📞 Calling API...')
    const response = await api.get('/api/v1/students/')
    
    console.log('✅ Got response:', response.data)
    students.value = response.data.results || response.data.data || []
    
    console.log('👥 Number of students:', students.value.length)
  } catch (err) {
    console.error('❌ Error:', err)
    error.value = err.message
  } finally {
    loading.value = false
    console.log('✨ Done!')
  }
})
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">My First API Call!</h1>
    
    <!-- Loading state -->
    <div v-if="loading" class="text-blue-600">
      Loading students... 🔄
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="text-red-600">
      Error: {{ error }} ❌
    </div>
    
    <!-- Success state -->
    <div v-else>
      <p class="mb-4">Found {{ students.length }} students! ✅</p>
      
      <div class="grid gap-4">
        <div 
          v-for="student in students" 
          :key="student.id"
          class="border p-4 rounded"
        >
          <p class="font-bold">{{ student.first_name }} {{ student.last_name }}</p>
          <p class="text-sm text-gray-600">{{ student.email }}</p>
          <p class="text-xs text-gray-400">ID: {{ student.id }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
```

### Step 2: Add Route

Open: `src/router/index.js`

Add this route:
```javascript
{
  path: '/my-first-api',
  name: 'my-first-api',
  component: () => import('@/views/test/MyFirstApiPage.vue')
}
```

### Step 3: Visit the Page
1. Go to `http://localhost:5173/my-first-api`
2. Open console (F12)
3. Watch the magic! ✨

You'll see:
```
🚀 Page loaded, fetching students...
📞 Calling API...
📤 API Request: { method: 'GET', url: '/api/v1/students/', hasAuth: true }
📥 API Response: { status: 200, url: '/api/v1/students/', data: {...} }
✅ Got response: { status_code: 200, message: 'Success', data: {...} }
👥 Number of students: 5
✨ Done!
```

### Step 4: Experiment!
Try modifying the code:

**Change the endpoint:**
```javascript
const response = await api.get('/api/v1/attendance-events/')  // Get events instead
```

**Add query parameters:**
```javascript
const response = await api.get('/api/v1/students/?search=juan')
```

**Add more console logs:**
```javascript
console.log('First student:', students.value[0])
console.log('All student names:', students.value.map(s => s.first_name))
```

---

## Tutorial 5: Handle Errors Properly

### Common Errors and How to Debug

#### Error 1: 401 Unauthorized
```
❌ API Error: { status: 401, message: 'Unauthorized' }
```

**What it means**: Not logged in or token expired

**How to fix**:
```javascript
try {
  const response = await api.get('/api/v1/students/')
} catch (error) {
  if (error.response?.status === 401) {
    console.log('⚠️ Token expired, redirecting to login...')
    router.push('/login')
  }
}
```

#### Error 2: 404 Not Found
```
❌ API Error: { status: 404, message: 'Not Found' }
```

**What it means**: The endpoint or item doesn't exist

**How to fix**: Check the URL spelling
```javascript
// ❌ Wrong
await api.get('/api/v1/student/')  // Missing 's'

// ✅ Correct
await api.get('/api/v1/students/')
```

#### Error 3: 500 Server Error
```
❌ API Error: { status: 500, message: 'Internal Server Error' }
```

**What it means**: Backend crashed or has a bug

**How to fix**: 
- Check backend logs
- Contact backend team
- Show them what request caused the error

#### Error 4: Network Error
```
❌ Error: Network Error
```

**What it means**: Can't reach the server

**How to fix**:
- Check internet connection
- Check if backend is running
- Disable ad blockers

---

## Quick Reference Card

### Making API Calls

```javascript
// GET - Retrieve data
const response = await api.get('/api/v1/students/')
const data = response.data

// POST - Create new
const response = await api.post('/api/v1/students/', {
  first_name: 'Juan',
  last_name: 'Cruz'
})

// PATCH - Update
const response = await api.patch('/api/v1/students/5/', {
  email: 'new@email.com'
})

// DELETE - Remove
await api.delete('/api/v1/students/5/')
```

### Common Response Patterns

```javascript
// List response
{
  status_code: 200,
  data: {
    count: 50,
    results: [...items]
  }
}

// Single item response
{
  status_code: 200,
  data: {
    id: 1,
    name: "Juan"
  }
}

// Error response
{
  status_code: 400,
  errors: {
    detail: "Invalid data"
  }
}
```

---

## Practice Challenges

### Challenge 1: Add a Counter
Show how many students are loaded on the page.

**Hint**: Use `students.value.length`

### Challenge 2: Add a Search Box
Filter students by name.

**Hint**: Use `v-model` and `.filter()`

### Challenge 3: Add a "Create Student" Form
Let users add new students from your page.

**Hint**: Use `api.post()` and add student to the array

### Challenge 4: Add Click to Delete
Delete a student when clicking a button.

**Hint**: Use `api.delete()` and remove from array

---

## Next Steps

1. ✅ Complete all tutorials above
2. ✅ Try the practice challenges
3. ✅ Read `API_EXPLAINED_FOR_BEGINNERS.md`
4. ✅ Look at existing pages for more examples
5. ✅ Build your own feature!

---

**Remember**: 
- Open console (F12) to see what's happening
- Every error has a solution
- Practice makes perfect! 🚀

Happy coding! 🎉
