import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import { inject } from '@vercel/analytics'
import App from './App.vue'
import router from './router'
import './style.css'

// Vercel Analytics
inject()

// Register PWA Service Worker
registerSW({
  onNeedRefresh() {
    console.log('New content available, please refresh.')
  },
  onOfflineReady() {
    console.log('App ready to work offline.')
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
