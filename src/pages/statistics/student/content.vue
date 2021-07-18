 <template>
  <div>
    <a-row class="planFiltersBox">
      <a-col :span="12" class="userInfo">
        学员：<strong>{{userInfo.nickname}}</strong>
      </a-col>
      <a-col :span="12" align="right">
        <i-filter :filters="filters"  @search="onSearch" placeholder="名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="listColumns" :dataSource="tableData" rowKey="hash_resource_id" :loading="loading" :pagination="false" @change="handleTableChange">
      <template slot="studyNum" slot-scope="td, tr">
        {{tr.learned_item_num}} / {{tr.total}}
      </template>
      <template slot="examNum" slot-scope="td, tr">
        {{tr.exam_submit_num}} / {{tr.exam_total}}
      </template>
      <template slot="learned_percent" slot-scope="td">
        {{ td }}%
      </template>
      <template slot="isPurchaseCourse" slot-scope="td">
        <span v-if="td">采购课</span>
        <span v-else>内部课</span>
      </template>
      <template slot="learning_duration" slot-scope="td">
        {{ td | durationFormat('秒') }}
      </template>
      <template slot="created_at" slot-scope="td">
        {{ td | timeFormat("yyyy-MM-dd hh:mm") }}
      </template>
      <template slot="end_time" slot-scope="td">
        {{ td | timeFormat("yyyy-MM-dd hh:mm") }}
      </template>
      <span slot="action" slot-scope="action">
        <a href="javascript:;" @click="review(action)">查看详情</a>
      </span>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <student-detail :detail="detail" @cancel="closeDetail" :key="index" />
  </div>
</template>
<script>
import studentDetail from '../../components/content/studentDetail'
var studyColumns = [
  { title: '计划详情', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
  { title: '完成度', dataIndex: 'learned_percent', key: 'learned_percent', width: 100, align: 'center' },
  { title: '学习时长', dataIndex: 'learning_duration', key: 'learning_duration', width: 140, align: 'center' }
]
var examColumns = [
  { title: '考试名称', dataIndex: 'name', key: 'name' },
  { title: '考试得分', dataIndex: 'score', key: 'score', width: 100, align: 'center' },
  { title: '是否通过', dataIndex: 'is_passed', key: 'is_passed', width: 100, align: 'center' }
]
export default {
  name: 'studentDataContent',
  data () {
    return {
      index: 0,
      studyColumns,
      examColumns,
      loading: false,
      pagination: {
        type: '课程',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: ''
      },
      tableData: [],
      userInfo: {},
      detail: {
        show: false,
        name: '学习',
        type: 'plan',
        data: {}
      }
    }
  },
  components: {
    studentDetail
  },
  mounted () {
    this.getList()
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  props: ['type', 'listColumns'],
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
      this.$api.studentData.detail({
        hash_user_id: this.id,
        current_page,
        per_page,
        mediaType: this.type,
        order_by_column: column,
        order_by_direction: direction,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.tableData = res.data.list
          this.userInfo = res.data.info
          this.pagination.total = res.data.info.total
        } else {
          this.tableData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    review (item) {
      this.index++
      this.$api.studentData[this.type + 'Detail']({
        hash_id: item.hash_resource_id,
        hash_user_id: item.hash_user_id
      }).then(res => {
        this.detail.show = true
        this.detail.speed = item.learned_percent
        this.detail.data = res.data
      })
    },
    closeDetail () {
      this.detail.show = false
    }
  }
}
</script>
<style scope>
  .planFiltersBox{background: #f0f0f0;padding: 8px 16px;}
  .planTitle{line-height: 40px;}
</style>
