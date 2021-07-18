<template>
  <a-drawer :title="title" placement="right" :closable="false"  @close="handleCancel" :visible="visible" width="300" >
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="global.formItemLayout" label="角色分类">
        <a-select style='width: 100%' v-decorator="['hash_category_id', {rules: [{ required: true }]}]" :getPopupContainer="triggerNode => triggerNode.parentNode">
          <a-select-option v-for="item in classify" :key="item.hash_id" :value="item.hash_id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="角色名称">
        <a-input :maxLength="20" placeholder="请输入角色名称"
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入角色名称!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="hash_id" v-show="false">
        <a-input-number :min="0" v-decorator="['hash_id']" />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="备注">
        <a-textarea placeholder="请输入备注" :rows="4" v-decorator="['remark']"/>
      </a-form-item>
      <a-form-item label="" v-show="title === '新建角色'" v-if="itemdata.is_default !== 1" align="right">
        <a-checkbox @change="onCopyChange">复制</a-checkbox>
        <a-select style='width: 100px' placeholder="请选择角色" :value="hash_copy_role_id" @change="handleChange" :getPopupContainer="triggerNode => triggerNode.parentNode">
          <a-select-option :value="item.hash_id" v-for="item in rolelist" :key="item.hash_id">{{item.name}}</a-select-option>
        </a-select>
        的角色权限
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24 }" v-if="title !== '新建角色'">
        <a-row :gutter="20">
          <a-col class="gutter-row" :span="6" align="right">创建人 :</a-col>
          <a-col class="gutter-row" :span="18">{{itemdata.created_user}}</a-col>
          <a-col class="gutter-row" :span="6" align="right">创建时间 :</a-col>
          <a-col class="gutter-row" :span="18">{{itemdata.created_at | timeFormat('yyyy-MM-dd')}}</a-col>
        </a-row>
      </a-form-item>
      <a-form-item :wrapper-col="global.formItemLayout.buttonCol">
        <a-button type="primary" html-type="submit" :loading="loading" block>保存</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
export default {
  name: 'iRoleEdit',
  data () {
    return {
      loading: false,
      visible: false,
      roleTemp: {
        'id': 0,
        'name': '',
        'remark': ''
      },
      copyFlag: false,
      hash_copy_role_id: undefined
    }
  },
  props: ['title', 'flag', 'itemdata', 'rolelist', 'classify'],
  watch: {
    flag: function () {
      this.visible = this.flag
      if (this.visible) {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            'hash_id': this.itemdata.hash_id,
            'hash_category_id': this.itemdata.hash_category_id,
            'name': this.itemdata.name,
            'remark': this.itemdata.remark
          })
        })
      }
    }
  },
  created () {
    var _self = this
    _self.form = _self.$form.createForm(_self, {
      onFieldsChange: (_, changedFields) => {},
      mapPropsToFields: () => {
        return {
          name: _self.$form.createFormField({
            value: _self.roleTemp.name
          })
        }
      },
      onValuesChange (_, item) {}
    })
  },
  methods: {
    handleCancel () {
      this.$emit('cancel', false)
    },
    onCopyChange (e) {
      this.copyFlag = e.target.checked
    },
    handleChange (val) {
      this.hash_copy_role_id = val
    },
    handleSubmit (e) {
      e.preventDefault()
      this.loading = true
      this.form.validateFieldsAndScroll((err, val) => {
        if (!err) {
          if (this.title === '新建角色') {
            val.is_copy_permission = Number(this.copyFlag)
            val.hash_copy_role_id = this.hash_copy_role_id
            val.remark = val.remark || ''
            delete val.hash_id
            this.$api.role.add(val).then(res => {
              this.loading = false
              if (!res.code) {
                this.$message.success('添加角色成功', 3)
              }
              this.$emit('ok', false)
            })
          } else {
            this.$api.role.edit(val).then(res => {
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

<style scope>
  .ant-row{margin-bottom: 20px;}
</style>
