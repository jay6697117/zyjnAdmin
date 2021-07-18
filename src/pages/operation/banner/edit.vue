<template>
  <div class="bannerEdit" :class="'coverType' + banner_type">
    <a-form :form="bannerItem" @submit="handleSubmit" v-show="loaded">
      <a-form-item label="hash_id" v-show="false">
        <a-input-number :min="0" v-decorator="['hash_id']" />
      </a-form-item>
      <h2>基本信息</h2>
      <a-form-item label="显示终端" v-bind="global.smallFormLayout">
        <a-radio-group v-decorator="['terminal_type', { rules: [{ required: true, message: '选择终端!' }] }]" width="100%" @change="terminalTypeChange">
          <a-radio value="mobile">移动端</a-radio>
          <a-radio value="pc" v-if="(banner_type === 1)">PC端</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="选择终端" v-bind="global.bigFormLayout" v-show="bannerItem.getFieldValue('terminal_type') === 'mobile'">
        <a-checkbox-group
          v-decorator="[
            'display_terminal_type_ids',
            { rules: [{ required: bannerItem.getFieldValue('terminal_type') === 'mobile', message: '选择终端!' }] }
          ]">
          <a-checkbox :value='1'>Android</a-checkbox>
          <a-checkbox :value='2'>IOS</a-checkbox>
          <!-- <a-checkbox :value='3' v-if="(parseInt(banner_type)===1||parseInt(banner_type)===2||parseInt(banner_type)===3)">小程序</!-->
          <!-- <a-checkbox :value='4' v-if="(parseInt(banner_type)===1||parseInt(banner_type)===2||parseInt(banner_type)===3)">H5</a-checkbox> -->
        </a-checkbox-group>
      </a-form-item>
      <a-form-item :label="item.typeName+'名称'" v-bind="global.midFormLayout">
        <a-input :maxLength="50" :placeholder="'请输入'+item.typeName + '名称（最多不超过50字）'"
          v-decorator="['name', { rules: [{ required: true, message: '请输入banner名称!' }] }]"
        />
      </a-form-item>
      <a-form-item :label="item.typeName + ((banner_type === 3 || banner_type) === 4 ? 'LOGO' :((banner_type === 5)?'':'图'))" v-bind="global.bigFormLayout">
        <a-row>
          <a-col :span="22">
            <a-avatar :shape="(banner_type === 3) ? 'circle' : 'square'" icon="picture" :src="coverUrl" class="editCover" />
            <a-input v-show="false"
            v-decorator="['cover_file_id', { rules: [{ required: true, message: '请上传封面!' }] }]" />
            <div class="coverTips">
              <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUpload" :action="parmasUpload.resourceHost" :data="setData" @change="onChange">
                <a-button class="upType" :disabled="uploadFlag"> <a-icon type="upload" /> 选择文件 </a-button>
              </a-upload>
              <span v-if="uploadFlag"><a-spin size="small" />正在上传中</span>
              <p>{{item.tips}}</p>
            </div>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="上架设置" v-bind="global.smallFormLayout">
        <a-radio-group v-decorator="['publishSetting']" width="100%" class="radioGroup">
          <a-radio :value="1">立即上架</a-radio>
          <a-radio :value="-1">暂不上架</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="跳转目标" v-bind="global.bigFormLayout">
        <a-radio-group v-decorator="['jump_to', { rules: [{ required: true, message: '选择跳转目标!' }] }]" width="100%">
          <a-radio value="none">无跳转</a-radio>
          <a-radio value="url">跳转外部链接</a-radio>
          <a-radio value="content">跳转到内容</a-radio>
          <span v-for="item in pageTypes" :key="item.value">
            <a-radio :value="item.value" v-show="!(bannerItem.getFieldValue('terminal_type') === 'pc' && (item.value === 'new_guys' || item.value === 'check_in' || item.value === 'leader_board'))">
              {{item.name}}
            </a-radio>
          </span>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 10, push:3 }" v-show="bannerItem.getFieldValue('jump_to') === 'url'">
       <a-input v-decorator="['jump_target']" placeholder="请输入链接地址"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 20, push:3 }" v-if="bannerItem.getFieldValue('jump_to') === 'content'">
        <a-dropdown :getPopupContainer="triggerNode => triggerNode.parentNode" :trigger="['click']">
          <a-button> 选择平台内容 <a-icon type="down" /> </a-button>
          <a-menu slot="overlay" @click="chooseJumpContent">
            <a-menu-item key="0">
              <a-button>选择课程</a-button>
            </a-menu-item>
            <a-menu-item key="1">
              <a-button>选择培训计划</a-button>
            </a-menu-item>
            <!-- <a-menu-item key="2">
              <a-button>选择专项考试</a-button>
            </a-menu-item> -->
            <a-menu-item key="3">
              <a-button>选择新闻资讯</a-button>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <div class="detail-left" v-if="backData.title">
          <img class="detail-img" :src="backData.mediaCoverUrl">
          <div class="detail-info">
            <div>
              <div class="title">{{backData.title}}</div>
            </div>
            <div v-if="index !== '3'">
              <p>报名人数：{{backData.subscribeTotal}}</p>
              <p>学习人数：{{backData.learnedTotal}}</p>
            </div>
          </div>
        </div>
      </a-form-item>
      <a-form-item v-bind="global.btnFormLayout">
        <a-button type="primary" html-type="submit" block :disabled="uploadFlag" slot="label">保存</a-button>
        <a-button block @click="cancelBack">取消</a-button>
      </a-form-item>
    </a-form>
    <i-choose :params="params" @ok="getResource" @cancel="onhandleCancel" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      backData: {},
      index: '0',
      params: {},
      hash_item_id: '',
      paramsData: [
        {
          type: 'course', // 请求方法的路径
          name: '课程', // 名称
          show: false, // 展示
          tableKey: 'hash_id',
          selectionType: 'radio', // 多选 'checkbox'
          haveCreateButton: false, // 新建按钮
          filters: {
            search_content: ''
          }, // 筛选条件 无=={}
          otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
          selectedRowKeys: [], // 列表中的已选项 无==[]
          columns: [ // 表格列
            {title: '课程名称', dataIndex: 'title', key: 'title'},
            {title: '上架时间', key: 'publishTime', dataIndex: 'publishTime', scopedSlots: { customRender: 'publishTime' }, align: 'center', width: 150}
          ]
        },
        {
          type: 'plan', // 请求方法的路径
          name: '培训计划', // 名称
          show: false, // 展示
          tableKey: 'hash_id',
          selectionType: 'radio', // 多选 'checkbox'
          haveCreateButton: false, // 新建按钮
          filters: {
            search_content: ''
          }, // 筛选条件 无=={}
          otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
          selectedRowKeys: [], // 列表中的已选项 无==[]
          columns: [ // 表格列
            {title: '培训计划名称', dataIndex: 'title', key: 'title'},
            {title: '上架时间', key: 'publishTime', dataIndex: 'publishTime', scopedSlots: { customRender: 'publishTime' }, align: 'center', width: 150}
          ]
        },
        {
          type: 'exam', // 请求方法的路径
          name: '专项考试', // 名称
          show: false, // 展示
          tableKey: 'hash_id',
          selectionType: 'radio', // 多选 'checkbox'
          haveCreateButton: false, // 新建按钮
          filters: {
            search_content: ''
          }, // 筛选条件 无=={}
          otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
          selectedRowKeys: [], // 列表中的已选项 无==[]
          columns: [ // 表格列
            {title: '专项考试名称', dataIndex: 'title', key: 'title'},
            {title: '上架时间', key: 'publishTime', dataIndex: 'publishTime', scopedSlots: { customRender: 'publishTime' }, align: 'center', width: 150}
          ]
        },
        {
          type: 'news', // 请求方法的路径
          name: '新闻资讯', // 名称
          show: false, // 展示
          tableKey: 'hash_id',
          selectionType: 'radio', // 多选 'checkbox'
          haveCreateButton: false, // 新建按钮
          filters: {hash_category_id: '0', search_content: ''}, // 筛选条件 无=={}
          otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
          selectedRowKeys: [], // 列表中的已选项 无==[]
          columns: [ // 表格列
            {title: '新闻标题', dataIndex: 'title', key: 'title'},
            {title: '更新时间', key: 'updated_at', dataIndex: 'updated_at', scopedSlots: { customRender: 'updated_at' }, align: 'center', width: 150}
          ]
        }
      ],
      coverUrl: '',
      bannerItem: this.$form.createForm(this, {name: 'editor'}),
      loaded: false,
      type: 'txt',
      jump_target: '',
      uploadFlag: false,
      loadTxt: '',
      pageTypes: [],
      jumpPage: '',
      parmasUpload: this.$store.state.uploadParmas,
      imgfileList: []
    }
  },
  computed: {
    item () {
      return this.$store.state.bannerItem
    },
    banner_type () {
      return parseInt(this.$store.state.bannerItem.banner_type)
    },
    banner_id () {
      return this.$store.state.bannerItem.hash_id
    }
  },
  mounted () {
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
        terminal_type: data.terminal_type, // 终端类型
        display_terminal_type_ids: data.display_terminal_type_ids, // 选择终端ids
        name: data.name, // banner名称
        cover_file_id: data.cover_file_id, // banner图
        jump_to: data.jump_to, // 跳转
        jump_target: data.jump_target,
        publishSetting: data.publishSetting
      }
      _self.bannerItem.setFieldsValue(fieldsValue) // 给表单赋值
    },
    initData () {
      let _self = this
      if (_self.banner_id) {
        _self.$api.banner.getInfo({// 编辑时请求远端数据
          hash_id: _self.banner_id
        }).then(res => {
          _self.$api.banner.jump({terminal_type: res.data.terminal_type}).then(res => { // 获取可跳转区域的数据
            _self.pageTypes = res.data
          })
          _self.loaded = true
          _self.coverUrl = res.data.coverUrl
          let planVal = res.data.jump_to === 'project_plan' ? 'plan' : res.data.jump_to
          if (res.data.jump_to === 'course') {
            this.index = '0'
          } else if (res.data.jump_to === 'project_plan') {
            this.index = '1'
          } else if (res.data.jump_to === 'news') {
            this.index = '3'
          }
          _self.bannerItem.setFieldsValue({jump_to: res.data.jump_to})
          if (planVal === 'course' || planVal === 'exam' || planVal === 'plan' || planVal === 'news') {
            _self.hash_item_id = res.data.hash_item_id
            _self.$api[planVal].getInfo({hash_id: _self.hash_item_id}).then(res => {
              if (!res.code) {
                _self.backData = res.data
              }
            })
            res.data.jump_to = 'content'
          }
          _self.initForm(res.data)
        })
      } else {
        _self.$api.banner.jump({terminal_type: 'mobile'}).then(res => { // 获取可跳转区域的数据
          _self.pageTypes = res.data
        })
        _self.loaded = true
        _self.initForm({ // 添加时的默认值设置
          terminal_type: 'mobile', // 终端类型
          display_terminal_type_ids: [1, 2], // 选择终端ids
          name: '', // banner名称
          cover_file_id: '', // banner图
          jump_to: 'none', // 跳转
          jump_target: '',
          publishSetting: 1
        })
      }
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.bannerItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.banner_type = _self.banner_type.toString()
          values.hash_item_id = _self.hash_item_id
          if (values.jump_to === 'content') {
            values.jump_to = this.paramsData[this.index].type === 'plan' ? 'project_plan' : this.paramsData[this.index].type
          } else {
            values.hash_item_id = ''
          }
          if (_self.banner_id) {
            values.hash_id = this.banner_id
            _self.$api.banner.edit(values).then(res => {
              if (res.code === 0) {
                this.$router.push({
                  path: '/operation/banner/list',
                  query: {
                    banner_type: values.banner_type,
                    unTips: true
                  }
                })
              }
            })
          } else {
            _self.$api.banner.add(values).then(res => {
              if (res.code === 0) {
                this.$router.push({
                  path: '/operation/banner/list',
                  query: {
                    banner_type: values.banner_type,
                    unTips: true
                  }
                })
              }
            })
          }
        }
      })
    },
    terminalTypeChange (el) {
      if (el.target.value === 'mobile') {
        this.bannerItem.setFieldsValue({display_terminal_type_ids: [1, 2]})
      }
      this.$api.banner.jump({terminal_type: el.target.value}).then(res => { // 获取可跳转区域的数据
        this.pageTypes = res.data
      })
    },
    chooseJumpContent (e) { // 选择跳转内容
      this.index = e.key
      this.params = this.paramsData[e.key]
      this.params.show = true
    },
    onhandleCancel (e) {
      this.params.show = false
    },
    getResource (data) { // 获取资源
      this.params.show = false
      this.$api[this.paramsData[this.index].type].getInfo({hash_id: data[0]}).then(res => {
        this.backData = res.data
        this.hash_item_id = res.data.hash_id
      })
    },
    cancelBack () {
      this.$router.push('/operation/banner/list')
    },
    onChange (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.imgfileList = fileList
      this.coverUrl = fileList[0].thumbUrl
      this.bannerItem.setFieldsValue({cover_file_id: fileList[0].fileId}) // 给表单赋值
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
  #app .coverType1 .editCover{width: 300px;height: 120px;}
  #app .coverType2 .editCover{width: 300px;height: 150px;}
  #app .coverType3 .editCover{width: 100px;height: 100px;}
  #app .coverType4 .editCover{width: 180px;height: 320px;}
  #app .coverType5 .editCover{width: 180px;height: 320px;}
  .bannerEdit .detail-left{padding: 20px;background-color: #f5f7fa;margin-bottom:20px;overflow: hidden;}
  .bannerEdit .detail-left .detail-img{width: 160px;height: 120px;margin-right: 20px;float: left;}
  .bannerEdit .detail-left .detail-info{margin-left:20px;display: inline-block;}
  .bannerEdit .detail-left .detail-info .title{font-size: 16px;font-weight: 600;color: #353535;white-space: pre-wrap;max-width: 550px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
  .bannerEdit .ant-upload-list-picture{display:none!important}
</style>
