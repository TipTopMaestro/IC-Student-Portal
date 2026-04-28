<template>
  <div 
    class="flex items-center gap-1 bg-white border border-gray-100 rounded-full shadow-lg px-1 py-1 animate-in fade-in zoom-in duration-200"
    @mouseleave="$emit('close')"
  >
    <button
      v-for="reaction in reactions"
      :key="reaction.type"
      @click="$emit('select', reaction.type)"
      class="group relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-125 hover:-translate-y-1 active:scale-95"
    >
      <span class="text-xl leading-none select-none">{{ reaction.emoji }}</span>
      
      <!-- Tooltip -->
      <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capitalize whitespace-nowrap z-50">
        {{ reaction.type }}
      </span>
    </button>
  </div>
</template>

<script setup>
const reactions = [
  { type: 'like', emoji: '👍' },
  { type: 'heart', emoji: '❤️' },
  { type: 'haha', emoji: '😆' },
  { type: 'sad', emoji: '😢' },
  { type: 'angry', emoji: '😡' }
]

defineEmits(['select', 'close'])
</script>
