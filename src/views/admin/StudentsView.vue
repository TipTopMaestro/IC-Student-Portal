<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-semibold text-gray-900">Students</h1>
          <div v-if="isRefreshing" class="px-2 py-0.5 text-xs text-ic-secondary bg-ic-light/30 rounded-full animate-pulse font-medium">
            Syncing...
          </div>
        </div>
        <p class="text-sm text-gray-500">{{ totalItems }} students registered</p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="flex items-center gap-3 mb-6">
      <div class="flex-1 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search students..."
          class="w-full h-9 pl-4 pr-10 text-sm bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
        />
        <svg class="w-4 h-4 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <select v-model="filterYear" class="h-9 px-4 text-sm bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-0">
        <option value="">All Years</option>
        <option value="1">1st Year</option>
        <option value="2">2nd Year</option>
        <option value="3">3rd Year</option>
        <option value="4">4th Year</option>
      </select>

      <select v-model="filterCourse" class="h-9 px-4 text-sm bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-0">
        <option value="">All Courses</option>
        <option v-for="course in availableCourses" :key="course" :value="course">{{ course }}</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && students.length === 0" class="border border-gray-200 rounded-lg py-16">
      <div class="flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-ic-primary mb-3"></div>
        <p class="text-sm text-gray-500">Loading students...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="border border-gray-200 rounded-lg py-12 text-center">
      <svg class="mx-auto h-10 w-10 text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm text-gray-900 font-medium mb-1">Failed to load students</p>
      <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
      <button @click="refresh" class="px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors">
        Try Again
      </button>
    </div>

    <!-- Students Table -->
    <template v-else>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <!-- Table Header -->
        <div class="bg-gray-50 border-b border-gray-200">
          <div class="grid grid-cols-12 gap-4 px-6 py-3">
            <div class="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</div>
            <div class="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID Number</div>
            <div class="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</div>
            <div class="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Year</div>
            <div class="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</div>
            <div class="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</div>
          </div>
        </div>

        <!-- Table Body -->
        <div class="divide-y divide-gray-100">
          <!-- Skeleton Loading Rows -->
          <template v-if="isLoading && students.length > 0">
            <div v-for="i in perPage" :key="'skel-'+i" class="grid grid-cols-12 gap-4 px-6 py-2.5">
              <div class="col-span-3 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0"></div>
                <div class="space-y-2 flex-1">
                  <div class="h-3.5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div class="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
              <div class="col-span-2 flex items-center"><div class="h-3.5 bg-gray-200 rounded animate-pulse w-2/3"></div></div>
              <div class="col-span-2 flex items-center"><div class="h-3.5 bg-gray-200 rounded animate-pulse w-3/4"></div></div>
              <div class="col-span-1 flex items-center"><div class="h-3.5 bg-gray-200 rounded animate-pulse w-1/2"></div></div>
              <div class="col-span-2 flex items-center"><div class="h-5 bg-gray-200 rounded-full animate-pulse w-16"></div></div>
              <div class="col-span-2 flex items-center justify-end"><div class="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div></div>
            </div>
          </template>

          <!-- Actual Data Rows -->
          <template v-else>
          <div 
            v-for="student in displayedStudents" 
            :key="student.id"
            class="grid grid-cols-12 gap-4 px-6 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <!-- Student Info -->
            <div class="col-span-3 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium shrink-0">
                {{ getInitials(student) }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium truncate">{{ getFullName(student) }}</p>
                <p class="text-xs text-gray-500 truncate">{{ student.s_studentID || 'N/A' }}</p>
              </div>
            </div>

            <!-- ID Number -->
            <div class="col-span-2 flex items-center">
              <p class="text-sm">{{ student.s_studentID || 'N/A' }}</p>
            </div>

            <!-- Course -->
            <div class="col-span-2 flex items-center">
              <p class="text-sm">{{ student.program_name || 'N/A' }}</p>
            </div>

            <!-- Year -->
            <div class="col-span-1 flex items-center">
              <p class="text-sm">{{ student.s_lvl ? `${student.s_lvl}` : 'N/A' }}</p>
            </div>

            <!-- Status -->
            <div class="col-span-2 flex items-center">
              <span 
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                :class="student.s_status === 'enrolled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ student.s_status || 'N/A' }}
              </span>
            </div>

            <!-- Actions -->
            <div class="col-span-2 flex items-center justify-end gap-2">
              <button 
                @click="viewStudent(student)"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                title="View"
              >
                <svg class="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          </template>
        </div>

        <!-- Empty State -->
        <div v-if="displayedStudents.length === 0 && !isLoading" class="py-12 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-sm text-gray-500">No students found</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-6">
        <p class="text-sm text-gray-500">
          Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalItems }} students
        </p>
        <div class="flex items-center gap-2">
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1 || isLoading"
            class="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="text-sm text-gray-500">Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages || isLoading"
            class="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </template>

    <!-- View Student Modal -->
    <div 
      v-if="selectedStudent && showViewModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showViewModal = false"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Student Details</h2>
          <button @click="showViewModal = false" class="p-1 hover:bg-gray-50 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-medium">
              {{ getInitials(selectedStudent) }}
            </div>
            <div>
              <h3 class="font-semibold">{{ getFullName(selectedStudent) }}</h3>
              <p class="text-sm text-gray-500">{{ selectedStudent.s_studentID || 'N/A' }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 mb-1">First Name</p>
                <p class="text-sm">{{ selectedStudent.s_fname || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Last Name</p>
                <p class="text-sm">{{ selectedStudent.s_lname || 'N/A' }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div v-if="selectedStudent.s_mname">
                <p class="text-xs text-gray-500 mb-1">Middle Name</p>
                <p class="text-sm">{{ selectedStudent.s_mname }}</p>
              </div>
              <div v-if="selectedStudent.s_suffix">
                <p class="text-xs text-gray-500 mb-1">Suffix</p>
                <p class="text-sm">{{ selectedStudent.s_suffix }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 mb-1">Course</p>
                <p class="text-sm">{{ selectedStudent.program_name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Year Level</p>
                <p class="text-sm">{{ selectedStudent.s_lvl ? `Year ${selectedStudent.s_lvl}` : 'N/A' }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 mb-1">Section</p>
                <p class="text-sm">{{ selectedStudent.s_set || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Status</p>
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                  :class="selectedStudent.s_status === 'enrolled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ selectedStudent.s_status || 'N/A' }}
                </span>
              </div>
            </div>
            <div v-if="selectedStudent.s_rfid">
              <p class="text-xs text-gray-500 mb-1">RFID</p>
              <p class="text-sm">{{ selectedStudent.s_rfid }}</p>
            </div>
          </div>
        </div>

        <button 
          @click="showViewModal = false"
          class="w-full mt-6 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { listStudents } from '@/services/studentService'
import { useSWR } from '@/composables/useSWR'

const searchQuery = ref('')
const filterYear = ref('')
const filterCourse = ref('')
const currentPage = ref(1)
const perPage = 10

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

// Generate dynamic cache key based on params
const cacheKey = computed(() => {
  const search = searchQuery.value.trim()
  return `students-page-${currentPage.value}-search-${search || 'none'}`
})

// Pass a wrapper function as the fetchFn to useSWR
const { 
  data: swrData, 
  error, 
  isLoading, 
  isRefreshing, 
  refresh 
} = useSWR(
  cacheKey,
  () => listStudents({
    current_page: currentPage.value,
    per_page: perPage,
    search: searchQuery.value.trim() || undefined
  }),
  { ttl: 60000, immediate: true }
)

// Sync SWR data to internal variables for backward compatibility and pagination calculations
watch(swrData, (newVal) => {
  if (newVal) {
    const responseData = newVal.data || newVal
    const pageData = responseData.data || responseData

    if (Array.isArray(pageData)) {
      students.value = pageData
    } else if (Array.isArray(pageData?.data)) {
      students.value = pageData.data
    } else {
      students.value = []
    }

    // Extract pagination metadata
    totalItems.value = responseData.total_items || pageData.total_items || students.value.length
    totalPages.value = responseData.total_pages || pageData.total_pages || 1
  }
}, { immediate: true })

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

// Pagination display
const paginationStart = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * perPage + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * perPage, totalItems.value)
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
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
  }, 400)
})
</script>
