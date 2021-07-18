<template>
<div>
  <developer v-if="user.isDeveloper"></developer>
  <admin v-else></admin>
</div>
</template>

<script>
import developer from './developer'
import admin from './admin'

export default {
  name: 'home',
  data () {
    return {}
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  components: {admin, developer}
}
</script>

<style lang="less">
  .overView p em{color:red;display: inline-block;font-style: normal;margin-left: 15px;}
  .overView p span{color:green;display: inline-block;font-style: normal;margin-left: 15px;}
  .adminContent .ant-card,.adminContent .block{box-shadow: 0 1px 1px -1px rgba(0,0,0,.16), 0 1px 2px 0 rgba(0,0,0,.12), 0 2px 3px 2px rgba(0,0,0,.09);}
  .block{margin: 0 12px 20px 12px;background: #fff;}
  .block .ant-row{background:#fff;padding:15px 10px;margin-bottom:10px;}
  .block .ant-tabs{background:#fff;}
  .block .ant-tabs-bar{border:none;}
  .block .ant-tabs-nav-wrap{padding-left:30px;}
  .adminContent{background:#f5f7fa!important;}
  .flexBox{display: flex;background:#fff;}
  #AuditData{flex:1}
  #AuditPie{flex: 0 0 400px;max-width: 400px;min-width: 400px;width: 400px;}
  .hotBox{
    margin-bottom: 12px;
    padding: 12px;
    background: #fff;
    flex: 0 0 400px;
    max-width: 400px;
    min-width: 400px;
    width: 400px;
    .title{
      overflow: hidden;
      strong{height: 32px;line-height: 32px;}
      .ant-radio-group{float: right;}
    }
    .ant-table-small{border:none;}
    .nameTd{line-height: 20px;height: 20px;display: block;width:150px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
    .userhead{width: 20px;height:20px;vertical-align: middle;border-radius: 50%; margin-right: 5px;}
    .ant-table-small{border: none;}
  }
</style>
