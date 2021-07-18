import axios from '../../axios'

/*
 * 商城模块
 */

export const list = (data) => {
  return axios({
    url: '/organization/applyList',
    data
  })
}

export const examine = (data) => {
  return axios({
    stopRepeat: true,
    url: '/organization/examine',
    data
  })
}
