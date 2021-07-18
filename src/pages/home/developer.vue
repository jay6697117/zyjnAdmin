<template>
<div class="devBody">
  <a-row :gutter="[24]" style="margin: 0 0 24px 0">
    <a-col :sm="24" :md="12" :xl="6" class="overView">
      <chart-card title="购买人数">
        <div class="contentNumber">
          {{data.staff_upper_limit}}
        </div>
      </chart-card>
    </a-col>
    <a-col :sm="24" :md="12" :xl="6" class="overView">
      <chart-card title="已学人数">
        <div class="contentNumber">
          {{data.total_study_user}}
        </div>
      </chart-card>
    </a-col>
  </a-row>
  <div class="block">
    <a-row>
      <a-col :span="6">
        <h2>学习时长</h2>
      </a-col>
      <a-col :span="6" align="right">
        <a-radio-group v-model="searchParmas.type" @change="getStudyData()" buttonStyle="solid">
          <a-radio-button value="week">近一周</a-radio-button>
          <a-radio-button value="month">近一月</a-radio-button>
        </a-radio-group>
      </a-col>
      <a-col :span="12" align="right">
        <a-range-picker v-model="searchParmas.timeslot" @change="getStudyData(true)" :allowClear="false" :disabledDate="disabledDate"></a-range-picker>
      </a-col>
    </a-row>
    <a-tabs default-active-key="counts" @change="callback">
      <a-tab-pane key="counts" tab="学习人数"></a-tab-pane>
      <a-tab-pane key="times" tab="学习时长"></a-tab-pane>
    </a-tabs>
    <div id="studyData" :style="{width: '100%', height: '400px'}"></div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import ChartCard from '../../components/card/ChartCard'
const userColumns = [
  // { title: '排名', dataIndex: 'order', width: '48px' },
  { title: '学员名称', dataIndex: 'username', key: 'username', scopedSlots: { customRender: 'username' } },
  { title: '学习时长', dataIndex: 'learned_duration', key: 'learned_duration', scopedSlots: { customRender: 'learned_duration' }, align: 'right', width: 140 }
]
export default {
  name: 'developerHost',
  data () {
    return {
      data: '',
      userColumns,
      studyData: {},
      searchParmas: {
        type: 'week',
        data_type: 'counts',
        timeslot: []
      }
    }
  },
  components: {
    ChartCard
  },
  mounted () {
    this.getData()
    this.getStudyData()
  },
  methods: {
    moment,
    getData () {
      this.$api.home.getDevData().then(res => {
        if (res && !res.code && res.data) {
          this.data = res.data
        }
      })
    },
    disabledDate (current) {
      return current.valueOf() >= moment(Date.parse(new Date())).valueOf()
    },
    callback (key) {
      this.getStudyData(false, key)
    },
    getStudyData (picker, type) {
      if (type) {
        this.searchParmas.data_type = type
      }
      let searchParmas = {
        type: this.searchParmas.type,
        timeslot: this.searchParmas.timeslot,
        data_type: this.searchParmas.data_type
      }
      if (picker) {
        searchParmas.timeslot = searchParmas.timeslot.map(item => {
          return parseInt(new Date(item._d).getTime() / 1000)
        })
        searchParmas.type = ''
      } else {
        searchParmas.timeslot = ''
      }
      this.$api.home.getDevStudy(searchParmas).then(res => {
        if (res && !res.code && res.data) {
          this.studentHot = res.data.orgList
          let data = res.data.list.map(item => {
            if (type === 'times') {
              return item.num ? (item.num / 60 / 60).toFixed(1) : 0
            } else {
              return item.num
            }
          })
          let days = res.data.list.map(item => {
            let date = new Date(item.created_at_day * 1000)
            let y = date.getFullYear()
            let m = date.getMonth() + 1
            let d = date.getDate()
            return y + '-' + m + '-' + d
          })
          this.searchParmas.type = res.data.choiceType
          this.searchParmas.timeslot = [this.moment(new Date(res.data.start * 1000).toLocaleDateString()), this.moment(new Date(res.data.end * 1000).toLocaleDateString())]
          let studyData = this.$echarts.init(document.getElementById('studyData'))
          studyData.setOption({
            xAxis: {
              type: 'category',
              boundaryGap: true,
              data: days
            },
            yAxis: {
              type: 'value',
              minInterval: type === 'times' ? 0.1 : 1,
              axisLabel: {
                formatter: '{value}'
              }
            },
            tooltip: {
              trigger: 'axis',
              formatter: '{b} : {c}' + (type === 'times' ? '小时' : '人')
            },
            series: [{
              name: '总学习时长',
              smooth: true,
              data: data,
              type: 'bar',
              areaStyle: {
                normal: {
                  color: 'rgba(120,190,255, 0.5)' // 改变区域颜色
                }
              },
              itemStyle: {
                normal: {
                  color: '#1890ff',
                  lineStyle: {
                    color: 'rgb(120,150,250)'
                  }
                }
              }
            }]
          })
        }
      })
    }
  }
}
</script>
<style>
  .devBody .contentNumber{font-size: 32px;}
</style>
