<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center z-[200] p-3 sm:p-4"
        @click.self="handleClose"
      >
        <div 
          class="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 relative animate-modal-pop"
          @click.stop
        >
          <!-- Header (Modern Social Style: Title + Author Info) -->
          <div class="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h2 class="font-pixel text-lg sm:text-xl text-gray-900 lowercase tracking-tight">
                {{ isEditing ? 'edit announcement' : 'create post' }}
              </h2>
              <span class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider hidden sm:inline-block">
                · bulletin
              </span>
            </div>
            
            <button 
              @click="handleClose"
              class="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
              :disabled="isSubmitting"
              aria-label="Close dialog"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Body / Form Area -->
          <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto flex flex-col">
            <div class="p-5 space-y-4 flex-1">
              <!-- Author Row with Category Selector Pill -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
                    <img 
                      v-if="userAvatar && !imageLoadFailed" 
                      :src="userAvatar" 
                      alt="Avatar"
                      @error="imageLoadFailed = true" 
                      class="w-full h-full object-cover" 
                    />
                    <span v-else class="font-mono text-xs font-semibold text-ic-primary">
                      {{ userInitials }}
                    </span>
                  </div>

                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-900 truncate leading-tight">
                      {{ userName }}
                    </p>
                    <!-- Category Selector Trigger Dropdown / Pill -->
                    <div class="relative mt-1 inline-block text-left" ref="categoryDropdownRef">
                      <button
                        type="button"
                        @click="categoryDropdownOpen = !categoryDropdownOpen"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200/60 font-mono text-[10px] font-semibold text-ic-primary uppercase tracking-wider transition-colors cursor-pointer select-none"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-ic-primary"></span>
                        <span>#{{ activeCategoryMeta.label.toLowerCase() }}</span>
                        <ChevronDown class="w-3 h-3 text-ic-primary/70 transition-transform duration-200" :class="{ 'rotate-180': categoryDropdownOpen }" />
                      </button>

                      <!-- Category Selector Floating Menu -->
                      <Transition
                        enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0"
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0"
                      >
                        <div 
                          v-if="categoryDropdownOpen"
                          class="absolute left-0 top-full mt-1.5 w-48 rounded-xl bg-white border border-gray-100 shadow-xl py-1 z-30 focus:outline-none"
                        >
                          <div class="px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                            Select Topic
                          </div>
                          <button
                            v-for="cat in categoryList"
                            :key="cat.key"
                            type="button"
                            @click="selectCategory(cat.key)"
                            class="w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors hover:bg-gray-50 cursor-pointer"
                            :class="form.category === cat.key ? 'font-semibold text-ic-primary bg-purple-50/40' : 'text-gray-700'"
                          >
                            <div class="flex items-center gap-2">
                              <span class="text-ic-primary font-mono text-xs">#</span>
                              <span>{{ cat.label }}</span>
                            </div>
                            <Check v-if="form.category === cat.key" class="w-3.5 h-3.5 text-ic-primary" />
                          </button>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </div>

                <!-- Character Count indicator -->
                <div class="shrink-0 text-right">
                  <span 
                    class="font-mono text-[10px] font-medium tracking-wider"
                    :class="form.content.length > 800 ? 'text-amber-500' : 'text-gray-400'"
                  >
                    {{ form.content.length }} chars
                  </span>
                </div>
              </div>

              <!-- Main Content Textarea (Borderless, natural social app feeling) -->
              <div class="relative">
                <textarea
                  v-model="form.content"
                  rows="4"
                  placeholder="What announcements or updates would you like to publish?"
                  class="w-full text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none bg-transparent leading-relaxed border-0 p-0 focus:ring-0"
                  :disabled="isSubmitting"
                  autofocus
                />
              </div>

              <!-- Inline Media Previews / Uploader Section -->
              <div class="border-t border-gray-100 pt-3">
                <!-- If Editing: Read-Only Media Strip with Info Note -->
                <div v-if="isEditing" class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Attached Media ({{ existingMedia.length }})
                    </span>
                    <span class="font-mono text-[9px] text-gray-400">
                      Media cannot be modified once published
                    </span>
                  </div>

                  <div v-if="existingMedia.length > 0" class="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1 py-1 custom-scrollbar">
                    <div
                      v-for="(media, idx) in existingMedia"
                      :key="media.id"
                      class="relative aspect-square rounded-lg overflow-hidden bg-neutral-900 border border-gray-200"
                    >
                      <video
                        v-if="media.media_type === 'video'"
                        :src="media.media_url"
                        class="w-full h-full object-cover pointer-events-none"
                      />
                      <img
                        v-else
                        :src="media.media_url"
                        :alt="`Media ${idx + 1}`"
                        class="w-full h-full object-cover"
                      />
                      <div class="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 rounded text-white font-mono text-[8px] font-medium leading-none">
                        {{ idx + 1 }}
                      </div>
                    </div>
                  </div>
                  <div v-else class="py-3 px-3.5 bg-gray-50 border border-gray-100 rounded-xl text-center font-mono text-[11px] text-gray-400">
                    No media attached to this post.
                  </div>
                </div>

                <!-- If Creating: Interactive Image / Video Uploader -->
                <div v-else class="space-y-2">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Attached Media ({{ totalMediaCount }}/80)
                    </span>
                    <button
                      type="button"
                      @click="triggerImagePicker"
                      class="font-mono text-[10px] font-medium uppercase tracking-wider text-ic-primary hover:text-ic-secondary transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Image class="w-3 h-3" />
                      <span>Add Media</span>
                    </button>
                  </div>

                  <ImageUploader
                    ref="imageUploaderRef"
                    v-model="form.images"
                    :max-images="80"
                  />
                </div>
              </div>

              <!-- Error Alert -->
              <div v-if="errors.content" class="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-xs">
                <AlertCircle class="w-4 h-4 shrink-0" />
                <span>{{ errors.content }}</span>
              </div>
            </div>

            <!-- Footer (Toolbar + Action Buttons) -->
            <div class="px-5 py-3.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3">
              <!-- Quick Attachment Toolbar (Only visible when creating) -->
              <div class="flex items-center gap-1">
                <button
                  v-if="!isEditing"
                  type="button"
                  @click="triggerImagePicker"
                  class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-gray-500 hover:text-ic-primary hover:bg-purple-50/80 transition-colors cursor-pointer text-xs font-medium"
                  title="Attach photos or videos (up to 80)"
                >
                  <Image class="w-4 h-4" />
                  <Film class="w-3.5 h-3.5" />
                  <span class="font-mono text-[10px] uppercase tracking-wider text-gray-500">Media</span>
                </button>
              </div>

              <!-- Modal Buttons -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="handleClose"
                  class="px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-wider text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                  :disabled="isSubmitting"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 font-mono text-[11px] font-medium uppercase tracking-wider text-white bg-ic-primary rounded-xl hover:bg-ic-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-[0_2px_8px_-2px_rgba(100,13,95,0.4)] cursor-pointer"
                  :disabled="isSubmitting || !isValid"
                >
                  <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>{{ isSubmitting ? 'Publishing...' : (isEditing ? 'Save Changes' : 'Publish Post') }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import ImageUploader from './ImageUploader.vue'
import { createPost, updatePost } from '@/services/postService'
import { CATEGORY_LIST, getCategoryMeta } from '@/constants/postCategories'
import { useAuthStore } from '@/stores/auth'
import { usePostPublishStore } from '@/stores/postPublishStore'
import {
  X,
  Image,
  Film,
  ChevronDown,
  Check,
  AlertCircle
} from 'lucide-vue-next'

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
const postPublishStore = usePostPublishStore()
const isSubmitting = ref(false)
const removeMediaIds = ref([])
const imageUploaderRef = ref(null)
const categoryDropdownOpen = ref(false)
const categoryDropdownRef = ref(null)
const imageLoadFailed = ref(false)

const form = reactive({
  content: '',
  category: 'general',
  images: []
})

const errors = reactive({
  content: ''
})

// Current user presentation
const userName = computed(() => {
  const u = authStore.user
  if (u) {
    return `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || 'System Administrator'
  }
  return 'System Administrator'
})

const userAvatar = computed(() => {
  const avatar = authStore.user?.user_avatar || 
                 authStore.user?.profile_url || 
                 authStore.user?.profile || 
                 '/default_profile.png'

  if (!avatar) return '/default_profile.png'
  if (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('/')) {
    return avatar
  }
  return `/${avatar}`
})

const userInitials = computed(() => {
  const u = authStore.user
  const f = (u?.first_name || u?.username || 'A')[0] || 'A'
  const l = (u?.last_name || '')[0] || ''
  return (f + l).toUpperCase()
})

const isEditing = computed(() => !!props.post)

const existingMedia = computed(() => {
  if (!props.post?.media) return []
  return props.post.media.filter(m => !removeMediaIds.value.includes(m.id))
})

const totalMediaCount = computed(() => {
  return existingMedia.value.length + (form.images?.length || 0)
})

const isValid = computed(() => {
  return form.content.trim().length > 0
})

const categoryList = CATEGORY_LIST

const activeCategoryMeta = computed(() => {
  return getCategoryMeta(form.category)
})

const selectCategory = (key) => {
  form.category = key
  categoryDropdownOpen.value = false
}

const triggerImagePicker = () => {
  imageUploaderRef.value?.openFilePicker?.()
}

// Click outside handler for category dropdown
const handleClickOutside = (e) => {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target)) {
    categoryDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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
    form.category = props.post.category || 'general'
  } else {
    form.content = ''
    form.category = 'general'
  }
  form.images = []
  removeMediaIds.value = []
  errors.content = ''
  categoryDropdownOpen.value = false
}

const handleRemoveExisting = (mediaId) => {
  removeMediaIds.value.push(mediaId)
}

const validateForm = () => {
  errors.content = ''
  
  if (!form.content.trim()) {
    errors.content = 'Post content is required'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  const postData = {
    content: form.content.trim(),
    category: form.category
  }

  // If creating a post, immediately close modal and publish in background
  if (!isEditing.value) {
    let previewUrl = null
    let isVideo = false

    if (form.images && form.images.length > 0) {
      const firstFile = form.images[0]
      isVideo = firstFile.type?.startsWith('video/') || false
      previewUrl = URL.createObjectURL(firstFile)
    }

    // Hand off to global publisher
    postPublishStore.publish({
      postData,
      images: [...form.images],
      previewUrl,
      isVideo
    })

    // Immediately close modal & reset
    emit('close')
    resetForm()
    return
  }

  // Editing existing post
  isSubmitting.value = true
  
  try {
    const result = await updatePost(
      props.post.id,
      postData,
      form.images,
      removeMediaIds.value
    )
    
    if (result.success) {
      emit('success', result.data)
      emit('close')
    } else {
      errors.content = result.error || 'Failed to save post.'
    }
  } catch (error) {
    console.error('Error saving post:', error)
    errors.content = 'Unable to save post at this time.'
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  if (isSubmitting.value) return
  emit('close')
}
</script>

<style scoped>
@keyframes modalPop {
  0% { transform: scale(0.94) translateY(14px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

.animate-modal-pop {
  animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
