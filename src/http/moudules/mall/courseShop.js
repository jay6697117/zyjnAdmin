import axios from '../../axios'

/*
 * 产品模块
 */
export const categories = (data) => {
  return axios({
    url: '/courseShop/categories',
    data
  })
}
// 获取课程
export const courseList = (data) => {
  return axios({
    url: '/courseShop/courseList',
    data
  })
}
