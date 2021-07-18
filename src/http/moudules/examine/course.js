import axios from '../../axios'

/*
 * 审批模块
 */
// 课程列表
export const list = (data) => {
  return axios({
    url: '/auditCourse/list',
    data
  })
}
export const total = (data) => {
  return axios({
    url: '/auditCourse/totalInfo',
    data
  })
}
export const info = (data) => {
  return axios({
    url: '/courseShop/courseDetail',
    data
  })
}
export const examine = (data) => {
  return axios({
    url: '/auditCourse/examine',
    data
  })
}
export const history = (data) => {
  return axios({
    url: '/auditCourse/history',
    data
  })
}
export const categories = (data) => {
  return axios({
    url: '/courseShop/categories',
    data
  })
}
