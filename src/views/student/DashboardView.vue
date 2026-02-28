<template>
  <div class="space-y-5">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">{{ greeting }}, {{ firstName }}</h1>
      <p class="text-gray-500 text-sm mt-0.5">{{ currentDate }}</p>
    </div>

    <!-- Loading Skeleton -->
    <template v-if="isLoading">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="i in 4" :key="i" class="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-7 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div class="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div v-for="i in 3" :key="i" class="flex gap-3 mb-3">
            <div class="h-10 w-10 bg-gray-200 rounded-lg shrink-0"></div>
            <div class="flex-1"><div class="h-3 bg-gray-200 rounded w-1/3 mb-2"></div><div class="h-3 bg-gray-200 rounded w-1/2"></div></div>
          </div>
        </div>
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div class="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div class="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div class="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Attendance Rate</p>
        <p class="text-xl font-semibold text-gray-900">{{ attendanceRate }}%</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Unpaid Fees</p>
        <p class="text-xl font-semibold text-gray-900">{{ unpaidFees }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Events</p>
        <p class="text-xl font-semibold text-gray-900">{{ upcomingEventsCount }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Total Fines</p>
        <p class="text-xl font-semibold text-gray-900">{{ totalFines > 0 ? '₱' + totalFines.toLocaleString() : '—' }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <!-- Left: Events + Announcements -->
      <div class="lg:col-span-3 space-y-4">
        <!-- Events -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-900">Upcoming Events</h2>
            <router-link to="/calendar" class="text-xs text-ic-primary hover:underline">View calendar</router-link>
          </div>
          <div v-if="upcomingEventsList.length === 0" class="px-5 py-8 text-center">
            <p class="text-sm text-gray-400">No upcoming events</p>
          </div>
          <div v-else class="divide-y divide-gray-100">
            <div v-for="event in upcomingEventsList" :key="event.id" class="px-5 py-3 flex items-center gap-3">
              <div class="h-10 w-10 rounded-lg bg-gray-50 flex flex-col items-center justify-center shrink-0">
                <span class="text-[10px] font-medium text-gray-500 leading-none">{{ event.month }}</span>
                <span class="text-sm font-semibold text-gray-900 leading-tight">{{ event.day }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ event.name }}</p>
                <p class="text-xs text-gray-500">
                  <span v-if="event.semester">{{ event.semester }}</span>
                  <span v-if="event.semester && event.academicYear"> · </span>
                  <span v-if="event.academicYear">{{ event.academicYear }}</span>
                  <span v-if="!event.semester && !event.academicYear && event.date">{{ formatDate(event.date) }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Announcements -->
        <div class="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-gray-900">Announcements</h2>
          <span class="text-xs text-gray-400">Coming soon</span>
        </div>
      </div>

      <!-- Right: Fees + Attendance -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Fees -->
        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-semibold text-gray-900">Outstanding Balance</h2>
            <router-link to="/fees" class="text-xs text-ic-primary hover:underline">View all</router-link>
          </div>
          <p class="text-2xl font-semibold text-gray-900 mb-3">₱{{ totalUnpaidAmount.toLocaleString() }}</p>
          <div v-if="pendingFeesList.length > 0" class="space-y-2 pt-3 border-t border-gray-100">
            <div v-for="fee in pendingFeesList" :key="fee.id" class="flex items-center justify-between">
              <span class="text-xs text-gray-600 truncate mr-2">{{ fee.name }}</span>
              <span class="text-xs font-medium text-gray-900 shrink-0">₱{{ fee.amount.toLocaleString() }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-gray-400">No pending fees</p>
        </div>

        <!-- Attendance -->
        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <h2 class="text-sm font-semibold text-gray-900 mb-3">Attendance</h2>
          <div class="flex items-baseline gap-1.5 mb-3">
            <span class="text-2xl font-semibold text-gray-900">{{ attendanceRate }}%</span>
            <span class="text-xs text-gray-500">rate</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-1.5 mb-3">
            <div class="bg-ic-primary h-1.5 rounded-full transition-all" :style="{ width: attendanceRate + '%' }"></div>
          </div>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ attendedEvents }} attended</span>
            <span>{{ totalEvents }} total records</span>
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
import { getStudentFees } from '@/services/feeService'
import { listInstituteEvents, listAttendanceRecords } from '@/services/eventService'

const authStore = useAuthStore()

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

const loadEvents = async () => {
  try {
    const result = await listInstituteEvents({ per_page: 10 })
    if (result.success) {
      const responseData = result.data.data || result.data
      const items = responseData.data || responseData
      const eventList = Array.isArray(items) ? items : []

      const now = new Date()
      const upcoming = eventList.filter(e => {
        const end = e.end_date ? new Date(e.end_date) : null
        const start = e.start_date ? new Date(e.start_date) : null
        return !end || end >= now || (start && start >= now)
      })

      upcomingEventsCount.value = upcoming.length
      upcomingEventsList.value = upcoming.slice(0, 4).map(e => {
        const startDate = e.start_date ? new Date(e.start_date) : null
        return {
          id: e.id,
          name: e.attendance_event?.event_name || e.event_name || 'Unnamed Event',
          date: e.start_date,
          day: startDate ? String(startDate.getDate()).padStart(2, '0') : '--',
          month: startDate ? startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : '--',
          semester: e.semester ? `${e.semester} Semester` : '',
          academicYear: e.academic_year ? `AY ${e.academic_year}` : ''
        }
      })
    }
  } catch (e) {
    console.warn('Could not load events:', e)
  }
}

const loadAttendanceStats = async () => {
  const studentId = authStore.user?.student?.id
  if (!studentId) return
  try {
    const result = await listAttendanceRecords({ per_page: 200, student: studentId })
    if (result.success) {
      const responseData = result.data.data || result.data
      const items = responseData.data || responseData
      const records = Array.isArray(items) ? items : []

      totalEvents.value = records.length
      const attended = records.filter(r =>
        r.morning_check_in || r.morning_check_out || r.afternoon_check_in || r.afternoon_check_out
      )
      attendedEvents.value = attended.length
      attendanceRate.value = totalEvents.value > 0
        ? Math.round((attendedEvents.value / totalEvents.value) * 100)
        : 0
      totalFines.value = records.reduce((sum, r) => sum + (parseFloat(r.total_fines) || 0), 0)
    }
  } catch (e) {
    console.warn('Could not load attendance stats:', e)
  }
}

const loadDashboard = async () => {
  isLoading.value = true
  await Promise.allSettled([loadFeeStats(), loadEvents(), loadAttendanceStats()])
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
