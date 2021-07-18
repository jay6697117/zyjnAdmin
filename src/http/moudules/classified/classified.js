import axios from '../../axios'

/*
 * 频道管理模块
 */
// 频道列表
export const list = () => {
  return axios({
    url: '/category/all'
  })
}
// 频道添加+修改
export const save = (data) => {
  return axios({
    stopRepeat: true,
    url: '/category/update',
    data
  })
}
// 删除频道
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/category/delete',
    data
  })
}
