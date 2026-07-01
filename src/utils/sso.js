import { authService } from '@/services/authService'

// Fallback configuration for client-side token retrieval (used ONLY if backend API returns 404)
const FALLBACK_SYSTEMS = {
  cms: {
    url: import.meta.env.VITE_CMS_URL || 'https://collection-management-system-one.vercel.app/auth/login',
    intendedFor: 'collection-management-system'
  },
  voting: {
    url: import.meta.env.VITE_VOTING_URL || 'https://ic-lsg-voting-management-system.onrender.com/login',
    intendedFor: 'voting-system'
  },
  locker: {
    url: import.meta.env.VITE_LOCKER_URL || 'https://dnsclocker.vercel.app',
    intendedFor: 'locker-system'
  }
}

/**
 * Performs secure SSO verification and redirects the target new window/tab.
 * If redirection fails, the window is closed and a user alert is shown, or options.onError is invoked.
 *
 * @param {string} sysId - System ID (cms, voting, or locker)
 * @param {Window|null} newTab - Pre-opened window reference to avoid pop-up blocking (optional)
 * @param {Object} options - Optional callbacks (e.g., onError)
 */
export const performSSORedirect = async (sysId, newTab, options = {}) => {
  // 1. Client-Side Input Validation
  const validSystems = ['cms', 'voting', 'locker']
  if (!validSystems.includes(sysId)) {
    const title = 'Invalid System Target'
    const msg = `The requested target system "${sysId}" is not registered on our security allowlist.`
    if (options.onError) {
      options.onError(title, msg)
    } else {
      if (newTab) newTab.close()
      alert(`${title}:\n\n${msg}`)
    }
    return
  }

  // Derive the API base dynamically from environment config
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://dnsc-systems-api.onrender.com'
  const cleanApiBase = apiBase.replace(/\/$/, '')
  const redeemUrl = `${cleanApiBase}/api/v1/transfer_token/redeem/`

  try {
    // 2. Fetch redirect details and token from the backend
    console.log(`🔐 Initiating background SSO verification for: ${sysId}`)
    const result = await authService.getSSORedirectDetails(sysId)
    
    // Validate response payload integrity
    if (!result || !result.target_url || !result.transfer_token) {
      throw new Error('Malformed backend redirect payload received.')
    }
    
    // 1. Construct the base destination URL
    const destinationUrl = new URL(result.target_url)

    // 2. Safely get the expected allowlisted URL
    const expectedUrl = FALLBACK_SYSTEMS[sysId]?.url

    // 3. Verify origin (Defense-in-depth Open Redirect protection)
    if (!expectedUrl || new URL(expectedUrl).origin !== destinationUrl.origin) {
      throw new Error('Unsafe SSO redirect target received or system not allowlisted.')
    }

    // 4. Secure Token Transmission
    destinationUrl.searchParams.set('sso_token', result.transfer_token)
    destinationUrl.searchParams.set('redeem_url', redeemUrl)
    
    // Redirect instantly
    if (newTab) {
      try {
        newTab.opener = null
      } catch (e) {
        console.warn('Unable to set opener to null:', e)
      }
      newTab.location.href = destinationUrl.toString()
    } else {
      window.location.href = destinationUrl.toString()
    }
    
  } catch (error) {
    console.error('SSO Redirection Error:', error)
    
    // 3. Smart Backward-Compatible Fallback
    const is404 = error.response?.status === 404 || error.message?.includes('404')
    if (is404 && FALLBACK_SYSTEMS[sysId]) {
      console.warn('⚠️ Backend SSO redirect endpoint returned 404. Initiating local fallback...')
      
      try {
        const config = FALLBACK_SYSTEMS[sysId]
        // Fetch short-lived token from existing endpoint
        const tokenRes = await authService.issueTransferToken(config.intendedFor)
        const transferToken = tokenRes.transfer_token || tokenRes.data?.transfer_token
        
        if (!transferToken) {
          throw new Error('Failed to retrieve fallback transfer token.')
        }
        
        const destinationUrl = new URL(config.url)
        destinationUrl.searchParams.set('token', transferToken)
        destinationUrl.searchParams.set('token_url', transferToken)
        destinationUrl.searchParams.set('transfer_token', transferToken)
        destinationUrl.searchParams.set('sso_token', transferToken)
        destinationUrl.searchParams.set('redeem_url', redeemUrl)
        
        // Redirect instantly
        if (newTab) {
          try {
            newTab.opener = null
          } catch (e) {
            console.warn('Unable to set opener to null:', e)
          }
          newTab.location.href = destinationUrl.toString()
        } else {
          window.location.href = destinationUrl.toString()
        }
        return
      } catch (fallbackError) {
        console.error('Fallback SSO failed:', fallbackError)
      }
    }
    
    // Parse error messages for display
    const status = error.response?.status
    let title = 'Verification Error'
    let msg = ''
    if (status === 401 || status === 403) {
      title = 'Authentication Expired'
      msg = 'Your active session has expired or is invalid. Please sign back into the Student Portal and try again.'
    } else if (status === 503 || status === 504 || error.message?.includes('Network Error')) {
      title = 'Service Connection Timeout'
      msg = 'We could not reach the security verification servers. Please check your network connection and try again.'
    } else {
      msg = `SSO redirect failed: ${error.response?.data?.detail || error.message || 'Unknown backend error.'}`
    }

    if (options.onError) {
      options.onError(title, msg)
    } else {
      if (newTab) newTab.close()
      alert(`${title}:\n\n${msg}`)
    }
  }
}
