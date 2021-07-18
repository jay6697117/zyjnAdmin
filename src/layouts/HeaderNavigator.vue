<template>
  <div class="navigator">
    <div :class="topNav === item.ident ? 'on' : ''" class="nav" v-for="(item, index) in menuData" :key="index" @click="changeMenu(item)" v-show="!item.is_hide">{{item.name}}</div>
  </div>
</template>

<script>
export default {
  name: 'HeaderNavigator',
  data () {
    return {
      topNav: 'home'
    }
  },
  computed: {
    menuData () {
      var navTree = this.$store.state.navTree
      var data = []
      for (var i in navTree) {
        data.push({
          name: navTree[i].name,
          id: navTree[i].id,
          is_hide: navTree[i].is_hide,
          ident: navTree[i].authorization_sign
        })
      }
      return data
    }
  },
  watch: {
    $route (to, from) {
      this.topNav = to.path.split('/')[1]
    }
  },
  mounted () {
    this.topNav = this.$route.path.split('/')[1]
  },
  methods: {
    changeMenu (item) {
      this.topNav = item.ident
      this.$store.commit('setCurrentNav', item.id)
    }
  }
}
</script>

<style lang="less" scoped>
  .navigator{flex:1}
  .ant-btn{margin-right: 10px;}
  .navigator{
    overflow: hidden;
    .nav{
      float: left;
      padding: 0 20px;
      color: #fff;
      cursor: pointer;
    }
    .on{
      background: #0975c7;
    }
  }
</style>
