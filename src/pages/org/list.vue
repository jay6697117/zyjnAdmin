<template>
  <div class="orderList">
    <a-row>
      <a-col :span="24" align="right">
        <i-filter :filters="filters" @search="onSearch"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false">
      <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
      <span slot="examine_states" slot-scope="td">
        <a-badge status="processing" text="待处理" v-if="td == 1"/>
        <a-badge status="success" text="已开通" v-if="td == 2"/>
      </span>
      <template slot="action" slot-scope="item">
        <a-popconfirm title="立即开通此公司使用权限?" @confirm="confirmThis(item)" okText="确定" cancelText="取消" v-if="item.examine_states === 1">
          <a href="javascript:;">确认开通</a>
        </a-popconfirm>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>

<script>
const columns = [
  {title: '姓名', dataIndex: 'name', key: 'name'},
  {title: '手机号', dataIndex: 'mobile', key: 'mobile'},
  {title: '单位名称', dataIndex: 'company', key: 'company'},
  {title: '申请状态', dataIndex: 'examine_states', key: 'examine_states', scopedSlots: { customRender: 'examine_states' }, align: 'center', width: 100},
  {title: '员工人数', dataIndex: 'staff_num', key: 'staff_num', width: 100},
  {title: '申请时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 160},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 100}
]

export default {
  name: 'orderList',
  data () {
    return {
      data: [],
      columns,
      loading: false,
      pagination: {
        type: '企业',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        name: '',
        mobile: '',
        company: '',
        examine_states: '',
        start_time: null,
        end_time: null
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    setLoading (loading) {
      this.loading = loading
    },
    onSearch (filters) {
      this.filters = filters
      this.getList(1)
    },
    confirmThis (item) {
      this.$api.examine.examine({
        hash_id: item.hash_id
      }).then(res => {
        this.getList()
      })
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      let filters = JSON.parse(JSON.stringify(this.filters))
      filters.start_time = filters.start_time ? parseInt(new Date(filters.start_time).getTime() / 1000) : ''
      filters.end_time = filters.end_time ? (parseInt(new Date(filters.end_time).getTime() / 1000) + 86400) : ''
      this.$api.examine.list({
        current_page,
        per_page,
        ...filters
      }).then(res => {
        if (res.data.list) {
          this.data = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.pagination.total = 0
          this.data = []
        }
        this.loading = false
      })
    }
  }
}
</script>
