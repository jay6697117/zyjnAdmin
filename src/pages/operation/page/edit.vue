<template>
  <div class="pageEdit">
    <a-form :form="currentItem" @submit="handleSubmit" v-show="loaded">
      <a-form-item label="hash_id" v-show="false">
        <a-input-number :min="0" v-decorator="['hash_id']" />
      </a-form-item>
      <a-form-item label="标题" v-bind="global.midFormLayout">
        <a-input :maxLength="50"
          placeholder="请输入标题名称（最多不超过50字）"
          v-decorator="['title', { rules: [{ required: true, message: '请输入标题!' }] }]"
        />
      </a-form-item>
      <a-form-item label="正文" v-bind="global.bigFormLayout" style="margin-bottom:0;">
        <a-radio-group name="radioGroup" v-decorator="['type',{rules: [{ required: true}]}]" @change="radioChange">
          <a-radio :value="1">文本编辑器</a-radio>
          <a-radio :value="2">HTML编辑器</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="  " v-bind="global.bigFormLayout" class="specialItem">
        <vue-html5-editor v-show="this.currentItem.getFieldsValue().type=== 1" :height="240" :auto-height="false" :show-module-name="false" v-decorator="['contentOne']" @change="updateData" :class="(content==='' && flag)? 'change':''"></vue-html5-editor>
        <a-textarea  v-show="this.currentItem.getFieldsValue().type === 2" allow-clear style="height:289px;" v-decorator="['contentTwo']" @change="updateText" :class="(content==='' && flag)? 'change':''"/>
        <div v-if="content==='' && flag" :class="(this.currentItem.getFieldsValue().type=== 2)? 'move':''" style="color:#f5222d;font-size: 14px;line-height: 1.5;">您还未填写正文</div>
      </a-form-item>
      <a-form-item label="URL路径" v-bind="global.bigFormLayout">
        <a-row>
          <a-col :span="12">
            <a-input placeholder="请输入URL路径" :maxLength="20" v-decorator="['url',{rules: [{ required: true, message: '请输入URL路径'}]}]" @input="input"/>
          </a-col>
          <a-col :span="10" style="margin-left:10px;">
            <span>页面路径：域名/page/URL路径</span>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="发布状态" v-bind="global.smallFormLayout">
        <a-radio-group name="radioGroup" v-decorator="['publishSetting']">
          <a-radio :value="1">立即发布</a-radio>
          <a-radio :value="-1">暂不发布</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-bind="global.btnFormLayout">
        <a-button type="primary" html-type="submit" block slot="label">保存</a-button>
        <a-button block @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
export default {
  name: 'planEdit',
  data () {
    return {
      loaded: false,
      currentItem: this.$form.createForm(this, {name: 'editor'}),
      content: '',
      flag: false
    }
  },
  computed: {
    hash_id () {
      return this.$route.query.id
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    getDetails () {
      let _self = this
      _self.loaded = false
      _self.initData()
    },
    initData () {
      let _self = this
      _self.loaded = true
      if (_self.hash_id) {
        _self.$api.pageManagement.getInfo({// 编辑时请求远端数据
          hash_id: _self.hash_id
        }).then(res => {
          _self.content = res.data.content
          let form = {
            title: res.data.title,
            contentOne: (res.data.type === 1) ? res.data.content : '',
            contentTwo: (res.data.type === 2) ? res.data.content : '',
            publishSetting: res.data.publishSetting,
            type: res.data.type,
            url: res.data.url,
            hash_id: _self.hash_id
          }
          _self.currentItem.setFieldsValue(form) // 给表单赋值
          _self.$nextTick(() => {
            if (res.data.type === 1) {
              _self.currentItem.setFieldsValue({contentOne: form.contentOne})
            } else {
              _self.currentItem.setFieldsValue({contentTwo: form.contentTwo})
            }
          })
        })
      } else {
        _self.loaded = true
        let form = { // 添加时的默认值设置
          title: '',
          contentOne: '',
          contentTwo: '',
          publishSetting: 1,
          type: 1,
          url: ''
        }
        _self.currentItem.setFieldsValue(form)
      }
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.currentItem.validateFieldsAndScroll((err, values) => {
        _self.flag = true
        if (_self.content === '') {
          return
        }
        if (!err) {
          values.content = (values.type === 1) ? values.contentOne : values.contentTwo
          if (values.hash_id) {
            _self.$api.pageManagement.edit(values).then(res => {
              if (!res.code) {
                this.$router.push({
                  path: '/operation/page/list',
                  query: {
                    unTips: true
                  }
                })
              }
            })
          } else {
            _self.$api.pageManagement.add(values).then(res => {
              if (!res.code) {
                this.$router.push({
                  path: '/operation/page/list',
                  query: {
                    unTips: true
                  }
                })
              }
            })
          }
        }
      })
    },
    cancel () {
      this.$router.push({
        path: '/operation/page/list'
      })
    },
    radioChange (e) {
      this.type = e.target.value
      this.content = (this.type === 1) ? this.currentItem.getFieldsValue().contentOne : this.currentItem.getFieldsValue().contentTwo
    },
    input (e) {
      let value = e.target.value.replace(/[`~!@#$%^&*()\\+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\\+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, '')
      // eslint-disable-next-line no-useless-escape
      value = value.replace(/[^\w\.\/]/ig, '')
      this.currentItem.setFieldsValue({url: value})
    },
    updateData (e) {
      this.content = e
    },
    updateText (e) {
      this.content = e.target.value
    }
  }
}
</script>
<style scope>
  .pageEdit .specialItem{height:293px;}
  .pageEdit .specialItem .ant-form-item-control{height:329px;}
  .pageEdit .specialItem .change,.pageEdit .specialItem .change textarea,.pageEdit .specialItem .change > .toolbar > ul{border-color:rgb(245, 34, 45);}
  .pageEdit .specialItem .move{position: relative;top:-14px;}
  .pageEdit .specialItem .ant-form-item-label{opacity:0;}
</style>
