<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">External Systems</h1>
      <p class="text-gray-600 mt-1">Access integrated systems and view summary information</p>
    </div>

    <!-- Systems Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Collection Management System -->
      <div class="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-ic-primary">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Collection Management</h3>
              <p class="text-xs text-gray-500">Fines & Payments</p>
            </div>
          </div>
          <span class="badge bg-blue-100 text-blue-800">Active</span>
        </div>

        <p class="text-sm text-gray-600 mb-4">
          View and manage your fines, fees, and payment history. Make payments for library fines, late submissions, and other charges.
        </p>

        <!-- Summary Stats -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Outstanding</p>
            <p class="text-xl font-bold text-red-600">₱250</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Paid This Month</p>
            <p class="text-xl font-bold text-green-600">₱100</p>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="mb-4 pt-4 border-t border-gray-200">
          <p class="text-xs font-medium text-gray-700 mb-2">Recent Transactions:</p>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">Library Fine - Book Return</span>
              <span class="font-semibold text-gray-900">₱50</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">Late Submission Fee</span>
              <span class="font-semibold text-gray-900">₱200</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <button class="btn-primary flex-1 text-sm">
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open System
          </button>
          <button class="btn-secondary text-sm px-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Voting System -->
      <div class="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-ic-primary">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Voting System</h3>
              <p class="text-xs text-gray-500">Elections & Polls</p>
            </div>
          </div>
          <span class="badge bg-green-100 text-green-800">Active</span>
        </div>

        <p class="text-sm text-gray-600 mb-4">
          Participate in student elections, organizational voting, and surveys. Cast your vote for student council and other positions.
        </p>

        <!-- Active Polls -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div class="flex items-center space-x-2 mb-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm font-semibold text-green-900">Active Poll Available</p>
          </div>
          <p class="text-xs text-green-700 mb-2">Student Council Election 2024</p>
          <div class="flex items-center justify-between text-xs text-green-600">
            <span>Deadline: January 25, 2024</span>
            <span class="badge badge-warning">Pending</span>
          </div>
        </div>

        <!-- Voting Stats -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Participated</p>
            <p class="text-xl font-bold text-gray-900">8</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Pending</p>
            <p class="text-xl font-bold text-amber-600">1</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <button class="btn-primary flex-1 text-sm">
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open System
          </button>
          <button class="btn-secondary text-sm px-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Locker Management System -->
      <div class="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-ic-primary">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Locker System</h3>
              <p class="text-xs text-gray-500">Locker Management</p>
            </div>
          </div>
          <span class="badge bg-purple-100 text-purple-800">Active</span>
        </div>

        <p class="text-sm text-gray-600 mb-4">
          View your locker assignment details, location, and access information. Manage locker reservations and renewals.
        </p>

        <!-- Locker Assignment -->
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-xs text-purple-700 mb-1">Assigned Locker</p>
              <p class="text-2xl font-bold text-purple-900">L-205</p>
            </div>
            <div class="h-16 w-16 bg-purple-200 rounded-lg flex items-center justify-center">
              <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-purple-700">Building:</span>
              <span class="font-semibold text-purple-900">Building A</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-purple-700">Floor:</span>
              <span class="font-semibold text-purple-900">2nd Floor</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-purple-700">Valid Until:</span>
              <span class="font-semibold text-purple-900">May 15, 2024</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <button class="btn-primary flex-1 text-sm">
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open System
          </button>
          <button class="btn-secondary text-sm px-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Attendance Management System -->
      <div class="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-ic-primary">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Event Attendance</h3>
              <p class="text-xs text-gray-500">Attendance Tracking</p>
            </div>
          </div>
          <span class="badge bg-amber-100 text-amber-800">Active</span>
        </div>

        <p class="text-sm text-gray-600 mb-4">
          Track your attendance for institutional events, seminars, and activities. View attendance records and summaries.
        </p>

        <!-- Attendance Summary -->
        <div class="grid grid-cols-3 gap-2 mb-4">
          <div class="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
            <p class="text-xs text-green-700 mb-1">Present</p>
            <p class="text-lg font-bold text-green-900">12</p>
          </div>
          <div class="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
            <p class="text-xs text-red-700 mb-1">Absent</p>
            <p class="text-lg font-bold text-red-900">1</p>
          </div>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
            <p class="text-xs text-gray-700 mb-1">Rate</p>
            <p class="text-lg font-bold text-gray-900">92%</p>
          </div>
        </div>

        <!-- Recent Events -->
        <div class="mb-4 pt-4 border-t border-gray-200">
          <p class="text-xs font-medium text-gray-700 mb-2">Recent Events:</p>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">IT Summit 2024</span>
              <span class="badge badge-success text-xs">Present</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">Web Dev Workshop</span>
              <span class="badge badge-success text-xs">Present</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <button class="btn-primary flex-1 text-sm">
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open System
          </button>
          <button class="btn-secondary text-sm px-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- System Status -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="flex items-center space-x-3">
          <div class="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p class="text-sm font-medium text-gray-900">Collection Management</p>
            <p class="text-xs text-gray-500">Operational</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <div class="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p class="text-sm font-medium text-gray-900">Voting System</p>
            <p class="text-xs text-gray-500">Operational</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <div class="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p class="text-sm font-medium text-gray-900">Locker System</p>
            <p class="text-xs text-gray-500">Operational</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <div class="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p class="text-sm font-medium text-gray-900">Attendance System</p>
            <p class="text-xs text-gray-500">Operational</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Section -->
    <div class="card bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
      <div class="flex items-start space-x-4">
        <div class="h-12 w-12 bg-ic-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p class="text-sm text-gray-600 mb-3">
            If you're experiencing issues accessing any of the external systems, please contact the IT Support Office or submit a help ticket.
          </p>
          <button class="btn-primary text-sm">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// This view integrates with external systems
// All data shown here would come from API endpoints that aggregate data from various systems
</script>
