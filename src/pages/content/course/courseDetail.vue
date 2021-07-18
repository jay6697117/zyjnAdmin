<template>
  <a-row>
    <a-col :sm="18" :xs="24">
      <a-row :gutter="12">
        <a-col :sm="8" :xs="24">
          <img width="100%" :src="detail.mediaCoverUrl">
        </a-col>
        <a-col :sm="16" :xs="24">
          <div class="title">{{detail.title}}</div>
          <div>报名人数：{{detail.subscribeTotal}} </div>
          <div>学习人数：{{detail.subscribeTotal}}</div>
        </a-col>
      </a-row>
    </a-col>
    <a-col :sm="6" :xs="24" align="right">
      <a href="javascript:void(0);" @click="edit(detail)" v-if="$power(['content:course:edit'])">编辑</a>
      <a-divider type="vertical" v-if="$power(['content:course:edit', 'content:course:shelf'])"/>
      <i-remove :id="detail.hash_id" :parmas="publishParmas" action="publish" @reset="getInfo" @loading="setLoading" v-if="detail.publishSetting === 1 && $power(['content:course:shelf'])">
        <a href="javascript:;" slot="operation">下架</a>
      </i-remove>
      <a href="javascript:void(0);" v-if="detail.publishSetting === -1 && $power(['content:course:shelf'])" @click="upItem(detail)">上架</a>
      <a-divider type="vertical" v-if="$power(['content:course:remove', 'content:course:shelf'])"/>
      <i-remove :id="detail.hash_id" :parmas="removeCourse" action="remove" @reset="removeOk" @loading="setLoading" v-if="$power(['content:course:remove'])">
        <a href="javascript:;" slot="operation">删除</a>
      </i-remove>
    </a-col>
  </a-row>
</template>

<script>

export default {
  name: 'rDetail',
  data () {
    return {
      publishParmas: {
        title: '课程下架',
        path: 'course',
        canRemove: true,
        searchBind: true,
        tips: '下架后课程将无法加入学习，也不会出现在下列关联的培训计划中，是否下架？',
        content: '下架后课程将无法加入学习，是否下架？'
      },
      removeCourse: {
        title: '课程删除',
        path: 'course',
        canRemove: true,
        searchBind: true,
        tips: '删除将清空课程下学员的学习数据，也不会出现在下列关联的培训计划中，是否删除？',
        content: '删除将清空课程下学员的学习数据，是否删除？'
      },
      detail: {}
    }
  },
  props: ['id'],
  mounted () {
    this.getInfo(0)
  },
  methods: {
    getInfo () {
      this.$api.course.getInfo({ // 获取详情
        hash_id: this.id
      }).then(res => {
        console.log(res.data.is_import)
        this.$emit('updateState', !!res.data.is_import)
        this.detail = res.data
      })
    },
    removeOk () {
      this.$router.push({
        path: '/content/course/list'
      })
    },
    setLoading (loading) {
      this.loading = loading
    },
    edit (item) { // 编辑课程
      this.$router.push({
        path: '/content/course/edit',
        query: {
          id: this.id
        }
      })
    },
    upItem (item) { // 上下架课程
      this.loading = true
      var parmas = {
        hash_id: this.id,
        publishSetting: item.publishSetting
      }
      this.$api.course.publish(parmas).then(res => {
        this.loading = false
        this.getInfo()
      })
    }
  }
}
</script>
