// API Configuration
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'false'

export const API_CONFIG = {
  // When mock is off, use Vite proxy in dev to avoid CORS, and VITE_API_BASE_URL in production
  BASE_URL: USE_MOCK ? '' : (import.meta.env.PROD ? (import.meta.env.VITE_API_BASE_URL || '') : ''),
  
  // Use mock API for development (set VITE_USE_MOCK_API=true to enable)
  USE_MOCK,
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/v1/login/',
    GOOGLE_LOGIN: '/api/v1/auth/google/',
    LOGOUT: '/api/v1/logout/',
    REFRESH_TOKEN: '/api/v1/token/refresh/',
    CURRENT_USER: '/api/v1/me/',
    
    // Students
    STUDENTS: '/api/v1/students/',
    STUDENT_DETAIL: (id) => `/api/v1/students/${id}/`,
    
    // Events
    EVENTS: '/api/v1/attendance-events/',
    EVENT_DETAIL: (id) => `/api/v1/attendance-events/${id}/`,
    
    // Attendance
    ATTENDANCE_RECORDS: '/api/v1/attendance-records/',
    ATTENDANCE_UPLOAD: '/api/v1/attendance-records/upload/',
    STUDENT_ATTENDANCE: (studentId) => `/api/v1/students/${studentId}/attendance/`,
    
    
    // Posts (Instagram-style posts feature)
    POSTS: '/api/v1/posts/',
    POST_DETAIL: (id) => `/api/v1/posts/${id}/`,
  },
  
  // Request timeout (increased for Render.com free tier cold starts)
  TIMEOUT: 120000, // 120 seconds (2 minutes)
  
  // Mock delay (for development)
  MOCK_DELAY: 800,
}

// Helper to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
