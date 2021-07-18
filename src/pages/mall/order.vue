<template>
  <div class="orderDetail">
    <a-row style="margin-bottom:48px">
      <a-col :span="24">
        <a-steps :current="step">
          <a-step title="选择课程"></a-step>
          <a-step title="确认订单信息" />
          <a-step title="确定付款" />
          <a-step title="完成订购" />
        </a-steps>
      </a-col>
    </a-row>
    <a-row v-if="step === 1">
      <a-col :span="24" style="margin-top:24px">
        订购企业: {{organizationName}}
      </a-col>
      <a-col :span="24">
        <a-table :columns="columns" :dataSource="comfirmData" rowKey="hash_id" :pagination="false">
          <div class="customTd" slot="customTd" slot-scope="customTd, customTr">
            <img :src="customTr.cover_url"/>
            <div class="description">
              <p>{{customTr.title}}</p>
            </div>
          </div>
        </a-table>
      </a-col>
      <a-col :span="24" align="right">
        应付款 <span style="color:red">{{price}}</span>
      </a-col>
      <a-col :span="24" align="right">
        <a-button type="primary" @click="createOrder" style="width:100px">提交订单</a-button>
      </a-col>
    </a-row>
    <a-row v-if="step === 2" class="payBox">
      <a-col :span="24">
        <p><strong>请及时付款，以便订单尽快处理！</strong></p>
        <p>请您在24小时内完成支付，否则订单会被自动取消</p>
        <a-divider />
      </a-col>
      <a-col :span="24">
        <p>订购企业：{{orderInfo.organizationName}}</p>
        <p>应付金额：<span style="color:red"> ￥ {{(orderInfo.pay_amount / 100).toFixed(2)}}</span></p>
      </a-col>
      <a-col :span="24" class="payType">
        <a-radio-group v-model="payType" buttonStyle="solid">
          <a-radio-button :value="1"><a-icon type="wechat" /> 微信支付</a-radio-button>
          <a-radio-button :value="0"><a-icon type="credit-card" /> 线下转账</a-radio-button>
        </a-radio-group>
      </a-col>
      <a-col :span="24" v-if="payType === 1">
        <a-row>
          <a-col v-html="wxCode" :span="6"></a-col>
          <a-col :span="18">
            <p>请使用微信扫码，支付成功后自动开通服务</p>
            <a-button type="primary" style="width: 120px" @click="getOrder(null, 1)">我已完成支付</a-button>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24" v-if="payType === 0">
        <p>您需要转账 <span style="color:red;font-size:24px">{{(orderInfo.pay_amount / 100).toFixed(2)}} 元</span> 至以下帐户，转账成功后填写相应信息并提交审批</p>
        <p>收款户名<span style="margin-left:22px">{{orderInfo.remittance_voucher_obj}}</span></p>
        <p>收款银行<span style="margin-left:22px">{{orderInfo.remittance_voucher_bank_name}}</span></p>
        <p>银行账号<span style="margin-left:22px">{{orderInfo.remittance_voucher_bank_account}}</span></p>
        <a-button type="primary" style="width: 200px" @click="visibleModal = true">已转账回款，提交汇款凭证</a-button>
      </a-col>
    </a-row>
    <a-row v-if="step === 3">
      <a-col align="center">
        <a-result :status="resultInfo.success" :title="resultInfo.title" :subTitle="resultInfo.subTitle">
          <template v-slot:extra>
            <router-link to="/content/purchase/list" v-if="resultInfo.status === 'success'">
              <a-button type="primary" key="console">课程管理</a-button>
            </router-link>
            <router-link to="/mall/index">
              <a-button key="back">完成</a-button>
            </router-link>
          </template>
        </a-result>
      </a-col>
    </a-row>
    <a-modal title="提交汇款凭证" v-model="visibleModal" @ok="handleOk" :confirmLoading="confirmLoading">
      <span>付款方信息</span>
      <a-form :form="remitForm">
        <a-form-item label="付款人户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入付款人户名"
            v-decorator="['payer', { rules: [{ required: true, message: `请输入付款人户名!` }] }]"/>
        </a-form-item>
        <a-form-item label="开户行" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入开户行"
            v-decorator="['bank', { rules: [{ required: true, message: `请输入开户行!` }] }]"/>
        </a-form-item>
        <a-form-item label="付款人账号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入付款人账号"
            v-decorator="['payer_account', { rules: [{ required: true, message: `请输入付款人账号!` }] }]"/>
        </a-form-item>
        <a-form-item label="转账日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-date-picker showTime placeholder="请输入转账日期" style="width: 100%"
            v-decorator="['transfer_date', { rules: [{ required: true, message: `请输入转账日期!` }] }]"/>
        </a-form-item>
      </a-form>
      <a-row>
        <a-col :span="5" align="right">应付金额：</a-col>
        <a-col :span="12">{{(orderInfo.pay_amount / 100).toFixed(2)}} 元</a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {title: '课程名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'customTd' }},
  {title: '单价', dataIndex: 'uniform_price', key: 'uniform_price', align: 'center', width: 100},
  {title: '订购模式', dataIndex: 'buyout', key: 'buyout', align: 'center', width: 100},
  {title: '数量', dataIndex: 'number', key: 'number', align: 'center', width: 100},
  {title: '有效期', dataIndex: 'term', key: 'term', align: 'center', width: 100},
  {title: '价格', dataIndex: 'price', key: 'price', align: 'center', width: 100}
]
export default {
  name: 'orderPay',
  data () {
    return {
      visibleModal: false,
      confirmLoading: false,
      columns,
      wxCode: '',
      payType: 1,
      step: 1,
      organizationName: '',
      orderFilter: this.$store.state.mallOrder,
      orderResult: {},
      comfirmData: [],
      price: '',
      order_id: this.$route.query.order,
      orderInfo: {},
      resultInfo: {},
      remitForm: this.$form.createForm(this, {name: 'remitForm'})
    }
  },
  watch: {
    '$route.query.order': function (val) {
      this.order_id = val
      this.getOrder()
      this.getWxCode()
    }
  },
  mounted () {
    if (this.order_id) {
      this.getOrder()
      this.getWxCode()
    } else {
      this.confirmInfo()
    }
  },
  methods: {
    handleOk () {
      this.remitForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.confirmLoading = true
          values.hash_order_id = this.order_id
          values.transfer_date = parseInt(new Date(values.transfer_date) / 1000)
          this.$api.mall.commit(values).then(res => {
            this.getOrder()
          })
        }
      })
    },
    getWxCode () {
      this.$api.mall.getWxCode({hash_order_id: this.order_id}).then(res => {
        this.wxCode = res.data
      })
    },
    getOrder (orderId, op) {
      this.$api.mall.getOrder({hash_order_id: orderId || this.order_id}).then(res => {
        this.visibleModal = false
        this.confirmLoading = false
        switch (res.data.status) {
          case 0: // 待支付
            if (op === 1) {
              this.$message.info('订单处理中，请稍后重试', 3)
            }
            this.step = 2
            break
          case 1: // 支付成功
            this.resultInfo = {
              status: 'success',
              title: '恭喜你，购买成功',
              subTitle: '进入课程编辑页面，通过课程分配设置，对课程名额进行分配。'
            }
            this.step = 3
            break
          case 2: // 已取消
            this.resultInfo = {
              status: 'Warning',
              title: '订单已失效',
              subTitle: '请前往课程商城重新订购。'
            }
            this.step = 3
            break
          case 4: // 支付失败
            this.resultInfo = {
              status: 'Warning ',
              title: '支付失败',
              subTitle: '未完成课程采购，请查看订单并重新支付。',
              link: '/mall/index'
            }
            this.step = 3
            break
          case 5: // 待审批
            this.resultInfo = {
              status: 'info',
              title: '提交成功',
              subTitle: '您的转账汇款凭证提交成功！确认收款后您订购的服务在1个工作日开通。'
            }
            this.step = 3
            break
        }
        this.orderInfo = res.data
      })
    },
    createOrder () {
      this.$api.mall.add(this.orderFilter).then(res => {
        if (res.data.buySuccess) {
          this.getOrder(res.data.hash_order_id)
        } else {
          this.$router.push({
            path: '/mall/order',
            query: {
              order: res.data.hash_order_id
            }
          })
        }
      })
    },
    confirmInfo () {
      this.$api.mall.confirm(this.orderFilter).then(res => {
        let data = res.data
        this.organizationName = data.organizationName
        data.term = data.term || '一年'
        data.uniform_price = '￥ ' + (data.uniform_price / 100).toFixed(2)
        if (data.buyout) {
          data.number = '--'
          data.buyout = '企业买断'
        } else {
          data.buyout = '按人数购买'
        }
        if (data.price === 0) {
          data.buyout = '--'
          data.number = '--'
        }
        data.price = '￥ ' + (data.price / 100).toFixed(2)
        this.comfirmData = [data]
        this.price = data.price
      })
    }
  }
}
</script>

<style lang="less">
  .orderDetail{
    width: 960px;
    margin: 0 auto;
    padding-bottom: 24px;
    .ant-col{margin-bottom: 12px;}
  }
  .payBox{
    .payType{margin-bottom: 32px;}
    p{margin-bottom: 18px;}
  }
</style>
