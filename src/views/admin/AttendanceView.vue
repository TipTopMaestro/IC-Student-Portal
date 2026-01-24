<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Attendance Upload</h1>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Upload Attendance Records</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Select Event</label>
          <select class="input-field">
            <option value="">Select an event...</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Upload CSV/Excel File</label>
          <input type="file" accept=".csv,.xlsx,.xls" class="input-field">
          <p class="text-xs text-gray-500 mt-1">
            Upload a CSV or Excel file with student IDs and attendance status
          </p>
        </div>

        <button class="btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Attendance
        </button>
      </div>

      <div class="mt-8">
        <p class="text-gray-500 text-center py-4">
          Connect to API endpoint: POST /api/v1/attendance-records/
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
