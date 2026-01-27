import axios from 'axios'
import { API_CONFIG } from '../config/api'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasAuth: !!token
    })
    
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
    console.log('📥 API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
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

      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
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
          return api(originalRequest)
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError)
          
          // Clear auth data and redirect to login
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user_data')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token, redirect to login
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
