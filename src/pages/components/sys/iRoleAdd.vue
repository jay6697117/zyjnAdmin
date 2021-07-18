<template>
  <a-drawer :title="title" placement="right" :closable="false" @close="handleCancel" :visible="visible" width="300" >
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="global.formItemLayout" label="分类名称">
        <a-input placeholder="请输入分类名称"
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入分类名称!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item :wrapper-col="global.formItemLayout.buttonCol">
        <a-button type="primary" html-type="submit" :loading="loading" block>保存</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
export default {
  name: 'iRoleAdd',
  data () {
    return {
      loading: false,
      visible: false
    }
  },
  props: ['title', 'flag'],
  watch: {
    flag: function () {
      this.visible = this.flag
    }
  },
  created () {
    var _self = this
    _self.form = _self.$form.createForm(_self, {
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
          this.$api.roleCategory.add(val).then(res => {
            this.loading = false
            if (!res.code) {
              this.$message.success('添加分类成功', 3)
            }
            this.$emit('ok', false)
          })
        }
      })
    }
  }
}
</script>

<style scope>
  .ant-row{margin-bottom: 20px;}
</style>
