# Posts Feature — Comprehensive Implementation Plan

> **Created:** April 18, 2026  
> **Last Updated:** April 19, 2026  
> **Scope:** End-to-end Posts feature for Admin + Student portals  
> **Strategy:** Posts-focused, no infrastructure detours  
> **Estimated Total Effort:** ~3–4 days

---

## Current State Audit

### What's Done ✅
| Component | Status | Location |
|-----------|--------|----------|
| Post Service (CRUD) | ✅ Working (field name fixed) | `src/services/postService.js` |
| Admin Posts Page (feed layout) | ✅ Working | `src/views/admin/PostsView.vue` |
| Admin Create/Edit/Delete Posts | ✅ Working | `src/components/posts/PostModal.vue` |
| Image Upload (drag & drop) | ✅ Working | `src/components/posts/ImageUploader.vue` |
| Post Feed Item Component | ✅ Working | `src/components/posts/PostFeedItem.vue` |
| Admin Dashboard Posts Feed | ✅ Working | `src/views/admin/DashboardView.vue` |
| Media Carousel (scroll-snap) | ✅ Working | Inside PostFeedItem + PostsView |
| Delete Confirmation Modal | ✅ Working | `src/components/posts/DeleteConfirmModal.vue` |

### What's Missing ❌
| Feature | Notes |
|---------|-------|
| ~~Student Posts page~~ | ✅ Done — `src/views/student/PostsView.vue` |
| ~~Student route `/posts`~~ | ✅ Done — renamed from `/announcements` |
| ~~Student nav labels~~ | ✅ Done — updated in mobile menu + sidebar |
| ~~Student Dashboard posts~~ | ✅ Done — shows recent public posts |
| Reactions (heart) | Placeholder counts shown, no interactivity |
| Comments | Placeholder count (`0`), no comment system |
| Toggle comments | `disable_comments` in form but not wired as post action |
| ~~Visibility filtering~~ | ✅ Done — client-side filter for `public` only |

---

## Backend API Reference (Complete)

### Posts CRUD
| Method | Endpoint | Schema |
|--------|----------|--------|
| `GET` | `/api/v1/posts/` | → `PaginatedPostFeedList` |
| `POST` | `/api/v1/posts/` | ← `PostCreate` (multipart, field: `uploaded_files`) |
| `GET` | `/api/v1/posts/{id}/` | → `PostDetail` |
| `PUT` | `/api/v1/posts/{id}/` | ← `PostUpdate` (multipart) |
| `PATCH` | `/api/v1/posts/{id}/` | ← `PatchedPostUpdate` (multipart) |
| `DELETE` | `/api/v1/posts/{id}/` | → 204 |

### Post Reactions
| Method | Endpoint | Notes |
|--------|----------|-------|
| `POST` | `/api/v1/posts/{id}/react/` | Body: `{ "type": "heart" }` |
| `GET` | `/api/v1/posts/{id}/reactions/` | Returns reaction details |
| `DELETE` | `/api/v1/posts/{id}/remove_react/` | Removes your reaction |

### Post Comments
| Method | Endpoint | Notes |
|--------|----------|-------|
| `GET` | `/api/v1/posts_comments/?post_id={id}` | List comments for a post |
| `POST` | `/api/v1/posts_comments/` | Body: `{ post, content, parent_comment? }` |
| `GET` | `/api/v1/posts_comments/{id}/` | Single comment with `replies` |
| `PUT` | `/api/v1/posts_comments/{id}/` | Body: `{ content }` |
| `PATCH` | `/api/v1/posts_comments/{id}/` | Partial update |
| `DELETE` | `/api/v1/posts_comments/{id}/` | → 204 |
| `GET` | `/api/v1/posts_comments/{id}/replies/` | Get nested replies |
| `POST` | `/api/v1/posts_comments/{id}/react/` | React to comment |
| `GET` | `/api/v1/posts_comments/{id}/reactions/` | Comment reactions |
| `DELETE` | `/api/v1/posts_comments/{id}/remove_react/` | Remove comment reaction |

### Other
| Method | Endpoint | Notes |
|--------|----------|-------|
| `PATCH` | `/api/v1/posts/{id}/toggle_comments/` | Toggle `disable_comments` |

### Visibility
- `VisibilityEnum`: `public`, `followers`, `private`
- **No server-side visibility filter** on `GET /posts/` — must filter client-side for students
- Students should only see `visibility: 'public'` posts

### Key Schema Fields

**PostFeed** (list item): `id`, `institute`, `user_id`, `user_name`, `content`, `visibility`, `media[]`, `reaction_counts`, `comments_count`

**PostCommentList**: `id`, `post`, `user`, `content`, `created_at`, `reply_count`, `reaction_counts`

**PostCommentDetail**: `id`, `user`, `replies`, `content`, `created_at`, `updated_at`, `post`, `parent_comment`

**PostCommentCreate**: `post` (required), `content` (required), `parent_comment` (nullable)

### Design Decisions
- Admin can delete any comment on any post
- Reactions are Instagram-style (heart only)
- Comments support full nested replies (max 2 levels deep)
- User reaction state: optimistic UI (no `user_reaction` field confirmed in API)

---

## Implementation Phases

### Phase 1: Student Posts Feed + Route Rename ✅
**Effort:** ~2–3 hours | **Impact:** 🔴 Critical  
**Status:** ✅ Complete (April 19, 2026)

- [x] Rename route `/announcements` → `/posts` in `router/index.js`
- [x] Update student nav in `StudentLayout.vue` (mobile menu, sidebar, icon)
- [x] Create `src/views/student/PostsView.vue` (public posts only, no CRUD)
- [x] Delete `src/views/student/AnnouncementsView.vue`
- [x] Delete `src/services/announcementService.js`
- [x] Clean deprecated endpoints from `src/config/api.js`

### Phase 2: Instagram-Style Reactions (Heart) ✅
**Effort:** ~3–4 hours | **Impact:** 🟡 High  
**Status:** ✅ Complete (April 19, 2026)

- [x] Add `reactToPost`, `removeReaction` to postService.js
- [x] Update PostFeedItem — interactive heart (toggle, pop animation, double-tap on image)
- [x] Optimistic UI for reaction state with rollback on failure
- [x] Heart burst animation on double-tap
- [x] Apply to both admin and student feeds via shared PostFeedItem

### Phase 3: Full Nested Comment System ✅
**Effort:** ~5–7 hours | **Impact:** 🟡 High  
**Status:** ✅ Complete (April 19, 2026)

- [x] Create `src/services/commentService.js` (CRUD + replies)
- [x] Create `src/components/posts/CommentSection.vue` (expandable, input with reply indicator)
- [x] Create `src/components/posts/CommentItem.vue` (recursive, max 1 level nested)
- [x] Integrate CommentSection into PostFeedItem
- [x] Comment CRUD (add, edit inline, delete with confirm)
- [x] Nested replies (lazy-loaded via GET /replies/)
- [x] Admin can delete any comment
- [x] Disabled comments state respected

### Phase 4: Admin Refinements ✅
**Effort:** ~1–2 hours | **Impact:** 🟢 Polish  
**Status:** ✅ Complete (April 19, 2026)

- [x] Toggle comments action in post options menu
- [x] Refactor admin PostsView to use shared PostFeedItem (reduced ~513 → ~220 lines)
- [x] Visibility badge (🌐/🔒) in post header for admin
- [x] `togglePostComments` API method added to postService

### Phase 5: Student Dashboard Integration ✅
**Effort:** ~1–2 hours | **Impact:** 🟢 Completeness  
**Status:** ✅ Complete (April 19, 2026)

- [x] Replace "Coming soon" announcements with recent posts feed
- [x] Import PostFeedItem, filter for public posts
- [x] Loading/empty states

### Phase 6: Cleanup & Documentation ✅
**Effort:** ~1 hour | **Impact:** 🟢 Maintenance  
**Status:** ✅ Complete (April 19, 2026)

- [x] No "announcements" references remain in src/ code
- [x] Legacy files deleted (AnnouncementsView.vue, announcementService.js)
- [x] Deprecated API config entries removed
- [x] Implementation plan updated with all phases marked complete

---

## Final File Changes Summary

### New Files Created
| File | Purpose |
|------|---------|
| `src/views/student/PostsView.vue` | Student posts feed (public only) |
| `src/services/commentService.js` | Comments CRUD + replies API |
| `src/components/posts/CommentSection.vue` | Expandable comment list + input |
| `src/components/posts/CommentItem.vue` | Recursive comment with edit/delete/replies |

### Files Modified
| File | Changes |
|------|---------|
| `src/services/postService.js` | Fixed `uploaded_files` field, added `reactToPost`, `removeReaction`, `togglePostComments` |
| `src/components/posts/PostFeedItem.vue` | Full rewrite: interactive heart, comments integration, double-tap, toggle comments |
| `src/views/admin/PostsView.vue` | Refactored to use shared PostFeedItem (513 → 220 lines) |
| `src/views/student/DashboardView.vue` | Replaced "Coming soon" with recent posts feed |
| `src/views/layouts/StudentLayout.vue` | Nav: "Announcements" → "Posts" (2 locations) |
| `src/router/index.js` | Route: `/announcements` → `/posts` |
| `src/config/api.js` | Removed deprecated announcement endpoints |

### Files Deleted
| File | Reason |
|------|--------|
| `src/views/student/AnnouncementsView.vue` | Replaced by PostsView |
| `src/services/announcementService.js` | Replaced by postService |

**Legend:** ⬜ Not Started | ⏳ In Progress | ✅ Complete
