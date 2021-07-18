<template>
  <div class="mallDetail">
    <a-row class="mallHeader">
       <a-col :span="7">
         <router-link to="/mall/index">
          <img :src="global.adminLogo">
          <img :src="global.adminLogoBlack">
        </router-link>
       </a-col>
       <a-col :span="11">
          <a-input-search placeholder="按课程名称搜索" size="large" @search="onSearch" enterButton v-model="filters.search_content" />
       </a-col>
       <a-col :span="6" align="right">
        <router-link to="/order/order/list">
          <a-button size="large">我的订单</a-button>
        </router-link>
       </a-col>
    </a-row>

    <a-row class="detailTop" :gutter="40">
      <a-col :span="8">
        <div class="cover" :style="`background-image: url(${info.cover_url})`"></div>
      </a-col>
      <a-col :span="16">
        <div class="title">{{info.title}}</div>
        <div class="detailItem"><strong>共 {{info.lesson_num}} 讲</strong></div>
        <a-row v-if="!info.is_free && buyType === 0" class="detailItem">
          <a-col :span="3">价格：</a-col>
          <a-col :span="20"><span style="color:red">￥{{(price / 100).toFixed(2)}}</span> / 人</a-col>
        </a-row>
        <a-row v-if="!info.is_free && buyType === 1" class="detailItem">
          <a-col :span="3">价格：</a-col>
          <a-col :span="20"><span style="color:red">￥{{(info.buyout / 100).toFixed(2)}}</span></a-col>
        </a-row>
        <a-row v-if="info.is_free" class="detailItem">
          <a-col :span="3">价格：</a-col>
          <a-col :span="20"><span style="color:red">免费</span></a-col>
        </a-row>
        <a-row v-if="!info.is_free" class="detailItem">
          <a-col :span="3">购买方式：</a-col>
          <a-col :span="20">
            <a-radio-group v-model="buyType" buttonStyle="solid">
              <a-radio-button :value="0">按人数购买</a-radio-button>
              <a-radio-button :value="1">企业买断</a-radio-button>
            </a-radio-group>
          </a-col>
        </a-row>
        <a-row v-if="!info.is_free && buyType === 0" class="detailItem">
          <a-col :span="3">购买数量：</a-col>
          <a-col :span="20">
            <a-input-number :max="9999" v-model="inputNumber" class="inputNumber" @change="numberInput" @blur="blur" />
            人, 阶梯价格：购买人数越多，价格越低
            <a-popover placement="top">
              <template slot="content">
                <a-table :columns="columns" :dataSource="tableData" rowKey="index" :pagination="false" size="small"></a-table>
              </template>
              <a-icon type="question-circle" />
            </a-popover>
          </a-col>
        </a-row>
        <a-row class="detailItem">
          <a-col :span="3">有效期：</a-col>
          <a-col :span="20">一年</a-col>
        </a-row>
        <a-row>
          <a-col :span="20" :push="3">
            <a-button type="primary" style="width: 195px" v-if="info.order && info.order.buyout">已购</a-button>
            <a-button type="primary" style="width: 195px" @click="buy" v-else>立即订购</a-button>
          </a-col>
        </a-row>
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
              <span class="time"> 更新于 {{ item.updated_at | timeFormat('yyyy-MM-dd') }} </span>
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
const columns = [
  {title: '购买数量(份)', dataIndex: 'step_price_numbers', key: 'step_price_numbers', align: 'center'},
  {title: '单价/门', dataIndex: 'step_prices', key: 'step_prices', align: 'center'}
]
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
      columns,
      buyType: 0,
      price: 0,
      inputNumber: 1,
      filters: this.$store.state.mallFilter,
      info: {},
      tableData: [],
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
    buy () {
      if (parseInt(this.inputNumber) > 0) {
        this.$store.commit('setMallOrder', {
          hash_id: this.hash_id,
          number: this.inputNumber,
          buyout: this.buyType
        })
        this.$router.push({path: '/mall/order'})
      } else {
        this.$message.error('购买数量须大于0')
      }
    },
    review (item) {
      this.visible = true
      this.lessonItem = item
      this.options.cover = item.coverUrl
    },
    mediaCancel () {
      this.visible = false
    },
    blur (e) {
      if (!e.target.value) {
        this.inputNumber = 1
      }
    },
    numberInput (e) {
      if (e > 9999) {
        this.inputNumber = 9999
      }
      this.price = this.info.uniform_price
      this.info.step_price_numbers.forEach((item, index) => {
        if (e > item) {
          this.price = this.info.step_prices[index]
        }
      })
    },
    onSearch () {
      this.$store.commit('setMallFilter', this.filters)
      this.$router.push({path: '/mall/result'})
    },
    getDetail () {
      this.$api.mall.getInfo({
        hash_id: this.hash_id
      }).then(res => {
        if (res && !res.code && res.data) {
          this.info = res.data
          this.price = res.data.uniform_price
          this.tableData = res.data.step_price_numbers.map((item, index) => {
            return {
              index,
              step_price_numbers: '>= ' + item,
              step_prices: '￥ ' + (res.data.step_prices[index] / 100).toFixed(2)
            }
          })
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
  .mallHeader {
    margin-bottom: 20px;
    img{height: 40px;}
  }
  .detailTop{
    margin-top: 40px;
    .cover{width: 100%;padding-top: 75%;background: no-repeat center center/cover;}
    .title{ height: 60px; font-size: 16px;line-height: 30px;overflow: hidden;font-weight: 700;}
    .detailItem{
      padding: 5px 0;
      line-height: 28px;
      strong{font-weight: 500;color: #909090;}
      .ant-radio-button-wrapper{height: 28px;line-height: 26px;}
    }
    .inputNumber{
      width: 100px;
      border: 0;
      border: 1px solid #c6c6c6;
      margin-right: 12px;
      padding: 2px 6px;
      height: 28px;
      .ant-input-number-input{height: 22px;}
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
