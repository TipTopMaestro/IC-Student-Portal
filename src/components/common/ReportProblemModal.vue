<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
        @click.self="handleBackdropClick"
        @keydown.esc="handleClose"
      >
        <!-- Modal Card: Minimalist, clean border and soft grounding shadow -->
        <div 
          class="relative w-full max-w-md bg-white rounded-2xl border border-gray-200/90 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18),0_40px_90px_-20px_rgba(0,0,0,0.1)] overflow-hidden my-auto animate-fade-in-up"
          role="dialog"
          aria-modal="true"
        >
          <!-- SUCCESS RECEIPT VIEW -->
          <div v-if="isSubmitted" class="p-6 text-center space-y-4">
            <!-- Icon Badge -->
            <div class="w-10 h-10 mx-auto rounded-full bg-gray-100 text-gray-800 flex items-center justify-center">
              <Check class="w-5 h-5 stroke-[2.5]" />
            </div>

            <!-- Title & Subtitle -->
            <div class="space-y-1">
              <h3 class="font-pixel text-lg text-gray-900 lowercase tracking-tight">
                report sent
              </h3>
              <p class="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                Thank you for the feedback. Your report and diagnostics have been sent to the development team.
              </p>
            </div>

            <!-- Reference Pill -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200/80 font-mono text-xs text-gray-700">
              <span class="text-gray-400">ref:</span>
              <span class="font-semibold text-gray-900">{{ ticketId }}</span>
              <button
                type="button"
                @click="copyTicketId"
                class="text-gray-400 hover:text-ic-primary transition-colors cursor-pointer p-0.5 ml-1"
                :title="copied ? 'Copied' : 'Copy Reference ID'"
              >
                <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-600" />
                <Copy v-else class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Done Action -->
            <div class="pt-2">
              <button
                type="button"
                @click="handleClose"
                class="w-full py-2 px-4 rounded-xl text-xs font-semibold text-white bg-ic-primary hover:bg-[#520B4D] shadow-[0_4px_14px_-4px_rgba(100,13,95,0.3)] hover:shadow-[0_6px_20px_-4px_rgba(100,13,95,0.4)] active:scale-[0.99] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>

          <!-- REPORT FORM VIEW -->
          <form v-else @submit.prevent="handleSubmit" enctype="multipart/form-data" class="p-6 space-y-4">
            <!-- Header -->
            <div class="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
              <div class="space-y-0.5">
                <h3 class="font-pixel text-lg text-gray-900 lowercase tracking-tight">
                  report a problem
                </h3>
                <p class="text-xs text-gray-500">
                  Notice something broken or have a feature idea? Let us know.
                </p>
              </div>
              <button
                type="button"
                @click="handleClose"
                class="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer shrink-0 -mt-1 -mr-1"
                aria-label="Close"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Category Segmented Control (Minimalist Linear/Apple pill row) -->
            <div class="space-y-1.5">
              <label class="block font-mono text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Category
              </label>
              <div class="flex items-center gap-1 p-1 bg-gray-100/80 rounded-xl">
                <button
                  type="button"
                  v-for="cat in categories"
                  :key="cat.id"
                  @click="category = cat.id"
                  class="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  :class="category === cat.id 
                    ? 'bg-white text-gray-900 shadow-xs font-semibold' 
                    : 'text-gray-500 hover:text-gray-900'"
                >
                  <component :is="cat.icon" class="w-3.5 h-3.5 shrink-0" />
                  <span class="truncate">{{ cat.label }}</span>
                </button>
              </div>
            </div>

            <!-- Description Field -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="report-desc" class="block font-mono text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Description
                </label>
                <span class="font-mono text-[10px] text-gray-400">
                  {{ description.length }} / 800
                </span>
              </div>
              <textarea
                id="report-desc"
                v-model="description"
                maxlength="800"
                rows="3"
                required
                placeholder="What happened and what did you expect? Steps to reproduce are helpful..."
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-ic-primary/20 focus:border-ic-primary transition-all resize-none leading-relaxed"
              ></textarea>
            </div>

            <!-- Attachment: Low-profile Drop Target or Chip -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block font-mono text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Screenshot <span class="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <span class="font-mono text-[10px] text-gray-400">
                  Ctrl + V to paste
                </span>
              </div>

              <!-- Compact Drop Target -->
              <div
                v-if="!attachmentPreview"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
                class="flex items-center justify-between px-3 py-2 rounded-xl border border-dashed text-xs cursor-pointer transition-all select-none"
                :class="isDragging 
                  ? 'border-ic-primary bg-purple-50/40 text-ic-primary' 
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/40 hover:bg-gray-50 text-gray-600'"
              >
                <input
                  ref="fileInputRef"
                  type="file"
                  name="attachment"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  @change="handleFileSelect"
                  class="hidden"
                />
                <div class="flex items-center gap-2">
                  <Paperclip class="w-3.5 h-3.5 text-gray-400" />
                  <span class="font-medium text-gray-700">Attach screenshot</span>
                  <span class="text-gray-400 hidden sm:inline">or drag & drop</span>
                </div>
                <span class="font-mono text-[10px] text-gray-400">max 5MB</span>
              </div>

              <!-- Attachment Preview (Compact Chip) -->
              <div
                v-else
                class="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/80"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <img :src="attachmentPreview" alt="Screenshot" class="w-7 h-7 rounded-md object-cover border border-gray-200 shrink-0 bg-white" />
                  <div class="min-w-0">
                    <p class="text-xs font-medium text-gray-800 truncate">
                      {{ attachment?.name || 'screenshot.png' }}
                    </p>
                    <p class="font-mono text-[10px] text-gray-400">
                      {{ formatFileSize(attachment?.size) }}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="removeAttachment"
                  class="p-1 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Remove screenshot"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Auto-Diagnostics: Single-line subtle footer metadata -->
            <div class="flex items-center justify-between font-mono text-[10px] text-gray-400 pt-1">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span class="truncate">{{ currentRoute }} · {{ userSummaryShort }}</span>
              </div>
              <span class="shrink-0 uppercase tracking-wider text-gray-400">auto-diagnostics</span>
            </div>

            <!-- Error Banner (if submission failed) -->
            <div 
              v-if="errorMessage" 
              class="p-2.5 rounded-xl border border-rose-200 bg-rose-50/80 text-rose-800 text-xs flex items-start gap-2"
            >
              <AlertCircle class="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <div class="space-y-0.5 flex-1">
                <p class="font-medium leading-tight">{{ errorMessage }}</p>
                <a
                  :href="fallbackMailtoUrl"
                  class="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-rose-700 hover:underline"
                >
                  <span>Send via email client</span>
                  <ExternalLink class="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            <!-- Action Row -->
            <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                @click="handleClose"
                :disabled="submitting"
                class="px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting || !description.trim()"
                class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-ic-primary hover:bg-[#520B4D] shadow-[0_4px_14px_-4px_rgba(100,13,95,0.3)] hover:shadow-[0_6px_20px_-4px_rgba(100,13,95,0.4)] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="submitting" class="w-3.5 h-3.5 animate-spin" />
                <span>{{ submitting ? 'Sending...' : 'Send report' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  X,
  Bug,
  Sparkles,
  AlertCircle,
  Paperclip,
  Check,
  Copy,
  Loader2,
  ExternalLink
} from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const route = useRoute()
const authStore = useAuthStore()

// Form State
const category = ref('visual')
const description = ref('')
const attachment = ref(null)
const attachmentPreview = ref(null)
const isDragging = ref(false)
const fileInputRef = ref(null)

// Submission State
const submitting = ref(false)
const isSubmitted = ref(false)
const ticketId = ref('')
const copied = ref(false)
const errorMessage = ref('')

const TARGET_EMAIL = 'froydcarbajosa14@gmail.com'

// Category Definitions: Minimal 3 Options
const categories = [
  {
    id: 'visual',
    label: 'Visual Glitch',
    icon: Bug
  },
  {
    id: 'feature',
    label: 'Feature Idea',
    icon: Sparkles
  },
  {
    id: 'functional',
    label: 'Functional Bug',
    icon: AlertCircle
  }
]

// Diagnostic Telemetry Computeds
const currentRoute = computed(() => route.fullPath || window.location.pathname)

const userSummaryShort = computed(() => {
  const u = authStore.user
  if (!u) return 'Guest'
  const id = u.student?.s_id_number || u.username || ''
  const role = authStore.isAdmin ? 'Admin' : 'Student'
  return `${role}${id ? ' #' + id : ''}`
})

const userSummaryFull = computed(() => {
  const u = authStore.user
  if (!u) return 'Guest (Unauthenticated)'
  const fullName = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || 'User'
  const role = authStore.isAdmin ? 'Admin' : 'Student'
  const idNum = u.student?.s_id_number || u.username || ''
  return `${fullName} (${role}${idNum ? ' · ' + idNum : ''})`
})

const clientSummary = computed(() => {
  const width = window.innerWidth
  const height = window.innerHeight
  const ua = navigator.userAgent
  let browser = 'Browser'
  if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('Chrome/')) browser = 'Chrome'
  else if (ua.includes('Firefox/')) browser = 'Firefox'
  else if (ua.includes('Safari/')) browser = 'Safari'
  return `${browser} · ${width}×${height}`
})

const selectedCategoryLabel = computed(() => {
  return categories.find(c => c.id === category.value)?.label || 'General Issue'
})

// Generate Unique Ticket Code (e.g., ICSP-REP-94A2)
const generateTicketId = () => {
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ICSP-REP-${rand}`
}

// Fallback Mailto URL if FormSubmit is blocked
const fallbackMailtoUrl = computed(() => {
  const subject = encodeURIComponent(`ICSP Problem Report [${ticketId.value || 'NEW'}]: ${selectedCategoryLabel.value} on ${currentRoute.value}`)
  const body = encodeURIComponent(
    `Hi ICSP Support,\n\nCategory: ${selectedCategoryLabel.value}\nTicket: ${ticketId.value || 'N/A'}\n\nDescription:\n${description.value}\n\n--- System Diagnostics ---\nPage: ${currentRoute.value}\nUser: ${userSummaryFull.value}\nClient: ${clientSummary.value}\nUser Agent: ${navigator.userAgent}\n`
  )
  return `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`
})

// File handling helpers
const setAttachment = (file) => {
  if (!file || !file.type.startsWith('image/')) return
  if (file.size > 5 * 1024 * 1024) {
    alert('Image file size must be less than 5MB.')
    return
  }
  attachment.value = file
  attachmentPreview.value = URL.createObjectURL(file)
}

const removeAttachment = () => {
  if (attachmentPreview.value) {
    URL.revokeObjectURL(attachmentPreview.value)
  }
  attachment.value = null
  attachmentPreview.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (file) setAttachment(file)
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) setAttachment(file)
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Global Clipboard Paste (Ctrl+V) listener when modal is open
const handlePaste = (e) => {
  if (!props.modelValue || isSubmitted.value) return
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      if (file) {
        setAttachment(file)
        break
      }
    }
  }
}

// Copy ticket ID
const copyTicketId = async () => {
  try {
    await navigator.clipboard.writeText(ticketId.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('Failed to copy ticket ID', err)
  }
}

// Submit handler via FormSubmit AJAX
const handleSubmit = async () => {
  if (!description.value.trim()) return

  submitting.value = true
  errorMessage.value = ''
  ticketId.value = generateTicketId()

  try {
    const userEmail = authStore.user?.email || 'noreply-icsp@dnsc.edu.ph'
    const userName = [authStore.user?.first_name, authStore.user?.last_name].filter(Boolean).join(' ') || authStore.user?.username || 'ICSP User'

    const formData = new FormData()
    formData.append('_subject', `ICSP Problem Report [${ticketId.value}]: ${selectedCategoryLabel.value} on ${currentRoute.value}`)
    formData.append('_template', 'table')
    formData.append('_captcha', 'false')
    formData.append('email', userEmail)
    formData.append('_replyto', userEmail)
    formData.append('name', userName)
    formData.append('Ticket ID', ticketId.value)
    formData.append('Category', selectedCategoryLabel.value)
    formData.append('Description', description.value)
    formData.append('Reporter', `${userName} (${authStore.isAdmin ? 'Admin' : 'Student'})`)
    formData.append('Reporter Email', userEmail)
    formData.append('Page Route', currentRoute.value)
    formData.append('Client Diagnostics', `${clientSummary.value} (${navigator.userAgent})`)
    formData.append('Submitted At', new Date().toLocaleString())

    if (attachment.value) {
      const safeFilename = attachment.value.name || `screenshot-${Date.now()}.png`
      formData.append('attachment', attachment.value, safeFilename)
    }

    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`)
    }

    const result = await response.json()
    console.log('📬 Report submitted successfully:', result)
    isSubmitted.value = true
  } catch (err) {
    console.error('Failed to dispatch report via FormSubmit:', err)
    errorMessage.value = 'Failed to send automatically. Please check your network or send via email client.'
  } finally {
    submitting.value = false
  }
}

// Reset and close
const handleClose = () => {
  emit('update:modelValue', false)
  setTimeout(() => {
    isSubmitted.value = false
    description.value = ''
    category.value = 'visual'
    errorMessage.value = ''
    ticketId.value = ''
    removeAttachment()
  }, 150)
}

const handleBackdropClick = () => {
  if (!submitting.value) {
    handleClose()
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('paste', handlePaste)
})

onUnmounted(() => {
  window.removeEventListener('paste', handlePaste)
  if (attachmentPreview.value) {
    URL.revokeObjectURL(attachmentPreview.value)
  }
})
</script>
