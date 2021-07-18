<template>
  <div>
    <a-modal :visible="visible" title="填写考试信息" @cancel="btnCancel" width="80%" :footer="null" class="examInfoModal">
      <a-form layout="inline" :form="examInfoFrom" @submit="handleSubmit">
        <a-form-item label="选择考试" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <span style="padding-right:10px;" v-show="examTitle">{{examTitle}}</span>
          <a-button type="primary" @click="params.show = true">选择考试</a-button>
          <a-input v-show="false"
            v-decorator="['hash_item_id', { rules: [{ required: true, message: '请选择试卷!' }] }]"
          />

        </a-form-item>
        <a-form-item label="考试时长" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" help="0表示不限制时长">
          <a-input-number style="width: 200px;margin-right:10px;"
            v-decorator="['duration']" placeholder="0"
          />
          <span>分钟</span>
        </a-form-item>
        <a-form-item label="及格分数" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-input-number style="width: 200px;margin-right:10px;" v-decorator="['pass_score']" placeholder="0"/><span>分</span>
          <p>本试卷满分{{totalScore}}分</p>
        </a-form-item>
        <a-form-item style="margin-left:80px;">
          <a-checkbox v-decorator="['show_analysis', {
            valuePropName: 'checked',
            initialValue: true,
          }]">
            考试结束后显示答案和解析
          </a-checkbox>
        </a-form-item>
        <a-form-item style="margin-left:80px;">
          <a-button type="primary" html-type="submit" style="margin-right:30px;">确定</a-button>
          <a-button @click="btnCancel">取消</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <i-choose :params="params" @ok="getTaskExam" @cancel="cancel" :key="keyIndex" type="plan" :plan_id="planId"/>
  </div>
</template>
<script>
export default {
  name: 'examInfo',
  data () {
    return {
      params: {
        type: 'paper', // 请求方法的路径
        name: '试卷', // 名称
        show: false, // 展示
        tableKey: 'hash_id',
        selectionType: 'checkbox', // 多选 'checkbox'
        haveCreateButton: false, // 新建按钮
        filters: {search_content: ''}, // 筛选条件 无=={}
        otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
        selectedRowKeys: [], // 列表中的已选项 无==[]
        columns: [
          {title: '考试名称', dataIndex: 'title', key: 'title', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'pic' }, align: 'left'},
          {title: '发布时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 220}
        ]
      },
      visible: false,
      examInfoFrom: this.$form.createForm(this, { name: 'examInfoFrom' }),
      examTitle: '',
      totalScore: 0,
      checked: true,
      length: 0,
      keyIndex: 0
    }
  },
  watch: {
    flag: function () {
      this.visible = this.flag
      if (this.visible) {
        this.keyIndex++
        if (this.paperInfo === '') {
          this.examTitle = ''
          this.totalScore = 0
          this.$nextTick(() => {
            this.examInfoFrom.setFieldsValue({ // 添加时的默认值设置
              hash_item_id: '',
              duration: 0,
              pass_score: 0,
              show_analysis: true
            })
          })
        } else {
          this.examTitle = this.paperInfo.title
          this.totalScore = this.paperInfo.totalScore
          let fieldsValue = {
            hash_item_id: this.paperInfo.hash_exam_id,
            duration: this.paperInfo.duration,
            pass_score: this.paperInfo.pass_score,
            show_analysis: this.paperInfo.show_analysis === 1
          }
          this.$nextTick(() => {
            this.examInfoFrom.setFieldsValue(fieldsValue) // 给表单赋值
          })
        }
      }
    },
    'params.show': function () {
      return this.params.show
    }
  },
  props: ['flag', 'planId', 'paperInfo'],
  methods: {
    handleSubmit (e) { // 确定保存考试信息
      e.preventDefault()
      this.examInfoFrom.validateFieldsAndScroll((err, vals) => {
        if (!err) {
          if (vals.duration === undefined) {
            vals.duration = 0
          }
          if (vals.pass_score === undefined) {
            vals.pass_score = 0
          }
          vals.hash_id = this.planId
          vals.show_analysis = 0 + vals.show_analysis
          vals.repeat_num = 1
          if (vals.pass_score > 0 && vals.pass_score < this.totalScore) {
            this.$emit('funcOne', vals)
            this.examShow = false
            this.$emit('cancel', false)
          } else {
            this.$message.error('及格分数必须大于0，并且小于试卷总分')
          }
        }
      })
    },
    getTaskExam (data) { // 获取考试
      this.$api.paper.getInfo({hash_id: data[data.length - 1]}).then(res => {
        this.params.show = false
        this.examInfoFrom.setFieldsValue({
          hash_item_id: res.data.hash_id
        })
        this.examTitle = res.data.title
        this.totalScore = res.data.totalScore
      })
    },
    btnCancel () {
      this.visible = false
      this.$emit('cancel', false)
    },
    cancel () {
      this.params.show = false
    }
  }
}
</script>
<style scope>
  .examInfoModal{width:600px!important;padding:20px;}
  .examInfoModal .ant-form-inline .ant-form-item{display:block;}
  .examInfoModal .ant-modal-footer .ant-btn{display:none;}
  .examInfoModal .ant-modal-footer .ant-btn-primary{display:block;margin:0 auto;}
</style>
