import axios from '../../axios'

/*
 * 课程模块
 */
// 课程列表
export const list = (data) => {
  return axios({
    url: '/course/list',
    data
  })
}
// 课程上下架
export const publish = (data) => {
  return axios({
    stopRepeat: true,
    url: '/course/publish',
    data
  })
}
// 课程添加
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/course/add',
    data
  })
}
// 课程编辑
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/course/edit',
    data
  })
}
// 删除课程
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/course/remove',
    data
  })
}
// 课时列表
export const lessons = (data) => {
  return axios({
    url: '/lesson/list',
    data
  })
}
// 添加课时
export const addLesson = (data) => {
  return axios({
    stopRepeat: true,
    url: '/lesson/add',
    data
  })
}
// 添加课时
export const editLesson = (data) => {
  return axios({
    stopRepeat: true,
    url: '/lesson/edit',
    data
  })
}
// 获取课时信息
export const getLessonInfo = (data) => {
  return axios({
    url: '/lesson/getInfo',
    data
  })
}
// 删除课时
export const deleteLesson = (data) => {
  return axios({
    stopRepeat: true,
    url: '/lesson/remove',
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

// 获取讲师的信息
export const getTeacherInfo = (data) => {
  return axios({
    url: '/staff/getInfo',
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
// 获取某课程绑定的培训计划列表
export const getBindList = (data) => {
  return axios({
    url: '/course/getBindList',
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

// 学员数据-课时列表
export const lessonDetail = (data) => {
  return axios({
    url: '/course/getUserStudyListByLesson',
    data
  })
}

// 课时排序
export const sort = (data) => {
  return axios({
    stopRepeat: true,
    url: '/lesson/sort',
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

// 已选中学员
export const allCourse = (data) => {
  return axios({
    stopRepeat: true,
    url: '/bindStudent/courseList',
    data
  })
}

// 已选中学员
export const createList = (data) => {
  return axios({
    stopRepeat: true,
    url: '/lesson/batchAdd',
    data
  })
}

// 课程复制
export const copy = (data) => {
  return axios({
    stopRepeat: true,
    url: '/course/copy',
    data
  })
}
