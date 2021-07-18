<template>
  <div class="newsBox">
     <a-row :gutter="10">
      <a-col class="gutter-row" :xs="{ span: 24}" :lg="{ span: 10}">
        <div class="grid-content">
          <div class="listImg">
            <img :src="detail.course_info.mediaCoverUrl" alt="">
          </div>
        </div>
      </a-col>
      <a-col class="gutter-row" :xs="{ span: 24}" :lg="{ span: 14}">
        <div class='detailsText'>
          <h2>{{detail.course_info.title}}</h2>
          <div class="contentInfo" v-html="detail.course_info.content"></div>
          <p><span>共{{detail.course_info.lesson_num}}讲</span>{{detail.course_info.learnedTotal}}人学过</p>
          <a href="#">报名学习</a>
        </div>
      </a-col>
    </a-row>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="课程介绍">
        <div id="introduce">
          <div class="teacherBox">
            <h2>课程讲师</h2>
            <img :src="detail.course_info.avatar" alt="">
            <p><span>{{detail.course_info.username}}</span><strong>人事经理，负责新人入职培训</strong></p>
          </div>
          <div class="introduceBox">
            <h2>详情介绍</h2>
            <div class="contentInfo" v-html="detail.course_info.content"></div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="课程目录" force-render>
        <div id="list">
          <ul class="listItem" v-for="(item,i) in detail.list" :key="i">
            <li>{{parseInt(i+1)}}</li>
            <li>
              <em :class="item.mediaType">{{item.mediaType==="video"?'视频':'音频'}}</em><span>{{item.name}}</span>
              <p>更新于{{item.created_at | timeFormat('yyyy-MM-dd')}}<i></i>0</p>
            </li>
          </ul>
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
      detail: {
        course_info: {}
      }
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
      this.$api.course.lessons({// 编辑时请求远端数据
        hash_resource_id: this.id
      }).then(res => {
        this.detail = res.data
      })
    }
  }
}
</script>
<style scope>
  .newsBox{margin: 0 auto;width:100%;max-width:1200px;overflow: hidden;}
  .newsBox h1.title{color: #000;}
  .newsBox .origin{background: rgb(249, 243, 243); color: rgba(147, 148, 155, 1);padding: 12px 15px;margin-top: 15px;}
  .newsBox .origin p{padding: 5px 0;margin: 0;}
  .newsBox .content img{max-width: 100%;}
  .newsBox .listImg{height:auto;padding-top: 75%;position: relative;}
  .newsBox .listImg img{position: absolute;top: 0;left: 0;max-width:100%;height: 345px;display: block;}
  .newsBox .detailsText{height:100%;position: relative;padding-left: 12px;padding-right: 12px;}
  .newsBox .detailsText h2{font-size:16px;font-weight:400;color:#000;line-height:22px;padding:2px 0 12px 0;width:100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;}
  .newsBox .detailsText .contentInfo{font-size:12px;color:#666;line-height:17px;overflow: hidden;-webkit-line-clamp: 2;line-clamp: 2;-webkit-box-orient: vertical;box-orient: vertical;display: -webkit-box;display: box;height:34px;}
  .newsBox .detailsText>p{font-size:14px;color:#666;line-height:20px;margin:26px 0;}
  .newsBox .detailsText>p span{display: inline-block;margin-right: 24px;}
  .newsBox .detailsText>a{display:inline-block;font-size:16px;line-height:24px;padding:8px 20px;background:#1890FF;color:#fff;border-radius:2px;margin-top:162px;}
  .newsBox .ant-tabs{width:100%;}
  .newsBox #introduce>div,.newsBox #list>div{padding:20px;border-bottom: 1px solid #F1F2F3;}
  .newsBox #introduce>div:last-child,.newsBox #list>div:last-child{border-bottom:none;}
  .newsBox #introduce h2,.newsBox #list h2{color:#000;line-height:22px;font-size:16px;font-weight: 400;margin-bottom: 12px;}
  .newsBox #introduce .teacherBox .el-avatar{width:60px;height:60px;}
  .newsBox #introduce .teacherBox p{max-width:70%;display:inline-block;height:60px;vertical-align: top;padding-left:10px;padding:6px;}
  .newsBox #introduce .teacherBox p span{color:#000;}
  .newsBox #introduce .teacherBox p strong{font-weight: 400;display: block;margin-top:6px;color:#999;overflow: hidden;-webkit-line-clamp: 1;line-clamp: 1;-webkit-box-orient: vertical;box-orient: vertical;display: -webkit-box;display: box;}
  .newsBox #introduce .teacherBox>img{border-radius:50%;width:60px;height:60px;}
  .newsBox #introduce .introduceBox .contentInfo{font-size:12px;line-height: 17px;padding-bottom:10px;}
  .newsBox #introduce .introduceBox img{max-width: 100%;margin:10px 0;}
  .newsBox #list .listItem{padding: 20px 0;border-bottom: 1px solid #D8D8D8;font-weight: 400;color:#666666;font-size:12px;line-height: 17px;}
  .newsBox #list .listItem:last-child{border-bottom:none;}
  .newsBox #list .listItem li{display: inline-block;height:100%;vertical-align: top;margin-right:20px;}
  .newsBox #list .listItem li em{font-style: normal;color:#fff;padding:1px 4px;border-radius:5px;}
  .newsBox #list .listItem li em.exam{background:#E02020;}
  .newsBox #list .listItem li em.audio{background:#44D7B6;}
  .newsBox #list .listItem li em.video{background:#FA6400;}
  .newsBox #list .listItem li em.txt{background:#0091FF;}
  .newsBox #list .listItem li span{display:inline-block;font-size:14px;color:#000;margin:0 0 8px 8px;}
  .newsBox #list .listItem li p i{display: inline-block;margin:0 5px 0 24px;width:16px;height:16px;background:url(/static/img/eye.png) 100%/cover no-repeat;vertical-align: top;}
  @media only screen and (max-width: 950px){
    .newsBox .listImg img{height:100%;}
    .newsBox .detailsText>a{margin-top:0;}
  }
</style>
