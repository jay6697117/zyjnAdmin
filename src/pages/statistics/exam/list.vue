<template>
  <div>
    <a-row>
      <a-col align="right">
        <i-filter :filters="filters"  @search="onSearch" placeholder="考试名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columnsCourse" :dataSource="tableData" rowKey="hash_id" :loading="loading" :pagination="false" @change="handleTableChange">
      <template slot="studyNum" slot-scope="td, tr">
        {{tr.not_joined_num}} / {{tr.not_pass_num}} / {{tr.pass_user_num}}
      </template>
      <template slot="passed_percent" slot-scope="td">
        <span v-if="!td">--</span>
        <span v-else>{{td}}%</span>
      </template>
      <span slot="action" slot-scope="action">
        <a href="javascript:;" @click="toDetails(action)">查看详情</a>
      </span>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columnsCourse = [
  { title: '专项考试名称', dataIndex: 'title', key: 'title' },
  { title: '报名总人数', dataIndex: 'subscribeTotal', key: 'subscribeTotal', align: 'center', width: 130 },
  { title: '未参加/未通过/通过', key: 'studyNum', dataIndex: 'studyNum', scopedSlots: { customRender: 'studyNum' }, align: 'center', width: 160 },
  { title: '通过率', dataIndex: 'passed_percent', key: 'passed_percent', scopedSlots: { customRender: 'passed_percent' }, sorter: true, align: 'center', width: 100 },
  { title: '满分', dataIndex: 'totalScore', key: 'totalScore', align: 'center', width: 110 },
  { title: '及格分', dataIndex: 'passScore', key: 'passScore', align: 'center', width: 110 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 100 }
]
export default {
  name: 'planListData',
  data () {
    return {
      loading: false,
      columnsCourse,
      pagination: {
        type: '考试',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: ''
      },
      tableData: []
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
      this.$api.examData.list({
        current_page,
        per_page,
        order_by_column: colum,
        order_by_direction: direction,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.tableData = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.tableData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    toDetails (item) {
      this.$router.push({
        path: '/statistics/exam/detail',
        query: {
          id: item.hash_id
        }
      })
    }
  }
}
</script>
<style scope></style>
