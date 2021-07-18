<template>
  <div class="mallDetail">
    <a-row class="detailTop" :gutter="20">
      <a-col :span="8">
        <div class="cover" :style="`background-image: url(${info.cover_url})`"></div>
      </a-col>
      <a-col :span="16" class="detailsText">
        <div class="title">{{info.title}}</div>
        <div class="detailItem"><strong>共 {{info.lesson_num}} 讲</strong><strong style="display:inline-block;margin-left:20px;">{{info.lesson_num}} 人学过</strong></div>
        <a-button type="primary" @click="review(info.tryViewLesson)">试看</a-button>
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
              <span class="speed" v-if="item.can_try_view" @click="review(item)"> 点击试看 <a-icon type="right" /> </span>
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
      }
    }
  },
  computed: {
    hash_id () {
      return this.$route.query.hash_id
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    review (item) {
      this.visible = true
      this.lessonItem = item
      this.options.cover = item.coverUrl
    },
    mediaCancel () {
      this.visible = false
    },
    getDetail () {
      this.$api.mall.getInfo({
        hash_id: this.hash_id
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
  .mallDetail{
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 24px;
  }
  .detailTop{
    margin-top: 40px;
    .cover{width: 100%;padding-top: 75%;background: no-repeat center center/cover;height:290px;}
    .detailsText{
      height:290px;
      .ant-btn {width: 100px; position: absolute; left: 10px; bottom: 0px; text-align: center;}
    }
    .title{ height: 60px; font-size: 16px;line-height: 30px;overflow: hidden;font-weight: 700;}
    .detailItem{
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
</style>
