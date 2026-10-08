<template>
  <div class="bg-transparent border-none shadow-none pb-8 last:pb-0 transition-all duration-200">
    <!-- 1. Post Header (Instagram Web inspired) -->
    <div class="flex items-center justify-between gap-3 pb-3 px-0.5">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Avatar -->
        <div v-if="authorAvatar" class="w-[38px] h-[38px] rounded-full overflow-hidden ring-1 ring-gray-200/80 shrink-0">
          <img :src="authorAvatar" :alt="post.user_name" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-ic-primary to-purple-600 flex items-center justify-center text-white text-xs font-semibold ring-1 ring-gray-200/80 shrink-0">
          {{ authorInitials }}
        </div>

        <!-- Author Meta & Category -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 leading-tight">
            <span class="text-sm font-semibold text-gray-900 truncate">{{ post.user_name || 'Admin' }}</span>
            <span class="text-gray-300 text-xs font-bold select-none">·</span>
            <span class="font-mono text-[11px] uppercase tracking-wider text-gray-400 shrink-0">{{ formattedDate || 'recently' }}</span>
            <span v-if="isEdited" class="font-mono text-[10px] text-gray-400 lowercase shrink-0">· (edited)</span>
          </div>
          <div class="mt-1 flex items-center gap-1.5">
            <CategoryBadge :category="post.category" size="sm" @click-category="$emit('filter-category', $event)" />
          </div>
        </div>
      </div>
      
      <!-- Actions Menu (for author / admin) -->
      <div v-if="showActions" class="relative shrink-0">
        <button 
          @click="toggleMenu"
          type="button"
          class="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Post actions"
        >
          <MoreHorizontal class="w-5 h-5" />
        </button>
        
        <!-- Dropdown Menu -->
        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div 
            v-if="menuOpen"
            class="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20 text-xs font-sans"
          >
            <button 
              @click="handleEdit"
              type="button"
              class="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Edit class="w-3.5 h-3.5 text-gray-500" />
              <span>Edit post</span>
            </button>
            <button 
              @click="handleToggleComments"
              type="button"
              class="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <MessageCircleOff v-if="!localDisableComments" class="w-3.5 h-3.5 text-gray-500" />
              <MessageCircle v-else class="w-3.5 h-3.5 text-gray-500" />
              <span>{{ localDisableComments ? 'Enable comments' : 'Disable comments' }}</span>
            </button>
            <div class="my-1 border-t border-gray-100"></div>
            <button 
              @click="handleDelete"
              type="button"
              class="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Trash2 class="w-3.5 h-3.5 text-rose-600" />
              <span>Delete post</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- 2. Post Caption / Announcement Text (Positioned at TOP with preserved line breaks) -->
    <div v-if="post.content" class="px-0.5 pb-3">
      <div 
        class="text-xs sm:text-sm text-gray-800 leading-relaxed font-sans whitespace-pre-line break-words"
        :class="{ 'line-clamp-3': !expanded && isLongContent }"
      >
        {{ post.content }}
      </div>
      <button 
        v-if="isLongContent"
        @click="expanded = !expanded"
        type="button"
        class="text-gray-400 hover:text-gray-600 font-medium text-xs mt-1 inline-block cursor-pointer select-none"
      >
        {{ expanded ? 'show less' : '... more' }}
      </button>
    </div>

    <!-- 3. Post Media (Positioned below caption when attached) -->
    <div
      v-if="hasMedia"
      class="relative w-full overflow-hidden rounded-xl sm:rounded-2xl"
      @dblclick="handleDoubleTap"
    >
      <MediaGallery
        :media="post.media"
        :author-name="post.user_name || 'Institute Post'"
        :author-avatar="authorAvatar"
        :post-date="formattedDate"
      />

      <!-- Double-tap heart animation burst -->
      <Transition name="heart-burst">
        <div v-if="showHeartAnimation" class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <Heart class="w-20 h-20 text-white fill-white drop-shadow-xl" />
        </div>
      </Transition>
    </div>

    <!-- 4. Action Bar (Directly below Media or Caption) -->
    <div class="px-0.5 pt-3 pb-1 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <!-- Like Button -->
        <button
          @click="toggleReaction"
          type="button"
          class="group transition-transform active:scale-90 cursor-pointer text-gray-700 hover:text-rose-500"
          :aria-label="isLiked ? 'Unlike post' : 'Like post'"
        >
          <Heart
            class="w-6 h-6 transition-all"
            :class="[
              isLiked ? 'fill-rose-500 text-rose-500 scale-105' : 'group-hover:text-rose-500',
              heartPopping ? 'heart-pop' : ''
            ]"
          />
        </button>

        <!-- Comment Button -->
        <button
          @click="openCommentModal"
          type="button"
          class="group transition-transform active:scale-90 cursor-pointer text-gray-700 hover:text-ic-primary"
          :title="localDisableComments ? 'Comments are turned off' : 'Open comments'"
          aria-label="Comments"
        >
          <MessageCircleOff
            v-if="localDisableComments"
            class="w-6 h-6 text-gray-400 group-hover:text-gray-500"
          />
          <MessageCircle
            v-else
            class="w-6 h-6 group-hover:text-ic-primary"
          />
        </button>
      </div>
    </div>

    <!-- 5. Likes Count & Comment Prompts -->
    <div class="px-0.5 pt-1 space-y-1">
      <!-- Likes Count -->
      <p v-if="localReactionCount > 0" class="text-xs font-semibold text-gray-900 font-sans">
        {{ localReactionCount }} {{ localReactionCount === 1 ? 'like' : 'likes' }}
      </p>

      <!-- Comments Link -->
      <div class="pt-0.5">
        <button
          v-if="!localDisableComments && localCommentCount > 0"
          @click="openCommentModal"
          type="button"
          class="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer select-none"
        >
          View all {{ localCommentCount }} {{ localCommentCount === 1 ? 'comment' : 'comments' }}
        </button>
        <span
          v-else-if="localDisableComments"
          class="font-mono text-[10px] text-gray-400 uppercase tracking-wider"
        >
          Comments are turned off
        </span>
      </div>
    </div>

    <!-- Dedicated Full Post & Comments Modal -->
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
import CategoryBadge from './CategoryBadge.vue'
import MediaGallery from './MediaGallery.vue'
import { 
  Heart, 
  MessageCircle, 
  MessageCircleOff, 
  MoreHorizontal, 
  Edit, 
  Trash2 
} from 'lucide-vue-next'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete', 'updated', 'filter-category'])

const authStore = useAuthStore()
const currentUser = computed(() => authStore.user)

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
  let counts = props.post.reaction_counts || {}
  if (typeof counts === 'string') {
    try { counts = JSON.parse(counts) } catch { counts = {} }
  }
  localReactionCount.value = (typeof counts === 'object' && counts !== null)
    ? (counts.like || 0) + (counts.heart || 0) + (counts.haha || 0) + (counts.sad || 0) + (counts.angry || 0)
    : (typeof counts === 'number' ? counts : 0)

  const cc = props.post.comments_count
  localCommentCount.value = typeof cc === 'string' ? parseInt(cc, 10) || 0 : cc || 0

  localDisableComments.value = props.post.disable_comments || false

  const likedPosts = getLikedPosts()
  isLiked.value = likedPosts.includes(String(props.post.id))
}

initializeState()

const hasMedia = computed(() => props.post.media && props.post.media.length > 0)

const isLongContent = computed(() => {
  if (!props.post.content) return false
  return props.post.content.length > 180 || props.post.content.split('\n').length > 3
})

// Normalize URL to use HTTPS
const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return ''
  
  if (
    url === '/default_profile.png' || 
    url === '/ic-building.png' || 
    url === '/icsp-logo.png' || 
    url === '/icsa_logo.png' || 
    url.startsWith('/src/') || 
    url.startsWith('/assets/') || 
    url.startsWith('/@')
  ) {
    return url
  }
  
  let normalized = url
  const activeBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.instituteofcomputing.org'
  const activeDomain = activeBaseUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '')
  
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
    normalized = normalized.replace(/(?:localhost|127\.0\.0\.1|10\.0\.2\.2)(?::\d+)?/g, activeDomain)
    return normalized.replace(/^http:\/\//i, 'https://')
  }
  
  const baseUrl = activeBaseUrl.replace(/\/$/, '')
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`
  }
  return `${baseUrl}/${url}`
}

// Get author avatar
const authorAvatar = computed(() => {
  const avatar = props.post.user_avatar || props.post.user_profile
  if (avatar) return normalizeUrl(avatar)

  const user = currentUser.value
  if (user) {
    const isAuthor = 
      (user.id && String(user.id) === String(props.post.user_id)) ||
      (user.username && user.username === props.post.user_name) ||
      (user.email && user.email === props.post.user_name) ||
      (user.full_name && user.full_name === props.post.user_name) ||
      (`${user.first_name || ''} ${user.last_name || ''}`.trim() === props.post.user_name)

    if (isAuthor && user.user_avatar) {
      return normalizeUrl(user.user_avatar)
    }
  }
  
  return '/default_profile.png'
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
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

const isEdited = computed(() => {
  const p = props.post
  if (p.is_edited) return true
  const createdStr = p.created_at || p.date || p.timestamp
  const updatedStr = p.updated_at
  if (createdStr && updatedStr) {
    const created = new Date(createdStr).getTime()
    const updated = new Date(updatedStr).getTime()
    if (!isNaN(created) && !isNaN(updated)) {
      return (updated - created) > 30000 // 30s threshold
    }
  }
  return false
})

// --- Reactions ---
const toggleReaction = async () => {
  const wasLiked = isLiked.value
  isLiked.value = !wasLiked
  localReactionCount.value += wasLiked ? -1 : 1
  localReactionCount.value = Math.max(0, localReactionCount.value)

  if (!wasLiked) {
    heartPopping.value = true
    setTimeout(() => { heartPopping.value = false }, 400)
  }

  const result = wasLiked
    ? await removeReaction(props.post.id)
    : await reactToPost(props.post.id, 'heart')

  if (!result.success) {
    isLiked.value = wasLiked
    localReactionCount.value += wasLiked ? 1 : -1
  } else {
    const status = result.data?.data?.status
    if (!wasLiked && status === 'unchanged') {
      localReactionCount.value -= 1
    }
    saveLikedState(props.post.id, isLiked.value)
  }
}

const handleDoubleTap = () => {
  if (isLiked.value) return

  toggleReaction()

  showHeartAnimation.value = true
  setTimeout(() => { showHeartAnimation.value = false }, 800)
}

// --- Comments ---
const openCommentModal = () => {
  isModalOpen.value = true
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
@keyframes heartPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.heart-pop {
  animation: heartPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.heart-burst-enter-active {
  animation: heartBurst 0.75s ease-out forwards;
}

@keyframes heartBurst {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  30% {
    opacity: 0.95;
    transform: scale(1.2);
  }
  70% {
    opacity: 0.9;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}
</style>
