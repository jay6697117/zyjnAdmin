<template>
  <div>
    <a-row>
      <a-col :sm="6" :xs="24">
        <a-button type="primary" @click="add" v-if="$power([type + 'Add'])">新建{{name}}</a-button>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" type="resource" @search="onSearch" placeholder="资源名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="type==='video'? columnsVideo :columnsAudio" :dataSource="tableData" rowKey="hash_id" :loading="loading" :pagination="false">
      <template slot="customTitle">{{name}}</template>
      <template slot="length"  slot-scope="length">{{parseInt(length / 60)+'分'+parseInt(length % 60)+'秒'}}</template>
      <template slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</template>
      <template slot="action" slot-scope="action">
        <span @click="review(action)" style="color:#1890ff;cursor:pointer;">预览</span>
        <a-divider type="vertical"/>
        <i-remove :id="action.hash_id" :parmas="removeParmas" action="remove" @reset="getList" @loading="setLoading" v-if="$power([type + 'Remove'])">
          <a href="javascript:;" slot="operation">删除</a>
        </i-remove>
      </template>
    </a-table>
    <a-modal :title="resourceItem.fileName" :visible="visible" :footer="null" @cancel="mediaCancel" destroyOnClose class="resourceBoxModal">
      <vue-aliplayer-v2 :source="resourceItem.fileUrl" ref="VueAliplayerV2" :options="options" :class="resourceItem.mediaType"/>
    </a-modal>
    <i-pagination :pagination="pagination" @change="getList"/>
    <i-create :name="name" :type="type" :flag="resouceflag" @cancel="cancel" @funcReload="getList"></i-create>
  </div>
</template>
<script>
import iCreate from './created.vue'
const columnsVideo = [
  {title: '视频名称', dataIndex: 'fileName', key: 'fileName', align: 'left'},
  {title: '视频时长', dataIndex: 'length', key: 'length', scopedSlots: { customRender: 'length' }, align: 'center', width: 120},
  {title: '视频大小', dataIndex: 'fileSize', key: 'fileSize', align: 'center', width: 120},
  {title: '创建时间', dataIndex: 'created_at', key: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 160},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 200}
]
const columnsAudio = [
  {title: '音频名称', dataIndex: 'fileName', key: 'fileName', align: 'left'},
  {title: '音频时长', dataIndex: 'length', key: 'length', scopedSlots: { customRender: 'length' }, align: 'center', width: 120},
  {title: '音频大小', dataIndex: 'fileSize', key: 'fileSize', align: 'center', width: 120},
  {title: '创建时间', dataIndex: 'created_at', key: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 160},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 200}
]
const skinLayout = [
  { 'name': 'controlBar',
    'align': 'blabs',
    'x': 0,
    'y': 0,
    'children': [
      { 'name': 'playButton', 'align': 'tl', 'x': 15, 'y': 12 },
      { 'name': 'timeDisplay', 'align': 'tl', 'x': 10, 'y': 4 },
      { 'name': 'fullScreenButton', 'align': 'tr', 'x': 10, 'y': 12 },
      { 'name': 'volume', 'align': 'tr', 'x': 5, 'y': 10 },
      { 'name': 'progress', 'align': 'blabs', 'x': 0, 'y': 44 }
    ]
  },
  { 'name': 'bigPlayButton', 'align': 'cc' },
  { 'name': 'H5Loading', 'align': 'cc' }
]
export default {
  name: 'resource',
  data () {
    return {
      loading: false,
      columnsVideo,
      columnsAudio,
      filters: {
        search_content: '',
        hash_category_id: '0'
      },
      pagination: {
        type: '资源',
        total: 0, // 总条数
        current_page: 1
      },
      removeParmas: {
        title: '资源删除',
        path: 'resource',
        canRemove: false,
        searchBind: true,
        tips: '资源已被使用，请先从课程中移除，再执行删除操作！',
        content: '删除后将无法恢复，是否删除？'
      },
      tableData: [],
      resouceflag: false,
      resourceItem: {},
      visible: false,
      options: {
        height: '450px',
        skinLayout: skinLayout,
        cover: ''
      }
    }
  },
  components: {
    iCreate
  },
  mounted () {
    this.getList()
  },
  props: ['type', 'name'],
  methods: {
    setLoading (loading) {
      this.loading = loading
    },
    onSearch (filters) {
      this.filters = filters
      this.getList(1)
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.resource.list({
        current_page,
        per_page,
        ...this.filters,
        mediaType: this.type
      }).then(res => {
        this.options.cover = res.data.cover
        if (res.data.list) {
          this.tableData = res.data.list.map((item) => {
            item.name = {
              url: item.mediaCoverUrl,
              caption: item.title
            }
            item.fileSize = (item.fileSize / 1024 / 1024).toFixed(1) + 'M'
            return item
          })
          this.pagination.total = res.data.info.total
        } else {
          this.tableData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    add () {
      this.resouceflag = true
    },
    cancel () {
      this.resouceflag = false
    },
    review (item) {
      this.visible = true
      this.resourceItem = item
    },
    mediaCancel () {
      this.visible = false
    }
  }
}
</script>
<style scope>
  .resourceBoxModal{padding-bottom:0;}
  .resourceBoxModal .ant-modal-header{height:55px;}
  .resourceBoxModal .ant-modal-header .ant-modal-title{width:100%;height:23px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;}
  .resourceBoxModal .prism-player.audio .prism-cover{z-index:0;background-size:100%;background-position:contain;display:block!important;background-repeat:no-repeat;}
</style>
