 <template>
  <div>
    <a-row class="planFiltersBox">
      <a-col :span="12" class="planTitle">
        培训计划：<strong>{{planTitle}}</strong>
      </a-col>
      <a-col :span="12" align="right">
        <i-filter :filters="filters"  @search="onSearch" placeholder="计划名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="listColumns" :dataSource="tableData" :rowKey="rowKey" :loading="loading" :pagination="false">
      <template slot="studyNum" slot-scope="td, tr">
        {{tr.not_learned_num}} / {{tr.learning_num}} / {{tr.complete_num}}
      </template>
      <template slot="testNum" slot-scope="td, tr">
        {{tr.not_learned_num}} / {{tr.not_pass_num}} / {{tr.passed_num}}
      </template>
      <template slot="complete_precent" slot-scope="td, tr">
        {{ tr.complete_precent }}%
      </template>
      <template slot="duration" slot-scope="td">
        {{ td | durationFormat('秒') }}
      </template>
      <span slot="action" slot-scope="action">
        <a href="javascript:;" @click="toDetails(action)">查看详情</a>
      </span>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <a-modal title="详情" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel" :footer="null" width="800px">
      <div class="courseModal">
        <p v-if="type==='course'">【{{types[modalData.mediaType]}}】{{modalData.lesson_name}}</p>
        <p v-if="type==='exam'">【考试】{{modalData.paper_name}}</p>
        <a-row>
          <a-col align="right">
            <i-filter :filters="filtersModal" @search="onModalSearch" placeholder="学员姓名"></i-filter>
          </a-col>
        </a-row>
        <a-table :columns="detailColumns" :dataSource="modalData.userInfo" :loading="loadingModal" rowKey="hash_id" :pagination="false">
          <!-- <template slot="is_complete" slot-scope="td">
            <span v-if="td == '1'">是</span>
            <span v-if="td == '0'">否</span>
          </template> -->
          <template slot="learn_state" slot-scope="td">
            <span v-if="td == 1">未学</span>
            <span v-if="td == 2">在学</span>
            <span v-if="td == 3">完成</span>
          </template>
          <template slot="exam_pass_state" slot-scope="td">
            <a-badge status="error" text="未通过" v-if="td === 'not_pass'"/>
            <a-badge status="default" text="未参加" v-if="td === 'not_join'"/>
            <a-badge status="success" text="已通过" v-if="td === 'passed'"/>
          </template>
          <template slot="duration" slot-scope="td">
            {{ td | durationFormat('秒') }}
          </template>
        </a-table>
        <i-pagination :pagination="pages" @change="getDetail" />
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'courseDetailData',
  data () {
    return {
      rowKey: '',
      planTitle: '',
      types: {
        video: '视频',
        audio: '音频'
      },
      visible: false,
      confirmLoading: false,
      loading: false,
      loadingModal: false,
      pagination: {
        type: '计划',
        total: 0, // 总条数
        current_page: 1
      },
      pages: {
        type: '计划',
        total: 0, // 总条数
        current_page: 1,
        hideSize: true
      },
      filters: {
        search_content: ''
      },
      filtersModal: {
        search_content: '',
        learn_state: ''
      },
      tableData: [],
      modalData: {}
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
  props: ['type', 'listColumns', 'detailColumns'],
  methods: {
    onModalSearch (filters) {
      this.filtersModal = filters
      this.getDetail(1)
    },
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
      this.rowKey = this.type === 'course' ? 'hash_lesson_id' : 'hash_paper_id'
      this.$api.planData[this.type + 'List']({
        hash_resource_id: this.id,
        current_page,
        per_page,
        order_by_column: column,
        order_by_direction: direction,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.tableData = res.data.list
          this.planTitle = res.data.info.title
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
      this.$api.planData[this.type + 'Detail']({
        hash_resource_id: this.id,
        hash_paper_id: this.modalData.hash_paper_id,
        hash_lesson_id: this.modalData.hash_lesson_id,
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
    },
    toDetails (item) {
      this.visible = true
      this.modalData = item
      this.getDetail()
    },
    handleCancel (e) {
      this.visible = false
    }
  }
}
</script>
<style scope>
  .planFiltersBox{background: #f0f0f0;padding: 8px 16px;}
  .planTitle{line-height: 40px;}
</style>
