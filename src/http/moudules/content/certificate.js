import axios from '../../axios'

/*
 * 证书模块
 */
// 证书列表
export const list = (data) => {
  return axios({
    stopRepeat: true,
    url: '/certificate/list',
    data
  })
}
// 证书上下架
export const publish = (data) => {
  return axios({
    stopRepeat: true,
    url: 'certificate/publish',
    data
  })
}
// 证书添加
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/certificate/add',
    data
  })
}
// 证书编辑
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/certificate/edit',
    data
  })
}
// 删除证书
export const remove = (data) => {
  return axios({
    stopRepeat: true,
    url: '/certificate/remove',
    data
  })
}
// 默认图片
export const picture = (data) => {
  return axios({
    stopRepeat: true,
    url: '/system/getDefaultSetting',
    data
  })
}
// 获取已绑定id
export const selectedResource = (data) => {
  return axios({
    stopRepeat: true,
    url: '/certificate/getSelectedResourceIds',
    data
  })
}
// 获取资源id
export const resourceList = (data) => {
  return axios({
    stopRepeat: true,
    url: '/certificate/resourceList',
    data
  })
}
// 获取证书信息
export const getInfo = (data) => {
  return axios({
    stopRepeat: true,
    url: '/certificate/getInfo',
    data
  })
}
