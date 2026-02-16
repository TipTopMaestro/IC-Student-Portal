import api from './api'

/**
 * Fee Service - Handles all fee/payment-related API calls
 * 
 * NOTE: These endpoints are NOT YET IMPLEMENTED in the backend.
 * This service is ready for when the backend team creates the endpoints.
 * 
 * Expected backend endpoints:
 * - GET /api/v1/fees/ - List all fees for current student
 * - GET /api/v1/fees/{id}/ - Get specific fee details
 * - POST /api/v1/fees/{id}/payment/ - Submit payment proof
 * - GET /api/v1/fees/summary/ - Get fees summary (total, paid, pending)
 */

/**
 * Get all fees for current student
 * @returns {Promise} List of fees
 */
export const getStudentFees = async () => {
  try {
    console.log('💰 Fetching fees from API...')
    const response = await api.get('api/v1/fees/')
    console.log('💰 Raw API response:', response.data)
    
    // Backend wraps response in { status_code, message, data: { data: [...] } }
    const feesData = response.data.data?.data || response.data.data || response.data || []
    console.log('💰 Extracted fees data:', feesData)
    
    return {
      success: true,
      data: feesData
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
 * @returns {Promise} Fees summary
 */
export const getFeesSummary = async () => {
  try {
    // Backend doesn't have a dedicated summary endpoint, 
    // so we calculate from the fees list
    const feesResult = await getStudentFees()
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
 * Submit payment proof for a fee
 * @param {number} feeId - Fee ID
 * @param {FormData} formData - Form data with receipt image and notes
 * @returns {Promise} Submission result
 */
export const submitPayment = async (feeId, formData) => {
  try {
    const response = await api.post(`api/v1/fees/${feeId}/payment/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error submitting payment:', error)
    
    if (error.response?.status === 404) {
      return {
        success: false,
        error: 'Payment submission endpoint not yet implemented',
        useMockData: true
      }
    }
    
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to submit payment'
    }
  }
}

/**
 * Get payment receipt details
 * @param {number} feeId - Fee ID
 * @returns {Promise} Receipt data
 */
export const getPaymentReceipt = async (feeId) => {
  try {
    const response = await api.get(`api/v1/fees/${feeId}/receipt/`)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching receipt:', error)
    
    if (error.response?.status === 404) {
      return {
        success: false,
        error: 'Receipt endpoint not yet implemented',
        useMockData: true
      }
    }
    
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load receipt'
    }
  }
}

export default {
  getStudentFees,
  getFeesSummary,
  submitPayment,
  getPaymentReceipt
}
