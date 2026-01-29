import api from './api'
import { API_CONFIG } from '../config/api'

/**
 * Fetches fee details. Can be used to fetch the initial list for a student
 * or to fetch a paginated URL.
 * @param {object} params - The parameters object.
 * @param {string|number} [params.userId] - The ID of the user for the initial fetch.
 * @param {string} [params.url] - The full URL for a paginated request.
 * @returns {Promise<Object>} A promise that resolves to the fee data.
 */
export const getStudentFees = ({ userId, url } = {}) => {
  if (url) {
    // The base URL is already part of the api instance, but axios handles full URLs correctly.
    // However, to be safe and avoid potential issues with the interceptor's logging,
    // let's strip the base part if it exists.
    const baseUrl = API_CONFIG.BASE_URL;
    const endpoint = url.startsWith(baseUrl) ? url.substring(baseUrl.length) : url;
    return api.get(endpoint);
  }
  if (userId) {
    return api.get(API_CONFIG.ENDPOINTS.STUDENT_FEES(userId));
  }
  return Promise.reject(new Error('Either userId or url must be provided to fetch student fees.'));
}
