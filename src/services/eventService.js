import api, { invalidateApiCachePattern } from './api'
import { invalidateCachePattern } from '@/composables/useSWR'

/**
 * Event Service - Handles attendance events API calls
 */

const getEventErrorMessage = (error, fallback = 'Unable to complete request.') => {
  const status = error.response?.status
  if (status === 401 || status === 403) {
    return 'You do not have permission to view this information.'
  }
  if (status === 404) {
    return fallback
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
  const msg = error.response?.data?.message
  if (typeof msg === 'string' && msg.trim() && !msg.includes('{') && !msg.includes('<') && msg.length < 120) {
    return msg.trim()
  }
  return fallback
}

/**
 * List attendance events
 * @param {Object} params - Query parameters (page, per_page, search, etc.)
 * @returns {Promise} List of events
 */
export const listEvents = async (params = {}) => {
  try {
    const response = await api.get('/api/v1/attendance-events/', { 
      params,
      cache: true,
      cacheTTL: 60000 // 1 minute
    })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return {
      success: false,
      error: getEventErrorMessage(error, 'Failed to load events.')
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
    const response = await api.get(`/api/v1/attendance-events/${eventId}/`, {
      cache: true,
      cacheTTL: 120000 // 2 minutes
    })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching event:', error)
    return {
      success: false,
      error: getEventErrorMessage(error, 'Failed to load event.')
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
    const response = await api.get('/api/v1/attendance-records/', { 
      params,
      cache: true,
      cacheTTL: 60000 // 1 minute
    })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching attendance records:', error)
    return {
      success: false,
      error: getEventErrorMessage(error, 'Failed to load attendance records.')
    }
  }
}

/**
 * List institute attendance events (richer data with academic year, semester, dates, status)
 * @param {Object} params - Query parameters (page, per_page, etc.)
 * @returns {Promise} List of institute events
 */
export const listInstituteEvents = async (params = {}) => {
  try {
    const response = await api.get('/api/v1/institute-attendance-event/', { 
      params,
      cache: true,
      cacheTTL: 60000 // 1 minute
    })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching institute events:', error)
    return {
      success: false,
      error: getEventErrorMessage(error, 'Failed to load institute events.')
    }
  }
}

