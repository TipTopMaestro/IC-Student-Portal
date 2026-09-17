<template>
  <div class="max-w-xl mx-auto space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">posts</h1>
        </div>
        <p class="text-sm text-gray-500">Share announcements, notices, and updates with your students</p>
      </div>

      <!-- Create Post Trigger Button (Desktop & Mobile) -->
      <button
        @click="openCreateModal"
        class="shrink-0 px-3.5 py-2 bg-ic-primary hover:bg-ic-secondary text-white font-mono text-[11px] font-medium uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 shadow-[0_2px_8px_-2px_rgba(100,13,95,0.4)] hover:shadow-[0_4px_14px_-2px_rgba(100,13,95,0.5)] select-none"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>New Post</span>
      </button>
    </div>

    <!-- Top Post Composer Box (Admin / Student Leader Feed Trigger) -->
    <div 
      @click="openCreateModal"
      class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] hover:border-gray-300 transition-all duration-300 cursor-pointer group select-none"
    >
      <div class="flex items-center gap-3">
        <!-- Admin Avatar -->
        <div class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
          <img 
            v-if="userAvatar && !imageLoadFailed" 
            :src="userAvatar" 
            alt="Avatar" 
            @error="imageLoadFailed = true"
            class="w-full h-full object-cover" 
          />
          <span v-else class="font-mono text-xs font-semibold text-ic-primary">
            {{ userInitials }}
          </span>
        </div>

        <!-- Fake Composer Input Bar -->
        <div class="flex-1 min-w-0 bg-gray-50/90 group-hover:bg-gray-100/80 border border-gray-200/80 rounded-xl px-4 py-2.5 transition-colors">
          <p class="text-xs sm:text-sm text-gray-400 group-hover:text-gray-500 truncate">
            Publish an announcement, event notice, or reminder to students...
          </p>
        </div>
      </div>

      <!-- Quick Action Badges Strip -->
      <div class="flex items-center justify-between pt-3 mt-3 border-t border-gray-100/80">
        <div class="flex items-center gap-2">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-gray-500 group-hover:text-ic-primary group-hover:bg-purple-50/50 transition-colors">
            <ImageIcon class="w-3.5 h-3.5 text-ic-primary" />
            <span class="font-mono text-[10px] font-semibold uppercase tracking-wider">Photo</span>
          </div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-gray-500 group-hover:text-ic-secondary group-hover:bg-rose-50/50 transition-colors">
            <Hash class="w-3.5 h-3.5 text-ic-secondary" />
            <span class="font-mono text-[10px] font-semibold uppercase tracking-wider">Category</span>
          </div>
        </div>

        <span class="font-mono text-[11px] font-medium uppercase tracking-wider text-ic-primary group-hover:text-ic-secondary transition-colors inline-flex items-center gap-1">
          <span>compose</span>
          <span class="text-[10px] transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </div>

    <!-- 01 — post feed Section -->
    <div class="space-y-4">
      <!-- Section Header -->
      <div class="flex items-center justify-between px-1">
        <span class="font-pixel text-sm text-gray-400 lowercase">01 — post feed</span>
        <span v-if="!isLoading && posts.length > 0" class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'item' : 'items' }}
        </span>
        <span v-else-if="isLoading" class="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider animate-pulse">
          loading feed...
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
              <div class="h-3.5 bg-gray-200 rounded w-28"></div>
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
          <AlertCircle class="w-5 h-5 text-rose-500" />
        </div>
        <p class="font-pixel text-base text-gray-900 lowercase mb-1">posts unavailable</p>
        <p class="text-xs text-gray-500 mb-4 leading-relaxed max-w-sm mx-auto">{{ error }}</p>
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
        <Newspaper class="w-10 h-10 mx-auto text-gray-300 mb-3" />
        <p class="font-pixel text-sm text-gray-400 lowercase">no posts published yet</p>
        <p class="font-mono text-[11px] text-gray-400 mt-1 mb-5 uppercase tracking-wider">Create your first announcement to share with students</p>
        <button
          @click="openCreateModal"
          class="font-mono text-[11px] font-medium uppercase tracking-wider text-white bg-ic-primary hover:bg-ic-secondary px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-[0_2px_8px_-2px_rgba(100,13,95,0.4)]"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Create First Post</span>
        </button>
      </div>

      <!-- Filtered Empty State -->
      <div v-else-if="filteredPosts.length === 0 && selectedCategory" class="bg-white border border-gray-200 rounded-2xl py-14 px-5 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
        <Hash class="w-10 h-10 mx-auto text-gray-300 mb-3" />
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
          :show-actions="true"
          @edit="startEdit"
          @delete="startDelete"
          @updated="handlePostUpdated"
          @filter-category="selectedCategory = $event"
          class="border border-gray-200! shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]! hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)]! rounded-2xl! transition-all duration-300"
        />

        <!-- Infinite Scroll Sentinel & Feed Indicators -->
        <div ref="sentinelRef" class="py-6 flex flex-col items-center justify-center min-h-12">
          <!-- Loading More Spinner -->
          <div v-if="isLoadingMore" class="flex items-center gap-2 text-ic-primary font-mono text-[11px] font-medium uppercase tracking-wider py-2">
            <span class="w-4 h-4 border-2 border-ic-primary/20 border-t-ic-primary rounded-full animate-spin"></span>
            <span>Loading more posts...</span>
          </div>

          <!-- All Posts Caught Up / End of Feed -->
          <div
            v-else-if="posts.length > 0 && !hasMorePosts"
            class="flex items-center justify-center gap-2 py-4 text-gray-400 font-mono text-[11px] uppercase tracking-wider"
          >
            <span class="w-12 h-px bg-gray-200"></span>
            <span>All caught up</span>
            <span class="w-12 h-px bg-gray-200"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Minimalist Scroll-to-Top Floating Button (Teleported to body to escape parent transforms) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-3"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-3"
      >
        <button
          v-if="showBackToTop"
          @click="scrollToTop"
          class="fixed bottom-22 right-5 md:bottom-8 md:right-8 z-50 bg-white/95 backdrop-blur-md border border-gray-300/80 text-gray-700 hover:text-ic-primary hover:border-ic-primary/60 px-4 py-2.5 rounded-full shadow-[0_8px_24px_-4px_rgba(0,0,0,0.16)] hover:shadow-[0_12px_28px_-4px_rgba(100,13,95,0.25)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer group"
          title="Scroll to top"
          aria-label="Back to top"
        >
          <ArrowUp class="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 text-ic-primary" />
          <span>Top</span>
        </button>
      </Transition>
    </Teleport>

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
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Plus,
  AlertCircle,
  Newspaper,
  Hash,
  ArrowUp,
  Image as ImageIcon
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { usePostPublishStore } from '@/stores/postPublishStore'
import CategoryFilterDropdown from '@/components/posts/CategoryFilterDropdown.vue'
import CreatePostModal from '@/components/posts/CreatePostModal.vue'
import DeleteConfirmModal from '@/components/posts/DeleteConfirmModal.vue'
import PostFeedItem from '@/components/posts/PostFeedItem.vue'
import { listPosts, extractPosts, extractPagination } from '@/services/postService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const postPublishStore = usePostPublishStore()
const posts = ref([])
const isLoading = ref(true)
const error = ref('')
const showBackToTop = ref(false)
const imageLoadFailed = ref(false)

// Admin avatar & identity for composer card
const userAvatar = computed(() => {
  const avatar = authStore.user?.user_avatar || 
                 authStore.user?.profile_url || 
                 authStore.user?.profile || 
                 '/default_profile.png'

  if (!avatar) return '/default_profile.png'
  if (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('/')) {
    return avatar
  }
  return `/${avatar}`
})

const userInitials = computed(() => {
  const u = authStore.user
  const f = (u?.first_name || u?.username || 'A')[0] || 'A'
  const l = (u?.last_name || '')[0] || ''
  return (f + l).toUpperCase()
})

const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  totalPages: 1,
  totalItems: 0
})

const isLoadingMore = ref(false)
const sentinelRef = ref(null)
let observer = null

const hasMorePosts = computed(() => {
  return pagination.currentPage < pagination.totalPages
})

const createModalOpen = ref(false)
const editingPost = ref(null)
const deleteModalOpen = ref(false)
const deletingPost = ref(null)

const selectedCategory = ref('')

const filteredPosts = computed(() => {
  if (!selectedCategory.value) return posts.value
  return posts.value.filter(p => p.category === selectedCategory.value)
})

// Smooth Scroll to Top
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Track scroll distance for minimalist back-to-top button
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 80
}

// Initial load (resets feed)
const loadPosts = async () => {
  isLoading.value = true
  error.value = ''
  pagination.currentPage = 1

  try {
    const result = await listPosts({
      current_page: 1,
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

// Infinite scroll loader (appends next batch of 20)
const loadMorePosts = async () => {
  if (isLoading.value || isLoadingMore.value || !hasMorePosts.value) return

  isLoadingMore.value = true
  const nextPage = pagination.currentPage + 1

  try {
    const result = await listPosts({
      current_page: nextPage,
      per_page: pagination.perPage
    })

    if (result.success) {
      const newPosts = extractPosts(result)
      // Append non-duplicate posts
      const existingIds = new Set(posts.value.map(p => p.id))
      const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id))
      posts.value.push(...uniqueNewPosts)

      const paginationData = extractPagination(result)
      Object.assign(pagination, paginationData)
      pagination.currentPage = nextPage
    }
  } catch (err) {
    console.error('Error loading more posts:', err)
  } finally {
    isLoadingMore.value = false
  }
}

// Setup IntersectionObserver for bottom sentinel
const setupObserver = () => {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry && entry.isIntersecting && hasMorePosts.value && !isLoading.value && !isLoadingMore.value) {
      loadMorePosts()
    }
  }, {
    rootMargin: '200px'
  })

  if (sentinelRef.value) {
    observer.observe(sentinelRef.value)
  }
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
  closeCreateModal()
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

watch(sentinelRef, () => {
  setupObserver()
})

const checkCreateQuery = () => {
  if (route.query.create === 'true' || route.query.create === true || route.query.action === 'create') {
    openCreateModal()
    // Clean up query param from URL without reloading
    router.replace({ path: '/admin/posts', query: { ...route.query, create: undefined, action: undefined } })
  }
}

const handleOpenCreateEvent = () => {
  openCreateModal()
}

watch(() => route.query.create, (val) => {
  if (val === 'true' || val === true) {
    checkCreateQuery()
  }
})

const handleBackgroundPostPublished = (event) => {
  const newPost = event.detail
  if (!newPost || !newPost.id) {
    loadPosts()
    return
  }

  const existingIdx = posts.value.findIndex(p => p.id === newPost.id)
  if (existingIdx !== -1) {
    posts.value[existingIdx] = { ...posts.value[existingIdx], ...newPost }
  } else {
    // Check if category matches current filter
    if (!selectedCategory.value || selectedCategory.value === 'all' || newPost.category === selectedCategory.value) {
      posts.value.unshift(newPost)
      pagination.totalItems = (pagination.totalItems || 0) + 1
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  window.addEventListener('open-create-post', handleOpenCreateEvent)
  window.addEventListener('post-published', handleBackgroundPostPublished)
  checkCreateQuery()
  await loadPosts()
  setupObserver()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('open-create-post', handleOpenCreateEvent)
  window.removeEventListener('post-published', handleBackgroundPostPublished)
  if (observer) {
    observer.disconnect()
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>
