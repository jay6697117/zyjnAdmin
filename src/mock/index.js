import Mock from 'mockjs'
import global from '@/utils/global'
import * as login from './modules/login'
import * as user from './modules/user'
import * as role from './modules/role'
import * as org from './modules/org'
import * as menu from './modules/menu'
import * as account from './modules/account'
import * as root from './modules/root'
import * as dict from './modules/dict'
import * as log from './modules/log'
import * as product from './modules/product'

// 1. 开启/关闭[所有模块]拦截, 通过调[openMock参数]设置.
// let openMock = true
let openMock = false
fnCreate(login, openMock)
fnCreate(user, openMock)
fnCreate(role, openMock)
fnCreate(org, openMock)
fnCreate(menu, openMock)
fnCreate(account, openMock)
fnCreate(root, openMock)
fnCreate(dict, openMock)
fnCreate(log, openMock)
fnCreate(product, openMock)
/**
 * 创建mock模拟数据
 * @param {*} mod 模块
 * @param {*} isOpen 是否开启?
 */
function fnCreate (mod, isOpen = true) {
  if (isOpen) {
    for (var key in mod) {
      ((res) => {
        if (res.isOpen !== false) {
          let url = global.baseUrl
          // if (!url.endsWith('/')) {
          //   url = url + '/'
          // }
          url = url + res.url
          Mock.mock(new RegExp(url), 'post', (opts) => {
            opts['data'] = opts.body ? JSON.parse(opts.body) : null
            delete opts.body
            console.log('\n')
            console.log('%cmock拦截, 请求: ', 'color:blue', opts)
            console.log('%cmock拦截, 响应: ', 'color:blue', res.data)
            return res.data
          })
        }
      })(mod[key]() || {})
    }
  }
}
