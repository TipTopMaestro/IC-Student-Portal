import api from './api'

export const authService = {
  async login(username, password) {
    const response = await api.post('api/v1/login/', {
      username,
      password
    })
    return response.data
  },

  async loginWithGoogle(token) {
    const response = await api.post('api/v1/auth/google/', {
      token
    })
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('api/v1/me/')
    return response.data
  },

  async refreshToken(refreshToken) {
    const response = await api.post('api/v1/token/refresh/', {
      refresh: refreshToken
    })
    return response.data
  },

  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user_data')
  }
}
