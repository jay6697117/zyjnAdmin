import axios from '../../axios'

// 分时段列表
export const list = (data) => {
  return axios({
    url: '/dataStatistics/orgList',
    data
  })
}
export const users = (data) => {
  return axios({
    url: '/dataStatistics/userList',
    data
  })
}
export const userinfo = (data) => {
  return axios({
    url: '/dataStatistics/userStudyDetailList',
    data
  })
}
export const courses = (data) => {
  return axios({
    url: '/dataStatistics/courseList',
    data
  })
}
export const lessons = (data) => {
  return axios({
    url: '/dataStatistics/lessonStudyDetailList',
    data
  })
}
