<template>
  <a-drawer :title="title" placement="right" :closable="false"  @close="handleCancel" :visible="visible" width="300" >
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="global.formItemLayout" label="真实姓名">
        <a-input :maxLength="20" placeholder="请输入真实姓名（最多不超过20字）"
          v-decorator="[
            'nickname',
            {rules: [{ required: true, message: '请输入真实姓名!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item label="头像" v-bind="global.formItemLayout">
        <a-row>
          <a-col :span="8">
            <a-avatar icon="picture" :size="50" class="editCover" :src="avatarUrl"/>
          </a-col>
          <a-col :span="16">
            <div class="coverTips">
              <a-input v-show="false"
              v-decorator="['avatarFileId', { rules: [{ required: true, message: '请上传头像!' }] }]" />
              <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUpload" :action="parmasUpload.resourceHost" :data="setData" @change="onChange">
                <a-button class="upType" :disabled="uploadFlag"> <a-icon type="upload" /> 选择图片 </a-button>
            </a-upload>
            <span v-if="uploadFlag"><a-spin size="small" />正在上传中</span>
            <p>50*50 .jpg/.png</p>
            </div>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="手机号">
        <a-input placeholder="请输入手机号" :maxLength="11"
          v-decorator="[
            'mobile',
            {rules: [{ required: true, message: '请输入手机号!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="初始密码" v-if="inintPassword">
        <a-input placeholder="请输入初始密码"
          v-decorator="[
            'password',
            {rules: [{ required: inintPassword, message: '请输入初始密码!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-row :gutter="20" style="margin-bottom:20px">
        <a-col class="gutter-row" :span="8" align="right">
          <strong>组织关系</strong>
        </a-col>
      </a-row>
      <a-form-item v-bind="global.formItemLayout" label="用户身份">
        <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
          style="width: 100%"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="typelist"
          placeholder='请选择用户身份'
          :treeDefaultExpandedKeys = '[0]'
          multiple
          treeNodeFilterProp="title"
          @change="userTypeHandle"
          v-decorator="[
            'user_type_ids'
          ]"
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="角色" v-if="isAdmin">
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
            {rules: [{ required: isAdmin, message: '请选择角色!'}]}
          ]"
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="入职日期">
        <a-date-picker style="width:100%"
        v-decorator="['entry_time', {
          rules: [{ type: 'object', required: true, message: '请输入入职日期!' }],
        }]" />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="讲师简介" v-show="isTeacher">
        <a-textarea placeholder="请输入讲师简介"
          v-decorator="[
            'remark',
            {rules: [{ required: isTeacher, message: '请输入讲师简介!', whitespace: true }]}
          ]"
          :autoSize="{ minRows: 3, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item :wrapper-col="global.formItemLayout.buttonCol">
        <a-button type="primary" html-type="submit" :loading="loading" block>保存</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
import moment from 'moment'
export default {
  name: 'iAccountEdits',
  data () {
    return {
      loading: false,
      visible: false,
      urlShow: true,
      apiShow: true,
      iconShow: true,
      invisibleShow: true,
      indexShow: true,
      inintPassword: true,
      isStudent: false,
      isAdmin: false,
      isTeacher: false,
      showSetting: true,
      roletree: [],
      typelist: [],
      form: this.$form.createForm(this, {name: 'account'}),
      avatarUrl: '',
      uploadFlag: false,
      parmasUpload: this.$store.state.uploadParmas,
      imgfileList: []
    }
  },
  props: ['title', 'flag', 'itemdata'],
  watch: {
    flag: function () {
      let self = this
      self.visible = self.flag
      if (self.visible) {
        self.inintPassword = self.title === '新增审批员'
        self.userTypeHandle(self.itemdata.user_type_ids)
        let formData = {
          'nickname': self.itemdata.nickname,
          'mobile': self.itemdata.user.mobile,
          'password': self.itemdata.user.password,
          'user_type_ids': self.itemdata.user_type_ids,
          'hash_role_ids': self.itemdata.role_ids,
          'remark': self.itemdata.remark,
          'entry_time': moment(this.dateFormat(self.itemdata.entry_time * 1000)),
          'avatarFileId': self.itemdata.user.avatarFileId
        }
        this.avatarUrl = self.itemdata.user.avatar
        Promise.all([self.$api.account.typeList(), self.$api.roleCategory.list(), self.$api.role.list()]).then(res => {
          self.typelist = res[0].data
          self.roletree = self.initRole(res[1].data, res[2].data)
          self.$nextTick(() => {
            self.form.setFieldsValue(formData)
          })
        })
      }
    }
  },
  methods: {
    dateFormat: function (time) {
      var date = new Date(time)
      var year = date.getFullYear()
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return year + '-' + month + '-' + day
    },
    userTypeHandle (selected) {
      this.isStudent = selected.indexOf(1) !== -1
      this.isAdmin = selected.indexOf(3) !== -1
      this.isTeacher = selected.indexOf(2) !== -1
    },
    initRole (classify, list) {
      var arr = []
      classify.forEach(group => {
        var obj = {
          key: group.hash_id,
          value: group.hash_id,
          title: group.name,
          disabled: true
        }
        list.forEach(roles => {
          if (group.hash_id === roles.hash_category_id) {
            var role = {
              key: roles.hash_id,
              value: roles.hash_id,
              title: roles.name
            }
            if (obj.children && obj.children.length) {
              obj.children.push(role)
            } else {
              obj.children = [role]
            }
          }
        })
        arr.push(obj)
      })
      return arr
    },
    handleCancel () {
      this.$emit('cancel', false)
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, val) => {
        if (!err) {
          this.loading = true
          val.hash_role_ids = val.hash_role_ids || []
          val.hash_user_id = this.itemdata.hash_user_id
          val.entry_time = this.dateFormat(new Date(val.entry_time).getTime())
          if (this.inintPassword) {
            delete val.hash_user_id
            this.$api.account.add(val).then(res => {
              this.loading = false
              if (!res.code) {
                this.$message.success('添加成功', 3)
                this.$emit('ok', false)
              }
            })
          } else {
            this.$api.account.edit(val).then(res => {
              this.loading = false
              if (!res.code) {
                this.$message.success('保存成功', 3)
              }
              this.$emit('ok', true)
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
