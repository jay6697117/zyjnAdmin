<template>
  <div class="indexMain">
    <a-row :gutter="20">
      <a-col class="gutter-row" :span="24">
        <a-table :columns="columns" :dataSource="menuData" :pagination="false" :rowKey="record => record.id" :loading="loading">
          <span slot="operation" slot-scope="text">
            <a-button type="dashed" icon="edit" @click="editorThis(text)" v-if="$power('update')" v-show="!text.is_default">编辑</a-button>
            <a-dropdown :getPopupContainer="triggerNode => triggerNode.parentNode" v-if="$power(['insert', 'view', 'delete'])">
              <a-menu slot="overlay">
                <a-menu-item @click="newBrother(text)" v-if="$power('insert')"><a-icon type="plus" />新建同级菜单</a-menu-item>
                <a-menu-item @click="newSon(text)" v-if="$power('insert')" v-show="canCreate(text)"><a-icon type="plus" />新建子菜单</a-menu-item>
                <a-menu-item @click="viewThis(text)" v-if="$power('view')"><a-icon type="file-text" />查看详情</a-menu-item>
                <a-menu-item @click="deleteThis(text)" v-if="$power('delete')" v-show="!text.is_default"><a-icon type="delete" />删除</a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">
                更多 <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </span>
          <span slot="myicon" slot-scope="text2">
            <a-icon :type="text2" v-if="text2" />
          </span>
          <span slot="invisible" slot-scope="invisible">
            <a-tag v-if="invisible" color="#999999">不可见</a-tag>
            <a-tag v-else color="#2db7f5">可见</a-tag>
          </span>
          <span slot="type" slot-scope="type">
            <a-tag v-if="type === 0" color="cyan">目录</a-tag>
            <a-tag v-if="type === 1" color="green">菜单</a-tag>
            <a-tag v-if="type === 2" color="blue">操作</a-tag>
            <a-tag v-if="type === 3" color="orange">功能</a-tag>
          </span>
          <span slot="target" slot-scope="target">
            <a-tag v-if="target === 0" color="cyan">当前</a-tag>
            <a-tag v-if="target === 1" color="blue">新开</a-tag>
            <a-tag v-if="target === 2" color="green">弹窗</a-tag>
          </span>
          <span slot="is_hide" slot-scope="is_hide">
            <a-tag v-if="is_hide === 0" color="cyan">显示</a-tag>
            <a-tag v-if="is_hide === 1" color="blue">隐藏</a-tag>
          </span>
        </a-table>
      </a-col>
    </a-row>
    <i-menu-edit :title="editTitle" :flag="showEdit" @ok="onhandleOk" @cancel="onhandleCancel" :itemdata="itemdata" :treedata="treedata"></i-menu-edit>
    <i-menu-view :title="viewTitle" :flag="showView" @ok="onhandleOk" @cancel="onhandleCancel" :itemdata="viewData"></i-menu-view>
  </div>
</template>
<script type="text/ecmascript-6">
import iMenuEdit from '@/pages/components/sys/iMenuEdit.vue'
import iMenuView from '@/pages/components/sys/iMenuView.vue'
const columns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' }, width: 80 },
  { title: '地址', dataIndex: 'url', key: 'url', width: 240 },
  { title: '权限', dataIndex: 'authorization_sign', key: 'authorization_sign', width: 150 },
  { title: '图标', dataIndex: 'icon', key: 'icon', scopedSlots: { customRender: 'myicon' }, width: 80, align: 'center' },
  { title: '链接目标', dataIndex: 'target', key: 'target', scopedSlots: { customRender: 'target' }, width: 100, align: 'center' },
  { title: '显示状态', dataIndex: 'is_hide', key: 'is_hide', scopedSlots: { customRender: 'is_hide' }, width: 80, align: 'center' },
  { title: '排序', dataIndex: 'order', key: 'order', width: 80, align: 'center' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 220, align: 'right' }
]
const menuTemp = { // 初始数据模板
  'id': 0,
  'parent_id': '0',
  'name': '',
  'url': '',
  'authorization_sign': '',
  'icon': 'home',
  'parent_name': '',
  'order': '0',
  'type': 0,
  'is_hide': 0,
  'target': 0,
  'level': '0',
  'routes': []
}
export default {
  name: 'menus',
  data () {
    return {
      menuData: [],
      keyWords: '',
      loading: false,
      columns,
      showEdit: false,
      showView: false,
      editTitle: '新建菜单',
      viewTitle: '查看详情',
      itemdata: menuTemp,
      treedata: [],
      viewData: menuTemp
    }
  },
  components: {
    iMenuEdit,
    iMenuView
  },
  methods: {
    search () {
      this.getMenus({
        keyWords: this.keyWords
      })
    },
    reset () {
      console.log('reset')
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
    getMenus (params) {
      this.loading = true
      this.$api.menu.list(params).then(res => {
        this.loading = false
        this.menuData = this.menuSort(res.data)
        if (params.keyWords) {
          return
        }
        this.treedata = [
          {
            title: '顶级菜单',
            value: '0',
            key: 0,
            type: 0,
            disabled: true,
            children: this.initTree(this.menuData)
          }
        ]
      })
    },
    initTree (list) {
      var arr = []
      for (var key in list) {
        var item = {}
        if (list[key].children && list[key].children.length > 0) {
          item.children = this.initTree(list[key].children)
        }
        item.title = list[key].name
        item.type = list[key].type
        item.value = list[key].id.toString()
        item.key = list[key].id.toString()
        item.authorization_sign = list[key].authorization_sign
        arr.push(item)
      }
      return arr
    },
    onhandleOk () {
      this.showEdit = false
      this.showView = false
      this.getMenus({})
    },
    onhandleCancel () {
      this.showEdit = false
      this.showView = false
    },
    editorThis (item) {
      this.showEdit = true
      item.parent_id = item.parent_id.toString()
      this.itemdata = JSON.parse(JSON.stringify(item))
      this.editTitle = '编辑 <' + this.itemdata.name + '>'
    },
    newBrother (item) {
      this.editTitle = '新建同级菜单'
      this.initMenu(this.findParent(item.parent_id, this.menuData))
    },
    newSon (item) {
      this.editTitle = '新建子菜单'
      this.initMenu(item)
    },
    initMenu: function (parent) { // 默认值
      this.showEdit = true
      this.itemdata = JSON.parse(JSON.stringify(menuTemp))
      this.itemdata.parent_name = parent.name || '顶级菜单'
      this.itemdata.parent_id = parent.id.toString()
      this.itemdata.level = parent.level + 1
      this.itemdata.type = parent.type === 1 ? 2 : 0
    },
    deleteThis (item) {
      var _self = this
      _self.$confirm({
        content: '确定要删除此菜单吗？',
        okType: 'danger',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          _self.$api.menu.remove({
            id: item.id
          }).then(res => {
            if (!res.code) {
              _self.$message.success('成功删除 <' + item.name + '>', 3)
              _self.getMenus({})
            }
          })
        }
      })
    },
    viewThis (item) {
      this.showView = true
      this.viewData = JSON.parse(JSON.stringify(item))
      this.viewTitle = '查看 <' + item.name + '> 详情'
    },
    findParent (parentId, list) {
      if (parentId === 0 || parentId === '0') {
        return JSON.parse(JSON.stringify(menuTemp))
      }
      var obj = {}
      for (var i in list) {
        if (list[i].id === parentId) {
          obj = list[i]
          break
        }
        if (list[i].children && list[i].children.length > 0) {
          obj = this.findParent(parentId, list[i].children)
          if (obj.id === parentId) {
            return obj
          }
        }
      }
      return obj
    },
    canCreate: function (item) {
      // 如果本级是操作 则不允许创建子菜单
      return item.type !== 2
    }
  },
  mounted () {
    this.getMenus({})
  }
}
</script>

<style lang="less">
</style>
