<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-light mb-1">Announcements</h1>
        <p class="text-sm text-[#8e8e8e]">{{ announcements.length }} announcements published</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors"
      >
        New Announcement
      </button>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-6">
      <button 
        @click="filterStatus = 'all'"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          filterStatus === 'all' ? 'bg-[#262626] text-white' : 'border border-[#dbdbdb] hover:bg-[#fafafa]'
        ]"
      >
        All Posts
      </button>
      <button 
        @click="filterStatus = 'published'"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          filterStatus === 'published' ? 'bg-[#262626] text-white' : 'border border-[#dbdbdb] hover:bg-[#fafafa]'
        ]"
      >
        Published
      </button>
      <button 
        @click="filterStatus = 'draft'"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          filterStatus === 'draft' ? 'bg-[#262626] text-white' : 'border border-[#dbdbdb] hover:bg-[#fafafa]'
        ]"
      >
        Drafts
      </button>
    </div>

    <!-- Announcements List -->
    <div class="space-y-3">
      <div 
        v-for="announcement in filteredAnnouncements" 
        :key="announcement.id"
        class="border border-[#dbdbdb] rounded-lg p-4 hover:bg-[#fafafa] transition-colors"
      >
        <div class="flex items-start gap-4">
          <!-- Icon -->
          <div class="w-10 h-10 shrink-0 rounded-full bg-purple-50 flex items-center justify-center">
            <svg class="w-5 h-5 text-ic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <h3 class="text-base font-semibold mb-1">{{ announcement.title }}</h3>
                <p class="text-sm text-[#8e8e8e] line-clamp-2">{{ announcement.content }}</p>
              </div>
              <span 
                :class="[
                  'ml-4 px-2 py-1 text-xs font-medium rounded shrink-0',
                  announcement.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1) }}
              </span>
            </div>

            <div class="flex items-center gap-4 text-xs text-[#8e8e8e] mb-3">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ announcement.date }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ announcement.author }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <button 
                @click="viewAnnouncement(announcement)"
                class="px-3 py-1.5 text-xs font-medium border border-[#dbdbdb] rounded-lg hover:bg-white transition-colors"
              >
                View
              </button>
              <button 
                @click="editAnnouncement(announcement)"
                class="px-3 py-1.5 text-xs font-medium border border-[#dbdbdb] rounded-lg hover:bg-white transition-colors"
              >
                Edit
              </button>
              <button 
                @click="deleteAnnouncement(announcement)"
                class="px-3 py-1.5 text-xs font-medium text-[#ed4956] border border-[#ed4956] rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredAnnouncements.length === 0" class="text-center py-16">
      <svg class="w-16 h-16 mx-auto text-[#dbdbdb] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
      <p class="text-sm text-[#8e8e8e] mb-4">No {{ filterStatus !== 'all' ? filterStatus : '' }} announcements found</p>
      <button 
        @click="showCreateModal = true"
        class="px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors"
      >
        Create First Announcement
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div 
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showCreateModal = false"
    >
      <div class="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">{{ editMode ? 'Edit' : 'Create' }} Announcement</h2>
          <button @click="closeCreateModal" class="p-1 hover:bg-[#fafafa] rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#262626] mb-2">Title</label>
            <input 
              v-model="formData.title"
              type="text" 
              required
              class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              placeholder="Important Update: Class Schedule Changes"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#262626] mb-2">Content</label>
            <textarea 
              v-model="formData.content"
              required
              rows="6"
              class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary resize-none"
              placeholder="Write your announcement here..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#262626] mb-2">Date</label>
              <input 
                v-model="formData.date"
                type="date" 
                required
                class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#262626] mb-2">Status</label>
              <select 
                v-model="formData.status"
                required
                class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button"
              @click="closeCreateModal"
              class="flex-1 px-4 py-2 text-sm font-medium border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2 text-sm font-semibold bg-ic-primary text-white rounded-lg hover:bg-ic-secondary transition-colors"
            >
              {{ editMode ? 'Update' : 'Create' }} Announcement
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Modal -->
    <div 
      v-if="selectedAnnouncement && showViewModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showViewModal = false"
    >
      <div class="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Announcement Details</h2>
          <button @click="showViewModal = false" class="p-1 hover:bg-[#fafafa] rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <span 
              :class="[
                'inline-block px-2 py-1 text-xs font-medium rounded',
                selectedAnnouncement.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ selectedAnnouncement.status.charAt(0).toUpperCase() + selectedAnnouncement.status.slice(1) }}
            </span>
          </div>

          <h3 class="text-lg font-semibold">{{ selectedAnnouncement.title }}</h3>

          <div class="flex items-center gap-4 text-sm text-[#8e8e8e]">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ selectedAnnouncement.date }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{{ selectedAnnouncement.author }}</span>
            </div>
          </div>

          <div class="pt-4 border-t border-[#efefef]">
            <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ selectedAnnouncement.content }}</p>
          </div>
        </div>

        <button 
          @click="showViewModal = false"
          class="w-full mt-6 px-4 py-2 text-sm font-medium border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="selectedAnnouncement && showDeleteModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-xl max-w-sm w-full p-6">
        <h2 class="text-xl font-semibold mb-4">Delete Announcement?</h2>
        <p class="text-sm text-[#8e8e8e] mb-6">
          Are you sure you want to delete "<span class="font-medium text-[#262626]">{{ selectedAnnouncement.title }}</span>"? This action cannot be undone.
        </p>

        <div class="flex gap-3">
          <button 
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 text-sm font-medium border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete"
            class="flex-1 px-4 py-2 text-sm font-semibold bg-[#ed4956] text-white rounded-lg hover:bg-[#d32f2f] transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filterStatus = ref('all')
const showCreateModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)
const selectedAnnouncement = ref(null)
const editMode = ref(false)

const formData = ref({
  title: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  status: 'draft'
})

const handleSubmit = () => {
  console.log('Submitting announcement:', formData.value)
  closeCreateModal()
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editMode.value = false
  formData.value = {
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    status: 'draft'
  }
}

const viewAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement
  showViewModal.value = true
}

const editAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement
  editMode.value = true
  formData.value = {
    title: announcement.title,
    content: announcement.content,
    date: announcement.date,
    status: announcement.status
  }
  showCreateModal.value = true
}

const deleteAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement
  showDeleteModal.value = true
}

const confirmDelete = () => {
  console.log('Deleting announcement:', selectedAnnouncement.value)
  showDeleteModal.value = false
  selectedAnnouncement.value = null
}

// Mock data
const announcements = ref([
  {
    id: 1,
    title: 'Important: Class Schedule Changes',
    content: 'Due to the upcoming foundation day celebration, there will be changes in the class schedule for next week. Please check your emails for the updated schedule.',
    date: '2024-01-20',
    author: 'Admin',
    status: 'published'
  },
  {
    id: 2,
    title: 'ICSA Meeting - February 1',
    content: 'All ICSA members are required to attend the general assembly on February 1, 2024 at 2:00 PM in Computer Lab 1.',
    date: '2024-01-22',
    author: 'ICSA President',
    status: 'published'
  },
  {
    id: 3,
    title: 'Coding Competition Registration Open',
    content: 'Registration for the annual coding competition is now open! Visit the CS office to register. Limited slots available.',
    date: '2024-01-18',
    author: 'Faculty',
    status: 'published'
  },
  {
    id: 4,
    title: 'Scholarship Application Deadline',
    content: 'Reminder: The deadline for scholarship applications is February 15, 2024. Make sure to submit all required documents.',
    date: '2024-01-15',
    author: 'Admin',
    status: 'draft'
  }
])

const filteredAnnouncements = computed(() => {
  if (filterStatus.value === 'all') {
    return announcements.value
  }
  return announcements.value.filter(a => a.status === filterStatus.value)
})
</script>
