 <template>
  <div>
    <a-row>
      <a-col align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="企业名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columnsCourse" :dataSource="tableData" rowKey="hash_id" :loading="loading" :pagination="false">
      <template slot="total_study_user" slot-scope="td, tr">
        <span style="color: #1890ff;cursor:pointer;display:block;" @click="toUsers(tr)">{{td}}</span>
      </template>
      <template slot="buy_course_number" slot-scope="td, tr">
        <span style="color: #1890ff;cursor:pointer;display:block;" @click="toCourses(tr)">{{td}}</span>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columnsCourse = [
  { title: '企业名称', dataIndex: 'name', key: 'name' },
  { title: '购买人数', dataIndex: 'staff_upper_limit', key: 'staff_upper_limit', align: 'center', width: 200 },
  { title: '已学人数', dataIndex: 'total_study_user', key: 'total_study_user', scopedSlots: { customRender: 'total_study_user' }, align: 'center', width: 200 },
  { title: '购买课程', dataIndex: 'buy_course_number', key: 'buy_course_number', scopedSlots: { customRender: 'buy_course_number' }, align: 'center', width: 200 }
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
      this.$api.enterprise.list({
        current_page,
        per_page,
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
