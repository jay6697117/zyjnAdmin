<template>
  <div class="orderList">
    <a-row>
      <a-col :span="24" align="right">
        <i-filter :filters="filters" @search="onSearch"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false">
      <span slot="pay_amount" slot-scope="td">
        ￥{{(td / 100).toFixed(2)}}
      </span>
      <span slot="order_status" slot-scope="td">
        <a-badge status="processing" text="待支付" v-if="td == 0"/>
        <a-badge status="success" text="支付成功" v-if="td == 1"/>
        <a-badge status="default" text="已取消" v-if="td == 2"/>
        <a-badge status="error" text="支付失败" v-if="td == 4"/>
        <a-badge status="warning" text="审批中" v-if="td == 5"/>
      </span>
      <template slot="action" slot-scope="item">
        <a href="javascript:;" @click="reviewItem(item)">查看订单</a>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <a-modal title="查看订单详情" :visible="visible" :confirmLoading="confirmLoading" @cancel="onCancel" :footer="null" width="800px" class="orderModal">
      <h2>订单信息</h2>
      <a-row :gutter="[12, 24]">
        <a-col :span="4" align="right">
          <strong>订单编号:</strong>
        </a-col>
        <a-col :span="8">
          {{itemInfo.order_no}}
        </a-col>
        <a-col :span="4" align="right">
          <strong>下单时间:</strong>
        </a-col>
        <a-col :span="8">
          {{itemInfo.created_at | timeFormat('yyyy-MM-dd')}}
        </a-col>
        <a-col :span="4" align="right">
          <strong>课程名称:</strong>
        </a-col>
        <a-col :span="20">
          {{itemInfo.courseName}}
        </a-col>
        <a-col :span="4" align="right">
          <strong>订购方式:</strong>
        </a-col>
        <a-col :span="8">
          {{itemInfo.buyout === 1 ? '企业买断' : '按数量购买'}}
        </a-col>
        <a-col :span="4" align="right">
          <strong>订购单价:</strong>
        </a-col>
        <a-col :span="8">
          <span v-if="itemInfo.buyout === 1">--</span>
          <span v-else style="color: red">￥{{(itemInfo.uniform_price / 100).toFixed(2)}}</span>
        </a-col>
        <a-col :span="4" align="right">
          <strong>订购人数:</strong>
        </a-col>
        <a-col :span="8">
          <span v-if="itemInfo.buyout === 1">--</span>
          <span v-else>{{itemInfo.pay_number}}</span>
        </a-col>
        <a-col :span="4" align="right">
          <strong>订单金额:</strong>
        </a-col>
        <a-col :span="8">
          <span style="color: red">￥{{(itemInfo.total_amount / 100).toFixed(2)}}</span>
        </a-col>
        <a-col :span="4" align="right">
          <strong>实付金额:</strong>
        </a-col>
        <a-col :span="8">
          <span style="color: red">￥{{(itemInfo.pay_amount / 100).toFixed(2)}}</span>
        </a-col>
        <a-col :span="4" align="right">
          <strong>订单状态:</strong>
        </a-col>
        <a-col :span="8">
          <a-badge status="processing" text="待支付" v-if="itemInfo.status == 0"/>
          <a-badge status="success" text="通过" v-if="itemInfo.status == 1"/>
          <a-badge status="default" text="已取消" v-if="itemInfo.status == 2"/>
          <a-badge status="error" text="不通过" v-if="itemInfo.status == 4"/>
          <a-badge status="warning" text="审批中" v-if="itemInfo.status == 5"/>
        </a-col>
      </a-row>
      <a-divider />
      <h2>付款人信息</h2>
      <a-row :gutter="[12, 24]">
        <a-col :span="4" align="right">
          <strong>订购企业:</strong>
        </a-col>
        <a-col :span="8">
          {{itemInfo.organizationName}}
        </a-col>
        <a-col :span="4" align="right">
          <strong>付款人户名:</strong>
        </a-col>
        <a-col :span="8">
          {{itemInfo.payer}}
        </a-col>
        <a-col :span="4" align="right">
          <strong>付款人账户:</strong>
        </a-col>
        <a-col :span="8">
          {{itemInfo.payer_account}}
        </a-col>
        <a-col :span="4" align="right">
          <strong>开户行:</strong>
        </a-col>
        <a-col :span="8">
          {{itemInfo.bank}}
        </a-col>
        <a-col :span="4" align="right">
          <strong>转账日期:</strong>
        </a-col>
        <a-col :span="8">
          {{itemInfo.transfer_date | timeFormat('yyyy-MM-dd')}}
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" align="center" v-if="itemInfo.status === 5">
          <a-button type="danger" @click="unadopt">订单审批不通过</a-button>
          <a-button type="primary" @click="adopt">订单审批通过</a-button>
        </a-col>
        <a-col :span="24" align="center" v-else>
          <a-button type="default" @click="onCancel">关闭</a-button>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {title: '订购编号', dataIndex: 'order_no', key: 'order_no', width: 220},
  {title: '下单时间', key: 'created_at', dataIndex: 'created_at', align: 'center', width: 110},
  {title: '订购课程', dataIndex: 'courseName', key: 'courseName'},
  {title: '订购企业', dataIndex: 'organizationName', key: 'organizationName', align: 'center', width: 150},
  {title: '付款人', dataIndex: 'payer', key: 'payer', align: 'center', width: 120},
  {title: '付款人账户', dataIndex: 'payer_bank_card_no', key: 'payer_bank_card_no', width: 220},
  {title: '订单金额', dataIndex: 'pay_amount', key: 'pay_amount', scopedSlots: { customRender: 'pay_amount' }, align: 'center', width: 100},
  {title: '订单状态', dataIndex: 'order_status', key: 'order_status', scopedSlots: { customRender: 'order_status' }, align: 'center', width: 100},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 100}
]

export default {
  name: 'orderList',
  data () {
    return {
      data: [],
      columns,
      confirmLoading: false,
      visible: false,
      loading: false,
      itemInfo: {},
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
        course_name: '',
        org_name: ''
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    onCancel () {
      this.visible = false
    },
    unadopt () {
      this.$api.dealOrder.verify({
        hash_order_id: this.itemInfo.hash_id,
        success: 0
      }).then(res => {
        this.visible = false
        this.getList()
      })
    },
    adopt () {
      this.$api.dealOrder.verify({
        hash_order_id: this.itemInfo.hash_id,
        success: 1
      }).then(res => {
        this.visible = false
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
      this.visible = true
      this.$api.dealOrder.getInfo({
        hash_order_id: item.hash_id
      }).then(res => {
        this.itemInfo = res.data
      })
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      let filters = JSON.parse(JSON.stringify(this.filters))
      filters.start_time = filters.start_time ? parseInt(new Date(filters.start_time).getTime() / 1000) : ''
      filters.end_time = filters.end_time ? (parseInt(new Date(filters.end_time).getTime() / 1000) + 86400) : ''
      this.$api.dealOrder.list({
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

<style lang="less">
  .orderModal{
    .ant-col{padding: 12px 0;}
    .ant-btn{margin: 0 12px;}
  }
</style>
