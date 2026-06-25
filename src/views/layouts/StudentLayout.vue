<template>
  <div class="min-h-screen bg-white">
    <!-- Mobile Header -->
    <header class="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 safe-area-top">
      <div class="flex items-center justify-between h-14 px-4">
        <div class="flex items-center gap-2">
          <img src="/icsa_logo.png" alt="ICSA" class="h-6 w-6" />
          <span class="text-base font-semibold text-gray-900">ICSP</span>
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
            to="/posts"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/posts') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
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
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
      <!-- Logo -->
      <div class="flex items-center px-6 py-3">
        <div class="w-7 h-7 shrink-0 flex items-center justify-center">
          <img src="/icsa_logo.png" alt="ICSA" class="h-7 w-7" />
        </div>
        <span class="ml-4 text-xl font-semibold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">ICSP</span>
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
          <div v-if="userProfilePic"
            class="h-6 w-6 rounded-full overflow-hidden shrink-0 transition-all"
            :class="isActive('/profile') ? 'ring-2 ring-ic-primary ring-offset-2' : ''"
          >
            <img :src="userProfilePic" alt="Profile" class="h-full w-full object-cover" />
          </div>
          <div v-else
            class="h-6 w-6 rounded-full bg-ic-primary flex items-center justify-center text-white text-xs font-medium shrink-0 transition-all"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const showMobileMenu = ref(false)
const showMoreMenu = ref(false)
const moreMenuContainer = ref(null)

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
</style>
