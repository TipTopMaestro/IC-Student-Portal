<template>
  <div class="min-h-screen bg-white">
    <!-- Mobile Header -->
    <header class="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 safe-area-top">
      <div class="flex items-center justify-between h-14 px-4">
        <div class="flex items-center gap-1.5 cursor-pointer relative systems-trigger select-none" @click.stop="toggleSystemsMenu">
          <img src="/icsa_logo.png" alt="ICSA" class="h-6 w-6" />
          <span class="text-base font-semibold text-gray-900">ICAP</span>
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
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActiveRoute(item.path) ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5"
            />
            <span class="text-sm">{{ item.name }}</span>
          </router-link>

          <router-link
            to="/admin/profile"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActiveRoute('/admin/profile') ? 'bg-gray-50 font-medium text-ic-primary' : 'text-gray-700'"
          >
            <div v-if="userProfilePicture" class="h-5 w-5 rounded-full overflow-hidden">
              <img :src="userProfilePicture" alt="Profile" class="w-full h-full object-cover" />
            </div>
            <div v-else class="h-5 w-5 rounded-full bg-ic-primary flex items-center justify-center text-white text-xs font-medium">
              {{ userInitials }}
            </div>
            <span class="text-sm">Profile</span>
          </router-link>

          <div class="my-4 border-t border-gray-200"></div>

          <router-link
            to="/admin/settings"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 w-full"
            :class="{ 'bg-gray-50 font-medium text-ic-primary': isActiveRoute('/admin/settings') }"
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
            to="/admin/about"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 w-full"
            :class="{ 'bg-gray-50 font-medium text-ic-primary': isActiveRoute('/admin/about') }"
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
          <span class="text-xl font-semibold text-gray-900">ICAP</span>
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
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActiveRoute(item.path) }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <component 
              :is="item.icon" 
              class="w-7 h-7"
              :stroke-width="isActiveRoute(item.path) ? 2.5 : 2"
            />
          </div>
          <span class="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">{{ item.name }}</span>
        </router-link>

        <router-link
          to="/admin/profile"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActiveRoute('/admin/profile') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <div v-if="userProfilePicture" class="h-7 w-7 rounded-full overflow-hidden" :class="{ 'ring-2 ring-black ring-offset-2': isActiveRoute('/admin/profile') }">
              <img :src="userProfilePicture" alt="Profile" class="w-full h-full object-cover" />
            </div>
            <div v-else class="h-7 w-7 rounded-full bg-ic-primary flex items-center justify-center text-white text-xs font-medium" :class="{ 'ring-2 ring-black ring-offset-2': isActiveRoute('/admin/profile') }">
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
              <router-link to="/admin/settings" @click="showMoreMenu = false" class="more-menu-item w-full text-left">
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

              <router-link to="/admin/about" @click="showMoreMenu = false" class="more-menu-item w-full text-left">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>About ICSP</span>
              </router-link>
            </div>

            <div class="border-t border-gray-100">
              <button @click="handleLogout" class="more-menu-item w-full text-red-500 hover:bg-red-50!">
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
          <component 
            :is="HomeIcon" 
            class="w-5.5 h-5.5 transition-all duration-300 transform"
            :stroke-width="isActiveRoute('/admin') ? 2.2 : 1.8"
            :class="isActiveRoute('/admin') ? 'scale-110 text-ic-primary' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90'"
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
          <component 
            :is="UsersIcon" 
            class="w-5.5 h-5.5 transition-all duration-300 transform"
            :stroke-width="isActiveRoute('/admin/students') ? 2.2 : 1.8"
            :class="isActiveRoute('/admin/students') ? 'scale-110 text-ic-primary' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90'"
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
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <!-- Events Link -->
        <router-link
          to="/admin/events"
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 group"
        >
          <component 
            :is="CalendarIcon" 
            class="w-5.5 h-5.5 transition-all duration-300 transform"
            :stroke-width="isActiveRoute('/admin/events') ? 2.2 : 1.8"
            :class="isActiveRoute('/admin/events') ? 'scale-110 text-ic-primary' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90'"
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
          <component 
            :is="PostsIcon" 
            class="w-5.5 h-5.5 transition-all duration-300 transform"
            :stroke-width="isActiveRoute('/admin/posts') ? 2.2 : 1.8"
            :class="isActiveRoute('/admin/posts') ? 'scale-110 text-ic-primary' : 'text-gray-400 group-hover:text-gray-600 group-active:scale-90'"
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
      <div class="max-w-233.75 mx-auto px-4 py-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'

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
    name: 'Collection Management',
    desc: 'Fees & payment submissions',
    url: import.meta.env.VITE_CMS_URL || 'http://localhost:5174',
    bg: 'bg-purple-50',
    textColor: 'text-purple-600',
    iconType: 'cms',
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
    name: 'Locker System',
    desc: 'Locker reservations',
    url: import.meta.env.VITE_LOCKER_URL || 'http://localhost:5176',
    bg: 'bg-blue-50',
    textColor: 'text-blue-600',
    iconType: 'locker',
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
    const result = await authService.issueTransferToken(sys.intendedFor)
    const data = result.data || result
    const transferToken = data.transfer_token
    if (transferToken) {
      const url = new URL(sys.url)
      // Provide multiple query parameter formats to support all potential target system configurations
      url.searchParams.set('token', transferToken)
      url.searchParams.set('token_url', transferToken)
      url.searchParams.set('sso_token', transferToken)
      url.searchParams.set('redeem_url', 'https://dnsc-systems-api.onrender.com/api/v1/transfer_token/redeem/')
      window.open(url.toString(), '_blank', 'noopener,noreferrer')
    } else {
      console.error('Failed to retrieve transfer token: missing transfer_token', result)
      window.open(sys.url, '_blank', 'noopener,noreferrer')
    }
  } catch (error) {
    console.error('Error during SSO redirect:', error)
    window.open(sys.url, '_blank', 'noopener,noreferrer')
  } finally {
    isRedirectingSystemId.value = null
    showSystemsMenu.value = false
  }
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
    await router.push('/admin/posts')
  }
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('open-create-post'))
  }, 100)
}

const reportProblemUrl = computed(() => {
  const email = 'icsp-support@dnsc.edu.ph'
  const subject = encodeURIComponent('ICSP Admin - Report a Problem')
  const body = encodeURIComponent(`Hi ICSP Support,\n\nI'd like to report the following issue:\n\n[Describe your problem here]\n\nBrowser: ${navigator.userAgent}\nPage: ${window.location.href}\n\nThank you.`)
  return `mailto:${email}?subject=${subject}?body=${body}`
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

// Icons - keeping them simple and clean
const HomeIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': props.strokeWidth || 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])

const UsersIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': props.strokeWidth || 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
])

const CalendarIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': props.strokeWidth || 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
])

const PostsIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': props.strokeWidth || 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })
])

const ClipboardIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': props.strokeWidth || 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
])

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: HomeIcon },
  { name: 'Students', path: '/admin/students', icon: UsersIcon },
  { name: 'Events', path: '/admin/events', icon: CalendarIcon },
  { name: 'Posts', path: '/admin/posts', icon: PostsIcon },
  { name: 'Attendance', path: '/admin/attendance', icon: ClipboardIcon }
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
