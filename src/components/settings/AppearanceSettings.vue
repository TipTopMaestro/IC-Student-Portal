<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-2">
      <div>
        <h2 class="font-pixel text-lg text-gray-900 lowercase tracking-tight">appearance & theme</h2>
        <p class="text-xs text-gray-500 mt-0.5">Preview interface themes and contrast palettes</p>
      </div>

      <!-- Minimalist Status Pill -->
      <div class="flex items-center gap-2 shrink-0">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-200/80 bg-amber-50/70 text-amber-800 font-mono text-[10px] font-medium uppercase tracking-wider">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Under Development
        </span>
      </div>
    </div>

    <!-- Theme Mode Section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">
          Theme Presets (Preview)
        </p>
        <span class="font-mono text-[10px] text-gray-400">4 Concepts</span>
      </div>

      <!-- 2-Column Miniature Mockup Grid (from Reference image) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          v-for="theme in themes" 
          :key="theme.id"
          @click="selectTheme(theme.id)"
          class="group relative flex flex-col items-center cursor-pointer select-none"
        >
          <!-- Miniature UI Mockup Card -->
          <div 
            class="w-full aspect-[16/10] rounded-2xl p-3 border-2 transition-all duration-200 relative flex flex-col justify-between overflow-hidden shadow-xs group-hover:-translate-y-0.5 group-hover:shadow-md"
            :class="[
              theme.preview.canvasClass,
              currentTheme === theme.id 
                ? [theme.preview.activeBorderClass, 'ring-2 ring-offset-2', theme.preview.activeRingClass] 
                : 'border-gray-200/80 hover:border-gray-300'
            ]"
          >
            <!-- Top App Bar Mockup -->
            <div class="flex items-center justify-between w-full">
              <div 
                class="h-2 w-14 rounded-full transition-colors" 
                :class="theme.preview.skeletonClass"
              ></div>
              <div 
                class="h-2 w-4 rounded-full opacity-60" 
                :class="theme.preview.skeletonClass"
              ></div>
            </div>

            <!-- Center Content Block / Active Checkmark Badge -->
            <div class="relative flex items-center justify-between w-full my-auto">
              <!-- Left Mini Avatar / Post Block -->
              <div 
                class="w-7 h-7 rounded-lg transition-colors shrink-0" 
                :class="theme.preview.blockClass"
              ></div>

              <!-- Center Checkmark Overlay (when active) -->
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-75"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-75"
              >
                <div 
                  v-if="currentTheme === theme.id" 
                  class="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-white/90"
                    :class="theme.preview.accentButtonClass"
                  >
                    <Check class="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
              </Transition>

              <!-- Mini Mockup Secondary Line -->
              <div class="space-y-1.5 flex-1 ml-3 max-w-[50%]">
                <div class="h-1.5 w-full rounded-full" :class="theme.preview.skeletonClass"></div>
                <div class="h-1.5 w-3/4 rounded-full opacity-60" :class="theme.preview.skeletonClass"></div>
              </div>
            </div>

            <!-- Bottom App Bar & Action Pill -->
            <div class="flex items-center justify-between w-full pt-1">
              <div 
                class="h-1.5 w-10 rounded-full opacity-50" 
                :class="theme.preview.skeletonClass"
              ></div>
              <!-- Theme Accent Pill Button -->
              <div 
                class="h-2.5 w-9 rounded-full shadow-xs transition-transform group-hover:scale-105" 
                :class="theme.preview.accentButtonClass"
              ></div>
            </div>
          </div>

          <!-- Theme Label & Subtitle -->
          <div class="mt-2.5 text-center">
            <p 
              class="text-xs transition-colors"
              :class="currentTheme === theme.id ? ['font-semibold', theme.activeTextClass] : 'font-medium text-gray-700 group-hover:text-gray-900'"
            >
              {{ theme.name }}
            </p>
            <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
              {{ theme.subtitle }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Minimalist Under Development Notice -->
    <div class="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200/80 bg-gray-50/70 text-gray-600">
      <Info class="w-4 h-4 text-gray-400 shrink-0" />
      <p class="font-sans text-xs text-gray-500 leading-relaxed">
        Theme customization is currently under development and will be available in an upcoming release.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check, Info } from 'lucide-vue-next'

// Theme Presets Configuration (4 Themes: Light, Dark, Bloom, Bloom Dark)
const themes = [
  {
    id: 'light',
    name: 'Light',
    subtitle: 'DNSC Plum · Default',
    activeTextClass: 'text-[#640D5F]',
    preview: {
      canvasClass: 'bg-white',
      skeletonClass: 'bg-gray-100',
      blockClass: 'bg-gray-50 border border-gray-100',
      accentButtonClass: 'bg-[#640D5F]',
      activeBorderClass: 'border-[#640D5F]',
      activeRingClass: 'ring-[#640D5F]/30'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    subtitle: 'IC Midnight · Low light',
    activeTextClass: 'text-[#EE66A6]',
    preview: {
      canvasClass: 'bg-[#121118]',
      skeletonClass: 'bg-neutral-800',
      blockClass: 'bg-neutral-800/80 border border-neutral-700/60',
      accentButtonClass: 'bg-[#EE66A6]',
      activeBorderClass: 'border-[#EE66A6]',
      activeRingClass: 'ring-[#EE66A6]/40'
    }
  },
  {
    id: 'bloom',
    name: 'Bloom',
    subtitle: 'Rose Soft · Warm Blush',
    activeTextClass: 'text-[#D91656]',
    preview: {
      canvasClass: 'bg-[#FFF7F5]',
      skeletonClass: 'bg-rose-100/70',
      blockClass: 'bg-rose-50 border border-rose-200/60',
      accentButtonClass: 'bg-[#D91656]',
      activeBorderClass: 'border-[#D91656]',
      activeRingClass: 'ring-[#D91656]/30'
    }
  },
  {
    id: 'bloom-dark',
    name: 'Bloom Dark',
    subtitle: 'Plum Night · Deep Rose',
    activeTextClass: 'text-[#F43F5E]',
    preview: {
      canvasClass: 'bg-[#21141F]',
      skeletonClass: 'bg-[#361E32]',
      blockClass: 'bg-[#2E182A] border border-pink-950/80',
      accentButtonClass: 'bg-[#F43F5E]',
      activeBorderClass: 'border-[#F43F5E]',
      activeRingClass: 'ring-[#F43F5E]/40'
    }
  }
]

const currentTheme = ref('light')

const selectTheme = (themeId) => {
  currentTheme.value = themeId
}
</script>
