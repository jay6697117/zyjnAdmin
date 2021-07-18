/*
 * 菜单管理模块
 */
// const data = {
//   'code': 0,
//   'msg': null,
//   'data': []
// }
// 查找菜单树
export const list = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': {
      'list': [
        {
          'name': 'gao',
          'hash_id': 'Y0Xqyk2J9Edkv3dB',
          'publishTime': 1560393938,
          'course_num': 5
        },
        {
          'name': 'gao',
          'hash_id': 'Y0Xqyk2J9Edkv3dB',
          'publishTime': 1560393938,
          'course_num': 5
        },
        {
          'name': 'gao',
          'hash_id': 'Y0Xqyk2J9Edkv3dB',
          'publishTime': 1560393938,
          'course_num': 5
        }
      ],
      'info': {
        'current_page': 1,
        'per_page': 10,
        'total': 10
      }
    }
  }
  return {
    url: '/product/list',
    data: record
  }
}
