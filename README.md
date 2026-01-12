# DNSC Student Portal

A modern, professional student portal web application for Davao del Norte State College (DNSC), built with Vue.js and Tailwind CSS with a strong focus on frontend implementation.

## 🎯 Project Overview

This is a **frontend-only** implementation designed to integrate with backend APIs developed by a separate team. The portal serves as a centralized hub for students to access various systems and track their academic information.

## 🚀 Features

### Core Pages
- **Dashboard** - Overview of student activities, external systems summary, and quick stats
- **Profile** - Complete student information management with edit capabilities
- **Event Attendance** - Track attendance for institutional events and activities
- **Document Submissions** - View and manage submitted documents and requirements
- **Announcements** - Stay updated with institutional news and announcements
- **Academic Calendar** - Visual calendar with important dates and events
- **External Systems** - Unified access to integrated systems

### External System Integration (Frontend Views)
- **Collection Management System** - Fines and payment tracking
- **Voting System** - Elections and polls participation
- **Locker System** - Locker assignment and management
- **Attendance Management** - Event attendance tracking

### Design Features
- 🎨 Clean, professional academic aesthetic
- 💜 Purple (#640D5F) primary color theme
- 📱 Fully responsive design (desktop & tablet optimized)
- 🔔 Notifications system
- 👤 User profile management
- 🌐 Top navigation bar (student) with sidebar-ready structure for future admin dashboard

## 🛠️ Technology Stack

- **Frontend Framework**: Vue.js 3
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **Icons**: Heroicons (SVG)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

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

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
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
│   │   └── index.js       # Route definitions
│   ├── stores/            # Pinia stores
│   │   └── auth.js        # Authentication store
│   ├── utils/             # Utility functions
│   ├── views/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   │   ├── LoginView.vue
│   │   │   └── RegisterView.vue
│   │   ├── layouts/       # Layout components
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
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🎨 Color Palette

- **Primary Purple**: #640D5F
- **Secondary**: #D91656
- **Accent**: #EE66A6
- **Light**: #FFBFDD
- **Backgrounds**: Gray-50 to Gray-900 scale

## 🔌 Backend Integration

This frontend is designed to be **backend-agnostic** and ready for API integration.

### Mock Data
Currently using mock data in components. Replace with actual API calls in stores and components.

### API Endpoints (To be implemented by backend team)

**Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

**Student**
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `GET /api/student/dashboard` - Get dashboard data

**Attendance**
- `GET /api/attendance/events` - Get attendance records
- `GET /api/attendance/summary` - Get attendance summary

**Submissions**
- `GET /api/submissions` - Get document submissions
- `POST /api/submissions` - Upload document
- `GET /api/submissions/required` - Get required documents

**Announcements**
- `GET /api/announcements` - Get announcements
- `GET /api/announcements/:id` - Get single announcement

**Calendar**
- `GET /api/calendar/events` - Get calendar events
- `GET /api/calendar/academic-dates` - Get academic dates

**External Systems**
- `GET /api/systems/collection` - Collection system data
- `GET /api/systems/voting` - Voting system data
- `GET /api/systems/locker` - Locker system data
- `GET /api/systems/attendance` - Attendance system data

## 🔒 Authentication

The portal uses a token-based authentication system (ready for JWT):
- Login credentials are sent to the backend
- Received token is stored in localStorage
- Token is included in all authenticated API requests
- Automatic route protection based on authentication status

## 📱 Responsive Design

- **Desktop**: Optimized for 1024px and above
- **Tablet**: Optimized for 768px - 1023px
- **Mobile**: Basic support (can be enhanced if needed)

## 🎯 User Roles

Currently implements:
- **Student Role** - Full student portal access

Future-ready for:
- **Admin Role** - Admin dashboard with sidebar navigation

## 🧪 Testing Login

For development/testing purposes, any credentials will work with the mock authentication.

**Example Credentials:**
- Email: `any@email.com`
- Password: `anypassword`

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


