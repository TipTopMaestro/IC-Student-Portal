<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Posts</h1>
      <p class="text-sm text-gray-500 mt-0.5">Share updates with your students</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && posts.length === 0" class="max-w-xl space-y-6">
      <div v-for="i in 3" :key="i" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
            <div class="h-3 bg-gray-200 rounded w-20 mt-1.5 animate-pulse"></div>
          </div>
        </div>
        <div class="aspect-video bg-gray-100 animate-pulse"></div>
        <div class="p-4 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-xl">
      <div class="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <div class="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-gray-900 font-medium mb-1">Something went wrong</p>
        <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
        <button
          @click="loadPosts"
          class="text-sm font-medium text-ic-primary hover:text-ic-secondary"
        >
          Try again
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="posts.length === 0" class="max-w-xl">
      <div class="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <div class="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <p class="text-gray-900 font-medium mb-1">No posts yet</p>
        <p class="text-sm text-gray-500 mb-6">Create your first post to share updates with students.</p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-4 py-2 bg-ic-primary text-white text-sm font-medium rounded-lg hover:bg-ic-secondary transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create post
        </button>
      </div>
    </div>

    <!-- Posts Feed -->
    <div v-else class="max-w-xl space-y-6">
      <article 
        v-for="post in posts" 
        :key="post.id"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden"
      >
        <!-- Post Header -->
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-3">
            <div v-if="getAuthorAvatar(post)" class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
              <img :src="getAuthorAvatar(post)" :alt="post.user_name" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium ring-2 ring-gray-100">
              {{ getInitials(post.user_name) }}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ post.user_name || 'Admin' }}</p>
              <p class="text-xs text-gray-500">{{ formatRelativeTime(post.created_at) || 'Recently' }}</p>
            </div>
          </div>
          
          <div class="relative" ref="menuRefs">
            <button 
              @click.stop="toggleMenu(post.id)"
              class="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            <div 
              v-if="openMenuId === post.id"
              class="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10"
            >
              <button 
                @click="startEdit(post)"
                class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit post
              </button>
              <button 
                @click="startDelete(post)"
                class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Post Content (before images) -->
        <div v-if="post.content" class="px-4 pb-3">
          <p 
            class="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed"
            :class="{ 'line-clamp-4': !expandedPosts.has(post.id) && post.content.length > 280 }"
          >{{ post.content }}</p>
          <button 
            v-if="post.content.length > 280"
            @click="toggleExpand(post.id)"
            class="text-sm text-gray-500 hover:text-gray-700 mt-1"
          >
            {{ expandedPosts.has(post.id) ? 'Show less' : 'Read more' }}
          </button>
        </div>

        <!-- Post Media (Images and Videos) -->
        <div v-if="post.media && post.media.length > 0" class="relative bg-gray-100">
          <div 
            :ref="el => setCarouselRef(post.id, el)"
            class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
            :class="post.media.length > 1 ? 'scrollbar-hide' : ''"
            @scroll="(e) => handleCarouselScroll(post.id, e)"
          >
            <div 
              v-for="(media, idx) in post.media" 
              :key="media.id || idx"
              class="flex-shrink-0 w-full snap-center"
            >
              <!-- Video -->
              <video 
                v-if="media.media_type === 'video'"
                :src="getMediaUrl(media)" 
                class="w-full aspect-square object-cover"
                controls
                playsinline
                preload="metadata"
              />
              <!-- Image -->
              <img 
                v-else
                :src="getMediaUrl(media)" 
                :alt="`Image ${idx + 1}`"
                class="w-full aspect-square object-cover"
                loading="lazy"
                @error="handleImageError"
              />
            </div>
          </div>
          
          <!-- Carousel Navigation -->
          <template v-if="post.media.length > 1">
            <button 
              v-show="(carouselIndexes[post.id] || 0) > 0"
              @click="scrollCarousel(post.id, -1)"
              class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white"
            >
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              v-show="(carouselIndexes[post.id] || 0) < post.media.length - 1"
              @click="scrollCarousel(post.id, 1)"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white"
            >
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <!-- Dots -->
            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              <span
                v-for="(_, idx) in post.media"
                :key="idx"
                class="w-1.5 h-1.5 rounded-full transition-colors"
                :class="(carouselIndexes[post.id] || 0) === idx ? 'bg-white' : 'bg-white/50'"
              />
            </div>
          </template>
        </div>

        <!-- Post Footer -->
        <div class="px-4 py-3 flex items-center gap-4 border-t border-gray-100">
          <div class="flex items-center gap-1.5 text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span class="text-sm">{{ getTotalReactions(post) }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span class="text-sm">0</span>
          </div>
          <span class="ml-auto text-xs text-gray-400">
            {{ post.visibility === 'public' ? 'Public' : 'Private' }}
          </span>
        </div>
      </article>

      <!-- Load More / Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex justify-center py-4">
        <div class="flex items-center gap-2">
          <button
            @click="goToPage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage <= 1 || isLoading"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span class="text-sm text-gray-500">
            {{ pagination.currentPage }} of {{ pagination.totalPages }}
          </span>
          <button
            @click="goToPage(pagination.currentPage + 1)"
            :disabled="pagination.currentPage >= pagination.totalPages || isLoading"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <button
      v-if="posts.length > 0"
      @click="openCreateModal"
      class="fixed bottom-6 right-6 w-14 h-14 bg-ic-primary text-white rounded-full shadow-lg hover:bg-ic-secondary hover:shadow-xl transition-all flex items-center justify-center z-40 md:bottom-8 md:right-8"
      title="Create new post"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Create/Edit Modal -->
    <PostModal
      :is-open="createModalOpen"
      :post="editingPost"
      @close="closeCreateModal"
      @success="handlePostSaved"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :is-open="deleteModalOpen"
      :post="deletingPost"
      @close="closeDeleteModal"
      @success="handlePostDeleted"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import PostModal from '@/components/posts/PostModal.vue'
import DeleteConfirmModal from '@/components/posts/DeleteConfirmModal.vue'
import { listPosts, extractPosts, extractPagination } from '@/services/postService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const currentUser = computed(() => authStore.user)

const posts = ref([])
const isLoading = ref(true)
const error = ref('')
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  totalPages: 1,
  totalItems: 0
})

const createModalOpen = ref(false)
const editingPost = ref(null)
const deleteModalOpen = ref(false)
const deletingPost = ref(null)
const openMenuId = ref(null)
const expandedPosts = ref(new Set())
const carouselRefs = ref({})
const carouselIndexes = reactive({})

const loadPosts = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const result = await listPosts({
      page: pagination.currentPage,
      per_page: pagination.perPage
    })

    if (result.success) {
      posts.value = extractPosts(result)
      const paginationData = extractPagination(result)
      Object.assign(pagination, paginationData)
    } else {
      error.value = result.error || 'Failed to load posts'
    }
  } catch (err) {
    console.error('Error loading posts:', err)
    error.value = 'An unexpected error occurred'
  } finally {
    isLoading.value = false
  }
}

const goToPage = (page) => {
  if (page < 1 || page > pagination.totalPages) return
  pagination.currentPage = page
  loadPosts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openCreateModal = () => {
  editingPost.value = null
  createModalOpen.value = true
}

const closeCreateModal = () => {
  createModalOpen.value = false
  editingPost.value = null
}

const toggleMenu = (postId) => {
  openMenuId.value = openMenuId.value === postId ? null : postId
}

const startEdit = (post) => {
  openMenuId.value = null
  editingPost.value = post
  createModalOpen.value = true
}

const startDelete = (post) => {
  openMenuId.value = null
  deletingPost.value = post
  deleteModalOpen.value = true
}

const closeDeleteModal = () => {
  deleteModalOpen.value = false
  deletingPost.value = null
}

const handlePostSaved = () => {
  loadPosts()
}

const handlePostDeleted = (postId) => {
  posts.value = posts.value.filter(p => p.id !== postId)
  pagination.totalItems -= 1
}

const toggleExpand = (postId) => {
  if (expandedPosts.value.has(postId)) {
    expandedPosts.value.delete(postId)
  } else {
    expandedPosts.value.add(postId)
  }
}

const setCarouselRef = (postId, el) => {
  if (el) carouselRefs.value[postId] = el
}

const handleCarouselScroll = (postId, event) => {
  const el = event.target
  const width = el.offsetWidth
  carouselIndexes[postId] = Math.round(el.scrollLeft / width)
}

const scrollCarousel = (postId, direction) => {
  const el = carouselRefs.value[postId]
  if (!el) return
  const width = el.offsetWidth
  const currentIndex = carouselIndexes[postId] || 0
  const newIndex = currentIndex + direction
  el.scrollTo({ left: newIndex * width, behavior: 'smooth' })
}

const getInitials = (name) => {
  if (!name) return 'A'
  const parts = name.trim().split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Get the profile picture for a post author
// Uses current user's profile if it matches the post author, or fallback to post's user_avatar
const getAuthorAvatar = (post) => {
  // If the post was created by the current user, try to use their stored profile picture
  if (currentUser.value) {
    const currentUserId = currentUser.value.id
    const postUserId = post.user_id
    
    // Check if this post belongs to the current user
    if (currentUserId === postUserId) {
      // Try various profile picture fields that might exist
      const profilePic = currentUser.value.profile_picture || 
                         currentUser.value.avatar || 
                         currentUser.value.photo ||
                         currentUser.value.profile_image
      if (profilePic) {
        return normalizeUrl(profilePic)
      }
    }
  }
  
  // Fall back to post's user_avatar if available
  if (post.user_avatar) {
    return normalizeUrl(post.user_avatar)
  }
  
  return null
}

// Normalize URL to use HTTPS
const normalizeUrl = (url) => {
  if (!url) return ''
  // Convert HTTP to HTTPS for Cloudinary and other CDN URLs
  return url.replace(/^http:\/\//i, 'https://')
}

// Get normalized media URL
const getMediaUrl = (media) => {
  if (!media?.media_url) return ''
  return normalizeUrl(media.media_url)
}

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  
  if (diffSecs < 60) return 'Just now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  if (diffWeeks < 4) return `${diffWeeks}w`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const getTotalReactions = (post) => {
  if (!post.reaction_counts) return 0
  const c = post.reaction_counts
  return (c.like || 0) + (c.heart || 0) + (c.haha || 0) + (c.angry || 0)
}

const handleImageError = (event) => {
  // Set a fallback or hide the broken image
  event.target.style.display = 'none'
  console.warn('Failed to load image:', event.target.src)
}

const handleClickOutside = (e) => {
  if (openMenuId.value && !e.target.closest('[ref="menuRefs"]')) {
    openMenuId.value = null
  }
}

onMounted(() => {
  loadPosts()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
