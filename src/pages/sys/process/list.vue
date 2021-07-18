<template>
  <div>
    <a-row>
      <a-col :sm="8" :xs="24">
        <div>
          <a-button type="primary" @click="addItem" v-if="$power(['edit'])">新建流程</a-button>
        </div>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="processData" :loading="loading" rowKey="hash_id" :pagination="false">
      <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
      <template slot="action" slot-scope="td, tr">
        <a href="javascript:;" @click="editItem(tr)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="是否确定删除?" @confirm="deleteItem(tr)" okText="确定" cancelText="取消">
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columns = [
  {title: '流程名称', dataIndex: 'title', key: 'title', align: 'left'},
  {title: '流程分类', dataIndex: 'categoryName', key: 'categoryName', align: 'center', width: 200},
  {title: '应用于', dataIndex: 'apply', key: 'apply', align: 'center', width: 200},
  {title: '创建时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 110},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 120}
]
export default {
  data () {
    return {
      name: 'processList',
      processData: [],
      columns,
      loading: false,
      pagination: {
        type: 'course',
        total: 0, // 总条数
        current_page: 1
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let listParmas = this.$store.state.listParmas
      if (listParmas.pagination.type === this.pagination.type) {
        this.onSearch(listParmas.filters, listParmas.pagination.current_page)
        this.$store.commit('initListParmas')
      } else {
        this.onSearch()
      }
    })
  },
  methods: {
    setLoading (loading) {
      this.loading = loading
    },
    onSearch (filters = this.filters, currentPage = 1) {
      this.filters = filters
      this.getList(currentPage)
    },
    getList (current_page = this.pagination.current_page, pageSize = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.audit.list({
        current_page: current_page,
        per_page: pageSize,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.processData = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.processData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    addItem () { // 点击新建
      this.$router.push({
        path: '/sys/process/edit',
        query: {
          id: ''
        }
      })
    },
    editItem (item) {
      this.$router.push({
        path: '/sys/process/edit',
        query: {
          id: item.hash_id
        }
      })
    },
    deleteItem (item) {
      this.loading = true
      this.$api.audit.remove({
        hash_id: item.hash_id
      }).then(res => {
        this.loading = false
        this.getList(1)
      })
    }
  }
}
</script>
<style scope>
  .courseList .ant-table-tbody .course_title{margin-bottom:0;line-height:24px;display:block;width:100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
</style>
