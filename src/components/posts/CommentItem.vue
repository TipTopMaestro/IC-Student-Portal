<template>
  <div class="flex gap-2.5" :class="depth > 0 ? 'ml-10 mt-3' : ''">
    <!-- Avatar -->
    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
      {{ getInitials(comment.user) }}
    </div>

    <div class="flex-1 min-w-0">
      <!-- Comment Bubble -->
      <div class="bg-gray-50 rounded-2xl px-3.5 py-2.5 inline-block max-w-full">
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

      <!-- Action Bar -->
      <div class="flex items-center gap-3 mt-1 px-1">
        <span class="text-[11px] text-gray-400">{{ formattedTime }}</span>
        <button
          v-if="depth < 1"
          @click="$emit('reply', comment)"
          class="text-[11px] font-semibold text-gray-500 hover:text-gray-700"
        >
          Reply
        </button>
        <button
          v-if="isOwner || isAdmin"
          @click="isEditing = true"
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
import { ref, computed, nextTick } from 'vue'
import { updateComment, deleteComment, getReplies, extractComments } from '@/services/commentService'

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

const isOwner = computed(() => {
  if (!props.currentUserId) return false
  return String(props.comment.user_id) === String(props.currentUserId)
})

const replyCount = computed(() => {
  const rc = props.comment.reply_count
  if (typeof rc === 'number') return rc
  if (typeof rc === 'string') return parseInt(rc, 10) || 0
  return 0
})

const hasReplies = computed(() => replyCount.value > 0 || replies.value.length > 0)

const formattedTime = computed(() => {
  const dateStr = props.comment.created_at
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
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
    const data = result.data?.data || result.data
    // The API returns PostCommentDetail which has a `replies` field inside
    // Try multiple parsing strategies to handle different response shapes
    let items = []
    if (Array.isArray(data)) {
      items = data
    } else if (data?.replies && Array.isArray(data.replies)) {
      items = data.replies
    } else if (data?.results && Array.isArray(data.results)) {
      items = data.results
    } else if (data?.data && Array.isArray(data.data)) {
      items = data.data
    }
    // If replies came as a JSON string (API schema says type: string), parse it
    if (typeof data?.replies === 'string') {
      try { items = JSON.parse(data.replies) } catch (e) { items = [] }
    }
    replies.value = items
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
import { watch } from 'vue'
watch(isEditing, (val) => {
  if (val) {
    editContent.value = props.comment.content
    nextTick(() => editInput.value?.focus())
  }
})
</script>
