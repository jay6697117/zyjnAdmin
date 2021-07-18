import axios from '../../axios'

/*
 * 产品模块
 */
// 产品列表
export const list = (data) => {
  return axios({
    url: '/courseProduct/list',
    data
  })
}
// 产品添加
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/courseProduct/add',
    data
  })
}
// 产品编辑
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/courseProduct/edit',
    data
  })
}
// 删除产品
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/courseProduct/remove',
    data
  })
}
// 产品下的课程列表
export const courses = (data) => {
  return axios({
    url: '/courseProduct/courses',
    data
  })
}
// 添加课程
export const addCourse = (data) => {
  return axios({
    stopRepeat: true,
    url: '/courseProduct/addCourse',
    data
  })
}
export const getInfo = (data) => {
  return axios({
    stopRepeat: true,
    url: '/courseProduct/getInfo',
    data
  })
}
// 删除产品下的课程
export const removeCourse = (data) => {
  return axios({
    stopRepeat: true,
    url: '/courseProduct/removeCourse',
    data
  })
}
// 获取某产品已加入的课程id
export const getCourseIds = (data) => {
  return axios({
    url: '/courseProduct/getJoinedCourseIds',
    data
  })
}
// 获取类别
export const categories = (data) => {
  return axios({
    url: '/courseShop/categories',
    data
  })
}
// 获取类别
export const courseList = (data) => {
  return axios({
    url: '/courseShop/courseList',
    data
  })
}
// 获取类别
export const getBindList = (data) => {
  return axios({
    url: '/courseProduct/getBindOrgList',
    data
  })
}
