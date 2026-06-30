# GEMINI.md - IC Student Portal Context

This document provides architectural overview, development conventions, and operational instructions for the IC Student Portal project.

## Project Overview
The **IC Student Portal** is a web-based management system for the Institute of Computing at Davao del Norte State College. It provides role-based access for students and administrators to manage academic records, attendance, fees, and announcements.

- **Frontend:** Vue 3 (Composition API, `script setup`)
- **Build System:** Vite 7
- **Styling:** Tailwind CSS 4 (Custom `ic-` color palette)
- **State Management:** Pinia
- **Routing:** Vue Router 4 (Role-based guards)
- **HTTP Client:** Axios (Custom interceptors for JWT/Auth)
- **Authentication:** JWT + Google OAuth 2.0

## Directory Structure
- `src/config/`: Application-wide configuration (API endpoints, constants).
- `src/services/`: API service layer.
- `src/stores/`: Pinia state management (Auth, etc.).
- `src/views/`: Page components, split into `admin/`, `student/`, and `auth/`.
- `src/components/`: Reusable UI components, organized by feature (e.g., `posts/`).
- `docs/`: Feature plans, implementation guides, and security audits.

## Building and Running
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Conventions

### 1. API & Services
- All HTTP requests should go through `src/services/api.js`.
- The `api.js` interceptor handles:
    - Automatically attaching the `Authorization: Bearer <token>` header.
    - Queueing failed requests during token refresh to prevent race conditions.
    - Dispatching `auth:session-expired` events on 401 failures.
- Use Service modules for feature-specific logic (e.g., `postService.js`).

### 2. State Management (Pinia)
- Use Pinia stores for shared state (Auth, User profile).
- Prefer reactive flags (e.g., `hasToken`) to ensure computed properties like `isAuthenticated` react correctly to `localStorage` changes.

### 3. Routing & Guards
- Defined in `src/router/index.js`.
- Routes are guarded by `requiresAuth` and `role` (`admin` or `student`).
- The router guard ensures students cannot access `/admin` and admins are redirected from `/` to `/admin`.

### 4. Styling
- Use Tailwind CSS 4 utility classes.
- Use the custom `ic-` color palette defined in `tailwind.config.js`:
    - `ic-primary`: `#640D5F`
    - `ic-secondary`: `#D91656`
    - `ic-accent`: `#EE66A6`
    - `ic-light`: `#FFBFDD`

### 5. Coding Style
- Prefer `script setup` in Vue components.
- Use absolute imports with the `@` alias (e.g., `@/components/...`).
- Keep components focused and use Composables for reusable logic.

## Environment Variables
Ensure a `.env` file exists based on `.env.example`:
- `VITE_API_BASE_URL`: Target backend URL.
- `VITE_GOOGLE_CLIENT_ID`: OAuth client ID.
