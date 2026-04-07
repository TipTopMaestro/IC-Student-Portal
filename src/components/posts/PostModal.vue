<template>
  <Teleport to="body">
    <div 
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="handleClose"
    >
      <div 
        class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEditing ? 'Edit Post' : 'Create Post' }}
          </h2>
          <button 
            @click="handleClose"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
            :disabled="isSubmitting"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto">
          <div class="p-5 space-y-5">
            <!-- Content -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Content <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.content"
                rows="5"
                placeholder="What's on your mind?"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ic-primary/20 focus:border-ic-primary transition-colors resize-none"
                :class="{ 'border-red-500': errors.content }"
                :disabled="isSubmitting"
              />
              <div class="flex justify-between mt-1">
                <p v-if="errors.content" class="text-sm text-red-500">{{ errors.content }}</p>
                <p class="text-xs text-gray-400 ml-auto">{{ form.content.length }} characters</p>
              </div>
            </div>

            <!-- Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Images <span class="text-gray-400 font-normal">(optional)</span>
              </label>
              <ImageUploader
                v-model="form.images"
                :existing-media="existingMedia"
                :max-images="10"
                @remove-existing="handleRemoveExisting"
              />
            </div>

            <!-- Visibility -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="form.visibility" 
                    value="public"
                    class="w-4 h-4 text-ic-primary focus:ring-ic-primary"
                    :disabled="isSubmitting"
                  />
                  <span class="text-sm text-gray-700">Public</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="form.visibility" 
                    value="private"
                    class="w-4 h-4 text-ic-primary focus:ring-ic-primary"
                    :disabled="isSubmitting"
                  />
                  <span class="text-sm text-gray-700">Private</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              @click="handleClose"
              class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 text-sm font-medium text-white bg-ic-primary rounded-xl hover:bg-ic-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              :disabled="isSubmitting || !isValid"
            >
              <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Post') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import ImageUploader from './ImageUploader.vue'
import { createPost, updatePost } from '@/services/postService'

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

const isSubmitting = ref(false)
const removeMediaIds = ref([])

const form = reactive({
  content: '',
  visibility: 'public',
  images: []
})

const errors = reactive({
  content: ''
})

const isEditing = computed(() => !!props.post)

const existingMedia = computed(() => {
  if (!props.post?.media) return []
  return props.post.media.filter(m => !removeMediaIds.value.includes(m.id))
})

const isValid = computed(() => {
  return form.content.trim().length > 0
})

// Reset form when modal opens/closes or post changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})

watch(() => props.post, (post) => {
  if (post && props.isOpen) {
    resetForm()
  }
})

const resetForm = () => {
  if (props.post) {
    form.content = props.post.content || ''
    form.visibility = props.post.visibility || 'public'
  } else {
    form.content = ''
    form.visibility = 'public'
  }
  form.images = []
  removeMediaIds.value = []
  errors.content = ''
}

const handleRemoveExisting = (mediaId) => {
  removeMediaIds.value.push(mediaId)
}

const validateForm = () => {
  errors.content = ''
  
  if (!form.content.trim()) {
    errors.content = 'Content is required'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    let result
    
    const postData = {
      content: form.content.trim(),
      visibility: form.visibility
    }
    
    if (isEditing.value) {
      result = await updatePost(
        props.post.id,
        postData,
        form.images,
        removeMediaIds.value
      )
    } else {
      result = await createPost(postData, form.images)
    }
    
    if (result.success) {
      emit('success', result.data)
      emit('close')
    } else {
      errors.content = result.error || 'Failed to save post'
    }
  } catch (error) {
    console.error('Error saving post:', error)
    errors.content = 'An unexpected error occurred'
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  if (isSubmitting.value) return
  emit('close')
}
</script>
