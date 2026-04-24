import api from './api'

/**
 * File Service - Handles all file and image upload API calls
 */

/**
 * Upload an image to the backend (Cloudinary)
 * @param {File} file - The image file to upload
 * @param {String} folder - Optional folder name to store the image
 * @returns {Promise<Object>} The uploaded image data containing the secure URL
 */
export const uploadImage = async (file, folder = 'profiles') => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    if (folder) {
      formData.append('folder', folder)
    }

    // Must use multipart/form-data, though Axios auto-sets it when passing FormData
    const response = await api.post('/api/v1/cloudinary/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const data = response.data.data || response.data
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Failed to upload image'
    }
  }
}

export default {
  uploadImage
}
