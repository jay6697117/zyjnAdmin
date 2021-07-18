import axios from '../../axios'

/*
 * 专栏模块
 */
// 专栏列表
export const list = (data) => {
  return axios({
    url: '/column/search',
    data
  })
}
// 专栏上下架
export const publish = (data) => {
  return axios({
    url: '/column/publish',
    data
  })
}
// 专栏添加
export const insert = (data) => {
  return axios({
    url: '/column/insert',
    data
  })
}
// 专栏修改
export const update = (data) => {
  return axios({
    url: '/column/update',
    data
  })
}
// 专栏下课程列表
export const courses = (data) => {
  return axios({
    url: '/column/courses',
    data
  })
}
// 专栏添加课程
export const addCourses = (data) => {
  return axios({
    url: '/column/addCourses',
    data
  })
}
// 删除课程
export const del = (data) => {
  return axios({
    url: '/resource/delete',
    data
  })
}
// 删除专栏
export const clear = (data) => {
  return axios({
    url: '/column/clear',
    data
  })
}
