# Mock API Testing Guide

## Overview
We've implemented a **safe mock API system** that allows testing the authentication UI without a backend connection.

## How It Works

### Architecture
- **`authService.js`** - Original real API service (unchanged)
- **`authService.mock.js`** - Mock service with test data
- **`authService.wrapper.js`** - Smart wrapper that switches between real/mock

### Switching Between Modes

**To use MOCK API (for testing):**
```env
VITE_USE_MOCK_API=true
```

**To use REAL API (when backend is ready):**
```env
VITE_USE_MOCK_API=false
```
Or simply remove the line from `.env`

## Test Users

### Student Account
- **Username:** `student@test.com`
- **Password:** `Test123!`
- **Role:** Student
- **ID:** STU-2024-001

### Admin Account
- **Username:** `admin@test.com`
- **Password:** `Admin123!`
- **Role:** Admin (with staff privileges)
- **ID:** EMP-2024-001

## Testing Scenarios

### ✅ Successful Login
Use the credentials above to test successful authentication flow.

### ❌ Failed Login
Use any other username/password combination to test error handling.

### 🔄 Token Refresh
Mock tokens work with the refresh mechanism.

### 👤 User Profile
After login, you can fetch user data normally.

## Features
- ✅ Realistic API delays (800ms for login, 300ms for other requests)
- ✅ Proper error responses (401, 404, etc.)
- ✅ Token generation and validation
- ✅ Google login simulation
- ✅ Console logs showing which mode is active

## Reverting to Real API

When your backend team responds:

1. Open `.env` file
2. Change `VITE_USE_MOCK_API=true` to `VITE_USE_MOCK_API=false`
3. Restart the dev server
4. Done! No code changes needed.

## Safety

- ✅ Zero changes to original `authService.js`
- ✅ Mock code only runs when explicitly enabled
- ✅ Easy one-line toggle in `.env`
- ✅ Mock files can remain in project for future testing

## Console Output

When running in dev mode, you'll see:
```
🔧 Auth Service Mode: 🎭 MOCK
📝 Available test users: [...]
```

This confirms mock mode is active.
