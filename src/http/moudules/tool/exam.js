import axios from '../../axios'

// 试卷列表
export const list = (data) => {
  return axios({
    url: '/exam/search',
    data
  })
}
// 添加试卷
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/exam/add',
    data
  })
}
// 修改试卷
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/exam/edit',
    data
  })
}
// 发布试卷
export const publish = (data) => {
  return axios({
    stopRepeat: true,
    url: '/exam/publish',
    data
  })
}
// 删除试卷
export const del = (data) => {
  return axios({
    stopRepeat: true,
    url: '/exam/delete',
    data
  })
}
// 获取试卷详情
export const info = (data) => {
  return axios({
    url: '/exam/get',
    data
  })
}
// 停止
export const stop = (data) => {
  return axios({
    stopRepeat: true,
    url: '/exam/stop',
    data
  })
}
