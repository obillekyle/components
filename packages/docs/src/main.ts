import { createApp } from 'vue'
import App from './app.vue'
import router from './router'

const app = createApp(App)

app.use(router as any)
app.config.warnHandler = () => {}
app.mount('#app')
