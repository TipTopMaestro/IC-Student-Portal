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

    // Step 1: Upload image to Cloudinary via backend
    // POST /api/v1/cloudinary/ returns { status_code, message, data: "<public_id>", errors }
    // The "data" field is a plain string (the Cloudinary public_id), NOT an object
    const uploadResponse = await api.post('/api/v1/cloudinary/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('📸 Cloudinary POST response:', JSON.stringify(uploadResponse.data, null, 2))

    // Extract the public_id from the response
    const publicId = uploadResponse.data.data || uploadResponse.data.public_id || uploadResponse.data
    if (!publicId || typeof publicId !== 'string') {
      console.error('Cloudinary upload did not return a valid public_id:', uploadResponse.data)
      throw new Error('Upload succeeded but no public_id was returned')
    }

    console.log('📸 Cloudinary public_id:', publicId)

    // Step 2: Retrieve the actual image URL using the public_id
    // GET /api/v1/cloudinary/?public_id=<id> returns { image_url: "https://..." }
    const retrieveResponse = await api.get('/api/v1/cloudinary/', {
      params: { public_id: publicId }
    })

    console.log('📸 Cloudinary GET response:', JSON.stringify(retrieveResponse.data, null, 2))

    const retrieveData = retrieveResponse.data.data || retrieveResponse.data
    const imageUrl = typeof retrieveData === 'string'
      ? retrieveData
      : retrieveData.image_url || retrieveData.secure_url || retrieveData.url || null

    if (!imageUrl) {
      console.error('Cloudinary retrieve did not return an image URL:', retrieveResponse.data)
      throw new Error('Could not retrieve image URL from Cloudinary')
    }

    console.log('✅ Cloudinary image URL resolved:', imageUrl)

    return {
      success: true,
      data: {
        public_id: publicId,
        image_url: imageUrl,
        secure_url: imageUrl
      }
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to upload image'
    }
  }
}

export default {
  uploadImage
}
