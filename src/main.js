import Vue from 'vue'
import App from './App'
import router from './router'
import 'ant-design-vue/dist/antd.less'
import 'ant-design-vue/lib/style/v2-compatible-reset.less'
import 'font-awesome/css/font-awesome.min.css'
import moment from 'moment'
import 'moment/locale/zh-cn'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import echarts from 'echarts'
import Antd from 'ant-design-vue'
import VueHtml5Editor from 'vue-html5-editor'
import VueAliplayerV2 from 'vue-aliplayer-v2'
import api from '@/http'
import store from '@/store'
import global from '@/utils/global'
import power from '@/permission/index.js'
import * as filters from '@/utils/filters.js'
import custom from '@/components/install.js'
import Viser from 'viser-vue'
Vue.use(Viser)
moment.locale('zh-cn')
Vue.use(VueAliplayerV2)
Vue.use(VueHtml5Editor, {
  // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效
  name: 'vue-html5-editor',
  // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
  showModuleName: false,
  // 自定义各个图标的class，默认使用的是font-awesome提供的图标
  icons: {
    text: 'fa fa-pencil',
    color: 'fa fa-paint-brush',
    font: 'fa fa-font',
    align: 'fa fa-align-justify',
    list: 'fa fa-list',
    link: 'fa fa-chain',
    unlink: 'fa fa-chain-broken',
    tabulation: 'fa fa-table',
    image: 'fa fa-file-image-o',
    hr: 'fa fa-minus',
    eraser: 'fa fa-eraser',
    undo: 'fa-undo fa',
    'full-screen': 'fa fa-arrows-alt',
    info: 'fa fa-info'
  },
  // 配置图片模块
  // config image module
  image: {
    // 文件最大体积，单位字节  max file size
    sizeLimit: 5 * 1024 * 1024,
    // 上传参数,默认把图片转为base64而不上传
    // upload config,default null and convert image to base64
    upload: {
      url: global.baseUrl + global.prefix + 'uploadFile/uploadPic',
      headers: {
        'Version': 'V1', // 这个参数不可变更 谁动谁死 后台接口版本号
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': store.state.token
      },
      params: {},
      fieldName: 'file'
    },
    // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
    compress: null,
    // 响应数据处理,最终返回图片链接
    uploadHandler (responseText) {
      var res = JSON.parse(responseText)
      if (res.code) {
        // eslint-disable-next-line no-undef
        vm.$message.error('上传失败，请重试')
      } else {
        return res.data.fileUrl
      }
    }
  },
  // 语言，内建的有英文（en-us）和中文（zh-cn）
  language: 'zh-cn',
  // 隐藏不想要显示出来的模块
  hiddenModules: [
    'info'
  ],
  // 自定义要显示的模块，并控制顺序
  visibleModules: [
    'text',
    'color',
    'font',
    'align',
    'list',
    'link',
    'unlink',
    'tabulation',
    'image',
    'hr',
    'eraser',
    'undo',
    'full-screen',
    'info'
  ],
  // 扩展模块，具体可以参考examples或查看源码
  // extended modules
  modules: {
  // omit,reference to source code of build-in modules
  }
})

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(api)
Vue.use(custom)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.$echarts = echarts
Vue.prototype.global = global
Vue.prototype.$power = power
Vue.prototype.$filterHtml = function (content) {
  return content.replace(/<[^>]*>/g, '')
}

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App, zhCN },
  data () {
    return {
      locale: zhCN
    }
  },
  template: '<a-config-provider :locale="locale"><App/></a-config-provider>',
  mounted () {
    var isLogin = this.getCookie('da_shu_shang_login', '1')
    var token = store.state.token
    if (isLogin || token) {
      this.getInfo()
      this.getDefault()
    }
  },
  methods: {
    getCookie (name, value) {
      var strcookie = document.cookie
      var arrcookie = strcookie.split('; ')
      for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split('=')
        if (arr[0] === name && arr[1] === value) {
          return true
        }
      }
      return false
    },
    getInfo () {
      let self = this
      self.$api.user.info().then(res => {
        if (!res.code) {
          let data = res.data
          let user = self.$store.state.user
          if (!user.update_at) {
            self.$store.commit('setuser', data)
          }
          let oldUserInfo = self.$store.state.user
          if (data.update_at !== oldUserInfo.update_at) {
            self.$info({
              title: '温馨提示',
              content: '您的账号权限已变更，请重新登录',
              okText: '确定',
              onOk () {
                if (global.NODE_ENV === 'production') {
                  self.$api.login.cookieLogout().then(() => {
                    self.$store.commit('initSotre')
                  })
                } else {
                  self.$api.login.tokenLogout().then(() => {
                    self.$store.commit('initSotre')
                  })
                }
              }
            })
          } else {
            self.$store.commit('setuser', data)
          }
        }
      })
    },
    getDefault () {
      let self = this
      self.$api.user.defaultSetting().then(res => {
        if (!res.code) {
          self.$store.commit('setDefault', res.data)
        }
      })
    }
  }
})
