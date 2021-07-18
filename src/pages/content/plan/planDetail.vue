<template>
  <a-row>
    <a-col :sm="18" :xs="24">
      <a-row :gutter="12">
        <a-col :sm="8" :xs="24">
          <img width="100%" :src="planInfo.mediaCoverUrl">
        </a-col>
        <a-col :sm="16" :xs="24">
          <div class="title">{{planInfo.title}}</div>
          <div>报名人数：{{planInfo.subscribeTotal}} </div>
          <div>学习人数：{{planInfo.subscribeTotal}}</div>
        </a-col>
      </a-row>
    </a-col>
    <a-col :sm="6" :xs="24" align="right">
      <a href="javascript:void(0);" @click="edit(planInfo)" v-if="$power(['content:plan:edit'])">编辑</a>
      <a-divider type="vertical" v-if="$power(['content:plan:edit', 'content:plan:shelf'])"/>
      <a href="javascript:void(0);" v-if="planInfo.publishSetting === 1 && $power(['content:plan:shelf'])" @click="upItem(planInfo)">下架</a>
      <a href="javascript:void(0);" v-if="planInfo.publishSetting === -1 && $power(['content:plan:shelf'])" @click="upItem(planInfo)">上架</a>
      <a-divider type="vertical" v-if="$power(['content:plan:remove', 'content:plan:shelf'])"/>
      <a href="javascript:void(0);" @click="del(planInfo)" v-if="$power(['content:plan:remove'])">删除</a>
    </a-col>
  </a-row>
</template>

<script>

export default {
  name: 'rDetail',
  data () {
    return {
      planInfo: {}
    }
  },
  props: ['id'],
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      this.$api.plan.getInfo({ // 获取详情
        hash_id: this.id
      }).then(res => {
        this.$emit('updateState', !!res.data.is_import)
        this.planInfo = res.data
      })
    },
    setLoading (loading) {
      this.loading = loading
    },
    edit (item) { // 编辑培训计划
      this.$router.push({
        path: '/content/plan/edit',
        query: {
          id: this.id
        }
      })
    },
    del (item) { // 点击刪除计划
      this.loading = true
      this.$api.plan.remove({
        hash_id: this.id
      }).then(res => {
        if (res.code === 0) {
          this.loading = false
          this.$router.push({
            path: '/content/plan/list'
          })
        }
      })
    },
    upItem (item) { // 上下架课程
      this.loading = true
      var parmas = {
        hash_id: this.id,
        publishSetting: item.publishSetting
      }
      this.$api.plan.publish(parmas).then(res => {
        this.loading = false
        this.getInfo()
      })
    }
  }
}
</script>
