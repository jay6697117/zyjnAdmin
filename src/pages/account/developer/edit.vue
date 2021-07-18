<template>
  <div class="developerInfo">
    <a-row >
      <a-col :span="12">
        <h2>企业信息</h2>
      </a-col>
      <a-col :span="12" align="right" v-show="!editState && !type">
        <a-button type="primary" @click="editIt">编辑</a-button>
      </a-col>
    </a-row>
    <div v-show="!type && !editState">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">partner_id:</a-col>
            <a-col :span="20">{{info.partner_id}}</a-col>
          </a-row>
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">partner_key:</a-col>
            <a-col :span="20">{{info.partner_key}}</a-col>
          </a-row>
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">secret_key:</a-col>
            <a-col :span="20">{{info.secret_key}}</a-col>
          </a-row>
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">所在地区:</a-col>
            <a-col :span="20">
              <span v-if="info.provinceName">{{info.provinceName}} / {{info.cityName}}</span>
              <span style="color:#888" v-else>待补充</span>
            </a-col>
          </a-row>
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">联系人:</a-col>
            <a-col :span="20">{{info.nickname}}</a-col>
          </a-row>
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">手机号:</a-col>
            <a-col :span="20">{{info.mobile}}</a-col>
          </a-row>
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">电子邮箱:</a-col>
            <a-col :span="20">
              <span v-if="info.email">{{info.email}}</span>
              <span style="color:#888" v-else>待补充</span>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="12">
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">企业名称:</a-col>
            <a-col :span="20">{{info.name}}</a-col>
          </a-row>
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">企业网址:</a-col>
            <a-col :span="20">
              <span v-if="info.website">{{info.website}}</span>
              <span style="color:#888" v-else>待补充</span>
            </a-col>
          </a-row>
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">企业介绍:</a-col>
            <a-col :span="20">
              <span v-if="info.introduction">{{info.introduction}}</span>
              <span style="color:#888" v-else>待补充</span>
            </a-col>
          </a-row>
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">员工上限:</a-col>
            <a-col :span="20">{{info.staff_upper_limit}}</a-col>
          </a-row>
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">组织状态:</a-col>
            <a-col :span="20">{{info.status ? '正常' : '停用'}}</a-col>
          </a-row>
          <a-row :gutter="[12, 12]">
            <a-col :span="4" align="right">营业执照:</a-col>
            <a-col :span="20">
              <img class="licenseCover" :src="info.business_license_file_url" v-if="info.business_license_file_url">
              <span style="color:#888" v-else>待补充</span>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div v-show="type || editState">
      <a-form :form="form" @submit="handleSubmit" v-show="loaded">
        <a-form-item label="hash_org_id" v-show="false">
          <a-input v-decorator="['hash_org_id']" />
        </a-form-item>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item v-bind="global.dubbleColumn" label="partner_id" v-show="id">
              <a-input disabled v-decorator="['partner_id']" />
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="partner_key" v-show="id">
              <a-input disabled v-decorator="['partner_key']" />
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="secret_key" v-show="id">
              <a-input disabled v-decorator="['secret_key']" />
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="企业名称">
              <a-input :maxLength="50" placeholder="请输入企业名称"
                v-decorator="['name', { rules: [{ required: true, message: '请输入企业名称!' }] }]"
              />
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="所在地区">
              <a-cascader :options="options" :load-data="loadData" change-on-select placeholder="请选择所在地区" @change="onSelect"
                v-decorator="['area', { rules: [{ required: true, message: '请选择所在地区!' }] }]"
              />
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="联系人">
              <a-input placeholder="请输入真实姓名"
                v-decorator="[
                  'nickname',
                  {rules: [{ required: true, message: '请输入真实姓名!', whitespace: true }]}
                ]"
              />
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="手机号">
              <a-input placeholder="请输入手机号" :maxLength="11"
                v-decorator="[
                  'mobile',
                  {rules: [{ required: true, message: '请输入手机号!', whitespace: true }]}
                ]"
              />
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="密码" v-show="type === 'create'">
              <a-input placeholder="请输入密码" type="password"
                v-decorator="[
                  'password',
                  {rules: [{ required: type === 'create', message: '请输入密码!', whitespace: true }]}
                ]"
              />
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="角色" v-show="type === 'create'">
              <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="roletree"
                placeholder='请选择角色'
                :treeDefaultExpandedKeys = '[0]'
                multiple
                treeNodeFilterProp="title"
                v-decorator="[
                  'hash_role_ids',
                  {rules: [{ required: type === 'create', message: '请选择角色!'}]}
                ]"
              >
              </a-tree-select>
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="员工上限" v-show="type">
              <a-input-number :min="0" placeholder="请输入数字" style="width: 150px"
                v-decorator="[
                  'staff_upper_limit',
                  {rules: [{ required: !!type, message: '请输入数字!' }]}
                ]"
                @change="resetLimit"
              />
              <div class="ant-form-explain" style="color:#f5222d;" v-if="errorShow">{{errorText}}</div>
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="电子邮箱">
              <a-input placeholder="请输入电子邮箱"
                v-decorator="[
                  'email',
                  { rules: [
                      {
                        type: 'email',
                        message: '邮箱格式有误!'
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item v-bind="global.dubbleColumn" label="企业网址">
              <a-input placeholder="请输入企业网址" v-decorator="['website']" />
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="企业介绍">
              <a-textarea :auto-size="{ minRows: 3, maxRows: 5 }" placeholder="请输入企业介绍" v-decorator="['introduction']" />
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="营业执照">
              <uploadImg :upData="upData"></uploadImg>
              <a-input v-show="false" v-decorator="['business_license_file_id']" />
            </a-form-item>
            <a-form-item v-bind="global.dubbleColumn" label="组织状态" v-show="type">
              <a-radio-group name="radioGroup" v-decorator="['status', {rules: [{ required: !!type }]}]">
                <a-radio :value="1">正常</a-radio>
                <a-radio :value="0">停用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item v-bind="global.btnFormLayout">
          <a-button type="primary" html-type="submit" block slot="label">保存</a-button>
          <a-button block @click="back">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>

</template>
<script>
const info = { // 添加时的默认值设置
  email: '',
  introduction: '',
  website: '',
  business_license_file_id: '',
  business_license_file_url: '',
  hash_id: '',
  mobile: '',
  name: '',
  nickname: '',
  city: null,
  province: null,
  partner_id: 0,
  partner_key: '',
  secret_key: '',
  staff_upper_limit: 0,
  status: 1
}
export default {
  data () {
    return {
      loaded: false,
      form: this.$form.createForm(this, {name: 'form'}),
      editState: false,
      errorShow: false,
      errorText: '',
      roletree: [],
      info: info,
      options: [],
      upData: {
        coverUrl: '',
        tips: '支持JPG/PNG格式，图片小于5M'
      }
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    type () {
      return this.$route.query.type
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.type === 'create') {
        this.getCities()
        this.initForm(info)
      } else if (this.type === 'edit') {
        this.loaded = false
        this.$api.org.getInfo({hash_org_id: this.id}).then(res => {
          if (!res.code) {
            this.info = res.data
            this.getCities()
            this.initForm(res.data)
          }
        })
      } else {
        this.loaded = false
        this.$api.org.getInfo().then(res => {
          if (!res.code) {
            this.info = res.data
            this.getCities()
            this.initForm(res.data)
          }
        })
      }
    },
    onSelect (val) {
      console.log(val)
    },
    editIt () {
      this.editState = true
    },
    back () {
      if (this.type) {
        this.$router.push({
          path: '/account/developer/list'
        })
      } else {
        this.editState = false
      }
    },
    hanldeChange (item) {
      this.$api.org.city({parent_id: item}).then(res => {
        if (!res.code) {
          this.cities = res.data.map(item => {
            return {
              key: item.id,
              value: item.id,
              title: item.name
            }
          })
        }
      })
    },
    initRole (classify, list) {
      var arr = []
      classify.forEach(classItem => {
        var obj = {
          key: 'group' + classItem.hash_id,
          value: 'group' + classItem.hash_id,
          title: classItem.name,
          disabled: true,
          children: []
        }
        list.forEach(listItem => {
          if (listItem.hash_category_id === classItem.hash_id) {
            obj.children.push({
              key: listItem.hash_id,
              value: listItem.hash_id,
              title: listItem.name
            })
          }
        })
        arr.push(obj)
      })
      return arr.filter(item => item.children.length)
    },
    getRoleList () {
      Promise.all([this.$api.roleCategory.list(), this.$api.role.list()]).then(results => {
        this.loaded = true
        this.roletree = this.initRole(results[0].data, results[1].data)
      })
    },
    getCities () {
      this.$api.org.city().then(res => {
        if (!res.code) {
          let provinces = res.data
          this.options = provinces.map(item => {
            return {
              value: item.id,
              label: item.name,
              isLeaf: false
            }
          })
          this.$api.org.city({parent_id: this.info.province}).then(res => {
            if (!res.code) {
              this.options.forEach(item => {
                if (item.value === this.info.province) {
                  item.children = res.data.map(item => {
                    return {
                      value: item.id,
                      label: item.name
                    }
                  })
                }
              })
              this.options = [...this.options]
            }
          })
          this.getRoleList()
        }
      })
    },
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      this.$api.org.city({parent_id: targetOption.value}).then(res => {
        if (!res.code) {
          targetOption.loading = false
          targetOption.children = res.data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          this.options = [...this.options]
        }
      })
    },
    resetLimit (value) {
      if (value !== '') {
        if (parseInt(value) === 0) {
          this.errorShow = true
          this.errorText = '员工上限不能为0'
        } else if (parseInt(value) < this.employeesNumber) {
          this.errorShow = true
          this.errorText = '员工上限不能小于实际员工人数'
        } else {
          this.errorShow = false
          this.errorText = ''
        }
      } else {
        this.errorShow = false
        this.errorText = ''
      }
    },
    initForm (data) {
      let fieldsValue = {
        email: data.email,
        introduction: data.introduction,
        website: data.website,
        business_license_file_id: data.business_license_file_id || '',
        hash_org_id: data.hash_id || '',
        mobile: data.mobile,
        name: data.name,
        nickname: data.nickname,
        area: [data.province, data.city],
        partner_id: data.partner_id,
        partner_key: data.partner_key,
        secret_key: data.secret_key,
        staff_upper_limit: data.staff_upper_limit,
        status: data.status
      }
      this.upData.coverUrl = data.business_license_file_url // 封面地址
      this.form.setFieldsValue(fieldsValue) // 给表单赋值
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.province = values.area[0]
          values.city = values.area[1]
          if (this.id || !this.type) {
            this.$api.org.update(values).then(res => {
              if (!res.code) {
                if (!this.type) {
                  this.editState = false
                  this.init()
                } else {
                  this.$router.push({
                    path: '/account/developer/list',
                    query: {
                      unTips: true
                    }
                  })
                }
              }
            })
          } else {
            this.$api.org.add(values).then(res => {
              if (!res.code) {
                this.$router.push({
                  path: '/account/developer/list',
                  query: {
                    unTips: true
                  }
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style>
.developerInfo h2{margin-bottom: 12px;}
.developerInfo .licenseCover{width: 135px;height: 240px;float: left;display: flex;align-items: center;justify-content: center;margin-right: 12px;}
.developerInfo .licenseCover .anticon{width: 45px; height: 45px;}
.developerInfo .licenseCover .anticon svg{width: 100%; height: 100%;}
.developerInfo .licenseTips{margin-left: 150px;}
.developerInfo .licenseTips .ant-upload-list{display: none;}
</style>
