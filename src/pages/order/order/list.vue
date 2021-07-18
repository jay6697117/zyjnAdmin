<template>
  <div class="orderList">
    <a-row>
      <a-col :span="24" align="right">
        <i-filter :filters="filters" @search="onSearch"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false">
      <div slot="customTd" slot-scope="customTd, customTr">
        <div class="customTd">
          <img :src="customTr.cover_url"/>
          <div class="description">
            <p>{{customTr.courseName}}</p>
          </div>
        </div>
      </div>
      <span slot="uniform_price" slot-scope="td">
        ￥{{(td / 100).toFixed(2)}}
      </span>
      <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
      <span slot="buyout" slot-scope="td">
        {{td === 1 ? '买断' : '按人数'}}
      </span>
      <span slot="pay_number" slot-scope="td">
        {{td === 0 ? '--' : td}}
      </span>
      <span slot="pay_amount" slot-scope="td">
        ￥{{(td / 100).toFixed(2)}}
      </span>
      <span slot="pay_type" slot-scope="td">
        <a-tag v-if="td === 1">微信支付</a-tag>
        <a-tag v-if="td === 2">支付宝</a-tag>
        <a-tag v-if="td === 3">线下汇款</a-tag>
      </span>
      <span slot="status" slot-scope="td">
        <a-badge status="processing" text="待支付" v-if="td == 0"/>
        <a-badge status="success" text="支付成功" v-if="td == 1"/>
        <a-badge status="default" text="已取消" v-if="td == 2"/>
        <a-badge status="error" text="支付失败" v-if="td == 4"/>
        <a-badge status="warning" text="审批中" v-if="td == 5"/>
      </span>
      <template slot="action" slot-scope="item">
        <span v-if="item.status === 0">
          <a href="javascript:;" @click="goOnItem(item)">继续支付</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否确定取消订单?" @confirm="cencelItem(item)" okText="确定" cancelText="取消">
            <a href="javascript:;">取消订单</a>
          </a-popconfirm>
        </span>
        <a href="javascript:;" @click="reviewItem(item)" v-else>查看订单</a>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>

<script>
const columns = [
  {title: '课程名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'customTd' }},
  {title: '单价', dataIndex: 'uniform_price', key: 'uniform_price', scopedSlots: { customRender: 'uniform_price' }, align: 'center', width: 100},
  {title: '下单时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 110},
  {title: '购买模式', dataIndex: 'buyout', key: 'buyout', scopedSlots: { customRender: 'buyout' }, align: 'center', width: 100},
  {title: '数量', dataIndex: 'pay_number', key: 'pay_number', scopedSlots: { customRender: 'pay_number' }, align: 'center', width: 100},
  {title: '实付金额', dataIndex: 'pay_amount', key: 'pay_amount', scopedSlots: { customRender: 'pay_amount' }, align: 'center', width: 100},
  {title: '订单状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }, align: 'center', width: 100},
  {title: '支付方式', dataIndex: 'pay_type', key: 'pay_type', scopedSlots: { customRender: 'pay_type' }, align: 'center', width: 100},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 180}
]

export default {
  name: 'orderList',
  data () {
    return {
      data: [],
      columns,
      loading: false,
      pagination: {
        type: '订单',
        total: 0, // 总条数
        current_page: 1,
        hideSize: true
      },
      filters: {
        order_status: '',
        start_time: null,
        end_time: null,
        order_no: '',
        pay_type: ''
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
    reviewItem (item) {
      this.$router.push({
        path: '/order/order/detail',
        query: {
          order: item.hash_id
        }
      })
    },
    goOnItem (item) {
      this.$router.push({
        path: '/mall/order',
        query: {
          order: item.hash_id
        }
      })
    },
    cencelItem (item) {
      this.$api.order.cencel({
        hash_order_id: item.hash_id
      }).then(res => {
        this.$message.success('订单取消成功')
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
      this.$api.order.list({
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
