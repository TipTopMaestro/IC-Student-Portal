<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
    <!-- Page Title / Header -->
    <div>
      
      <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">profile</h1>
      <p class="text-sm text-gray-500 mt-0.5">Manage your personal credentials and administrative access</p>
    </div>

    <!-- Feedback Banner -->
    <div 
      v-if="feedbackMessage.text" 
      class="flex items-center justify-between p-3.5 rounded-xl font-mono text-xs transition-all"
      :class="feedbackMessage.type === 'error' 
        ? 'bg-rose-50 border border-rose-200/80 text-ic-secondary' 
        : 'bg-emerald-50 border border-emerald-200/80 text-emerald-800'"
      role="alert"
    >
      <div class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full" :class="feedbackMessage.type === 'error' ? 'bg-ic-secondary' : 'bg-emerald-600'"></span>
        <span>{{ feedbackMessage.text }}</span>
      </div>
      <button @click="feedbackMessage.text = ''" class="text-gray-400 hover:text-gray-600 ml-2 cursor-pointer font-mono text-xs">
        ×
      </button>
    </div>

    <!-- Loading State (Skeleton Screen) -->
    <div v-if="isLoading" class="space-y-6">
      <!-- Profile Card Skeleton -->
      <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
        <div class="h-32 md:h-40 w-full bg-gray-200 animate-pulse"></div>
        <div class="px-6 pb-6 pt-16 md:pt-6 md:pl-44 flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
          <div class="absolute -top-14 left-6 md:left-8">
            <div class="h-28 w-28 md:h-32 md:w-32 rounded-full bg-gray-300 border-4 border-white animate-pulse shadow-md"></div>
          </div>
          <div class="flex-1 space-y-2">
            <div class="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
            <div class="flex gap-2 mt-2">
              <div class="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div class="h-5 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1 space-y-6">
          <div class="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 animate-pulse">
            <div class="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div v-for="i in 3" :key="i" class="space-y-1.5">
              <div class="h-3 w-16 bg-gray-200 rounded"></div>
              <div class="h-4 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 animate-pulse">
            <div class="h-4 w-28 bg-gray-200 rounded"></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="i in 4" :key="i" class="p-4 bg-gray-50 rounded-xl space-y-2">
                <div class="h-3 w-16 bg-gray-200 rounded"></div>
                <div class="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
      <div class="w-11 h-11 mx-auto rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-3 text-ic-secondary">
        <AlertCircle class="w-5 h-5 text-rose-500" />
      </div>
      <p class="font-pixel text-base text-gray-900 lowercase mb-1">profile unavailable</p>
      <p class="text-xs text-gray-500 mb-4 leading-relaxed">{{ error }}</p>
      <button 
        @click="loadProfile" 
        class="font-mono text-[11px] font-medium uppercase tracking-wider text-white bg-ic-primary hover:bg-ic-secondary px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-[0_2px_8px_-2px_rgba(100,13,95,0.4)]"
      >
        <span>Retry</span>
        <RotateCcw class="w-3 h-3" />
      </button>
    </div>

    <!-- Profile Content -->
    <template v-if="!isLoading && !error">
      <!-- Profile Header Card with Cover Banner -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
        <!-- Cover Banner -->
        <div class="h-32 md:h-40 w-full bg-ic-primary relative">
          <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]"></div>
          <!-- Corner Console Badge -->
          <span class="absolute top-4 right-4 bg-white/15 backdrop-blur-md text-white/90 font-mono text-[9px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-white/20">
            ADMIN PROFILE
          </span>
        </div>
        
        <!-- Profile Details Header Area -->
        <div class="px-6 pb-6 pt-16 md:pt-6 md:pl-44 flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
          <!-- Overlapping Circular Avatar -->
          <div class="absolute -top-14 left-6 md:left-8 group z-10">
            <div class="h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg relative transition-transform duration-300 group-hover:scale-102">
              <img 
                :src="profileData.profileImage || '/default_profile.png'" 
                class="w-full h-full object-cover" 
                alt="Profile"
                @error="onAvatarError" 
              />
              
              <!-- Upload Image Overlay -->
              <label 
                class="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full"
                :class="{ 'opacity-100': isUploadingProfilePic }"
              >
                <template v-if="isUploadingProfilePic">
                  <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </template>
                <template v-else>
                  <Camera class="w-5 h-5 text-white mb-1" />
                  <span class="text-white font-mono text-[9px] uppercase tracking-wider font-medium">Change</span>
                </template>
                <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp" @change="onProfilePicSelected" :disabled="isUploadingProfilePic" />
              </label>
            </div>
          </div>

          <!-- User Info Details -->
          <div class="flex-1 min-w-0 text-left">
            <h2 class="text-2xl font-bold text-gray-900 tracking-tight truncate" :title="fullName">{{ fullName }}</h2>
            <p class="text-gray-500 text-sm mt-0.5 truncate">
              @{{ profileData.username }}
              <span v-if="profileData.institute"> · {{ profileData.institute }}</span>
            </p>
            
            <div class="flex flex-wrap items-center gap-2 mt-3">
              <span class="inline-flex px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium bg-gray-50 text-gray-700 border border-gray-200/80">
                @{{ profileData.username }}
              </span>
              <span 
                v-if="profileData.isSuperuser" 
                class="inline-flex px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-purple-50 text-ic-primary border border-purple-200/60"
              >
                Superuser
              </span>
              <span 
                v-else-if="profileData.isStaff" 
                class="inline-flex px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-purple-50 text-ic-primary border border-purple-200/60"
              >
                Staff Admin
              </span>
              <span class="inline-flex items-center gap-1 rounded-full border border-emerald-700/20 bg-emerald-600/[0.06] text-emerald-800 px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider">
                <span class="w-1 h-1 rounded-full bg-emerald-600"></span>
                Active Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Layout Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Left Column: Administrative Scope & Groups (1 column) -->
        <div class="md:col-span-1 space-y-6">
          
          <!-- 01 — administrative registry -->
          <div class="space-y-3">
            <div class="px-1">
              <span class="font-pixel text-sm text-gray-400 lowercase">01 — administrative scope</span>
            </div>

            <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-3.5">
              <div>
                <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Role Access</p>
                <p class="font-mono text-xs font-semibold text-gray-900 mt-1">
                  {{ profileData.isSuperuser ? 'Full Superuser Control' : (profileData.isStaff ? 'Staff Administrator' : 'Portal Manager') }}
                </p>
              </div>
              <div class="border-t border-gray-100 pt-3">
                <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Institute</p>
                <p class="text-xs font-semibold text-gray-900 mt-1 leading-relaxed">{{ profileData.institute || 'Institute of Computing' }}</p>
              </div>
              <div class="border-t border-gray-100 pt-3">
                <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Campus Institution</p>
                <p class="text-xs font-semibold text-gray-900 mt-1 leading-relaxed">{{ profileData.school || 'Davao del Norte State College' }}</p>
              </div>
            </div>
          </div>

          <!-- 02 — groups & affiliations -->
          <div class="space-y-3">
            <div class="px-1">
              <span class="font-pixel text-sm text-gray-400 lowercase">02 — groups & permissions</span>
            </div>

            <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div class="flex flex-wrap gap-1.5">
                <span 
                  v-for="group in profileData.groups" 
                  :key="group" 
                  class="inline-flex px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium border border-[#640D5F]/20 bg-[#640D5F]/[0.06] text-[#520B4D]"
                >
                  {{ group }}
                </span>
                <span v-if="!profileData.groups || profileData.groups.length === 0" class="font-mono text-[11px] text-gray-400">
                  No explicit group assignments
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Personal Info & Account Credentials (2 columns) -->
        <div class="md:col-span-2 space-y-6">
          
          <!-- 03 — personal identity -->
          <div class="space-y-3">
            <div class="px-1">
              <span class="font-pixel text-sm text-gray-400 lowercase">03 — personal details</span>
            </div>

            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">First Name</p>
                  <p class="text-sm font-semibold text-gray-900 mt-1">{{ profileData.firstName || '—' }}</p>
                </div>

                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Last Name</p>
                  <p class="text-sm font-semibold text-gray-900 mt-1">{{ profileData.lastName || '—' }}</p>
                </div>

                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Full Display Name</p>
                  <p class="text-sm font-semibold text-gray-900 mt-1">{{ fullName }}</p>
                </div>

                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Authorization Status</p>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    <p class="text-sm font-semibold text-gray-900 font-mono text-xs">
                      {{ profileData.isSuperuser ? 'SUPERUSER' : (profileData.isStaff ? 'STAFF_VERIFIED' : 'AUTHORIZED') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 04 — communication & credentials -->
          <div class="space-y-3">
            <div class="px-1">
              <span class="font-pixel text-sm text-gray-400 lowercase">04 — communication & credentials</span>
            </div>

            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Official Email Address</p>
                  <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5 truncate" :title="profileData.email">
                    {{ profileData.email || '—' }}
                  </p>
                </div>

                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">System Username</p>
                  <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5">
                    {{ profileData.username || '—' }}
                  </p>
                </div>

                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Portal Access Gate</p>
                  <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5">
                    Admin Route Guard (Active)
                  </p>
                </div>

                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Session Security</p>
                  <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5">
                    JWT Silent Refresh (31 Days)
                  </p>
                </div>
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
import {
  Camera,
  AlertCircle,
  RotateCcw
} from 'lucide-vue-next'

const authStore = useAuthStore()
const isLoading = ref(true)
const error = ref(null)
const isUploadingProfilePic = ref(false)

const feedbackMessage = ref({ type: '', text: '' })
let feedbackTimer = null
const showFeedback = (text, type = 'error') => {
  feedbackMessage.value = { text, type }
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => {
    feedbackMessage.value.text = ''
  }, 4000)
}

const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return ''
  
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
  
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
    const activeBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.instituteofcomputing.org'
    const activeDomain = activeBaseUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '')
    let normalized = url.replace(/(?:localhost|127\.0\.0\.1|10\.0\.2\.2)(?::\d+)?/g, activeDomain)
    return normalized.replace(/^http:\/\//i, 'https://')
  }
  
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://api.instituteofcomputing.org').replace(/\/$/, '')
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`
  }
  return `${baseUrl}/${url}`
}

const profileData = ref({
  id: null,
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  profileImage: '',
  institute: '',
  school: '',
  groups: [],
  isStaff: false,
  isSuperuser: false
})

const onAvatarError = (e) => {
  if (e.target && !e.target.src.endsWith('/default_profile.png')) {
    e.target.src = '/default_profile.png'
  }
}

const loadProfile = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await api.get('/api/v1/me/')
    const data = response.data.data || response.data

    // Check all possible avatar fields on user data and authStore
    let realAvatar = (typeof data.profile_url === 'string' ? normalizeUrl(data.profile_url) : '') ||
                     (typeof data.profile === 'string' ? normalizeUrl(data.profile) : '') ||
                     (typeof data.user_avatar === 'string' && data.user_avatar !== '/default_profile.png' ? normalizeUrl(data.user_avatar) : '') ||
                     (typeof data.avatar === 'string' ? normalizeUrl(data.avatar) : '') ||
                     (typeof data.profile_picture === 'string' ? normalizeUrl(data.profile_picture) : '') ||
                     (typeof data.student?.s_image === 'string' ? normalizeUrl(data.student.s_image) : '') ||
                     (typeof authStore.user?.user_avatar === 'string' && authStore.user.user_avatar !== '/default_profile.png' ? authStore.user.user_avatar : '') ||
                     (typeof authStore.user?.profile_picture === 'string' ? authStore.user.profile_picture : '') ||
                     (typeof authStore.user?.student?.s_image === 'string' ? normalizeUrl(authStore.user.student.s_image) : '')

    // If still not resolved, query students API with user's email or username to fetch official picture
    if (!realAvatar && (data.email || data.username)) {
      try {
        const searchKeyword = data.email || data.username.split('.')[0] || data.username
        const studentResp = await api.get('/api/v1/students/', { params: { search: searchKeyword } })
        const studentList = studentResp.data.data?.data || studentResp.data.data || []
        const matchedStudent = Array.isArray(studentList) ? studentList.find(s => {
          return (s.s_email && data.email && s.s_email.toLowerCase() === data.email.toLowerCase()) ||
                 (s.s_studentID && s.s_studentID.toLowerCase() === data.username.toLowerCase()) ||
                 ((s.s_fname || '').toLowerCase() === (data.first_name || '').toLowerCase() &&
                  (s.s_lname || '').toLowerCase() === (data.last_name || '').toLowerCase())
        }) : null

        if (matchedStudent?.s_image) {
          realAvatar = normalizeUrl(matchedStudent.s_image)
          if (authStore.user) {
            authStore.user.student = matchedStudent
            authStore.user.user_avatar = realAvatar
            authStore.user.profile_picture = realAvatar
            localStorage.setItem('user_data', JSON.stringify(authStore.user))
          }
        }
      } catch (err) {
        console.warn('Could not query student profile for admin avatar:', err)
      }
    }

    profileData.value = {
      id: data.id || authStore.user?.id || null,
      username: data.username || authStore.user?.username || '',
      firstName: data.first_name || authStore.user?.first_name || '',
      lastName: data.last_name || authStore.user?.last_name || '',
      email: data.email || authStore.user?.email || '',
      profileImage: realAvatar || '/default_profile.png',
      institute: data.institute?.institute_name || '',
      school: data.institute?.school?.school_name || '',
      groups: data.groups || authStore.user?.groups || [],
      isStaff: !!data.is_staff,
      isSuperuser: !!data.is_superuser
    }
  } catch (err) {
    console.error('Failed to load admin profile:', err)
    const status = err.response?.status
    if (status === 401 || status === 403) {
      error.value = 'You do not have permission to view this profile.'
    } else if (status >= 500) {
      error.value = 'Server error. Try again later.'
    } else if (!err.response && err.request) {
      error.value = 'Network error. Check your connection.'
    } else {
      error.value = 'Unable to load profile at this time.'
    }
  }

  isLoading.value = false
}

const onProfilePicSelected = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    showFeedback('Image size must be less than 5MB.', 'error')
    event.target.value = ''
    return
  }

  isUploadingProfilePic.value = true
  try {
    const updateResult = await updateProfile(authStore.user?.id || profileData.value.id, {
      firstName: profileData.value.firstName,
      lastName: profileData.value.lastName,
      email: profileData.value.email,
      avatar: file
    })

    if (!updateResult.success) {
      console.error('Profile update failed:', updateResult.error)
      showFeedback(typeof updateResult.error === 'string' ? updateResult.error : 'Failed to update profile picture.', 'error')
      return
    }

    const returnedUser = updateResult.data?.data || updateResult.data
    const rawImageUrl = returnedUser.profile_url || returnedUser.profile || returnedUser.user_avatar
    const imageUrl = normalizeUrl(rawImageUrl)
    if (!imageUrl) {
      console.error('Backend update response missing profile URL. Response data:', updateResult.data)
      showFeedback('Failed to update profile picture.', 'error')
      return
    }

    profileData.value.profileImage = imageUrl

    if (authStore.user) {
      authStore.user.user_avatar = imageUrl
      authStore.user.profile = imageUrl
      authStore.user.profile_url = imageUrl
      localStorage.setItem('user_data', JSON.stringify(authStore.user))
    }

    showFeedback('Profile picture updated successfully.', 'success')

    setTimeout(async () => {
      try {
        await authStore.fetchCurrentUser()
        if (authStore.user?.user_avatar) {
          profileData.value.profileImage = authStore.user.user_avatar
        }
      } catch (e) {
        console.warn('Delayed user refetch failed:', e)
      }
    }, 2500)
  } catch (err) {
    console.error('Profile pic upload error:', err)
    showFeedback('Failed to update profile picture.', 'error')
  } finally {
    isUploadingProfilePic.value = false
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

onMounted(async () => {
  await loadProfile()
})
</script>
