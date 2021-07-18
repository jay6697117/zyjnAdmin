import axios from '../../axios'

/*
 * 合作商模块
 */
// 合作商列表
export const list = (data) => {
  return axios({
    url: '/contentProvider/list',
    data
  })
}
// 合作商新增
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/contentProvider/add',
    data
  })
}
// 合作商编辑
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/contentProvider/edit',
    data
  })
}
// 合作商停用
export const status = (data) => {
  return axios({
    stopRepeat: true,
    url: '/contentProvider/changeStatus',
    data
  })
}
// 获取基础信息
export const getInfo = (data) => {
  return axios({
    url: '/contentProvider/getInfo',
    data
  })
}

// 获取基础信息
export const reset = (data) => {
  return axios({
    url: '/contentProvider/resetPassword',
    data
  })
}
