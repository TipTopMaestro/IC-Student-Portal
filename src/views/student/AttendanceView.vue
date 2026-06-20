<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-semibold text-gray-900">Attendance</h1>
        <div v-if="isRefreshing" class="px-2 py-0.5 text-xs text-ic-secondary bg-ic-light/30 rounded-full animate-pulse font-medium">
          Syncing...
        </div>
      </div>
      <p class="text-sm text-gray-500 mt-0.5">View your event attendance records</p>
    </div>

    <!-- Loading State -->
    <template v-if="isLoading && records.length === 0">
      <div class="grid grid-cols-3 gap-3">
        <div v-for="i in 3" :key="i" class="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div v-for="i in 5" :key="i" class="h-10 bg-gray-200 rounded w-full mb-2"></div>
      </div>
    </template>

    <template v-else>
    <!-- Summary Cards -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Total Records</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ totalRecords }}</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Attended</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ attendedCount }}</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Rate</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ attendanceRate }}%</p>
      </div>
    </div>

    <!-- Attendance Records Table -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="p-5 border-b border-gray-200">
        <h2 class="text-base font-semibold text-gray-900">Attendance Records</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Morning In</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Morning Out</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Afternoon In</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Afternoon Out</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Fines</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Skeleton rows while loading next page -->
            <template v-if="isLoading && records.length > 0">
              <tr v-for="i in 10" :key="'skel-'+i">
                <td class="px-4 py-3"><div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div></td>
                <td class="px-4 py-3"><div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div></td>
                <td class="px-4 py-3"><div class="h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></td>
                <td class="px-4 py-3"><div class="h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></td>
                <td class="px-4 py-3"><div class="h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></td>
                <td class="px-4 py-3"><div class="h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></td>
                <td class="px-4 py-3"><div class="h-4 bg-gray-200 rounded animate-pulse w-10 ml-auto"></div></td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate">
                  {{ record.institute_attendance_event?.attendance_event?.event_name || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{{ formatDate(record.date) }}</td>
                <td class="px-4 py-3 text-sm text-center" :class="record.morning_check_in ? 'text-green-600' : 'text-gray-300'">
                  {{ formatTime(record.morning_check_in) }}
                </td>
                <td class="px-4 py-3 text-sm text-center" :class="record.morning_check_out ? 'text-green-600' : 'text-gray-300'">
                  {{ formatTime(record.morning_check_out) }}
                </td>
                <td class="px-4 py-3 text-sm text-center" :class="record.afternoon_check_in ? 'text-green-600' : 'text-gray-300'">
                  {{ formatTime(record.afternoon_check_in) }}
                </td>
                <td class="px-4 py-3 text-sm text-center" :class="record.afternoon_check_out ? 'text-green-600' : 'text-gray-300'">
                  {{ formatTime(record.afternoon_check_out) }}
                </td>
                <td class="px-4 py-3 text-sm text-right" :class="parseFloat(record.total_fines) > 0 ? 'text-red-600 font-medium' : 'text-gray-400'">
                  {{ parseFloat(record.total_fines) > 0 ? '₱' + parseFloat(record.total_fines).toFixed(0) : '-' }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="records.length === 0 && !isLoading" class="py-12 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p class="text-sm text-gray-500">No attendance records found</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-5 py-3 border-t border-gray-200">
        <p class="text-sm text-gray-500">Page {{ currentPage }} of {{ totalPages }}</p>
        <div class="flex items-center gap-2">
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1 || isLoading"
            class="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages || isLoading"
            class="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { listAttendanceRecords } from '@/services/eventService'
import { useSWR } from '@/composables/useSWR'

const authStore = useAuthStore()

const records = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalRecords = ref(0)

const studentId = computed(() => authStore.user?.student?.id || null)

// Set dynamic cache key based on studentId and page
const cacheKey = computed(() => {
  const sid = studentId.value
  return sid ? `attendance-student-${sid}-page-${currentPage.value}` : null
})

// Fetch attendance records using the useSWR composable
const {
  data: swrData,
  isLoading,
  isRefreshing
} = useSWR(
  cacheKey,
  () => listAttendanceRecords({
    current_page: currentPage.value,
    per_page: 20,
    student_id: studentId.value
  }),
  { ttl: 60000, immediate: true }
)

// Watch SWR response updates and sync with local view variables
watch(swrData, (newVal) => {
  if (newVal) {
    const responseData = newVal.data || newVal
    const pageData = responseData.data || responseData

    if (Array.isArray(pageData)) {
      records.value = pageData
    } else if (Array.isArray(pageData?.data)) {
      records.value = pageData.data
    } else {
      records.value = []
    }

    totalRecords.value = responseData.total_items || pageData.total_items || records.value.length
    totalPages.value = responseData.total_pages || pageData.total_pages || 1
  }
}, { immediate: true })

const attendedCount = computed(() => {
  return records.value.filter(r =>
    r.morning_check_in || r.morning_check_out || r.afternoon_check_in || r.afternoon_check_out
  ).length
})

const attendanceRate = computed(() => {
  return records.value.length > 0
    ? Math.round((attendedCount.value / records.value.length) * 100)
    : 0
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatTime = (time) => {
  if (!time) return '--:--'
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}
</script>
