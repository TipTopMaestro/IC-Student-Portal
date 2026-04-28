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
        <!-- Events Skeleton -->
        <div class="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div v-for="i in 3" :key="i" class="flex gap-3 mb-3">
            <div class="h-10 w-10 bg-gray-200 rounded-lg shrink-0"></div>
            <div class="flex-1"><div class="h-3 bg-gray-200 rounded w-1/3 mb-2"></div><div class="h-3 bg-gray-200 rounded w-1/2"></div></div>
          </div>
        </div>
        <!-- Right Column Skeleton (Fees + Attendance) -->
        <div class="lg:col-span-2 lg:row-span-2 space-y-4">
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
        <!-- Recent Posts Skeleton -->
        <div class="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div v-for="i in 2" :key="i" class="mb-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div class="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div class="h-12 bg-gray-100 rounded w-full"></div>
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
        <p class="text-xs text-gray-500 mb-1">Pending Items</p>
        <p class="text-xl font-semibold text-gray-900">{{ unpaidFees }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Upcoming Events</p>
        <p class="text-xl font-semibold text-gray-900">{{ upcomingEventsCount }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <div class="flex items-center justify-between mb-1">
          <p class="text-xs text-gray-500">Attendance Fines</p>
          <div class="group relative">
            <svg class="w-3 h-3 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Total unpaid fines from absences and tardiness. These are included in your Outstanding Balance.
            </div>
          </div>
        </div>
        <p class="text-xl font-semibold text-gray-900">{{ totalFines > 0 ? '₱' + totalFines.toLocaleString() : '₱0' }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <!-- Top Left: Events -->
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
      </div>

      <!-- Right: Fees + Attendance -->
      <div class="lg:col-span-2 lg:row-span-2 space-y-4">
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

      <!-- Bottom Left: Recent Posts (Ordered last on mobile) -->
      <div class="lg:col-span-3">
        <!-- Recent Posts -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-900">Recent Posts</h2>
            <router-link to="/posts" class="text-xs text-ic-primary hover:underline">View all</router-link>
          </div>
          <div v-if="postsLoading" class="p-4 space-y-4">
            <div v-for="i in 2" :key="i" class="animate-pulse">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-full bg-gray-200"></div>
                <div class="flex-1">
                  <div class="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                  <div class="h-2.5 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div class="h-12 bg-gray-100 rounded"></div>
            </div>
          </div>
          <div v-else-if="recentPosts.length > 0" class="p-4 space-y-4">
            <PostFeedItem
              v-for="post in recentPosts"
              :key="post.id"
              :post="post"
              :show-actions="false"
            />
          </div>
          <div v-else class="px-5 py-8 text-center">
            <p class="text-sm text-gray-400">No posts yet</p>
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
import { listPosts, extractPosts } from '@/services/postService'
import PostFeedItem from '@/components/posts/PostFeedItem.vue'

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
const postsLoading = ref(true)
const recentPosts = ref([])

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
        // Robust check for attendance-related fees
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
    // Note: The /attendance-records/ endpoint currently doesn't support student_id filtering
    // and returns institute-wide data. We fetch it for the 'total record' count but 
    // we no longer use it for fine calculations to ensure privacy and accuracy.
    const result = await listAttendanceRecords({ per_page: 200 })
    if (result.success) {
      const responseData = result.data.data || result.data
      const items = responseData.data || responseData
      const records = Array.isArray(items) ? items : []

      // Since we can't filter by student on this endpoint yet, we'll try to filter client-side
      // if the student record is available in the response
      const myRecords = records.filter(r => r.student?.id === studentId)

      totalEvents.value = myRecords.length
      const attended = myRecords.filter(r =>
        r.morning_check_in || r.morning_check_out || r.afternoon_check_in || r.afternoon_check_out
      )
      attendedEvents.value = attended.length
      attendanceRate.value = totalEvents.value > 0
        ? Math.round((attendedEvents.value / totalEvents.value) * 100)
        : 0
      
      // Fines are now calculated in loadFeeStats() for accuracy
    }
  } catch (e) {
    console.warn('Could not load attendance stats:', e)
  }
}

const loadRecentPosts = async () => {
  postsLoading.value = true
  try {
    const result = await listPosts({ per_page: 3 })
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
