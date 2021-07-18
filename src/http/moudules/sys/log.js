import axios from '../../axios'

/*
 * 日志管理模块
 */

// 获取登录日志
export const findLogEnter = (data) => {
  return axios({
    url: '/log/loginLogs',
    data
  })
}
// 获取错误日志
export const findLogError = (data) => {
  return axios({
    url: '/log/loginLogs',
    data
  })
}
// 获取操作日志
export const findLogOperate = (data) => {
  return axios({
    url: '/log/operationLogs',
    data
  })
}
