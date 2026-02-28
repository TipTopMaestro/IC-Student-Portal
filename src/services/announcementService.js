import api from './api'

/**
 * Announcement Service - Handles announcements API calls
 */

/**
 * List announcements
 * @param {Object} params - Query parameters (page, per_page, search, etc.)
 * @returns {Promise} List of announcements
 */
export const listAnnouncements = async (params = {}) => {
  try {
    const response = await api.get('/api/v1/announcements/', { params })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load announcements'
    }
  }
}

/**
 * Get announcement by ID
 * @param {number} announcementId - Announcement ID
 * @returns {Promise} Announcement data
 */
export const getAnnouncementById = async (announcementId) => {
  try {
    const response = await api.get(`/api/v1/announcements/${announcementId}/`)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching announcement:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load announcement'
    }
  }
}
