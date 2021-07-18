<template>
  <div class="courseList">
    <a-tabs default-active-key="0" @change="tabCallback">
      <a-tab-pane key="0" :tab="'未审批 (' + total.waitAuditTotal + ')'"></a-tab-pane>
      <a-tab-pane key="1" :tab="'已审批 (' + total.auditedTotal + ')'"></a-tab-pane>
    </a-tabs>
    <a-row>
      <a-col :span="24" align="right">
        <i-filter :filters="filters" type="examine" @search="onSearch"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="courseData" :loading="loading" rowKey="hash_id" :pagination="false">
      <div class="customTd" slot="customTd" slot-scope="customTd, customTr">
        <img :src="customTr.cover"/>
        <div class="description">
          <p>{{customTr.courseName}}</p>
        </div>
      </div>
      <div class="minor" slot="course_audit_status" slot-scope="td">
        <a-badge status="default" text="已撤回" v-if="td == 3"/>
        <a-badge status="error" text="不通过" v-if="td == 2"/>
        <a-badge status="success" text="已通过" v-if="td == 1"/>
        <a-badge status="warning" text="审批中" v-if="td == 0"/>
      </div>
      <span slot="submit_audit_time" slot-scope="submit_audit_time">{{submit_audit_time | timeFormat('yyyy-MM-dd')}}</span>
      <template slot="action" slot-scope="item">
        <a href="javascript:;" @click="check(item)" v-if="item.user_audit_status === 0">审批</a>
        <a href="javascript:;" @click="check(item)" v-else>查看</a>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columns = [
  {title: '课程名称', dataIndex: 'courseName', key: 'courseName', scopedSlots: { customRender: 'customTd' }, align: 'left'},
  {title: '课程分类', dataIndex: 'categoryName', key: 'categoryName', align: 'center', width: 150},
  {title: '服务商', dataIndex: 'providerName', key: 'providerName', align: 'center', width: 150},
  {title: '提审次数', dataIndex: 'auditTotal', key: 'auditTotal', align: 'center', width: 150},
  {title: '提交时间', key: 'submit_audit_time', dataIndex: 'submit_audit_time', scopedSlots: { customRender: 'submit_audit_time' }, align: 'center', width: 110, sorter: true},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 80}
]
export default {
  data () {
    return {
      name: '课程名称',
      publishSetting: '0',
      courseData: [],
      columns: columns,
      loading: false,
      pagination: {
        type: 'course',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        hash_category_id: '0',
        search_content: ''
      },
      total: {
        waitAuditTotal: 0,
        auditedTotal: 0
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
    tabCallback (key) {
      this.publishSetting = key
      this.getList(1)
      // if (key === '0') {
      //   this.columns = columns1
      // } else if (key === '1') {
      //   this.columns = columns2
      // }
    },
    check (item) {
      this.$router.push({
        path: '/examine/view',
        query: {
          id: item.hash_course_id
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
    getList (current_page = this.pagination.current_page, pageSize = this.$store.state.pageSize, colum, direction) {
    // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.examineCourse.list({
        current_page: current_page,
        per_page: pageSize,
        order_by_column: colum,
        order_by_direction: direction,
        publishSetting: this.publishSetting,
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
      this.$api.examineCourse.total().then(res => {
        this.total = res.data
      })
    }
  }
}
</script>
<style scope>
  .courseList .ant-row{margin-bottom:20px;}
  .courseList .ant-table-tbody .course_title{margin-bottom:0;line-height:24px;display:block;width:100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
</style>
