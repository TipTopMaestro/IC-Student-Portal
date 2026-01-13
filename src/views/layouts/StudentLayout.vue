<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center space-x-3">
            <img src="/icsa_logo.png" alt="ICSA Logo" class="h-10 w-10" />
            <div>
              <h1 class="text-base font-semibold text-gray-900">ICSA Student Portal</h1>
              <p class="text-xs text-gray-500">Institute of Computing</p>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link
              to="/"
              class="nav-link"
              :class="{ 'nav-link-active': isActive('/') }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </router-link>

            <router-link
              to="/attendance"
              class="nav-link"
              :class="{ 'nav-link-active': isActive('/attendance') }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Attendance
            </router-link>

            <router-link
              to="/submissions"
              class="nav-link"
              :class="{ 'nav-link-active': isActive('/submissions') }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Submissions
            </router-link>

            <router-link
              to="/calendar"
              class="nav-link"
              :class="{ 'nav-link-active': isActive('/calendar') }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </router-link>

            <router-link
              to="/external-systems"
              class="nav-link"
              :class="{ 'nav-link-active': isActive('/external-systems') }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Systems
            </router-link>
          </div>

          <!-- Right Side Icons -->
          <div class="flex items-center space-x-3">
            <!-- Notifications -->
            <button @click="showNotifications = !showNotifications" class="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Announcements -->
            <router-link to="/announcements" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </router-link>

            <!-- Profile Dropdown -->
            <div class="relative">
              <button @click="showProfileMenu = !showProfileMenu" class="flex items-center space-x-3 focus:outline-none">
                <div class="h-9 w-9 rounded-full bg-linear-to-br from-ic-primary to-dnsc-accent flex items-center justify-center text-white font-semibold">
                  {{ userInitials }}
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
                  <p class="text-xs text-gray-500">{{ userRole }}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                <router-link to="/profile" @click="showProfileMenu = false" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </router-link>
                <hr class="my-1">
                <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <!-- Mobile Menu Button -->
            <button @click="showMobileMenu = !showMobileMenu" class="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="showMobileMenu" class="md:hidden py-3 border-t border-gray-200">
          <router-link to="/" @click="showMobileMenu = false" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Dashboard</router-link>
          <router-link to="/attendance" @click="showMobileMenu = false" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Attendance</router-link>
          <router-link to="/submissions" @click="showMobileMenu = false" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Submissions</router-link>
          <router-link to="/calendar" @click="showMobileMenu = false" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Calendar</router-link>
          <router-link to="/external-systems" @click="showMobileMenu = false" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Systems</router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>

    <!-- Notifications Sidebar -->
    <transition name="slide">
      <div v-if="showNotifications" class="fixed inset-0 z-50" @click="showNotifications = false">
        <div class="absolute inset-0" style="backdrop-filter: blur(2px); background-color: rgba(0, 0, 0, 0.15);"></div>
        <div @click.stop class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Notifications</h3>
              <button @click="showNotifications = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-4 space-y-3">
            <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p class="text-sm font-medium text-blue-900">New Announcement</p>
              <p class="text-xs text-blue-700 mt-1">Academic calendar has been updated</p>
              <p class="text-xs text-blue-600 mt-2">2 hours ago</p>
            </div>
            <div class="p-3 bg-green-50 rounded-lg border border-green-200">
              <p class="text-sm font-medium text-green-900">Attendance Updated</p>
              <p class="text-xs text-green-700 mt-1">Your attendance for today's event has been recorded</p>
              <p class="text-xs text-green-600 mt-2">5 hours ago</p>
            </div>
            <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p class="text-sm font-medium text-yellow-900">Submission Reminder</p>
              <p class="text-xs text-yellow-700 mt-1">Document submission deadline is approaching</p>
              <p class="text-xs text-yellow-600 mt-2">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showProfileMenu = ref(false)
const showMobileMenu = ref(false)
const showNotifications = ref(false)

const userName = computed(() => {
  if (authStore.user) {
    return `${authStore.user.firstName} ${authStore.user.lastName}`
  }
  return 'Student'
})

const userInitials = computed(() => {
  if (authStore.user) {
    return `${authStore.user.firstName[0]}${authStore.user.lastName[0]}`
  }
  return 'ST'
})

const userRole = computed(() => {
  return authStore.user?.studentId || 'Student'
})

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4B5563;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #640D5F;
  background-color: #FAF5FF;
}

.nav-link-active {
  color: #640D5F;
  background-color: #FAF5FF;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .absolute.right-0,
.slide-leave-to .absolute.right-0 {
  transform: translateX(100%);
}
</style>
