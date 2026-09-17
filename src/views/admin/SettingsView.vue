<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
    <!-- Page Header -->
    <div>
      
      <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">settings</h1>
      <p class="text-sm text-gray-500 mt-0.5">Manage your administrative preferences, session security, and portal appearance</p>
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
            <p class="text-xs text-gray-500 mt-0.5">Your official administrator identity recorded in the DNSC directory</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <!-- Full Name -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Full Name</p>
              <p class="text-sm font-semibold text-gray-900 mt-1 truncate" :title="fullName">{{ fullName }}</p>
            </div>

            <!-- Administrator ID -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Identifier / ID</p>
              <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5">{{ adminId }}</p>
            </div>

            <!-- Email -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Official Email</p>
              <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5 truncate" :title="userEmail">{{ userEmail }}</p>
            </div>

            <!-- Username -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">System Username</p>
              <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5">@{{ userName }}</p>
            </div>

            <!-- Institute -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Institute</p>
              <p class="text-xs font-semibold text-gray-900 mt-1 leading-relaxed">{{ institute }}</p>
            </div>

            <!-- Campus -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Campus Institution</p>
              <p class="text-xs font-semibold text-gray-900 mt-1 leading-relaxed">{{ school }}</p>
            </div>

            <!-- Authority Status -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Administrative Authority</p>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="inline-flex items-center gap-1 rounded-full border border-purple-200/60 bg-purple-50 text-ic-primary px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider">
                  <span class="w-1 h-1 rounded-full bg-ic-primary"></span>
                  {{ adminRole }}
                </span>
              </div>
            </div>

            <!-- Assigned Groups -->
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Assigned Groups</p>
              <div class="flex flex-wrap gap-1 mt-1.5">
                <span 
                  v-for="group in groups" 
                  :key="group"
                  class="inline-flex px-2 py-0.5 rounded-full font-mono text-[10px] font-medium border border-[#640D5F]/20 bg-[#640D5F]/[0.06] text-[#520B4D]"
                >
                  {{ group }}
                </span>
                <span v-if="!groups || groups.length === 0" class="font-mono text-[10px] text-gray-400">
                  Standard Administrator
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Security & Sessions Tab -->
        <div v-if="activeTab === 'security'" class="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-6">
          <div class="border-b border-gray-100 pb-4">
            <h2 class="font-pixel text-lg text-gray-900 lowercase tracking-tight">security & sessions</h2>
            <p class="text-xs text-gray-500 mt-0.5">Manage your authentication credentials and active administrative sessions</p>
          </div>

          <!-- Google Account Managed Status -->
          <div class="flex items-start gap-3.5 p-4.5 bg-purple-50/40 border border-purple-200/60 rounded-xl">
            <div class="w-9 h-9 rounded-xl bg-ic-primary/10 flex items-center justify-center text-ic-primary shrink-0">
              <Lock class="w-5 h-5" />
            </div>
            <div class="space-y-1 flex-1">
              <p class="font-semibold text-xs text-gray-900 uppercase font-mono tracking-wider">Account Managed via Google SSO</p>
              <p class="text-xs text-gray-600 leading-relaxed font-sans">
                Your credentials are authenticated through DNSC Google Workspace. To update passwords or configure 2-factor authentication, manage it via
                <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" class="text-ic-secondary hover:text-ic-primary font-medium inline-flex items-center gap-0.5 hover:underline">
                  Google Security Settings
                  <ExternalLink class="w-3 h-3 inline" />
                </a>.
              </p>
            </div>
          </div>

          <!-- Active Session Info -->
          <div class="space-y-3">
            <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Active Device Session</p>
            <div class="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/60">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                  <Monitor class="w-4.5 h-4.5" />
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-900">{{ browserName }}</p>
                  <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                    DNSC Campus Gateway · JWT Silent Refresh Active
                  </p>
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
                <p class="text-xs font-semibold text-gray-900">Clear Local Cache & Terminate Session</p>
                <p class="text-xs text-gray-500 mt-0.5">Clears stored tokens and cached offline resources on this browser before redirecting to login.</p>
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
        <div v-if="activeTab === 'appearance'" class="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-6">
          <div class="border-b border-gray-100 pb-4">
            <h2 class="font-pixel text-lg text-gray-900 lowercase tracking-tight">appearance & theme</h2>
            <p class="text-xs text-gray-500 mt-0.5">Customize your layout preferences and interface contrast</p>
          </div>

          <!-- Theme Presets -->
          <div class="space-y-3">
            <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Interface Theme</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                @click="isDarkMode = false"
                class="flex items-center gap-3 p-4 border rounded-xl text-left transition-all cursor-pointer"
                :class="!isDarkMode ? 'border-ic-primary bg-purple-50/30 ring-1 ring-ic-primary/20' : 'border-gray-200 hover:border-gray-300'"
              >
                <div class="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Sun class="w-5 h-5" />
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-900 font-mono uppercase tracking-wider">Light Theme (Active)</p>
                  <p class="text-xs text-gray-400 mt-0.5">High-contrast minimalist canvas</p>
                </div>
              </button>

              <button 
                @click="toggleDarkMode"
                class="flex items-center gap-3 p-4 border rounded-xl text-left transition-all cursor-pointer border-gray-200 hover:border-gray-300"
              >
                <div class="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <Moon class="w-5 h-5" />
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-900 font-mono uppercase tracking-wider">Dark Theme</p>
                  <p class="text-xs text-gray-400 mt-0.5">Dimmed palette for low-light</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Color Presets -->
          <div class="space-y-3 border-t border-gray-100 pt-5">
            <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Brand Accent</p>
            <div class="flex items-center gap-3">
              <button class="w-7 h-7 rounded-full bg-gradient-to-br from-ic-primary to-ic-accent ring-2 ring-offset-2 ring-ic-primary transition-all scale-105" title="DNSC Plum"></button>
              <button @click="toggleDarkMode" class="w-7 h-7 rounded-full bg-emerald-500 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Forest Accent"></button>
              <button @click="toggleDarkMode" class="w-7 h-7 rounded-full bg-cyan-500 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Ocean Breeze"></button>
              <button @click="toggleDarkMode" class="w-7 h-7 rounded-full bg-indigo-500 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Royal Violet"></button>
            </div>
          </div>

          <!-- Coming Soon Toast -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div v-if="showDarkModeToast" class="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 font-mono text-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Dark theme customization will be available in the upcoming release.</span>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  User,
  Shield,
  Palette,
  Lock,
  Monitor,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('account')
const isDarkMode = ref(false)
const showDarkModeToast = ref(false)

const activeTabTitle = computed(() => {
  if (activeTab.value === 'account') return 'account registry'
  if (activeTab.value === 'security') return 'security & sessions'
  if (activeTab.value === 'appearance') return 'appearance & theme'
  return 'settings'
})

const userEmail = computed(() => authStore.user?.email || 'Not available')
const userName = computed(() => authStore.user?.username || 'admin')

const fullName = computed(() => {
  const u = authStore.user
  if (!u) return 'Administrator'
  if (u.student) {
    const parts = [u.student.s_fname, u.student.s_mname, u.student.s_lname, u.student.s_suffix].filter(Boolean)
    if (parts.length > 0) return parts.join(' ')
  }
  const name = `${u.first_name || ''} ${u.last_name || ''}`.trim()
  return name || u.username || 'Administrator'
})

const adminId = computed(() => {
  return authStore.user?.student?.s_studentID || authStore.user?.id ? `ID #${authStore.user.id}` : 'ROOT-ADMIN'
})

const institute = computed(() => {
  return authStore.user?.institute?.institute_name || 'Institute of Computing'
})

const school = computed(() => {
  return authStore.user?.institute?.school?.school_name || 'Davao del Norte State College'
})

const adminRole = computed(() => {
  if (authStore.user?.is_superuser) return 'Superuser Control'
  if (authStore.user?.is_staff) return 'Staff Administrator'
  return 'Portal Administrator'
})

const groups = computed(() => {
  return authStore.user?.groups || ['Admin']
})

const browserName = computed(() => {
  const ua = navigator.userAgent
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Google Chrome'
  if (ua.includes('Edg')) return 'Microsoft Edge'
  if (ua.includes('Firefox')) return 'Mozilla Firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Apple Safari'
  return 'Standard Browser'
})

const tabs = [
  { id: 'account', name: 'Account', icon: User },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'appearance', name: 'Appearance', icon: Palette }
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
