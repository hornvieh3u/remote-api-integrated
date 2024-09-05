import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'
import Vue3Toasity from 'vue3-toastify'
import BootstrapVueNext from "bootstrap-vue-next"

import 'vue3-toastify/dist/index.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import './style.css'

const app = createApp(App)
const pinia = createPinia();

let gauthClientId = "27765672117-fv60ot4b11egmemmfc521d24p2irl4j6.apps.googleusercontent.com";

app.use(BootstrapVueNext)
app.use(Vue3Toasity, { autoClose: 3000 })
app.use(vue3GoogleLogin, { clientId: gauthClientId, scope: 'profile email', fetch_basic_profile: false })
app.use(pinia)
app.use(router)
app.mount('#app')