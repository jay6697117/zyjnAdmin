<template>
  <div class="partnerEdit">
    <a-form :form="organForm" @submit="handleSubmit">
      <a-form-item label="hash_id" v-show="false">
        <a-input-number :min="0" v-decorator="['hash_id']" />
      </a-form-item>
      <h2>基本信息</h2>
      <a-form-item label="官方账号" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
        <a-radio-group name="radioGroup" v-decorator="['is_official']" :disabled="!!organForm.getFieldValue('hash_id')">
          <a-radio :value="1">是</a-radio>
          <a-radio :value="0">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="经营名" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
        <a-input placeholder="请输入经营名！"
          v-decorator="['name', { rules: [{ required: true, message: '请输入经营名!' }] }]"
        />
      </a-form-item>
      <a-form-item label="logo" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
        <a-row>
          <a-col :span="22">
            <a-avatar shape="square" icon="picture" class="partnerLogo" :src="coverUrlOne"/>
            <div class="coverTips">
              <a-input v-show="false"
                v-decorator="['logo_file_id', { rules: [{ required: true, message: '请上传logo!' }] }]" />
              <!-- <i-upload type="other" used="logo" @ok="handleLogoOk"></i-upload> -->
              <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUploadOne" :action="parmasUpload.resourceHost" :data="setData" @change="onChangeOne">
                <a-button class="upType" :disabled="uploadFlagOne"> <a-icon type="upload" /> 选择文件 </a-button>
              </a-upload>
              <span v-if="uploadFlagOne"><a-spin size="small" />正在上传中</span>
              <p>图片尺寸200*200像素，文件小于5M，支持jpg、png、gif格式的图片</p>
            </div>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="联系人" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
        <a-input placeholder="请输入联系人姓名！"
          v-decorator="['contact', { rules: [{ required: true, message: '请输入联系人姓名!' }] }]"
        />
      </a-form-item>
      <a-form-item label="联系电话" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
        <a-input placeholder="请输入联系电话！" :maxLength = "11"
          v-decorator="['mobile', { rules: [{ required: true, message: '请输入联系电话!' }] }]"
        />
      </a-form-item>
      <a-form-item label="联系邮箱" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
        <a-input placeholder="请输入联系邮箱！"
          v-decorator="[
            'email',
            {
              rules: [
                {
                  type: 'email',
                  message: '邮箱格式不正确!',
                },
                {
                  required: true,
                  message: '请输入联系邮箱!',
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item label="初始密码" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }" v-if="info.password !== undefined">
        <a-input placeholder="请输入初始密码" type="password"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入初始密码!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <div v-show="organForm.getFieldValue('is_official') === 0">
        <h2>资质信息</h2>
      <a-form-item label="公司名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
        <a-input placeholder="请输入公司名称！"
          v-decorator="['company_name']"
        />
      </a-form-item>
      <a-form-item label="纳税识别号" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
        <a-input placeholder="请输入纳税识别号！"
          v-decorator="['pay_taxes_number']"
        />
      </a-form-item>
      <a-form-item label="银行账号" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
        <a-input placeholder="请输入银行账号！"
          v-decorator="['bank_account']"
        />
      </a-form-item>
      <a-form-item label="开户银行" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
        <a-input placeholder="请输入开户银行！"
          v-decorator="['bank_of_deposit']"
        />
      </a-form-item>
      <a-form-item label="开户支行" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
        <a-input placeholder="请输入开户支行！"
          v-decorator="['bank_of_subbranch']"
        />
      </a-form-item>
      <a-form-item label="营业执照" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
        <a-row>
          <a-col :span="22">
            <a-avatar shape="square" icon="picture" class="licenseFile" :src="coverUrlTwo"/>
            <div class="coverTips">
              <a-input v-show="false"
                v-decorator="['business_license_file_id']" />
              <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUploadTwo" :action="parmasUpload.resourceHost" :data="setData" @change="onChangeTwo">
                <a-button class="upType" :disabled="uploadFlagTwo"> <a-icon type="upload" /> 选择文件 </a-button>
              </a-upload>
              <span v-if="uploadFlagTwo"><a-spin size="small" />正在上传中</span>
              <p>文件小于5M，支持jpg、png、gif格式的图片</p>
            </div>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="简介" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
        <a-textarea placeholder="限制200字"
          v-decorator="['introduction']"
          :autoSize="{ minRows: 3, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item label="账号状态" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
        <a-radio-group name="radioGroup" v-decorator="['status']">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">停用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="收益分成" :label-col="{ span: 3 }" :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="20">
            <a-slider :marks="marks" :step="0.05" :max="1" :min="0" :tooltipVisible="true" :tipFormatter="(v) => v * 100 + '%'"
              v-decorator="['sharing_ratio']"
            />
          </a-col>
          <a-col :span="2" :push="1">
            <a-tooltip>
              <template slot="title">
                默认收益为70%
              </template>
              <a-icon type="info-circle" style="color: red" />
            </a-tooltip>
          </a-col>
        </a-row>
      </a-form-item>
      </div>

      <a-form-item>
        <div style="text-align:center;">
          <a-button type="primary" html-type="submit" :disabled="uploadFlagOne&&uploadFlagTwo" style="margin-right:20px;">保存</a-button>
          <a-button @click="cancel">取消</a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
export default {
  name: 'organEdit',
  data () {
    return {
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      organForm: this.$form.createForm(this, {name: 'editor'}),
      content: '',
      info: {
        name: '',
        logo_file_id: '',
        contact: '',
        mobile: '',
        email: '',
        password: '',
        company_name: '',
        pay_taxes_number: '',
        bank_account: '',
        bank_of_deposit: '',
        bank_of_subbranch: '',
        business_license_file_id: '',
        introduction: '',
        is_official: 1,
        status: 1,
        sharing_ratio: 0.7
      },
      marks: {
        0: '0%',
        0.1: '10%',
        0.2: '20%',
        0.3: '30%',
        0.4: '40%',
        0.5: '50%',
        0.6: '60%',
        0.7: '70%',
        0.8: '80%',
        0.9: '90%',
        1: '100%'
      },
      parmasUpload: this.$store.state.uploadParmas,
      imgfileList: [],
      uploadFlagOne: false,
      uploadFlagTwo: false,
      coverUrlOne: '',
      coverUrlTwo: ''
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
      _self.$api.organ.getInfo({// 编辑时请求远端数据
        hash_id: _self.id
      }).then(res => {
        if (res.code === 0) {
          _self.info = res.data
          this.coverUrlOne = _self.info.logo_file
          this.coverUrlTwo = _self.info.license_file
          _self.initForm()
        }
      })
    } else {
      _self.initForm()
    }
  },
  methods: {
    initForm () {
      var formData = JSON.parse(JSON.stringify(this.info))
      delete formData.logo_file
      delete formData.license_file
      delete formData.updated_at
      delete formData.created_at
      formData.sharing_ratio = Number(formData.sharing_ratio)
      this.organForm.setFieldsValue(formData)
    },
    handleLogoOk (target) { // 上传成功
      this.uploadFlag = target.uploadFlag
      if (target.uploadFlag) {
        this.loadTxt = target.loadTxt
        return
      }
      this.info.logo_file = target.url
      this.organForm.setFieldsValue({logo_file_id: target.resourceId}) // 给表单赋值
    },
    handleLicenseOk (target) { // 上传成功
      this.uploadFlag = target.uploadFlag
      if (target.uploadFlag) {
        this.loadTxt = target.loadTxt
        return
      }
      this.info.license_file = target.url
      this.organForm.setFieldsValue({business_license_file_id: target.resourceId}) // 给表单赋值
    },
    handleSubmit (e) {
      e.preventDefault()
      this.organForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.id) {
            this.$api.organ.edit(values).then(res => {
              if (res.code === 0) {
                this.$router.push({
                  path: '/account/partner/list',
                  query: {
                    unTips: true
                  }
                })
              }
            })
          } else {
            delete values.hash_id
            this.$api.organ.add(values).then(res => {
              if (res.code === 0) {
                this.$router.push({
                  path: '/account/partner/list',
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
      if (!this.id) {
        this.$router.push({
          path: '/account/partner/list'
        })
      } else {
        this.$router.push({
          path: '/account/partner/list'
        })
      }
    },
    onChangeOne (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.imgfileList = fileList
      this.organForm.setFieldsValue({logo_file_id: fileList[0].fileId})
      this.coverUrlOne = fileList[0].thumbUrl
      if (fileList[0].status === 'done') {
        this.uploadFlagOne = false
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
    beforeUploadOne (file, fileList) {
      this.cansave = false
      this.uploadFlagOne = true
      var that = this
      return new Promise((resolve, reject) => {
        var uploadSecondData = {
          ext: file.name.substring(file.name.lastIndexOf('.') + 1),
          type: file.type,
          fileName: file.name,
          fileSize: file.size,
          bucketHost: that.parmasUpload.resourceHost
        }
        console.log(uploadSecondData)
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
    },
    onChangeTwo (info) {
      console.log(info)
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.imgfileList = fileList
      this.organForm.setFieldsValue({business_license_file_id: fileList[0].fileId})
      this.coverUrlTwo = fileList[0].thumbUrl
      if (fileList[0].status === 'done') {
        this.uploadFlagTwo = false
      }
    },
    beforeUploadTwo (file, fileList) {
      this.uploadFlagTwo = true
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
<style lang="less">
.partnerEdit{
  .partnerLogo{width: 120px;height: 120px;float: left; display: flex; align-items: center; justify-content: center; margin-right: 12px;border-radius: 50%;}
  .licenseFile{width: 120px;height: 200px;float: left; display: flex; align-items: center; justify-content: center; margin-right: 12px;}
}
.partnerEdit .ant-upload-list{display:none!important}
</style>
