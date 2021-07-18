<template>
  <div class="examineDetail">
    <a-row :gutter="20">
      <a-col :span="18">
        <a-row class="examineTop" :gutter="20">
          <a-col :span="4">
            <div class="cover" :style="`background-image: url(${info.cover_url})`"></div>
          </a-col>
          <a-col :span="20" class="examineText">
            <div class="title">{{info.title}}</div>
            <div class="examineItem">课程服务商：{{info.contentProviderName}}</div>
            <a-result title="已通过" v-if="info.audit_status === 1"></a-result>
            <a-result title="不通过" v-else-if="info.audit_status === 2"></a-result>
            <a-result title="已撤回" v-else-if="info.audit_status === 3"></a-result>
            <a-result title="审批中" v-else-if="info.audit_status === 0 && !info.isCurrentAuditUser"></a-result>
            <div v-else>
              <a-button type="primary" @click="pass(1)">通过</a-button>
              <a-button type="danger" @click="pass(2)">不通过</a-button>
            </div>
          </a-col>
        </a-row>
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="课程介绍" key="1">
            <div class="introduce" v-html="info.content"></div>
          </a-tab-pane>
          <a-tab-pane tab="课程目录" key="2" forceRender>
            <div class="myTaskList">
              <ol>
                <li v-for="(item, index) in info.lessons" :key="item.hash_id">
                  <span class="index"> {{ index + 1 }} </span>
                  <span class="speed" @click="review(item)"> 点击试看 <a-icon type="right" /> </span>
                  <div class="title">
                    <a-tag size="small" :color="item.media_type === 'video' ? '#FA6400' : '#44D7B6'"> {{ types[item.media_type] }} </a-tag>
                    {{ item.name }}
                  </div>
                  <span class="time"> 更新于 {{ item.updated_at | timeFormat('yyyy-MM-dd hh:mm') }} </span>
                </li>
              </ol>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span="6" class="courseHistory">
        <a-collapse :default-active-key="active" :bordered="false">
          <a-collapse-panel :key="index"  v-for="(item, index) in history">
            <p slot="header">
              第{{item.index}}次审批结果
              <span v-if="item.result === 0">（审批中）</span>
              <span style="color:red" v-if="item.result === 2">（审批不通过）</span>
              <span style="color:green" v-if="item.result === 1">（审批通过）</span>
            </p>
            <a-timeline>
              <a-timeline-item v-for="(it, i) in item.history" :key="i">
                <a-icon slot="dot" type="info-circle" style="font-size: 14px;color: #999" v-if="it.type === 1" />
                <a-icon slot="dot" type="info-circle" style="font-size: 14px;color: #999" v-else-if="it.audit_status === 0" />
                <a-icon slot="dot" type="check-circle" style="font-size: 14px;color: #108ee9" v-else-if="it.audit_status === 1" />
                <a-icon slot="dot" type="close-circle" style="font-size: 14px;color: #f50" v-else-if="it.audit_status === 2" />
                <span style="float:right;">{{it.time | timeFormat('yyyy-MM-dd hh:mm')}}</span>
                <span style="color: #2db7f5" v-if="it.type === 1">发起审批</span>
                <span style="color: #999" v-else-if="it.audit_status === 0">待审批</span>
                <strong style="color: #87d068" v-else-if="it.audit_status === 1">审批通过</strong>
                <strong style="color: #f50" v-else-if="it.audit_status === 2">审批不通过</strong>
                <div style="font-size: 12px;"><img :src="it.avatar" alt="">{{it.name}}</div>
              </a-timeline-item>
            </a-timeline>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>

    <a-modal :title="lessonItem.name" :visible="visible" :footer="null" @cancel="mediaCancel" width="75%" destroyOnClose height="80%" class="resourceBoxModal">
      <vue-aliplayer-v2 :source="lessonItem.file_url" ref="VueAliplayerV2" :options="options" :class="lessonItem.media_type"/>
    </a-modal>
  </div>
</template>
<script>
import global from '@/utils/global'
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
  name: 'mallDetail',
  data () {
    return {
      global,
      active: [],
      lessonItem: {},
      types: {
        video: '视频',
        audio: '音频'
      },
      info: {},
      visible: false,
      options: {
        height: '450px',
        skinLayout: skinLayout,
        cover: ''
      },
      history: []
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  mounted () {
    this.getDetail()
    this.$api.examineCourse.history({hash_course_id: this.id}).then(res => {
      if (!res.code) {
        let history = res.data.history
        if (history.length) {
          this.history = history.map(item => {
            item.history.reverse()
            return item
          }).reverse()
          this.active = [0]
        }
      }
    })
  },
  methods: {
    pass (state) {
      this.$api.examineCourse.examine({
        hash_course_id: this.id,
        pass: state
      }).then(res => {
        if (res && !res.code) {
          this.$router.push({
            path: '/examine/list',
            query: {
              unTips: true
            }
          })
        }
      })
    },
    review (item) {
      this.visible = true
      this.lessonItem = item
      this.options.cover = item.coverUrl
    },
    mediaCancel () {
      this.visible = false
    },
    getDetail () {
      this.$api.examineCourse.info({
        hash_id: this.id,
        audit: 1
      }).then(res => {
        if (res && !res.code && res.data) {
          this.info = res.data
        }
      })
    }
  }
}
</script>

<style lang="less">
  .examineDetail{
    width: 100%;
    margin: 0 auto;
    padding-bottom: 24px;
  }
  .examineTop{
    margin-top: 40px;
    .cover{width: 100%;padding-top: 75%;background: no-repeat center center/cover;height: 130px;}
    .examineText{
      position: relative;
      .ant-btn {width: 100px; text-align: center;}
      .ant-result{
        padding: 0; width: 150px;position: absolute;right: 24px;top: 0;
        .ant-result-icon{margin-bottom: 10px;}
      }
    }
    .title{ height: 60px; font-size: 16px;line-height: 30px;overflow: hidden;font-weight: 700;}
    .examineItem{
      padding: 5px 0;
      line-height: 28px;
      strong{font-weight: 500;color: #909090;}
      .ant-radio-button-wrapper{height: 28px;line-height: 26px;}
    }
  }

  .introduce{
    img{max-width: 100%;}
  }
  .myTaskList{
    padding: 0 2rem;
    ol {
      margin: 0;padding: 0;
      li {
        list-style: none;padding: 24px 24px 24px 90px;position: relative;border-bottom: 1px solid #D8D8D8;font-size: 12px;color: #666;line-height: 20px;
        .index{color: #999;font-size: 12px;position: absolute;left: 24px;}
        .ant-tag {border: none;height: 18px;line-height: 18px;margin-right: 6px;position: absolute;left: 45px;}
        .speed{float: right;margin-right: 0;color: #999;cursor: pointer;}
        span{margin-right: 20px;}
        .title{font-size: 14px;color: #000;height: 20px;margin-right: 70px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
      }
    }
  }
  .resourceBoxModal{padding-bottom:0;}
  .resourceBoxModal .ant-modal-header{height:55px;}
  .resourceBoxModal .ant-modal-header .ant-modal-title{width:100%;height:23px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;}
  .resourceBoxModal .prism-player.audio .prism-cover{z-index:0;display:block!important;}
  .courseHistory .ant-timeline-item span{font-size: 14px;}
  .courseHistory .ant-timeline-item img{width:20px;height:20px;border-radius:50%;float:left;margin-right: 6px;}
</style>
