import axios from '../../axios'

// 分时段列表
export const list = (data) => {
  return axios({
    url: '/dataSummary/planLatitudeData',
    data
  })
}

export const courseList = (data) => {
  return axios({
    url: '/dataSummary/planLatitudeCourseDetails',
    data
  })
}

export const examList = (data) => {
  return axios({
    url: '/dataSummary/planLatitudeExamDetails',
    data
  })
}

export const courseDetail = (data) => {
  return axios({
    url: '/dataSummary/getPlanUserStudyListByLesson',
    data
  })
}

export const examDetail = (data) => {
  return axios({
    url: '/dataSummary/getPlanUserStudyListByExam',
    data
  })
}
