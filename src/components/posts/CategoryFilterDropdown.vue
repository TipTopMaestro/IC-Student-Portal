<template>
  <div ref="dropdownRef" class="relative inline-block text-left z-30 select-none">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 border border-gray-200/80 hover:bg-gray-100/80 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-ic-primary/20 transition-all text-gray-700 min-w-[140px]"
    >
      <div class="flex items-center gap-1 truncate">
        <template v-if="selectedMeta">
          <span class="text-ic-primary font-semibold text-[11px]">#</span>
          <span class="truncate font-medium text-gray-900">{{ selectedMeta.label.toLowerCase() }}</span>
        </template>
        <template v-else>
          <span class="text-gray-400 font-semibold text-[11px]">#</span>
          <span class="text-gray-600 font-medium">all categories</span>
        </template>
      </div>

      <svg 
        class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0" 
        :class="{ 'rotate-180': isOpen }" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 mt-1.5 w-44 rounded-xl bg-white border border-gray-100 shadow-xl py-1 z-50 focus:outline-none"
      >
        <!-- Option: All Categories -->
        <button
          type="button"
          @click="selectCategory('')"
          class="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors hover:bg-gray-50"
          :class="!modelValue ? 'font-semibold text-ic-primary bg-purple-50/40' : 'text-gray-700'"
        >
          <div class="flex items-center gap-1">
            <span class="opacity-40 text-[11px]">#</span>
            <span>all categories</span>
          </div>
          <svg v-if="!modelValue" class="w-3.5 h-3.5 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <div class="my-1 border-t border-gray-100"></div>

        <!-- Option List -->
        <button
          v-for="cat in categoryList"
          :key="cat.key"
          type="button"
          @click="selectCategory(cat.key)"
          class="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors hover:bg-gray-50"
          :class="modelValue === cat.key ? 'font-semibold text-ic-primary bg-purple-50/40' : 'text-gray-700'"
        >
          <div class="flex items-center gap-1">
            <span class="opacity-40 text-[11px]">#</span>
            <span>{{ cat.label.toLowerCase() }}</span>
          </div>
          <svg v-if="modelValue === cat.key" class="w-3.5 h-3.5 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { CATEGORY_LIST, getCategoryMeta } from '@/constants/postCategories'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const categoryList = CATEGORY_LIST

const selectedMeta = computed(() => {
  if (!props.modelValue) return null
  return getCategoryMeta(props.modelValue)
})

const selectCategory = (key) => {
  emit('update:modelValue', key)
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
