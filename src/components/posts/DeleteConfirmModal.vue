<template>
  <Teleport to="body">
    <div 
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="handleClose"
    >
      <div 
        class="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
        @click.stop
      >
        <!-- Icon -->
        <div class="flex justify-center pt-6">
          <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-5 text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Post?</h3>
          <p class="text-sm text-gray-500">
            This action cannot be undone. The post and all associated images will be permanently deleted.
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 px-6 pb-6">
          <button
            @click="handleClose"
            class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            :disabled="isDeleting"
          >
            Cancel
          </button>
          <button
            @click="handleConfirm"
            class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="px-6 pb-4">
          <p class="text-sm text-red-600 text-center">{{ error }}</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { deletePost } from '@/services/postService'

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

const isDeleting = ref(false)
const error = ref('')

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    error.value = ''
  }
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
      error.value = result.error || 'Failed to delete post'
    }
  } catch (err) {
    console.error('Error deleting post:', err)
    error.value = 'An unexpected error occurred'
  } finally {
    isDeleting.value = false
  }
}

const handleClose = () => {
  if (isDeleting.value) return
  emit('close')
}
</script>
