import api from './api'

/**
 * Fee Service - Handles all fee/payment-related API calls
 * 
 * Backend endpoints:
 * - GET /api/v1/fees/?student_id=<id> - List fees for a student
 * - GET /api/v1/fees/{id}/ - Get specific fee details
 * - GET /api/v1/payment-submissions/?student_id=<id> - List payment submissions
 * - POST /api/v1/payment-submissions/ - Submit payment proof
 */

/**
 * Get all fees for a specific student
 * @param {number} studentId - Student ID to filter by
 * @param {Object} options - { page, perPage }
 * @returns {Promise} List of fees with pagination info
 */
export const getStudentFees = async (studentId, { page = 1, perPage = 10 } = {}) => {
  try {
    console.log('💰 Fetching fees from API for student:', studentId, 'page:', page)
    const params = { page, per_page: perPage }
    if (studentId) {
      params.student_id = studentId
    }
    const response = await api.get('/api/v1/fees/', { params })
    console.log('💰 Raw API response:', response.data)
    
    // Backend wraps response in { status_code, message, data: { current_page, per_page, total_pages, total_items, data: [...] } }
    const responseData = response.data.data || response.data
    const feesData = responseData.data || responseData || []
    console.log('💰 Extracted fees data:', feesData)
    
    return {
      success: true,
      data: feesData,
      pagination: {
        currentPage: responseData.current_page || 1,
        perPage: responseData.per_page || perPage,
        totalPages: responseData.total_pages || 1,
        totalItems: responseData.total_items || feesData.length
      }
    }
  } catch (error) {
    console.error('❌ Error fetching fees:', error)
    console.error('❌ Error response:', error.response?.data)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load fees'
    }
  }
}

/**
 * Get fees summary (total, paid, pending)
 * @param {number} studentId - Student ID
 * @returns {Promise} Fees summary
 */
export const getFeesSummary = async (studentId) => {
  try {
    const feesResult = await getStudentFees(studentId)
    if (!feesResult.success) {
      return feesResult
    }
    
    const fees = feesResult.data
    const summary = {
      total: 0,
      paid: 0,
      outstanding: 0,
      pending: 0
    }
    
    fees.forEach(fee => {
      const amount = parseFloat(fee.total_amount) || 0
      const balance = parseFloat(fee.balance) || 0
      
      summary.total += amount
      
      if (fee.status === 'paid') {
        summary.paid += amount
      } else if (fee.status === 'pending') {
        summary.pending += balance
      } else {
        summary.outstanding += balance
      }
    })
    
    return {
      success: true,
      data: summary
    }
  } catch (error) {
    console.error('Error calculating fees summary:', error)
    return {
      success: false,
      error: 'Failed to calculate fees summary'
    }
  }
}

/**
 * Get payment submissions for a student
 * @param {number} studentId - Student ID
 * @returns {Promise} List of payment submissions
 */
export const getPaymentSubmissions = async (studentId) => {
  try {
    const params = {}
    if (studentId) {
      params.student_id = studentId
      params.per_page = 100
    }
    const response = await api.get('/api/v1/payment-submissions/', { params })
    const data = response.data.data?.data || response.data.data || response.data || []
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Error fetching payment submissions:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load payment submissions'
    }
  }
}

/**
 * Submit payment proof for fees
 * Backend expects form-data: total_amount_paid, reference_number, images (File),
 * remarks, items[0]fee, items[0]amount_paid, items[1]fee, items[1]amount_paid, etc.
 * @param {Object} submissionData - { screenshot (File), referenceNumber, totalAmountPaid, remarks, feeItems: [{fee, amount_paid}] }
 * @returns {Promise} Submission result
 */
export const submitPayment = async (submissionData) => {
  try {
    const formData = new FormData()
    formData.append('total_amount_paid', submissionData.totalAmountPaid)
    formData.append('reference_number', submissionData.referenceNumber)
    formData.append('images', submissionData.screenshot)
    formData.append('remarks', submissionData.remarks || '')

    // Fee items use bracket notation: items[0]fee, items[0]amount_paid
    submissionData.feeItems.forEach((item, i) => {
      formData.append(`items[${i}]fee`, item.fee)
      formData.append(`items[${i}]amount_paid`, item.amount_paid)
    })

    const response = await api.post('/api/v1/payment-submissions/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error submitting payment:', error)
    return {
      success: false,
      error: error.response?.status === 403 
        ? 'Permission denied. The backend does not yet allow students to submit payments. Please contact the Collections Management team.'
        : (error.response?.data?.message || error.response?.data?.detail || 'Failed to submit payment.')
    }
  }
}

/**
 * Get payment receipt details
 * @param {number} submissionId - Payment submission ID
 * @returns {Promise} Receipt data
 */
export const getPaymentReceipt = async (submissionId) => {
  try {
    const response = await api.get(`/api/v1/payment-submissions/${submissionId}/`)
    const data = response.data.data || response.data
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Error fetching receipt:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load receipt'
    }
  }
}

export default {
  getStudentFees,
  getFeesSummary,
  getPaymentSubmissions,
  submitPayment,
  getPaymentReceipt
}
