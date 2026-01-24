// Safe wrapper that switches between real and mock auth service
// Based on environment variable

import { authService as realAuthService } from './authService'
import { authServiceMock, MOCK_TEST_USERS } from './authService.mock'

// Check if mock mode is enabled
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true'

// Export the appropriate service based on environment
export const authService = USE_MOCK ? authServiceMock : realAuthService

// Export mock test users for easy reference
export { MOCK_TEST_USERS }

// Log which mode we're using (only in development)
if (import.meta.env.DEV) {
  console.log(`🔧 Auth Service Mode: ${USE_MOCK ? '🎭 MOCK' : '🌐 REAL API'}`)
  if (USE_MOCK) {
    console.log('📝 Available test users:', MOCK_TEST_USERS)
  }
}
