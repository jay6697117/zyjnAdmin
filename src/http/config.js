import global from '@/utils/global'
export default {
  method: 'POST',
  // 基础url前缀
  baseUrl: global.baseUrl + global.prefix,
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Version': 'V1', // 这个参数不可变更 谁动谁死 后台接口版本号
    'X-Requested-With': 'XMLHttpRequest'
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 50000,
  // 携带凭证
  withCredentials: true,
  // 返回数据类型
  responseType: 'json'
}
