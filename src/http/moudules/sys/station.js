import axios from '../../axios'

/*
 * 岗位管理模块
 */
// 岗位列表
export const list = () => {
  return axios({
    url: '/station/list'
  })
}
// 岗位添加+修改
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/station/edit',
    data
  })
}
// 删除岗位
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/station/remove',
    data
  })
}
