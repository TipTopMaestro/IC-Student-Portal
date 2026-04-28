<template>
  <div class="border-t border-gray-100">
    <!-- Comments Disabled -->
    <div v-if="disableComments" class="px-4 py-3">
      <p class="text-xs text-gray-400 text-center">Comments are disabled for this post</p>
    </div>

    <template v-else>
      <!-- Reaction + Comment summary -->
      <div v-if="commentsCount > 0 && !expanded" class="px-4 pt-1 pb-2">
        <button
          @click="expandComments"
          class="text-[13px] text-gray-500 hover:text-gray-700"
        >
          View {{ commentsCount > 2 ? `all ${commentsCount}` : '' }} comment{{ commentsCount !== 1 ? 's' : '' }}
        </button>
      </div>

      <!-- Expanded Comments -->
      <div v-if="expanded" class="px-4 pt-2 pb-1">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center gap-2 py-3">
          <div class="w-5 h-5 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
          <span class="text-xs text-gray-400">Loading comments...</span>
        </div>

        <!-- Comment List -->
        <div v-else-if="comments.length > 0" class="space-y-3 pb-2">
          <CommentItem
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            :post-id="postId"
            :current-user-id="currentUserId"
            :is-admin="isAdmin"
            @reply="handleReplyTo"
            @deleted="handleCommentDeleted"
            @updated="handleCommentUpdated"
          />
        </div>

        <!-- No Comments -->
        <div v-else class="py-3">
          <p class="text-xs text-gray-400 text-center">No comments yet. Be the first!</p>
        </div>

        <!-- Collapse -->
        <button
          v-if="comments.length > 0"
          @click="expanded = false"
          class="text-xs text-gray-400 hover:text-gray-600 mb-2"
        >
          Hide comments
        </button>
      </div>

      <!-- Comment Input -->
      <div class="px-4 py-3 flex items-start gap-2.5 border-t border-gray-50">
        <img
          v-if="userProfilePic"
          :src="userProfilePic"
          :alt="userInitials"
          class="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <div v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-ic-primary to-purple-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
          {{ userInitials }}
        </div>
        <div class="flex-1 relative">
          <div class="flex items-center bg-gray-50 rounded-full border border-gray-200 focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-gray-200 transition-all">
            <input
              ref="commentInput"
              v-model="newComment"
              :placeholder="replyingTo ? `Reply to ${replyingTo.user}...` : 'Add a comment...'"
              class="flex-1 text-[13px] bg-transparent px-4 py-2.5 focus:outline-none placeholder-gray-400"
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
          <!-- Reply indicator -->
          <div v-if="replyingTo" class="flex items-center gap-1.5 mt-1.5 px-1">
            <span class="text-[11px] text-gray-400">Replying to <span class="font-medium text-gray-500">{{ replyingTo.user }}</span></span>
            <button @click="cancelReply" class="text-[11px] text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import CommentItem from './CommentItem.vue'
import { listComments, createComment, extractComments } from '@/services/commentService'

const props = defineProps({
  postId: { type: [Number, String], required: true },
  commentsCount: { type: [Number, String], default: 0 },
  disableComments: { type: Boolean, default: false }
})

const emit = defineEmits(['comment-count-changed'])

const authStore = useAuthStore()
const currentUserId = computed(() => authStore.user?.id)
const isAdmin = computed(() => authStore.isAdmin)
const userInitials = computed(() => {
  const user = authStore.user
  if (!user) return 'U'
  if (user.student?.s_fname && user.student?.s_lname) {
    return `${user.student.s_fname[0]}${user.student.s_lname[0]}`.toUpperCase()
  }
  const first = user.first_name || user.firstName || ''
  const last = user.last_name || user.lastName || ''
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase()
  if (user.full_name) {
    const parts = user.full_name.trim().split(' ').filter(p => p.length)
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    return user.full_name.substring(0, 2).toUpperCase()
  }
  return 'U'
})

const userProfilePic = computed(() => {
  const user = authStore.user
  if (!user) return null
  const pic = user.profile_picture || user.avatar || user.photo || user.profile_image
  if (pic) return pic.replace(/^http:\/\//i, 'https://')
  // Check nested student profile picture
  if (user.student?.profile_picture) return user.student.profile_picture.replace(/^http:\/\//i, 'https://')
  return null
})

const expanded = ref(false)
const loading = ref(false)
const comments = ref([])
const newComment = ref('')
const posting = ref(false)
const replyingTo = ref(null)
const commentInput = ref(null)
const localCount = ref(typeof props.commentsCount === 'string' ? parseInt(props.commentsCount, 10) || 0 : props.commentsCount || 0)

const expandComments = async () => {
  expanded.value = true
  if (comments.value.length === 0) {
    await fetchComments()
  }
}

const fetchComments = async () => {
  loading.value = true
  const result = await listComments(props.postId, { per_page: 50 })
  if (result.success) {
    comments.value = extractComments(result)
  }
  loading.value = false
}

const postComment = async () => {
  const content = newComment.value.trim()
  if (!content || posting.value) return

  posting.value = true
  const parentId = replyingTo.value?.id || null
  const result = await createComment(props.postId, content, parentId)

  if (result.success) {
    newComment.value = ''
    replyingTo.value = null
    localCount.value += 1
    emit('comment-count-changed', localCount.value)

    // Always re-fetch comments from the API to ensure consistent
    // user display names (create returns full name, list returns username)
    await fetchComments()

    // Auto-expand if not already
    if (!expanded.value) {
      expanded.value = true
    }
  }
  posting.value = false
}

const handleReplyTo = (comment) => {
  replyingTo.value = comment
  nextTick(() => commentInput.value?.focus())
}

const cancelReply = () => {
  replyingTo.value = null
}

const handleCommentDeleted = (commentId) => {
  comments.value = comments.value.filter(c => c.id !== commentId)
  localCount.value = Math.max(0, localCount.value - 1)
  emit('comment-count-changed', localCount.value)
}

const handleCommentUpdated = (updatedComment) => {
  const idx = comments.value.findIndex(c => c.id === updatedComment.id)
  if (idx !== -1) {
    comments.value[idx] = { ...comments.value[idx], ...updatedComment }
  }
}
</script>
