<template>
  <div class="flex gap-2.5" :class="depth > 0 ? 'ml-10 mt-3' : ''">
    <!-- Avatar -->
    <div v-if="authorAvatar" class="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-gray-100">
      <img :src="authorAvatar" alt="Profile" class="h-full w-full object-cover" />
    </div>
    <div v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-ic-primary to-purple-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
      {{ getInitials(comment.user) }}
    </div>

    <div class="flex-1 min-w-0">
      <!-- Comment Bubble -->
      <div class="relative group/bubble inline-block max-w-full">
        <div class="bg-gray-50 rounded-2xl px-3.5 py-2.5">
          <span class="text-[13px] font-semibold text-gray-900">{{ comment.user || 'User' }}</span>

          <!-- Display mode -->
          <p v-if="!isEditing" class="text-[13px] text-gray-800 mt-0.5 whitespace-pre-wrap break-words">{{ comment.content }}</p>

          <!-- Edit mode -->
          <div v-else class="mt-1">
            <textarea
              ref="editInput"
              v-model="editContent"
              rows="2"
              class="w-full text-[13px] bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ic-primary resize-none"
              @keydown.enter.exact.prevent="saveEdit"
              @keydown.escape="cancelEdit"
            />
            <div class="flex items-center gap-2 mt-1.5">
              <button @click="saveEdit" :disabled="!editContent.trim() || editSaving" class="text-xs font-medium text-ic-primary hover:text-ic-secondary disabled:opacity-40">
                {{ editSaving ? 'Saving...' : 'Save' }}
              </button>
              <button @click="cancelEdit" class="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Reaction Summary Overlay (Bottom Right of bubble) -->
        <div 
          v-if="hasReactions"
          class="absolute -bottom-2 -right-2 flex items-center bg-white rounded-full px-1.5 py-0.5 shadow-sm border border-gray-100 gap-0.5"
        >
          <div class="flex -space-x-1">
            <span v-for="type in topReactionTypes" :key="type" class="text-[11px] leading-none">
              {{ reactionEmojis[type] }}
            </span>
          </div>
          <span class="text-[10px] font-medium text-gray-500 ml-0.5">{{ totalReactionCount }}</span>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center gap-3 mt-1 px-1 relative">
        <span class="text-[11px] text-gray-400">{{ formattedTime }}</span>
        
        <!-- Like Button with Hover Trigger -->
        <div ref="actionsContainer" class="relative inline-block">
          <button
            @click="handleLikeClick"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
            @touchcancel="handleTouchCancel"
            class="text-[11px] font-semibold transition-colors"
            :class="localUserReaction ? 'text-ic-primary' : 'text-gray-500 hover:text-gray-700'"
          >
            <span v-if="localUserReaction" class="capitalize">{{ localUserReaction }}</span>
            <span v-else>Like</span>
          </button>

          <!-- Reaction Picker -->
          <div 
            v-if="showPicker"
            class="absolute bottom-full left-0 mb-2 z-50"
            @mouseenter="clearHideTimer"
            @mouseleave="handleMouseLeave"
          >
            <ReactionPicker @select="handleReactionSelect" @close="showPicker = false" />
          </div>
        </div>

        <button
          v-if="depth < 1"
          @click="$emit('reply', comment)"
          class="text-[11px] font-semibold text-gray-500 hover:text-gray-700"
        >
          Reply
        </button>
        <button
          v-if="isOwner || isAdmin"
          @click="startEdit"
          class="text-[11px] font-semibold text-gray-500 hover:text-gray-700"
        >
          Edit
        </button>
        <button
          v-if="isOwner || isAdmin"
          @click="confirmDelete"
          class="text-[11px] font-semibold text-gray-500 hover:text-red-600"
        >
          Delete
        </button>
      </div>

      <!-- Replies -->
      <div v-if="depth < 1 && hasReplies">
        <!-- Toggle Replies -->
        <button
          v-if="!repliesLoaded && !repliesLoading"
          @click="loadReplies"
          class="flex items-center gap-1.5 mt-2 ml-1"
        >
          <div class="w-6 h-px bg-gray-300"></div>
          <span class="text-[12px] font-semibold text-gray-500 hover:text-gray-700">
            View {{ replyCount }} {{ replyCount === 1 ? 'reply' : 'replies' }}
          </span>
        </button>

        <!-- Loading indicator -->
        <div v-if="repliesLoading" class="flex items-center gap-2 mt-3 ml-10">
          <div class="w-5 h-5 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
          <span class="text-xs text-gray-400">Loading replies...</span>
        </div>

        <!-- Loaded Replies -->
        <div v-if="repliesLoaded && replies.length > 0">
          <CommentItem
            v-for="reply in replies"
            :key="reply.id"
            :comment="reply"
            :post-id="postId"
            :depth="depth + 1"
            :current-user-id="currentUserId"
            :is-admin="isAdmin"
            @reply="$emit('reply', $event)"
            @deleted="handleReplyDeleted"
            @updated="handleReplyUpdated"
          />
        </div>

        <!-- Collapse replies -->
        <button
          v-if="repliesLoaded && replies.length > 0"
          @click="collapseReplies"
          class="flex items-center gap-1.5 mt-2 ml-1"
        >
          <div class="w-6 h-px bg-gray-300"></div>
          <span class="text-[12px] font-semibold text-gray-500 hover:text-gray-700">Hide replies</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { updateComment, deleteComment, getReplies, extractReplies, reactToComment, removeCommentReaction } from '@/services/commentService'
import { useAuthStore } from '@/stores/auth'
import ReactionPicker from './ReactionPicker.vue'

const props = defineProps({
  comment: { type: Object, required: true },
  postId: { type: [Number, String], required: true },
  depth: { type: Number, default: 0 },
  currentUserId: { type: [Number, String], default: null },
  isAdmin: { type: Boolean, default: false }
})

const emit = defineEmits(['reply', 'deleted', 'updated'])

const isEditing = ref(false)
const editContent = ref('')
const editSaving = ref(false)
const editInput = ref(null)
const replies = ref([])
const repliesLoaded = ref(false)
const repliesLoading = ref(false)

const currentUser = computed(() => useAuthStore().user)

// LocalStorage helpers to persist comment reactions (since backend doesn't return user_reaction in list query)
const getReactionsKey = () => {
  const userId = currentUser.value?.id || 'anon'
  return `comment_reactions_${userId}`
}

const getStoredReactions = () => {
  try {
    return JSON.parse(localStorage.getItem(getReactionsKey()) || '{}')
  } catch {
    return {}
  }
}

const saveStoredReaction = (commentId, reactionType) => {
  const reactions = getStoredReactions()
  const key = String(commentId)
  if (reactionType) {
    reactions[key] = reactionType
  } else {
    delete reactions[key]
  }
  localStorage.setItem(getReactionsKey(), JSON.stringify(reactions))
}

// --- Reactions State ---
const showPicker = ref(false)
const isReacting = ref(false)
const localUserReaction = ref(null)
const localReactionCounts = ref({})
const reactionEmojis = {
  like: '👍',
  heart: '❤️',
  haha: '😆',
  sad: '😢',
  angry: '😡'
}

// Timers for hover/long-press
let hideTimer = null
let showTimer = null
let touchTimer = null
let touchHandled = false
let lastTouchTime = 0
const actionsContainer = ref(null)

// Initialize and sync reaction state
const initializeReactions = (comment) => {
  console.log('💬 initializeReactions for comment ID:', comment.id, 'content:', comment.content, 'reaction_counts:', comment.reaction_counts)
  console.log('📋 Full comment data object:', comment)
  
  // Load from localStorage instead of relying on backend
  const storedReactions = getStoredReactions()
  localUserReaction.value = storedReactions[String(comment.id)] || null

  if (comment.reaction_counts) {
    if (typeof comment.reaction_counts === 'object') {
      localReactionCounts.value = { ...comment.reaction_counts }
    } else {
      try {
        localReactionCounts.value = JSON.parse(comment.reaction_counts)
      } catch (e) {
        console.warn('Failed to parse reaction_counts JSON:', e)
        localReactionCounts.value = {}
      }
    }
  } else {
    localReactionCounts.value = {}
  }
}

onMounted(() => {
  initializeReactions(props.comment)
})

// Sync with prop changes (e.g. from parent refresh or websocket)
watch(() => props.comment, (newComment) => {
  // Only sync if we aren't currently in the middle of an optimistic update
  if (!isReacting.value) {
    initializeReactions(newComment)
  }
}, { deep: true })

watch(currentUser, () => {
  initializeReactions(props.comment)
})

const totalReactionCount = computed(() => {
  // If the backend provides a direct "total" count, use it.
  if (localReactionCounts.value && typeof localReactionCounts.value.total !== 'undefined') {
    return parseInt(localReactionCounts.value.total) || 0
  }
  
  // Otherwise, sum the individual reaction counts, excluding "total" if it exists
  return Object.entries(localReactionCounts.value)
    .filter(([key]) => key !== 'total')
    .reduce((sum, [_, count]) => sum + (parseInt(count) || 0), 0)
})

const hasReactions = computed(() => totalReactionCount.value > 0)

const topReactionTypes = computed(() => {
  return Object.entries(localReactionCounts.value)
    .filter(([type, count]) => type !== 'total' && count > 0)
    .sort((a, b) => (parseInt(b[1]) || 0) - (parseInt(a[1]) || 0))
    .slice(0, 3)
    .map(([type]) => type)
})

// --- Reaction Handlers ---

const handleReactionSelect = async (type) => {
  console.log('👍 handleReactionSelect clicked. Type:', type, 'Current active reaction:', localUserReaction.value)
  if (isReacting.value) return
  
  const oldReaction = localUserReaction.value
  if (type === oldReaction) {
    // If selecting the same emoji, unreact it
    console.log('🔄 Selecting same emoji in picker, removing reaction...')
    showPicker.value = false
    isReacting.value = true
    updateLocalReaction(null)
    const result = await removeCommentReaction(props.comment.id, oldReaction)
    console.log('📥 removeCommentReaction result (from picker):', result)
    if (!result.success) {
      updateLocalReaction(oldReaction)
    }
    setTimeout(() => {
      isReacting.value = false
    }, 200)
    return
  }

  showPicker.value = false
  isReacting.value = true
  
  // Optimistic UI update
  updateLocalReaction(type)

  const result = await reactToComment(props.comment.id, type)
  console.log('📥 reactToComment result (from picker):', result)
  if (!result.success) {
    // Rollback on failure
    updateLocalReaction(oldReaction)
  }
  
  // Small delay to prevent rapid double-clicks
  setTimeout(() => {
    isReacting.value = false
  }, 200)
}

const handleLikeClick = async () => {
  console.log('👍 handleLikeClick clicked. Current active reaction:', localUserReaction.value)
  if (isReacting.value || touchHandled) {
    touchHandled = false
    return
  }

  // Immediately close picker and clear timers when clicking
  showPicker.value = false
  clearTimeout(showTimer)
  clearHideTimer()

  const oldReaction = localUserReaction.value
  isReacting.value = true
  
  if (oldReaction) {
    // Remove reaction if already exists
    console.log('🔄 Active reaction exists, removing reaction:', oldReaction)
    updateLocalReaction(null)
    const result = await removeCommentReaction(props.comment.id, oldReaction)
    console.log('📥 removeCommentReaction result (from Like click):', result)
    if (!result.success) {
      updateLocalReaction(oldReaction)
    }
  } else {
    // Toggle default like
    console.log('➕ No active reaction, adding default Like...')
    updateLocalReaction('like')
    const result = await reactToComment(props.comment.id, 'like')
    console.log('📥 reactToComment result (from Like click):', result)
    if (!result.success) {
      updateLocalReaction(null)
    }
  }

  setTimeout(() => {
    isReacting.value = false
  }, 200)
}

const updateLocalReaction = (newReaction) => {
  const oldReaction = localUserReaction.value
  if (newReaction === oldReaction) return
  
  // Save to localStorage
  saveStoredReaction(props.comment.id, newReaction)

  // Decrease count for old reaction
  if (oldReaction && localReactionCounts.value[oldReaction]) {
    localReactionCounts.value[oldReaction] = Math.max(0, (parseInt(localReactionCounts.value[oldReaction]) || 0) - 1)
  }
  
  // Increase count for new reaction
  if (newReaction) {
    localReactionCounts.value[newReaction] = (parseInt(localReactionCounts.value[newReaction]) || 0) + 1
  }

  // Also update the total count if it exists in localReactionCounts
  if (localReactionCounts.value && typeof localReactionCounts.value.total !== 'undefined') {
    let diff = 0
    if (oldReaction) diff -= 1
    if (newReaction) diff += 1
    localReactionCounts.value.total = Math.max(0, (parseInt(localReactionCounts.value.total) || 0) + diff)
  }
  
  localUserReaction.value = newReaction
}

// --- Hover & Touch Logic ---

const handleMouseEnter = () => {
  // Ignore hover emulated by touch events
  if (Date.now() - lastTouchTime < 1000) return
  
  clearHideTimer()
  showTimer = setTimeout(() => {
    showPicker.value = true
  }, 400)
}

const handleMouseLeave = () => {
  // Ignore hover emulated by touch events
  if (Date.now() - lastTouchTime < 1000) return

  clearTimeout(showTimer)
  hideTimer = setTimeout(() => {
    showPicker.value = false
  }, 300)
}

const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const handleTouchStart = () => {
  lastTouchTime = Date.now()
  touchHandled = false
  touchTimer = setTimeout(() => {
    showPicker.value = true
    touchHandled = true
  }, 500)
}

const handleTouchEnd = () => {
  lastTouchTime = Date.now()
  clearTimeout(touchTimer)
}

const handleTouchCancel = () => {
  lastTouchTime = Date.now()
  clearTimeout(touchTimer)
}

// Click outside logic to close picker on mobile
const documentClickHandler = (event) => {
  if (actionsContainer.value && !actionsContainer.value.contains(event.target)) {
    showPicker.value = false
  }
}

watch(showPicker, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', documentClickHandler)
    document.addEventListener('touchstart', documentClickHandler)
  } else {
    document.removeEventListener('click', documentClickHandler)
    document.removeEventListener('touchstart', documentClickHandler)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', documentClickHandler)
  document.removeEventListener('touchstart', documentClickHandler)
})

// --- Rest of the component logic ---

// Normalize URL to use HTTPS
const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return ''
  
  // Handle local frontend assets
  if (
    url === '/default_profile.png' || 
    url === '/ic-building.png' || 
    url === '/icsa_logo.png' || 
    url.startsWith('/src/') || 
    url.startsWith('/assets/') || 
    url.startsWith('/@')
  ) {
    return url
  }
  
  let normalized = url
  const activeBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://dnsc-systems-api.onrender.com'
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

const isOwner = computed(() => {
  const user = currentUser.value
  if (!user) return false

  // First try ID matching
  if (user.id && props.comment.user_id && String(user.id) === String(props.comment.user_id)) {
    return true
  }

  // Fallback to name matching since admin user object lacks ID
  const commentUser = props.comment.user
  if (commentUser) {
    if (user.username && user.username === commentUser) return true
    if (user.email && user.email === commentUser) return true
    if (user.full_name && user.full_name === commentUser) return true
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim()
    if (fullName && fullName === commentUser) return true
  }

  return false
})

const replyCount = computed(() => {
  const rc = props.comment.reply_count
  if (typeof rc === 'number') return rc
  if (typeof rc === 'string') return parseInt(rc, 10) || 0
  return 0
})

const authorAvatar = computed(() => {
  // Prioritize comment.user_avatar or user_profile for all users
  const avatar = props.comment.user_avatar || props.comment.user_profile
  if (avatar) return normalizeUrl(avatar)

  if (isOwner.value) {
    const authStore = useAuthStore()
    const user = authStore.user
    if (user && user.user_avatar) {
      return normalizeUrl(user.user_avatar)
    }
  }
  
  // Default fallback
  return '/default_profile.png'
})

const hasReplies = computed(() => replyCount.value > 0 || replies.value.length > 0)

const formattedTime = computed(() => {
  const dateStr = props.comment.created_at
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

const getInitials = (name) => {
  if (!name) return 'U'
  const parts = name.trim().split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

const loadReplies = async () => {
  repliesLoading.value = true
  const result = await getReplies(props.comment.id)
  if (result.success) {
    replies.value = extractReplies(result)
    repliesLoaded.value = true
  }
  repliesLoading.value = false
}

const collapseReplies = () => {
  repliesLoaded.value = false
}

const saveEdit = async () => {
  if (!editContent.value.trim()) return
  editSaving.value = true
  const result = await updateComment(props.comment.id, editContent.value.trim())
  if (result.success) {
    isEditing.value = false
    emit('updated', { ...props.comment, content: editContent.value.trim() })
  }
  editSaving.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editContent.value = props.comment.content
}

const confirmDelete = async () => {
  if (!confirm('Delete this comment?')) return
  const result = await deleteComment(props.comment.id)
  if (result.success) {
    emit('deleted', props.comment.id)
  }
}

const handleReplyDeleted = (replyId) => {
  replies.value = replies.value.filter(r => r.id !== replyId)
}

const handleReplyUpdated = (updatedReply) => {
  const idx = replies.value.findIndex(r => r.id === updatedReply.id)
  if (idx !== -1) {
    replies.value[idx] = { ...replies.value[idx], ...updatedReply }
  }
}

// Initialize edit content when entering edit mode
const startEdit = () => {
  editContent.value = props.comment.content
  isEditing.value = true
  nextTick(() => editInput.value?.focus())
}

// Watch for edit mode to focus
watch(isEditing, (val) => {
  if (val) {
    editContent.value = props.comment.content
    nextTick(() => editInput.value?.focus())
  }
})
</script>

