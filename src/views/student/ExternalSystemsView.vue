<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">External Systems</h1>
      <p class="text-gray-500 text-sm mt-0.5">Access integrated department systems</p>
    </div>

    <!-- Systems Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <!-- Collection Management System -->
      <a
        :href="cmsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-white border border-gray-200 rounded-xl p-5 hover:border-ic-primary transition-colors group"
      >
        <div class="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-900 group-hover:text-ic-primary transition-colors">Collection Management</h3>
        <p class="text-xs text-gray-500 mt-1">Fees & payment submissions</p>
      </a>

      <!-- Voting System -->
      <a
        :href="votingUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-white border border-gray-200 rounded-xl p-5 hover:border-ic-primary transition-colors group"
      >
        <div class="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-900 group-hover:text-ic-primary transition-colors">Voting System</h3>
        <p class="text-xs text-gray-500 mt-1">Student elections & polls</p>
      </a>

      <!-- Locker System -->
      <a
        :href="lockerUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-white border border-gray-200 rounded-xl p-5 hover:border-ic-primary transition-colors group"
      >
        <div class="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-900 group-hover:text-ic-primary transition-colors">Locker System</h3>
        <p class="text-xs text-gray-500 mt-1">Locker reservations & management</p>
      </a>
    </div>

    
  </div>
</template>

<script setup>
const cmsUrl = import.meta.env.VITE_CMS_URL || '#'
const votingUrl = import.meta.env.VITE_VOTING_URL || '#'
const lockerUrl = import.meta.env.VITE_LOCKER_URL || '#'
</script>
