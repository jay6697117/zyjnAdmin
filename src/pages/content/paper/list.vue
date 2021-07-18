<template>
  <div>
    <a-row class="exam">
      <a-col :sm="6" :xs="24">
        <a-button type="primary" @click="addItem" v-if="$power(['edit'])">新建试卷</a-button>
        <router-link to="/content/question/list" v-if="$power('content:question')"><a-button type="primary">题库</a-button></router-link>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="试卷名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false">
      <span slot="publishSetting" slot-scope="publishSetting">
        <a-badge status="success" text="已发布" v-if="publishSetting == '1'"/>
        <a-badge status="error" text="未发布" v-if="publishSetting == '-1'"/>
      </span>
      <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
      <template slot="action" slot-scope="item">
        <i-operation :item="item" type="paper" :operation="operation" :pagination="pagination" :filters="filters" @reset="getList" @loading="setLoading"></i-operation>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>

<script>
const columns = [
  {title: '试卷名称', dataIndex: 'title', key: 'title'},
  {title: '试卷总分', key: 'totalScore', dataIndex: 'totalScore', align: 'center', width: 100},
  {title: '总题数', key: 'totalQuestion', dataIndex: 'totalQuestion', align: 'center', width: 100},
  {title: '发布状态', dataIndex: 'publishSetting', key: 'publishSetting', scopedSlots: { customRender: 'publishSetting' }, align: 'center', width: 100},
  {title: '创建时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 110},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 80}
]
export default {
  data () {
    return {
      data: [],
      columns,
      loading: false,
      type: 'text',
      pagination: {
        type: 'paper',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        publish_state: '',
        search_content: ''
      },
      operation: [
        {type: 'question', name: '试题管理', url: '/content/paper/question'},
        {type: 'copy', name: '复制试卷'},
        {
          type: 'publish',
          name: '发布/取消发布',
          path: 'paper',
          canRemove: true,
          searchBind: true,
          title: '试卷取消发布',
          tips: '试卷已被使用，请先解除关联，再执行取消发布操作！',
          content: '未发布状态的试卷无法被使用，是否取消发布？'
        },
        {type: 'edit', name: '编辑', url: '/content/paper/edit'},
        {
          type: 'remove',
          name: '删除',
          path: 'paper',
          canRemove: true,
          searchBind: true,
          title: '试卷删除',
          tips: '试卷已被使用，请先解除关联，再执行删除操作！',
          content: '删除后试卷无法恢复，是否删除？'
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
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.paper.list({
        current_page,
        per_page,
        ...this.filters
      }).then(res => {
        if (res.code === 0) {
          if (res.data.list) {
            this.data = res.data.list.map((item) => {
              return item
            })
            this.pagination.total = res.data.info.total
          } else {
            this.data = []
            this.pagination.total = 0
          }
        }
        this.loading = false
      })
    },
    addItem () { // 点击新建
      this.$router.push({
        path: '/content/paper/edit',
        query: {
          id: ''
        }
      })
    }
  }
}
</script>
