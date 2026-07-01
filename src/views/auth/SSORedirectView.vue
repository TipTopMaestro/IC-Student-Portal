<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 flex flex-col items-center text-center transition-all duration-300 transform scale-100 hover:scale-[1.01]">
      
      <!-- Logo / Portal Brand -->
      <div class="flex items-center space-x-2 mb-6">
        <img src="/icsa_logo.png" alt="ICSA Logo" class="w-8 h-8 object-contain" />
        <span class="text-gray-800 font-bold text-lg tracking-wide">IC Student Portal</span>
      </div>

      <!-- Loading State -->
      <div v-if="state === 'loading'" class="space-y-6 py-4 flex flex-col items-center">
        <div class="relative flex items-center justify-center">
          <!-- Outer Pulsing Ring -->
          <div class="absolute w-16 h-16 rounded-full bg-purple-50 animate-ping"></div>
          <!-- Spinner -->
          <div class="relative w-12 h-12 border-4 border-ic-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-bold text-gray-800">Secure Redirection</h2>
          <p class="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
            Verifying your security credentials and redirecting you to <span class="font-semibold text-ic-primary">{{ systemLabel }}</span>. Please wait...
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="state === 'error'" class="space-y-6 py-4 flex flex-col items-center animate-fade-in">
        <!-- Error Icon (Exclamation Shield) -->
        <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div class="space-y-2">
          <h2 class="text-xl font-bold text-red-600">{{ errorTitle || 'Redirection Failed' }}</h2>
          <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line px-2">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full pt-4">
          <button 
            @click="tryAgain" 
            class="flex-1 px-5 py-2.5 bg-ic-primary hover:bg-primary-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            Try Again
          </button>
          <button 
            @click="closeTab" 
            class="flex-1 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 border border-gray-200 cursor-pointer"
          >
            Close Tab
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const route = useRoute()
const router = useRouter()
const sysId = computed(() => {
  const sysVal = route.query.sys
  const rawSys = Array.isArray(sysVal) ? sysVal[0] : sysVal
  return typeof rawSys === 'string' ? rawSys.toLowerCase() : ''
})

const state = ref('loading') // 'loading' | 'error'
const errorTitle = ref('')
const errorMessage = ref('')

// Maps system IDs to user-friendly labels
const SYSTEM_LABELS = {
  cms: 'Collection Management System (ICCMS)',
  voting: 'Voting Management System',
  locker: 'Locker Rental Management System (LRMS)'
}

const systemLabel = computed(() => {
  return SYSTEM_LABELS[sysId.value] || 'External System'
})

// Fallback configuration for client-side token retrieval (used ONLY if backend API returns 404)
const FALLBACK_SYSTEMS = {
  cms: {
    url: import.meta.env.VITE_CMS_URL || 'https://collection-management-system-one.vercel.app/auth/login',
    intendedFor: 'collection-management-system'
  },
  voting: {
    url: import.meta.env.VITE_VOTING_URL || 'https://ic-lsg-voting-management-system.onrender.com/login',
    intendedFor: 'voting-system'
  },
  locker: {
    url: import.meta.env.VITE_LOCKER_URL || 'https://dnsclocker.vercel.app',
    intendedFor: 'locker-system'
  }
}

// Track timeout to prevent memory leaks if component is unmounted
let timeoutId = null

const closeTab = () => {
  window.close()
}

const tryAgain = () => {
  state.value = 'loading'
  performSSORedirect()
}

const performSSORedirect = async () => {
  // 1. Client-Side Input Validation
  const validSystems = ['cms', 'voting', 'locker']
  if (!validSystems.includes(sysId.value)) {
    state.value = 'error'
    errorTitle.value = 'Invalid System Target'
    errorMessage.value = `The requested target system "${sysId.value}" is not registered on our security allowlist.`
    return
  }

  // Derive the API base dynamically from environment config
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://dnsc-systems-api.onrender.com'
  const cleanApiBase = apiBase.replace(/\/$/, '')
  const redeemUrl = `${cleanApiBase}/api/v1/transfer_token/redeem/`

  // To make transitions smooth and avoid flickering, enforce a minimum 1.2s loader duration
  const startTime = Date.now()
  
  try {
    // 2. Fetch redirect details and token from the backend
    console.log(`🔐 Initiating background SSO verification for: ${sysId.value}`)
    const result = await authService.getSSORedirectDetails(sysId.value)
    
    // Validate response payload integrity
    if (!result || !result.target_url || !result.transfer_token) {
      throw new Error('Malformed backend redirect payload received.')
    }
    
    // 1. Construct the base destination URL
    const destinationUrl = new URL(result.target_url);

    // 2. Safely get the expected allowlisted URL
    const expectedUrl = FALLBACK_SYSTEMS[sysId.value]?.url;

    // 3. Verify origin (Defense-in-depth Open Redirect protection)
    // If the sysId doesn't exist, or the origins don't match, block it.
    if (!expectedUrl || new URL(expectedUrl).origin !== destinationUrl.origin) {
      throw new Error('Unsafe SSO redirect target received or system not allowlisted.');
    }

    // 4. Secure Token Transmission
    // Append the short-lived tokens to be redeemed by the target system
    destinationUrl.searchParams.set('sso_token', result.transfer_token);
    destinationUrl.searchParams.set('redeem_url', redeemUrl);
    
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, 1200 - elapsedTime)
    
    timeoutId = setTimeout(() => {
      window.location.href = destinationUrl.toString()
    }, remainingTime)
    
  } catch (error) {
    console.error('SSO Redirection Error:', error)
    
    // 3. Smart Backward-Compatible Fallback
    // If the endpoint does not exist yet (404 status), perform secure client-side lookup
    const is404 = error.response?.status === 404 || error.message?.includes('404')
    if (is404 && FALLBACK_SYSTEMS[sysId.value]) {
      console.warn('⚠️ Backend SSO redirect endpoint returned 404. Initiating local fallback...')
      
      try {
        const config = FALLBACK_SYSTEMS[sysId.value]
        // Fetch short-lived token from existing endpoint
        const tokenRes = await authService.issueTransferToken(config.intendedFor)
        const transferToken = tokenRes.transfer_token || tokenRes.data?.transfer_token
        
        if (!transferToken) {
          throw new Error('Failed to retrieve fallback transfer token.')
        }
        
        const destinationUrl = new URL(config.url)
        destinationUrl.searchParams.set('token', transferToken)
        destinationUrl.searchParams.set('token_url', transferToken)
        destinationUrl.searchParams.set('transfer_token', transferToken)
        destinationUrl.searchParams.set('sso_token', transferToken)
        destinationUrl.searchParams.set('redeem_url', redeemUrl)
        
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, 1200 - elapsedTime)
        
        timeoutId = setTimeout(() => {
          window.location.href = destinationUrl.toString()
        }, remainingTime)
        return
      } catch (fallbackError) {
        console.error('Fallback SSO failed:', fallbackError)
      }
    }
    
    // 4. Detailed error messaging based on response code
    state.value = 'error'
    const status = error.response?.status
    
    if (status === 401 || status === 403) {
      errorTitle.value = 'Authentication Expired'
      errorMessage.value = 'Your active session has expired or is invalid.\nPlease sign back into the Student Portal and try again.'
    } else if (status === 503 || status === 504 || error.message?.includes('Network Error')) {
      errorTitle.value = 'Service Connection Timeout'
      errorMessage.value = 'We could not reach the security verification servers.\nPlease check your network connection and try again.'
    } else {
      errorTitle.value = 'Verification Error'
      errorMessage.value = `SSO redirect failed: ${error.response?.data?.detail || error.message || 'Unknown backend error.'}`
    }
  }
}

onMounted(() => {
  performSSORedirect()
})

onUnmounted(() => {
  // Prevent memory leaks / state mutation attempts if unmounted prior to redirect timeout
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
