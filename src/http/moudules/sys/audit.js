import axios from '../../axios'

/*
 * 流程管理模块
 */
// 流程列表
export const list = (data) => {
  return axios({
    url: '/audit/list',
    data
  })
}
// 新增流程
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/audit/add',
    data
  })
}
// 编辑流程
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/audit/edit',
    data
  })
}
// 删除流程
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/audit/remove',
    data
  })
}
// 查看流程
export const info = (data) => {
  return axios({
    stopRepeat: true,
    url: '/audit/getInfo',
    data
  })
}
