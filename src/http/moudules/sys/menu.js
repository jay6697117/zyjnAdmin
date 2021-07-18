import axios from '../../axios'

/*
 * 菜单管理模块
 */
// 查找菜单树
export const list = (data) => {
  return axios({
    url: '/menu/list',
    data
  })
}
// 新增
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/menu/add',
    data
  })
}
// 修改
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/menu/edit',
    data
  })
}
// 删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/menu/remove',
    data
  })
}
// 获取拥有该菜单的角色列表
export const getInfo = (data) => {
  return axios({
    url: '/menu/getAuthRoles',
    data
  })
}
