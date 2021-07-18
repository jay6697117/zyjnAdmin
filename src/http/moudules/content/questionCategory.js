import axios from '../../axios'

// 获取所有试题分类
export const tree = () => {
  return axios({
    url: '/questionCategory/tree'
  })
}
// 添加试题分类
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/questionCategory/add',
    data
  })
}
// 修改试题分类
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/questionCategory/edit',
    data
  })
}
// 删除试题分类
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/questionCategory/remove',
    data
  })
}
