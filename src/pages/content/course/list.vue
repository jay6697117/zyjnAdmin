<template>
  <div class="courseList">
    <a-row>
      <a-col :sm="8" :xs="24">
        <div>
          <a-button type="primary" @click="addItem" v-if="$power(['edit'])">新建课程</a-button>
          <router-link to="/content/course/classify" v-if="$power(['classify'])"><a-button>课程分类</a-button></router-link>
          <router-link to="/content/course/tag" v-if="$power(['tag'])"><a-button>标签管理</a-button></router-link>
        </div>
      </a-col>
      <a-col :sm="16" :xs="24" align="right">
        <i-filter :filters="filters" type="course" @search="onSearch" placeholder="课程名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="courseData" :loading="loading" rowKey="hash_id" :pagination="false">
      <div class="customTd" slot="customTd" slot-scope="customTd, customTr">
        <img :src="customTr.mediaCoverUrl"/>
        <div class="description">
          <router-link :to="'/content/course/review?id=' + customTr.hash_id">{{customTr.title}}</router-link>
        </div>
      </div>
      <div class="minor" slot="publishSetting" slot-scope="publishSetting">
        <a-badge status="success" text="已上架" v-if="publishSetting == '1'"/>
        <a-badge status="error" text="已下架" v-if="publishSetting == '-1'"/>
      </div>
      <div class="minor" slot="is_openup" slot-scope="is_openup">
        <a-badge status="success" text="是" v-if="is_openup == '1'"/>
        <a-badge status="error" text="否" v-else/>
      </div>
      <span slot="publishTime" slot-scope="publishTime">{{publishTime | timeFormat('yyyy-MM-dd')}}</span>
      <template slot="action" slot-scope="item">
        <i-operation :item="item" type="course" :operation="operation" :pagination="pagination" :filters="filters" @reset="getList" @loading="setLoading"></i-operation>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columns = [
  {title: '课程名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'customTd' }, align: 'left'},
  {title: '包含讲数', dataIndex: 'item_num', key: 'item_num', align: 'center', width: 100},
  {title: '报名人数', dataIndex: 'subscribeTotal', key: 'subscribeTotal', align: 'center', width: 100},
  {title: '学习人数', dataIndex: 'learnedTotal', key: 'learnedTotal', align: 'center', width: 100},
  {title: '上架状态', dataIndex: 'publishSetting', key: 'publishSetting', scopedSlots: { customRender: 'publishSetting' }, align: 'center', width: 100},
  {title: '开放报名', key: 'is_openup', dataIndex: 'is_openup', scopedSlots: { customRender: 'is_openup' }, align: 'center', width: 100},
  {title: '上架时间', key: 'publishTime', dataIndex: 'publishTime', scopedSlots: { customRender: 'publishTime' }, align: 'center', width: 110},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 80}
]
export default {
  data () {
    return {
      name: '课程名称',
      courseData: [],
      columns,
      loading: false,
      pagination: {
        type: 'course',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        hash_category_id: '0',
        search_content: '',
        shelf_state: ''
      },
      operation: [
        {type: 'content', name: '内容管理', url: '/content/course/relation?tab=0'},
        {type: 'relation', name: '学员管理', url: '/content/course/relation?tab=1'},
        {type: 'copy', name: '复制课程'},
        {
          type: 'shelf',
          name: '上架/下架',
          path: 'course',
          canRemove: true,
          searchBind: true,
          title: '课程下架',
          tips: '下架后课程将无法加入学习，同时解除与下列培训计划和轮播图的关联关系，是否下架？',
          content: '下架后课程将无法加入学习，是否下架？'
        },
        {type: 'edit', name: '编辑', url: '/content/course/edit'},
        {
          type: 'remove',
          name: '删除',
          path: 'course',
          canRemove: true,
          searchBind: true,
          title: '课程删除',
          tips: '删除将清空课程下学员的学习数据，同时解除与下列培训计划和轮播图的关联关系，是否删除？',
          content: '删除将清空课程下学员的学习数据，是否删除？'
        }
      ]
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
      this.$api.course.list({
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
    },
    addItem () { // 点击新建
      this.$router.push({
        path: '/content/course/edit',
        query: {
          id: ''
        }
      })
    }
  }
}
</script>
<style scope>
  .courseList .ant-table-tbody .course_title{margin-bottom:0;line-height:24px;display:block;width:100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
</style>
