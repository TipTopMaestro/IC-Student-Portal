import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService.wrapper'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)
  // Reactive token flag — keeps isAuthenticated truly reactive
  const hasToken = ref(!!localStorage.getItem('accessToken'))

  // Sync reactive flag whenever we modify localStorage tokens
  const setTokens = (access, refresh) => {
    if (access) localStorage.setItem('accessToken', access)
    if (refresh) localStorage.setItem('refreshToken', refresh)
    hasToken.value = true
  }

  const clearTokens = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user_data')
    hasToken.value = false
  }

  // Listen for session expiry events from API interceptor
  const handleSessionExpired = () => {
    console.log('🔐 Session expired, clearing auth state')
    user.value = null
    error.value = null
    hasToken.value = false
    // Redirect to login if not already there
    const currentPath = window.location.pathname
    if (currentPath !== '/login') {
      window.location.href = '/login'
    }
  }
  window.addEventListener('auth:session-expired', handleSessionExpired)

  const isAuthenticated = computed(() => {
    const hasUser = !!user.value
    console.log('🔐 isAuthenticated check:', { hasToken: hasToken.value, hasUser, result: hasToken.value && hasUser })
    return hasToken.value && hasUser
  })

  const isAdmin = computed(() => {
    if (!user.value) return false
    const hasAdminGroup = user.value.groups?.some(
      g => typeof g === 'string' && g.toLowerCase().includes('admin')
    )
    return hasAdminGroup || 
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
      
      setTokens(tokens.access, tokens.refresh)
      
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
      
      // Backend wraps response in data object
      const tokens = response.data || response
      
      setTokens(tokens.access, tokens.refresh)
      
      await fetchCurrentUser()
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.error || 'Google login failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const normalizeUrl = (url) => {
    if (!url || typeof url !== 'string') return ''
    
    // Handle local frontend assets
    if (
      url === '/default_profile.png' || 
      url === '/ic-building.png' || 
      url === '/icsa_logo.png' || 
      url.startsWith('/src/') || 
      url.startsWith('/assets/') || 
      url.startsWith('/@')
    ) {
      return url
    }
    
    // If it's already an absolute URL
    if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
      return url.replace(/^http:\/\//i, 'https://')
    }
    
    // Prepends backend URL for relative backend paths
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://dnsc-systems-api.onrender.com').replace(/\/$/, '')
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`
    }
    return `${baseUrl}/${url}`
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser()
      
      // Backend wraps response in data object
      let userData = response.data || response
      
      if (Array.isArray(userData) && userData.length > 0) {
        userData = userData[0]
      }

      // Normalize profile pictures
      console.log('🔐 Auth Store: userData structure:', JSON.stringify(userData, null, 2))
      const picFields = [
        'profile_picture', 
        'avatar', 
        'picture', 
        'google_avatar', 
        'photo', 
        'profile_image', 
        'user_avatar', 
        'user_profile',
        'profile_url',
        'profile'
      ]
      
      picFields.forEach(field => {
        // Only normalize if it's a string. Don't overwrite objects/relations (e.g. userData.profile)
        if (userData[field] && typeof userData[field] === 'string') {
          userData[field] = normalizeUrl(userData[field])
        }
      })
      
      // The backend /me/ endpoint doesn't return the user ID. We must decode the JWT or use student.user
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const jwtPayload = JSON.parse(atob(token.split('.')[1]))
          userData.id = jwtPayload.user_id || jwtPayload.id
        } catch (e) {
          console.warn('Could not decode JWT to get user ID')
        }
      }
      if (!userData.id && userData.student && userData.student.user) {
        userData.id = userData.student.user
      }

      if (userData.student?.s_image && typeof userData.student.s_image === 'string') {
        userData.student.s_image = normalizeUrl(userData.student.s_image)
      }
      if (userData.student?.profile_picture && typeof userData.student.profile_picture === 'string') {
        userData.student.profile_picture = normalizeUrl(userData.student.profile_picture)
      }

      // Map to user_avatar for consistency, prioritizing user-uploaded custom pictures over student records
      userData.user_avatar = (typeof userData.profile_url === 'string' ? userData.profile_url : '') ||
                           (typeof userData.profile === 'string' ? userData.profile : '') ||
                           (typeof userData.profile_picture === 'string' ? userData.profile_picture : '') ||
                           (typeof userData.user_avatar === 'string' ? userData.user_avatar : '') || 
                           (typeof userData.avatar === 'string' ? userData.avatar : '') || 
                           (typeof userData.student?.s_image === 'string' ? userData.student.s_image : '') ||
                           (typeof userData.student?.profile_picture === 'string' ? userData.student.profile_picture : '') || 
                           (typeof userData.user_profile === 'string' ? userData.user_profile : '') || 
                           (typeof userData.picture === 'string' ? userData.picture : '') || 
                           (typeof userData.google_avatar === 'string' ? userData.google_avatar : '') || 
                           '/default_profile.png'
      
      user.value = userData

      // If user has no linked student record and isn't admin, try to find it
      // This runs once per login/session so individual pages don't need to
      if (!user.value.student && user.value.username) {
        const hasAdminGroup = user.value.groups?.some(
          g => typeof g === 'string' && g.toLowerCase().includes('admin')
        )
        if (!hasAdminGroup && !user.value.is_staff && !user.value.is_superuser) {
          try {
            const nameParts = user.value.username.split('.')
            if (nameParts.length >= 2) {
              const resp = await api.get('/api/v1/students/', { params: { search: nameParts[0] } })
              const students = resp.data.data?.data || resp.data.data || []
              const match = students.find(s => {
                const fname = (s.s_fname || '').toLowerCase()
                const lname = (s.s_lname || '').toLowerCase()
                return (
                  (lname === nameParts[0]?.toLowerCase() && fname === nameParts[1]?.toLowerCase()) ||
                  (fname === nameParts[0]?.toLowerCase() && lname === nameParts[1]?.toLowerCase())
                )
              })
              if (match) {
                user.value = { ...user.value, student: match }
              }
            }
          } catch (e) {
            console.warn('Could not link student record during init:', e)
          }
        }
      }
      
      localStorage.setItem('user_data', JSON.stringify(user.value))
      
      return user.value
    } catch (err) {
      console.error('Failed to fetch user:', err)
      throw err
    }
  }

  /**
   * Link student record to user (called from student-side code only).
   * Kept separate from fetchCurrentUser to avoid coupling auth with student logic.
   */
  const linkStudentRecord = (studentData) => {
    if (user.value && studentData) {
      if (studentData.profile_picture) {
        studentData.profile_picture = normalizeUrl(studentData.profile_picture)
      }
      user.value = { ...user.value, student: studentData }
      localStorage.setItem('user_data', JSON.stringify(user.value))
    }
  }

  const logout = () => {
    authService.logout()
    user.value = null
    error.value = null
    hasToken.value = false
  }

  const initialize = async () => {
    if (initialized.value) return

    const token = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('user_data')
    
    if (token) {
      hasToken.value = true
      
      // Restore cached user immediately for fast UI render
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
        } catch (e) {
          console.warn('Failed to parse stored user data:', e)
        }
      }
      
      // Always refresh from API to ensure data is current
      try {
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
    linkStudentRecord,
    initialize
  }
})
