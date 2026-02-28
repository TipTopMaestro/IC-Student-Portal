<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 mb-1">Announcements</h1>
        <p class="text-sm text-gray-500">Manage announcements for students</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-16 text-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-ic-primary mx-auto mb-3"></div>
      <p class="text-sm text-gray-500">Loading announcements...</p>
    </div>

    <!-- Not Available / Error State -->
    <div v-else-if="notAvailable" class="text-center py-16 border border-gray-200 rounded-lg">

      <h3 class="text-base font-semibold text-gray-900 mb-2">Coming Soon</h3>
      
    </div>

    <!-- Announcements List (if endpoint works in the future) -->
    <template v-else>
      <div class="space-y-3">
        <div 
          v-for="announcement in announcements" 
          :key="announcement.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all cursor-pointer"
          @click="viewAnnouncement(announcement)"
        >
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold mb-1">{{ announcement.title || 'Untitled' }}</h3>
              <p v-if="announcement.content || announcement.body || announcement.description" class="text-sm text-gray-500 line-clamp-2 mb-2">
                {{ announcement.content || announcement.body || announcement.description }}
              </p>
              <div class="flex items-center gap-3 text-xs text-gray-500">
                <span v-if="formatDate(announcement)">{{ formatDate(announcement) }}</span>
                <span v-if="announcement.author || announcement.created_by" class="flex items-center gap-1">
                  <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                  {{ announcement.author || announcement.created_by }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty (API works but no data) -->
      <div v-if="announcements.length === 0 && !isLoading" class="text-center py-16 border border-gray-200 rounded-lg">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <p class="text-sm text-gray-500">No announcements yet</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">
        <p class="text-sm text-gray-500">Page {{ currentPage }} of {{ totalPages }}</p>
        <div class="flex items-center gap-2">
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1 || isLoading"
            class="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages || isLoading"
            class="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </template>

    <!-- View Modal -->
    <div 
      v-if="selectedAnnouncement && showViewModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showViewModal = false"
    >
      <div class="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Announcement Details</h2>
          <button @click="showViewModal = false" class="p-1 hover:bg-gray-50 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-semibold">{{ selectedAnnouncement.title }}</h3>
          <div class="flex items-center gap-3 text-sm text-gray-500">
            <span v-if="formatDate(selectedAnnouncement)">{{ formatDate(selectedAnnouncement) }}</span>
            <span v-if="selectedAnnouncement.author || selectedAnnouncement.created_by">
              · {{ selectedAnnouncement.author || selectedAnnouncement.created_by }}
            </span>
          </div>
          <div class="pt-4 border-t border-gray-100">
            <p class="text-sm leading-relaxed whitespace-pre-wrap">
              {{ selectedAnnouncement.content || selectedAnnouncement.body || selectedAnnouncement.description || 'No content' }}
            </p>
          </div>
        </div>

        <button 
          @click="showViewModal = false"
          class="w-full mt-6 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listAnnouncements } from '@/services/announcementService'

const currentPage = ref(1)

const isLoading = ref(false)
const notAvailable = ref(false)
const announcements = ref([])
const totalPages = ref(1)

const showViewModal = ref(false)
const selectedAnnouncement = ref(null)

const formatDate = (item) => {
  const dateStr = item.date || item.created_at || item.published_at
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const loadAnnouncements = async () => {
  isLoading.value = true
  notAvailable.value = false

  try {
    const params = { page: currentPage.value, per_page: 20 }
    const result = await listAnnouncements(params)

    if (result.success) {
      const responseData = result.data.data || result.data
      const pageData = responseData.data || responseData

      if (Array.isArray(pageData)) {
        announcements.value = pageData
      } else if (Array.isArray(pageData?.data)) {
        announcements.value = pageData.data
      } else {
        announcements.value = []
      }

      totalPages.value = responseData.total_pages || pageData.total_pages || 1
    } else {
      // If it's a 404, the endpoint doesn't exist yet
      if (result.error?.includes('404') || result.error?.includes('Not Found') || result.error === 'Failed to load announcements') {
        notAvailable.value = true
      } else {
        notAvailable.value = true
      }
    }
  } catch (err) {
    console.error('Failed to load announcements:', err)
    notAvailable.value = true
  }

  isLoading.value = false
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadAnnouncements()
}

const viewAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement
  showViewModal.value = true
}

onMounted(() => {
  loadAnnouncements()
})
</script>
