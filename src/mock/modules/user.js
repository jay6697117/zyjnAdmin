/*
 * 用户管理模块
 */

// 查找菜单
export const menu = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': [
      {
        'id': 27,
        'name': '内容管理',
        'parent_id': 0,
        'order': 2,
        'level': '',
        'url': '',
        'authorization_sign': 'content',
        'icon': 'tablet',
        'type': 0,
        'is_hide': 0,
        'is_public': 0,
        'children': [{
          'id': 101,
          'name': '视频',
          'parent_id': 27,
          'order': 0,
          'level': '27-',
          'url': '/content/videoList',
          'authorization_sign': 'content:videoList',
          'icon': 'home',
          'type': 1,
          'is_hide': 0,
          'is_public': 0
        }, {
          'id': 102,
          'name': '音频',
          'parent_id': 27,
          'order': 0,
          'level': '27-',
          'url': '/content/audioList',
          'authorization_sign': 'content:audioList',
          'icon': 'home',
          'type': 1,
          'is_hide': 0,
          'is_public': 0
        }, {
          'id': 103,
          'name': '图文',
          'parent_id': 27,
          'order': 0,
          'level': '27-',
          'url': '/content/textList',
          'authorization_sign': 'content:textList',
          'icon': 'home',
          'type': 1,
          'is_hide': 0,
          'is_public': 0
        }]
      }, {
        'id': 1,
        'name': '系统管理',
        'parent_id': 0,
        'order': 0,
        'level': '',
        'url': '',
        'authorization_sign': 'sys',
        'icon': 'setting',
        'type': 0,
        'is_hide': 0,
        'is_public': 0,
        'children': [{
          'id': 19,
          'name': '菜单管理',
          'parent_id': 1,
          'order': 0,
          'level': '1-',
          'url': '/sys/menu',
          'authorization_sign': 'sys:menu',
          'icon': 'snippets',
          'type': 1,
          'is_hide': 0,
          'is_public': 0
        }, {
          'id': 23,
          'name': '角色管理',
          'parent_id': 1,
          'order': 0,
          'level': '1-',
          'url': '/sys/role',
          'authorization_sign': 'sys:role',
          'icon': 'user',
          'type': 1,
          'is_hide': 0,
          'is_public': 0
        }, {
          'id': 24,
          'name': '路由管理',
          'parent_id': 1,
          'order': 10,
          'level': '1-',
          'url': '/sys/root',
          'authorization_sign': 'sys:root',
          'icon': 'desktop',
          'type': 1,
          'is_hide': 0,
          'is_public': 0
        }, {
          'id': 25,
          'name': '组织结构',
          'parent_id': 1,
          'order': 0,
          'level': '1-',
          'url': '/sys/org',
          'authorization_sign': 'sys:org',
          'icon': 'team',
          'type': 1,
          'is_hide': 0,
          'is_public': 0
        }, {
          'id': 26,
          'name': '账号管理',
          'parent_id': 1,
          'order': 0,
          'level': '1-',
          'url': '/sys/account',
          'authorization_sign': 'sys:account',
          'icon': 'database',
          'type': 1,
          'is_hide': 0,
          'is_public': 0
        }]
      }, {
        'id': 18,
        'name': '工作台',
        'parent_id': 0,
        'order': 100,
        'level': '',
        'url': '/home/home',
        'authorization_sign': 'home:home',
        'icon': 'home',
        'type': 1,
        'is_hide': 1,
        'is_public': 1
      }, {
        'id': 35,
        'name': '日志管理',
        'parent_id': 0,
        'order': 1,
        'level': '',
        'url': '',
        'authorization_sign': 'log',
        'icon': 'database',
        'type': 0,
        'is_hide': 0,
        'is_public': 0,
        'children': [{
          'id': 36,
          'name': '登录日志',
          'parent_id': 35,
          'order': 0,
          'level': '35-',
          'url': '/log/enter',
          'authorization_sign': 'log:enter',
          'icon': 'schedule',
          'type': 1,
          'is_hide': 0,
          'is_public': 0
        }, {
          'id': 48,
          'name': '操作日志',
          'parent_id': 35,
          'order': 0,
          'level': '35-',
          'url': '/log/operate',
          'authorization_sign': 'log:operate',
          'icon': 'security-scan',
          'type': 1,
          'is_hide': 0,
          'is_public': 0
        }, {
          'id': 49,
          'name': '异常登录',
          'parent_id': 35,
          'order': 0,
          'level': '35-',
          'url': '/log/error',
          'authorization_sign': 'log:error',
          'icon': 'file-search',
          'type': 1,
          'is_hide': 0,
          'is_public': 0
        }]
      }
    ]
  }
  return {
    url: '/permission/menu/auth-menus',
    data: record
  }
}
// 查找前台页面访问权限标识集合
export const routes = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': ['sys', 'home:home', 'sys:menu', 'sys:role', 'sys:root', 'sys:org', 'sys:account', 'ope', 'ope:rtc', 'sys:root:insert', 'sys:root:update', 'sys:root:delete', 'sys:menu:insert', 'sys:menu:update', 'sys:menu:delete', 'log', 'log:enter', 'sys:role:categoryinsert', 'sys:role:categoryupdate', 'sys:role:categorydelete', 'sys:role:insert', 'sys:role:update', 'sys:role:delete', 'sys:role:setroot', 'sys:org:insert', 'sys:org:update', 'sys:org:delete', 'sys:org:status', 'log:operate', 'log:error', 'sys:menu:view', 'sys:account:insert', 'sys:account:update', 'sys:account:stop', 'sys:account:pause', 'sys:account:reset', 'sys:home:student', 'sys:home:class', 'sys:home:question', 'home:index', 'sys:root:list', 'sys:menu:list', 'sys:role:list', 'sys:org:list', 'sys:account:list', 'sys:log:login', 'sys:log:ope', 'sys:log:err']
  }
  return {
    url: '/permission/menu/auth-signs',
    data: record
  }
}
// 查找后台api访问权限标识集合
export const apis = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': ['/permission/menu/auth-signs', '/permission/menu/auth-menus', '/permission/route/auth', '/user/auth-info', '/permission/menu/role-menus', '/sms/send-code', '/captcha/get', '/user/forget-password-modify', '/user/logout', '/permission/route/delete', '/permission/route/all', '/permission/menu/delete', '/permission/menu/all', '/permission/role-category/insert', '/permission/route/insert', '/permission/route/update', '/permission/menu/insert', '/permission/menu/update', '/permission/role-category/update', '/permission/role-category/delete', '/permission/role-category/all', '/permission/role/all', '/permission/role/insert', '/permission/role/update', '/permission/role/delete', '/permission/role/bind-menu', '/permission/role/assign-menu', '/permission/menu/role-menus', '/organization/delete', '/organization/updateStatus', '/organization/insert', '/organization/getChargePeoples', '/organization/update', '/organization/getChargePeoples', '/organization/all', '/log/loginLogs', '/permission/menu/auth-roles', '/staff/store', '/staff/update', '/staff/all', '/permission/role-category/all', '/permission/role/all', '/organization/all', '/staff/userTypes', '/staff/prohibitLogin', '/staff/stopUsing', '/staff/resetPassword', '/permission/route/all', '/permission/role-category/all', '/permission/role/all', '/organization/all', '/staff/userTypes', '/staff/all', '/permission/role/all', '/permission/role-category/all', '/organization/all', '/log/loginLogs', '/log/operationLogs', '/permission/menu/all']
  }
  return {
    url: '/permission/route/auth',
    data: record
  }
}
// 查找后台api访问权限标识集合
export const info = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': {
      'avatar': 'http://beta.atth.haolexue.cc/user/201811/09/1779f3d63e80aed3.png',
      'username': '逗校长',
      'province': '北京',
      'city': '北京',
      'area': '海淀区'
    }
  }
  return {
    url: '/user/auth-info',
    data: record
  }
}
