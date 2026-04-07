<template>
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <!-- Post Header -->
    <div class="flex items-center gap-3 p-4">
      <div v-if="authorAvatar" class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
        <img :src="authorAvatar" :alt="post.user_name" class="w-full h-full object-cover" />
      </div>
      <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium ring-2 ring-gray-100">
        {{ authorInitials }}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 truncate">{{ post.user_name || 'Admin' }}</p>
        <p class="text-xs text-gray-500">{{ formattedDate || 'Recently' }}</p>
      </div>
      
      <!-- Actions Menu (for admin) -->
      <div v-if="showActions" class="relative">
        <button 
          @click="toggleMenu"
          class="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Post actions"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        
        <!-- Dropdown Menu -->
        <div 
          v-if="menuOpen"
          class="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10"
        >
          <button 
            @click="handleEdit"
            class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Edit post
          </button>
          <button 
            @click="handleDelete"
            class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Post Content -->
    <div v-if="post.content" class="px-4 pb-3">
      <p 
        class="text-sm text-gray-800 whitespace-pre-wrap"
        :class="{ 'line-clamp-3': !expanded && isLongContent }"
      >
        {{ post.content }}
      </p>
      <button 
        v-if="isLongContent"
        @click="expanded = !expanded"
        class="text-sm text-gray-500 hover:text-gray-700 mt-1"
      >
        {{ expanded ? 'Show less' : 'Show more' }}
      </button>
    </div>

    <!-- Post Media (Carousel) -->
    <div v-if="hasMedia" class="relative bg-gray-100">
      <div 
        ref="carouselRef"
        class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        @scroll="handleScroll"
      >
        <div 
          v-for="(media, index) in post.media" 
          :key="media.id"
          class="flex-shrink-0 w-full snap-center"
        >
          <!-- Video -->
          <video 
            v-if="media.media_type === 'video'"
            :src="normalizeUrl(media.media_url)" 
            class="w-full aspect-square object-cover"
            controls
            playsinline
            preload="metadata"
          />
          <!-- Image -->
          <img 
            v-else
            :src="normalizeUrl(media.media_url)" 
            :alt="`Post image ${index + 1}`"
            class="w-full aspect-square object-cover"
            loading="lazy"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Navigation Arrows -->
      <template v-if="post.media.length > 1">
        <button 
          v-if="currentIndex > 0"
          @click="scrollTo(currentIndex - 1)"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          v-if="currentIndex < post.media.length - 1"
          @click="scrollTo(currentIndex + 1)"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Dots Indicator -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <button
            v-for="(_, index) in post.media"
            :key="index"
            @click="scrollTo(index)"
            class="w-2 h-2 rounded-full transition-all"
            :class="currentIndex === index ? 'bg-ic-primary' : 'bg-gray-300'"
            :aria-label="`Go to image ${index + 1}`"
          />
        </div>
      </template>
    </div>

    <!-- Reactions Bar (placeholder for future) -->
    <div class="px-4 py-3 border-t border-gray-100 flex items-center gap-4">
      <div class="flex items-center gap-1.5 text-gray-500">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="text-sm">{{ totalReactions }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-gray-500">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="text-sm">0</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete'])

const authStore = useAuthStore()
const currentUser = computed(() => authStore.user)

const carouselRef = ref(null)
const currentIndex = ref(0)
const menuOpen = ref(false)
const expanded = ref(false)

const hasMedia = computed(() => props.post.media && props.post.media.length > 0)

const isLongContent = computed(() => {
  return props.post.content && props.post.content.length > 200
})

// Normalize URL to use HTTPS
const normalizeUrl = (url) => {
  if (!url) return ''
  return url.replace(/^http:\/\//i, 'https://')
}

// Get author avatar - try current user's profile if they're the author
const authorAvatar = computed(() => {
  // Check if post belongs to current user and they have a profile picture
  if (currentUser.value && currentUser.value.id === props.post.user_id) {
    const profilePic = currentUser.value.profile_picture || 
                       currentUser.value.avatar || 
                       currentUser.value.photo ||
                       currentUser.value.profile_image
    if (profilePic) {
      return normalizeUrl(profilePic)
    }
  }
  
  // Fall back to post's user_avatar
  if (props.post.user_avatar) {
    return normalizeUrl(props.post.user_avatar)
  }
  
  return null
})

const authorInitials = computed(() => {
  const name = props.post.user_name || 'Admin'
  const parts = name.split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const formattedDate = computed(() => {
  const dateStr = props.post.created_at || props.post.date
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const totalReactions = computed(() => {
  if (!props.post.reaction_counts) return 0
  const counts = props.post.reaction_counts
  return (counts.like || 0) + (counts.heart || 0) + (counts.haha || 0) + (counts.angry || 0)
})

const handleImageError = (event) => {
  event.target.style.display = 'none'
  console.warn('Failed to load image:', event.target.src)
}

const handleScroll = () => {
  if (!carouselRef.value) return
  const scrollLeft = carouselRef.value.scrollLeft
  const width = carouselRef.value.offsetWidth
  currentIndex.value = Math.round(scrollLeft / width)
}

const scrollTo = (index) => {
  if (!carouselRef.value) return
  const width = carouselRef.value.offsetWidth
  carouselRef.value.scrollTo({
    left: index * width,
    behavior: 'smooth'
  })
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const handleEdit = () => {
  menuOpen.value = false
  emit('edit', props.post)
}

const handleDelete = () => {
  menuOpen.value = false
  emit('delete', props.post)
}

// Close menu when clicking outside
const handleClickOutside = (e) => {
  if (menuOpen.value && !e.target.closest('.relative')) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
