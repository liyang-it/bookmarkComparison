// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// IndexDB封装类库 https://localforage.github.io/localForage/#installation
import localforage from 'localforage'

// 将 localforage 挂载到全局示例, 这样就可以在任何地方 用 this.$localforage 操作
Vue.prototype.$localforage = localforage

// 创建一个 默认的 IndexDB数据库挂载到全局
const localDataBase = localforage.createInstance({
  name: 'localDataBase'
})

Vue.prototype.$localDataBase = localDataBase
console.info('默认数据库 localDataBase  初始化成功，使用 this.$localDataBase 调用')

Vue.use(localforage)
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
