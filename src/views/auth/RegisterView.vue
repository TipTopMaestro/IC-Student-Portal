<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl w-full">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="mx-auto mb-4 flex justify-center">
          <img src="/icsa_logo.png" alt="ICSA Logo" class="h-24 w-24" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Create Student Account</h2>
        <p class="text-sm text-gray-600 mt-1">Institute of Computing Student Association</p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-900">Student Registration</h3>
          <p class="text-sm text-gray-600 mt-1">Fill in your information to create an account</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Success Message -->
          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Registration successful! Redirecting to login...
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Personal Information -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input v-model="form.firstName" type="text" required class="input-field" placeholder="Juan" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input v-model="form.lastName" type="text" required class="input-field" placeholder="Dela Cruz" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                <input v-model="form.middleName" type="text" class="input-field" placeholder="Santos" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input v-model="form.birthDate" type="date" required class="input-field" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select v-model="form.gender" required class="input-field">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Prefer not to say</option>
              </select>
            </div>
          </div>

          <!-- Academic Information -->
          <div class="space-y-4 pt-4 border-t">
            <h4 class="font-medium text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Academic Information
            </h4>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
              <input v-model="form.studentId" type="text" required class="input-field" placeholder="2021-0001" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Program/Course</label>
              <select v-model="form.course" required class="input-field">
                <option value="">Select Course</option>
                <option value="BSIT">Bachelor of Science in Information Technology</option>
                <option value="BSCS">Bachelor of Science in Computer Science</option>
                <option value="BSIS">Bachelor of Science in Information Systems</option>
                <option value="BSEd">Bachelor of Secondary Education</option>
                <option value="BEEd">Bachelor of Elementary Education</option>
                <option value="BSBA">Bachelor of Science in Business Administration</option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year Level</label>
                <select v-model="form.yearLevel" required class="input-field">
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <input v-model="form.section" type="text" class="input-field" placeholder="A" />
              </div>
            </div>
          </div>

          <!-- Contact & Account -->
          <div class="space-y-4 pt-4 border-t">
            <h4 class="font-medium text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact & Account Information
            </h4>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input v-model="form.email" type="email" required class="input-field" placeholder="student@IC.edu.ph" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <input v-model="form.mobile" type="tel" required class="input-field" placeholder="09XXXXXXXXX" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input v-model="form.password" type="password" required class="input-field" placeholder="Minimum 8 characters" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input v-model="form.confirmPassword" type="password" required class="input-field" placeholder="Re-enter password" />
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start pt-4">
            <input
              id="terms"
              v-model="form.agreeTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-ic-primary focus:ring-ic-primary border-gray-300 rounded mt-1 cursor-pointer"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700 cursor-pointer">
              I agree to the <a href="#" class="text-ic-primary hover:underline">Terms and Conditions</a> and 
              <a href="#" class="text-ic-primary hover:underline">Privacy Policy</a>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-ic-primary hover:text-primary-900">
              Sign in here
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>&copy; 2024 Institute of Computing - DNSC. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: '',
  gender: '',
  studentId: '',
  course: '',
  yearLevel: '',
  section: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  // Validate passwords match
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }

  // Validate password length
  if (form.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    loading.value = false
    return
  }

  try {
    const result = await authStore.register(form.value)
    
    if (result.success) {
      success.value = true
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      error.value = result.error || 'Registration failed. Please try again.'
    }
  } catch (err) {
    error.value = 'An error occurred. Please try again later.'
  } finally {
    loading.value = false
  }
}
</script>
