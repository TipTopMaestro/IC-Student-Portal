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
 * Helper to extract replies array from API response
 * @param {Object} result - API result from getReplies
 * @returns {Array} Array of normalized comments
 */
export const extractReplies = (result) => {
  if (!result.success) return []
  const d = result.data?.data || result.data
  // Handle various response shapes (array directly, or object with replies/results field)
  let items = []
  if (Array.isArray(d)) {
    items = d
  } else if (d?.replies && Array.isArray(d.replies)) {
    items = d.replies
  } else if (d?.results && Array.isArray(d.results)) {
    items = d.results
  } else if (d?.data && Array.isArray(d.data)) {
    items = d.data
  }
  
  // If replies came as a JSON string (sometimes seen in legacy responses)
  if (typeof d?.replies === 'string') {
    try { 
      items = JSON.parse(d.replies) 
    } catch (e) { 
      console.warn('Failed to parse replies string:', e)
    }
  }
  
  return items.map(normalizeComment)
}

/**
 * Normalize media URL to use HTTPS
 * @param {string} url - Media URL
 * @returns {string} HTTPS URL
 */
const normalizeMediaUrl = (url) => {
  if (!url) return ''
  return url.replace(/^http:\/\//i, 'https://')
}

/**
 * Normalize comment data
 * @param {Object} comment - Comment object
 * @returns {Object} Normalized comment
 */
const normalizeComment = (comment) => {
  if (!comment) return comment
  
  // Log a small sample to see structure once (don't flood console)
  if (Math.random() < 0.01) {
    console.log('💬 Comment structure sample:', JSON.stringify(comment, null, 2))
  }
  
  // Normalize potential avatar fields
  const avatarFields = ['user_avatar', 'user_profile', 'picture', 'avatar', 'google_avatar', 'photo', 'profile_image']
  
  // Find the first available avatar URL
  let avatarUrl = null
  
  // Prefer student profile picture if available
  if (comment.student?.profile_picture) {
    avatarUrl = comment.student.profile_picture
  } else if (comment.author?.profile_picture) {
    avatarUrl = comment.author.profile_picture
  } else if (comment.user?.profile_picture) {
    avatarUrl = comment.user.profile_picture
  } else {
    for (const field of avatarFields) {
      if (comment[field]) {
        avatarUrl = comment[field]
        break
      }
    }
  }

  // Set normalized user_avatar for consistent use in components
  comment.user_avatar = avatarUrl ? normalizeMediaUrl(avatarUrl) : null
  
  // Normalize replies if they exist
  if (comment.replies && Array.isArray(comment.replies)) {
    comment.replies = comment.replies.map(normalizeComment)
  }
  
  return comment
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
  const comments = Array.isArray(items) ? items : []
  return comments.map(normalizeComment)
}
