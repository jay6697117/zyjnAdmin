import axios from '../../axios'

/*
 * 字典管理模块
 */

// 保存
export const save = (data) => {
  return axios({
    stopRepeat: true,
    url: '/dict/save',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return axios({
    stopRepeat: true,
    url: '/dict/delete',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/dict/findPage',
    data
  })
}
