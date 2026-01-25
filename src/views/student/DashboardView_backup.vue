<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ greeting }}, {{ firstName }}</h1>
        <p class="text-gray-500 text-sm mt-0.5">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Quick Stats - Minimal -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Attendance</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ attendanceRate }}%</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Pending</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ pendingSubmissions }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Events</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ upcomingEvents }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">GPA</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ gpa }}</p>
      </div>
    </div>

    <!-- Feed Content -->
    <div class="space-y-4">
      <!-- Announcements Feed -->
      <div v-for="announcement in announcements" :key="announcement.id" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <!-- Announcement Header -->
        <div class="p-4 flex items-center space-x-3">
          <div class="h-10 w-10 rounded-full bg-ic-primary flex items-center justify-center text-white font-medium text-sm">
            IC
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-900">{{ announcement.author }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(announcement.date) }}</p>
          </div>
          <button class="p-2 hover:bg-gray-100 rounded-full">
            <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        <!-- Announcement Content -->
        <div class="px-4 pb-3">
          <h3 class="font-semibold text-gray-900 mb-1">{{ announcement.title }}</h3>
          <p class="text-gray-700 text-sm leading-relaxed">{{ announcement.content }}</p>
        </div>

        <!-- Announcement Image (if any) -->
        <div v-if="announcement.image" class="border-t border-gray-200">
          <img :src="announcement.image" :alt="announcement.title" class="w-full" />
        </div>

        <!-- Actions -->
        <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button class="flex items-center space-x-1 text-gray-500 hover:text-ic-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span class="text-sm">{{ announcement.likes }}</span>
            </button>
            <button class="flex items-center space-x-1 text-gray-500 hover:text-ic-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span class="text-sm">{{ announcement.comments }}</span>
            </button>
          </div>
          <button class="text-gray-500 hover:text-ic-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900">Upcoming Events</h2>
          <router-link to="/calendar" class="text-sm text-ic-primary hover:text-ic-secondary">View All</router-link>
        </div>
        <div class="space-y-3">
          <div v-for="event in events" :key="event.id" class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div class="flex-shrink-0 text-center">
              <div class="bg-ic-primary/10 text-ic-primary rounded-lg p-2 w-12">
                <p class="text-xs font-medium">{{ event.month }}</p>
                <p class="text-lg font-bold leading-none">{{ event.day }}</p>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 text-sm">{{ event.title }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ event.time }} • {{ event.location }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Submissions -->
      <div v-if="submissions.length > 0" class="bg-white border border-gray-200 rounded-xl p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900">Pending Submissions</h2>
          <router-link to="/submissions" class="text-sm text-ic-primary hover:text-ic-secondary">View All</router-link>
        </div>
        <div class="space-y-3">
          <div v-for="submission in submissions" :key="submission.id" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="flex items-center space-x-3">
              <div class="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900 text-sm">{{ submission.title }}</p>
                <p class="text-xs text-gray-500">Due {{ submission.dueDate }}</p>
              </div>
            </div>
            <span class="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              {{ submission.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const firstName = computed(() => {
  const user = authStore.user
  return user?.first_name || user?.firstName || 'Student'
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Mock data
const attendanceRate = ref(92)
const pendingSubmissions = ref(3)
const upcomingEvents = ref(5)
const gpa = ref(1.75)

const announcements = ref([
  {
    id: 1,
    author: 'Institute of Computing',
    date: '2026-01-24T10:30:00',
    title: 'Reminder: Midterm Examinations',
    content: 'The midterm examination schedule has been posted. Please check your respective sections for the complete schedule. Good luck to all students!',
    likes: 45,
    comments: 8,
    image: null
  },
  {
    id: 2,
    author: 'ICSA Admin',
    date: '2026-01-23T14:00:00',
    title: 'Tech Talk: AI and Machine Learning',
    content: 'Join us for an exciting tech talk about AI and Machine Learning this Friday at 2:00 PM in the Audio-Visual Room. Guest speaker from Google Philippines.',
    likes: 67,
    comments: 12,
    image: null
  },
  {
    id: 3,
    author: 'Student Council',
    date: '2026-01-22T09:00:00',
    title: 'Annual Sports Fest 2026',
    content: 'Get ready for the Annual Sports Fest! Registration is now open until January 30. Join your favorite sports and represent your section!',
    likes: 89,
    comments: 23,
    image: null
  }
])

const events = ref([
  {
    id: 1,
    month: 'JAN',
    day: '26',
    title: 'Tech Talk: AI & Machine Learning',
    time: '2:00 PM',
    location: 'AVR Room'
  },
  {
    id: 2,
    month: 'JAN',
    day: '28',
    title: 'Midterm Examination Period Starts',
    time: 'All Day',
    location: 'Various Rooms'
  },
  {
    id: 3,
    month: 'FEB',
    day: '02',
    title: 'ICSA General Assembly',
    time: '10:00 AM',
    location: 'IC Building'
  }
])

const submissions = ref([
  {
    id: 1,
    title: 'Web Development Project',
    dueDate: 'Jan 26, 2026',
    status: 'Pending'
  },
  {
    id: 2,
    title: 'Database Design Report',
    dueDate: 'Jan 28, 2026',
    status: 'Pending'
  },
  {
    id: 3,
    title: 'Algorithm Analysis',
    dueDate: 'Jan 30, 2026',
    status: 'In Progress'
  }
])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
