import axios from '../../axios'

/*
 * 账号管理模块
 */
// 账号列表
export const list = (data) => {
  return axios({
    url: '/staff/list',
    data
  })
}
// 新增账号
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/systemAccount/add',
    data
  })
}
// 编辑账号
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/systemAccount/edit',
    data
  })
}
// 停用账号
export const stop = (data) => {
  return axios({
    stopRepeat: true,
    url: '/staff/stopUsing',
    data
  })
}
// 重置密码
export const reset = (data) => {
  return axios({
    stopRepeat: true,
    url: '/staff/resetPassword',
    data
  })
}
// 禁止登陆
export const prohibit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/staff/prohibitLogin',
    data
  })
}
// 获取部门列表
export const typeList = (data) => {
  return axios({
    url: '/staff/userTypes'
  })
}

// 获取角色列表
export const tree = (data) => {
  return axios({
    url: '/role/tree'
  })
}

// 获取角色列表
export const bindStudent = (data) => {
  return axios({
    stopRepeat: true,
    url: '/bindStudent/import',
    data
  })
}

// 获取审批员详细信息
export const getInfo = (data) => {
  return axios({
    stopRepeat: true,
    url: '/systemAccount/getInfo',
    data
  })
}
