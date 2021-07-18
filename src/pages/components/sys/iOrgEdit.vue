<template>
  <a-drawer :title="title" placement="right" :closable="false"  @close="handleCancel" :visible="visible" width="300" >
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="global.formItemLayout" label="organization_id" v-show="false">
        <a-input v-decorator="['organization_id']" />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="组织名称">
        <a-input placeholder="请输入组织名称"
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入组织名称!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="组织类型">
        <a-radio-group name="radioGroup" v-decorator="['org_type', {rules: [{ required: true }]}]">
          <a-radio :value="1">免费</a-radio>
          <a-radio :value="2">付费</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="开通时间">
        {{opening_time | timeFormat('yyyy-MM-dd hh:mm:ss')}}
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="使用时长">
        <a-input-number :min="1" placeholder="请输入使用时长" style="width: 150px" @change="resetEndTime"
          v-decorator="['use_days']"
        /> 天
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="结束时间">
        <a-input v-decorator="['end_time']" v-show="false"/>
        {{form.getFieldValue('end_time') | timeFormat('yyyy-MM-dd hh:mm:ss')}}
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="员工上限">
        <a-input-number :min="0" placeholder="请输入数字" style="width: 150px"
          v-decorator="[
            'staff_upper_limit',
            {rules: [{ required: true, message: '请输入数字!' }]}
          ]"
           @change="resetLimit"
        />
        <div class="ant-form-explain" style="color:#f5222d;" v-if="errorShow">{{errorText}}</div>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="组织状态">
        <a-radio-group name="radioGroup" v-decorator="['status', {rules: [{ required: true }]}]">
          <a-radio :value="1">正常</a-radio>
          <a-radio :value="0">停用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapper-col="global.formItemLayout.buttonCol">
        <a-button type="primary" html-type="submit" :loading="loading" block>保存</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      value: true,
      visible: false,
      opening_time: '',
      employeesNumber: 1,
      form: this.$form.createForm(this, {name: 'org'}),
      errorShow: false,
      errorText: ''
    }
  },
  watch: {
    flag: function () {
      this.visible = this.flag
      if (this.visible) {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            'name': this.itemdata.name,
            'status': this.itemdata.status,
            'org_type': this.itemdata.status,
            'use_days': this.itemdata.use_days,
            'end_time': this.itemdata.end_time,
            'organization_id': this.itemdata.organization_id,
            'staff_upper_limit': this.itemdata.staff_upper_limit
          })
          this.opening_time = this.itemdata.opening_time
          this.employeesNumber = this.itemdata.employeesNumber
        })
      }
    }
  },
  props: ['title', 'flag', 'itemdata', 'isEdit'],
  methods: {
    handleCancel () {
      this.$emit('cancel', false)
    },
    resetEndTime () {
      this.$nextTick(() => {
        var start = this.opening_time
        var days = this.form.getFieldValue('use_days')
        this.form.setFieldsValue({
          end_time: (parseInt(new Date(start).getTime()) + days * 24 * 60 * 60)
        })
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, val) => { // 新建  编辑保存
        if (!err) {
          if (this.form.getFieldValue('staff_upper_limit') >= this.employeesNumber && this.form.getFieldValue('staff_upper_limit') !== 0) {
            this.loading = true
            this.$api.org.edit(val).then(res => {
              this.loading = false
              if (!res.code) {
                this.$message.success('保存成功', 3)
              }
              this.$emit('ok', true)
            })
          }
        }
      })
    },
    resetLimit (value) {
      if (value !== '') {
        if (parseInt(value) === 0) {
          this.errorShow = true
          this.errorText = '员工上限不能为0'
        } else if (parseInt(value) < this.employeesNumber) {
          this.errorShow = true
          this.errorText = '员工上限不能小于实际员工人数'
        } else {
          this.errorShow = false
          this.errorText = ''
        }
      } else {
        this.errorShow = false
        this.errorText = ''
      }
    }
  }
}
</script>
