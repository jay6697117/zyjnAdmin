<template>
  <div class="indexMain">
    <a-row :gutter="20">
      <a-col class="gutter-row" :span="4">
        <a-button type="primary" icon="plus" @click="addClassify" v-if="$power('sys:role:categoryinsert')">新建角色分组</a-button>
      </a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col class="gutter-row" :span="24">
         <a-table :columns="columns" :dataSource="rolesTree" :loading="loading" class="components-table-demo-nested" :rowKey="record => record.hash_id" :pagination="false">
          <span slot="name" slot-scope="text, record">
            <span v-if="record.hash_id === 1 || !$power('sys:role:categoryupdate')">{{text}}</span>
            <editable-cell v-else :text="text" @change="onCellChange(record.hash_id, 'name', $event)"/>
          </span>
          <a slot="operation" slot-scope="text" href="javascript:">
            <a-button type="dashed" icon="edit" @click="addRole(text)" v-if="$power('sys:role:insert')">新建角色</a-button>
            <a-button type="danger" icon="delete" @click="deleteClassify(text)" v-show="text.is_default !== 1" v-if="$power('sys:role:categorydelete')">删除</a-button>
          </a>
          <a-table slot="expandedRowRender" slot-scope="item" :columns="innerColumns" :dataSource="item.child" :pagination="false" :rowKey="item => item.hash_id" >
            <!-- <span slot="op1" slot-scope="role" v-if="!role.is_default"> -->
            <span slot="op1" slot-scope="role">
              <a-button type="primary" @click="setRoot(role)" v-if="$power('sys:role:setroot')">设置权限</a-button>
              <a-button type="dashed" @click="editRole(role)" v-if="$power('sys:role:update')">修改</a-button>
              <a-button type="danger" icon="delete" @click="deleteRole(role)" v-if="$power('sys:role:delete')">删除</a-button>
            </span>
          </a-table>
        </a-table>
      </a-col>
    </a-row>
    <a-modal title="新建分组" :visible="showAdd" @ok="addGroup" :confirmLoading="confirmLoading" @cancel="onhandleCancel" cancelText="取消" okText="保存">
      <a-form :form="form">
        <a-form-item v-bind="global.formItemLayout" label="分组名称">
          <a-input :maxLength="20" placeholder="请输入分组名称（最多不超过20字）"
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请输入分组名称!', whitespace: true }]}
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <i-role-edit :title="editTitle" :flag="showEdit" @ok="onhandleOk" @cancel="onhandleCancel" :itemdata="itemdata" :classify="rolesList" :rolelist="roleList" ></i-role-edit>
    <i-role-set :title="setTitle" :flag="showSet" @ok="onhandleOk" @cancel="onhandleCancel" :itemid="itemid"></i-role-set>
  </div>
</template>
<script type="text/ecmascript-6">
import EditableCell from '@/pages/components/EditableCell'
import iRoleEdit from '@/pages/components/sys/iRoleEdit'
import iRoleSet from '@/pages/components/sys/iRoleSet'
const columns = [
  { title: '分类名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 300, align: 'right' }
]

const innerColumns = [
  { title: '角色名称', dataIndex: 'name', key: 'name', width: '20%' },
  { title: '员工人数', dataIndex: 'user_relation_count', key: 'user_relation_count', width: '15%' },
  { title: '', key: 'op1', scopedSlots: { customRender: 'op1' }, width: 300, align: 'right' }
]
const roleTemp = {
  'name': '',
  'remarks': '',
  'hash_category_id': 1
}
export default {
  name: 'role',
  data () {
    return {
      confirmLoading: false,
      loading: false,
      columns,
      innerColumns,
      rolesTree: [],
      rolesList: [],
      roleList: [],
      editTitle: '新建角色',
      setTitle: '设置权限',
      showEdit: false,
      showSet: false,
      showAdd: false,
      itemdata: {},
      itemid: 0,
      roleTemp,
      form: this.$form.createForm(this, {name: 'form'})
    }
  },
  components: {
    EditableCell,
    iRoleEdit,
    iRoleSet
  },
  methods: {
    addGroup () {
      this.form.validateFieldsAndScroll((err, val) => {
        if (!err) {
          this.confirmLoading = true
          this.$api.roleCategory.add(val).then(res => {
            if (!res.code) {
              this.showAdd = false
              this.confirmLoading = false
              this.$message.success('添加分类成功', 3)
              this.getRoles()
            }
          })
        }
      })
    },
    getRoles () {
      this.loading = true
      Promise.all([this.$api.role.list(), this.$api.roleCategory.list()]).then(results => {
        this.loading = false
        var classify = JSON.parse(JSON.stringify(results[1].data))
        var list = JSON.parse(JSON.stringify(results[0].data))
        var tree = []
        for (var i in classify) {
          var child = []
          for (var j in list) {
            if (list[j].hash_category_id === classify[i].hash_id) {
              child.push(list[j])
            }
          }
          classify[i].child = child
          tree.push(classify[i])
        }
        this.rolesTree = tree
        this.roleList = results[0].data
        this.rolesList = results[1].data
      })
    },
    onCellChange (key, dataIndex, value) {
      this.$api.roleCategory.edit({
        hash_id: key,
        name: value
      }).then(res => {
        const rolesList = [...this.rolesList]
        const target = rolesList.find(item => item.key === key)
        if (target) {
          target[dataIndex] = value
          this.rolesList = rolesList
        }
      })
    },
    addClassify: function () {
      this.addTitle = '新建分类'
      this.showAdd = true
    },
    deleteClassify: function (item) {
      var _self = this
      _self.$confirm({
        content: '确定要删除此分组吗？',
        okType: 'danger',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          _self.$api.roleCategory.remove({
            hash_id: item.hash_id
          }).then(res => {
            if (!res.code) {
              _self.$message.success('删除 <' + item.name + '> 分类成功', 3)
              _self.getRoles()
            }
          })
        }
      })
    },
    addRole: function (item) {
      this.editTitle = '新建角色'
      this.showEdit = true
      this.itemdata = JSON.parse(JSON.stringify(roleTemp))
      this.itemdata.hash_category_id = item.hash_id
    },
    editRole: function (item) {
      this.editTitle = '编辑角色'
      this.showEdit = true
      this.itemdata = item
    },
    deleteRole: function (item) {
      var _self = this
      if (item.is_default) {
        this.$info({
          title: '警告',
          content: '此为默认角色，无法删除！'
        })
        return
      }
      _self.$api.role.userList({
        hash_role_id: item.hash_id
      }).then(res => {
        if (!res.code) {
          if (res.data.length) {
            _self.$info({
              title: '警告',
              content: `${res.data.join(',')}正在使用此角色，无法删除！`
            })
          } else {
            _self.$api.role.remove({
              hash_id: item.hash_id
            }).then(res => {
              if (!res.code) {
                _self.$message.success('删除角色 <' + item.name + '> 成功', 3)
                _self.getRoles()
              }
            })
          }
        }
      })
    },
    setRoot: function (item) {
      this.showSet = true
      this.setTitle = '为 <' + item.name + '> 配置权限'
      this.itemid = item.hash_id
    },
    onhandleOk () {
      this.showEdit = false
      this.showSet = false
      this.showAdd = false
      this.getRoles()
    },
    onhandleCancel () {
      this.showEdit = false
      this.showSet = false
      this.showAdd = false
    }
  },
  mounted () {
    this.getRoles()
  }
}
</script>

<style scope>
  .ant-row{margin-bottom: 20px;}
  .components-table-demo-nested thead th{font-weight: 700}
</style>
