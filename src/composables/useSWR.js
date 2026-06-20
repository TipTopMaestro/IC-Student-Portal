import { ref, watch, onMounted, isRef } from 'vue'

// Global in-memory cache map
const swrCache = new Map()

/**
 * Custom SWR Composable for caching API requests
 * @param {Ref|ComputedRef|string} cacheKey - Unique key for the cache entry (e.g., 'students?page=1')
 * @param {Function} fetchFn - The API service function returning a Promise
 * @param {Object} options - { ttl: ms, immediate: boolean }
 */
export function useSWR(cacheKey, fetchFn, options = {}) {
  const { ttl = 60000, immediate = true } = options

  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(true)
  const isRefreshing = ref(false)

  // Helper to get raw key value
  const getRawKey = () => {
    return isRef(cacheKey) || (cacheKey && cacheKey.effect) ? cacheKey.value : cacheKey
  }

  const load = async (forceRefresh = false) => {
    const activeKey = getRawKey()
    if (!activeKey) {
      isLoading.value = false
      return
    }
    const cached = swrCache.get(activeKey)
    const now = Date.now()

    // 1. If cached and not expired, return immediately without background request
    if (cached && !forceRefresh && (now - cached.timestamp < ttl)) {
      data.value = cached.data
      isLoading.value = false
      return
    }

    // 2. If cached but stale/expired, set stale data immediately and refresh in background
    if (cached && !forceRefresh) {
      data.value = cached.data
      isLoading.value = false
      isRefreshing.value = true
    } else {
      isLoading.value = true
    }

    try {
      const response = await fetchFn()
      if (response.success) {
        // Update cache
        swrCache.set(activeKey, {
          data: response.data,
          timestamp: Date.now()
        })
        data.value = response.data
        error.value = null
      } else {
        error.value = response.error || 'Failed to fetch'
      }
    } catch (err) {
      error.value = err.message || 'An error occurred'
    } finally {
      isLoading.value = false
      isRefreshing.value = false
    }
  }

  // Helper to invalidate cache manually
  const invalidate = () => {
    const activeKey = getRawKey()
    swrCache.delete(activeKey)
  }

  if (immediate) {
    onMounted(() => load())
  }

  // Watch key changes (e.g., pagination changes)
  watch(cacheKey, () => {
    load()
  })

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    refresh: () => load(true),
    invalidate
  }
}

// Global cache invalidation utility
export const invalidateCachePattern = (pattern) => {
  try {
    for (const key of swrCache.keys()) {
      if (key.includes(pattern)) {
        swrCache.delete(key)
      }
    }
  } catch (error) {
    console.warn('⚠️ Error during SWR cache invalidation:', error)
  }
}

// Global cache clear function
export const clearSwrCache = () => {
  try {
    swrCache.clear()
    console.log('🧹 SWR Cache cleared')
  } catch (error) {
    console.warn('⚠️ Error clearing SWR cache:', error)
  }
}
