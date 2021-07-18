<template>
    <div>
      <a-row :gutter="20" style="margin-bottom:20px">
        <a-col class="gutter-row" :span="6">
          <a-input placeholder="搜索手机号" v-model="searchData.mobile" :maxLength="11"/>
        </a-col>
        <a-col class="gutter-row" :span="6">
          <a-input placeholder="IP" v-model="searchData.ip"/>
        </a-col>
        <a-col class="gutter-row" :span="6">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col class="gutter-row" :span="3">
          <a-button type="primary" icon="search" @click="search">查询</a-button>
        </a-col>
        <a-col class="gutter-row" :span="3">
          <a-button type="primary" icon="undo" @click="reset">重置</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col class="gutter-row" :span="24">
          <a-table :columns="columns" :dataSource="logData" :loading="loading" :rowKey="record => record.id" :pagination="false">
          </a-table>
          <a-pagination :defaultCurrent="1" :total="dataTotal" :pageSize.sync="searchData.per_page" @change="changePage" :current="searchData.current_page"/>
        </a-col>
      </a-row>
    </div>
</template>
<script>
const columns = [
  { title: '账号信息', dataIndex: 'user.mobile', key: 'user.mobile', width: 120 },
  // { title: '部门', dataIndex: 'user.org_name', key: 'user.org_name' },
  { title: '登录终端型号', dataIndex: 'browser', key: 'browser' },
  { title: '操作系统', dataIndex: 'platform', key: 'platform' },
  { title: 'IP', dataIndex: 'ip', key: 'ip' },
  { title: '时间', dataIndex: 'created_time', key: 'created_time' },
  { title: '异常现象', dataIndex: 'message', key: 'message' }
]
export default {
  name: 'log',
  data () {
    return {
      landscape: [],
      logData: [],
      columns,
      loading: false,
      dataTotal: 0,
      pageSize: 0,
      searchData: {
        mobile: '',
        ip: '',
        range_time: [],
        per_page: 10,
        current_page: 1,
        fields: 'id,message,user_id,ip,area,browser,platform,status,created_time',
        order_by_column: 'created_time',
        order_by_direction: 'desc',
        type: 2
      }
    }
  },
  methods: {
    initData: function (params) {
      this.loading = true
      this.$api.log.findLogEnter(params).then(res => {
        if (Number(res.code) === 0) {
          this.loading = false
          this.logData = res.data.list
          for (var i = 0; i < this.logData.length; i++) {
            this.logData[i].created_time = this.dateFormat(this.logData[i].created_time * 1000)
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
    dateFormat: function (times) {
      var date = new Date(parseInt(times))
      var Y = date.getFullYear() + '.'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.'
      var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
      var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
      var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
      var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
      return (Y + M + D + h + m + s)
    },
    onChange (value, dateString) {
      this.searchData.range_time = dateString
    },
    search () {
      this.initData(this.searchData)
    },
    changePage (current) {
      this.searchData.page = current
      this.initData(this.searchData)
    },
    reset () {
      this.searchData.mobile = ''
      this.searchData.ip = ''
      this.searchData.range_time = []
      this.searchData.page = 1
      var obj = document.querySelector('.ant-calendar-picker-clear')
      obj.click()
    }
  },
  mounted () {
    this.initData(this.searchData)
  }
}
</script>

<style lang="less">
  .indexMain{color: #000;}
  .ant-pagination{text-align: right;margin-top:20px;}
</style>
