import axios from '../../axios'

/*
 * 用户管理模块
 */
// 查找菜单
export const menu = (data) => {
  return axios({
    url: '/menu/getAuthMenus',
    data
  })
}
// 查找前台页面访问权限标识集合
export const routes = (data) => {
  return axios({
    url: '/menu/getAuthSigns',
    data
  })
}
// 查找后台api访问权限标识集合
export const apis = (data) => {
  return axios({
    url: '/route/auth',
    data
  })
}
// 查找后台api访问权限标识集合
export const info = () => {
  return axios({
    url: '/user/auth-info'
  })
}
// 查询默认配置(封面图)
export const defaultSetting = () => {
  return axios({
    url: '/system/getDefaultSetting'
  })
}
