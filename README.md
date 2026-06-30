# IC Student Portal

A web-based student portal for the Institute of Computing at Davao del Norte State College. Built with Vue 3, Tailwind CSS 4, and Vite.

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

<!-- 
Add screenshots here once available:
![Dashboard Screenshot](docs/screenshots/dashboard.png)
-->

## Overview

This portal provides students and administrators with tools to manage fees, attendance, events, and announcements. It connects to the [DNSC Systems API](https://dnsc-systems-api.onrender.com/api/docs/swagger/) for backend services.

**Key highlights:**
- Role-based access (student vs admin views)
- JWT authentication with Google OAuth option
- Real-time data from the DNSC Systems API
- Mobile-responsive design

## Quick Start

```bash
# Clone and install
git clone https://github.com/TipTopMaestro/IC-Student-Portal.git
cd IC-Student-Portal
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** The backend runs on Render's free tier. First request after inactivity may take ~2 minutes for cold start.

## Features

### Student Portal

- **Dashboard** — Fee summary, attendance stats, upcoming events
- **Profile** — View personal and academic info
- **Fees** — Payment history, receipts, CMS redirect for payments
- **Attendance** — Event attendance records with AM/PM tracking
- **Calendar** — Academic calendar with event markers
- **Announcements** — Institutional updates
- **External Systems** — Links to Collection, Voting, Locker systems

### Admin Portal

- **Dashboard** — System statistics and quick actions
- **Students** — Search and view student records
- **Events** — Manage attendance events
- **Announcements** — Create and manage announcements
- **Attendance** — Bulk upload attendance records

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Vue 3 (Composition API) |
| Styling | Tailwind CSS 4 |
| State | Pinia |
| Routing | Vue Router 4 |
| HTTP | Axios |
| Build | Vite 7 |
| Auth | JWT + Google OAuth |

## Project Structure

```
src/
├── config/api.js          # API configuration
├── services/              # API service modules
│   ├── api.js             # Axios instance
│   ├── authService.js
│   ├── studentService.js
│   ├── feeService.js
│   ├── eventService.js
│   └── announcementService.js
├── stores/auth.js         # Pinia store
├── router/index.js        # Routes and guards
├── views/
│   ├── admin/             # Admin pages
│   ├── student/           # Student pages
│   ├── auth/              # Login
│   └── layouts/           # Layout components
└── assets/main.css        # Tailwind entry
```

## Environment Variables

```env
VITE_API_BASE_URL=https://dnsc-systems-api.onrender.com
VITE_APP_NAME=Student Portal
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_CMS_URL=http://localhost:5174
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `VITE_CMS_URL` | Collection Management System URL |

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```

## API Endpoints

The portal uses these main endpoints from the DNSC Systems API:

| Area | Endpoints |
|------|-----------|
| Auth | `/api/v1/login/`, `/api/v1/token/refresh/`, `/api/v1/auth/google/`, `/api/v1/me/` |
| Students | `/api/v1/students/`, `/api/v1/students/:id/` |
| Fees | `/api/v1/fees/`, `/api/v1/payment-submissions/` |
| Events | `/api/v1/attendance-events/`, `/api/v1/attendance-records/` |
| Announcements | `/api/v1/announcements/` |

Full API documentation: [Swagger](https://dnsc-systems-api.onrender.com/api/docs/swagger/) | [ReDoc](https://dnsc-systems-api.onrender.com/api/docs/redoc/)

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `ic-primary` | #640D5F | Sidebar, primary buttons |
| `ic-secondary` | #D91656 | Accents |
| `ic-accent` | #EE66A6 | Hover states |
| `ic-light` | #FFBFDD | Light backgrounds |

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Team

Built by the **Institute of Computing Student Association (ICSA)**:

- Froyd Carbajosa
- Monch Quines
- Rafael Villar
- Arl Christopher Suaybaguio

## License

MIT
