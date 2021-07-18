 <template>
  <div>
    <a-row>
      <a-col align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="课程名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columnsCourse" :dataSource="tableData" rowKey="hash_lesson_id" :loading="loading" :pagination="false">
      <template slot="studyNum" slot-scope="td, tr">
        {{tr.not_learned_num}} / {{tr.learning_num}} / {{tr.complete_num}}
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
        <p>第 {{modalData.order}} 讲 【{{types[modalData.mediaType]}}】{{modalData.lesson_name}}</p>
        <a-row>
          <a-col align="right">
            <i-filter :filters="filtersModal" @search="onModalSearch" placeholder="名称"></i-filter>
          </a-col>
        </a-row>
        <a-table :columns="columnsModal" :dataSource="modalData.userInfo" :loading="loadingModal" rowKey="hash_id" :pagination="false">
          <!-- <template slot="is_complete" slot-scope="is_complete">
            <span v-if="is_complete == '1'">是</span>
            <span v-if="is_complete == '0'">否</span>
          </template> -->
          <template slot="learn_state" slot-scope="td">
            <span v-if="td == 1">未学</span>
            <span v-if="td == 2">在学</span>
            <span v-if="td == 3">学完</span>
          </template>
          <template slot="learning_duration" slot-scope="td">
            {{ td | durationFormat('秒') }}
          </template>
        </a-table>
        <i-pagination :pagination="pages" @change="getDetail"/>
      </div>
    </a-modal>
  </div>
</template>
<script>
const columnsCourse = [
  { title: '课程名称', dataIndex: 'course_name', key: 'course_name', align: 'center', width: 100 },
  { title: '讲名称', dataIndex: 'lesson_name', key: 'lesson_name', align: 'center', width: 100, sorter: true },
  { title: '加入总人数', dataIndex: 'signup_num', key: 'signup_num', align: 'center', width: 100 },
  { title: '未学/在学/学完人数', key: 'studyNum', dataIndex: 'studyNum', scopedSlots: { customRender: 'studyNum' }, align: 'center', width: 110 },
  { title: '完成比例', dataIndex: 'complete_precent', key: 'complete_precent', scopedSlots: { customRender: 'complete_precent' }, align: 'center', width: 100 },
  { title: '时长', dataIndex: 'duration', key: 'duration', scopedSlots: { customRender: 'duration' }, align: 'center', width: 140 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 80 }
]
const columnsModal = [
  { title: '学员姓名', dataIndex: 'nickname', key: 'nickname', width: 120 },
  // { title: '是否完成', key: 'is_complete', dataIndex: 'is_complete', scopedSlots: { customRender: 'is_complete' }, align: 'center', width: 110 },
  { title: '学习状态', key: 'learn_state', dataIndex: 'learn_state', scopedSlots: { customRender: 'learn_state' }, align: 'center', width: 110 },
  { title: '学习时间', key: 'learning_duration', dataIndex: 'learning_duration', scopedSlots: { customRender: 'learning_duration' }, align: 'center', width: 140 }
]
export default {
  name: 'courseDetailData',
  data () {
    return {
      types: {
        video: '视频',
        audio: '音频'
      },
      visible: false,
      confirmLoading: false,
      loading: false,
      loadingModal: false,
      columnsCourse,
      columnsModal,
      pagination: {
        type: '课时',
        total: 0, // 总条数
        current_page: 1
      },
      pages: {
        type: '学员',
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
      this.$api.courseData.detail({
        hash_resource_id: this.id,
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
        if (res.code === 0) {
          if (res.data.list) {
            this.modalData.userInfo = res.data.list
            this.pages.total = res.data.info.total
          } else {
            this.modalData.userInfo = []
            this.pages.total = 0
          }
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
<style scope></style>
