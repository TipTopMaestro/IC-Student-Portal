import api from './api'

/**
 * Student Service - Handles all student-related API calls
 */

/**
 * Get current user's profile
 * @returns {Promise} Student profile data
 */
export const getCurrentProfile = async () => {
  try {
    const response = await api.get('api/v1/me/')
    // Backend wraps response in { status_code, message, data: {...}, errors }
    const userData = response.data.data || response.data
    return {
      success: true,
      data: userData
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load profile'
    }
  }
}

/**
 * Update current user's profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated profile data
 */
export const updateProfile = async (profileData) => {
  try {
    // Backend uses student object format, not profile
    // We can only update what the API allows
    const payload = {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      email: profileData.email
    }

    const response = await api.patch('api/v1/me/', payload)
    const userData = response.data.data || response.data
    return {
      success: true,
      data: userData
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return {
      success: false,
      error: error.response?.data?.errors || error.response?.data?.message || 'Failed to update profile'
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
    const response = await api.get(`api/v1/students/${studentId}/`)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching student:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load student data'
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
    const response = await api.get('api/v1/students/', { params })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching students:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load students'
    }
  }
}

export default {
  getCurrentProfile,
  updateProfile,
  getStudentById,
  listStudents
}
