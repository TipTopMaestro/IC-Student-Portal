<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Page Title -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Profile</h1>
      <p class="text-gray-500 text-sm mt-0.5">Your account information</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white border border-gray-200 rounded-xl p-5">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-ic-primary"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white border border-gray-200 rounded-xl p-5">
      <div class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Failed to load profile</h3>
        <p class="mt-2 text-sm text-gray-500">{{ error }}</p>
        <button @click="loadProfile" class="mt-4 px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors">
          Try Again
        </button>
      </div>
    </div>

    <!-- Profile Content -->
    <template v-if="!isLoading && !error">
      <!-- Profile Header -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <!-- Avatar -->
          <div class="relative">
            <div v-if="profileData.profileImage" class="h-32 w-32 rounded-full overflow-hidden">
              <img :src="profileData.profileImage" alt="Profile" class="h-full w-full object-cover" />
            </div>
            <div v-else class="h-32 w-32 rounded-full bg-gradient-to-br from-ic-primary to-purple-400 flex items-center justify-center text-white text-4xl font-bold">
              {{ userInitials }}
            </div>
          </div>

          <!-- Admin Info -->
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-bold text-gray-900">{{ fullName }}</h2>
            <p class="text-gray-600">{{ profileData.username }}</p>
            <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
              <span 
                v-for="group in profileData.groups" 
                :key="group" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-ic-primary"
              >
                {{ group }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Information -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
        <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <svg class="w-6 h-6 mr-2 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Information
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">First Name</label>
            <p class="text-gray-900 font-medium">{{ profileData.firstName || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
            <p class="text-gray-900 font-medium">{{ profileData.lastName || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Username</label>
            <p class="text-gray-900 font-medium">{{ profileData.username || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
            <p class="text-gray-900 font-medium">{{ profileData.email || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Institute Information -->
      <div v-if="profileData.institute" class="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
        <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <svg class="w-6 h-6 mr-2 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Institute Information
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Institute</label>
            <p class="text-gray-900 font-medium">{{ profileData.institute || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">School</label>
            <p class="text-gray-900 font-medium">{{ profileData.school || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Groups & Roles -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
        <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <svg class="w-6 h-6 mr-2 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Groups & Roles
        </h2>

        <div class="flex flex-wrap gap-2">
          <span 
            v-for="group in profileData.groups" 
            :key="group" 
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-ic-primary"
          >
            {{ group }}
          </span>
          <span v-if="!profileData.groups || profileData.groups.length === 0" class="text-gray-500">No groups assigned</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getCurrentProfile } from '@/services/studentService'

const authStore = useAuthStore()
const isLoading = ref(true)
const error = ref(null)

const profileData = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  profileImage: '',
  institute: '',
  school: '',
  groups: []
})

onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  isLoading.value = true
  error.value = null

  const result = await getCurrentProfile()

  if (result.success) {
    const data = result.data

    profileData.value = {
      username: data.username || '',
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      email: data.email || '',
      profileImage: data.profile || '',
      institute: data.institute?.institute_name || '',
      school: data.institute?.school?.school_name || '',
      groups: data.groups || []
    }

    authStore.user = data
  } else {
    error.value = result.error
  }

  isLoading.value = false
}

const fullName = computed(() => {
  const first = profileData.value.firstName
  const last = profileData.value.lastName
  return `${first} ${last}`.trim() || profileData.value.username || 'Admin'
})

const userInitials = computed(() => {
  const first = profileData.value.firstName?.[0] || ''
  const last = profileData.value.lastName?.[0] || ''
  return (first + last).toUpperCase() || 'AD'
})
</script>
