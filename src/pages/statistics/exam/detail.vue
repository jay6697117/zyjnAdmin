 <template>
  <div>
    <a-row>
      <a-col align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="考试名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="tableData" rowKey="hash_lesson_id" :loading="loading" :pagination="false">
      <template slot="exam_pass_state" slot-scope="td">
        <a-badge status="error" text="未通过" v-if="td === 'not_pass'"/>
        <a-badge status="default" text="未参加" v-if="td === 'not_join'"/>
        <a-badge status="success" text="已通过" v-if="td === 'passed'"/>
      </template>
      <template slot="submit_time" slot-scope="td">
        {{ td | timeFormat("yyyy-MM-dd hh:mm:ss") }}
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columns = [
  { title: '学员姓名', dataIndex: 'nickname', key: 'nickname', align: 'center', width: 100 },
  { title: '考试得分', key: 'score', dataIndex: 'score', align: 'center', width: 110, sorter: true },
  { title: '考试结果', dataIndex: 'exam_pass_state', key: 'exam_pass_state', scopedSlots: { customRender: 'exam_pass_state' }, align: 'center', width: 100 },
  { title: '提交时间', dataIndex: 'submit_time', key: 'submit_time', scopedSlots: { customRender: 'submit_time' }, align: 'center', width: 100 }
]
export default {
  name: 'examDetailData',
  data () {
    return {
      loading: false,
      columns,
      pagination: {
        type: '考试',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        exam_pass_state: '',
        search_content: ''
      },
      tableData: []
    }
  },
  mounted () {
    this.getList()
  },
  computed: {
    id () {
      return this.$route.query.id
    }
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
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize, column, direction) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.examData.detail({
        hash_exam_id: this.id,
        current_page,
        per_page,
        order_by_column: column,
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
    getDetail (current_page = this.pages.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pages.current_page = current_page
      this.loadingModal = true
      this.$api.course.lessonDetail({
        hash_resource_id: this.id,
        hash_id: this.modalData.hash_lesson_id,
        current_page,
        per_page,
        ...this.filtersModal
      }).then(res => {
        if (res.data.list) {
          this.modalData.userInfo = res.data.list
          this.pages.total = res.data.info.total
        } else {
          this.modalData.userInfo = []
          this.pages.total = 0
        }
        this.loadingModal = false
      })
    }
  }
}
</script>
<style scope></style>
