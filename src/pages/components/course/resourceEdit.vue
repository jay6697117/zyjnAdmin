<template>
  <a-modal :visible="visible" title="信息" width="80%" :footer="null" @cancel="cancel" class="resourceEdit">
    <a-form :form="lessonFrom" @submit="submit">
      <a-form-item label="标题" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
        <a-input placeholder="请输入名称" v-decorator="['name', { rules: [{ required: true, message: '请输入名称!' }] }]"/>
      </a-form-item>
      <a-form-item label="封面" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-input v-show="false" v-decorator="['mediaCoverId', { rules: [{ required: true, message: '请上传封面!' }] }]"/>
        <a-avatar shape="square" icon="picture" class="editCover" :src="mediaCoverUrl"/>
        <div class="coverTips">
          <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUpload" :action="parmas.resourceHost" :data="setData" @change="onChange">
            <a-button class="upType" :disabled="uploadFlag"> <a-icon type="upload" /> 选择文件 </a-button>
          </a-upload>
          <span v-if="uploadFlag"><a-spin size="small" />正在上传中</span>
          <p>封面指在列表展示的图片，请上传比例为4:3的图片，JPG/PNG格式，图片小于5M</p>
        </div>
      </a-form-item>
      <a-form-item label="内容" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
        <a-input v-show="false" v-decorator="['hash_library_id', { rules: [{ required: !uploadFileId, message: '请上传内容!' }] }]" />
        <div class="checkBox" v-show="!lessonData.hash_library_id && !uploadFileId">
          <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="资源库导入" key="1">
              <i-filter :filters="filters" type="resource" @search="onSearch" placeholder="资源名称"></i-filter>
              <a-table :columns="columns" :dataSource="tableData" rowKey="hash_id" :loading="loading" :pagination="false" :showHeader="false" :rowSelection="rowSelection">
                <span slot="length"  slot-scope="length">{{parseInt(length / 60)+'分'+parseInt(length % 60)+'秒'}}</span>
                <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
              </a-table>
              <i-pagination :pagination="pagination" @change="getList"/>
            </a-tab-pane>
            <a-tab-pane tab="本地上传" key="2" class="uploadBody">
              <div class="uploadItem">
                <p>
                  <a-upload name="file" accept=".mp4" :multiple="false" :file-list="videofileList" :before-upload="beforeUpload" :action="parmas.resourceHost" :data="setData" @change="onChange">
                    <a-icon type="book" class="icon"/>
                    <a-button class="upType" :disabled="!cansave"> <a-icon type="upload" /> 选择文件 </a-button>
                    <span class="upType">上传视频</span>
                  </a-upload>
                </p>
              </div>
              <div class="uploadItem">
                <p>
                  <a-upload name="file" accept=".mp3" :multiple="false" :file-list="audiofileList" :before-upload="beforeUpload" :action="parmas.resourceHost" :data="setData" @change="onChange">
                    <a-icon type="edit" class="icon"/>
                    <a-button class="upType" :disabled="!cansave"> <a-icon type="upload" /> 选择文件 </a-button>
                    <span class="upType">上传音频</span>
                  </a-upload>
                </p>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div class="checked" v-show="lessonData.hash_library_id || uploadFileId">
          <span>{{fileName}}</span>
          <a-button @click="resetUpload">重新选择</a-button>
        </div>
      </a-form-item>
      <a-form-item label="文稿" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
        <vue-html5-editor :height="240" :auto-height="false" :show-module-name="false" style="z-index:10000!important;"
          v-decorator="['content']"
        ></vue-html5-editor>
      </a-form-item>
      <a-form-item label="时长" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
        <a-input v-show="false" v-decorator="[ 'duration',{ rules: [{ required: false }] }]"/>
        <span> {{minutes}} 分 </span>
        <span> {{seconds}} 秒 </span>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 8, offset: 3 }">
        <a-button style="margin-right:20px;" @click="cancel">取消</a-button>
        <a-button type="primary" html-type="submit" :disabled="!cansave || uploadFlag">保存</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
const columns = [
  {dataIndex: 'fileName', key: 'fileName', align: 'left'},
  {dataIndex: 'length', key: 'length', scopedSlots: { customRender: 'length' }, align: 'center', width: 100},
  {dataIndex: 'fileSize', key: 'fileSize', align: 'center', width: 60},
  {dataIndex: 'created_at', key: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 150}
]
export default {
  name: 'rEdit',
  data () {
    return {
      columns,
      tableData: [],
      visible: false,
      loading: false,
      uploadFlag: false,
      mediaCoverUrl: this.courseInfo.mediaCoverUrl,
      fileName: '',
      uploadFileId: '',
      lessonFrom: this.$form.createForm(this, { name: 'editor' }),
      lessonData: {},
      filters: {
        search_content: '',
        lessonType: '',
        hash_category_id: '0'
      },
      pagination: {
        type: '资源',
        total: 0, // 总条数
        current_page: 1,
        hideSize: true // 弹窗内列表传次参数，其他不传
      },
      rowSelection: {
        type: 'radio',
        onSelect: (item, selected, selectedRows) => {
          this.fileName = item.fileName
          this.lessonData.hash_library_id = item.hash_id
          this.lessonData.name = item.fileName.substring(0, item.fileName.lastIndexOf('.'))
          this.cansave = true
        }
      },
      mediaType: 'video',
      mediaWidth: '',
      mediaHeight: '',
      parmas: this.$store.state.uploadParmas,
      cansave: true,
      videofileList: [],
      audiofileList: [],
      imgfileList: []
    }
  },
  props: ['flag', 'courseInfo', 'lessonId'],
  computed: {
    minutes () {
      return parseInt(this.lessonData.duration / 60)
    },
    seconds () {
      return parseInt(this.lessonData.duration % 60)
    }
  },
  watch: {
    flag: function () {
      this.visible = this.flag
      if (this.visible) {
        let _self = this
        if (_self.lessonId) {
          _self.$api.course.getLessonInfo({ // 编辑时请求远端数据
            hash_id: _self.lessonId
          }).then(res => {
            if (res.code === 0) {
              this.mediaWidth = res.data.mediaWidth
              this.mediaHeight = res.data.mediaHeight
              this.lessonData = res.data // 编辑
              this.mediaType = res.data.mediaType
            }
          })
        } else {
          this.lessonData = { // 新建
            name: '',
            content: '',
            mediaCoverId: this.courseInfo.mediaCoverId,
            duration: 0,
            fileName: '',
            hash_library_id: '',
            mediaCoverUrl: this.courseInfo.mediaCoverUrl
          }
        }
      }
    },
    'lessonData.name': function (newVal) {
      this.$nextTick(() => {
        this.lessonFrom.setFieldsValue({name: newVal})
      })
    },
    'lessonData.content': function (newVal) {
      this.$nextTick(() => {
        this.lessonFrom.setFieldsValue({content: newVal})
      })
    },
    'lessonData.duration': function (newVal) {
      this.$nextTick(() => {
        this.lessonFrom.setFieldsValue({duration: newVal})
      })
    },
    'lessonData.mediaCoverId': function (newVal) {
      this.$nextTick(() => {
        this.lessonFrom.setFieldsValue({mediaCoverId: newVal})
      })
    },
    // 'lessonData.mediaType': function (newVal) {
    //   this.$nextTick(() => {
    //     this.lessonFrom.setFieldsValue({mediaType: newVal})
    //   })
    // },
    'lessonData.hash_library_id': function (newVal) {
      if (newVal) {
        this.$api.resource.getInfo({ hash_id: newVal }).then(res => {
          this.fileName = res.data.fileName
          this.lessonData.duration = res.data.duration
          this.mediaType = res.data.mediaType
        })
      }
      this.$nextTick(() => {
        this.lessonFrom.setFieldsValue({hash_library_id: newVal})
      })
    },
    'lessonData.mediaCoverUrl': function (newVal) {
      this.mediaCoverUrl = newVal
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    onSearch (filters) {
      this.filters = filters
      this.mediaType = this.filters.lessonType
      this.getList(1)
    },
    getList (current_page = this.pagination.current_page, per_page = 10) {
      let filters = {...this.filters}
      this.mediaType = filters.mediaType = filters.lessonType
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.resource.list({
        current_page,
        per_page,
        ...filters
      }).then(res => {
        if (res.data.list) {
          this.tableData = res.data.list.map((item) => {
            item.fileSize = (item.fileSize / 1024 / 1024).toFixed(1) + 'M'
            return item
          })
          this.pagination.total = res.data.info.total
        } else {
          this.tableData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    resetUpload () {
      this.lessonData.hash_library_id = ''
      this.uploadFileId = ''
      this.videofileList = []
      this.audiofileList = []
      this.imgfileList = []
    },
    submit (e) {
      var _self = this
      e.preventDefault()
      _self.lessonFrom.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let data = {
            hash_library_id: values.hash_library_id,
            mediaType: _self.mediaType,
            name: values.name,
            mediaCoverId: values.mediaCoverId,
            content: values.content,
            uploadFileId: _self.uploadFileId,
            duration: values.duration,
            mediaWidth: _self.mediaWidth,
            mediaHeight: _self.mediaHeight
          }
          if (_self.lessonId) {
            data.hash_id = _self.lessonId
            _self.$api.course.editLesson(data).then(res => {
              if (res.code === 0) {
                _self.visible = false
                _self.$emit('cancel')
                _self.$emit('reload')
              }
            })
          } else {
            data.hash_resource_id = _self.courseInfo.hash_id
            _self.$api.course.addLesson(data).then(res => {
              if (res.code === 0) {
                _self.visible = false
                _self.$emit('cancel')
                _self.$emit('reload')
              }
            })
          }
        }
      })
    },
    cancel (e) {
      this.$emit('cancel', false)
    },
    onChange (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      if (fileList[0].type.split('/')[0] === 'image') {
        this.imgfileList = fileList
        this.mediaCoverId = fileList[0].fileId
        this.mediaCoverUrl = fileList[0].thumbUrl
        if (fileList[0].status === 'done') {
          this.cansave = true
          this.uploadFlag = false
        }
      } else {
        this.mediaType = fileList[0].type.split('/')[0]
        if (this.mediaType === 'video') {
          this.videofileList = fileList
        } else if (this.mediaType === 'audio') {
          this.audiofileList = fileList
        }
        if (fileList[0].status === 'done') {
          this.cansave = true
          this.fileName = fileList[0].name
          this.lessonData.name = fileList[0].name.substring(0, fileList[0].name.lastIndexOf('.'))
          this.uploadFileId = fileList[0].fileId
          this.mediaType = fileList[0].type.split('/')[0]
          this.lessonData.duration = parseInt(fileList[0].duration)
        }
      }
    },
    setData (file) {
      return {
        'name': file.name,
        'key': file.fileHashId,
        'policy': this.parmas.policy,
        'OSSAccessKeyId': this.parmas.accessId,
        'success_action_status': '200', // 让服务端返回200,不然，默认会返回204
        'signature': this.parmas.signature
      }
    },
    beforeUpload (file, fileList) {
      this.cansave = false
      if (file.type.split('/')[0] === 'image') {
        this.uploadFlag = true
      }
      var that = this
      return new Promise((resolve, reject) => {
        var uploadSecondData = {
          ext: file.name.substring(file.name.lastIndexOf('.') + 1),
          type: file.type,
          fileName: file.name,
          fileSize: file.size,
          bucketHost: that.parmas.resourceHost
        }
        if (file.type.split('/')[0] === 'image') {
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
          return
        }
        var url = URL.createObjectURL(file)
        var video = document.createElement('video')
        video.src = url
        video.onloadedmetadata = function (evt) {
          file.duration = video.duration
          file.mediaWidth = video.videoWidth
          file.mediaHeight = video.videoHeight
          URL.revokeObjectURL(url)
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
        }
        video.load()
      })
    }
  }
}
</script>
<style scope>
  .resourceEdit .editCover{width: 240px;height:180px;float:left;display:flex;align-items:center;justify-content:center;margin-right:12px;}
  .resourceEdit .editCover .anticon{width:50%;height:50%;}
  .resourceEdit .editCover .anticon svg{width:100%;height:100%;}
  .resourceEdit .coverTips{line-height: 130%;}
  .resourceEdit .coverTips p{margin-top: 12px;}
  .resourceEdit .description{flex:1;line-height:25px;}
  .resourceEdit .description p{ height: 75px; margin:0;padding:0;cursor: pointer;overflow: hidden;word-break: break-all;}
  .checkBox{border: 1px solid rgb(235, 237, 240);padding-bottom: 10px;}
  .uploadBody{display: flex;padding: 0 5%;}
  .uploadItem{margin: 20px 5%;text-align: center;background: #efefef;}
  .uploadItem p{position: relative;width: 150px;height: 150px;margin: 0 auto;border: 1px solid rgb(235, 237, 240);}
  .uploadItem p .icon{font-size: 32px;margin: 40px 0 20px 0;}
  .uploadItem p .upType{display: block;}
  .uploadItem .ant-btn{position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;}
  .checkBox .filters{padding-left: 16px;}
  .checkBox .ant-table-tbody > tr > td{padding: 12px;}
  .checkBox .ant-tabs-bar{margin-bottom: 10px;}
  .checkBox .has-error .ant-input,
  .checkBox .has-error .ant-input:hover,
  .checkBox .has-error .ant-select-selection{border-color: #d9d9d9;}
  .checkBox .has-error .ant-select-arrow{color: #d9d9d9;}
  .checkBox .has-error .ant-select-open .ant-select-selection,
  .checkBox .has-error .ant-select-focused .ant-select-selection{box-shadow:none}
  .resourceEdit .ant-upload-list-picture{display:none!important}
</style>
