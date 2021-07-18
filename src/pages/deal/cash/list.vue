<template>
  <div class="orderList">
    <a-row>
      <a-col :span="24" align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="企业名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false">
      <span slot="user" slot-scope="td, tr">
        {{tr.card_username}} {{tr.mobile}}
      </span>
      <span slot="withdrawal_amount" slot-scope="td">
        ￥{{(td / 100).toFixed(2)}}
      </span>
      <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
      <template slot="done_at" slot-scope="td, tr">
        <a-date-picker placeholder="打款时间" showTime v-model="done_at" @ok="upDate" v-if="currentItem.hash_id === tr.hash_id"/>
        <span v-else>{{td | timeFormat('yyyy-MM-dd')}}</span>
      </template>
      <span slot="is_finished" slot-scope="td">
        <a-badge status="processing" text="待处理" v-if="td == 0"/>
        <a-badge status="success" text="已打款" v-if="td == 1"/>
      </span>
      <template slot="action" slot-scope="item">
        <a href="javascript:;" @click="changeItem(item)" v-if="item.is_finished === 1 && dateFlag !== item.hash_id">修改时间</a>
        <a href="javascript:;" @click="unChangeItem(item)" v-if="item.is_finished === 1 && dateFlag === item.hash_id">取消修改</a>
        <a-popconfirm title="是否已完成打款?" @confirm="onConfirm(item)" okText="确定" cancelText="取消" v-if="item.is_finished !== 1">
          <a href="javascript:;">确认打款</a>
        </a-popconfirm>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>

<script>
const columns = [
  {title: '企业名称', dataIndex: 'companyName', key: 'companyName'},
  {title: '联系人(手机号)', key: 'user', dataIndex: 'user', scopedSlots: { customRender: 'user' }, align: 'center', width: 150},
  {title: '提现户名', dataIndex: 'card_username', key: 'card_username', align: 'center', width: 100},
  {title: '提现账户', dataIndex: 'card_no', key: 'card_no', align: 'center', width: 100},
  {title: '银行', dataIndex: 'bankName', key: 'bankName', align: 'center', width: 120},
  {title: '金额', dataIndex: 'withdrawal_amount', key: 'withdrawal_amount', scopedSlots: { customRender: 'withdrawal_amount' }, align: 'center', width: 100},
  {title: '申请状态', dataIndex: 'is_finished', key: 'is_finished', scopedSlots: { customRender: 'is_finished' }, align: 'center', width: 100},
  {title: '申请时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 160},
  {title: '打款时间', key: 'done_at', dataIndex: 'done_at', scopedSlots: { customRender: 'done_at' }, align: 'center', width: 230},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 100}
]

export default {
  name: 'orderList',
  data () {
    return {
      data: [],
      columns,
      loading: false,
      currentItem: {},
      done_at: null,
      dateFlag: false,
      pagination: {
        type: '订单',
        total: 0, // 总条数
        current_page: 1,
        hideSize: true
      },
      filters: {
        search_content: '',
        is_finished: '-1',
        submit_start_time: null,
        submit_end_time: null,
        finished_start_time: null,
        finished_end_time: null
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    upDate (v) {
      this.$api.dealCash.change({
        hash_id: this.currentItem.hash_id,
        finished_time: parseInt(new Date(v._d).getTime() / 1000)
      }).then(res => {
        this.done_at = null
        this.currentItem = {}
        this.getList()
      })
    },
    unChangeItem (item) {
      this.dateFlag = ''
      this.currentItem = {}
    },
    changeItem (item) {
      this.dateFlag = item.hash_id
      this.currentItem = item
    },
    onConfirm (item) {
      this.$api.dealCash.confirm({
        hash_id: item.hash_id
      }).then(res => {
        this.getList()
      })
    },
    setLoading (loading) {
      this.loading = loading
    },
    onSearch (filters) {
      this.filters = filters
      this.getList(1)
    },
    reviewItem (item) {
      this.$router.push({
        path: '/order/order/detail',
        query: {
          order: item.hash_id
        }
      })
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      let filters = JSON.parse(JSON.stringify(this.filters))
      filters.submit_start_time = filters.submit_start_time ? (parseInt(new Date(filters.submit_start_time).getTime() / 1000) + 86400) : ''
      filters.submit_end_time = filters.submit_end_time ? parseInt(new Date(filters.submit_end_time).getTime() / 1000) : ''
      filters.finished_start_time = filters.finished_start_time ? parseInt(new Date(filters.finished_start_time).getTime() / 1000) : ''
      filters.finished_end_time = filters.finished_end_time ? (parseInt(new Date(filters.finished_end_time).getTime() / 1000) + 86400) : ''
      this.$api.dealCash.list({
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
