import axios from '../../axios'

/*
 * 机构管理模块
 */

// 查询正常组织类型
export const allNormal = () => {
  return axios({
    url: '/organizationType/allNormal'
  })
}
// 查询组织类型列表
export const list = () => {
  return axios({
    url: '/organizationType/all'
  })
}
// 添加组织类型
export const addType = (data) => {
  return axios({
    url: '/organizationType/add',
    data
  })
}
// 删除组织类型
export const delType = (data) => {
  return axios({
    url: '/organizationType/delete',
    data
  })
}
// 修改组织类型
export const editType = (data) => {
  return axios({
    url: '/organizationType/update',
    data
  })
}
