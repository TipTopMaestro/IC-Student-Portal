import api from './api'

/**
 * Comment Service - Handles post comments API calls
 */

const COMMENTS_ENDPOINT = '/api/v1/posts_comments/'

/**
 * Extracts error message from API error response
 * @param {Error} error - Axios error object
 * @param {string} fallback - Fallback error message
 * @returns {string} Error message
 */
const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || 
         error.response?.data?.detail || 
         error.message || 
         fallback
}

/**
 * List comments for a specific post
 * @param {number|string} postId - Post ID
 * @param {Object} [params] - Query parameters
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const listComments = async (postId, params = {}) => {
  try {
    const response = await api.get(COMMENTS_ENDPOINT, {
      params: { post_id: postId, ...params }
    })
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error fetching comments:', error)
    return { success: false, error: getErrorMessage(error, 'Failed to load comments') }
  }
}

/**
 * Create a new comment on a post
 * @param {number|string} postId - Post ID
 * @param {string} content - Comment text
 * @param {number|null} [parentCommentId=null] - Parent comment ID for replies
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const createComment = async (postId, content, parentCommentId = null) => {
  try {
    const payload = {
      post: postId,
      content
    }
    if (parentCommentId) {
      payload.parent_comment = parentCommentId
    }
    const response = await api.post(COMMENTS_ENDPOINT, payload)
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error creating comment:', error)
    return { success: false, error: getErrorMessage(error, 'Failed to post comment') }
  }
}

/**
 * Update a comment
 * @param {number|string} commentId - Comment ID
 * @param {string} content - Updated comment text
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateComment = async (commentId, content) => {
  try {
    const response = await api.patch(`${COMMENTS_ENDPOINT}${commentId}/`, { content })
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error updating comment:', error)
    return { success: false, error: getErrorMessage(error, 'Failed to update comment') }
  }
}

/**
 * Delete a comment
 * @param {number|string} commentId - Comment ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteComment = async (commentId) => {
  try {
    await api.delete(`${COMMENTS_ENDPOINT}${commentId}/`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting comment:', error)
    return { success: false, error: getErrorMessage(error, 'Failed to delete comment') }
  }
}

/**
 * Get replies for a comment
 * @param {number|string} commentId - Comment ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getReplies = async (commentId) => {
  try {
    const response = await api.get(`${COMMENTS_ENDPOINT}${commentId}/replies/`)
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error fetching replies:', error)
    return { success: false, error: getErrorMessage(error, 'Failed to load replies') }
  }
}

/**
 * Helper to extract comments array from API response
 * @param {Object} result - API result from listComments
 * @returns {Array} Array of comments
 */
export const extractComments = (result) => {
  if (!result.success) return []
  const d = result.data?.data || result.data
  const items = d?.results || d?.data || d
  return Array.isArray(items) ? items : []
}
