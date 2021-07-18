import axios from '../../axios'

/*
 * 岗位分组管理模块
 */
// 添加+修改
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/stationGroup/edit',
    data
  })
}
// 删除
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/stationGroup/remove',
    data
  })
}
