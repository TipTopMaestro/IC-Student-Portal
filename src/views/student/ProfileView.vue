<!-- note: done na majority features ani na page, pero wala pa na test ang pag update sa user sa iyang profile  -->

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="card">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-ic-primary"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card">
      <div class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Failed to load profile</h3>
        <p class="mt-2 text-sm text-gray-500">{{ error }}</p>
        <button @click="loadProfile" class="mt-4 btn-primary">Try Again</button>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
      <svg class="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm text-green-700">{{ successMessage }}</p>
    </div>

    <!-- Profile Content -->
    <template v-if="!isLoading && !error">
    <!-- Profile Header -->
    <div class="card">
      <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <!-- Avatar -->
        <div class="relative">
          <div class="h-32 w-32 rounded-full bg-linear-to-br from-ic-primary to-dnsc-accent flex items-center justify-center text-white text-4xl font-bold">
            {{ userInitials }}
          </div>
          <button class="absolute bottom-0 right-0 h-10 w-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 border-2 border-gray-100">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <!-- Student Info -->
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-2xl font-bold text-gray-900">{{ fullName }}</h1>
          <p class="text-gray-600">{{ studentData.course }}</p>
          <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
            <span class="badge bg-ic-primary text-white">{{ studentData.studentId }}</span>
            <span v-if="studentData.yearLevel && studentData.section" class="badge badge-info">{{ studentData.yearLevel }} - {{ studentData.section }}</span>
            <span class="badge badge-success capitalize">{{ studentData.status }}</span>
          </div>
        </div>

        <!-- Action Button -->
        <button @click="editMode = !editMode" class="btn-primary">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {{ editMode ? 'Cancel' : 'Edit Profile' }}
        </button>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center">
          <svg class="w-6 h-6 mr-2 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Information
        </h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">First Name</label>
          <input v-if="editMode" v-model="studentData.firstName" type="text" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ studentData.firstName || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
          <input v-if="editMode" v-model="studentData.lastName" type="text" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ studentData.lastName || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Middle Name</label>
          <p class="text-gray-900 font-medium">{{ studentData.middleName || 'N/A' }}</p>
        </div>
        <div v-if="studentData.suffix">
          <label class="block text-sm font-medium text-gray-500 mb-1">Suffix</label>
          <p class="text-gray-900 font-medium">{{ studentData.suffix }}</p>
        </div>
        <div v-if="studentData.rfid">
          <label class="block text-sm font-medium text-gray-500 mb-1">RFID</label>
          <p class="text-gray-900 font-medium">{{ studentData.rfid }}</p>
        </div>
      </div>

      <div v-if="editMode" class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button @click="editMode = false" class="btn-secondary" :disabled="isSaving">Cancel</button>
        <button @click="saveProfile" class="btn-primary" :disabled="isSaving">
          <span v-if="isSaving">Saving...</span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg class="w-6 h-6 mr-2 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Contact Information
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
          <input v-if="editMode" v-model="studentData.email" type="email" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ studentData.email || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Username</label>
          <p class="text-gray-900 font-medium">{{ studentData.username || 'N/A' }}</p>
        </div>
      </div>
    </div>

    <!-- Academic Information -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg class="w-6 h-6 mr-2 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
        Academic Information
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Student ID</label>
          <p class="text-gray-900 font-medium">{{ studentData.studentId || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
          <span class="badge badge-success capitalize">{{ studentData.status || 'N/A' }}</span>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-500 mb-1">Program / Course</label>
          <p class="text-gray-900 font-medium">{{ studentData.course || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Year Level</label>
          <p class="text-gray-900 font-medium">{{ studentData.yearLevel || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Section</label>
          <p class="text-gray-900 font-medium">{{ studentData.section || 'N/A' }}</p>
        </div>
        <div v-if="studentData.institute">
          <label class="block text-sm font-medium text-gray-500 mb-1">Institute</label>
          <p class="text-gray-900 font-medium">{{ studentData.institute }}</p>
        </div>
        <div v-if="studentData.school">
          <label class="block text-sm font-medium text-gray-500 mb-1">School</label>
          <p class="text-gray-900 font-medium">{{ studentData.school }}</p>
        </div>
      </div>
    </div>

    <!-- Groups/Roles -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg class="w-6 h-6 mr-2 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Groups & Roles
      </h2>
      
      <div class="flex flex-wrap gap-2">
        <span v-for="group in studentData.groups" :key="group" class="badge badge-info">{{ group }}</span>
        <span v-if="!studentData.groups || studentData.groups.length === 0" class="text-gray-500">No groups assigned</span>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getCurrentProfile, updateProfile } from '@/services/studentService'

const authStore = useAuthStore()
const editMode = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)
const error = ref(null)
const successMessage = ref(null)

// Initialize with user data from auth store
const studentData = ref({
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
  groups: []
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
      groups: data.groups || []
    }
    
    // Update auth store with latest data
    authStore.user = data
  } else {
    error.value = result.error
    console.error('Failed to load profile:', result.error)
  }
  
  isLoading.value = false
}

const fullName = computed(() => {
  return `${studentData.value.firstName} ${studentData.value.middleName ? studentData.value.middleName + ' ' : ''}${studentData.value.lastName}`
})

const userInitials = computed(() => {
  const first = studentData.value.firstName[0] || 'S'
  const last = studentData.value.lastName[0] || 'U'
  return `${first}${last}`
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const saveProfile = async () => {
  isSaving.value = true
  error.value = null
  successMessage.value = null
  
  // Only send fields that the API accepts (first_name, last_name, email)
  const result = await updateProfile({
    firstName: studentData.value.firstName,
    lastName: studentData.value.lastName,
    email: studentData.value.email
  })
  
  if (result.success) {
    successMessage.value = 'Profile updated successfully!'
    editMode.value = false
    
    // Reload profile to get latest data
    await loadProfile()
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } else {
    error.value = result.error
  }
  
  isSaving.value = false
}
</script>
