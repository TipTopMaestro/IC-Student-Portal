<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Posts</h1>
      <p class="text-sm text-gray-500 mt-0.5">Share updates with your students</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && posts.length === 0" class="max-w-xl space-y-6">
      <div v-for="i in 3" :key="i" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
            <div class="h-3 bg-gray-200 rounded w-20 mt-1.5 animate-pulse"></div>
          </div>
        </div>
        <div class="aspect-video bg-gray-100 animate-pulse"></div>
        <div class="p-4 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-xl">
      <div class="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <div class="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-gray-900 font-medium mb-1">Something went wrong</p>
        <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
        <button
          @click="loadPosts"
          class="text-sm font-medium text-ic-primary hover:text-ic-secondary"
        >
          Try again
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="posts.length === 0" class="max-w-xl">
      <div class="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <div class="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <p class="text-gray-900 font-medium mb-1">No posts yet</p>
        <p class="text-sm text-gray-500 mb-6">Create your first post to share updates with students.</p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-4 py-2 bg-ic-primary text-white text-sm font-medium rounded-lg hover:bg-ic-secondary transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create post
        </button>
      </div>
    </div>

    <!-- Posts Feed -->
    <div v-else class="max-w-xl space-y-6">
      <PostFeedItem
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :show-actions="true"
        :show-visibility="true"
        @edit="startEdit"
        @delete="startDelete"
        @updated="handlePostUpdated"
      />

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex justify-center py-4">
        <div class="flex items-center gap-2">
          <button
            @click="goToPage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage <= 1 || isLoading"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span class="text-sm text-gray-500">
            {{ pagination.currentPage }} of {{ pagination.totalPages }}
          </span>
          <button
            @click="goToPage(pagination.currentPage + 1)"
            :disabled="pagination.currentPage >= pagination.totalPages || isLoading"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <button
      v-if="posts.length > 0"
      @click="openCreateModal"
      class="fixed bottom-6 right-6 w-14 h-14 bg-ic-primary text-white rounded-full shadow-lg hover:bg-ic-secondary hover:shadow-xl transition-all flex items-center justify-center z-40 md:bottom-8 md:right-8"
      title="Create new post"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Create/Edit Modal -->
    <CreatePostModal
      :is-open="createModalOpen"
      :post="editingPost"
      @close="closeCreateModal"
      @success="handlePostSaved"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :is-open="deleteModalOpen"
      :post="deletingPost"
      @close="closeDeleteModal"
      @success="handlePostDeleted"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import CreatePostModal from '@/components/posts/CreatePostModal.vue'
import DeleteConfirmModal from '@/components/posts/DeleteConfirmModal.vue'
import PostFeedItem from '@/components/posts/PostFeedItem.vue'
import { listPosts, extractPosts, extractPagination } from '@/services/postService'

const posts = ref([])
const isLoading = ref(true)
const error = ref('')
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  totalPages: 1,
  totalItems: 0
})

const createModalOpen = ref(false)
const editingPost = ref(null)
const deleteModalOpen = ref(false)
const deletingPost = ref(null)

const loadPosts = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const result = await listPosts({
      current_page: pagination.currentPage,
      per_page: pagination.perPage
    })

    if (result.success) {
      posts.value = extractPosts(result)
      const paginationData = extractPagination(result)
      Object.assign(pagination, paginationData)
    } else {
      error.value = result.error || 'Failed to load posts'
    }
  } catch (err) {
    console.error('Error loading posts:', err)
    error.value = 'An unexpected error occurred'
  } finally {
    isLoading.value = false
  }
}

const goToPage = (page) => {
  if (page < 1 || page > pagination.totalPages) return
  pagination.currentPage = page
  loadPosts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openCreateModal = () => {
  editingPost.value = null
  createModalOpen.value = true
}

const closeCreateModal = () => {
  createModalOpen.value = false
  editingPost.value = null
}

const startEdit = (post) => {
  editingPost.value = post
  createModalOpen.value = true
}

const startDelete = (post) => {
  deletingPost.value = post
  deleteModalOpen.value = true
}

const closeDeleteModal = () => {
  deleteModalOpen.value = false
  deletingPost.value = null
}

const handlePostSaved = () => {
  loadPosts()
}

const handlePostDeleted = (postId) => {
  posts.value = posts.value.filter(p => p.id !== postId)
  pagination.totalItems -= 1
  closeDeleteModal()
}

const handlePostUpdated = (updatedPost) => {
  const idx = posts.value.findIndex(p => p.id === updatedPost.id)
  if (idx !== -1) {
    posts.value[idx] = { ...posts.value[idx], ...updatedPost }
  }
}

onMounted(() => {
  loadPosts()
})
</script>
