<template>
  <div class="min-h-screen flex overflow-hidden bg-white">
    <!-- Left Side - Login Form (40% width) -->
    <div class="w-full lg:w-[40%] flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
      <div class="max-w-md w-full space-y-8 py-12">
        <!-- Header -->
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p class="mt-2 text-base text-[#666666]">Continue with your email and password</p>
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

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-400">or</span>
          </div>
        </div>

        <!-- Custom Google Sign-In Button -->
        <div class="google-signin-wrapper w-full relative">
          <!-- Visual custom button (what the user sees) -->
          <button
            type="button"
            class="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-300 rounded-lg text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all shadow-sm"
          >
            <!-- Google "G" Logo SVG -->
            <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <!-- Invisible Google official button overlay (handles the actual click) -->
          <div ref="googleBtnContainer" class="google-btn-overlay"></div>
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
            <div class="mb-8 flex justify-center animate-float">
              <img src="/icsa_logo.png" alt="ICSA Logo" class="h-45 w-45 drop-shadow-2xl" />
            </div>

            <!-- Title and Description -->
            <h1 class="text-5xl font-bold mb-4 shadow-text-soft">IC Student Portal</h1>
            <p class="text-xl font-medium mb-2 shadow-text-soft">Institute of Computing</p>
            <p class="text-xl font-medium shadow-text-soft">Davao del Norte State College</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { googleSdkLoaded } from 'vue3-google-login'

const router = useRouter()
const authStore = useAuthStore()
const googleBtnContainer = ref(null)

const form = ref({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// --- Google Sign-In ---
const handleGoogleCredential = async (response) => {
  const { credential } = response
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
}

onMounted(() => {
  // Render the official Google button into the overlay container (invisible)
  // This preserves Google's credential/JWT flow while giving us full-width control
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    console.error('❌ Google Client ID is missing! Please configure VITE_GOOGLE_CLIENT_ID in your environment variables (e.g. Vercel dashboard).')
  }

  googleSdkLoaded((google) => {
    try {
      google.accounts.id.initialize({
        client_id: clientId || 'dummy-id-to-prevent-sdk-crash',
        callback: handleGoogleCredential,
        use_fedcm_for_prompt: true,
      })

      if (googleBtnContainer.value) {
        google.accounts.id.renderButton(googleBtnContainer.value, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: '400',
          text: 'signin_with',
        })
      }
    } catch (err) {
      console.error('❌ Error initializing Google Sign-In SDK:', err)
    }
  })
})

// --- Standard Email/Password Login ---
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

.shadow-text-soft {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.2);
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

/* Google Sign-In overlay: stretch the real Google button across the full width,
   make it invisible, and position it on top of our custom styled button */
.google-signin-wrapper {
  position: relative;
  overflow: hidden;
}

.google-btn-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.0001; /* Nearly invisible but still clickable */
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Force the Google iframe to stretch to fill the overlay */
.google-btn-overlay :deep(div),
.google-btn-overlay :deep(iframe) {
  width: 100% !important;
  height: 100% !important;
  min-height: 56px;
}
</style>
