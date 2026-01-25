<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Fees</h1>
      <p class="text-gray-500 text-sm mt-0.5">Manage your department fees</p>
    </div>

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
          <option value="1st-2024">1st Semester 2024</option>
          <option value="2nd-2024">2nd Semester 2024</option>
          <option value="summer-2024">Summer 2024</option>
        </select>
        <button @click="resetFilters" class="text-sm text-gray-600 hover:text-gray-900">Reset</button>
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
            <p class="text-xs text-gray-500">{{ fee.category }} • {{ fee.semester }}</p>
            <div class="flex items-center gap-4 mt-2">
              <p class="text-lg font-semibold text-gray-900">₱{{ fee.amount.toLocaleString() }}</p>
              <p class="text-xs text-gray-500">Due {{ fee.dueDate }}</p>
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
        <p class="text-sm text-gray-500">No fees found</p>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full shadow-xl">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Upload Payment</h3>
          <button @click="closePaymentModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <!-- Fee Info -->
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500 mb-1">{{ selectedFee?.description }}</p>
            <p class="text-2xl font-semibold text-gray-900">₱{{ selectedFee?.amount.toLocaleString() }}</p>
          </div>

          <!-- Instructions -->
          <div class="space-y-2">
            <p class="text-xs font-medium text-gray-900">Payment Instructions</p>
            <div class="text-xs text-gray-600 space-y-1">
              <p>• GCash: 0917-123-4567 (ICSA Department)</p>
              <p>• Include Student ID in message</p>
              <p>• Upload clear screenshot</p>
            </div>
          </div>

          <!-- Upload Area -->
          <div>
            <p class="text-xs font-medium text-gray-900 mb-2">Receipt Screenshot</p>
            <div 
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
              :class="isDragging ? 'border-ic-primary bg-purple-50' : 'border-gray-300 hover:border-gray-400'"
            >
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                @change="handleFileSelect" 
                class="hidden"
              />
              <div v-if="!uploadedFile">
                <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="mt-2 text-sm text-gray-600">Upload screenshot</p>
                <p class="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
              </div>
              <div v-else class="relative inline-block">
                <img :src="previewUrl" alt="Preview" class="h-32 rounded-lg" />
                <button 
                  @click.stop="removeFile" 
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <p class="text-xs font-medium text-gray-900 mb-2">Notes (Optional)</p>
            <textarea 
              v-model="paymentNotes" 
              rows="3" 
              class="w-full text-sm border-gray-300 rounded-xl focus:ring-ic-primary focus:border-ic-primary resize-none"
              placeholder="Additional information..."
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 p-6 border-t border-gray-200">
          <button @click="closePaymentModal" class="flex-1 px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
            Cancel
          </button>
          <button 
            @click="submitPayment" 
            :disabled="!uploadedFile || isSubmitting"
            class="flex-1 px-4 py-2 bg-ic-primary text-white text-sm font-medium rounded-xl hover:bg-ic-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Filters
const filterStatus = ref('all')
const filterSemester = ref('all')

// Modal state
const showPaymentModal = ref(false)
const selectedFee = ref(null)
const uploadedFile = ref(null)
const previewUrl = ref(null)
const paymentNotes = ref('')
const isDragging = ref(false)
const isSubmitting = ref(false)
const fileInput = ref(null)

// Dummy data - will be fetched from API
const fees = ref([
  {
    id: 1,
    description: 'Department Shirt',
    category: 'Uniform',
    amount: 450,
    semester: '1st Semester 2024',
    dueDate: 'Jan 30, 2024',
    status: 'unpaid',
    isOverdue: false
  },
  {
    id: 2,
    description: 'IT Club Membership',
    category: 'Organization',
    amount: 300,
    semester: '1st Semester 2024',
    dueDate: 'Feb 15, 2024',
    status: 'paid',
    isOverdue: false
  },
  {
    id: 3,
    description: 'Tech Summit Registration',
    category: 'Events',
    amount: 250,
    semester: '1st Semester 2024',
    dueDate: 'Feb 20, 2024',
    status: 'pending',
    isOverdue: false
  },
  {
    id: 4,
    description: 'ID Replacement',
    category: 'Miscellaneous',
    amount: 100,
    semester: '1st Semester 2024',
    dueDate: 'Mar 1, 2024',
    status: 'unpaid',
    isOverdue: false
  },
  {
    id: 5,
    description: 'Workshop Materials',
    category: 'Events',
    amount: 350,
    semester: '2nd Semester 2024',
    dueDate: 'Mar 10, 2024',
    status: 'paid',
    isOverdue: false
  },
  {
    id: 6,
    description: 'Activity Fee',
    category: 'Department',
    amount: 500,
    semester: '2nd Semester 2024',
    dueDate: 'Mar 15, 2024',
    status: 'pending',
    isOverdue: false
  }
])

// Computed properties
const filteredFees = computed(() => {
  return fees.value.filter(fee => {
    const statusMatch = filterStatus.value === 'all' || fee.status === filterStatus.value
    const semesterMatch = filterSemester.value === 'all' || fee.semester === filterSemester.value.replace('-', ' ')
    return statusMatch && semesterMatch
  })
})

const totalFees = computed(() => {
  return fees.value.reduce((sum, fee) => sum + fee.amount, 0)
})

const paidFees = computed(() => {
  return fees.value
    .filter(fee => fee.status === 'paid')
    .reduce((sum, fee) => sum + fee.amount, 0)
})

const outstandingFees = computed(() => {
  return fees.value
    .filter(fee => fee.status === 'unpaid')
    .reduce((sum, fee) => sum + fee.amount, 0)
})

// Methods
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
  uploadedFile.value = null
  previewUrl.value = null
  paymentNotes.value = ''
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    uploadedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    uploadedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const removeFile = () => {
  uploadedFile.value = null
  previewUrl.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const submitPayment = async () => {
  if (!uploadedFile.value) return
  
  isSubmitting.value = true
  
  // Simulate API call
  setTimeout(() => {
    // Update fee status to pending
    const feeIndex = fees.value.findIndex(f => f.id === selectedFee.value.id)
    if (feeIndex !== -1) {
      fees.value[feeIndex].status = 'pending'
    }
    
    isSubmitting.value = false
    closePaymentModal()
    
    // Show success notification (you can integrate with a toast library)
    alert('Payment receipt submitted successfully! It will be reviewed by the collection management team.')
  }, 2000)
}

const viewReceipt = (fee) => {
  // TODO: Implement view receipt functionality
  alert(`Viewing receipt for ${fee.description}`)
}
</script>
