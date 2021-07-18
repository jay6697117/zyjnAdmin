import axios from '../axios'

/*
 * 合作商模块
 */
// 概览总数据
export const overView = (data) => {
  return axios({
    url: '/dataStatistics/dataOverView',
    data
  })
}
export const courseAuditTotalInfo = (data) => {
  return axios({
    url: '/dataStatistics/courseAuditTotalInfo',
    data
  })
}
export const studyData = (data) => {
  return axios({
    url: '/dataStatistics/studyData',
    data
  })
}
export const collect = (data) => {
  return axios({
    url: '/workbench/learningOverview',
    data
  })
}
// 获取常用工具
export const tools = (data) => {
  return axios({
    url: '/commonFunctions/list',
    data
  })
}
// 添加常用工具
export const add = (data) => {
  return axios({
    url: '/commonFunctions/add',
    data
  })
}
// 图表
export const echarts = (data) => {
  return axios({
    url: '/workbench/learningAnalysis',
    data
  })
}
// 课程排行
export const courseHot = (data) => {
  return axios({
    url: '/course/hot',
    data
  })
}
// 学员排行
export const userHot = (data) => {
  return axios({
    url: '/user/learningRanking',
    data
  })
}
// 是否过期
export const isExpired = (data) => {
  return axios({
    url: '/workbench/expireTips',
    data
  })
}
// 是否过期
export const getDevData = (data) => {
  return axios({
    url: '/dataStatistics/developerSummary',
    data
  })
}
// 是否过期
export const getDevStudy = (data) => {
  return axios({
    url: '/dataStatistics/developerStudyData',
    data
  })
}
