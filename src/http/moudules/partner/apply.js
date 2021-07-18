import axios from '../../axios'

/*
 * 商城模块
 */

export const list = (data) => {
  return axios({
    url: '/contentProvider/applyList',
    data
  })
}

export const apply = (data) => {
  return axios({
    stopRepeat: true,
    url: '/contentProvider/apply',
    data
  })
}

export const examine = (data) => {
  return axios({
    stopRepeat: true,
    url: '/contentProvider/examine',
    data
  })
}
