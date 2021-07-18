<template>
  <a-layout-sider :class="[theme, 'sider', isMobile ? null : 'shadow']" width="240px" :collapsible="collapsible" v-model="collapsed" :trigger="null">
    <div :class="['logo', theme]">
      <router-link to="/home/home">
        <img class="small" :src="global.adminLogo">
        <img class="big" :src="global.adminLogoBig">
      </router-link>
      <a-icon v-if="!collapsed" class="trigger" type="menu-fold" @click="toggleCollapse"/>
    </div>
    <a-menu
      :selectedKeys="selectedKeys"
      :openKeys="openKeys"
      :defaultSelectedKeys="defaultSelectedKeys"
      mode="inline"
      :theme="theme"
      :inlineCollapsed="collapsed"
      @click="checkMenu"
    >
      <template v-for="item in menuData">
        <a-menu-item v-if="item.type === 1 && !item.is_hide" :key="item.authorization_sign" :data-path="item.path">
          <a-icon :type="item.icon" /><span>{{item.name}}</span>
        </a-menu-item>
        <sub-menu v-else :menu-info="item" :key="item.authorization_sign" @open="openMenu" />
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import SubMenu from './SubMenu'
import global from '@/utils/global'
export default {
  name: 'SiderMenu',
  data () {
    return {
      global,
      selectedKeys: ['home'],
      defaultSelectedKeys: [],
      openKeys: []
    }
  },
  components: {
    SubMenu
  },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  computed: {
    isMobile () {
      return this.$store.state.isMobile
    },
    layout () {
      return this.$store.state.layout
    },
    systemName () {
      return this.$store.state.systemName
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.menuData.map(item => {
        if (this.$route.meta.auth.indexOf(item.authorization_sign) === 0) {
          this.openKeys.push(item.authorization_sign)
        }
      })
      if (this.$route.meta.origin[0].auth) {
        this.selectedKeys = [this.$route.meta.origin[0].auth]
      }
    })
  },
  watch: {
    '$route': function (route) {
      this.$nextTick(() => {
        this.menuData.map(item => {
          if (this.$route.meta.auth.indexOf(item.authorization_sign) === 0 && !this.openKeys.includes(item.authorization_sign)) {
            this.openKeys.push(item.authorization_sign)
          }
        })
        this.selectedKeys = [this.$route.meta.origin[0].auth]
      })
    }
  },
  methods: {
    openMenu (item) {
      console.log(item.authorization_sign)
      if (this.openKeys.indexOf(item.authorization_sign) < 0) {
        this.openKeys.push(item.authorization_sign)
      } else {
        this.openKeys.splice(this.openKeys.indexOf(item.authorization_sign), 1)
      }
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    toggleCollapse () {
      this.$emit('toggleCollapse')
    },
    getPath (node) {
      if (!node) return
      if (node.getAttribute('data-path')) {
        return node.getAttribute('data-path')
      } else {
        return this.getPath(node.parentNode)
      }
    },
    checkMenu (item) { // 打开菜单
      this.$store.commit('setCollapsed', false)
      let target = item.domEvent.target
      // console.log(this.getPath(target))
      let path = this.getPath(target)
      if (path !== '/Laboratory') {
        this.$router.push(path)
      } else {
        window.open('#' + path)
      }
      // this.$router.push('/home/home')
    }
  }
}
</script>

<style lang="less" scoped>
  .trigger {
    font-size: 20px;
    line-height: 40px;
    padding: 0 10px;
    cursor: pointer;
    color: #fff;
    transition: color .3s;
    margin-top: 16px;
    float: right;
    &:hover{
      color: #1890ff;
    }
  }
  .ant-layout-sider-collapsed{
    .ant-menu-item:hover,
    .ant-menu-item-active,
    .ant-menu-submenu-active,
    .ant-menu-submenu-open,
    .ant-menu-submenu-selected,
    .ant-menu-submenu-title:hover{
      color: #1890ff;
    }
  }
  .ant-menu-submenu-open {
     .anticon{
       color: #1890ff;
     }
  }
  .shadow{
    box-shadow: 2px 0 6px rgba(0,21,41,.35);
  }
  .sider{
    z-index: 10;
    &.light{
      background-color: #fff;
    }
    &.dark{
      background: rgb(22, 30, 66)
    }
    .logo{
      height: 64px;
      position: relative;
      line-height: 64px;
      padding-left: 24px;
      -webkit-transition: all .3s;
      transition: all .3s;
      overflow: hidden;
      &.light{
        background-color: #fff;
        h1{
          color: #1890ff;
        }
      }
      &.dark{
        background: none;
        h1{
          color: #fff;
        }
      }
      a {
        float: left;
      }
      h1{
        color: #fff;
        font-size: 20px;
        margin: 0 0 0 12px;
        font-family: "Myriad Pro","Helvetica Neue",Arial,Helvetica,sans-serif;
        font-weight: 600;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
      }
      img{
        display: inline-block;
        vertical-align: middle;
      }
      img.small{
        width: 30px;
        margin-right: 6px;
      }
      img.big{
        width: 125px;
      }
    }
  }
  .menu{
    padding: 16px 0;
  }
  .ant-menu-item{
    span{font-size: 14px;}
  }
</style>
