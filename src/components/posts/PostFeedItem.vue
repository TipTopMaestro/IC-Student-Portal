<template>
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <!-- Post Header -->
    <div class="flex items-center gap-3 p-4">
      <div v-if="authorAvatar" class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
        <img :src="authorAvatar" :alt="post.user_name" class="w-full h-full object-cover" />
      </div>
      <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium ring-2 ring-gray-100">
        {{ authorInitials }}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 truncate">{{ post.user_name || 'Admin' }}</p>
        <div class="flex items-center gap-1.5">
          <p class="text-xs text-gray-500">{{ formattedDate || 'Recently' }}</p>
          <span v-if="showVisibility" class="text-xs text-gray-400">·</span>
          <span v-if="showVisibility" class="text-xs text-gray-400">{{ post.visibility === 'public' ? '🌐' : '🔒' }}</span>
        </div>
      </div>
      
      <!-- Actions Menu (for admin) -->
      <div v-if="showActions" class="relative">
        <button 
          @click="toggleMenu"
          class="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Post actions"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        
        <!-- Dropdown Menu -->
        <div 
          v-if="menuOpen"
          class="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10"
        >
          <button 
            @click="handleEdit"
            class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit post
          </button>
          <button 
            @click="handleToggleComments"
            class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            {{ localDisableComments ? 'Enable comments' : 'Disable comments' }}
          </button>
          <button 
            @click="handleDelete"
            class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Post Content -->
    <div v-if="post.content" class="px-4 pb-3">
      <p 
        class="text-sm text-gray-800 whitespace-pre-wrap"
        :class="{ 'line-clamp-3': !expanded && isLongContent }"
      >
        {{ post.content }}
      </p>
      <button 
        v-if="isLongContent"
        @click="expanded = !expanded"
        class="text-sm text-gray-500 hover:text-gray-700 mt-1"
      >
        {{ expanded ? 'Show less' : 'Show more' }}
      </button>
    </div>

    <!-- Post Media (Carousel) -->
    <div
      v-if="hasMedia"
      class="relative bg-gray-100"
      @dblclick="handleDoubleTap"
    >
      <div 
        ref="carouselRef"
        class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        @scroll="handleScroll"
      >
        <div 
          v-for="(media, index) in post.media" 
          :key="media.id"
          class="flex-shrink-0 w-full snap-center"
        >
          <!-- Video -->
          <video 
            v-if="media.media_type === 'video'"
            :src="normalizeUrl(media.media_url)" 
            class="w-full aspect-square object-cover"
            controls
            playsinline
            preload="metadata"
          />
          <!-- Image -->
          <img 
            v-else
            :src="normalizeUrl(media.media_url)" 
            :alt="`Post image ${index + 1}`"
            class="w-full aspect-square object-cover"
            loading="lazy"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Navigation Arrows -->
      <template v-if="post.media.length > 1">
        <button 
          v-if="currentIndex > 0"
          @click="scrollTo(currentIndex - 1)"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          v-if="currentIndex < post.media.length - 1"
          @click="scrollTo(currentIndex + 1)"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Dots Indicator -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <button
            v-for="(_, index) in post.media"
            :key="index"
            @click="scrollTo(index)"
            class="w-2 h-2 rounded-full transition-all"
            :class="currentIndex === index ? 'bg-ic-primary' : 'bg-gray-300'"
            :aria-label="`Go to image ${index + 1}`"
          />
        </div>
      </template>

      <!-- Double-tap heart animation -->
      <Transition name="heart-burst">
        <div v-if="showHeartAnimation" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg class="w-20 h-20 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      </Transition>
    </div>

    <!-- Interaction Bar -->
    <div class="px-4 py-3 border-t border-gray-100">
      <div class="flex items-center gap-4">
        <!-- Heart Button -->
        <button
          @click="toggleReaction"
          class="flex items-center gap-1.5 group transition-transform active:scale-90"
          :class="isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'"
        >
          <svg
            class="w-6 h-6 transition-all"
            :class="{ 'scale-110': isLiked, 'heart-pop': heartPopping }"
            :fill="isLiked ? 'currentColor' : 'none'"
            :stroke="isLiked ? 'none' : 'currentColor'"
            viewBox="0 0 24 24"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span class="text-sm font-medium" v-if="localReactionCount > 0">{{ localReactionCount }}</span>
        </button>

        <!-- Comment Button -->
        <button
          @click="focusCommentInput"
          class="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span class="text-sm font-medium" v-if="localCommentCount > 0">{{ localCommentCount }}</span>
        </button>
      </div>
    </div>

    <!-- Post Modal -->
    <PostModal
      :is-open="isModalOpen"
      :post="post"
      :is-liked="isLiked"
      :local-reaction-count="localReactionCount"
      @close="isModalOpen = false"
      @toggle-reaction="toggleReaction"
      @comment-count-changed="localCommentCount = $event"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { reactToPost, removeReaction, togglePostComments } from '@/services/postService'
import PostModal from './PostModal.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: false
  },
  showVisibility: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete', 'updated'])

const authStore = useAuthStore()
const currentUser = computed(() => authStore.user)

const carouselRef = ref(null)
const currentIndex = ref(0)
const menuOpen = ref(false)
const expanded = ref(false)
const isModalOpen = ref(false)

// Reaction state (optimistic UI)
const isLiked = ref(false)
const heartPopping = ref(false)
const showHeartAnimation = ref(false)
const localReactionCount = ref(0)
const localCommentCount = ref(0)
const localDisableComments = ref(false)

// LocalStorage key for persisting liked posts per user
const getLikedKey = () => {
  const userId = currentUser.value?.id || 'anon'
  return `liked_posts_${userId}`
}

const getLikedPosts = () => {
  try {
    return JSON.parse(localStorage.getItem(getLikedKey()) || '[]')
  } catch { return [] }
}

const saveLikedState = (postId, liked) => {
  const likedPosts = getLikedPosts()
  const idStr = String(postId)
  if (liked && !likedPosts.includes(idStr)) {
    likedPosts.push(idStr)
  } else if (!liked) {
    const idx = likedPosts.indexOf(idStr)
    if (idx !== -1) likedPosts.splice(idx, 1)
  }
  localStorage.setItem(getLikedKey(), JSON.stringify(likedPosts))
}

// Initialize from post data
const initializeState = () => {
  // Parse reaction_counts — API may return as JSON string or object
  let counts = props.post.reaction_counts || {}
  if (typeof counts === 'string') {
    try { counts = JSON.parse(counts) } catch { counts = {} }
  }
  localReactionCount.value = (typeof counts === 'object' && counts !== null)
    ? (counts.like || 0) + (counts.heart || 0) + (counts.haha || 0) + (counts.sad || 0) + (counts.angry || 0)
    : (typeof counts === 'number' ? counts : 0)

  // Parse comments_count — API returns as string
  const cc = props.post.comments_count
  localCommentCount.value = typeof cc === 'string' ? parseInt(cc, 10) || 0 : cc || 0

  localDisableComments.value = props.post.disable_comments || false

  // Restore liked state from localStorage (persists across reloads)
  const likedPosts = getLikedPosts()
  isLiked.value = likedPosts.includes(String(props.post.id))
}

initializeState()

const hasMedia = computed(() => props.post.media && props.post.media.length > 0)

const isLongContent = computed(() => {
  return props.post.content && props.post.content.length > 200
})

// Normalize URL to use HTTPS
const normalizeUrl = (url) => {
  if (!url) return ''
  return url.replace(/^http:\/\//i, 'https://')
}

// Get author avatar
const authorAvatar = computed(() => {
  const user = currentUser.value
  if (!user) {
    if (props.post.user_avatar) return normalizeUrl(props.post.user_avatar)
    return null
  }

  // Check if current user is the author
  const isAuthor = 
    (user.id && String(user.id) === String(props.post.user_id)) ||
    (user.username && user.username === props.post.user_name) ||
    (user.email && user.email === props.post.user_name) ||
    (user.full_name && user.full_name === props.post.user_name) ||
    (`${user.first_name || ''} ${user.last_name || ''}`.trim() === props.post.user_name)

  if (isAuthor) {
    const profilePic = user.profile ||
                       user.profile_picture || 
                       user.avatar || 
                       user.photo ||
                       user.profile_image
    if (profilePic) return normalizeUrl(profilePic)
  }
  
  if (props.post.user_avatar) return normalizeUrl(props.post.user_avatar)
  return null
})

const authorInitials = computed(() => {
  const name = props.post.user_name || 'Admin'
  const parts = name.split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const formattedDate = computed(() => {
  const p = props.post
  const dateStr = p.created_at || p.date || p.updated_at || p.timestamp || p.created || p.time
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = Math.abs(now - date)
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffWeeks = Math.floor(diffDays / 7)

  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  if (diffWeeks < 52) return `${diffWeeks}w`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

// --- Reactions ---
const toggleReaction = async () => {
  // Optimistic update
  const wasLiked = isLiked.value
  isLiked.value = !wasLiked
  localReactionCount.value += wasLiked ? -1 : 1
  localReactionCount.value = Math.max(0, localReactionCount.value)

  // Pop animation
  if (!wasLiked) {
    heartPopping.value = true
    setTimeout(() => { heartPopping.value = false }, 400)
  }

  // API call in background
  const result = wasLiked
    ? await removeReaction(props.post.id)
    : await reactToPost(props.post.id, 'heart')

  // Rollback on failure, otherwise persist
  if (!result.success) {
    isLiked.value = wasLiked
    localReactionCount.value += wasLiked ? 1 : -1
  } else {
    // If we liked it but the backend says it was already recorded, undo the optimistic +1
    const status = result.data?.data?.status
    if (!wasLiked && status === 'unchanged') {
      localReactionCount.value -= 1
    }
    
    // Persist liked state to localStorage so it survives reloads
    saveLikedState(props.post.id, isLiked.value)
  }
}

const handleDoubleTap = () => {
  if (isLiked.value) return // Already liked

  // Trigger like
  toggleReaction()

  // Show heart burst animation on image
  showHeartAnimation.value = true
  setTimeout(() => { showHeartAnimation.value = false }, 800)
}

// --- Comments ---
const focusCommentInput = () => {
  if (localDisableComments.value) return
  isModalOpen.value = true
}

// --- Carousel ---
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const handleScroll = () => {
  if (!carouselRef.value) return
  const scrollLeft = carouselRef.value.scrollLeft
  const width = carouselRef.value.offsetWidth
  currentIndex.value = Math.round(scrollLeft / width)
}

const scrollTo = (index) => {
  if (!carouselRef.value) return
  const width = carouselRef.value.offsetWidth
  carouselRef.value.scrollTo({
    left: index * width,
    behavior: 'smooth'
  })
}

// --- Menu Actions ---
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const handleEdit = () => {
  menuOpen.value = false
  emit('edit', props.post)
}

const handleDelete = () => {
  menuOpen.value = false
  emit('delete', props.post)
}

const handleToggleComments = async () => {
  menuOpen.value = false
  const result = await togglePostComments(props.post.id)
  if (result.success) {
    localDisableComments.value = !localDisableComments.value
    emit('updated', { ...props.post, disable_comments: localDisableComments.value })
  }
}

// Close menu when clicking outside
const handleClickOutside = (e) => {
  if (menuOpen.value && !e.target.closest('.relative')) {
    menuOpen.value = false
  }
}

onMounted(() => {
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

/* Heart pop animation */
.heart-pop {
  animation: heartPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.49);
}
@keyframes heartPop {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1.1); }
}

/* Heart burst animation on double-tap */
.heart-burst-enter-active {
  animation: heartBurst 0.8s cubic-bezier(0.17, 0.89, 0.32, 1.28);
}
.heart-burst-leave-active {
  animation: heartFade 0.3s ease-out;
}
@keyframes heartBurst {
  0% { opacity: 0; transform: scale(0.2); }
  15% { opacity: 1; transform: scale(1.2); }
  30% { transform: scale(0.95); }
  45% { transform: scale(1.05); }
  100% { opacity: 0; transform: scale(1); }
}
@keyframes heartFade {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
