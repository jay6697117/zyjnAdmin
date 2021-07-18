<template>
  <div class="productList">
    <a-row class="selectTop">
      <a-col :span="8" style="padding-top:4px">
        产品名称： <strong>{{productInfo.title}}</strong>
      </a-col>
      <a-col :span="16" align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="讲名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_lesson_id" :pagination="false">
      <span slot="learningDuration" slot-scope="learningDuration">{{learningDuration | durationFormat('秒')}}</span>
      <template slot="action" slot-scope="item">
        <a href="javascript:;" @click="review(item)">查看详情</a>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <a-modal title="讲学习数据" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel" :footer="null" width="800px">
      <div class="courseModal">
        <p>{{modalData.lessonName}}</p>
        <a-row>
          <a-col align="right">
            <i-filter :filters="filtersModal" @search="onModalSearch" placeholder="名称"></i-filter>
          </a-col>
        </a-row>
        <a-table :columns="columnsModal" :dataSource="modalData.userInfo" :loading="loadingModal" rowKey="hash_id" :pagination="false">
          <template slot="learned_duration" slot-scope="td">
            {{ td | durationFormat('秒') }}
          </template>
          <template slot="created_at" slot-scope="td">
            {{ td | timeFormat('yyyy-MM-dd') }}
          </template>
          <template slot="client_type" slot-scope="td">
            <span v-if="td === 1">iPhone</span>
            <span v-if="td === 2">iPad</span>
            <span v-if="td === 3">Android</span>
            <span v-if="td === 4">pc</span>
            <span v-if="td === 5">其他</span>
          </template>
        </a-table>
        <i-pagination :pagination="pages" @change="getDetail"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  { title: '课程名称', dataIndex: 'courseName', key: 'courseName' },
  { title: '讲名称', dataIndex: 'lessonName', key: 'lessonName' },
  { title: '学习人次', dataIndex: 'studyTimes', key: 'studyTimes', width: 120, align: 'center' },
  { title: '学习人数', dataIndex: 'learnedUserTotal', key: 'learnedUserTotal', width: 120, align: 'center' },
  { title: '学习时长', key: 'learningDuration', dataIndex: 'learningDuration', scopedSlots: { customRender: 'learningDuration' }, align: 'center', width: 150 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 120, align: 'center' }
]
const columnsModal = [
  { title: '学员ID', dataIndex: 'user_id', key: 'user_id', width: 120 },
  { title: '学员姓名', dataIndex: 'user_name', key: 'user_name' },
  { title: '学习开始时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 140 },
  { title: '学习时长', key: 'learned_duration', dataIndex: 'learned_duration', scopedSlots: { customRender: 'learned_duration' }, align: 'center', width: 140 },
  { title: '设备', key: 'client_type', dataIndex: 'client_type', scopedSlots: { customRender: 'client_type' }, align: 'center', width: 110 }
]
export default {
  name: 'productDetail',
  data () {
    return {
      data: [],
      loading: false,
      visible: false,
      confirmLoading: false,
      loadingModal: false,
      columns,
      columnsModal,
      productInfo: {},
      modalData: {},
      pagination: {
        type: '讲',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: ''
      },
      pages: {
        type: '学员',
        total: 0, // 总条数
        current_page: 1,
        hideSize: true
      },
      filtersModal: {
        client_type: '',
        user_id: ''
      }
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  mounted () {
    this.getList()
    this.$api.courseProduct.getInfo({hash_id: this.id}).then(res => {
      if (!res.code) {
        this.productInfo = res.data
      }
    })
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
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.org.detail({
        hash_product_id: this.id,
        current_page,
        per_page,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.data = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.data = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    review (item) {
      this.visible = true
      this.modalData = item
      this.getDetail()
    },
    getDetail (current_page = this.pages.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pages.current_page = current_page
      this.loadingModal = true
      this.$api.org.detailInfo({
        hash_lesson_id: this.modalData.hash_lesson_id,
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
    handleCancel (e) {
      this.visible = false
    }
  }
}
</script>

<style scope>
  .selectTop{background: rgb(238, 234, 234);padding: 10px 15px;}
  .product{width: 100px;height: 75px;vertical-align: middle;margin-right: 5px;}
  .productInfo{padding: 24px;}
  .productInfo h2{font-size: 24px;}
  .productInfo strong{font-size: 16px;}
</style>
