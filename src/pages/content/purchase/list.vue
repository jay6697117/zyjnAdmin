<template>
  <div class="courseList">
    <a-row>
      <a-col :span="24" align="right">
        <i-filter :filters="filters" type="course" @search="onSearch" placeholder="课程名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="courseData" :loading="loading" rowKey="hash_id" :pagination="false">
      <div class="customTd" slot="customTd" slot-scope="customTd, customTr">
        <img :src="customTr.mediaCoverUrl"/>
        <div class="description">
          <p>{{customTr.title}}</p>
        </div>
      </div>
      <template slot="pay_number" slot-scope="td, tr">
        {{tr.buyout == '1' ? '无限制' : tr.pay_number}}
      </template>
      <div class="minor" slot="is_expired" slot-scope="is_expired">
        <a-badge status="error" text="不可用" v-if="is_expired"/>
        <a-badge status="success" text="可用" v-else/>
      </div>
      <div class="minor" slot="is_openup" slot-scope="is_openup">
        <a-badge status="success" text="开启" v-if="is_openup == '1'"/>
        <a-badge status="error" text="关闭" v-else/>
      </div>
      <span slot="expiry_time" slot-scope="expiry_time">{{expiry_time | timeFormat('yyyy-MM-dd')}}</span>
      <template slot="action" slot-scope="item">
        <a href="javascript:;" @click="editItem(item)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="student(item)">学员管理</a>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columns = [
  {title: '课程名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'customTd' }, align: 'left'},
  {title: '课程分类', dataIndex: 'category_name', key: 'category_name', align: 'center', width: 100},
  {title: '包含讲数', dataIndex: 'lesson_num', key: 'lesson_num', align: 'center', width: 100},
  {title: '参与人数', dataIndex: 'subscribeTotal', key: 'subscribeTotal', scopedSlots: { customRender: 'subscribeTotal' }, align: 'center', width: 100},
  {title: '总名额', dataIndex: 'pay_number', key: 'pay_number', scopedSlots: { customRender: 'pay_number' }, align: 'center', width: 100},
  {title: '课程状态', dataIndex: 'is_expired', key: 'is_expired', scopedSlots: { customRender: 'is_expired' }, align: 'center', width: 100},
  {title: '开放报名', key: 'is_openup', dataIndex: 'is_openup', scopedSlots: { customRender: 'is_openup' }, align: 'center', width: 100},
  {title: '课程有效期', key: 'expiry_time', dataIndex: 'expiry_time', scopedSlots: { customRender: 'expiry_time' }, align: 'center', width: 110},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 150}
]
export default {
  data () {
    return {
      courseData: [],
      columns,
      loading: false,
      pagination: {
        type: 'purchase',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        hash_category_id: '0',
        course_status: '',
        is_openup: '',
        search_content: ''
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let listParmas = this.$store.state.listParmas
      if (listParmas.pagination.type === this.pagination.type) {
        this.onSearch(listParmas.filters, listParmas.pagination.current_page)
        this.$store.commit('initListParmas')
      } else {
        this.onSearch()
      }
    })
  },
  methods: {
    editItem (item) {
      this.$store.commit('setListPamars', {
        pagination: this.pagination,
        filters: this.filters
      })
      this.$router.push({
        path: '/content/purchase/edit',
        query: {
          id: item.hash_id
        }
      })
    },
    student (item) {
      this.$router.push({
        path: '/content/purchase/relation',
        query: {
          id: item.hash_id
        }
      })
    },
    setLoading (loading) {
      this.loading = loading
    },
    onSearch (filters = this.filters, currentPage = 1) {
      this.filters = filters
      this.getList(currentPage)
    },
    getList (current_page = this.pagination.current_page, pageSize = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.purchase.list({
        current_page: current_page,
        per_page: pageSize,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.courseData = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.courseData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    }
  }
}
</script>
<style scope>
  .courseList .ant-table-tbody .course_title{margin-bottom:0;line-height:24px;display:block;width:100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
</style>
