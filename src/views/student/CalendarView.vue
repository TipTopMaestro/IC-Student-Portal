<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div>
      <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">calendar</h1>
      <p class="text-sm text-gray-500 mt-0.5">View attendance events and important academic dates</p>
    </div>

    <!-- 01 — monthly schedule -->
    <div class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <span class="font-pixel text-sm text-gray-400 lowercase">01 — monthly schedule</span>
        <button 
          @click="goToToday" 
          class="font-mono text-[11px] font-medium text-ic-primary hover:text-ic-secondary uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer"
        >
          <span>today</span>
          <span class="text-xs">↗</span>
        </button>
      </div>

      <!-- Calendar Controls & Grid Card -->
      <div class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
        <!-- Month Navigator Bar -->
        <div class="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <h2 class="font-pixel text-lg sm:text-xl text-gray-900 lowercase tracking-tight">{{ currentMonthYear }}</h2>
          </div>
          <div class="flex items-center gap-1">
            <button 
              @click="previousMonth" 
              class="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600 cursor-pointer"
              title="Previous Month"
              aria-label="Previous Month"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              @click="nextMonth" 
              class="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600 cursor-pointer"
              title="Next Month"
              aria-label="Next Month"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Days of Week Header -->
        <div class="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
          <div v-for="day in daysOfWeek" :key="day" class="text-center py-1.5">
            <span class="font-mono text-[10px] sm:text-[11px] font-medium text-gray-400 uppercase tracking-wider">{{ day }}</span>
          </div>
        </div>

        <!-- Loading Skeleton Grid -->
        <div v-if="isLoading" class="grid grid-cols-7 gap-1.5 sm:gap-2">
          <div
            v-for="i in 35"
            :key="i"
            class="min-h-18 sm:min-h-24 p-1.5 sm:p-2 border border-gray-100 rounded-xl animate-pulse bg-gray-50/50 space-y-2"
          >
            <div class="w-5 h-3 bg-gray-200 rounded"></div>
            <div v-if="i % 5 === 2 || i % 7 === 4" class="space-y-1">
              <div class="h-3 bg-gray-200 rounded w-full"></div>
              <div v-if="i % 7 === 4" class="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- Calendar Days Grid -->
        <div v-else class="grid grid-cols-7 gap-1.5 sm:gap-2">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            :class="{
              'bg-gray-50/40 text-gray-300 border-gray-100': !day.isCurrentMonth,
              'bg-purple-50/40 border-ic-primary/50 shadow-[0_0_0_1px_rgba(100,13,95,0.2)]': day.isToday,
              'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50': day.isCurrentMonth && !day.isToday
            }"
            class="min-h-18 sm:min-h-24 p-1.5 sm:p-2 border rounded-xl transition-all flex flex-col justify-between"
          >
            <!-- Date Number -->
            <div class="flex items-center justify-between">
              <span
                :class="{
                  'text-gray-300': !day.isCurrentMonth,
                  'font-mono text-[10px] sm:text-[11px] font-bold text-white bg-ic-primary rounded-full px-1.5 py-0.5 leading-none': day.isToday,
                  'font-mono text-xs text-gray-800 font-semibold': day.isCurrentMonth && !day.isToday
                }"
              >
                {{ day.date }}
              </span>
              <span v-if="day.events && day.events.length > 0" class="w-1.5 h-1.5 rounded-full bg-ic-secondary shrink-0 hidden sm:block"></span>
            </div>

            <!-- Event Tags in Cell -->
            <div v-if="day.events && day.events.length > 0" class="space-y-1 mt-1">
              <div
                v-for="event in day.events.slice(0, 2)"
                :key="event.id"
                @click="openEventModal(event)"
                class="font-mono text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium border border-[#640D5F]/15 bg-[#640D5F]/[0.06] text-[#520B4D] hover:bg-[#640D5F]/[0.12] transition-colors cursor-pointer block leading-tight"
                :title="event.name"
              >
                {{ event.name }}
              </div>
              <p 
                v-if="day.events.length > 2" 
                class="font-mono text-[9px] text-gray-400 font-medium uppercase tracking-wider pl-0.5"
              >
                +{{ day.events.length - 2 }} more
              </p>
            </div>
            <div v-else class="h-4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 02 — event directory -->
    <div class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <span class="font-pixel text-sm text-gray-400 lowercase">02 — event directory</span>
        <span class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">{{ allEvents.length }} total events</span>
      </div>

      <!-- Events List Skeleton -->
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-gray-200 shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Events List Content -->
      <div v-else>
        <!-- Empty State -->
        <div v-if="allEvents.length === 0" class="bg-white border border-gray-200 rounded-2xl py-16 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
          <svg class="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="font-pixel text-sm text-gray-400 lowercase">no events found</p>
          <p class="font-mono text-[11px] text-gray-400 mt-1 uppercase tracking-wider">events will be listed once scheduled</p>
        </div>

        <!-- Event Cards Stack -->
        <div v-else class="space-y-3">
          <div 
            v-for="event in allEvents" 
            :key="event.id"
            @click="openEventModal(event)"
            class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3.5 min-w-0 flex-1">
                <!-- Date Badge Block -->
                <div class="w-11 h-11 rounded-xl bg-gray-50 flex flex-col items-center justify-center shrink-0 border border-gray-200 select-none">
                  <span class="font-mono text-[9px] font-semibold text-ic-secondary tracking-wider leading-none uppercase">{{ getEventMonth(event) }}</span>
                  <span class="font-pixel text-base text-gray-900 leading-tight mt-0.5">{{ getEventDay(event) }}</span>
                </div>

                <!-- Event Details -->
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-sm font-semibold text-gray-900 truncate group-hover:text-ic-primary transition-colors leading-tight">{{ event.name }}</h3>
                    <span 
                      class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider shrink-0"
                      :class="getStatusBadgeClass(event.status)"
                    >
                      <span class="w-1 h-1 rounded-full" :class="getStatusDotClass(event.status)"></span>
                      {{ event.status }}
                    </span>
                  </div>
                  <p class="font-mono text-[11px] text-gray-400 uppercase tracking-wider truncate">
                    <span>{{ formatDateRange(event) }}</span>
                    <span v-if="event.semester"> · {{ event.semester }} Semester</span>
                    <span v-if="event.academicYear"> · AY {{ event.academicYear }}</span>
                  </p>
                </div>
              </div>

              <!-- Action Chevron -->
              <span class="font-mono text-[11px] font-medium uppercase tracking-wider text-gray-400 group-hover:text-ic-primary transition-colors shrink-0 inline-flex items-center gap-1">
                <span class="hidden sm:inline">details</span>
                <span class="text-xs transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Detail Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="eventModalOpen && selectedEvent" 
          class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-[100]"
          @click.self="closeEventModal"
        >
          <div class="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-gray-200/80 relative animate-modal-pop">
            <!-- Modal Header Banner -->
            <div class="bg-ic-primary p-5 text-white relative">
              <button 
                @click="closeEventModal" 
                class="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors focus:outline-none cursor-pointer"
                aria-label="Close"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div class="flex items-center gap-3.5 pr-8">
                <div class="w-12 h-12 rounded-full bg-white/20 flex flex-col items-center justify-center border border-white/30 shrink-0 font-semibold">
                  <span class="font-mono text-[9px] text-white/90 leading-none uppercase tracking-wider">{{ getEventMonth(selectedEvent) }}</span>
                  <span class="font-pixel text-xl leading-tight mt-0.5">{{ getEventDay(selectedEvent) }}</span>
                </div>
                <div>
                  <h4 class="font-semibold text-base leading-tight">{{ selectedEvent.name }}</h4>
                  <p class="font-mono text-[11px] text-white/80 mt-0.5 uppercase tracking-wider">
                    <span v-if="selectedEvent.semester">{{ selectedEvent.semester }} Semester </span>
                    <span v-if="selectedEvent.academicYear">AY {{ selectedEvent.academicYear }}</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal Body Content -->
            <div class="p-6 space-y-4.5">
              <div>
                <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</h5>
                <p class="text-sm text-gray-700 leading-relaxed">{{ selectedEvent.description || 'No detailed description provided for this academic event.' }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</h5>
                  <span 
                    class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider"
                    :class="getStatusBadgeClass(selectedEvent.status)"
                  >
                    <span class="w-1 h-1 rounded-full" :class="getStatusDotClass(selectedEvent.status)"></span>
                    {{ selectedEvent.status }}
                  </span>
                </div>
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Academic Year</h5>
                  <p class="font-mono text-xs text-gray-800 font-semibold">
                    {{ selectedEvent.academicYear || 'N/A' }}
                  </p>
                </div>
              </div>

              <div class="border-t border-gray-100 pt-4">
                <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Event Schedule</span>
                <span class="text-xs text-gray-800 font-semibold font-mono">{{ formatDateRange(selectedEvent) }}</span>
              </div>
            </div>

            <!-- Modal Action Button -->
            <div class="px-6 pb-6 pt-2">
              <button 
                @click="closeEventModal" 
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
import { ref, computed, onMounted } from 'vue'
import { listInstituteEvents } from '@/services/eventService'

const currentDate = ref(new Date())
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const isLoading = ref(false)
const allEvents = ref([])

// Modal state
const eventModalOpen = ref(false)
const selectedEvent = ref(null)

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
  if (!event?.startDate) return '--'
  return new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

const getEventDay = (event) => {
  if (!event?.startDate) return '--'
  return String(new Date(event.startDate).getDate()).padStart(2, '0')
}

const formatDateRange = (event) => {
  if (!event?.startDate) return 'No date specified'
  const opts = { month: 'short', day: 'numeric', year: 'numeric' }
  const start = new Date(event.startDate).toLocaleDateString('en-US', opts)
  if (!event.endDate || event.endDate === event.startDate) return start
  const end = new Date(event.endDate).toLocaleDateString('en-US', opts)
  return `${start} – ${end}`
}

// Custom editorial status badges (no generic AI colors)
const getStatusBadgeClass = (status) => {
  const classes = {
    ongoing: 'border-emerald-700/20 bg-emerald-600/[0.06] text-emerald-800',
    upcoming: 'border-[#640D5F]/20 bg-[#640D5F]/[0.06] text-[#520B4D]',
    completed: 'border-gray-200 bg-gray-50 text-gray-500'
  }
  return classes[status] || 'border-gray-200 bg-gray-50 text-gray-600'
}

const getStatusDotClass = (status) => {
  const classes = {
    ongoing: 'bg-emerald-600 animate-pulse',
    upcoming: 'bg-ic-primary',
    completed: 'bg-gray-400'
  }
  return classes[status] || 'bg-gray-400'
}

// Modal handlers
const openEventModal = (event) => {
  selectedEvent.value = event
  eventModalOpen.value = true
}

const closeEventModal = () => {
  eventModalOpen.value = false
  selectedEvent.value = null
}

onMounted(() => {
  loadEvents()
})
</script>
