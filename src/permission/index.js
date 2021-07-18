import store from '@/store'
import router from '@/router'
/**
 * 判断用户是否拥有操作权限
 * 根据传入的权限标识，查看是否存在用户权限标识集合
 * @param perms
 */
function power (perms) {
  let permissions = store.state.perms
  let auth = router.app._route.meta.auth
  if (typeof perms === 'string') {
    return permissions.indexOf(perms.indexOf(':') < 0 ? (auth + ':' + perms) : perms) > -1
  }
  let result = true
  for (var item of perms) {
    if (permissions.indexOf(item.indexOf(':') < 0 ? (auth + ':' + item) : item) < 0) {
      result = false
    }
  }
  return result
}

export default power
