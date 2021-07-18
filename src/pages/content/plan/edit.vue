<template>
  <a-form :form="currentItem" @submit="handleSubmit" v-show="loaded" class="planEdit">
    <h2>基本信息</h2>
    <a-form-item label="hash_id" v-show="false">
      <a-input-number :min="0" v-decorator="['hash_id']" />
    </a-form-item>
    <a-form-item label="计划名称" v-bind="global.bigFormLayout">
      <a-input
        :maxLength="50"
        placeholder="请输入培训计划名称（最多不超过50字）"
        v-decorator="['title', { rules: [{ required: true, message: '请输入培训计划名称!' }] }]"
      />
    </a-form-item>
    <a-form-item label="计划封面" v-bind="global.bigFormLayout">
      <a-row>
        <a-col :span="22">
          <a-avatar shape="square" icon="picture" class="editCover" :src="mediaCoverUrl"/>
          <div class="coverTips">
            <a-input v-show="false"
            v-decorator="['mediaCoverId', { rules: [{ required: true, message: '请上传计划封面!' }] }]" />
            <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUpload" :action="parmasUpload.resourceHost" :data="setData" @change="onChange">
              <a-button class="upType" :disabled="uploadFlag"> <a-icon type="upload" /> 选择文件 </a-button>
            </a-upload>
            <span v-if="uploadFlag"><a-spin size="small" />正在上传中</span>
            <p>培训计划封面指在培训计划列表展示的图片，请上传比例为4:3的图片，JPG/PNG格式，图片小于5M</p>
          </div>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="计划详情" v-bind="global.bigFormLayout">
      <vue-html5-editor :height="240" :auto-height="false" :show-module-name="false"
      v-decorator="['content',{rules: [{ required: true, message: '请填写计划详情！'}]}]"></vue-html5-editor>
    </a-form-item>
    <a-form-item label="计划分类" v-bind="global.smallFormLayout">
      <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
        :dropdownStyle="dropdownStyle"
        :treeData="classified"
        placeholder='请选择分类'
        v-decorator="['hash_category_id']">
      </a-tree-select>
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
        <a-radio :value="2">每个任务奖励学分</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="奖励学分" v-bind="global.smallFormLayout">
      <a-input-number :min="0"
      v-decorator="[
        'credit',
        {rules: [{ required: true, message: '学分必须为大于等于0的整数!'}]}
      ]"/> 分
    </a-form-item>
    <h2>时间报名信息</h2>
    <a-form-item label="报名时间" v-bind="global.midFormLayout">
      <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss"
      v-decorator="['signup_time',{rules: [{ required: true, message: '请选择培训计划的报名时间！'}]}]"></a-range-picker>
    </a-form-item>
    <a-form-item label="开课时间" v-bind="global.midFormLayout">
      <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss"
      v-decorator="['class_time',{rules: [{ required: true, message: '请选择培训计划的上课时间！'}]}]"></a-range-picker>
    </a-form-item>
    <a-form-item label="是否开放报名" v-bind="global.smallFormLayout">
      <a-radio-group name="radioGroup" v-decorator="['is_openup']">
        <a-radio :value="1">是</a-radio>
        <a-radio :value="0">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <!-- <h2>学习模式</h2> -->
    <a-form-item label="学习模式" v-bind="global.smallFormLayout" v-show="false">
      <a-radio-group name="radioGroup" v-decorator="['learn_mode']">
        <a-radio :value="1">自由式学习</a-radio>
        <a-radio :value="2">解锁式学习</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item v-bind="global.btnFormLayout">
      <a-button type="primary" html-type="submit" block slot="label">保存</a-button>
      <a-button block @click="cancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import moment from 'moment'
export default {
  name: 'planEdit',
  data () {
    return {
      confirmLoading: false,
      loaded: false,
      gotSelectList: false,
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      disabled: true,
      mediaName: '',
      mediaCoverUrl: '',
      videoCoverUrl: '',
      currentItem: this.$form.createForm(this, {name: 'editor'}),
      classified: [],
      plan_id: this.$route.query.id,
      uploadFlag: false,
      parmasUpload: this.$store.state.uploadParmas,
      imgfileList: []
    }
  },
  mounted () {
    this.$api.category.list({type: 'project_plan'}).then(res => {
      this.classified = res.data
    })
    this.getDetails()
  },
  methods: {
    moment,
    getDetails () {
      let _self = this
      _self.loaded = false
      _self.initData()
    },
    initData () {
      let _self = this
      if (_self.plan_id) {
        _self.$api.plan.getInfo({// 编辑时请求远端数据
          hash_id: _self.plan_id
        }).then(res => {
          _self.loaded = true
          let form = res.data
          if (form.signup_start_time && form.start_time && form.signup_end_time && form.end_time) {
            form.signup_time = [_self.moment(new Date(form.signup_start_time * 1000)), _self.moment(new Date(form.signup_end_time * 1000))]
            form.class_time = [_self.moment(new Date(form.start_time * 1000)), _self.moment(new Date(form.end_time * 1000))]
          }
          delete form.signup_start_time
          delete form.signup_end_time
          delete form.start_time
          delete form.end_time
          delete form.hash_id
          delete form.channelIds
          _self.initForm(form)
        })
      } else {
        _self.loaded = true
        _self.initForm({ // 添加时的默认值设置
          hash_id: _self.plan_id, // 课程id
          title: '',
          mediaCoverId: this.$store.state.defaultSetting.defaultCovers.projectPlan.fileId,
          mediaCoverUrl: this.$store.state.defaultSetting.defaultCovers.projectPlan.fileUrl,
          publishSetting: 1,
          is_openup: 1,
          learn_mode: 1,
          hash_category_id: '',
          content: '',
          signup_time: [],
          class_time: [],
          credit_type: 1,
          credit: 0
        })
      }
    },
    initForm (data) {
      let _self = this
      _self.mediaCoverUrl = data.mediaCoverUrl // 封面地址
      delete data.mediaCoverUrl
      let fieldsValue = {
        hash_id: _self.plan_id, // 课程id
        title: data.title,
        mediaCoverId: data.mediaCoverId,
        mediaCoverUrl: data.mediaCoverUrl,
        publishSetting: data.publishSetting,
        is_openup: data.is_openup,
        learn_mode: data.learn_mode,
        hash_category_id: data.hash_category_id,
        content: data.content,
        signup_time: data.signup_time,
        class_time: data.class_time,
        credit_type: data.credit_type,
        credit: data.credit
      }
      _self.currentItem.setFieldsValue(fieldsValue) // 给表单赋值
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.currentItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.signup_start_time = parseInt(new Date(values.signup_time[0]._d).getTime() / 1000)
          values.signup_end_time = parseInt(new Date(values.signup_time[1]._d).getTime() / 1000)
          values.start_time = parseInt(new Date(values.class_time[0]._d).getTime() / 1000)
          values.end_time = parseInt(new Date(values.class_time[1]._d).getTime() / 1000)
          delete values.class_time
          delete values.signup_time
          if (values.hash_id) {
            _self.$api.plan.edit(values).then(res => {
              if (!res.code) {
                this.$router.push({
                  path: '/content/plan/relation',
                  query: {
                    id: res.data.hash_id,
                    tab: 1,
                    unTips: true
                  }
                })
              }
            })
          } else {
            _self.$api.plan.add(values).then(res => {
              if (!res.code) {
                this.$router.push({
                  path: '/content/plan/relation',
                  query: {
                    id: res.data.hash_id,
                    tab: 1,
                    unTips: true
                  }
                })
              }
            })
          }
        }
      })
    },
    cancel () {
      this.$router.push({
        path: '/content/plan/list'
      })
    },
    idsToArray (val) {
      return Array.isArray(val) ? val : [val]
    },
    onRadioChange (e) {
      let _self = this
      _self.$nextTick(() => {
        _self.currentItem.setFieldsValue({
          credit: _self.currentItem.getFieldValue('credit') || 0
        })
      })
    },
    onChange (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.imgfileList = fileList
      this.mediaCoverUrl = fileList[0].thumbUrl
      this.currentItem.setFieldsValue({mediaCoverId: fileList[0].fileId})
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
  .planEdit .radioGroup .ant-calendar-picker{margin-left: 10px;}
  .planEdit .ant-upload-list-picture{display:none!important}
</style>
