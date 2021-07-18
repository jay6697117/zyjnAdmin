import axios from '../../axios'

// 专项考试模块

export const list = (data) => {
  return axios({
    url: '/dataSummary/examLatitudeData',
    data
  })
}

export const detail = (data) => {
  return axios({
    url: '/dataSummary/examLatitudeDetails',
    data
  })
}
