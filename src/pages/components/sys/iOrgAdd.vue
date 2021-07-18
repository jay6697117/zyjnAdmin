<template>
  <a-drawer title="新增企业" placement="right" :closable="false"  @close="handleCancel" :visible="visible" width="320">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="上级企业" v-show="false">
        <a-input v-decorator="['parent_id']"/>
      </a-form-item>
      <a-form-item label="remark" v-show="false">
        <a-input v-decorator="['remark']"/>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="公司名称">
        <a-input placeholder="请输入公司名称"
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入企业名称!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="真实姓名">
        <a-input placeholder="请输入真实姓名"
          v-decorator="[
            'nickname',
            {rules: [{ required: true, message: '请输入真实姓名!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="手机号">
        <a-input placeholder="请输入手机号" :maxLength="11"
          v-decorator="[
            'mobile',
            {rules: [{ required: true, message: '请输入手机号!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="密码">
        <a-input placeholder="请输入密码" type="password"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="角色">
        <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
          style="width: 100%"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="roletree"
          placeholder='请选择角色'
          :treeDefaultExpandedKeys = '[0]'
          multiple
          treeNodeFilterProp="title"
          v-decorator="[
            'hash_role_ids',
            {rules: [{ required: true, message: '请选择角色!'}]}
          ]"
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="类型">
        <a-radio-group name="radioGroup" v-decorator="['org_type', {rules: [{ required: true }]}]">
          <a-radio :value="1">免费</a-radio>
          <a-radio :value="2">付费</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="开通时间">
        <a-date-picker placeholder="请输入开通时间" showTime @change="resetEndTime"
            v-decorator="['opening_time', {rules: [{ required: true, message: '请输入开通时间!' }]}]"/>
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
      <a-form-item v-bind="global.formItemLayout" label="学员上限">
        <a-input-number :min="1" placeholder="请输入数字" style="width: 150px"
          v-decorator="[
            'staff_upper_limit',
            {rules: [{ required: true, message: '请输入数字!' }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="使用状态">
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
import moment from 'moment'
export default {
  data () {
    return {
      moment,
      loading: false,
      visible: false,
      itemData: { // 初始数据模板
        name: '',
        parent_id: '',
        status: 1,
        org_type: 1,
        use_days: 7,
        opening_time: moment(new Date()),
        end_time: parseInt(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
        nickname: '',
        mobile: '',
        password: '',
        staff_upper_limit: 30,
        roletree: [],
        remark: '无',
        hash_role_ids: []
      },
      form: this.$form.createForm(this, {name: 'org'})
    }
  },
  watch: {
    flag: function () {
      this.visible = this.flag
      if (this.visible) {
        this.$nextTick(() => {
          this.form.setFieldsValue(this.itemData)
        })
      }
    }
  },
  props: ['flag', 'roletree'],
  methods: {
    resetEndTime () {
      this.$nextTick(() => {
        var start = this.form.getFieldValue('opening_time')
        var days = this.form.getFieldValue('use_days')
        console.log(days)
        this.form.setFieldsValue({
          end_time: parseInt(new Date(start._d).getTime() / 1000) + days * 24 * 60 * 60
        })
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.loading = true
      this.form.validateFieldsAndScroll((err, val) => { // 新建  编辑保存
        if (!err) {
          val.opening_time = parseInt(new Date(val.opening_time._d).getTime() / 1000)
          this.$api.org.add(val).then(res => {
            this.loading = false
            if (!res.code) {
              this.$message.success('添加成功', 3)
              this.$emit('ok', false)
            }
          })
        } else {
          this.loading = false
        }
      })
    },
    handleCancel () {
      this.$emit('cancel', false)
    }
  }
}
</script>
<style>
  .editRight .ant-drawer-body{padding: 12px;}
  .ant-drawer .ant-calendar-picker{min-width: 180px;}
</style>
