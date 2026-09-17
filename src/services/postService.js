import api, { invalidateApiCachePattern } from './api'
import { invalidateCachePattern } from '@/composables/useSWR'

/**
 * Post Service - Handles posts API calls for the Instagram-style posts feature
 */

const POSTS_ENDPOINT = '/api/v1/posts/'

// Helper to invalidate post caches
const invalidatePostCaches = () => {
  try {
    invalidateCachePattern('posts')
    invalidateApiCachePattern('/api/v1/posts/')
  } catch (e) {
    console.warn('⚠️ Non-fatal cache invalidation error:', e)
  }
}

/**
 * Extracts error message from API error response
 * @param {Error} error - Axios error object
 * @param {string} fallback - Fallback error message
 * @returns {string} Error message
 */
const getErrorMessage = (error, fallback = 'Unable to complete request.') => {
  const status = error.response?.status
  if (status === 401 || status === 403) {
    return 'You do not have permission to perform this action.'
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

  const errData = error.response?.data
  if (errData?.errors && typeof errData.errors === 'object') {
    const firstKey = Object.keys(errData.errors)[0]
    const val = errData.errors[firstKey]
    if (Array.isArray(val) && val.length > 0) {
      return `${firstKey}: ${val[0]}`
    } else if (typeof val === 'string') {
      return `${firstKey}: ${val}`
    }
  }

  const msg = errData?.detail || errData?.message
  if (typeof msg === 'string' && msg.trim() && !msg.includes('{') && !msg.includes('<') && msg.length < 120) {
    return msg.trim()
  }
  return fallback
}

/**
 * List posts with pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.per_page=10] - Items per page
 * @param {string} [params.visibility] - Filter by visibility (public, private)
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const listPosts = async (params = {}) => {
  try {
    const queryParams = {
      ordering: '-created_at',
      ...params
    }
    const response = await api.get(POSTS_ENDPOINT, { 
      params: queryParams,
      cache: true,
      cacheTTL: 15000 // 15 seconds TTL for posts list to keep it relatively fresh but prevent spamming
    })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      success: false,
      error: getErrorMessage(error, 'Failed to load posts')
    }
  }
}

/**
 * Get a single post by ID
 * @param {number|string} postId - Post ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getPostById = async (postId) => {
  try {
    const response = await api.get(`${POSTS_ENDPOINT}${postId}/`, {
      cache: true,
      cacheTTL: 30000 // 30 seconds TTL for individual post detail
    })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return {
      success: false,
      error: getErrorMessage(error, 'Failed to load post')
    }
  }
}

/**
 * Create a new post with optional images
 * @param {Object} postData - Post data
 * @param {string} postData.content - Post content text
 * @param {string} [postData.visibility='public'] - Post visibility
 * @param {boolean} [postData.disable_comments=false] - Disable comments
 * @param {File[]} [images=[]] - Array of image files to upload
 * @param {Object} [options={}] - Additional options (onUploadProgress, signal)
 * @returns {Promise<{success: boolean, data?: Object, error?: string, canceled?: boolean}>}
 */
export const createPost = async (postData, images = [], options = {}) => {
  try {
    const formData = new FormData()
    
    // Append text fields
    formData.append('content', postData.content)
    formData.append('category', postData.category || 'general')
    formData.append('visibility', postData.visibility || 'public')
    formData.append('disable_comments', postData.disable_comments || false)
    
    // Append images if any
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('uploaded_files', image)
      })
    }

    const requestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: options.signal
    }

    if (typeof options.onUploadProgress === 'function') {
      requestConfig.onUploadProgress = options.onUploadProgress
    }

    const response = await api.post(POSTS_ENDPOINT, formData, requestConfig)
    
    // Invalidate caches
    invalidatePostCaches()
    
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    if (error?.name === 'CanceledError' || error?.message === 'canceled') {
      return {
        success: false,
        canceled: true,
        error: 'Upload canceled.'
      }
    }
    console.error('Error creating post:', error)
    return {
      success: false,
      error: getErrorMessage(error, 'Failed to create post')
    }
  }
}

/**
 * Update an existing post
 * @param {number|string} postId - Post ID
 * @param {Object} postData - Updated post data
 * @param {string} [postData.content] - Post content text
 * @param {string} [postData.visibility] - Post visibility
 * @param {boolean} [postData.disable_comments] - Disable comments
 * @param {File[]} [newImages=[]] - New images to add
 * @param {number[]} [removeMediaIds=[]] - Media IDs to remove
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updatePost = async (postId, postData, newImages = [], removeMediaIds = []) => {
  try {
    // The backend ViewSet parser_classes strictly requires multipart/form-data
    const formData = new FormData()
    if (postData.content !== undefined) formData.append('content', postData.content)
    if (postData.category !== undefined) formData.append('category', postData.category)
    if (postData.visibility !== undefined) formData.append('visibility', postData.visibility)
    if (postData.disable_comments !== undefined) formData.append('disable_comments', postData.disable_comments)

    if (newImages && newImages.length > 0) {
      newImages.forEach((image) => {
        formData.append('uploaded_files', image)
      })
    }

    if (removeMediaIds && removeMediaIds.length > 0) {
      removeMediaIds.forEach((mediaId) => {
        formData.append('remove_media_ids', mediaId)
      })
    }

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }

    let response
    try {
      response = await api.patch(`${POSTS_ENDPOINT}${postId}/`, formData, config)
    } catch (patchErr) {
      // If PATCH is not allowed (405) or unsupported (415), fallback to PUT with multipart
      if (patchErr.response?.status === 405 || patchErr.response?.status === 415) {
        response = await api.put(`${POSTS_ENDPOINT}${postId}/`, formData, config)
      } else {
        throw patchErr
      }
    }
    
    // Invalidate caches
    invalidatePostCaches()
    
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error updating post:', error)
    return {
      success: false,
      error: getErrorMessage(error, 'Failed to update post')
    }
  }
}

/**
 * Delete a post
 * @param {number|string} postId - Post ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deletePost = async (postId) => {
  try {
    await api.delete(`${POSTS_ENDPOINT}${postId}/`)
    
    // Invalidate caches
    invalidatePostCaches()
    
    return {
      success: true
    }
  } catch (error) {
    console.error('Error deleting post:', error)
    return {
      success: false,
      error: getErrorMessage(error, 'Failed to delete post')
    }
  }
}

/**
 * Normalize media URL to use HTTPS
 * @param {string} url - Media URL
 * @returns {string} HTTPS URL
 */
const normalizeMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return ''
  
  let normalized = url
  const activeBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.instituteofcomputing.org'
  const activeDomain = activeBaseUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '')
  
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
    normalized = normalized.replace(/(?:localhost|127\.0\.0\.1|10\.0\.2\.2)(?::\d+)?/g, activeDomain)
    return normalized.replace(/^http:\/\//i, 'https://')
  }
  
  const baseUrl = activeBaseUrl.replace(/\/$/, '')
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`
  }
  return `${baseUrl}/${url}`
}

/**
 * Normalize post media URLs to HTTPS
 * @param {Object} post - Post object
 * @returns {Object} Post with normalized media URLs
 */
const normalizePostMedia = (post) => {
  if (!post) return post
  

  if (post.media && Array.isArray(post.media)) {
    post.media = post.media.map(m => ({
      ...m,
      media_url: normalizeMediaUrl(m.media_url)
    }))
  }
  
  // Normalize potential avatar fields
  const avatarFields = ['user_avatar', 'user_profile', 'picture', 'avatar', 'google_avatar', 'photo', 'profile_image']
  
  // Find the first available avatar URL
  let avatarUrl = null
  
  // Prefer student profile picture if available
  if (post.student?.profile_picture) {
    avatarUrl = post.student.profile_picture
  } else if (post.author?.profile_picture) {
    avatarUrl = post.author.profile_picture
  } else if (post.user?.profile_picture) {
    avatarUrl = post.user.profile_picture
  } else {
    for (const field of avatarFields) {
      if (post[field]) {
        avatarUrl = post[field]
        break
      }
    }
  }

  // Set normalized user_avatar for consistent use in components
  post.user_avatar = avatarUrl ? normalizeMediaUrl(avatarUrl) : null

  return post
}

/**
 * Helper to extract posts array from API response
 * Handles nested data structure: { data: { data: { data: [...] } } }
 * Also normalizes media URLs to HTTPS
 * @param {Object} result - API result from listPosts
 * @returns {Array} Array of posts
 */
export const extractPosts = (result) => {
  if (!result.success) return []
  const d = result.data?.data || result.data
  const items = d?.data || d
  const posts = Array.isArray(items) ? items : []
  
  return posts
    .map(normalizePostMedia)
    .sort((a, b) => {
      const dateA = a.created_at || a.date || a.timestamp || a.created
      const dateB = b.created_at || b.date || b.timestamp || b.created
      if (dateA && dateB) {
        const timeA = new Date(dateA).getTime()
        const timeB = new Date(dateB).getTime()
        if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
          return timeB - timeA
        }
      }
      return (Number(b.id) || 0) - (Number(a.id) || 0)
    })
}

/**
 * Helper to extract pagination info from API response
 * @param {Object} result - API result from listPosts
 * @returns {Object} Pagination info
 */
export const extractPagination = (result) => {
  if (!result.success) {
    return { currentPage: 1, perPage: 10, totalPages: 1, totalItems: 0 }
  }
  const d = result.data?.data || result.data
  return {
    currentPage: d?.current_page || 1,
    perPage: d?.per_page || 10,
    totalPages: d?.total_pages || 1,
    totalItems: d?.total_items || 0
  }
}

/**
 * Helper to extract single post from API response
 * @param {Object} result - API result from getPostById
 * @returns {Object|null} Post object or null
 */
export const extractPost = (result) => {
  if (!result.success) return null
  const post = result.data?.data || result.data || null
  return normalizePostMedia(post)
}

/**
 * React to a post (Instagram-style heart)
 * @param {number|string} postId - Post ID
 * @param {string} [reactionType='heart'] - Reaction type
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const reactToPost = async (postId, reactionType = 'heart') => {
  try {
    const response = await api.post(`${POSTS_ENDPOINT}${postId}/react/`, {
      type: reactionType
    })
    
    // Invalidate caches
    invalidatePostCaches()
    
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error reacting to post:', error)
    return { success: false, error: getErrorMessage(error, 'Failed to react') }
  }
}

/**
 * Remove reaction from a post
 * The backend may use POST /react/ as a toggle, so we try that first.
 * Falls back to DELETE /remove_react/ if needed.
 * @param {number|string} postId - Post ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const removeReaction = async (postId) => {
  try {
    const response = await api.delete(`${POSTS_ENDPOINT}${postId}/remove_react/`)
    
    // Invalidate caches
    invalidatePostCaches()
    
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error removing reaction:', error)
    return { success: false, error: getErrorMessage(error, 'Failed to remove reaction') }
  }
}

/**
 * Toggle comments on/off for a post (admin only)
 * @param {number|string} postId - Post ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const togglePostComments = async (postId) => {
  try {
    const response = await api.patch(`${POSTS_ENDPOINT}${postId}/toggle_comments/`)
    
    // Invalidate caches
    invalidatePostCaches()
    
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error toggling comments:', error)
    return { success: false, error: getErrorMessage(error, 'Failed to toggle comments') }
  }
}
