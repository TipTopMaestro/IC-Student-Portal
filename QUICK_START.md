# Quick Start Guide - Student Portal Team

## 🎯 What We Just Set Up

Your ICSA Student Portal now has:
- ✅ Full authentication with JWT tokens
- ✅ Google Sign-In support
- ✅ Admin portal with 5 pages
- ✅ Role-based access control
- ✅ API integration layer ready

## 🚀 Getting Started

### 1. Install & Run

```bash
# Install dependencies (if not done yet)
npm install

# Start development server
npm run dev
```

Application runs at: `http://localhost:5173/`

### 2. Environment Setup

The `.env` file is already configured to use the **production API**:
```env
VITE_API_BASE_URL=https://dnsc-systems-api.onrender.com/
VITE_APP_NAME=Student Portal
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

✅ **No need to run Django backend locally!**

### 3. Production API

The backend API is already deployed and accessible at:
```
Base URL: https://dnsc-systems-api.onrender.com/

Documentation:
- Swagger: https://dnsc-systems-api.onrender.com/api/docs/swagger/
- ReDoc: https://dnsc-systems-api.onrender.com/api/docs/redoc/
```

### 4. Get Test Credentials

Contact the backend team to get test user credentials:
- Admin user (with "Admin" group)
- Student user (regular user)

## 📖 Key Concepts

### Authentication Flow

1. **User logs in** → Frontend sends credentials to `/api/v1/login/`
2. **Backend returns tokens** → `{access: "...", refresh: "..."}`
3. **Tokens stored** → localStorage saves both tokens
4. **Auto-attached** → All API requests include `Authorization: Bearer <token>`
5. **Auto-refresh** → If access token expires, refresh token gets new one
6. **User data fetched** → `/api/v1/me/` returns user profile

### Role Detection

```javascript
// Admin if:
- user.groups includes "Admin"
- user.is_staff = true
- user.is_superuser = true

// Otherwise: Student
```

### Routes

**Everyone:**
- `/login` - Login page

**Students:**
- `/` - Student Dashboard
- `/profile`, `/attendance`, `/submissions`, etc.

**Admins:**
- `/admin` - Admin Dashboard
- `/admin/students`, `/admin/events`, etc.

## 🛠️ How to Use the Auth System

### In Your Components

```vue
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Get user data
console.log(authStore.user)

// Check roles
if (authStore.isAdmin) {
  console.log('User is an admin')
}

// Logout
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
```

### Making API Calls

```javascript
import api from '@/services/api'

// Simple GET
const response = await api.get('api/v1/students/')
const students = response.data.results

// POST with data
await api.post('api/v1/students/', {
  first_name: 'Juan',
  last_name: 'Dela Cruz'
})

// PATCH to update
await api.patch('api/v1/students/1/', {
  email: 'newemail@dnsc.edu.ph'
})

// DELETE
await api.delete('api/v1/students/1/')
```

## 📁 Where to Add Features

### New Student Pages
1. Create file: `src/views/student/MyNewPage.vue`
2. Add route in `src/router/index.js`:
```javascript
{
  path: '/my-new-page',
  name: 'my-new-page',
  component: () => import('@/views/student/MyNewPage.vue')
}
```
3. Add link in `src/views/layouts/StudentLayout.vue`

### New Admin Pages
1. Create file: `src/views/admin/MyNewPage.vue`
2. Add route in `src/router/index.js` under admin children:
```javascript
{
  path: 'my-new-page',
  name: 'admin-my-new-page',
  component: () => import('@/views/admin/MyNewPage.vue')
}
```
3. Add link in `src/views/layouts/AdminLayout.vue`

### New API Service
1. Create file: `src/services/myService.js`
2. Follow pattern:
```javascript
import api from './api'

export const myService = {
  async getItems() {
    const response = await api.get('api/v1/items/')
    return response.data
  },
  
  async createItem(data) {
    const response = await api.post('api/v1/items/', data)
    return response.data
  }
}
```

## 🐛 Common Issues

### "Network Error" or "CORS Error"
**Problem**: Backend not running or CORS not configured
**Solution**: 
1. Make sure Django backend is running at `http://127.0.0.1:8000/`
2. Check Django CORS settings allow `http://localhost:5173`

### "401 Unauthorized"
**Problem**: Token expired or invalid
**Solution**: The app should auto-refresh, but if it doesn't, logout and login again

### "Cannot read property of null"
**Problem**: Trying to access user data before it loads
**Solution**: Use v-if to check first:
```vue
<div v-if="authStore.user">
  {{ authStore.user.username }}
</div>
```

### Google Sign-In Not Working
**Problem**: Google Client ID not configured
**Solution**: 
1. Get Client ID from Google Cloud Console
2. Update `VITE_GOOGLE_CLIENT_ID` in `.env`
3. Restart dev server (`npm run dev`)

## 📚 Documentation Files

- **README.md** - Main project documentation
- **AUTHENTICATION_GUIDE.md** - Complete auth system guide
- **PROJECT_SUMMARY.md** - Original project summary
- **QUICK_START.md** - This file

## 🎓 Learning Resources

### Vue 3
- [Official Guide](https://vuejs.org/guide/introduction.html)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

### Pinia (State Management)
- [Pinia Docs](https://pinia.vuejs.org/)

### Axios (HTTP Client)
- [Axios Docs](https://axios-http.com/)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)

## 🎯 Next Steps for Your Team

### Immediate Tasks:
1. ✅ Set up backend API (Django)
2. ✅ Create test users (admin & student)
3. ✅ Test login flow
4. ✅ Explore admin pages
5. ✅ Explore student pages

### Short-term Tasks:
1. Connect admin pages to real API
2. Fetch student data from backend
3. Implement events management
4. Create announcements system
5. Build attendance upload functionality

### Medium-term Tasks:
1. Add more admin features
2. Enhance student dashboard
3. Integrate with external systems
4. Add file upload for submissions
5. Create reporting features

## 💡 Tips

1. **Always check auth status** before accessing user data
2. **Use the auth store** - don't manually manage tokens
3. **API calls handle tokens automatically** - just use `api.get/post/etc`
4. **Check the console** - errors will show there
5. **Read AUTHENTICATION_GUIDE.md** - it has detailed examples

## 🆘 Getting Help

1. Check **AUTHENTICATION_GUIDE.md** for detailed API info
2. Look at **sample/collection_management_system** for examples
3. Check browser console for error messages
4. Review **src/services/** for how API calls work
5. Look at existing views for component patterns

---

**You're all set!** 🎉

Login at `http://localhost:5173/login` and start building!
