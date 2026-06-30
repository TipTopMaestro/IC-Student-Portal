<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Academic Calendar</h1>
      <p class="text-gray-500 text-sm mt-0.5">View attendance events and important dates</p>
    </div>

    <!-- Calendar Nav -->
    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 class="text-lg font-semibold text-gray-900">{{ currentMonthYear }}</h2>
          <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button @click="goToToday" class="px-4 py-2 text-sm font-medium bg-ic-primary text-white rounded-lg hover:bg-ic-secondary transition-colors">
          Today
        </button>
      </div>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="isLoading" class="space-y-6">
      <!-- Calendar Grid Skeleton -->
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <!-- Days of Week Header -->
        <div class="grid grid-cols-7 gap-2 mb-2">
          <div v-for="day in daysOfWeek" :key="day" class="text-center py-2">
            <span class="text-xs font-semibold text-gray-500 uppercase">{{ day }}</span>
          </div>
        </div>

        <!-- Grid Cells Skeleton -->
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="i in 35"
            :key="i"
            class="min-h-20 p-2 border border-gray-200 rounded-lg animate-pulse bg-gray-50/50 space-y-2"
          >
            <div class="w-6 h-4 bg-gray-200 rounded"></div>
            <div v-if="i % 5 === 2 || i % 7 === 4" class="space-y-1">
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div v-if="i % 7 === 4" class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Events List Skeleton -->
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="p-5 border-b border-gray-200">
          <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div class="divide-y divide-gray-200">
          <div v-for="i in 3" :key="i" class="p-4 flex items-start gap-4 animate-pulse">
            <div class="shrink-0">
              <div class="h-12 w-12 rounded-lg bg-gray-200"></div>
            </div>
            <div class="flex-1 space-y-2.5 min-w-0">
              <div class="flex items-center gap-2">
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                <div class="h-4 bg-gray-200 rounded w-16 rounded-full"></div>
              </div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-else>
    <!-- Calendar Grid -->
    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <!-- Days of Week Header -->
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div v-for="day in daysOfWeek" :key="day" class="text-center py-2">
          <span class="text-xs font-semibold text-gray-500 uppercase">{{ day }}</span>
        </div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="{
            'bg-gray-50': !day.isCurrentMonth,
            'bg-purple-50 border-ic-primary': day.isToday,
            'hover:bg-gray-50': day.isCurrentMonth && !day.isToday
          }"
          class="min-h-20 p-2 border border-gray-200 rounded-lg transition-colors"
        >
          <div class="mb-1">
            <span
              :class="{
                'text-gray-300': !day.isCurrentMonth,
                'text-white bg-ic-primary rounded-full px-1.5 py-0.5 text-xs': day.isToday,
                'text-gray-900 font-medium': day.isCurrentMonth && !day.isToday
              }"
              class="text-sm"
            >
              {{ day.date }}
            </span>
          </div>

          <div v-if="day.events && day.events.length > 0" class="space-y-0.5">
            <div
              v-for="event in day.events.slice(0, 2)"
              :key="event.id"
              class="text-xs px-1 py-0.5 rounded truncate bg-purple-100 text-purple-800"
              :title="event.name"
            >
              {{ event.name }}
            </div>
            <p v-if="day.events.length > 2" class="text-xs text-gray-500">
              +{{ day.events.length - 2 }} more
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events List -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="p-5 border-b border-gray-200">
        <h2 class="text-base font-semibold text-gray-900">Events</h2>
      </div>

      <div v-if="allEvents.length === 0" class="py-10 text-center">
        <p class="text-sm text-gray-500">No events found</p>
      </div>
      <div v-else class="divide-y divide-gray-200">
        <div v-for="event in allEvents" :key="event.id" class="p-4 hover:bg-gray-50 transition-colors">
          <div class="flex items-start gap-4">
            <div class="text-center shrink-0">
              <div class="h-12 w-12 rounded-lg flex flex-col items-center justify-center" :class="getEventStatusBg(event)">
                <span class="text-xs font-medium" :class="getEventStatusText(event)">{{ getEventMonth(event) }}</span>
                <span class="text-lg font-semibold" :class="getEventStatusTextDark(event)">{{ getEventDay(event) }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-medium text-gray-900">{{ event.name }}</h3>
                <span
                  class="text-xs px-2 py-0.5 rounded-full capitalize"
                  :class="getStatusBadge(event)"
                >
                  {{ event.status }}
                </span>
              </div>
              <div class="flex items-center gap-3 text-xs text-gray-500">
                <span>{{ formatDateRange(event) }}</span>
                <span v-if="event.semester">{{ event.semester }} Semester</span>
                <span v-if="event.academicYear">AY {{ event.academicYear }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { listInstituteEvents } from '@/services/eventService'

const currentDate = ref(new Date())
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const isLoading = ref(false)
const allEvents = ref([])

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const loadEvents = async () => {
  isLoading.value = true
  try {
    const result = await listInstituteEvents({ per_page: 100 })
    if (result.success) {
      const responseData = result.data.data || result.data
      const items = responseData.data || responseData
      const eventList = Array.isArray(items) ? items : []

      allEvents.value = eventList.map(e => {
        const now = new Date()
        const start = e.start_date ? new Date(e.start_date) : null
        const end = e.end_date ? new Date(e.end_date) : null
        let status = 'upcoming'
        if (end && now > end) status = 'completed'
        else if (start && now >= start) status = 'ongoing'

        return {
          id: e.id,
          name: e.attendance_event?.event_name || e.event_name || 'Unnamed Event',
          description: e.attendance_event?.description || '',
          startDate: e.start_date,
          endDate: e.end_date,
          semester: e.semester || null,
          academicYear: e.academic_year || null,
          status
        }
      })
    }
  } catch (err) {
    console.error('Failed to load events:', err)
  }
  isLoading.value = false
}

// Build calendar days for the current month
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const prevLastDay = new Date(year, month, 0)

  const firstDayWeek = firstDay.getDay()
  const lastDate = lastDay.getDate()
  const prevLastDate = prevLastDay.getDate()

  const days = []
  const today = new Date()

  // Previous month filler days
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    days.push({ date: prevLastDate - i, isCurrentMonth: false, isToday: false, events: [] })
  }

  // Current month days
  for (let i = 1; i <= lastDate; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const dayDate = new Date(dateStr)

    // Find events that span this day
    const dayEvents = allEvents.value.filter(e => {
      const start = e.startDate ? new Date(e.startDate) : null
      const end = e.endDate ? new Date(e.endDate) : null
      if (!start) return false
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const en = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : s
      const d = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate())
      return d >= s && d <= en
    })

    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: today.getDate() === i && today.getMonth() === month && today.getFullYear() === year,
      events: dayEvents,
      fullDate: dateStr
    })
  }

  // Fill remaining to complete grid
  const remainingDays = (days.length <= 35 ? 35 : 42) - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ date: i, isCurrentMonth: false, isToday: false, events: [] })
  }

  return days
})

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
}

const getEventMonth = (event) => {
  if (!event.startDate) return '--'
  return new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

const getEventDay = (event) => {
  if (!event.startDate) return '--'
  return String(new Date(event.startDate).getDate()).padStart(2, '0')
}

const formatDateRange = (event) => {
  if (!event.startDate) return ''
  const opts = { month: 'short', day: 'numeric', year: 'numeric' }
  const start = new Date(event.startDate).toLocaleDateString('en-US', opts)
  if (!event.endDate || event.endDate === event.startDate) return start
  const end = new Date(event.endDate).toLocaleDateString('en-US', opts)
  return `${start} – ${end}`
}

const getEventStatusBg = (event) => {
  if (event.status === 'ongoing') return 'bg-green-50'
  if (event.status === 'completed') return 'bg-gray-100'
  return 'bg-blue-50'
}

const getEventStatusText = (event) => {
  if (event.status === 'ongoing') return 'text-green-700'
  if (event.status === 'completed') return 'text-gray-500'
  return 'text-blue-700'
}

const getEventStatusTextDark = (event) => {
  if (event.status === 'ongoing') return 'text-green-900'
  if (event.status === 'completed') return 'text-gray-600'
  return 'text-blue-900'
}

const getStatusBadge = (event) => {
  if (event.status === 'ongoing') return 'bg-green-50 text-green-600'
  if (event.status === 'completed') return 'bg-gray-100 text-gray-600'
  return 'bg-blue-50 text-blue-600'
}

onMounted(() => {
  loadEvents()
})
</script>
