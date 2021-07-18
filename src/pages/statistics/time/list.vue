<template>
  <div class="timeData">
    <div class="block">
      <a-row>
        <a-col :span="4">
          <h2>学习分析</h2>
        </a-col>
        <a-col :span="6">
          <a-radio-group v-model="searchParmas.type" @change="getStudyData(false)" buttonStyle="solid">
            <a-radio-button value="week">近一周</a-radio-button>
            <a-radio-button value="month">近一月</a-radio-button>
          </a-radio-group>
        </a-col>
        <a-col :span="10">
          <a-range-picker v-model="searchParmas.timeslot" :allowClear="false" :disabledDate="disabledDate" @change="getStudyData(true)"></a-range-picker>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <div class="dataContent">
            <span>学习人数</span><strong>{{studyData.learned_num}}</strong>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="dataContent">
            <span>总学习时长(小时)</span><strong>{{parseInt(studyData.learned_duration / 60 / 60 * 100) / 100}}</strong>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="dataContent">
            <span>人均学习时长(小时)</span><strong>{{parseInt(studyData.avg_duration / 60 / 60 * 100) / 100}}</strong>
          </div>
        </a-col>
      </a-row>
      <div id="studyData" :style="{width: '100%', height: '400px'}"></div>
    </div>
    <a-row>
      <a-col align="right">
        <i-filter :filters="filters"  @search="onSearch" placeholder="学员姓名"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columnsCourse" :dataSource="tableData" rowKey="index" :loading="loading" :pagination="false" @change="handleTableChange">
      <template slot="created_at_day" slot-scope="td">
        {{ td | timeFormat("yyyy-MM-dd") }}
      </template>
      <template slot="learned_duration" slot-scope="td">
        {{ td | durationFormat('分') }}
      </template>
      <span slot="action" slot-scope="action">
        <a href="javascript:;" @click="toDetails(action)">查看详情</a>
      </span>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
import moment from 'moment'
const columnsCourse = [
  { title: '学员姓名', dataIndex: 'nickname', key: 'nickname' },
  { title: '学习时间', key: 'created_at_day', dataIndex: 'created_at_day', scopedSlots: { customRender: 'created_at_day' }, align: 'center', sorter: true, width: 110 },
  { title: '学习讲/任务数', key: 'item_num', dataIndex: 'item_num', align: 'center', sorter: true, width: 160 },
  { title: '学习时长', key: 'learned_duration', dataIndex: 'learned_duration', scopedSlots: { customRender: 'learned_duration' }, align: 'center', sorter: true, width: 140 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 100 }
]
export default {
  name: 'timeListData',
  data () {
    return {
      loading: false,
      columnsCourse,
      searchParmas: {
        type: 'week',
        timeslot: []
      },
      studyData: {
        avg_duration: 0,
        learned_duration: 0,
        learned_num: 0
      },
      pagination: {
        type: '资源',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: ''
      },
      tableData: []
    }
  },
  mounted () {
    this.getList()
    this.getStudyData()
  },
  methods: {
    moment,
    disabledDate (current) {
      return current.valueOf() >= moment(Date.parse(new Date())).valueOf()
    },
    getStudyData (picker) {
      let searchParmas = {
        type: this.searchParmas.type,
        timeslot: this.searchParmas.timeslot
      }
      if (picker) {
        searchParmas.timeslot = searchParmas.timeslot.map(item => {
          return parseInt(new Date(item._d).getTime() / 1000)
        })
        searchParmas.type = ''
      } else {
        searchParmas.timeslot = ''
      }
      this.$api.home.echarts(searchParmas).then(res => {
        if (res && !res.code && res.data) {
          this.studyData = res.data
          const data = res.data.chart
          this.days = data.map(item => {
            let date = new Date(item.created_at_day * 1000)
            let y = date.getFullYear()
            let m = date.getMonth() + 1
            let d = date.getDate()
            return y + '-' + m + '-' + d
          })
          this.learneds = data.map(item => {
            return item.learned_num
          })
          this.datas = this.durations = data.map(item => {
            return (item.learned_duration / 3600).toFixed(2)
          })
          this.searchParmas.type = res.data.choiceType
          this.searchParmas.timeslot = [this.moment(new Date(res.data.start * 1000).toLocaleDateString()), this.moment(new Date(res.data.end * 1000).toLocaleDateString())]
          let studyData = this.$echarts.init(document.getElementById('studyData'))
          studyData.setOption({
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.days
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value} (小时)'
              }
            },
            tooltip: {
              trigger: 'axis',
              formatter: '{b}<br /> 总学习时长: {c} 小时'
            },
            series: [{
              smooth: true,
              data: this.datas,
              type: 'line',
              areaStyle: {
                normal: {
                  color: 'rgba(120,190,255, 0.5)' // 改变区域颜色
                }
              },
              itemStyle: {
                normal: {
                  color: '#ffffff',
                  lineStyle: {
                    color: 'rgb(120,150,250)'
                  }
                }
              }
            }]
          })
        }
      })
    },
    onSearch (filters) {
      this.filters = filters
      this.getList(1)
    },
    handleTableChange (pagination, filters, sorter) {
      if (sorter.order) {
        let order = sorter.order === 'descend' ? 'desc' : 'asc'
        this.getList(this.pagination.current_page, this.$store.state.pageSize, sorter.field, order)
      } else {
        this.getList(this.pagination.current_page, this.$store.state.pageSize)
      }
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize, colum, direction) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.timeData.list({
        current_page,
        per_page,
        order_by_column: colum,
        order_by_direction: direction,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.tableData = res.data.list.map((item, index) => {
            item.index = index
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
    toDetails (item) {
      let query = {
        id: item.hash_user_id,
        searchTime: item.created_at_day
      }
      this.$router.push({
        path: '/statistics/time/detail',
        query
      })
    }
  }
}
</script>
<style lang="less">
.timeData {
  .block {
    border: 1px solid #e0e0e0;
    padding: 12px;
    margin-bottom: 12px;
    h2{font-size: 18px;font-weight: 700;height: 32px;line-height: 32px;margin-bottom: 12px;}
    .collect{
      position: relative;
      .chartsTitle{height: 30px;line-height: 30px;font-size: 16px;}
      .collectTotal{position: absolute;height: 30px;font-size: 20px;;line-height: 30px;width: 120px;text-align: center;top:115px;left: 50%;margin-left: -60px;}
    }
    .dataContent{
      padding: 10px 0;
      height: 160px;
      line-height: 70px;
      text-align: center;
      span{display: block;font-size: 16px;font-weight: 700;}
      strong{display: block;font-size: 36px;}
    }
  }
}

</style>
