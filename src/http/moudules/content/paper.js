import axios from '../../axios'

// 试卷列表
export const list = (data) => {
  return axios({
    url: '/paper/list',
    data
  })
}
// 添加试卷
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/paper/add',
    data
  })
}
// 修改试卷
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/paper/edit',
    data
  })
}
// 发布试卷
export const publish = (data) => {
  return axios({
    stopRepeat: true,
    url: '/paper/publish',
    data
  })
}
// 删除试卷
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/paper/remove',
    data
  })
}
// 获取试卷详情
export const getInfo = (data) => {
  return axios({
    url: '/paper/getInfo',
    data
  })
}
// 停止
export const stop = (data) => {
  return axios({
    stopRepeat: true,
    url: '/paper/stop',
    data
  })
}

// 获取某试卷绑定的专项考试和培训计划列表
export const getBindList = (data) => {
  return axios({
    url: '/paper/getBindList',
    data
  })
}

// 复制试卷
export const copy = (data) => {
  return axios({
    stopRepeat: true,
    url: '/paper/copy',
    data
  })
}
