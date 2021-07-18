<template>
  <a-form :form="columnItem" @submit="handleSubmit" v-show="loaded">
    <a-form-item label="column_id" v-show="false">
      <a-input-number :min="0" v-decorator="['column_id']" />
    </a-form-item>
    <a-form-item label="专栏名称" v-bind="global.smallFormLayout">
      <a-input :maxLength="50" placeholder="专栏名称，不超过50个字"
        v-decorator="['title', { rules: [{ required: true, message: '请输入专栏名称!' }] }]"
        @input = "descInput"
      />
      <span class="text" style="float: right;color: #909399;position:absolute;right:10px;">{{remnant}}/54</span>
    </a-form-item>
    <a-form-item label="专栏简介" v-bind="global.smallFormLayout">
      <textarea rows="3" cols="30" placeholder="请输入专栏简介" style="width:100%"
        v-decorator="['describe', { rules: [{ required: true, message: '请输入专栏简介!' }] }]">
      </textarea>
    </a-form-item>
    <a-form-item label="封面图" v-bind="global.bigFormLayout">
      <a-row>
        <a-col :span="11">
          <a-avatar shape="square" icon="picture" :size="150" class="cover" :src="coverUrl" />
          <a-input v-show="false"
          v-decorator="['mediaCoverId', { rules: [{ required: true, message: '请上传封面!' }] }]" />
        </a-col>
        <a-col :span="12">
            <i-upload :type="type" used="cover" @ok="handleOk"></i-upload>
            <div class="tips">建议尺寸：750*420px或16:9，小于5M，支持jpg、png、jpeg格式</div>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="图文详情" v-bind="global.bigFormLayout" class="txtDetail">
      <vue-html5-editor :height="240" :auto-height="false" :show-module-name="false"
      v-decorator="['content',{rules: [{ required: true, message: '您还未填写题目信息'}]}]"></vue-html5-editor>
    </a-form-item>
    <a-form-item label="分类" v-bind="global.smallFormLayout">
      <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
        :dropdownStyle="dropdownStyle"
        :treeData="classified"
        placeholder='请选择分类'
        v-decorator="['categoryIds', { rules: [{ required: true, message: '请选择分类！' }] },]">
      </a-tree-select>
    </a-form-item>
    <a-form-item label="标签" v-bind="global.bigFormLayout">
      <span v-if="!tags.length">
        暂无标签数据，
        <router-link to="/classified/tag"> 前往标签管理 </router-link>
      </span>
      <a-tag :color="item.checked ? '#2db7f5' : 'blue'" v-for="item in tags" :key="item.id" @click="checkTag(item)">{{item.name}}</a-tag>
    </a-form-item>
    <a-form-item label="发布设置" v-bind="global.smallFormLayout" class="publishDetail">
      <a-radio-group v-decorator="['publishSetting']" width="100%" class="radioGroup">
        <a-radio :value="1">立即上架</a-radio>
        <a-radio :value="-2">暂不上架</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item v-bind="global.btnFormLayout">
      <a-button type="primary" html-type="submit" block slot="label">保存</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
export default {
  name: 'columnDetail',
  data () {
    return {
      loaded: false,
      tags: [],
      classified: [],
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      remnant: 0,
      transData: {},
      type: 'txt',
      content: '',
      visible: false,
      confirmLoading: false,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      disabled: true,
      coverUrl: '',
      columnItem: this.$form.createForm(this, {name: 'editor'}),
      column_id: this.$route.query.id,
      fromType: this.$store.state.fromType,
      plan_id: this.$route.query.plan_id
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    getDetails () {
      let _self = this
      _self.loaded = false
      if (_self.gotSelectList) {
        _self.initData()
      } else {
        Promise.all([
          _self.$api.label.list(),
          _self.$api.classified.list()
        ]).then(results => {
          _self.tags = results[0].data.show
          _self.classified = _self.initTree(results[1].data)
          _self.gotSelectList = true
          _self.initData()
        })
      }
    },
    initForm (data) {
      let _self = this
      _self.tags = _self.tags.map(item => {
        item.checked = false
        data.tagIds.forEach(tag => {
          if (tag === item.id) {
            item.checked = true
          }
        })
        return item
      })
      let fieldsValue = {
        column_id: _self.column_id, // 课程id
        title: data.title, // 课程标题
        mediaCoverId: data.mediaCoverId, // 封面图片id
        content: data.content,
        publishSetting: data.publishSetting, // 上架状态,
        describe: data.describe,
        categoryIds: data.categoryIds // 分类id
      }
      _self.coverUrl = data.cover // 封面地址
      _self.columnItem.setFieldsValue(fieldsValue) // 给表单赋值
    },
    initData () {
      let _self = this
      if (_self.column_id) {
        _self.$api.column.courses({// 编辑时请求远端数据
          column_id: _self.column_id
        }).then(res => {
          _self.loaded = true
          _self.initForm(res.data.column_info)
        })
      } else {
        _self.loaded = true
        _self.initForm({ // 添加时的默认值设置
          column_id: _self.column_id, // 课程id
          title: '',
          mediaCoverId: '',
          content: '',
          publishSetting: 1,
          coverUrl: '',
          describe: '',
          categoryIds: [],
          tagIds: []
        })
      }
    },
    handleOk (target) { // 上传成功
      this.coverUrl = target.url
      this.columnItem.setFieldsValue({mediaCoverId: target.resourceId}) // 给表单赋值
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.columnItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.categoryIds = _self.idsToArray(values.categoryIds)
          values.tagIds = _self.tags.filter(item => item.checked).map(item => item.id)
          if (this.column_id === '') {
            _self.$api.column.insert(values).then(res => {
              this.$router.push({
                path: '/content/specialColumn'
              })
            })
          } else {
            _self.$api.column.update({id: this.column_id}).then(res => {
              this.$router.push({
                path: '/content/specialColumn'
              })
            })
          }
        }
      })
    },
    descInput (e) {
      this.remnant = e.target.value.length
    },
    checkTag (item) {
      this.tags = this.tags.map(child => {
        if (item.id === child.id) {
          child.checked = !child.checked
        }
        return child
      })
    },
    idsToArray (val) {
      return Array.isArray(val) ? val : [val]
    }
  }
}
</script>
<style scope>
  .radioGroup .ant-calendar-picker{margin-left: 10px;}
</style>
