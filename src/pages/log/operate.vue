<template>
    <div>
      <a-row :gutter="20" style="margin-bottom:20px">
        <a-col class="gutter-row">
            <a-button @click="filter($event)">近一周</a-button>
            <a-button @click="filter($event)">近一个月</a-button>
            <a-button @click="filter($event)">近三个月</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col class="gutter-row" :span="24">
          <a-table :columns="columns" :dataSource="logData" :loading="loading" :rowKey="record => record.log_id" :pagination="false">
            <span slot="type" slot-scope="type">
              <a-tag v-if="type == 1" color="cyan">成功</a-tag>
              <a-tag v-if="type == 2" color="green">失败</a-tag>
            </span>
            <span slot="created_time" slot-scope="created_time">{{created_time | timeFormat('yyyy-MM-dd')}}</span>
          </a-table>
          <a-pagination :defaultCurrent="6" :total="dataTotal" :pageSize.sync="searchData.per_page" @change="changePage" :current="searchData.current_page"/>
        </a-col>
      </a-row>
    </div>
</template>
<script>
const columns = [
  { title: '日志编号', dataIndex: 'log_id', key: 'log_id', width: 120 },
  { title: '操作模块', dataIndex: 'module', key: 'module' },
  { title: '操作人员', dataIndex: 'user.username', key: 'user.username' },
  { title: 'IP', dataIndex: 'ip', key: 'ip', width: 260 },
  { title: '操作内容', dataIndex: 'message', key: 'message' },
  { title: '状态', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
  { title: '时间', dataIndex: 'created_time', scopedSlots: { customRender: 'created_time' }, key: 'created_time' }
]
export default {
  name: 'log',
  data () {
    return {
      user: '',
      landscape: [],
      logData: [],
      columns,
      loading: false,
      dataTotal: 0,
      searchData: {
        time_type: '',
        per_page: 10,
        current_page: 1,
        fields: 'log_id,message,ip,created_time,module,level,user_id',
        order_by_column: 'created_time',
        order_by_direction: 'desc'
      }
    }
  },
  methods: {
    initData: function (params) {
      this.loading = true
      this.$api.log.findLogOperate(params).then(res => {
        if (Number(res.code) === 0) {
          this.loading = false
          this.logData = res.data.list
          this.user = res.data.list.user
          for (var i = 0; i < this.logData.length; i++) {
            if (this.logData[i].ip !== '' && this.logData[i].area !== '') {
              this.logData[i].ip = this.logData[i].ip + '-' + this.logData[i].area
            }
          }
          this.dataTotal = Number(res.data.info.total)
        } else {
          this.$message.info(res.msg)
        }
      })
    },
    changePage (current) {
      this.searchData.current_page = current
      console.log('changePage', this.searchData)
      this.initData(this.searchData)
    },
    filter (e) {
      if (e.srcElement.innerText === '近一周') {
        this.searchData.time_type = 1
      } else if (e.srcElement.innerText === '近一个月') {
        this.searchData.time_type = 2
      } else if (e.srcElement.innerText === '近三个月') {
        this.searchData.time_type = 3
      }
      this.initData(this.searchData)
    }
  },
  mounted () {
    console.log('mounted', this.searchData)
    this.initData(this.searchData)
  }
}
</script>

<style lang="less">
  .indexMain{color: #000;}
  .ant-pagination{text-align: right;margin-top:20px;}
</style>
