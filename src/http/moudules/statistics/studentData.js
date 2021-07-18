import axios from '../../axios'

// 学员维度列表

export const list = (data) => {
  return axios({
    url: '/dataSummary/userLatitudeData',
    data
  })
}

export const detail = (data) => {
  return axios({
    url: '/dataSummary/userLatitudeDetails',
    data
  })
}

export const courseDetail = (data) => {
  return axios({
    url: '/course/getUserStudyDetail',
    data
  })
}

// eslint-disable-next-line camelcase
export const project_planDetail = (data) => {
  return axios({
    url: '/projectPlan/getUserStudyDetail',
    data
  })
}
