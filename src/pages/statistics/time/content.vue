 <template>
  <div>
    <a-row class="planFiltersBox">
      <a-col :sm="6" :xs="24" class="userInfo">
        学员：<strong>{{userInfo.nickname}}</strong>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="listColumns" :dataSource="tableData" rowKey="hash_id" :loading="loading" :pagination="false" @change="handleTableChange">
      <template slot="learned_duration" slot-scope="td">
        {{ td | durationFormat('秒') }}
      </template>
      <template slot="created_at_day" slot-scope="td">
        {{ td | timeFormat("yyyy-MM-dd hh:mm") }}
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'studentDataContent',
  data () {
    return {
      loading: false,
      userInfo: {},
      pagination: {
        type: '课程',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        date_type: '',
        search_content: '',
        start_time: this.moment(new Date(this.$route.query.searchTime * 1000).toLocaleDateString()) || null,
        end_time: this.moment(new Date(this.$route.query.searchTime * 1000).toLocaleDateString()) || null
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
  props: ['type', 'listColumns'],
  methods: {
    moment,
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
      let filters = JSON.parse(JSON.stringify(this.filters))
      filters.start_time = filters.start_time ? parseInt(new Date(filters.start_time).getTime() / 1000) : ''
      filters.end_time = filters.end_time ? (parseInt(new Date(filters.end_time).getTime() / 1000) + 86400) : ''
      this.$api.timeData.detail({
        hash_user_id: this.id,
        current_page,
        per_page,
        mediaType: this.type,
        order_by_column: column,
        order_by_direction: direction,
        ...filters
      }).then(res => {
        if (res.data.list) {
          this.tableData = res.data.list.map((item, index) => {
            item.index = index
            return item
          })
          this.userInfo = res.data.info
          this.pagination.total = res.data.info.total
        } else {
          this.tableData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scope>
  .planFiltersBox{background: #f0f0f0;padding: 8px 16px;}
  .userInfo{line-height: 40px;}
</style>
