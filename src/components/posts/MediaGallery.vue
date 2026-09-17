<template>
  <div class="relative w-full select-none" v-if="media && media.length > 0">

    <!-- ============================================== -->
    <!-- 1 ITEM LAYOUT -->
    <!-- ============================================== -->
    <div v-if="media.length === 1" class="relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-200/80 group">
      <!-- Single Video -->
      <div v-if="media[0].media_type === 'video'" class="relative w-full aspect-video bg-black flex items-center justify-center">
        <video
          ref="singleVideoRef"
          :src="normalizeUrl(media[0].media_url)"
          class="w-full h-full object-contain"
          controls
          playsinline
          muted
          loop
          preload="metadata"
          @play="handleVideoPlay"
          @pause="handleVideoPause"
          @volumechange="handleVolumeChange"
        />

        <!-- Quick Mute/Unmute Overlay Button -->
        <button
          @click.stop="toggleMute"
          type="button"
          :title="isMuted ? 'Unmute' : 'Mute'"
          class="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-all duration-200 shadow-sm cursor-pointer"
        >
          <VolumeX v-if="isMuted" class="w-4 h-4" />
          <Volume2 v-else class="w-4 h-4" />
        </button>
      </div>

      <!-- Single Image -->
      <div
        v-else
        @click="openLightbox(0)"
        class="cursor-pointer overflow-hidden max-h-[520px] flex items-center justify-center bg-neutral-950"
      >
        <img
          :src="normalizeUrl(media[0].media_url)"
          :alt="media[0].alt_text || 'Post image'"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- 2 ITEMS LAYOUT -->
    <!-- ============================================== -->
    <div
      v-else-if="media.length === 2"
      class="grid grid-cols-2 gap-[2px] aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200/80"
    >
      <div
        v-for="(item, idx) in media"
        :key="item.id || idx"
        @click="openLightbox(idx)"
        class="relative h-full w-full overflow-hidden bg-neutral-900 cursor-pointer group"
      >
        <video
          v-if="item.media_type === 'video'"
          :src="normalizeUrl(item.media_url)"
          class="w-full h-full object-cover pointer-events-none"
        />
        <img
          v-else
          :src="normalizeUrl(item.media_url)"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>

        <!-- Video Badge -->
        <span v-if="item.media_type === 'video'" class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white font-mono text-[9px] flex items-center gap-1 border border-white/20">
          <Play class="w-2.5 h-2.5 fill-current" /> Video
        </span>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- 3 ITEMS LAYOUT -->
    <!-- ============================================== -->
    <div
      v-else-if="media.length === 3"
      class="flex gap-[2px] aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200/80"
    >
      <!-- Hero Left (60%) -->
      <div
        @click="openLightbox(0)"
        class="relative w-[60%] h-full overflow-hidden bg-neutral-900 cursor-pointer group"
      >
        <video
          v-if="media[0].media_type === 'video'"
          :src="normalizeUrl(media[0].media_url)"
          class="w-full h-full object-cover pointer-events-none"
        />
        <img
          v-else
          :src="normalizeUrl(media[0].media_url)"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
        <span v-if="media[0].media_type === 'video'" class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white font-mono text-[9px] flex items-center gap-1 border border-white/20">
          <Play class="w-2.5 h-2.5 fill-current" /> Video
        </span>
      </div>

      <!-- Right Column (40% - 2 Stacked) -->
      <div class="flex flex-col gap-[2px] w-[40%] h-full">
        <div
          v-for="(item, idx) in [media[1], media[2]]"
          :key="item.id || idx + 1"
          @click="openLightbox(idx + 1)"
          class="relative h-[calc(50%-1px)] w-full overflow-hidden bg-neutral-900 cursor-pointer group"
        >
          <video
            v-if="item.media_type === 'video'"
            :src="normalizeUrl(item.media_url)"
            class="w-full h-full object-cover pointer-events-none"
          />
          <img
            v-else
            :src="normalizeUrl(item.media_url)"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
          <span v-if="item.media_type === 'video'" class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white font-mono text-[9px] flex items-center gap-1 border border-white/20">
            <Play class="w-2.5 h-2.5 fill-current" /> Video
          </span>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- 4 ITEMS LAYOUT (2x2 Quad) -->
    <!-- ============================================== -->
    <div
      v-else-if="media.length === 4"
      class="grid grid-cols-2 gap-[2px] aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200/80"
    >
      <div
        v-for="(item, idx) in media"
        :key="item.id || idx"
        @click="openLightbox(idx)"
        class="relative h-full w-full overflow-hidden bg-neutral-900 cursor-pointer group"
      >
        <video
          v-if="item.media_type === 'video'"
          :src="normalizeUrl(item.media_url)"
          class="w-full h-full object-cover pointer-events-none"
        />
        <img
          v-else
          :src="normalizeUrl(item.media_url)"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
        <span v-if="item.media_type === 'video'" class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white font-mono text-[9px] flex items-center gap-1 border border-white/20">
          <Play class="w-2.5 h-2.5 fill-current" /> Video
        </span>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- 5 TO 80+ ITEMS ADAPTIVE MOSAIC COLLAGE -->
    <!-- ============================================== -->
    <div
      v-else
      class="flex flex-col gap-[2px] aspect-[4/3] sm:aspect-[16/11] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200/80"
    >
      <!-- Top Row: 2 Balanced Landscape Tiles (56% height) -->
      <div class="grid grid-cols-2 gap-[2px] h-[56%] w-full">
        <div
          v-for="(item, idx) in [media[0], media[1]]"
          :key="item.id || idx"
          @click="openLightbox(idx)"
          class="relative h-full w-full overflow-hidden bg-neutral-900 cursor-pointer group"
        >
          <video
            v-if="item.media_type === 'video'"
            :src="normalizeUrl(item.media_url)"
            class="w-full h-full object-cover pointer-events-none"
          />
          <img
            v-else
            :src="normalizeUrl(item.media_url)"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
          <span v-if="item.media_type === 'video'" class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white font-mono text-[9px] flex items-center gap-1 border border-white/20">
            <Play class="w-2.5 h-2.5 fill-current" /> Video
          </span>
        </div>
      </div>

      <!-- Bottom Row: 3 Tiles (44% height) -->
      <div class="grid grid-cols-3 gap-[2px] h-[44%] w-full">
        <!-- Tile 3 & 4 -->
        <div
          v-for="(item, idx) in [media[2], media[3]]"
          :key="item.id || idx + 2"
          @click="openLightbox(idx + 2)"
          class="relative h-full w-full overflow-hidden bg-neutral-900 cursor-pointer group"
        >
          <video
            v-if="item.media_type === 'video'"
            :src="normalizeUrl(item.media_url)"
            class="w-full h-full object-cover pointer-events-none"
          />
          <img
            v-else
            :src="normalizeUrl(item.media_url)"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
          <span v-if="item.media_type === 'video'" class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white font-mono text-[9px] flex items-center gap-1 border border-white/20">
            <Play class="w-2.5 h-2.5 fill-current" /> Video
          </span>
        </div>

        <!-- Tile 5: The Glassmorphic "+N MORE" Trigger -->
        <div
          @click="openLightbox(4)"
          class="relative h-full w-full overflow-hidden bg-neutral-900 cursor-pointer group"
        >
          <img
            :src="normalizeUrl(media[4].media_url)"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <!-- Clean Glassmorphic "+N" Overlay -->
          <div class="absolute inset-0 bg-black/35 backdrop-blur-[1.5px] group-hover:bg-black/45 transition-all flex items-center justify-center p-2">
            <span class="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform">
              +{{ media.length - 4 }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- IMMERSIVE FULLSCREEN LIGHTBOX -->
    <!-- ============================================== -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-98"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-98"
      >
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-[200] bg-neutral-950/95 backdrop-blur-2xl flex flex-col select-none"
          @keydown.esc="closeLightbox"
          @keydown.left="prevMedia"
          @keydown.right="nextMedia"
          tabindex="0"
          ref="lightboxContainerRef"
        >
          <!-- Top Control Header -->
          <div class="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 shrink-0 z-10 bg-neutral-950/60 backdrop-blur-md">
            <!-- Left: Author Info & Counter -->
            <div class="flex items-center gap-3 min-w-0">
              <div v-if="authorAvatar" class="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0">
                <img :src="authorAvatar" class="w-full h-full object-cover" />
              </div>
              <div class="min-w-0">
                <p class="text-xs sm:text-sm font-semibold text-white truncate">{{ authorName || 'Institute Post' }}</p>
                <p class="font-mono text-[10px] text-neutral-400 truncate">{{ postDate || 'Event Announcement' }}</p>
              </div>

              <!-- Media Index Pill -->
              <span class="ml-2 font-mono text-[11px] font-medium text-white px-2.5 py-1 rounded-full bg-white/10 border border-white/15 shrink-0">
                {{ activeIndex + 1 }} / {{ media.length }}
              </span>
            </div>

            <!-- Right: Action Buttons -->
            <div class="flex items-center gap-2 shrink-0">
              <!-- Open Original / Download -->
              <a
                v-if="currentMedia"
                :href="normalizeUrl(currentMedia.media_url)"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Open original file in new tab"
              >
                <ExternalLink class="w-4 h-4" />
              </a>

              <!-- Fullscreen Toggle -->
              <button
                @click="toggleFullscreen"
                class="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden sm:flex"
                title="Toggle Fullscreen"
              >
                <Maximize2 v-if="!isFullscreen" class="w-4 h-4" />
                <Minimize2 v-else class="w-4 h-4" />
              </button>

              <!-- Close Button -->
              <button
                @click="closeLightbox"
                class="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Main Stage (Active Media) -->
          <div
            class="relative flex-1 flex items-center justify-center p-2 sm:p-6 min-h-0 overflow-hidden"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <!-- Navigation Arrow: Previous -->
            <button
              v-if="media.length > 1 && activeIndex > 0"
              @click="prevMedia"
              class="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all cursor-pointer group"
              title="Previous photo (←)"
            >
              <ChevronLeft class="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <!-- Navigation Arrow: Next -->
            <button
              v-if="media.length > 1 && activeIndex < media.length - 1"
              @click="nextMedia"
              class="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all cursor-pointer group"
              title="Next photo (→)"
            >
              <ChevronRight class="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
            </button>

            <!-- Media Container -->
            <div v-if="currentMedia" class="relative max-w-full max-h-full flex items-center justify-center">
              <!-- Active Video -->
              <video
                v-if="currentMedia.media_type === 'video'"
                :key="`video-${activeIndex}`"
                :src="normalizeUrl(currentMedia.media_url)"
                class="max-w-[92vw] max-h-[72vh] rounded-lg shadow-2xl object-contain"
                controls
                autoplay
                playsinline
              />

              <!-- Active Image -->
              <img
                v-else
                :key="`img-${activeIndex}`"
                :src="normalizeUrl(currentMedia.media_url)"
                :alt="currentMedia.alt_text || `Photo ${activeIndex + 1}`"
                class="max-w-[92vw] max-h-[72vh] rounded-lg shadow-2xl object-contain animate-in fade-in zoom-in-95 duration-150"
              />
            </div>
          </div>

          <!-- Bottom Filmstrip Reel (Scrubbable gallery for up to 80 photos) -->
          <div
            v-if="media.length > 1"
            class="px-4 sm:px-6 py-2.5 border-t border-white/10 shrink-0 bg-neutral-950/80 backdrop-blur-md"
          >
            <div
              ref="filmstripRef"
              class="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent scroll-smooth max-w-5xl mx-auto"
            >
              <button
                v-for="(item, idx) in media"
                :key="`thumb-${item.id || idx}`"
                :ref="el => { if (idx === activeIndex) activeThumbRef = el }"
                @click="goToMedia(idx)"
                class="relative h-13 w-13 sm:h-15 sm:w-15 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer group"
                :class="idx === activeIndex ? 'ring-2 ring-ic-accent border-transparent scale-105 opacity-100' : 'border-white/10 opacity-50 hover:opacity-90'"
              >
                <video
                  v-if="item.media_type === 'video'"
                  :src="normalizeUrl(item.media_url)"
                  class="w-full h-full object-cover pointer-events-none"
                />
                <img
                  v-else
                  :src="normalizeUrl(item.media_url)"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <span v-if="item.media_type === 'video'" class="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                  <Play class="w-3 h-3 fill-current" />
                </span>
                <span class="absolute bottom-0.5 right-1 font-mono text-[8px] font-bold text-white/90 drop-shadow">
                  {{ idx + 1 }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import {
  Play,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX
} from 'lucide-vue-next'

const props = defineProps({
  media: {
    type: Array,
    default: () => []
  },
  authorName: {
    type: String,
    default: ''
  },
  authorAvatar: {
    type: String,
    default: ''
  },
  postDate: {
    type: String,
    default: ''
  }
})

// URL normalizer helper
const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return ''

  if (
    url === '/default_profile.png' ||
    url === '/ic-building.png' ||
    url === '/icsa_logo.png' ||
    url.startsWith('/src/') ||
    url.startsWith('/assets/') ||
    url.startsWith('/@')
  ) {
    return url
  }

  let normalized = url
  const activeBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.instituteofcomputing.org'
  const activeDomain = activeBaseUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '')

  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
    normalized = normalized.replace(/(?:localhost|127\.0\.0\.1|10\.0\.2\.2)(?::\d+)?/g, activeDomain)
    return normalized.replace(/^http:\/\//i, 'https://')
  }

  const baseUrl = activeBaseUrl.replace(/\/$/, '')
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`
  }
  return `${baseUrl}/${url}`
}

// Lightbox state
const lightboxOpen = ref(false)
const activeIndex = ref(0)
const isFullscreen = ref(false)
const lightboxContainerRef = ref(null)
const filmstripRef = ref(null)
const activeThumbRef = ref(null)

const currentMedia = computed(() => {
  if (!props.media || props.media.length === 0) return null
  return props.media[activeIndex.value] || props.media[0]
})

const openLightbox = (index = 0) => {
  activeIndex.value = Math.max(0, Math.min(index, props.media.length - 1))
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'

  nextTick(() => {
    lightboxContainerRef.value?.focus?.()
    scrollThumbIntoView()
  })
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
  if (document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {})
  }
}

const goToMedia = (index) => {
  if (index >= 0 && index < props.media.length) {
    activeIndex.value = index
    scrollThumbIntoView()
  }
}

const prevMedia = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
    scrollThumbIntoView()
  }
}

const nextMedia = () => {
  if (activeIndex.value < props.media.length - 1) {
    activeIndex.value++
    scrollThumbIntoView()
  }
}

const scrollThumbIntoView = () => {
  nextTick(() => {
    if (activeThumbRef.value && typeof activeThumbRef.value.scrollIntoView === 'function') {
      activeThumbRef.value.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    }
  })
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    lightboxContainerRef.value?.requestFullscreen?.().catch(() => {})
    isFullscreen.value = true
  } else {
    document.exitFullscreen?.().catch(() => {})
    isFullscreen.value = false
  }
}

// Touch swipe gestures for mobile lightbox
let touchStartX = 0
const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX
  const diffX = touchEndX - touchStartX
  if (diffX > 60) {
    prevMedia()
  } else if (diffX < -60) {
    nextMedia()
  }
}

// Global keyboard listeners when lightbox is open
const handleGlobalKeydown = (e) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevMedia()
  if (e.key === 'ArrowRight') nextMedia()
}

// Video IntersectionObserver for scroll-into-view autoplay & scroll-past pause
const singleVideoRef = ref(null)
const userPausedManually = ref(false)
const isMuted = ref(true)
let videoObserver = null
let isAutoPausing = false
let isAutoPlaying = false

const handleVideoPlay = () => {
  if (!isAutoPlaying) {
    userPausedManually.value = false
  }
  // Coordinate across multiple feed videos so only one active video plays at once
  if (singleVideoRef.value && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('portal:video-play', { detail: singleVideoRef.value }))
  }
}

const handleVideoPause = () => {
  if (!isAutoPausing) {
    userPausedManually.value = true
  }
}

const handleVolumeChange = () => {
  if (singleVideoRef.value) {
    isMuted.value = singleVideoRef.value.muted || singleVideoRef.value.volume === 0
  }
}

const toggleMute = () => {
  if (singleVideoRef.value) {
    singleVideoRef.value.muted = !singleVideoRef.value.muted
    isMuted.value = singleVideoRef.value.muted
  }
}

const handleGlobalVideoPlay = (e) => {
  // If another post video starts playing, pause this one
  if (e.detail !== singleVideoRef.value && singleVideoRef.value && !singleVideoRef.value.paused) {
    isAutoPausing = true
    singleVideoRef.value.pause()
    setTimeout(() => {
      isAutoPausing = false
    }, 50)
  }
}

const setupVideoObserver = () => {
  if (!singleVideoRef.value || typeof IntersectionObserver === 'undefined') return

  if (videoObserver) {
    videoObserver.disconnect()
  }

  videoObserver = new IntersectionObserver((entries) => {
    const entry = entries[0]
    const video = singleVideoRef.value
    if (!video) return

    // Video is at least 35% in view -> Autoplay if not manually paused by user
    if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
      if (!userPausedManually.value && video.paused) {
        isAutoPlaying = true
        video.muted = isMuted.value
        video.play()
          .then(() => {
            isAutoPlaying = false
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('portal:video-play', { detail: video }))
            }
          })
          .catch((err) => {
            isAutoPlaying = false
            console.debug('Autoplay prevented by browser:', err)
          })
      }
    } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
      // Scrolled out of view (<20% visible) -> Pause automatically
      if (!video.paused && !video.ended) {
        isAutoPausing = true
        video.pause()
        setTimeout(() => {
          isAutoPausing = false
        }, 50)
      }
      // If completely off-screen, reset manual pause so it can autoplay next time user scrolls back
      if (entry.intersectionRatio === 0) {
        userPausedManually.value = false
      }
    }
  }, {
    threshold: [0, 0.2, 0.35, 0.6, 0.8]
  })

  videoObserver.observe(singleVideoRef.value)
}

watch(singleVideoRef, (newEl, oldEl) => {
  if (oldEl && videoObserver) {
    videoObserver.unobserve(oldEl)
  }
  if (newEl) {
    nextTick(() => {
      setupVideoObserver()
    })
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('portal:video-play', handleGlobalVideoPlay)
  nextTick(() => {
    setupVideoObserver()
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  window.removeEventListener('portal:video-play', handleGlobalVideoPlay)
  if (videoObserver) {
    videoObserver.disconnect()
    videoObserver = null
  }
  document.body.style.overflow = ''
})
</script>
