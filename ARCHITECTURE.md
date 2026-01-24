# System Architecture Diagram

## 📐 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         LOGIN VIEW                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  • Username/Password Form                                     │  │
│  │  • Google Sign-In Button                                      │  │
│  │  • Error Display                                              │  │
│  │  • Loading State                                              │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      AUTH STORE (Pinia)                              │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  State:                                                       │  │
│  │    • user: { username, email, groups, ... }                  │  │
│  │    • loading: boolean                                        │  │
│  │    • error: string                                           │  │
│  │                                                              │  │
│  │  Getters:                                                    │  │
│  │    • isAuthenticated: boolean                                │  │
│  │    • isAdmin: boolean                                        │  │
│  │    • isStudent: boolean                                      │  │
│  │                                                              │  │
│  │  Actions:                                                    │  │
│  │    • login(username, password)                               │  │
│  │    • loginWithGoogle(token)                                  │  │
│  │    • fetchCurrentUser()                                      │  │
│  │    • logout()                                                │  │
│  │    • initialize()                                            │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     AUTH SERVICE                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  • login(username, password) → {access, refresh}             │  │
│  │  • loginWithGoogle(token) → {access, refresh}                │  │
│  │  • getCurrentUser() → user data                              │  │
│  │  • refreshToken(refreshToken) → {access}                     │  │
│  │  • logout() → clear tokens                                   │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API CLIENT (Axios)                                │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Request Interceptor:                                        │  │
│  │    ✓ Add Authorization: Bearer <access_token>               │  │
│  │                                                              │  │
│  │  Response Interceptor:                                       │  │
│  │    ✓ Check for 401 Unauthorized                             │  │
│  │    ✓ Call refresh endpoint                                   │  │
│  │    ✓ Update access token                                     │  │
│  │    ✓ Retry original request                                  │  │
│  │    ✓ Logout if refresh fails                                 │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     DJANGO BACKEND API                               │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Endpoints:                                                  │  │
│  │    POST /api/v1/login/                                       │  │
│  │    POST /api/v1/token/refresh/                               │  │
│  │    POST /api/v1/auth/google/                                 │  │
│  │    GET  /api/v1/me/                                          │  │
│  │    ...                                                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔀 Role-Based Routing Flow

```
                            ┌──────────┐
                            │  LOGIN   │
                            └────┬─────┘
                                 │
                        Successful Login
                                 │
                   ┌─────────────┴──────────────┐
                   │                            │
              ┌────▼────┐                 ┌────▼────┐
              │ isAdmin │                 │isStudent│
              │  true   │                 │  true   │
              └────┬────┘                 └────┬────┘
                   │                            │
                   │                            │
         ┌─────────▼─────────┐        ┌────────▼────────┐
         │  ADMIN PORTAL     │        │ STUDENT PORTAL  │
         │  (/admin)         │        │  (/)            │
         └───────────────────┘        └─────────────────┘
                   │                            │
         ┌─────────▼─────────┐        ┌────────▼────────┐
         │ • Dashboard       │        │ • Dashboard     │
         │ • Students Mgmt   │        │ • Profile       │
         │ • Events Mgmt     │        │ • Attendance    │
         │ • Announcements   │        │ • Submissions   │
         │ • Attendance      │        │ • Announcements │
         └───────────────────┘        │ • Calendar      │
                                      │ • Ext. Systems  │
                                      └─────────────────┘
```

## 🔄 Token Refresh Flow

```
┌──────────────┐
│  User makes  │
│  API request │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ Add Authorization header │
│ Bearer <access_token>    │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────┐
│ Send to Backend  │
└──────┬───────────┘
       │
       ▼
  ┌─────────┐
  │Backend  │
  │Response?│
  └────┬────┘
       │
       ├──── 200 OK ────────────────┐
       │                            │
       └──── 401 Unauthorized ──────┤
                                    │
                                    ▼
                        ┌──────────────────────┐
                        │ Get refresh token    │
                        │ from localStorage    │
                        └──────┬───────────────┘
                               │
                               ▼
                        ┌──────────────────────┐
                        │ POST /token/refresh/ │
                        │ with refresh token   │
                        └──────┬───────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              Refresh Success       Refresh Failed
                    │                     │
                    ▼                     ▼
          ┌─────────────────┐    ┌──────────────┐
          │ Update access   │    │   Logout     │
          │ token in storage│    │   User       │
          └────────┬────────┘    │   Redirect   │
                   │             │   to /login  │
                   ▼             └──────────────┘
          ┌─────────────────┐
          │ Retry original  │
          │ request with    │
          │ new token       │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Return response │
          │ to caller       │
          └─────────────────┘
```

## 📂 Project Structure

```
IC-Student-Portal/
│
├── public/                        # Static assets
│   ├── icsa_logo.png
│   └── ic-building.png
│
├── src/
│   ├── assets/
│   │   └── main.css              # Tailwind CSS
│   │
│   ├── components/
│   │   └── common/               # Reusable components
│   │
│   ├── services/                 # API Layer
│   │   ├── api.js                # ← Axios instance
│   │   └── authService.js        # ← Auth API calls
│   │
│   ├── stores/                   # State Management
│   │   └── auth.js               # ← Auth Pinia store
│   │
│   ├── router/                   # Routing
│   │   └── index.js              # ← Routes & guards
│   │
│   ├── views/
│   │   ├── auth/
│   │   │   └── LoginView.vue     # ← Login page
│   │   │
│   │   ├── layouts/
│   │   │   ├── AdminLayout.vue   # ← Admin layout
│   │   │   └── StudentLayout.vue # ← Student layout
│   │   │
│   │   ├── admin/                # Admin Pages
│   │   │   ├── DashboardView.vue
│   │   │   ├── StudentsView.vue
│   │   │   ├── EventsView.vue
│   │   │   ├── AnnouncementsView.vue
│   │   │   └── AttendanceView.vue
│   │   │
│   │   └── student/              # Student Pages
│   │       ├── DashboardView.vue
│   │       ├── ProfileView.vue
│   │       ├── AttendanceView.vue
│   │       ├── SubmissionsView.vue
│   │       ├── AnnouncementsView.vue
│   │       ├── CalendarView.vue
│   │       └── ExternalSystemsView.vue
│   │
│   ├── App.vue                   # Root component
│   └── main.js                   # Entry point
│
├── sample/                       # Reference code
│   ├── dnsc_systems_api/         # Backend API
│   └── collection_management_system/
│
├── .env                          # Environment config
├── package.json                  # Dependencies
├── vite.config.js               # Vite config
├── tailwind.config.js           # Tailwind config
│
└── Documentation/
    ├── README.md                 # Main docs
    ├── AUTHENTICATION_GUIDE.md   # Auth detailed guide
    ├── QUICK_START.md            # Quick reference
    ├── IMPLEMENTATION_SUMMARY.md # What was built
    ├── TESTING_CHECKLIST.md      # Testing guide
    └── ARCHITECTURE.md           # This file
```

## 🔐 Data Flow: Login Example

```
1. USER ACTION
   │
   ├─> Enters username & password
   ├─> Clicks "Log in" button
   │
2. LOGINVIEW.VUE
   │
   ├─> handleLogin() called
   ├─> Sets loading = true
   │
3. AUTH STORE
   │
   ├─> authStore.login(username, password)
   ├─> Calls authService.login()
   │
4. AUTH SERVICE
   │
   ├─> api.post('api/v1/login/', { username, password })
   ├─> Returns { access, refresh }
   │
5. BACKEND
   │
   ├─> Validates credentials
   ├─> Generates JWT tokens
   ├─> Returns tokens + user data
   │
6. AUTH SERVICE (Response)
   │
   ├─> Receives tokens
   ├─> Returns to auth store
   │
7. AUTH STORE (Process)
   │
   ├─> localStorage.setItem('accessToken', access)
   ├─> localStorage.setItem('refreshToken', refresh)
   ├─> Calls fetchCurrentUser()
   │
8. FETCH USER DATA
   │
   ├─> api.get('api/v1/me/')
   ├─> Backend returns user profile
   ├─> Store in authStore.user
   ├─> Store in localStorage
   │
9. ROLE DETECTION
   │
   ├─> Check user.groups[] for "Admin"
   ├─> Check user.is_staff
   ├─> Check user.is_superuser
   ├─> Set isAdmin / isStudent
   │
10. ROUTER REDIRECT
    │
    ├─> if isAdmin → router.push('/admin')
    ├─> if isStudent → router.push('/')
    │
11. LOAD DASHBOARD
    │
    ├─> Router guard checks isAuthenticated
    ├─> Router guard checks role matches route
    ├─> Render appropriate layout
    ├─> Show user data
```

## 🎯 Component Communication

```
                    ┌───────────────┐
                    │    App.vue    │
                    │  (Initialize) │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
       ┌──────▼──────┐           ┌───────▼──────┐
       │ AdminLayout │           │StudentLayout │
       │    .vue     │           │    .vue      │
       └──────┬──────┘           └───────┬──────┘
              │                           │
       ┌──────┴──────┐           ┌───────┴──────┐
       │             │           │               │
       ▼             ▼           ▼               ▼
   [Admin        [Events    [Dashboard]    [Attendance]
    Dashboard]    Mgmt]                         ...
   
   
   All components access Auth Store:
   ──────────────────────────────────
   
   ┌─────────────────────┐
   │   AUTH STORE        │ ← authStore.user
   │   (Global State)    │ ← authStore.isAdmin
   │                     │ ← authStore.logout()
   └─────────────────────┘
            ▲
            │
   All components can access
```

## 🛡️ Security Layers

```
┌────────────────────────────────────────────┐
│  LEVEL 1: Route Guards                     │
│  • Check isAuthenticated                   │
│  • Check role matches route requirement    │
│  • Redirect if unauthorized                │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────▼───────────────────────┐
│  LEVEL 2: Token Validation                 │
│  • Access token attached to requests       │
│  • Backend validates JWT signature         │
│  • Backend checks expiration               │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────▼───────────────────────┐
│  LEVEL 3: Auto Refresh                     │
│  • Detect 401 responses                    │
│  • Auto-refresh with refresh token         │
│  • Logout if refresh fails                 │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────▼───────────────────────┐
│  LEVEL 4: Backend Authorization            │
│  • Django permissions                      │
│  • Role-based access                       │
│  • Resource-level permissions              │
└────────────────────────────────────────────┘
```

---

**Understanding this architecture will help you:**
- 🎯 Know where to add features
- 🐛 Debug issues faster
- 🚀 Build confidently
- 📚 Onboard team members

Refer to other documentation for implementation details!
