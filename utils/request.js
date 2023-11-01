const axios = require('axios')
// create an axios instance
const service = axios.create({
  // 超时时间 毫秒 设置 10秒
  timeout: 1000 * 30
})
// 请求拦截器
service.interceptors.request.use(

  config => {
    //  请求前拦截器处理，可以处理 请求头等操作
    config.headers[''] = ''
    return config
  },
  error => {
    // 请求(客户端)异常配置
    console.log('请求异常', error) // for debug
    return Promise.reject(error)
  }
)
// 请求响应拦截配置
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  // 请求响应（服务端）异常
  error => {
    return Promise.reject(error)
  }
)
module.exports = service
