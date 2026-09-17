<template>
  <div class="min-h-screen bg-white">
    <!-- Mobile Header -->
    <header class="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 safe-area-top">
      <div class="flex items-center justify-between h-14 px-4">
        <div class="flex items-center gap-1.5 cursor-pointer relative systems-trigger select-none" @click.stop="toggleSystemsMenu">
          <img src="/icsa_logo.png" alt="ICSA" class="h-6 w-6" />
          <span class="font-pixel text-lg text-ic-primary tracking-tight">ICAP</span>
          <ChevronDown 
            class="w-3.5 h-3.5 text-gray-500 transition-transform duration-200" 
            :class="{ 'rotate-180': showSystemsMenu }"
            :stroke-width="2"
          />

          <!-- Mobile Systems Dropdown Popover -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-2"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-2"
          >
            <div
              v-if="showSystemsMenu"
              class="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl shadow-[0_16px_36px_-12px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden z-[100] systems-dropdown"
              @click.stop
            >
              <div class="p-3 border-b border-gray-100">
                <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider text-left">Campus Systems</p>
              </div>
              <div class="py-1">
                <button 
                  v-for="sys in externalSystems" 
                  :key="sys.id" 
                  @click="handleSystemRedirect(sys)" 
                  class="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div class="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" :class="sys.bg">
                    <span v-if="isRedirectingSystemId === sys.id" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" :class="sys.textColor"></span>
                    <template v-else>
                      <img v-if="sys.imageUrl" :src="sys.imageUrl" :alt="sys.name" class="h-6 w-6 object-contain" />
                      <template v-else>
                        <CreditCard v-if="sys.iconType === 'cms'" class="w-4 h-4" :class="sys.textColor" :stroke-width="2" />
                        <Vote v-else-if="sys.iconType === 'voting'" class="w-4 h-4" :class="sys.textColor" :stroke-width="2" />
                        <KeyRound v-else-if="sys.iconType === 'locker'" class="w-4 h-4" :class="sys.textColor" :stroke-width="2" />
                      </template>
                    </template>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-gray-900 truncate">{{ sys.name }}</p>
                    <p class="text-[9px] text-gray-500 truncate mt-0.5">{{ sys.desc }}</p>
                  </div>
                </button>
              </div>
            </div>
          </Transition>
        </div>
        <button @click="showMobileMenu = true" class="p-2 hover:bg-gray-100 rounded-lg ml-auto text-gray-700 transition-colors">
          <Menu class="w-5 h-5" :stroke-width="2" />
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
          <span class="font-pixel text-base text-gray-900 tracking-tight lowercase">menu</span>
          <button @click="showMobileMenu = false" class="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors">
            <X class="w-5 h-5" :stroke-width="2" />
          </button>
        </div>

        <!-- Menu Items -->
        <nav class="p-4 space-y-1 overflow-y-auto" style="max-height: calc(100vh - 56px);">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActiveRoute(item.path) ? 'font-semibold text-ic-primary' : 'text-gray-700 font-medium'"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5"
              :stroke-width="isActiveRoute(item.path) ? 2.4 : 1.9"
              :class="isActiveRoute(item.path) ? [item.activeIconClass || 'fill-current text-ic-primary'] : 'fill-none text-gray-500'"
            />
            <span class="text-sm">{{ item.name }}</span>
          </router-link>

          <router-link
            to="/admin/profile"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActiveRoute('/admin/profile') ? 'font-semibold text-ic-primary' : 'text-gray-700 font-medium'"
          >
            <div class="h-5 w-5 rounded-full overflow-hidden shrink-0" :class="isActiveRoute('/admin/profile') ? 'ring-2 ring-ic-primary ring-offset-1' : ''">
              <img :src="userProfilePicture" alt="Profile" class="w-full h-full object-cover" @error="$event.target.src = '/default_profile.png'" />
            </div>
            <span class="text-sm">Profile</span>
          </router-link>

          <div class="my-4 border-t border-gray-200"></div>

          <router-link
            to="/admin/settings"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium w-full"
            :class="{ 'font-semibold text-ic-primary': isActiveRoute('/admin/settings') }"
          >
            <Settings class="w-5 h-5 text-gray-500" :stroke-width="1.9" />
            <span class="text-sm">Settings</span>
          </router-link>

          <button
            @click="openReportProblem(); showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium w-full"
          >
            <LifeBuoy class="w-5 h-5 text-gray-500" :stroke-width="1.9" />
            <span class="text-sm">Report a Problem</span>
          </button>

          <router-link
            to="/admin/about"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium w-full"
            :class="{ 'font-semibold text-ic-primary': isActiveRoute('/admin/about') }"
          >
            <Info class="w-5 h-5 text-gray-500" :stroke-width="1.9" />
            <span class="text-sm">About ICSP</span>
          </router-link>

          <a
            href="https://carbajosafroyd.github.io/IC-Student-Portal-Docs/"
            target="_blank"
            rel="noopener noreferrer"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium w-full"
          >
            <BookOpen class="w-5 h-5 text-gray-500" :stroke-width="1.9" />
            <span class="text-sm">Documentation</span>
            <ExternalLink class="w-4 h-4 text-gray-400 ml-auto" :stroke-width="2" />
          </a>

          <div class="my-4 border-t border-gray-200"></div>

          <button 
            @click="handleLogout" 
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50/70 transition-colors text-red-500 font-medium w-full"
          >
            <LogOut class="w-5 h-5" :stroke-width="1.9" />
            <span class="text-sm">Log out</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex fixed left-0 top-0 h-screen w-18 hover:w-61 bg-white flex-col transition-all duration-300 ease-out z-50 group">
      <!-- Logo with Dropdown Trigger -->
      <div 
        @click.stop="toggleSystemsMenu"
        class="flex items-center px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative systems-trigger select-none"
      >
        <div class="w-7 h-7 shrink-0 flex items-center justify-center">
          <img src="/icsa_logo.png" alt="ICSA" class="h-7 w-7" />
        </div>
        <div class="flex items-center justify-between flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4">
          <span class="font-pixel text-xl text-ic-primary tracking-tight">ICAP</span>
          <ChevronDown 
            class="w-4 h-4 text-gray-400 transition-transform duration-200" 
            :class="{ 'rotate-180': showSystemsMenu }"
            :stroke-width="2"
          />
        </div>

        <!-- Desktop Systems Dropdown Popover -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0 -translate-y-2"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-y-0"
          leave-to-class="transform scale-95 opacity-0 -translate-y-2"
        >
          <div
            v-if="showSystemsMenu"
            class="absolute top-full left-6 mt-1 w-64 bg-white rounded-2xl shadow-[0_16px_36px_-12px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden z-50 systems-dropdown"
            @click.stop
          >
            <div class="p-3 border-b border-gray-100">
              <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider text-left">Campus Systems</p>
            </div>
            <div class="py-1">
              <button 
                v-for="sys in externalSystems" 
                :key="sys.id" 
                @click="handleSystemRedirect(sys)" 
                class="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div class="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" :class="sys.bg">
                  <span v-if="isRedirectingSystemId === sys.id" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" :class="sys.textColor"></span>
                  <template v-else>
                    <img v-if="sys.imageUrl" :src="sys.imageUrl" :alt="sys.name" class="h-6 w-6 object-contain" />
                    <template v-else>
                      <CreditCard v-if="sys.iconType === 'cms'" class="w-4 h-4" :class="sys.textColor" :stroke-width="2" />
                      <Vote v-else-if="sys.iconType === 'voting'" class="w-4 h-4" :class="sys.textColor" :stroke-width="2" />
                      <KeyRound v-else-if="sys.iconType === 'locker'" class="w-4 h-4" :class="sys.textColor" :stroke-width="2" />
                    </template>
                  </template>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-gray-900 truncate">{{ sys.name }}</p>
                  <p class="text-[10px] text-gray-500 truncate mt-0.5">{{ sys.desc }}</p>
                </div>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-2 flex flex-col justify-center space-y-1.5">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="sidebar-link group/link"
          :class="{ 'sidebar-link-active': isActiveRoute(item.path) }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <component 
              :is="item.icon" 
              class="w-[22px] h-[22px] transition-all duration-200" 
              :stroke-width="isActiveRoute(item.path) ? 2.4 : 1.9"
              :class="isActiveRoute(item.path) ? [item.activeIconClass || 'fill-current text-gray-900'] : 'fill-none text-gray-500 group-hover/link:text-gray-900'"
            />
          </div>
          <span class="sidebar-label">{{ item.name }}</span>
        </router-link>

        <router-link
          to="/admin/profile"
          class="sidebar-link group/link"
          :class="{ 'sidebar-link-active': isActiveRoute('/admin/profile') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <div 
              class="h-7 w-7 rounded-full overflow-hidden shrink-0 transition-all duration-200" 
              :class="isActiveRoute('/admin/profile') ? 'ring-2 ring-gray-900 ring-offset-2 scale-105' : 'ring-1 ring-gray-200'"
            >
              <img 
                :src="userProfilePicture" 
                alt="Profile" 
                class="w-full h-full object-cover" 
                @error="$event.target.src = '/default_profile.png'" 
              />
            </div>
          </div>
          <span class="sidebar-label">Profile</span>
        </router-link>
      </nav>

      <!-- More Menu -->
      <div class="px-3 pb-6 relative" ref="moreMenuContainer">
        <!-- More Popover -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0 translate-y-2"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-y-0"
          leave-to-class="transform scale-95 opacity-0 translate-y-2"
        >
          <div
            v-if="showMoreMenu"
            class="absolute bottom-full left-3 mb-2 w-58 bg-white rounded-2xl shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12)] border border-gray-200/90 overflow-hidden z-50 p-1.5 space-y-0.5"
          >
            <div class="space-y-0.5">
              <router-link to="/admin/settings" @click="showMoreMenu = false" class="more-menu-item">
                <Settings class="w-4.5 h-4.5 text-gray-500 shrink-0" :stroke-width="1.9" />
                <span class="text-xs font-medium text-gray-700">Settings</span>
              </router-link>

              <a :href="reportProblemUrl" @click="showMoreMenu = false" class="more-menu-item">
                <LifeBuoy class="w-4.5 h-4.5 text-gray-500 shrink-0" :stroke-width="1.9" />
                <span class="text-xs font-medium text-gray-700">Report a Problem</span>
              </a>

              <router-link to="/admin/about" @click="showMoreMenu = false" class="more-menu-item">
                <Info class="w-4.5 h-4.5 text-gray-500 shrink-0" :stroke-width="1.9" />
                <span class="text-xs font-medium text-gray-700">About ICSP</span>
              </router-link>

              <a
                href="https://carbajosafroyd.github.io/IC-Student-Portal-Docs/"
                target="_blank"
                rel="noopener noreferrer"
                @click="showMoreMenu = false"
                class="more-menu-item"
              >
                <BookOpen class="w-4.5 h-4.5 text-gray-500 shrink-0" :stroke-width="1.9" />
                <span class="text-xs font-medium text-gray-700">Documentation</span>
                <ExternalLink class="w-3.5 h-3.5 text-gray-400 ml-auto shrink-0" :stroke-width="2" />
              </a>
            </div>

            <div class="border-t border-gray-100 pt-1 mt-1">
              <button @click="handleLogout" class="more-menu-item text-rose-600 hover:bg-rose-50/80 hover:text-rose-700 w-full">
                <LogOut class="w-4.5 h-4.5 shrink-0 text-rose-500" :stroke-width="1.9" />
                <span class="text-xs font-medium">Log out</span>
              </button>
            </div>
          </div>
        </Transition>

        <!-- More Button -->
        <button 
          @click.stop="showMoreMenu = !showMoreMenu" 
          class="sidebar-link w-full text-left group/link" 
          :class="{ 'sidebar-link-active': showMoreMenu }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <Ellipsis 
              class="w-[22px] h-[22px] transition-all duration-200" 
              :stroke-width="showMoreMenu ? 2.4 : 2" 
              :class="showMoreMenu ? 'fill-current text-gray-900' : 'text-gray-500 group-hover/link:text-gray-900 fill-current'" 
            />
          </div>
          <span class="sidebar-label">More</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Bottom Navigation -->
    <div v-if="!showMobileMenu" ref="floatingNavRef" class="md:hidden floating-mobile-nav select-none shadow-notch">
      <!-- Background Curved Notch SVG -->
      <svg class="absolute inset-0 w-full h-24 z-0" :viewBox="'0 0 ' + containerWidth + ' 96'" preserveAspectRatio="none">
        <path :d="svgPath" fill="white" stroke="#cbd5e1" stroke-width="1.2" />
      </svg>

      <!-- Navigation Icons Layer -->
      <div class="relative flex items-center justify-around h-14 mt-8 z-10">
        <!-- Dashboard Link -->
        <router-link
          to="/admin"
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 group"
        >
          <LayoutDashboard 
            class="w-5.5 h-5.5 transition-all duration-300 transform"
            :stroke-width="isActiveRoute('/admin') ? 2.4 : 1.8"
            :class="isActiveRoute('/admin') ? 'scale-110 text-ic-primary fill-current' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90 fill-none'"
          />
          <span 
            class="absolute bottom-1.5 w-4 h-0.75 bg-ic-primary rounded-full transition-all duration-300 transform"
            :class="isActiveRoute('/admin') ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'"
          ></span>
        </router-link>

        <!-- Students Link -->
        <router-link
          to="/admin/students"
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 group"
        >
          <Users 
            class="w-5.5 h-5.5 transition-all duration-300 transform"
            :stroke-width="isActiveRoute('/admin/students') ? 2.4 : 1.8"
            :class="isActiveRoute('/admin/students') ? 'scale-110 text-ic-primary fill-current' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90 fill-none'"
          />
          <span 
            class="absolute bottom-1.5 w-4 h-0.75 bg-ic-primary rounded-full transition-all duration-300 transform"
            :class="isActiveRoute('/admin/students') ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'"
          ></span>
        </router-link>

        <!-- Center Plus Button (Sleek Solid & Floating) -->
        <div class="relative flex-1 flex items-center justify-center h-full">
          <button 
            @click="handlePlusClick"
            class="absolute -top-6 w-13 h-13 bg-ic-primary text-white rounded-full flex items-center justify-center shadow-md shadow-ic-primary/30 hover:shadow-lg hover:shadow-ic-primary/40 transition-all duration-200 active:scale-95 hover:-translate-y-0.5 z-20"
            title="Create Post"
          >
            <Plus class="w-6 h-6" :stroke-width="2.5" />
          </button>
        </div>

        <!-- Events Link -->
        <router-link
          to="/admin/events"
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 group"
        >
          <Calendar 
            class="w-5.5 h-5.5 transition-all duration-300 transform"
            :stroke-width="isActiveRoute('/admin/events') ? 2.4 : 1.8"
            :class="isActiveRoute('/admin/events') ? 'scale-110 text-ic-primary nav-icon-active-cal' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90 fill-none'"
          />
          <span 
            class="absolute bottom-1.5 w-4 h-0.75 bg-ic-primary rounded-full transition-all duration-300 transform"
            :class="isActiveRoute('/admin/events') ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'"
          ></span>
        </router-link>

        <!-- Posts Link -->
        <router-link
          to="/admin/posts"
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 group"
        >
          <Newspaper 
            class="w-5.5 h-5.5 transition-all duration-300 transform"
            :stroke-width="isActiveRoute('/admin/posts') ? 2.4 : 1.8"
            :class="isActiveRoute('/admin/posts') ? 'scale-110 text-ic-primary nav-icon-active-news' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90 fill-none'"
          />
          <span 
            class="absolute bottom-1.5 w-4 h-0.75 bg-ic-primary rounded-full transition-all duration-300 transform"
            :class="isActiveRoute('/admin/posts') ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'"
          ></span>
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <main class="md:ml-18 pt-14 pb-20 md:pt-0 md:pb-0">
      <div class="max-w-233.75 mx-auto px-4 py-6 animate-fade-in-up">
        <RouterView />
      </div>
    </main>

    <!-- Global Background Post Publishing Status Widget -->
    <PublishProgressWidget />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'
import { performSSORedirect } from '@/utils/sso'
import PublishProgressWidget from '@/components/posts/PublishProgressWidget.vue'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Newspaper, 
  ClipboardCheck, 
  Ellipsis, 
  Settings, 
  LifeBuoy, 
  Info, 
  BookOpen, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X, 
  ExternalLink, 
  Plus, 
  Vote, 
  KeyRound, 
  CreditCard 
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const showMobileMenu = ref(false)
const showMoreMenu = ref(false)
const moreMenuContainer = ref(null)
const showSystemsMenu = ref(false)
const isRedirectingSystemId = ref(null)

const externalSystems = [
  {
    id: 'cms',
    name: 'ICCMS',
    desc: 'IC Collection Management Systems',
    url: import.meta.env.VITE_CMS_URL || 'http://localhost:5174',
    bg: 'bg-purple-50',
    textColor: 'text-purple-600',
    imageUrl: '/icsa_logo.png',
    intendedFor: 'collection-management-system'
  },
  {
    id: 'voting',
    name: 'ICVS',
    desc: 'IC Voting System',
    url: import.meta.env.VITE_VOTING_URL || 'http://localhost:5175',
    bg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    imageUrl: '/voting-logo.png',
    intendedFor: 'voting-system'
  },
  {
    id: 'locker',
    name: 'LRMS',
    desc: 'Locker Rental Management System',
    url: import.meta.env.VITE_LOCKER_URL || 'http://localhost:5176',
    bg: 'bg-blue-50',
    textColor: 'text-blue-600',
    imageUrl: '/lrms-logo.jpg',
    intendedFor: 'locker-system'
  }
]

const toggleSystemsMenu = () => {
  showSystemsMenu.value = !showSystemsMenu.value
}

const handleSystemRedirect = (sys) => {
  // Resolve route dynamically to respect the router base path (e.g. subpath deployments)
  const resolved = router.resolve({ name: 'sso-redirect', query: { sys: sys.id } })
  window.open(resolved.href, '_blank', 'noopener,noreferrer')
  showSystemsMenu.value = false
}

const floatingNavRef = ref(null)
const containerWidth = ref(375) // default mobile width fallback

const updateWidth = () => {
  if (floatingNavRef.value) {
    containerWidth.value = floatingNavRef.value.clientWidth
  }
}

const svgPath = computed(() => {
  const W = containerWidth.value
  const cx = W / 2
  const top = 28
  const bottom = 96
  const w = 65
  const c = 25
  const cp = 26
  const y_dip = 64
  return `M 20 ${top} L ${cx - w} ${top} C ${cx - c} ${top}, ${cx - cp} ${y_dip}, ${cx} ${y_dip} C ${cx + cp} ${y_dip}, ${cx + c} ${top}, ${cx + w} ${top} L ${W - 20} ${top} A 16 16 0 0 1 ${W - 4} ${top + 16} L ${W - 4} ${bottom - 16} A 16 16 0 0 1 ${W - 20} ${bottom} L 20 ${bottom} A 16 16 0 0 1 4 ${bottom - 16} L 4 ${top + 16} A 16 16 0 0 1 20 ${top} Z`
})

const handlePlusClick = async () => {
  if (route.path !== '/admin/posts') {
    await router.push({ path: '/admin/posts', query: { create: 'true' } })
  } else {
    window.dispatchEvent(new CustomEvent('open-create-post'))
  }
}

const reportProblemUrl = computed(() => {
  const email = 'icsp-support@dnsc.edu.ph'
  const subject = encodeURIComponent('ICSP Admin - Report a Problem')
  const body = encodeURIComponent(`Hi ICSP Support,\n\nI'd like to report the following issue:\n\n[Describe your problem here]\n\nBrowser: ${navigator.userAgent}\nPage: ${window.location.href}\n\nThank you.`)
  return `mailto:${email}?subject=${subject}&body=${body}`
})

const openReportProblem = () => {
  window.location.href = reportProblemUrl.value
}

const handleNavigate = (path) => {
  showMoreMenu.value = false
  showMobileMenu.value = false
  router.push(path)
}

// Close more menu when clicking outside
const handleClickOutside = (event) => {
  if (moreMenuContainer.value && !moreMenuContainer.value.contains(event.target)) {
    showMoreMenu.value = false
  }
  
  const isSystemsClick = event.target.closest('.systems-trigger') || event.target.closest('.systems-dropdown')
  if (!isSystemsClick) {
    showSystemsMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  updateWidth()
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updateWidth)
})

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, activeIconClass: 'fill-current text-gray-900' },
  { name: 'Students', path: '/admin/students', icon: Users, activeIconClass: 'fill-current text-gray-900' },
  { name: 'Events', path: '/admin/events', icon: Calendar, activeIconClass: 'nav-icon-active-cal text-gray-900' },
  { name: 'Posts', path: '/admin/posts', icon: Newspaper, activeIconClass: 'nav-icon-active-news text-gray-900' },
  { name: 'Attendance', path: '/admin/attendance', icon: ClipboardCheck, activeIconClass: 'nav-icon-active-clipboard text-gray-900' }
]

const userName = computed(() => {
  if (user.value) {
    return `${user.value.first_name || user.value.firstName || ''} ${user.value.last_name || user.value.lastName || ''}`.trim() || user.value.username
  }
  return 'Admin'
})

const userInitials = computed(() => {
  if (!user.value) return 'AD'
  
  // Try student nested object first (backend format)
  if (user.value.student?.s_fname && user.value.student?.s_lname) {
    return `${user.value.student.s_fname.charAt(0)}${user.value.student.s_lname.charAt(0)}`.toUpperCase()
  }
  
  // Try full_name
  if (user.value.full_name) {
    const names = user.value.full_name.trim().split(' ').filter(n => n.length > 0)
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
  
  // Fallback to first_name/last_name or firstName/lastName
  const firstName = user.value.first_name || user.value.firstName || ''
  const lastName = user.value.last_name || user.value.lastName || ''
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  
  return 'AD'
})

// Get user's profile picture
const userProfilePicture = computed(() => {
  return authStore.user?.user_avatar || '/default_profile.png'
})

const isActiveRoute = (path) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  showMobileMenu.value = false
  showMoreMenu.value = false
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.625rem 0.75rem;
  border-radius: 0.875rem;
  color: #4b5563;
  font-family: var(--font-sans, "Geist", system-ui, sans-serif);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  user-select: none;
}

.sidebar-link:hover {
  background-color: #f9fafb;
  color: #111827;
}

.sidebar-link:focus {
  outline: none;
}

.sidebar-link-active {
  color: #111827;
  font-weight: 600;
}

.sidebar-label {
  margin-left: 0.875rem;
  font-size: 0.875rem;
  font-weight: inherit;
  letter-spacing: -0.01em;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.group:hover .sidebar-label {
  opacity: 1;
}

/* Lucide Icon Active Solid States */
.nav-icon-active-cal {
  fill: currentColor;
}
.nav-icon-active-cal :deep(path:nth-of-type(3)),
.nav-icon-active-cal path:nth-of-type(3) {
  stroke: #ffffff;
}

.nav-icon-active-news {
  fill: currentColor;
}
.nav-icon-active-news :deep(path:nth-of-type(1)),
.nav-icon-active-news :deep(path:nth-of-type(2)),
.nav-icon-active-news path:nth-of-type(1),
.nav-icon-active-news path:nth-of-type(2) {
  stroke: #ffffff;
}
.nav-icon-active-news :deep(rect),
.nav-icon-active-news rect {
  fill: #ffffff;
  stroke: #ffffff;
}

.nav-icon-active-clipboard {
  fill: currentColor;
}
.nav-icon-active-clipboard :deep(path:nth-of-type(2)),
.nav-icon-active-clipboard path:nth-of-type(2) {
  stroke: #ffffff;
}

.more-menu-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-sans, "Geist", system-ui, sans-serif);
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  border-radius: 0.625rem;
  transition: all 0.15s ease;
  cursor: pointer;
  text-decoration: none;
}

.more-menu-item:hover {
  background-color: #f9fafb;
  color: #111827;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.floating-mobile-nav {
  position: fixed;
  bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 2rem);
  max-width: 28rem; /* 448px */
  z-index: 50;
  height: 96px;
}

.path-morph {
  transition: d 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.circle-slide {
  transition: cx 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.shadow-notch {
  filter: drop-shadow(0 -3px 8px rgba(0, 0, 0, 0.05)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08));
}
</style>
