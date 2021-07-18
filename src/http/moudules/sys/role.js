import axios from '../../axios'

/*
 * 角色管理模块
 */

// 获取角色列表
export const list = (data) => {
  return axios({
    url: '/role/list',
    data
  })
}
// 添加
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/role/add',
    data
  })
}
// 修改
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/role/edit',
    data
  })
}
// 删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/role/remove',
    data
  })
}

// 获取某个角色可授权的菜单列表
export const rootList = (data) => {
  return axios({
    url: '/menu/getRoleMenus',
    data
  })
}
// 获取已经授权的菜单ID
export const userRoot = (data) => {
  return axios({
    url: '/role/getAssignMenus',
    data
  })
}
// 绑定角色菜单关系
export const bindMenu = (data) => {
  return axios({
    stopRepeat: true,
    url: '/role/bindMenu',
    data
  })
}
// 查询使用某个角色的人员列表
export const userList = (data) => {
  return axios({
    url: '/role/getAssignUsers',
    data
  })
}
