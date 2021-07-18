<template>
  <div class="paperEdit">
    <div class="crumb">
      <div class="crumb-1">
        1.设置试卷信息
        <div class="crumb-1-right"></div>
      </div>
      <div class="crumb-2 active_crumb">
        2.管理试题
        <div class="crumb-2-left active_crumb_left"></div>
      </div>
    </div>
    <p class="stepTwotips">已经有学员参与的考试不能再修改题目。</p>
    <a-button type="primary" @click="addQuestion" icon="plus" class="exportQues">从题库中导入题目</a-button>
    <a-form :form="questionForm" v-show="questions.length" >
      <p style="margin-top:10px;">共计{{questions.length}}题，总分{{totalScore}}分。</p>
      <div v-for="(item, i) in questionForm.getFieldValue('questions')" :key="i" class="ques-list">
        <a-form-item v-show="false">
          <a-input v-decorator="[`hashIds[${i}]`]" />
        </a-form-item>
        <a-row>
          <a-col :span="16">
            <div class="questionContent" v-html="(i + 1) + '、(' + types[quesData[i].question_type] + ') ' + quesData[i].content"></div>
            <ul v-if="quesData[i].question_type === 1||quesData[i].question_type === 2" class="list-option">
              <li v-for="(pro, index) in quesData[i].items" :key="index" v-html="`
                ${choices[index]}、${pro}
                ${
                  (quesData[i].rightAnswer.indexOf(index) !== -1 && quesData[i].question_type === 1)
                  ||
                  (quesData[i].rightAnswer.indexOf(index) !== -1 && quesData[i].question_type === 2)
                  ? '<span>(正确答案)</span>' : ''
                }
              `">
              </li>
            </ul>
            <div class="judge-answer" v-if="quesData[i].question_type === 3">
              <span>答案：{{!quesData[i].rightAnswer[0] ? '正确' : '错误'}}</span>
            </div>
            <div class="fill-in-answer" v-if="quesData[i].question_type === 4">
              <span v-for="(one, order) in quesData[i].rightAnswer" :key="order">答案："{{one}}"</span>
            </div>
          </a-col>
          <a-col :span="4" :push="4" align="right" v-show="!paperInfo.haveLearningRecord">
            <a-popconfirm title="是否确定删除?" @confirm="move(i)" okText="确定" cancelText="取消">
              <a href="javascript:;">移除</a>
            </a-popconfirm>
            <a-form-item>
              本题 <a-input-number :min="0.5" v-decorator="[`scores[${i}]`, { rules: [{ required: true, message: '请设置分值!' }] }]" style="width:70px" /> 分
            </a-form-item>
          </a-col>
        </a-row>
        <div class="move" v-show="!paperInfo.haveLearningRecord">
          <div class="move_up" v-show="(i !== 0)" @click="move(i, -1)"><a-icon type="up-circle"/>上移</div>
          <div class="move_down" v-show="(i !== questions.length - 1)" @click="move(i, 1)"><a-icon type="down-circle"/>下移</div>
        </div>
      </div>
      <a-form-item>
        <div align="center">
          <i-remove :id="id" :parmas="editParmas" action="edit" @reset="submitExam" @loading="setLoading">
            <a-button type="primary" style="margin-right:20px;" :loading="loading" slot="operation">保存</a-button>
          </i-remove>
          <a-button @click="back">返回</a-button>
        </div>
      </a-form-item>
    </a-form>
    <i-choose :params="params" @ok="importQuestion" @cancel="onhandleCancel" />
  </div>
</template>
<script>
const choices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export default {
  name: 'paperQuestion',
  data () {
    return {
      loading: false,
      params: {
        type: 'question', // 请求方法的路径
        name: '试题', // 名称
        show: false, // 展示
        tableKey: 'hash_id', // 表格的key
        selectionType: 'checkbox', // 单选 'radio'
        questionCreateButton: true, // 新建按钮
        filters: {search_content: '', hash_category_id: '0'}, // 筛选条件 无=={}
        otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
        selectedRowKeys: [], // 列表中的已选项 无==[]
        columns: [
          {title: '题目', dataIndex: 'content', key: 'content', scopedSlots: { customRender: 'content' }, align: 'left'},
          {title: '题型', dataIndex: 'question_type', key: 'question_type', scopedSlots: { customRender: 'question_type' }, align: 'center', width: 100}
        ]
      },
      types: this.$store.state.questionTypes,
      choices,
      paperInfo: {},
      questions: [],
      quesData: [],
      totalScore: 0,
      editParmas: {
        parentId: this.id,
        title: '试卷保存',
        path: 'paper',
        canRemove: true,
        searchBind: true,
        tips: '试卷修改会同步到下列关联的培训计划和专项考试，是否确定保存？',
        content: '是否确定保存？'
      }
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  beforeCreate () {
    var self = this
    self.questionForm = self.$form.createForm(self, {
      name: 'questionForm',
      onValuesChange (props, values) {
        if (values.scores) {
          values.scores.map((item, index) => {
            self.questions[index].score = item
          })
        }
        self.$nextTick(() => {
          self.totalScore = (props.form.getFieldsValue().scores || []).reduce((pre, cur) => {
            return pre + cur
          }, 0)
        })
      }
    })
    this.questionForm.getFieldDecorator('questions', { initialValue: [], preserve: true })
  },
  mounted () {
    if (this.id) {
      this.$api.paper.getInfo({// 编辑时请求远端数据
        hash_id: this.id
      }).then(res => {
        if (res.code === 0) {
          this.paperInfo = res.data
          let questions = res.data.questions.map(q => {
            return {hash_id: q.hash_id, score: q.score}
          })
          this.searchQuestion(questions)
        }
      })
    }
    this.questionForm.setFieldsValue({
      questions: []
    })
    this.$nextTick(() => {
      this.questionForm.setFieldsValue({
        hashIds: [],
        scores: []
      })
    })
  },
  methods: {
    setLoading (loading) {
      this.loading = loading
    },
    importQuestion (ids) {
      var { questions } = this
      let hashIds = questions.map(q => q.hash_id)
      questions = questions.concat(ids.map(item => {
        if (hashIds.indexOf(item) === -1) {
          return {
            hash_id: item,
            score: 2
          }
        } else {
          return null
        }
      })).filter(item => item)
      this.searchQuestion(questions)
    },
    searchQuestion (questions) {
      if (!questions.length) {
        return
      }
      let hashIds = questions.map(q => q.hash_id)
      // setaddQues
      this.$api.question.search({hash_ids: hashIds}).then(res => {
        this.quesData = res.data.map(q => {
          q.items = q.items.filter(item => item)
          return q
        })
        this.setData(questions)
      })
    },
    addQuestion () {
      this.params.selectedRowKeys = this.questions.map(q => q.hash_id)
      this.params.show = true
    },
    onhandleCancel (e) {
      this.params.show = false
    },
    back () {
      let self = this
      self.$confirm({
        title: '温馨提示',
        content: '是否确认放弃当前编辑内容',
        onOk () {
          self.$router.go(-1)
        }
      })
    },
    setData (questions) {
      this.questions = questions
      let hashIds = questions.map(q => q.hash_id)
      let scores = questions.map(q => q.score)
      this.quesData.sort((a, b) => {
        return hashIds.indexOf(a.hash_id) - hashIds.indexOf(b.hash_id)
      })
      this.questionForm.setFieldsValue({
        questions
      })
      this.$nextTick(() => {
        this.questionForm.setFieldsValue({
          hashIds,
          scores
        })
        this.params.show = false
      })
    },
    move (index, type) {
      let { questions } = this
      if (type) {
        questions[index] = questions.splice(index + type, 1, questions[index])[0]
      } else {
        questions.splice(index, 1)
        this.quesData.splice(index, 1)
      }
      this.setData(questions)
    },
    submitExam () {
      var _self = this
      _self.questionForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.paperInfo.questions = values.questions.map((item, index) => {
            item.score = values.scores[index]
            return item
          })
          this.$api.paper.edit(this.paperInfo).then(res => {
            if (res.code === 0) {
              this.$router.push({
                path: '/content/paper/list',
                query: {
                  unTips: true
                }
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style scope>
  .crumb{width:100%;display:flex;margin-bottom:30px;}
  .crumb-1,.crumb-2,.crumb-3{width:50%;height: 50px;line-height: 50px;text-align: center;background-color: #f5f7fa;box-sizing: border-box;position: relative;}
  .crumb-1,.crumb-2{margin-right:25px;}
  .crumb-1-right,.crumb-2-right{width: 0;height: 0;border-top: 25px solid transparent;border-bottom: 25px solid transparent;border-left: 20px solid #f5f7fa;border-right: 0 solid transparent;position: absolute;top: 0;left: 100%;z-index: 9;}
  .crumb-2-left,.crumb-3-left{width: 0;height: 0;border-top: 25px solid #f5f7fa;border-bottom: 25px solid #f5f7fa;border-left: 20px solid transparent;border-right: 0 solid #f5f7fa;position: absolute;top: 0;right: 100%;z-index: 9;}
  .paperEdit .active_crumb{background-color: #2a75ed;color: #fff;}
  .active_crumb_right{border-left: 20px solid #2a75ed;}
  .active_crumb_left{border-top: 25px solid #2a75ed;border-bottom: 25px solid #2a75ed;border-left: 20px solid transparent;border-right: 0 solid #2a75ed;}
  .stepTwotips{height: 40px;line-height: 40px;padding-left: 10px;margin-top: 15px;background: rgba(255,184,94,.1);border: 1px solid #ffdeb4;-webkit-border-radius: 2px;border-radius: 2px;color: #353535;font-size: 14px;}
  .exportQues{width:100%;background:#fff;border:1px dashed #2a75ed;border-radius:0;color:#2a75ed;height:40px;}
  .ques-list{background: #f5f7fa;padding: 15px;margin-bottom: 20px;transition: all .5s;min-height: 120px;border-radius: 2px;position: relative;}
  .questionContent img{max-width: 100%;}
  .list-option{margin:0;padding:0;margin-left:20px;}
  .list-option li{margin-bottom:5px;list-style: none;line-height: 20px;}
  .move{position: absolute;right: 10px;bottom: 10px;display: flex;color: #888;font-size: 14px;cursor: pointer;}
  .move_down{margin-left: 12px;cursor: pointer;}
  .ques-list:last-child .move_down{display:none;}
</style>
