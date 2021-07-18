 <template>
  <div>
    <a-row>
      <a-col align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="课程名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columnsCourse" :dataSource="tableData" rowKey="hash_id" :loading="loading" :pagination="false">
      <template slot="learning_duration" slot-scope="td">
        {{td | durationFormat('秒')}}
      </template>
      <span slot="action" slot-scope="action">
        <a href="javascript:;" @click="toLessons(action)">查看详情</a>
      </span>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columnsCourse = [
  { title: '课程名称', dataIndex: 'course', key: 'course' },
  { title: '包含讲数', dataIndex: 'lesson_num', key: 'lesson_num', align: 'center', width: 100 },
  { title: '学员总数', dataIndex: 'subscribeTotal', key: 'subscribeTotal', align: 'center', width: 100 },
  { title: '已学学员', dataIndex: 'learnedTotal', key: 'learnedTotal', align: 'center', width: 100 },
  { title: '累计学习时长', dataIndex: 'learning_duration', key: 'learning_duration', scopedSlots: { customRender: 'learning_duration' }, align: 'center', width: 200 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 100 }
]
export default {
  name: 'courseListData',
  data () {
    return {
      loading: false,
      columnsCourse,
      pagination: {
        type: '企业',
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
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize, column, direction) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.enterprise.courses({
        current_page,
        per_page,
        hash_org_id: this.$route.query.id,
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
    toLessons (item) {
      this.$router.push({
        path: '/statistics/enterprise/lessons',
        query: {
          id: item.hash_id
        }
      })
    }
  }
}
</script>
<style scope></style>
