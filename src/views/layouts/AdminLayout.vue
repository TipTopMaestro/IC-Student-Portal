<template>
  <div class="flex h-screen bg-white">
    <!-- Sidebar -->
    <aside 
      class="sidebar fixed left-0 top-0 h-screen border-r border-[#dbdbdb] flex flex-col bg-white z-50 group/sidebar"
      @mouseenter="sidebarExpanded = true"
      @mouseleave="sidebarExpanded = false"
    >
      <!-- Logo -->
      <div class="h-20 flex items-center px-3 pt-6 pb-2">
        <router-link to="/admin" class="flex items-center w-full px-3 py-3 -mx-3 hover:bg-[#fafafa] rounded-xl transition-all duration-200">
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <img src="/icsa_logo.png" alt="Logo" class="w-6 h-6" />
          </div>
          <span 
            :class="[
              'ml-4 text-base whitespace-nowrap overflow-hidden transition-all duration-200',
              sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            ]"
          >
            ICSA Admin
          </span>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 pt-2 overflow-y-auto">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item flex items-center w-full px-3 py-3 -mx-3 mb-1 hover:bg-[#fafafa] rounded-xl transition-all duration-200"
        >
          <component 
            :is="item.icon" 
            :class="[
              'w-7 h-7 shrink-0',
              isActiveRoute(item.path) ? 'stroke-[2.5]' : 'stroke-2'
            ]" 
          />
          <span 
            :class="[
              'ml-4 text-base whitespace-nowrap overflow-hidden transition-all duration-200',
              isActiveRoute(item.path) ? 'font-semibold' : 'font-normal',
              sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            ]"
          >
            {{ item.name }}
          </span>
        </router-link>
      </nav>

      <!-- Profile -->
      <div class="border-t border-[#dbdbdb] px-3 py-4">
        <div class="relative">
          <button
            @click.stop="showProfileMenu = !showProfileMenu"
            class="flex items-center w-full px-3 py-3 -mx-3 hover:bg-[#fafafa] rounded-xl transition-all duration-200"
          >
            <div class="w-7 h-7 shrink-0 rounded-full bg-[#e0e0e0] flex items-center justify-center text-xs font-medium">
              {{ userInitials }}
            </div>
            <span 
              :class="[
                'ml-4 text-sm text-left whitespace-nowrap overflow-hidden transition-all duration-200',
                sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              ]"
            >
              {{ userName }}
            </span>
          </button>

          <!-- Profile Dropdown -->
          <div
            v-if="showProfileMenu"
            v-click-outside="() => showProfileMenu = false"
            class="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl shadow-[0_0_5px_1px_rgba(0,0,0,0.0975)] py-2 z-100"
          >
            <button
              @click="handleLogout"
              class="w-full px-4 py-2 text-sm text-left hover:bg-[#fafafa] transition-colors rounded-lg"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main 
      :class="[
        'flex-1 overflow-y-auto transition-all duration-200',
        sidebarExpanded ? 'ml-61' : 'ml-18'
      ]"
    >
      <!-- Top Bar -->
      <div class="sticky top-0 z-40 bg-white border-b border-[#dbdbdb]">
        <div class="h-15 px-6 flex items-center">
          <div class="flex-1">
            <h1 class="text-2xl font-light">{{ currentPageTitle }}</h1>
          </div>
          
          <!-- Search & Actions -->
          <div class="flex items-center gap-6">
            <div class="relative">
              <input
                type="text"
                placeholder="Search"
                class="w-67 h-9 pl-4 pr-10 text-sm bg-[#efefef] rounded-lg border-0 focus:outline-none focus:ring-0 placeholder:text-[#8e8e8e]"
              />
              <svg class="w-4 h-4 absolute right-3 top-2.5 text-[#8e8e8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button class="relative p-2 hover:bg-[#fafafa] rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-2 right-2 w-1.5 h-1.5 bg-[#ed4956] rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="max-w-233.75 mx-auto px-5 py-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const showProfileMenu = ref(false)
const sidebarExpanded = ref(false)

// Icons - keeping them simple and clean
const HomeIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])

const UsersIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
])

const CalendarIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
])

const MegaphoneIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' })
])

const ClipboardIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
])

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: HomeIcon },
  { name: 'Students', path: '/admin/students', icon: UsersIcon },
  { name: 'Events', path: '/admin/events', icon: CalendarIcon },
  { name: 'Announcements', path: '/admin/announcements', icon: MegaphoneIcon },
  { name: 'Attendance', path: '/admin/attendance', icon: ClipboardIcon }
]

const currentPageTitle = computed(() => {
  const item = navItems.find(item => item.path === route.path)
  return item ? item.name : 'Admin'
})

const userName = computed(() => {
  if (user.value) {
    return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.username
  }
  return 'Admin'
})

const userInitials = computed(() => {
  if (user.value && user.value.firstName && user.value.lastName) {
    return `${user.value.firstName[0]}${user.value.lastName[0]}`
  }
  return 'AD'
})

const isActiveRoute = (path) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

const handleLogout = () => {
  showProfileMenu.value = false
  authStore.logout()
  router.push('/login')
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
/* Sidebar width transitions */
.sidebar {
  width: 72px;
  transition: width 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.sidebar:hover {
  width: 244px;
}

/* Instagram-style scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #dbdbdb;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #c7c7c7;
}

/* Remove default focus styles, add custom */
input:focus {
  outline: none;
}
</style>
