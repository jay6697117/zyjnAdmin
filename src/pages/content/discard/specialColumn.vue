<template>
  <div class="specialColumn">
    <a-row>
      <a-col :sm="6" :xs="24">
        <a-button type="primary" icon="plus" @click="addItem">新建专栏</a-button>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <a-form layout="inline" :form="searchForm" @submit="handleSearch">
          <a-form-item>
            <a-select style="width: 120px" placeholder="选择状态" v-decorator="['publishSetting']">
              <a-select-option value="0">全部状态</a-select-option>
              <a-select-option value="1">已上架</a-select-option>
              <a-select-option value="-2">已下架</a-select-option>
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
      <div class="customTd" slot="pic" slot-scope="text">
        <img :src="text.url"/>
        <div class="description">
          <p>{{text.caption}}</p>
        </div>
      </div>
      <span slot="publishSetting" slot-scope="publishSetting">
        <a-tag v-if="publishSetting == '1'" color="blue">已上架</a-tag>
        <a-tag v-if="publishSetting == '-2'" color="green">已下架</a-tag>
      </span>
      <span slot="action" slot-scope="action">
        <a href="javascript:;" v-if="power('content:specialColumn:update')" @click="manage(action)">内容管理</a>
        <a-divider type="vertical" v-if="power('content:specialColumn:update') && power('content:specialColumn:publish')" />
        <a href="javascript:;" v-if="power('content:specialColumn:update')" @click="edit(action)">编辑</a>
        <a-divider type="vertical" v-if="power('content:specialColumn:update') && power('content:specialColumn:publish')" />
        <a href="javascript:;" v-if="action.publishSetting == '1' && power('content:specialColumn:publish')" @click="upItem(action, 0)">下架</a>
        <a href="javascript:;" v-if="action.publishSetting == '-2' && power('content:specialColumn:publish')" @click="upItem(action, 1)">上架</a>
        <a-divider type="vertical" v-if="(power('content:specialColumn:update') && power('content:specialColumn:delete'))||(power('content:specialColumn:publish')&& power('content:specialColumn:delete'))" />
        <a href="javascript:;" v-if="power('content:specialColumn:delete')" @click="del(action)">删除</a>
      </span>
    </a-table>
  </div>
</template>
<script>
const columns = [
  {dataIndex: 'name', key: 'name', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'pic' }, align: 'left'},
  {title: '专栏点击量', dataIndex: 'clicks', key: 'clicks', align: 'center', width: 120},
  {title: '学员人数', key: 'subscribeTotal', dataIndex: 'subscribeTotal', align: 'center', width: 120},
  {title: '状态', dataIndex: 'publishSetting', key: 'publishSetting', scopedSlots: { customRender: 'publishSetting' }, align: 'center', width: 120},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 250}
]
export default {
  data () {
    return {
      name: '专栏名称',
      data: [],
      columns,
      showEditor: false,
      loading: false,
      id: 0,
      tableInfo: {},
      pagination: {
        pageNo: 1,
        pageSize: 15, // 默认每页显示数量
        total: 0 // 总条数
      },
      searchForm: this.$form.createForm(this, { name: 'searchForm' }),
      type: 'text'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.searchForm.setFieldsValue({
        publishSetting: '1',
        keyword: ''
      })
      this.$store.commit('setFromType', 'column')
      this.getList(1)
    })
  },
  methods: {
    power (val) {
      return this.$power(val)
    },
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFieldsAndScroll((err, vals) => {
        if (!err) {
          this.getList(1)
        }
      })
    },
    getList (page, pageSize) {
      this.loading = true
      let searchForm = this.searchForm.getFieldsValue()
      this.$api.column.list({
        keyword: searchForm.keyword,
        publishSetting: searchForm.publishSetting,
        current_page: page,
        per_page: this.pagination.pageSize,
        course_id: ''
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
        } else {
          this.data = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    addItem () { // 点击新建
      this.$router.push({
        path: '/content/columnDetail',
        query: {
          id: ''
        }
      })
    },
    edit (item) { // 点击编辑
      this.$router.push({
        path: '/content/columnDetail',
        query: {
          id: item.id
        }
      })
    },
    manage (item) { // 点击编辑
      this.$router.push({
        path: '/content/columnContent',
        query: {
          id: item.id
        }
      })
    },
    del (item) { // 点击刪除
      this.loading = true
      this.$api.column.clear({
        id: item.id,
        mediaType: item.mediaType
      }).then(res => {
        this.loading = false
        this.getList(1)
      })
    },
    onhandleOk () {
      this.showEditor = false
      this.getList()
    },
    onhandleCancel () {
      this.showEditor = false
    },
    upItem (item, offline) { // 发布、停止试卷
      this.loading = true
      var parmas = {}
      if (offline === 0) {
        parmas = {
          id: item.id,
          publishSetting: -2
        }
      } else {
        parmas = {
          id: item.id,
          publishSetting: 1
        }
      }
      this.$api.column.publish(parmas).then(res => {
        this.getList()
      })
    }
  }
}
</script>
<style scope>
  .specialColumn .ant-row{margin-bottom:20px;}
  .specialColumn .ant-table-tbody .course_title{margin-bottom:0;line-height:24px;display:block;width:100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
  .specialColumn .customTd{display:flex;}
  .specialColumn .customTd img{width:90px;height:90px;margin-right:10px;vertical-align:top;cursor: pointer;}
  .specialColumn .description{flex:1;}
  .specialColumn .description p{line-height:25px; height: 50px; margin:0;padding:0;cursor: pointer;overflow: hidden;}
</style>
