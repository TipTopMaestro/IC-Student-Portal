# Posts Feature Implementation Plan (Task 1.1)

> **Created:** April 7, 2026  
> **Last Updated:** April 8, 2026  
> **Status:** ⚠️ Blocked by Backend Bug  
> **Priority:** 🔴 BLOCKING

---

## Problem Statement

Transform the existing "Announcements" feature into an Instagram-style "Posts" feature where admins can create posts (with or without images) that display in a feed layout visible to both admin and student dashboards.

---

## 🚨 KNOWN ISSUE: Backend Not Processing Media Uploads

**Status:** Waiting for backend fix

**Issue:** The frontend correctly sends image files via `multipart/form-data` to `POST /api/v1/posts/`, but the backend does not process them. The file is received (visible in request payload as `media: (binary)`) but ignored.

**Evidence:**
- Request Payload shows: `content`, `visibility`, `disable_comments`, `media: (binary)` ✅
- Response (201) returns: `content`, `visibility`, `disable_comments`, `shared_post` (NO `media`)
- Subsequent GET shows the post with `media: []`

**Note:** Posts 1 and 2 in the database DO have media - they were created through a different method (possibly direct API/admin panel). This confirms the display code works correctly.

**Backend TODO:**
1. Fix POST `/api/v1/posts/` to process `media` field from `multipart/form-data`
2. Upload files to Cloudinary and create media records
3. Return the created media in the response
4. Add `created_at` timestamp to post responses

---

## Changes Made

### April 8, 2026 - Additional Fixes

#### Video Support
- Added support for video media (`media_type === 'video'`)
- Videos render with `<video>` tag with controls, images with `<img>` tag

#### Image Display Fixes
- Enhanced HTTPS normalization in both `PostsView.vue` and `PostFeedItem.vue`
- Added `getMediaUrl()` helper function that explicitly normalizes each media URL
- Added `@error` handler on images to gracefully handle load failures

#### Layout Improvements
- Changed feed alignment from **centered** to **start-aligned** (removed `mx-auto`)
- Feed now displays at the start of the content area (left-aligned on desktop)
- Consistent max-width of `max-w-xl` (576px) maintained for readability

#### Profile Picture Integration
- Admin sidebar now shows **actual profile picture** if available from user data
- Post author avatars attempt to use current user's profile when they're the author
- Fallback to gradient avatars with initials when no profile picture exists
- Profile pictures are checked from multiple possible fields: `profile_picture`, `avatar`, `photo`, `profile_image`

#### Timestamp Handling
- Posts now show "Recently" when `created_at` is not returned by the API
- Note: Backend should add `created_at` field to posts endpoint for proper timestamps

### April 7, 2026 - Initial Implementation

#### Bug Fixes
- **Modal not closing after post creation**: Fixed timing issue where `isSubmitting` flag blocked modal close
- **Images not displaying**: Added HTTPS normalization for Cloudinary URLs (HTTP → HTTPS)

#### UI Redesign
- Changed from grid layout to **feed layout** (max-width 576px, Instagram-style)
- Replaced header button with **floating action button** (bottom-right)
- Added **gradient avatars** (purple-to-pink) with fallback to profile pictures
- Improved **relative timestamps** (Just now, 5m, 2h, 3d, 2w, Apr 7)
- Added **expandable content** with "Read more" for long posts
- Cleaner dropdown menus with simpler text labels

---

## Backend API Reference

- **Base URL:** `/api/v1/posts/`
- **Single Post:** `/api/v1/posts/{id}/`

### List Posts Response
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "current_page": 1,
    "per_page": 10,
    "total_pages": 1,
    "total_items": 6,
    "data": [
      {
        "id": 1,
        "institute": 1,
        "user_id": 1,
        "user_name": "Alex Aparece",
        "content": "Post content...",
        "visibility": "public",
        "disable_comments": false,
        "media": [
          {
            "id": 1,
            "media_type": "image",
            "media_url": "http://cloudinary.../image.jpg",
            "order_index": 0
          }
        ],
        "reaction_counts": { "like": 0, "heart": 0, "haha": 0, "angry": 0 }
      }
    ]
  }
}
```

### Single Post Response
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "institute": 1,
    "user_id": 1,
    "content": "Post content...",
    "disable_comments": false,
    "visibility": "public",
    "shared_post": null,
    "shared_post_details": null,
    "media": [...],
    "reaction_counts": null
  }
}
```

---

## Scope

### ✅ In Scope (Admin Side Focus)
- [x] Create postService.js for API integration
- [x] Rename nav "Announcements" → "Posts"
- [x] Change route from `/admin/announcements` to `/admin/posts`
- [x] Grid layout for posts (Instagram-style) on Posts page
- [x] Feed layout on Admin Dashboard
- [x] Create/Edit/Delete posts functionality
- [x] Support multiple images per post with swipe/carousel
- [x] Text-only posts show as text cards in grid

### ❌ Out of Scope (Deferred)
- Video uploads (images only for now)
- Reactions/comments (waiting for backend endpoints)
- Student side implementation (Phase 2)

---

## Implementation Progress

### Phase 1: Service Layer & Config
| Status | Task | Description |
|--------|------|-------------|
| ✅ | Create postService.js | CRUD operations with proper error handling |
| ✅ | Update api.js config | Add POSTS endpoints |

### Phase 2: Admin Posts Page (Grid View)
| Status | Task | Description |
|--------|------|-------------|
| ✅ | Create PostsView.vue | Instagram-style grid layout |
| ✅ | Create Post Modal | Multi-image upload with drag & drop |
| ✅ | Edit Post Modal | Pre-filled form for editing |
| ✅ | Delete Confirmation | Warning dialog before deletion |
| ✅ | Image Carousel | Swipeable multi-image carousel |

### Phase 3: Admin Dashboard Feed
| Status | Task | Description |
|--------|------|-------------|
| ✅ | Post Feed Component | Timeline/feed style component |
| ✅ | Update Dashboard | Replace announcements with posts feed |

### Phase 4: Navigation & Routing
| Status | Task | Description |
|--------|------|-------------|
| ✅ | Update Router | Change route to `/admin/posts` |
| ✅ | Update Admin Nav | Rename to "Posts" with new icon |

### Phase 5: Cleanup
| Status | Task | Description |
|--------|------|-------------|
| ✅ | Remove old code | Delete AnnouncementsView.vue and references |

**Legend:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

---

## Component Architecture

```
src/
├── services/
│   └── postService.js              # NEW: Posts API service
├── components/
│   └── posts/
│       ├── PostCard.vue            # Grid card (image or text card)
│       ├── PostFeedItem.vue        # Feed-style post item
│       ├── PostCreateModal.vue     # Create post modal
│       ├── PostEditModal.vue       # Edit post modal
│       ├── ImageCarousel.vue       # Multi-image swipe carousel
│       └── ImageUploader.vue       # Multi-image upload with preview
├── views/
│   └── admin/
│       ├── PostsView.vue           # NEW (replaces AnnouncementsView.vue)
│       └── DashboardView.vue       # MODIFY: Add posts feed section
```

---

## UI Design Specifications

### Grid View (Posts Page)
- **Layout:** 3 columns desktop / 2 tablet / 1 mobile
- **Aspect Ratio:** Square (1:1) for consistency
- **Image Posts:** Show first image as thumbnail
- **Text Posts:** Gradient background with content preview
- **Hover State:** Overlay with edit/delete actions
- **Multi-image Indicator:** Small icon showing image count

### Feed View (Dashboard)
- **Layout:** Single column, max-width cards
- **Header:** Author avatar + name + relative timestamp
- **Content:** Expandable text (show more/less)
- **Images:** Carousel with dots and arrows
- **Footer:** Placeholder for future reactions

### Create/Edit Modal
- **Mobile:** Fullscreen sheet
- **Desktop:** Centered modal (max-width: 600px)
- **Content:** Auto-resize textarea
- **Images:** Drag-and-drop zone + grid preview
- **Actions:** Reorder (drag), Remove (X)
- **Validation:** Content required, max 10 images

---

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Native File API | No external dependency for file handling |
| FormData for uploads | Standard multipart/form-data for image uploads |
| CSS scroll-snap carousel | Lightweight, no Swiper.js dependency |
| Backend handles Cloudinary | Frontend sends files, backend manages storage |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Large image uploads slow | Show upload progress, compress client-side if needed |
| Backend API changes | Service layer abstracts API, easy to update |
| Mobile performance | Lazy load images, limit carousel preloading |
