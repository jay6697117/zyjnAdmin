<template>
  <div class="indexMain">
    <a-row :gutter="20">
      <a-col class="gutter-row" :span="4">
        <a-button type="primary" icon="plus" @click="addOrg">新建组织</a-button>
      </a-col>
      <a-col class="gutter-row" :span="4" v-if="false">
        <router-link to="/sys/orgType">
          <a-button type="dashed">组织类型</a-button>
        </router-link>
      </a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col class="gutter-row" :span="24">
        <a-table :columns="columns" :dataSource="orgData" :loading="loading" rowKey="organization_id" :pagination="false">
          <span slot="status" slot-scope="status">
            <a-tag v-if="status" color="cyan">正常</a-tag>
            <a-tag v-else color="green">停用</a-tag>
          </span>
          <span slot="operation" slot-scope="text">
            <a-button type="dashed" icon="edit" @click="editorThis(text)">编辑</a-button>
          </span>
        </a-table>
        <i-pagination :pagination="pagination" @change="getList"/>
      </a-col>
    </a-row>
    <i-org-edit :title="editTitle" :flag="showEdit" :itemdata="itemdata" @ok="onhandleOk" @cancel="onhandleCancel"></i-org-edit>
    <i-org-add :flag="showAdd" :roletree="roletree" @ok="onhandleOk" @cancel="onhandleCancel"></i-org-add>
  </div>
</template>
<script>
import iOrgEdit from '@/pages/components/sys/iOrgEdit.vue'
import iOrgAdd from '@/pages/components/sys/iOrgAdd.vue'
const columns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }, width: 120 },
  { title: '负责人', dataIndex: 'username', key: 'username', width: 150 },
  { title: '电话', dataIndex: 'mobile', key: 'mobile', width: 150 },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 120, align: 'center' }
]
export default {
  name: 'org',
  components: {
    iOrgEdit,
    iOrgAdd
  },
  data () {
    return {
      orgData: [],
      loading: false,
      columns,
      showEdit: false,
      showAdd: false,
      editTitle: '',
      itemdata: [],
      pagination: {
        type: '组织',
        total: 0, // 总条数
        current_page: 1
      },
      roletree: []
    }
  },
  mounted () {
    this.getList()
    this.getRoleList()
  },
  methods: {
    onhandleOk (data) {
      this.showEdit = false
      this.showAdd = false
      if (data) {
        this.getList()
      } else {
        this.getList(1)
      }
    },
    onhandleCancel () {
      this.showEdit = false
      this.showAdd = false
    },
    getRoleList () {
      Promise.all([this.$api.roleCategory.list(), this.$api.role.list()]).then(results => {
        this.roletree = this.initRole(results[0].data, results[1].data)
      })
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.org.list({
        current_page,
        per_page,
        ...this.filters,
        mediaType: this.type
      }).then(res => {
        if (res.data.list) {
          this.orgData = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.tableData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    editorThis (item) {
      this.showEdit = true
      this.isEdit = true
      this.itemdata = JSON.parse(JSON.stringify(item))
      this.editTitle = '编辑 <' + this.itemdata.name + '>'
    },
    addOrg () {
      this.showAdd = true
    },
    initRole (classify, list) {
      var arr = []
      classify.forEach(classItem => {
        var obj = {
          key: 'group' + classItem.hash_id,
          value: 'group' + classItem.hash_id,
          title: classItem.name,
          disabled: true,
          children: []
        }
        list.forEach(listItem => {
          if (listItem.hash_category_id === classItem.hash_id) {
            obj.children.push({
              key: listItem.hash_id,
              value: listItem.hash_id,
              title: listItem.name
            })
          }
        })
        arr.push(obj)
      })
      return arr.filter(item => item.children.length)
    },
    deleteThis (item) {
      // var _self = this
      // _self.$confirm({
      //   content: '确定要删除此内容及其包含的内容吗？',
      //   okType: 'danger',
      //   okText: '确定',
      //   cancelText: '取消',
      //   onOk () {
      //     _self.$api.org.deleteOrg({id: item.id}).then(res => {
      //       _self.$message.success('删除成功', 3)
      //       _self.getList()
      //     })
      //   }
      // })
    }
  }
}
</script>

<style lang="less" scope>
  .indexMain{color: #000;}
</style>
