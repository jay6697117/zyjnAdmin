/*
 * 账号管理模块
 */
// 账号列表
const data = {
  'code': 0,
  'msg': null,
  'data': []
}
export const list = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': {
      'list': [{
        'nickname': 'gao',
        'org_id': 5,
        'position': '开发',
        'entry_time': 1558368000,
        'created_time': 1560334683,
        'updated_time': 1560338202,
        'created_by': 45,
        'hash_user_id': 'Y0Xqyk2J9Edkv3dB',
        'created_name': '逗校长',
        'login_time': 1560393938,
        'role_ids': [4],
        'user': {
          'username': '高',
          'mobile': '13000000000',
          'status': 1,
          'avatar': '',
          'user_type': 3
        }
      }, {
        'nickname': '是否',
        'org_id': 6,
        'position': '品牌33',
        'entry_time': 1549036800,
        'created_time': 1560329159,
        'updated_time': 1560390658,
        'created_by': 45,
        'hash_user_id': 'Lma7MkKa90JOn0wp',
        'created_name': '逗校长',
        'login_time': 1560329243,
        'role_ids': [6, 4],
        'user': {
          'username': 'sdfsafs1',
          'mobile': '15415174111',
          'status': 1,
          'avatar': '',
          'user_type': 7
        }
      }, {
        'nickname': '昵称2',
        'org_id': 8,
        'position': '平民1',
        'entry_time': 1551542400,
        'created_time': 1560249715,
        'updated_time': 0,
        'created_by': 1411419,
        'hash_user_id': '8e9XL5ADKYXkGnvq',
        'created_name': 'haha',
        'login_time': '',
        'role_ids': [4, 1],
        'user': {
          'username': '王先生',
          'mobile': '13644066860',
          'status': 1,
          'avatar': '',
          'user_type': 3
        }
      }, {
        'nickname': '昵称2',
        'org_id': 8,
        'position': '平民',
        'entry_time': 1551542400,
        'created_time': 1560245491,
        'updated_time': 0,
        'created_by': 1411419,
        'hash_user_id': 'zrEgMkZ8K7nO6daW',
        'created_name': 'haha',
        'login_time': '',
        'role_ids': [4],
        'user': {
          'username': '王先生',
          'mobile': '13644066820',
          'status': 1,
          'avatar': '',
          'user_type': 3
        }
      }, {
        'nickname': '石大强',
        'org_id': 1,
        'position': 'PHP开发工程师',
        'entry_time': 1560182400,
        'created_time': 1560240309,
        'updated_time': 0,
        'created_by': 720,
        'hash_user_id': 'xd3DRoz1dWAO1mKB',
        'created_name': 'shaonan',
        'login_time': 1560331391,
        'role_ids': [3],
        'user': {
          'username': '小强',
          'mobile': '19010203040',
          'status': 1,
          'avatar': '',
          'user_type': 4
        }
      }, {
        'nickname': '昵称2',
        'org_id': 8,
        'position': '平民',
        'entry_time': 1551542400,
        'created_time': 1560235592,
        'updated_time': 1560239098,
        'created_by': 1411419,
        'hash_user_id': '0pzyXoW8ZXEkqNDB',
        'created_name': 'haha',
        'login_time': '',
        'role_ids': [],
        'user': {
          'username': '王先生',
          'mobile': '13644066827',
          'status': 1,
          'avatar': '',
          'user_type': 3
        }
      }, {
        'nickname': '昵称2',
        'org_id': 8,
        'position': '平民',
        'entry_time': 1551542400,
        'created_time': 1560235551,
        'updated_time': 1560239105,
        'created_by': 1411419,
        'hash_user_id': 'EjvBAkajdvj5MVe0',
        'created_name': 'haha',
        'login_time': '',
        'role_ids': [],
        'user': {
          'username': '王先生',
          'mobile': '13644066828',
          'status': 1,
          'avatar': '',
          'user_type': 3
        }
      }, {
        'nickname': 'sdfsa111',
        'org_id': 1,
        'position': '品牌1',
        'entry_time': 1549036800,
        'created_time': 1560161279,
        'updated_time': 1560249672,
        'created_by': 1411419,
        'hash_user_id': 'JEw93o1r3gykvg4z',
        'created_name': 'haha',
        'login_time': '',
        'role_ids': [1],
        'user': {
          'username': 'sdfsafs1',
          'mobile': '13640527500',
          'status': 1,
          'avatar': '',
          'user_type': 3
        }
      }, {
        'nickname': '昵称2',
        'org_id': 2,
        'position': '平民',
        'entry_time': 1551542400,
        'created_time': 1560158704,
        'updated_time': 1560163970,
        'created_by': 1411419,
        'hash_user_id': 'VBbL8OMzpEqoP20Y',
        'created_name': 'haha',
        'login_time': '',
        'role_ids': [],
        'user': {
          'username': '王先生',
          'mobile': '13641066828',
          'status': 1,
          'avatar': '',
          'user_type': 3
        }
      }, {
        'nickname': '昵称1',
        'org_id': 2,
        'position': '平民',
        'entry_time': 1551542400,
        'created_time': 1560158283,
        'updated_time': 1560163353,
        'created_by': 1411419,
        'hash_user_id': 'pr9GD5yM6X156JbA',
        'created_name': 'haha',
        'login_time': '',
        'role_ids': [],
        'user': {
          'username': '许先生',
          'mobile': '13641076828',
          'status': 1,
          'avatar': '',
          'user_type': 3
        }
      }],
      'info': {
        'current_page': 1,
        'per_page': 10,
        'total': 10
      }
    }
  }
  return {
    url: '/staff/all',
    data: record
  }
}
// 新增账号
export const insert = () => {
  return {
    url: '/staff/store',
    data
  }
}
// 编辑账号
export const update = () => {
  return {
    url: '/staff/update',
    data
  }
}
// 停用账号
export const stop = () => {
  return {
    url: '/staff/stopUsing',
    data
  }
}
// 重置密码
export const reset = () => {
  return {
    url: '/staff/resetPassword',
    data
  }
}
// 禁止登陆
export const prohibit = () => {
  return {
    url: '/staff/prohibitLogin',
    data
  }
}
// 获取部门列表
export const typeList = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': [{
      'value': 2,
      'key': 2,
      'title': '授课教师'
    }, {
      'value': 3,
      'key': 3,
      'title': '管理员'
    }, {
      'value': 4,
      'key': 4,
      'title': '教研'
    }, {
      'value': 6,
      'key': 6,
      'title': '规划师'
    }, {
      'value': 7,
      'key': 7,
      'title': '批改员'
    }]
  }
  return {
    url: '/staff/userTypes',
    data: record
  }
}
