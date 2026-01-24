<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-light mb-1">Events</h1>
        <p class="text-sm text-[#8e8e8e]">{{ events.length }} events scheduled</p>
      </div>
      <button 
        @click="showCreateEventModal = true"
        class="px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors"
      >
        Create Event
      </button>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-6">
      <button 
        @click="filterStatus = 'all'"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          filterStatus === 'all' ? 'bg-[#262626] text-white' : 'border border-[#dbdbdb] hover:bg-[#fafafa]'
        ]"
      >
        All Events
      </button>
      <button 
        @click="filterStatus = 'upcoming'"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          filterStatus === 'upcoming' ? 'bg-[#262626] text-white' : 'border border-[#dbdbdb] hover:bg-[#fafafa]'
        ]"
      >
        Upcoming
      </button>
      <button 
        @click="filterStatus = 'ongoing'"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          filterStatus === 'ongoing' ? 'bg-[#262626] text-white' : 'border border-[#dbdbdb] hover:bg-[#fafafa]'
        ]"
      >
        Ongoing
      </button>
      <button 
        @click="filterStatus = 'completed'"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          filterStatus === 'completed' ? 'bg-[#262626] text-white' : 'border border-[#dbdbdb] hover:bg-[#fafafa]'
        ]"
      >
        Completed
      </button>
    </div>

    <!-- Events Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="event in filteredEvents" 
        :key="event.id"
        class="border border-[#dbdbdb] rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
      >
        <!-- Event Image/Banner -->
        <div class="aspect-video bg-gradient-to-br from-ic-primary to-ic-secondary flex items-center justify-center">
          <svg class="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Event Details -->
        <div class="p-4">
          <!-- Status Badge -->
          <div class="mb-3">
            <span 
              :class="[
                'inline-block px-2 py-1 text-xs font-medium rounded',
                event.status === 'upcoming' && 'bg-blue-50 text-blue-600',
                event.status === 'ongoing' && 'bg-green-50 text-green-600',
                event.status === 'completed' && 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ event.status.charAt(0).toUpperCase() + event.status.slice(1) }}
            </span>
          </div>

          <!-- Event Title -->
          <h3 class="text-base font-semibold mb-2 line-clamp-2">{{ event.title }}</h3>

          <!-- Event Meta -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm text-[#8e8e8e]">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ event.date }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-[#8e8e8e]">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ event.time }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-[#8e8e8e]">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="truncate">{{ event.location }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button 
              @click="viewEvent(event)"
              class="flex-1 py-2 text-sm font-medium border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors"
            >
              View Details
            </button>
            <button 
              @click="editEvent(event)"
              class="p-2 border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredEvents.length === 0" class="text-center py-16">
      <svg class="w-16 h-16 mx-auto text-[#dbdbdb] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-sm text-[#8e8e8e] mb-4">No {{ filterStatus !== 'all' ? filterStatus : '' }} events found</p>
      <button 
        @click="showCreateEventModal = true"
        class="px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors"
      >
        Create First Event
      </button>
    </div>

    <!-- Create Event Modal -->
    <div 
      v-if="showCreateEventModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showCreateEventModal = false"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Create New Event</h2>
          <button @click="showCreateEventModal = false" class="p-1 hover:bg-[#fafafa] rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleCreateEvent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#262626] mb-2">Event Title</label>
            <input 
              v-model="newEvent.title"
              type="text" 
              required
              class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              placeholder="Career Fair 2024"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#262626] mb-2">Start Date</label>
              <input 
                v-model="newEvent.startDate"
                type="date" 
                required
                class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#262626] mb-2">End Date</label>
              <input 
                v-model="newEvent.endDate"
                type="date" 
                required
                class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#262626] mb-2">Location</label>
            <input 
              v-model="newEvent.location"
              type="text" 
              required
              class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              placeholder="DNSC Gymnasium"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#262626] mb-2">Status</label>
            <select 
              v-model="newEvent.status"
              required
              class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button"
              @click="showCreateEventModal = false"
              class="flex-1 px-4 py-2 text-sm font-medium border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2 text-sm font-semibold bg-ic-primary text-white rounded-lg hover:bg-ic-secondary transition-colors"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Event Modal -->
    <div 
      v-if="selectedEvent && showViewModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showViewModal = false"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Event Details</h2>
          <button @click="showViewModal = false" class="p-1 hover:bg-[#fafafa] rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <span 
              :class="[
                'inline-block px-2 py-1 text-xs font-medium rounded',
                selectedEvent.status === 'upcoming' && 'bg-blue-50 text-blue-600',
                selectedEvent.status === 'ongoing' && 'bg-green-50 text-green-600',
                selectedEvent.status === 'completed' && 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1) }}
            </span>
          </div>

          <h3 class="text-lg font-semibold">{{ selectedEvent.title }}</h3>

          <div class="space-y-3">
            <div class="flex items-center gap-3 text-sm">
              <svg class="w-5 h-5 text-[#8e8e8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ selectedEvent.date }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <svg class="w-5 h-5 text-[#8e8e8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ selectedEvent.time }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <svg class="w-5 h-5 text-[#8e8e8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ selectedEvent.location }}</span>
            </div>
          </div>
        </div>

        <button 
          @click="showViewModal = false"
          class="w-full mt-6 px-4 py-2 text-sm font-medium border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filterStatus = ref('all')

const showCreateEventModal = ref(false)
const showViewModal = ref(false)
const selectedEvent = ref(null)

const newEvent = ref({
  title: '',
  startDate: '',
  endDate: '',
  time: '',
  location: '',
  status: 'upcoming'
})

const handleCreateEvent = () => {
  console.log('Creating event:', newEvent.value)
  showCreateEventModal.value = false
  newEvent.value = {
    title: '',
    startDate: '',
    endDate: '',
    time: '',
    location: '',
    status: 'upcoming'
  }
}

const viewEvent = (event) => {
  selectedEvent.value = event
  showViewModal.value = true
}

const editEvent = (event) => {
  console.log('Edit event:', event)
}

// Mock data - replace with API call
const events = ref([
  {
    id: 1,
    title: 'Career Fair 2024',
    date: 'January 25, 2024',
    startDate: '2024-01-25',
    endDate: '2024-01-25',
    time: '9:00 AM - 5:00 PM',
    location: 'DNSC Gymnasium',
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'ICSA General Assembly',
    date: 'January 20, 2024',
    startDate: '2024-01-20',
    endDate: '2024-01-20',
    time: '2:00 PM - 4:00 PM',
    location: 'Computer Lab 1',
    status: 'ongoing'
  },
  {
    id: 3,
    title: 'Tech Talk: AI and Machine Learning',
    date: 'January 15, 2024',
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    time: '10:00 AM - 12:00 PM',
    location: 'AVR Room',
    status: 'completed'
  },
  {
    id: 4,
    title: 'Coding Bootcamp',
    date: 'February 1-3, 2024',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    time: '8:00 AM - 5:00 PM',
    location: 'Computer Lab 2 & 3',
    status: 'upcoming'
  },
  {
    id: 5,
    title: 'Sports Fest Opening',
    date: 'January 18, 2024',
    startDate: '2024-01-18',
    endDate: '2024-01-18',
    time: '7:00 AM - 10:00 AM',
    location: 'Covered Court',
    status: 'completed'
  },
  {
    id: 6,
    title: 'Web Development Workshop',
    date: 'February 10-14, 2024',
    startDate: '2024-02-10',
    endDate: '2024-02-14',
    time: '1:00 PM - 5:00 PM',
    location: 'Computer Lab 1',
    status: 'upcoming'
  }
])

const filteredEvents = computed(() => {
  if (filterStatus.value === 'all') {
    return events.value
  }
  return events.value.filter(event => event.status === filterStatus.value)
})
</script>
