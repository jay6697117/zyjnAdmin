<template>
  <div>
    <a-avatar shape="square" icon="picture" class="licenseCover" :src="upData.coverUrl"/>
    <div class="licenseTips">
      <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUpload" :action="parmasUpload.resourceHost" :data="setData" @change="onChange">
        <a-button class="upType" :disabled="uploadFlag"> <a-icon type="upload" /> 选择文件 </a-button>
      </a-upload>
      <span v-if="uploadFlag"><a-spin size="small" />正在上传中</span>
      <p>{{upData.tips}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'uploadImg',
  props: ['upData'],
  data () {
    return {
      imgfileList: [],
      uploadFlag: false,
      parmasUpload: this.$store.state.uploadParmas
    }
  },
  methods: {
    onChange (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.imgfileList = fileList
      this.form.setFieldsValue({business_license_file_id: fileList[0].fileId})
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

<style>
.licenseCover{width: 135px;height: 240px;float: left;display: flex;align-items: center;justify-content: center;margin-right: 12px;}
.licenseCover .anticon{width: 45px; height: 45px;}
.licenseCover .anticon svg{width: 100%; height: 100%;}
.licenseTips{margin-left: 150px;}
.licenseTips .ant-upload-list{display: none;}
</style>
