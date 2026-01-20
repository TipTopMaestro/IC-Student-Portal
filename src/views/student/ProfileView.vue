<template>
  <div class="max-w-4xl mx-auto space-y-6">
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
            <span class="badge badge-info">{{ studentData.yearLevel }} - {{ studentData.section }}</span>
            <span class="badge badge-success">Active</span>
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
          <p v-else class="text-gray-900 font-medium">{{ studentData.firstName }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
          <input v-if="editMode" v-model="studentData.lastName" type="text" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ studentData.lastName }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Middle Name</label>
          <input v-if="editMode" v-model="studentData.middleName" type="text" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ studentData.middleName || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
          <input v-if="editMode" v-model="studentData.birthDate" type="date" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ formatDate(studentData.birthDate) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Gender</label>
          <select v-if="editMode" v-model="studentData.gender" class="input-field">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Prefer not to say</option>
          </select>
          <p v-else class="text-gray-900 font-medium">{{ studentData.gender }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Nationality</label>
          <input v-if="editMode" v-model="studentData.nationality" type="text" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ studentData.nationality }}</p>
        </div>
      </div>

      <div v-if="editMode" class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button @click="editMode = false" class="btn-secondary">Cancel</button>
        <button @click="saveProfile" class="btn-primary">Save Changes</button>
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
          <p v-else class="text-gray-900 font-medium">{{ studentData.email }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
          <input v-if="editMode" v-model="studentData.mobile" type="tel" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ studentData.mobile }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-500 mb-1">Address</label>
          <input v-if="editMode" v-model="studentData.address" type="text" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ studentData.address }}</p>
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
          <p class="text-gray-900 font-medium">{{ studentData.studentId }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
          <span class="badge badge-success">{{ studentData.status }}</span>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-500 mb-1">Program / Course</label>
          <p class="text-gray-900 font-medium">{{ studentData.course }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Year Level</label>
          <p class="text-gray-900 font-medium">{{ studentData.yearLevel }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Section</label>
          <p class="text-gray-900 font-medium">{{ studentData.section }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Enrollment Date</label>
          <p class="text-gray-900 font-medium">{{ formatDate(studentData.enrollmentDate) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Academic Year</label>
          <p class="text-gray-900 font-medium">{{ studentData.academicYear }}</p>
        </div>
      </div>
    </div>

    <!-- Emergency Contact -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg class="w-6 h-6 mr-2 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Emergency Contact
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Contact Name</label>
          <input v-if="editMode" v-model="studentData.emergencyContact.name" type="text" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ studentData.emergencyContact.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Relationship</label>
          <input v-if="editMode" v-model="studentData.emergencyContact.relationship" type="text" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ studentData.emergencyContact.relationship }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
          <input v-if="editMode" v-model="studentData.emergencyContact.mobile" type="tel" class="input-field" />
          <p v-else class="text-gray-900 font-medium">{{ studentData.emergencyContact.mobile }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const editMode = ref(false)

// Mock student data - will be fetched from API
const studentData = ref({
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  middleName: 'Santos',
  birthDate: '2002-05-15',
  gender: 'Male',
  nationality: 'Filipino',
  email: 'juan.delacruz@dnsc.edu.ph',
  mobile: '09123456789',
  address: 'Tagum City, Davao del Norte',
  studentId: '2021-0001',
  status: 'Active',
  course: 'Bachelor of Science in Information Technology',
  yearLevel: '3rd Year',
  section: 'BSIT-3A',
  enrollmentDate: '2021-08-15',
  academicYear: '2024-2025',
  emergencyContact: {
    name: 'Maria Dela Cruz',
    relationship: 'Mother',
    mobile: '09987654321'
  }
})

const fullName = computed(() => {
  return `${studentData.value.firstName} ${studentData.value.middleName ? studentData.value.middleName + ' ' : ''}${studentData.value.lastName}`
})

const userInitials = computed(() => {
  return `${studentData.value.firstName[0]}${studentData.value.lastName[0]}`
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const saveProfile = () => {
  // TODO: Call API to save profile
  editMode.value = false
  // Show success notification
}
</script>
