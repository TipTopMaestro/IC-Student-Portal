// Mock authentication service for testing without backend
// This simulates API responses with realistic delays

const MOCK_DELAY = 800 // Simulate network delay

const MOCK_USERS = [
  {
    id: 1,
    username: 'aparece.alex',
    email: 'aparece.alex@student.dnsc.edu.ph',
    password: '123456', // Real test credentials from backend team
    first_name: 'Alex',
    last_name: 'Aparece',
    firstName: 'Alex',
    lastName: 'Aparece',
    role: 'student',
    groups: ['Students'],
    is_staff: false,
    is_superuser: false,
    
    // Student Profile Data
    profile: {
      student_id: '2021-00123',
      course: 'Bachelor of Science in Computer Science',
      course_code: 'BSCS',
      year_level: '3rd Year',
      section: 'A',
      contact_number: '+63 912 345 6789',
      address: 'Panabo City, Davao del Norte',
      date_of_birth: '2003-05-15',
      gender: 'Male',
      civil_status: 'Single',
      nationality: 'Filipino',
      religion: 'Roman Catholic',
      
      // Emergency Contact
      emergency_contact: {
        name: 'Maria Aparece',
        relationship: 'Mother',
        contact_number: '+63 912 345 6780'
      },
      
      // Academic Info
      academic: {
        enrollment_status: 'Regular',
        academic_year: '2024-2025',
        semester: '2nd Semester',
        units_enrolled: 21,
        gpa: 1.75,
        honors: ['Dean\'s Lister'],
        scholarship: 'Academic Scholarship'
      }
    }
  },
  {
    id: 2,
    username: 'admin@test.com',
    email: 'admin@test.com',
    password: 'Admin123!',
    first_name: 'Jane',
    last_name: 'Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'admin',
    employeeId: 'EMP-2024-001',
    groups: ['Admin'],
    is_staff: true,
    is_superuser: false
  }
]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const generateTokens = (user) => ({
  access: `mock_access_token_${user.id}_${Date.now()}`,
  refresh: `mock_refresh_token_${user.id}_${Date.now()}`
})

export const authServiceMock = {
  async login(username, password) {
    await delay(MOCK_DELAY)
    
    console.log('🎭 Mock Login attempt:', { username })
    
    const user = MOCK_USERS.find(
      u => (u.username === username || u.email === username) && u.password === password
    )
    
    if (!user) {
      console.log('❌ Mock Login failed: Invalid credentials')
      throw {
        response: {
          status: 401,
          data: {
            detail: 'Invalid credentials',
            message: 'Username or password is incorrect'
          }
        }
      }
    }
    
    const tokens = generateTokens(user)
    const { password: _, ...userWithoutPassword } = user
    
    console.log('✅ Mock Login success:', userWithoutPassword)
    
    return {
      ...tokens,
      user: userWithoutPassword
    }
  },

  async loginWithGoogle(token) {
    await delay(MOCK_DELAY)
    
    // Simulate successful Google login
    const user = {
      id: 999,
      username: 'google.user@test.com',
      email: 'google.user@test.com',
      firstName: 'Google',
      lastName: 'User',
      role: 'student',
      studentId: 'STU-2024-999'
    }
    
    const tokens = generateTokens(user)
    
    return {
      ...tokens,
      user
    }
  },

  async getCurrentUser() {
    await delay(300)
    
    const accessToken = localStorage.getItem('accessToken')
    
    console.log('🎭 Mock getCurrentUser called, token:', accessToken?.substring(0, 20) + '...')
    
    if (!accessToken || !accessToken.startsWith('mock_access_token_')) {
      console.log('❌ Mock getCurrentUser: Invalid or missing token')
      throw {
        response: {
          status: 401,
          data: {
            detail: 'Unauthorized',
            message: 'Invalid or expired token'
          }
        }
      }
    }
    
    // Extract user ID from mock token
    const tokenParts = accessToken.split('_')
    const userId = parseInt(tokenParts[3])
    
    console.log('🔍 Extracted user ID from token:', userId)
    
    const user = MOCK_USERS.find(u => u.id === userId)
    
    if (!user) {
      // Return default user data from localStorage if available
      const storedUser = localStorage.getItem('user_data')
      if (storedUser) {
        console.log('✅ Returning stored user data')
        return JSON.parse(storedUser)
      }
      
      console.log('❌ User not found')
      throw {
        response: {
          status: 404,
          data: {
            detail: 'User not found'
          }
        }
      }
    }
    
    const { password: _, ...userWithoutPassword } = user
    console.log('✅ Mock getCurrentUser success:', userWithoutPassword)
    return userWithoutPassword
  },

  async refreshToken(refreshToken) {
    await delay(300)
    
    if (!refreshToken || !refreshToken.startsWith('mock_refresh_token_')) {
      throw {
        response: {
          status: 401,
          data: {
            error: 'Invalid refresh token'
          }
        }
      }
    }
    
    // Extract user ID from mock refresh token
    const tokenParts = refreshToken.split('_')
    const userId = parseInt(tokenParts[3])
    
    const user = MOCK_USERS.find(u => u.id === userId)
    
    if (!user) {
      throw {
        response: {
          status: 401,
          data: {
            error: 'Invalid refresh token'
          }
        }
      }
    }
    
    const tokens = generateTokens(user)
    
    return {
      access: tokens.access,
      refresh: tokens.refresh
    }
  },

  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user_data')
  },

  async issueTransferToken(intendedFor = '') {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: {
        transfer_token: 'mock-transfer-token-' + Math.random().toString(36).substring(2, 15),
        expires_at: new Date(Date.now() + 60 * 1000).toISOString()
      }
    }
  }
}

// Export mock users for reference/documentation
export const MOCK_TEST_USERS = [
  {
    username: 'student@test.com',
    password: 'Test123!',
    role: 'student'
  },
  {
    username: 'admin@test.com',
    password: 'Admin123!',
    role: 'admin'
  }
]
