<template>
  <div class="space-y-6 max-w-5xl mx-auto px-1 animate-fade-in-up">
    <!-- Header Greeting & Low-profile Metrics Summary -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div class="min-w-0">
        <span class="font-pixel text-xs sm:text-sm text-ic-primary lowercase tracking-wide block mb-1">admin dashboard</span>
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight break-words">{{ greeting }}, {{ firstName }}</h1>
        <p class="font-mono text-[11px] uppercase tracking-wider text-gray-400 mt-0.5">{{ currentDate }}</p>
      </div>

      <!-- Quick Metrics Header (Pills style - Responsive wrap on mobile, row on tablet/desktop) -->
      <div v-if="statsLoading" class="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 py-1 w-full md:w-auto">
        <div v-for="i in 3" :key="i" class="h-6.5 sm:h-7 w-24 sm:w-28 bg-gray-200 rounded-full animate-pulse shrink-0"></div>
      </div>
      <div v-else class="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 py-1 w-full md:w-auto">
        <div class="bg-white/80 border border-gray-200 hover:border-gray-300 px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span class="font-mono text-[10px] sm:text-[11px] font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">{{ stats.totalStudents.toLocaleString() }} Students</span>
        </div>
        <div class="bg-white/80 border border-gray-200 hover:border-gray-300 px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all">
          <span class="w-1.5 h-1.5 rounded-full bg-ic-primary shrink-0"></span>
          <span class="font-mono text-[10px] sm:text-[11px] font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">{{ stats.totalEvents }} Events</span>
        </div>
        <div class="bg-white/80 border border-gray-200 hover:border-gray-300 px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
          <span class="font-mono text-[10px] sm:text-[11px] font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">{{ stats.totalAttendance.toLocaleString() }} Scans</span>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton (Matches the actual structure) -->
    <div v-if="statsLoading && recentEvents.length === 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Events Card Skeleton -->
        <div class="space-y-3">
          <div class="flex justify-between items-center px-1">
            <div class="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
            <div class="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
            <div v-for="i in 3" :key="i" class="px-5 py-3.5 flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-gray-100 animate-pulse shrink-0"></div>
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
          <div v-for="i in 2" :key="i" class="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
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
          <div v-for="i in 2" :key="i" class="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div class="h-2.5 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div class="h-60 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Desktop Sidebar Skeleton -->
      <div class="hidden lg:block">
        <div class="space-y-5">
          <div class="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
                <div class="h-2.5 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div v-for="i in 2" :key="i" class="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
            <div class="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div class="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div class="border-t border-gray-100 pt-3 space-y-2">
              <div class="h-8 bg-gray-100 rounded-xl w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Feed + Events Card (2 cols) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Clean Card List View: Recent Events -->
        <div class="space-y-3">
          <div class="flex items-center justify-between px-1">
            <span class="font-pixel text-sm text-gray-400 lowercase">01 — recent events</span>
            <router-link 
              to="/admin/events" 
              class="font-mono text-[11px] font-medium text-gray-400 hover:text-ic-primary uppercase tracking-wider transition-colors inline-flex items-center gap-1"
            >
              <span>all events</span>
              <span class="text-xs">→</span>
            </router-link>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div v-if="recentEvents.length === 0" class="py-12 text-center">
              <Calendar class="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p class="font-pixel text-sm text-gray-400 lowercase">no recent events scheduled</p>
            </div>
            
            <div v-else class="divide-y divide-gray-100">
              <!-- Event Item -->
              <div 
                v-for="event in recentEvents" 
                :key="event.id"
                class="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Date Badge Block -->
                  <div class="w-11 h-11 rounded-xl bg-gray-50 flex flex-col items-center justify-center shrink-0 border border-gray-200 select-none">
                    <span class="font-mono text-[9px] font-semibold text-ic-secondary tracking-wider leading-none uppercase">{{ event.month }}</span>
                    <span class="font-pixel text-base text-gray-900 leading-tight mt-0.5">{{ event.day }}</span>
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-sm font-semibold text-gray-900 truncate leading-tight">{{ event.name }}</h4>
                    <p class="font-mono text-[11px] text-gray-400 mt-1 truncate">
                      <span v-if="event.academicYear">{{ event.academicYear }}</span>
                      <span v-if="event.academicYear && event.semester"> · </span>
                      <span v-if="event.semester">{{ event.semester }}</span>
                    </p>
                  </div>
                </div>
                <button 
                  @click="openEventModal(event)"
                  class="group font-mono text-[11px] font-medium uppercase tracking-wider text-ic-primary hover:text-ic-secondary transition-colors shrink-0 focus:outline-none cursor-pointer inline-flex items-center gap-1"
                >
                  <span>details</span>
                  <span class="text-[10px] transition-transform group-hover:translate-x-0.5">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile-Only Components: Quick Actions & Statistics Widgets -->
        <div class="block lg:hidden space-y-4">
          <!-- Quick Actions Mobile Card -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <h3 class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div class="flex gap-2">
              <router-link 
                to="/admin/students" 
                class="flex-1 py-2 text-center bg-ic-primary hover:bg-ic-secondary text-white font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl transition-colors"
              >
                Students
              </router-link>
              <router-link 
                to="/admin/events" 
                class="flex-1 py-2 text-center border border-gray-200 text-gray-700 font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-colors"
              >
                Events
              </router-link>
              <router-link 
                to="/admin/posts" 
                class="flex-1 py-2 text-center border border-gray-200 text-gray-700 font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-colors"
              >
                Posts
              </router-link>
            </div>
          </div>

          <!-- Statistics Mobile Card -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <h3 class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-3.5">System Statistics</h3>
            <div class="grid grid-cols-3 gap-2.5">
              <div class="text-center p-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider">Students</p>
                <p class="font-pixel text-base sm:text-lg text-gray-900 mt-0.5">{{ stats.totalStudents.toLocaleString() }}</p>
              </div>
              <div class="text-center p-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider">Events</p>
                <p class="font-pixel text-base sm:text-lg text-gray-900 mt-0.5">{{ stats.totalEvents }}</p>
              </div>
              <div class="text-center p-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider">Scans</p>
                <p class="font-pixel text-base sm:text-lg text-gray-900 mt-0.5">{{ stats.totalAttendance.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Posts Feed -->
        <div class="space-y-3">
          <div class="flex items-center justify-between px-1">
            <span class="font-pixel text-sm text-gray-400 lowercase">02 — post feed</span>
            <router-link 
              to="/admin/posts" 
              class="font-mono text-[11px] font-medium text-gray-400 hover:text-ic-primary uppercase tracking-wider transition-colors inline-flex items-center gap-1"
            >
              <span>all posts</span>
              <span class="text-xs">→</span>
            </router-link>
          </div>

          <div v-if="postsLoading" class="space-y-4">
            <div v-for="i in 2" :key="i" class="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 animate-pulse">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-3 bg-gray-200 rounded w-24"></div>
                  <div class="h-2.5 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div class="h-20 bg-gray-50 rounded-xl"></div>
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

            <!-- More Link -->
            <div class="pt-2 text-center">
              <router-link
                to="/admin/posts"
                class="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-gray-400 hover:text-ic-primary uppercase tracking-wider transition-colors duration-200 select-none"
              >
                <span>more posts</span>
                <span class="text-xs">→</span>
              </router-link>
            </div>
          </div>

          <div v-else class="bg-white border border-gray-200 rounded-2xl py-12 px-5 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <FileText class="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p class="font-pixel text-sm text-gray-400 lowercase">no posts published yet</p>
          </div>
        </div>

      </div>

      <!-- Right Column: Sidebar (1 col - Sticky Suggestions block - Desktop Only) -->
      <div class="hidden lg:block">
        <div class="sticky top-20 space-y-5">
          <!-- Profile Card -->
          <div class="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div class="flex items-center gap-3 min-w-0 flex-1 mr-3">
              <div class="w-11 h-11 rounded-full overflow-hidden border border-gray-200 ring-2 ring-gray-50 bg-gray-50 shrink-0">
                <img 
                  :src="userAvatar" 
                  alt="Profile" 
                  @error="handleAvatarError"
                  class="w-full h-full object-cover" 
                />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-gray-900 truncate" :title="adminFullName">{{ adminFullName }}</p>
                <p class="font-mono text-[11px] text-gray-400 truncate mt-0.5">{{ adminIdentifier }}</p>
              </div>
            </div>
            <router-link to="/admin/profile" class="font-mono text-[11px] font-medium uppercase tracking-wider text-ic-primary hover:text-ic-secondary transition-colors shrink-0 whitespace-nowrap">Profile ↗</router-link>
          </div>

          <!-- Suggested Block: Administrative Statistics -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <h3 class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-4">System Statistics</h3>
            
            <div class="space-y-4">
              <!-- Total Students Item -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-ic-primary border border-pink-100 shrink-0">
                    <Users class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-900 leading-tight">Total Students</p>
                    <p class="font-mono text-[10px] text-gray-400 mt-0.5 leading-none uppercase">Student profiles</p>
                  </div>
                </div>
                <span class="font-pixel text-base text-gray-900 shrink-0">{{ stats.totalStudents.toLocaleString() }}</span>
              </div>

              <!-- Total Events Item -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-ic-primary border border-purple-100 shrink-0">
                    <Calendar class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-900 leading-tight">Total Events</p>
                    <p class="font-mono text-[10px] text-gray-400 mt-0.5 leading-none uppercase">Attendance setups</p>
                  </div>
                </div>
                <span class="font-pixel text-base text-gray-900 shrink-0">{{ stats.totalEvents }}</span>
              </div>

              <!-- Total Attendance Scans -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                    <ClipboardCheck class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-900 leading-tight">Attendance Scans</p>
                    <p class="font-mono text-[10px] text-gray-400 mt-0.5 leading-none uppercase">Logs recorded</p>
                  </div>
                </div>
                <span class="font-pixel text-base text-gray-900 shrink-0">{{ stats.totalAttendance.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Suggested Block: Quick Actions Tools -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <h3 class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-3.5">Quick Actions</h3>
            
            <div class="space-y-2">
              <router-link 
                to="/admin/students" 
                class="block w-full py-2 text-center bg-ic-primary hover:bg-ic-secondary text-white font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl transition-colors"
              >
                View Students List
              </router-link>
              <router-link 
                to="/admin/events" 
                class="block w-full py-2 text-center border border-gray-200 text-gray-700 font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-colors"
              >
                View Events Calendar
              </router-link>
              <router-link 
                to="/admin/posts" 
                class="block w-full py-2 text-center border border-gray-200 text-gray-700 font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-colors"
              >
                Manage Posts
              </router-link>
            </div>
          </div>

          <!-- Footer Copyright links mimicking instagram -->
          <div class="px-1 text-[10px] font-mono uppercase tracking-wider text-gray-400 leading-relaxed">
            <div class="flex flex-wrap gap-x-1.5 gap-y-0.5 select-none">
              <router-link to="/admin/about" class="hover:underline">About</router-link>
              <span>·</span>
              <router-link to="/admin/about#support" class="hover:underline">Help</router-link>
              <span>·</span>
              <a href="https://dnsc.edu.ph" target="_blank" rel="noopener noreferrer" class="hover:underline">DNSC IC</a>
              <span>·</span>
              <button @click="openLegalModal('terms')" class="hover:underline cursor-pointer text-left uppercase">Terms</button>
              <span>·</span>
              <button @click="openLegalModal('privacy')" class="hover:underline cursor-pointer text-left uppercase">Privacy</button>
            </div>
            <p class="mt-2 text-gray-400 tracking-wider">© 2026 IC ADMINISTRATIVE PORTAL</p>
          </div>

        </div>
      </div>
    </div>

    <!-- Terms / Privacy Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="activeModalType" 
          class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-[200]"
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
              <button @click="closeLegalModal" class="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Content -->
            <div class="p-6 overflow-y-auto text-xs text-gray-600 space-y-4 leading-relaxed flex-1">
              <template v-if="activeModalType === 'terms'">
                <p class="font-semibold text-gray-900">Welcome to the IC Administrative Portal (ICAP).</p>
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
                class="px-4 py-2 bg-ic-primary hover:bg-ic-secondary text-white font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Event Detail Dialog Modal (Solid header) -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="eventModalOpen" 
          class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-[200]"
          @click.self="closeEventModal"
        >
          <div class="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative animate-modal-pop">
            <!-- Modal Header Banner (Solid Brand Color) -->
            <div class="bg-ic-primary p-5 text-white relative">
              <button 
                @click="closeEventModal" 
                class="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors focus:outline-none cursor-pointer"
              >
                <X class="w-5 h-5" />
              </button>
              <div class="flex items-center gap-3.5 pr-8">
                <div class="w-12 h-12 rounded-xl bg-white/20 flex flex-col items-center justify-center border border-white/30 shrink-0 font-semibold">
                  <span class="font-mono text-[9px] text-white/90 leading-none uppercase">{{ selectedEvent.month }}</span>
                  <span class="font-pixel text-lg leading-tight">{{ selectedEvent.day }}</span>
                </div>
                <div>
                  <h4 class="font-semibold text-base leading-tight">{{ selectedEvent.name }}</h4>
                  <p class="font-mono text-[11px] text-white/80 mt-0.5 uppercase tracking-wider">{{ selectedEvent.semester }} {{ selectedEvent.academicYear }}</p>
                </div>
              </div>
            </div>

            <!-- Modal Body Content -->
            <div class="p-6 space-y-4.5">
              <div>
                <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</h5>
                <p class="text-sm text-gray-700 leading-relaxed">{{ selectedEvent.description }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Academic Info</h5>
                  <p class="text-sm text-gray-800 font-semibold flex items-center gap-1.5">
                    <GraduationCap class="w-3.5 h-3.5 text-ic-secondary shrink-0" />
                    <span>{{ selectedEvent.semester }}</span>
                  </p>
                </div>
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Academic Year</h5>
                  <p class="text-sm text-gray-800 font-semibold flex items-center gap-1.5">
                    <Calendar class="w-3.5 h-3.5 text-ic-primary shrink-0" />
                    <span>{{ selectedEvent.academicYear }}</span>
                  </p>
                </div>
              </div>

              <div v-if="selectedEvent.dateRange" class="border-t border-gray-100 pt-4">
                <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Event Schedule</span>
                <span class="text-xs text-gray-700 font-semibold font-mono">{{ selectedEvent.dateRange }}</span>
              </div>
            </div>

            <!-- Modal Action Button -->
            <div class="px-6 pb-6 pt-2">
              <button 
                @click="closeEventModal" 
                class="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl transition-colors focus:outline-none cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { listStudents } from '@/services/studentService'
import { listInstituteEvents, listAttendanceRecords } from '@/services/eventService'
import { listPosts, extractPosts } from '@/services/postService'
import PostFeedItem from '@/components/posts/PostFeedItem.vue'
import {
  Users,
  Calendar,
  ClipboardCheck,
  FileText,
  ArrowRight,
  X,
  ExternalLink,
  GraduationCap
} from 'lucide-vue-next'

const authStore = useAuthStore()

// Computed admin details
const adminFullName = computed(() => {
  const u = authStore.user
  if (u) {
    return `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || 'Admin User'
  }
  return 'Admin Account'
})

const firstName = computed(() => {
  const u = authStore.user
  return u?.first_name || u?.firstName || u?.username || 'Admin'
})

const adminIdentifier = computed(() => {
  return authStore.user?.username || 'System Administrator'
})

const imageLoadFailed = ref(false)

const userAvatar = computed(() => {
  const avatar = authStore.user?.user_avatar || 
                 authStore.user?.profile_url || 
                 authStore.user?.profile || 
                 '/default_profile.png'

  if (!avatar) return '/default_profile.png'
  if (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('/')) {
    return avatar
  }
  return `/${avatar}`
})

const handleAvatarError = (e) => {
  if (e.target && !e.target.src.endsWith('/default_profile.png')) {
    e.target.src = '/default_profile.png'
  } else {
    imageLoadFailed.value = true
  }
}

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
