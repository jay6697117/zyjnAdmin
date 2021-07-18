import axios from 'axios'
import config from './config'
import router from '@/router'
import global from '@/utils/global'
// import qs from 'qs'
import {
  message
} from 'ant-design-vue'

// 使用vuex做全局loading时使用
import store from '@/store'
const defaultApis = ['/oauth/token', '/user/forget-password', '/sms/forget-password', '/user/forget-password-modify', '/sms/send-code', '/captcha/get']
let limit = false
function authentication (api) {
  return store.state.apis.indexOf(api !== -1)
}
function authDefault (api) {
  if (defaultApis.indexOf(api) !== -1) {
    return true
  }
}
const urlArr = []
export default function $axios (options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      method: config.method,
      headers: config.headers,
      timeout: config.timeout
    })

    // request 拦截器
    instance.interceptors.request.use(
      config => {
        var data = config.data // 请求参数
        if (data) {
          for (let key in data) {
            if (typeof data[key] === 'string' && !data[key]) {
              delete data[key]
            }
          }
        }
        if (data && data.content) {
          config.data.content = data.content.replace(/<font/g, '<span').replace(/<\/font>/g, '</span>')
        }
        if (data && data.introduction) {
          config.data.introduction = data.introduction.replace(/<font/g, '<span').replace(/<\/font>/g, '</span>')
        }
        if (data && data.analysis) {
          config.data.analysis = data.analysis.replace(/<font/g, '<span').replace(/<\/font>/g, '</span>')
        }
        if (urlArr.indexOf(config.url + JSON.stringify(config.data)) !== -1) {
          return Promise.reject(new Error('请勿多次点击'))
        }
        if (!authentication(config.url)) {
          return Promise.reject(new Error('您无权访问，请联系管理员'))
        } else if (authDefault(config.url)) {
          return config
        } else {
          if (config.stopRepeat) {
            urlArr.push(config.url + JSON.stringify(config.data))
          }
          if (global.NODE_ENV !== 'production') {
            let token = store.state.token
            if (token) {
              config.headers.Authorization = token
              config.headers.IsTest = 1
            } else {
              // 重定向到登录页面
              router.push('/login')
            }
          }
          return config
        }
      },

      error => {
        // 请求错误时
        console.log('request:', error)
        // 1. 判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          console.log('timeout请求超时')
          // return service.request(originalRequest);// 再重复请求一次
        }
        // 2. 需要重定向到错误页面
        const errorInfo = error.response
        console.log(errorInfo)
        if (errorInfo) {
          error = errorInfo.data // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          const errorStatus = errorInfo.status // 404 403 500 ...
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        let data
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if (response.data === undefined) {
          data = JSON.parse(response.request.responseText)
        } else {
          data = response.data
        }
        if (data.code) {
          if (data.code === 401 || data.code === 444 || data.code === 402 || data.code === 405) {
            if (limit || response.request.responseURL.indexOf('oss') > 0) {
              return
            } else {
              limit = true
              message.error(data.msg)
              window.limitTimer = setTimeout(() => {
                limit = false
                clearTimeout(window.limitTimer)
                let webDomain = store.state.user.webDomain
                store.commit('initSotre')
                if (global.NODE_ENV !== 'production') {
                  router.push('/login')
                } else {
                  window.location.href = webDomain
                }
              }, 3000)
            }
          } else {
            message.error(data.msg)
          }
          setTimeout(() => {
            urlArr.pop(response.config.url + JSON.stringify(response.config.data))
          }, 1000)
          return data
        } else {
          if (response.config.url.indexOf('/logout') !== -1) {
            let webDomain = store.state.user.webDomain
            store.commit('initSotre')
            if (global.NODE_ENV !== 'production') {
              router.push('/login')
            } else {
              window.location.href = webDomain
            }
          }
          data.data = data.data || []
          setTimeout(() => {
            urlArr.pop(response.config.url + JSON.stringify(response.config.data))
          }, 1000)
          return data
        }
      },
      err => {
        if (err.message === 'Network Error') {
          err.message = '网络已断开，请检查网络'
        }
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = '请求错误,请稍后重试'
              break
            case 401:
              err.message = '未授权，请登录'
              break
            case 403:
              err.message = '拒绝访问'
              break
            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`
              break
            case 408:
              err.message = '请求超时,请稍后重试'
              break
            case 500:
              err.message = '服务器繁忙,请稍后重试'
              break
            case 501:
              err.message = '服务未实现'
              break
            case 502:
              err.message = '网关错误,请稍后重试'
              break
            case 503:
              err.message = '服务不可用请检查网络'
              break
            case 504:
              err.message = '网关超时,请稍后重试'
              break
            case 505:
              err.message = 'HTTP版本不受支持'
              break
            default:
          }
        }
        if (err.message !== '请勿多次点击') {
          message.error(err.message, 3)
        }
        return Promise.reject(err) // 返回接口返回的错误信息
      }
    )

    // 请求处理
    instance(options).then(res => {
      resolve(res)
      return false
    }).catch(error => {
      reject(error)
    })
  })
}
