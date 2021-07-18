<template>
  <a-form :form="courseItem" @submit="handleSubmit" v-show="loaded" class="courseEdit">
    <a-form-item label="course_id" v-show="false">
      <a-input v-decorator="['course_id']" />
    </a-form-item>
    <h2>基本信息</h2>
    <a-form-item :label="'课程名称'" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
      {{courseTitle}}
    </a-form-item>
    <a-form-item :label="'课程名额'" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
      {{pay_number}}
    </a-form-item>
    <h2>课程信息</h2>
    <a-form-item label="课程分类" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
      <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
        :dropdownStyle="dropdownStyle"
        :treeData="classified"
        placeholder='请选择分类'
        treeNodeFilterProp="title"
        v-decorator="['hash_category_id']">
      </a-tree-select>
    </a-form-item>
    <a-form-item label="奖励类型" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
      <a-radio-group v-decorator="['credit_type', {rules: [{ required: true}]}]" @change="onRadioChange" class="radioGroup">
        <a-radio :value="1">全部完成奖励学分</a-radio>
        <a-radio :value="2">每讲奖励学分</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="奖励学分" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
      <a-input-number :min="0"
      v-decorator="[
        'credit',
        {rules: [{ required: true, message: '学分必须为大于等于0的整数!'}]}
      ]"/> 分
    </a-form-item>
    <a-form-item label="是否开放报名" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
      <a-radio-group name="radioGroup" v-decorator="['is_openup']">
        <a-radio :value="1">是</a-radio>
        <a-radio :value="0">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item>
      <a-row>
        <a-col :span="3" :push="3">
          <a-button type="primary" html-type="submit" block>保存</a-button>
        </a-col>
        <a-col :span="3" :push="4">
          <a-button block @click="cancel">取消</a-button>
        </a-col>
      </a-row>
    </a-form-item>
  </a-form>
</template>
<script>
export default {
  data () {
    return {
      loaded: false,
      classified: [],
      courseTitle: '',
      pay_number: '',
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      confirmLoading: false,
      courseItem: this.$form.createForm(this, {name: 'editor'}),
      showRelatedStaff: false
    }
  },
  computed: {
    course_id () {
      return this.$route.query.id
    }
  },
  mounted () {
    this.$api.category.list({type: 'course'}).then(res => {
      this.classified = res.data
      this.getDetails()
    })
  },
  methods: {
    getDetails () {
      this.loaded = false
      this.initData()
    },
    initData () {
      this.$api.purchase.getInfo({// 编辑时请求远端数据
        hash_id: this.course_id
      }).then(res => {
        let data = res.data
        this.loaded = true
        let fieldsValue = {
          course_id: data.hash_id, // 课程id
          hash_category_id: data.hash_category_id || undefined, // 分类id
          is_openup: data.is_openup,
          credit_type: data.credit_type,
          credit: data.credit
        }
        this.courseTitle = data.title
        this.pay_number = data.buyout ? '无限制' : data.pay_number
        this.courseItem.setFieldsValue(fieldsValue) // 给表单赋值
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.courseItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.hash_id = this.course_id
          this.$api.purchase.edit(values).then(res => {
            if (res.code === 0) {
              this.$router.push({
                path: '/content/purchase/list',
                query: {
                  unTips: true
                }
              })
            }
          })
        }
      })
    },
    cancel () {
      this.$router.push({
        path: '/content/purchase/list'
      })
    },
    onRadioChange (e) {
      this.$nextTick(() => {
        this.courseItem.setFieldsValue({
          credit: 0
        })
      })
    }
  }
}
</script>
<style scope>
  .courseEdit .radioGroup .ant-calendar-picker{margin-left: 10px;}
  .courseEdit .teacherBox{display:inline-block;padding:3px 15px;border-radius: 20px;border: 1px solid #999;margin-right: 10px;line-height: 1}
  .courseEdit .teacherBox img{width:25px;height:25px;border-radius: 50%;margin-right:10px;}
  .courseEdit .teacherBox span{line-height: 25px;}
  .courseEdit .inputLesson label:before{display: inline-block;margin-right: 4px;color: #f5222d;font-size: 14px;font-family: SimSun, sans-serif;line-height: 1;content: '*'}
  .courseEdit .customSelect .ant-select-tree li{position: relative;}
  .courseEdit .customSelect .ant-select-tree-switcher{position: absolute;width: 90%;top:3px;cursor: auto;}
  .courseEdit .customSelect .ant-select-tree-switcher i svg{display: none;}
  .courseEdit .customSelect .ant-select-tree-treenode-switcher-close i:after{content: '+';font-size: 24px;font-weight: 400; color: #999;}
  .courseEdit .customSelect .ant-select-tree-treenode-switcher-open i:after{content: '─';display: inline-block;margin: 0 0 0 4px;font-size: 14px; color: #999;}
  .courseEdit .customSelect .ant-select-tree-checkbox-disabled{display: none;}
  .courseEdit .customSelect .ant-select-tree-checkbox-disabled + span .ant-select-tree-title{margin-left: 15px;color: #aaa;}
</style>
