/*
 * 机构管理模块
 */
const data = {
  'code': 0,
  'msg': null,
  'data': []
}
// 查询机构树
export const list = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': [{
      'id': 1,
      'parent_id': 0,
      'name': '财务部1',
      'type': 1,
      'leader_user_id': 8,
      'is_show': 1,
      'order': 0,
      'remark': '111',
      'created_time': 0,
      'updated_time': 1560234205,
      'created_by': 1411419,
      'number': 6,
      'leader_username': '用户_晨念安_rm00frure',
      'leader_mobile': 'u_9utegshic',
      'children': [{
        'id': 4,
        'parent_id': 1,
        'name': '财务部',
        'type': 1,
        'leader_user_id': 8,
        'is_show': 1,
        'order': 1,
        'remark': '',
        'created_time': 1560233353,
        'updated_time': 1560233556,
        'created_by': 1411419,
        'number': 4,
        'leader_username': '用户_晨念安_rm00frure',
        'leader_mobile': 'u_9utegshic'
      }, {
        'id': 5,
        'parent_id': 1,
        'name': '开发1组',
        'type': 2,
        'leader_user_id': 32,
        'is_show': 1,
        'order': 0,
        'remark': '我是开发1组',
        'created_time': 1560328440,
        'updated_time': 1560328440,
        'created_by': 720,
        'number': 8,
        'leader_username': '猪小三',
        'leader_mobile': '18511896475'
      }]
    }, {
      'id': 2,
      'parent_id': 0,
      'name': '运营部',
      'type': 1,
      'leader_user_id': 34,
      'is_show': 0,
      'order': 0,
      'remark': '',
      'created_time': 1559809054,
      'updated_time': 1560329051,
      'created_by': 45,
      'number': 8,
      'leader_username': '陈老',
      'leader_mobile': '18511896472',
      'children': [{
        'id': 10,
        'parent_id': 2,
        'name': '运营二组',
        'type': 2,
        'leader_user_id': 32,
        'is_show': 0,
        'order': 100,
        'remark': '阿斯顿发放到',
        'created_time': 1560328836,
        'updated_time': 1560329051,
        'created_by': 720,
        'number': 4,
        'leader_username': '猪小三',
        'leader_mobile': '18511896475',
        'children': [{
          'id': 8,
          'parent_id': 10,
          'name': 'test组',
          'type': 2,
          'leader_user_id': 32,
          'is_show': 0,
          'order': 0,
          'remark': '456',
          'created_time': 1560328767,
          'updated_time': 1560329051,
          'created_by': 45,
          'number': 8,
          'leader_username': '猪小三',
          'leader_mobile': '18511896475',
          'children': [{
            'id': 9,
            'parent_id': 8,
            'name': 'test111',
            'type': 2,
            'leader_user_id': 32,
            'is_show': 0,
            'order': 0,
            'remark': '789',
            'created_time': 1560328821,
            'updated_time': 1560329051,
            'created_by': 45,
            'number': 8,
            'leader_username': '猪小三',
            'leader_mobile': '18511896475'
          }, {
            'id': 12,
            'parent_id': 8,
            'name': 'test222',
            'type': 2,
            'leader_user_id': 32,
            'is_show': 0,
            'order': 0,
            'remark': 'asfasfasfasfsf',
            'created_time': 1560328914,
            'updated_time': 1560329051,
            'created_by': 720,
            'number': 8,
            'leader_username': '猪小三',
            'leader_mobile': '18511896475'
          }]
        }]
      }, {
        'id': 11,
        'parent_id': 2,
        'name': '二部',
        'type': 1,
        'leader_user_id': 32,
        'is_show': 0,
        'order': 1,
        'remark': '阿斯顿发顺丰打算',
        'created_time': 1560328861,
        'updated_time': 1560329051,
        'created_by': 720,
        'number': 4,
        'leader_username': '猪小三',
        'leader_mobile': '18511896475'
      }, {
        'id': 6,
        'parent_id': 2,
        'name': '运营一组',
        'type': 2,
        'leader_user_id': 32,
        'is_show': 0,
        'order': 0,
        'remark': '我是运营一组',
        'created_time': 1560328609,
        'updated_time': 1560329051,
        'created_by': 720,
        'number': 8,
        'leader_username': '猪小三',
        'leader_mobile': '18511896475'
      }, {
        'id': 7,
        'parent_id': 2,
        'name': '运营一部',
        'type': 1,
        'leader_user_id': 32,
        'is_show': 0,
        'order': 0,
        'remark': '运营一部111',
        'created_time': 1560328668,
        'updated_time': 1560329051,
        'created_by': 720,
        'number': 8,
        'leader_username': '猪小三',
        'leader_mobile': '18511896475'
      }]
    }]
  }
  return {
    url: '/organization/all',
    data: record
  }
}
// 查询负责人
export const getLeader = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': [{
      'leader_user_id': 32,
      'leader_username': '猪小三',
      'leader_mobile': '18511896475'
    }, {
      'leader_user_id': 1411323,
      'leader_username': '003号',
      'leader_mobile': '18511896403'
    }, {
      'leader_user_id': 34,
      'leader_username': '陈老',
      'leader_mobile': '18511896472'
    }, {
      'leader_user_id': 82,
      'leader_username': '一高',
      'leader_mobile': '18210385491'
    }, {
      'leader_user_id': 110,
      'leader_username': '实验老师',
      'leader_mobile': '18210382222'
    }, {
      'leader_user_id': 127,
      'leader_username': '马卉',
      'leader_mobile': '13811668622'
    }, {
      'leader_user_id': 614,
      'leader_username': '哈哈哈',
      'leader_mobile': '19611896470'
    }, {
      'leader_user_id': 625,
      'leader_username': '测试复制',
      'leader_mobile': '19910382791'
    }, {
      'leader_user_id': 652,
      'leader_username': '陈锁',
      'leader_mobile': '18254355736'
    }, {
      'leader_user_id': 657,
      'leader_username': '化教1',
      'leader_mobile': '18618321004'
    }, {
      'leader_user_id': 663,
      'leader_username': '政教1',
      'leader_mobile': '18618321010'
    }, {
      'leader_user_id': 1411317,
      'leader_username': 'cs批改员',
      'leader_mobile': '18511896496'
    }, {
      'leader_user_id': 1411318,
      'leader_username': 'cs批改员1',
      'leader_mobile': '18511896497'
    }, {
      'leader_user_id': 1411437,
      'leader_username': '梦批改员开发',
      'leader_mobile': '13641096926'
    }, {
      'leader_user_id': 1411498,
      'leader_username': 'sdfsafs1',
      'leader_mobile': '15415174111'
    }, {
      'leader_user_id': 45,
      'leader_username': '逗校长',
      'leader_mobile': '18254355732'
    }]
  }
  return {
    url: '/organization/getChargePeoples',
    data: record
  }
}
// 修改状态显示隐藏
export const changeState = () => {
  return {
    url: '/organization/updateStatus',
    data
  }
}
// 删除部门或小组
export const deleteOrg = () => {
  return {
    url: '/organization/delete',
    data
  }
}
// 创建新部门或小组
export const insertOrg = () => {
  return {
    url: '/organization/insert',
    data
  }
}
// 修改新部门或小组
export const updateOrg = () => {
  return {
    url: '/organization/update',
    data
  }
}
