import axios from '../../axios'

/*
 * 新闻资讯模块
 */
// 新闻资讯列表
export const list = (data) => {
  return axios({
    url: '/news/list',
    data
  })
}
// 新闻资讯新增
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/news/add',
    data
  })
}
// 新闻资讯编辑
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/news/edit',
    data
  })
}
// 新闻资讯删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/news/remove',
    data
  })
}
// 新闻资讯上下架
export const publish = (data) => {
  return axios({
    stopRepeat: true,
    url: '/news/publish',
    data
  })
}
// 获取基础信息
export const getInfo = (data) => {
  return axios({
    url: '/news/getInfo',
    data
  })
}
// 新闻置顶
export const top = (data) => {
  return axios({
    stopRepeat: true,
    url: '/news/istop',
    data
  })
}

// 查询已绑定的banner列表
export const getBindList = (data) => {
  return axios({
    url: '/news/getBindList',
    data
  })
}
