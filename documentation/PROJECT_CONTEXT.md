# Project Context — IC Student Portal

> **Purpose**: This file acts as the context bridge for the separate documentation repository (`IC-Student-Portal-Docs`). It snapshots the application structure, endpoints, routes, and environment variables so documentation writers maintain full application context without needing the source repository attached.
>
> **Application Repository**: `https://github.com/TipTopMaestro/IC-Student-Portal`
> **Last Snapshot Date**: August 2026

---

## 1. Application Overview
The **IC Student Portal** is a web application for the Institute of Computing at Davao del Norte State College (DNSC). It provides single-page application (SPA) interfaces for **Students** and **Administrators** to manage academic records, attendance, fees, and community announcements.

* **Frontend Tech Stack**: Vue 3 (Composition API, `<script setup>`), Vite 7, Tailwind CSS 4 (`ic-` brand palette), Pinia, Vue Router 4, Axios, Google OAuth 2.0.
* **Backend API**: Django REST Framework (`DNSC Systems API`).
* **Hosting**: Cloudflare Edge Proxy + cPanel Apache Hosting + GitHub Actions CI/CD.

---

## 2. Environment Variables

| Variable | Required | Description |
|---|:---:|---|
| `VITE_API_BASE_URL` | Yes | Backend REST API base endpoint (e.g. `http://localhost:8000`) |
| `VITE_GOOGLE_CLIENT_ID` | Yes | Google OAuth 2.0 Client ID |
| `VITE_VOTING_SYSTEM_URL` | Optional | IC Voting System link |
| `VITE_CMS_URL` | Optional | DNSC CMS link |
| `VITE_LOCKER_SYSTEM_URL` | Optional | IC Locker System link |

---

## 3. Route Registry & Access Control

| Path | Layout | Required Role | Description |
|---|---|:---:|---|
| `/login` | Public | Guest | User login page |
| `/auth/callback` | Public | Guest | Google OAuth callback handler |
| `/student/dashboard` | `StudentLayout` | Student | Student summary view |
| `/student/attendance` | `StudentLayout` | Student | AM/PM event attendance history |
| `/student/fees` | `StudentLayout` | Student | Fee obligations & receipts |
| `/student/posts` | `StudentLayout` | Student | Campus announcements & social feed |
| `/student/calendar` | `StudentLayout` | Student | Academic calendar |
| `/admin/dashboard` | `AdminLayout` | Admin | Administrative metrics |
| `/admin/students` | `AdminLayout` | Admin | Student directory search & profile modals |
| `/admin/events` | `AdminLayout` | Admin | Event creation & bulk CSV attendance upload |
| `/admin/posts` | `AdminLayout` | Admin | Announcement publishing & moderation |

---

## 4. API Endpoints Map

| Domain | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | POST | `/api/v1/auth/login/` | Password authentication |
| **Auth** | POST | `/api/v1/auth/google/` | Google OAuth token swap |
| **Auth** | POST | `/api/v1/auth/token/refresh/` | JWT access token refresh |
| **Auth** | GET | `/api/v1/me/` | Current user profile details |
| **Students** | GET | `/api/v1/students/` | Paginated student directory |
| **Students** | GET | `/api/v1/students/:id/` | Individual student details |
| **Attendance** | GET | `/api/v1/attendance-events/` | Active & past attendance events |
| **Attendance** | POST | `/api/v1/attendance-records/bulk-upload/` | Bulk CSV attendance upload |
| **Fees** | GET | `/api/v1/fees/my-obligations/` | Student fee breakdown |
| **Posts** | GET | `/api/v1/posts/` | Published announcements feed |
| **Posts** | POST | `/api/v1/posts/` | Publish new post (Admin) |
| **Posts** | POST | `/api/v1/posts/:id/reactions/` | Toggle post reaction |

---

## 5. Primary Component Map

* **Layout Wrappers**: `StudentLayout.vue`, `AdminLayout.vue`
* **Post System (`src/components/posts/`)**: `PostCard.vue`, `PostFeedItem.vue`, `CommentSection.vue`, `ReactionPicker.vue`, `ImageUploader.vue`, `CategoryBadge.vue`, `PostModal.vue`
* **Auth Store (`src/stores/auth.js`)**: Manages `accessToken`, `refreshToken`, `user`, getters (`isAuthenticated`, `isAdmin`, `isStudent`), and actions (`login`, `loginWithGoogle`, `logout`).
