import axios from 'axios'
import { Notification } from 'element-ui'
// create an axios instance
const service = axios.create({
  // 接口地址 如果是 线上 参考 ".env.production" 文件, 如果是生产环境 参考 "vue.config" 代理配置
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: process.env.NODE_ENV === 'development' ? undefined : process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  // 超时时间 毫秒 设置 10分钟
  timeout: 1000 * (60 * 10)
})
// 请求拦截器
service.interceptors.request.use(

  config => {
    //  请求前拦截器处理，可以处理 请求头等操作
    config.headers['Test'] = 'LiYang'

    return config
  },
  error => {
    // 请求(客户端)异常配置
    console.log('请求异常', error) // for debug
    return Promise.reject(error)
  }
)
const duration = 15 * 1000
// 请求响应拦截配置
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  // 请求响应（服务端）异常
  error => {
    Notification.error({
      title: '错误',
      message: '网路连接异常',
      duration: duration
    })
    return Promise.reject(error)
  }
)
export default service
