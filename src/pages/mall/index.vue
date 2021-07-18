<template>
  <div class="mall">
    <a-row class="mallHeader">
      <a-col :span="7">
        <img :src="global.adminLogo">
        <img :src="global.adminLogoBlack" class="logoWords">
      </a-col>
      <a-col :span="11">
        <a-input-search placeholder="按课程名称搜索" size="large" @search="linkTo('result', '', '')" enterButton v-model="search_content" />
      </a-col>
      <a-col :span="6" align="right">
        <router-link to="/order/order/list">
          <a-button size="large">我的订单</a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-layout class="banner">
      <a-layout-sider width="220">
        <ul class="indexMenu">
          <li @click="linkTo('result', '', '')">全部课程</li>
          <li v-for="(item, index) in category" :key="index" :class="index === current ? 'on' : ''" @mouseenter="enter(item, index)" @mouseleave="leave">
            <span>
              <span v-for="(it, i) in item.categories" :key="i" @click="linkTo('result', it.hash_id, '')">
                {{it.title}}
                <span v-if="i !== item.categories.length - 1"> | </span>
              </span>
            </span>
            <a-icon type="right" style="color:#fff;" />
          </li>
        </ul>
        <div class="menuBox" v-show="hover" @mouseenter="enter" @mouseleave="leave">
          <a-tag @click="getDetail(course)" v-for="course in itemChild.recommendedCourses" :key="course.hash_id">{{course.title}}</a-tag>
          <dl v-for="(it, i) in itemChild.categories" :key="i">
            <dt>{{it.title}}</dt>
            <dd>
              <span @click="linkTo('result', it.hash_id, c.hash_id)" v-for="(c, k) in it.children" :key="k">{{c.title}}</span>
            </dd>
          </dl>
        </div>
      </a-layout-sider>
      <a-layout-content>
        <a-carousel autoplay trigger="hover">
          <div v-for="item in carousel" :key="item.hash_id" class="indexCarousel" :style="`background-image: url(${item.cover_url})`" @click="getDetail(item)"></div>
        </a-carousel>
      </a-layout-content>
    </a-layout>

    <a-row class="mallList" :gutter="24">
      <a-col :span="24">
        <h2 class="indexTitle">
          <span class="more" @click="linkTo('result', '', '')">更多 <a-icon type="right" style="color:#333;" /></span>
          <a-icon type="sketch" style="color:#f40" /> 好课推荐
        </h2>
      </a-col>
      <a-col :span="6" v-for="item in hotList" :key="item.hash_id" class="commodity">
        <a-card hoverable style="width: 100%;position:relative" @click="getDetail(item)">
          <img :src="item.cover_url" slot="cover"/>
          <a-card-meta>
            <template slot="title">
              <a-tooltip :title="item.title">
                {{item.title}}
              </a-tooltip>
            </template>
            <template slot="description">
              <span class="lessonNo">共 {{item.lesson_num}} 讲</span>
              <a-row>
                <a-col :span="6" class="price" v-if="item.price === 0"> <strong> 免费 </strong> </a-col>
                <a-col :span="6" class="price" v-else><span>￥</span>{{(item.price / 100).toFixed(2)}}</a-col>
                <a-col :span="18" align="right" class="learnedTotal">
                  <a-icon type="user" /> {{item.learned_total}} 人学过
                </a-col>
              </a-row>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>

    <a-row class="mallList" :gutter="24">
      <a-col :span="24">
        <h2 class="indexTitle">
          <span class="more" @click="linkToFree">更多 <a-icon type="right" style="color:#333;" /></span>
          免费课程
        </h2>
      </a-col>
      <a-col :span="6" v-for="item in freeList" :key="item.hash_id" class="commodity">
        <a-card hoverable style="width: 100%;position:relative" @click="getDetail(item)">
          <img :src="item.cover_url" slot="cover"/>
          <a-card-meta>
            <template slot="title">
              <a-tooltip :title="item.title">
                {{item.title}}
              </a-tooltip>
            </template>
            <template slot="description">
              <span class="lessonNo">共 {{item.lesson_num}} 讲</span>
              <a-row>
                <a-col :span="6" class="price" v-if="item.price === 0"> <strong> 免费 </strong> </a-col>
                <a-col :span="6" class="price" v-else><span>￥</span>{{(item.price / 100).toFixed(2)}}</a-col>
                <a-col :span="18" align="right" class="learnedTotal">
                  <a-icon type="user" /> {{item.learned_total}} 人学过
                </a-col>
              </a-row>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import global from '@/utils/global'
let timer = null
export default {
  name: 'mall',
  data () {
    return {
      global,
      search_content: '',
      current: '',
      hover: false,
      hotList: [],
      freeList: [],
      category: [],
      carousel: [],
      itemChild: []
    }
  },
  mounted () {
    this.getHot()
    this.getFree()
    this.getCategory()
  },
  methods: {
    enter (item, index) {
      if (item.categories && item.categories.length) {
        this.itemChild = item
        this.current = index
      }
      clearInterval(timer)
      this.hover = true
    },
    leave () {
      let step = 0
      timer = setInterval(() => {
        step++
        if (step === 10) {
          this.hover = false
          this.current = ''
        }
      }, 50)
    },
    getHot () {
      this.$api.mall.hot().then(res => {
        this.hotList = res.data
      })
    },
    getFree () {
      this.$api.mall.free().then(res => {
        this.freeList = res.data
      })
    },
    getCategory () {
      this.$api.mall.category().then(res => {
        this.category = res.data.categoryList
        this.carousel = res.data.recommendedCourses
      })
    },
    linkTo (type, parentId, childId) {
      this.$store.commit('setMallFilter', {
        firstLevel: parentId,
        secondLevel: childId,
        search_content: this.search_content,
        is_free: false,
        order_by_column: 'learned_total',
        order_by_direction: 'desc'
      })
      this.$router.push({path: '/mall/' + type})
    },
    linkToFree () {
      this.$store.commit('setMallFilter', {
        firstLevel: '',
        secondLevel: '',
        search_content: '',
        is_free: true,
        order_by_column: 'learned_total',
        order_by_direction: 'desc'
      })
      this.$router.push({path: '/mall/result'})
    },
    getDetail (item) {
      this.$router.push({
        path: '/mall/detail',
        query: {
          hash_id: item.hash_id
        }
      })
    }
  }
}
</script>

<style lang="less">
  .mall{
    width: 1200px;
    margin: 0 auto;
    .banner {
      position: relative;
      .ant-layout-sider-children {
        background: rgba(60, 40, 60, 1);
      }
      .indexMenu {
        color: #fff;
        padding: 12px 0px;
        a {color: #fff;}
        > li {
          height: 40px; line-height: 16px;cursor: pointer;display: flex;justify-content: space-between;padding: 12px 16px;
          &.on{
            background: #fff;
            color: #333;
            a {color: #333;}
          }
        }
      }
      .menuBox{
        position: absolute;top: 0;left: 220px;background: #fff; color: #333; width: 980px;height: 100%;z-index: 1000;
        opacity: 1;padding: 12px 24px;
        a{color: #333;}
        .ant-tag{cursor: pointer;}
        &.fade-enter-active, &.fade-leave-active {
          transition: all .5s;
        }
        &.fade-enter, &.fade-leave-to {
          opacity: 0;
        }
        dl {
          overflow: hidden;
          padding: 12px 0;
          font-size: 14px;
          line-height: 32px;
          dt {float: left;width: 120px;font-weight: 700;}
          dd {
            margin-left: 120px;
            span {display: inline-block;margin: 0 10px; cursor: pointer;}
          }
        }
      }
      .ant-carousel{line-height: 0;}
      .indexCarousel {width: 100%;padding-top: 40%;background: no-repeat center center/cover;cursor: pointer;}
      .ant-carousel .slick-dots li button{width:10px;height:10px;border-radius: 50%;margin-right:8px;opacity:1;}
      .ant-carousel .slick-dots li.slick-active button{background:#108EE9}
    }
  }

  .mallHeader {
    margin-bottom: 20px;
    img{
      height: 32px;
      &.logoWords{
        height: 24px;
      }
    }
  }
  .mallList {
    .indexTitle{
      margin-top: 24px;font-size: 18px;font-weight: 700;
      .more{float: right;font-size: 14px;font-weight: 500;cursor: pointer;}
    }
    .commodity{
      margin: 12px 0;
      img {height: 210px;width:280px;}
      .lessonNo{position:absolute;top:189px;right:0;z-index: 100;background: rgb(120, 200, 250);;color: #fff;height: 21px;line-height: 21px;width: 54px; text-align: center;border-radius: 5px 0 0 0;}
      .ant-card-body{padding: 16px 8px 8px 8px;}
      .price{
        font-size: 20px;color: #f40;height: 30px;line-height: 30px;
        span{font-size: 16px;}
        strong{font-size: 16px;display: block;font-weight: 500;}
      }
      .ant-card-meta-title{font-weight: 500;}
      .learnedTotal{height: 30px;line-height: 30px;font-weight: 500;}
    }
  }
</style>
<style>
</style>
