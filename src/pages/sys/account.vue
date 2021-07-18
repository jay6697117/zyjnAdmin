<template v-show="false">
  <div class="accountMain">
    <a-row>
      <a-col :sm="3" :xs="24">
        <a-button type="primary" icon="plus" @click="addAccount">新增员工</a-button>
      </a-col>
      <a-col :sm="3" :xs="24">
        <a-button @click="bulkBinds">批量绑定课程</a-button>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="学员姓名"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="accountData" :rowKey="record => record.hash_user_id" :loading="loading" :pagination="false">
      <template slot="user.username" slot-scope="text, item">
        <a href="javascript:;"><img :src="item.user.avatar" class="userhead">{{text}}</a>
      </template>
      <template slot="user_type" slot-scope="td, tr">
        <a-tag v-for="(item, index) in tr.user_types" :key="index">{{item.name}}</a-tag>
      </template>
      <template slot="role_list" slot-scope="text">
        <span v-if="!text.length">--</span>
        <a-tag v-for="(item, index) in text" :key="index" v-else>{{item.name}}</a-tag>
      </template>
      <template slot="user.status" slot-scope="text">
        <a-badge status="success" text="正常" v-if="text === 1"/>
        <a-badge status="error" text="停用" v-if="text === 3"/>
      </template>
      <span slot="operation" slot-scope="action" v-show="!action.isManager">
        <a-button type="dashed" icon="edit" @click="editorThis(action)" v-if="$power('sys:account:update')">编辑</a-button>
        <a-dropdown :getPopupContainer="triggerNode => triggerNode.parentNode" v-if="$power(['sys:account:stop', 'sys:account:pause', 'sys:account:reset'])">
          <a-menu slot="overlay" align="left">
            <a-menu-item key="1" @click="enableThis(action)" v-if="action.user.status === 3 && $power('sys:account:stop')"><a-icon type="stop" />启用</a-menu-item>
            <a-menu-item key="1" @click="stopThis(action)" v-if="action.user.status === 1 && $power('sys:account:stop')"><a-icon type="stop" />停用</a-menu-item>
            <a-menu-item key="3" @click="undoThis(action)" v-if="$power('sys:account:reset')"><a-icon type="undo" />重置密码</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            更多 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </span>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <i-account-edit :title="editTitle" :flag="showEdit" @ok="onhandleOk" @cancel="onhandleCancel" :itemdata="itemdata"></i-account-edit>
    <i-account-password :title="passwordTitle" :flag="showPassword" @ok="onhandleOk" @cancel="onhandleCancel" :itemdata="itemdata"></i-account-password>
    <a-modal v-model="visible" @ok="handleOk" ok-text="我知道了" cancel-text = '' :header="null" class="accountModal">
      <a-icon type="info-circle"/>
      <h2>员工人数</h2>
      <p>当前员工人数为  <span>{{maxNum}}</span>，需要更多请联系  <span>010-81719869</span></p>
    </a-modal>
  </div>
</template>
<script type="text/ecmascript-6">
import iAccountEdit from '@/pages/components/sys/iAccountEdit.vue'
import iAccountPassword from '@/pages/components/sys/iAccountPassword.vue'
const columns = [
  // { title: '用户名', dataIndex: 'user.username', key: 'user.username', scopedSlots: { customRender: 'user.username' } },
  { title: '真实姓名', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'nickname' }, width: 120 },
  { title: '状态', dataIndex: 'user.status', key: 'user.status', scopedSlots: { customRender: 'user.status' }, width: 120 },
  { title: '身份', dataIndex: 'user_type', key: 'user_type', scopedSlots: { customRender: 'user_type' }, width: 140 },
  { title: '角色', dataIndex: 'role_list', key: 'role_list', scopedSlots: { customRender: 'role_list' }, width: 140 },
  { title: '电话', dataIndex: 'user.mobile', key: 'user.mobile', width: 130 },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 240, align: 'right' }
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
    'mobile': '',
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
      editTitle: '新建员工',
      checkedState: '',
      itemdata: JSON.parse(JSON.stringify(accountTemp)),
      pagination: {
        type: '资讯',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: '',
        user_status: '',
        user_type: ''
      },
      maxNum: '', // 最大人数
      visible: false
    }
  },
  components: {
    iAccountEdit,
    iAccountPassword
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
        this.maxNum = res.data.info.staff_upper_limit
        this.loading = false
      })
    },
    bulkBinds () {
      this.$router.push({
        path: '/sys/bulkBinds'
      })
    },
    addAccount () {
      if (this.pagination.total < this.maxNum) {
        this.showEdit = true
        this.itemdata = JSON.parse(JSON.stringify(accountTemp))
        this.editTitle = '新增员工'
      } else {
        this.visible = true
      }
    },
    editorThis (item) {
      this.showEdit = true
      this.itemdata = JSON.parse(JSON.stringify(item))
      this.editTitle = '编辑 <' + this.itemdata.nickname + '> 的个人信息'
    },
    enableThis (item) {
      var _self = this
      _self.$confirm({
        content: '确定要启用此员工吗？',
        okType: 'warning',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          _self.$api.account.prohibit({
            hash_user_id: item.hash_user_id
          }).then(res => {
            if (!res.code) {
              _self.$message.success('此员工已启用', 3)
              _self.getList(_self.searchFilter)
            }
          })
        }
      })
    },
    stopThis (item) {
      var _self = this
      _self.$confirm({
        content: '确定要禁用此员工吗？',
        okType: 'danger',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          _self.$api.account.prohibit({
            hash_user_id: item.hash_user_id
          }).then(res => {
            if (!res.code) {
              _self.$message.success('此员工已禁用', 3)
              _self.getList(_self.searchFilter)
            }
          })
        }
      })
    },
    undoThis (item) {
      this.showPassword = true
      this.itemdata = JSON.parse(JSON.stringify(item))
      this.passwordTitle = '重置 <' + item.nickname + '> 的密码'
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
    onhandleCancel () {
      this.showPassword = false
      this.showEdit = false
    },
    handleOk () {
      this.visible = false
    }
  }
}
</script>

<style scope>
  .userhead{width: 20px;vertical-align: middle;border-radius: 50%; margin-right: 5px;}
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
