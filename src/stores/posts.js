import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listPosts } from '@/services/postService'

export const usePostStore = defineStore('posts', () => {
  const posts = ref([])
  const lastFetched = ref(null)
  const loading = ref(false)

  const fetchPosts = async (params = {}, force = false) => {
    const cacheValidDuration = 1 * 60 * 1000 // 1 minute TTL for posts list in Pinia store
    const isCacheExpired = !lastFetched.value || (Date.now() - lastFetched.value > cacheValidDuration)

    const isDefaultRequest = Object.keys(params).length === 0
    if (isDefaultRequest && posts.value.length > 0 && !isCacheExpired && !force) {
      return { success: true, data: posts.value }
    }

    loading.value = true
    try {
      const result = await listPosts(params)
      if (result.success) {
        if (isDefaultRequest) {
          posts.value = result.data.data || result.data
          lastFetched.value = Date.now()
        }
      }
      return result
    } finally {
      loading.value = false
    }
  }

  const invalidate = () => {
    posts.value = []
    lastFetched.value = null
    console.log('🧹 Posts store invalidated')
  }

  return {
    posts,
    loading,
    fetchPosts,
    invalidate
  }
})
