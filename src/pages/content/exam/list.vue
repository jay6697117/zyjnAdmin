<template>
  <div class="examList">
    <a-row>
      <a-col :sm="6" :xs="24">
        <a-button type="primary" @click="addItem">新建专项考试</a-button>
        <router-link to="/content/exam/classify"><a-button>分类管理</a-button></router-link>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" @search="onSearch" type="exam" placeholder="考试名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false">
      <div class="customTd" slot="customTd" slot-scope="customTd, customTr">
        <img :src="customTr.mediaCoverUrl"/>
        <div class="description">
          <p>{{customTr.title}}</p>
        </div>
      </div>
      <span slot="publishSetting" slot-scope="publishSetting">
        <a-badge status="success" text="已上架" v-if="publishSetting == '1'"/>
        <a-badge status="error" text="已下架"  v-if="publishSetting == '-1'"/>
      </span>
      <span slot="exam_state" slot-scope="exam_state">
        <a-badge status="default" text="未开始" v-if="exam_state == '1'"/>
        <a-badge status="success" text="进行中"  v-if="exam_state == '2'"/>
        <a-badge status="error" text="已结束"  v-if="exam_state == '3'"/>
      </span>
      <span slot="start_time" slot-scope="start_time">{{start_time | timeFormat('yyyy-MM-dd')}}</span>
      <span slot="is_openup" slot-scope="is_openup">
        <a-badge status="success" text="是" v-if="is_openup == '1'"/>
        <a-badge status="error" text="否" v-else/>
      </span>
      <template slot="action" slot-scope="item">
        <i-operation :item="item" type="exam" :operation="operation" :pagination="pagination" :filters="filters" @reset="getList" @loading="setLoading"></i-operation>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>

<script>
const columns = [
  {title: '专项考试', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'customTd' }, align: 'left'},
  {title: '考试人数', dataIndex: 'submit_user_num', key: 'submit_user_num', align: 'center', width: 100},
  {title: '通过人数', dataIndex: 'pass_user_num', key: 'pass_user_num', align: 'center', width: 100},
  {title: '上架状态', dataIndex: 'publishSetting', key: 'publishSetting', scopedSlots: { customRender: 'publishSetting' }, align: 'center', width: 100},
  {title: '考试状态', dataIndex: 'exam_state', key: 'exam_state', scopedSlots: { customRender: 'exam_state' }, align: 'center', width: 100},
  {title: '考试时间', dataIndex: 'start_time', key: 'start_time', scopedSlots: { customRender: 'start_time' }, align: 'center', width: 110},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 80}
]
export default {
  data () {
    return {
      data: [],
      columns,
      loading: false,
      pagination: {
        type: 'exam',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        exam_state: '',
        search_content: '',
        shelf_state: '',
        hash_category_id: '0'
      },
      operation: [
        {type: 'relation', name: '学员管理', url: '/content/exam/relation'},
        {type: 'copy', name: '复制考试'},
        {
          type: 'shelf',
          name: '上架/下架',
          path: 'exam',
          canRemove: true,
          searchBind: true,
          title: '专项考试下架',
          tips: '下架后考试将关闭，同时解除与下列轮播图的关联关系，是否下架？',
          content: '下架后考试将关闭，是否下架？'
        },
        {type: 'edit', name: '编辑', url: '/content/exam/edit'},
        {
          type: 'remove',
          name: '删除',
          path: 'exam',
          canRemove: true,
          searchBind: true,
          title: '专项考试删除',
          tips: '删除将清空学员的考试数据，同时解除与下列轮播图的关联关系，是否删除？',
          content: '删除将清空学员的考试数据，是否删除？'
        }
      ],
      name: '专项考试'
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
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.exam.list({
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
    addItem () { // 点击新建
      this.$router.push({
        path: '/content/exam/edit'
      })
    }
  }
}
</script>
