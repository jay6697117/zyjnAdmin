<template>
  <div class="examineEdit">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="global.smallFormLayout" label="真实姓名">
        <a-input :maxLength="20" placeholder="请输入真实姓名（最多不超过20字）"
          v-decorator="[
            'nickname',
            {rules: [{ required: true, message: '请输入真实姓名!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.smallFormLayout" label="头像">
        <a-row>
          <a-col :span="8">
            <a-avatar icon="picture" :size="50" class="editCover" :src="avatarUrl"/>
          </a-col>
          <a-col :span="16">
            <div class="coverTips">
              <a-input v-show="false" v-decorator="['avatarFileId', { rules: [{ required: true, message: '请上传头像!' }] }]" />
              <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUpload" :action="parmasUpload.resourceHost" :data="setData" @change="onChange">
                <a-button class="upType" :disabled="uploadFlag"> <a-icon type="upload" /> 选择图片 </a-button>
              </a-upload>
              <span v-if="uploadFlag"><a-spin size="small" />正在上传中</span>
              <p>50*50 .jpg/.png</p>
            </div>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item v-bind="global.smallFormLayout" label="手机号">
        <a-input placeholder="请输入手机号" :maxLength="11"
          v-decorator="[
            'mobile',
            {rules: [{ required: true, message: '请输入手机号!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.smallFormLayout" label="初始密码" v-if="!id">
        <a-input placeholder="请输入初始密码"
          v-decorator="[
            'password',
            {rules: [{ required: !id, message: '请输入初始密码!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.smallFormLayout" label="角色">
        <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
          style="width: 100%"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="roletree"
          placeholder='请选择角色'
          treeNodeFilterProp="title"
          :treeDefaultExpandedKeys = '[0]'
          multiple
          v-decorator="[
            'hash_role_ids',
            {rules: [{ required: true, message: '请选择角色!'}]}
          ]"
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item v-bind="global.smallFormLayout" label="入职日期" v-if="!id">
        <a-date-picker style="width:100%"
        v-decorator="['entry_time', {
          rules: [{ type: 'object', required: true, message: '请输入入职日期!' }],
        }]" />
      </a-form-item>
      <a-form-item v-bind="global.btnFormLayout">
        <a-button type="primary" html-type="submit" :loading="loading" block slot="label">保存</a-button>
        <a-button block @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'organEdit',
  data () {
    return {
      itemdata: '',
      loading: false,
      showSetting: true,
      roletree: [],
      form: this.$form.createForm(this, {name: 'account'}),
      avatarUrl: '',
      uploadFlag: false,
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
    this.itemdata = {
      avatar: '',
      avatarFileId: '',
      hash_role_ids: [],
      password: '',
      entry_time: parseInt(new Date().getTime() / 1000),
      hash_user_id: '',
      mobile: '',
      nickname: ''
    }
    if (this.id) {
      this.$api.account.getInfo({// 编辑时请求远端数据
        hash_user_id: this.id
      }).then(res => {
        if (res.code === 0) {
          this.itemdata = res.data
          this.initForm()
        }
      })
    } else {
      this.initForm()
    }
  },
  methods: {
    moment,
    initForm () {
      var data = this.itemdata
      let formData = {
        'nickname': data.nickname,
        'mobile': data.mobile,
        'hash_role_ids': data.hash_role_ids,
        'avatarFileId': data.avatarFileId
      }
      this.avatarUrl = data.avatar
      Promise.all([this.$api.roleCategory.list(), this.$api.role.list()]).then(res => {
        this.roletree = this.initRole(res[0].data, res[1].data)
        this.$nextTick(() => {
          this.form.setFieldsValue(formData)
        })
      })
    },
    dateFormat: function (time) {
      var date = new Date(time)
      var year = date.getFullYear()
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return year + '-' + month + '-' + day
    },
    initRole (classify, list) {
      var arr = []
      list.forEach(roles => {
        arr.push({
          key: roles.hash_id,
          value: roles.hash_id,
          title: roles.name
        })
      })
      return arr
    },
    cancel () {
      this.$router.push({
        path: '/account/examine/list'
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, val) => {
        if (!err) {
          this.loading = true
          val.hash_role_ids = val.hash_role_ids || []
          val.hash_user_id = this.itemdata.hash_user_id
          val.user_type_ids = [3]
          val.entry_time = this.dateFormat(new Date(val.entry_time).getTime())
          if (this.id) {
            this.$api.account.edit(val).then(res => {
              this.loading = false
              if (!res.code) {
                this.$message.success('添加成功', 3)
                this.$router.push({
                  path: '/account/examine/list',
                  query: {
                    unTips: true
                  }
                })
              }
            })
          } else {
            delete val.hash_user_id
            this.$api.account.add(val).then(res => {
              this.loading = false
              if (!res.code) {
                this.$message.success('保存成功', 3)
                this.$router.push({
                  path: '/account/examine/list',
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
    onChange (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.imgfileList = fileList
      this.form.setFieldsValue({avatarFileId: fileList[0].fileId})
      this.avatarUrl = fileList[0].thumbUrl
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
.ant-upload-list-item{display: none!important;}
</style>
