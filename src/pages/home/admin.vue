<template>
<div>
  <a-row :gutter="[24]" style="margin: 0 0 24px 0">
    <a-col :sm="24" :md="12" :xl="6" class="overView">
      <chart-card title="课程中心" :total="this.dataOverView.courseTotal">
        <p>昨日新增<em>{{this.dataOverView.yesterdayPublishedCourseTotal}}</em></p>
      </chart-card>
    </a-col>
    <a-col :sm="24" :md="12" :xl="6" class="overView">
      <chart-card title="已审课程数量" :total="this.dataOverView.auditedCourseTotal">
        <p>待审批<span>{{this.dataOverView.waitAuditCourseTotal}}</span></p>
      </chart-card>
    </a-col>
    <a-col :sm="24" :md="12" :xl="6" class="overView">
      <chart-card title="接入企业" :total="this.dataOverView.developerTotal">
        <p>昨日新增<em>{{this.dataOverView.yesterdayCreatedDeveloperTotal}}</em></p>
      </chart-card>
    </a-col>
    <a-col :sm="24" :md="12" :xl="6">
      <chart-card title="总学习人次" :total="this.studyTimes.totalStudyTimes">
        <div>
          <mini-bar/>
        </div>
      </chart-card>
    </a-col>
  </a-row>
  <div class="block">
    <a-row>
      <a-col :span="6">
        <h2>审课数量</h2>
      </a-col>
      <a-col :span="6" align="right">
        <a-radio-group v-model="searchParmas.type" @change="getAuditData(false)" buttonStyle="solid">
          <a-radio-button value="week">近一周</a-radio-button>
          <a-radio-button value="month">近一月</a-radio-button>
        </a-radio-group>
      </a-col>
      <a-col :span="12" align="right">
        <a-range-picker v-model="searchParmas.timeslot" @change="getAuditData(true)" :allowClear="false" :disabledDate="disabledDate"></a-range-picker>
      </a-col>
    </a-row>
    <div class="flexBox" style="display:flex;">
      <div id="AuditData" :style="{width: '100%', height: '400px'}"></div>
      <div id="AuditPie" :style="{width: '100%', height: '400px'}"></div>
    </div>
  </div>
  <div class="block">
    <a-row>
      <a-col :span="6">
        <h2>学习时长</h2>
      </a-col>
      <a-col :span="6" align="right">
        <a-radio-group v-model="searchParmas.type" @change="getStudyData(false)" buttonStyle="solid">
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
    <div class="flexBox">
      <div id="studyData" :style="{width: '100%', height: '400px'}"></div>
      <div class="hotBox">
        <div class="title">
          <strong>学习时长排行</strong>
        </div>
        <a-table size="small" :columns="userColumns" :dataSource="studentHot" rowKey="index" :bordered="false" :pagination="false">
          <span slot="username" slot-scope="td, tr" class="nameTd">
            <a-tooltip>
              <template slot="title">
                {{tr.name}}
              </template>
              {{tr.name}}
            </a-tooltip>
          </span>
          <template slot="learned_duration" slot-scope="learned_duration">
            <span>{{(learned_duration / 60 / 60).toFixed(1)}}小时</span>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import ChartCard from '../../components/card/ChartCard'
import MiniArea from '../../components/chart/MiniArea'
import MiniBar from '../../components/chart/MiniBar'

const rankList = []
const userColumns = [
  { title: '企业名称', dataIndex: 'username', key: 'username', scopedSlots: { customRender: 'username' } },
  { title: '学习时长', dataIndex: 'learned_duration', key: 'learned_duration', scopedSlots: { customRender: 'learned_duration' }, align: 'right', width: 140 }
]
for (let i = 0; i < 8; i++) {
  rankList.push({
    name: '桃源村' + i + '号店',
    total: 1234.56 - i * 100
  })
}

export default {
  name: 'adminHost',
  data () {
    return {
      userColumns,
      studentHot: [],
      rankList,
      dataOverView: '',
      studyTimes: '',
      searchParmas: {
        type: 'week',
        data_type: 'counts',
        timeslot: []
      },
      studyData: {
        avg_duration: 0,
        learned_duration: 0,
        learned_num: 0
      },
      type: 1
    }
  },
  components: {MiniBar, MiniArea, ChartCard},
  mounted () {
    this.getDataOverView()
    this.getAuditData()
    this.getStudyData()
  },
  methods: {
    moment,
    getDataOverView () {
      this.$api.home.overView().then(res => {
        if (res && !res.code && res.data) {
          this.dataOverView = res.data
          this.studyTimes = res.data.studyTimes
        }
      })
    },
    disabledDate (current) {
      return current.valueOf() >= moment(Date.parse(new Date())).valueOf()
    },
    callback (key) {
      this.getStudyData(false, key)
    },
    getAuditData (picker) {
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
      this.$api.home.courseAuditTotalInfo(searchParmas).then(res => {
        if (res && !res.code && res.data) {
          let data = res.data.list.map(item => {
            return item.num
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
          let studyData = this.$echarts.init(document.getElementById('AuditData'))
          studyData.setOption({
            xAxis: {
              type: 'category',
              boundaryGap: true,
              data: days
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            },
            tooltip: {
              trigger: 'axis',
              formatter: '{b} : {c}'
            },
            series: [{
              name: '通过审批个数',
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
          let pieData = [
            {
              name: '已通过',
              value: res.data.pass
            },
            {
              name: '未通过',
              value: res.data.unpass
            },
            {
              name: '审批中',
              value: res.data.wait
            }
          ]
          let studyPie = this.$echarts.init(document.getElementById('AuditPie'))
          studyPie.setOption({
            title: {
              text: '',
              left: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}:{c}'
            },
            color: ['#80aa6e', '#d10000', '#d7b140'],
            legend: {
              bottom: 20,
              left: 'center',
              data: ['已通过', '未通过', '审批中']
            },
            series: [
              {
                name: '',
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                selectedMode: 'single',
                data: pieData,
                label: {
                  normal: {
                    position: 'inner',
                    show: false
                  }
                },
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          })
        }
      })
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
      this.$api.home.studyData(searchParmas).then(res => {
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
