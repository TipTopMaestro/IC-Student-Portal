<template>
  <div class="space-y-6 max-w-6xl mx-auto px-1 animate-fade-in-up">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        
        <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">attendance</h1>
        <p class="text-sm text-gray-500 mt-0.5">Track, review, and verify student event check-ins and fines</p>
      </div>

      <!-- Quick Counter Badge -->
      <div v-if="totalItems > 0" class="flex items-center gap-2">
        <div class="bg-white/80 border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span class="font-mono text-[10px] sm:text-[11px] font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
            {{ totalItems.toLocaleString() }} Logs
          </span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-white border border-gray-200 rounded-2xl py-12 px-6 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
      <AlertCircle class="mx-auto h-10 w-10 text-rose-400 mb-3" />
      <p class="text-sm text-gray-900 font-semibold mb-1">Attendance Records Unavailable</p>
      <p class="text-xs text-gray-500 mb-4 max-w-md mx-auto">{{ error }}</p>
      <button 
        @click="loadRecords" 
        class="px-4 py-2 bg-ic-primary text-white font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl hover:bg-ic-secondary transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>

    <template v-else>
      <!-- 01 — attendance overview -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <span class="font-pixel text-sm text-gray-400 lowercase">01 — attendance overview</span>
          <span class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">real-time summary</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Total Logs -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div class="flex items-center justify-between">
              <p class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total Logs</p>
              <span class="w-2 h-2 rounded-full bg-ic-primary/60"></span>
            </div>
            <p class="font-pixel text-3xl text-gray-900 mt-1.5 leading-none">
              <template v-if="isLoading && records.length === 0">...</template>
              <template v-else>{{ totalItems.toLocaleString() }}</template>
            </p>
            <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider mt-2">Recorded event check-ins</p>
          </div>

          <!-- Zero-Fine Rate -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div class="flex items-center justify-between">
              <p class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Clean Rate</p>
              <span 
                class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider"
                :class="zeroFineRate >= 80 ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-amber-200 bg-amber-50 text-amber-600'"
              >
                <span class="w-1 h-1 rounded-full" :class="zeroFineRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                {{ zeroFineRate >= 80 ? 'Good' : 'Review' }}
              </span>
            </div>
            <p class="font-pixel text-3xl text-gray-900 mt-1.5 leading-none">
              <template v-if="isLoading && records.length === 0">...</template>
              <template v-else>{{ zeroFineRate }}<span class="text-xl text-gray-400">%</span></template>
            </p>
            <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider mt-2">{{ cleanRecordsCount }} zero-fine records</p>
          </div>

          <!-- Assessed Fines -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div class="flex items-center justify-between">
              <p class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Page Fines</p>
              <span class="w-2 h-2 rounded-full" :class="flaggedFinesCount > 0 ? 'bg-rose-500' : 'bg-emerald-500'"></span>
            </div>
            <p class="font-pixel text-3xl text-gray-900 mt-1.5 leading-none">
              <template v-if="isLoading && records.length === 0">...</template>
              <template v-else>₱{{ totalFinesAmount.toLocaleString() }}</template>
            </p>
            <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider mt-2">{{ flaggedFinesCount }} flagged records</p>
          </div>
        </div>
      </div>

      <!-- Search and Filters Card -->
      <div class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
        <!-- Filter Header -->
        <div class="flex items-center justify-between gap-2 mb-3 px-0.5">
          <div class="flex items-center gap-2">
            <SlidersHorizontal class="w-3.5 h-3.5 text-ic-primary" />
            <span class="font-mono text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Filter Attendance Logs
            </span>
            <span 
              v-if="hasActiveFilters"
              class="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200/60 font-mono text-[10px] font-semibold text-ic-primary uppercase tracking-wider"
            >
              Active
            </span>
          </div>

          <button
            v-if="hasActiveFilters"
            @click="resetFilters"
            class="group font-mono text-[11px] font-medium uppercase tracking-wider text-gray-400 hover:text-ic-secondary transition-colors inline-flex items-center gap-1.5 cursor-pointer focus:outline-none"
          >
            <RotateCcw class="w-3 h-3 text-gray-400 group-hover:text-ic-secondary transition-transform group-hover:-rotate-90 duration-300" />
            <span>Reset</span>
          </button>
        </div>

        <!-- Controls Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <!-- Search Input (sm:col-span-5) -->
          <div class="sm:col-span-5 relative">
            <label class="block font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Search Student
            </label>
            <div class="relative">
              <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search student name, ID number..."
                class="w-full h-10 pl-10 pr-9 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ic-primary/20 focus:border-ic-primary focus:bg-white placeholder:text-gray-400 transition-all font-sans"
              />
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <!-- Event Filter (sm:col-span-3) -->
          <div class="sm:col-span-3">
            <label class="block font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Attendance Event
            </label>
            <div class="relative">
              <select 
                v-model="filterEvent" 
                class="w-full h-10 pl-3.5 pr-8 text-xs font-mono font-medium uppercase tracking-wider text-gray-700 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ic-primary/20 focus:border-ic-primary focus:bg-white transition-all cursor-pointer appearance-none truncate"
                :class="{ 'border-ic-primary/50 bg-purple-50/20 text-ic-primary': filterEvent }"
              >
                <option value="">All Events</option>
                <option v-for="event in availableEvents" :key="event" :value="event">
                  {{ event }}
                </option>
              </select>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <!-- Date Filter (sm:col-span-2) -->
          <div class="sm:col-span-2">
            <label class="block font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Event Date
            </label>
            <div class="relative">
              <select 
                v-model="filterDate" 
                class="w-full h-10 pl-3.5 pr-8 text-xs font-mono font-medium uppercase tracking-wider text-gray-700 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ic-primary/20 focus:border-ic-primary focus:bg-white transition-all cursor-pointer appearance-none truncate"
                :class="{ 'border-ic-primary/50 bg-purple-50/20 text-ic-primary': filterDate }"
              >
                <option value="">All Dates</option>
                <option v-for="date in availableDates" :key="date" :value="date">
                  {{ formatDateShort(date) }}
                </option>
              </select>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <!-- Fine Status Filter (sm:col-span-2) -->
          <div class="sm:col-span-2">
            <label class="block font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Fine Status
            </label>
            <div class="relative">
              <select 
                v-model="filterFineStatus" 
                class="w-full h-10 pl-3.5 pr-8 text-xs font-mono font-medium uppercase tracking-wider text-gray-700 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ic-primary/20 focus:border-ic-primary focus:bg-white transition-all cursor-pointer appearance-none truncate"
                :class="{ 'border-ic-primary/50 bg-purple-50/20 text-ic-primary': filterFineStatus }"
              >
                <option value="">All Records</option>
                <option value="cleared">Cleared (₱0)</option>
                <option value="fined">With Fines</option>
              </select>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <!-- Attendance Table Section -->
      <div class="space-y-3">
        <!-- Section Header -->
        <div class="flex items-center justify-between px-1">
          <span class="font-pixel text-sm text-gray-400 lowercase">02 — attendance directory</span>
          <span v-if="!isLoading && displayedRecords.length > 0" class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            showing {{ paginationStart }}–{{ paginationEnd }} of {{ totalItems }}
          </span>
          <span v-else-if="isLoading" class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider animate-pulse">
            loading records...
          </span>
        </div>

        <!-- Attendance Table Card -->
        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div class="overflow-x-auto">
            <div class="min-w-[880px] xl:min-w-0">
              <!-- Table Header -->
              <div class="bg-gray-50/80 border-b border-gray-100">
                <div class="grid grid-cols-12 gap-3 px-6 py-3.5 items-center">
                  <div class="col-span-3 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Student</div>
                  <div class="col-span-3 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Event & Date</div>
                  <div class="col-span-2 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider text-center">Morning Session</div>
                  <div class="col-span-2 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider text-center">Afternoon Session</div>
                  <div class="col-span-1 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Fines</div>
                  <div class="col-span-1 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Actions</div>
                </div>
              </div>

              <!-- Table Body -->
              <div class="divide-y divide-gray-100">
                <!-- Skeleton Loading Rows -->
                <template v-if="isLoading">
                  <div v-for="i in perPage" :key="'skel-' + i" class="grid grid-cols-12 gap-3 px-6 py-3.5 items-center animate-pulse">
                    <div class="col-span-3 flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-gray-200 shrink-0"></div>
                      <div class="space-y-1.5 flex-1 min-w-0">
                        <div class="h-3.5 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-2.5 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div class="col-span-3 space-y-1">
                      <div class="h-3.5 bg-gray-200 rounded w-2/3"></div>
                      <div class="h-2.5 bg-gray-100 rounded w-1/3"></div>
                    </div>
                    <div class="col-span-2 flex justify-center"><div class="h-5 bg-gray-200 rounded-md w-24"></div></div>
                    <div class="col-span-2 flex justify-center"><div class="h-5 bg-gray-200 rounded-md w-24"></div></div>
                    <div class="col-span-1 flex justify-end"><div class="h-5 bg-gray-200 rounded-full w-12"></div></div>
                    <div class="col-span-1 flex justify-end"><div class="h-3.5 bg-gray-200 rounded w-14"></div></div>
                  </div>
                </template>

                <!-- Data Rows -->
                <template v-else-if="displayedRecords.length > 0">
                  <div 
                    v-for="record in displayedRecords" 
                    :key="record.id"
                    class="grid grid-cols-12 gap-3 px-6 py-3 items-center hover:bg-gray-50/60 transition-colors"
                  >
                    <!-- Student Info -->
                    <div class="col-span-3 flex items-center gap-3 min-w-0">
                      <div class="w-9 h-9 rounded-full overflow-hidden border border-gray-200 ring-2 ring-gray-50 bg-gray-50 flex items-center justify-center shrink-0">
                        <img 
                          v-if="getStudentAvatar(record.student)" 
                          :src="getStudentAvatar(record.student)" 
                          alt="Profile"
                          class="w-full h-full object-cover" 
                        />
                        <span v-else class="font-mono text-xs font-semibold text-ic-primary">
                          {{ getInitials(record.student) }}
                        </span>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-semibold text-gray-900 truncate leading-tight" :title="getFullName(record.student)">
                          {{ getFullName(record.student) }}
                        </p>
                        <p class="font-mono text-[10px] text-gray-400 truncate mt-0.5">
                          {{ record.student?.s_studentID || 'NO ID' }}
                          <span v-if="record.student?.program_name"> · {{ getCourseAcronym(record.student?.program_name) }}</span>
                          <span v-if="record.student?.s_lvl"> {{ record.student.s_lvl }}{{ record.student.s_set || '' }}</span>
                        </p>
                      </div>
                    </div>

                    <!-- Event & Date -->
                    <div class="col-span-3 flex flex-col min-w-0">
                      <span 
                        class="text-xs font-semibold text-gray-800 truncate"
                        :title="record.institute_attendance_event?.attendance_event?.event_name || 'Event'"
                      >
                        {{ record.institute_attendance_event?.attendance_event?.event_name || 'Event Record' }}
                      </span>
                      <span class="font-mono text-[11px] text-gray-500 mt-0.5">
                        {{ formatDateLong(record.date) }}
                      </span>
                    </div>

                    <!-- Morning Session -->
                    <div class="col-span-2 flex items-center justify-center">
                      <div v-if="record.morning_check_in || record.morning_check_out" class="flex items-center gap-1 font-mono text-xs">
                        <span 
                          class="px-1.5 py-0.5 rounded text-[11px] font-medium"
                          :class="record.morning_check_in ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60' : 'text-gray-400 bg-gray-50'"
                        >
                          {{ formatTime(record.morning_check_in) || '—' }}
                        </span>
                        <span class="text-gray-300">–</span>
                        <span 
                          class="px-1.5 py-0.5 rounded text-[11px] font-medium"
                          :class="record.morning_check_out ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60' : 'text-gray-400 bg-gray-50'"
                        >
                          {{ formatTime(record.morning_check_out) || '—' }}
                        </span>
                      </div>
                      <span v-else class="font-mono text-xs text-gray-400">—</span>
                    </div>

                    <!-- Afternoon Session -->
                    <div class="col-span-2 flex items-center justify-center">
                      <div v-if="record.afternoon_check_in || record.afternoon_check_out" class="flex items-center gap-1 font-mono text-xs">
                        <span 
                          class="px-1.5 py-0.5 rounded text-[11px] font-medium"
                          :class="record.afternoon_check_in ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60' : 'text-gray-400 bg-gray-50'"
                        >
                          {{ formatTime(record.afternoon_check_in) || '—' }}
                        </span>
                        <span class="text-gray-300">–</span>
                        <span 
                          class="px-1.5 py-0.5 rounded text-[11px] font-medium"
                          :class="record.afternoon_check_out ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60' : 'text-gray-400 bg-gray-50'"
                        >
                          {{ formatTime(record.afternoon_check_out) || '—' }}
                        </span>
                      </div>
                      <span v-else class="font-mono text-xs text-gray-400">—</span>
                    </div>

                    <!-- Fines -->
                    <div class="col-span-1 flex items-center justify-end">
                      <span 
                        v-if="parseFloat(record.total_fines) > 0"
                        class="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 whitespace-nowrap"
                      >
                        ₱{{ parseFloat(record.total_fines).toFixed(0) }}
                      </span>
                      <span 
                        v-else
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-medium uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 whitespace-nowrap"
                      >
                        <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                        ₱0
                      </span>
                    </div>

                    <!-- Actions -->
                    <div class="col-span-1 flex items-center justify-end">
                      <button 
                        @click="viewRecord(record)"
                        class="group font-mono text-[11px] font-medium uppercase tracking-wider text-ic-primary hover:text-ic-secondary transition-colors inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                      >
                        <span>details</span>
                        <span class="text-[10px] transition-transform group-hover:translate-x-0.5">→</span>
                      </button>
                    </div>
                  </div>
                </template>

                <!-- Empty State -->
                <div v-else class="py-14 text-center">
                  <ClipboardCheck class="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p class="font-pixel text-sm text-gray-400 lowercase">no attendance records found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your search query or filters</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 px-1">
          <p class="font-mono text-[11px] text-gray-400 uppercase tracking-wider">
            Page {{ currentPage }} of {{ totalPages }} · {{ totalItems }} Total Records
          </p>
          <div class="flex items-center gap-2">
            <button 
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage <= 1 || isLoading"
              class="px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 disabled:opacity-40 transition-colors cursor-pointer inline-flex items-center gap-1 select-none"
            >
              <span class="text-[10px]">←</span>
              <span>Prev</span>
            </button>
            <span class="font-mono text-xs text-gray-600 px-1 font-semibold">{{ currentPage }} / {{ totalPages }}</span>
            <button 
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= totalPages || isLoading"
              class="px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 disabled:opacity-40 transition-colors cursor-pointer inline-flex items-center gap-1 select-none"
            >
              <span>Next</span>
              <span class="text-[10px]">→</span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- View Record Modal (Teleported to body) -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="selectedRecord && showViewModal"
          class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-[200] p-4"
          @click.self="showViewModal = false"
        >
          <div class="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 relative animate-modal-pop">
            <!-- Modal Header Banner (Solid Brand Palette) -->
            <div class="bg-ic-primary p-5 text-white relative">
              <button 
                @click="showViewModal = false" 
                class="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors focus:outline-none cursor-pointer"
              >
                <X class="w-5 h-5" />
              </button>
              <div class="flex items-center gap-3.5 pr-8">
                <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 shrink-0 font-semibold text-lg overflow-hidden">
                  <img 
                    v-if="getStudentAvatar(selectedRecord.student)" 
                    :src="getStudentAvatar(selectedRecord.student)" 
                    alt="Profile" 
                    class="w-full h-full object-cover" 
                  />
                  <span v-else class="font-mono text-sm uppercase">{{ getInitials(selectedRecord.student) }}</span>
                </div>
                <div class="min-w-0">
                  <h4 class="font-semibold text-base leading-tight truncate">{{ getFullName(selectedRecord.student) }}</h4>
                  <p class="font-mono text-[11px] text-white/80 mt-0.5 uppercase tracking-wider truncate">
                    {{ selectedRecord.student?.s_studentID || 'NO ID NUMBER' }}
                    <span v-if="selectedRecord.student?.program_name"> · {{ getCourseAcronym(selectedRecord.student?.program_name) }}</span>
                    <span v-if="selectedRecord.student?.s_lvl"> {{ selectedRecord.student.s_lvl }}{{ selectedRecord.student.s_set || '' }}</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal Body Content -->
            <div class="p-6 space-y-4">
              <!-- Event & Date Details -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Event</h5>
                  <p class="text-sm font-semibold text-gray-800 truncate" :title="selectedRecord.institute_attendance_event?.attendance_event?.event_name">
                    {{ selectedRecord.institute_attendance_event?.attendance_event?.event_name || 'General Event' }}
                  </p>
                </div>
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Date</h5>
                  <p class="font-mono text-sm text-gray-800">{{ formatDateLong(selectedRecord.date) }}</p>
                </div>
              </div>

              <!-- Academic Context / Session Info if present -->
              <div v-if="selectedRecord.institute_attendance_event" class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Academic Year</h5>
                  <p class="font-mono text-xs text-gray-700">
                    {{ selectedRecord.institute_attendance_event.academic_year || 'Current AY' }}
                  </p>
                </div>
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Semester</h5>
                  <p class="font-mono text-xs text-gray-700">
                    {{ selectedRecord.institute_attendance_event.semester ? `${selectedRecord.institute_attendance_event.semester} Semester` : 'Regular' }}
                  </p>
                </div>
              </div>

              <!-- Session Check-in / Check-out Cards -->
              <div class="border-t border-gray-100 pt-3">
                <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Session Scans</h5>
                <div class="grid grid-cols-2 gap-3">
                  <!-- Morning Card -->
                  <div class="bg-gray-50/70 border border-gray-200/70 rounded-xl p-3">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-mono text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Morning</span>
                      <span 
                        class="w-1.5 h-1.5 rounded-full" 
                        :class="(selectedRecord.morning_check_in && selectedRecord.morning_check_out) ? 'bg-emerald-500' : (selectedRecord.morning_check_in ? 'bg-amber-500' : 'bg-gray-300')"
                      ></span>
                    </div>
                    <div class="space-y-1.5 text-xs">
                      <div class="flex items-center justify-between">
                        <span class="text-gray-400 font-mono text-[10px] uppercase">Time In</span>
                        <span class="font-mono font-medium" :class="selectedRecord.morning_check_in ? 'text-emerald-700' : 'text-gray-400'">
                          {{ formatTime(selectedRecord.morning_check_in) || '—' }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-gray-400 font-mono text-[10px] uppercase">Time Out</span>
                        <span class="font-mono font-medium" :class="selectedRecord.morning_check_out ? 'text-emerald-700' : 'text-gray-400'">
                          {{ formatTime(selectedRecord.morning_check_out) || '—' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Afternoon Card -->
                  <div class="bg-gray-50/70 border border-gray-200/70 rounded-xl p-3">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-mono text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Afternoon</span>
                      <span 
                        class="w-1.5 h-1.5 rounded-full" 
                        :class="(selectedRecord.afternoon_check_in && selectedRecord.afternoon_check_out) ? 'bg-emerald-500' : (selectedRecord.afternoon_check_in ? 'bg-amber-500' : 'bg-gray-300')"
                      ></span>
                    </div>
                    <div class="space-y-1.5 text-xs">
                      <div class="flex items-center justify-between">
                        <span class="text-gray-400 font-mono text-[10px] uppercase">Time In</span>
                        <span class="font-mono font-medium" :class="selectedRecord.afternoon_check_in ? 'text-emerald-700' : 'text-gray-400'">
                          {{ formatTime(selectedRecord.afternoon_check_in) || '—' }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-gray-400 font-mono text-[10px] uppercase">Time Out</span>
                        <span class="font-mono font-medium" :class="selectedRecord.afternoon_check_out ? 'text-emerald-700' : 'text-gray-400'">
                          {{ formatTime(selectedRecord.afternoon_check_out) || '—' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Fines & Fee Summary -->
              <div class="border-t border-gray-100 pt-3">
                <div class="bg-gray-50/80 border border-gray-200/80 rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Assessed Fines</h5>
                    <p class="font-pixel text-2xl mt-0.5 leading-none" :class="parseFloat(selectedRecord.total_fines) > 0 ? 'text-rose-600' : 'text-emerald-700'">
                      ₱{{ parseFloat(selectedRecord.total_fines || 0).toFixed(2) }}
                    </p>
                  </div>
                  <div>
                    <span 
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px] font-medium uppercase tracking-wider"
                      :class="parseFloat(selectedRecord.total_fines) > 0 
                        ? (selectedRecord.fee?.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60')
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'"
                    >
                      <span class="w-1 h-1 rounded-full" :class="parseFloat(selectedRecord.total_fines) > 0 && selectedRecord.fee?.status !== 'paid' ? 'bg-rose-500' : 'bg-emerald-500'"></span>
                      {{ parseFloat(selectedRecord.total_fines) > 0 ? (selectedRecord.fee?.status || 'UNPAID') : 'CLEARED' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Action Button -->
            <div class="px-6 pb-6 pt-1">
              <button 
                @click="showViewModal = false" 
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { listAttendanceRecords } from '@/services/eventService'
import {
  Search,
  ClipboardCheck,
  AlertCircle,
  X,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-vue-next'

const searchQuery = ref('')
const filterEvent = ref('')
const filterDate = ref('')
const filterFineStatus = ref('')
const currentPage = ref(1)
const perPage = 10

const isLoading = ref(false)
const error = ref(null)
const records = ref([])
const totalItems = ref(0)
const totalPages = ref(1)

const showViewModal = ref(false)
const selectedRecord = ref(null)

// Helpers
const getFullName = (student) => {
  if (!student) return 'Unknown Student'
  if (student.full_name) return student.full_name
  const parts = [student.s_fname, student.s_mname, student.s_lname, student.s_suffix].filter(Boolean)
  return parts.join(' ') || 'Unknown Student'
}

const getInitials = (student) => {
  if (!student) return '?'
  if (student.s_fname || student.s_lname) {
    const f = (student.s_fname || '')[0] || ''
    const l = (student.s_lname || '')[0] || ''
    return (f + l).toUpperCase() || '?'
  }
  const name = student.full_name || ''
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return ((parts[0][0] || '') + (parts[parts.length - 1][0] || '')).toUpperCase()
  }
  return (name[0] || '?').toUpperCase()
}

const getStudentAvatar = (student) => {
  const avatar = student?.s_image || student?.profile_picture || student?.user_avatar || ''
  if (!avatar) return ''
  if (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('/')) {
    return avatar
  }
  return `/${avatar}`
}

// Convert program/course full name to acronym
const getCourseAcronym = (name) => {
  if (!name) return '—'
  const trimmed = name.trim()
  
  const knownMap = {
    'bachelor of science in information technology': 'BSIT',
    'bachelor of science in computer science': 'BSCS',
    'bachelor of science in information systems': 'BSIS',
    'bachelor of science in software engineering': 'BSSE',
    'associate in computer technology': 'ACT',
    'master in information technology': 'MIT',
    'master of science in information technology': 'MSIT'
  }
  const lower = trimmed.toLowerCase()
  if (knownMap[lower]) return knownMap[lower]
  
  if (trimmed.length <= 6 && trimmed === trimmed.toUpperCase()) {
    return trimmed
  }

  const stopWords = new Set(['of', 'in', 'and', 'the', 'for', 'to', 'on', 'at'])
  const words = trimmed.split(/\s+/)
  const acronym = words
    .filter(w => !stopWords.has(w.toLowerCase()))
    .map(w => w[0]?.toUpperCase() || '')
    .join('')

  return acronym || trimmed
}

// Build unique dates & events from loaded records
const availableDates = computed(() => {
  const dates = new Set(records.value.map(r => r.date).filter(Boolean))
  return Array.from(dates).sort().reverse()
})

const availableEvents = computed(() => {
  const events = new Set(
    records.value
      .map(r => r.institute_attendance_event?.attendance_event?.event_name)
      .filter(Boolean)
  )
  return Array.from(events).sort()
})

// Metrics summary calculations
const cleanRecordsCount = computed(() => {
  return records.value.filter(r => !parseFloat(r.total_fines)).length
})

const flaggedFinesCount = computed(() => {
  return records.value.filter(r => parseFloat(r.total_fines) > 0).length
})

const totalFinesAmount = computed(() => {
  return records.value.reduce((acc, r) => acc + (parseFloat(r.total_fines) || 0), 0)
})

const zeroFineRate = computed(() => {
  if (records.value.length === 0) return 100
  return Math.round((cleanRecordsCount.value / records.value.length) * 100)
})

// Client-side filters
const displayedRecords = computed(() => {
  let filtered = records.value
  if (filterDate.value) {
    filtered = filtered.filter(r => r.date === filterDate.value)
  }
  if (filterEvent.value) {
    filtered = filtered.filter(r => r.institute_attendance_event?.attendance_event?.event_name === filterEvent.value)
  }
  if (filterFineStatus.value === 'fined') {
    filtered = filtered.filter(r => parseFloat(r.total_fines) > 0)
  } else if (filterFineStatus.value === 'cleared') {
    filtered = filtered.filter(r => !parseFloat(r.total_fines))
  }
  return filtered
})

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value.trim() || filterEvent.value || filterDate.value || filterFineStatus.value)
})

const resetFilters = () => {
  searchQuery.value = ''
  filterEvent.value = ''
  filterDate.value = ''
  filterFineStatus.value = ''
}

const paginationStart = computed(() => totalItems.value === 0 ? 0 : (currentPage.value - 1) * perPage + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * perPage, totalItems.value))

const formatTime = (time) => {
  if (!time) return ''
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  if (isNaN(hour)) return time
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

const formatDateShort = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatDateLong = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const loadRecords = async () => {
  isLoading.value = true
  error.value = null

  try {
    const params = { current_page: currentPage.value, per_page: perPage }
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    const result = await listAttendanceRecords(params)

    if (result.success) {
      const responseData = result.data?.data || result.data
      const pageData = responseData?.data || responseData

      if (Array.isArray(pageData)) {
        records.value = pageData
      } else if (Array.isArray(pageData?.data)) {
        records.value = pageData.data
      } else {
        records.value = []
      }

      totalItems.value = responseData?.total_items || pageData?.total_items || records.value.length
      totalPages.value = responseData?.total_pages || pageData?.total_pages || 1
    } else {
      error.value = result.error || 'Unable to display attendance records.'
    }
  } catch (err) {
    console.error('Failed to load records:', err)
    error.value = 'Unable to display attendance records.'
  }

  isLoading.value = false
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadRecords()
}

const viewRecord = (record) => {
  selectedRecord.value = record
  showViewModal.value = true
}

// Debounced search
let searchTimeout = null
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadRecords()
  }, 400)
})

// Keyboard handler for Escape key on modal
const handleKeydown = (e) => {
  if (e.key === 'Escape' && showViewModal.value) {
    showViewModal.value = false
  }
}

onMounted(() => {
  loadRecords()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
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
