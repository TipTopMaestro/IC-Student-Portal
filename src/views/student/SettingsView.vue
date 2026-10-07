<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
    <!-- Page Header -->
    <div>
      <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">settings</h1>
      <p class="text-sm text-gray-500 mt-0.5">Manage your account preferences, sessions, and interface configuration</p>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Settings Sidebar Navigation -->
      <div class="md:col-span-1 space-y-3">
        <div class="px-1">
          <span class="font-pixel text-sm text-gray-400 lowercase">01 — navigation</span>
        </div>

        <div class="space-y-1">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs font-medium uppercase tracking-wider transition-all cursor-pointer"
            :class="activeTab === tab.id 
              ? 'bg-purple-50 text-ic-primary border border-purple-200/60 font-semibold shadow-xs' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'"
          >
            <div class="flex items-center gap-2.5">
              <component :is="tab.icon" class="w-4 h-4 shrink-0" />
              <span>{{ tab.name }}</span>
            </div>
            <span class="text-[10px] opacity-60">→</span>
          </button>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="md:col-span-3 space-y-3">
        <div class="px-1">
          <span class="font-pixel text-sm text-gray-400 lowercase">02 — {{ activeTabTitle }}</span>
        </div>

        <!-- Account Tab -->
        <div v-if="activeTab === 'account'" class="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-6">
          <div class="border-b border-gray-100 pb-4">
            <h2 class="font-pixel text-lg text-gray-900 lowercase tracking-tight">account registry</h2>
            <p class="text-xs text-gray-500 mt-0.5">Your official student identity details recorded in DNSC registry</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <!-- Full Name -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Full Name</p>
              <p class="text-sm font-semibold text-gray-900 mt-1 truncate" :title="fullName">{{ fullName }}</p>
            </div>

            <!-- Student ID -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Student ID</p>
              <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5">{{ studentId || 'Not Linked' }}</p>
            </div>

            <!-- Email -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Email Address</p>
              <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5 truncate" :title="userEmail">{{ userEmail }}</p>
            </div>

            <!-- Username -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Username</p>
              <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5">{{ userName }}</p>
            </div>

            <!-- Course / Program -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl sm:col-span-2 hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Program / Course</p>
              <p class="text-xs font-semibold text-gray-900 mt-1 leading-relaxed">{{ course || 'N/A' }}</p>
            </div>

            <!-- Year & Section -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Year & Section</p>
              <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5">
                {{ yearLevel || 'N/A' }} <span v-if="yearLevel && section" class="text-gray-300">·</span> {{ section }}
              </p>
            </div>

            <!-- Enrolment Status -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Enrolment Status</p>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="inline-flex items-center gap-1 rounded-full border border-emerald-700/20 bg-emerald-600/[0.06] text-emerald-800 px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider">
                  <span class="w-1 h-1 rounded-full bg-emerald-600"></span>
                  {{ status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Security & Sessions Tab -->
        <div v-if="activeTab === 'security'" class="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-6">
          <div class="border-b border-gray-100 pb-4">
            <h2 class="font-pixel text-lg text-gray-900 lowercase tracking-tight">security & sessions</h2>
            <p class="text-xs text-gray-500 mt-0.5">Manage your login mechanisms and track active browser session</p>
          </div>

          <!-- Google Account Managed Status -->
          <div class="flex items-start gap-3.5 p-4.5 bg-purple-50/40 border border-purple-200/60 rounded-xl">
            <div class="w-9 h-9 rounded-xl bg-ic-primary/10 flex items-center justify-center text-ic-primary shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div class="space-y-1 flex-1">
              <p class="font-semibold text-xs text-gray-900 uppercase font-mono tracking-wider">Account Managed via Google SSO</p>
              <p class="text-xs text-gray-600 leading-relaxed font-sans">
                Your credentials are secured by DNSC Google Workspace. To update your password or recovery phone, configure it in 
                <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" class="text-ic-secondary hover:text-ic-primary font-medium inline-flex items-center gap-0.5 hover:underline">
                  Google Account Settings
                  <span class="text-[10px]">↗</span>
                </a>.
              </p>
            </div>
          </div>

          <!-- Active Session Info -->
          <div class="space-y-3">
            <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Current Device</p>
            <div class="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/60">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                  <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-900">{{ browserName }}</p>
                  <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">DNSC Campus Network · Active Session</p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1 rounded-full border border-emerald-700/20 bg-emerald-600/[0.06] text-emerald-800 px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider">
                <span class="w-1 h-1 rounded-full bg-emerald-600 animate-pulse"></span>
                Active
              </span>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="border-t border-gray-100 pt-5 space-y-3">
            <p class="font-mono text-[10px] font-medium text-rose-500 uppercase tracking-wider">Danger Zone</p>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-rose-200/70 bg-rose-50/25 rounded-xl gap-3">
              <div>
                <p class="text-xs font-semibold text-gray-900">Clear Local Cache Data</p>
                <p class="text-xs text-gray-500 mt-0.5">Clears stored offline tokens and local database caches on this client.</p>
              </div>
              <button 
                @click="clearLocalData"
                class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
              >
                Clear & Log out
              </button>
            </div>
          </div>
        </div>

        <!-- Appearance Tab -->
        <div v-if="activeTab === 'appearance'" class="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
          <AppearanceSettings />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppearanceSettings from '@/components/settings/AppearanceSettings.vue'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('account')

const activeTabTitle = computed(() => {
  if (activeTab.value === 'account') return 'account info'
  if (activeTab.value === 'security') return 'security & session'
  if (activeTab.value === 'appearance') return 'appearance'
  return 'settings'
})

const userEmail = computed(() => authStore.user?.email || 'Not available')
const userName = computed(() => authStore.user?.username || '')
const studentId = computed(() => authStore.user?.student?.s_studentID || authStore.user?.student_id || '')

const fullName = computed(() => {
  const student = authStore.user?.student
  if (student) {
    return `${student.s_fname || ''} ${student.s_mname ? student.s_mname + ' ' : ''}${student.s_lname || ''}`
  }
  return authStore.user?.first_name || authStore.user?.username || 'Student'
})

const course = computed(() => authStore.user?.student?.program_name || authStore.user?.student?.s_course || '')
const yearLevel = computed(() => {
  const lvl = authStore.user?.student?.s_lvl
  return lvl ? `Year ${lvl}` : ''
})
const section = computed(() => authStore.user?.student?.s_set || '')
const status = computed(() => authStore.user?.student?.s_status || 'enrolled')

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
  { id: 'account', name: 'Account', icon: UserIcon },
  { id: 'security', name: 'Security', icon: ShieldIcon },
  { id: 'appearance', name: 'Appearance', icon: PaletteIcon }
]

const clearLocalData = async () => {
  if (confirm('This will clear all cached data and sign you out. Continue?')) {
    await authStore.logout()
    sessionStorage.clear()
    localStorage.clear()
    router.push('/login')
  }
}
</script>
