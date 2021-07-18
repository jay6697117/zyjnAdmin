import axios from '../../axios'

/*
 * 机构管理模块
 */

// 查询组织列表
export const list = (data) => {
  return axios({
    url: '/organization/list',
    data
  })
}
// 创建组织
export const add = (data) => {
  return axios({
    stopRepeat: true,
    url: '/organization/add',
    data
  })
}
// 修改组织
export const edit = (data) => {
  return axios({
    stopRepeat: true,
    url: '/organization/edit',
    data
  })
}
// 修改组织状态
export const state = (data) => {
  return axios({
    url: '/organization/changeStatus',
    data
  })
}
// 获得城市列表
export const city = (data) => {
  return axios({
    url: '/sysRegion/list',
    data
  })
}
// 获得详情
export const getInfo = (data) => {
  return axios({
    url: '/organization/getOrgInfo',
    data
  })
}
// 更新信息
export const update = (data) => {
  return axios({
    url: '/organization/updateOrgInfo',
    data
  })
}
// 已绑定产品列表
export const productList = (data) => {
  return axios({
    url: '/orgBindCourseProduct/list',
    data
  })
}
// 获取已绑定信息
export const getProduct = (data) => {
  return axios({
    url: '/orgBindCourseProduct/getBindProductIds',
    data
  })
}
// 绑定产品
export const bind = (data) => {
  return axios({
    url: '/orgBindCourseProduct/bindProduct',
    data
  })
}
// 设置过期时间
export const setEnd = (data) => {
  return axios({
    url: '/orgBindCourseProduct/changeEndTime',
    data
  })
}
// 删除已绑定产品
export const removeProduct = (data) => {
  return axios({
    url: '/orgBindCourseProduct/remove',
    data
  })
}
// 产品详情
export const detail = (data) => {
  return axios({
    url: '/productStudyLog/list',
    data
  })
}
// 产品详情
export const detailInfo = (data) => {
  return axios({
    url: '/productStudyLog/lessonStudyDetail',
    data
  })
}

// 修改组织
// export const getInfo = (data) => {
//   return axios({
//     url: '/organization/getInfo',
//     data
//   })
// }
// // 查询组织树
// export const tree = (data) => {
//   return axios({
//     url: '/organization/tree',
//     data
//   })
// }
// // 简化版组织树
// export const getTree = (data) => {
//   return axios({
//     url: '/organization/belongToOrg',
//     data
//   })
// }
// // 查询负责人
// export const getLeader = (data) => {
//   return axios({
//     url: '/organization/managers',
//     data
//   })
// }
// // 删除部门或小组
// export const deleteOrg = (data) => {
//   return axios({
//     url: '/organization/delete',
//     data
//   })
// }
