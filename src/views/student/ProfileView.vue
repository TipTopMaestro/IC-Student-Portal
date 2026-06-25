<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn">
    <!-- Page Title / Header -->
    <div class="pb-2">
      <h1 class="text-2xl font-semibold text-gray-900">My Profile</h1>
      <p class="text-gray-500 text-sm mt-0.5">Manage your personal and academic student profile details</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white border border-gray-200 rounded-2xl p-5">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-ic-primary"></div>
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
    <!-- Profile Header Card with Cover Banner -->
      <div class="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <!-- Cover Banner -->
        <div class="h-32 md:h-44 w-full bg-ic-primary relative">
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <!-- Corner Badge -->
          <span class="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/10">
            Student Profile
          </span>
        </div>
        
        <!-- Profile details layout -->
        <div class="px-6 pb-6 pt-16 md:pt-6 md:pl-44 flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
          <!-- Overlapping Circular Avatar -->
          <div class="absolute -top-14 left-6 md:left-8 group">
            <div class="h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden bg-gradient-to-br from-ic-primary to-purple-400 flex items-center justify-center text-white text-3xl md:text-4xl font-bold border-4 border-white shadow-md relative transition-transform duration-300 group-hover:scale-102">
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
      avatar: data.user_avatar || data.profile_url || data.profile || student.s_image || '/default_profile.png'
    }
    
    // Link student record to auth store if found
    if (data.student) {
      authStore.linkStudentRecord(data.student)
    }
  } else {
    error.value = result.error
    console.error('Failed to load profile:', result.error)
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
    // 1. Update backend user profile directly with the raw file
    const updateResult = await updateProfile(authStore.user.id, {
      firstName: studentData.value.firstName,
      lastName: studentData.value.lastName,
      email: studentData.value.email,
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
    const imageUrl = returnedUser.profile_url || returnedUser.profile
    if (!imageUrl) {
      console.error('Backend update response missing profile URL. Response data:', updateResult.data)
      throw new Error('Profile updated, but backend did not return a profile URL.')
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
    alert(err.message || 'An error occurred while updating profile picture')
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
