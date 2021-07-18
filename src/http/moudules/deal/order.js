import axios from '../../axios'

/*
 * 订单审批模块
 */

export const list = (data) => {
  return axios({
    url: '/order/verifyList',
    data
  })
}

export const verify = (data) => {
  return axios({
    stopRepeat: true,
    url: '/order/verifySuccess',
    data
  })
}

export const getInfo = (data) => {
  return axios({
    url: '/order/getInfo',
    data
  })
}
