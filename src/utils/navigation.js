/**
 * Safely opens a new tab, displays a premium loading screen, fetches an SSO token, and redirects.
 * This prevents popup blockers on desktop production environments by opening the window synchronously.
 * It also protects against Reverse Tabnabbing (security vulnerability) by setting opener to null.
 * 
 * @param {Object} sys - The system configuration object (contains url, intendedFor, name)
 * @param {Function} fetchTokenFn - Async function that resolves to the transfer token
 * @returns {Window|null} The opened window context
 */
export const safeRedirectWithSSO = async (sys, fetchTokenFn) => {
  if (!sys || !sys.url) {
    console.error('Invalid redirect target')
    return null
  }

  // Parse sys.url once at the beginning
  let parsedUrl
  try {
    parsedUrl = new URL(sys.url)
  } catch (err) {
    console.error('Security alert: Invalid URL format')
    return null
  }

  // Define policy helper: https:// by default, http:// allowed only for local/dev hosts
  const isPolicyValid = (urlObj) => {
    const isLocal = urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1' || urlObj.hostname.endsWith('.localhost')
    return urlObj.protocol === 'https:' || (urlObj.protocol === 'http:' && isLocal)
  }

  if (!isPolicyValid(parsedUrl)) {
    console.error('Security alert: Insecure HTTP redirect to non-local host is blocked')
    return null
  }

  // 1. Open the blank window immediately in the user gesture context to bypass popup blocker
  const newWindow = window.open('', '_blank')
  
  if (newWindow) {
    // 2. Prevent Reverse Tabnabbing vulnerability by separating window context
    newWindow.opener = null

    // 3. Inject premium loader styling and content into the blank page
    try {
      const sanitizedName = String(sys.name || 'System').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Connecting to ${sanitizedName}...</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: radial-gradient(circle at 50% 50%, #ffffff 0%, #f8fafc 100%);
              color: #1e293b;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              overflow: hidden;
            }
            .container {
              text-align: center;
              z-index: 10;
              animation: fadeIn 0.6s ease-out;
            }
            .logo-container {
              position: relative;
              width: 80px;
              height: 80px;
              margin: 0 auto 24px;
            }
            .spinner {
              position: absolute;
              inset: 0;
              border: 4px solid rgba(100, 13, 95, 0.08);
              border-top: 4px solid #D91656;
              border-right: 4px solid #EE66A6;
              border-bottom: 4px solid #640D5F;
              border-radius: 50%;
              animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            }
            .glow {
              position: absolute;
              inset: -8px;
              background: radial-gradient(circle, rgba(238, 102, 166, 0.15) 0%, transparent 70%);
              filter: blur(6px);
              animation: pulse 1.8s ease-in-out infinite;
            }
            h2 {
              font-size: 20px;
              font-weight: 600;
              margin: 0 0 8px;
              letter-spacing: -0.025em;
              background: linear-gradient(135deg, #640D5F 0%, #D91656 50%, #EE66A6 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            p {
              color: #475569;
              font-size: 14px;
              margin: 0;
              font-weight: 500;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.4; }
              50% { transform: scale(1.1); opacity: 0.7; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo-container">
              <div class="glow"></div>
              <div class="spinner"></div>
            </div>
            <h2>Secure Redirecting</h2>
            <p>Authorizing connection to ${sanitizedName}...</p>
          </div>
        </body>
        </html>
      `)
      newWindow.document.close()
    } catch (e) {
      console.warn('Could not customize the loader page DOM:', e)
    }
  } else {
    console.warn('Popup blocker or window creation failed')
  }

  try {
    // 4. Fetch the SSO transfer token
    const result = await fetchTokenFn()
    const data = result.data || result
    const transferToken = data.transfer_token

    if (transferToken) {
      // Re-verify policy before appending the transfer token
      if (!isPolicyValid(parsedUrl)) {
        throw new Error('Security policy violation: Prohibited token appending to insecure URL')
      }

      // Provide multiple query parameter formats to support all potential target system configurations
      parsedUrl.searchParams.set('token', transferToken)
      parsedUrl.searchParams.set('token_url', transferToken)
      parsedUrl.searchParams.set('transfer_token', transferToken)
      parsedUrl.searchParams.set('sso_token', transferToken)
      parsedUrl.searchParams.set(
        'redeem_url',
        new URL('/api/v1/transfer_token/redeem/', import.meta.env.VITE_API_BASE_URL).toString()
      )

      const finalUrl = parsedUrl.toString()
      if (newWindow && !newWindow.closed) {
        newWindow.location.replace(finalUrl)
      } else if (!newWindow) {
        // Fallback: Try window.open if initial creation failed
        window.open(finalUrl, '_blank', 'noopener,noreferrer')
      }
    } else {
      console.error('Failed to retrieve transfer token: missing transfer_token', result)
      if (newWindow && !newWindow.closed) {
        newWindow.location.replace(sys.url)
      } else if (!newWindow) {
        window.open(sys.url, '_blank', 'noopener,noreferrer')
      }
    }
  } catch (error) {
    console.error('Error during SSO redirect:', error)
    if (newWindow && !newWindow.closed) {
      newWindow.location.replace(sys.url)
    } else if (!newWindow) {
      window.open(sys.url, '_blank', 'noopener,noreferrer')
    }
  }

  return newWindow
}
