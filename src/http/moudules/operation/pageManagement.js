import axios from '../../axios'

/*
 * 自定义页面模块
 */
// 自定义页面列表
export const list = (data) => {
  return axios({
    url: '/pageManagement/list',
    data
  })
}
// 自定义页面新增
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/pageManagement/add',
    data
  })
}
// 自定义页面编辑
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/pageManagement/edit',
    data
  })
}
// 自定义页面删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/pageManagement/remove',
    data
  })
}
// 自定义页面上下架
export const publish = (data) => {
  return axios({
    stopRepeat: true,
    url: '/pageManagement/publish',
    data
  })
}
// 获取基础信息
export const getInfo = (data) => {
  return axios({
    url: '/pageManagement/getInfo',
    data
  })
}
