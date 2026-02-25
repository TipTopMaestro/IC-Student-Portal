import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import { authService } from '@/services/authService.wrapper'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  // Listen for session expiry events from API interceptor
  const handleSessionExpired = () => {
    console.log('🔐 Session expired, clearing auth state')
    user.value = null
    error.value = null
  }
  window.addEventListener('auth:session-expired', handleSessionExpired)

  const isAuthenticated = computed(() => {
    const hasToken = !!localStorage.getItem('accessToken')
    const hasUser = !!user.value
    console.log('🔐 isAuthenticated check:', { hasToken, hasUser, result: hasToken && hasUser })
    return hasToken && hasUser
  })

  const isAdmin = computed(() => {
    if (!user.value) return false
    return user.value.groups?.includes('Admin') || 
           user.value.is_staff || 
           user.value.is_superuser ||
           false
  })

  const isStudent = computed(() => {
    if (!user.value) return false
    return !isAdmin.value
  })

  const login = async (username, password) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('🔐 Auth Store: Logging in...')
      const response = await authService.login(username, password)
      
      console.log('🔐 Auth Store: Login response received', response)
      
      // Backend wraps response in data object
      const tokens = response.data || response
      
      localStorage.setItem('accessToken', tokens.access)
      localStorage.setItem('refreshToken', tokens.refresh)
      
      console.log('🔐 Auth Store: Fetching current user...')
      await fetchCurrentUser()
      
      console.log('🔐 Auth Store: User fetched, isAdmin:', isAdmin.value, 'user:', user.value)
      
      return { success: true }
    } catch (err) {
      console.error('❌ Auth Store: Login error:', err)
      
      // Handle different error types
      if (!err.response) {
        // Network error or request blocked
        if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
          error.value = 'Cannot connect to server'
        } else if (err.message.includes('timeout')) {
          error.value = 'Connection timeout'
        } else {
          error.value = 'Connection failed'
        }
      } else {
        // Server error response
        error.value = err.response?.data?.errors?.detail || 
                     err.response?.data?.message || 
                     err.response?.data?.detail || 
                     'Invalid credentials'
      }
      
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async (token) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.loginWithGoogle(token)
      
      localStorage.setItem('accessToken', response.access)
      localStorage.setItem('refreshToken', response.refresh)
      
      await fetchCurrentUser()
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.error || 'Google login failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser()
      
      // Backend wraps response in data object
      const userData = response.data || response
      
      if (Array.isArray(userData) && userData.length > 0) {
        user.value = userData[0]
      } else {
        user.value = userData
      }

      // If student is not linked to user account, try fetching via search
      if (!user.value.student && user.value.username) {
        try {
          const { default: api } = await import('@/services/api')
          const nameParts = user.value.username.split('.')
          if (nameParts.length >= 2) {
            const studentsResp = await api.get('api/v1/students/', {
              params: { search: nameParts[0] }
            })
            const studentsData = studentsResp.data.data?.data || studentsResp.data.data || []
            const match = studentsData.find(s => {
              const fname = (s.s_fname || '').toLowerCase()
              const lname = (s.s_lname || '').toLowerCase()
              return (
                (lname === nameParts[0].toLowerCase() && fname === nameParts[1].toLowerCase()) ||
                (fname === nameParts[0].toLowerCase() && lname === nameParts[1].toLowerCase())
              )
            })
            if (match) {
              user.value = { ...user.value, student: match }
            }
          }
        } catch (e) {
          console.warn('Could not fetch student data fallback:', e)
        }
      }
      
      localStorage.setItem('user_data', JSON.stringify(user.value))
      
      return user.value
    } catch (err) {
      console.error('Failed to fetch user:', err)
      throw err
    }
  }

  const logout = () => {
    authService.logout()
    user.value = null
    error.value = null
  }

  const initialize = async () => {
    if (initialized.value) return

    const token = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('user_data')
    
    if (token && storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        await fetchCurrentUser()
      } catch (err) {
        console.error('Failed to initialize auth:', err)
        logout()
      }
    }

    initialized.value = true
  }

  return {
    user,
    loading,
    error,
    initialized,
    isAuthenticated,
    isAdmin,
    isStudent,
    login,
    loginWithGoogle,
    logout,
    fetchCurrentUser,
    initialize
  }
})
