<template>
  <span 
    class="inline-flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all duration-200 cursor-pointer select-none group/cat relative"
    :title="meta.label"
    @click.stop="$emit('click-category', category)"
  >
    <svg 
      class="shrink-0 transition-transform duration-200 group-hover/cat:scale-110" 
      :class="size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="1.8" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      viewBox="0 0 24 24"
    >
      <path :d="meta.icon" />
    </svg>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { getCategoryMeta } from '@/constants/postCategories'

const props = defineProps({
  category: {
    type: String,
    default: 'general'
  },
  size: {
    type: String,
    default: 'sm'
  }
})

defineEmits(['click-category'])

const meta = computed(() => getCategoryMeta(props.category))
</script>
