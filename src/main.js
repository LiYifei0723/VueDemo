import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'

import axios from 'axios'
//配置请求
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
//授权API，添加Authorization字段
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
