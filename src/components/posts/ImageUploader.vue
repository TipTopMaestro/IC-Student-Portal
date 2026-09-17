<template>
  <div class="space-y-3">
    <!-- Drop / File Picker Zone -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="openFilePicker"
      class="relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all group"
      :class="isDragging ? 'border-ic-primary bg-purple-50/60' : 'border-gray-200 hover:border-ic-primary/50 hover:bg-gray-50/60'"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*,video/*"
        multiple
        class="hidden"
        @change="handleFileSelect"
      />

      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-purple-50 group-hover:text-ic-primary text-gray-400 flex items-center justify-center transition-colors">
          <UploadCloud class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-700">
            <span class="text-ic-primary hover:underline">Choose photos or videos</span>, or drag and drop
          </p>
          <p class="font-mono text-[10px] text-gray-400 mt-0.5">
            Photos (up to 25MB, auto-optimized) · Videos (MP4/WebM, max 80MB)
          </p>
        </div>
      </div>
    </div>

    <!-- Optimization Progress Bar -->
    <div v-if="isProcessing" class="p-2.5 bg-gray-50 border border-gray-200/80 rounded-xl flex items-center justify-between gap-3 text-xs text-gray-700">
      <div class="flex items-center gap-2">
        <Loader2 class="w-3.5 h-3.5 animate-spin text-gray-500 shrink-0" />
        <span class="font-mono text-[11px] text-gray-600">Optimizing {{ processingCount }}/{{ totalProcessing }} photos for web...</span>
      </div>
      <span class="font-mono text-[10px] text-gray-400">2K High Quality</span>
    </div>

    <!-- Header Summary when files exist -->
    <div v-if="images.length > 0" class="flex items-center justify-between px-1">
      <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        Selected Media ({{ images.length }}/{{ maxImages }})
      </span>
      <button
        type="button"
        @click="clearAll"
        class="font-mono text-[10px] font-medium uppercase tracking-wider text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
      >
        Remove All
      </button>
    </div>

    <!-- Scrollable Media Previews Grid (Handles up to 80 items without breaking UI) -->
    <div
      v-if="images.length > 0"
      class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1 py-1 custom-scrollbar"
    >
      <div
        v-for="(item, index) in images"
        :key="item.id"
        class="relative group aspect-square rounded-lg overflow-hidden bg-neutral-900 border border-gray-200"
        draggable="true"
        @dragstart="handleDragStart(index)"
        @dragover.prevent
        @drop.prevent="handleReorder(index)"
      >
        <!-- Video Preview -->
        <template v-if="item.isVideo">
          <video
            :src="item.preview"
            class="w-full h-full object-cover pointer-events-none"
            muted
            playsinline
          />
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span class="p-1 rounded-full bg-black/60 text-white shadow">
              <Play class="w-3.5 h-3.5 fill-current" />
            </span>
          </div>
        </template>

        <!-- Image Preview -->
        <img
          v-else
          :src="item.preview"
          :alt="`Media ${index + 1}`"
          class="w-full h-full object-cover"
        />

        <!-- Hover Overlay with Reorder and Remove Actions -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
          <!-- Move Previous (Left/Up) -->
          <button
            v-if="index > 0"
            type="button"
            @click.stop="moveItem(index, -1)"
            class="w-6 h-6 bg-white/20 hover:bg-white text-white hover:text-gray-900 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            title="Move left"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
          </button>

          <!-- Remove Item -->
          <button
            type="button"
            @click.stop="removeImage(index)"
            class="w-7 h-7 bg-rose-600 rounded-full flex items-center justify-center text-white hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
            title="Remove item"
          >
            <X class="w-3.5 h-3.5" />
          </button>

          <!-- Move Next (Right/Down) -->
          <button
            v-if="index < images.length - 1"
            type="button"
            @click.stop="moveItem(index, 1)"
            class="w-6 h-6 bg-white/20 hover:bg-white text-white hover:text-gray-900 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            title="Move right"
          >
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Order Pill -->
        <div class="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 rounded text-white font-mono text-[9px] font-medium leading-none pointer-events-none">
          {{ index + 1 }}
        </div>

        <!-- Type Pill (Video) -->
        <div v-if="item.isVideo" class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-ic-primary/90 rounded text-white font-mono text-[8px] font-semibold uppercase leading-none pointer-events-none">
          Video
        </div>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error" class="text-xs text-rose-600 flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
      <AlertCircle class="w-4 h-4 shrink-0" />
      <span>{{ error }}</span>
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { UploadCloud, Play, X, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { compressImage } from '@/utils/mediaCompressor'

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
    default: 80
  },
  maxSizeMB: {
    type: Number,
    default: 25
  },
  maxVideoSizeMB: {
    type: Number,
    default: 80
  }
})

const emit = defineEmits(['update:modelValue', 'remove-existing'])

const fileInput = ref(null)
const isDragging = ref(false)
const error = ref('')
const draggedIndex = ref(null)

const isProcessing = ref(false)
const processingCount = ref(0)
const totalProcessing = ref(0)

// Internal media state
const images = ref([])

// Initialize with existing media
watch(() => props.existingMedia, (newMedia) => {
  const existingItems = (newMedia || []).map(media => ({
    id: `existing-${media.id}`,
    mediaId: media.id,
    preview: media.media_url,
    isExisting: true,
    isVideo: media.media_type === 'video' || (typeof media.media_url === 'string' && /\.(mp4|webm|ogg|mov)$/i.test(media.media_url))
  }))

  const newItems = images.value.filter(img => !img.isExisting)
  images.value = [...existingItems, ...newItems]
}, { immediate: true })

const generateId = () => `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const openFilePicker = () => {
  fileInput.value?.click()
}

// Validate and process files with client-side compression for images
const processFiles = async (files) => {
  error.value = ''
  const currentCount = images.value.length
  const allowedCount = props.maxImages - currentCount

  if (allowedCount <= 0) {
    error.value = `Maximum limit of ${props.maxImages} media files reached.`
    return
  }

  const rawFiles = Array.from(files).slice(0, allowedCount)
  if (rawFiles.length === 0) return

  const validFiles = []

  for (const file of rawFiles) {
    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')

    if (!isImage && !isVideo) {
      error.value = `"${file.name}" is not a supported image or video file.`
      continue
    }

    if (isVideo && file.size > props.maxVideoSizeMB * 1024 * 1024) {
      error.value = `Video "${file.name}" exceeds ${props.maxVideoSizeMB}MB limit.`
      continue
    }

    if (isImage && file.size > props.maxSizeMB * 1024 * 1024) {
      error.value = `Image "${file.name}" exceeds ${props.maxSizeMB}MB limit.`
      continue
    }

    validFiles.push(file)
  }

  if (validFiles.length === 0) return

  isProcessing.value = true
  totalProcessing.value = validFiles.length
  processingCount.value = 0

  for (const file of validFiles) {
    const isVideo = file.type.startsWith('video/')

    // Compress images client-side before queuing; keep videos as-is
    let processedFile = file
    if (!isVideo) {
      try {
        processedFile = await compressImage(file, { maxWidth: 1920, maxHeight: 1920, quality: 0.82 })
      } catch (err) {
        console.warn('Image compression fallback:', err)
        processedFile = file
      }
    }

    const previewUrl = URL.createObjectURL(processedFile)

    images.value.push({
      id: generateId(),
      file: processedFile,
      preview: previewUrl,
      isExisting: false,
      isVideo
    })

    processingCount.value++
  }

  isProcessing.value = false
  emitUpdate()
}

const handleFileSelect = (e) => {
  processFiles(e.target.files)
  e.target.value = ''
}

const handleDrop = (e) => {
  isDragging.value = false
  processFiles(e.dataTransfer.files)
}

const handleDragStart = (index) => {
  draggedIndex.value = index
}

const handleReorder = (dropIndex) => {
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) return
  const item = images.value[draggedIndex.value]
  images.value.splice(draggedIndex.value, 1)
  images.value.splice(dropIndex, 0, item)
  draggedIndex.value = null
  emitUpdate()
}

const moveItem = (index, direction) => {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= images.value.length) return
  const item = images.value[index]
  images.value.splice(index, 1)
  images.value.splice(targetIndex, 0, item)
  emitUpdate()
}

const removeImage = (index) => {
  const item = images.value[index]
  if (item.isExisting) {
    emit('remove-existing', item.mediaId)
  } else if (item.preview && item.preview.startsWith('blob:')) {
    URL.revokeObjectURL(item.preview)
  }

  images.value.splice(index, 1)
  emitUpdate()
}

const clearAll = () => {
  images.value.forEach(item => {
    if (item.isExisting) {
      emit('remove-existing', item.mediaId)
    } else if (item.preview && item.preview.startsWith('blob:')) {
      URL.revokeObjectURL(item.preview)
    }
  })
  images.value = []
  emitUpdate()
}

const emitUpdate = () => {
  const newFiles = images.value
    .filter(img => !img.isExisting)
    .map(img => img.file)
  emit('update:modelValue', newFiles)
}

defineExpose({
  openFilePicker,
  fileInput,
  clearAll
})
</script>
