<template>
  <a-drawer :title="title" placement="right" :closable="false"  @close="handleCancel" :visible="visible" width="300" >
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="global.formItemLayout" label="菜单名称">
        <a-input placeholder="请输入菜单名称或操作名称"
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入菜单名称或操作名称!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="url">
        <a-input placeholder="请输入页面展示地址" v-decorator="['url', {rules: [{ required: true }]}]"/>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="需要授权">
        <a-radio-group name="radioGroup" v-decorator="['is_default', {rules: [{ required: true }]}]">
          <a-radio :value="0">是</a-radio>
          <a-radio :value="1">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="id" v-show="false">
        <a-input-number :min="0" v-decorator="['id']" />
      </a-form-item>
      <a-form-item :wrapper-col="global.formItemLayout.buttonCol">
        <a-button type="primary" html-type="submit" :loading="loading" block>保存</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
export default {
  name: 'iRootEdit',
  data () {
    return {
      loading: false,
      visible: false,
      urlShow: true,
      apiShow: true,
      permsShow: true,
      iconShow: true,
      menuTemp: {
        'id': 0,
        'name': '',
        'url': '',
        'is_default': 0
      }
    }
  },
  watch: {
    flag: function () {
      this.visible = this.flag
      if (this.visible) {
        this.$nextTick(() => {
          delete this.itemdata.created_time
          this.form.setFieldsValue(this.itemdata)
        })
      }
    }
  },
  props: ['title', 'flag', 'itemdata'],
  created () {
    this.form = this.$form.createForm(this, {
      onFieldsChange: (_, changedFields) => {},
      mapPropsToFields: () => {
        return {
          name: this.$form.createFormField({
            value: this.menuTemp.name
          })
        }
      },
      onValuesChange (_, values) {}
    })
  },
  methods: {
    handleCancel () {
      this.$emit('cancel', false)
    },
    handleSubmit (e) {
      e.preventDefault()
      this.loading = true
      this.form.validateFieldsAndScroll((err, val) => {
        console.log(err, val)
        if (!err) {
          if (this.title === '新建api') {
            this.$api.root.add(val).then((res) => {
              this.loading = false
              if (!res.code) {
                this.$message.success('保存成功', 3)
              }
              this.$emit('ok', false)
            })
          } else {
            this.$api.root.edit(val).then((res) => {
              this.loading = false
              if (!res.code) {
                this.$message.success('保存成功', 3)
              }
              this.$emit('ok', false)
            })
          }
        }
      })
    },
    handleConfirmBlur  (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    }
  }
}
</script>
