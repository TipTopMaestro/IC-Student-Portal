// API Configuration

export const API_CONFIG = {
  // Requests go to Vite's proxy (same origin → no CORS) or Vercel rewrite in production
  BASE_URL: import.meta.env.PROD ? '/proxy' : '',
  
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
}

// Helper to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper to normalize backend media/avatar URLs to production domains and HTTPS
export const normalizeUrl = (url) => {
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
  
  let normalized = url
  const activeBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://dnsc-systems-api.onrender.com'
  const activeDomain = activeBaseUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '')
  
  // If it's already an absolute URL, rewrite local domains to production
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
    normalized = normalized.replace(/(?:localhost|127\.0\.0\.1|10\.0\.2\.2)(?::\d+)?/g, activeDomain)
    return normalized.replace(/^http:\/\//i, 'https://')
  }
  
  // Prepends backend URL for relative backend paths
  const baseUrl = activeBaseUrl.replace(/\/$/, '')
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`
  }
  return `${baseUrl}/${url}`
}
