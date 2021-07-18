export default {
  state: {
    perms: [], // 用户前台界面访问权限标识集合
    apis: [] // 用户后台api访问权限标识集合
  },
  getters: {

  },
  mutations: {
    setPerms (state, perms) { // 用户前台界面访问权限标识集合
      console.log('页面权限集合：', perms)
      state.perms = perms
    },
    setApis (state, perms) { // 用户后台api访问权限标识集合
      console.log('接口访问权限集合：', perms)
      state.apis = perms
    }
  },
  actions: {
  }
}
