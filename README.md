# - wednesday progress
   1. Receipt modal overflow — now scrollable with max-h-[90vh]
   2. Sidebar initials 'U' → 'AA' — student fallback search added to fetchCurrentUser()
   3. Dashboard real fee data — replaced hardcoded fees with API data
   4. Dashboard loading state — skeleton loaders while data fetches
   5. Fees pagination — server-side with page controls
   6. Pay button → CMS redirect — opens Collection Management System (URL configurable via VITE_CMS_URL in .env)


# DNSC Student Portal

A modern, professional student portal web application for Davao del Norte State College (DNSC), built with Vue.js and Tailwind CSS. Now fully integrated with the DNSC Systems API backend using JWT authentication.

## 🎯 Project Overview

This portal serves as a centralized hub for students and administrators to access various systems and manage academic information. It features complete authentication integration with role-based access control.

## ✨ Latest Updates (January 2026)

### 🔐 Authentication System
- ✅ **JWT Token Authentication** - Secure login with access/refresh tokens
- ✅ **Google OAuth Integration** - Sign in with Google
- ✅ **Auto Token Refresh** - Seamless session management
- ✅ **Role-Based Access** - Separate interfaces for students and admins
- ✅ **API Integration Layer** - Axios interceptors for authenticated requests

### 👨‍💼 Admin Portal
- ✅ **Admin Dashboard** - Statistics and quick actions
- ✅ **Student Management** - Manage student accounts
- ✅ **Events Management** - Create and manage events
- ✅ **Announcements** - Post and manage announcements
- ✅ **Attendance Upload** - Bulk upload attendance records

## 🚀 Features

### Authentication & Authorization
- **Unified Login** - Single login page for both students and admins
- **Google Sign-In** - Quick authentication with Google accounts
- **Auto-Redirect** - Role-based routing (admin → `/admin`, student → `/`)
- **Session Management** - Automatic token refresh on expiration
- **Secure Logout** - Complete token cleanup

### Student Portal
- **Dashboard** - Overview of activities and external systems
- **Profile Management** - View and edit student information
- **Event Attendance** - Track attendance for events
- **Document Submissions** - Submit and track documents
- **Announcements** - View institutional updates
- **Academic Calendar** - Important dates and events
- **External Systems** - Access to Collection, Voting, Locker systems

### Admin Portal
- **Dashboard** - System statistics and overview
- **Student Management** - CRUD operations for students
- **Events Management** - Create and manage attendance events
- **Announcements** - Create and publish announcements
- **Attendance Upload** - Bulk upload attendance data

### Design Features
- 🎨 Clean, professional academic aesthetic
- 💜 Purple (#640D5F) primary color theme
- 📱 Fully responsive design
- 🔔 Notifications system
- 👤 User profile management
- 🔒 Protected routes with role-based guards

## 🛠️ Technology Stack

- **Frontend Framework**: Vue.js 3 (Composition API)
- **Styling**: Tailwind CSS 4
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Build Tool**: Vite 7
- **Icons**: Heroicons (SVG)
- **Authentication**: JWT + Google OAuth

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- **Internet connection** (to access production API)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/TipTopMaestro/IC-Student-Portal.git
   cd IC-Student-Portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment is ready!**
   The `.env` file is already configured to use the **production API**:
   ```env
   VITE_API_BASE_URL=https://dnsc-systems-api.onrender.com/
   VITE_APP_NAME=Student Portal
   VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
   ```
   
   ✅ **No backend setup needed!**

4. **Run development server**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:5173/`

5. **Get test credentials**
   Contact the backend team for test user credentials

6. **Build for production**
   ```bash
   npm run build
   ```

7. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
dnsc-student-portal/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Stylesheets and images
│   │   └── main.css       # Main Tailwind CSS file
│   ├── components/        # Reusable Vue components
│   │   └── common/        # Common UI components
│   ├── composables/       # Vue composables (hooks)
│   ├── router/            # Vue Router configuration
│   │   └── index.js       # Route definitions & guards
│   ├── services/          # API service layer
│   │   ├── api.js         # Axios instance with interceptors
│   │   └── authService.js # Authentication API calls
│   ├── stores/            # Pinia stores
│   │   └── auth.js        # Authentication store (JWT)
│   ├── utils/             # Utility functions
│   ├── views/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   │   └── LoginView.vue
│   │   ├── admin/         # Admin portal pages
│   │   │   ├── DashboardView.vue
│   │   │   ├── StudentsView.vue
│   │   │   ├── EventsView.vue
│   │   │   ├── AnnouncementsView.vue
│   │   │   └── AttendanceView.vue
│   │   ├── layouts/       # Layout components
│   │   │   ├── AdminLayout.vue
│   │   │   └── StudentLayout.vue
│   │   └── student/       # Student portal pages
│   │       ├── DashboardView.vue
│   │       ├── ProfileView.vue
│   │       ├── AttendanceView.vue
│   │       ├── SubmissionsView.vue
│   │       ├── AnnouncementsView.vue
│   │       ├── CalendarView.vue
│   │       └── ExternalSystemsView.vue
│   ├── App.vue            # Root component
│   └── main.js            # Application entry point
├── sample/                # Reference implementations
│   ├── dnsc_systems_api/  # Backend API reference
│   └── collection_management_system/
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.js         # Vite configuration
├── AUTHENTICATION_GUIDE.md # Complete auth documentation
└── README.md              # This file
```

## 🎨 Color Palette

- **Primary Purple**: #640D5F
- **Secondary**: #D91656
- **Accent**: #EE66A6
- **Light**: #FFBFDD
- **Backgrounds**: Gray-50 to Gray-900 scale

## 🔌 Backend Integration

✅ **Authentication system fully integrated with DNSC Systems API**

### Production API (Default)

The backend is already deployed and accessible:
```
Base URL: https://dnsc-systems-api.onrender.com/

Documentation:
- Swagger: https://dnsc-systems-api.onrender.com/api/docs/swagger/
- ReDoc: https://dnsc-systems-api.onrender.com/api/docs/redoc/
```

See [PRODUCTION_API_READY.md](./PRODUCTION_API_READY.md) for complete production API guide.

### API Endpoints

**Authentication** (✅ Integrated)
- `POST /api/v1/login/` - User login (JWT tokens)
- `POST /api/v1/token/refresh/` - Refresh access token
- `POST /api/v1/auth/google/` - Google OAuth login
- `GET /api/v1/me/` - Get current user

**Students** (✅ Backend Ready)
- `GET /api/v1/students/` - List students
- `POST /api/v1/students/` - Create student
- `GET /api/v1/students/:id/` - Get student details
- `PATCH /api/v1/students/:id/` - Update student
- `DELETE /api/v1/students/:id/` - Delete student

**Events** (✅ Backend Ready)
- `GET /api/v1/attendance-events/` - List events
- `POST /api/v1/attendance-events/` - Create event
- `GET /api/v1/attendance-events/:id/` - Get event details
- `PATCH /api/v1/attendance-events/:id/` - Update event
- `DELETE /api/v1/attendance-events/:id/` - Delete event

**Attendance** (✅ Backend Ready)
- `GET /api/v1/attendance-records/` - List attendance records
- `POST /api/v1/attendance-records/` - Create attendance record
- `GET /api/v1/attendance-records/:id/` - Get record details

**Announcements** (🔨 To Be Created)
- `GET /api/v1/announcements/` - List announcements
- `POST /api/v1/announcements/` - Create announcement
- `GET /api/v1/announcements/:id/` - Get announcement details
- `PATCH /api/v1/announcements/:id/` - Update announcement
- `DELETE /api/v1/announcements/:id/` - Delete announcement

### Making API Calls

```javascript
import api from '@/services/api'

// GET request
const students = await api.get('api/v1/students/')

// POST request
await api.post('api/v1/students/', {
  first_name: 'Juan',
  last_name: 'Dela Cruz',
  email: 'juan@dnsc.edu.ph'
})

// Tokens are automatically attached via interceptor
// Auto-refresh on 401 errors
```

## 🔒 Authentication

✅ **JWT Token Authentication Fully Implemented**

### Features:
- ✅ Login with username/password
- ✅ Login with Google OAuth
- ✅ Automatic token refresh
- ✅ Role-based routing (admin/student)
- ✅ Protected routes with guards
- ✅ Secure token storage

### User Roles:
- **Student** - Access to student portal (`/`)
- **Admin** - Access to admin portal (`/admin`)

Auto-detection based on:
- User groups containing "Admin"
- `is_staff` or `is_superuser` flags

## 🧪 Testing

### With Backend API Running:

1. Start the backend at `http://127.0.0.1:8000/`
2. Create test users in Django admin:
   - **Admin**: username=`admin`, add to "Admin" group
   - **Student**: username=`student@dnsc.edu.ph`, regular user
3. Start frontend: `npm run dev`
4. Login at `http://localhost:5173/login`

### Mock Testing (Without Backend):

The app will show API connection errors but the UI can still be explored.

## 📱 Responsive Design

- **Desktop**: Optimized for 1024px and above
- **Tablet**: Optimized for 768px - 1023px
- **Mobile**: Basic support for 375px - 767px

## 🤝 Contributing

This project is maintained by the DNSC Development Team.

## 📝 Notes for Backend Team

1. All API calls are marked with `TODO:` comments in the code
2. Mock data structures match expected API response formats
3. Error handling is implemented but needs actual error messages from API
4. File upload functionality (submissions) needs backend endpoint
5. Real-time notifications would require WebSocket implementation

## 🔗 External Systems

The portal displays summary information from:
- Collection Management System (handled by separate team)
- Voting System (handled by separate team)
- Locker System (handled by separate team)
- Attendance Management System (handled by separate team)

"Open System" buttons are placeholders for links to actual external system URLs.

## 📄 License

MIT License - Feel free to use this project for educational purposes.

## 👥 Team

**Frontend Development**: IC Department Team
**Backend Development**: Separate Backend Team (APIs & Database)

---

**Built with ❤️ for Davao del Norte State College**


