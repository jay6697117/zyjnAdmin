<template>
  <div class="indexMain">
    <a-row :gutter="20">
      <a-col :span="8">
        <a-button type="primary" icon="plus" @click="addDeveloper">新建企业</a-button>
      </a-col>
      <a-col :sm="16" :xs="24" align="right">
        <i-filter :filters="filters" type="course" @search="onSearch" placeholder="课程名称"></i-filter>
      </a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col :span="24">
        <a-table :columns="columns" :dataSource="orgData" :loading="loading" rowKey="organization_id" :pagination="false">
          <template slot="name" slot-scope="td, tr">
            <div>{{td}}</div>
            <span style="color: #aaa" v-if="tr.provinceName">{{tr.provinceName + ' ' + tr.cityName}}</span>
          </template>
          <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
          <span slot="status" slot-scope="status">
            <a-tag v-if="status" color="cyan">正常</a-tag>
            <a-tag v-else color="green">停用</a-tag>
          </span>
          <template slot="action" slot-scope="item">
            <i-operation :item="item" type="account" :operation="operation" :pagination="pagination" :filters="filters" @reset="getList" @loading="setLoading" @stop="stop"  @changePass="changePass"></i-operation>
          </template>
        </a-table>
        <i-pagination :pagination="pagination" @change="getList"/>
      </a-col>
    </a-row>
    <a-modal :title="passwordTitle" :visible="showPassword" @ok="handleSubmit" @cancel="cancelModal" cancelText="取消" okText="保存">
      <a-form :form="form">
        <a-form-item label="hash_user_id" v-show="false">
          <a-input v-decorator="['hash_user_id']" autoComplete="off"/>
        </a-form-item>
        <a-form-item label="密码" v-bind="global.formItemLayout">
          <a-input type="password" placeholder="请输入为员工设置的新密码!" autoComplete="new-password"
            v-decorator="['password', { rules: [{ required: true, message: '请输入密码!', whitespace: true }] }]"
          />
        </a-form-item>
        <a-row>
          <a-col :span="18" :push="6">
            重置密码后，请将密码告知员工，确保其正常使用
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  { title: '名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
  { title: '负责人', dataIndex: 'username', key: 'username', width: 120 },
  { title: '电话', dataIndex: 'mobile', key: 'mobile', width: 130 },
  { title: '绑定产品', dataIndex: 'buy_product_number', key: 'buy_product_number', width: 100, align: 'center' },
  { title: '创建时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 110 },
  { title: '员工上限', dataIndex: 'staff_upper_limit', key: 'staff_upper_limit', width: 100, align: 'center' },
  { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }, width: 100 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 80, align: 'center' }
]
export default {
  name: 'org',
  data () {
    return {
      orgData: [],
      loading: false,
      columns,
      showPassword: false,
      passwordTitle: '',
      form: this.$form.createForm(this, {name: 'form'}),
      pagination: {
        type: '企业',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        mobile: '',
        search_content: '',
        user_status: ''
      },
      operation: [
        {type: 'bind', name: '绑定产品', url: '/account/developer/bind'},
        {type: 'edit', name: '编辑', url: '/account/developer/edit?type=edit'},
        {type: 'stop', name: '停用'},
        {type: 'reset', name: '修改密码'}
      ]
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
    stop (item) {
      this.$api.org.state({
        hash_org_id: item.hash_id
      }).then(res => {
        if (!res.code) {
          this.$message.success(res.data.status ? '启用成功' : '停用成功')
          this.getList()
        }
      })
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.org.list({
        current_page,
        per_page,
        ...this.filters,
        mediaType: this.type
      }).then(res => {
        if (res.data.list) {
          this.orgData = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.tableData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    addDeveloper () { // 点击新建
      this.$router.push({
        path: '/account/developer/edit?type=create',
        query: {
          id: ''
        }
      })
    },
    changePass (item) {
      this.showPassword = true
      this.passwordTitle = '重置 <' + item.nickname + '> 的密码'
      this.$nextTick(() => {
        this.form.setFieldsValue({hash_user_id: item.hash_user_id})
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.loading = true
      this.form.validateFieldsAndScroll((err, val) => {
        if (!err) {
          this.$api.account.reset(val).then(res => {
            this.loading = false
            if (!res.code) {
              this.$message.success('保存成功', 3)
              this.showPassword = false
            }
          })
        }
      })
    },
    cancelModal () {
      this.showPassword = false
    }
  }
}
</script>

<style lang="less" scope>
  .indexMain{color: #000;}
</style>
