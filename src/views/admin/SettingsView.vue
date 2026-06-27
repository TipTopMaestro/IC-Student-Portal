<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>
      <p class="text-sm text-gray-500 mt-1">Manage your account preferences and customize your portal experience</p>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Settings Sidebar Navigation -->
      <div class="md:col-span-1 space-y-1">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-98"
          :class="activeTab === tab.id 
            ? 'bg-ic-primary/10 text-ic-primary shadow-sm font-semibold' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <div class="flex items-center gap-3">
            <component :is="tab.icon" class="w-5 h-5 shrink-0" />
            <span>{{ tab.name }}</span>
          </div>
          <svg class="w-4 h-4 opacity-50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="md:col-span-3">
        <!-- Account Tab -->
        <div v-if="activeTab === 'account'" class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6 animate-fadeIn">
          <div class="border-b border-gray-50 pb-4">
            <h2 class="text-lg font-semibold text-gray-900">Account Information</h2>
            <p class="text-xs text-gray-500 mt-0.5">Your admin account identity details</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Email -->
            <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
              <p class="text-sm font-medium text-gray-900 mt-1">{{ userEmail }}</p>
            </div>

            <!-- Username -->
            <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Username</p>
              <p class="text-sm font-medium text-gray-900 mt-1">{{ userName }}</p>
            </div>

            <!-- Role -->
            <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">System Role</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="w-2.5 h-2.5 rounded-full bg-ic-secondary animate-pulse"></span>
                <p class="text-sm font-semibold text-gray-900">Administrator</p>
              </div>
            </div>

            <!-- Provider -->
            <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Linked Provider</p>
              <div class="flex items-center gap-2 mt-1.5 text-gray-700">
                <svg class="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span class="text-sm font-medium">Google OAuth 2.0</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'security'" class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6 animate-fadeIn">
          <div class="border-b border-gray-50 pb-4">
            <h2 class="text-lg font-semibold text-gray-900">Security & Sessions</h2>
            <p class="text-xs text-gray-500 mt-0.5">Manage your password and track login active sessions</p>
          </div>

          <!-- Password Managed Status -->
          <div class="flex items-start gap-4 p-4 bg-purple-50/40 border border-ic-light/40 rounded-2xl">
            <div class="w-10 h-10 rounded-xl bg-ic-primary/10 flex items-center justify-center text-ic-primary shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-semibold text-gray-900">Account Managed by Google</p>
              <p class="text-xs text-gray-500 leading-relaxed text-gray-600">
                Your credentials are secured and managed via Google SSO. To update your password, please configure it directly in your 
                <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" class="text-ic-secondary hover:underline font-medium inline-flex items-center gap-0.5">
                  Google Account settings
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>.
              </p>
            </div>
          </div>

          <!-- Active Session Info -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider">Device Session</h3>
            <div class="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">Current Session Device</p>
                  <p class="text-xs text-gray-500">Browser: {{ browserName }} &bull; DNSC Campus Network</p>
                </div>
              </div>
              <span class="badge bg-green-100 text-green-800 shrink-0 font-medium">Active Now</span>
            </div>
          </div>

          <!-- Session Destruction -->
          <div class="border-t border-gray-100 pt-5 space-y-2">
            <h3 class="text-sm font-semibold text-red-500">Danger Zone</h3>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-red-100 bg-red-50/20 rounded-2xl gap-3">
              <div>
                <p class="text-sm font-semibold text-gray-900">Clear Local Cache Data</p>
                <p class="text-xs text-gray-500">This action clears all locally stored tokens, preferences, and details before signing you out.</p>
              </div>
              <button 
                @click="clearLocalData"
                class="px-4 py-2.5 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 active:scale-95 transition-all shadow-sm shrink-0 w-full sm:w-auto"
              >
                Clear Data & Log out
              </button>
            </div>
          </div>
        </div>

        <!-- Appearance Tab -->
        <div v-if="activeTab === 'appearance'" class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6 animate-fadeIn">
          <div class="border-b border-gray-50 pb-4">
            <h2 class="text-lg font-semibold text-gray-900">Appearance</h2>
            <p class="text-xs text-gray-500 mt-0.5">Personalize the styling and layouts of your dashboard theme</p>
          </div>

          <!-- Theme presets -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider">Interface Theme</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                @click="isDarkMode = false"
                class="flex items-center gap-3 p-4 border rounded-2xl text-left transition-all active:scale-98"
                :class="!isDarkMode ? 'border-ic-primary bg-ic-primary/5 ring-1 ring-ic-primary' : 'border-gray-200 hover:border-gray-300'"
              >
                <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">Default Light Theme</p>
                  <p class="text-xs text-gray-400">Crisp canvas with DNSC accent tones</p>
                </div>
              </button>

              <button 
                @click="toggleDarkMode"
                class="flex items-center gap-3 p-4 border rounded-2xl text-left transition-all active:scale-98"
                :class="isDarkMode ? 'border-ic-primary bg-ic-primary/5 ring-1 ring-ic-primary' : 'border-gray-200 hover:border-gray-300'"
              >
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">Midnight Dark Theme</p>
                  <p class="text-xs text-gray-400">Dimmed palette for low-light comfort</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Color Presets -->
          <div class="space-y-3 border-t border-gray-50 pt-5">
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider">Portal Accent Color</h3>
            <div class="flex items-center gap-3">
              <button class="w-8 h-8 rounded-full bg-gradient-to-br from-ic-primary to-ic-accent ring-2 ring-offset-2 ring-ic-primary transition-all scale-110" title="DNSC Plum"></button>
              <button @click="toggleDarkMode" class="w-8 h-8 rounded-full bg-emerald-500 hover:scale-105 active:scale-90 transition-all" title="Forest Accent"></button>
              <button @click="toggleDarkMode" class="w-8 h-8 rounded-full bg-cyan-500 hover:scale-105 active:scale-90 transition-all" title="Ocean Breeze"></button>
              <button @click="toggleDarkMode" class="w-8 h-8 rounded-full bg-indigo-500 hover:scale-105 active:scale-90 transition-all" title="Royal Violet"></button>
            </div>
          </div>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div v-if="showDarkModeToast" class="flex items-center gap-2 p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-amber-800">
              <svg class="w-4.5 h-4.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span class="text-xs font-medium">This theme customization preset is coming soon in the next release!</span>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('account')
const isDarkMode = ref(false)
const showDarkModeToast = ref(false)

const userEmail = computed(() => authStore.user?.email || 'Not available')
const userName = computed(() => authStore.user?.username || 'admin')

const browserName = computed(() => {
  const ua = navigator.userAgent
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Google Chrome'
  if (ua.includes('Edg')) return 'Microsoft Edge'
  if (ua.includes('Firefox')) return 'Mozilla Firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Apple Safari'
  return 'Standard Browser'
})

// Tab Icons
const UserIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
])
const ShieldIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
])
const PaletteIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-3M9.7 8.6L14 4.3a1.5 1.5 0 012.1 2.1l-4.3 4.3m-2.1-2.1L9 11.3M9.7 8.6L11.3 7M9 11.3l-2.4 2.4a.7.7 0 000 1l1 1a.7.7 0 001 0l2.4-2.4' })
])

const tabs = [
  { id: 'account', name: 'Account Info', icon: UserIcon },
  { id: 'security', name: 'Security & Session', icon: ShieldIcon },
  { id: 'appearance', name: 'Appearance', icon: PaletteIcon }
]

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  showDarkModeToast.value = true
  setTimeout(() => {
    showDarkModeToast.value = false
    isDarkMode.value = false
  }, 3500)
}

const clearLocalData = async () => {
  if (confirm('This will clear all cached data and sign you out. Continue?')) {
    await authStore.logout()
    sessionStorage.clear()
    localStorage.clear()
    router.push('/login')
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
