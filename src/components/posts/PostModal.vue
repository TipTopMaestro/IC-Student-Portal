<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-6 bg-black/60 backdrop-blur-sm" @click.self="close">
    <div class="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl h-[90vh] md:h-[85vh] flex flex-col md:flex-row relative animate-in fade-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200">
      
      <!-- Close button (absolute) -->
      <button @click="close" class="absolute top-3 right-3 z-[110] w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-gray-800 md:text-white transition-colors md:top-4 md:right-4 mix-blend-difference">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Left Side: Media (Only shows if post has media, hidden on mobile) -->
      <div v-if="hasMedia" class="hidden md:flex w-full md:w-[55%] bg-black items-center justify-center shrink-0 min-h-[300px] md:min-h-[500px]">
        <!-- Carousel for Media -->
        <div class="relative w-full h-full flex items-center justify-center group">
          <img 
            :src="normalizeUrl(post.media[currentMediaIndex].media_url)" 
            class="max-w-full max-h-full object-contain" 
            alt="Post media" 
          />
          
          <!-- Prev Button -->
          <button 
            v-if="post.media.length > 1 && currentMediaIndex > 0"
            @click="currentMediaIndex--"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <!-- Next Button -->
          <button 
            v-if="post.media.length > 1 && currentMediaIndex < post.media.length - 1"
            @click="currentMediaIndex++"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
          
          <!-- Indicators -->
          <div v-if="post.media.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            <div 
              v-for="(_, index) in post.media" 
              :key="index"
              class="w-1.5 h-1.5 rounded-full transition-all"
              :class="index === currentMediaIndex ? 'bg-white scale-110' : 'bg-white/50'"
            ></div>
          </div>
        </div>
      </div>

      <!-- Right Side: Details & Comments -->
      <div class="w-full flex-1 md:h-full flex flex-col bg-white overflow-hidden md:max-h-none" :class="hasMedia ? 'md:w-[45%]' : 'max-w-2xl mx-auto md:border-x border-gray-100'">
        
        <!-- Header -->
        <div class="flex items-center gap-3 p-4 border-b border-gray-100 shrink-0">
          <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-gray-100">
            <img v-if="authorAvatar" :src="authorAvatar" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-gradient-to-br from-ic-primary to-purple-500 flex items-center justify-center text-white text-xs font-medium">
              {{ authorInitials }}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-gray-900 truncate">{{ post.user_name || 'User' }}</h3>
            <p class="text-xs text-gray-500">{{ formattedDate }}</p>
          </div>
        </div>

        <!-- Scrollable Content & Comments -->
        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white min-h-0">
          <!-- Post Text -->
          <div v-if="post.content" class="text-sm text-gray-800 whitespace-pre-wrap break-words mb-6">
            {{ post.content }}
          </div>
          
          <!-- Divider if there are comments -->
          <div v-if="post.content" class="h-px bg-gray-100 w-full mb-4"></div>

          <!-- Comments List (Reuse CommentSection logic but adapted for this view) -->
          <div v-if="commentsLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-ic-primary"></div>
          </div>
          <div v-else-if="commentsError" class="text-center py-8 text-sm text-red-500">
            {{ commentsError }}
          </div>
          <div v-else-if="comments.length === 0" class="text-center py-12 flex flex-col items-center">
            <svg class="w-10 h-10 text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <p class="text-sm font-medium text-gray-900">No comments yet.</p>
            <p class="text-xs text-gray-500 mt-1">Start the conversation.</p>
          </div>
          <div v-else class="space-y-4">
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

        <!-- Footer Actions (Reactions) -->
        <div class="p-3 border-t border-gray-100 shrink-0 bg-white z-10">
          <div class="flex items-center gap-4 mb-2">
            <button @click="$emit('toggle-reaction', post.id)" class="group flex items-center gap-1.5 transition-colors" :class="isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'">
              <svg class="w-6 h-6 transition-transform" :class="isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button @click="focusCommentInput" class="group flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
          <div class="text-sm font-semibold text-gray-900">
            {{ localReactionCount }} {{ localReactionCount === 1 ? 'like' : 'likes' }}
          </div>
        </div>

        <!-- Comment Input area -->
        <div class="p-3 border-t border-gray-100 shrink-0 bg-gray-50/50 z-10 relative">
          <!-- Reply indicator -->
          <div v-if="replyingTo" class="flex items-center gap-1.5 px-2 absolute -top-8 left-3">
            <span class="text-[11px] text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              Replying to <span class="font-medium text-gray-700">{{ replyingTo.user || 'User' }}</span>
              <button @click="cancelReply" class="text-gray-400 hover:text-gray-600 ml-1">✕</button>
            </span>
          </div>
          
          <div class="flex items-center gap-2.5">
            <div v-if="userProfilePic" class="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-gray-100">
              <img :src="userProfilePic" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-ic-primary to-purple-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
              {{ currentUserInitials }}
            </div>
            
            <div class="flex-1 relative">
              <div class="flex items-center bg-white rounded-full border border-gray-200 focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-gray-200 transition-all px-1">
                <input
                  ref="commentInput"
                  v-model="newComment"
                  :placeholder="replyingTo ? `Reply...` : 'Add a comment...'"
                  class="flex-1 text-[13px] bg-transparent px-3 py-2.5 focus:outline-none placeholder-gray-400"
                  @keydown.enter.exact.prevent="postComment"
                  @keydown.escape="cancelReply"
                />
                <button
                  v-if="newComment.trim()"
                  @click="postComment"
                  :disabled="posting"
                  class="text-[13px] font-semibold text-ic-primary hover:text-ic-secondary px-3 py-2 disabled:opacity-40 shrink-0"
                >
                  {{ posting ? '...' : 'Post' }}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { listComments, createComment, extractComments } from '@/services/commentService'
import CommentItem from './CommentItem.vue'

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
  if (!url) return ''
  return url.replace(/^http:\/\//i, 'https://')
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
    commentsError.value = result.error
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
