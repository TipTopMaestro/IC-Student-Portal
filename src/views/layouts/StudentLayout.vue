<template>
  <div class="min-h-screen bg-white">
    <!-- Mobile Header -->
    <header class="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 safe-area-top">
      <div class="flex items-center justify-between h-14 px-4">
        <div class="flex items-center gap-1.5 cursor-pointer relative systems-trigger select-none" @click.stop="toggleSystemsMenu">
          <img src="/icsa_logo.png" alt="ICSA" class="h-6 w-6" />
          <span class="text-base font-semibold text-gray-900">ICSP</span>
          <svg 
            class="w-3.5 h-3.5 text-gray-500 transition-transform duration-200" 
            :class="{ 'rotate-180': showSystemsMenu }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>

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
              class="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] systems-dropdown"
              @click.stop
            >
              <div class="p-3 border-b border-gray-50">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">Campus Systems</p>
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
                        <svg v-if="sys.iconType === 'cms'" class="w-4 h-4" :class="sys.textColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <svg v-else-if="sys.iconType === 'voting'" class="w-4 h-4" :class="sys.textColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <svg v-else-if="sys.iconType === 'locker'" class="w-4 h-4" :class="sys.textColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
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
        <button @click="showMobileMenu = true" class="p-2 hover:bg-gray-100 rounded-lg ml-auto">
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
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span class="text-sm">Dashboard</span>
          </router-link>

          <router-link
            to="/attendance"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/attendance') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <path d="m9 14 2 2 4-4"/>
            </svg>
            <span class="text-sm">Attendance</span>
          </router-link>

          <router-link
            to="/fees"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/fees') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/>
              <line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
            <span class="text-sm">Fees</span>
          </router-link>

          <router-link
            to="/calendar"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/calendar') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
            </svg>
            <span class="text-sm">Calendar</span>
          </router-link>



          <router-link
            to="/posts"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/posts') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <span class="text-sm">Posts</span>
          </router-link>

          <router-link
            to="/profile"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/profile') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <div v-if="userProfilePic" class="h-5 w-5 rounded-full overflow-hidden shrink-0">
              <img :src="userProfilePic" alt="Profile" class="h-full w-full object-cover" />
            </div>
            <div v-else class="h-5 w-5 rounded-full bg-ic-primary flex items-center justify-center text-white text-xs font-medium shrink-0">
              {{ userInitials }}
            </div>
            <span class="text-sm">Profile</span>
          </router-link>

          <div class="my-4 border-t border-gray-200"></div>

          <router-link
            to="/settings"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <span class="text-sm">Settings</span>
          </router-link>

          <button
            @click="openReportProblem(); showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 w-full"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">Report a Problem</span>
          </button>

          <router-link
            to="/about"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 w-full"
            :class="{ 'bg-gray-50 font-medium text-ic-primary': isActive('/about') }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">About ICSP</span>
          </router-link>

          <div class="my-4 border-t border-gray-200"></div>

          <button 
            @click="handleLogout" 
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-red-500 w-full"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm">Log out</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex fixed left-0 top-0 h-screen w-18 hover:w-61 bg-white flex-col transition-all duration-300 ease-out z-50 group ">
      <!-- Logo with Dropdown Trigger -->
      <div 
        @click.stop="toggleSystemsMenu"
        class="flex items-center px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative systems-trigger select-none"
      >
        <div class="w-7 h-7 shrink-0 flex items-center justify-center">
          <img src="/icsa_logo.png" alt="ICSA" class="h-7 w-7" />
        </div>
        <div class="flex items-center justify-between flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4">
          <span class="text-xl font-semibold text-gray-900">ICSP</span>
          <svg 
            class="w-4 h-4 text-gray-500 transition-transform duration-200" 
            :class="{ 'rotate-180': showSystemsMenu }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
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
            class="absolute top-full left-6 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 systems-dropdown"
            @click.stop
          >
            <div class="p-3 border-b border-gray-50">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">Campus Systems</p>
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
                      <svg v-if="sys.iconType === 'cms'" class="w-4 h-4" :class="sys.textColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <svg v-else-if="sys.iconType === 'voting'" class="w-4 h-4" :class="sys.textColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      <svg v-else-if="sys.iconType === 'locker'" class="w-4 h-4" :class="sys.textColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
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
      <nav class="flex-1 px-3 py-2 flex flex-col justify-center space-y-1">
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
          to="/posts"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActive('/posts') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive('/posts') ? 2.5 : 2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Posts</span>
        </router-link>

        <router-link
          to="/profile"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActive('/profile') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <div v-if="userProfilePic" class="h-7 w-7 rounded-full overflow-hidden shrink-0" :class="{ 'ring-2 ring-black ring-offset-2': isActive('/profile') }">
              <img :src="userProfilePic" alt="Profile" class="h-full w-full object-cover" />
            </div>
            <div v-else class="h-7 w-7 rounded-full bg-ic-primary flex items-center justify-center text-white text-xs font-medium shrink-0" :class="{ 'ring-2 ring-black ring-offset-2': isActive('/profile') }">
              {{ userInitials }}
            </div>
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Profile</span>
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
            class="absolute bottom-full left-3 mb-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div class="py-2">
              <router-link to="/settings" @click="showMoreMenu = false" class="more-menu-item w-full text-left">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </router-link>

              <a :href="reportProblemUrl" @click="showMoreMenu = false" class="more-menu-item w-full">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Report a Problem</span>
              </a>

              <router-link to="/about" @click="showMoreMenu = false" class="more-menu-item w-full text-left">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>About ICSP</span>
              </router-link>
            </div>

            <div class="border-t border-gray-100">
              <button @click="handleLogout" class="more-menu-item w-full text-red-500 hover:!bg-red-50">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log out</span>
              </button>
            </div>
          </div>
        </Transition>

        <!-- More Button -->
        <button @click.stop="showMoreMenu = !showMoreMenu" class="sidebar-link w-full text-left" :class="{ 'bg-gray-50': showMoreMenu }">
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">More</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Bottom Navigation -->
    <div v-if="!showMobileMenu" class="md:hidden floating-mobile-nav select-none shadow-notch">
      <!-- Background Curved Notch SVG -->
      <svg class="absolute inset-0 w-full h-[80px] z-0" viewBox="0 0 400 80" preserveAspectRatio="none">
        <path :d="svgPath" fill="white" stroke="#cbd5e1" stroke-width="1.2" class="path-morph" />
        <!-- Floating Active Indicator Dot -->
        <circle 
          v-if="activeIndex !== -1"
          :cx="activeX" 
          cy="20" 
          r="4.5" 
          class="fill-ic-primary circle-slide"
        />
      </svg>

      <!-- Navigation Icons Layer -->
      <div class="relative flex items-center justify-around h-[56px] mt-[24px] z-10">
        <!-- Dashboard Link -->
        <router-link 
          to="/" 
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group"
        >
          <svg 
            class="w-5.5 h-5.5 transition-all duration-300 transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            :stroke-width="isActive('/') ? 2.2 : 1.8"
            :class="isActive('/') ? 'scale-110 text-ic-primary' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90'"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </router-link>

        <!-- Attendance Link -->
        <router-link 
          to="/attendance" 
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group"
        >
          <svg 
            class="w-5.5 h-5.5 transition-all duration-300 transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            :stroke-width="isActive('/attendance') ? 2.2 : 1.8"
            :class="isActive('/attendance') ? 'scale-110 text-ic-primary' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90'"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </router-link>

        <!-- Fees Link -->
        <router-link 
          to="/fees" 
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group"
        >
          <svg 
            class="w-5.5 h-5.5 transition-all duration-300 transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            :stroke-width="isActive('/fees') ? 2.2 : 1.8"
            :class="isActive('/fees') ? 'scale-110 text-ic-primary' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90'"
          >
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
        </router-link>

        <!-- Posts Link -->
        <router-link 
          to="/posts" 
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group"
        >
          <svg 
            class="w-5.5 h-5.5 transition-all duration-300 transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            :stroke-width="isActive('/posts') ? 2.2 : 1.8"
            :class="isActive('/posts') ? 'scale-110 text-ic-primary' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90'"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </router-link>

        <!-- Profile Link -->
        <router-link 
          to="/profile" 
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group"
        >
          <div v-if="userProfilePic"
            class="h-6 w-6 rounded-full overflow-hidden shrink-0 transition-all duration-300 transform"
            :class="isActive('/profile') ? 'ring-2 ring-ic-primary ring-offset-2 scale-110' : 'scale-100 group-active:scale-90'"
          >
            <img :src="userProfilePic" alt="Profile" class="h-full w-full object-cover" />
          </div>
          <div v-else
            class="h-6 w-6 rounded-full bg-ic-primary flex items-center justify-center text-white text-[10px] font-medium shrink-0 transition-all duration-300 transform"
            :class="isActive('/profile') ? 'ring-2 ring-ic-primary ring-offset-2 scale-110' : 'scale-100 group-active:scale-90'"
          >
            {{ userInitials }}
          </div>
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <main class="md:ml-18 pt-14 pb-20 md:pt-0 md:pb-0">
      <div class="max-w-233.75 mx-auto px-4 py-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'
import { safeRedirectWithSSO } from '@/utils/navigation'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
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
    name: 'Voting System',
    desc: 'Student elections & polls',
    url: import.meta.env.VITE_VOTING_URL || 'http://localhost:5175',
    bg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    iconType: 'voting',
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

const handleSystemRedirect = async (sys) => {
  if (isRedirectingSystemId.value) return
  isRedirectingSystemId.value = sys.id
  try {
    await safeRedirectWithSSO(sys, () => authService.issueTransferToken(sys.intendedFor))
  } catch (error) {
    console.error('Error during SSO redirect:', error)
  } finally {
    isRedirectingSystemId.value = null
    showSystemsMenu.value = false
  }
}

const activeIndex = computed(() => {
  if (route.path === '/') return 0
  if (route.path.startsWith('/attendance')) return 1
  if (route.path.startsWith('/fees')) return 2
  if (route.path.startsWith('/posts')) return 3
  if (route.path.startsWith('/profile')) return 4
  return -1
})

const activeX = computed(() => {
  if (activeIndex.value === -1) return 200
  return 40 + activeIndex.value * 80
})

const svgPath = computed(() => {
  const x = activeX.value
  const dip = activeIndex.value === -1 ? 24 : 32
  const w = activeIndex.value === -1 ? 28 : 22
  const c = activeIndex.value === -1 ? 14 : 12
  const cp = activeIndex.value === -1 ? 10 : 8
  return `M 16 24 L ${x - w} 24 C ${x - c} 24, ${x - cp} ${dip}, ${x} ${dip} C ${x + cp} ${dip}, ${x + c} 24, ${x + w} 24 L 384 24 A 12 12 0 0 1 396 36 L 396 68 A 12 12 0 0 1 384 80 L 16 80 A 12 12 0 0 1 4 68 L 4 36 A 12 12 0 0 1 16 24 Z`
})

const reportProblemUrl = computed(() => {
  const email = 'icsp-support@dnsc.edu.ph'
  const subject = encodeURIComponent('ICSP - Report a Problem')
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
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

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

const userProfilePic = computed(() => {
  return authStore.user?.user_avatar || '/default_profile.png'
})

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
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

.more-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.15s ease;
  cursor: pointer;
  text-decoration: none;
}

.more-menu-item:hover {
  background-color: #f9fafb;
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
  height: 80px;
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
