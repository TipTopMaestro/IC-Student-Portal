# 🚀 Quick API Switch Guide

## Current Setup: Production API ✅

```env
VITE_API_BASE_URL=https://dnsc-systems-api.onrender.com/
```

Your app is now connected to the **deployed API**!

---

## 🔄 To Start Development

```bash
npm run dev
```

That's it! No need to run Django locally.

---

## 🌐 API Resources

**Swagger Documentation:**
https://dnsc-systems-api.onrender.com/api/docs/swagger/

**ReDoc:**
https://dnsc-systems-api.onrender.com/api/docs/redoc/

**Base API URL:**
https://dnsc-systems-api.onrender.com/

---

## 🧪 Test API Connection

```javascript
// Run in browser console
fetch('https://dnsc-systems-api.onrender.com/api/v1/')
  .then(r => r.json())
  .then(d => console.log('✅ Connected:', d))
```

---

## 🔧 If You Need Local API

Edit `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/
```

Then restart: `npm run dev`

---

## ⚠️ Important

- Backend must allow CORS from `http://localhost:5173`
- Get test credentials from backend team
- Shared database - be careful with changes!

---

## ✅ What's Already Done

- ✅ `.env` updated to production API
- ✅ All code works with production API
- ✅ No other changes needed
- ✅ Just restart dev server!

---

**Ready?** Run `npm run dev` and test login! 🎉
