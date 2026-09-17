<template>
  <div class="space-y-6 max-w-6xl mx-auto px-1 animate-fade-in-up">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        
        <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">students</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage and view enrolled student records</p>
      </div>

      <!-- Quick Counter Badge -->
      <div v-if="totalItems > 0" class="flex items-center gap-2">
        <div class="bg-white/80 border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span class="font-mono text-[10px] sm:text-[11px] font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
            {{ totalItems.toLocaleString() }} Registered
          </span>
        </div>
      </div>
    </div>

    <!-- Search and Filters Card -->
    <div class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
      <!-- Filter Controls Header / Meta Row -->
      <div class="flex items-center justify-between gap-2 mb-3 px-0.5">
        <div class="flex items-center gap-2">
          <SlidersHorizontal class="w-3.5 h-3.5 text-ic-primary" />
          <span class="font-mono text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Filter Directory
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
        <!-- Search Input (sm:col-span-6) -->
        <div class="sm:col-span-6 relative">
          <label class="block font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Search
          </label>
          <div class="relative">
            <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by student name, ID number..."
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
        
        <!-- Year Filter (sm:col-span-3) -->
        <div class="sm:col-span-3">
          <label class="block font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Year Level
          </label>
          <div class="relative">
            <select 
              v-model="filterYear" 
              class="w-full h-10 pl-3.5 pr-8 text-xs font-mono font-medium uppercase tracking-wider text-gray-700 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ic-primary/20 focus:border-ic-primary focus:bg-white transition-all cursor-pointer appearance-none truncate"
              :class="{ 'border-ic-primary/50 bg-purple-50/20 text-ic-primary': filterYear }"
            >
              <option value="">All Years</option>
              <option value="1">1st Year (1)</option>
              <option value="2">2nd Year (2)</option>
              <option value="3">3rd Year (3)</option>
              <option value="4">4th Year (4)</option>
            </select>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <!-- Course Filter (sm:col-span-3) -->
        <div class="sm:col-span-3">
          <label class="block font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Academic Course
          </label>
          <div class="relative">
            <select 
              v-model="filterCourse" 
              class="w-full h-10 pl-3.5 pr-8 text-xs font-mono font-medium uppercase tracking-wider text-gray-700 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ic-primary/20 focus:border-ic-primary focus:bg-white transition-all cursor-pointer appearance-none truncate"
              :class="{ 'border-ic-primary/50 bg-purple-50/20 text-ic-primary': filterCourse }"
            >
              <option value="">All Courses</option>
              <option v-for="course in availableCourses" :key="course" :value="course">
                {{ getCourseAcronym(course) }} — {{ course }}
              </option>
            </select>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-white border border-gray-200 rounded-2xl py-12 px-6 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
      <AlertCircle class="mx-auto h-10 w-10 text-rose-400 mb-3" />
      <p class="text-sm text-gray-900 font-semibold mb-1">Students Unavailable</p>
      <p class="text-xs text-gray-500 mb-4 max-w-md mx-auto">{{ error }}</p>
      <button 
        @click="loadStudents" 
        class="px-4 py-2 bg-ic-primary text-white font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl hover:bg-ic-secondary transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>

    <!-- Students Table Section -->
    <div v-else class="space-y-3">
      <!-- Section Header -->
      <div class="flex items-center justify-between px-1">
        <span class="font-pixel text-sm text-gray-400 lowercase">01 — student directory</span>
        <span v-if="!isLoading && displayedStudents.length > 0" class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          showing {{ paginationStart }}–{{ paginationEnd }} of {{ totalItems }}
        </span>
        <span v-else-if="isLoading" class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider animate-pulse">
          loading records...
        </span>
      </div>

      <!-- Students Table Card (12-column grid covering full width on desktop without cut-offs, horizontally scrollable on smaller screens) -->
      <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
        <div class="overflow-x-auto">
          <div class="min-w-[720px] lg:min-w-0">
            <!-- Table Header -->
            <div class="bg-gray-50/80 border-b border-gray-100">
              <div class="grid grid-cols-12 gap-3 px-6 py-3.5 items-center">
                <div class="col-span-3 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Student</div>
                <div class="col-span-2 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">ID Number</div>
                <div class="col-span-2 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Course</div>
                <div class="col-span-1 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider text-center">Year</div>
                <div class="col-span-2 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider text-center">Status</div>
                <div class="col-span-2 font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Actions</div>
              </div>
            </div>

            <!-- Table Body -->
            <div class="divide-y divide-gray-100">
              <!-- Skeleton Loading Rows (Shown when loading initial or refetching) -->
              <template v-if="isLoading">
                <div v-for="i in perPage" :key="'skel-' + i" class="grid grid-cols-12 gap-3 px-6 py-3.5 items-center animate-pulse">
                  <div class="col-span-3 flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-gray-200 shrink-0"></div>
                    <div class="space-y-1.5 flex-1 min-w-0">
                      <div class="h-3.5 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-2.5 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div class="col-span-2"><div class="h-3.5 bg-gray-200 rounded w-2/3"></div></div>
                  <div class="col-span-2"><div class="h-5 bg-gray-200 rounded-md w-14"></div></div>
                  <div class="col-span-1 flex justify-center"><div class="h-3.5 bg-gray-200 rounded w-4"></div></div>
                  <div class="col-span-2 flex justify-center"><div class="h-5 bg-gray-200 rounded-full w-20"></div></div>
                  <div class="col-span-2 flex justify-end"><div class="h-3.5 bg-gray-200 rounded w-16"></div></div>
                </div>
              </template>

              <!-- Data Rows -->
              <template v-else-if="displayedStudents.length > 0">
                <div 
                  v-for="student in displayedStudents" 
                  :key="student.id"
                  class="grid grid-cols-12 gap-3 px-6 py-3 items-center hover:bg-gray-50/60 transition-colors"
                >
                  <!-- Student Info -->
                  <div class="col-span-3 flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 rounded-full overflow-hidden border border-gray-200 ring-2 ring-gray-50 bg-gray-50 flex items-center justify-center shrink-0">
                      <img 
                        v-if="getStudentAvatar(student)" 
                        :src="getStudentAvatar(student)" 
                        alt="Profile"
                        class="w-full h-full object-cover" 
                      />
                      <span v-else class="font-mono text-xs font-semibold text-ic-primary">
                        {{ getInitials(student) }}
                      </span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-semibold text-gray-900 truncate leading-tight" :title="getFullName(student)">{{ getFullName(student) }}</p>
                      <p class="font-mono text-[10px] text-gray-400 truncate mt-0.5">{{ student.s_studentID || 'NO ID' }}</p>
                    </div>
                  </div>

                  <!-- ID Number -->
                  <div class="col-span-2 flex items-center min-w-0">
                    <span class="font-mono text-xs text-gray-600 font-medium truncate">{{ student.s_studentID || '—' }}</span>
                  </div>

                  <!-- Course -->
                  <div class="col-span-2 flex items-center min-w-0">
                    <span 
                      class="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 font-mono text-xs font-semibold text-gray-700 truncate"
                      :title="student.program_name || 'No program specified'"
                    >
                      {{ getCourseAcronym(student.program_name) }}
                    </span>
                  </div>

                  <!-- Year -->
                  <div class="col-span-1 flex items-center justify-center">
                    <span class="font-mono text-xs text-gray-600 font-medium">
                      {{ student.s_lvl || '—' }}
                    </span>
                  </div>

                  <!-- Status -->
                  <div class="col-span-2 flex items-center justify-center">
                    <span 
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium uppercase tracking-wider whitespace-nowrap"
                      :class="student.s_status === 'enrolled' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                        : 'bg-gray-50 text-gray-600 border border-gray-200'"
                    >
                      <span class="w-1 h-1 rounded-full" :class="student.s_status === 'enrolled' ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                      {{ student.s_status || 'N/A' }}
                    </span>
                  </div>

                  <!-- Actions -->
                  <div class="col-span-2 flex items-center justify-end">
                    <button 
                      @click="viewStudent(student)"
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
                <Users class="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p class="font-pixel text-sm text-gray-400 lowercase">no student records found</p>
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

    <!-- View Student Modal (Teleported to body) -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="selectedStudent && showViewModal"
          class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-[200] p-4"
          @click.self="showViewModal = false"
        >
          <div class="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 relative animate-modal-pop">
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
                    v-if="getStudentAvatar(selectedStudent)" 
                    :src="getStudentAvatar(selectedStudent)" 
                    alt="Profile" 
                    class="w-full h-full object-cover" 
                  />
                  <span v-else class="font-mono text-sm uppercase">{{ getInitials(selectedStudent) }}</span>
                </div>
                <div class="min-w-0">
                  <h4 class="font-semibold text-base leading-tight truncate">{{ getFullName(selectedStudent) }}</h4>
                  <p class="font-mono text-[11px] text-white/80 mt-0.5 uppercase tracking-wider">{{ selectedStudent.s_studentID || 'NO ID NUMBER' }}</p>
                </div>
              </div>
            </div>

            <!-- Modal Body Content -->
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">First Name</h5>
                  <p class="text-sm font-semibold text-gray-800">{{ selectedStudent.s_fname || '—' }}</p>
                </div>
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Last Name</h5>
                  <p class="text-sm font-semibold text-gray-800">{{ selectedStudent.s_lname || '—' }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Middle Name</h5>
                  <p class="text-sm text-gray-700">{{ selectedStudent.s_mname || '—' }}</p>
                </div>
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Suffix</h5>
                  <p class="text-sm text-gray-700">{{ selectedStudent.s_suffix || '—' }}</p>
                </div>
              </div>

              <div class="border-t border-gray-100 pt-3">
                <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Academic Program</h5>
                <p class="text-sm font-semibold text-gray-800">{{ selectedStudent.program_name || '—' }}</p>
              </div>

              <div class="grid grid-cols-3 gap-3 border-t border-gray-100 pt-3">
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Year Level</h5>
                  <p class="font-mono text-sm text-gray-800">{{ selectedStudent.s_lvl ? `Year ${selectedStudent.s_lvl}` : '—' }}</p>
                </div>
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Section / Set</h5>
                  <p class="font-mono text-sm text-gray-800">{{ selectedStudent.s_set || '—' }}</p>
                </div>
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</h5>
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] font-medium uppercase tracking-wider"
                    :class="selectedStudent.s_status === 'enrolled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ selectedStudent.s_status || 'N/A' }}
                  </span>
                </div>
              </div>

              <div v-if="selectedStudent.s_rfid" class="border-t border-gray-100 pt-3">
                <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">RFID UID</h5>
                <p class="font-mono text-xs font-semibold text-gray-700 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 inline-block">
                  {{ selectedStudent.s_rfid }}
                </p>
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
import { ref, computed, watch, onMounted } from 'vue'
import { listStudents } from '@/services/studentService'
import {
  Search,
  Users,
  AlertCircle,
  X,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-vue-next'

const searchQuery = ref('')
const filterYear = ref('')
const filterCourse = ref('')
const currentPage = ref(1)
const perPage = 10

const isLoading = ref(false)
const error = ref(null)
const students = ref([])
const totalItems = ref(0)
const totalPages = ref(1)

const showViewModal = ref(false)
const selectedStudent = ref(null)

// Helpers
const getFullName = (s) => {
  const parts = [s.s_fname, s.s_mname, s.s_lname, s.s_suffix].filter(Boolean)
  return parts.join(' ') || 'Unknown'
}

const getInitials = (s) => {
  const f = (s.s_fname || '')[0] || ''
  const l = (s.s_lname || '')[0] || ''
  return (f + l).toUpperCase() || '?'
}

const getStudentAvatar = (s) => {
  const avatar = s?.s_image || s?.profile_picture || s?.user_avatar || ''
  if (!avatar) return ''
  if (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('/')) {
    return avatar
  }
  return `/${avatar}`
}

// Convert program/course full name to acronym (e.g. "Bachelor of Science in Information Technology" -> "BSIT")
const getCourseAcronym = (name) => {
  if (!name) return '—'
  const trimmed = name.trim()
  
  // Specific known mappings
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
  
  // If already an acronym (short uppercase string), return as is
  if (trimmed.length <= 6 && trimmed === trimmed.toUpperCase()) {
    return trimmed
  }

  // Fallback heuristic: Extract first letter of major words (ignoring of, in, and, the, etc.)
  const stopWords = new Set(['of', 'in', 'and', 'the', 'for', 'to', 'on', 'at'])
  const words = trimmed.split(/\s+/)
  const acronym = words
    .filter(w => !stopWords.has(w.toLowerCase()))
    .map(w => w[0]?.toUpperCase() || '')
    .join('')

  return acronym || trimmed
}

// Build course list dynamically from loaded data
const availableCourses = computed(() => {
  const courses = new Set(students.value.map(s => s.program_name).filter(Boolean))
  return Array.from(courses).sort()
})

// Client-side filters on top of server-side search results
const displayedStudents = computed(() => {
  let filtered = students.value
  if (filterYear.value) {
    filtered = filtered.filter(s => String(s.s_lvl) === filterYear.value)
  }
  if (filterCourse.value) {
    filtered = filtered.filter(s => s.program_name === filterCourse.value)
  }
  return filtered
})

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value.trim() || filterYear.value || filterCourse.value)
})

const resetFilters = () => {
  searchQuery.value = ''
  filterYear.value = ''
  filterCourse.value = ''
}

// Pagination display
const paginationStart = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * perPage + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * perPage, totalItems.value)
})

// Load students from API
const loadStudents = async () => {
  isLoading.value = true
  error.value = null

  try {
    const params = { current_page: currentPage.value, per_page: perPage }
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }

    const result = await listStudents(params)

    if (result.success) {
      const responseData = result.data?.data || result.data
      const pageData = responseData?.data || responseData

      if (Array.isArray(pageData)) {
        students.value = pageData
      } else if (Array.isArray(pageData?.data)) {
        students.value = pageData.data
      } else {
        students.value = []
      }

      // Extract pagination metadata
      totalItems.value = responseData?.total_items || pageData?.total_items || students.value.length
      totalPages.value = responseData?.total_pages || pageData?.total_pages || 1
    } else {
      error.value = result.error || 'Unable to display student records.'
    }
  } catch (err) {
    console.error('Failed to load students:', err)
    error.value = 'Unable to display student records.'
  }

  isLoading.value = false
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadStudents()
}

const viewStudent = (student) => {
  selectedStudent.value = student
  showViewModal.value = true
}

// Debounced search — reloads from page 1 when search changes
let searchTimeout = null
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadStudents()
  }, 400)
})

onMounted(() => {
  loadStudents()
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
