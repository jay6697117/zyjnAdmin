<template>
  <a-drawer :title="title" placement="right" :closable="false"  @close="handleCancel" :visible="visible" width="600" >
    <a-tree
      :class="$store.state.user.isSuper ? '' : 'setSomePower'"
      checkable
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      v-model="checkedKeys"
      @select="onSelect"
      @check="onCheck"
      :selectedKeys="selectedKeys"
      :treeData="treeData"
    />
    <a-row class="drawer-footer">
      <a-col :span="24">
        <a-button type="primary" @click="handleOk" block :loading="loading">保存</a-button>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>
export default {
  name: 'iRoleSet',
  data () {
    return {
      loading: false,
      visible: false,
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: false,
      selectedKeys: [],
      treeData: [],
      checkedKeys: []
    }
  },
  props: ['title', 'flag', 'itemid'],
  watch: {
    flag: function () {
      this.visible = this.flag
      if (this.visible) {
        this.loading = true
        Promise.all([this.$api.role.rootList(), this.$api.role.userRoot({
          hash_role_id: this.itemid
        })]).then(results => {
          this.loading = false
          this.treeData = this.menuSort(results[0].data)
          this.checkedKeys = results[1].data
        })
      }
    },
    checkedKeys (val) {}
  },
  methods: {
    handleCancel () {
      this.$emit('cancel', false)
    },
    menuSort (list) {
      for (var i in list) {
        if (list[i].children && list[i].children.length) {
          list[i].children = this.menuSort(list[i].children)
        }
      }
      list = list.sort((a, b) => {
        return b.order - a.order
      })
      return list
    },
    handleOk () {
      this.loading = true
      this.$api.role.bindMenu({
        menu_ids: this.checkedKeys.join(','),
        hash_role_id: this.itemid
      }).then(res => {
        this.loading = false
        if (!res.code) {
          this.$message.success('权限修改成功', 3)
        }
        this.$emit('ok', false)
      })
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', selectedKeys)
      this.selectedKeys = selectedKeys
    }
  }
}
</script>

<style scope>
  .setSomePower.ant-tree li span.ant-tree-switcher{display: none;}
  .setSomePower.ant-tree li{padding-left: 24px;}
  .setSomePower.ant-tree > li{padding-left: 0;}
  .setSomePower.ant-tree > li > span.ant-tree-switcher{display: inline-block;}
  .ant-drawer-wrapper-body{display: flex;flex-direction: column;}
  .ant-drawer-header{flex:0 0 55px}
  .ant-drawer-body{flex:1;display: flex;flex-direction: column;}
  .drawer-footer{flex: 0 0 32px;margin: 10px 0 0 0!important;}
  .ant-tree{flex:1;overflow-x: hidden;}
</style>
