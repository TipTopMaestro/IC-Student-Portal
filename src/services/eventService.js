import api, { invalidateApiCachePattern } from './api'
import { invalidateCachePattern } from '@/composables/useSWR'

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
      error: error.response?.data?.message || 'Failed to load attendance records'
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
      error: error.response?.data?.message || 'Failed to load institute events'
    }
  }
}

/**
 * Upload attendance file
 * @param {FormData} formData - Form data with file and event_id
 * @returns {Promise} Upload result
 */
export const uploadAttendance = async (formData) => {
  try {
    const response = await api.post('/api/v1/attendance-records/import_attendance_records/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    // Invalidate SWR & Axios caches safely
    try {
      invalidateCachePattern('attendance')
      invalidateCachePattern('events')
      invalidateApiCachePattern('/api/v1/attendance-records/')
      invalidateApiCachePattern('/api/v1/institute-attendance-event/')
      invalidateApiCachePattern('/api/v1/attendance-events/')
    } catch (e) {
      console.warn('⚠️ Non-fatal cache invalidation error:', e)
    }

    // Invalidate Pinia stores
    import('@/stores/events').then(({ useEventStore }) => {
      useEventStore().invalidate()
    }).catch(() => {})
    
    import('@/stores/attendance').then(({ useAttendanceStore }) => {
      useAttendanceStore().invalidate()
    }).catch(() => {})

    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error uploading attendance:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload attendance'
    }
  }
}
