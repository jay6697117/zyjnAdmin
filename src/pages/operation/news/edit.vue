<template>
  <div class="newsEdit">
    <a-form :form="currentItem" @submit="handleSubmit" v-show="loaded">
      <a-form-item label="hash_id" v-show="false">
        <a-input-number :min="0" v-decorator="['hash_id']" />
      </a-form-item>
      <a-form-item label="资讯标题" v-bind="global.bigFormLayout">
        <a-input :maxLength="50"
          placeholder="请输入资讯标题（最多不超过50字）"
          v-decorator="['title', { rules: [{ required: true, message: '请输入资讯标题!' }] }]"
        />
      </a-form-item>
      <a-form-item label="所属栏目" v-bind="global.smallFormLayout">
        <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
          :dropdownStyle="dropdownStyle"
          :treeData="columns"
          placeholder='请选择栏目'
          v-decorator="['hash_category_id']">
        </a-tree-select>
      </a-form-item>
      <a-form-item label="资讯正文" v-bind="global.bigFormLayout">
        <vue-html5-editor :height="240" :auto-height="false" :show-module-name="false"
        v-decorator="['content',{rules: [{ required: true, message: '您还未填写题目信息'}]}]"></vue-html5-editor>
      </a-form-item>
      <a-form-item label="置顶" v-bind="global.smallFormLayout">
        <a-radio-group name="radioGroup" v-decorator="['istop']">
          <a-radio :value="1">是</a-radio>
          <a-radio :value="0">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="资讯来源" v-bind="global.bigFormLayout">
        <a-row>
          <a-col :span="10">
            <a-input
              placeholder="请输入来源名称(例：交通运输部)"
              v-decorator="['source_name']"
            />
          </a-col>
          <a-col :span="1">
          </a-col>
          <a-col :span="10">
            <a-input
              placeholder="请输入网址(例: http://www.baidu.com/)，字数100"
              v-decorator="['source_url']"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="资讯缩略图" v-bind="global.bigFormLayout">
        <a-row>
          <a-col :span="22">
            <a-avatar shape="square" icon="picture" class="editCover" :src="mediaCoverUrl"/>
            <div class="coverTips">
              <a-input v-show="false"
              v-decorator="['mediaCoverId', { rules: [{ required: currentItem.getFieldValue('istop') === 1, message: '请上传资讯封面!' }] }]" />
              <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUpload" :action="parmasUpload.resourceHost" :data="setData" @change="onChange">
                <a-button class="upType" :disabled="uploadFlag"> <a-icon type="upload" /> 选择文件 </a-button>
              </a-upload>
              <span v-if="uploadFlag"><a-spin size="small" />正在上传中</span>
              <p>资讯缩略图是指在资讯客户端新闻列表展示出的新闻图片，请上传比例为4:3的图片，JPG/PNG格式，图片小于5M</p>
            </div>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="发布设置" v-bind="global.smallFormLayout">
        <a-radio-group name="radioGroup" v-decorator="['publishSetting']">
          <a-radio :value="1">发布</a-radio>
          <a-radio :value="-1">暂不发布</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-bind="global.btnFormLayout">
        <a-button type="primary" html-type="submit" block :disabled="uploadFlag" slot="label">保存</a-button>
        <a-button block @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
export default {
  name: 'planEdit',
  data () {
    return {
      columns: [],
      loaded: false,
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      mediaCoverUrl: '',
      currentItem: this.$form.createForm(this, {name: 'editor'}),
      uploadFlag: false,
      parmasUpload: this.$store.state.uploadParmas,
      imgfileList: []
    }
  },
  computed: {
    hash_id () {
      return this.$route.query.id
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    getDetails () {
      let _self = this
      _self.loaded = false
      _self.$api.category.list({type: 'news'}).then(res => {
        _self.columns = res.data
        _self.initData()
      })
    },
    initData () {
      let _self = this
      _self.loaded = true
      if (_self.hash_id) {
        _self.$api.news.getInfo({// 编辑时请求远端数据
          hash_id: _self.hash_id
        }).then(res => {
          _self.mediaCoverUrl = res.data.mediaCoverUrl // 封面地址
          let form = {
            title: res.data.title,
            mediaCoverId: res.data.mediaCoverId,
            content: res.data.content,
            publishSetting: res.data.publishSetting,
            istop: res.data.istop,
            source_name: res.data.source_name,
            source_url: res.data.source_url,
            hash_id: res.data.hash_id,
            hash_category_id: res.data.hash_category_id
          }
          _self.currentItem.setFieldsValue(form) // 给表单赋值
        })
      } else {
        _self.loaded = true
        let form = { // 添加时的默认值设置
          title: '',
          mediaCoverId: 0,
          content: '',
          publishSetting: 1,
          hash_category_id: undefined,
          istop: 0,
          source_name: '',
          source_url: ''
        }
        _self.currentItem.setFieldsValue(form)
      }
    },
    handleOk (target) { // 上传成功
      this.uploadFlag = target.uploadFlag
      if (target.uploadFlag) {
        this.loadTxt = target.loadTxt
        return
      }
      this.mediaCoverUrl = target.url
      this.currentItem.setFieldsValue({mediaCoverId: target.resourceId}) // 给表单赋值
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.currentItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (!values.mediaCoverId) {
            delete values.mediaCoverId
          }
          if (values.hash_id) {
            _self.$api.news.edit(values).then(res => {
              if (!res.code) {
                this.$router.push({
                  path: '/operation/news/list',
                  query: {
                    unTips: true
                  }
                })
              }
            })
          } else {
            _self.$api.news.add(values).then(res => {
              if (!res.code) {
                this.$router.push({
                  path: '/operation/news/list',
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
        path: '/operation/news/list'
      })
    },
    onChange (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.imgfileList = fileList
      this.mediaCoverUrl = fileList[0].thumbUrl
      this.currentItem.setFieldsValue({mediaCoverId: fileList[0].fileId}) // 给表单赋值
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
  .newsEdit .ant-upload-list-picture{display:none!important}
</style>
