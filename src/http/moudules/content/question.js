import axios from '../../axios'

// 获取所有试题
export const list = (data) => {
  return axios({
    url: '/question/list',
    data
  })
}
// 添加试题
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/add',
    data
  })
}
// 修改试题
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/edit',
    data
  })
}
// 删除试题
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/remove',
    data
  })
}
// 查询试题
export const getInfo = (data) => {
  return axios({
    url: '/question/getInfo',
    data
  })
}
// 迁移试题
export const transfer = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/transfer',
    data
  })
}

// 查询一组试题
export const search = (data) => {
  return axios({
    url: '/question/search',
    data
  })
}

// 获取某题绑定的试卷列表
export const getBindList = (data) => {
  return axios({
    url: '/question/getBindList',
    data
  })
}

// 复制试题
export const copy = (data) => {
  return axios({
    stopRepeat: true,
    url: '/question/copy',
    data
  })
}
