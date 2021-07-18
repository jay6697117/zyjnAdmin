import axios from '../../axios'

/*
 * 分类管理模块
 */
// 列表
export const list = (data) => {
  return axios({
    url: '/category/list',
    data
  })
}
// 添加
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/category/add',
    data
  })
}
// 修改
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/category/edit',
    data
  })
}
// 删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/category/remove',
    data
  })
}
// 排序
export const sort = (data) => {
  return axios({
    stopRepeat: true,
    url: '/category/sort',
    data
  })
}
export const categories = (data) => {
  return axios({
    url: '/courseShop/categories',
    data
  })
}
