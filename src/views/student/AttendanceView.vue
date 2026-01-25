<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Attendance</h1>
      <p class="text-gray-500 text-sm mt-0.5">View your event attendance records</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Total Events</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ totalEvents }}</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Attended</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ attendedEvents }}</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Rate</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">{{ attendanceRate }}%</p>
      </div>
    </div>

    <!-- Recent Attendance -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="p-5 border-b border-gray-200">
        <h2 class="text-base font-semibold text-gray-900">Recent Events</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time In</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Out</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="event in recentEvents" :key="event.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-sm text-gray-900">{{ event.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(event.date) }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ event.timeIn || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ event.timeOut || '-' }}</td>
              <td class="px-4 py-3 text-sm">
                <span 
                  class="text-xs px-2 py-0.5 rounded-full capitalize"
                  :class="getStatusClass(event.status)"
                >
                  {{ event.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock data - will be replaced with API
const totalEvents = 13
const attendedEvents = 12
const attendanceRate = 92

const recentEvents = ref([
  { id: 1, name: 'IT Summit 2024', date: '2024-01-10', timeIn: '9:00 AM', timeOut: '5:30 PM', status: 'present' },
  { id: 2, name: 'Web Development Workshop', date: '2024-01-08', timeIn: '8:45 AM', timeOut: '12:00 PM', status: 'present' },
  { id: 3, name: 'Cybersecurity Seminar', date: '2024-01-05', timeIn: '10:15 AM', timeOut: '3:45 PM', status: 'present' },
  { id: 4, name: 'Career Fair 2024', date: '2023-12-20', timeIn: null, timeOut: null, status: 'absent' },
  { id: 5, name: 'Alumni Homecoming', date: '2023-12-15', timeIn: '2:00 PM', timeOut: '6:30 PM', status: 'present' },
  { id: 6, name: 'Tech Talk Series #3', date: '2023-12-10', timeIn: '9:30 AM', timeOut: null, status: 'incomplete' },
])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getStatusClass = (status) => {
  const classes = {
    present: 'bg-green-50 text-green-700',
    incomplete: 'bg-amber-50 text-amber-700',
    absent: 'bg-red-50 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}
</script>
