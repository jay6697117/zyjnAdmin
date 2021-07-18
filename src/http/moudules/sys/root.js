import axios from '../../axios'

/*
 * 菜单管理模块
 */
// 获取路由列表
export const list = (data) => {
  return axios({
    url: '/route/list',
    data
  })
}
// 新建
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/route/add',
    data
  })
}
// 修改
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/route/edit',
    data
  })
}
// 删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/route/remove',
    data
  })
}
