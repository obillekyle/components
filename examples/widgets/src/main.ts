import { createApp } from 'vue'
import App from './app.vue'

declare global {
  export interface Window {
    livelyInfo: Record<string, any>
  }
}

createApp(App).mount('#app')
