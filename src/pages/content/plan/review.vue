<template>
  <div class="trainingDetails">
    <div class="grid-content" ref="imgSelf">
      <img  class="planImg" :src="planInfo.mediaCoverUrl" alt=""  @load="imgLoad" :height="height">
      <div class="coverText hide">
        <div class='detailsText hide'>
          <h2>{{planInfo.title}}</h2>
          <div class="contentInfo" v-html="planInfo.content"></div>
          <p><span>共{{parseInt(planInfo.course_num+planInfo.exam_num)}}个任务</span>{{planInfo.subscribeTotal}}人学过</p>
          <p><i class="el-icon-alarm-clock"></i>{{planInfo.start_time | timeFormat('yyyy/MM/dd')}}~{{planInfo.end_time | timeFormat('yyyy/MM/dd')}}</p>
          <div><a href="#">立即报名</a></div>
        </div>
      </div>
    </div>
    <div class="detailsText show">
      <h2>{{planInfo.title}}</h2>
      <div class="contentInfo" v-html="planInfo.content"></div>
      <p><span>共{{parseInt(planInfo.course_num+planInfo.exam_num)}}个任务</span>{{planInfo.subscribeTotal}}人学过</p>
      <p><i class="el-icon-alarm-clock"></i>{{planInfo.start_time | timeFormat('yyyy/MM/dd')}}~{{planInfo.end_time | timeFormat('yyyy/MM/dd')}}</p>
      <div><a href="#">立即报名</a></div>
    </div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="培训介绍">
        <div id="introduce">
          <div class="introduceBox">
            <h2>培训时间：{{planInfo.start_time | timeFormat('yyyy/MM/dd')}}~{{planInfo.end_time | timeFormat('yyyy/MM/dd')}}</h2>
            <h2>培训介绍</h2>
            <div class="contentInfo" v-html="planInfo.content"></div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="培训内容" force-render>
        <div id="list">
          <div class="listBox" v-for="(item,i) in detail" :key="i">
            <h3>{{item.title}}</h3>
            <ul class="listItem">
              <li>{{parseInt(i+1)}}</li>
              <li>
                <em :class="(item.resource_type==='exam'?'exam':'video')">{{item.resource_type==="exam"?'考试':(item.resource_type==="course"?'视频':'音频')}}</em><span>{{item.title}}</span>
              </li>
            </ul>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
export default {
  name: 'newReview',
  data () {
    return {
      detail: {},
      planInfo: {},
      height: ''
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    getDetails () {
      this.$api.plan.getInfo({
        hash_id: this.id
      }).then(res => {
        this.planInfo = res.data
      })
      this.$api.plan.itemList({
        hash_id: this.id
      }).then(res => {
        this.detail = res.data
      })
    },
    imgLoad () {
      let target = this.$refs.imgSelf.getBoundingClientRect().width
      this.height = target / 2 + 'px'
    }
  }
}
</script>
<style scope>
.trainingDetails{margin: 0 auto;max-width:1200px;}
.trainingDetails .grid-content{position: relative;}
.trainingDetails .grid-content img{max-width:1200px;width:100%;}
.trainingDetails .coverText{width:50%;position: absolute;right:0;top:0;height:100%;display: block;}
.trainingDetails .detailsText{left: 0;top: 0;bottom: 0;right: 0;position: absolute;height: 348px;
  width:90%;max-width: 393px;padding:26px 40px;background:rgba(0,0,0,0.6);color:#fff;margin:auto;}
.trainingDetails .detailsText h2{color:#fff;font-size:16px;font-weight:400;line-height:22px;margin-bottom:10px;overflow: hidden;-webkit-line-clamp: 1;line-clamp: 1;-webkit-box-orient: vertical;box-orient: vertical;display: -webkit-box;display: box;}
.trainingDetails .detailsText .contentInfo{display:inline-block;font-size:12px;line-height:17px;margin-bottom:24px;overflow: hidden;-webkit-line-clamp: 2;line-clamp: 2;-webkit-box-orient: vertical;box-orient: vertical;display: -webkit-box;display: box;text-align: left;}
.trainingDetails .detailsText>p{font-size:14px;line-height:20px;margin-bottom:24px;}
.trainingDetails .detailsText>p>span{display: inline-block;margin-right: 24px;}
.trainingDetails .detailsText>p>i{display: inline-block;margin-right: 5px;}
.trainingDetails .detailsText div{text-align: center;}
.trainingDetails .detailsText div>a{display:inline-block;font-size:16px;line-height:24px;padding:8px 20px;background:#1890FF;color:#fff;border-radius:2px;}
.trainingDetails #introduce>div,.trainingDetails #list>div{padding:20px;}
.trainingDetails #introduce h2,.trainingDetails #list h2{color:#000;line-height:22px;font-size:16px;font-weight: 400;margin-bottom: 12px;}
.trainingDetails #list h3{color:#000;line-height: 20px;font-size: 14px;font-family:PingFangSC-Medium,PingFang SC;padding-bottom:20px;}
.trainingDetails #introduce .introduceBox .contentInfo{font-size:12px;line-height: 17px;padding-bottom:10px;}
.trainingDetails #introduce .introduceBox img{max-width: 100%;margin:10px 0;}
.trainingDetails #list .listBox:last-child{border-bottom:none;}
.trainingDetails #list .listItem{padding: 20px 0 20px 24px;border-bottom: 1px solid #D8D8D8;font-weight: 400;color:#666666;font-size:12px;line-height: 17px;margin-bottom: 10px;}
.trainingDetails #list .listItem li{display: inline-block;height:100%;vertical-align: top;margin-right:20px;}
.trainingDetails #list .listItem li em{font-style: normal;color:#fff;padding:1px 4px;border-radius:5px;}
.trainingDetails #list .listItem li em.exam{background:#E02020;}
.trainingDetails #list .listItem li em.audio{background:#44D7B6;}
.trainingDetails #list .listItem li em.video{background:#FA6400;}
.trainingDetails #list .listItem li em.txt{background:#0091FF;}
.trainingDetails #list .listItem li span{display:inline-block;font-size:14px;color:#000;margin:0 0 8px 8px;}
@media only screen and (min-width: 951px){
  .detailsText.show {display: none;}
}
@media only screen and (max-width: 950px){
  .coverText.hide {display: none;}
  .trainingDetails .detailsText {height: 100%;margin-top: 10px;position: inherit;width: 100%;max-width:100%;}
}
</style>
