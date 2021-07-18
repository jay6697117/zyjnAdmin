<template>
  <div class="examEdit">
    <a-form :form="currentItem" @submit="handleSubmit" v-show="loaded">
      <h2>基本信息</h2>
      <a-form-item label="hash_paper_id" v-show="false">
        <a-input v-decorator="['hash_paper_id']" />
      </a-form-item>
      <a-form-item label="hash_id" v-show="false">
        <a-input v-decorator="['hash_id']" />
      </a-form-item>
      <a-form-item label="专项考试名称" v-bind="global.smallFormLayout">
        <a-input :maxLength="50"
          placeholder="请输入专项考试名称（最多不超过50字）"
          v-decorator="['title', { rules: [{ required: true, message: '请输入专项考试名称!' }] }]"
        />
      </a-form-item>
      <a-form-item label="专项考试封面" v-bind="global.bigFormLayout">
        <a-avatar shape="square" icon="picture" class="editCover" :src="mediaCoverUrl"/>
        <div class="coverTips">
          <a-input v-show="false"
          v-decorator="['mediaCoverId', { rules: [{ required: true, message: '请上传专项考试封面!' }] }]" />
          <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUpload" :action="parmasUpload.resourceHost" :data="setData" @change="onChange">
            <a-button class="upType" :disabled="uploadFlag"> <a-icon type="upload" /> 选择文件 </a-button>
          </a-upload>
          <span v-if="uploadFlag"><a-spin size="small" />正在上传中</span>
          <p>专项考试封面指在专项考试列表展示的图片，请上传比例为4:3的图片，JPG/PNG格式，图片小于5M</p>
        </div>
      </a-form-item>
      <a-form-item label="专项考试详情" v-bind="global.bigFormLayout">
        <vue-html5-editor :height="240" :auto-height="false" :show-module-name="false"
        v-decorator="['introduction',{rules: [{ required: true, message: '请填写专项考试详情！'}]}]"></vue-html5-editor>
      </a-form-item>
      <a-form-item label="考试分类" v-bind="global.smallFormLayout">
        <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
          :dropdownStyle="dropdownStyle"
          :treeData="classified"
          placeholder='请选择分类'
          v-decorator="['hash_category_id']">
        </a-tree-select>
      </a-form-item>
      <a-form-item label="上架设置" v-bind="global.smallFormLayout" class="publishDetail">
        <a-radio-group v-decorator="['publishSetting']" width="100%" class="radioGroup">
          <a-radio :value="1">立即上架</a-radio>
          <a-radio :value="-1">暂不上架</a-radio>
        </a-radio-group>
      </a-form-item>
      <h2>考试信息</h2>
      <a-form-item label="考试时间" v-bind="global.bigFormLayout">
        <a-date-picker @change="onChangeTime" placeholder="选择日期" v-decorator="['exam_date',{rules: [{ required: true, message: '请选择考试时间！'}]}]"/><span style="display:inline-block;width:15px;"></span>
        <a-time-picker format="HH:mm" @change="onChangeTime1" placeholder="选择开始时间" v-decorator="['start_time',{rules: [{ required: true, message: '请选择考试开始时间！'}]}]"/> ~ <a-time-picker format="HH:mm" @change="onChangeTime2" placeholder="选择结束时间" v-decorator="['end_time',{rules: [{ required: true, message: '请选择考试结束时间！'}]}]"/>
        <div class="ant-form-explain" style="color:#f5222d;margin-bottom: -20px;" v-if="errorShow">请选择考试时间！</div>
      </a-form-item>
      <a-form-item label="考试时长" v-bind="global.smallFormLayout"  >
        <a-input type="number" style="width: 110px;margin-right:10px;"
          v-decorator="['duration']" placeholder="开始和结束时间填写后自动计算" disabled
        />
        <span>分钟</span>
      </a-form-item>
      <a-form-item label="选择试卷" v-bind="global.smallFormLayout" class="chooseExam">
        <a-button @click="addExam"><a-icon type="plus" />选择试卷</a-button>
        <div v-if='paperInfo' class="paperBox">
          <p>{{paperInfo.title}}</p>
          <p style="overflow:hidden;">
            <span style="float:left;">总题数： {{paperInfo.totalQuestion}}题</span>
            <span style="float:right;">发布时间:  {{paperInfo.publishTime | timeFormat('yyyy-MM-dd')}}</span>
          </p>
          <p>总分数： {{paperInfo.totalScore}}分</p>
          <p>
            <span style="width:56px;display:inline-block">包含：</span>
            <span v-for="item in paperInfo.statistics" :key="item.question_type_id" style="margin-right:20px;">
              {{questionTypes[item.question_type_id]}} * {{item.question_num}}
            </span>
          </p>
        </div>
      </a-form-item>
      <a-form-item label="及格分数" v-bind="global.smallFormLayout">
        <a-input type="number" style="width: 110px;margin-right:10px;" v-decorator="['passScore', {rules: [{ required: true, message: '及格分数不能为0！'}]}]" placeholder="0" help="及格分数必须小于考试总分数"/><span>分</span>
      </a-form-item>
      <a-form-item label="学分设置" v-bind="global.smallFormLayout">
        <span>考试通过奖励</span>
        <a-input type="number" style="width: 110px;margin:0 10px;" v-decorator="['credit', {rules: [{ required: true, message: '学分必须为大于等于0的整数！'}]}]" placeholder="0"/>
        <span>学分</span>
      </a-form-item>
      <a-form-item label="解析设置" v-bind="global.smallFormLayout">
        <a-checkbox v-decorator="['show_analysis', {
          valuePropName: 'checked',
          initialValue: true,
        }]">
          考试结束后显示答案和解析
        </a-checkbox>
      </a-form-item>
      <a-form-item v-bind="global.btnFormLayout">
        <a-button type="primary" html-type="submit" :disabled="uploadFlag" block slot="label">保存</a-button>
        <a-button block @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
    <i-choose :params="params" @ok="getTaskExam" @cancel="onhandleCancel" />
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'examEdit',
  data () {
    return {
      params: {
        type: 'paper', // 请求方法的路径
        name: '试卷', // 名称
        show: false, // 展示
        examEdit: !!this.$route.query.id,
        tableKey: 'hash_id', // 表格的key
        selectionType: 'radio', // 多选 'checkbox'
        haveCreateButton: true, // 新建按钮
        filters: {search_content: ''}, // 筛选条件 无=={}
        otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
        selectedRowKeys: [], // 列表中的已选项 无==[]
        columns: [ // 表格列
          {title: '试卷名称', dataIndex: 'title', key: 'title', align: 'left'},
          {title: '发布时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 240}
        ]
      },
      confirmLoading: false,
      loaded: false,
      gotSelectList: false,
      classified: [],
      paperInfo: '',
      questionTypes: this.$store.state.questionTypes,
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      mediaCoverUrl: this.$store.state.defaultSetting.defaultCovers.exam.fileUrl,
      currentItem: this.$form.createForm(this, {name: 'editor'}),
      uploadFlag: false,
      loadTxt: '',
      formData: {
        title: '',
        introduction: '',
        mediaCoverId: this.$store.state.defaultSetting.defaultCovers.exam.fileId,
        publishSetting: 1,
        hash_category_id: '',
        duration: 0,
        passScore: '0',
        show_analysis: true,
        hash_paper_id: '',
        credit: 0,
        hash_id: '',
        exam_date: null,
        start_time: null,
        end_time: null
      },
      examDate: '',
      start_time: '',
      end_time: '',
      errorShow: '',
      parmasUpload: this.$store.state.uploadParmas,
      imgfileList: []
    }
  },
  computed: {
    hash_id () {
      return this.$route.query.id || 0
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    moment,
    getDetails () {
      let _self = this
      _self.loaded = false
      if (_self.gotSelectList) {
        _self.initData()
      } else {
        _self.$api.category.list({type: 'exam'}).then(res => {
          _self.classified = res.data
          _self.gotSelectList = true
          _self.initData()
        })
      }
    },
    initData () {
      let _self = this
      if (_self.hash_id) {
        _self.$api.exam.getInfo({// 编辑时请求远端数据
          hash_id: _self.hash_id
        }).then(res => {
          _self.loaded = true
          let data = res.data
          _self.mediaCoverUrl = data.mediaCoverUrl
          let formData = {
            title: data.title,
            introduction: data.introduction,
            mediaCoverId: data.mediaCoverId,
            publishSetting: data.publishSetting,
            hash_category_id: data.hash_category_id,
            exam_date: data.exam_date ? _self.moment(new Date(data.exam_date * 1000)) : '',
            start_time: data.start_time ? _self.moment(new Date(data.start_time * 1000)) : '',
            end_time: data.end_time ? _self.moment(new Date(data.end_time * 1000)) : '',
            duration: data.duration,
            passScore: data.passScore,
            show_analysis: data.show_analysis === 1,
            hash_paper_id: data.hash_paper_id,
            credit: data.credit,
            hash_id: data.hash_id
          }
          _self.examDate = data.exam_date * 1000
          _self.start_time = data.start_time * 1000
          _self.end_time = data.end_time * 1000
          _self.initForm(formData)
          _self.getPaperInfo(data.hash_paper_id)
        })
      } else {
        _self.loaded = true
      }
      _self.initForm(this.formData)
    },
    initForm (data) {
      let _self = this
      this.formData = data
      _self.currentItem.setFieldsValue(data) // 给表单赋值
    },
    getPaperInfo (paperId) {
      this.params.selectedRowKeys = [paperId]
      this.$api.paper.getInfo({
        hash_id: paperId
      }).then(res => {
        this.paperInfo = res.data
      })
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.currentItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (_self.start_time === '') {
            _self.errorShow = true
            return
          }
          if (_self.end_time === '') {
            _self.errorShow = true
            return
          }
          values.exam_date = parseInt(_self.examDate / 1000)
          values.start_time = parseInt(_self.start_time / 1000)
          values.end_time = parseInt(_self.end_time / 1000)
          values.show_analysis = 0 + values.show_analysis
          values.hash_tag_ids = []
          if (values.hash_id) {
            _self.$api.exam.edit(values).then(res => {
              if (!res.code) {
                this.$router.push({
                  path: '/content/exam/list',
                  query: {
                    unTips: true
                  }
                })
              }
            })
          } else {
            _self.$api.exam.add(values).then(res => {
              if (!res.code) {
                this.$router.push({
                  path: '/content/exam/list',
                  query: {
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
        path: '/content/exam/list'
      })
    },
    idsToArray (val) {
      return Array.isArray(val) ? val : [val]
    },
    addExam () {
      this.params.show = true
    },
    onhandleCancel (e) {
      this.params.show = false
    },
    getTaskExam (keys) { // 获取考试
      this.params.show = false
      this.currentItem.setFieldsValue({hash_paper_id: keys[0]})
      this.getPaperInfo(keys[0])
    },
    onChangeTime (date, dateString) {
      this.examDate = new Date(new Date(dateString).toLocaleDateString()).getTime()
    },
    onChangeTime1 (time) {
      this.errorShow = false
      this.start_time = new Date(time).getTime()
      time = new Date(this.start_time)
      var seconds = time.getSeconds()
      this.start_time = this.start_time - seconds * 1000
      if ((this.end_time - this.start_time) / 60000 > 0) {
        this.currentItem.setFieldsValue({duration: (this.end_time - this.start_time) / 60000})
      } else {
        this.currentItem.setFieldsValue({duration: 0})
        if (this.end_time !== '') {
          this.$message.error('开始时间不能大于等于结束时间')
        }
      }
    },
    onChangeTime2 (time) {
      this.errorShow = false
      this.end_time = new Date(time).getTime()
      time = new Date(this.end_time)
      var seconds = time.getSeconds()
      this.end_time = this.end_time - seconds * 1000
      if ((this.end_time - this.start_time) / 60000 > 0) {
        this.currentItem.setFieldsValue({duration: (this.end_time - this.start_time) / 60000})
      } else {
        this.currentItem.setFieldsValue({duration: 0})
        if (this.start_time !== '') {
          this.$message.error('结束时间不能小于等于开始时间')
        }
      }
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
  .examEdit .mediaName{border: 0;cursor: default;background: none; color: #303030;}
  .examEdit .radioGroup .ant-radio-wrapper{width: 100%;}
  .examEdit .radioGroup .ant-calendar-picker{margin-left: 10px;}
  .examEdit .chooseExam label:before{display: inline-block;margin-right: 4px;color: #f5222d;font-size: 14px;font-family: SimSun, sans-serif;line-height: 1;content: '*'}
  .examEdit .paperBox{background:#eee;padding:10px;}
  .examEdit .paperBox p{margin:0;line-height: 26px;}
  .examEdit .paperBox p:first-child{color:#1187e4;font-size:16px;line-height: 32px;}
  .examEdit .ant-upload-list-picture{display:none!important}
</style>
