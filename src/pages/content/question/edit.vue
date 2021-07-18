<template>
  <a-form :form="form" @submit="handleSubmit" class="questionBody">
    <h1>{{types[type]}}</h1>
    <a-form-item label="hash_id" v-show="false">
      <a-input v-decorator="['hash_id']" />
    </a-form-item>
    <a-form-item label="试题分类" v-bind="global.smallFormLayout">
      <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
        style="width: 100%"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
        :treeData="categoryList"
        placeholder='请选择分类'
        :treeDefaultExpandedKeys = '["qc_no_category"]'
        v-decorator="[
          'hash_category_id',
          {rules: [{ required: true, message: '请选择分类!'}]}
        ]"
      >
      </a-tree-select>
    </a-form-item>
    <a-form-item label="题目" v-bind="global.bigFormLayout">
      <vue-html5-editor :height="240" :auto-height="true" :show-module-name="false"
        v-decorator="['content',{rules: [{ required: true, message: '您还未填写题目信息'}]}]"></vue-html5-editor>
    </a-form-item>
    <a-radio-group v-model="radioGgroup" v-if="type === '1'">
      <a-form-item :label="`选项${options[index]}`" class="anchor"
         v-bind="global.bigFormLayout"
        v-for="(k, index) in form.getFieldValue('items')" :key="k">
        <vue-html5-editor :height="240" :auto-height="true" :show-module-name="false"
          v-decorator="[
            `answers[${k}]`,
            {rules: [{ required: true, message: `您还未填写${[options[index]]}选项信息`}]}
          ]">
        </vue-html5-editor>
        <a-icon
          v-if="form.getFieldValue('items').length > 2"
          class="options-delete-button"
          type="minus-circle-o"
          @click="remove(k)"
        />
        <a-radio :value="k">
          设为正确答案
        </a-radio>
      </a-form-item>
      <a-form-item v-bind="global.bigFormLayout" label="  " v-if="form.getFieldValue('items') && form.getFieldValue('items').length < 26" class="addChoiceItem">
        <a-button type="dashed" style="width: 60%" @click="add">
          <a-icon type="plus" /> 新增选项
        </a-button>
      </a-form-item>
    </a-radio-group>
    <a-checkbox-group v-model="checkboxGgroup" v-if="type === '2'">
      <a-form-item :label="`选项${options[index]}`" class="anchor"
        v-bind="global.bigFormLayout"
        v-for="(k, index) in form.getFieldValue('items')" :key="k">
        <vue-html5-editor :height="240" :auto-height="true" :show-module-name="false"
          v-decorator="[
            `answers[${k}]`,
            {rules: [{ required: true, message: `您还未填写${[options[index]]}选项信息`}]}
          ]">
        </vue-html5-editor>
        <a-icon
          v-if="form.getFieldValue('items').length > 2"
          class="options-delete-button"
          type="minus-circle-o"
          @click="remove(k)"
        />
        <a-checkbox :value="k">
          设为正确答案
        </a-checkbox>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 18, push: 3}" v-if="form.getFieldValue('items') && form.getFieldValue('items').length < 26">
        <a-button type="dashed" style="width: 60%" @click="add">
          <a-icon type="plus" /> 新增选项
        </a-button>
      </a-form-item>
    </a-checkbox-group>
    <a-form-item label="答案" v-bind="global.bigFormLayout" v-if="type === '3'">
      <a-radio-group v-decorator="['rightAnswer', {rules: [{ required: true}]}]">
        <a-radio :value="0">
          正确
        </a-radio>
        <a-radio :value="1">
          错误
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <div v-if="type === '4'">
      <a-form-item label="答案" class="typeTips" v-bind="global.bigFormLayout" :required="true">
        每空一个答案
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 18, push: 3}" v-for="(k, index) in form.getFieldValue('items')" :key="k">
        <a-input
          :addonBefore="index + 1"
          v-decorator="[
            `rightAnswer[${k}]`,
            {
              rules: [{required: true,whitespace: true,message: '请设置内容或者删除此项'}]
            }
          ]"
          :placeholder="`请输入第${index+1}空答案`"
          style="width: 60%; margin-right: 8px"
        />
        <a-icon
          v-if="form.getFieldValue('items').length > 1"
          class="dynamic-delete-button"
          type="minus-circle-o"
          :disabled="form.getFieldValue('items').length === 1"
          @click="removeAnswer(k)"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 18, push: 3}">
        <a-button type="dashed" style="width: 60%" @click="add">
          <a-icon type="plus" /> 添加填空
        </a-button>
      </a-form-item>
    </div>
    <a-form-item label="答案" v-bind="global.bigFormLayout" v-if="type === '5'">
      <vue-html5-editor :height="240" :auto-height="true" :show-module-name="false"
        v-decorator="['rightAnswer',{rules: [{ required: true, message: '您还未填写题目信息'}]}]"></vue-html5-editor>
    </a-form-item>
    <a-form-item label="解析(选填)" v-bind="global.bigFormLayout">
      <vue-html5-editor :height="240" :auto-height="true" :show-module-name="false"
        v-decorator="['analysis']"></vue-html5-editor>
    </a-form-item>
    <a-form-item v-bind="global.btnFormLayout">
      <a-button type="primary" html-type="submit" block slot="label">保存</a-button>
      <a-button @click="backList" block>取消</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
const initData = {
  hash_id: '',
  hash_category_id: '',
  content: '',
  analysis: ''
}

export default {
  name: 'question',
  data () {
    return {
      types: this.$store.state.questionTypes,
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      id: 1,
      categoryList: [],
      items: [],
      answers: [],
      radioGgroup: '',
      checkboxGgroup: []
    }
  },
  computed: {
    hash_id () {
      return this.$route.query.id
    },
    type () {
      return '' + this.$route.query.type
    }
  },
  beforeCreate () {
    let type = '' + this.$route.query.type
    this.form = this.$form.createForm(this, {
      onFieldsChange: (_, changedFields) => {},
      mapPropsToFields: () => {
        let resoult = {}
        for (var key in initData) {
          resoult[key] = this.$form.createFormField({
            value: initData[key]
          })
        }
        if (type === '3') {
          resoult.rightAnswer = this.$form.createFormField({
            value: 0
          })
        } else if (type === '5') {
          resoult.rightAnswer = this.$form.createFormField({
            value: ''
          })
        }
        return resoult
      },
      onValuesChange (_, values) {}
    })

    if (type === '1' || type === '2' || type === '4') {
      this.form.getFieldDecorator('items', { initialValue: this.items, preserve: true })
    }
  },
  mounted () {
    this.getCategory()
    if (this.hash_id) {
      this.getQuestion()
    } else {
      this.form.setFieldsValue(initData)
      if (this.type === '1' || this.type === '2') {
        this.items = [0, 1, 2, 3]
        this.answers = ['', '', '', '']
        this.id = 4
        this.form.setFieldsValue({
          items: this.items
        })
        this.$nextTick(() => {
          this.form.setFieldsValue({
            answers: this.answers
          })
        })
      } else if (this.type === '4') {
        this.items = [0]
        this.answers = ['']
        this.id = 1
        this.form.setFieldsValue({
          items: this.items
        })
        this.$nextTick(() => {
          this.form.setFieldsValue({
            rightAnswer: this.answers
          })
        })
      } else if (this.type === '3') {
        this.form.setFieldsValue({
          rightAnswer: 0
        })
      } else if (this.type === '5') {
        this.form.setFieldsValue({
          rightAnswer: ''
        })
      }
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, formData) => {
        if (!err) {
          if (this.type === '1') {
            if (!this.radioGgroup && typeof this.radioGgroup === 'string') {
              this.$message.error('您还未设置正确答案')
              return
            } else {
              formData.rightAnswer = [this.radioGgroup]
              formData.items = formData.answers
            }
          } else if (this.type === '2') {
            if (!this.checkboxGgroup.length) {
              this.$message.error('您还未设置正确答案')
              return
            } if (this.checkboxGgroup.length < 2) {
              this.$message.error('多选题答案至少设置2个')
              return
            } else {
              formData.rightAnswer = this.checkboxGgroup.sort((a, b) => a - b)
              formData.items = formData.answers
            }
          } else if (this.type === '4') {
            formData.rightAnswer = formData.rightAnswer.filter(item => item)
            formData.items = formData.items.map((item, index) => {
              item = index
              return item
            })
          } else if (this.type === '3' || this.type === '5') {
            formData.rightAnswer = [formData.rightAnswer]
            formData.items = []
          }
          formData.question_type = this.type
          formData.analysis = formData.analysis || '无'
          if (formData.hash_id) {
            this.$api.question.edit(formData).then(res => {
              this.$router.push({
                path: '/content/question/list',
                query: {
                  unTips: true
                }
              })
            })
          } else {
            this.$api.question.add(formData).then(res => {
              this.$router.push({
                path: '/content/question/list',
                query: {
                  unTips: true
                }
              })
            })
          }
        }
      })
    },
    backList () {
      this.$router.push({
        path: '/content/question/list'
      })
    },
    getCategory () {
      this.$api.questionCategory.tree().then(res => {
        this.categoryList = res.data
      })
    },
    getQuestion () {
      this.$api.question.getInfo({
        hash_id: this.hash_id
      }).then(res => {
        let detail = res.data
        if (this.type === '1' || this.type === '2') {
          let items = detail.items.map((item, index) => {
            item = index
            return item
          })
          this.form.getFieldDecorator('items', { initialValue: items, preserve: true })
          this.form.setFieldsValue({
            items: items
          })
        } else if (this.type === '4') {
          this.form.setFieldsValue({
            items: detail.items || []
          })
        } else if (this.type === '3' || this.type === '5') {
          this.form.setFieldsValue({
            rightAnswer: detail.rightAnswer[0]
          })
        }
        this.id = detail.items.length
        this.$nextTick(() => {
          let fieldsValue = {
            hash_id: this.hash_id,
            hash_category_id: res.data.hash_category_id || '',
            content: detail.content || '',
            analysis: detail.analysis || ''
          }
          if (this.type === '1' || this.type === '2') {
            fieldsValue.answers = detail.items
          } else if (this.type === '4') {
            fieldsValue.rightAnswer = detail.rightAnswer || []
          }
          this.form.setFieldsValue(fieldsValue)
          if (this.type === '1') {
            this.radioGgroup = detail.rightAnswer[0]
          } else if (this.type === '2') {
            this.checkboxGgroup = detail.rightAnswer
          }
        })
      })
    },
    remove (k) {
      const items = this.form.getFieldValue('items')
      items.pop()
      console.log(this.form.getFieldValue('items'))
      const answers = this.form.getFieldValue('answers').filter((key, index) => index !== k)
      console.log(answers)
      this.form.setFieldsValue({
        items: items
      })
      this.$nextTick(() => {
        this.form.setFieldsValue({
          answers
        })
      })
    },
    removeAnswer (k) {
      const items = this.form.getFieldValue('items')
      items.pop()
      const rightAnswer = this.form.getFieldValue('rightAnswer').filter((key, index) => index !== k)
      this.form.setFieldsValue({
        items: items
      })
      this.$nextTick(() => {
        this.form.setFieldsValue({
          rightAnswer
        })
      })
    },
    add () {
      const items = this.form.getFieldValue('items')
      const nextitems = items.concat(items.length)
      this.form.setFieldsValue({
        items: nextitems
      })
      if (this.type === '1' || this.type === '2') {
        const answers = this.form.getFieldValue('answers')
        const nextanswers = answers.concat('')
        this.$nextTick(() => {
          this.form.setFieldsValue({
            answers: nextanswers
          })
        })
      } else if (this.type === '4') {
        const rightAnswer = this.form.getFieldValue('rightAnswer')
        const nextanswers = rightAnswer.concat('')
        this.$nextTick(() => {
          this.form.setFieldsValue({
            rightAnswer: nextanswers
          })
        })
      }
    }
  }
}
</script>
<style scope>
.questionBody .ant-radio-group,.questionBody .ant-checkbox-group{display: block;}
.anchor{position: relative;}
.anchor .ant-form-item-control,.anchor .ant-form-item-children{position: static;}
.dynamic-delete-button {cursor: pointer;position: relative;top: 4px;font-size: 24px;color: #999;transition: all 0.3s;}
.dynamic-delete-button:hover {color: #777;}
.options-delete-button{cursor: pointer;position: absolute;right:-40px;top: 4px;font-size: 24px;color: #999;transition: all 0.3s;}
.options-delete-button:hover {color: #777;}
.dynamic-delete-button[disabled] {cursor: not-allowed;opacity: 0.5;}
.typeTips{color: #b0b0b0;margin-bottom: 0;}
.questionBody{padding-bottom: 60px;}
.addChoiceItem label{display: none;}
</style>
