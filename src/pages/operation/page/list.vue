<template>
  <div>
    <a-row>
      <a-col :sm="6" :xs="24">
        <a-button type="primary" @click="addItem" v-if="$power('edit')">新建页面</a-button>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" type="pageManagement" @search="onSearch" placeholder="名称关键字搜索"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false">
      <template slot="title" slot-scope="item">
        <a :href="item.previewUrl" target="_blank">{{item.title}}</a>
      </template>
      <template slot="pageUrl" slot-scope="item">
        <a :href="item.previewUrl" target="_blank">{{item.pageUrl}}</a>
      </template>
      <template slot="publishSetting" slot-scope="item">
        <a-badge status="success" text="已发布" v-if="item.publishSetting == 1"/>
        <a-badge status="error" text="未发布" v-else/>
      </template>
      <template slot="updated_at" slot-scope="updated_at">
        <span>{{updated_at | timeFormat('yyyy-MM-dd')}}</span>
      </template>
      <template slot="action" slot-scope="item">
        <i-operation :item="item" type="pageManagement" :operation="operation" :pagination="pagination" :filters="filters" @reset="getList" @edit="edit" @loading="setLoading"></i-operation>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>

<script>
const columns = [
  {title: '页面名称', key: 'title', scopedSlots: { customRender: 'title' }, align: 'left', width: 200},
  {title: '页面地址', key: 'pageUrl', scopedSlots: { customRender: 'pageUrl' }, align: 'left', width: 300},
  {title: '发布状态', key: 'publishSetting', scopedSlots: { customRender: 'publishSetting' }, align: 'center', width: 100},
  {title: '创建时间', dataIndex: 'updated_at', key: 'updated_at', scopedSlots: { customRender: 'updated_at' }, align: 'center', width: 160},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 120}
]

export default {
  name: 'cList',
  data () {
    return {
      data: [],
      columns,
      loading: false,
      pagination: {
        type: 'page',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: ''
      },
      operation: [
        {type: 'edit', name: '编辑', url: '/operation/page/edit'},
        {
          type: 'publish',
          name: '发布/取消发布',
          path: 'pageManagement',
          canRemove: false,
          searchBind: false,
          title: '自定义页面取消发布',
          content: '取消发布后将无法显示，是否取消发布？'
        },
        {
          type: 'remove',
          name: '删除',
          path: 'pageManagement',
          canRemove: false,
          searchBind: false,
          title: '自定义页面删除',
          content: '删除后，页面地址失效，确定删除？'
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
      this.$api.pageManagement.list({
        current_page,
        per_page,
        ...this.filters
      }).then(res => {
        if (!res.code) {
          if (res.data.list) {
            this.data = res.data.list.map((item) => {
              item.name = {
                url: item.mediaCoverUrl,
                caption: item.title
              }
              return item
            })
            this.pagination.total = res.data.info.total
          } else {
            this.data = []
            this.pagination.total = res.data.info.total
          }
          this.loading = false
        }
      })
    },
    addItem () { // 点击新建
      this.$router.push({
        path: '/operation/page/edit',
        query: {
          id: ''
        }
      })
    },
    edit (item) { // 点击编辑
      this.$store.commit('setListPamars', {
        pagination: this.pagination,
        filters: this.filters
      })
      this.$router.push({
        path: '/operation/page/edit',
        query: {
          id: item.hash_id
        }
      })
    }
  }
}
</script>
