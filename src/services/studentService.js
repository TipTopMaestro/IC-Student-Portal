import api, { invalidateApiCachePattern } from './api'
import { invalidateCachePattern } from '@/composables/useSWR'

/**
 * Student Service - Handles all student-related API calls
 */

const getStudentErrorMessage = (error, fallback = 'Unable to complete request.') => {
  const status = error.response?.status
  if (status === 401 || status === 403) {
    return 'You do not have permission to perform this action.'
  }
  if (status === 404) {
    return fallback
  }
  if (status === 413) {
    return 'Uploaded file is too large.'
  }
  if (status === 429) {
    return 'Too many requests. Try again later.'
  }
  if (status >= 500) {
    return 'Server error. Try again later.'
  }
  if (!error.response && error.request) {
    return 'Network error. Check your connection.'
  }
  const errors = error.response?.data?.errors
  if (errors && typeof errors === 'object') {
    const firstKey = Object.keys(errors)[0]
    const val = errors[firstKey]
    if (Array.isArray(val) && typeof val[0] === 'string' && val[0].length < 120) {
      return val[0]
    }
    if (typeof val === 'string' && val.length < 120) {
      return val
    }
  }
  const msg = error.response?.data?.message
  if (typeof msg === 'string' && msg.trim() && !msg.includes('{') && !msg.includes('<') && msg.length < 120) {
    return msg.trim()
  }
  return fallback
}

/**
 * Get current user's profile
 * @returns {Promise} Student profile data
 */
export const getCurrentProfile = async () => {
  try {
    const response = await api.get('/api/v1/me/', {
      cache: true,
      cacheTTL: 300000 // 5 minutes TTL for user profile
    })
    // Backend wraps response in { status_code, message, data: {...}, errors }
    const userData = response.data.data || response.data

    // If student is not linked to user account, try fetching from students endpoint
    if (!userData.student && userData.username) {
      try {
        // Extract last name from username (format: "lastname.firstname")
        const nameParts = userData.username.split('.')
        const searchName = nameParts[0]
        
        const studentsResponse = await api.get('/api/v1/students/', {
          params: { search: searchName }
        })
        const students = studentsResponse.data.data || studentsResponse.data || []
        
        // Find matching student by first name or username pattern
        const matchedStudent = Array.isArray(students) ? students.find(s => {
          const sName = (s.s_fname || '').toLowerCase()
          const sLname = (s.s_lname || '').toLowerCase()
          const uFirst = (userData.first_name || '').toLowerCase()
          const uLast = (userData.last_name || '').toLowerCase()
          return (sName === uFirst && sLname === uLast) || 
                 (sLname === nameParts[0]?.toLowerCase())
        }) : null

        if (matchedStudent) {
          userData.student = matchedStudent
        }
      } catch (e) {
        console.warn('Could not auto-link student record:', e)
      }
    }

    return {
      success: true,
      data: userData
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return {
      success: false,
      error: getStudentErrorMessage(error, 'Failed to load profile.')
    }
  }
}

/**
 * Update current user's profile
 * @param {Number} userId - User ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated profile data
 */
export const updateProfile = async (userId, profileData) => {
  try {
    const isMultipart = profileData.avatar instanceof File
    let payload
    let headers = {}

    if (isMultipart) {
      payload = new FormData()
      if (profileData.firstName !== undefined) payload.append('first_name', profileData.firstName)
      if (profileData.lastName !== undefined) payload.append('last_name', profileData.lastName)
      if (profileData.email !== undefined) payload.append('email', profileData.email)
      payload.append('profile', profileData.avatar)
      headers['Content-Type'] = 'multipart/form-data'
    } else {
      payload = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email
      }
      
      // If avatar is null, send it to clear the profile pic.
      // If it's a string URL, omit it to avoid "The submitted data was not a file" error.
      if (profileData.avatar === null) {
        payload.profile = null
      }
    }

    const response = await api.patch(`/api/v1/users/${userId}/`, payload, { headers })

    // Write-through cache invalidation safely
    try {
      invalidateCachePattern('profile')
      invalidateCachePattern('me')
      
      invalidateApiCachePattern('/api/v1/me/')
      invalidateApiCachePattern(`/api/v1/users/${userId}/`)
    } catch (e) {
      console.warn('⚠️ Non-fatal cache invalidation error:', e)
    }

    try {
      const { useAuthStore } = await import('@/stores/auth')
      const authStore = useAuthStore()
      await authStore.fetchCurrentUser()
    } catch (e) {
      console.warn('Failed to sync auth store user:', e)
    }

    const userData = response.data.data || response.data
    return {
      success: true,
      data: userData
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return {
      success: false,
      error: getStudentErrorMessage(error, 'Failed to update profile.')
    }
  }
}

/**
 * Get student by ID (admin only)
 * @param {number} studentId - Student ID
 * @returns {Promise} Student data
 */
export const getStudentById = async (studentId) => {
  try {
    const response = await api.get(`/api/v1/students/${studentId}/`, {
      cache: true,
      cacheTTL: 120000 // 2 minutes
    })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching student:', error)
    return {
      success: false,
      error: getStudentErrorMessage(error, 'Failed to load student data.')
    }
  }
}

/**
 * List all students (admin only)
 * @param {Object} params - Query parameters (page, search, etc.)
 * @returns {Promise} List of students
 */
export const listStudents = async (params = {}) => {
  try {
    const response = await api.get('/api/v1/students/', { 
      params,
      cache: true,
      cacheTTL: 60000 // 1 minute
    })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching students:', error)
    return {
      success: false,
      error: getStudentErrorMessage(error, 'Failed to load students.')
    }
  }
}

/**
 * Update student record
 * @param {Number} studentId - Student ID
 * @param {Object} studentData - Updated student data
 * @returns {Promise} Updated student data
 */
export const updateStudentProfile = async (studentId, studentData) => {
  try {
    const response = await api.patch(`/api/v1/students/${studentId}/`, studentData)

    // Write-through cache invalidation safely
    try {
      invalidateCachePattern('students')
      invalidateCachePattern('profile')
      invalidateCachePattern('me')
      
      invalidateApiCachePattern('/api/v1/students/')
      invalidateApiCachePattern('/api/v1/me/')
    } catch (e) {
      console.warn('⚠️ Non-fatal cache invalidation error:', e)
    }

    return {
      success: true,
      data: response.data.data || response.data
    }
  } catch (error) {
    console.error('Error updating student profile:', error)
    return {
      success: false,
      error: getStudentErrorMessage(error, 'Failed to update student profile.')
    }
  }
}

export default {
  getCurrentProfile,
  updateProfile,
  getStudentById,
  listStudents,
  updateStudentProfile
}
