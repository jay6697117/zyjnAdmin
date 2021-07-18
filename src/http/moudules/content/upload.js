import axios from '../../axios'

/*
 * 音频视频上传模块
 */
// 第一步获取上传凭证
export const first = () => {
  return axios({
    url: '/oss/getUploadPolicy'
  })
}
// 第二步开始上传
export const second = (data) => {
  return axios({
    url: '/uploadFile/init',
    data
  })
}
// 第三步从后台获取已上传的文件信息
export const third = (data) => {
  return axios({
    url: '/uploadFile/finish',
    data
  })
}
