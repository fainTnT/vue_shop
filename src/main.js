import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import './plugins/element.js'
// 引入全局css
import 'assets/css/global.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
 import 'quill/dist/quill.core.css'
 import 'quill/dist/quill.snow.css'
 import 'quill/dist/quill.bubble.css'

// 设置全局配置
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})

Vue.prototype.$http= axios;

Vue.config.productionTip = false

// 全局时间过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
