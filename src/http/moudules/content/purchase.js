import axios from '../../axios'

/*
 * 课程模块
 */
// 课程列表
export const list = (data) => {
  return axios({
    url: '/course/purchaseCourses',
    data
  })
}

// 采购课编辑
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/course/editPurchaseCourse',
    data
  })
}

// 导入学员
export const studentInsert = (data) => {
  return axios({
    stopRepeat: true,
    url: '/courseStudent/import',
    data
  })
}

// 学员列表
export const studentList = (data) => {
  return axios({
    url: '/courseStudent/list',
    data
  })
}

// 删除学员
export const studentRemove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/courseStudent/remove',
    data
  })
}

// 查找已导入的学员
export const getSelectedUserIds = (data) => {
  return axios({
    url: '/courseStudent/getIds',
    data
  })
}

// 获取课程的信息
export const getInfo = (data) => {
  return axios({
    url: '/course/getInfo',
    data
  })
}

// 获取单个学员课程学习详情
export const studyDetail = (data) => {
  return axios({
    url: '/course/getUserStudyDetail',
    data
  })
}

// 学员数据-课时列表
export const lessonList = (data) => {
  return axios({
    url: '/course/getLessonStudyList',
    data
  })
}

// 学员数据-课时详情
export const lessonDetail = (data) => {
  return axios({
    url: '/course/getUserStudyListByLesson',
    data
  })
}

// 已选中学员
export const getSelectedUser = (data) => {
  return axios({
    stopRepeat: true,
    url: '/courseStudent/getSelectedUserIds',
    data
  })
}
