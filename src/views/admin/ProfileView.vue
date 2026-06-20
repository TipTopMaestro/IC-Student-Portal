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
          <div class="relative group">
            <div class="h-32 w-32 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-ic-primary to-purple-400 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <img v-if="profileData.profileImage" :src="profileData.profileImage" alt="Profile" class="h-full w-full object-cover" />
              <span v-else>{{ userInitials }}</span>
              
              <!-- Upload Overlay -->
              <label 
                class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full"
                :class="{ 'opacity-100': isUploadingProfilePic }"
              >
                <template v-if="isUploadingProfilePic">
                  <svg class="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </template>
                <template v-else>
                  <svg class="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-white text-xs font-medium">Update</span>
                </template>
                <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp" @change="onProfilePicSelected" :disabled="isUploadingProfilePic" />
              </label>
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
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api, { invalidateApiCachePattern } from '@/services/api'
import { getCurrentProfile } from '@/services/studentService'
import { uploadImage } from '@/services/fileService'
import { useSWR, invalidateCachePattern } from '@/composables/useSWR'

const authStore = useAuthStore()
const isUploadingProfilePic = ref(false)

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

const adminId = computed(() => authStore.user?.id || 'admin')
const cacheKey = computed(() => `profile-admin-${adminId.value}`)

// Caching admin profile via SWR
const {
  data: swrData,
  error,
  isLoading,
  isRefreshing,
  refresh
} = useSWR(
  cacheKey,
  () => getCurrentProfile(),
  { ttl: 300000, immediate: true }
)

// Sync SWR cache data
watch(swrData, (newVal) => {
  if (newVal) {
    const data = newVal.data || newVal
    profileData.value = {
      username: data.username || '',
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      email: data.email || '',
      profileImage: data.profile_url || data.profile || data.user_avatar || '',
      institute: data.institute?.institute_name || '',
      school: data.institute?.school?.school_name || '',
      groups: data.groups || []
    }
  }
}, { immediate: true })

const onProfilePicSelected = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB')
    return
  }

  isUploadingProfilePic.value = true
  try {
    // 1. Upload to Cloudinary
    const uploadResult = await uploadImage(file, 'profiles')
    if (!uploadResult.success) {
      throw new Error(uploadResult.error || 'Failed to upload image')
    }

    const imageUrl = uploadResult.data.image_url
    console.log('✅ Image uploaded to Cloudinary:', imageUrl)

    // 2. Update backend profile
    const payload = {
      first_name: profileData.value.firstName,
      last_name: profileData.value.lastName,
      email: profileData.value.email,
      profile: imageUrl,
      profile_picture: imageUrl,
      user_avatar: imageUrl
    }

    console.log('📤 Sending profile update payload:', payload)
    const response = await api.patch(`/api/v1/users/${authStore.user.id}/`, payload)
    console.log('📥 Profile update response:', response.data)

    // Write-through cache invalidation to clear stale /api/v1/me/ cache entries safely
    try {
      invalidateApiCachePattern('/api/v1/me/')
      invalidateApiCachePattern(`/api/v1/users/${authStore.user.id}/`)
      invalidateCachePattern('profile')
      invalidateCachePattern('me')
    } catch (e) {
      console.warn('⚠️ Non-fatal cache invalidation error:', e)
    }

    // 3. Force re-fetching in auth store & SWR cache to update the app layout instantly
    await authStore.fetchCurrentUser()
    refresh()

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
