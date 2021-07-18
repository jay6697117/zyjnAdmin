<template>
  <div>
    <a-row class="exam">
      <a-col :sm="6" :xs="24">
        <a-button type="primary" @click="addItem">新建合伙人</a-button>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="企业名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false">
      <span slot="name" slot-scope="td, tr">
        <img :src="tr.logo" class="partnerLogo">{{tr.name}}
      </span>
      <span slot="sale_course_number" slot-scope="td">
        {{td}}个
      </span>
      <span slot="sales_amount" slot-scope="td">
        {{td | moneyFormat}}
      </span>
      <span slot="status" slot-scope="status">
        <a-badge status="success" text="启用" v-if="status == '1'"/>
        <a-badge status="error" text="停用" v-if="status == '0'"/>
      </span>
      <span slot="is_official" slot-scope="is_official">
        <a-badge status="success" text="是" v-if="is_official == '1'"/>
        <a-badge status="error" text="否" v-if="is_official == '0'"/>
      </span>
      <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
      <template slot="action" slot-scope="item">
        <a href="javascript:;" @click="editItem(item)">编辑</a>
        <a-divider type="vertical"/>
        <a href="javascript:;" @click="undoItem(item)">重置密码</a>
        <a-divider type="vertical"/>
        <a href="javascript:;" @click="stopItem(item)" v-if="item.status == 0">启用</a>
        <a href="javascript:;" @click="stopItem(item)" v-else>停用</a>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <a-modal :title="passwordTitle" :visible="showPassword" @ok="handleSubmit" @cancel="cancelModal" cancelText="取消" okText="保存">
      <a-form :form="form">
        <a-form-item label="hash_id" v-show="false">
          <a-input v-decorator="['hash_id']" autoComplete="off"/>
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
  {title: '经营信息 ', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' }},
  {title: '联系人', key: 'contact', dataIndex: 'contact', align: 'center', width: 120},
  {title: '联系电话', key: 'mobile', dataIndex: 'mobile', align: 'center', width: 130},
  {title: '课程数量', dataIndex: 'sale_course_number', key: 'sale_course_number', scopedSlots: { customRender: 'sale_course_number' }, align: 'center', width: 100},
  {title: '官方账号', dataIndex: 'is_official', key: 'is_official', scopedSlots: { customRender: 'is_official' }, align: 'center', width: 100},
  {title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }, align: 'center', width: 100},
  {title: '入驻时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 110},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 200}
]
export default {
  name: 'organList',
  data () {
    return {
      data: [],
      columns,
      loading: false,
      type: 'text',
      showPassword: false,
      passwordTitle: '',
      form: this.$form.createForm(this, {name: 'form'}),
      pagination: {
        type: 'organ',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        content_provider_account_status: '',
        search_content: ''
      }
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
    onSearch (filters = this.filters, currentPage = 1) {
      this.filters = filters
      this.getList(currentPage)
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.organ.list({
        current_page,
        per_page,
        ...this.filters
      }).then(res => {
        if (res.code === 0) {
          if (res.data.list) {
            this.data = res.data.list.map((item) => {
              return item
            })
            this.pagination.total = res.data.info.total
          } else {
            this.data = []
            this.pagination.total = 0
          }
        }
        this.loading = false
      })
    },
    addItem () { // 点击新建
      this.$router.push({
        path: '/account/partner/edit',
        query: {
          id: ''
        }
      })
    },
    editItem (item) { // 点击编辑
      this.$store.commit('setListPamars', {
        pagination: this.pagination,
        filters: this.filters
      })
      this.$router.push({
        path: '/account/partner/edit',
        query: {
          id: item.hash_id
        }
      })
    },
    stopItem (item) { // 点击编辑
      this.loading = true
      this.$api.organ.status({ hash_id: item.hash_id }).then((res) => {
        this.loading = false
        this.getList()
      })
    },
    undoItem (item) {
      this.showPassword = true
      this.passwordTitle = '重置 <' + item.name + '> 的密码'
      this.$nextTick(() => {
        this.form.setFieldsValue({hash_id: item.hash_id})
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.loading = true
      this.form.validateFieldsAndScroll((err, val) => {
        if (!err) {
          this.$api.organ.reset(val).then(res => {
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
<style scope>
  .partnerLogo{width: 60px;height: 60px;border-radius: 50%;vertical-align: middle; margin-right: 10px;}
  .exam .ant-row{margin-bottom:20px;}
  .del-other-list .delCover{width: 120px;}
  .del-other-list .ant-list-item{background: rgb(240, 240, 240);padding: 10px; margin: 10px 0;}
</style>
