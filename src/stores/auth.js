import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService.wrapper'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

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
      
      localStorage.setItem('accessToken', response.access)
      localStorage.setItem('refreshToken', response.refresh)
      
      console.log('🔐 Auth Store: Fetching current user...')
      await fetchCurrentUser()
      
      console.log('🔐 Auth Store: User fetched, isAdmin:', isAdmin.value, 'user:', user.value)
      
      return { success: true }
    } catch (err) {
      console.error('❌ Auth Store: Login error:', err)
      error.value = err.response?.data?.detail || 'Invalid credentials'
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
      const userData = await authService.getCurrentUser()
      
      if (Array.isArray(userData) && userData.length > 0) {
        user.value = userData[0]
      } else {
        user.value = userData
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
  }

  return {
    user,
    loading,
    error,
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
