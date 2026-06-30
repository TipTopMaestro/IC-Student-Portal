<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 mb-1">Events</h1>
        <p class="text-sm text-gray-500">{{ totalItems }} events</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-2 mb-6">
      <button 
        v-for="status in ['all', 'upcoming', 'ongoing', 'completed']"
        :key="status"
        @click="filterStatus = status"
        :class="[
          'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors capitalize',
          filterStatus === status ? 'bg-gray-900 text-white' : 'border border-gray-200 hover:bg-gray-50'
        ]"
      >
        {{ status === 'all' ? 'All Events' : status }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && events.length === 0" class="py-16 text-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-ic-primary mx-auto mb-3"></div>
      <p class="text-sm text-gray-500">Loading events...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-12 text-center">
      <svg class="mx-auto h-10 w-10 text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm text-gray-900 font-medium mb-1">Failed to load events</p>
      <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
      <button @click="loadEvents" class="px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors">
        Try Again
      </button>
    </div>

    <!-- Events List -->
    <template v-else>
      <div class="space-y-3" :class="{ 'opacity-60': isLoading }">
        <div 
          v-for="event in displayedEvents" 
          :key="event.id"
          class="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-all cursor-pointer"
          @click="viewEvent(event)"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-start gap-4 flex-1 min-w-0">
              <!-- Event Icon -->
              <div class="w-11 h-11 shrink-0 rounded-lg bg-purple-50 flex items-center justify-center">
                <svg class="w-5 h-5 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <!-- Event Details -->
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold text-gray-900 mb-1">{{ getEventName(event) }}</h3>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span v-if="formatDateRange(event)">{{ formatDateRange(event) }}</span>
                  <span v-if="event.academic_year" class="flex items-center gap-1">
                    <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                    AY {{ event.academic_year }}
                  </span>
                  <span v-if="event.semester" class="flex items-center gap-1">
                    <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                    {{ event.semester }} Semester
                  </span>
                </div>
                <p v-if="getDescription(event)" class="text-sm text-gray-500 mt-1.5 line-clamp-1">{{ getDescription(event) }}</p>
              </div>
            </div>

            <!-- Status Badge -->
            <span 
              :class="['inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full shrink-0 capitalize', getStatusClass(event)]"
            >
              {{ getEventStatus(event) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="displayedEvents.length === 0 && !isLoading" class="text-center py-16 border border-gray-200 rounded-lg">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-sm text-gray-500">No {{ filterStatus !== 'all' ? filterStatus : '' }} events found</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">
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
    </template>

    <!-- View Event Modal -->
    <div 
      v-if="selectedEvent && showViewModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showViewModal = false"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Event Details</h2>
          <button @click="showViewModal = false" class="p-1 hover:bg-gray-50 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <span :class="['inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full capitalize', getStatusClass(selectedEvent)]">
              {{ getEventStatus(selectedEvent) }}
            </span>
          </div>

          <h3 class="text-lg font-semibold">{{ getEventName(selectedEvent) }}</h3>

          <div class="space-y-3 text-sm">
            <div v-if="formatDateRange(selectedEvent)" class="flex items-center gap-3 text-gray-600">
              <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDateRange(selectedEvent) }}</span>
            </div>
            <div v-if="selectedEvent.academic_year" class="flex items-center gap-3 text-gray-600">
              <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>AY {{ selectedEvent.academic_year }} · {{ selectedEvent.semester }} Semester</span>
            </div>
            <div v-if="getDescription(selectedEvent)" class="pt-3 border-t border-gray-100">
              <p class="text-gray-600 leading-relaxed">{{ getDescription(selectedEvent) }}</p>
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
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

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

const getStatusClass = (event) => {
  const status = getEventStatus(event)
  if (status === 'upcoming') return 'bg-blue-50 text-blue-600'
  if (status === 'ongoing') return 'bg-green-50 text-green-600'
  return 'bg-gray-100 text-gray-600'
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
    error.value = err.response?.data?.message || 'Failed to load events'
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
