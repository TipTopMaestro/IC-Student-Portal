<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">{{ greeting }}, {{ firstName }}</h1>
      <p class="text-gray-500 text-sm mt-0.5">{{ currentDate }}</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Attendance</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ attendanceRate }}%</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Unpaid Fees</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ unpaidFees }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Events</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ upcomingEvents }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Announcements</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ totalAnnouncements }}</p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Left Column - Announcements & Events -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Recent Announcements -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-900">Recent Announcements</h2>
            <router-link to="/announcements" class="text-xs text-ic-primary hover:text-ic-primary/80 font-medium">
              View all →
            </router-link>
          </div>
          <div class="divide-y divide-gray-200">
            <div v-for="announcement in recentAnnouncements" :key="announcement.id" class="p-5 hover:bg-gray-50 transition-colors">
              <div class="flex items-start gap-3">
                <div class="h-10 w-10 rounded-full bg-ic-primary/10 flex items-center justify-center text-ic-primary font-medium text-sm shrink-0">
                  {{ announcement.author.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <p class="text-sm font-medium text-gray-900">{{ announcement.author }}</p>
                    <span class="text-xs text-gray-500">{{ formatDate(announcement.date) }}</span>
                  </div>
                  <h3 class="text-sm font-medium text-gray-900 mb-1">{{ announcement.title }}</h3>
                  <p class="text-sm text-gray-600 line-clamp-2">{{ announcement.content }}</p>
                  <span class="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    {{ announcement.category }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Events -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-900">Upcoming Events</h2>
            <router-link to="/calendar" class="text-xs text-ic-primary hover:text-ic-primary/80 font-medium">
              View calendar →
            </router-link>
          </div>
          <div class="divide-y divide-gray-200">
            <div v-for="event in upcomingEventsList" :key="event.id" class="p-5 hover:bg-gray-50 transition-colors">
              <div class="flex items-start gap-4">
                <div class="text-center shrink-0">
                  <div class="h-12 w-12 rounded-lg bg-green-50 flex flex-col items-center justify-center">
                    <span class="text-xs text-green-700 font-medium">{{ event.month }}</span>
                    <span class="text-lg font-semibold text-green-900">{{ event.day }}</span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 mb-1">{{ event.name }}</h3>
                  <div class="flex items-center gap-3 text-xs text-gray-500">
                    <span class="flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ event.time }}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      </div>

      <!-- Right Column - Sidebar Info -->
      <div class="space-y-4">
        <!-- Pending Fees -->
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-5">
          <div class="flex items-center gap-3 mb-4">
            <div class="h-10 w-10 rounded-lg bg-white border border-purple-200 flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-purple-700 font-medium">Unpaid Fees</p>
              <p class="text-2xl font-semibold text-purple-900">₱{{ totalUnpaidAmount.toLocaleString() }}</p>
            </div>
          </div>
          <div class="space-y-2 mb-4">
            <div v-for="fee in pendingFeesList.slice(0, 3)" :key="fee.id" class="flex items-center justify-between text-xs">
              <span class="text-purple-800">{{ fee.name }}</span>
              <span class="font-medium text-purple-900">₱{{ fee.amount.toLocaleString() }}</span>
            </div>
          </div>
          <router-link to="/fees" class="block w-full text-center py-2 bg-ic-primary text-white text-sm font-medium rounded-lg hover:bg-ic-primary/90 transition-colors">
            View All Fees
          </router-link>
        </div>

        <!-- Quick Links -->
        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <h3 class="text-base font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div class="space-y-2">
            <router-link to="/attendance" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div class="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span class="text-sm text-gray-700 group-hover:text-gray-900 font-medium">View Attendance</span>
            </router-link>
            <router-link to="/external-systems" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div class="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <span class="text-sm text-gray-700 group-hover:text-gray-900 font-medium">External Systems</span>
            </router-link>
            <router-link to="/profile" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div class="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="text-sm text-gray-700 group-hover:text-gray-900 font-medium">My Profile</span>
            </router-link>
          </div>
        </div>

        <!-- Attendance Summary -->
        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <h3 class="text-base font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Events</span>
              <span class="text-sm font-semibold text-gray-900">{{ totalEvents }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Attended</span>
              <span class="text-sm font-semibold text-gray-900">{{ attendedEvents }}</span>
            </div>
            <div class="pt-3 border-t border-gray-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">Rate</span>
                <span class="text-sm font-semibold text-gray-900">{{ attendanceRate }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full transition-all" :style="{ width: attendanceRate + '%' }"></div>
              </div>
            </div>
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

// User info
const firstName = computed(() => authStore.user?.first_name || authStore.user?.firstName || 'Student')

// Greeting based on time
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

// Current date
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Quick stats
const attendanceRate = ref(92)
const unpaidFees = ref(2)
const upcomingEvents = ref(3)
const totalAnnouncements = ref(8)

// Attendance data
const totalEvents = ref(13)
const attendedEvents = ref(12)

// Pending fees
const totalUnpaidAmount = ref(700)
const pendingFeesList = ref([
  { id: 1, name: 'Department Shirt', amount: 450 },
  { id: 2, name: 'Tech Summit', amount: 250 }
])

// Recent announcements
const recentAnnouncements = ref([
  {
    id: 1,
    author: 'ICSA Admin',
    date: '2024-01-24',
    title: 'IT Summit 2024 Registration',
    content: 'Registration for the annual IT Summit is now open. Don\'t miss this opportunity to learn from industry experts and network with fellow students.',
    category: 'Event'
  },
  {
    id: 2,
    author: 'Department Head',
    date: '2024-01-23',
    title: 'New Laboratory Schedule',
    content: 'The computer laboratory schedule has been updated for this semester. Please check the new timings before planning your sessions.',
    category: 'Academic'
  },
  {
    id: 3,
    author: 'ICSA Officer',
    date: '2024-01-22',
    title: 'Payment Deadline Reminder',
    content: 'Friendly reminder that all department fees should be settled by the end of this month. Visit the Fees page for more details.',
    category: 'Administrative'
  }
])

// Upcoming events
const upcomingEventsList = ref([
  {
    id: 1,
    name: 'Web Development Workshop',
    date: '2024-01-28',
    day: '28',
    month: 'JAN',
    time: '2:00 PM',
    location: 'Lab 301'
  },
  {
    id: 2,
    name: 'Cybersecurity Seminar',
    date: '2024-02-02',
    day: '02',
    month: 'FEB',
    time: '10:00 AM',
    location: 'AVR Hall'
  },
  {
    id: 3,
    name: 'Career Fair 2024',
    day: '15',
    month: 'FEB',
    date: '2024-02-15',
    time: '9:00 AM',
    location: 'Gymnasium'
  }
])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
