import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import './plugins/element.js'
// ����ȫ��css
import 'assets/css/global.css'

// ���븻�ı��༭��
import VueQuillEditor from 'vue-quill-editor'
// ���븻�ı��༭����ʽ
 import 'quill/dist/quill.core.css'
 import 'quill/dist/quill.snow.css'
 import 'quill/dist/quill.bubble.css'

// ����ȫ������
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})

Vue.prototype.$http= axios;

Vue.config.productionTip = false

// ȫ��ʱ�������
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

// ȫ��ע�ḻ�ı��༭��
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
