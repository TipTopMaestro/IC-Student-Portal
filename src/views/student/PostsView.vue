<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-semibold text-gray-900">Posts</h1>
        <div v-if="isRefreshing" class="px-2 py-0.5 text-xs text-ic-secondary bg-ic-light/30 rounded-full animate-pulse font-medium">
          Syncing...
        </div>
      </div>
      <p class="text-sm text-gray-500 mt-0.5">Stay updated with the latest news and updates</p>
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
          @click="refresh"
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
        <p class="text-sm text-gray-500">Check back later for updates from your organization.</p>
      </div>
    </div>

    <!-- Posts Feed -->
    <div v-else class="max-w-xl space-y-6">
      <PostFeedItem
         v-for="post in posts"
         :key="post.id"
         :post="post"
         :show-actions="false"
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import PostFeedItem from '@/components/posts/PostFeedItem.vue'
import { listPosts, extractPosts, extractPagination } from '@/services/postService'
import { useSWR } from '@/composables/useSWR'

const posts = ref([])
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  totalPages: 1,
  totalItems: 0
})

const cacheKey = computed(() => `posts-page-${pagination.currentPage}`)

const {
  data: swrData,
  error,
  isLoading,
  isRefreshing,
  refresh
} = useSWR(
  cacheKey,
  () => listPosts({
    current_page: pagination.currentPage,
    per_page: pagination.perPage
  }),
  { ttl: 15000, immediate: true }
)

watch(swrData, (newVal) => {
  if (newVal) {
    const result = { success: true, data: newVal }
    const allPosts = extractPosts(result)
    posts.value = allPosts.filter(post => post.visibility === 'public')
    const paginationData = extractPagination(result)
    
    // Prevent reactivity loops by only updating non-key pagination state
    pagination.totalPages = paginationData.totalPages || 1
    pagination.totalItems = paginationData.totalItems || 0
    pagination.perPage = paginationData.perPage || 10
  }
}, { immediate: true })

const goToPage = (page) => {
  if (page < 1 || page > pagination.totalPages) return
  pagination.currentPage = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
