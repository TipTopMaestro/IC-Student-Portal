<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 flex flex-col items-center text-center transition-all duration-300 transform scale-100 hover:scale-[1.01]">
      
      <!-- Logo / Portal Brand -->
      <div class="flex items-center space-x-2 mb-6">
        <img src="/icsa_logo.png" alt="ICSA Logo" class="w-8 h-8 object-contain" />
        <span class="text-gray-800 font-bold text-lg tracking-wide">IC Student Portal</span>
      </div>

      <!-- Loading State -->
      <div v-if="state === 'loading'" class="space-y-6 py-4 flex flex-col items-center">
        <div class="relative flex items-center justify-center">
          <!-- Outer Pulsing Ring -->
          <div class="absolute w-16 h-16 rounded-full bg-purple-50 animate-ping"></div>
          <!-- Spinner -->
          <div class="relative w-12 h-12 border-4 border-ic-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-bold text-gray-800">Secure Redirection</h2>
          <p class="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
            Verifying your security credentials and redirecting you to <span class="font-semibold text-ic-primary">{{ systemLabel }}</span>. Please wait...
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="state === 'error'" class="space-y-6 py-4 flex flex-col items-center animate-fade-in">
        <!-- Error Icon (Exclamation Shield) -->
        <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div class="space-y-2">
          <h2 class="text-xl font-bold text-red-600">{{ errorTitle || 'Redirection Failed' }}</h2>
          <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line px-2">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full pt-4">
          <button 
            @click="tryAgain" 
            class="flex-1 px-5 py-2.5 bg-ic-primary hover:bg-primary-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            Try Again
          </button>
          <button 
            @click="closeTab" 
            class="flex-1 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 border border-gray-200 cursor-pointer"
          >
            Close Tab
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { performSSORedirect } from '@/utils/sso'

const route = useRoute()
const sysId = computed(() => {
  const sysVal = route.query.sys
  const rawSys = Array.isArray(sysVal) ? sysVal[0] : sysVal
  return typeof rawSys === 'string' ? rawSys.toLowerCase() : ''
})

const state = ref('loading') // 'loading' | 'error'
const errorTitle = ref('')
const errorMessage = ref('')

const SYSTEM_LABELS = {
  cms: 'Collection Management System (ICCMS)',
  voting: 'Voting Management System',
  locker: 'Locker Rental Management System (LRMS)'
}

const systemLabel = computed(() => {
  return SYSTEM_LABELS[sysId.value] || 'External System'
})

const closeTab = () => {
  window.close()
}

const tryAgain = () => {
  state.value = 'loading'
  triggerSSORedirect()
}

const triggerSSORedirect = async () => {
  await performSSORedirect(sysId.value, null, {
    onError: (title, msg) => {
      state.value = 'error'
      errorTitle.value = title
      errorMessage.value = msg
    }
  })
}

onMounted(() => {
  triggerSSORedirect()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
