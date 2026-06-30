import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Handle session expiry: redirect to login when auth tokens become invalid
window.addEventListener('auth:session-expired', () => {
  if (router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }
})

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
if (!googleClientId) {
  console.warn('⚠️ VITE_GOOGLE_CLIENT_ID is missing from environment variables. Google Sign-In will not function properly.')
}

app.use(vue3GoogleLogin, { 
  clientId: googleClientId || 'dummy-client-id'
})
app.mount('#app')
