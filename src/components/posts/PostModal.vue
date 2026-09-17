<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs"
      @click.self="close"
    >
      <!-- Facebook-Style Centered Dialog Card -->
      <div
        class="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-xl max-h-[92vh] flex flex-col relative border border-gray-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <!-- Modal Top Title Bar with Centered Post Author & Close Button -->
        <div class="relative px-4 py-3 border-b border-gray-100 flex items-center justify-center shrink-0 bg-white">
          <h2 class="font-sans text-sm sm:text-base font-bold text-gray-900 text-center truncate max-w-[80%]">
            {{ post.user_name || 'Author' }}'s Post
          </h2>
          <button
            type="button"
            @click="close"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Scrollable Feed Body (Post Header, Body Text, Gallery, Stats, and Comments Stream) -->
        <div class="flex-1 overflow-y-auto custom-scrollbar min-h-0 bg-white">
          <!-- Post Author Header -->
          <div class="p-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div v-if="authorAvatar" class="w-10 h-10 rounded-full overflow-hidden ring-1 ring-gray-100 shrink-0">
                <img :src="authorAvatar" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-ic-primary to-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {{ authorInitials }}
              </div>
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-gray-900 truncate leading-snug">
                  {{ post.user_name || 'Author' }}
                </h3>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="font-mono text-[11px] text-gray-400">{{ formattedDate }}</span>
                  <span class="text-xs text-gray-300">·</span>
                  <CategoryBadge :category="post.category" size="sm" />
                </div>
              </div>
            </div>
          </div>

          <!-- Post Content Text -->
          <div v-if="post.content" class="px-4 pb-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed break-words">
            {{ post.content }}
          </div>

          <!-- Post Media Gallery (Full Width in Modal) -->
          <div v-if="hasMedia" class="px-4 pb-3">
            <MediaGallery
              :media="post.media"
              :author-name="post.user_name || 'Author'"
              :author-avatar="authorAvatar"
              :post-date="formattedDate"
            />
          </div>

          <!-- Reaction Counts & Interaction Summary Bar (Facebook-Style) -->
          <div class="px-4 py-2 border-y border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <!-- Left: Like count badge -->
            <div class="flex items-center gap-1.5" v-if="localReactionCount > 0">
              <span class="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                <Heart class="w-2.5 h-2.5 fill-white text-white" />
              </span>
              <span class="font-mono font-medium text-gray-700">{{ localReactionCount }}</span>
            </div>
            <div v-else class="text-xs text-gray-400 font-mono">
              Be the first to react
            </div>

            <!-- Right: Comments count -->
            <div class="font-mono text-gray-500">
              {{ comments.length }} comment{{ comments.length === 1 ? '' : 's' }}
            </div>
          </div>

          <!-- Like & Comment Action Buttons -->
          <div class="px-4 py-1.5 border-b border-gray-100 grid grid-cols-2 gap-2 text-center text-xs font-semibold">
            <button
              type="button"
              @click="$emit('toggle-reaction', post.id)"
              class="flex items-center justify-center gap-2 py-2 rounded-xl transition-colors cursor-pointer group"
              :class="isLiked ? 'text-rose-600 bg-rose-50/50 hover:bg-rose-50' : 'text-gray-600 hover:bg-gray-100/80'"
            >
              <Heart class="w-4 h-4 transition-transform active:scale-90" :class="isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-500 group-hover:text-rose-500'" />
              <span :class="isLiked ? 'font-bold text-rose-600' : ''">Like</span>
            </button>
            <button
              v-if="post.disable_comments"
              type="button"
              class="flex items-center justify-center gap-2 py-2 rounded-xl text-gray-400 bg-gray-50/80 cursor-not-allowed select-none"
              title="Comments are turned off"
              disabled
            >
              <MessageCircleOff class="w-4 h-4 text-gray-400" />
              <span>Comments Off</span>
            </button>
            <button
              v-else
              type="button"
              @click="focusCommentInput"
              class="flex items-center justify-center gap-2 py-2 rounded-xl text-gray-600 hover:bg-gray-100/80 transition-colors cursor-pointer group"
            >
              <MessageCircle class="w-4 h-4 text-gray-500 group-hover:text-ic-primary" />
              <span>Comment</span>
            </button>
          </div>

          <!-- Comments Section -->
          <div class="p-4">
            <!-- Loading Indicator -->
            <div v-if="commentsLoading" class="flex items-center justify-center gap-2 py-8">
              <div class="w-5 h-5 border-2 border-ic-primary/20 border-t-ic-primary rounded-full animate-spin"></div>
              <span class="font-mono text-xs text-gray-400">Loading comments...</span>
            </div>

            <!-- Error State -->
            <div v-else-if="commentsError" class="text-center py-6 text-xs text-rose-500">
              {{ commentsError }}
            </div>

            <!-- Empty Comments State -->
            <div v-else-if="comments.length === 0" class="text-center py-8 text-gray-400 font-mono text-xs">
              <span v-if="post.disable_comments">Comments are disabled for this post</span>
              <span v-else>No comments yet · Be the first to comment!</span>
            </div>

            <!-- Comments Stream -->
            <div v-else class="space-y-3.5">
              <CommentItem
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                :post-id="post.id"
                :current-user-id="currentUser?.id"
                :is-admin="isAdmin"
                @reply="handleReply"
                @deleted="handleCommentDeleted"
                @updated="handleCommentUpdated"
              />
            </div>
          </div>
        </div>

        <!-- Sticky Comment Input at Bottom (or Disabled State Notice) -->
        <div v-if="post.disable_comments" class="px-4 py-3.5 border-t border-gray-100 bg-gray-50/90 shrink-0 flex items-center justify-center gap-2 text-gray-500 select-none">
          <MessageCircleOff class="w-4 h-4 text-gray-400" />
          <span class="font-mono text-xs text-gray-500 font-medium">Comments are turned off for this post</span>
        </div>
        <div v-else class="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
          <!-- Replying Pill -->
          <div v-if="replyingTo" class="flex items-center justify-between mb-1.5 px-2.5 py-1 bg-purple-50 border border-purple-100 rounded-lg text-xs">
            <span class="font-mono text-[10px] text-ic-primary truncate">
              Replying to <span class="font-bold">@{{ replyingTo.user || 'User' }}</span>
            </span>
            <button
              type="button"
              @click="cancelReply"
              class="text-gray-400 hover:text-gray-600 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div class="flex items-start gap-2.5">
            <!-- Current User Avatar -->
            <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-gray-100 bg-gray-100">
              <img
                v-if="userProfilePic"
                :src="userProfilePic"
                :alt="currentUserInitials"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-ic-primary to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {{ currentUserInitials }}
              </div>
            </div>

            <!-- Input Container -->
            <div class="flex-1 min-w-0">
              <div class="relative flex items-center bg-gray-100/80 hover:bg-gray-100 rounded-2xl border border-transparent focus-within:border-ic-primary/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-ic-primary/10 transition-all">
                <input
                  ref="commentInput"
                  v-model="newComment"
                  :placeholder="replyingTo ? `Write a reply to @${replyingTo.user}...` : `Comment as ${currentUserName}...`"
                  class="flex-1 text-xs sm:text-sm bg-transparent px-3.5 py-2.5 focus:outline-none placeholder:text-gray-400 text-gray-800"
                  :disabled="posting"
                  @keydown.enter.exact.prevent="postComment"
                  @keydown.escape="cancelReply"
                />

                <button
                  v-if="newComment.trim()"
                  type="button"
                  @click="postComment"
                  :disabled="posting"
                  class="px-3 py-1 mr-1 text-xs font-mono font-bold uppercase tracking-wider text-ic-primary hover:text-ic-secondary disabled:opacity-40 transition-colors cursor-pointer shrink-0"
                >
                  <span v-if="posting" class="inline-block w-3.5 h-3.5 border-2 border-ic-primary/30 border-t-ic-primary rounded-full animate-spin"></span>
                  <span v-else>Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { listComments, createComment, extractComments } from '@/services/commentService'
import CommentItem from './CommentItem.vue'
import CategoryBadge from './CategoryBadge.vue'
import MediaGallery from './MediaGallery.vue'
import { X, Heart, MessageCircle, MessageCircleOff } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  post: { type: Object, required: true },
  isLiked: { type: Boolean, default: false },
  localReactionCount: { type: Number, default: 0 }
})

const emit = defineEmits(['close', 'toggle-reaction', 'comment-count-changed'])

const authStore = useAuthStore()
const currentUser = computed(() => authStore.user)
const isAdmin = computed(() => authStore.isAdmin)

const currentMediaIndex = ref(0)
const hasMedia = computed(() => props.post?.media && props.post.media.length > 0)

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

// Comments State
const comments = ref([])
const commentsLoading = ref(false)
const commentsError = ref(null)
const newComment = ref('')
const posting = ref(false)
const replyingTo = ref(null)
const commentInput = ref(null)

// Focus management
const focusCommentInput = () => {
  nextTick(() => {
    commentInput.value?.focus()
  })
}

// Watch modal state
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    currentMediaIndex.value = 0
    await fetchComments()
  } else {
    document.body.style.overflow = ''
    newComment.value = ''
    replyingTo.value = null
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})

const close = () => {
  emit('close')
}

// Authors and Users styling
const authorInitials = computed(() => {
  const name = props.post.user_name || 'U'
  const parts = name.trim().split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
  return name.substring(0, 2).toUpperCase()
})

const authorAvatar = computed(() => {
  // Prioritize post.user_avatar or post.user_profile as they should be provided by the backend and normalized
  const avatar = props.post.user_avatar || props.post.user_profile
  if (avatar) return normalizeUrl(avatar)

  const user = currentUser.value
  if (!user) return null

  // Check if current user is the author
  const isAuthor = 
    (user.id && String(user.id) === String(props.post.user_id)) ||
    (user.username && user.username === props.post.user_name) ||
    (user.email && user.email === props.post.user_name) ||
    (user.full_name && user.full_name === props.post.user_name) ||
    (`${user.first_name || ''} ${user.last_name || ''}`.trim() === props.post.user_name)

  if (isAuthor && user.user_avatar) {
    return normalizeUrl(user.user_avatar)
  }
  
  return null
})

const currentUserInitials = computed(() => {
  const user = currentUser.value
  if (!user) return 'U'
  if (user.student?.s_fname && user.student?.s_lname) {
    return `${user.student.s_fname.charAt(0)}${user.student.s_lname.charAt(0)}`.toUpperCase()
  }
  const firstName = user.first_name || user.firstName || ''
  const lastName = user.last_name || user.lastName || ''
  if (firstName && lastName) return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  const fullName = user.full_name || user.fullName || ''
  if (fullName) {
    const parts = fullName.split(' ').filter(p => p.length > 0)
    if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
    return fullName.substring(0, 2).toUpperCase()
  }
  return user.username ? user.username.substring(0, 2).toUpperCase() : 'U'
})

const currentUserName = computed(() => {
  const user = currentUser.value
  if (!user) return 'User'
  if (user.student?.s_fname && user.student?.s_lname) {
    return `${user.student.s_fname} ${user.student.s_lname}`.trim()
  }
  const firstName = user.first_name || user.firstName || ''
  const lastName = user.last_name || user.lastName || ''
  if (firstName || lastName) return `${firstName} ${lastName}`.trim()
  if (user.full_name) return user.full_name
  return user.username || 'User'
})

const userProfilePic = computed(() => {
  const user = currentUser.value
  if (!user) return null
  if (user.user_avatar) return normalizeUrl(user.user_avatar)
  return null
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

// Comment API
const fetchComments = async () => {
  commentsLoading.value = true
  commentsError.value = null
  const result = await listComments(props.post.id)
  if (result.success) {
    comments.value = extractComments(result)
  } else {
    commentsError.value = result.error || 'Unable to load comments.'
  }
  commentsLoading.value = false
}

const handleReply = (comment) => {
  replyingTo.value = comment
  focusCommentInput()
}

const cancelReply = () => {
  replyingTo.value = null
  newComment.value = ''
}

const postComment = async () => {
  if (!newComment.value.trim() || posting.value) return
  
  posting.value = true
  const parentId = replyingTo.value ? replyingTo.value.id : null
  const result = await createComment(props.post.id, newComment.value, parentId)
  
  if (result.success) {
    newComment.value = ''
    replyingTo.value = null

    // Ensure newly created comment never inherits a stale reaction from localStorage
    const createdId = result.data?.id || result.data?.data?.id
    if (createdId) {
      const userId = currentUser.value?.id || 'anon'
      try {
        const key = `comment_reactions_${userId}`
        const stored = JSON.parse(localStorage.getItem(key) || '{}')
        if (stored[String(createdId)]) {
          delete stored[String(createdId)]
          localStorage.setItem(key, JSON.stringify(stored))
        }
      } catch {}
    }

    await fetchComments()
    
    // Tell parent to increase local comment count
    emit('comment-count-changed', comments.value.length)
  }
  posting.value = false
}

const handleCommentDeleted = (commentId) => {
  comments.value = comments.value.filter(c => c.id !== commentId)
  emit('comment-count-changed', comments.value.length)
}

const handleCommentUpdated = (updatedComment) => {
  const idx = comments.value.findIndex(c => c.id === updatedComment.id)
  if (idx !== -1) {
    comments.value[idx] = { ...comments.value[idx], ...updatedComment }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #D1D5DB;
}
</style>
