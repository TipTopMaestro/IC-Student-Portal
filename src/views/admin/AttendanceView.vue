<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 mb-1">Attendance Records</h1>
        <p class="text-sm text-gray-500">{{ totalItems.toLocaleString() }} records</p>
      </div>
      <button 
        @click="showUploadModal = true"
        class="px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Upload Attendance
      </button>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-6">
      <div class="flex-1 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by student name..."
          class="w-full h-9 pl-4 pr-10 text-sm bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
        />
        <svg class="w-4 h-4 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <select v-model="filterDate" class="h-9 px-4 text-sm bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-0">
        <option value="">All Dates</option>
        <option v-for="date in availableDates" :key="date" :value="date">{{ formatDateShort(date) }}</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && records.length === 0" class="border border-gray-200 rounded-lg py-16">
      <div class="flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-ic-primary mb-3"></div>
        <p class="text-sm text-gray-500">Loading attendance records...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="border border-gray-200 rounded-lg py-12 text-center">
      <svg class="mx-auto h-10 w-10 text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm text-gray-900 font-medium mb-1">Failed to load attendance records</p>
      <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
      <button @click="loadRecords" class="px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors">
        Try Again
      </button>
    </div>

    <!-- Records Table -->
    <template v-else>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <!-- Table Header -->
        <div class="bg-gray-50 border-b border-gray-200">
          <div class="grid grid-cols-12 gap-2 px-4 py-3">
            <div class="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</div>
            <div class="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</div>
            <div class="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Event</div>
            <div class="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Morning</div>
            <div class="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Afternoon</div>
            <div class="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Fines</div>
            <div class="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</div>
          </div>
        </div>

        <!-- Table Body -->
        <div class="divide-y divide-gray-100">
          <!-- Skeleton Loading -->
          <template v-if="isLoading && records.length > 0">
            <div v-for="i in 10" :key="'skel-'+i" class="grid grid-cols-12 gap-2 px-4 py-5.5">
              <div class="col-span-3"><div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div></div>
              <div class="col-span-1"><div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div></div>
              <div class="col-span-2"><div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div></div>
              <div class="col-span-2"><div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div></div>
              <div class="col-span-2"><div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div></div>
              <div class="col-span-1"><div class="h-4 bg-gray-200 rounded animate-pulse w-1/2 ml-auto"></div></div>
              <div class="col-span-1"><div class="h-4 bg-gray-200 rounded animate-pulse w-1/2 ml-auto"></div></div>
            </div>
          </template>

          <!-- Data Rows -->
          <template v-else>
            <div 
              v-for="record in displayedRecords" 
              :key="record.id"
              class="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-sm"
            >
              <!-- Student -->
              <div class="col-span-3 flex items-center gap-2 min-w-0">
                <div class="min-w-0">
                  <p class="font-medium truncate">{{ record.student?.full_name || 'Unknown' }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ record.student?.program_name || '' }} {{ record.student?.s_lvl ? `- ${record.student.s_lvl}${record.student.s_set || ''}` : '' }}</p>
                </div>
              </div>

              <!-- Date -->
              <div class="col-span-1 flex items-center">
                <span class="text-gray-600">{{ formatDateShort(record.date) }}</span>
              </div>

              <!-- Event -->
              <div class="col-span-2 flex items-center">
                <span class="text-gray-600 truncate">{{ record.institute_attendance_event?.attendance_event?.event_name || '-' }}</span>
              </div>

              <!-- Morning Check-in/out -->
              <div class="col-span-2 flex items-center justify-center gap-1">
                <span :class="record.morning_check_in ? 'text-green-600' : 'text-gray-300'">
                  {{ formatTime(record.morning_check_in) }}
                </span>
                <span class="text-gray-300">–</span>
                <span :class="record.morning_check_out ? 'text-green-600' : 'text-gray-300'">
                  {{ formatTime(record.morning_check_out) }}
                </span>
              </div>

              <!-- Afternoon Check-in/out -->
              <div class="col-span-2 flex items-center justify-center gap-1">
                <span :class="record.afternoon_check_in ? 'text-green-600' : 'text-gray-300'">
                  {{ formatTime(record.afternoon_check_in) }}
                </span>
                <span class="text-gray-300">–</span>
                <span :class="record.afternoon_check_out ? 'text-green-600' : 'text-gray-300'">
                  {{ formatTime(record.afternoon_check_out) }}
                </span>
              </div>

              <!-- Fines -->
              <div class="col-span-1 flex items-center justify-end">
                <span :class="parseFloat(record.total_fines) > 0 ? 'text-red-600 font-medium' : 'text-gray-400'">
                  {{ parseFloat(record.total_fines) > 0 ? '₱' + parseFloat(record.total_fines).toFixed(0) : '-' }}
                </span>
              </div>

              <!-- Actions -->
              <div class="col-span-1 flex items-center justify-end">
                <button 
                  @click="viewRecord(record)"
                  class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="View details"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Empty State -->
        <div v-if="displayedRecords.length === 0 && !isLoading" class="py-12 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p class="text-sm text-gray-500">No attendance records found</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-6">
        <p class="text-sm text-gray-500">
          Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalItems.toLocaleString() }} records
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

    <!-- View Record Modal -->
    <div 
      v-if="selectedRecord && showViewModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showViewModal = false"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Attendance Detail</h2>
          <button @click="showViewModal = false" class="p-1 hover:bg-gray-50 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Student Info -->
          <div class="pb-4 border-b border-gray-100">
            <h3 class="font-semibold text-gray-900">{{ selectedRecord.student?.full_name || 'Unknown' }}</h3>
            <p class="text-sm text-gray-500">
              {{ selectedRecord.student?.program_name || '' }}
              {{ selectedRecord.student?.s_lvl ? ` · Year ${selectedRecord.student.s_lvl}` : '' }}
              {{ selectedRecord.student?.s_set ? ` · Section ${selectedRecord.student.s_set}` : '' }}
            </p>
          </div>

          <!-- Event & Date -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-gray-500 mb-1">Event</p>
              <p class="text-sm font-medium">{{ selectedRecord.institute_attendance_event?.attendance_event?.event_name || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Date</p>
              <p class="text-sm font-medium">{{ selectedRecord.date ? formatDateLong(selectedRecord.date) : '-' }}</p>
            </div>
          </div>

          <!-- Check-in/out Times -->
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Check-in / Check-out</p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 mb-1">Morning In</p>
                <p class="text-sm font-medium" :class="selectedRecord.morning_check_in ? 'text-green-600' : 'text-gray-400'">
                  {{ formatTime(selectedRecord.morning_check_in) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Morning Out</p>
                <p class="text-sm font-medium" :class="selectedRecord.morning_check_out ? 'text-green-600' : 'text-gray-400'">
                  {{ formatTime(selectedRecord.morning_check_out) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Afternoon In</p>
                <p class="text-sm font-medium" :class="selectedRecord.afternoon_check_in ? 'text-green-600' : 'text-gray-400'">
                  {{ formatTime(selectedRecord.afternoon_check_in) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Afternoon Out</p>
                <p class="text-sm font-medium" :class="selectedRecord.afternoon_check_out ? 'text-green-600' : 'text-gray-400'">
                  {{ formatTime(selectedRecord.afternoon_check_out) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Fines -->
          <div v-if="selectedRecord.fee || parseFloat(selectedRecord.total_fines) > 0" class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-gray-500 mb-1">Total Fines</p>
              <p class="text-sm font-semibold" :class="parseFloat(selectedRecord.total_fines) > 0 ? 'text-red-600' : ''">
                ₱{{ parseFloat(selectedRecord.total_fines || 0).toFixed(2) }}
              </p>
            </div>
            <div v-if="selectedRecord.fee">
              <p class="text-xs text-gray-500 mb-1">Fee Status</p>
              <span 
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                :class="selectedRecord.fee.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
              >
                {{ selectedRecord.fee.status || 'N/A' }}
              </span>
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

    <!-- Upload Modal -->
    <div 
      v-if="showUploadModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showUploadModal = false"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Upload Attendance</h2>
          <button @click="closeUploadModal" class="p-1 hover:bg-gray-50 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleUpload" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Select Event</label>
            <select 
              v-model="uploadData.eventId"
              required
              class="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ic-primary"
            >
              <option value="">Choose an event...</option>
              <option v-for="event in uploadEvents" :key="event.id" :value="event.id">
                {{ event.attendance_event?.event_name || event.event_name || 'Event #' + event.id }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Upload File</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-ic-primary transition-colors cursor-pointer">
              <input 
                type="file" 
                @change="handleFileSelect"
                accept=".csv,.xlsx,.xls"
                class="hidden"
                id="fileInput"
              />
              <label for="fileInput" class="cursor-pointer">
                <svg class="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm font-medium mb-1">
                  {{ uploadData.fileName || 'Click to upload or drag and drop' }}
                </p>
                <p class="text-xs text-gray-500">CSV or Excel file</p>
              </label>
            </div>
          </div>

          <div v-if="uploadError" class="text-sm text-red-500 bg-red-50 rounded-lg p-3">
            {{ uploadError }}
          </div>

          <div v-if="uploadSuccess" class="text-sm text-green-600 bg-green-50 rounded-lg p-3">
            {{ uploadSuccess }}
          </div>

          <div class="flex gap-3 pt-2">
            <button 
              type="button"
              @click="closeUploadModal"
              class="flex-1 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="!uploadData.eventId || !uploadData.file || isUploading"
              class="flex-1 px-4 py-2 text-sm font-semibold bg-ic-primary text-white rounded-lg hover:bg-ic-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isUploading ? 'Uploading...' : 'Upload' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { listAttendanceRecords, listInstituteEvents, uploadAttendance } from '@/services/eventService'

const searchQuery = ref('')
const filterDate = ref('')
const currentPage = ref(1)
const perPage = 10

const isLoading = ref(false)
const error = ref(null)
const records = ref([])
const totalItems = ref(0)
const totalPages = ref(1)

const showViewModal = ref(false)
const selectedRecord = ref(null)

const showUploadModal = ref(false)
const isUploading = ref(false)
const uploadError = ref(null)
const uploadSuccess = ref(null)
const uploadEvents = ref([])
const uploadData = ref({ eventId: '', file: null, fileName: '' })

// Build unique dates from loaded records for the date filter
const availableDates = computed(() => {
  const dates = new Set(records.value.map(r => r.date).filter(Boolean))
  return Array.from(dates).sort().reverse()
})

// Client-side filters
const displayedRecords = computed(() => {
  let filtered = records.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(r => r.student?.full_name?.toLowerCase().includes(q))
  }
  if (filterDate.value) {
    filtered = filtered.filter(r => r.date === filterDate.value)
  }
  return filtered
})

const paginationStart = computed(() => totalItems.value === 0 ? 0 : (currentPage.value - 1) * perPage + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * perPage, totalItems.value))

const formatTime = (time) => {
  if (!time) return '--:--'
  // time is in HH:MM:SS format, convert to 12h
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

const formatDateShort = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatDateLong = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const loadRecords = async () => {
  isLoading.value = true
  error.value = null

  try {
    const params = { current_page: currentPage.value, per_page: perPage }
    const result = await listAttendanceRecords(params)

    if (result.success) {
      const responseData = result.data.data || result.data
      const pageData = responseData.data || responseData

      if (Array.isArray(pageData)) {
        records.value = pageData
      } else if (Array.isArray(pageData?.data)) {
        records.value = pageData.data
      } else {
        records.value = []
      }

      totalItems.value = responseData.total_items || pageData.total_items || records.value.length
      totalPages.value = responseData.total_pages || pageData.total_pages || 1
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Failed to load records:', err)
    error.value = 'An unexpected error occurred'
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

const loadUploadEvents = async () => {
  try {
    const result = await listInstituteEvents({ per_page: 100 })
    if (result.success) {
      const responseData = result.data.data || result.data
      const pageData = responseData.data || responseData
      uploadEvents.value = Array.isArray(pageData) ? pageData : (pageData?.data || [])
    }
  } catch (err) {
    console.error('Failed to load events for upload:', err)
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    uploadData.value.file = file
    uploadData.value.fileName = file.name
  }
}

const handleUpload = async () => {
  if (!uploadData.value.eventId || !uploadData.value.file) return

  isUploading.value = true
  uploadError.value = null
  uploadSuccess.value = null

  try {
    const formData = new FormData()
    formData.append('file', uploadData.value.file)
    formData.append('event_id', uploadData.value.eventId)

    const result = await uploadAttendance(formData)

    if (result.success) {
      uploadSuccess.value = 'Attendance records uploaded successfully!'
      setTimeout(() => {
        closeUploadModal()
        loadRecords()
      }, 1500)
    } else {
      uploadError.value = result.error
    }
  } catch (err) {
    console.error('Upload failed:', err)
    uploadError.value = 'An unexpected error occurred during upload'
  }

  isUploading.value = false
}

const closeUploadModal = () => {
  showUploadModal.value = false
  uploadError.value = null
  uploadSuccess.value = null
  uploadData.value = { eventId: '', file: null, fileName: '' }
}

// Debounced search resets to page 1
let searchTimeout = null
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // Client-side filter, no need to reload
  }, 300)
})

onMounted(() => {
  loadRecords()
  loadUploadEvents()
})
</script>
