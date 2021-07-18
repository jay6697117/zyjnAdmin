/*
 * 日志管理模块
 */
// 获取登录日志
export const findLogEnter = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': {
      'list': [{
        'id': 142,
        'message': '登录成功',
        'user_id': 45,
        'ip': '192.168.1.15',
        'area': '本地ip',
        'browser': 'Chrome 73.0.3683.86',
        'platform': 'Windows 10.0',
        'status': 1,
        'created_time': 1560408801,
        'user': {
          'mobile': '18254355732'
        }
      }, {
        'id': 141,
        'message': '登录成功',
        'user_id': 45,
        'ip': '192.168.1.15',
        'area': '本地ip',
        'browser': 'Chrome 73.0.3683.86',
        'platform': 'Windows 10.0',
        'status': 1,
        'created_time': 1560408649,
        'user': {
          'mobile': '18254355732'
        }
      }, {
        'id': 140,
        'message': '登录成功',
        'user_id': 1411499,
        'ip': '192.168.1.15',
        'area': '本地ip',
        'browser': 'Chrome 74.0.3729.169',
        'platform': 'Windows 10.0',
        'status': 1,
        'created_time': 1560393938,
        'user': {
          'mobile': '13000000000',
          'org_name': '开发1组'
        }
      }, {
        'id': 139,
        'message': '登录成功',
        'user_id': 45,
        'ip': '192.168.1.15',
        'area': '本地ip',
        'browser': 'Chrome 73.0.3683.86',
        'platform': 'Windows 10.0',
        'status': 1,
        'created_time': 1560388437,
        'user': {
          'mobile': '18254355732'
        }
      }, {
        'id': 138,
        'message': '登录成功',
        'user_id': 45,
        'ip': '192.168.1.6',
        'area': '本地ip',
        'browser': 'Chrome 73.0.3683.86',
        'platform': 'Windows 10.0',
        'status': 1,
        'created_time': 1560387802,
        'user': {
          'mobile': '18254355732'
        }
      }, {
        'id': 137,
        'message': '登录成功',
        'user_id': 45,
        'ip': '192.168.1.6',
        'area': '本地ip',
        'browser': 'Chrome 73.0.3683.86',
        'platform': 'Windows 10.0',
        'status': 1,
        'created_time': 1560346625,
        'user': {
          'mobile': '18254355732'
        }
      }, {
        'id': 136,
        'message': '登录成功',
        'user_id': 1411499,
        'ip': '192.168.1.15',
        'area': '本地ip',
        'browser': 'Chrome 73.0.3683.86',
        'platform': 'Windows 10.0',
        'status': 1,
        'created_time': 1560341266,
        'user': {
          'mobile': '13000000000',
          'org_name': '开发1组'
        }
      }, {
        'id': 135,
        'message': '登录成功',
        'user_id': 45,
        'ip': '192.168.1.15',
        'area': '本地ip',
        'browser': 'Chrome 73.0.3683.86',
        'platform': 'Windows 10.0',
        'status': 1,
        'created_time': 1560341239,
        'user': {
          'mobile': '18254355732'
        }
      }, {
        'id': 134,
        'message': '密码错误',
        'user_id': 1411494,
        'ip': '127.0.0.1',
        'area': '本地ip',
        'browser': ' ',
        'platform': ' ',
        'status': 2,
        'created_time': 1560338266,
        'user': {
          'mobile': '19010203040',
          'org_name': '财务部1'
        }
      }, {
        'id': 133,
        'message': '登录成功',
        'user_id': 45,
        'ip': '192.168.1.15',
        'area': '本地ip',
        'browser': 'Chrome 73.0.3683.86',
        'platform': 'Windows 10.0',
        'status': 1,
        'created_time': 1560336717,
        'user': {
          'mobile': '18254355732'
        }
      }],
      'info': {
        'current_page': 1,
        'per_page': 10,
        'total': 107
      }
    }
  }
  return {
    url: '/log/loginLogs',
    data: record
  }
}
// 获取操作日志
export const findLogOperate = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': {
      'list': [{
        'log_id': 271056,
        'message': 'zyx吧登录成功',
        'ip': '127.0.0.1',
        'created_time': 1560434629,
        'module': 'user',
        'user_id': 720,
        'area': '本地ip',
        'type': 1,
        'user': {
          'user_id': 720,
          'username': 'shaonan'
        }
      }, {
        'log_id': 32432054,
        'message': '1',
        'ip': '0.0.0.0',
        'created_time': 1560408842,
        'module': 'lesson',
        'user_id': 0,
        'area': '本地ip',
        'type': 1,
        'user': null
      }, {
        'log_id': 32432053,
        'message': '1',
        'ip': '0.0.0.0',
        'created_time': 1560408842,
        'module': 'lesson',
        'user_id': 0,
        'area': '本地ip',
        'type': 1,
        'user': null
      }, {
        'log_id': 32432052,
        'message': '1',
        'ip': '0.0.0.0',
        'created_time': 1560408842,
        'module': 'lesson',
        'user_id': 0,
        'area': '本地ip',
        'type': 1,
        'user': null
      }, {
        'log_id': 32432051,
        'message': '1',
        'ip': '0.0.0.0',
        'created_time': 1560408842,
        'module': 'lesson',
        'user_id': 0,
        'area': '本地ip',
        'type': 1,
        'user': null
      }, {
        'log_id': 32432050,
        'message': '1',
        'ip': '0.0.0.0',
        'created_time': 1560408842,
        'module': 'lesson',
        'user_id': 0,
        'area': '本地ip',
        'type': 1,
        'user': null
      }, {
        'log_id': 32432049,
        'message': '1',
        'ip': '0.0.0.0',
        'created_time': 1560408842,
        'module': 'lesson',
        'user_id': 0,
        'area': '本地ip',
        'type': 1,
        'user': null
      }, {
        'log_id': 32432048,
        'message': '1',
        'ip': '0.0.0.0',
        'created_time': 1560408842,
        'module': 'lesson',
        'user_id': 0,
        'area': '本地ip',
        'type': 1,
        'user': null
      }, {
        'log_id': 32432047,
        'message': '1',
        'ip': '0.0.0.0',
        'created_time': 1560408842,
        'module': 'lesson',
        'user_id': 0,
        'area': '本地ip',
        'type': 1,
        'user': null
      }, {
        'log_id': 32432046,
        'message': '1',
        'ip': '0.0.0.0',
        'created_time': 1560408842,
        'module': 'lesson',
        'user_id': 0,
        'area': '本地ip',
        'type': 1,
        'user': null
      }],
      'info': {
        'current_page': 1,
        'per_page': 10,
        'total': 32430827
      }
    }
  }
  return {
    url: '/log/operationLogs',
    data: record
  }
}
// 获取错误日志
// export const findLogError = () => {
//   return {
//     url: '/log/loginLogs',
//     data
//   }
// }
