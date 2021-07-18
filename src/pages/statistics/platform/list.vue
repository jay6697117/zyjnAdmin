<template>
<div class="platformData">
  <a-row>
    <a-col :span="8">
      <div class="dataContent">
        <strong>{{studyData.total_user ? studyData.total_user : 0}}</strong><span>平台学习人数</span>
      </div>
    </a-col>
    <a-col :span="8">
      <div class="dataContent">
        <strong>{{studyData.study_person_time ? studyData.study_person_time : 0}}</strong><span>平台学习人次</span>
      </div>
    </a-col>
    <a-col :span="8">
      <div class="dataContent">
        <strong>{{studyData.total_interface_call ? studyData.total_interface_call : 0}}</strong><span>接口总请求次数</span>
      </div>
    </a-col>
  </a-row>
</div>
</template>
<script>
export default {
  name: 'platformList',
  data () {
    return {
      studyData: {
        total_user: 0,
        study_person_time: 0,
        total_interface_call: 0
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.$api.platform.list().then(res => {
        if (res.code === 0) {
          this.studyData = res.data
        }
      })
    }
  }
}
</script>
<style lang="less">
.platformData {
  .dataContent{
    padding: 10px 0;
    height: 160px;
    line-height: 70px;
    text-align: center;
    span{display: block;font-size: 16px;font-weight: 700;}
    strong{display: block;font-size: 36px;color:#1890ff;}
  }
}

</style>
