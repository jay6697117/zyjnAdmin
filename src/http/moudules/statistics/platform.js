import axios from '../../axios'

// 学员维度列表

export const list = (data) => {
  return axios({
    url: '/dataStatistics/summary',
    data
  })
}
