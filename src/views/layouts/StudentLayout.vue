<template>
  <div class="min-h-screen bg-white">
    <!-- Mobile Header -->
    <header class="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 safe-area-top">
      <div class="flex items-center justify-between h-14 px-4">
        <div class="flex items-center gap-2">
          <img src="/icsa_logo.png" alt="ICSA" class="h-6 w-6" />
          <span class="text-base font-semibold text-gray-900">ICSA Portal</span>
        </div>
        <button @click="showMobileMenu = true" class="p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div 
      v-if="showMobileMenu" 
      class="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
      @click="showMobileMenu = false"
    >
      <div 
        @click.stop
        class="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl"
      >
        <!-- Menu Header -->
        <div class="flex items-center justify-between h-14 px-4 border-b border-gray-200">
          <span class="text-base font-semibold text-gray-900">Menu</span>
          <button @click="showMobileMenu = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Menu Items -->
        <nav class="p-4 space-y-1 overflow-y-auto" style="max-height: calc(100vh - 56px);">
          <router-link
            to="/"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="text-sm">Dashboard</span>
          </router-link>

          <router-link
            to="/attendance"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/attendance') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="text-sm">Attendance</span>
          </router-link>

          <router-link
            to="/fees"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/fees') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="text-sm">Fees</span>
          </router-link>

          <router-link
            to="/calendar"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/calendar') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-sm">Calendar</span>
          </router-link>

          <router-link
            to="/external-systems"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/external-systems') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span class="text-sm">External Systems</span>
          </router-link>

          <router-link
            to="/announcements"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/announcements') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <span class="text-sm">Announcements</span>
          </router-link>

          <router-link
            to="/profile"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/profile') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <div class="h-5 w-5 rounded-full bg-ic-primary flex items-center justify-center text-white text-xs font-medium">
              {{ userInitials }}
            </div>
            <span class="text-sm">Profile</span>
          </router-link>

          <div class="my-4 border-t border-gray-200"></div>

          <button 
            @click="handleLogout" 
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 w-full"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm">Logout</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex fixed left-0 top-0 h-screen w-18 hover:w-61 bg-white flex-col transition-all duration-300 ease-out z-50 group ">
      <!-- Logo -->
      <div class="flex items-center px-6 py-3">
        <div class="w-7 h-7 shrink-0 flex items-center justify-center">
          <img src="/icsa_logo.png" alt="ICSA" class="h-7 w-7" />
        </div>
        <span class="ml-4 text-xl font-semibold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">ICSA Portal</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-2 space-y-1">
        <router-link
          to="/"   
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActive('/') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive('/') ? 2.5 : 2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Dashboard</span>
        </router-link>

        <router-link
          to="/attendance"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActive('/attendance') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive('/attendance') ? 2.5 : 2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Attendance</span>
        </router-link>

        <router-link
          to="/fees"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActive('/fees') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive('/fees') ? 2.5 : 2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Fees</span>
        </router-link>

        <router-link
          to="/calendar"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActive('/calendar') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive('/calendar') ? 2.5 : 2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Calendar</span>
        </router-link>

        <router-link
          to="/external-systems"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActive('/external-systems') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive('/external-systems') ? 2.5 : 2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">External Systems</span>
        </router-link>

        <router-link
          to="/announcements"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActive('/announcements') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive('/announcements') ? 2.5 : 2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Announcements</span>
        </router-link>

        <router-link
          to="/profile"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActive('/profile') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <div class="h-7 w-7 rounded-full bg-ic-primary flex items-center justify-center text-white text-xs font-medium" :class="{ 'ring-2 ring-black ring-offset-2': isActive('/profile') }">
              {{ userInitials }}
            </div>
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Profile</span>
        </router-link>
      </nav>

      <!-- Logout -->
      <div class="px-3 pb-6">
        <button @click="handleLogout" class="sidebar-link w-full text-left">
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div class="flex items-center h-16 px-2">
        <router-link 
          to="/" 
          class="flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors"
          :class="isActive('/') ? 'text-ic-primary' : 'text-gray-600'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive('/') ? 2.5 : 2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs" :class="isActive('/') ? 'font-medium' : 'font-normal'">Home</span>
        </router-link>

        <router-link 
          to="/fees" 
          class="flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors"
          :class="isActive('/fees') ? 'text-ic-primary' : 'text-gray-600'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive('/fees') ? 2.5 : 2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-xs" :class="isActive('/fees') ? 'font-medium' : 'font-normal'">Fees</span>
        </router-link>

        <router-link 
          to="/external-systems" 
          class="flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors"
          :class="isActive('/external-systems') ? 'text-ic-primary' : 'text-gray-600'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive('/external-systems') ? 2.5 : 2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span class="text-xs" :class="isActive('/external-systems') ? 'font-medium' : 'font-normal'">Systems</span>
        </router-link>

        <router-link 
          to="/calendar" 
          class="flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors"
          :class="isActive('/calendar') ? 'text-ic-primary' : 'text-gray-600'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive('/calendar') ? 2.5 : 2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-xs" :class="isActive('/calendar') ? 'font-medium' : 'font-normal'">Calendar</span>
        </router-link>

        <router-link 
          to="/profile" 
          class="flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors"
          :class="isActive('/profile') ? 'text-ic-primary' : 'text-gray-600'"
        >
          <div 
            class="h-6 w-6 rounded-full bg-ic-primary flex items-center justify-center text-white text-xs font-medium transition-all"
            :class="isActive('/profile') ? 'ring-2 ring-ic-primary ring-offset-2' : ''"
          >
            {{ userInitials }}
          </div>
          <span class="text-xs" :class="isActive('/profile') ? 'font-medium' : 'font-normal'">Profile</span>
        </router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="md:ml-18 pt-14 pb-20 md:pt-0 md:pb-0">
      <div class="max-w-233.75 mx-auto px-4 py-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const showMobileMenu = ref(false)

const userInitials = computed(() => {
  const user = authStore.user
  if (!user) return 'U'
  
  // Try student nested object first (backend format)
  if (user.student?.s_fname && user.student?.s_lname) {
    return `${user.student.s_fname.charAt(0)}${user.student.s_lname.charAt(0)}`.toUpperCase()
  }
  
  // Try full_name
  if (user.full_name) {
    const names = user.full_name.trim().split(' ').filter(n => n.length > 0)
    const suffixes = ['jr', 'jr.', 'sr', 'sr.', 'ii', 'iii', 'iv']
    const namesParts = names.filter(n => !suffixes.includes(n.toLowerCase()))
    
    if (namesParts.length >= 2) {
      const firstName = namesParts[0]
      const lastName = namesParts[namesParts.length - 1]
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    } else if (namesParts.length === 1) {
      return namesParts[0].substring(0, 2).toUpperCase()
    }
  }
  
  // Fallback to first_name/last_name
  const firstName = user.first_name || user.firstName || ''
  const lastName = user.last_name || user.lastName || ''
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  
  return 'U'
})

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  showMobileMenu.value = false
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.75rem;
  color: #000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.sidebar-link:hover {
  background-color: #fafafa;
}

.sidebar-link:focus {
  outline: none;
}

.sidebar-link-active {
  font-weight: 600;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
