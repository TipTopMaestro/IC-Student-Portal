<template>
  <div class="relative w-full aspect-square overflow-hidden rounded-lg group">
    <!-- Image Carousel for posts with images -->
    <template v-if="hasMedia">
      <div 
        ref="carouselRef"
        class="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        @scroll="handleScroll"
      >
        <div 
          v-for="(media, index) in post.media" 
          :key="media.id"
          class="flex-shrink-0 w-full h-full snap-center"
        >
          <img 
            :src="media.media_url" 
            :alt="`Post image ${index + 1}`"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Navigation Arrows (desktop only) -->
      <template v-if="post.media.length > 1">
        <button 
          v-if="currentIndex > 0"
          @click.stop="scrollTo(currentIndex - 1)"
          class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Previous image"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          v-if="currentIndex < post.media.length - 1"
          @click.stop="scrollTo(currentIndex + 1)"
          class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Next image"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Dots Indicator -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <button
            v-for="(_, index) in post.media"
            :key="index"
            @click.stop="scrollTo(index)"
            class="w-1.5 h-1.5 rounded-full transition-all"
            :class="currentIndex === index ? 'bg-white w-2.5' : 'bg-white/60'"
            :aria-label="`Go to image ${index + 1}`"
          />
        </div>
      </template>

      <!-- Multi-image indicator (top right) -->
      <div 
        v-if="post.media.length > 1"
        class="absolute top-3 right-3 bg-black/60 rounded-md px-2 py-1 flex items-center gap-1"
      >
        <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
        </svg>
        <span class="text-white text-xs font-medium">{{ post.media.length }}</span>
      </div>
    </template>

    <!-- Text Card for posts without images -->
    <div 
      v-else
      class="w-full h-full bg-gradient-to-br from-ic-primary to-purple-700 p-4 flex items-center justify-center"
    >
      <p class="text-white text-sm text-center line-clamp-6 leading-relaxed font-medium">
        {{ post.content }}
      </p>
    </div>

    <!-- Hover Overlay -->
    <div 
      class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6"
      @click="$emit('click', post)"
    >
      <!-- Reaction counts (future feature) -->
      <div v-if="totalReactions > 0" class="flex items-center gap-1.5 text-white">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span class="text-sm font-semibold">{{ totalReactions }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const carouselRef = ref(null)
const currentIndex = ref(0)

const hasMedia = computed(() => props.post.media && props.post.media.length > 0)

const totalReactions = computed(() => {
  if (!props.post.reaction_counts) return 0
  const counts = props.post.reaction_counts
  return (counts.like || 0) + (counts.heart || 0) + (counts.haha || 0) + (counts.angry || 0)
})

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
