<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-[0.98]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-3 scale-[0.98]"
    >
      <div
        v-if="publishStore.status !== 'idle'"
        class="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[100] sm:w-[350px] bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-3 select-none"
        role="status"
        aria-live="polite"
      >
        <div class="flex items-center gap-3">
          <!-- Media Preview / Status Icon -->
          <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative flex items-center justify-center">
            <template v-if="publishStore.previewUrl">
              <video
                v-if="publishStore.isVideo"
                :src="publishStore.previewUrl"
                class="w-full h-full object-cover pointer-events-none"
              />
              <img
                v-else
                :src="publishStore.previewUrl"
                alt="Media preview"
                class="w-full h-full object-cover"
              />
              <div
                v-if="publishStore.isVideo"
                class="absolute inset-0 bg-black/25 flex items-center justify-center text-white"
              >
                <Play class="w-3 h-3 fill-white" />
              </div>
            </template>
            <div v-else-if="publishStore.status === 'success'" class="text-emerald-600">
              <Check class="w-5 h-5" />
            </div>
            <div v-else-if="publishStore.status === 'error'" class="text-rose-600">
              <AlertCircle class="w-5 h-5" />
            </div>
            <div v-else class="text-gray-400">
              <ImageIcon class="w-5 h-5" />
            </div>
          </div>

          <!-- Information & Live Progress -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs font-semibold text-gray-900 truncate">
                {{ statusTitle }}
              </p>
              <span v-if="publishStore.status === 'uploading'" class="font-mono text-[11px] text-gray-400 font-medium shrink-0">
                {{ publishStore.progress }}%
              </span>
            </div>

            <!-- Subtitle Context -->
            <p v-if="publishStore.status === 'uploading'" class="font-mono text-[10px] text-gray-400 truncate mt-0.5">
              {{ uploadSubtitle }}
            </p>
            <p v-else-if="publishStore.status === 'processing'" class="text-[11px] text-gray-500 truncate mt-0.5 flex items-center gap-1.5">
              <Loader2 class="w-3 h-3 animate-spin text-gray-400" />
              <span>Finalizing on server...</span>
            </p>
            <p v-else-if="publishStore.status === 'success'" class="text-[11px] text-gray-500 truncate mt-0.5">
              Post is live on feed
            </p>
            <p v-else-if="publishStore.status === 'error'" class="text-[11px] text-rose-600 truncate mt-0.5">
              {{ publishStore.errorMessage || 'Failed to publish' }}
            </p>

            <!-- Clean Flat Progress Bar (Solid, Zero Gradients) -->
            <div v-if="publishStore.isPublishing" class="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1.5">
              <div
                class="h-full bg-ic-primary rounded-full transition-all duration-150"
                :style="{ width: publishStore.progress + '%' }"
              ></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 shrink-0">
            <!-- View button on success -->
            <button
              v-if="publishStore.status === 'success'"
              type="button"
              @click="handleViewPost"
              class="px-2 py-1 text-xs font-medium text-ic-primary hover:text-ic-secondary transition-colors cursor-pointer"
            >
              View
            </button>

            <!-- Retry button on error -->
            <button
              v-else-if="publishStore.status === 'error'"
              type="button"
              @click="publishStore.retry"
              class="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            >
              Retry
            </button>

            <!-- Dismiss / Cancel Button -->
            <button
              type="button"
              @click="handleDismissOrCancel"
              class="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              :title="publishStore.isPublishing ? 'Cancel upload' : 'Close'"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePostPublishStore } from '@/stores/postPublishStore'
import {
  X,
  Check,
  AlertCircle,
  Loader2,
  Play,
  Image as ImageIcon
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const publishStore = usePostPublishStore()

const statusTitle = computed(() => {
  if (publishStore.status === 'uploading') {
    return publishStore.contentSnippet || 'Publishing post...'
  }
  if (publishStore.status === 'processing') {
    return 'Finalizing post...'
  }
  if (publishStore.status === 'success') {
    return 'Post published'
  }
  if (publishStore.status === 'error') {
    return 'Upload failed'
  }
  return 'Post status'
})

const uploadSubtitle = computed(() => {
  const count = publishStore.mediaCount
  if (count > 0) {
    return `Uploading ${count} ${count === 1 ? 'file' : 'files'} · ${publishStore.formattedProgressText}`
  }
  return `Uploading · ${publishStore.formattedProgressText}`
})

const handleDismissOrCancel = () => {
  if (publishStore.isPublishing) {
    if (confirm('Cancel publishing this post?')) {
      publishStore.cancel()
    }
  } else {
    publishStore.dismiss()
  }
}

const handleViewPost = () => {
  if (route.path !== '/admin/posts') {
    router.push('/admin/posts')
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  publishStore.dismiss()
}
</script>
