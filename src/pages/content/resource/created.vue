<template>
  <a-modal class="created" :visible="visible" :title="'新建'+name+'资源'" :footer="null" @cancel="cancel" :maskClosable="false">
    <a-form :form="creatFrom" @submit="handleSubmit">
      <a-form-item :label="'选择'+name+'分类'" :label-col="{ span: 6 }" :wrapper-col="{ span: 6}">
        <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
          :dropdownStyle="dropdownStyle"
          :treeData="classified"
          placeholder='请选择分类'
          v-decorator="['hash_category_id']">
        </a-tree-select>
      </a-form-item>
      <a-form-item :label="name+'资源内容'" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-upload name="file" :accept="uploadType" :multiple="true" :before-upload="beforeUpload" :action="parmas.resourceHost" :data="setData" @change="onChange"
          v-decorator="['files', {valuePropName: 'fileList', getValueFromEvent: normFile, rules: [{ required: true, message: '请上传内容!' }]}]"
        >
          <a-button> <a-icon type="upload" /> 选择文件 </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item style="text-align:center;">
        <a-button style="margin-right:20px;" @click="cancel">取消</a-button>
        <a-button type="primary" html-type="submit" :disabled="!canSave">确定</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'created',
  data () {
    return {
      visible: false,
      canSave: false,
      uploadType: '',
      creatFrom: this.$form.createForm(this, {name: 'editor'}),
      classified: [],
      parmas: this.$store.state.uploadParmas,
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      apiFlag: true,
      seconds: 5
    }
  },
  watch: {
    flag: function (flag) {
      this.visible = flag
      if (flag) {
        this.$api.category.list({type: 'resource'}).then(res => {
          this.classified = res.data
        })
        this.$nextTick(() => {
          this.initForm()
        })
      }
    }
  },
  mounted () {
    this.$api.category.list({type: 'resource'}).then(res => {
      this.classified = res.data
    })
    if (this.type === 'video') {
      this.uploadType = '.mp4'
    } else if (this.type === 'audio') {
      this.uploadType = '.mp3'
    } else {
      this.uploadType = '.png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF'
    }
  },
  props: ['type', 'name', 'flag'],
  methods: {
    onChange (files) {
      let uploadStatus = true
      for (let i in files.fileList) {
        if (files.fileList[i].status !== 'done') {
          uploadStatus = false
        }
      }
      this.canSave = uploadStatus
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
      var that = this
      return new Promise((resolve, reject) => {
        var uploadSecondData = {
          ext: file.name.substring(file.name.lastIndexOf('.') + 1),
          type: file.type,
          fileName: file.name,
          fileSize: file.size,
          bucketHost: that.parmas.resourceHost
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
    },
    initForm () {
      this.creatFrom.setFieldsValue({
        hash_category_id: undefined,
        files: []
      })
    },
    normFile (e) {
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.creatFrom.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.mediaType = this.type
          values.files = values.files.map(item => {
            return {
              fileId: item.fileId,
              fileSize: item.size,
              length: parseInt(item.duration),
              mediaWidth: item.mediaWidth,
              mediaHeight: item.mediaHeight
            }
          })
          if (_self.apiFlag) {
            _self.apiFlag = false
            _self.$api.resource.add(values).then(res => {
              _self.apiFlag = true
              if (res.code !== 0) {
                this.$message.error(res.msg)
              }
              this.canSave = false
              this.visible = false
              this.$emit('cancel')
              this.$emit('funcReload', 1)
            })
          }
        }
      })
    },
    cancel () {
      this.canSave = false
      this.visible = false
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less">
  .created{
    .ant-modal-wrap {height: 100%;}
    .anticon-spin{display:none;}
  }
</style>
