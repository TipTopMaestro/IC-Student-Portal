import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createPost } from '@/services/postService'

export const usePostPublishStore = defineStore('postPublish', () => {
  // State
  const status = ref('idle') // 'idle' | 'uploading' | 'processing' | 'success' | 'error'
  const progress = ref(0) // 0 to 100
  const loadedBytes = ref(0)
  const totalBytes = ref(0)
  const previewUrl = ref(null)
  const isVideo = ref(false)
  const mediaCount = ref(0)
  const contentSnippet = ref('')
  const category = ref('general')
  const errorMessage = ref('')
  const publishedPost = ref(null)
  const currentDraft = ref(null)

  let abortController = null
  let dismissTimeout = null

  // Computed
  const isPublishing = computed(() => {
    return status.value === 'uploading' || status.value === 'processing'
  })

  const isSuccess = computed(() => status.value === 'success')
  const isError = computed(() => status.value === 'error')

  const formattedProgressText = computed(() => {
    if (status.value === 'uploading') {
      if (totalBytes.value > 0) {
        return `${formatBytes(loadedBytes.value)} / ${formatBytes(totalBytes.value)} (${progress.value}%)`
      }
      return `${progress.value}%`
    }
    if (status.value === 'processing') {
      return 'Processing...'
    }
    if (status.value === 'success') {
      return 'Published'
    }
    if (status.value === 'error') {
      return 'Upload failed'
    }
    return ''
  })

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Clear pending timers
  const clearDismissTimer = () => {
    if (dismissTimeout) {
      clearTimeout(dismissTimeout)
      dismissTimeout = null
    }
  }

  // Main Publish Action
  const publish = async (draft) => {
    clearDismissTimer()

    // Store draft for potential retry
    currentDraft.value = draft
    status.value = 'uploading'
    progress.value = 5
    loadedBytes.value = 0
    totalBytes.value = 0
    errorMessage.value = ''
    publishedPost.value = null

    previewUrl.value = draft.previewUrl || null
    isVideo.value = !!draft.isVideo
    mediaCount.value = draft.images?.length || 0
    contentSnippet.value = draft.postData?.content || ''
    category.value = draft.postData?.category || 'general'

    abortController = new AbortController()

    try {
      const result = await createPost(
        draft.postData,
        draft.images || [],
        {
          signal: abortController.signal,
          onUploadProgress: (progressEvent) => {
            loadedBytes.value = progressEvent.loaded || 0
            totalBytes.value = progressEvent.total || 0

            if (progressEvent.total) {
              const rawPct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              // Reserve 95-99% for server processing
              const mapped = Math.min(Math.max(rawPct, 5), 94)
              progress.value = mapped

              if (rawPct >= 100) {
                status.value = 'processing'
                progress.value = 97
              }
            } else {
              progress.value = Math.min(progress.value + 10, 90)
            }
          }
        }
      )

      if (result.success) {
        status.value = 'success'
        progress.value = 100
        publishedPost.value = result.data

        // Dispatch global notification event
        window.dispatchEvent(
          new CustomEvent('post-published', {
            detail: result.data
          })
        )

        // Auto dismiss after 4.5 seconds
        dismissTimeout = setTimeout(() => {
          if (status.value === 'success') {
            dismiss()
          }
        }, 4500)
      } else if (result.canceled) {
        dismiss()
      } else {
        status.value = 'error'
        errorMessage.value = result.error || 'Failed to publish post. Tap retry to try again.'
      }
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.message === 'canceled') {
        dismiss()
        return
      }
      status.value = 'error'
      errorMessage.value = err?.message || 'Network error occurred. Tap retry to try again.'
    } finally {
      abortController = null
    }
  }

  const retry = () => {
    if (currentDraft.value) {
      publish(currentDraft.value)
    }
  }

  const cancel = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    dismiss()
  }

  const dismiss = () => {
    clearDismissTimer()
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(previewUrl.value)
      } catch {
        // ignore
      }
    }
    status.value = 'idle'
    progress.value = 0
    loadedBytes.value = 0
    totalBytes.value = 0
    previewUrl.value = null
    isVideo.value = false
    mediaCount.value = 0
    contentSnippet.value = ''
    errorMessage.value = ''
    publishedPost.value = null
    currentDraft.value = null
  }

  return {
    // State
    status,
    progress,
    loadedBytes,
    totalBytes,
    previewUrl,
    isVideo,
    mediaCount,
    contentSnippet,
    category,
    errorMessage,
    publishedPost,
    currentDraft,

    // Computed
    isPublishing,
    isSuccess,
    isError,
    formattedProgressText,

    // Actions
    publish,
    retry,
    cancel,
    dismiss
  }
})
