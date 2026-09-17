<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 selection:bg-ic-primary/10">
    <div class="w-full max-w-md animate-fade-in-up">
      <!-- Main Handoff Card -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.04)] text-center relative overflow-hidden">
        
        <!-- Top Status Kicker -->
        <div class="flex items-center justify-center gap-2 mb-6">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 font-mono text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" :class="{ 'animate-pulse': state === 'loading' }"></span>
            DNSC Campus SSO · Secure Handoff
          </span>
        </div>

        <!-- LOADING STATE -->
        <div v-if="state === 'loading'" class="space-y-6">
          <!-- Session Bridge Visualization -->
          <div class="bg-gray-50/80 border border-gray-100 rounded-xl p-5 my-2">
            <div class="flex items-center justify-between gap-3">
              <!-- Origin: IC Portal -->
              <div class="flex flex-col items-center gap-1.5 min-w-[72px]">
                <div class="relative w-12 h-12 rounded-xl bg-white border border-gray-200 p-2 shadow-xs flex items-center justify-center">
                  <img src="/icsa_logo.png" alt="IC Portal" class="w-7 h-7 object-contain" />
                  <span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <span class="font-mono text-[10px] font-semibold text-gray-600 uppercase tracking-wider">IC Portal</span>
              </div>

              <!-- Transit Connection Bridge -->
              <div class="flex-1 flex flex-col items-center gap-1 px-1">
                <span class="font-mono text-[9px] font-semibold text-ic-primary uppercase tracking-widest">Token Exchange</span>
                <div class="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div class="absolute inset-y-0 w-1/2 bg-gradient-to-r from-ic-primary via-ic-secondary to-ic-primary rounded-full animate-bridge-flow"></div>
                </div>
                <div class="flex items-center gap-1 text-gray-400">
                  <ArrowRight class="w-3.5 h-3.5 text-ic-secondary animate-pulse" />
                </div>
              </div>

              <!-- Destination: Target System -->
              <div class="flex flex-col items-center gap-1.5 min-w-[72px]">
                <div class="relative w-12 h-12 rounded-xl bg-white border border-gray-200 p-2 shadow-xs flex items-center justify-center">
                  <img 
                    v-if="targetSystem.logo" 
                    :src="targetSystem.logo" 
                    :alt="targetSystem.shortName" 
                    class="w-7 h-7 object-contain"
                  />
                  <ShieldCheck v-else class="w-6 h-6 text-gray-400" />
                  <span class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-white rounded-full animate-pulse"></span>
                </div>
                <span class="font-mono text-[10px] font-semibold text-gray-800 uppercase tracking-wider truncate max-w-[90px]" :title="targetSystem.shortName">
                  {{ targetSystem.shortName }}
                </span>
              </div>
            </div>
          </div>

          <!-- Narrative Text -->
          <div class="space-y-2">
            <h1 class="font-pixel text-xl sm:text-2xl text-gray-900 lowercase tracking-tight">transferring session</h1>
            <p class="font-sans text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
              Verifying your identity credentials and establishing an authenticated session with 
              <span class="font-semibold text-gray-800">{{ targetSystem.fullName }}</span>.
            </p>
          </div>

          <!-- Indeterminate Progress Bar -->
          <div class="relative w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div class="absolute inset-y-0 bg-gradient-to-r from-ic-primary via-ic-secondary to-ic-primary w-1/3 rounded-full animate-progress-slide"></div>
          </div>

          <!-- Telemetry & Security Chips -->
          <div class="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
            <span class="inline-flex items-center gap-1">
              <Lock class="w-3 h-3 text-emerald-600" /> TLS 1.3 Verified
            </span>
            <span>·</span>
            <span>DNSC Auth Gateway</span>
            <span>·</span>
            <span class="truncate max-w-[140px]">{{ targetSystem.host }}</span>
          </div>
        </div>

        <!-- ERROR STATE -->
        <div v-else-if="state === 'error'" class="space-y-5 animate-fade-in">
          <!-- Error Icon -->
          <div class="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600 shadow-xs">
            <AlertCircle class="w-6 h-6" :stroke-width="2" />
          </div>

          <!-- Error Details -->
          <div class="space-y-1.5">
            <span class="font-mono text-[10px] font-semibold text-rose-600 uppercase tracking-wider">Authentication Notice</span>
            <h2 class="font-pixel text-xl text-gray-900 lowercase tracking-tight">{{ errorTitle || 'redirection interrupted' }}</h2>
            <p class="font-sans text-xs text-gray-600 leading-relaxed max-w-sm mx-auto pt-1">
              {{ errorMessage || 'We were unable to complete the secure session transfer to the destination campus system.' }}
            </p>
          </div>

          <!-- Destination Context -->
          <div class="p-3 bg-gray-50 border border-gray-100 rounded-xl text-left flex items-center justify-between text-xs">
            <div class="min-w-0">
              <p class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Target Node</p>
              <p class="font-sans text-xs font-semibold text-gray-800 truncate">{{ targetSystem.fullName }}</p>
            </div>
            <span class="font-mono text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Gateway Timeout
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button 
              @click="tryAgain" 
              class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-ic-primary hover:bg-[#520a4e] text-white text-xs font-semibold rounded-xl shadow-[0_4px_14px_-4px_rgba(100,13,95,0.3)] hover:shadow-[0_6px_20px_-4px_rgba(100,13,95,0.4)] transition-all cursor-pointer"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
            <button 
              @click="returnToPortal" 
              class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-colors cursor-pointer"
            >
              <ArrowLeft class="w-3.5 h-3.5" />
              <span>Return to Portal</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Footer Micro-copy -->
      <div class="mt-6 text-center space-y-1">
        <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider">
          Institute of Computing · Davao del Norte State College
        </p>
        <p class="font-sans text-[11px] text-gray-400">
          Having trouble? You can also sign in directly on the official campus system page.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { performSSORedirect } from '@/utils/sso'
import { 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  Lock 
} from 'lucide-vue-next'

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

const SYSTEM_REGISTRY = {
  cms: {
    id: 'cms',
    shortName: 'ICCMS',
    fullName: 'Collection Management System',
    logo: '/icsa_logo.png',
    host: 'collection.instituteofcomputing.org'
  },
  voting: {
    id: 'voting',
    shortName: 'IC Voting System',
    fullName: 'Elections Management System',
    logo: '/voting-logo.png',
    host: 'election.instituteofcomputing.org'
  },
  locker: {
    id: 'locker',
    shortName: 'LRMS',
    fullName: 'Locker Rental Management System',
    logo: '/lrms-logo.jpg',
    host: 'locker.instituteofcomputing.org'
  }
}

const targetSystem = computed(() => {
  return SYSTEM_REGISTRY[sysId.value] || {
    id: sysId.value || 'external',
    shortName: 'Campus Service',
    fullName: 'DNSC Campus Management System',
    logo: null,
    host: 'instituteofcomputing.org'
  }
})

const returnToPortal = () => {
  // If in a popup or new tab, attempt close; otherwise route back home
  if (window.opener || window.history.length <= 1) {
    window.close()
  }
  router.push('/')
}

const tryAgain = () => {
  state.value = 'loading'
  triggerSSORedirect()
}

const triggerSSORedirect = async () => {
  await performSSORedirect(sysId.value, null, {
    onError: (title, msg) => {
      state.value = 'error'
      errorTitle.value = title
      errorMessage.value = msg
    }
  })
}

onMounted(() => {
  triggerSSORedirect()
})
</script>

<style scoped>
@keyframes bridgeFlow {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.animate-bridge-flow {
  animation: bridgeFlow 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes progressSlide {
  0% {
    left: -35%;
    width: 35%;
  }
  50% {
    left: 25%;
    width: 60%;
  }
  100% {
    left: 100%;
    width: 35%;
  }
}

.animate-progress-slide {
  position: absolute;
  animation: progressSlide 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
