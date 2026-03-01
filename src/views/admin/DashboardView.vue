<template>
  <div class="space-y-6">
    <!-- Page Title -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p class="text-gray-500 text-sm mt-0.5">Overview of your admin panel</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <div class="text-xs text-gray-500">Students</div>
        <div class="text-2xl font-semibold text-gray-900 mt-1">
          <span v-if="statsLoading" class="inline-block w-12 h-7 bg-gray-100 rounded animate-pulse"></span>
          <span v-else>{{ stats.totalStudents.toLocaleString() }}</span>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <div class="text-xs text-gray-500">Events</div>
        <div class="text-2xl font-semibold text-gray-900 mt-1">
          <span v-if="statsLoading" class="inline-block w-12 h-7 bg-gray-100 rounded animate-pulse"></span>
          <span v-else>{{ stats.totalEvents }}</span>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <div class="text-xs text-gray-500">Attendance Records</div>
        <div class="text-2xl font-semibold text-gray-900 mt-1">
          <span v-if="statsLoading" class="inline-block w-12 h-7 bg-gray-100 rounded animate-pulse"></span>
          <span v-else>{{ stats.totalAttendance.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
      <h2 class="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="flex gap-3">
        <router-link 
          to="/admin/students" 
          class="flex-1 py-2 text-center bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors"
        >
          View Students
        </router-link>
        <router-link 
          to="/admin/events" 
          class="flex-1 py-2 text-center border border-ic-primary text-ic-primary text-sm font-semibold rounded-lg hover:bg-purple-50 transition-colors"
        >
          View Events
        </router-link>
        <router-link 
          to="/admin/announcements" 
          class="flex-1 py-2 text-center border border-ic-primary text-ic-primary text-sm font-semibold rounded-lg hover:bg-purple-50 transition-colors"
        >
          View Announcements
        </router-link>
      </div>
    </div>

    <!-- Recent Events -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-gray-900">Recent Events</h2>
        <router-link to="/admin/events" class="text-ic-primary hover:text-ic-primary/80 text-xs font-medium">View All</router-link>
      </div>

      <div v-if="recentEvents.length === 0 && !statsLoading" class="text-sm text-gray-500 py-4 text-center">
        No events found
      </div>
      <div v-else class="space-y-0">
        <div 
          v-for="event in recentEvents" 
          :key="event.id" 
          class="py-3 border-b border-gray-100 last:border-b-0"
        >
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ getEventName(event) }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ formatDate(event) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Announcements -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-gray-900">Recent Announcements</h2>
        <router-link to="/admin/announcements" class="text-ic-primary hover:text-ic-primary/80 text-xs font-medium">View All</router-link>
      </div>
      <div class="text-center py-6">
        <div class="w-10 h-10 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-500">Coming Soon</p>
        
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listStudents } from '@/services/studentService'
import { listInstituteEvents, listAttendanceRecords } from '@/services/eventService'

const statsLoading = ref(true)

const stats = ref({
  totalStudents: 0,
  totalEvents: 0,
  totalAttendance: 0
})

const recentEvents = ref([])

const formatDate = (item) => {
  const dateStr = item.start_date || item.date || item.created_at || item.published_at
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getEventName = (event) => {
  return event.attendance_event?.event_name || event.event_name || event.name || 'Unnamed Event'
}

// Extract total count from a paginated API response
const extractTotal = (result) => {
  if (!result.success) return 0
  const d = result.data?.data || result.data
  return d?.total_items ?? d?.data?.total_items ?? 0
}

// Extract array items from response
const extractItems = (result) => {
  if (!result.success) return []
  const d = result.data?.data || result.data
  const items = d?.data || d
  return Array.isArray(items) ? items : (items?.data || [])
}

const loadDashboard = async () => {
  statsLoading.value = true

  const [studentsRes, eventsRes, attendanceRes] = await Promise.allSettled([
    listStudents({ per_page: 5 }),
    listInstituteEvents({ per_page: 5 }),
    listAttendanceRecords({ per_page: 1 })
  ])

  const studentsResult = studentsRes.status === 'fulfilled' ? studentsRes.value : { success: false }
  const eventsResult = eventsRes.status === 'fulfilled' ? eventsRes.value : { success: false }
  const attendanceResult = attendanceRes.status === 'fulfilled' ? attendanceRes.value : { success: false }

  stats.value.totalStudents = extractTotal(studentsResult)
  stats.value.totalEvents = extractTotal(eventsResult)
  stats.value.totalAttendance = extractTotal(attendanceResult)

  recentEvents.value = extractItems(eventsResult).slice(0, 5)

  statsLoading.value = false
}

onMounted(() => {
  loadDashboard()
})
</script>
