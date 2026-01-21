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
let clientID = '189816827593-igu6ajdje3revunfdaphl0n8huv5fnti.apps.googleusercontent.com';
app.use(GoogleSignInPlugin,
    { 
        clientId : clientID,
    })
app.mount('#app')
