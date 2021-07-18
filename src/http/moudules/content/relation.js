import axios from '../../axios'

/*
 * 导入学员模块
 */
// 学员列表
export const list = (data) => {
  return axios({
    url: '/projectPlan/studentList',
    data
  })
}
// 新增学员
export const insert = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/importStudent',
    data
  })
}

// 删除学员
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/projectPlan/deleteStudent',
    data
  })
}

// 查找已导入的学员ID
export const findUid = (data) => {
  return axios({
    url: '/projectPlan/getSelectedUserIds',
    data
  })
}
