# Authentication & API Integration Guide

## 📦 Overview

The ICSA Student Portal now has complete authentication integration with the DNSC Systems API backend using JWT tokens.

## 🔐 Authentication Flow

### 1. Login Methods

#### Traditional Login (Username/Password)
- **Endpoint**: `POST /api/v1/login/`
- **Request Body**:
  ```json
  {
    "username": "student@dnsc.edu.ph",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access": "eyJ0eXAiOiJKV1QiLCJ...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJ..."
  }
  ```

#### Google OAuth Login
- **Endpoint**: `POST /api/v1/auth/google/`
- **Request Body**:
  ```json
  {
    "token": "google-id-token-here"
  }
  ```
- **Response**: Same as traditional login

### 2. Token Management

**Access Token**: 
- Stored in `localStorage` as `accessToken`
- Automatically attached to all API requests via interceptor
- Expires after a set period (configured on backend)

**Refresh Token**:
- Stored in `localStorage` as `refreshToken`
- Used to get new access token when it expires
- Automatically refreshed via API interceptor

**Auto-Refresh Flow**:
1. Request fails with 401 Unauthorized
2. Interceptor automatically calls `POST /api/v1/token/refresh/`
3. New access token is stored
4. Original request is retried with new token
5. If refresh fails, user is logged out

### 3. User Data

**Endpoint**: `GET /api/v1/me/`
**Response Structure**:
```json
[
  {
    "username": "juan.delacruz",
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "email": "juan@dnsc.edu.ph",
    "institute": {
      "id": 1,
      "institute_name": "Institute of Computing",
      "school": {
        "id": 1,
        "school_name": "Davao del Norte State College"
      }
    }
  }
]
```

## 🏗️ Architecture

### Directory Structure
```
src/
├── services/
│   ├── api.js              # Axios instance with interceptors
│   └── authService.js      # Authentication API calls
├── stores/
│   └── auth.js             # Pinia auth store
├── views/
│   ├── auth/
│   │   └── LoginView.vue   # Login page with Google OAuth
│   ├── admin/              # Admin views
│   │   ├── DashboardView.vue
│   │   ├── StudentsView.vue
│   │   ├── EventsView.vue
│   │   ├── AnnouncementsView.vue
│   │   └── AttendanceView.vue
│   └── layouts/
│       ├── AdminLayout.vue
│       └── StudentLayout.vue
└── router/
    └── index.js            # Route guards & role-based routing
```

### Key Files

#### `src/services/api.js`
- Axios instance configuration
- Request interceptor (adds Authorization header)
- Response interceptor (handles token refresh)
- Base URL from environment variable

#### `src/services/authService.js`
- `login(username, password)` - Traditional login
- `loginWithGoogle(token)` - Google OAuth login
- `getCurrentUser()` - Fetch user data
- `refreshToken(refreshToken)` - Refresh access token
- `logout()` - Clear tokens

#### `src/stores/auth.js` (Pinia Store)
- **State**: `user`, `loading`, `error`
- **Getters**: `isAuthenticated`, `isAdmin`, `isStudent`
- **Actions**:
  - `login(username, password)`
  - `loginWithGoogle(token)`
  - `fetchCurrentUser()`
  - `logout()`
  - `initialize()` - Load user on app start

## 🛣️ Routing

### Route Protection

**Guest Routes** (`requiresGuest: true`):
- `/login` - Redirects to `/admin` if admin, `/` if student

**Student Routes** (`requiresAuth: true, role: 'student'`):
- `/` - Dashboard
- `/profile` - Profile
- `/attendance` - Attendance
- `/submissions` - Submissions
- `/announcements` - Announcements
- `/calendar` - Calendar
- `/external-systems` - External Systems

**Admin Routes** (`requiresAuth: true, role: 'admin'`):
- `/admin` - Admin Dashboard
- `/admin/students` - Student Management
- `/admin/events` - Events Management
- `/admin/announcements` - Announcements Management
- `/admin/attendance` - Attendance Upload

### Role Detection

The system detects admin users based on:
```javascript
isAdmin = user.groups?.includes('Admin') || 
          user.is_staff || 
          user.is_superuser
```

## 🔧 Configuration

### Environment Variables

The `.env` file is configured for the **production API**:
```env
VITE_API_BASE_URL=https://dnsc-systems-api.onrender.com/
VITE_APP_NAME=Student Portal
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### Production API Setup

The DNSC Systems API is deployed and accessible at:
- **Base URL**: https://dnsc-systems-api.onrender.com/
- **Swagger Docs**: https://dnsc-systems-api.onrender.com/api/docs/swagger/
- **ReDoc**: https://dnsc-systems-api.onrender.com/api/docs/redoc/

✅ **No local backend setup required!**

### Google OAuth Setup

1. Get Google Client ID from [Google Cloud Console](https://console.cloud.google.com/)
2. Update `VITE_GOOGLE_CLIENT_ID` in `.env`
3. Google Sign-In button is already integrated in `LoginView.vue`

## 📝 Usage Examples

### Making Authenticated API Calls

```javascript
import api from '@/services/api'

// GET request
const response = await api.get('api/v1/students/')
const students = response.data

// POST request
const newStudent = await api.post('api/v1/students/', {
  first_name: 'Juan',
  last_name: 'Dela Cruz',
  email: 'juan@dnsc.edu.ph'
})

// PATCH request
await api.patch('api/v1/students/1/', {
  first_name: 'Juan Pedro'
})

// DELETE request
await api.delete('api/v1/students/1/')
```

### Using Auth Store

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Check if user is authenticated
if (authStore.isAuthenticated) {
  console.log('User:', authStore.user)
}

// Check user role
if (authStore.isAdmin) {
  console.log('Admin user')
}

// Login
const result = await authStore.login('username', 'password')
if (result.success) {
  router.push('/')
}

// Logout
authStore.logout()
router.push('/login')
```

## 🚀 Next Steps for Backend Team

### Required API Endpoints

All endpoints should follow this structure:

✅ **Already Implemented by Backend**:
- `POST /api/v1/login/` - Login
- `POST /api/v1/token/refresh/` - Refresh token
- `POST /api/v1/auth/google/` - Google OAuth
- `GET /api/v1/me/` - Current user info
- `GET /api/v1/students/` - List students
- `GET /api/v1/attendance-events/` - List events
- `GET /api/v1/attendance-records/` - List attendance

🔨 **To Be Created**:
- Announcements CRUD endpoints
- Dashboard statistics endpoint
- Bulk attendance upload endpoint

### Response Format

All API responses should follow Django REST Framework standards:

**Success Response**:
```json
{
  "count": 100,
  "next": "http://api.example.org/api/v1/students/?page=2",
  "previous": null,
  "results": [
    { "id": 1, "name": "Student 1" }
  ]
}
```

**Error Response**:
```json
{
  "detail": "Authentication credentials were not provided."
}
```

## 🎯 Testing

### Test Credentials

For development/testing, create test users in Django admin:

**Admin User**:
- Username: `admin`
- Add to "Admin" group or set `is_staff=True`

**Student User**:
- Username: `student@dnsc.edu.ph`
- Regular user (no admin privileges)

### Manual Testing Checklist

- [ ] Login with username/password
- [ ] Login with Google OAuth
- [ ] Auto-redirect based on role (admin → `/admin`, student → `/`)
- [ ] Token refresh on 401 error
- [ ] Logout clears all tokens
- [ ] Protected routes redirect to login
- [ ] Admin can't access student routes
- [ ] Student can't access admin routes

## 🐛 Troubleshooting

### CORS Issues
If you get CORS errors, ensure Django backend has:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### Token Expiration
Default token expiration can be configured in Django:
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

### Google OAuth Not Working
1. Check `VITE_GOOGLE_CLIENT_ID` is set correctly
2. Verify Google Cloud Console authorized origins include `http://localhost:5173`
3. Check backend has `GOOGLE_CLIENT_ID` environment variable

## 📚 Additional Resources

- [Django REST Framework JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Axios Documentation](https://axios-http.com/)
- [Google Sign-In for Web](https://developers.google.com/identity/gsi/web)

---

**Status**: ✅ Authentication system fully implemented and ready for integration
**Last Updated**: January 24, 2026
