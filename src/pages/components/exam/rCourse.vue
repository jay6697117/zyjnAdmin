<template>
  <div class="rCourse">
    <a-table :columns="columns" :dataSource="data" :rowSelection="{selectedRowKeys: selectedRowKeys,selectedRows: selectedRows,onChange: onSelectChange, getCheckboxProps: ongetCheckboxProps}" rowKey="id" :pagination="pagination" :loading="loading">
      <div slot="pic" slot-scope="text" class="customTd">
        <img :src="text.url"/>
      </div>
    </a-table>
  </div>
</template>
<script>
const columns = [
  {dataIndex: 'name', key: 'name', slots: { title: 'title' }, scopedSlots: { customRender: 'pic' }, align: 'left', width: 100},
  {title: '试卷名称', dataIndex: 'title', key: 'title', align: 'left'}
]
const transData = {}
export default {
  name: 'rCourse',
  data () {
    let self = this
    return {
      search: false,
      fromType: this.$store.state.fromType,
      columns,
      selectedRowKeys: this.$store.state.relatedId,
      selectedRows: [],
      transData,
      data: [],
      loading: false,
      tableInfo: {total: 0},
      pagination: {
        current_page: 1,
        pageSize: 3, // 默认每页显示数量
        showTotal: total => `${self.name}数量 ${self.tableInfo.total} 个`, // 显示总数
        onChange: (page, pageSize) => self.getCourseInfo(page, pageSize), // 点击页码事件
        total: 0 // 总条数
      },
      columnCourseList: this.$store.state.relatedId,
      resourceList: []
    }
  },
  props: ['name', 'type', 'keyword', 'btnFlag', 'searchFlag', 'vals'],
  mounted () {
    this.getCourseInfo(1)
  },
  watch: {
    btnFlag: function () {
      if (this.btnFlag === true) {
        this.getCourseInfo(1)
      }
    },
    searchFlag: function () {
      this.search = this.searchFlag
      if (this.search === true) {
        this.getCourseInfo(1)
      }
    },
    '$store.state.relatedId': function (val) {
      this.columnCourseList = val
      this.selectedRowKeys = val
    },
    '$store.state.fromtype': function (val) {
      this.fromType = val
      this.getCourseInfo(1)
    }
  },
  methods: {
    getCourseInfo (page, pageSize) {
      this.loading = true
      this.$api.content.list({
        url: '/' + this.type + '/search',
        keyword: this.keyword,
        current_page: page,
        per_page: this.pagination.pageSize,
        publishSetting: 1
      }).then(res => {
        if (res.code === 0) {
          if (res.data.list) {
            this.data = res.data.list.map((item) => {
              item.name = {
                url: item.mediaCoverUrl
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
          this.search = false
        }
        this.loading = false
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      localStorage.setItem(this.type, JSON.stringify(this.selectedRowKeys))
    },
    ongetCheckboxProps (record) {
      return ({
        props: {
          disabled: this.columnCourseList.some(item => item === record.id)
        }
      })
    }
  }
}
</script>
<style scope>
  .rCourse thead{display: none;}
</style>
