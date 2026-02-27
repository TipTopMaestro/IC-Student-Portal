<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 mb-1">Attendance Records</h1>
        <p class="text-sm text-gray-500">Upload and manage event attendance</p>
      </div>
      <button 
        @click="showUploadModal = true"
        class="px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors"
      >
        Upload Attendance
      </button>
    </div>

    <!-- Upload Instructions -->
    <div class="border border-ic-primary/20 bg-purple-50 rounded-lg p-6 mb-8">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 shrink-0 rounded-full bg-ic-primary flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-base font-semibold mb-2">How to Upload Attendance</h3>
          <ul class="text-sm text-gray-500 space-y-1">
            <li>1. Select the event you want to upload attendance for</li>
            <li>2. Prepare a CSV or Excel file with student IDs and attendance status</li>
            <li>3. Click "Upload Attendance" and select your file</li>
            <li>4. Review and confirm the upload</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Recent Uploads -->
    <div>
      <h2 class="text-base font-semibold mb-4">Recent Uploads</h2>
      
      <div class="space-y-3">
        <div 
          v-for="record in attendanceRecords" 
          :key="record.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-base font-semibold mb-1">{{ record.eventName }}</h3>
              <div class="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ record.uploadDate }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ record.uploadedBy }}</span>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ record.totalPresent }}</span>
                  <span class="text-xs text-gray-500">present</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ record.totalAbsent }}</span>
                  <span class="text-xs text-gray-500">absent</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-ic-primary">{{ record.attendanceRate }}%</span>
                  <span class="text-xs text-gray-500">rate</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button 
                @click="viewRecord(record)"
                class="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
              <button 
                @click="downloadRecord(record)"
                class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="attendanceRecords.length === 0" class="text-center py-16 border border-gray-200 rounded-lg">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <p class="text-sm text-gray-500 mb-4">No attendance records yet</p>
        <button 
          @click="showUploadModal = true"
          class="px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors"
        >
          Upload First Record
        </button>
      </div>
    </div>

    <!-- Upload Modal -->
    <div 
      v-if="showUploadModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showUploadModal = false"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Upload Attendance</h2>
          <button @click="closeUploadModal" class="p-1 hover:bg-gray-50 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleUpload" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Select Event</label>
            <select 
              v-model="uploadData.eventId"
              required
              class="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ic-primary"
            >
              <option value="">Choose an event...</option>
              <option value="1">Career Fair 2024</option>
              <option value="2">ICSA General Assembly</option>
              <option value="3">Tech Talk: AI and ML</option>
              <option value="4">Coding Bootcamp</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Upload File</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-ic-primary transition-colors cursor-pointer">
              <input 
                type="file" 
                @change="handleFileSelect"
                accept=".csv,.xlsx,.xls"
                class="hidden"
                id="fileInput"
              />
              <label for="fileInput" class="cursor-pointer">
                <svg class="w-12 h-12 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm font-medium mb-1">
                  {{ uploadData.fileName || 'Click to upload or drag and drop' }}
                </p>
                <p class="text-xs text-gray-500">CSV or Excel file (MAX. 5MB)</p>
              </label>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button"
              @click="closeUploadModal"
              class="flex-1 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="!uploadData.eventId || !uploadData.fileName"
              class="flex-1 px-4 py-2 text-sm font-semibold bg-ic-primary text-white rounded-lg hover:bg-ic-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Record Modal -->
    <div 
      v-if="selectedRecord && showViewModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showViewModal = false"
    >
      <div class="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Attendance Details</h2>
          <button @click="showViewModal = false" class="p-1 hover:bg-gray-50 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold">{{ selectedRecord.eventName }}</h3>
            <div class="flex items-center gap-4 text-sm text-gray-500 mt-2">
              <span>Uploaded: {{ selectedRecord.uploadDate }}</span>
              <span>By: {{ selectedRecord.uploadedBy }}</span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
            <div class="text-center">
              <div class="text-2xl font-semibold mb-1">{{ selectedRecord.totalPresent }}</div>
              <div class="text-xs text-gray-500">Present</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-semibold mb-1">{{ selectedRecord.totalAbsent }}</div>
              <div class="text-xs text-gray-500">Absent</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-semibold text-ic-primary mb-1">{{ selectedRecord.attendanceRate }}%</div>
              <div class="text-xs text-gray-500">Rate</div>
            </div>
          </div>

          <p class="text-sm text-gray-500">
            View detailed attendance records in the downloaded CSV file.
          </p>
        </div>

        <div class="flex gap-3 mt-6">
          <button 
            @click="showViewModal = false"
            class="flex-1 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button 
            @click="downloadRecord(selectedRecord)"
            class="flex-1 px-4 py-2 text-sm font-semibold bg-ic-primary text-white rounded-lg hover:bg-ic-secondary transition-colors"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showUploadModal = ref(false)
const showViewModal = ref(false)
const selectedRecord = ref(null)

const uploadData = ref({
  eventId: '',
  fileName: ''
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    uploadData.value.fileName = file.name
  }
}

const handleUpload = () => {
  console.log('Uploading attendance:', uploadData.value)
  closeUploadModal()
}

const closeUploadModal = () => {
  showUploadModal.value = false
  uploadData.value = {
    eventId: '',
    fileName: ''
  }
}

const viewRecord = (record) => {
  selectedRecord.value = record
  showViewModal.value = true
}

const downloadRecord = (record) => {
  console.log('Downloading record:', record)
  // Implement download logic
}

// Mock data
const attendanceRecords = ref([
  {
    id: 1,
    eventName: 'Career Fair 2024',
    uploadDate: 'January 25, 2024',
    uploadedBy: 'Admin',
    totalPresent: 245,
    totalAbsent: 67,
    attendanceRate: 79
  },
  {
    id: 2,
    eventName: 'ICSA General Assembly',
    uploadDate: 'January 20, 2024',
    uploadedBy: 'ICSA President',
    totalPresent: 128,
    totalAbsent: 34,
    attendanceRate: 79
  },
  {
    id: 3,
    eventName: 'Tech Talk: AI and Machine Learning',
    uploadDate: 'January 15, 2024',
    uploadedBy: 'Faculty',
    totalPresent: 89,
    totalAbsent: 23,
    attendanceRate: 79
  }
])
</script>
