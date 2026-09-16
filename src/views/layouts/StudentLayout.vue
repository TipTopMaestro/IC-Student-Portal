<template>
  <div class="min-h-screen bg-white">
    <!-- Mobile Header -->
    <header class="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 safe-area-top">
      <div class="flex items-center justify-between h-14 px-4">
        <div class="flex items-center gap-1.5 cursor-pointer relative systems-trigger select-none" @click.stop="toggleSystemsMenu">
          <img src="/icsa_logo.png" alt="ICSA" class="h-6 w-6" />
          <span class="font-pixel text-lg text-ic-primary tracking-tight">ICSP</span>
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
            to="/"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/') ? 'font-semibold text-ic-primary' : 'text-gray-700 font-medium'"
          >
            <LayoutDashboard class="w-5 h-5" :stroke-width="isActive('/') ? 2.4 : 1.9" :class="isActive('/') ? 'fill-current text-ic-primary' : 'fill-none text-gray-500'" />
            <span class="text-sm">Dashboard</span>
          </router-link>

          <router-link
            to="/attendance"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/attendance') ? 'font-semibold text-ic-primary' : 'text-gray-700 font-medium'"
          >
            <CalendarCheck class="w-5 h-5" :stroke-width="isActive('/attendance') ? 2.4 : 1.9" :class="isActive('/attendance') ? 'nav-icon-active-calendar text-ic-primary' : 'fill-none text-gray-500'" />
            <span class="text-sm">Attendance</span>
          </router-link>

          <router-link
            to="/fees"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/fees') ? 'font-semibold text-ic-primary' : 'text-gray-700 font-medium'"
          >
            <CreditCard class="w-5 h-5" :stroke-width="isActive('/fees') ? 2.4 : 1.9" :class="isActive('/fees') ? 'nav-icon-active-card text-ic-primary' : 'fill-none text-gray-500'" />
            <span class="text-sm">Fees</span>
          </router-link>

          <router-link
            to="/calendar"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/calendar') ? 'font-semibold text-ic-primary' : 'text-gray-700 font-medium'"
          >
            <Calendar class="w-5 h-5" :stroke-width="isActive('/calendar') ? 2.4 : 1.9" :class="isActive('/calendar') ? 'nav-icon-active-cal text-ic-primary' : 'fill-none text-gray-500'" />
            <span class="text-sm">Calendar</span>
          </router-link>

          <router-link
            to="/posts"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/posts') ? 'font-semibold text-ic-primary' : 'text-gray-700 font-medium'"
          >
            <Newspaper class="w-5 h-5" :stroke-width="isActive('/posts') ? 2.4 : 1.9" :class="isActive('/posts') ? 'nav-icon-active-news text-ic-primary' : 'fill-none text-gray-500'" />
            <span class="text-sm">Posts</span>
          </router-link>

          <router-link
            to="/profile"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            :class="isActive('/profile') ? 'font-semibold text-ic-primary' : 'text-gray-700 font-medium'"
          >
            <div v-if="userProfilePic" class="h-5 w-5 rounded-full overflow-hidden shrink-0" :class="isActive('/profile') ? 'ring-2 ring-ic-primary ring-offset-1' : ''">
              <img :src="userProfilePic" alt="Profile" class="h-full w-full object-cover" />
            </div>
            <div v-else class="h-5 w-5 rounded-full bg-ic-primary flex items-center justify-center text-white text-[10px] font-semibold shrink-0" :class="isActive('/profile') ? 'ring-2 ring-ic-primary ring-offset-1' : ''">
              {{ userInitials }}
            </div>
            <span class="text-sm">Profile</span>
          </router-link>

          <div class="my-4 border-t border-gray-200"></div>

          <router-link
            to="/settings"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
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
            to="/about"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium w-full"
            :class="{ 'font-semibold text-ic-primary': isActive('/about') }"
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
          <span class="font-pixel text-xl text-ic-primary tracking-tight">ICSP</span>
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
          to="/"   
          class="sidebar-link group/link"
          :class="{ 'sidebar-link-active': isActive('/') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <LayoutDashboard 
              class="w-[22px] h-[22px] transition-all duration-200" 
              :stroke-width="isActive('/') ? 2.4 : 1.9"
              :class="isActive('/') ? 'fill-current text-gray-900' : 'fill-none text-gray-500 group-hover/link:text-gray-900'" 
            />
          </div>
          <span class="sidebar-label">Dashboard</span>
        </router-link>

        <router-link
          to="/attendance"
          class="sidebar-link group/link"
          :class="{ 'sidebar-link-active': isActive('/attendance') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <CalendarCheck 
              class="w-[22px] h-[22px] transition-all duration-200" 
              :stroke-width="isActive('/attendance') ? 2.4 : 1.9"
              :class="isActive('/attendance') ? 'nav-icon-active-calendar text-gray-900' : 'fill-none text-gray-500 group-hover/link:text-gray-900'" 
            />
          </div>
          <span class="sidebar-label">Attendance</span>
        </router-link>

        <router-link
          to="/fees"
          class="sidebar-link group/link"
          :class="{ 'sidebar-link-active': isActive('/fees') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <CreditCard 
              class="w-[22px] h-[22px] transition-all duration-200" 
              :stroke-width="isActive('/fees') ? 2.4 : 1.9"
              :class="isActive('/fees') ? 'nav-icon-active-card text-gray-900' : 'fill-none text-gray-500 group-hover/link:text-gray-900'" 
            />
          </div>
          <span class="sidebar-label">Fees</span>
        </router-link>

        <router-link
          to="/calendar"
          class="sidebar-link group/link"
          :class="{ 'sidebar-link-active': isActive('/calendar') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <Calendar 
              class="w-[22px] h-[22px] transition-all duration-200" 
              :stroke-width="isActive('/calendar') ? 2.4 : 1.9"
              :class="isActive('/calendar') ? 'nav-icon-active-cal text-gray-900' : 'fill-none text-gray-500 group-hover/link:text-gray-900'" 
            />
          </div>
          <span class="sidebar-label">Calendar</span>
        </router-link>

        <router-link
          to="/posts"
          class="sidebar-link group/link"
          :class="{ 'sidebar-link-active': isActive('/posts') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <Newspaper 
              class="w-[22px] h-[22px] transition-all duration-200" 
              :stroke-width="isActive('/posts') ? 2.4 : 1.9"
              :class="isActive('/posts') ? 'nav-icon-active-news text-gray-900' : 'fill-none text-gray-500 group-hover/link:text-gray-900'" 
            />
          </div>
          <span class="sidebar-label">Posts</span>
        </router-link>

        <router-link
          to="/profile"
          class="sidebar-link group/link"
          :class="{ 'sidebar-link-active': isActive('/profile') }"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center">
            <div 
              v-if="userProfilePic" 
              class="h-7 w-7 rounded-full overflow-hidden shrink-0 transition-all duration-200" 
              :class="isActive('/profile') ? 'ring-2 ring-gray-900 ring-offset-2 scale-105' : 'ring-1 ring-gray-200'"
            >
              <img :src="userProfilePic" alt="Profile" class="h-full w-full object-cover" />
            </div>
            <div 
              v-else 
              class="h-7 w-7 rounded-full bg-ic-primary flex items-center justify-center text-white text-xs font-semibold shrink-0 transition-all duration-200" 
              :class="isActive('/profile') ? 'ring-2 ring-gray-900 ring-offset-2 scale-105' : ''"
            >
              {{ userInitials }}
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
              <router-link to="/settings" @click="showMoreMenu = false" class="more-menu-item">
                <Settings class="w-4.5 h-4.5 text-gray-500 shrink-0" :stroke-width="1.9" />
                <span class="text-xs font-medium text-gray-700">Settings</span>
              </router-link>

              <a :href="reportProblemUrl" @click="showMoreMenu = false" class="more-menu-item">
                <LifeBuoy class="w-4.5 h-4.5 text-gray-500 shrink-0" :stroke-width="1.9" />
                <span class="text-xs font-medium text-gray-700">Report a Problem</span>
              </a>

              <router-link to="/about" @click="showMoreMenu = false" class="more-menu-item">
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
          <LayoutDashboard 
            class="w-5.5 h-5.5 transition-all duration-300 transform" 
            :stroke-width="isActive('/') ? 2.4 : 1.8"
            :class="isActive('/') ? 'scale-110 text-ic-primary fill-current' : 'text-gray-400 group-hover:text-gray-600 fill-none group-active:scale-90'"
          />
        </router-link>

        <!-- Attendance Link -->
        <router-link 
          to="/attendance" 
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group"
        >
          <CalendarCheck 
            class="w-5.5 h-5.5 transition-all duration-300 transform" 
            :stroke-width="isActive('/attendance') ? 2.4 : 1.8"
            :class="isActive('/attendance') ? 'scale-110 text-ic-primary nav-icon-active-calendar' : 'text-gray-400 group-hover:text-gray-600 fill-none group-active:scale-90'"
          />
        </router-link>

        <!-- Fees Link -->
        <router-link 
          to="/fees" 
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group"
        >
          <CreditCard 
            class="w-5.5 h-5.5 transition-all duration-300 transform" 
            :stroke-width="isActive('/fees') ? 2.4 : 1.8"
            :class="isActive('/fees') ? 'scale-110 text-ic-primary nav-icon-active-card' : 'text-gray-400 group-hover:text-gray-600 fill-none group-active:scale-90'"
          />
        </router-link>

        <!-- Posts Link -->
        <router-link 
          to="/posts" 
          class="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group"
        >
          <Newspaper 
            class="w-5.5 h-5.5 transition-all duration-300 transform" 
            :stroke-width="isActive('/posts') ? 2.4 : 1.8"
            :class="isActive('/posts') ? 'scale-110 text-ic-primary nav-icon-active-news' : 'text-gray-400 group-hover:text-gray-600 fill-none group-active:scale-90'"
          />
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
            class="h-6 w-6 rounded-full bg-ic-primary flex items-center justify-center text-white text-[10px] font-semibold shrink-0 transition-all duration-300 transform"
            :class="isActive('/profile') ? 'ring-2 ring-ic-primary ring-offset-2 scale-110' : 'scale-100 group-active:scale-90'"
          >
            {{ userInitials }}
          </div>
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <main class="md:ml-18 pt-14 pb-20 md:pt-0 md:pb-0">
      <div class="max-w-233.75 mx-auto px-4 py-6 animate-fade-in-up">
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
import { performSSORedirect } from '@/utils/sso'
import { 
  LayoutDashboard, 
  CalendarCheck, 
  CreditCard, 
  Calendar, 
  Newspaper, 
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
  Vote, 
  KeyRound 
} from 'lucide-vue-next'

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
    name: 'IC Voting System',
    desc: 'IC Elections Management System',
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

const handleSystemRedirect = (sys) => {
  // Resolve route dynamically to respect the router base path (e.g. subpath deployments)
  const resolved = router.resolve({ name: 'sso-redirect', query: { sys: sys.id } })
  window.open(resolved.href, '_blank', 'noopener,noreferrer')
  showSystemsMenu.value = false
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
.nav-icon-active-calendar {
  fill: currentColor;
}
.nav-icon-active-calendar :deep(path:nth-of-type(3)),
.nav-icon-active-calendar :deep(path:nth-of-type(4)),
.nav-icon-active-calendar path:nth-of-type(3),
.nav-icon-active-calendar path:nth-of-type(4) {
  stroke: #ffffff;
}

.nav-icon-active-card {
  fill: currentColor;
}
.nav-icon-active-card :deep(line),
.nav-icon-active-card :deep(path),
.nav-icon-active-card line,
.nav-icon-active-card path {
  stroke: #ffffff;
}

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
