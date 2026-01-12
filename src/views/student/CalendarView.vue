<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Academic Calendar</h1>
      <p class="text-gray-600 mt-1">View important academic dates, events, and deadlines</p>
    </div>

    <!-- Calendar View Selector and Current Month -->
    <div class="card">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div class="flex items-center space-x-4">
          <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="text-center">
            <h2 class="text-xl font-semibold text-gray-900">{{ currentMonthYear }}</h2>
            <p class="text-sm text-gray-500">{{ currentSemester }}</p>
          </div>
          <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button @click="goToToday" class="btn-primary">
          Today
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="card">
      <!-- Days of Week Header -->
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div v-for="day in daysOfWeek" :key="day" class="text-center py-2">
          <span class="text-sm font-semibold text-gray-600">{{ day }}</span>
        </div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="{
            'bg-gray-50': !day.isCurrentMonth,
            'bg-purple-50 border-2 border-ic-primary': day.isToday,
            'hover:bg-gray-100': day.isCurrentMonth && !day.isToday
          }"
          class="min-h-24 p-2 border border-gray-200 rounded-lg cursor-pointer transition-colors"
          @click="selectDay(day)"
        >
          <div class="flex items-center justify-between mb-1">
            <span
              :class="{
                'text-gray-400': !day.isCurrentMonth,
                'text-white bg-ic-primary rounded-full px-2 py-1': day.isToday,
                'text-gray-900 font-semibold': day.isCurrentMonth && !day.isToday
              }"
              class="text-sm"
            >
              {{ day.date }}
            </span>
          </div>

          <!-- Events indicators -->
          <div v-if="day.events && day.events.length > 0" class="space-y-1">
            <div
              v-for="event in day.events.slice(0, 2)"
              :key="event.id"
              :class="{
                'bg-blue-100 text-blue-800': event.type === 'class',
                'bg-green-100 text-green-800': event.type === 'exam',
                'bg-purple-100 text-purple-800': event.type === 'event',
                'bg-red-100 text-red-800': event.type === 'deadline',
                'bg-yellow-100 text-yellow-800': event.type === 'holiday'
              }"
              class="text-xs px-1 py-0.5 rounded truncate"
            >
              {{ event.title }}
            </div>
            <p v-if="day.events.length > 2" class="text-xs text-gray-500">
              +{{ day.events.length - 2 }} more
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Upcoming Events List -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
        <div class="space-y-3">
          <div v-for="event in upcomingEvents" :key="event.id" 
            class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-ic-primary transition-colors">
            <div
              :class="{
                'bg-blue-100': event.type === 'class',
                'bg-green-100': event.type === 'exam',
                'bg-purple-100': event.type === 'event',
                'bg-red-100': event.type === 'deadline',
                'bg-yellow-100': event.type === 'holiday'
              }"
              class="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <svg class="w-5 h-5" :class="{
                'text-blue-600': event.type === 'class',
                'text-green-600': event.type === 'exam',
                'text-purple-600': event.type === 'event',
                'text-red-600': event.type === 'deadline',
                'text-yellow-600': event.type === 'holiday'
              }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                <h3 class="text-sm font-semibold text-gray-900">{{ event.title }}</h3>
                <span class="badge badge-info text-xs capitalize">{{ event.type }}</span>
              </div>
              <p class="text-xs text-gray-600 mb-1">{{ event.description }}</p>
              <div class="flex items-center space-x-3 text-xs text-gray-500">
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatEventDate(event.date) }}
                </span>
                <span v-if="event.time" class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ event.time }}
                </span>
                <span v-if="event.location" class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ event.location }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend and Quick Stats -->
      <div class="space-y-6">
        <!-- Event Legend -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Event Types</h2>
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <div class="h-4 w-4 bg-blue-100 rounded"></div>
              <span class="text-sm text-gray-700">Classes & Lectures</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="h-4 w-4 bg-green-100 rounded"></div>
              <span class="text-sm text-gray-700">Exams & Assessments</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="h-4 w-4 bg-purple-100 rounded"></div>
              <span class="text-sm text-gray-700">Events & Activities</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="h-4 w-4 bg-red-100 rounded"></div>
              <span class="text-sm text-gray-700">Deadlines & Submissions</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="h-4 w-4 bg-yellow-100 rounded"></div>
              <span class="text-sm text-gray-700">Holidays & No Classes</span>
            </div>
          </div>
        </div>

        <!-- Important Dates -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Important Dates</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b border-gray-200">
              <span class="text-sm text-gray-700">Classes Begin</span>
              <span class="text-sm font-semibold text-gray-900">Jan 15, 2024</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gray-200">
              <span class="text-sm text-gray-700">Midterm Exams</span>
              <span class="text-sm font-semibold text-gray-900">Mar 1-8, 2024</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gray-200">
              <span class="text-sm text-gray-700">Final Exams</span>
              <span class="text-sm font-semibold text-gray-900">May 1-10, 2024</span>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-sm text-gray-700">Semester End</span>
              <span class="text-sm font-semibold text-gray-900">May 15, 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentDate = ref(new Date())
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const currentSemester = computed(() => {
  const month = currentDate.value.getMonth()
  if (month >= 7 && month <= 11) return 'First Semester 2024-2025'
  return 'Second Semester 2024-2025'
})

// Mock events data
const events = ref([
  { id: 1, title: 'Classes Resume', description: 'Second semester classes begin', date: '2024-01-15', type: 'class', location: 'All Classrooms' },
  { id: 2, title: 'IT Summit 2024', description: 'Annual technology conference', date: '2024-01-20', time: '9:00 AM', type: 'event', location: 'Auditorium' },
  { id: 3, title: 'Clearance Submission', description: 'Final deadline for clearance', date: '2024-01-18', type: 'deadline' },
  { id: 4, title: 'Web Dev Workshop', description: 'Hands-on web development training', date: '2024-01-25', time: '2:00 PM', type: 'event', location: 'Computer Lab 1' },
  { id: 5, title: 'Midterm Period', description: 'Midterm examinations week', date: '2024-03-01', type: 'exam' },
])

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
  
  // Previous month days
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    days.push({
      date: prevLastDate - i,
      isCurrentMonth: false,
      isToday: false,
      events: []
    })
  }
  
  // Current month days
  const today = new Date()
  for (let i = 1; i <= lastDate; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const dayEvents = events.value.filter(e => e.date === dateStr)
    
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: today.getDate() === i && today.getMonth() === month && today.getFullYear() === year,
      events: dayEvents,
      fullDate: dateStr
    })
  }
  
  // Next month days
  const remainingDays = 35 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      events: []
    })
  }
  
  return days
})

const upcomingEvents = computed(() => {
  const today = new Date()
  return events.value
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)
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

const selectDay = (day) => {
  if (day.events && day.events.length > 0) {
    console.log('Selected day events:', day.events)
    // Could open a modal or side panel with day details
  }
}

const formatEventDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = date - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 7) return `In ${diffDays} days`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
