import api from './api'

/**
 * Event Service - Handles attendance events API calls
 */

/**
 * List attendance events
 * @param {Object} params - Query parameters (page, per_page, search, etc.)
 * @returns {Promise} List of events
 */
export const listEvents = async (params = {}) => {
  try {
    const response = await api.get('/api/v1/attendance-events/', { params })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load events'
    }
  }
}

/**
 * Get event by ID
 * @param {number} eventId - Event ID
 * @returns {Promise} Event data
 */
export const getEventById = async (eventId) => {
  try {
    const response = await api.get(`/api/v1/attendance-events/${eventId}/`)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching event:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load event'
    }
  }
}

/**
 * List attendance records
 * @param {Object} params - Query parameters (page, per_page, event_id, etc.)
 * @returns {Promise} List of attendance records
 */
export const listAttendanceRecords = async (params = {}) => {
  try {
    const response = await api.get('/api/v1/attendance-records/', { params })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching attendance records:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load attendance records'
    }
  }
}

/**
 * Upload attendance file
 * @param {FormData} formData - Form data with file and event_id
 * @returns {Promise} Upload result
 */
/**
 * List institute attendance events (richer data with academic year, semester, dates, status)
 * @param {Object} params - Query parameters (page, per_page, etc.)
 * @returns {Promise} List of institute events
 */
export const listInstituteEvents = async (params = {}) => {
  try {
    const response = await api.get('/api/v1/institute-attendance-event/', { params })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching institute events:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load institute events'
    }
  }
}

