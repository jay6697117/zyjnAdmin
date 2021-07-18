<template>
  <div>
    <a-row>
      <a-col :sm="8" :xs="24">
        <a-button type="primary" @click="addItem" v-if="$power(['edit'])">新建证书</a-button>
      </a-col>
      <a-col :span="16" :xs="24" align="right">
        <i-filter :filters="filters" type="certificate" @search="onSearch" placeholder="证书名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="certificateData" :loading="loading" rowKey="hash_id" :pagination="false">
      <div class="customTd" slot="customTd" slot-scope="customTd, customTr">
        <img v-if="customTr.mediaCoverUrl!== ''" :src="customTr.mediaCoverUrl"/>
        <div v-if="customTr.mediaCoverUrl!== ''" class="description">{{customTr.relation_resource_title}}</div>
        <span v-if="customTr.mediaCoverUrl=== ''" style="color:#f00;">关联内容已被删除</span>
      </div>
      <div class="cert_type" slot="cert_type" slot-scope="cert_type">
        <span v-if="(cert_type==='exam')">专项考试证书</span>
        <span v-if="(cert_type==='project_plan')">培训计划证书</span>
        <span v-if="(cert_type==='course')">课程证书</span>
      </div>
      <div slot="publishSetting" slot-scope="publishSetting">
        <a-badge status="success" text="已发布" v-if="publishSetting == '1'"/>
        <a-badge status="error" text="未发布" v-if="publishSetting == '-1'"/>
      </div>
      <span slot="publish_time" slot-scope="publish_time">{{publish_time | timeFormat('yyyy-MM-dd')}}</span>
      <template slot="action" slot-scope="item">
        <p @click="remove(item)" v-if="$power(['remove'])&&(item.mediaCoverUrl==='')" style="cursor:pointer;color:#f00;">删除</p>
        <a-dropdown v-if="item.mediaCoverUrl!==''">
          <a class="ant-dropdown-link"> 管理 <a-icon type="down" /> </a>
          <a-menu slot="overlay">
            <a-menu-item  v-if="$power(['publish'])">
              <p v-if="item.publishSetting === -1" @click="publish(item)">发布</p>
              <p v-if="item.publishSetting === 1" @click="publish(item)">取消发布</p>
            </a-menu-item>
            <a-menu-item  v-if="$power(['edit'])">
              <p @click="edit(item)">编辑</p>
            </a-menu-item>
            <a-menu-item  v-if="$power(['remove'])">
              <p @click="remove(item)">删除</p>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columns = [
  {title: '证书名称', dataIndex: 'title', key: 'title', align: 'center', width: 200},
  {title: '证书类型', dataIndex: 'cert_type', key: 'cert_type', scopedSlots: { customRender: 'cert_type' }, align: 'center', width: 200},
  {title: '关联内容', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'customTd' }, align: 'left', width: 250},
  {title: '报名人数', dataIndex: 'subscribe_total', key: 'subscribe_total', align: 'center', width: 100},
  {title: '发放人数', dataIndex: 'send_total', key: 'send_total', align: 'center', width: 100},
  {title: '状态', dataIndex: 'publishSetting', key: 'publishSetting', scopedSlots: { customRender: 'publishSetting' }, align: 'center', width: 100},
  {title: '创建时间', key: 'publish_time', dataIndex: 'publish_time', scopedSlots: { customRender: 'publish_time' }, align: 'center', width: 200},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 80}
]
export default {
  data () {
    return {
      name: '课程名称',
      certificateData: [],
      columns,
      loading: false,
      pagination: {
        type: 'certificate',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        cert_type: '',
        search_content: '',
        publish_state: ''
      },
      operation: [
        {
          type: 'publish',
          name: '发布/取消发布',
          path: 'certificate',
          canRemove: true,
          searchBind: true,
          title: '课程下架',
          tips: '下架后课程将无法加入学习，同时解除与下列培训计划和轮播图的关联关系，是否下架？',
          content: '下架后课程将无法加入学习，是否下架？'
        },
        {type: 'edit', name: '编辑', url: '/content/certificate/edit'},
        {type: 'remove', name: '删除'}
      ],
      publishSetting: 1
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
      this.$api.certificate.list({
        current_page: current_page,
        per_page: pageSize,
        cer_type: '',
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.certificateData = res.data.list
          this.certificateData = res.data.list.map((item) => {
            this.publishSetting = item.publishSetting
            return item
          })
          this.pagination.total = res.data.info.total
        } else {
          this.certificateData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    addItem () { // 点击新建
      this.$router.push({
        path: '/content/certificate/edit',
        query: {
          id: ''
        }
      })
    },
    publish (item) {
      this.$api.certificate.publish({
        hash_id: item.hash_id
      }).then(res => {
        if (res.code === 0) {
          if (item.publishSetting === 1) {
            this.$message.success('证书取消发布成功')
          } else {
            this.$message.success('证书发布成功')
          }
          this.getList()
        }
      })
    },
    edit (item) {
      this.$store.commit('setListPamars', {
        pagination: this.pagination,
        filters: this.filters
      })
      this.$router.push({
        path: '/content/certificate/edit',
        query: {
          id: item.hash_id
        }
      })
    },
    remove (item) {
      this.$api.certificate.remove({
        hash_id: item.hash_id
      }).then(res => {
        if (res.code === 0) {
          this.getList()
        }
      })
    }
  }
}
</script>
