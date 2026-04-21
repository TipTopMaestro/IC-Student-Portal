<template>
  <div class="space-y-4">
    <!-- Drop Zone -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="openFilePicker"
      class="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
      :class="isDragging ? 'border-ic-primary bg-purple-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFileSelect"
      />
      
      <div class="flex flex-col items-center gap-2">
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-700">
            <span class="text-ic-primary">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each (max {{ maxImages }} images)</p>
        </div>
      </div>
    </div>

    <!-- Image Previews -->
    <div v-if="images.length > 0" class="grid grid-cols-3 gap-3">
      <div
        v-for="(image, index) in images"
        :key="image.id"
        class="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
        draggable="true"
        @dragstart="handleDragStart(index)"
        @dragover.prevent
        @drop.prevent="handleReorder(index)"
      >
        <!-- Image Preview -->
        <img
          :src="image.preview"
          :alt="`Image ${index + 1}`"
          class="w-full h-full object-cover"
        />

        <!-- Overlay with actions -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <!-- Remove button -->
          <button
            @click="removeImage(index)"
            class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Order indicator -->
        <div class="absolute top-2 left-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-medium">
          {{ index + 1 }}
        </div>

        <!-- Drag handle indicator -->
        <div class="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>

        <!-- Upload progress (if uploading) -->
        <div v-if="image.uploading" class="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div class="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error" class="text-sm text-red-600 flex items-center gap-1">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
      </svg>
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  existingMedia: {
    type: Array,
    default: () => []
  },
  maxImages: {
    type: Number,
    default: 10
  },
  maxSizeMB: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:modelValue', 'remove-existing'])

const fileInput = ref(null)
const isDragging = ref(false)
const error = ref('')
const draggedIndex = ref(null)

// Internal images state (combines new uploads and existing)
const images = ref([])

// Initialize with existing media
watch(() => props.existingMedia, (newMedia) => {
  const existingImages = newMedia.map(media => ({
    id: `existing-${media.id}`,
    mediaId: media.id,
    preview: media.media_url,
    isExisting: true
  }))
  
  const newImages = images.value.filter(img => !img.isExisting)
  images.value = [...existingImages, ...newImages]
}, { immediate: true })

// Generate unique ID
const generateId = () => `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Open file picker
const openFilePicker = () => {
  fileInput.value?.click()
}

// Validate and process files
const processFiles = (files) => {
  error.value = ''
  const validFiles = []
  
  const currentCount = images.value.length
  const allowedCount = props.maxImages - currentCount
  
  if (allowedCount <= 0) {
    error.value = `Maximum ${props.maxImages} images allowed`
    return
  }
  
  const filesToProcess = Array.from(files).slice(0, allowedCount)
  
  for (const file of filesToProcess) {
    // Validate type
    if (!file.type.startsWith('image/')) {
      error.value = 'Only image files are allowed'
      continue
    }
    
    // Validate size
    if (file.size > props.maxSizeMB * 1024 * 1024) {
      error.value = `File "${file.name}" exceeds ${props.maxSizeMB}MB limit`
      continue
    }
    
    validFiles.push(file)
  }
  
  // Create previews and add to list
  validFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      images.value.push({
        id: generateId(),
        file,
        preview: e.target.result,
        isExisting: false
      })
      emitUpdate()
    }
    reader.readAsDataURL(file)
  })
}

// Handle file input change
const handleFileSelect = (e) => {
  processFiles(e.target.files)
  e.target.value = '' // Reset input
}

// Handle drag and drop
const handleDrop = (e) => {
  isDragging.value = false
  processFiles(e.dataTransfer.files)
}

// Handle drag start for reordering
const handleDragStart = (index) => {
  draggedIndex.value = index
}

// Handle reorder drop
const handleReorder = (dropIndex) => {
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) return
  
  const item = images.value[draggedIndex.value]
  images.value.splice(draggedIndex.value, 1)
  images.value.splice(dropIndex, 0, item)
  draggedIndex.value = null
  emitUpdate()
}

// Remove image
const removeImage = (index) => {
  const image = images.value[index]
  
  if (image.isExisting) {
    emit('remove-existing', image.mediaId)
  }
  
  images.value.splice(index, 1)
  emitUpdate()
}

// Emit update with only new files
const emitUpdate = () => {
  const newFiles = images.value
    .filter(img => !img.isExisting)
    .map(img => img.file)
  emit('update:modelValue', newFiles)
}
</script>
