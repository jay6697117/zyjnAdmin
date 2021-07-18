<template>
  <div class="planList">
    <a-row>
      <a-col :sm="6" :xs="24">
        <a-button type="primary" @click="addItem" v-if="$power(['edit'])">新建培训计划</a-button>
        <router-link to="/content/plan/classify" v-if="$power(['classify'])"><a-button>分类管理</a-button></router-link>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" type="project_plan" @search="onSearch" placeholder="培训计划名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false">
      <div class="customTd" slot="customTd" slot-scope="customTd, customTr">
        <img :src="customTr.mediaCoverUrl"/>
        <div class="description">
          <router-link :to="'/content/plan/review?id=' + customTr.hash_id">{{customTr.title}}</router-link>
        </div>
      </div>
      <span slot="publishTime" slot-scope="publishTime">{{publishTime | timeFormat('yyyy-MM-dd')}}</span>
      <span slot="publishStatus" slot-scope="publishStatus">
        <a-badge status="success" text="已上架" v-if="publishStatus == 'yes'"/>
        <a-badge status="error" text="已下架" v-else/>
      </span>
      <span slot="planStatus" slot-scope="planStatus">
        <a-badge status="success" text="上课中" v-if="planStatus == '上课中'"/>
        <a-badge status="error" text="已结束" v-if="planStatus == '已结束'"/>
        <a-badge status="processing" text="待上课" v-if="planStatus == '待上课'"/>
        <a-badge status="warning" text="报名中" v-if="planStatus == '报名中'"/>
        <a-badge status="default" text="未报名" v-if="planStatus == '未报名'"/>
      </span>
      <span slot="is_openup" slot-scope="is_openup">
        <a-badge status="success" text="是" v-if="is_openup == '1'"/>
        <a-badge status="error" text="否" v-else/>
      </span>
      <template slot="action" slot-scope="item">
        <i-operation :item="item" type="plan" :operation="operation" :pagination="pagination" :filters="filters" @reset="getList" @loading="setLoading"></i-operation>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>

<script>
const columns = [
  {title: '培训计划', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'customTd' }},
  {title: '内容数量', dataIndex: 'item_num', key: 'item_num', align: 'center', width: 100},
  {title: '报名人数', dataIndex: 'subscribeTotal', key: 'subscribeTotal', align: 'center', width: 100},
  {title: '学习人数', dataIndex: 'learnedTotal', key: 'learnedTotal', align: 'center', width: 100},
  {title: '上架状态', dataIndex: 'publishStatus', key: 'publishStatus', scopedSlots: { customRender: 'publishStatus' }, align: 'center', width: 100},
  {title: '课程状态', dataIndex: 'planStatus', key: 'planStatus', scopedSlots: { customRender: 'planStatus' }, align: 'center', width: 100},
  {title: '开放报名', dataIndex: 'is_openup', key: 'is_openup', scopedSlots: { customRender: 'is_openup' }, align: 'center', width: 100},
  {title: '上架时间', key: 'publishTime', dataIndex: 'publishTime', scopedSlots: { customRender: 'publishTime' }, align: 'center', width: 110},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 80}
]

export default {
  name: 'cList',
  data () {
    return {
      data: [],
      columns,
      loading: false,
      pagination: {
        type: '资讯',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        signup_state: '',
        hash_category_id: '0',
        search_content: '',
        shelf_state: ''
      },
      operation: [
        {type: 'task', name: '任务管理', url: '/content/plan/edit'},
        {type: 'relation', name: '学员管理', url: '/content/plan/relation'},
        {type: 'copy', name: '复制培训'},
        {
          type: 'shelf',
          name: '上架/下架',
          path: 'plan',
          canRemove: true,
          searchBind: true,
          title: '培训计划下架',
          tips: '下架后培训计划无法报名学习，同时解除与下列轮播图的关联关系，是否下架？',
          content: '下架后培训计划无法报名学习，是否下架？'
        },
        {type: 'edit', name: '编辑', url: '/content/plan/edit'},
        {
          type: 'remove',
          name: '删除',
          path: 'plan',
          canRemove: true,
          searchBind: true,
          title: '培训计划删除',
          tips: '删除将清空培训计划下学员的学习数据，同时解除与下列轮播图的关联关系，是否删除？',
          content: '删除将清空培训计划下学员的学习数据，是否删除？'
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
      this.$api.plan.list({
        current_page,
        per_page,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.data = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.pagination.total = 0
          this.data = []
        }
        this.loading = false
      })
    },
    addItem () { // 点击新建
      this.$router.push({
        path: '/content/plan/edit',
        query: {
          id: ''
        }
      })
    }
  }
}
</script>
