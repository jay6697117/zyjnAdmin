<template>
  <a-drawer :title="title" placement="right" :closable="false"  @close="handleCancel" :visible="visible" width="800" >
    <a-row :gutter="20">
      <a-col class="gutter-row" :span="4" align="right">菜单名称 :</a-col>
      <a-col class="gutter-row" :span="8">{{itemdata.name}}</a-col>
      <a-col class="gutter-row" :span="4" align="right">菜单类型 :</a-col>
      <a-col class="gutter-row" :span="8">{{itemdata.type}}</a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col class="gutter-row" :span="4" align="right">上级菜单 :</a-col>
      <a-col class="gutter-row" :span="8">{{itemdata.parentName}}</a-col>
      <a-col class="gutter-row" :span="4" align="right">状态 :</a-col>
      <a-col class="gutter-row" :span="8">{{itemdata.invisible ? '隐藏': '可见'}}</a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col class="gutter-row" :span="4" align="right">链接目标 :</a-col>
      <a-col class="gutter-row" :span="8">{{itemdata.target}}</a-col>
      <a-col class="gutter-row" :span="4" align="right">图标 :</a-col>
      <a-col class="gutter-row" :span="8"><a-icon :type="itemdata.icon" /> {{itemdata.icon}}</a-col>
    </a-row>
    <a-row :gutter="20" v-if="itemdata.url">
      <a-col class="gutter-row" :span="4" align="right">请求地址 :</a-col>
      <a-col class="gutter-row" :span="20">{{itemdata.url}}</a-col>
    </a-row>
    <a-row :gutter="20" v-if="itemdata.routes.length">
      <a-col class="gutter-row" :span="4" align="right">API地址 :</a-col>
      <a-col class="gutter-row" :span="20">{{itemdata.routes}}</a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col class="gutter-row" :span="4" align="right">授权标识 :</a-col>
      <a-col class="gutter-row" :span="20">{{itemdata.perms}}</a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col class="gutter-row" :span="4" align="right">备注 :</a-col>
      <a-col class="gutter-row" :span="20">{{itemdata.remarks}}</a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="roleList" :pagination="false" :rowKey="record => record.id" :loading="loading"></a-table>
  </a-drawer>
</template>

<script>
var columns = [
  { title: '角色名', dataIndex: 'name', key: 'name' },
  { title: '创建人', dataIndex: 'created_by', key: 'created_by' },
  { title: '操作时间', dataIndex: 'created_time', key: 'created_time' },
  { title: '描述', dataIndex: 'remark', key: 'remark' }
]
export default {
  name: 'iMenuView',
  data () {
    return {
      visible: false,
      loading: true,
      columns,
      roleList: []
    }
  },
  props: ['title', 'flag', 'itemdata'],
  watch: {
    flag: function () {
      this.visible = this.flag
      if (this.visible) {
        this.loading = true
        this.$api.menu.getInfo({id: this.itemdata.id}).then(res => {
          this.loading = false
          this.roleList = res.data.map((item, index) => {
            item.id = index
            return item
          })
        })
      }
    }
  },
  methods: {
    handleCancel () {
      this.$emit('cancel', false)
    }
  }
}
</script>

<style scope>
  .ant-row{margin-bottom: 20px;}
</style>
