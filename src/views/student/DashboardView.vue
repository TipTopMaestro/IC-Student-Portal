<template>
  <div class="space-y-6 max-w-5xl mx-auto px-1">
    <!-- Header Greeting & Low-profile Stats Summary -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ greeting }}, {{ firstName }}</h1>
        <p class="text-gray-500 text-sm mt-0.5">{{ currentDate }}</p>
      </div>

      <!-- Quick Metrics Header (Pills style - Forced to 1 row on mobile) -->
      <div v-if="isLoading" class="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-hide py-1 w-full md:w-auto">
        <div v-for="i in 3" :key="i" class="h-7 w-28 bg-gray-200 rounded-full animate-pulse shrink-0"></div>
      </div>
      <div v-else class="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-hide py-1 w-full md:w-auto">
        <div class="bg-gray-50 border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span class="text-[11px] sm:text-xs font-semibold text-gray-700">{{ attendanceRate }}% Attendance</span>
        </div>
        <div class="bg-gray-50 border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span class="text-[11px] sm:text-xs font-semibold text-gray-700">{{ unpaidFees }} Unpaid Items</span>
        </div>
        <div v-if="totalFines > 0" class="bg-gray-50 border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span class="text-[11px] sm:text-xs font-semibold text-gray-700">₱{{ totalFines.toLocaleString() }} Fines</span>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton (Matches the actual structure) -->
    <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-5">
        <!-- Upcoming Events Card Skeleton -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
            <div class="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
            <div class="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="i in 3" :key="i" class="px-5 py-3.5 flex items-center gap-3">
              <div class="w-11 h-11 rounded-lg bg-gray-100 animate-pulse shrink-0"></div>
              <div class="flex-1 space-y-2 min-w-0">
                <div class="h-3.5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div class="h-2.5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
              <div class="h-3 bg-gray-200 rounded w-16 animate-pulse shrink-0"></div>
            </div>
          </div>
        </div>

        <!-- Mobile-only Stats Skeleton -->
        <div class="block lg:hidden space-y-4">
          <div v-for="i in 2" :key="i" class="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <div class="h-3.5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div class="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div class="h-2.5 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>

        <!-- Feed Announcement Skeleton -->
        <div class="space-y-4">
          <div class="flex justify-between items-center px-1">
            <div class="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div class="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div v-for="i in 2" :key="i" class="bg-white border border-gray-200 rounded-xl p-4.5 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div class="h-2.5 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div class="h-60 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Desktop Sidebar Skeleton -->
      <div class="hidden lg:block">
        <div class="space-y-5">
          <div class="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
                <div class="h-2.5 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div v-for="i in 2" :key="i" class="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div class="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div class="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div class="border-t border-gray-100 pt-3 space-y-2">
              <div class="h-8 bg-gray-100 rounded w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Feed + Events Card (2 cols) -->
      <div class="lg:col-span-2 space-y-5">
        
        <!-- Clean Card List View: Upcoming Events -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-900">Upcoming Events</h2>
            <router-link to="/calendar" class="text-xs text-ic-primary hover:underline">View calendar</router-link>
          </div>
          
          <div v-if="upcomingEventsList.length === 0" class="py-12 text-center">
            <svg class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-xs text-gray-400 font-medium">No upcoming events scheduled</p>
          </div>
          
          <div v-else class="divide-y divide-gray-100">
            <!-- Event Item -->
            <div 
              v-for="event in upcomingEventsList" 
              :key="event.id"
              class="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors"
            >
              <div class="flex items-center gap-3 min-w-0">
                <!-- Date Badge Block (Clean solid gray border, no gradient) -->
                <div class="w-11 h-11 rounded-lg bg-gray-50 flex flex-col items-center justify-center shrink-0 border border-gray-200 select-none">
                  <span class="text-[9px] font-semibold text-ic-secondary tracking-wider leading-none uppercase">{{ event.month }}</span>
                  <span class="text-base font-semibold text-gray-900 leading-tight mt-0.5">{{ event.day }}</span>
                </div>
                <div class="min-w-0">
                  <h4 class="text-sm font-semibold text-gray-900 truncate leading-tight">{{ event.name }}</h4>
                  <p class="text-xs text-gray-500 mt-1 truncate">
                    <span v-if="event.academicYear">{{ event.academicYear }}</span>
                    <span v-if="event.academicYear && event.semester"> · </span>
                    <span v-if="event.semester">{{ event.semester }}</span>
                  </p>
                </div>
              </div>
              <button 
                @click="openEventModal(event)"
                class="text-xs font-semibold text-ic-primary hover:text-ic-secondary transition-colors shrink-0 focus:outline-none"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile-Only Components: Outstanding Balance & Attendance Widgets -->
        <div class="block lg:hidden space-y-4">
          <!-- Outstanding Balance Mobile Card -->
          <div class="bg-white border border-gray-200 rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Outstanding Balance</h3>
                <p class="text-xl font-semibold text-gray-900 mt-1">₱{{ totalUnpaidAmount.toLocaleString() }}</p>
              </div>
              <router-link to="/fees" class="text-xs text-ic-primary hover:underline">View all</router-link>
            </div>
            
            <div v-if="pendingFeesList.length > 0" class="space-y-3 pt-3 border-t border-gray-100">
              <div v-for="fee in pendingFeesList" :key="fee.id" class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2 min-w-0">
                  <div class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-ic-primary border border-pink-100 shrink-0">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span class="text-xs font-semibold text-gray-900 truncate leading-tight">{{ fee.name }}</span>
                </div>
                <span class="text-xs font-semibold text-gray-900 shrink-0">₱{{ fee.amount.toLocaleString() }}</span>
              </div>
            </div>
            <p v-else class="text-xs text-gray-400 italic py-1">No pending items found</p>
          </div>

          <!-- Attendance Stats Mobile Card (Modern Circular Ring Layout) -->
          <div class="bg-white border border-gray-200 rounded-xl p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Status</h3>
              <router-link to="/attendance" class="text-xs text-ic-primary hover:underline">View details</router-link>
            </div>
            
            <div class="flex items-center gap-5">
              <!-- Ring Gauge -->
              <div class="relative w-16 h-16 shrink-0">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path 
                    class="text-gray-100" 
                    stroke="currentColor" 
                    stroke-width="3" 
                    fill="none" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path 
                    class="text-ic-primary transition-all duration-1000" 
                    stroke="currentColor" 
                    stroke-width="3" 
                    stroke-linecap="round" 
                    fill="none" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    :stroke-dasharray="`${attendanceRate}, 100`"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-xs font-semibold text-gray-900">{{ attendanceRate }}%</span>
                </div>
              </div>

              <!-- Metrics -->
              <div class="flex-1 space-y-1.5 min-w-0">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-500">Attended Sessions</span>
                  <span class="font-semibold text-gray-900">{{ attendedEvents }} / {{ totalEvents }}</span>
                </div>
                <div class="pt-1.5 border-t border-gray-100 flex items-center gap-1.5">
                  <span 
                    class="w-1.5 h-1.5 rounded-full" 
                    :class="attendanceRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'"
                  ></span>
                  <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    {{ attendanceRate >= 80 ? 'Good Standing' : 'Needs Review' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Posts Feed -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h2 class="text-sm font-semibold text-gray-900">Recent Announcements</h2>
            <router-link to="/posts" class="text-xs text-ic-primary hover:underline transition-colors">View all posts</router-link>
          </div>

          <div v-if="postsLoading" class="space-y-4">
            <div v-for="i in 2" :key="i" class="bg-white border border-gray-200 rounded-xl p-5 space-y-4 animate-pulse">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-3 bg-gray-200 rounded w-24"></div>
                  <div class="h-2.5 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div class="h-20 bg-gray-50 rounded-lg"></div>
            </div>
          </div>

          <div v-else-if="recentPosts.length > 0" class="space-y-4">
            <PostFeedItem
              v-for="post in recentPosts"
              :key="post.id"
              :post="post"
              :show-actions="false"
              class="border border-gray-200! shadow-xs!"
            />
          </div>

          <div v-else class="bg-white border border-gray-200 rounded-xl py-12 px-5 text-center">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2m-2 3h.01M5.071 8.243a2 2 0 00-2.828 2.828m0 0l6.364 6.364m-6.364-6.364L12 7.636l1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p class="text-sm text-gray-400 font-medium">No announcements published yet</p>
          </div>
        </div>

      </div>

      <!-- Right Column: Sidebar (1 col - Sticky suggestions block - Desktop Only) -->
      <div class="hidden lg:block">
        <div class="sticky top-20 space-y-5">
          <!-- Profile Card -->
          <div class="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full overflow-hidden border border-gray-200 ring-2 ring-gray-50 bg-gray-50 shrink-0">
                <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-ic-primary flex items-center justify-center text-white font-semibold text-sm">
                  {{ userInitials }}
                </div>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ studentFullName }}</p>
                <p class="text-xs text-gray-500 truncate">{{ studentIdNumber || authStore.user?.username }}</p>
              </div>
            </div>
            <router-link to="/profile" class="text-xs font-semibold text-ic-primary hover:underline transition-colors shrink-0 ml-2">Profile</router-link>
          </div>

          <!-- Suggested Block: Outstanding Balance -->
          <div class="bg-white border border-gray-200 rounded-xl p-5">
            <div class="flex items-center justify-between mb-3.5">
              <div>
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Outstanding Balance</h3>
                <p class="text-xl font-semibold text-gray-900 mt-1">₱{{ totalUnpaidAmount.toLocaleString() }}</p>
              </div>
              <router-link to="/fees" class="text-xs text-ic-primary hover:underline">View all</router-link>
            </div>

            <!-- Pending Fees List (Mimics Suggestions items) -->
            <div v-if="pendingFeesList.length > 0" class="space-y-3 pt-3.5 border-t border-gray-100">
              <div v-for="fee in pendingFeesList" :key="fee.id" class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-7.5 h-7.5 rounded-full bg-pink-50 flex items-center justify-center text-ic-primary border border-pink-100 shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-900 truncate leading-tight">{{ fee.name }}</p>
                    <p class="text-[10px] text-gray-500 mt-0.5 leading-none">Unpaid Balance</p>
                  </div>
                </div>
                <span class="text-xs font-semibold text-gray-900 shrink-0">₱{{ fee.amount.toLocaleString() }}</span>
              </div>
            </div>
            <p v-else class="text-xs text-gray-400 italic py-2">No pending items found</p>
          </div>

          <!-- Suggested Block: Attendance Stats (Modern Circular Ring Layout) -->
          <div class="bg-white border border-gray-200 rounded-xl p-5">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Attendance Status</h3>
            
            <div class="flex items-center gap-4.5">
              <!-- Ring Gauge -->
              <div class="relative w-16 h-16 shrink-0">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <!-- Background Circle -->
                  <path 
                    class="text-gray-100" 
                    stroke="currentColor" 
                    stroke-width="3" 
                    fill="none" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <!-- Foreground Circle (Solid Primary Color, no gradient) -->
                  <path 
                    class="text-ic-primary transition-all duration-1000" 
                    stroke="currentColor" 
                    stroke-width="3" 
                    stroke-linecap="round" 
                    fill="none" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    :stroke-dasharray="`${attendanceRate}, 100`"
                  />
                </svg>
                <!-- Centered Percentage -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-xs font-semibold text-gray-900">{{ attendanceRate }}%</span>
                </div>
              </div>

              <!-- Metrics -->
              <div class="flex-1 space-y-1.5 min-w-0">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-500">Attended Sessions</span>
                  <span class="font-semibold text-gray-900">{{ attendedEvents }} / {{ totalEvents }}</span>
                </div>
                <div class="pt-1.5 border-t border-gray-100 flex items-center gap-1.5">
                  <span 
                    class="w-1.5 h-1.5 rounded-full" 
                    :class="attendanceRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'"
                  ></span>
                  <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    {{ attendanceRate >= 80 ? 'Good Standing' : 'Needs Review' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Copyright links mimicking instagram -->
          <div class="px-1 text-[10px] text-gray-400 leading-relaxed font-medium">
            <div class="flex flex-wrap gap-x-1.5 gap-y-0.5">
              <span class="hover:underline cursor-pointer">About</span>
              <span>·</span>
              <span class="hover:underline cursor-pointer">Help</span>
              <span>·</span>
              <span class="hover:underline cursor-pointer">DNSC IC</span>
              <span>·</span>
              <span class="hover:underline cursor-pointer">Terms</span>
              <span>·</span>
              <span class="hover:underline cursor-pointer">Privacy</span>
            </div>
            <p class="mt-2 text-gray-400 uppercase tracking-wider">© 2026 IC STUDENT PORTAL</p>
          </div>

        </div>
      </div>
    </div>

    <!-- Event Detail Dialog Modal (Solid header) -->
    <Transition name="modal-fade">
      <div 
        v-if="eventModalOpen" 
        class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
        @click.self="closeEventModal"
      >
        <div class="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative animate-modal-pop">
          <!-- Modal Header Banner (Solid Brand Color, no gradient) -->
          <div class="bg-ic-primary p-5 text-white relative">
            <button 
              @click="closeEventModal" 
              class="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors focus:outline-none"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div class="flex items-center gap-3.5 pr-8">
              <div class="w-12 h-12 rounded-full bg-white/20 flex flex-col items-center justify-center border border-white/30 shrink-0 font-semibold">
                <span class="text-[9px] text-white/90 leading-none uppercase">{{ selectedEvent.month }}</span>
                <span class="text-lg leading-tight">{{ selectedEvent.day }}</span>
              </div>
              <div>
                <h4 class="font-semibold text-base leading-tight">{{ selectedEvent.name }}</h4>
                <p class="text-xs text-white/80 mt-0.5 font-medium">{{ selectedEvent.semester }} {{ selectedEvent.academicYear }}</p>
              </div>
            </div>
          </div>

          <!-- Modal Body Content -->
          <div class="p-6 space-y-4.5">
            <div>
              <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</h5>
              <p class="text-sm text-gray-700 leading-relaxed">{{ selectedEvent.description }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div>
                <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Academic Info</h5>
                <p class="text-sm text-gray-800 font-semibold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-ic-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {{ selectedEvent.semester }}
                </p>
              </div>
              <div>
                <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Academic Year</h5>
                <p class="text-sm text-gray-800 font-semibold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-ic-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ selectedEvent.academicYear }}
                </p>
              </div>
            </div>

            <div v-if="selectedEvent.dateRange" class="border-t border-gray-100 pt-4 text-xs text-gray-500 font-medium">
              Event Schedule: <span class="text-gray-700 font-semibold">{{ selectedEvent.dateRange }}</span>
            </div>
          </div>

          <!-- Modal Action Button -->
          <div class="px-6 pb-6 pt-2">
            <button 
              @click="closeEventModal"
              class="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors focus:outline-none"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getStudentFees } from '@/services/feeService'
import { listInstituteEvents, listAttendanceRecords } from '@/services/eventService'
import { listPosts, extractPosts } from '@/services/postService'
import PostFeedItem from '@/components/posts/PostFeedItem.vue'

const authStore = useAuthStore()

// Computed student profile details
const studentFullName = computed(() => {
  const s = authStore.user?.student
  if (s) {
    return `${s.s_fname || ''} ${s.s_mname ? s.s_mname.charAt(0) + '. ' : ''}${s.s_lname || ''}`.trim()
  }
  return authStore.user?.full_name || authStore.user?.firstName || 'Student Account'
})

const studentIdNumber = computed(() => authStore.user?.student?.s_id_number || '')

const userAvatar = computed(() => {
  const avatar = authStore.user?.user_avatar || authStore.user?.profile_url || authStore.user?.profile || authStore.user?.student?.s_image
  if (avatar) {
    return avatar.startsWith('http') ? avatar : `https://${avatar.replace(/^\/+/,'')}`
  }
  return ''
})

const userInitials = computed(() => {
  const name = studentFullName.value || 'Student'
  return name.split(' ').filter(p => p.length > 0).slice(0, 2).map(p => p.charAt(0)).join('').toUpperCase()
})

const firstName = computed(() => authStore.user?.student?.s_fname || authStore.user?.first_name || authStore.user?.firstName || 'Student')

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const isLoading = ref(true)
const attendanceRate = ref(0)
const unpaidFees = ref(0)
const upcomingEventsCount = ref(0)
const totalFines = ref(0)
const totalEvents = ref(0)
const attendedEvents = ref(0)
const totalUnpaidAmount = ref(0)
const pendingFeesList = ref([])
const upcomingEventsList = ref([])
const postsLoading = ref(true)
const recentPosts = ref([])

// Interactive Event Modal State
const eventModalOpen = ref(false)
const selectedEvent = ref({})

const openEventModal = (event) => {
  selectedEvent.value = event
  eventModalOpen.value = true
}

const closeEventModal = () => {
  eventModalOpen.value = false
}

const loadFeeStats = async () => {
  const studentId = authStore.user?.student?.id
  if (!studentId) return
  try {
    const result = await getStudentFees(studentId, { perPage: 100 })
    if (result.success) {
      const allFees = result.data
      const pending = allFees.filter(f => f.status !== 'paid')
      unpaidFees.value = pending.length
      totalUnpaidAmount.value = pending.reduce((sum, f) => sum + (parseFloat(f.balance) || 0), 0)
      
      // Calculate Attendance Fines directly from fees that are linked to attendance events
      totalFines.value = pending.reduce((sum, f) => {
        const categoryName = (f.category_name || '').toLowerCase()
        const isAttendanceFine = f.institute_attendance_event || 
                               f.institute_attendance_event_id ||
                               categoryName.includes('fine') ||
                               categoryName.includes('absent') ||
                               categoryName.includes('tardy') ||
                               categoryName.includes('attendance')
        
        if (isAttendanceFine) {
          return sum + (parseFloat(f.balance) || 0)
        }
        return sum
      }, 0)

      pendingFeesList.value = pending.slice(0, 3).map(f => ({
        id: f.id,
        name: f.category_name,
        amount: parseFloat(f.balance) || 0
      }))
    }
  } catch (e) {
    console.warn('Could not load fee stats:', e)
  }
}

const mapEventData = (e) => {
  const name = e.attendance_event?.event_name || e.event_name || 'Unnamed Event'
  const desc = e.attendance_event?.description || e.description || 'No description provided.'
  const startDate = e.start_date ? new Date(e.start_date) : null
  const endDate = e.end_date ? new Date(e.end_date) : null
  
  const formatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  const startStr = startDate ? startDate.toLocaleDateString('en-US', formatOptions) : ''
  const endStr = endDate ? endDate.toLocaleDateString('en-US', formatOptions) : ''
  const dateRange = startStr === endStr ? startStr : `${startStr} – ${endStr}`

  return {
    id: e.id,
    name,
    description: desc,
    dateRange,
    day: startDate ? String(startDate.getDate()).padStart(2, '0') : '--',
    month: startDate ? startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : '--',
    semester: e.semester ? `${e.semester} Semester` : '',
    academicYear: e.academic_year ? `AY ${e.academic_year}` : ''
  }
}

const loadEvents = async () => {
  try {
    const result = await listInstituteEvents({ per_page: 20 })
    if (result.success) {
      const responseData = result.data.data || result.data
      const items = responseData.data || responseData
      const eventList = Array.isArray(items) ? items : []

      const now = new Date()
      // Filter for upcoming or today's events
      const upcoming = eventList.filter(e => {
        const end = e.end_date ? new Date(e.end_date) : null
        const start = e.start_date ? new Date(e.start_date) : null
        return !end || end >= now || (start && start >= now)
      })

      upcomingEventsCount.value = upcoming.length
      upcomingEventsList.value = upcoming.slice(0, 5).map(mapEventData)
    }
  } catch (e) {
    console.warn('Could not load events:', e)
    upcomingEventsList.value = []
    upcomingEventsCount.value = 0
  }
}

const loadAttendanceStats = async () => {
  const studentId = authStore.user?.student?.id
  if (!studentId) return
  try {
    const result = await listAttendanceRecords({ per_page: 200 })
    if (result.success) {
      const responseData = result.data.data || result.data
      const items = responseData.data || responseData
      const records = Array.isArray(items) ? items : []

      const myRecords = records.filter(r => r.student?.id === studentId)

      totalEvents.value = myRecords.length * 4
      attendedEvents.value = myRecords.reduce((sum, r) => {
        let count = 0
        if (r.morning_check_in) count++
        if (r.morning_check_out) count++
        if (r.afternoon_check_in) count++
        if (r.afternoon_check_out) count++
        return sum + count
      }, 0)
      attendanceRate.value = totalEvents.value > 0
        ? Math.round((attendedEvents.value / totalEvents.value) * 100)
        : 0
    }
  } catch (e) {
    console.warn('Could not load attendance stats:', e)
  }
}

const loadRecentPosts = async () => {
  postsLoading.value = true
  try {
    const result = await listPosts({ per_page: 5 })
    if (result.success) {
      const allPosts = extractPosts(result)
      recentPosts.value = allPosts.filter(post => post.visibility === 'public').slice(0, 3)
    }
  } catch (e) {
    console.warn('Could not load recent posts:', e)
  } finally {
    postsLoading.value = false
  }
}

const loadDashboard = async () => {
  isLoading.value = true
  await Promise.allSettled([loadFeeStats(), loadEvents(), loadAttendanceStats(), loadRecentPosts()])
  isLoading.value = false
}

onMounted(() => {
  loadDashboard()
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Animations for modal popup */
@keyframes modalPop {
  0% { transform: scale(0.9) translateY(20px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

.animate-modal-pop {
  animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
