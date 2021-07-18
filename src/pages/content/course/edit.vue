<template>
  <a-form :form="courseItem" @submit="handleSubmit" v-show="loaded" class="courseEdit">
    <a-form-item label="course_id" v-show="false">
      <a-input v-decorator="['course_id']" />
    </a-form-item>
    <h2>基本信息</h2>
    <a-form-item label="课程名称" v-bind="global.bigFormLayout">
      <a-input :maxLength="50" placeholder="请输入课程名称（最多不超过50字）"
        v-decorator="['title', { rules: [{ required: true, message: '请输入课程名称!' }] }]"
      />
    </a-form-item>
    <a-form-item label="课程封面" v-bind="global.bigFormLayout">
      <a-row>
        <a-col :span="22">
          <a-avatar shape="square" icon="picture" class="editCover" :src="coverUrl"/>
          <div class="coverTips">
            <a-input v-show="false"
            v-decorator="['mediaCoverId', { rules: [{ required: true, message: '请上传课程封面!' }] }]" />
            <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUpload" :action="parmasUpload.resourceHost" :data="setData" @change="onChange">
              <a-button class="upType" :disabled="uploadFlag"> <a-icon type="upload" /> 选择文件 </a-button>
            </a-upload>
            <span v-if="uploadFlag"><a-spin size="small" />正在上传中</span>
            <p>课程封面指在课程列表展示的图片，请上传比例为4:3的图片，JPG/PNG格式，图片小于5M</p>
          </div>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="课程详情" v-bind="global.bigFormLayout">
      <vue-html5-editor :height="240" :auto-height="false" :show-module-name="false"
      v-decorator="['content',{rules: [{ required: true, message: '请填写课程详情！'}]}]"></vue-html5-editor>
    </a-form-item>
    <a-form-item label="主讲老师" v-bind="global.bigFormLayout">
      <a-input v-show="false"
      v-decorator="['hash_user_id', {rules: [{ required: true, message: '请选择主讲老师!'}]}]" />
      <p v-if="courseItem.getFieldValue('hash_user_id')" class="teacherBox"><img :src="teacherPic" alt=""><span>{{teacherName}}</span></p>
      <a-button icon="plus" @click="chooseTeacher">选择讲师</a-button>
      <i-choose :params="params" @ok="getTeacher" @cancel="onhandleCancel" type="teacher"/>
    </a-form-item>
    <a-form-item label="课程分类" v-bind="global.smallFormLayout">
      <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
        :dropdownStyle="dropdownStyle"
        :treeData="classified"
        placeholder='请选择分类'
        treeNodeFilterProp="title"
        v-decorator="['hash_category_id']">
      </a-tree-select>
    </a-form-item>
    <a-form-item label="课程标签" v-bind="global.smallFormLayout">
      <a-select showSearch mode="tags" placeholder="请选择标签" style="width: 100%"
      :getPopupContainer="triggerNode => triggerNode.parentNode"
      v-decorator="['hash_tag_ids']">
        <a-select-option v-for="item in labelData" :key="item.name">
          {{item.name}}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="上架设置" v-bind="global.smallFormLayout">
      <a-radio-group v-decorator="['publishSetting']" width="100%" class="radioGroup">
        <a-radio :value="1">立即上架</a-radio>
        <a-radio :value="-1">暂不上架</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="奖励类型" v-bind="global.smallFormLayout">
      <a-radio-group v-decorator="['credit_type', {rules: [{ required: true}]}]" @change="onRadioChange" class="radioGroup">
        <a-radio :value="1">全部完成奖励学分</a-radio>
        <a-radio :value="2">每讲奖励学分</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="奖励学分" v-bind="global.smallFormLayout">
      <a-input-number :min="0"
      v-decorator="[
        'credit',
        {rules: [{ required: true, message: '学分必须为大于等于0的整数!'}]}
      ]"/> 分
    </a-form-item>
    <a-form-item label="总讲数" v-bind="global.smallFormLayout">
      <a-input style="width:100px;"
        v-decorator="[
          'lesson_num',
          { rules: [
              {
                required: courseItem.getFieldValue('credit_type') === 1,
                message: '讲数不能为空!'
              }
            ]
          }
        ]"
      />
      <span v-if="courseItem.getFieldValue('credit_type') === 2" style="color:#aaa"> 0表示不限制</span>
    </a-form-item>
    <h2>学习设置</h2>
    <a-form-item label="是否开放报名" v-bind="global.smallFormLayout">
      <a-radio-group name="radioGroup" v-decorator="['is_openup']">
        <a-radio :value="1">是</a-radio>
        <a-radio :value="0">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item v-bind="global.btnFormLayout">
      <a-button type="primary" html-type="submit" :disabled="uploadFlag" block slot="label">保存</a-button>
      <a-button block @click="cancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
export default {
  data () {
    return {
      params: {
        type: 'account', // 请求方法的路径
        name: '讲师', // 名称
        show: false, // 展示
        tableKey: 'hash_user_id',
        selectionType: 'radio', // 多选 'checkbox'
        haveCreateButton: false, // 新建按钮
        filters: {
          search_content: ''
        }, // 筛选条件 无=={}
        otherFilters: {user_type: 2}, // 其他固定筛选条件 例如： 讲师 无=={}
        selectedRowKeys: [], // 列表中的已选项 无==[]
        columns: [ // 表格列
          {title: '姓名', dataIndex: 'nickname', key: 'nickname'},
          {title: '用户名', dataIndex: 'user', key: 'user', scopedSlots: { customRender: 'user' }, align: 'center', width: 150}
        ]
      },
      loaded: false,
      classified: [],
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
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
      courseItem: this.$form.createForm(this, {name: 'editor'}),
      fromType: this.$store.state.fromType,
      labelData: [],
      showRelatedStaff: false,
      teacherPic: '',
      teacherName: '',
      uploadFlag: false,
      parmasUpload: this.$store.state.uploadParmas,
      imgfileList: []
    }
  },
  computed: {
    course_id () {
      return this.$route.query.id
    }
  },
  mounted () {
    Promise.all([this.$api.category.list({type: 'course'}), this.$api.label.list()]).then(res => {
      this.classified = res[0].data
      this.labelData = res[1].data
      this.getDetails()
    })
  },
  methods: {
    tagsChange (labels) {
      let repeatLabel = false
      let [ newName ] = labels.filter(id => {
        return !this.labelData.filter(label => id === label.hash_id).length
      })
      if (newName) {
        repeatLabel = true
        labels = labels.map(item => {
          if (item === newName) {
            repeatLabel = false
            item = this.labelData.filter(label => label.name === newName)[0].hash_id
          }
          return item
        })
        this.courseItem.setFieldsValue({hash_tag_ids: labels})
      }
      if (repeatLabel) {
        this.$api.label.add({name: newName}).then(res => {
          let newHashId = res.data.hash_id
          this.$api.label.list().then(res => {
            this.labelData = res.data
            labels = labels.map(item => {
              item = item === newName ? newHashId : item
              return item
            })
            this.courseItem.setFieldsValue({hash_tag_ids: labels})
          })
        })
      }
    },
    getDetails () {
      let _self = this
      _self.loaded = false
      _self.initData()
    },
    initForm (data) {
      let _self = this
      data.hash_tag_ids = data.hash_tag_ids.map(item => {
        _self.labelData.forEach(label => {
          if (label.hash_id === item) {
            item = label.name
          }
        })
        return item
      })
      let fieldsValue = {
        course_id: data.course_id, // 课程id
        title: data.title, // 课程标题
        mediaCoverId: data.mediaCoverId, // 封面图片id
        content: data.content,
        publishSetting: data.publishSetting, // 上架状态
        hash_user_id: data.hash_user_id,
        hash_category_id: data.hash_category_id, // 分类id
        hash_tag_ids: data.hash_tag_ids, // 标签
        is_openup: data.is_openup,
        lesson_num: data.lesson_num,
        credit_type: data.credit_type,
        credit: data.credit
      }
      _self.coverUrl = data.coverUrl // 封面地址
      _self.courseItem.setFieldsValue(fieldsValue) // 给表单赋值
    },
    initData () {
      let _self = this
      if (_self.course_id) {
        _self.$api.course.lessons({// 编辑时请求远端数据
          hash_resource_id: _self.course_id
        }).then(res => {
          _self.loaded = true
          _self.initForm(res.data.course_info)
          _self.coverUrl = res.data.course_info.mediaCoverUrl
          _self.teacherName = res.data.course_info.username
          _self.teacherPic = res.data.course_info.avatar
        })
      } else {
        _self.loaded = true
        _self.initForm({ // 添加时的默认值设置
          course_id: _self.course_id, // 课程id
          title: '',
          mediaCoverId: this.$store.state.defaultSetting.defaultCovers.course.fileId,
          content: '',
          publishSetting: 1,
          coverUrl: this.$store.state.defaultSetting.defaultCovers.course.fileUrl,
          hash_user_id: '',
          hash_category_id: '',
          hash_tag_ids: [],
          is_openup: 1,
          lesson_num: '',
          credit_type: 1,
          credit: 0
        })
      }
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.courseItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let insertTag = []
          values.hash_tag_ids = values.hash_tag_ids.map(item => {
            let find = _self.labelData.filter(label => label.name === item)
            if (find.length) {
              return find[0].hash_id
            } else {
              insertTag.push(_self.$api.label.add({name: item}))
            }
          }).filter(item => item)
          Promise.all(insertTag).then(res => {
            res.forEach(item => {
              values.hash_tag_ids.push(item.data.hash_id)
            })
            _self.saveCourse(values)
          })
        }
      })
    },
    saveCourse (values) {
      if (this.course_id === '') {
        this.$api.course.add(values).then(res => {
          if (res.code === 0) {
            this.$router.push({
              path: '/content/course/relation',
              query: {
                unTips: true,
                tab: 1,
                id: res.data.hash_id
              }
            })
          }
        })
      } else {
        values.hash_id = this.course_id
        this.$api.course.edit(values).then(res => {
          if (res.code === 0) {
            this.$router.push({
              path: '/content/course/list',
              query: {
                unTips: true
              }
            })
          }
        })
      }
    },
    idsToArray (val) {
      return Array.isArray(val) ? val : [val]
    },
    chooseTeacher () { // 选择讲师
      this.params.show = true
      this.params.selectedRowKeys = [this.courseItem.getFieldValue('hash_user_id')]
    },
    onhandleCancel (e) {
      this.params.show = false
    },
    getTeacher (selectedRowKeys) { // 获取讲师
      this.params.show = false
      if (selectedRowKeys.length) {
        this.courseItem.setFieldsValue({hash_user_id: selectedRowKeys[0]})
        this.$api.course.getTeacherInfo({
          hash_user_id: selectedRowKeys[0]
        }).then(res => {
          if (res.code === 0) {
            this.teacherPic = res.data.avatar
            this.teacherName = res.data.username
          }
        })
      }
    },
    cancel () {
      this.$router.push({
        path: '/content/course/list'
      })
    },
    onRadioChange (e) {
      let _self = this
      _self.$nextTick(() => {
        _self.courseItem.setFieldsValue({
          credit: 0,
          lesson_num: _self.courseItem.getFieldValue('lesson_num') || 0
        })
      })
    },
    onChange (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.imgfileList = fileList
      this.courseItem.setFieldsValue({mediaCoverId: fileList[0].fileId})
      this.coverUrl = fileList[0].thumbUrl
      if (fileList[0].status === 'done') {
        this.uploadFlag = false
      }
    },
    setData (file) {
      return {
        'name': file.name,
        'key': file.fileHashId,
        'policy': this.parmasUpload.policy,
        'OSSAccessKeyId': this.parmasUpload.accessId,
        'success_action_status': '200', // 让服务端返回200,不然，默认会返回204
        'signature': this.parmasUpload.signature
      }
    },
    beforeUpload (file, fileList) {
      this.uploadFlag = true
      var that = this
      return new Promise((resolve, reject) => {
        var uploadSecondData = {
          ext: file.name.substring(file.name.lastIndexOf('.') + 1),
          type: file.type,
          fileName: file.name,
          fileSize: file.size,
          bucketHost: that.parmasUpload.resourceHost
        }
        that.$api.upload.second(JSON.stringify(uploadSecondData)).then(res => {
          if (res && !res.code) {
            file.fileId = res.data.fileId
            file.fileHashId = res.data.fileHashId
            resolve()
          } else {
            that.$message.error('上传失败!')
            reject(new Error('出错啦'))
          }
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
  .courseEdit .ant-upload-list-picture{display:none!important}
</style>
