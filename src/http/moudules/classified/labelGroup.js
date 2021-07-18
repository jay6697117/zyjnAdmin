import axios from '../../axios'

/*
 * 标签管理模块
 */
// 标签列表
export const list = () => {
  return axios({
    url: '/labelGroup/list'
  })
}
// 标签添加+修改
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/labelGroup/add',
    data
  })
}
// 调整排序
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/labelGroup/edit',
    data
  })
}
// 删除标签
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/labelGroup/remove',
    data
  })
}
