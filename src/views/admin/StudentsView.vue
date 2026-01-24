<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Student Management</h1>
      <button class="btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Student
      </button>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-500 text-center py-8">
        Student management interface - Connect to API endpoint: GET /api/v1/students/
      </p>
    </div>
  </div>
</template>

<script setup>
</script>
