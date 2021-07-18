 <template>
  <div>
    <a-row>
      <a-col :sm="3" :xs="24">
        学员id: <strong>{{user.coop_user_id}}</strong>
      </a-col>
      <a-col :sm="3" :xs="24">
        学员姓名: <strong>{{user.username}}</strong>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" @search="onSearch"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columnsCourse" :dataSource="tableData" rowKey="index" :loading="loading" :pagination="false">
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
  { title: '课程名称', dataIndex: 'course', key: 'course' },
  { title: '讲名称', dataIndex: 'lesson', key: 'lesson' },
  { title: '学习开始时间', dataIndex: 'start_time', key: 'start_time', scopedSlots: { customRender: 'start_time' }, align: 'center', width: 120 },
  { title: '学习结束时间', dataIndex: 'end_time', key: 'end_time', scopedSlots: { customRender: 'end_time' }, align: 'center', width: 120 },
  { title: '累计学习时长', dataIndex: 'learning_duration', key: 'learning_duration', scopedSlots: { customRender: 'learning_duration' }, align: 'center', width: 120 }
]
export default {
  name: 'userListData',
  data () {
    return {
      loading: false,
      columnsCourse,
      pagination: {
        type: '学员',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        course_name: ''
      },
      tableData: [],
      user: {}
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
      this.$api.enterprise.userinfo({
        current_page,
        per_page,
        hash_org_id: this.$route.query.oid,
        coop_user_id: this.$route.query.uid,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.tableData = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.tableData = []
          this.pagination.total = 0
        }
        this.user = res.data.user
        this.loading = false
      })
    }
  }
}
</script>
<style scope></style>
