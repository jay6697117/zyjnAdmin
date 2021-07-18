import axios from '../../axios'

/*
 * 商城模块
 */

export const list = (data) => {
  return axios({
    url: '/order/list',
    data
  })
}

export const detail = (data) => {
  return axios({
    url: '/order/getInfo',
    data
  })
}

export const cencel = (data) => {
  return axios({
    stopRepeat: true,
    url: '/order/cancelOrder',
    data
  })
}
