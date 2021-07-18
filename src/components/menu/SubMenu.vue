<template>
  <a-sub-menu :key="menuInfo.authorization_sign" v-bind="$props" v-on="$listeners" v-if="!menuInfo.is_hide" @openChange="open(menuInfo)">
    <span slot="title" v-if="menuInfo.type === 1 || menuInfo.type === 0">
      <a-icon :type="menuInfo.icon" /><span>{{ menuInfo.name }}</span>
    </span>
    <template v-for="item in menuInfo.children">
      <a-menu-item v-if="(!item.children || item.type === 1) && !item.is_hide" :key="item.authorization_sign" :data-path="item.path">
        <a-icon :type="item.icon" />
        <span>{{ item.name }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.authorization_sign" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
import { Menu } from 'ant-design-vue'
export default {
  name: 'SubMenu',
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    menuInfo: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    open (item) {
      this.$emit('open', item)
    }
  }
}
</script>
<style lang="less">
#app{
  .ant-menu{background: none;box-shadow:none;}
}
</style>
