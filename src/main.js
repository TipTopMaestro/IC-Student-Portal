import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// import vue3GoogleLogin from 'vue3-google-login'
import GoogleSignInPlugin from 'vue3-google-signin';

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Handle session expiry: redirect to login when auth tokens become invalid
window.addEventListener('auth:session-expired', () => {
  if (router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }
})

const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
app.use(GoogleSignInPlugin,
    { 
        clientId : clientID,
    })
app.mount('#app')
