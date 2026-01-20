<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="bg-white border-b border-gray-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Welcome, {{ studentName }}</h1>
          <p class="text-gray-600 mt-1">{{currentDate}}</p>
        </div>
        <div class="hidden md:block">
          <div class="text-right">
            <p class="text-sm text-gray-500">Student ID</p>
            <p class="text-lg font-semibold text-gray-900">{{ studentId }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Event Attendance Rate -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Event Attendance</p>
            <p class="text-2xl font-semibold text-gray-900 mt-2">{{ attendanceRate }}%</p>
          </div>
          <div class="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Pending Submissions -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 font-medium">Pending Submissions</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ pendingSubmissions }}</p>
            <p class="text-xs text-amber-600 mt-1 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              Due soon
            </p>
          </div>
          <div class="h-14 w-14 bg-amber-100 rounded-full flex items-center justify-center">
            <svg class="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 font-medium">Upcoming Events</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ upcomingEvents }}</p>
            <p class="text-xs text-blue-600 mt-1 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              This week
            </p>
          </div>
          <div class="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Active Systems -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 font-medium">Active Systems</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ activeSystems }}</p>
            <p class="text-xs text-purple-600 mt-1 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              All operational
            </p>
          </div>
          <div class="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- External Systems Quick Access -->
      <div class="lg:col-span-2 card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">External Systems</h2>
          <router-link to="/external-systems" class="text-sm text-ic-primary hover:text-primary-900 font-medium">
            View All →
          </router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Collection Management -->
          <div class="border border-gray-200 rounded-lg p-4 hover:border-ic-primary hover:shadow-md transition-all cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Fines & Payments</h3>
                    <p class="text-xs text-gray-500">Collection Management</p>
                  </div>
                </div>
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-gray-600">Outstanding</span>
                    <span class="text-sm font-semibold text-red-600">₱{{ outstandingFines }}</span>
                  </div>
                  <span class="badge badge-warning text-xs">2 pending payments</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Voting System -->
          <div class="border border-gray-200 rounded-lg p-4 hover:border-ic-primary hover:shadow-md transition-all cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Voting System</h3>
                    <p class="text-xs text-gray-500">Elections & Polls</p>
                  </div>
                </div>
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-gray-600">Active Polls</span>
                    <span class="text-sm font-semibold text-green-600">{{ activePolls }}</span>
                  </div>
                  <span class="badge badge-success text-xs">1 vote pending</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Locker System -->
          <div class="border border-gray-200 rounded-lg p-4 hover:border-ic-primary hover:shadow-md transition-all cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Locker System</h3>
                    <p class="text-xs text-gray-500">Locker Management</p>
                  </div>
                </div>
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-gray-600">Assigned Locker</span>
                    <span class="text-sm font-semibold text-purple-600">{{ assignedLocker }}</span>
                  </div>
                  <span class="badge badge-info text-xs">Building A - 2nd Floor</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Attendance System -->
          <div class="border border-gray-200 rounded-lg p-4 hover:border-ic-primary hover:shadow-md transition-all cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Event Attendance</h3>
                    <p class="text-xs text-gray-500">Attendance Tracking</p>
                  </div>
                </div>
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-gray-600">Events Attended</span>
                    <span class="text-sm font-semibold text-amber-600">{{ eventsAttended }}/{{ totalEvents }}</span>
                  </div>
                  <span class="badge badge-success text-xs">{{ attendanceRate }}% attendance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity & Announcements -->
      <div class="space-y-6">
        <!-- Recent Activity -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">Attended IT Summit 2024</p>
                <p class="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                  <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">Submitted clearance documents</p>
                <p class="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">Profile information updated</p>
                <p class="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Announcements -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Announcements</h2>
            <router-link to="/announcements" class="text-xs text-ic-primary hover:text-primary-900 font-medium">
              View All →
            </router-link>
          </div>
          <div class="space-y-3">
            <div class="p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div class="flex items-start space-x-2">
                <svg class="w-5 h-5 text-ic-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Enrollment Period Extended</p>
                  <p class="text-xs text-gray-600 mt-1">The enrollment period has been extended until...</p>
                  <p class="text-xs text-gray-500 mt-1">Today</p>
                </div>
              </div>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div class="flex items-start space-x-2">
                <svg class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Academic Calendar Updated</p>
                  <p class="text-xs text-gray-600 mt-1">New academic calendar for the semester...</p>
                  <p class="text-xs text-gray-500 mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Mock data - These will be replaced with actual API calls
const attendanceRate = 92
const pendingSubmissions = 2
const upcomingEvents = 4
const activeSystems = 4
const outstandingFines = 250
const activePolls = 1
const assignedLocker = 'L-205'
const eventsAttended = 12
const totalEvents = 13

const studentName = computed(() => {
  return authStore.user ? authStore.user.firstName : 'Student'
})

const studentId = computed(() => {
  return authStore.user?.studentId || 'N/A'
})

const currentDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})
</script>
