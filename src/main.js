import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import './plugins/element.js'
// ����ȫ��css
import 'assets/css/global.css'

// ����ȫ������
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1'

Vue.prototype.$http= axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
