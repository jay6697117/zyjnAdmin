<template>
  <div class="newsBox">
    <h1 class="title">{{detail.title}}</h1>
    <div class="info">
      <span style="margin-right:50px">{{detail.published_at | timeFormat('yyyy-MM-dd')}}</span>
      <span><a-icon type="eye"></a-icon> {{detail.click_num}}</span>
    </div>
    <div class="content" v-html="detail.content"></div>
    <div class="origin" v-if="detail.source_name || detail.source_url">
      <p v-if="detail.source_name">资讯来源：{{detail.source_name}}</p>
      <p v-if="detail.source_url">来源地址：<a target="_blank" :href="detail.source_url">{{detail.source_url}}</a></p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'newReview',
  data () {
    return {
      detail: {}
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
      this.$api.news.getInfo({// 编辑时请求远端数据
        hash_id: this.id
      }).then(res => {
        this.detail = res.data
      })
    }
  }
}
</script>
<style scope>
  .newsBox{margin: 0 auto;padding: 30px;width:100%;}
  .info{margin-bottom: 10px;}
  .newsBox h1.title{color: #000;}
  .newsBox .origin{background: rgb(249, 243, 243); color: rgba(147, 148, 155, 1);padding: 12px 15px;margin-top: 15px;}
  .newsBox .origin p{padding: 5px 0;margin: 0;}
  .newsBox .content img{max-width: 100%;}
</style>
