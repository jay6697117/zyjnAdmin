import axios from '../../axios'

/*
 * 提现模块
 */

export const list = (data) => {
  return axios({
    url: '/withdrawal/list',
    data
  })
}

export const confirm = (data) => {
  return axios({
    stopRepeat: true,
    url: '/withdrawal/confirm',
    data
  })
}

export const change = (data) => {
  return axios({
    stopRepeat: true,
    url: '/withdrawal/changeDoneTime',
    data
  })
}
