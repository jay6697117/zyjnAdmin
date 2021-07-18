import axios from '../../axios'

/*
 * 机构管理模块
 */

// 查询部门列表
export const list = (data) => {
  return axios({
    url: '/framework/list',
    data
  })
}
// 添加部门
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/framework/add',
    data
  })
}
// 修改部门
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/framework/edit',
    data
  })
}
// 删除部门
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/framework/remove',
    data
  })
}
// 删除部门
export const tree = (data) => {
  return axios({
    url: '/framework/tree',
    data
  })
}
// 部门负责人列表
export const searchLeader = (data) => {
  return axios({
    url: '/organization/managers',
    data
  })
}
// 查询部门下的员工
export const searchChild = (data) => {
  return axios({
    url: '/framework/employees',
    data
  })
}
