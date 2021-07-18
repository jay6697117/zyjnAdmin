import axios from '../../axios'

/*
 * 审批模块
 */
// 课程列表
export const list = (data) => {
  return axios({
    url: '/courseAuditLog/list',
    data
  })
}
export const todo = (data) => {
  return axios({
    url: '/courseAuditLog/status',
    data
  })
}
export const remove = (data) => {
  return axios({
    url: '/courseAuditLog/remove',
    data
  })
}
export const read = (data) => {
  return axios({
    url: '/courseAuditLog/read',
    data
  })
}
export const all = (data) => {
  return axios({
    url: '/courseAuditLog/readAll',
    data
  })
}
