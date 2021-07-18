import axios from '../../axios'

/*
 * 专项考试模块
 */
// 专项考试列表
export const list = (data) => {
  return axios({
    url: '/specialExam/list',
    data
  })
}
// 专项考试新增
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/specialExam/add',
    data
  })
}
// 专项考试编辑
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/specialExam/edit',
    data
  })
}
// 专项考试删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/specialExam/remove',
    data
  })
}
// 专项考试上下架
export const publish = (data) => {
  return axios({
    stopRepeat: true,
    url: '/specialExam/publish',
    data
  })
}
// 专项考试详情
export const getInfo = (data) => {
  return axios({
    url: '/specialExam/getInfo',
    data
  })
}

/*
 * 导入学员模块
 */
// 学员列表
export const studentList = (data) => {
  return axios({
    url: '/specialExam/studentList',
    data
  })
}
// 新增学员
export const studentInsert = (data) => {
  return axios({
    stopRepeat: true,
    url: '/specialExam/importStudent',
    data
  })
}

// 删除学员
export const studentRemove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/specialExam/deleteStudent',
    data
  })
}

// 查找已导入的学员ID
export const studentFindUid = (data) => {
  return axios({
    url: '/specialExam/getSelectedUserIds',
    data
  })
}

// 查询已绑定的banner列表
export const getBindList = (data) => {
  return axios({
    url: '/specialExam/getBindList',
    data
  })
}
// 已选中学员
export const getSelectedUser = (data) => {
  return axios({
    stopRepeat: true,
    url: '/specialExam/getSelectedUserIds',
    data
  })
}

// 考试复制
export const copy = (data) => {
  return axios({
    stopRepeat: true,
    url: '/specialExam/copy',
    data
  })
}
