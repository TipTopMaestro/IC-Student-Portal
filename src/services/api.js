import axios from 'axios'
import { API_CONFIG } from '../config/api'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Token refresh queue — prevents race conditions when multiple 401s fire simultaneously
let isRefreshing = false
let refreshSubscribers = []

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach(callback => callback(newToken))
  refreshSubscribers = []
}

const onRefreshFailed = (error) => {
  refreshSubscribers.forEach(callback => callback(null, error))
  refreshSubscribers = []
}

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback)
}

// Simple in-memory response cache
export const apiCache = new Map()
const MAX_API_CACHE_SIZE = 100

const setApiCache = (key, value) => {
  if (apiCache.size >= MAX_API_CACHE_SIZE) {
    const oldestKey = apiCache.keys().next().value
    apiCache.delete(oldestKey)
  }
  apiCache.set(key, value)
}

// Global cache clear function
export const clearApiCache = () => {
  try {
    apiCache.clear()
    console.log('🧹 API cache cleared')
  } catch (error) {
    console.warn('⚠️ Error clearing API cache:', error)
  }
}

// Invalidate API cache by pattern
export const invalidateApiCachePattern = (pattern) => {
  try {
    let count = 0
    for (const key of apiCache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key)
        count++
      }
    }
    if (count > 0) {
      console.log(`🧹 Invalidated ${count} API cache entries matching pattern: ${pattern}`)
    }
  } catch (error) {
    console.warn('⚠️ Error during API cache invalidation:', error)
  }
}

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: !!token
      })
    }
    
    // Only cache GET requests that explicitly specify `cache: true` in config
    if (config.method?.toLowerCase() === 'get' && config.cache) {
      const sortedParams = Object.entries(config.params || {}).sort(([a],[b]) => a.localeCompare(b))
      const cacheKey = `${config.url}?${new URLSearchParams(sortedParams).toString()}`
      const cachedResponse = apiCache.get(cacheKey)
      
      if (cachedResponse && (Date.now() - cachedResponse.timestamp < (config.cacheTTL || 60000))) {
        if (import.meta.env.DEV) {
          console.log(`⚡ Cache hit for URL: ${config.url}`)
        }
        config.adapter = () => Promise.resolve({
          data: cachedResponse.data,
          headers: cachedResponse.headers,
          config,
          status: 200,
          statusText: 'OK'
        })
      }
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', response.status, response.config.url)
    }
    
    const config = response.config
    if (config && config.method?.toLowerCase() === 'get' && config.cache) {
      const sortedParams = Object.entries(config.params || {}).sort(([a],[b]) => a.localeCompare(b))
      const cacheKey = `${config.url}?${new URLSearchParams(sortedParams).toString()}`
      setApiCache(cacheKey, {
        data: response.data,
        headers: response.headers,
        timestamp: Date.now()
      })
      if (import.meta.env.DEV) {
        console.log(`💾 Cached response for URL: ${config.url}`)
      }
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config

    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.detail || error.response?.data?.message || error.message,
      errorType: error.code,
      hasResponse: !!error.response,
      responseData: error.response?.data
    })

    // Handle 401 - Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // If already refreshing, queue this request to retry after refresh completes
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((newToken, refreshError) => {
            if (refreshError) {
              reject(refreshError)
            } else {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              resolve(api(originalRequest))
            }
          })
        })
      }

      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        isRefreshing = true
        try {
          console.log('🔄 Attempting to refresh token...')
          
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/api/v1/token/refresh/`,
            { refresh: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          )

          // Backend wraps response in data object
          const tokens = response.data.data || response.data
          const access = tokens.access || tokens.token
          
          localStorage.setItem('accessToken', access)
          originalRequest.headers.Authorization = `Bearer ${access}`

          console.log('✅ Token refreshed successfully')
          
          // Notify all queued requests
          onRefreshed(access)
          
          return api(originalRequest)
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError)
          
          // Notify all queued requests of failure
          onRefreshFailed(refreshError)
          
          // Clear auth data and notify app of session expiry
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user_data')
          window.dispatchEvent(new Event('auth:session-expired'))
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      } else {
        // No refresh token, notify app of session expiry
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user_data')
        window.dispatchEvent(new Event('auth:session-expired'))
      }
    }

    return Promise.reject(error)
  }
)

export default api
