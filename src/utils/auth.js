import store from '@/store'
import router from '@/router'
function install (Vue, option = {}) {
  let permissions = store.state.perms
  Vue.directive('auth', {
    bind: function (el, target) {
      let auth = router.app._route.meta.auth
      let result = false
      for (var item of target.value) {
        console.log(auth + ':' + item, permissions.indexOf(auth + ':' + item))
        if (permissions.indexOf(auth + ':' + item) !== -1) {
          result = true
        }
      }
      if (!result) {
        console.log('已移除', el.parentNode)
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  })
}
export default { install }
