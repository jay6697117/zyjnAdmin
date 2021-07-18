<template>
  <a-layout>
    <drawer v-if="isMobile" :openDrawer="collapsed" @change="onDrawerChange">
      <sider-menu :theme="theme" :menuData="menuData" :collapsed="false" :collapsible="false" @menuSelect="onMenuSelect" @toggleCollapse="toggleCollapse"/>
    </drawer>
    <sider-menu :theme="theme" v-else-if="layout === 'side'" :menuData="menuData" :collapsed="collapsed" :collapsible="true" @toggleCollapse="toggleCollapse" />
    <a-layout>
      <global-header :menuData="menuData" :collapsed="collapsed" @toggleCollapse="toggleCollapse"/>
      <a-layout-content class="adminContent" :style="{minHeight: minHeight}">
        <router-view />
      </a-layout-content>
      <a-layout-footer style="padding: 0px">
        <global-footer :link-list="linkList" :copyright="copyright" />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import GlobalHeader from './GlobalHeader'
import GlobalFooter from './GlobalFooter'
import Drawer from '../components/tool/Drawer'
import SiderMenu from '../components/menu/SiderMenu'

const minHeight = window.innerHeight - 64 - 93 - 12

export default {
  name: 'GlobalLayout',
  components: {SiderMenu, Drawer, GlobalFooter, GlobalHeader},
  data () {
    return {
      minHeight: minHeight + 'px'
    }
  },
  computed: {
    collapsed () {
      return this.$store.state.collapsed
    },
    menuData () {
      return this.$store.state.navTree
    },
    isMobile () {
      return this.$store.state.isMobile
    },
    theme () {
      return this.$store.state.theme
    },
    layout () {
      return this.$store.state.layout
    },
    linkList () {
      return this.$store.state.footerLinks
    },
    copyright () {
      return this.$store.state.copyright
    }
  },
  methods: {
    toggleCollapse () {
      this.$store.commit('setCollapsed', !this.collapsed)
    },
    onDrawerChange (show) {
      this.$store.commit('setCollapsed', show)
    },
    onMenuSelect () {
      this.toggleCollapse()
    }
  }
}
</script>

<style>
  .ant-layout{background: #f5f7fa}
  .adminContent{margin: 12px 12px 0;padding: 12px;background: #fff; display: flex; flex-direction: column;}
</style>
