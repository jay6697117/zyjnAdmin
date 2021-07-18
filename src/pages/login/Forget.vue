<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <div class="header">
          <span class="title">{{global.proName}}</span>
        </div>
        <div class="desc">梦想每天从这里启航</div>
      </div>
      <div class="forgetOne">
        <a-form @submit="onForget" :form="form">
          <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
          <a-form-item>
            <a-input size="large" placeholder="请输入手机号" :maxLength="11"
              v-decorator="[
                'mobile',
                {rules: [{ required: true, message: '请输入手机号', whitespace: true}]}
              ]"
            >
              <a-icon slot="prefix" type="phone" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input size="large" placeholder="请输入右侧验证码" style="width:228px"
              v-decorator="[
                'captcha_code',
                {rules: [{ required: true, message: '请输入右侧验证码', whitespace: true}]}
              ]"
            >
              <a-icon slot="prefix" type= "message" />
            </a-input>
            <img :src="captchaImg" alt="图形验证码" class="captchaImg" @click="getPic">
          </a-form-item>
          <a-form-item>
              <a-input size="large" placeholder="请输入短信验证码" style="width:228px"
                v-decorator="[
                  'sms_code',
                  {rules: [{ required: true, message: '请输入短信验证码', whitespace: true}]}
                ]"
              >
                <a-icon slot="prefix" type= "mail" />
              </a-input>
              <a-button style="width:120px;margin-left:20px;height:40px;" @click="sendMessage" class="sendButton">{{buttonText}}</a-button>
          </a-form-item>
          <a-form-item>
            <a-input size="large" placeholder="请输入新密码" type="password"
            v-decorator="[
              'newpassword',
              {
                rules: [{
                  required: true, message: '请输入新密码!',
                }, {
                  validator: validateToNextPassword,
                }],
              }
            ]"
            >
              <a-icon slot="prefix" type="lock" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input size="large" placeholder="确认新密码" type="password"
              v-decorator="[
                'password_confirmation',
                {
                  rules: [{
                    required: true, message: '确认新密码!',
                  }, {
                    validator: compareToFirstPassword,
                  }],
                }
              ]"
              @blur="handleConfirmBlur"
            >
              <a-icon slot="prefix" type="lock" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button :loading="logging" block size="large" type="primary" @click='onForget'>找回密码</a-button>
          </a-form-item>
          <a-form-item>
            <a-button block size="large" @click="back">返回</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
const type = 'forget_password'
const buttonText = '获取验证码'
const time = 60
export default {
  name: 'Login',
  components: {},
  data () {
    return {
      form: this.$form.createForm(this),
      logging: false,
      error: '',
      captchaImg: '',
      captcha_key: '',
      complete: false,
      buttonText,
      time,
      thimer: null,
      confirmDirty: false
    }
  },
  mounted () {
    this.getPic()
    this.complete = false
  },
  methods: {
    getPic () {
      this.$api.login.getCaptcha().then(res => {
        if (!res.code) {
          this.captchaImg = res.data.img
          this.captcha_key = res.data.key
        }
      })
    },
    compareToFirstPassword (rule, value, callback) {
      if (value && value !== this.form.getFieldValue('newpassword')) {
        callback(new Error('您输入的两个密码不一致！'))
      } else {
        callback()
      }
    },
    validateToNextPassword (rule, value, callback) {
      if (value && this.confirmDirty) {
        this.form.validateFieldsAndScroll(['password_confirmation'], { force: true })
      }
      callback()
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    sendMessage () {
      this.form.validateFieldsAndScroll(['mobile', 'captcha_code'], (err, values) => {
        if (!err) {
          this.logging = true
          values.type = type
          values.captcha_key = this.captcha_key
          this.$api.login.getMessage(values).then(res => {
            this.logging = false
            if (!res.code) {
              this.getTime()
            }
          })
        }
      })
    },
    getTime () {
      this.time = time
      this.timer = setInterval(() => {
        this.buttonText = this.time + 's后重发'
        this.time--
        if (this.time < 1) {
          this.buttonText = buttonText
          clearInterval(this.timer)
        }
      }, 1000)
    },
    onForget (e) {
      e.preventDefault()
      this.complete = true
      this.form.validateFields((err, values) => {
        if (!err) {
          this.logging = true
          values.type = type
          this.$api.login.submitForget(values).then(res => {
            this.logging = false
            if (!res.code) {
              clearInterval(this.timer)
              this.$message.success('设置成功')
              this.$router.push({path: '/login'})
            }
          })
        }
      })
    },
    back () {
      this.$router.push({path: '/login'})
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
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
          }
          .title {
            font-size: 33px;
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
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }
      .login,.forgetOne,.changeOne{
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
      .forgetOne,.changeOne{
        .captchaImg{
          border: 1px solid #ccc;
          border-radius: 5px;
          width:120px;
          margin-left:20px;
          height:40px;
          vertical-align:top;
        }
      }
    }
  }
</style>
