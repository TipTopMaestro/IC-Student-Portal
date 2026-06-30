<template>
  <div class="space-y-6 max-w-5xl mx-auto px-1">
    <!-- Header Greeting & Low-profile Metrics Summary -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 text-sm mt-0.5">Overview of your academic administration panel</p>
      </div>

      <!-- Quick Metrics Header (Pills style - Forced to 1 row on mobile) -->
      <div v-if="statsLoading" class="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-hide py-1 w-full md:w-auto">
        <div v-for="i in 3" :key="i" class="h-7 w-28 bg-gray-200 rounded-full animate-pulse shrink-0"></div>
      </div>
      <div v-else class="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-hide py-1 w-full md:w-auto">
        <div class="bg-gray-50 border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span class="text-[11px] sm:text-xs font-semibold text-gray-700">{{ stats.totalStudents.toLocaleString() }} Students</span>
        </div>
        <div class="bg-gray-50 border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-ic-primary"></span>
          <span class="text-[11px] sm:text-xs font-semibold text-gray-700">{{ stats.totalEvents }} Events</span>
        </div>
        <div class="bg-gray-50 border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span class="text-[11px] sm:text-xs font-semibold text-gray-700">{{ stats.totalAttendance.toLocaleString() }} Scans</span>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton (Matches the actual structure) -->
    <div v-if="statsLoading && recentEvents.length === 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-5">
        <!-- Events Card Skeleton -->
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

        <!-- Mobile-only Cards Skeleton -->
        <div class="block lg:hidden space-y-4">
          <div v-for="i in 2" :key="i" class="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <div class="h-3.5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div class="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div class="h-2.5 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>

        <!-- Feed Skeleton -->
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
        
        <!-- Clean Card List View: Recent Events -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-900">Recent Events</h2>
            <router-link to="/admin/events" class="text-xs text-ic-primary hover:underline">View all</router-link>
          </div>
          
          <div v-if="recentEvents.length === 0" class="py-12 text-center">
            <svg class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-xs text-gray-400 font-medium">No recent events scheduled</p>
          </div>
          
          <div v-else class="divide-y divide-gray-100">
            <!-- Event Item -->
            <div 
              v-for="event in recentEvents" 
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

        <!-- Mobile-Only Components: Quick Actions & Statistics Widgets -->
        <div class="block lg:hidden space-y-4">
          <!-- Quick Actions Mobile Card -->
          <div class="bg-white border border-gray-200 rounded-xl p-5">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div class="flex gap-2">
              <router-link 
                to="/admin/students" 
                class="flex-1 py-2 text-center bg-ic-primary hover:bg-ic-secondary text-white text-xs font-semibold rounded-lg transition-colors"
              >
                View Students
              </router-link>
              <router-link 
                to="/admin/events" 
                class="flex-1 py-2 text-center border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Events
              </router-link>
              <router-link 
                to="/admin/posts" 
                class="flex-1 py-2 text-center border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Posts
              </router-link>
            </div>
          </div>

          <!-- Statistics Mobile Card -->
          <div class="bg-white border border-gray-200 rounded-xl p-5">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3.5">System Statistics</h3>
            <div class="grid grid-cols-3 gap-2.5">
              <div class="text-center p-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                <p class="text-[10px] text-gray-500 font-medium">Students</p>
                <p class="text-base font-semibold text-gray-900 mt-0.5">{{ stats.totalStudents.toLocaleString() }}</p>
              </div>
              <div class="text-center p-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                <p class="text-[10px] text-gray-500 font-medium">Events</p>
                <p class="text-base font-semibold text-gray-900 mt-0.5">{{ stats.totalEvents }}</p>
              </div>
              <div class="text-center p-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                <p class="text-[10px] text-gray-500 font-medium">Scans</p>
                <p class="text-base font-semibold text-gray-900 mt-0.5">{{ stats.totalAttendance.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Posts Feed -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h2 class="text-sm font-semibold text-gray-900">Recent Posts</h2>
            <router-link to="/admin/posts" class="text-xs text-ic-primary hover:underline transition-colors">View all posts</router-link>
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
            <p class="text-sm text-gray-400 font-medium">No posts published yet</p>
          </div>
        </div>

      </div>

      <!-- Right Column: Sidebar (1 col - Sticky Suggestions block - Desktop Only) -->
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
                <p class="text-sm font-semibold text-gray-900 truncate">{{ adminFullName }}</p>
                <p class="text-xs text-gray-500 truncate">System Administrator</p>
              </div>
            </div>
            <router-link to="/admin/profile" class="text-xs font-semibold text-ic-primary hover:underline transition-colors shrink-0 ml-2">Profile</router-link>
          </div>

          <!-- Suggested Block: Administrative Statistics -->
          <div class="bg-white border border-gray-200 rounded-xl p-5">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">System Statistics</h3>
            
            <div class="space-y-4">
              <!-- Total Students Item -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-ic-primary border border-pink-100 shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-900 leading-tight">Total Students</p>
                    <p class="text-[10px] text-gray-500 mt-0.5 leading-none">Student profiles</p>
                  </div>
                </div>
                <span class="text-sm font-semibold text-gray-900 shrink-0">{{ stats.totalStudents.toLocaleString() }}</span>
              </div>

              <!-- Total Events Item -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-ic-primary border border-purple-100 shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-900 leading-tight">Total Events</p>
                    <p class="text-[10px] text-gray-500 mt-0.5 leading-none">Attendance setups</p>
                  </div>
                </div>
                <span class="text-sm font-semibold text-gray-900 shrink-0">{{ stats.totalEvents }}</span>
              </div>

              <!-- Total Attendance Scans -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-900 leading-tight">Attendance Scans</p>
                    <p class="text-[10px] text-gray-500 mt-0.5 leading-none">Logs recorded</p>
                  </div>
                </div>
                <span class="text-sm font-semibold text-gray-900 shrink-0">{{ stats.totalAttendance.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Suggested Block: Quick Actions Tools -->
          <div class="bg-white border border-gray-200 rounded-xl p-5">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3.5">Quick Actions</h3>
            
            <div class="space-y-2">
              <router-link 
                to="/admin/students" 
                class="block w-full py-2 text-center bg-ic-primary hover:bg-ic-secondary text-white text-xs font-semibold rounded-lg transition-colors"
              >
                View Students List
              </router-link>
              <router-link 
                to="/admin/events" 
                class="block w-full py-2 text-center border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Events Calendar
              </router-link>
              <router-link 
                to="/admin/posts" 
                class="block w-full py-2 text-center border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Manage Posts
              </router-link>
            </div>
          </div>

          <!-- Footer Copyright links mimicking instagram -->
          <div class="px-1 text-[10px] text-gray-400 leading-relaxed font-medium">
            <div class="flex flex-wrap gap-x-1.5 gap-y-0.5 select-none">
              <router-link to="/admin/about" class="hover:underline">About</router-link>
              <span>·</span>
              <router-link to="/admin/about#support" class="hover:underline">Help</router-link>
              <span>·</span>
              <a href="https://dnsc.edu.ph" target="_blank" rel="noopener noreferrer" class="hover:underline">DNSC IC</a>
              <span>·</span>
              <button @click="openLegalModal('terms')" class="hover:underline cursor-pointer text-left">Terms</button>
              <span>·</span>
              <button @click="openLegalModal('privacy')" class="hover:underline cursor-pointer text-left">Privacy</button>
            </div>
            <p class="mt-2 text-gray-400 uppercase tracking-wider">© 2026 IC STUDENT PORTAL</p>
          </div>

        </div>
      </div>
    </div>

    <!-- Terms / Privacy Modal -->
    <Transition name="modal-fade">
      <div 
        v-if="activeModalType" 
        class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[200]"
        @click="closeLegalModal"
      >
        <div 
          @click.stop
          class="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative animate-modal-pop max-h-[80vh] flex flex-col"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-900 capitalize">
              {{ activeModalType === 'terms' ? 'Terms of Service' : 'Privacy Policy' }}
            </h3>
            <button @click="closeLegalModal" class="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Content -->
          <div class="p-6 overflow-y-auto text-xs text-gray-600 space-y-4 leading-relaxed flex-1">
            <template v-if="activeModalType === 'terms'">
              <p class="font-semibold text-gray-900">Welcome to the IC Student Portal (ICSP).</p>
              <p>By accessing or using this system, you agree to comply with and be bound by the DNSC Student Handbook rules and the following terms:</p>
              
              <div class="space-y-2">
                <p class="font-bold text-gray-800">1. Account Responsibility</p>
                <p>Students and administrators are responsible for maintaining the confidentiality of their session tokens and login credentials. Any activity logged under your account is deemed your responsibility.</p>
              </div>

              <div class="space-y-2">
                <p class="font-bold text-gray-800">2. Portal Usage & Conduct</p>
                <p>The portal is dedicated to academic management, RFID attendance check-ins, fee clearance logs, and institutional announcements. Unauthorized attempts to bypass API auth, scrape student records, or inject malicious payloads will result in immediate suspension and disciplinary action by the Institute of Computing.</p>
              </div>

              <div class="space-y-2">
                <p class="font-bold text-gray-800">3. System Integration (SSO)</p>
                <p>This portal connects with other official DNSC Campus Systems. Session transfer tokens are issued temporarily and expire automatically. Bypassing token exchanges or attempting to access unauthorized destination domains is strictly prohibited.</p>
              </div>
            </template>

            <template v-if="activeModalType === 'privacy'">
              <p class="font-semibold text-gray-900">Data Privacy Compliance (RA 10173)</p>
              <p>In compliance with the <strong>Republic Act No. 10173</strong> (Data Privacy Act of 2012 of the Philippines), the Institute of Computing at DNSC is committed to protecting your personal information.</p>
              
              <div class="space-y-2">
                <p class="font-bold text-gray-800">1. Information We Collect</p>
                <p>We process standard institutional credentials including student name, ID number, DNSC Google Workspace email, RFID scanner logs (attendance times), and academic fee status.</p>
              </div>

              <div class="space-y-2">
                <p class="font-bold text-gray-800">2. Purpose of Processing</p>
                <p>Your data is processed solely for academic identification, class check-ins, tracking local organization obligations, publishing posts, and facilitating authentication across integrated campus services.</p>
              </div>

              <div class="space-y-2">
                <p class="font-bold text-gray-800">3. Security Measures</p>
                <p>All token requests and API responses are encrypted using HTTPS and verified via JSON Web Tokens (JWT). Access is strictly restricted based on role permissions (Student or Administrator).</p>
              </div>
            </template>
          </div>
          
          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button 
              @click="closeLegalModal" 
              class="px-4 py-2 bg-ic-primary hover:bg-ic-secondary text-white text-xs font-semibold rounded-xl transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>

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
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { listStudents } from '@/services/studentService'
import { listInstituteEvents, listAttendanceRecords } from '@/services/eventService'
import { listPosts, extractPosts } from '@/services/postService'
import PostFeedItem from '@/components/posts/PostFeedItem.vue'

const authStore = useAuthStore()

// Computed admin details
const adminFullName = computed(() => {
  const u = authStore.user
  if (u) {
    return `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || 'Admin User'
  }
  return 'Admin Account'
})

const userAvatar = computed(() => {
  const avatar = authStore.user?.user_avatar || authStore.user?.profile_url || authStore.user?.profile
  if (avatar) {
    return avatar.startsWith('http') ? avatar : `https://${avatar.replace(/^\/+/,'')}`
  }
  return ''
})

const userInitials = computed(() => {
  const name = adminFullName.value || 'Admin'
  return name.split(' ').filter(p => p.length > 0).slice(0, 2).map(p => p.charAt(0)).join('').toUpperCase()
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const statsLoading = ref(true)
const postsLoading = ref(true)

const stats = ref({
  totalStudents: 0,
  totalEvents: 0,
  totalAttendance: 0
})

const recentEvents = ref([])
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

// Extract total count from a paginated API response
const extractTotal = (result) => {
  if (!result.success) return 0
  const d = result.data?.data || result.data
  return d?.total_items ?? d?.data?.total_items ?? 0
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

const loadDashboard = async () => {
  statsLoading.value = true
  postsLoading.value = true

  const [studentsRes, eventsRes, attendanceRes, postsRes] = await Promise.allSettled([
    listStudents({ per_page: 5 }),
    listInstituteEvents({ per_page: 5 }),
    listAttendanceRecords({ per_page: 1 }),
    listPosts({ per_page: 3 })
  ])

  const studentsResult = studentsRes.status === 'fulfilled' ? studentsRes.value : { success: false }
  const eventsResult = eventsRes.status === 'fulfilled' ? eventsRes.value : { success: false }
  const attendanceResult = attendanceRes.status === 'fulfilled' ? attendanceRes.value : { success: false }
  const postsResult = postsRes.status === 'fulfilled' ? postsRes.value : { success: false }

  stats.value.totalStudents = extractTotal(studentsResult)
  stats.value.totalEvents = extractTotal(eventsResult)
  stats.value.totalAttendance = extractTotal(attendanceResult)

  const items = eventsResult.success ? (eventsResult.data?.data?.data || eventsResult.data?.data || eventsResult.data || []) : []
  const rawEventsList = Array.isArray(items) ? items : []
  
  recentEvents.value = rawEventsList.slice(0, 5).map(mapEventData)
  recentPosts.value = extractPosts(postsResult).slice(0, 3)

  statsLoading.value = false
  postsLoading.value = false
}

const activeModalType = ref(null)
const openLegalModal = (type) => {
  activeModalType.value = type
}
const closeLegalModal = () => {
  activeModalType.value = null
}

onMounted(() => {
  loadDashboard()
})
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
