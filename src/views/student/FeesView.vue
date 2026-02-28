<!-- note: - done na ang pag fetch sa data gikan sa backend, integrate nalang ang pag submit sa user ug payment ug view reciept and approval of pending payments -->


<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Fees</h1>
      <p class="text-gray-500 text-sm mt-0.5">Manage your department fees</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <!-- Summary Cards Skeleton -->
      <div class="grid grid-cols-3 gap-3">
        <div v-for="i in 3" :key="i" class="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      
      <!-- Filters Skeleton -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
        <div class="flex gap-3">
          <div class="h-10 bg-gray-200 rounded w-32"></div>
          <div class="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      
      <!-- Fees List Skeleton -->
      <div class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div class="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div class="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content (only show when not loading) -->
    <template v-else>
    <!-- Summary Cards -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Total</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">₱{{ totalFees.toLocaleString() }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Paid</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">₱{{ paidFees.toLocaleString() }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs text-gray-500">Pending</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">₱{{ outstandingFees.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <div class="flex flex-wrap gap-3">
        <select v-model="filterStatus" class="text-sm border-gray-300 rounded-lg focus:ring-ic-primary focus:border-ic-primary">
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <select v-model="filterSemester" class="text-sm border-gray-300 rounded-lg focus:ring-ic-primary focus:border-ic-primary">
          <option value="all">All Semesters</option>
          <option v-for="semester in availableSemesters" :key="semester" :value="semester">
            {{ semester }}
          </option>
        </select>
        <button @click="resetFilters" class="text-sm text-gray-600 hover:text-gray-900">Reset</button>
      </div>
    </div>

    <!-- Fees List -->
    <div class="space-y-3">
      <div 
        v-for="fee in paginatedFees" 
        :key="fee.id" 
        class="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-sm font-medium text-gray-900">{{ fee.description }}</h3>
              <span 
                class="text-xs px-2 py-0.5 rounded-full shrink-0 capitalize"
                :class="getStatusClass(fee.status)"
              >
                {{ fee.status }}
              </span>
            </div>
            <p class="text-xs text-gray-500">{{ fee.category }} • {{ fee.semester }}</p>
            <div class="flex items-center gap-4 mt-2">
              <div>
                <p class="text-lg font-semibold text-gray-900">₱{{ fee.totalAmount.toLocaleString() }}</p>
                <p v-if="fee.balance > 0 && fee.balance < fee.totalAmount" class="text-xs text-amber-600">Balance: ₱{{ fee.balance.toLocaleString() }}</p>
              </div>
              <p class="text-xs text-gray-500">{{ fee.dueDate }}</p>
            </div>
          </div>
          <span 
            v-if="fee.status === 'paid'" 
            class="text-xs text-gray-400 shrink-0"
          >
            Fully paid
          </span>
          <button 
            v-else 
            class="text-sm text-ic-primary hover:text-ic-primary/80 font-medium shrink-0"
            @click="openPaymentModal(fee)"
          >
            Pay
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredFees.length === 0" class="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <p class="text-sm text-gray-500">No fees found</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between pt-2">
        <p class="text-xs text-gray-500">
          Page {{ currentPage }} of {{ totalPages }} ({{ filteredFees.length }} total)
        </p>
        <div class="flex items-center gap-1">
          <button 
            @click="goToPage(currentPage - 1)" 
            :disabled="currentPage <= 1"
            class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <template v-for="page in paginationPages" :key="page">
            <button 
              v-if="page !== '...'"
              @click="goToPage(page)" 
              class="px-3 py-1.5 text-xs rounded-lg"
              :class="page === currentPage ? 'bg-ic-primary text-white' : 'border border-gray-300 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 text-xs text-gray-400">...</span>
          </template>
          <button 
            @click="goToPage(currentPage + 1)" 
            :disabled="currentPage >= totalPages"
            class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Submissions History -->
    <div v-if="submissions.length > 0">
      <h2 class="text-lg font-semibold text-gray-900 mb-3">Payment Submissions</h2>
      <div class="space-y-3">
        <div 
          v-for="sub in submissions" 
          :key="sub.id" 
          class="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors cursor-pointer"
          @click="viewReceipt(sub)"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-medium text-gray-900">₱{{ parseFloat(sub.total_amount_paid).toLocaleString() }}</h3>
                <span 
                  class="text-xs px-2 py-0.5 rounded-full shrink-0 capitalize"
                  :class="getStatusClass(sub.status)"
                >
                  {{ sub.status }}
                </span>
              </div>
              <p class="text-xs text-gray-500">Ref: {{ sub.reference_number }} • {{ formatDateTime(sub.created_at) }}</p>
            </div>
            <span class="text-xs text-gray-400 shrink-0">View →</span>
          </div>
        </div>
      </div>
    </div>
    </template>

    <!-- Pay via CMS Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-xl">
        <div class="p-6 text-center space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Pay via Collection Management System</h3>
            <p class="text-sm text-gray-500 mt-2">To submit your payment for <strong>{{ selectedFee?.description }}</strong> (₱{{ selectedFee?.balance.toLocaleString() }}), you will be redirected to the Collection Management System.</p>
            <p class="text-xs text-gray-400 mt-2">You will need to log in with your CMS credentials.</p>
          </div>
        </div>
        <div class="flex gap-3 p-6 border-t border-gray-200">
          <button @click="closePaymentModal" class="flex-1 px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
            Cancel
          </button>
          <a 
            :href="cmsUrl" 
            target="_blank"
            @click="closePaymentModal"
            class="flex-1 px-4 py-2 bg-ic-primary text-white text-sm font-medium rounded-xl hover:bg-ic-primary/90 text-center"
          >
            Go to CMS
          </a>
        </div>
      </div>
    </div>

    <!-- Receipt/Submission Detail Modal -->
    <div v-if="showReceiptModal && selectedSubmission" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full shadow-xl max-h-[90vh] flex flex-col">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
          <h3 class="text-lg font-semibold text-gray-900">Payment Submission</h3>
          <button @click="closeReceiptModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-4 overflow-y-auto">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Status</span>
            <span class="text-xs px-2 py-0.5 rounded-full capitalize" :class="getStatusClass(selectedSubmission.status)">{{ selectedSubmission.status }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Amount</span>
            <span class="text-sm font-semibold text-gray-900">₱{{ parseFloat(selectedSubmission.total_amount_paid).toLocaleString() }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Reference</span>
            <span class="text-sm text-gray-900">{{ selectedSubmission.reference_number }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Submitted</span>
            <span class="text-sm text-gray-900">{{ formatDateTime(selectedSubmission.created_at) }}</span>
          </div>
          <div v-if="selectedSubmission.reviewed_by" class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Reviewed by</span>
            <span class="text-sm text-gray-900">{{ selectedSubmission.reviewed_by }}</span>
          </div>
          <!-- Screenshot -->
          <div v-if="selectedSubmission.screenshot_urls?.length">
            <p class="text-xs font-medium text-gray-500 mb-2">Receipt Screenshot</p>
            <img 
              v-for="(url, i) in selectedSubmission.screenshot_urls" 
              :key="i" 
              :src="url" 
              alt="Receipt" 
              class="w-full rounded-xl border border-gray-200" 
            />
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 shrink-0">
          <button @click="closeReceiptModal" class="w-full px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-xl">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getStudentFees, getPaymentSubmissions } from '@/services/feeService'

const authStore = useAuthStore()

// CMS URL (configurable via env)
const cmsUrl = import.meta.env.VITE_CMS_URL || '#'

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
const getStatusClass = (status) => {
  const classes = {
    paid: 'bg-gray-100 text-gray-700',
    pending: 'bg-amber-50 text-amber-700',
    unpaid: 'bg-red-50 text-red-700',
    approved: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const resetFilters = () => {
  filterStatus.value = 'all'
  filterSemester.value = 'all'
}

const openPaymentModal = (fee) => {
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
