<template>
  <div class="productList">
    <a-row>
      <a-col :sm="8" :xs="24">
        <div>
          <a-button type="primary" @click="addItem">新建产品</a-button>
        </div>
      </a-col>
      <a-col :sm="16" :xs="24" align="right">
        <i-filter :filters="filters" type="courseShop" @search="onSearch" placeholder="产品名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="productData" :loading="loading" rowKey="hash_id" :pagination="false" style="margin-top:20px;">
      <div class="customTd" slot="customTd" slot-scope="customTd, customTr">
        <img :src="customTr.cover"/>
        <div class="description"><a :href="customTr.previewUrl" target="_blank">{{customTr.title}}</a></div>
      </div>
      <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
      <template slot="action" slot-scope="action">
        <a :href="action.previewUrl" target="_blank">查看</a>
        <a-divider type="vertical"/>
        <a href="javascript:;" @click="edit(action)">编辑</a>
        <a-divider type="vertical"/>
        <i-remove :id="action.hash_id" :parmas="removeParmas" action="remove" @reset="getList" @loading="setLoading">
          <a href="javascript:;" slot="operation">删除</a>
        </i-remove>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <a-modal title="新建产品" :visible="visible" okText="确认选择" cancelText="取消" width="60%" :footer="null" @cancel="handleCancel">
      <a-form :form="productItem" @submit="handleSubmit" class="productEdit">
        <a-form-item label="产品名称" v-bind="global.bigFormLayout">
          <a-input :maxLength="50" placeholder="请输入产品名称（最多不超过50字）"
            v-decorator="['title', { rules: [{ required: true, message: '请输入产品名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="产品封面" v-bind="global.bigFormLayout">
          <a-row>
            <a-col :span="22">
              <a-avatar shape="square" icon="picture" class="editCover" :src="coverUrl"/>
              <div class="coverTips">
                <a-input v-show="false"
                v-decorator="['cover_file_id', { rules: [{ required: true, message: '请上传产品封面!' }] }]" />
                <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="imgfileList" :before-upload="beforeUpload" :action="parmasUpload.resourceHost" :data="setData" @change="onChange">
                  <a-button class="upType" :disabled="uploadFlag"> <a-icon type="upload" /> 选择文件 </a-button>
                </a-upload>
                <span v-if="uploadFlag"><a-spin size="small" />正在上传中</span>
                <p>产品封面指在产品列表展示的图片，请上传比例为4:3的图片，JPG/PNG格式，图片小于5M</p>
              </div>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="产品logo" v-bind="global.bigFormLayout">
          <a-row>
            <a-col :span="22">
              <a-avatar shape="square" icon="picture" class="editCover editLogo" :src="logoUrl"/>
              <div class="coverTips">
                <a-input v-show="false"
                v-decorator="['logo_file_id', { rules: [{ required: true, message: '请上传产品logo!' }] }]" />
                <a-upload name="file" list-type="picture" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :multiple="false" :file-list="LogofileList" :before-upload="beforeUploadLogo" :action="parmasUpload.resourceHost" :data="setData" @change="onChangeLogo">
                  <a-button class="upType" :disabled="uploadFlagLogo"> <a-icon type="upload" /> 选择文件 </a-button>
                </a-upload>
                <span v-if="uploadFlagLogo"><a-spin size="small" />正在上传中</span>
              </div>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-bind="global.modalbtnFormLayout">
          <a-button type="primary" html-type="submit" :disabled="uploadFlag" block slot="label">确定</a-button>
          <a-button block @click="handleCancel" :span="12">取消</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {title: '产品名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'customTd' }, align: 'left'},
  {title: '关联课程', dataIndex: 'course_total', key: 'course_total', align: 'center', width: 100},
  {title: '创建时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 200},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 200}
]
export default {
  data () {
    return {
      name: '产品名称',
      productData: [],
      columns,
      loading: false,
      visible: false,
      coverUrl: '',
      imgfileList: [],
      LogofileList: [],
      parmasUpload: this.$store.state.uploadParmas,
      productItem: this.$form.createForm(this, {name: 'editor'}),
      uploadFlag: false,
      pagination: {
        type: 'product',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: ''
      },
      removeParmas: {
        title: '产品删除',
        path: 'courseProduct',
        canRemove: true,
        searchBind: true,
        tips: '该产品已被购买，无法删除。',
        content: '删除后无法恢复，是否删除？'
      },
      productId: '',
      uploadFlagLogo: false,
      logoUrl: '',
      step: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      let listParmas = this.$store.state.listParmas
      if (listParmas.pagination.type === this.pagination.type) {
        this.onSearch(listParmas.filters, listParmas.pagination.current_page)
        this.$store.commit('initListParmas')
      } else {
        this.onSearch()
      }
    })
  },
  methods: {
    setLoading (loading) {
      this.loading = loading
    },
    onSearch (filters = this.filters, currentPage = 1) {
      this.filters = filters
      this.getList(currentPage)
    },
    getList (current_page = this.pagination.current_page, pageSize = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.courseProduct.list({
        current_page: current_page,
        per_page: pageSize,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.productData = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.productData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    addItem () { // 点击新建
      this.coverUrl = ''
      this.logoUrl = ''
      this.productItem.setFieldsValue({cover_file_id: '', title: '', logo_file_id: ''})
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.productItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('123132424', values)
          let path = this.productId ? 'edit' : 'add'
          this.$api.courseProduct[path]({
            title: values.title,
            cover_file_id: values.cover_file_id,
            hash_id: this.productId,
            logo_file_id: values.logo_file_id
          }).then(res => {
            if (res.code === 0) {
              this.$router.push({
                path: '/courseProduct/edit',
                query: {
                  id: res.data.hash_id ? res.data.hash_id : this.productId
                }
              })
            }
            this.loading = false
          })
        }
      })
    },
    edit (item) {
      this.visible = true
      this.productId = item.hash_id
      this.$api.courseProduct.getInfo({ // 获取详情
        hash_id: this.productId
      }).then(res => {
        this.coverUrl = res.data.cover
        this.logoUrl = res.data.logo
        this.productItem.setFieldsValue({cover_file_id: res.data.cover_file_id, title: res.data.title, logo_file_id: res.data.logo_file_id})
      })
    },
    onChange (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.imgfileList = fileList
      this.productItem.setFieldsValue({cover_file_id: fileList[0].fileId})
      this.coverUrl = fileList[0].thumbUrl
      if (fileList[0].status === 'done') {
        this.uploadFlag = false
        this.$api.upload.third(JSON.stringify({fileId: fileList[0].fileId})).then(res => {
          if (res.code === 0) {
            this.$message.success('上传成功')
          } else {
            this.$message.error('上传失败')
          }
        })
      }
    },
    onChangeLogo (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.LogofileList = fileList
      this.productItem.setFieldsValue({logo_file_id: fileList[0].fileId})
      console.log('logo_file_id', fileList[0].fileId)
      this.logoUrl = fileList[0].thumbUrl
      if (fileList[0].status === 'done') {
        this.uploadFlagLogo = false
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
    },
    beforeUploadLogo (file, fileList) {
      this.uploadFlagLogo = true
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
  .productEdit .ant-upload-list-picture{display:none!important}
  .productEdit .editLogo{width:50px;height:50px;border-radius: 50%;background: #868686;}
</style>
