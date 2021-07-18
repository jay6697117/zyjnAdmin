 <template>
  <div>
    <a-row>
      <a-col align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="课时名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columnsCourse" :dataSource="tableData" rowKey="hash_id" :loading="loading" :pagination="false">
      <template slot="username" slot-scope="td">
        {{td ? td : '--'}}
      </template>
      <template slot="start_time" slot-scope="td">
        {{td | timeFormat('yyyy-MM-dd')}}
      </template>
      <template slot="end_time" slot-scope="td">
        {{td | timeFormat('yyyy-MM-dd')}}
      </template>
      <template slot="learning_duration" slot-scope="td">
        {{td | durationFormat('秒')}}
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columnsCourse = [
  { title: '讲名称', dataIndex: 'lesson', key: 'lesson' },
  { title: '学员id', dataIndex: 'coop_user_id', key: 'coop_user_id', width: 120 },
  { title: '学员姓名', dataIndex: 'username', key: 'username', scopedSlots: { customRender: 'username' }, width: 120 },
  { title: '学习开始时间', dataIndex: 'start_time', key: 'start_time', scopedSlots: { customRender: 'start_time' }, align: 'center', width: 120 },
  { title: '学习结束时间', dataIndex: 'end_time', key: 'end_time', scopedSlots: { customRender: 'end_time' }, align: 'center', width: 120 },
  { title: '累计学习时长', dataIndex: 'learning_duration', key: 'learning_duration', scopedSlots: { customRender: 'learning_duration' }, align: 'center', width: 120 }
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
      this.$api.enterprise.lessons({
        current_page,
        per_page,
        hash_course_id: this.$route.query.id,
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
    toUsers (item) {
      this.$router.push({
        path: '/statistics/enterprise/users',
        query: {
          id: item.hash_id
        }
      })
    },
    toCourses (item) {
      this.$router.push({
        path: '/statistics/enterprise/courses',
        query: {
          id: item.hash_id
        }
      })
    }
  }
}
</script>
<style scope></style>
