<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Fees</h1>
      <p class="text-gray-500 text-sm mt-0.5">Manage your department fees</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <!-- Summary Cards -->
      <div class="grid grid-cols-3 gap-3">
        <div v-for="i in 3" :key="i" class="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-8 bg-gray-200 rounded w-1/2 mt-2"></div>
        </div>
      </div>
      <!-- List -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
         <div class="h-8 bg-gray-200 rounded w-full mb-4"></div>
         <div class="h-12 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-sm font-medium text-red-800">Failed to load fees</p>
      <p class="text-sm text-red-700 mt-1">Could not retrieve fee information. Please try again later.</p>
    </div>

    <!-- Data Display -->
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
          <p class="text-xs text-gray-500">Balance</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">₱{{ outstandingFees.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap gap-3">
            <select v-model="filterStatus" class="text-sm border-gray-300 rounded-lg focus:ring-ic-primary focus:border-ic-primary">
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <select v-model="filterSemester" class="text-sm border-gray-300 rounded-lg focus:ring-ic-primary focus:border-ic-primary">
              <option value="all">All Semesters</option>
              <!-- Note: Semester options should ideally be dynamic -->
              <option v-for="semester in availableSemesters" :key="semester" :value="semester">
                {{ semester }}
              </option>
            </select>
            <button @click="resetFilters" class="text-sm text-gray-600 hover:text-gray-900">Reset</button>
          </div>
          <!-- Pagination -->
          <div class="flex items-center gap-2 text-sm">
            <button @click="fetchFees({ url: pagination.previous })" :disabled="!pagination.previous || loading" class="px-2 py-1 disabled:opacity-50">
              Previous
            </button>
            <span class="text-gray-500">Page {{ currentPage }}</span>
            <button @click="fetchFees({ url: pagination.next })" :disabled="!pagination.next || loading" class="px-2 py-1 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Fees List -->
      <div class="space-y-3">
        <div 
          v-for="fee in filteredFees" 
          :key="fee.id" 
          class="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-medium text-gray-900">{{ fee.description }}</h3>
                <span 
                  class="text-xs px-2 py-0.5 rounded-full shrink-0"
                  :class="getStatusClass(fee.status)"
                >
                  {{ fee.status }}
                </span>
              </div>
              <p class="text-xs text-gray-500">{{ fee.category }} • {{ fee.fullSemester }}</p>
              <div class="flex items-center gap-4 mt-2">
                <p class="text-lg font-semibold text-gray-900">₱{{ fee.amount.toLocaleString() }}</p>
                <p class="text-xs text-gray-500">Due {{ fee.formattedDueDate }}</p>
              </div>
            </div>
            <button 
              v-if="fee.status === 'paid'" 
              class="text-sm text-gray-600 hover:text-gray-900 shrink-0"
              @click="viewReceipt(fee)"
            >
              View
            </button>
            <button 
              v-else-if="fee.status === 'pending'" 
              class="text-sm text-gray-400 cursor-not-allowed shrink-0"
              disabled
            >
              Pending
            </button>
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
          <p class="text-sm text-gray-500">No fees found for the selected filters.</p>
        </div>
      </div>
    </template>

    <!-- Payment Modal (structure only) -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full shadow-xl">
        <!-- Header, Body, Footer... -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getStudentFees } from '@/services/studentService.wrapper'

// --- State ---
const authStore = useAuthStore()
const fees = ref([])
const loading = ref(false)
const error = ref(null)

const pagination = ref({ count: 0, next: null, previous: null })
const currentPage = ref(1)

const filterStatus = ref('all')
const filterSemester = ref('all')

const showPaymentModal = ref(false)
const selectedFee = ref(null)
// Other modal state vars would go here...

// --- Reactive User ID ---
const userId = computed(() => authStore.user?.id)

// --- Data Transformation ---
const transformFee = (rawFee) => {
  const amount = parseFloat(rawFee.total_amount) || 0
  const balance = parseFloat(rawFee.balance) || 0
  
  return {
    id: rawFee.id,
    description: rawFee.category?.description || 'N/A',
    category: rawFee.category?.category_name || 'Uncategorized',
    amount: amount,
    balance: balance,
    paidAmount: amount - balance,
    status: rawFee.status,
    dueDate: rawFee.due_date,
    formattedDueDate: new Date(rawFee.due_date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }),
    semester: rawFee.semester,
    academicYear: rawFee.academic_year,
    fullSemester: `${rawFee.semester} ${rawFee.academic_year}`,
    raw: rawFee,
  }
}

// --- API Fetching ---
const fetchFees = async ({ userId, url } = {}) => {
  loading.value = true
  error.value = null
  try {
    const response = await getStudentFees({ userId, url })
    const responseData = response.data
    
    // Log the raw JSON response to the console for debugging
    console.log('✅ Successfully fetched fee data. Raw API Response:', JSON.stringify(responseData, null, 2));

    const feesList = responseData.results || responseData

    if (!Array.isArray(feesList)) {
      throw new Error("API response is not in the expected format.")
    }

    fees.value = feesList.map(transformFee)

    if (responseData.results) {
      pagination.value = {
        count: responseData.count,
        next: responseData.next,
        previous: responseData.previous,
      }
    } else {
      pagination.value = { count: feesList.length, next: null, previous: null }
      currentPage.value = 1
    }

    if (url) {
      try {
        const fullUrl = url.startsWith('http') ? url : `http://dummybase.com${url}`;
        const urlObject = new URL(fullUrl);
        const page = urlObject.searchParams.get('page') || '1';
        currentPage.value = parseInt(page);
      } catch (e) {
        console.error("Could not parse page number from URL:", url, e);
        currentPage.value = 1;
      }
    } else {
      currentPage.value = 1
    }

  } catch (err) {
    console.error('Failed to fetch student fees:', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

// Fetch fees reactively when the user ID is available
watchEffect(() => {
  if (userId.value) {
    fetchFees({ userId: userId.value })
  }
})

// --- Computed Properties ---
const availableSemesters = computed(() => {
  const allSemesters = fees.value.map(fee => fee.fullSemester);
  return [...new Set(allSemesters)];
});

const filteredFees = computed(() => {
  return fees.value.filter(fee => {
    const statusMatch = filterStatus.value === 'all' || fee.status === filterStatus.value
    const semesterMatch = filterSemester.value === 'all' || fee.fullSemester === filterSemester.value
    return statusMatch && semesterMatch
  })
})

const totalFees = computed(() => {
  return fees.value.reduce((sum, fee) => sum + fee.amount, 0)
})

const paidFees = computed(() => {
  return fees.value.reduce((sum, fee) => sum + fee.paidAmount, 0)
})

const outstandingFees = computed(() => {
  return fees.value
    .filter(fee => fee.status === 'unpaid' || fee.status === 'pending')
    .reduce((sum, fee) => sum + fee.balance, 0)
})

// --- Methods ---
const getStatusClass = (status) => {
  const classes = {
    paid: 'bg-gray-100 text-gray-700',
    pending: 'bg-amber-50 text-amber-700',
    unpaid: 'bg-red-50 text-red-700'
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

const viewReceipt = (fee) => {
  alert(`Viewing receipt for ${fee.description}`)
}
</script>
