// Safe wrapper that switches between real and mock student service
// Based on environment variable

import { getStudentFees as realGetStudentFees } from './studentService'
import { studentServiceMock } from './studentService.mock'

// Check if mock mode is enabled from environment variables
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true'

// Export the appropriate service function based on the mode
export const getStudentFees = USE_MOCK ? studentServiceMock.getStudentFees : realGetStudentFees

// Log the current mode for easier debugging during development
if (import.meta.env.DEV) {
  console.log(`🔧 Student Service Mode: ${USE_MOCK ? '🎭 MOCK' : '🌐 REAL API'}`)
}
