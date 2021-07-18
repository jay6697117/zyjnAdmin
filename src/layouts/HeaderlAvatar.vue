<template>
  <span>
    <a-dropdown style="display: inline-block; height: 100%; vertical-align: initial;text-align:right;" placement="bottomRight" >
      <span style="cursor: pointer;">
        <a-avatar class="avatar" :size="32" shape="circle" icon="user" :src="currUser.avatar"/>
        <span class="username">{{currUser.username}}</span>
      </span>
      <a-menu style="width: 150px" slot="overlay">
        <!-- <a-menu-item @click="gotoUserInfo">
          <a-icon type="user" />
          <span>个人中心</span>
        </a-menu-item> -->
        <!-- <a-menu-item>
          <a-icon type="setting" />
          <span>设置</span>
        </a-menu-item> -->
        <!-- <a-menu-divider />
        <a-menu-item @click="gotoChangePassword">
          <a-icon type="edit" />
          <span>修改密码</span>
        </a-menu-item> -->
        <a-menu-item @click="logout">
            <a-icon type="poweroff" />
            <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </span>
</template>

<script>
export default {
  name: 'HeaderAvatar',
  computed: {
    currUser () {
      return this.$store.state.user
    }
  },
  methods: {
    gotoChangePassword () {
      window.open(this.$store.state.user.webDomain + '/changePassword')
    },
    gotoUserInfo () {
      window.open(this.$store.state.user.webDomain + '/avatar/index')
    },
    logout () {
      if (this.global.NODE_ENV === 'production') {
        this.$api.login.cookieLogout()
      } else {
        this.$api.login.tokenLogout()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .avatar{
    margin: 16px 4px 16px 0;
    color: #1890ff;
    background: hsla(0,0%,100%,.85);
    vertical-align: middle;
  }
</style>
