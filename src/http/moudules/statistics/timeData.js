import axios from '../../axios'

// 分时段列表
export const list = (data) => {
  return axios({
    url: '/dataSummary/timePhasedLearningData',
    data
  })
}
export const detail = (data) => {
  return axios({
    url: '/dataSummary/userLearningFlow',
    data
  })
}
