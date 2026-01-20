<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Document Submissions</h1>
        <p class="text-gray-600 mt-1">View and track your submitted documents and requirements</p>
      </div>
      <div class="mt-4 md:mt-0">
        <button class="btn-primary">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Document
        </button>
      </div>
    </div>

    <!-- Submission Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 font-medium">Approved</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ approvedCount }}</p>
          </div>
          <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card border-l-4 border-yellow-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 font-medium">Pending</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ pendingCount }}</p>
          </div>
          <div class="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card border-l-4 border-red-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 font-medium">Rejected</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ rejectedCount }}</p>
          </div>
          <div class="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 font-medium">Total</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalSubmissions }}</p>
          </div>
          <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input v-model="searchQuery" type="text" placeholder="Search documents..." class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filterStatus" class="input-field">
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
          <select v-model="filterType" class="input-field">
            <option value="">All Types</option>
            <option value="clearance">Clearance</option>
            <option value="requirement">Requirement</option>
            <option value="certificate">Certificate</option>
            <option value="form">Form</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Submissions List -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Submission History</h2>
      
      <div class="space-y-4">
        <div v-for="submission in filteredSubmissions" :key="submission.id" 
          class="border border-gray-200 rounded-lg p-4 hover:border-ic-primary hover:shadow-md transition-all">
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4 flex-1">
              <!-- Document Icon -->
              <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <!-- Document Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="text-base font-semibold text-gray-900">{{ submission.title }}</h3>
                  <span class="badge badge-info text-xs">{{ submission.type }}</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ submission.description }}</p>
                <div class="flex items-center space-x-4 text-xs text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(submission.submittedDate) }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {{ submission.fileName }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    {{ submission.fileSize }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Status and Actions -->
            <div class="flex flex-col items-end space-y-2 ml-4">
              <span
                :class="{
                  'badge-success': submission.status === 'approved',
                  'badge-warning': submission.status === 'pending',
                  'badge-danger': submission.status === 'rejected'
                }"
                class="badge capitalize"
              >
                {{ submission.status }}
              </span>
              <div class="flex items-center space-x-2">
                <button class="text-ic-primary hover:text-primary-900 text-sm font-medium">
                  <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Rejection Reason (if rejected) -->
          <div v-if="submission.status === 'rejected' && submission.reason" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-xs font-medium text-red-900">Rejection Reason:</p>
            <p class="text-sm text-red-700 mt-1">{{ submission.reason }}</p>
          </div>

          <!-- Reviewer Comment (if approved) -->
          <div v-if="submission.status === 'approved' && submission.comment" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-xs font-medium text-green-900">Reviewer Comment:</p>
            <p class="text-sm text-green-700 mt-1">{{ submission.comment }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Required Documents -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Required Documents Checklist</h2>
      <div class="space-y-3">
        <div v-for="doc in requiredDocuments" :key="doc.id" 
          class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div class="flex items-center space-x-3">
            <div v-if="doc.submitted" class="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div v-else class="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ doc.name }}</p>
              <p class="text-xs text-gray-500">{{ doc.description }}</p>
            </div>
          </div>
          <div>
            <button v-if="!doc.submitted" class="btn-primary text-sm py-1 px-3">
              Upload
            </button>
            <span v-else class="badge badge-success">Submitted</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterStatus = ref('')
const filterType = ref('')

// Mock data
const approvedCount = 8
const pendingCount = 2
const rejectedCount = 1
const totalSubmissions = 11

const submissions = ref([
  {
    id: 1,
    title: 'Clearance Form - Semester 1',
    description: 'Student clearance for first semester',
    type: 'clearance',
    fileName: 'clearance_2024_s1.pdf',
    fileSize: '2.4 MB',
    submittedDate: '2024-01-10',
    status: 'approved',
    comment: 'All requirements are complete. Approved.'
  },
  {
    id: 2,
    title: 'Certificate of Good Moral',
    description: 'Good moral certificate from previous school',
    type: 'certificate',
    fileName: 'good_moral_cert.pdf',
    fileSize: '1.8 MB',
    submittedDate: '2024-01-09',
    status: 'approved'
  },
  {
    id: 3,
    title: 'Medical Certificate',
    description: 'Annual medical examination certificate',
    type: 'certificate',
    fileName: 'medical_cert_2024.pdf',
    fileSize: '3.1 MB',
    submittedDate: '2024-01-08',
    status: 'pending'
  },
  {
    id: 4,
    title: 'Student Information Form',
    description: 'Updated student information for AY 2024-2025',
    type: 'form',
    fileName: 'student_info_form.pdf',
    fileSize: '1.5 MB',
    submittedDate: '2024-01-07',
    status: 'rejected',
    reason: 'Incomplete fields: Emergency contact information is missing.'
  },
  {
    id: 5,
    title: 'Scholarship Application',
    description: 'Application for academic scholarship',
    type: 'form',
    fileName: 'scholarship_app.pdf',
    fileSize: '4.2 MB',
    submittedDate: '2024-01-05',
    status: 'pending'
  },
])

const requiredDocuments = ref([
  { id: 1, name: 'Birth Certificate', description: 'Certified true copy from PSA', submitted: true },
  { id: 2, name: 'Transcript of Records', description: 'From previous school', submitted: true },
  { id: 3, name: 'Certificate of Good Moral', description: 'From previous school', submitted: true },
  { id: 4, name: 'Medical Certificate', description: 'Annual health examination', submitted: false },
  { id: 5, name: '2x2 ID Picture', description: 'Recent photo with white background', submitted: true },
  { id: 6, name: 'Clearance Form', description: 'Properly accomplished clearance', submitted: true },
])

const filteredSubmissions = computed(() => {
  return submissions.value.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          submission.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || submission.status === filterStatus.value
    const matchesType = !filterType.value || submission.type === filterType.value
    return matchesSearch && matchesStatus && matchesType
  })
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
