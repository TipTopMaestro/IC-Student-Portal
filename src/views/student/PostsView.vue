<template>
  <div class="max-w-xl mx-auto space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div>
      <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">posts</h1>
      <p class="text-sm text-gray-500 mt-0.5">Stay updated with institutional announcements and news</p>
    </div>

    <!-- 01 — post feed -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <span class="font-pixel text-sm text-gray-400 lowercase">01 — post feed</span>
        <span v-if="posts.length > 0" class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'item' : 'items' }}
        </span>
      </div>

      <!-- Category Filter Bar -->
      <div v-if="posts.length > 0" class="flex items-center justify-between gap-3 px-1">
        <CategoryFilterDropdown v-model="selectedCategory" />
        <button
          v-if="selectedCategory"
          @click="selectedCategory = ''"
          class="font-mono text-[11px] font-medium uppercase tracking-wider text-gray-400 hover:text-ic-primary transition-colors cursor-pointer"
        >
          Reset Filter ×
        </button>
      </div>

      <!-- Loading State Skeleton -->
      <div v-if="isLoading && posts.length === 0" class="space-y-5">
        <div v-for="i in 2" :key="i" class="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-gray-200 rounded w-28"></div>
              <div class="h-2.5 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          <div class="h-44 bg-gray-100 rounded-xl"></div>
          <div class="space-y-2 pt-1">
            <div class="h-3.5 bg-gray-200 rounded w-full"></div>
            <div class="h-3.5 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
        <div class="w-11 h-11 mx-auto rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-3 text-ic-secondary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="font-pixel text-base text-gray-900 lowercase mb-1">posts unavailable</p>
        <p class="text-xs text-gray-500 mb-4 leading-relaxed">{{ error }}</p>
        <button
          @click="loadPosts"
          class="font-mono text-[11px] font-medium uppercase tracking-wider text-white bg-ic-primary hover:bg-ic-secondary px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-[0_2px_8px_-2px_rgba(100,13,95,0.4)]"
        >
          <span>Retry</span>
          <span class="text-xs">↻</span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="posts.length === 0" class="bg-white border border-gray-200 rounded-2xl py-16 px-5 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
        <svg class="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p class="font-pixel text-sm text-gray-400 lowercase">no posts published yet</p>
        <p class="font-mono text-[11px] text-gray-400 mt-1 uppercase tracking-wider">check back later for official announcements</p>
      </div>

      <!-- Filtered Empty State -->
      <div v-else-if="filteredPosts.length === 0 && selectedCategory" class="bg-white border border-gray-200 rounded-2xl py-14 px-5 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
        <svg class="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
        <p class="font-pixel text-sm text-gray-400 lowercase">no posts in this category</p>
        <p class="font-mono text-[11px] text-gray-400 mt-1 mb-4 uppercase tracking-wider">try selecting a different topic</p>
        <button
          @click="selectedCategory = ''"
          class="font-mono text-[11px] font-medium uppercase tracking-wider text-ic-primary hover:text-ic-secondary transition-colors cursor-pointer"
        >
          Show all posts →
        </button>
      </div>

      <!-- Feed List -->
      <div v-else class="space-y-5">
        <PostFeedItem
          v-for="post in filteredPosts"
          :key="post.id"
          :post="post"
          :show-actions="false"
          @filter-category="selectedCategory = $event"
          class="border border-gray-200! shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]! hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)]! rounded-2xl! transition-all duration-300"
        />

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="flex items-center justify-between pt-4 border-t border-gray-100 px-1">
          <span class="font-mono text-[11px] text-gray-400 uppercase tracking-wider">
            Page {{ pagination.currentPage }} of {{ pagination.totalPages }} · {{ pagination.totalItems }} total
          </span>
          <div class="flex items-center gap-1.5">
            <button
              @click="goToPage(pagination.currentPage - 1)"
              :disabled="pagination.currentPage <= 1 || isLoading"
              class="px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ← Prev
            </button>
            <button
              @click="goToPage(pagination.currentPage + 1)"
              :disabled="pagination.currentPage >= pagination.totalPages || isLoading"
              class="px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import CategoryFilterDropdown from '@/components/posts/CategoryFilterDropdown.vue'
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

const selectedCategory = ref('')
const filteredPosts = computed(() => {
  if (!selectedCategory.value) return posts.value
  return posts.value.filter(p => p.category === selectedCategory.value)
})

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
    error.value = 'Unable to load posts at this time.'
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

onMounted(() => {
  loadPosts()
})
</script>
