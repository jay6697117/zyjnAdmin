import axios from '../../axios'

/*
 * 商城模块
 */

export const list = (data) => {
  return axios({
    url: '/courseShop/courseList',
    data
  })
}

export const category = (data) => {
  return axios({
    url: '/category/getShopCourseCategories',
    data
  })
}

export const hot = (data) => {
  return axios({
    url: '/courseShop/getHotCourses',
    data
  })
}

export const free = (data) => {
  return axios({
    url: '/courseShop/getFreeCourses',
    data
  })
}

export const getInfo = (data) => {
  return axios({
    url: '/courseShop/courseDetail',
    data
  })
}

export const confirm = (data) => {
  return axios({
    url: '/order/confirmOrder',
    data
  })
}

export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/order/createOrder',
    data
  })
}

export const getOrder = (data) => {
  return axios({
    url: '/order/getInfo',
    data
  })
}

export const commit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/order/submitRemittanceVoucher',
    data
  })
}

export const getWxCode = (data) => {
  return axios({
    stopRepeat: true,
    url: '/pay/wxUnifiedOrder',
    data
  })
}
