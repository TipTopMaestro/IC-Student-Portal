import api from './api'
import { API_CONFIG } from '../config/api'

export const authService = {
  async login(username, password) {
    console.log('🔐 Real API Login attempt:', { username, apiUrl: API_CONFIG.BASE_URL })
    
    const response = await api.post('/api/v1/login/', {
      username,
      password
    })
    
    console.log('✅ Real API Login response:', response.data)
    return response.data
  },

  async loginWithGoogle(token) {
    const response = await api.post('/api/v1/auth/google/', {
      token
    })
    return response.data
  },

  async getCurrentUser() {
    console.log('🔐 Fetching current user from real API...')
    const response = await api.get('/api/v1/me/')
    console.log('✅ Current user fetched:', response.data)
    return response.data
  },

  async refreshToken(refreshToken) {
    const response = await api.post('/api/v1/token/refresh/', {
      refresh: refreshToken
    })
    return response.data
  },

  async logout() {
    try {
      await api.post('/api/v1/logout/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user_data')
    }
  }
}
