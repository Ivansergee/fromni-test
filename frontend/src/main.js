import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'bootstrap-icons/font/bootstrap-icons.css'

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL

createApp(App).use(store).use(router).mount('#app')
