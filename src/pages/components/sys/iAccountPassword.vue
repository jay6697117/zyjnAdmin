<template>
  <a-drawer :title="title" placement="right" :closable="false"  @close="handleCancel" :visible="visible" width="300" >
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="global.formItemLayout" label="密码">
        <a-input placeholder="请输入为员工设置的新密码" type="password"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-row>
        <a-col :span="18" :push="6">
          重置密码后，请将密码告知员工，确保其正常使用
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="global.formItemLayout.buttonCol">
        <a-button type="primary" html-type="submit" :loading="loading" block>保存</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
export default {
  name: 'iAccountPassword',
  data () {
    return {
      loading: false,
      visible: false
    }
  },
  props: ['title', 'flag', 'itemdata'],
  watch: {
    flag: function () {
      this.visible = this.flag
    }
  },
  created () {
    this.form = this.$form.createForm(this, {
      onFieldsChange: (_, changedFields) => {},
      mapPropsToFields: () => {
        return {}
      },
      onValuesChange (_, item) {}
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
        if (!err) {
          val.hash_user_id = this.itemdata.hash_user_id
          this.$api.account.reset(val).then(res => {
            this.loading = false
            if (!res.code) {
              this.$message.success('保存成功', 3)
            }
            this.$emit('ok', true)
          })
        }
      })
    }
  }
}
</script>
