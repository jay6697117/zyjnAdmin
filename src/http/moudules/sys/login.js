import axios from '../../axios'

/*
 * 系统登录模块
 */

// 登录
// export const login = data => {
//   return axios({
//     url: '/login/login',
//     data
//   })
// }

// 登出
export const tokenLogout = () => {
  return axios({
    stopRepeat: true,
    url: '/user/logout'
  })
}

// 登出
export const cookieLogout = () => {
  return axios({
    url: '/logout'
  })
}

// 获取图片验证码
export const getCaptcha = () => {
  return axios({
    stopRepeat: true,
    url: '/captcha/get'
  })
}

// 获取短信验证码
export const getMessage = (data) => {
  return axios({
    stopRepeat: true,
    url: '/sms/send-sms-code',
    data
  })
}

// 完成忘记密码
export const forget = (data) => {
  return axios({
    stopRepeat: true,
    url: '/user/forget-password-modify',
    data
  })
}

// 更换手机号
export const mobile = (data) => {
  return axios({
    stopRepeat: true,
    url: '/user/mobile-modify',
    data
  })
}

// 修改密码
export const password = (data) => {
  return axios({
    stopRepeat: true,
    url: '/user/update-password',
    data
  })
}

// 完成忘记密码
export const submitForget = (data) => {
  return axios({
    stopRepeat: true,
    url: '/user/forget-password-modify',
    data
  })
}
