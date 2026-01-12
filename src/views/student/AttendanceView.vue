<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Event Attendance</h1>
        <p class="text-gray-600 mt-1">Summary of your event attendance records</p>
      </div>
      <button class="btn-primary">
        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Open Attendance System
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Events</p>
            <p class="text-3xl font-semibold text-gray-900 mt-2">{{ totalEvents }}</p>
          </div>
          <div class="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Attended</p>
            <p class="text-3xl font-semibold text-gray-900 mt-2">{{ attendedEvents }}</p>
          </div>
          <div class="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Attendance Rate</p>
            <p class="text-3xl font-semibold text-gray-900 mt-2">{{ attendanceRate }}%</p>
          </div>
          <div class="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Attendance -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Events</h2>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="event in recentEvents" :key="event.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-900">{{ event.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(event.date) }}</td>
              <td class="px-4 py-3 text-sm">
                <span 
                  :class="{
                    'badge-success': event.status === 'present',
                    'badge-danger': event.status === 'absent',
                    'badge-info': event.status === 'upcoming'
                  }"
                  class="badge capitalize">
                  {{ event.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          For complete attendance records and detailed management, 
          <button class="text-ic-primary font-medium hover:underline">
            open the Attendance Management System
          </button>
        </p>
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
  { id: 1, name: 'IT Summit 2024', date: '2024-01-10', status: 'present' },
  { id: 2, name: 'Web Development Workshop', date: '2024-01-08', status: 'present' },
  { id: 3, name: 'Cybersecurity Seminar', date: '2024-01-05', status: 'present' },
  { id: 4, name: 'Career Fair 2024', date: '2023-12-20', status: 'absent' },
  { id: 5, name: 'Alumni Homecoming', date: '2023-12-15', status: 'present' },
  { id: 6, name: 'Tech Talk Series #3', date: '2024-01-15', status: 'upcoming' },
])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
