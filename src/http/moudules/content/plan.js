import axios from '../../axios'

/*
 * 培训计划模块
 */
// 培训计划列表
export const list = (data) => {
  return axios({
    url: '/projectPlan/list',
    data
  })
}
// 培训计划新增
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/add',
    data
  })
}
// 培训计划编辑
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/edit',
    data
  })
}
// 培训计划删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/remove',
    data
  })
}
// 培训计划上下架
export const publish = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/publish',
    data
  })
}
// 获取基础信息
export const getInfo = (data) => {
  return axios({
    url: '/projectPlan/getInfo',
    data
  })
}

/*
 * 任务模块
 */
// 添加线上课程(专栏)
export const addColumn = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/addOnlineCourse',
    data
  })
}

// 添加线上考试
export const addExam = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/addOnlineExam',
    data
  })
}
// 获取任务列表
export const itemList = (data) => {
  return axios({
    url: '/projectPlan/itemList',
    data
  })
}
// 任务中添加课程
export const addOnlineCourse = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/addOnlineCourse',
    data
  })
}
// 任务中添加考试信息
export const addOnlineExam = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/addOnlineExam',
    data
  })
}
// 任务中修改考试信息
export const updateOnlineExam = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/updateOnlineExam',
    data
  })
}
// 删除任务
export const unbind = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/unbind',
    data
  })
}
// 任务排序
export const sort = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/sort',
    data
  })
}

/*
 * 导入学员模块
 */
// 学员列表
export const studentList = (data) => {
  return axios({
    url: '/projectPlan/studentList',
    data
  })
}
// 导入学员
export const studentInsert = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/importStudent',
    data
  })
}

// 删除学员
export const studentRemove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/deleteStudent',
    data
  })
}

// 查找当前列表内的已导入学员
export const studentFindUid = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/getSelectedUserIds',
    data
  })
}

// 学习详情
export const studyDetail = (data) => {
  return axios({
    url: '/projectPlan/getUserStudyDetail',
    data
  })
}

// 任务列表
export const taskList = (data) => {
  return axios({
    url: '/projectPlan/getTaskStudyDetail',
    data
  })
}

// 课时详情
export const lessonDetail = (data) => {
  return axios({
    url: '/projectPlan/getUserCourseTaskStudyDetail',
    data
  })
}

// 考试详情
export const examDetail = (data) => {
  return axios({
    url: '/projectPlan/getUserExamTaskStudyDetail',
    data
  })
}
// 查询已绑定的banner列表
export const getBindList = (data) => {
  return axios({
    url: '/projectPlan/getBindList',
    data
  })
}
// 已选中学员
export const getSelectedUser = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/getSelectedUserIds',
    data
  })
}
// 已选中的课程或者考试
export const getItems = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/getSelectedItemIds',
    data
  })
}

// 复制培训计划
export const copy = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/copy',
    data
  })
}
