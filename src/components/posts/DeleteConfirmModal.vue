<template>
  <Teleport to="body">
    <div 
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[130] p-4 animate-in fade-in duration-150"
      @click.self="handleClose"
    >
      <!-- Modern Dialog Card (Linear / Facebook / Threads Style) -->
      <div 
        class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.2),0_40px_90px_-20px_rgba(0,0,0,0.12)] border border-gray-200/80 animate-in zoom-in-95 duration-150"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 pt-5 pb-0 flex items-start justify-between gap-3">
          <div>
            <h3 class="font-sans text-base sm:text-lg font-bold text-gray-900 leading-snug">
              Delete post?
            </h3>
            <p class="text-xs text-gray-500 mt-1 leading-relaxed">
              This action cannot be undone. This post, attachments, and comments will be permanently removed.
            </p>
          </div>
          <button
            type="button"
            @click="handleClose"
            class="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer shrink-0 -mt-1 -mr-1"
            title="Close"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Body Content -->
        <div class="px-6 pt-3.5 pb-4">
          <!-- Post Preview Box -->
          <div v-if="post" class="p-3 bg-gray-50/90 rounded-xl border border-gray-200/80 text-left space-y-2">
            <div class="flex items-center gap-2.5">
              <div class="w-6 h-6 rounded-full overflow-hidden ring-1 ring-gray-200/90 bg-gray-100 flex items-center justify-center shrink-0">
                <img
                  v-if="authorAvatar && !avatarError"
                  :src="authorAvatar"
                  :alt="post.user_name || 'Author'"
                  class="w-full h-full object-cover"
                  @error="avatarError = true"
                />
                <span v-else class="text-[10px] font-bold text-gray-600 font-mono">
                  {{ authorInitials }}
                </span>
              </div>
              <span class="text-xs font-medium text-gray-900 truncate">{{ post.user_name || 'Author' }}</span>
              <span class="font-mono text-[10px] text-gray-400 ml-auto">{{ formattedPostDate }}</span>
            </div>

            <p v-if="post.content" class="text-xs text-gray-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
              {{ post.content }}
            </p>

            <div v-if="post.media && post.media.length > 0" class="font-mono text-[10px] text-gray-400 pt-0.5">
              {{ post.media.length }} {{ post.media.length === 1 ? 'media file' : 'media files' }} attached
            </div>
          </div>

          <!-- Error Feedback -->
          <div v-if="error" class="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
            <p class="text-xs text-rose-600 font-mono text-center">{{ error }}</p>
          </div>
        </div>

        <!-- Footer Action Bar -->
        <div class="px-6 py-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            type="button"
            @click="handleClose"
            class="px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer"
            :disabled="isDeleting"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleConfirm"
            class="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <Trash2 v-else class="w-3.5 h-3.5" />
            <span>{{ isDeleting ? 'Deleting...' : 'Delete post' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Trash2, X } from 'lucide-vue-next'
import { deletePost } from '@/services/postService'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  post: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const isDeleting = ref(false)
const error = ref('')
const avatarError = ref(false)

// Normalize URL helper
const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return ''
  
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

const authorAvatar = computed(() => {
  if (avatarError.value || !props.post) return null
  const avatar = props.post.user_avatar || props.post.user_profile || props.post.author_avatar
  if (avatar) return normalizeUrl(avatar)

  const user = authStore.user
  if (user) {
    const isAuthor = 
      (user.id && String(user.id) === String(props.post.user_id)) ||
      (user.username && user.username === props.post.user_name) ||
      (user.email && user.email === props.post.user_name) ||
      (user.full_name && user.full_name === props.post.user_name) ||
      (`${user.first_name || ''} ${user.last_name || ''}`.trim() === props.post.user_name)

    if (isAuthor && (user.user_avatar || user.avatar || user.profile_picture)) {
      return normalizeUrl(user.user_avatar || user.avatar || user.profile_picture)
    }
  }
  return '/default_profile.png'
})

const authorInitials = computed(() => {
  const name = props.post?.user_name || 'Admin'
  const parts = name.split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const formattedPostDate = computed(() => {
  if (!props.post) return ''
  const p = props.post
  const dateStr = p.created_at || p.date || p.updated_at || p.timestamp || p.created || p.time
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  
  const now = new Date()
  const diffMs = Math.abs(now - date)
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    error.value = ''
    avatarError.value = false
  }
})

watch(() => props.post, () => {
  avatarError.value = false
})

const handleKeydown = (e) => {
  if (props.isOpen && e.key === 'Escape') {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const handleConfirm = async () => {
  if (!props.post?.id) return
  
  isDeleting.value = true
  error.value = ''
  
  try {
    const result = await deletePost(props.post.id)
    
    if (result.success) {
      emit('success', props.post.id)
      handleClose()
    } else {
      error.value = result.error || 'Failed to delete post.'
    }
  } catch (err) {
    console.error('Error deleting post:', err)
    error.value = 'Unable to delete post at this time.'
  } finally {
    isDeleting.value = false
  }
}

const handleClose = () => {
  if (isDeleting.value) return
  emit('close')
}
</script>
