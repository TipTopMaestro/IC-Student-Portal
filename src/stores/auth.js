import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    // This will connect to backend API
    // For now, mock authentication
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify(credentials)
      // })
      
      // Mock successful login
      const mockUser = {
        id: '2021-0001',
        studentId: '2021-0001',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        email: credentials.email,
        course: 'Bachelor of Science in Information Technology',
        yearLevel: '3rd Year',
        section: 'BSIT-3A',
        avatar: null
      }
      
      user.value = mockUser
      token.value = 'mock_token_' + Date.now()
      localStorage.setItem('auth_token', token.value)
      localStorage.setItem('user_data', JSON.stringify(mockUser))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    // This will connect to backend API
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   body: JSON.stringify(userData)
      // })
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  const loadUser = () => {
    const storedUser = localStorage.getItem('user_data')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  }

  // Load user on store initialization
  loadUser()

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    loadUser
  }
})
