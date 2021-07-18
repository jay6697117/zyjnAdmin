 <template>
  <div>
    <a-row>
      <a-col align="right">
        <i-filter :filters="filters" @search="onSearch"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columnsCourse" :dataSource="tableData" rowKey="user_id" :loading="loading" :pagination="false">
      <template slot="username" slot-scope="td">
        {{td ? td : '--'}}
      </template>
      <template slot="first_learn_time" slot-scope="td">
        {{td | timeFormat('yyyy-MM-dd')}}
      </template>
      <template slot="last_learned_time" slot-scope="td">
        {{td | timeFormat('yyyy-MM-dd')}}
      </template>
      <template slot="learning_duration" slot-scope="td">
        {{td | durationFormat('秒')}}
      </template>
      <span slot="action" slot-scope="action">
        <a href="javascript:;" @click="toInfo(action)">查看详情</a>
      </span>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columnsCourse = [
  { title: '学员ID', dataIndex: 'user_id', key: 'user_id', width: 100 },
  { title: '学员姓名', dataIndex: 'username', key: 'username', scopedSlots: { customRender: 'username' } },
  { title: '首次学习时间', dataIndex: 'first_learn_time', key: 'first_learn_time', scopedSlots: { customRender: 'first_learn_time' }, align: 'center', width: 120 },
  { title: '最近学习时间', dataIndex: 'last_learned_time', key: 'last_learned_time', scopedSlots: { customRender: 'last_learned_time' }, align: 'center', width: 120 },
  { title: '累计学习时长', dataIndex: 'learning_duration', key: 'learning_duration', scopedSlots: { customRender: 'learning_duration' }, align: 'center', width: 120 },
  { title: '加入课程数', dataIndex: 'signup_course_number', key: 'signup_course_number', align: 'center', width: 120 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 100 }
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
        // search_content: ''
        coop_user_id: '',
        username: ''
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
      this.$api.enterprise.users({
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
    toInfo (item) {
      this.$router.push({
        path: '/statistics/enterprise/userinfo',
        query: {
          oid: item.hash_id,
          uid: item.user_id
        }
      })
    }
  }
}
</script>
<style scope></style>
