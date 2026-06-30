<template>
  <Analytics />
  <SpeedInsights />
  <div id="app">
    <!-- Offline Banner -->
    <Transition name="slide-down">
      <div 
        v-if="isOffline" 
        class="fixed top-0 left-0 right-0 bg-rose-600 text-white text-xs font-semibold py-2 px-4 text-center z-9999 flex items-center justify-center gap-2 shadow-md select-none"
      >
        <svg class="w-4 h-4 animate-pulse shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-3.536 4.978 4.978 0 011.414-3.536m0 0L11.314 11.3M3 3l18 18" />
        </svg>
        <span>You are currently offline. Check your network connection.</span>
      </div>
    </Transition>
    
    <RouterView :class="{ 'pt-8': isOffline }" class="transition-all duration-300" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { Analytics } from '@vercel/analytics/vue';
import { SpeedInsights } from '@vercel/speed-insights/vue';

const isOffline = ref(!navigator.onLine)

const updateOnlineStatus = () => {
  isOffline.value = !navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
#app {
  min-height: 100vh;
}

/* Transition for slide down banner */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
