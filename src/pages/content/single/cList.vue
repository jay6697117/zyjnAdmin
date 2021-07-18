<template>
  <div class="cList">
    <a-row>
      <a-col :sm="6" :xs="24">
        <a-button type="primary" icon="plus" @click="addItem" v-if="power('insert')">新建{{name}}</a-button>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <a-form layout="inline" v-if="power('list')" :form="searchForm" @submit="handleSearch">
          <a-form-item>
            <a-select style="width: 120px" placeholder="选择状态" v-decorator="['status']" :getPopupContainer="triggerNode => triggerNode.parentNode">
              <a-select-option :value="index" v-for="(item, index) in stateList" :key="index">{{item}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input placeholder="按名称搜索" v-decorator="['keyword']"/>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="id" :pagination="pagination">
      <span slot="customTitle">{{name}}</span>
      <div class="customTd" slot="customTd" slot-scope="customTd, customTr">
        <img :src="customTr.mediaCoverUrl" @click="review(customTd, customTr)" />
        <div class="description">
          <p @click="review(customTd, customTr)">{{customTr.title}}</p>
        </div>
      </div>
      <span slot="publishTime" slot-scope="publishTime">{{publishTime | timeFormat('yyyy-MM-dd')}}</span>
      <span slot="publishStatus" slot-scope="publishStatus">
        <a-tag v-if="publishStatus == 'yes'" color="cyan">已上架</a-tag>
        <a-tag v-else color="green">已下架</a-tag>
      </span>
      <span slot="action" slot-scope="action">
        <a href="javascript:;" @click="edit(action)" v-if="power('update')">编辑</a>
        <a-divider type="vertical" v-if="power('update') && power('publish')" />
        <a href="javascript:;" v-if="action.publishStatus == 'yes' && power('publish')" @click="upItem(action, 1)">下架</a>
        <a href="javascript:;" v-if="action.publishStatus == 'no' && power('publish')" @click="upItem(action, 0)">上架</a>
        <!-- <a-divider type="vertical" v-if="(power('delete') && power('publish'))||(power('delete') && power('update'))" />
        <a href="javascript:;" @click="del(action)" v-if="power('delete')">删除</a> -->
      </span>
    </a-table>
    <a-modal
      title=''
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      okText="确定"
      cancelText="我再想想"
      >
      <p>{{ModalText}}</p>
      <a-list itemLayout="horizontal" :dataSource="relatedColumn" v-if=visible>
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <a-avatar slot="avatar" :src=item.mediaCoverUrl />
            <span slot="title">{{item.title}}</span>
            <span slot="description">专栏</span>
          </a-list-item-meta>
          </a-list-item>
      </a-list>
    </a-modal>
  </div>
</template>

<script>

const columns = [
  {dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'customTd' }, align: 'left'},
  {title: '订阅量', dataIndex: 'subscribeTotal', key: 'subscribeTotal', align: 'center', width: 100},
  {title: '上架时间', key: 'publishTime', dataIndex: 'publishTime', scopedSlots: { customRender: 'publishTime' }, align: 'center', width: 220},
  {title: '状态', dataIndex: 'publishStatus', key: 'publishStatus', scopedSlots: { customRender: 'publishStatus' }, align: 'center', width: 100},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 200}
]

export default {
  name: 'cList',
  data () {
    let self = this
    return {
      confirmLoading: false,
      deleteId: '',
      relatedColumn: [],
      visible: false,
      ModalText: '删除后课程将消失，同时也会在下方关联的课程列表中消失，且不可恢复，是否确定删除？',
      data: [],
      columns,
      stateList: ['所有状态', '已上架', '未上架', '已下架'],
      loading: false,
      tableInfo: {},
      pagination: {
        current_page: 1,
        pageSize: 3, // 默认每页显示数量
        showTotal: total => `${self.name}数量 ${self.tableInfo.total} 个`, // 显示总数
        onChange: (page, pageSize) => self.getList(page, pageSize), // 点击页码事件
        total: 0 // 总条数
      },
      searchForm: this.$form.createForm(this, { name: 'searchForm' })
    }
  },
  props: ['name', 'type'],
  mounted () {
    this.$nextTick(() => {
      this.searchForm.setFieldsValue({
        status: 0,
        keyword: ''
      })
      this.getList(1)
    })
  },
  methods: {
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFieldsAndScroll((err, vals) => {
        if (!err) {
          console.log(vals)
          this.getList(1)
        }
      })
    },
    power (val) {
      return this.$power('content:' + this.type + 'List:' + val)
    },
    getList (page, pageSize) {
      this.loading = true
      let searchForm = this.searchForm.getFieldsValue()
      this.$api.content.list({
        url: '/' + this.type + '/search',
        keyword: searchForm.keyword,
        publishSetting: searchForm.status ? searchForm.status : '',
        current_page: page,
        per_page: this.pagination.pageSize
      }).then(res => {
        if (res.data.list) {
          this.data = res.data.list.map((item) => {
            item.name = {
              url: item.mediaCoverUrl,
              caption: item.title
            }
            return item
          })
          this.tableInfo = res.data.info
          this.pagination.total = res.data.info.total
        } else {
          this.data = []
          this.tableInfo = {
            total: 0
          }
        }
        this.loading = false
      })
    },
    addItem () { // 点击新建
      this.$router.push({
        path: '/content/' + this.type + 'Edit',
        query: {
          resourceId: ''
        }
      })
    },
    edit (item) { // 点击编辑
      this.$router.push({
        path: '/content/' + this.type + 'Edit',
        query: {
          resourceId: item.id
        }
      })
    },
    del (item) { // 点击删除
      this.deleteId = item.id
      this.$api.content.list({
        url: '/column/search',
        current_page: 1,
        per_page: this.pagination.pageSize,
        publishSetting: '',
        keyword: '',
        course_id: item.id
      }).then(res => {
        if (res.data.list.length > 0) {
          this.visible = true
          this.relatedColumn = res.data.list
        } else {
          this.handleOk()
        }
      })
    },
    handleOk (e) {
      this.$api.content.list({
        url: '/resource/delete',
        id: this.deleteId,
        mediaType: this.type
      }).then(res => {
        this.getList(this.pagination.current_page)
      })
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel (e) {
      this.visible = false
    },
    upItem (item, offline) {
      this.loading = true
      let parmas = {
        url: '/' + this.type + '/publish',
        resourceId: item.id,
        offline
      }
      this.$api.content.list(parmas).then(res => {
        this.getList()
      })
    },
    review (text, record) {
      console.log(text, record)
    }
  }
}
</script>
