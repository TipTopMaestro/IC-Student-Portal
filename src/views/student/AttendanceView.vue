<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div>
      <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">attendance</h1>
      <p class="text-sm text-gray-500 mt-0.5">View your event attendance records</p>
    </div>

    <!-- Loading State -->
    <template v-if="isLoading && records.length === 0">
      <!-- Summary Skeleton -->
      <div class="space-y-3">
        <div class="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div v-for="i in 3" :key="i" class="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
            <div class="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
      <!-- Table Skeleton -->
      <div class="space-y-3">
        <div class="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div class="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
          <div v-for="i in 5" :key="i" class="h-10 bg-gray-100 rounded w-full mb-2"></div>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- 01 — session summary -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <span class="font-pixel text-sm text-gray-400 lowercase">01 — session summary</span>
          <router-link 
            to="/calendar" 
            class="group font-mono text-[11px] font-medium text-gray-400 hover:text-ic-primary uppercase tracking-wider transition-colors inline-flex items-center gap-1"
          >
            <span>view calendar</span>
            <span class="text-[10px] transition-transform group-hover:translate-x-0.5">→</span>
          </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <p class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total Sessions</p>
            <p class="font-pixel text-3xl text-gray-900 mt-1.5 leading-none">{{ totalSlots }}</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <p class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Attended</p>
            <p class="font-pixel text-3xl text-gray-900 mt-1.5 leading-none">{{ attendedCount }}</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div class="flex items-center justify-between">
              <p class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Rate</p>
              <span 
                class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider"
                :class="attendanceRate >= 80 
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600' 
                  : 'border-amber-200 bg-amber-50 text-amber-600'"
              >
                <span class="w-1 h-1 rounded-full" :class="attendanceRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                {{ attendanceRate >= 80 ? 'Good' : 'Low' }}
              </span>
            </div>
            <p class="font-pixel text-3xl text-gray-900 mt-1.5 leading-none">{{ attendanceRate }}<span class="text-xl text-gray-400">%</span></p>
          </div>
        </div>
      </div>

      <!-- 02 — attendance records -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <span class="font-pixel text-sm text-gray-400 lowercase">02 — attendance records</span>
          <span v-if="totalRecords > 0" class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">{{ totalRecords }} records</span>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
          <div class="overflow-x-auto">
            <table class="min-w-[760px] w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-gray-50/80">
                  <th class="px-4 py-3 text-left font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Event</th>
                  <th class="px-4 py-3 text-left font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th class="px-4 py-3 text-center font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">AM In</th>
                  <th class="px-4 py-3 text-center font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">AM Out</th>
                  <th class="px-4 py-3 text-center font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">PM In</th>
                  <th class="px-4 py-3 text-center font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">PM Out</th>
                  <th class="px-4 py-3 text-right font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Fines</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
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
                  <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate font-medium">
                      {{ record.institute_attendance_event?.attendance_event?.event_name || '-' }}
                    </td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{{ formatDate(record.date) }}</td>
                    <td class="px-4 py-3 font-mono text-xs text-center" :class="record.morning_check_in ? 'text-emerald-600' : 'text-gray-300'">
                      {{ formatTime(record.morning_check_in) }}
                    </td>
                    <td class="px-4 py-3 font-mono text-xs text-center" :class="record.morning_check_out ? 'text-emerald-600' : 'text-gray-300'">
                      {{ formatTime(record.morning_check_out) }}
                    </td>
                    <td class="px-4 py-3 font-mono text-xs text-center" :class="record.afternoon_check_in ? 'text-emerald-600' : 'text-gray-300'">
                      {{ formatTime(record.afternoon_check_in) }}
                    </td>
                    <td class="px-4 py-3 font-mono text-xs text-center" :class="record.afternoon_check_out ? 'text-emerald-600' : 'text-gray-300'">
                      {{ formatTime(record.afternoon_check_out) }}
                    </td>
                    <td class="px-4 py-3 font-mono text-xs text-right" :class="parseFloat(record.total_fines) > 0 ? 'text-red-600 font-semibold' : 'text-gray-300'">
                      {{ parseFloat(record.total_fines) > 0 ? '₱' + parseFloat(record.total_fines).toFixed(0) : '-' }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="records.length === 0 && !isLoading" class="py-16 text-center">
              <svg class="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <p class="font-pixel text-sm text-gray-400 lowercase">no attendance records yet</p>
              <p class="font-mono text-[11px] text-gray-400 mt-1 uppercase tracking-wider">records will appear after your first event</p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p class="font-mono text-[11px] text-gray-400 uppercase tracking-wider">Page {{ currentPage }} of {{ totalPages }}</p>
            <div class="flex items-center gap-2">
              <button 
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage <= 1 || isLoading"
                class="px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Prev
              </button>
              <button 
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage >= totalPages || isLoading"
                class="px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { listAttendanceRecords } from '@/services/eventService'

const authStore = useAuthStore()

const isLoading = ref(false)
const records = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalRecords = ref(0)

const attendedCount = computed(() => {
  return records.value.reduce((sum, r) => {
    let count = 0
    if (r.morning_check_in) count++
    if (r.morning_check_out) count++
    if (r.afternoon_check_in) count++
    if (r.afternoon_check_out) count++
    return sum + count
  }, 0)
})

const totalSlots = computed(() => records.value.length * 4)

const attendanceRate = computed(() => {
  return totalSlots.value > 0
    ? Math.round((attendedCount.value / totalSlots.value) * 100)
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

const loadRecords = async () => {
  isLoading.value = true
  try {
    const studentId = authStore.user?.student?.id
    if (!studentId) {
      console.warn('No student ID available for attendance query')
      isLoading.value = false
      return
    }

    const params = { current_page: currentPage.value, per_page: 20, student_id: studentId }

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

      totalRecords.value = responseData.total_items || pageData.total_items || records.value.length
      totalPages.value = responseData.total_pages || pageData.total_pages || 1
    }
  } catch (err) {
    console.error('Failed to load attendance:', err)
  }
  isLoading.value = false
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadRecords()
}

onMounted(() => {
  loadRecords()
})
</script>
