<template>
  <div>
    <a-row>
      <a-col :sm="6" :xs="24">
        <a-button type="primary" @click="addItem" v-if="$power('edit')">新建资讯</a-button>
        <router-link to="/operation/news/classify"><a-button>栏目管理</a-button></router-link>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" type="news" @search="onSearch" placeholder="资讯标题"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_id" :pagination="false">
      <template slot="title" slot-scope="item">
        <router-link :to="'/operation/news/review?id=' + item.hash_id">{{item.title}}</router-link>
      </template>
      <template slot="istop" slot-scope="item">
        <a-tag v-if="item.istop == 1" color="cyan" @click="istop(item, 0, $power('istop'))">置顶</a-tag>
        <a-tag v-else @click="istop(item, 1, $power('istop'))">置顶</a-tag>
      </template>
      <template slot="publishSetting" slot-scope="item">
        <a-badge status="success" text="已发布" v-if="item.publishSetting == 1"/>
        <a-badge status="error" text="未发布" v-else/>
      </template>
      <template slot="updated_at" slot-scope="updated_at">
        <span>{{updated_at | timeFormat('yyyy-MM-dd')}}</span>
      </template>
      <template slot="action" slot-scope="action">
        <a href="javascript:;" @click="edit(action)" v-if="$power('edit')">编辑</a>
        <a-divider type="vertical" v-if="$power(['edit', 'publish'])"/>
        <i-remove :id="action.hash_id" :parmas="publishParmas" action="publish" @reset="getList" @loading="setLoading" v-if="action.publishSetting == 1 && $power('publish')">
          <a href="javascript:;" slot="operation">取消发布</a>
        </i-remove>
        <a href="javascript:;" v-else-if="$power('publish')" @click="upItem(action, 1)">发布</a>
        <a-divider type="vertical" v-if="$power(['remove', 'publish'])"/>
        <i-remove :id="action.hash_id" :parmas="removeParmas" action="remove" @reset="getList" @loading="setLoading" v-if="$power('remove')">
          <a href="javascript:;" slot="operation">删除</a>
        </i-remove>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <a-modal
      :header="null"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="去编辑"
    >
      <p>置顶新闻需要缩略图，是否前往资讯编辑？</p>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {title: '资讯名称', key: 'title', scopedSlots: { customRender: 'title' }},
  {title: '资讯属性', key: 'istop', scopedSlots: { customRender: 'istop' }, align: 'center', width: 100},
  {title: '发布状态', key: 'publishSetting', scopedSlots: { customRender: 'publishSetting' }, align: 'center', width: 100},
  {title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', scopedSlots: { customRender: 'updated_at' }, align: 'center', width: 160},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 200}
]

export default {
  name: 'cList',
  data () {
    return {
      data: [],
      columns,
      loading: false,
      pagination: {
        type: 'news',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        hash_category_id: '0',
        search_content: '',
        publish_state: ''
      },
      name: '资讯',
      visible: false,
      confirmLoading: false,
      news_id: '',
      removeParmas: {
        title: '新闻删除',
        path: 'news',
        canRemove: true,
        searchBind: true,
        tips: '删除后无法恢复，同时解除与下列轮播图的关联关系，是否删除？',
        content: '删除后无法恢复，是否删除？'
      },
      publishParmas: {
        title: '新闻取消发布',
        path: 'news',
        canRemove: true,
        searchBind: true,
        tips: '取消发布将解除与下列轮播图的关联关系，是否取消发布？',
        content: '未发布状态的新闻无法使用，是否取消发布？'
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
      this.$api.news.list({
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
        path: '/operation/news/edit',
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
        path: '/operation/news/edit',
        query: {
          id: item.hash_id
        }
      })
    },
    deleteThis (item) {
      this.$api.news.remove({
        hash_id: item.hash_id
      }).then(res => {
        if (!res.code) {
          this.getList()
        }
      })
    },
    upItem (item, status) {
      this.loading = true
      this.$api.news.publish({
        hash_id: item.hash_id,
        publishSetting: status
      }).then(res => {
        if (!res.code) {
          if (res.data.publish === true) {
            this.$message.success('新闻发布成功', 10)
          }
          this.getList()
        }
      })
    },
    istop (item, status, power) {
      if (!power) { return }
      this.news_id = item.hash_id
      this.$api.news.top({
        hash_id: item.hash_id,
        istop: status
      }).then(res => {
        if (!res.code) {
          this.getList()
        } else {
          this.visible = true
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      this.$router.push({
        path: '/operation/news/edit',
        query: {
          id: this.news_id
        }
      })
    }
  }
}
</script>
