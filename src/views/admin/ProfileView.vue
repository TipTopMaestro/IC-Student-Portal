<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn">
    <!-- Page Title -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Profile</h1>
      <p class="text-gray-500 text-sm mt-0.5">Your account information</p>
    </div>

    <!-- Loading State (Skeleton Screen) -->
    <div v-if="isLoading" class="space-y-6">
      <!-- Profile Card Skeleton -->
      <div class="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
        <!-- Banner Skeleton -->
        <div class="h-32 md:h-44 w-full bg-gray-200 animate-pulse"></div>
        
        <!-- Header Info Skeleton -->
        <div class="px-6 pb-6 pt-16 md:pt-6 md:pl-44 flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
          <!-- Overlapping Circular Avatar Skeleton -->
          <div class="absolute -top-14 left-6 md:left-8">
            <div class="h-28 w-28 md:h-32 md:w-32 rounded-full bg-gray-300 border-4 border-white animate-pulse shadow-md"></div>
          </div>
          
          <!-- Name & Details Skeleton -->
          <div class="flex-1 text-left space-y-2">
            <div class="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
          </div>
        </div>
      </div>

      <!-- Dashboard Grid Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="md:col-span-1 space-y-6">
          <div class="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-4">
            <div class="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div class="flex flex-wrap gap-1.5">
              <div class="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div class="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div class="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-4">
            <div class="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div class="space-y-3">
              <div class="space-y-1">
                <div class="h-3 w-16 bg-gray-100 rounded animate-pulse"></div>
                <div class="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div class="space-y-1">
                <div class="h-3 w-16 bg-gray-100 rounded animate-pulse"></div>
                <div class="h-4 w-44 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white border border-gray-200/80 rounded-2xl p-6 space-y-6">
            <div class="h-4 w-28 bg-gray-200 rounded animate-pulse pb-2 border-b border-gray-100"></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="i in 4" :key="i" class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl space-y-1.5">
                <div class="h-3 w-16 bg-gray-200/60 rounded animate-pulse"></div>
                <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white border border-gray-200 rounded-2xl p-5">
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
      <!-- Profile Card (Banner & Overlapping Avatar) -->
      <div class="bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 relative">
        <!-- Cover Banner -->
        <div class="h-32 md:h-44 w-full bg-ic-primary rounded-t-2xl relative">
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]"></div>
          <!-- Corner Console Tag -->
          <span class="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/10">
            Admin Profile
          </span>
        </div>
        
        <!-- Profile Details Header Area -->
        <div class="px-6 pb-6 pt-16 md:pt-6 md:pl-44 flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
          <!-- Overlapping Circular Avatar -->
          <div class="absolute -top-14 left-6 md:left-8 group">
            <div class="h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden bg-linear-to-br from-ic-primary to-purple-400 flex items-center justify-center text-white text-3xl md:text-4xl font-bold border-4 border-white shadow-md relative transition-transform duration-300 group-hover:scale-102">
              <img v-if="profileData.profileImage" :src="profileData.profileImage" alt="Profile" class="h-full w-full object-cover" />
              <span v-else>{{ userInitials }}</span>
              
              <!-- Upload Image Overlay -->
              <label 
                class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full"
                :class="{ 'opacity-100': isUploadingProfilePic }"
              >
                <template v-if="isUploadingProfilePic">
                  <svg class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </template>
                <template v-else>
                  <svg class="w-6 h-6 text-white mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-white text-[10px] font-medium">Update</span>
                </template>
                <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp" @change="onProfilePicSelected" :disabled="isUploadingProfilePic" />
              </label>
            </div>
          </div>

          <!-- Name & Major Badge -->
          <div class="flex-1 text-left">
            <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ fullName }}</h2>
            <p class="text-gray-500 text-sm mt-0.5">@{{ profileData.username }}</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Layout Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Left Column: Quick Metadata (1 column) -->
        <div class="md:col-span-1 space-y-6">
          
          <!-- System Roles / Groups Widget -->
          <div class="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Groups & Roles
            </h3>
            
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="group in profileData.groups" 
                :key="group" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-ic-primary border border-ic-light/30"
              >
                {{ group }}
              </span>
              <span v-if="!profileData.groups || profileData.groups.length === 0" class="text-gray-500 text-xs">
                No groups assigned
              </span>
            </div>
          </div>

          <!-- Academic / Affiliation Widget -->
          <div v-if="profileData.institute" class="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Affiliation
            </h3>
            
            <div class="space-y-3 text-xs">
              <div>
                <p class="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Institute</p>
                <p class="text-gray-900 font-semibold mt-0.5">{{ profileData.institute || 'N/A' }}</p>
              </div>
              <div class="border-t border-gray-50 pt-2.5">
                <p class="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">School / College</p>
                <p class="text-gray-900 font-semibold mt-0.5">{{ profileData.school || 'N/A' }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Personal & Contact Information (2 columns) -->
        <div class="md:col-span-2 space-y-6">
          
          <!-- Identity Details Card -->
          <div class="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Details
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</p>
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ profileData.firstName || 'N/A' }}</p>
              </div>

              <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</p>
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ profileData.lastName || 'N/A' }}</p>
              </div>

              <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Username</p>
                <p class="text-sm font-medium text-gray-900 mt-1">{{ profileData.username || 'N/A' }}</p>
              </div>

              <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p class="text-sm font-medium text-gray-900 mt-1">{{ profileData.email || 'N/A' }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { updateProfile } from '@/services/studentService'

const authStore = useAuthStore()
const isLoading = ref(true)
const error = ref(null)
const isUploadingProfilePic = ref(false)

const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return ''
  
  // Handle local frontend assets
  if (
    url === '/default_profile.png' || 
    url === '/ic-building.png' || 
    url === '/icsa_logo.png' || 
    url.startsWith('/src/') || 
    url.startsWith('/assets/') || 
    url.startsWith('/@')
  ) {
    return url
  }
  
  // If it's already an absolute URL
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
    const activeBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://dnsc-systems-api.onrender.com'
    const activeDomain = activeBaseUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '')
    let normalized = url.replace(/(?:localhost|127\.0\.0\.1|10\.0\.2\.2)(?::\d+)?/g, activeDomain)
    return normalized.replace(/^http:\/\//i, 'https://')
  }
  
  // Prepends backend URL for relative backend paths
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://dnsc-systems-api.onrender.com').replace(/\/$/, '')
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`
  }
  return `${baseUrl}/${url}`
}

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

  try {
    const response = await api.get('/api/v1/me/')
    const data = response.data.data || response.data

    profileData.value = {
      username: data.username || '',
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      email: data.email || '',
      profileImage: (typeof data.profile_url === 'string' ? normalizeUrl(data.profile_url) : '') ||
                    (typeof data.profile === 'string' ? normalizeUrl(data.profile) : '') ||
                    (typeof data.user_avatar === 'string' ? normalizeUrl(data.user_avatar) : '') ||
                    '/default_profile.png',
      institute: data.institute?.institute_name || '',
      school: data.institute?.school?.school_name || '',
      groups: data.groups || []
    }
  } catch (err) {
    console.error('Failed to load admin profile:', err)
    error.value = err.response?.data?.message || 'Failed to load profile'
  }

  isLoading.value = false
}

const onProfilePicSelected = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB')
    return
  }

  isUploadingProfilePic.value = true
  try {
    // 1. Update backend profile directly with the raw file
    const updateResult = await updateProfile(authStore.user.id, {
      firstName: profileData.value.firstName,
      lastName: profileData.value.lastName,
      email: profileData.value.email,
      avatar: file // Send the raw File object directly
    })

    if (!updateResult.success) {
      console.error('Profile update failed:', updateResult.error)
      throw new Error(
        typeof updateResult.error === 'object' 
          ? JSON.stringify(updateResult.error) 
          : updateResult.error || 'Failed to save profile picture'
      )
    }

    // Extract the resolved URL from the backend response
    const returnedUser = updateResult.data?.data || updateResult.data
    const rawImageUrl = returnedUser.profile_url || returnedUser.profile
    const imageUrl = normalizeUrl(rawImageUrl)
    if (!imageUrl) {
      console.error('Backend update response missing profile URL. Response data:', updateResult.data)
      throw new Error('Profile updated, but backend did not return a profile URL.')
    }

    console.log('✅ Backend profile updated successfully:', imageUrl)

    // 2. Update local state & auth store immediately
    profileData.value.profileImage = imageUrl

    if (authStore.user) {
      authStore.user.user_avatar = imageUrl
      authStore.user.profile = imageUrl
      authStore.user.profile_url = imageUrl
      localStorage.setItem('user_data', JSON.stringify(authStore.user))
    }

    // 3. Delayed refetch to sync with backend once it has processed
    setTimeout(async () => {
      try {
        await authStore.fetchCurrentUser()
        if (authStore.user?.user_avatar) {
          profileData.value.profileImage = authStore.user.user_avatar
        }
      } catch (e) {
        console.warn('Delayed user refetch failed:', e)
      }
    }, 3000)

    alert('Profile picture updated successfully!')
  } catch (err) {
    console.error('Profile pic upload error:', err)
    alert(err.message || 'An error occurred while updating profile picture')
  } finally {
    isUploadingProfilePic.value = false
    // Reset input
    event.target.value = ''
  }
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
