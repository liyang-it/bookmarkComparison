import Vue from 'vue'
import Router from 'vue-router'
const index = () => import('@/pages/index')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', // 默认路由
      redirect: '/index' // 重定向到 '/home'
    },
    {
      path: '/index',
      name: 'Index',
      component: index
    }
  ]
})
