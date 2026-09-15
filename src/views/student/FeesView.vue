<!-- note: - done na ang pag fetch sa data gikan sa backend, integrate nalang ang pag submit sa user ug payment ug view reciept and approval of pending payments -->


<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div>
      <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">fees</h1>
      <p class="text-sm text-gray-500 mt-0.5">Manage your department fees</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <!-- Summary Skeleton -->
      <div class="space-y-3">
        <div class="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div v-for="i in 3" :key="i" class="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
            <div class="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
      
      <!-- Fees List Skeleton -->
      <div class="space-y-3">
        <div class="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
        <div v-for="i in 3" :key="i" class="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
          <div class="flex items-start justify-between">
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              <div class="h-6 bg-gray-200 rounded w-1/4 mt-2"></div>
            </div>
            <div class="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content (only show when not loading) -->
    <template v-else>
      <!-- 01 — balance overview -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <span class="font-pixel text-sm text-gray-400 lowercase">01 — balance overview</span>
          <button 
            @click="openPaymentModal(null)" 
            class="group font-mono text-[11px] font-medium text-ic-primary hover:text-ic-secondary uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>pay via cms</span>
            <span class="text-[10px] transition-transform group-hover:translate-x-0.5">↗</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <p class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total Fees</p>
            <p class="font-pixel text-3xl text-gray-900 mt-1.5 leading-none">₱{{ totalFees.toLocaleString() }}</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <p class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Paid</p>
            <p class="font-pixel text-3xl text-emerald-700 mt-1.5 leading-none">₱{{ paidFees.toLocaleString() }}</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div class="flex items-center justify-between">
              <p class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">Outstanding</p>
              <span 
                v-if="outstandingFees > 0"
                class="inline-flex items-center gap-1.5 rounded-full border border-ic-secondary/25 bg-ic-secondary/[0.07] px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-ic-secondary"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-ic-secondary animate-pulse"></span>
                Unpaid
              </span>
            </div>
            <p class="font-pixel text-3xl mt-1.5 leading-none" :class="outstandingFees > 0 ? 'text-ic-secondary' : 'text-gray-900'">₱{{ outstandingFees.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- 02 — fees list -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <span class="font-pixel text-sm text-gray-400 lowercase">02 — fees list</span>
          <span class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">{{ filteredFees.length }} items</span>
        </div>

        <!-- Inline Filters -->
        <div class="flex flex-wrap items-center gap-2 px-1">
          <select 
            v-model="filterStatus" 
            class="font-mono text-[11px] uppercase tracking-wider text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-ic-primary focus:border-ic-primary transition-colors cursor-pointer appearance-auto"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <select 
            v-model="filterSemester" 
            class="font-mono text-[11px] uppercase tracking-wider text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-ic-primary focus:border-ic-primary transition-colors cursor-pointer appearance-auto"
          >
            <option value="all">All Semesters</option>
            <option v-for="semester in availableSemesters" :key="semester" :value="semester">
              {{ semester }}
            </option>
          </select>
          <button 
            v-if="filterStatus !== 'all' || filterSemester !== 'all'"
            @click="resetFilters" 
            class="font-mono text-[11px] font-medium text-gray-400 hover:text-ic-primary uppercase tracking-wider transition-colors cursor-pointer"
          >
            Reset ×
          </button>
        </div>

        <!-- Fees Cards -->
        <div class="space-y-3">
          <div 
            v-for="fee in paginatedFees" 
            :key="fee.id" 
            class="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] transition-all duration-300"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1.5">
                  <h3 class="text-sm font-semibold text-gray-900 truncate">{{ fee.description }}</h3>
                  <span 
                    class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider shrink-0"
                    :class="getStatusBadgeClass(fee.status)"
                  >
                    <span class="w-1 h-1 rounded-full" :class="getStatusDotClass(fee.status)"></span>
                    {{ fee.status }}
                  </span>
                </div>
                <p class="font-mono text-[11px] text-gray-400 uppercase tracking-wider">{{ fee.category }} · {{ fee.semester }}</p>
                <div class="flex items-baseline gap-3 mt-2.5">
                  <p class="font-pixel text-xl text-gray-900 leading-none">₱{{ fee.totalAmount.toLocaleString() }}</p>
                  <p v-if="fee.balance > 0 && fee.balance < fee.totalAmount" class="font-mono text-[11px] text-amber-600 uppercase tracking-wider">
                    Balance: ₱{{ fee.balance.toLocaleString() }}
                  </p>
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider">Due</p>
                <p class="font-mono text-xs text-gray-600 mt-0.5">{{ fee.dueDate }}</p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredFees.length === 0" class="bg-white border border-gray-200 rounded-2xl py-16 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <svg class="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="font-pixel text-sm text-gray-400 lowercase">no fees found</p>
            <p class="font-mono text-[11px] text-gray-400 mt-1 uppercase tracking-wider">try adjusting your filters</p>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-between pt-2">
            <p class="font-mono text-[11px] text-gray-400 uppercase tracking-wider">
              Page {{ currentPage }} of {{ totalPages }} · {{ filteredFees.length }} total
            </p>
            <div class="flex items-center gap-1">
              <button 
                @click="goToPage(currentPage - 1)" 
                :disabled="currentPage <= 1"
                class="px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Prev
              </button>
              <template v-for="page in paginationPages" :key="page">
                <button 
                  v-if="page !== '...'"
                  @click="goToPage(page)" 
                  class="px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                  :class="page === currentPage ? 'bg-ic-primary text-white shadow-sm' : 'border border-gray-200 hover:bg-gray-50 hover:border-gray-300'"
                >
                  {{ page }}
                </button>
                <span v-else class="px-2 font-mono text-[11px] text-gray-300">···</span>
              </template>
              <button 
                @click="goToPage(currentPage + 1)" 
                :disabled="currentPage >= totalPages"
                class="px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 03 — payment submissions -->
      <div v-if="submissions.length > 0" class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <span class="font-pixel text-sm text-gray-400 lowercase">03 — payment submissions</span>
          <span class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">{{ submissions.length }} submitted</span>
        </div>

        <div class="space-y-3">
          <div 
            v-for="sub in submissions" 
            :key="sub.id" 
            class="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer group"
            @click="viewReceipt(sub)"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-pixel text-lg text-gray-900 leading-none">₱{{ parseFloat(sub.total_amount_paid).toLocaleString() }}</p>
                  <span 
                    class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider shrink-0"
                    :class="getStatusBadgeClass(sub.status)"
                  >
                    <span class="w-1 h-1 rounded-full" :class="getStatusDotClass(sub.status)"></span>
                    {{ sub.status }}
                  </span>
                </div>
                <p class="font-mono text-[11px] text-gray-400 uppercase tracking-wider truncate">
                  Ref: <span class="text-gray-600 normal-case">{{ sub.reference_number }}</span> · {{ formatDateTime(sub.created_at) }}
                </p>
              </div>
              <span class="group font-mono text-[11px] font-medium uppercase tracking-wider text-gray-400 group-hover:text-ic-primary transition-colors shrink-0 inline-flex items-center gap-1">
                <span>view</span>
                <span class="text-[10px] transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Pay via CMS Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showPaymentModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4" @click.self="closePaymentModal">
          <div class="bg-white rounded-2xl max-w-md w-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-gray-200/80 overflow-hidden animate-modal-pop">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-ic-primary"></span>
                <span class="font-mono text-[10px] font-medium text-gray-400 uppercase tracking-wider">System Dispatch · CMS</span>
              </div>
              <button @click="closePaymentModal" class="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" aria-label="Close">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 space-y-4">
              <div>
                <span class="font-pixel text-xs text-ic-primary lowercase tracking-wide block mb-1">redirect</span>
                <h3 class="font-pixel text-xl text-gray-900 lowercase tracking-tight">pay via cms</h3>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed font-sans">
                  You will be dispatched to the official DNSC Collection Management System to complete online settlement.
                </p>
              </div>

              <!-- Fee / Balance Target Callout Card -->
              <div class="rounded-xl border border-gray-200/80 bg-gray-50/80 p-4 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    {{ selectedFee ? 'Target Obligation' : 'Total Outstanding' }}
                  </span>
                  <span class="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-gray-200 bg-white text-gray-600 font-medium">
                    {{ selectedFee ? (selectedFee.semester || 'Current Term') : 'Consolidated' }}
                  </span>
                </div>

                <div class="pt-0.5">
                  <p v-if="selectedFee" class="text-xs font-semibold text-gray-900 truncate mb-1">
                    {{ selectedFee.description }}
                  </p>
                  <div class="flex items-baseline gap-2">
                    <p class="font-pixel text-2xl" :class="selectedFee ? 'text-gray-900' : 'text-ic-secondary'">
                      ₱{{ (selectedFee ? selectedFee.balance : outstandingFees).toLocaleString() }}
                    </p>
                    <span class="font-mono text-[10px] text-gray-400 uppercase tracking-wider">PHP Balance</span>
                  </div>
                </div>
              </div>

              <!-- SSO Routing Pipeline Micro-indicator -->
              <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50/50 border border-gray-100 font-mono text-[10px] text-gray-500">
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span class="uppercase tracking-wider">IC Student Portal</span>
                </div>
                <span class="text-gray-300">→</span>
                <div class="flex items-center gap-1.5 text-ic-primary font-medium">
                  <span class="uppercase tracking-wider">DNSC CMS Gateway</span>
                </div>
              </div>

              <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider text-center pt-1">
                Authentication will be transferred securely via SSO
              </p>
            </div>

            <!-- Modal Actions -->
            <div class="flex items-center gap-3 p-4 px-6 border-t border-gray-100 bg-gray-50/30">
              <button 
                @click="closePaymentModal" 
                class="flex-1 px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-wider text-gray-500 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                @click="handleGoToCMS"
                class="flex-1 px-4 py-2.5 bg-ic-primary text-white font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl hover:bg-ic-secondary transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-[0_2px_8px_-2px_rgba(100,13,95,0.4)]"
              >
                <span>Launch CMS</span>
                <span class="text-xs">↗</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Receipt/Submission Detail Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showReceiptModal && selectedSubmission" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4" @click.self="closeReceiptModal">
          <div class="bg-white rounded-2xl max-w-lg w-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-gray-200/80 max-h-[90vh] flex flex-col overflow-hidden animate-modal-pop">
            <div class="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 class="font-pixel text-lg text-gray-900 lowercase">payment submission</h3>
              <button @click="closeReceiptModal" class="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6 space-y-4 overflow-y-auto">
              <div class="flex items-center justify-between">
                <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                <span 
                  class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider" 
                  :class="getStatusBadgeClass(selectedSubmission.status)"
                >
                  <span class="w-1 h-1 rounded-full" :class="getStatusDotClass(selectedSubmission.status)"></span>
                  {{ selectedSubmission.status }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Amount</span>
                <span class="font-pixel text-lg text-gray-900">₱{{ parseFloat(selectedSubmission.total_amount_paid).toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Reference</span>
                <span class="font-mono text-xs text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">{{ selectedSubmission.reference_number }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Submitted</span>
                <span class="font-mono text-xs text-gray-600">{{ formatDateTime(selectedSubmission.created_at) }}</span>
              </div>
              <div v-if="selectedSubmission.reviewed_by" class="flex items-center justify-between">
                <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Reviewed by</span>
                <span class="text-sm text-gray-900">{{ selectedSubmission.reviewed_by }}</span>
              </div>
              <!-- Screenshot -->
              <div v-if="selectedSubmission.screenshot_urls?.length" class="pt-2 border-t border-gray-100">
                <p class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Receipt Screenshot</p>
                <div class="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <img 
                    v-for="(url, i) in selectedSubmission.screenshot_urls" 
                    :key="i" 
                    :src="url" 
                    alt="Receipt" 
                    class="w-full h-auto object-cover max-h-[300px]" 
                  />
                </div>
              </div>
            </div>
            <div class="p-6 border-t border-gray-100 shrink-0">
              <button 
                @click="closeReceiptModal" 
                class="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getStudentFees, getPaymentSubmissions } from '@/services/feeService'

const router = useRouter()
const authStore = useAuthStore()

const handleGoToCMS = () => {
  closePaymentModal()
  // Resolve route dynamically to respect the router base path (e.g. subpath deployments)
  const resolved = router.resolve({ name: 'sso-redirect', query: { sys: 'cms' } })
  window.open(resolved.href, '_blank', 'noopener,noreferrer')
}

// Loading and error states
const isLoading = ref(true)
const error = ref(null)

// Filters
const filterStatus = ref('all')
const filterSemester = ref('all')

// Modal state
const showPaymentModal = ref(false)
const selectedFee = ref(null)

// Receipt modal state
const showReceiptModal = ref(false)
const selectedSubmission = ref(null)

// All fees (fetched once for accurate summaries)
const allFees = ref([])
const submissions = ref([])

// Client-side pagination
const currentPage = ref(1)
const perPage = 10

// Get current student ID
const studentId = computed(() => {
  return authStore.user?.student?.id || null
})

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'No due date'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'No due date'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Map backend fee data to frontend format
const mapFeeData = (backendFee) => {
  const totalAmount = parseFloat(backendFee.total_amount) || 0
  const balance = parseFloat(backendFee.balance) || 0
  return {
    id: backendFee.id,
    description: backendFee.category_name,
    category: backendFee.category_name,
    balance,
    totalAmount,
    paidAmount: totalAmount - balance,
    semester: `${backendFee.semester || ''} Semester ${backendFee.academic_year || ''}`.trim(),
    dueDate: formatDate(backendFee.due_date),
    status: backendFee.status,
    isOverdue: backendFee.due_date && new Date(backendFee.due_date) < new Date() && backendFee.status !== 'paid'
  }
}

// Load all fees and submissions from API
const loadFees = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const sid = studentId.value
    console.log('💰 FeesView: Loading all fees for student:', sid)
    
    // Fetch ALL fees in one call for accurate summaries + client-side pagination
    const [feesResult, subsResult] = await Promise.all([
      getStudentFees(sid, { page: 1, perPage: 200 }),
      getPaymentSubmissions(sid)
    ])
    
    if (feesResult.success) {
      allFees.value = feesResult.data.map(mapFeeData)
    } else {
      error.value = feesResult.error
    }
    
    if (subsResult?.success) {
      submissions.value = subsResult.data
    }
  } catch (err) {
    error.value = 'Failed to load fees'
    console.error('❌ FeesView: Error loading fees:', err)
  } finally {
    isLoading.value = false
  }
}

// Reset to page 1 when filters change
watch([filterStatus, filterSemester], () => {
  currentPage.value = 1
})

// Computed: available semesters from ALL fees
const availableSemesters = computed(() => {
  const semesters = [...new Set(allFees.value.map(fee => fee.semester))]
  return semesters.sort()
})

// Computed: filtered fees (across ALL data, not just current page)
const filteredFees = computed(() => {
  return allFees.value.filter(fee => {
    const statusMatch = filterStatus.value === 'all' || fee.status === filterStatus.value
    const semesterMatch = filterSemester.value === 'all' || fee.semester === filterSemester.value
    return statusMatch && semesterMatch
  })
})

// Client-side pagination
const totalPages = computed(() => Math.ceil(filteredFees.value.length / perPage) || 1)

const paginatedFees = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredFees.value.slice(start, start + perPage)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Summary cards — computed from ALL fees (not just current page)
const totalFees = computed(() => {
  return allFees.value.reduce((sum, fee) => sum + fee.totalAmount, 0)
})

const paidFees = computed(() => {
  // Paid = sum of (totalAmount - balance) for each fee
  return allFees.value.reduce((sum, fee) => sum + fee.paidAmount, 0)
})

const outstandingFees = computed(() => {
  // Outstanding = sum of remaining balance for all non-paid fees
  return allFees.value
    .filter(fee => fee.status !== 'paid')
    .reduce((sum, fee) => sum + fee.balance, 0)
})

const paginationPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  pages.push(1)
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// Initialize on mount
onMounted(() => {
  loadFees()
})

// Methods
const getStatusBadgeClass = (status) => {
  const classes = {
    paid: 'border-emerald-700/20 bg-emerald-600/[0.06] text-emerald-800',
    pending: 'border-[#640D5F]/20 bg-[#640D5F]/[0.06] text-[#520B4D]',
    unpaid: 'border-ic-secondary/25 bg-ic-secondary/[0.07] text-ic-secondary',
    approved: 'border-emerald-700/20 bg-emerald-600/[0.06] text-emerald-800',
    rejected: 'border-ic-secondary/25 bg-ic-secondary/[0.07] text-ic-secondary'
  }
  return classes[status] || 'border-gray-200 bg-gray-50 text-gray-600'
}

const getStatusDotClass = (status) => {
  const classes = {
    paid: 'bg-emerald-600',
    pending: 'bg-ic-primary animate-pulse',
    unpaid: 'bg-ic-secondary',
    approved: 'bg-emerald-600',
    rejected: 'bg-ic-secondary'
  }
  return classes[status] || 'bg-gray-400'
}

const resetFilters = () => {
  filterStatus.value = 'all'
  filterSemester.value = 'all'
}

const openPaymentModal = (fee = null) => {
  selectedFee.value = fee
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedFee.value = null
}

const viewReceipt = (submission) => {
  selectedSubmission.value = submission
  showReceiptModal.value = true
}

const closeReceiptModal = () => {
  showReceiptModal.value = false
  selectedSubmission.value = null
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}
</script>
