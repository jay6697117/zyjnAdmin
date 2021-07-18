<template>
  <div class="productList">
    <a-row class="productInfo">
      <a-col :sm="9" :xs="12">
        <h2>{{info.name}}</h2>
      </a-col>
      <a-col :sm="3" :xs="12">
        联系人: <strong>{{info.nickname}}</strong>
      </a-col>
      <a-col :sm="5" :xs="12">
        联系电话: <strong>{{info.mobile}}</strong>
      </a-col>
      <a-col :sm="5" :xs="12">
        创建时间: <strong>{{info.created_at | timeFormat('yyyy-MM-dd')}}</strong>
      </a-col>
      <a-col :sm="2" :xs="12">
        产品数: <strong>{{info.buy_product_number}}</strong>
      </a-col>
    </a-row>
    <a-row class="selectTop">
      <a-col :span="6" style="padding-top:4px;">
        <a-button @click="openStudent">绑定产品</a-button>
      </a-col>
      <a-col :span="18" align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="产品名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false" @change="handleTableChange">
      <template slot="productName" slot-scope="td, tr">
        <a :href="tr.previewUrl" target="_blank"><img :src="tr.productCover" class="product">{{tr.productName}}</a>
      </template>
      <template slot="status" slot-scope="text">
        <a-badge status="success" text="正常" v-if="text"/>
        <a-badge status="error" text="停用" v-else/>
      </template>
      <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
      <span slot="end_time" slot-scope="td, tr">
        <edit-time-cell :text="td" @change="onCellChange(tr.hash_id, 'name', $event)"/>
      </span>
      <template slot="action" slot-scope="item">
        <a-popconfirm title="确定移除该产品?" @confirm="deleteThis(item)" okText="确定" cancelText="取消">
          <a-button type="dashed" icon="delete">移除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <i-choose :params="params" @ok="imported" @cancel="onhandleCancel" :objectId="id" type="bindProduct"/>
  </div>
</template>

<script>
import EditTimeCell from '@/pages/components/EditTimeCell'
const columns = [
  { title: '产品名称', dataIndex: 'productName', key: 'productName', scopedSlots: { customRender: 'productName' } },
  { title: '包含讲数', dataIndex: 'lesson_total', key: 'lesson_total', width: 120 },
  { title: '绑定时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 110, sorter: true },
  { title: '到期时间', key: 'end_time', dataIndex: 'end_time', scopedSlots: { customRender: 'end_time' }, align: 'center', width: 280, sorter: true },
  { title: '产品状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }, width: 100 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 80, align: 'center' }
]
export default {
  name: 'bindProduct',
  data () {
    return {
      data: [],
      loading: false,
      columns,
      info: {},
      pagination: {
        type: '产品',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: ''
      },
      params: {
        type: 'courseProduct', // 请求方法的路径
        name: '产品', // 名称
        show: false, // 展示
        tableKey: 'hash_id', // 表格的key
        selectionType: 'checkbox', // 多选 'checkbox'
        haveCreateButton: false, // 新建按钮
        filters: { // 筛选条件 无=={}
          search_content: ''
        },
        selectedRowKeys: [], // 列表中的已选项 无==[]
        columns: [
          { title: '产品列表', dataIndex: 'previewUrl', scopedSlots: { customRender: 'previewUrl' } }
        ]
      }
    }
  },
  components: {
    EditTimeCell
  },
  computed: {
    id () {
      return this.$route.query.id
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
    onCellChange (key, dataIndex, value) {
      this.$api.org.setEnd({
        hash_record_id: key,
        end_time: value
      }).then(res => {
        this.getList()
      })
    },
    handleTableChange (pagination, filters, sorter) {
      console.log(sorter)
      if (sorter.order) {
        let order = sorter.order === 'descend' ? 'desc' : 'asc'
        this.getList(this.pagination.current_page, this.$store.state.pageSize, sorter.field, order)
      } else {
        this.getList(this.pagination.current_page, this.$store.state.pageSize)
      }
    },
    getInfo () {
      this.$api.org.getInfo({hash_org_id: this.id}).then(res => {
        if (!res.code) {
          this.info = res.data
        }
      })
    },
    getProduct () {
      this.$api.org.getProduct({
        hash_org_id: this.id
      }).then(res => {
        if (!res.code) {
          this.params.selectedRowKeys = res.data
        }
      })
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize, colum, direction) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.org.productList({
        hash_org_id: this.id,
        current_page,
        per_page,
        order_by_column: colum,
        order_by_direction: direction,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.data = res.data.list
          this.pagination.total = res.data.info.total
          this.getProduct()
        } else {
          this.data = []
          this.pagination.total = 0
        }
        this.getInfo()
        this.loading = false
      })
    },
    deleteThis (item) {
      this.$api.org.removeProduct({
        hash_record_id: item.hash_id
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('产品删除成功')
          this.getList()
        }
      })
    },
    openStudent () {
      this.params.show = true
    },
    onhandleCancel (e) {
      this.params.show = false
    },
    imported (keys) {
      this.$api.org.bind({
        hash_org_id: this.id,
        hash_product_ids: keys
      }).then(res => {
        this.params.show = false
        if (res.code === 0) {
          this.getList(1)
        }
      })
    }
  }
}
</script>

<style scope>
  .selectTop{background: rgb(238, 234, 234);padding: 10px 15px;}
  .product{width: 100px;height: 75px;vertical-align: middle;margin-right: 5px;}
  .productInfo{padding: 24px;}
  .productInfo h2{font-size: 24px;}
  .productInfo strong{font-size: 16px;}
</style>
