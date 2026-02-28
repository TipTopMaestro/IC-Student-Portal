<template>
  <div class="min-h-screen flex overflow-hidden bg-white">
    <!-- Left Side - Login Form (40% width) -->
    <div class="w-full lg:w-[40%] flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
      <div class="max-w-md w-full space-y-8 py-12">
        <!-- Header -->
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p class="mt-2 text-base text-gray-600">Continue with your email and password</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Email/Student ID -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input id="email" v-model="form.email" type="text" required
              class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-ic-primary focus:border-transparent transition-all"
              placeholder="email@example.com" />
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" class="text-sm font-medium text-ic-primary hover:text-ic-secondary">
                Forgot password?
              </a>
            </div>
            <div class="relative">
              <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                class="appearance-none relative block w-full px-4 py-3 pr-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-ic-primary focus:border-transparent transition-all"
                placeholder="Enter your password" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" :disabled="loading"
            class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-ic-primary hover:bg-ic-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ic-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ loading ? 'Logging in...' : 'Log in' }}
          </button>

        </form>
        <!-- Google Login Button-->

        <div class="login-container w-full flex justify-center">
          <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError" />
        </div>


        <!-- Register Link -->
        <div class="text-center text-sm text-gray-600">
          Need an account? Contact your administrator
        </div>
      </div>
    </div>

    <!-- Right Side - Curved Split with Image and Branding (Hidden on mobile, 60% width) -->
    <div class="hidden lg:block relative w-[60%]">
      <!-- Curved Elliptical Shape -->
      <div class="absolute inset-0 bg-ic-primary shadow-2xl" style="clip-path: ellipse(100% 100% at 100% 50%);">
        <div class="absolute inset-0 overflow-hidden">
          <img src="/ic-building.png" alt="IT building" class="absolute inset-0 w-full h-full object-cover" />
          <!-- Purple overlay with gradient -->
          <div class="gradient-overlay"></div>
        </div>

        <!-- Content Container -->
        <div class="relative h-full flex flex-col items-center justify-center text-white px-12">
          <div class="text-center">
            <!-- Logo -->
            <div class="mb-8 flex justify-center">
              <img src="/icsa_logo.png" alt="ICSA Logo" class="h-45 w-45 drop-shadow-lg" />
            </div>

            <!-- Title and Description -->
            <h1 class="text-5xl font-bold mb-4 drop-shadow-lg">ICSA Student Portal</h1>
            <p class="text-xl font-medium mb-2 drop-shadow-md">Institute of Computing Student Association</p>
            <p class="text-xl font-medium drop-shadow-md">Davao del Norte State College</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import { GoogleSignInButton } from "vue3-google-signin";

const handleLoginSuccess = async (response) => {
  const { credential } = response;
  loading.value = true
  error.value = ''

  try {
    const result = await authStore.loginWithGoogle(credential)

    if (result.success) {
      if (authStore.isAdmin) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } else {
      error.value = result.error || 'Google login failed'
    }
  } catch (err) {
    error.value = 'Google login failed'
  } finally {
    loading.value = false
  }
};

const handleLoginError = () => {
  error.value = "Google login failed"
};

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    console.log('🔐 Login attempt for:', form.value.email)
    const result = await authStore.login(form.value.email, form.value.password)
    
    console.log('🔐 Login result:', result)

    if (result.success) {
      console.log('✅ Login successful, isAdmin:', authStore.isAdmin, 'user:', authStore.user)
      
      if (authStore.isAdmin) {
        console.log('➡️ Redirecting to admin dashboard')
        await router.push('/admin')
      } else {
        console.log('➡️ Redirecting to student dashboard')
        await router.push('/')
      }
    } else {
      error.value = result.error || 'Invalid credentials'
    }
  } catch (err) {
    console.error('❌ Login error:', err)
    error.value = 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(90, 45, 111, 0.69), rgba(90, 45, 111, 1));
}
</style>
