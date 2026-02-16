# ⚠️ API Server Connection Issue

## Problem
The backend API at `https://dnsc-systems-api.onrender.com` is currently **not responding**.

### Error Details
- Connection timeout after 20+ seconds
- Error: `ERR_CONNECTION_TIMED_OUT`
- Possible causes:
  1. Render.com free tier service is deeply asleep
  2. Service may be down
  3. Deployment issues
  4. Service needs to be restarted

---

## Immediate Solutions

### Option 1: Wait for API to Wake Up (Recommended)
The Render.com free tier services can take **50-120 seconds** to wake up after long inactivity.

**Steps:**
1. Increased timeout to 120 seconds in `src/config/api.js`
2. Added helpful message on login page
3. Try logging in and **wait 2 full minutes**
4. The first request will be slow, subsequent requests will be fast

### Option 2: Use Mock Data (Testing Only)
If the API is down, enable mock mode to test the UI:

**In `.env` file:**
```env
VITE_USE_MOCK_API=true
```

**Then restart dev server:**
```bash
npm run dev
```

**Note:** This uses fake data - no real API calls.

### Option 3: Contact Backend Team
The backend team may need to:
- Check Render.com dashboard
- Restart the service
- Verify deployment status
- Check for any errors

---

## Changes Made

### 1. Increased Timeout
**File:** `src/config/api.js`
```javascript
TIMEOUT: 120000, // 120 seconds (was 30 seconds)
```

### 2. Better Error Messages
**File:** `src/stores/auth.js`
- Added specific message for slow wake-up times
- Explains the 30-60 second delay

### 3. User Information Banner
**File:** `src/views/auth/LoginView.vue`
- Added blue info banner on login page
- Warns users about potential 30-60 second delay
- Sets proper expectations

---

## Testing the Fix

### 1. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 2. Try Login Again
1. Go to http://localhost:5174/login
2. Enter: `aparece.alex` / `123456`
3. Click "Sign in"
4. **WAIT 2 FULL MINUTES** - Do not refresh!
5. Watch the browser console for messages

### 3. What to Expect
- First request: 50-120 seconds
- Loading spinner will show
- If successful: Redirects to dashboard
- If timeout: Error message with retry option

---

## Alternative: Local Backend

If you have access to the backend code:

1. **Run backend locally:**
```bash
cd path/to/backend
python manage.py runserver
```

2. **Update `.env`:**
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

3. **Restart frontend:**
```bash
npm run dev
```

---

## Current Status

✅ **Frontend is ready** - All API integration complete
❌ **Backend is unreachable** - Connection timeout
⏳ **Waiting for API to respond** - May need 2+ minutes

---

## Next Steps

1. **Try the login again with the new timeout (2 minutes)**
2. If still fails, **enable mock mode** to test UI
3. **Contact backend team** to check Render.com status
4. Consider **running backend locally** for development

---

**Note:** This is a common issue with Render.com's free tier. The service works fine once it's awake, but the initial cold start can be very slow.

---

*Last updated: February 15, 2026*
