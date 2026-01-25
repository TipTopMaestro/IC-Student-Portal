<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">External Systems</h1>
      <p class="text-gray-500 text-sm mt-0.5">Access integrated department systems</p>
    </div>

    <!-- Systems List -->
    <div class="space-y-3">
      <!-- Voting System -->
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all group">
        <button 
          @click="openExternalSystem('voting')" 
          class="w-full p-5 text-left"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-medium text-gray-900">Voting System</h3>
                <p class="text-xs text-gray-500 mt-0.5">Student elections & polls</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          <!-- Alert Badge -->
          <div v-if="hasActivePoll" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg">
            <div class="h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            <span class="text-xs font-medium text-amber-900">1 active poll</span>
          </div>
        </button>
      </div>

      <!-- Locker System -->
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all group">
        <button 
          @click="openExternalSystem('locker')" 
          class="w-full p-5 text-left"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-medium text-gray-900">Locker System</h3>
                  <span class="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">L-205</span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5">Building A, Floor 2</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- Help Card -->
    <div class="bg-gray-50 border border-gray-200 rounded-xl p-5">
      <div class="flex items-start gap-3">
        <div class="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-900 font-medium mb-1">Need help accessing a system?</p>
          <p class="text-xs text-gray-600 leading-relaxed">Contact IT support if you're having issues or need assistance.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// State
const hasActivePoll = ref(true)

// External system URLs - placeholders for now
const externalSystemUrls = {
  voting: 'https://voting-system.icsa.edu.ph',
  locker: 'https://locker-system.icsa.edu.ph'
}

const openExternalSystem = (system) => {
  const url = externalSystemUrls[system]
  if (url) {
    window.open(url, '_blank')
  }
}
</script>
