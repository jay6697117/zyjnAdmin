import axios from '../../axios'

// 获取所有试题分类
export const list = () => {
  return axios({
    url: '/question/category/all'
  })
}
// 添加试题分类
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/category/add',
    data
  })
}
// 删除试题分类
export const del = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/category/delete',
    data
  })
}
// 修改试题分类
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/category/edit',
    data
  })
}
