<template>
  <div>
    <a-row>
      <a-col :lg="24" :xl="12">
        <a-form :form="certificateItem" @submit="handleSubmit" v-show="loaded" class="certificateEdit">
          <a-form-item label="certificate_id" v-show="false">
            <a-input v-decorator="['certificate_id']" />
          </a-form-item>
          <h2>证书设置</h2>
          <a-form-item label="证书类型" v-bind="global.bigFormLayout">
            <a-radio-group v-decorator="['relation_resource_type', { rules: [{ required: true, message: '请输入证书类型!' }] }]" width="100%" class="radioGroup" @change="onRadioChange" :disabled="disabledFlag">
              <a-radio value="exam">专项考试证书</a-radio>
              <a-radio value="plan">培训计划证书</a-radio>
              <a-radio value="course">课程证书</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="关联内容" v-bind="global.bigFormLayout" class="chooseRelation">
            <a-input v-show="false" v-decorator="['hash_relation_resource_id', {rules: [{ required: true, message: '请选择关联内容!'}]}]"/>
            <a-button @click="addContent" v-if="choiseType ==='exam'" :disabled="disabledFlag"><a-icon type="plus" />关联专项考试</a-button>
            <a-button @click="addContent" v-if="choiseType === 'plan'" :disabled="disabledFlag"><a-icon type="plus" />关联培训计划</a-button>
            <a-button @click="addContent" v-if="choiseType === 'course'" :disabled="disabledFlag"><a-icon type="plus" />关联课程</a-button>
            <div v-if='relationInfo' class="relationBox">
              <img :src="relationInfo.mediaCoverUrl" alt="">
              <p>
                <span>{{relationInfo.title}}<br/></span>
                <span v-if="choiseType === 'exam'">总分{{relationInfo.passScore}}<br/></span>
                <span v-if="choiseType === 'plan'">共{{relationInfo.item_num}}个任务<br/></span>
                <span v-if="choiseType === 'course'">共{{relationInfo.lesson_num}}讲<br/></span>
                <span>报名人数：{{relationInfo.subscribeTotal}}</span>
              </p>
            </div>
          </a-form-item>
          <a-form-item label="证书发放规则" v-bind="global.bigFormLayout">
            <a-radio-group width="100%" class="radioGroup" v-decorator="['choose']">
              <a-radio :value="1" v-if="choiseType ==='exam'">得分不少于及格分数</a-radio>
              <a-radio :value="1" v-if="(choiseType ==='plan')||(choiseType === 'course')">学习进度达到100%</a-radio>
            </a-radio-group>
          </a-form-item>
          <h2>基本信息</h2>
          <a-form-item label="证书名称" v-bind="global.bigFormLayout">
            <a-input :maxLength="50" placeholder="请输入证书名称（最多不超过50字）"
              v-decorator="['title', { rules: [{ required: true, message: '请输入证书名称!' }] }]"
            />
          </a-form-item>
          <a-form-item label="证书图片" v-bind="global.bigFormLayout">
            <div class="defaultImgBox">
              <a-radio-group v-decorator="['certificate_file_id', { rules: [{ required: true, message: '请选择证书图片!' }] }]" width="100%" class="radioGroup">
                <a-radio v-for="(item,i) in defaultCertificates" :value="item.fileId" :key="i" @click="onImgChange(item)">
                  <img :src="item.fileUrl" class="chooseImg">
                </a-radio>
              </a-radio-group>
            </div>
          </a-form-item>
          <a-form-item label="发布设置" v-bind="global.bigFormLayout">
            <a-radio-group v-decorator="['publish_status']" width="100%" class="radioGroup">
              <a-radio :value="1">立即发布</a-radio>
              <a-radio :value="-1">暂不发布</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-bind="global.btnFormLayout">
            <a-button type="primary" html-type="submit" block slot="label">保存</a-button>
            <a-button block @click="cancel">取消</a-button>
          </a-form-item>
        </a-form>
        <i-choose :params="examChoiseParams" @ok="getRelation" @cancel="onhandleCancel" type="certificate"/>
        <i-choose :params="planChoiseParams" @ok="getRelation" @cancel="onhandleCancel" type="certificate"/>
        <i-choose :params="courseChoiseParams" @ok="getRelation" @cancel="onhandleCancel" type="certificate"/>
      </a-col>
      <a-col :lg="24" :xl="12">
        <h2>证书预览</h2>
        <div class="previewBox">
          <img :src="chooseImg" alt="">
          <div class="textBox">
            <h3>张三丰</h3>
            <p>《{{global.proName}}成长特训营第3期》</p>
            <span>学习中表现优异，特发此证，以兹鼓励！</span>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: 0,
      relation_resource_type: 'exam',
      loaded: false,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      disabled: true,
      certificateItem: this.$form.createForm(this, {name: 'editor'}),
      choiseType: 'exam',
      examChoiseParams: {
        type: 'exam', // 请求方法的路径
        name: '专项考试', // 名称
        show: false, // 展示
        examEdit: false,
        tableKey: 'hash_id', // 表格的key
        selectionType: 'checkbox', // 多选 'checkbox'
        haveCreateButton: true, // 新建按钮
        filters: {search_content: ''}, // 筛选条件 无=={}
        otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
        selectedRowKeys: [], // 列表中的已选项 无==[]
        columns: [ // 表格列
          {title: '专项考试名称', dataIndex: 'title', key: 'title', align: 'left'}
        ]
      },
      planChoiseParams: {
        type: 'plan', // 请求方法的路径
        name: '培训计划', // 名称
        show: false, // 展示
        examEdit: false,
        tableKey: 'hash_id', // 表格的key
        selectionType: 'checkbox', // 多选 'checkbox'
        haveCreateButton: true, // 新建按钮
        filters: {search_content: ''}, // 筛选条件 无=={}
        otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
        selectedRowKeys: [], // 列表中的已选项 无==[]
        columns: [ // 表格列
          {title: '培训计划', dataIndex: 'title', key: 'title', align: 'left'}
        ]
      },
      courseChoiseParams: {
        type: 'course', // 请求方法的路径
        name: '课程', // 名称
        show: false, // 展示
        examEdit: false,
        tableKey: 'hash_id', // 表格的key
        selectionType: 'checkbox', // 多选 'checkbox'
        haveCreateButton: true, // 新建按钮
        filters: {search_content: ''}, // 筛选条件 无=={}
        otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
        selectedRowKeys: [], // 列表中的已选项 无==[]
        columns: [ // 表格列
          {title: '课程名称', dataIndex: 'title', key: 'title', align: 'left'}
        ]
      },
      relationInfo: null,
      defaultCertificates: [],
      max_score: 0,
      learned_item_num: 0,
      send_conditions: [],
      chooseImg: '',
      disabledFlag: false
    }
  },
  computed: {
    certificate_id () {
      return this.$route.query.id
    }
  },
  mounted () {
    this.$api.certificate.picture({}).then(res => {
      if (res.code === 0) {
        this.defaultCertificates = res.data.defaultCertificates
        if (this.certificate_id === '') {
          this.certificateItem.setFieldsValue({certificate_file_id: this.defaultCertificates[0].fileId})
          this.chooseImg = this.defaultCertificates[0].fileUrl
        }
      }
    })
    this.getDetails()
  },
  methods: {
    getDetails () {
      let _self = this
      _self.loaded = false
      _self.initData()
    },
    initForm (data) {
      let _self = this
      let fieldsValue = {
        certificate_id: data.hash_id,
        title: data.title,
        publish_status: data.publish_status, // 上架状态
        relation_resource_type: data.relation_resource_type,
        hash_relation_resource_id: data.hash_relation_resource_id,
        certificate_file_id: data.certificate_file_id.toString(),
        choose: 1
      }
      _self.certificateItem.setFieldsValue(fieldsValue) // 给表单赋值
    },
    initData () {
      let _self = this
      if (_self.certificate_id) {
        _self.disabledFlag = true
        _self.$api.certificate.getInfo({// 编辑时请求远端数据
          hash_id: _self.certificate_id
        }).then(res => {
          _self.loaded = true
          if (res.code === 0) {
            _self.initForm(res.data)
            _self.chooseImg = res.data.certificate_file_url
            _self.choiseType = res.data.relation_resource_type === 'project_plan' ? 'plan' : res.data.relation_resource_type
            _self.send_conditions = res.data.send_conditions
            _self.getPaperInfo(res.data.hash_relation_resource_id)
          }
        })
      } else {
        _self.disabledFlag = false
        _self.loaded = true
        _self.initForm({ // 添加时的默认值设置
          hash_id: _self.certificate_id, // 课程id
          title: '',
          publish_status: 1,
          relation_resource_type: 'exam',
          hash_relation_resource_id: '',
          certificate_file_id: 0,
          choose: 1
        })
      }
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.certificateItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          delete values.choose
          if (this.certificate_id === '') {
            if (values.relation_resource_type === 'exam') {
              let littleArr = []
              littleArr.push('max_score')
              littleArr.push(_self.max_score)
              _self.send_conditions.push(littleArr)
            } else {
              let littleArr = []
              littleArr.push('learned_item_num')
              littleArr.push(_self.learned_item_num)
              _self.send_conditions.push(littleArr)
            }
          }
          values.send_conditions = _self.send_conditions
          _self.saveCertificate(values)
        }
      })
    },
    saveCertificate (values) {
      values.relation_resource_type = values.relation_resource_type === 'plan' ? 'project_plan' : values.relation_resource_type
      if (this.certificate_id === '') {
        this.$api.certificate.add(values).then(res => {
          if (res.code === 0) {
            this.$router.push({
              path: '/content/certificate/list',
              query: {
                unTips: true,
                tab: 1,
                id: res.data.hash_id
              }
            })
          }
          this.send_conditions = []
        })
      } else {
        values.hash_id = this.certificate_id
        this.$api.certificate.edit(values).then(res => {
          if (res.code === 0) {
            this.$router.push({
              path: '/content/certificate/list',
              query: {
                unTips: true
              }
            })
          }
        })
        this.send_conditions = []
      }
    },
    cancel () {
      this.$router.push({
        path: '/content/certificate/list'
      })
    },
    getPaperInfo (relationId) {
      this[this.choiseType + 'ChoiseParams'].selectedRowKeys = [relationId]
      this.$api[this.choiseType].getInfo({
        hash_id: relationId
      }).then(res => {
        this.relationInfo = res.data
        if (this.choiseType === 'exam') {
          this.max_score = this.relationInfo.passScore
        } else if (this.choiseType === 'plan') {
          this.learned_item_num = this.relationInfo.item_num
        } else {
          this.learned_item_num = this.relationInfo.lesson_num
        }
      })
    },
    getRelation (keys) { // 获取考试
      this[this.choiseType + 'ChoiseParams'].show = false
      this.certificateItem.setFieldsValue({hash_relation_resource_id: keys[keys.length - 1]})
      this.getPaperInfo(keys[keys.length - 1])
    },
    onRadioChange (e) {
      this.choiseType = e.target.value
      this.relationInfo = null
    },
    addContent (current_page = this.pagination.current_page, pageSize = this.$store.state.pageSize) {
      this[this.choiseType + 'ChoiseParams'].show = true
    },
    onhandleCancel (e) {
      this[this.choiseType + 'ChoiseParams'].show = false
    },
    onImgChange (e) {
      this.chooseImg = e.fileUrl
      this.certificate_file_id = e.fileId
    }
  }
}
</script>
<style scope>
  .certificateEdit .chooseRelation label:before {display: inline-block;margin-right: 4px;color: #f5222d;font-size: 14px;font-family: SimSun, sans-serif;line-height: 1;content: '*';}
  .certificateEdit .radioGroup .ant-calendar-picker{margin-left: 10px;}
  .certificateEdit .relationBox{background:#eee;padding:15px;overflow: hidden;}
  .certificateEdit .relationBox img{width:120px;height:90px;float:left;}
  .certificateEdit .relationBox p{margin:0;line-height: 26px;overflow:hidden;float:left;margin:5px 0 0 20px;}
  .previewBox{position: relative;}
  .previewBox img{width:579px;height:818px;max-width:100%;}
  .previewBox .textBox{width:579px;height:818px;max-width:100%;position: absolute;left:0;top:0;text-align: center;}
  .previewBox .textBox h3{font-weight: bold;margin-top:240px;font-size:24px;}
  .previewBox .textBox p{margin-top:30px;font-size:16px;padding:0 60px;}
  .previewBox .textBox span{font-size:16px;display: inline-block;padding:0 60px;}
  .defaultImgBox img{width:100%;height:240px;margin-right:3%;border:5px solid #ccc;}
  .defaultImgBox .ant-radio-wrapper{width:30%;}
  .defaultImgBox .ant-radio{display:none}
  .defaultImgBox .ant-radio-wrapper-checked img{border-color:#1890ff;}
  @media screen and (max-width:1680px){
    .defaultImgBox img{height:200px;}
  }
  @media screen and (max-width:1440px){
    .defaultImgBox img{height:180px;}
  }
  @media screen and (max-width:1360px){
    .previewBox .textBox,.previewBox img{width:542px;height:763px;}
    .previewBox .textBox h3{margin-top:225px;}
  }
  @media screen and (max-width:1280px){
    .defaultImgBox img{height:160px;}
    .previewBox .textBox,.previewBox img{width:502px;height:707px;}
    .previewBox .textBox h3{margin-top:210px;}
  }
  @media screen and (max-width:1200px){
    .defaultImgBox img{height:278px;}
    .previewBox .textBox,.previewBox img{width:450px;height:634px;}
    .previewBox .textBox h3{margin-top:190px;}
    .previewBox .textBox p{margin-top:20px;}
  }
  @media screen and (max-width:1024px){
    .defaultImgBox img{height:230px;}
    .previewBox .textBox,.previewBox img{width:374px;height:550px;}
    .previewBox .textBox h3{margin-top:150px;}
    .previewBox .textBox p{margin-top:10px;}
  }
  @media screen and (max-width:768px){
    .defaultImgBox img{height:212px;}
  }
  @media screen and (max-width:640px){
    .defaultImgBox img{height:186px;}
  }
  @media screen and (max-width:414px){
    .defaultImgBox img{height:148px;}
  }
</style>
