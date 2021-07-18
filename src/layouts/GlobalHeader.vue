<template>
  <a-layout-header :class="[theme, 'global-header']">
    <div :class="['global-header-wide', layout]">
      <a-icon v-if="!collapsed && isMobile" class="trigger" type="menu-unfold" @click="toggleCollapse"/>
      <a-icon v-if="collapsed && !isMobile" class="trigger" type="menu-unfold" @click="toggleCollapse"/>
      <a-breadcrumb class="global-header-left" v-if="!isMobile">
        <a-breadcrumb-item v-for="(item, index) in origin" :key="index">
          <span v-if="index === origin.length-1">{{item.path === '/operation/banner/edit' ? (bannerItem.typeName + '基本信息') : item.name}}</span>
          <router-link :to="item.path" v-else>{{item.name}}</router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div :class="['global-header-right', theme]">
          <header-search class="header-item" v-if="false" />
          <a-tooltip class="header-item" title="你有新的消息" placement="bottom" v-if="false">
            <a>
              <a-icon type="question-circle-o" />
            </a>
          </a-tooltip>
          <a-badge :count="todos" :overflowCount="99" title="你有新的消息" style="vertical-align: middle;" v-if="!user.isSuper" @click="gotoMessage">
            <a v-if="!user.isDeveloper"><a-icon type="bell" style="font-size:24px" /></a>
          </a-badge>
          <header-notice class="header-item" v-if="false"/>
          <header-avatar class="header-item"/>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import HeaderSearch from './HeaderSearch'
import HeaderNotice from './HeaderNotice'
import HeaderAvatar from './HeaderlAvatar'

export default {
  name: 'GlobalHeader',
  components: {HeaderAvatar, HeaderNotice, HeaderSearch},
  props: ['collapsed', 'menuData'],
  data () {
    return {
      origin: []
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    todos () {
      return this.$store.state.todos
    },
    bannerItem () {
      return this.$store.state.bannerItem
    },
    isMobile () {
      return this.$store.state.isMobile
    },
    layout () {
      return this.$store.state.layout
    },
    theme () {
      return this.layout === 'side' ? 'light' : this.$store.state.theme
    },
    systemName () {
      return this.$store.state.systemName
    }
  },
  watch: {
    '$route': function (newRoute) {
      this.initOrigin(newRoute)
    }
  },
  mounted () {
    this.initOrigin(this.$route)
    this.getTodos()
    window.clearInterval(window.todoTimes)
    window.todoTimes = setInterval(() => {
      this.getTodos()
    }, 10000)
  },
  methods: {
    getTodos () {
      this.$api.message.todo().then(res => {
        this.$store.commit('setTodos', res.data.unreadTotal)
      })
    },
    gotoMessage () {
      this.$router.push({
        path: '/message/list'
      })
    },
    initOrigin (route) {
      if (route.query.orgid) {
        this.origin = [{
          name: '组织管理',
          path: '/sys/org'
        }, {
          name: `${route.name}(${route.query.orgName})`
        }]
      } else {
        this.origin = route.meta.origin.map((item) => {
          item.path = item.path.indexOf('/') > 0 ? ('/' + item.path) : item.path
          return item
        }) || []
      }
    },
    toggleCollapse () {
      this.$emit('toggleCollapse')
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less" scoped>
  .trigger {
    font-size: 20px;
    line-height: 64px;
    padding: 0 0 0 24px;
    cursor: pointer;
    transition: color .3s;
    float: left;
    &:hover{
      color: #1890ff;
    }
  }
  .header-item{
    padding: 0 12px;
    display: inline-block;
    height: 100%;
    cursor: pointer;
    vertical-align: middle;
    i{
      font-size: 16px;
      color: rgba(0,0,0,.65);
    }
  }
  .global-header{
    padding: 0 12px 0 0;
    -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    position: relative;
    &.light{
      background: #fff;
    }
    &.dark{
      background: #001529;
    }
    .global-header-wide{
      height: 100%;
      &.head{
        max-width: 1400px;
        margin: auto;
      }
      .logo {
        height: 64px;
        line-height: 58px;
        vertical-align: top;
        display: inline-block;
        padding: 0 12px 0 24px;
        cursor: pointer;
        font-size: 20px;
        &.pc{
          padding: 0 12px 0 0;
        }
        img {
          display: inline-block;
          vertical-align: middle;
        }
        h1{
          display: inline-block;
          font-size: 16px;
        }
        &.dark h1{
          color: #fff;
        }
      }
      .global-header-menu{
        display: inline-block;
      }
      .global-header-left{
        float: left;
        height: 100%;
        padding: 20px;
      }
      .global-header-right{
        float: right;
        &.dark{
          color: #fff;
          i{
            color: #fff;
          }
        }
      }
    }
  }
</style>
