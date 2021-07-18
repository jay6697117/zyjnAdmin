import axios from '../../axios'

// 获取所有试题
export const list = (data) => {
  return axios({
    url: '/question/search',
    data
  })
}
// 查询试题
export const search = (data) => {
  return axios({
    url: '/question/get',
    data
  })
}
// 删除试题
export const del = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/delete',
    data
  })
}
// 修改试题
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/edit',
    data
  })
}
// 添加试题
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/add',
    data
  })
}
// 添加试题
export const transfer = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/transfer',
    data
  })
}
