// API Configuration
export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // Use mock API for development (set to false when backend is ready)
  USE_MOCK: import.meta.env.VITE_USE_MOCK_API !== 'false',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/v1/login/',
    GOOGLE_LOGIN: '/api/v1/auth/google/',
    LOGOUT: '/api/v1/logout/',
    REFRESH_TOKEN: '/api/v1/token/refresh/',
    CURRENT_USER: '/api/v1/me/',
    
    // Fees (replaces 'Students' for clarity)
    FEES: '/api/v1/fees/',
    STUDENT_FEES: (userId) => `/api/v1/fees/?student__user=${userId}`,
    FEE_DETAIL: (id) => `/api/v1/fees/${id}/`,
    
    // Student general info
    STUDENTS: '/api/v1/students/',
    STUDENT_DETAIL: (id) => `/api/v1/students/${id}/`,
    
    // Events
    EVENTS: '/api/v1/attendance-events/',
    EVENT_DETAIL: (id) => `/api/v1/attendance-events/${id}/`,
    
    // Attendance
    ATTENDANCE_RECORDS: '/api/v1/attendance-records/',
    ATTENDANCE_UPLOAD: '/api/v1/attendance-records/upload/',
    STUDENT_ATTENDANCE: (studentId) => `/api/v1/students/${studentId}/attendance/`,
    
    // Announcements (if exists in backend)
    ANNOUNCEMENTS: '/api/v1/announcements/',
    ANNOUNCEMENT_DETAIL: (id) => `/api/v1/announcements/${id}/`,
  },
  
  // Request timeout
  TIMEOUT: 30000, // 30 seconds
  
  // Mock delay (for development)
  MOCK_DELAY: 800,
}

// Helper to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
