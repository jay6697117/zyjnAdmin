<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <div class="header">
          <span class="title"><img :src="global.adminLogo" alt="" class="logo"> {{global.proName}} </span>
        </div>
        <div class="desc">让人才大有可为，让客户书写传奇</div>
      </div>
      <div class="login">
        <a-form @submit="onSubmit" :form="form">
          <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
          <a-form-item>
            <a-input size="large" placeholder="请输入账号"
              v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入账号', whitespace: true}]}
              ]"
            >
              <a-icon slot="prefix" type="user" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input size="large" placeholder="请输入密码" type="password"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码', whitespace: true}]}
              ]"
            >
              <a-icon slot="prefix" type="lock" />
            </a-input>
          </a-form-item>
          <div>
            <a-checkbox :checked="true" >自动登录</a-checkbox>
            <router-link :to="{path: '/forget'}">
              <a style="float: right">忘记密码</a>
            </router-link>
          </div>
          <a-form-item>
            <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import global from '@/utils/global'
export default {
  name: 'Login',
  data () {
    return {
      global,
      form: this.$form.createForm(this),
      logging: false,
      error: '',
      cookieLogin: this.global.NODE_ENV === 'production'
    }
  },
  created () {
    window.clearInterval(window.todoTimes)
  },
  methods: {
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.logging = true
          axios({
            url: this.global.baseUrl + this.global.prefix + 'user/login',
            method: 'post',
            headers: {
              Version: 'V1',
              'X-Requested-With': 'XMLHttpRequest'
            },
            data: {
              username: this.form.getFieldValue('name'),
              password: this.form.getFieldValue('password'),
              rfrom: 'admin',
              remember_me: 1
            }
          }).then(res => {
            this.logging = false
            if (res && res.data && !res.data.code) {
              res = res.data
              this.$message.success('登录成功', 3)
              // if (!this.cookieLogin) {
              this.$store.commit('setToken', res.data.token_type + ' ' + res.data.access_token)
              // }
              this.$router.push('/home/home')
              this.$api.user.info().then(res => {
                if (res && !res.code) {
                  this.$store.commit('setuser', res.data)
                }
              })
              this.$api.user.defaultSetting().then(res => {
                if (!res.code) {
                  this.$store.commit('setDefault', res.data)
                }
              })
            } else {
              this.$message.error(res.data.msg, 3)
            }
          }).catch(res => {
            this.logging = false
            this.$message.error('网络错误', 3)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
    background: #f0f2f5 url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg') no-repeat center 110px;
    background-size: 100%;
    .content {
      padding: 32px 0;
      flex: 1;
      @media (min-width: 768px){
        padding: 112px 0 24px;
      }
      .top {
        text-align: center;
        .header {
          height: 44px;
          line-height: 44px;
          a {
            text-decoration: none;
          }
          .logo {
            height: 40px;
            vertical-align: top;
          }
          .title {
            font-size: 28px;
            color: rgba(0,0,0,.85);
            font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0,0,0,.45);
          letter-spacing: 0.1em;
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }
      .login{
        width: 368px;
        margin: 0 auto;
        @media screen and (max-width: 576px) {
          width: 95%;
        }
        @media screen and (max-width: 320px) {
          .captcha-button{
            font-size: 14px;
          }
        }
        .icon {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.2);
          margin-left: 16px;
          vertical-align: middle;
          cursor: pointer;
          transition: color 0.3s;
          &:hover {
            color: #1890ff;
          }
        }
      }
    }
  }
</style>
