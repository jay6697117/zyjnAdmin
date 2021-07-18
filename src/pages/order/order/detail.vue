<template>
  <div class="orderDetail">
    <h2>订单信息</h2>
    <a-row>
      <a-col :span="8">订单编号: {{orderInfo.order_no}}</a-col>
      <a-col :span="8">支付方式: {{orderInfo.pay_type}}</a-col>
      <a-col :span="8">订单状态: {{orderInfo.status}}</a-col>
      <a-col :span="8">下单时间: {{orderInfo.created_at | timeFormat('yyyy-MM-dd')}}</a-col>
      <a-col :span="8">支付时间: {{orderInfo.pay_success_time | timeFormat('yyyy-MM-dd')}}</a-col>
      <a-col :span="8">付款人户名: {{orderInfo.payer || '--'}}</a-col>
      <a-col :span="8">开户行: {{orderInfo.bank || '--'}}</a-col>
      <a-col :span="8">付款人账号: {{orderInfo.payer_account || '--'}}</a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="orderData" rowKey="hash_id" :pagination="false">
      <div class="customTd" slot="customTd" slot-scope="customTd, customTr">
        <img :src="customTr.courseCoverUrl"/>
        <div class="description">
          <p>{{customTr.courseName}}</p>
        </div>
      </div>
      <span slot="uniform_price" slot-scope="td">
        ￥{{(td / 100).toFixed(2)}}
      </span>
      <span slot="pay_amount" slot-scope="td">
        ￥{{(td / 100).toFixed(2)}}
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {title: '课程名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'customTd' }},
  {title: '单价', dataIndex: 'uniform_price', key: 'uniform_price', scopedSlots: { customRender: 'uniform_price' }, align: 'center', width: 100},
  {title: '订购模式', dataIndex: 'buyout', key: 'buyout', align: 'center', width: 120},
  {title: '数量', dataIndex: 'pay_number', key: 'pay_number', align: 'center', width: 100},
  {title: '有效期', dataIndex: 'term', key: 'term', align: 'center', width: 100},
  {title: '价格', dataIndex: 'pay_amount', key: 'pay_amount', scopedSlots: { customRender: 'pay_amount' }, align: 'center', width: 100}
]
export default {
  name: 'orderDetail',
  data () {
    return {
      columns,
      orderInfo: {},
      orderData: [],
      order_id: this.$route.query.order
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      this.$api.order.detail({hash_order_id: this.order_id}).then(res => {
        let types = ['--', '微信支付', '支付宝', '线下汇款']
        let status = ['待支付', '支付成功', '已取消', '', '支付失败', '审批中']
        let data = res.data
        data.pay_type = types[data.pay_type]
        data.status = status[data.status]
        data.term = data.term || '一年'
        if (data.buyout) {
          data.number = '--'
          data.buyout = '企业买断'
        } else {
          data.buyout = '按人数购买'
        }
        this.orderInfo = data
        this.orderData = [data]
      })
    }
  }
}
</script>
<style lang="less">
  .orderDetail{
    h2 { margin-bottom: 12px; padding-left: 18px;}
    .ant-col {margin: 6px 0; padding-left: 18px;}
  }
</style>
