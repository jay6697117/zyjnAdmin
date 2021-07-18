<template>
  <div class="paperEdit">
    <div class="crumb">
      <div class="crumb-1 active_crumb">
        1.设置试卷信息
        <div class="crumb-1-right active_crumb_right"></div>
      </div>
      <div class="crumb-2">
        2.添加题目
        <div class="crumb-3-left"></div>
      </div>
    </div>
    <a-form :form="examItem" @submit="handleSubmit">
      <a-form-item label="hash_id" v-show="false">
        <a-input-number :min="0" v-decorator="['hash_id']" />
      </a-form-item>
      <h2>基本信息</h2>
      <a-form-item :label="'试卷名称'" v-bind="global.bigFormLayout">
        <a-input :maxLength="50" placeholder="请输入试卷名称（最多不超过50字）"
          v-decorator="['title', { rules: [{ required: true, message: '请输入试卷名称!' }] }]"
        />
      </a-form-item>
      <a-form-item :label="'试卷封面'" v-bind="global.bigFormLayout">
        <a-row>
          <a-col :span="22">
            <a-avatar shape="square" icon="picture" class="editCover" :src="coverUrl"/>
            <div class="coverTips">
              <a-input v-show="false"
              v-decorator="['cover_file_id', { rules: [{ required: true, message: '请上传专项考试封面!' }] }]" />
              <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUpload" :action="parmasUpload.resourceHost" :data="setData" @change="onChange">
                <a-button class="upType" :disabled="uploadFlag"> <a-icon type="upload" /> 选择文件 </a-button>
              </a-upload>
              <span v-if="uploadFlag"><a-spin size="small" />正在上传中</span>
              <p>试卷封面指在学员考试前展示的图片，请上传比例为4:3的图片，JPG/PNG格式，图片小于5M</p>
            </div>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item :label="'试卷详情'" v-bind="global.bigFormLayout" class="txtDetail">
        <vue-html5-editor :height="240" :auto-height="false" :show-module-name="false"
        v-decorator="['content',{rules: [{ required: true, message: '请填写试卷详情！'}]}]"></vue-html5-editor>
      </a-form-item>
      <a-form-item label="发布设置" v-bind="global.smallFormLayout">
        <a-radio-group name="radioGroup" v-decorator="['publishSetting']" :disabled="!questions.length">
          <a-radio :value="1">立即发布</a-radio>
          <a-radio :value="-1">暂不发布</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-bind="global.btnFormLayout">
        <a-button type="primary" html-type="submit" :disabled="uploadFlag" block slot="label">保存并下一步</a-button>
        <a-button block @click="cancelExam">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
export default {
  name: 'paperEdit',
  data () {
    return {
      disabledTime: true,
      type: 'txt',
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      coverUrl: '',
      examItem: this.$form.createForm(this, {name: 'editor'}),
      content: '',
      uploadFlag: false,
      loadTxt: '',
      questions: [],
      stepTwoShow: false,
      parmasUpload: this.$store.state.uploadParmas,
      imgfileList: []
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  mounted () {
    let _self = this
    if (_self.id) {
      _self.$api.paper.getInfo({// 编辑时请求远端数据
        hash_id: _self.id
      }).then(res => {
        if (res.code === 0) {
          this.questions = res.data.questions
          if (!this.questions.length) {
            this.examItem.setFieldsValue({publishSetting: 1})
          }
          this.initForm(res.data)
        }
      })
    } else {
      this.initForm({ // 添加时的默认值设置
        hash_id: '', // 课程id
        title: '',
        cover_file_id: this.$store.state.defaultSetting.defaultCovers.paper.fileId,
        content: '',
        publishSetting: -1,
        coverUrl: this.$store.state.defaultSetting.defaultCovers.paper.fileUrl
      })
    }
  },
  methods: {
    initForm (data) {
      this.hash_id = data.hash_id
      let _self = this
      let fieldsValue = {
        hash_id: data.hash_id, // 课程id
        title: data.title, // 课程标题
        cover_file_id: data.cover_file_id, // 封面图片id
        content: data.content,
        publishSetting: data.publishSetting
      }
      _self.coverUrl = data.coverUrl // 封面地址
      if (data.publishSetting > 1) {
        _self.disabledTime = false
      }
      setTimeout(() => {
        _self.examItem.setFieldsValue(fieldsValue) // 给表单赋值
      }, 0)
    },
    handleOk (target) { // 上传成功
      this.uploadFlag = target.uploadFlag
      if (target.uploadFlag) {
        this.loadTxt = target.loadTxt
        return
      }
      this.coverUrl = target.url
      this.examItem.setFieldsValue({cover_file_id: target.resourceId}) // 给表单赋值
    },
    handleSubmit (e) {
      e.preventDefault()
      this.examItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.publishSetting = values.publishSetting === 0 ? new Date(values.publishSettingTime._d).getTime() / 1000 : values.publishSetting
          values.questions = this.questions
          if (values.hash_id) {
            this.$api.paper.edit(values).then(res => {
              if (res.code === 0) {
                this.$router.push({
                  path: '/content/paper/question',
                  query: {
                    id: values.hash_id,
                    unTips: true
                  }
                })
              }
            })
          } else {
            delete values.hash_id
            this.$api.paper.add(values).then(res => {
              if (res.code === 0) {
                this.$router.push({
                  path: '/content/paper/question',
                  query: {
                    id: res.data.hash_id,
                    unTips: true
                  }
                })
              }
            })
          }
        }
      })
    },
    cancelExam () {
      let self = this
      if (!self.id) {
        this.$router.push({
          path: '/content/paper/list'
        })
      } else {
        this.$router.push({
          path: '/content/paper/list'
        })
      }
    },
    onChange (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.imgfileList = fileList
      this.coverUrl = fileList[0].thumbUrl
      this.examItem.setFieldsValue({cover_file_id: fileList[0].fileId}) // 给表单赋值
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
  .paperEdit .ant-btn-link {color: #1890ff;background-color: transparent;border-color: transparent;box-shadow: none;}
  .paperEdit .crumb .ant-modal{height: 90%;top: 50px;}
  .paperEdit .ant-modal-content{display: flex;flex-direction: column;}
  .paperEdit .ant-modal-content .ant-modal-header{flex:0 0 55px}
  .paperEdit .ant-modal-content .ant-modal-body{flex:1;overflow-x: hidden;}
  .paperEdit .mediaName{border: 0;cursor: default;background: none; color: #303030;}
  .paperEdit .radioGroup .ant-calendar-picker{margin-left: 10px;}
  .paperEdit .txtDetail label:before,.publishDetail .ant-col-3 label:before,.answerDetail .ant-col-3 label:before{display: inline-block;margin-right: 4px;color: #f5222d;font-size: 14px;font-family: SimSun, sans-serif;line-height: 1;content: '*'}
  .paperEdit .input_tips{color:#999;font-size:12px;}
  .paperEdit .crumb{width:100%;display:flex;margin-bottom:30px;}
  .paperEdit .crumb-1,.crumb-2,.crumb-3{width:50%;height: 50px;line-height: 50px;text-align: center;background-color: #f5f7fa;box-sizing: border-box;position: relative;}
  .paperEdit .crumb-1,.crumb-2{margin-right:25px;}
  .paperEdit .crumb-1-right,.crumb-2-right{width: 0;height: 0;border-top: 25px solid transparent;border-bottom: 25px solid transparent;border-left: 20px solid #f5f7fa;border-right: 0 solid transparent;position: absolute;top: 0;left: 100%;z-index: 9;}
  .paperEdit .crumb-2-left,.crumb-3-left{width: 0;height: 0;border-top: 25px solid #f5f7fa;border-bottom: 25px solid #f5f7fa;border-left: 20px solid transparent;border-right: 0 solid #f5f7fa;position: absolute;top: 0;right: 100%;z-index: 9;}
  .paperEdit .active_crumb{background-color: #2a75ed;color: #fff;}
  .paperEdit .active_crumb_right{border-left: 20px solid #2a75ed;}
  .paperEdit .active_crumb_left{border-top: 25px solid #2a75ed;border-bottom: 25px solid #2a75ed;border-left: 20px solid transparent;border-right: 0 solid #2a75ed;}
  .paperEdit .ant-upload-list-picture{display:none!important}
</style>
