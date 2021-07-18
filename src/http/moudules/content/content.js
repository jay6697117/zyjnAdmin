import axios from '../../axios'

/*
 * 内容管理模块
 */
// 标签列表
export const list = (data) => {
  var url = data.url
  delete data.url
  return axios({
    url,
    data
  })
}
