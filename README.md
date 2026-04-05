# DNSC Student Portal

A student portal for Davao del Norte State College (DNSC) built with Vue 3 and Tailwind CSS. It connects to the [DNSC Systems API](https://dnsc-systems-api.onrender.com/api/docs/swagger/) for authentication, student records, fees, attendance, and more.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- npm (comes with Node.js)

### Setup

```bash
git clone https://github.com/TipTopMaestro/IC-Student-Portal.git
cd IC-Student-Portal
npm install
```

Copy or edit the `.env` file in the project root:

```env
VITE_API_BASE_URL=https://dnsc-systems-api.onrender.com
VITE_APP_NAME=Student Portal
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_USE_MOCK_API=false
VITE_CMS_URL=http://localhost:5174
```

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL. Requests are proxied through Vite during development to avoid CORS issues. |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID for the "Sign in with Google" button. |
| `VITE_USE_MOCK_API` | Set to `true` to use built-in mock data instead of the real API. |
| `VITE_CMS_URL` | URL for the Collection Management System (payment redirect). |

### Run

```bash
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview the production build locally
```

> The backend is hosted on Render's free tier, so the first request after a period of inactivity may take up to 2 minutes while the server spins up.

## Features

### Student Portal (`/`)

- **Dashboard** — Fee summary, quick links to external systems, skeleton loading states
- **Profile** — View student information pulled from the API
- **Fees** — Paginated fee list with receipt modal; "Pay" redirects to the CMS
- **Attendance** — View attendance records for events
- **Announcements** — Institutional updates
- **Calendar** — Academic calendar and important dates
- **External Systems** — Links to Collection, Voting, Locker, and Attendance systems

### Admin Portal (`/admin`)

- **Dashboard** — System-wide statistics and quick actions
- **Students** — CRUD management of student accounts
- **Events** — Create and manage attendance events
- **Announcements** — Publish and manage announcements
- **Attendance** — Bulk upload attendance records
- **Profile** — Admin profile view

### Authentication

- JWT login with automatic token refresh (access + refresh tokens)
- Google OAuth sign-in
- Role-based routing — admins are redirected to `/admin`, students to `/`
- Route guards prevent unauthorized access
- Session expiry detection with automatic redirect to login

Role detection is based on the user's `groups` (containing "Admin") or the `is_staff`/`is_superuser` flags from the API.

## Project Structure

```
src/
├── config/api.js            # API base URL, endpoints, timeouts
├── services/
│   ├── api.js               # Axios instance with auth interceptors
│   ├── authService.js       # Login, logout, token refresh
│   ├── studentService.js    # Student CRUD calls
│   ├── feeService.js        # Fee and payment queries
│   ├── eventService.js      # Attendance event calls
│   └── announcementService.js
├── stores/auth.js           # Pinia auth store (JWT state)
├── router/index.js          # Routes and navigation guards
├── views/
│   ├── auth/LoginView.vue
│   ├── layouts/             # AdminLayout, StudentLayout (sidebar + topbar)
│   ├── admin/               # Admin page components
│   └── student/             # Student page components
└── assets/main.css          # Tailwind entry point
```

## API Reference

The frontend talks to the DNSC Systems API. All requests go through the Axios instance in `src/services/api.js`, which handles Bearer token injection and automatic refresh on 401 responses.

| Area | Endpoints |
|---|---|
| Auth | `POST /api/v1/login/`, `POST /api/v1/token/refresh/`, `POST /api/v1/auth/google/`, `GET /api/v1/me/` |
| Students | `GET/POST /api/v1/students/`, `GET/PATCH/DELETE /api/v1/students/:id/` |
| Fees | `GET /api/v1/fees/?student_id=`, `GET /api/v1/fees/:id/`, `GET/POST /api/v1/payment-submissions/` |
| Events | `GET/POST /api/v1/attendance-events/`, `GET/PATCH/DELETE /api/v1/attendance-events/:id/` |
| Attendance | `GET/POST /api/v1/attendance-records/`, `POST /api/v1/attendance-records/upload/` |


Full API docs: [Swagger](https://dnsc-systems-api.onrender.com/api/docs/swagger/) · [ReDoc](https://dnsc-systems-api.onrender.com/api/docs/redoc/)

## Tech Stack

| | |
|---|---|
| Framework | Vue 3 (Composition API) |
| Styling | Tailwind CSS 4 |
| State | Pinia |
| Routing | Vue Router 4 |
| HTTP | Axios |
| Build | Vite 7 |
| Auth | JWT + Google OAuth |

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `ic-primary` | `#640D5F` | Main purple, sidebar, buttons |
| `ic-secondary` | `#D91656` | Accents and highlights |
| `ic-accent` | `#EE66A6` | Hover states, badges |
| `ic-light` | `#FFBFDD` | Light backgrounds, tags |

## License

MIT
