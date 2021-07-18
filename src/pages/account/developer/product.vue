<template>
  <div class="productList">
    <a-row class="selectTop">
      <a-col :span="24" align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="产品名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false" @change="handleTableChange">
      <template slot="productName" slot-scope="td, tr">
        <img :src="tr.productCover" class="product"><a :href="tr.previewUrl" target="_blank">{{tr.productName}}</a>
      </template>
      <span slot="end_time" slot-scope="end_time">{{end_time | timeFormat('yyyy-MM-dd')}}</span>
      <template slot="action" slot-scope="item">
        <a href="javascript:;" @click="detail(item)">查看详情</a>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>

<script>
const columns = [
  { title: '产品名称', dataIndex: 'productName', key: 'productName', scopedSlots: { customRender: 'productName' } },
  { title: '学习人数', dataIndex: 'total_study_user', key: 'total_study_user', width: 120 },
  { title: '到期时间', key: 'end_time', dataIndex: 'end_time', scopedSlots: { customRender: 'end_time' }, align: 'center', width: 150, sorter: true },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 120, align: 'center' }
]
export default {
  name: 'productList',
  data () {
    return {
      data: [],
      loading: false,
      columns,
      pagination: {
        type: '产品',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: ''
      }
    }
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
    handleTableChange (pagination, filters, sorter) {
      if (sorter.order) {
        let order = sorter.order === 'descend' ? 'desc' : 'asc'
        this.getList(this.pagination.current_page, this.$store.state.pageSize, sorter.field, order)
      } else {
        this.getList(this.pagination.current_page, this.$store.state.pageSize)
      }
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize, colum, direction) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.org.productList({
        current_page,
        per_page,
        order_by_column: colum,
        order_by_direction: direction,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.data = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.data = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    detail (item) {
      this.$router.push({
        path: '/account/developer/detail',
        query: {
          id: item.hash_product_id
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
