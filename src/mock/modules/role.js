/*
 * 角色管理模块
 */
const data = {
  'code': 0,
  'msg': null,
  'data': []
}
// 获取角色分类
export const classify = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': [{
      'id': 1,
      'name': '未分组',
      'created_by': 1411464,
      'create_time': 1558597268,
      'is_default': 1
    }, {
      'id': 2,
      'name': '角色2',
      'created_by': 1411464,
      'create_time': 1559009576,
      'is_default': 0
    }, {
      'id': 4,
      'name': '新增分类1',
      'created_by': 45,
      'create_time': 1559526690,
      'is_default': 0
    }]
  }
  return {
    url: '/permission/role-category/all',
    data: record
  }
}
// 新增角色分类
export const addClassify = () => {
  return {
    url: '/permission/role-category/insert',
    data
  }
}
// 修改角色分类
export const classupdate = () => {
  return {
    url: '/permission/role-category/update',
    data
  }
}
// 删除角色分类
export const delClassify = () => {
  return {
    url: '/permission/role-category/delete',
    data
  }
}
// 获取角色列表
export const list = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': [{
      'id': 1,
      'name': '超级管理员',
      'remark': '我是备注222',
      'created_time': 1559198190,
      'updated_time': 1559532920,
      'created_by': 1411464,
      'category_id': 2,
      'is_default': 1,
      'user_relation_count': 5,
      'created_user': {
        'user_id': 1411464,
        'username': '松'
      }
    }, {
      'id': 3,
      'name': '业务员',
      'remark': '我是备注12',
      'created_time': 1559198280,
      'updated_time': 1559544168,
      'created_by': 1411464,
      'category_id': 1,
      'is_default': 0,
      'user_relation_count': 1,
      'created_user': {
        'user_id': 1411464,
        'username': '松'
      }
    }, {
      'id': 4,
      'name': '测试角色',
      'remark': '1231',
      'created_time': 1559544748,
      'updated_time': 1559544748,
      'created_by': 45,
      'category_id': 4,
      'is_default': 0,
      'user_relation_count': 4,
      'created_user': {
        'user_id': 45,
        'username': '逗校长'
      }
    }, {
      'id': 5,
      'name': '测试角色2',
      'remark': '11111',
      'created_time': 1559544811,
      'updated_time': 1559544811,
      'created_by': 45,
      'category_id': 4,
      'is_default': 0,
      'user_relation_count': 0,
      'created_user': {
        'user_id': 45,
        'username': '逗校长'
      }
    }]
  }
  return {
    url: '/permission/role/all',
    data: record
  }
}
// 添加角色
export const addRole = () => {
  return {
    url: '/permission/role/insert',
    data
  }
}
// 修改角色信息
export const updateRole = () => {
  return {
    url: '/permission/role/update',
    data
  }
}
// 删除角色
export const delRole = () => {
  return {
    url: '/permission/role/delete',
    data
  }
}

// 获取角色列表
export const rootList = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': [{
      'key': 1,
      'title': '系统管理',
      'parent_id': 0,
      'order': 10,
      'is_public': 0,
      'children': [{
        'key': 19,
        'title': '菜单管理',
        'parent_id': 1,
        'order': 0,
        'is_public': 0,
        'children': [{
          'key': 32,
          'title': '新增',
          'parent_id': 19,
          'order': 0,
          'is_public': 0
        }, {
          'key': 33,
          'title': '修改',
          'parent_id': 19,
          'order': 0,
          'is_public': 0
        }, {
          'key': 34,
          'title': '删除',
          'parent_id': 19,
          'order': 0,
          'is_public': 0
        }, {
          'key': 50,
          'title': '查看详情',
          'parent_id': 19,
          'order': 0,
          'is_public': 0
        }, {
          'key': 62,
          'title': '查看列表',
          'parent_id': 19,
          'order': 0,
          'is_public': 0
        }]
      }, {
        'key': 23,
        'title': '角色管理',
        'parent_id': 1,
        'order': 0,
        'is_public': 0,
        'children': [{
          'key': 37,
          'title': '新增分类',
          'parent_id': 23,
          'order': 0,
          'is_public': 0
        }, {
          'key': 38,
          'title': '修改分类',
          'parent_id': 23,
          'order': 0,
          'is_public': 0
        }, {
          'key': 39,
          'title': '删除分类',
          'parent_id': 23,
          'order': 0,
          'is_public': 0
        }, {
          'key': 40,
          'title': '新增角色',
          'parent_id': 23,
          'order': 0,
          'is_public': 0
        }, {
          'key': 41,
          'title': '修改角色',
          'parent_id': 23,
          'order': 0,
          'is_public': 0
        }, {
          'key': 42,
          'title': '删除角色',
          'parent_id': 23,
          'order': 0,
          'is_public': 0
        }, {
          'key': 43,
          'title': '设置权限',
          'parent_id': 23,
          'order': 0,
          'is_public': 0
        }, {
          'key': 63,
          'title': '查看列表',
          'parent_id': 23,
          'order': 0,
          'is_public': 0
        }]
      }, {
        'key': 24,
        'title': '路由管理',
        'parent_id': 1,
        'order': 10,
        'is_public': 0,
        'children': [{
          'key': 29,
          'title': '新增',
          'parent_id': 24,
          'order': 0,
          'is_public': 0
        }, {
          'key': 30,
          'title': '修改',
          'parent_id': 24,
          'order': 0,
          'is_public': 0
        }, {
          'key': 31,
          'title': '删除',
          'parent_id': 24,
          'order': 0,
          'is_public': 0
        }, {
          'key': 61,
          'title': '查看列表',
          'parent_id': 24,
          'order': 0,
          'is_public': 0
        }]
      }, {
        'key': 25,
        'title': '组织结构',
        'parent_id': 1,
        'order': 0,
        'is_public': 0,
        'children': [{
          'key': 44,
          'title': '新增',
          'parent_id': 25,
          'order': 0,
          'is_public': 0
        }, {
          'key': 45,
          'title': '修改',
          'parent_id': 25,
          'order': 0,
          'is_public': 0
        }, {
          'key': 46,
          'title': '删除',
          'parent_id': 25,
          'order': 0,
          'is_public': 0
        }, {
          'key': 47,
          'title': '修改状态',
          'parent_id': 25,
          'order': 0,
          'is_public': 0
        }, {
          'key': 64,
          'title': '查看列表',
          'parent_id': 25,
          'order': 0,
          'is_public': 0
        }]
      }, {
        'key': 26,
        'title': '账号管理',
        'parent_id': 1,
        'order': 0,
        'is_public': 0,
        'children': [{
          'key': 51,
          'title': '新增',
          'parent_id': 26,
          'order': 0,
          'is_public': 0
        }, {
          'key': 52,
          'title': '修改',
          'parent_id': 26,
          'order': 0,
          'is_public': 0
        }, {
          'key': 53,
          'title': '禁用',
          'parent_id': 26,
          'order': 0,
          'is_public': 0
        }, {
          'key': 54,
          'title': '停用',
          'parent_id': 26,
          'order': 0,
          'is_public': 0
        }, {
          'key': 55,
          'title': '重置密码',
          'parent_id': 26,
          'order': 0,
          'is_public': 0
        }, {
          'key': 65,
          'title': '查看列表',
          'parent_id': 26,
          'order': 0,
          'is_public': 0
        }]
      }]
    }, {
      'key': 18,
      'title': '工作台',
      'parent_id': 0,
      'order': 100,
      'is_public': 1,
      'children': [{
        'key': 56,
        'title': '学员',
        'parent_id': 18,
        'order': 0,
        'is_public': 0
      }, {
        'key': 57,
        'title': '课程',
        'parent_id': 18,
        'order': 0,
        'is_public': 0
      }, {
        'key': 58,
        'title': '试题',
        'parent_id': 18,
        'order': 0,
        'is_public': 0
      }, {
        'key': 59,
        'title': '首页',
        'parent_id': 18,
        'order': 0,
        'is_public': 0
      }]
    }, {
      'key': 27,
      'title': '运营',
      'parent_id': 0,
      'order': 0,
      'is_public': 0,
      'children': [{
        'key': 28,
        'title': '返现查询',
        'parent_id': 27,
        'order': 0,
        'is_public': 0
      }]
    }, {
      'key': 35,
      'title': '日志管理',
      'parent_id': 0,
      'order': 0,
      'is_public': 0,
      'children': [{
        'key': 36,
        'title': '登录日志',
        'parent_id': 35,
        'order': 0,
        'is_public': 0,
        'children': [{
          'key': 66,
          'title': '查看列表',
          'parent_id': 36,
          'order': 0,
          'is_public': 0
        }]
      }, {
        'key': 48,
        'title': '操作日志',
        'parent_id': 35,
        'order': 0,
        'is_public': 0,
        'children': [{
          'key': 67,
          'title': '查看列表',
          'parent_id': 48,
          'order': 0,
          'is_public': 0
        }]
      }, {
        'key': 49,
        'title': '异常登录',
        'parent_id': 35,
        'order': 0,
        'is_public': 0,
        'children': [{
          'key': 68,
          'title': '查看列表',
          'parent_id': 49,
          'order': 0,
          'is_public': 0
        }]
      }]
    }]
  }
  return {
    url: '/permission/menu/role-menus',
    data: record
  }
}
// 获取角色列表
export const userRoot = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': [59, 31, 61, 29, 30, 24, 32, 62, 35, 36, 66, 48, 67, 49, 68]
  }
  return {
    url: '/permission/role/assign-menu',
    data: record
  }
}
// 获取角色列表
export const bindRoot = () => {
  return {
    url: '/permission/role/bind-menu',
    data
  }
}
