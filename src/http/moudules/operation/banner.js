import axios from '../../axios'

/*
 * banner模块
 */
// banner列表
export const list = (data) => {
  return axios({
    url: '/banner/list',
    data
  })
}
// banner删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/banner/remove',
    data
  })
}
// 添加banner
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/banner/add',
    data
  })
}
// 编辑banner
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/banner/edit',
    data
  })
}
// 获取banner详情
export const getInfo = (data) => {
  return axios({
    url: '/banner/getInfo',
    data
  })
}
// banner排序
export const sort = (data) => {
  return axios({
    stopRepeat: true,
    url: '/banner/sort',
    data
  })
}
// banner排序
export const jump = (data) => {
  return axios({
    url: '/banner/getJumpList',
    data
  })
}
// banner上下架
export const publish = (data) => {
  return axios({
    stopRepeat: true,
    url: '/banner/publish',
    data
  })
}
