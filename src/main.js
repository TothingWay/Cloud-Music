import Vue from 'vue'
import App from './App'
import router from './router'
// vuex
import store from './store'
import 'font-awesome/css/font-awesome.css'
import VueLazyload from 'vue-lazyload'
// 挂载api到vue的原型对象上
import api from './api/index'
Vue.prototype.http = api

Vue.use(VueLazyload, {
  error: require('./assets/images/loading.png'),
  loading: require('./assets/images/loading.png')
})
// 添加Fastclick移除移动端点击延迟
const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.config.productionTip = false

// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
