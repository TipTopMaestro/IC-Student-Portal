<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn">
    <!-- Page Title / Header -->
    <div class="pb-2">
      <h1 class="text-2xl font-semibold text-gray-900">My Profile</h1>
      <p class="text-gray-500 text-sm mt-0.5">Manage your personal and academic student profile details</p>
    </div>

    <!-- Feedback Banner -->
    <div 
      v-if="feedbackMessage.text" 
      class="flex items-center justify-between p-3.5 rounded-xl text-xs font-medium transition-all"
      :class="feedbackMessage.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'"
      role="alert"
    >
      <div class="flex items-center gap-2">
        <svg v-if="feedbackMessage.type === 'error'" class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <svg v-else class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span>{{ feedbackMessage.text }}</span>
      </div>
      <button @click="feedbackMessage.text = ''" class="text-gray-400 hover:text-gray-600 ml-2 cursor-pointer">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
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
            <div class="flex gap-2 mt-2">
              <div class="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div class="h-5 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Grid Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="md:col-span-1 space-y-6">
          <div class="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-4">
            <div class="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div class="space-y-3">
              <div v-for="i in 3" :key="i" class="space-y-1.5">
                <div class="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
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
        <h3 class="mt-4 text-lg font-medium text-gray-900">Profile Unavailable</h3>
        <p class="mt-2 text-sm text-gray-500">{{ error }}</p>
        <button @click="loadProfile" class="mt-4 px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors cursor-pointer">
          Try Again
        </button>
      </div>
    </div>

    <!-- Profile Content -->
    <template v-if="!isLoading && !error">
    <!-- Profile Header Card with Cover Banner -->
      <div class="bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 relative">
        <!-- Cover Banner -->
        <div class="h-32 md:h-44 w-full bg-ic-primary rounded-t-2xl relative">
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]"></div>
          <!-- Corner Badge -->
          <span class="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/10">
            Student Profile
          </span>
        </div>
        
        <!-- Profile details layout -->
        <div class="px-6 pb-6 pt-16 md:pt-6 md:pl-44 flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
          <!-- Overlapping Circular Avatar -->
          <div class="absolute -top-14 left-6 md:left-8 group z-10">
            <div class="h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden bg-linear-to-br from-ic-primary to-purple-400 flex items-center justify-center text-white text-3xl md:text-4xl font-bold border-4 border-white shadow-md relative transition-transform duration-300 group-hover:scale-102 overflow-hidden">
              <img v-if="studentData.avatar" :src="studentData.avatar" class="w-full h-full object-cover" alt="Profile" />
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

          <!-- Student Info Details -->
          <div class="flex-1 text-left">
            <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ fullName }}</h2>
            <p class="text-gray-500 text-sm mt-0.5">{{ studentData.course }}</p>
            
            <div class="flex flex-wrap gap-2 mt-3">
              <span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-ic-primary border border-ic-light/30 shadow-sm">
                {{ studentData.studentId }}
              </span>
              <span v-if="studentData.yearLevel && studentData.section" class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                {{ studentData.yearLevel }} - {{ studentData.section }}
              </span>
              <span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 capitalize">
                {{ studentData.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Layout Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Left Column: Academic Metadata Info (1 column) -->
        <div class="md:col-span-1 space-y-6">
          
          <!-- Academic Registry Widget -->
          <div class="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Academic Info
            </h3>

            <div class="space-y-3.5 text-xs">
              <div>
                <p class="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Student ID</p>
                <p class="text-gray-900 font-bold mt-0.5">{{ studentData.studentId || 'N/A' }}</p>
              </div>
              <div class="border-t border-gray-50 pt-2.5">
                <p class="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Program / Course</p>
                <p class="text-gray-900 font-semibold mt-0.5 leading-tight">{{ studentData.course || 'N/A' }}</p>
              </div>
              <div class="border-t border-gray-50 pt-2.5">
                <p class="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Year & Section</p>
                <p class="text-gray-900 font-semibold mt-0.5">
                  {{ studentData.yearLevel || 'N/A' }} <span v-if="studentData.yearLevel && studentData.section">&bull;</span> {{ studentData.section }}
                </p>
              </div>
              <div v-if="studentData.institute" class="border-t border-gray-50 pt-2.5">
                <p class="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Institute</p>
                <p class="text-gray-900 font-semibold mt-0.5">{{ studentData.institute }}</p>
              </div>
              <div v-if="studentData.school" class="border-t border-gray-50 pt-2.5">
                <p class="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">School</p>
                <p class="text-gray-900 font-semibold mt-0.5">{{ studentData.school }}</p>
              </div>
            </div>
          </div>

          <!-- Groups & Roles Widget -->
          <div class="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Groups & Roles
            </h3>

            <div class="flex flex-wrap gap-1.5">
              <span v-for="group in studentData.groups" :key="group" class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-ic-primary border border-ic-light/30">
                {{ group }}
              </span>
              <span v-if="!studentData.groups || studentData.groups.length === 0" class="text-gray-500 text-xs">
                No groups assigned
              </span>
            </div>
          </div>

        </div>

        <!-- Right Column: Personal Info & Contact Info (2 columns) -->
        <div class="md:col-span-2 space-y-6">
          
          <!-- Identity Card -->
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
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ studentData.firstName || 'N/A' }}</p>
              </div>

              <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</p>
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ studentData.lastName || 'N/A' }}</p>
              </div>

              <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Middle Name</p>
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ studentData.middleName || 'N/A' }}</p>
              </div>

              <div v-if="studentData.suffix" class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suffix</p>
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ studentData.suffix }}</p>
              </div>

              <div v-if="studentData.rfid" class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">RFID System Token</p>
                <div class="flex items-center gap-1.5 mt-1">
                  <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <p class="text-sm font-semibold text-gray-900 font-mono tracking-wider">{{ studentData.rfid }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Details Card -->
          <div class="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Details
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p class="text-sm font-medium text-gray-900 mt-1">{{ studentData.email || 'N/A' }}</p>
              </div>

              <div class="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Username</p>
                <p class="text-sm font-medium text-gray-900 mt-1">{{ studentData.username || 'N/A' }}</p>
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
import { getCurrentProfile, updateProfile, updateStudentProfile } from '@/services/studentService'
import { uploadImage } from '@/services/fileService'

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
    const activeBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.instituteofcomputing.org'
    const activeDomain = activeBaseUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '')
    let normalized = url.replace(/(?:localhost|127\.0\.0\.1|10\.0\.2\.2)(?::\d+)?/g, activeDomain)
    return normalized.replace(/^http:\/\//i, 'https://')
  }
  
  // Prepends backend URL for relative backend paths
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://api.instituteofcomputing.org').replace(/\/$/, '')
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`
  }
  return `${baseUrl}/${url}`
}

// Initialize with user data from auth store
const studentData = ref({
  id: null,
  username: '',
  firstName: '',
  lastName: '',
  middleName: '',
  suffix: '',
  rfid: '',
  email: '',
  studentId: '',
  status: 'enrolled',
  course: '',
  yearLevel: '',
  section: '',
  institute: '',
  school: '',
  groups: [],
  avatar: ''
})

// Load user profile data from API
onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  isLoading.value = true
  error.value = null
  
  const result = await getCurrentProfile()
  
  if (result.success) {
    const data = result.data
    // Map backend student data to component format
    const student = data.student || {}
    
    studentData.value = {
      id: student.id || null,
      username: data.username || '',
      firstName: student.s_fname || data.first_name || '',
      lastName: student.s_lname || data.last_name || '',
      middleName: student.s_mname || '',
      suffix: student.s_suffix || '',
      rfid: student.s_rfid || '',
      email: data.email || '',
      studentId: student.s_studentID || '',
      status: student.s_status || 'enrolled',
      course: student.program_name || '',
      yearLevel: student.s_lvl ? `Year ${student.s_lvl}` : '',
      section: student.s_set || '',
      institute: data.institute?.institute_name || '',
      school: data.institute?.school?.school_name || '',
      groups: data.groups || [],
      avatar: (typeof data.user_avatar === 'string' ? normalizeUrl(data.user_avatar) : '') ||
              (typeof data.profile_url === 'string' ? normalizeUrl(data.profile_url) : '') ||
              (typeof data.profile === 'string' ? normalizeUrl(data.profile) : '') ||
              (typeof student.s_image === 'string' ? normalizeUrl(student.s_image) : '') ||
              '/default_profile.png'
    }
    
    // Link student record to auth store if found
    if (data.student) {
      authStore.linkStudentRecord(data.student)
    }
  } else {
    error.value = result.error || 'Unable to load profile at this time.'
    console.error('Failed to load profile:', result.error)
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
    // 1. Update backend user profile directly with the raw file
    const updateResult = await updateProfile(authStore.user.id, {
      firstName: studentData.value.firstName,
      lastName: studentData.value.lastName,
      email: studentData.value.email,
      avatar: file // Send the raw File object directly
    })

    if (!updateResult.success) {
      console.error('Profile update failed:', updateResult.error)
      showFeedback(typeof updateResult.error === 'string' ? updateResult.error : 'Failed to update profile picture.', 'error')
      return
    }

    // Extract the resolved URL from the backend response
    const returnedUser = updateResult.data?.data || updateResult.data
    const rawImageUrl = returnedUser.profile_url || returnedUser.profile
    const imageUrl = normalizeUrl(rawImageUrl)
    if (!imageUrl) {
      console.error('Backend update response missing profile URL. Response data:', updateResult.data)
      showFeedback('Failed to update profile picture.', 'error')
      return
    }

    console.log('✅ Backend profile updated successfully:', imageUrl)

    // 2. Also try updating student record s_image (non-blocking)
    if (studentData.value.id) {
      try {
        await updateStudentProfile(studentData.value.id, { s_image: imageUrl })
      } catch (studentErr) {
        console.warn('Could not update student record image (expected if read-only):', studentErr)
      }
    }

    // 3. Update local state immediately
    studentData.value.avatar = imageUrl

    // Update auth store user object so the sidebar/navbar avatar updates too
    if (authStore.user) {
      authStore.user.user_avatar = imageUrl
      authStore.user.profile = imageUrl
      authStore.user.profile_url = imageUrl
      if (authStore.user.student) {
        authStore.user.student.s_image = imageUrl
      }
      // Persist to localStorage so it survives page reload until next fetchCurrentUser
      localStorage.setItem('user_data', JSON.stringify(authStore.user))
    }

    showFeedback('Profile picture updated.', 'success')

    // 4. Delayed refetch — give backend time to process the image URL
    // Without this delay, /api/v1/me/ may return stale data and overwrite our local state
    setTimeout(async () => {
      try {
        await authStore.fetchCurrentUser()
      } catch (e) {
        console.warn('Delayed user refetch failed:', e)
      }
    }, 3000)
  } catch (err) {
    console.error('Profile pic upload error:', err)
    showFeedback('Failed to update profile picture.', 'error')
  } finally {
    isUploadingProfilePic.value = false
    // Reset input
    event.target.value = ''
  }
}

const fullName = computed(() => {
  return `${studentData.value.firstName} ${studentData.value.middleName ? studentData.value.middleName + ' ' : ''}${studentData.value.lastName}`
})

const userInitials = computed(() => {
  const first = studentData.value.firstName[0] || 'S'
  const last = studentData.value.lastName[0] || 'U'
  return `${first}${last}`
})
</script>
