<template>
  <a-row class="detail">
    <a-col :sm="18" :xs="24">
      <a-row :gutter="12">
        <a-col :sm="8" :xs="24">
          <img width="100%" :src="detail.mediaCoverUrl" @click="review" />
        </a-col>
        <a-col :sm="16" :xs="24">
          <div @click="review">{{detail.title}}</div>
          <div v-if="type === 'purchase'">报名人数：{{detail.subscribeTotal}}<br />总名额：{{detail.buyout ? '无限制' : detail.pay_number}}</div>
        </a-col>
      </a-row>
    </a-col>
    <a-col :sm="6" :xs="24" align="right">
      <div class="speed" v-if="type === 'exam'">
        <span>通过率</span>
        <strong>{{detail.passed_percent}}</strong>%
      </div>
      <div class="speed" v-if="type === 'plan'">
        <span>已完成</span>
        <strong>{{detail.learnedTotal}} / {{detail.subscribeTotal}}</strong>
      </div>
      <div class="speed" v-if="type === 'course'">
        <span>已完成</span>
        <strong>{{detail.learnedTotal}} / {{detail.subscribeTotal}}</strong>
      </div>
      <div v-if="type === 'purchase'">
        <a href="javascript:void(0);" @click="edit">编辑</a>
      </div>
    </a-col>
  </a-row>
</template>

<script>

export default {
  name: 'rDetail',
  data () {
    return {
      detail: {}
    }
  },
  props: ['id', 'type'],
  mounted () {
    this.$api[this.type].getInfo({ // 编辑时请求远端数据
      hash_id: this.id
    }).then(res => {
      this.$emit('updateState', !!res.data.is_import)
      this.detail = res.data
    })
  },
  methods: {
    edit () {
      this.$router.push({
        path: '/content/purchase/edit',
        query: {
          id: this.detail.hash_id
        }
      })
    },
    review () {
      this.$router.push({
        path: '/content/' + this.type + '/edit',
        query: {
          id: this.id
        }
      })
    }
  }
}
</script>

<style scope>
  .detail .speed{width: 120px;height: 120px;border: 5px solid #d0d0d0; border-radius: 50%;text-align: center;padding: 25px 0;}
  .detail .speed span{display: block;font-size: 16px;margin-bottom: 5px;}
  .detail .speed strong{font-size: 24px;font-weight: 500;}
</style>
