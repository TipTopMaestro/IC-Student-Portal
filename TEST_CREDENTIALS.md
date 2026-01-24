# Test Credentials

## Current Mode: REAL BACKEND API ✅

The application is now connected to the **real backend API** at:
- **API URL:** `https://dnsc-systems-api.onrender.com`
- **Status:** Active (as of January 24, 2026)

---

## Backend API Credentials (ACTIVE)

### Student Account
- **Username:** `aparece.alex`
- **Password:** `123456`
- **Role:** Student
- **Provided by:** Backend API Team
- **Last Updated:** January 24, 2026

### Admin Account
- **Status:** ⏳ Pending credentials from backend team
- **Request:** Contact backend team for admin test credentials

---

## API Endpoints (Real Backend)

The application now uses these real endpoints:

### Authentication
- Login: `POST /api/auth/login/`
- Current User: `GET /api/auth/user/`
- Token Refresh: `POST /api/auth/token/refresh/`
- Logout: `POST /api/auth/logout/`

### Students
- List Students: `GET /api/v1/students/`
- Student Detail: `GET /api/v1/students/{id}/`

### Events
- List Events: `GET /api/v1/attendance-events/`
- Event Detail: `GET /api/v1/attendance-events/{id}/`

### Attendance
- Attendance Records: `GET /api/v1/attendance-records/`
- Upload Attendance: `POST /api/v1/attendance-records/upload/`

---

## Switching Back to Mock API (if needed)

If you need to use mock data for development:

1. Update `.env` file:
   ```
   VITE_USE_MOCK_API=true
   ```

2. Restart the development server:
   ```bash
   npm run dev
   ```

3. Mock credentials will be available:
   - **Student:** aparece.alex / 123456
   - **Admin:** admin@test.com / Admin123!

---

## Testing the Real API

1. **Login Test:**
   - Navigate to `/login`
   - Use credentials: `aparece.alex` / `123456`
   - Should redirect to student dashboard

2. **Check Browser Console:**
   - Look for API request/response logs
   - Verify token storage in localStorage
   - Check for any errors

3. **Network Tab:**
   - Open DevTools → Network
   - Monitor API calls to `dnsc-systems-api.onrender.com`
   - Verify correct headers and responses

---

## Troubleshooting

### Issue: Login fails with 401 Unauthorized
- **Solution:** Verify credentials with backend team
- Check if backend API is running

### Issue: CORS errors
- **Solution:** Backend needs to whitelist the frontend domain
- Contact backend team to add CORS headers

### Issue: Token refresh fails
- **Solution:** Check if refresh token endpoint is correct
- Verify token format in backend

### Issue: User data not loading
- **Solution:** Check `/api/auth/user/` endpoint response format
- Ensure response matches expected structure

---

## Notes

- ✅ Real API is now active
- ✅ Credentials verified: `aparece.alex` / `123456`
- ⏳ Admin credentials pending
- 📝 All API requests are logged in console for debugging
- 🔒 Tokens stored securely in localStorage
- 🔄 Auto token refresh implemented

---

## Contact

For API issues or additional credentials:
- **Backend Team:** [Contact Information]
- **API Documentation:** See `API_QUICK_REF.md`

