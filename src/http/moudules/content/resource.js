import axios from '../../axios'

/*
 * 资源模块
 */
// 资源列表
export const list = (data) => {
  return axios({
    url: '/courseLibrary/list',
    data
  })
}
// 资源删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/courseLibrary/remove',
    data
  })
}
// 添加资源
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/courseLibrary/add',
    data
  })
}
// 添加资源
export const getInfo = (data) => {
  return axios({
    url: '/courseLibrary/getInfo',
    data
  })
}
// 查询资源绑定课时的列表
export const getBindList = (data) => {
  return axios({
    url: '/courseLibrary/getBindList',
    data
  })
}
