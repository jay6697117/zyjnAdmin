/*
 * 后台接口管理模块
 */
const data = {
  'code': 0,
  'msg': null,
  'data': []
}
// 新建
export const insert = () => {
  return {
    url: '/permission/route/insert',
    data
  }
}
// 修改
export const update = () => {
  return {
    url: '/permission/route/update',
    data
  }
}
// 删除
export const del = () => {
  return {
    url: '/permission/route/delete',
    data
  }
}
// 获取权限列表
export const list = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': [{
      'id': 31,
      'name': '组织架构创建',
      'url': '/organization/insert',
      'is_default': 0,
      'created_time': 0
    }, {
      'id': 32,
      'name': '组织架构编辑',
      'url': '/organization/update',
      'is_default': 0,
      'created_time': 0
    }, {
      'id': 33,
      'name': '组织架构获取',
      'url': '/organization/all',
      'is_default': 0,
      'created_time': 0
    }, {
      'id': 34,
      'name': '组织架构删除',
      'url': '/organization/delete',
      'is_default': 0,
      'created_time': 0
    }, {
      'id': 35,
      'name': '组织架构状态修改',
      'url': '/organization/updateStatus',
      'is_default': 0,
      'created_time': 0
    }, {
      'id': 36,
      'name': '获取组织架构负责人',
      'url': '/organization/getChargePeoples',
      'is_default': 0,
      'created_time': 0
    }, {
      'id': 37,
      'name': '添加菜单',
      'url': '/permission/menu/insert',
      'is_default': 0,
      'created_time': 1559360445
    }, {
      'id': 38,
      'name': '修改菜单',
      'url': '/permission/menu/delete',
      'is_default': 0,
      'created_time': 1559360445
    }, {
      'id': 39,
      'name': '删除菜单',
      'url': '/permission/menu/update',
      'is_default': 0,
      'created_time': 1559360445
    }, {
      'id': 40,
      'name': '查询所有菜单',
      'url': '/permission/menu/all',
      'is_default': 0,
      'created_time': 1559360445
    }, {
      'id': 41,
      'name': '查询已授权的标识符',
      'url': '/permission/menu/auth-signs',
      'is_default': 1,
      'created_time': 1559360445
    }, {
      'id': 42,
      'name': '查询已授权的菜单',
      'url': '/permission/menu/auth-menus',
      'is_default': 1,
      'created_time': 1559360445
    }, {
      'id': 43,
      'name': '查询菜单的授权角色',
      'url': '/permission/menu/auth-roles',
      'is_default': 0,
      'created_time': 1559360445
    }, {
      'id': 44,
      'name': '路由获取',
      'url': '/permission/route/all',
      'is_default': 0,
      'created_time': 1559375574
    }, {
      'id': 45,
      'name': '获取登录用户全部授权路由',
      'url': '/permission/route/auth',
      'is_default': 1,
      'created_time': 1559375615
    }, {
      'id': 46,
      'name': '获取登录用户信息',
      'url': '/user/auth-info',
      'is_default': 1,
      'created_time': 1559375629
    }, {
      'id': 47,
      'name': '路由创建',
      'url': '/permission/route/insert',
      'is_default': 0,
      'created_time': 1559375638
    }, {
      'id': 48,
      'name': '路由修改',
      'url': '/permission/route/update',
      'is_default': 0,
      'created_time': 1559375648
    }, {
      'id': 49,
      'name': '路由删除',
      'url': '/permission/route/delete',
      'is_default': 0,
      'created_time': 1559375660
    }, {
      'id': 50,
      'name': '角色分类获取',
      'url': '/permission/role-category/all',
      'is_default': 0,
      'created_time': 1559375671
    }, {
      'id': 51,
      'name': '角色分类插入',
      'url': '/permission/role-category/insert',
      'is_default': 0,
      'created_time': 1559375680
    }, {
      'id': 52,
      'name': '角色分类更新',
      'url': '/permission/role-category/update',
      'is_default': 0,
      'created_time': 1559375693
    }, {
      'id': 53,
      'name': '角色分类删除',
      'url': '/permission/role-category/delete',
      'is_default': 0,
      'created_time': 1559375704
    }, {
      'id': 54,
      'name': '角色获取',
      'url': '/permission/role/all',
      'is_default': 0,
      'created_time': 1559375714
    }, {
      'id': 55,
      'name': '角色创建',
      'url': '/permission/role/insert',
      'is_default': 0,
      'created_time': 1559375724
    }, {
      'id': 56,
      'name': '角色修改',
      'url': '/permission/role/update',
      'is_default': 0,
      'created_time': 1559375737
    }, {
      'id': 57,
      'name': '角色删除',
      'url': '/permission/role/delete',
      'is_default': 0,
      'created_time': 1559375747
    }, {
      'id': 58,
      'name': '角色权限绑定',
      'url': '/permission/role/bind-menu',
      'is_default': 0,
      'created_time': 1559375759
    }, {
      'id': 59,
      'name': '角色权限取消绑定',
      'url': '/permission/role/unbind-menu',
      'is_default': 0,
      'created_time': 1559375769
    }, {
      'id': 60,
      'name': '角色权限获取已绑定权限',
      'url': '/permission/role/assign-menu',
      'is_default': 0,
      'created_time': 1559375780
    }, {
      'id': 61,
      'name': '查询可授权的菜单列表',
      'url': '/permission/menu/role-menus',
      'is_default': 1,
      'created_time': 1559360445
    }, {
      'id': 63,
      'name': '登录日志',
      'url': '/log/loginLogs',
      'is_default': 0,
      'created_time': 1559718938
    }, {
      'id': 64,
      'name': '操作日志',
      'url': '/log/operationLogs',
      'is_default': 0,
      'created_time': 1559730421
    }, {
      'id': 65,
      'name': '员工列表',
      'url': '/staff/all',
      'is_default': 0,
      'created_time': 1560235321
    }, {
      'id': 66,
      'name': '新建员工',
      'url': '/staff/store',
      'is_default': 0,
      'created_time': 1560235338
    }, {
      'id': 67,
      'name': '员工编辑',
      'url': '/staff/update',
      'is_default': 0,
      'created_time': 1560235350
    }, {
      'id': 68,
      'name': '重置密码',
      'url': '/staff/resetPassword',
      'is_default': 0,
      'created_time': 1560235361
    }, {
      'id': 69,
      'name': '禁止登陆',
      'url': '/staff/prohibitLogin',
      'is_default': 0,
      'created_time': 1560235372
    }, {
      'id': 70,
      'name': '停用',
      'url': '/staff/stopUsing',
      'is_default': 0,
      'created_time': 1560235383
    }, {
      'id': 71,
      'name': '员工类型列表',
      'url': '/staff/userTypes',
      'is_default': 0,
      'created_time': 1560235397
    }, {
      'id': 72,
      'name': '忘记密码-发送短信验证码',
      'url': '/sms/send-code',
      'is_default': 1,
      'created_time': 1560237923
    }, {
      'id': 73,
      'name': '获取图形验证码',
      'url': '/captcha/get',
      'is_default': 1,
      'created_time': 1560237962
    }, {
      'id': 74,
      'name': '忘记密码-修改密码',
      'url': '/user/forget-password-modify',
      'is_default': 1,
      'created_time': 1560238064
    }, {
      'id': 78,
      'name': '退出登录',
      'url': '/user/logout',
      'is_default': 1,
      'created_time': 1560238711
    }]
  }
  return {
    url: '/permission/route/all',
    data: record
  }
}
