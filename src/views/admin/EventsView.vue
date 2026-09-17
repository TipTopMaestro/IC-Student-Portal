<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">events</h1>
          
        </div>
        <p class="text-sm text-gray-500">Monitor and view institutional attendance events and schedules</p>
      </div>

      <!-- Quick Metrics Counter Pill -->
      <div class="flex items-center gap-2">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
          <span class="w-2 h-2 rounded-full bg-ic-primary"></span>
          <span class="font-mono text-[10px] sm:text-[11px] font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
            {{ totalItems.toLocaleString() }} Events Scheduled
          </span>
        </div>
      </div>
    </div>

    <!-- Filter Pills Card -->
    <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Filter Header -->
        <div class="flex items-center gap-2">
          <SlidersHorizontal class="w-3.5 h-3.5 text-ic-primary shrink-0" />
          <span class="font-mono text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Filter Status
          </span>
        </div>

        <!-- Status Filter Pills -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button 
            v-for="status in ['all', 'upcoming', 'ongoing', 'completed']"
            :key="status"
            @click="filterStatus = status"
            :class="[
              'px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer select-none',
              filterStatus === status 
                ? 'bg-ic-primary text-white shadow-[0_2px_8px_-2px_rgba(100,13,95,0.4)]' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/80'
            ]"
          >
            {{ status === 'all' ? 'All Events' : status }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-white border border-gray-200 rounded-2xl py-12 px-6 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
      <AlertCircle class="mx-auto h-10 w-10 text-rose-400 mb-3" />
      <p class="text-sm text-gray-900 font-semibold mb-1">Events Unavailable</p>
      <p class="text-xs text-gray-500 mb-4 max-w-md mx-auto">{{ error }}</p>
      <button 
        @click="loadEvents" 
        class="px-4 py-2 bg-ic-primary text-white font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl hover:bg-ic-secondary transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>

    <!-- Events List Section -->
    <div v-else class="space-y-3">
      <!-- Section Header -->
      <div class="flex items-center justify-between px-1">
        <span class="font-pixel text-sm text-gray-400 lowercase">01 — attendance events</span>
        <span v-if="!isLoading && displayedEvents.length > 0" class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          {{ displayedEvents.length }} {{ displayedEvents.length === 1 ? 'event' : 'events' }} shown
        </span>
        <span v-else-if="isLoading" class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider animate-pulse">
          loading events...
        </span>
      </div>

      <!-- Events Cards Stack -->
      <div class="space-y-3">
        <!-- Skeleton Loading Cards -->
        <template v-if="isLoading">
          <div 
            v-for="i in 4" 
            :key="'event-skel-' + i"
            class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] animate-pulse"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <!-- Left Side: Date Box Skeleton + Details Skeleton -->
              <div class="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-gray-200 shrink-0"></div>
                <div class="space-y-2 flex-1 min-w-0">
                  <div class="h-4 bg-gray-200 rounded w-2/5"></div>
                  <div class="h-3 bg-gray-100 rounded w-3/5"></div>
                  <div class="h-2.5 bg-gray-100 rounded w-4/5"></div>
                </div>
              </div>

              <!-- Right Side: Status Badge Skeleton + Button Skeleton -->
              <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div class="h-6 w-20 bg-gray-200 rounded-full"></div>
                <div class="h-3.5 w-14 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </template>
        <!-- Event Cards List -->
        <template v-else-if="displayedEvents.length > 0">
          <div 
            v-for="event in displayedEvents" 
            :key="event.id"
            @click="viewEvent(event)"
            class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
          >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- Left Side: Date Badge + Details -->
            <div class="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
              <!-- Date Block Badge -->
              <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center shrink-0 select-none group-hover:border-ic-accent/40 group-hover:bg-purple-50/40 transition-colors">
                <span class="font-mono text-[9px] font-semibold text-ic-secondary tracking-wider leading-none uppercase">
                  {{ getEventDateInfo(event).month }}
                </span>
                <span class="font-pixel text-base text-gray-900 leading-tight mt-0.5">
                  {{ getEventDateInfo(event).day }}
                </span>
              </div>

              <!-- Main Details -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-ic-primary transition-colors truncate">
                    {{ getEventName(event) }}
                  </h3>
                </div>

                <!-- Metadata Row -->
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-gray-400">
                  <span v-if="formatDateRange(event)" class="text-gray-600 font-medium">
                    {{ formatDateRange(event) }}
                  </span>
                  <span v-if="event.academic_year" class="flex items-center gap-1.5">
                    <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>AY {{ event.academic_year }}</span>
                  </span>
                  <span v-if="event.semester" class="flex items-center gap-1.5">
                    <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{{ event.semester }} Sem</span>
                  </span>
                </div>

                <p v-if="getDescription(event)" class="text-xs text-gray-500 mt-1.5 line-clamp-1">
                  {{ getDescription(event) }}
                </p>
              </div>
            </div>

            <!-- Right Side: Status Badge + Action Link -->
            <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              <!-- Status Badge -->
              <span 
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-medium uppercase tracking-wider whitespace-nowrap"
                :class="getStatusBadgeClasses(event)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(event)"></span>
                {{ getEventStatus(event) }}
              </span>

              <!-- Action Link -->
              <button 
                class="font-mono text-[11px] font-medium uppercase tracking-wider text-ic-primary group-hover:text-ic-secondary transition-colors inline-flex items-center gap-1 focus:outline-none cursor-pointer"
              >
                <span>details</span>
                <span class="text-[10px] transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>
          </div>
        </div>
        </template>

        <!-- Empty State -->
        <div v-if="displayedEvents.length === 0 && !isLoading" class="bg-white border border-gray-200 rounded-2xl py-16 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
          <CalendarIcon class="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p class="font-pixel text-sm text-gray-400 lowercase">no {{ filterStatus !== 'all' ? filterStatus : '' }} events found</p>
          <p class="text-xs text-gray-400 mt-1">There are no events currently recorded under this filter.</p>
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

    <!-- View Event Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="selectedEvent && showViewModal"
          class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-[200]"
          @click.self="showViewModal = false"
        >
          <div class="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative animate-modal-pop">
            <!-- Modal Header Banner -->
            <div class="bg-ic-primary p-5 text-white relative">
              <button 
                @click="showViewModal = false" 
                class="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors focus:outline-none cursor-pointer"
                aria-label="Close modal"
              >
                <X class="w-5 h-5" />
              </button>
              
              <div class="flex items-center gap-3.5 pr-8">
                <div class="w-12 h-12 rounded-xl bg-white/20 flex flex-col items-center justify-center border border-white/30 shrink-0 select-none">
                  <span class="font-mono text-[9px] text-white/90 leading-none uppercase">
                    {{ getEventDateInfo(selectedEvent).month }}
                  </span>
                  <span class="font-pixel text-lg leading-tight mt-0.5">
                    {{ getEventDateInfo(selectedEvent).day }}
                  </span>
                </div>
                <div class="min-w-0">
                  <h4 class="font-semibold text-base leading-tight truncate">
                    {{ getEventName(selectedEvent) }}
                  </h4>
                  <p class="font-mono text-[11px] text-white/80 mt-0.5 uppercase tracking-wider truncate">
                    <span v-if="selectedEvent.academic_year">AY {{ selectedEvent.academic_year }}</span>
                    <span v-if="selectedEvent.academic_year && selectedEvent.semester"> · </span>
                    <span v-if="selectedEvent.semester">{{ selectedEvent.semester }} Semester</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal Body Content -->
            <div class="p-6 space-y-4">
              <!-- Status Pill -->
              <div>
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-medium uppercase tracking-wider"
                  :class="getStatusBadgeClasses(selectedEvent)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(selectedEvent)"></span>
                  {{ getEventStatus(selectedEvent) }}
                </span>
              </div>

              <!-- Description -->
              <div v-if="getDescription(selectedEvent)">
                <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</h5>
                <p class="text-sm text-gray-700 leading-relaxed">{{ getDescription(selectedEvent) }}</p>
              </div>

              <!-- Academic Info Grid -->
              <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Semester</h5>
                  <p class="text-sm text-gray-800 font-semibold flex items-center gap-1.5">
                    <GraduationCap class="w-3.5 h-3.5 text-ic-secondary shrink-0" />
                    <span>{{ selectedEvent.semester ? `${selectedEvent.semester} Sem` : '—' }}</span>
                  </p>
                </div>
                <div>
                  <h5 class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Academic Year</h5>
                  <p class="text-sm text-gray-800 font-semibold flex items-center gap-1.5">
                    <CalendarIcon class="w-3.5 h-3.5 text-ic-primary shrink-0" />
                    <span>{{ selectedEvent.academic_year ? `AY ${selectedEvent.academic_year}` : '—' }}</span>
                  </p>
                </div>
              </div>

              <!-- Schedule Range -->
              <div v-if="formatDateRange(selectedEvent)" class="border-t border-gray-100 pt-4">
                <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Event Schedule</span>
                <span class="text-xs text-gray-700 font-semibold font-mono">{{ formatDateRange(selectedEvent) }}</span>
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
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import {
  Calendar as CalendarIcon,
  SlidersHorizontal,
  AlertCircle,
  X,
  GraduationCap
} from 'lucide-vue-next'

const filterStatus = ref('all')
const currentPage = ref(1)

const isLoading = ref(false)
const error = ref(null)
const events = ref([])
const totalItems = ref(0)
const totalPages = ref(1)

const showViewModal = ref(false)
const selectedEvent = ref(null)

// Field accessors — handles both institute-attendance-event and attendance-events structures
const getEventName = (event) => {
  return event.attendance_event?.event_name || event.event_name || 'Unnamed Event'
}

const getDescription = (event) => {
  return event.attendance_event?.description || event.description || null
}

const getEventDateInfo = (event) => {
  const start = event.start_date ? new Date(event.start_date) : null
  if (!start || isNaN(start.getTime())) {
    return { day: '--', month: 'EVT' }
  }
  return {
    day: String(start.getDate()).padStart(2, '0'),
    month: start.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  }
}

const getEventStatus = (event) => {
  // Prioritize date-based calculation over backend event_status
  const now = new Date()
  const start = event.start_date ? new Date(event.start_date) : null
  const end = event.end_date ? new Date(event.end_date) : null
  if (end && now > end) return 'completed'
  if (start && now >= start) return 'ongoing'
  if (start) return 'upcoming'
  // Fallback to backend status if no dates available
  if (event.event_status) return event.event_status
  return 'upcoming'
}

const getStatusBadgeClasses = (event) => {
  const status = getEventStatus(event)
  if (status === 'upcoming') {
    return 'bg-blue-50 text-blue-700 border border-blue-200/60'
  }
  if (status === 'ongoing') {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
  }
  return 'bg-gray-100 text-gray-600 border border-gray-200'
}

const getStatusDotClass = (event) => {
  const status = getEventStatus(event)
  if (status === 'upcoming') return 'bg-blue-500'
  if (status === 'ongoing') return 'bg-emerald-500 animate-pulse'
  return 'bg-gray-400'
}

const formatDateRange = (event) => {
  const start = event.start_date
  const end = event.end_date
  if (!start) return null
  const opts = { year: 'numeric', month: 'short', day: 'numeric' }
  const startStr = new Date(start).toLocaleDateString('en-US', opts)
  if (!end || end === start) return startStr
  const endStr = new Date(end).toLocaleDateString('en-US', opts)
  return `${startStr} – ${endStr}`
}

const displayedEvents = computed(() => {
  if (filterStatus.value === 'all') return events.value
  return events.value.filter(e => getEventStatus(e) === filterStatus.value)
})

const loadEvents = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Use institute-attendance-event for richer data (dates, academic year, semester, status)
    const response = await api.get('/api/v1/institute-attendance-event/', {
      params: { current_page: currentPage.value, per_page: 50 }
    })

    const result = response.data
    const responseData = result.data || result
    const pageData = responseData.data || responseData

    if (Array.isArray(pageData)) {
      events.value = pageData
    } else if (Array.isArray(pageData?.data)) {
      events.value = pageData.data
    } else {
      events.value = []
    }

    totalItems.value = responseData.total_items || events.value.length
    totalPages.value = responseData.total_pages || 1
  } catch (err) {
    console.error('Failed to load events:', err)
    const status = err.response?.status
    if (status === 401 || status === 403) {
      error.value = 'You do not have permission to view events.'
    } else if (status >= 500) {
      error.value = 'Server error. Try again later.'
    } else if (!err.response && err.request) {
      error.value = 'Network error. Check your connection.'
    } else {
      error.value = 'Unable to display events at this time.'
    }
  }

  isLoading.value = false
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadEvents()
}

const viewEvent = (event) => {
  selectedEvent.value = event
  showViewModal.value = true
}

onMounted(() => {
  loadEvents()
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
