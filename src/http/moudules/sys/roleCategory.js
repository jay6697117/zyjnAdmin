import axios from '../../axios'

/*
 * 角色分类管理模块
 */
// 分类列表
export const list = (data) => {
  return axios({
    url: '/roleCategory/list',
    data
  })
}
// 新增
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/roleCategory/add',
    data
  })
}
// 修改
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/roleCategory/edit',
    data
  })
}
// 删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/roleCategory/remove',
    data
  })
}
