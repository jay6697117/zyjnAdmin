<template v-show="false">
  <div class="accountMain">
    <a-row>
      <a-col :sm="6" :xs="24">
        <a-button type="primary" icon="plus" @click="addAccount">新增审批员</a-button>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="学员姓名/手机号"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="accountData" :rowKey="record => record.hash_user_id" :loading="loading" :pagination="false">
      <template slot="nickname" slot-scope="text, item">
        <img :src="item.user.avatar" class="userhead">{{text}}
      </template>
      <template slot="user_type" slot-scope="td, tr">
        <a-tag v-for="(item, index) in tr.user_types" :key="index">{{item.name}}</a-tag>
      </template>
      <template slot="role_list" slot-scope="text">
        <span v-if="!text.length">--</span>
        <a-tag v-for="(item, index) in text" :key="index" v-else>{{item.name}}</a-tag>
      </template>
      <template slot="operation" slot-scope="action">
        <a href="javascript:;" @click="editorThis(action)">编辑</a>
        <a-divider type="vertical"/>
        <a href="javascript:;" @click="undoThis(action)">重置密码</a>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <a-modal :title="passwordTitle" :visible="showPassword" @ok="handleSubmit" @cancel="cancelModal" cancelText="取消" okText="保存">
      <a-form :form="form">
        <a-form-item label="hash_user_id" v-show="false">
          <a-input v-decorator="['hash_user_id']" autoComplete="off" />
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
<script type="text/ecmascript-6">
const columns = [
  // { title: '用户名', dataIndex: 'user.username', key: 'user.username', scopedSlots: { customRender: 'user.username' } },
  { title: '真实姓名', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'nickname' } },
  // { title: '状态', dataIndex: 'user.status', key: 'user.status', scopedSlots: { customRender: 'user.status' }, width: 120 },
  { title: '手机号', dataIndex: 'user.mobile', key: 'user.mobile', width: 130 },
  { title: '身份', dataIndex: 'user_type', key: 'user_type', scopedSlots: { customRender: 'user_type' }, width: 120 },
  { title: '角色', dataIndex: 'role_list', key: 'role_list', scopedSlots: { customRender: 'role_list' }, width: 120 },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 150, align: 'right' }
]
var date = parseInt(new Date().getTime() / 1000)
const accountTemp = { // 初始数据模板
  'created_time': 0,
  'entry_time': date,
  'nickname': '',
  'org_ids': [],
  'role_ids': [],
  'updated_time': 0,
  'user': {
    'hash_user_id': 0,
    'username': '',
    'avatarUrl': '',
    'mobile': '',
    'avatarFileId': '',
    'user_status': 1,
    'user_type': ''
  },
  'user_type_ids': [],
  'hash_user_id': 0,
  'remark': ''
}

export default {
  name: 'account',
  data () {
    return {
      accountData: [],
      keyWords: '',
      loading: false,
      columns,
      showEdit: false,
      showPassword: false,
      passwordTitle: '',
      editTitle: '新建审批员',
      checkedState: '',
      itemdata: JSON.parse(JSON.stringify(accountTemp)),
      form: this.$form.createForm(this, {name: 'form'}),
      pagination: {
        type: '资讯',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: ''
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    onSearch (filters) {
      this.filters = filters
      this.getList(1)
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.account.list({
        current_page,
        per_page,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.accountData = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.data = []
          this.pagination.total = res.data.info.total
        }
        this.loading = false
      })
    },
    bulkBinds () {
      this.$router.push({
        path: '/sys/bulkBinds'
      })
    },
    addAccount () {
      this.$store.commit('setListPamars', {
        pagination: this.pagination,
        filters: this.filters
      })
      this.$router.push({
        path: '/account/examine/edit'
      })
    },
    editorThis (item) { // 点击编辑
      this.$store.commit('setListPamars', {
        pagination: this.pagination,
        filters: this.filters
      })
      this.$router.push({
        path: '/account/examine/edit',
        query: {
          id: item.hash_user_id
        }
      })
    },
    enableThis (item) {
      var _self = this
      _self.$confirm({
        content: '确定要启用此审批员吗？',
        okType: 'warning',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          _self.$api.account.prohibit({
            hash_user_id: item.hash_user_id
          }).then(res => {
            if (!res.code) {
              _self.$message.success('此审批员已启用', 3)
              _self.getList(_self.searchFilter)
            }
          })
        }
      })
    },
    stopThis (item) {
      var _self = this
      _self.$confirm({
        content: '确定要禁用此审批员吗？',
        okType: 'danger',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          _self.$api.account.prohibit({
            hash_user_id: item.hash_user_id
          }).then(res => {
            if (!res.code) {
              _self.$message.success('此审批员已禁用', 3)
              _self.getList(_self.searchFilter)
            }
          })
        }
      })
    },
    undoThis (item) {
      this.showPassword = true
      this.passwordTitle = '重置 <' + item.nickname + '> 的密码'
      this.$nextTick(() => {
        this.form.setFieldsValue({hash_user_id: item.hash_user_id})
      })
    },
    onhandleOk (data) {
      this.showEdit = false
      this.showPassword = false
      if (data) {
        this.getList()
      } else {
        this.getList(1)
      }
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
    },
    onhandleCancel () {
      this.showEdit = false
    },
    handleOk () {
      this.visible = false
    }
  }
}
</script>

<style scope>
  .userhead{width: 20px;height: 20px;vertical-align: middle;border-radius: 50%; margin-right: 5px;}
  .bighead{width: 120px;height: 120px;border-radius: 50%;}
  .popBox{width: 240px;}
  .popBox .ant-row{margin-bottom: 15px;}
  .nickname{padding-top: 40px;font-size: 16px;font-weight: 700;}
  .ant-tag-blue{border:0;background:none;}
  .ant-pagination{text-align: right;padding: 10px;}
  .accountModal i{font-size:38px;color:#40a9ff;display: block;margin: auto;}
  .accountModal h2{text-align:center;line-height:50px;font-size:18px;}
  .accountModal p{text-align:center;}
  .accountModal p span{color:#40a9ff}
  .accountModal .ant-modal-footer{border:none;}
  .accountModal .ant-modal-close-x{display: none;}
  .accountModal .ant-modal-footer .ant-btn{display: none;}
  .accountModal .ant-modal-footer .ant-btn-primary{display: block;margin: 0px auto 20px;}
</style>
