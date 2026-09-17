<template>
  <div class="border-t border-gray-100 bg-gray-50/40">
    <!-- Comments Disabled -->
    <div v-if="disableComments" class="px-4 py-2.5 bg-gray-50/80">
      <p class="font-mono text-[11px] text-gray-400 text-center uppercase tracking-wider">Comments are disabled for this post</p>
    </div>

    <template v-else>
      <!-- View / Hide Comments Header Trigger -->
      <div v-if="localCount > 0" class="px-4 pt-2.5 pb-1 flex items-center justify-between">
        <button
          type="button"
          @click="toggleExpand"
          class="font-mono text-[11px] font-semibold text-gray-500 hover:text-ic-primary transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>{{ expanded ? 'Hide comments' : `View all ${localCount} comment${localCount === 1 ? '' : 's'}` }}</span>
          <span class="text-[10px] text-gray-400">({{ expanded ? '▲' : '▼' }})</span>
        </button>

        <span v-if="loading" class="font-mono text-[10px] text-gray-400 animate-pulse">
          loading...
        </span>
      </div>

      <!-- Expanded Comments List -->
      <div v-if="expanded" class="px-4 pt-1 pb-2 space-y-3">
        <!-- Loading State -->
        <div v-if="loading && comments.length === 0" class="flex items-center justify-center gap-2 py-4">
          <div class="w-4 h-4 border-2 border-ic-primary/20 border-t-ic-primary rounded-full animate-spin"></div>
          <span class="font-mono text-[11px] text-gray-400">Loading discussion...</span>
        </div>

        <!-- Comments Stream -->
        <div v-else-if="comments.length > 0" class="space-y-3.5 pt-1">
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

        <!-- Empty State -->
        <div v-else class="py-4 text-center">
          <p class="text-xs text-gray-400 font-mono uppercase tracking-wider">No comments yet · Start the conversation</p>
        </div>
      </div>

      <!-- Clean Inline Comment Input Bar -->
      <div class="px-4 py-3 border-t border-gray-100/80 bg-white flex items-start gap-2.5">
        <!-- Current User Avatar -->
        <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-gray-100 bg-gray-100">
          <img
            v-if="userProfilePic"
            :src="userProfilePic"
            :alt="userInitials"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-ic-primary to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
            {{ userInitials }}
          </div>
        </div>

        <!-- Input Box and Action Controls -->
        <div class="flex-1 min-w-0">
          <!-- Active Reply Badge -->
          <div v-if="replyingTo" class="flex items-center justify-between mb-1.5 px-2.5 py-1 bg-purple-50 border border-purple-100 rounded-lg text-xs">
            <span class="font-mono text-[10px] text-ic-primary truncate">
              Replying to <span class="font-bold">@{{ replyingTo.user || 'User' }}</span>
            </span>
            <button
              type="button"
              @click="cancelReply"
              class="text-gray-400 hover:text-gray-600 font-bold ml-2 cursor-pointer"
              title="Cancel reply"
            >
              ✕
            </button>
          </div>

          <div class="relative flex items-center bg-gray-100/80 hover:bg-gray-100 rounded-2xl border border-transparent focus-within:border-ic-primary/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-ic-primary/10 transition-all">
            <input
              ref="commentInput"
              v-model="newComment"
              :placeholder="replyingTo ? `Write a reply to @${replyingTo.user}...` : 'Write a comment...'"
              class="flex-1 text-xs sm:text-sm bg-transparent px-3.5 py-2 focus:outline-none placeholder:text-gray-400 text-gray-800"
              :disabled="posting"
              @keydown.enter.exact.prevent="postComment"
              @keydown.escape="cancelReply"
            />

            <!-- Post Button -->
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

const toggleExpand = async () => {
  expanded.value = !expanded.value
  if (expanded.value && comments.value.length === 0) {
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

    await fetchComments()

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

const focusInput = async () => {
  if (!expanded.value) {
    expanded.value = true
    if (comments.value.length === 0) {
      await fetchComments()
    }
  }
  nextTick(() => {
    commentInput.value?.focus()
  })
}

defineExpose({
  focusInput,
  toggleExpand,
  expandComments
})
</script>
