import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/pages/exception/404'
import NotPermit from '@/pages/exception/403'
import ServerError from '@/pages/exception/500'
import MenuView from '@/layouts/MenuView'
import Login from '@/pages/login/Login'
import Forget from '@/pages/login/Forget'
import Laboratory from '@/pages/IFrame/Laboratory'
import global from '../utils/global'

import api from '@/http/api'
import store from '@/store'
// import power from '@/permission'
import {
  Modal
} from 'ant-design-vue'
let menuRouteLoaded = false // 未加载

Vue.use(Router)
let routes = [
  {
    path: '/',
    name: '首页',
    component: MenuView,
    icon: 'none',
    children: [],
    redirect: {
      name: '登录页'
    }
  },
  {
    path: '/login',
    name: '登录页',
    component: Login
  },
  {
    path: '/forget',
    name: '忘记密码',
    component: Forget
  },
  {
    path: '/Laboratory',
    name: '实验室',
    component: Laboratory
  },
  {
    path: '/exception',
    name: '异常页',
    icon: 'warning',
    component: MenuView,
    children: [
      {
        path: '/exception/404',
        name: '404',
        icon: 'none',
        component: NotFound
      },
      {
        path: '/exception/403',
        name: '403',
        icon: 'none',
        component: NotPermit
      },
      {
        path: '/exception/500',
        name: '500',
        icon: 'none',
        component: ServerError
      }
    ]
  }
]

let router = new Router({
  base: global.prefix,
  routes
})
const originalPush = Router.prototype.push
Router.prototype.push = function push (loc) {
  return originalPush.call(this, loc).catch(err => err)
}
window.addEventListener('beforeunload', function (event) {
  if (location.hash.indexOf('edit') !== -1) {
    (event || window.event).returnValue = '确定退出吗'
    return '确定退出吗'
  }
})

function getCookie (name) {
  var strcookie = document.cookie
  var arrcookie = strcookie.split('; ')
  for (var i = 0; i < arrcookie.length; i++) {
    var arr = arrcookie[i].split('=')
    if (arr[0] === name && arr[1] === '1') {
      return true
    }
  }
  return false
}

router.beforeEach((to, from, next) => {
  if ((from.path.indexOf('edit') !== -1 || from.path.lastIndexOf('question') === 6) && from.path !== to.path && !to.query.unTips && from.path !== '/account/developer/edit') {
    Modal.confirm({
      title: '温馨提示',
      content: '此时离开将丢失已编辑的内容，是否离开？',
      okText: '离开',
      cancelText: '取消',
      onOk: () => {
        next()
      }
    })
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  var isLogin = getCookie('da_shu_shang_login')
  let token = store.state.token
  if (to.path === '/login' || to.path === '/forget' || to.path.indexOf('exception') !== -1) {
    menuRouteLoaded = false // 未加载路由
    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if (isLogin || token) {
      next({
        path: '/home/home'
      })
    } else {
      next()
    }
  } else {
    if (!isLogin && !token) {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({
        path: '/login'
      })
    } else {
      if (to.path !== '/Laboratory') {
        // 加载动态菜单和路由
        addDynamicMenuAndRoutes(to, from)
      }
      console.log(to.path)
      next()
    }
  }
})

/**
 * 加载动态菜单和路由
 */
function addDynamicMenuAndRoutes (to, from) {
  if (menuRouteLoaded) { // 已加载路由
    return
  }
  menuRouteLoaded = true
  var isLogin = getCookie('da_shu_shang_login')
  let token = store.state.token
  if (isLogin || token) {
    if (store.state.navTree.length) {
      // 添加动态路由
      routes[0].children = addDynamicRoutes(store.state.navTree)
      router.matcher = new Router({
        base: global.prefix
      }).matcher // 更新路由
      setTimeout(() => {
        router.addRoutes(routes)
      }, 0)
    } else {
      api.user.menu().then(res => {
        // 处理静态组件绑定路由
        routes[0].children = addDynamicRoutes(menuSort(res.data))
        router.matcher = new Router({
          base: global.prefix
        }).matcher // 更新路由
        router.addRoutes(routes)
        // 保存菜单树
        store.commit('setNavTree', menuSort(res.data))
      }).then(res => {
        api.user.routes().then(res => {
          // 保存用户前台授权标识集合
          store.commit('setPerms', res.data)
          api.user.apis().then(res => {
            // 保存用户后台api访问权限标识集合
            store.commit('setApis', res.data)
            api.upload.first().then(res => { // 阿里云上传必要参数
              store.commit('setUploadParmas', res.data)
            })
            // if (power(['content:videoList:insert', 'content:videoList:update', 'content:audioList:insert', 'content:audioList:update', 'content:textList:insert', 'content:textList:update'])) {
            //   api.upload.first().then(res => { // 阿里云上传必要参数
            //     store.commit('setUploadParmas', res.data)
            //   })
            // }
          })
        })
      }).catch(function (res) {})
    }
  }
}
/**
 * 处理路由到本地直接指定页面组件的情况
 * 比如'代码生成'是要求直接绑定到'Generator'页面组件
 */
function menuSort (list, parent) {
  // console.log(parent)
  for (var i in list) {
    list[i].path = list[i].url.indexOf('/') ? ('/' + list[i].url) : list[i].url

    if (parent) {
      if (parent.origin) {
        list[i].origin = JSON.parse(JSON.stringify(parent.origin))
      } else {
        list[i].origin = []
      }
      list[i].origin.push({
        name: list[i].name,
        type: list[i].type,
        path: list[i].url,
        auth: list[i].authorization_sign
      })
    }
    if (list[i].children && list[i].children.length) {
      list[i].children = menuSort(list[i].children, list[i])
    }
    if (list[i].type === 1) {
      list[i].origin = [{
        name: list[i].name,
        type: list[i].type,
        path: list[i].path,
        auth: list[i].authorization_sign
      }]
    }
  }
  list = list.sort((a, b) => {
    return b.order - a.order
  })
  return list
}

/**
 * 添加动态(菜单)路由
 * @param {*} mList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function addDynamicRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    }
    if (menuList[i].url && /\S/.test(menuList[i].url) && menuList[i].url !== 'Laboratory') {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      // 创建路由配置
      var route = {
        path: menuList[i].url,
        component: null,
        name: menuList[i].name,
        meta: {
          icon: menuList[i].icon,
          index: menuList[i].id,
          origin: menuList[i].origin,
          auth: menuList[i].authorization_sign
        }
      }
      try {
        // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
        // 如url="sys/user"，则组件路径应是"@/pages/sys/user.vue",否则组件加载不到
        let url = menuList[i].url
        route.component = () => import(`@/pages/${url}`)
      } catch (e) {}
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    addDynamicRoutes(temp, routes)
  } else {
    console.log('动态路由加载...')
    console.log(routes)
    console.log('动态路由加载完成.')
  }
  return routes
}
export default router
