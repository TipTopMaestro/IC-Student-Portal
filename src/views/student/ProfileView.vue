<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
    <!-- Page Title / Header -->
    <div>
      <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">profile</h1>
      <p class="text-sm text-gray-500 mt-0.5">Manage your personal identity and academic credentials</p>
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
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p class="font-pixel text-base text-gray-900 lowercase mb-1">profile unavailable</p>
      <p class="text-xs text-gray-500 mb-4 leading-relaxed">{{ error }}</p>
      <button 
        @click="loadProfile" 
        class="font-mono text-[11px] font-medium uppercase tracking-wider text-white bg-ic-primary hover:bg-ic-secondary px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-[0_2px_8px_-2px_rgba(100,13,95,0.4)]"
      >
        <span>Retry</span>
        <span class="text-xs">↻</span>
      </button>
    </div>

    <!-- Profile Content -->
    <template v-if="!isLoading && !error">
      <!-- Profile Header Card with Cover Banner -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
        <!-- Cover Banner -->
        <div class="h-32 md:h-40 w-full bg-ic-primary relative">
          <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]"></div>
          <!-- Corner Badge -->
          <span class="absolute top-4 right-4 bg-white/15 backdrop-blur-md text-white/90 font-mono text-[9px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-white/20">
            Student Identity
          </span>
        </div>
        
        <!-- Profile details layout -->
        <div class="px-6 pb-6 pt-16 md:pt-6 md:pl-44 flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
          <!-- Overlapping Circular Avatar -->
          <div class="absolute -top-14 left-6 md:left-8 group z-10">
            <div class="h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden bg-gradient-to-br from-ic-primary to-purple-500 flex items-center justify-center text-white text-3xl md:text-4xl font-semibold border-4 border-white shadow-lg relative transition-transform duration-300 group-hover:scale-102">
              <img v-if="studentData.avatar" :src="studentData.avatar" class="w-full h-full object-cover" alt="Profile" />
              <span v-else class="font-pixel">{{ userInitials }}</span>
              
              <!-- Upload Image Overlay -->
              <label 
                class="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full"
                :class="{ 'opacity-100': isUploadingProfilePic }"
              >
                <template v-if="isUploadingProfilePic">
                  <svg class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </template>
                <template v-else>
                  <svg class="w-5 h-5 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-white font-mono text-[9px] uppercase tracking-wider font-medium">Change</span>
                </template>
                <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp" @change="onProfilePicSelected" :disabled="isUploadingProfilePic" />
              </label>
            </div>
          </div>

          <!-- Student Info Details -->
          <div class="flex-1 min-w-0 text-left">
            <h2 class="text-2xl font-bold text-gray-900 tracking-tight truncate" :title="fullName">{{ fullName }}</h2>
            <p class="text-gray-500 text-sm mt-0.5 truncate">{{ studentData.course }}</p>
            
            <div class="flex flex-wrap items-center gap-2 mt-3">
              <span class="inline-flex px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium bg-gray-50 text-gray-700 border border-gray-200/80">
                {{ studentData.studentId }}
              </span>
              <span v-if="studentData.yearLevel && studentData.section" class="inline-flex px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium bg-gray-50 text-gray-700 border border-gray-200/80">
                {{ studentData.yearLevel }} · {{ studentData.section }}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full border border-emerald-700/20 bg-emerald-600/[0.06] text-emerald-800 px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider">
                <span class="w-1 h-1 rounded-full bg-emerald-600"></span>
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
          
          <!-- 01 — academic identity -->
          <div class="space-y-3">
            <div class="px-1">
              <span class="font-pixel text-sm text-gray-400 lowercase">01 — academic registry</span>
            </div>

            <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-3.5">
              <div>
                <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Student ID</p>
                <p class="font-mono text-xs font-semibold text-gray-900 mt-1">{{ studentData.studentId || 'N/A' }}</p>
              </div>
              <div class="border-t border-gray-100 pt-3">
                <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Program / Course</p>
                <p class="text-xs font-semibold text-gray-900 mt-1 leading-relaxed">{{ studentData.course || 'N/A' }}</p>
              </div>
              <div class="border-t border-gray-100 pt-3">
                <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Year & Section</p>
                <p class="font-mono text-xs font-semibold text-gray-900 mt-1">
                  {{ studentData.yearLevel || 'N/A' }} <span v-if="studentData.yearLevel && studentData.section" class="text-gray-300">·</span> {{ studentData.section }}
                </p>
              </div>
              <div v-if="studentData.institute" class="border-t border-gray-100 pt-3">
                <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Institute</p>
                <p class="text-xs font-semibold text-gray-900 mt-1">{{ studentData.institute }}</p>
              </div>
              <div v-if="studentData.school" class="border-t border-gray-100 pt-3">
                <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Campus</p>
                <p class="text-xs font-semibold text-gray-900 mt-1">{{ studentData.school }}</p>
              </div>
            </div>
          </div>

          <!-- 02 — roles & affiliations -->
          <div class="space-y-3">
            <div class="px-1">
              <span class="font-pixel text-sm text-gray-400 lowercase">02 — affiliations</span>
            </div>

            <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div class="flex flex-wrap gap-1.5">
                <span 
                  v-for="group in studentData.groups" 
                  :key="group" 
                  class="inline-flex px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium border border-[#640D5F]/20 bg-[#640D5F]/[0.06] text-[#520B4D]"
                >
                  {{ group }}
                </span>
                <span v-if="!studentData.groups || studentData.groups.length === 0" class="font-mono text-[11px] text-gray-400">
                  No active affiliations
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Personal Info & Contact Info (2 columns) -->
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
                  <p class="text-sm font-semibold text-gray-900 mt-1">{{ studentData.firstName || 'N/A' }}</p>
                </div>

                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Last Name</p>
                  <p class="text-sm font-semibold text-gray-900 mt-1">{{ studentData.lastName || 'N/A' }}</p>
                </div>

                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Middle Name</p>
                  <p class="text-sm font-semibold text-gray-900 mt-1">{{ studentData.middleName || 'N/A' }}</p>
                </div>

                <div v-if="studentData.suffix" class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Suffix</p>
                  <p class="text-sm font-semibold text-gray-900 mt-1">{{ studentData.suffix }}</p>
                </div>

                <div v-if="studentData.rfid" class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">RFID Scanner Token</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p class="text-sm font-semibold text-gray-900 font-mono tracking-wider">{{ studentData.rfid }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 04 — communication & credentials -->
          <div class="space-y-3">
            <div class="px-1">
              <span class="font-pixel text-sm text-gray-400 lowercase">04 — communication & account</span>
            </div>

            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Email Address</p>
                  <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5 truncate" :title="studentData.email">{{ studentData.email || 'N/A' }}</p>
                </div>

                <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <p class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">Username</p>
                  <p class="font-mono text-xs font-semibold text-gray-900 mt-1.5">{{ studentData.username || 'N/A' }}</p>
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
import { getCurrentProfile, updateProfile, updateStudentProfile } from '@/services/studentService'

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

onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  isLoading.value = true
  error.value = null
  
  const result = await getCurrentProfile()
  
  if (result.success) {
    const data = result.data
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
    const updateResult = await updateProfile(authStore.user.id, {
      firstName: studentData.value.firstName,
      lastName: studentData.value.lastName,
      email: studentData.value.email,
      avatar: file
    })

    if (!updateResult.success) {
      console.error('Profile update failed:', updateResult.error)
      showFeedback(typeof updateResult.error === 'string' ? updateResult.error : 'Failed to update profile picture.', 'error')
      return
    }

    const returnedUser = updateResult.data?.data || updateResult.data
    const rawImageUrl = returnedUser.profile_url || returnedUser.profile
    const imageUrl = normalizeUrl(rawImageUrl)
    if (!imageUrl) {
      console.error('Backend update response missing profile URL. Response data:', updateResult.data)
      showFeedback('Failed to update profile picture.', 'error')
      return
    }

    console.log('✅ Backend profile updated successfully:', imageUrl)

    if (studentData.value.id) {
      try {
        await updateStudentProfile(studentData.value.id, { s_image: imageUrl })
      } catch (studentErr) {
        console.warn('Could not update student record image (expected if read-only):', studentErr)
      }
    }

    studentData.value.avatar = imageUrl

    if (authStore.user) {
      authStore.user.user_avatar = imageUrl
      authStore.user.profile = imageUrl
      authStore.user.profile_url = imageUrl
      if (authStore.user.student) {
        authStore.user.student.s_image = imageUrl
      }
      localStorage.setItem('user_data', JSON.stringify(authStore.user))
    }

    showFeedback('Profile picture updated.', 'success')

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
