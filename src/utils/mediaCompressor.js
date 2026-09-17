/**
 * Client-Side Media Compressor & Optimizer
 * Compresses images before uploading to ensure large batches (up to 80 photos)
 * do not exceed server, Nginx, or proxy upload payload limits.
 */

/**
 * Compresses a single image file using HTML5 Canvas
 * @param {File} file - Original file
 * @param {Object} options - Compression options
 * @param {number} [options.maxWidth=2048] - Max bounding width (2K QHD standard)
 * @param {number} [options.maxHeight=2048] - Max bounding height (2K QHD standard)
 * @param {number} [options.quality=0.86] - Image quality (0.0 to 1.0)
 * @returns {Promise<File>} Compressed File object
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.86
  } = options

  // Skip videos and animated GIFs/SVG
  if (!file || !file.type || !file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file
  }

  // If image is already smaller than 500KB, return as-is
  if (file.size < 500 * 1024) {
    return file
  }

  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { width, height } = img

      // Check if resizing is necessary
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // If compression didn't save space, keep original
            resolve(file)
            return
          }

          // Create new File with original name and jpg extension
          const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg'
          const compressedFile = new File([blob], cleanName, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })

          resolve(compressedFile)
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      // On error, fallback to original file
      resolve(file)
    }

    img.src = objectUrl
  })
}

/**
 * Batch compresses an array of files concurrently with progress callback
 * @param {File[]} files - Array of File objects
 * @param {Function} [onProgress] - Optional callback (completedCount, totalCount)
 * @returns {Promise<File[]>} Array of compressed File objects
 */
export const batchCompressFiles = async (files, onProgress) => {
  if (!files || files.length === 0) return []

  const total = files.length
  let completed = 0

  const results = await Promise.all(
    files.map(async (file) => {
      const compressed = await compressImage(file)
      completed++
      if (typeof onProgress === 'function') {
        onProgress(completed, total)
      }
      return compressed
    })
  )

  return results
}
