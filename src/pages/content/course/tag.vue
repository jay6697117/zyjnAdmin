<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="标签管理" key="1" v-if="$power(['list'])">
        <a-row>
          <a-col><a-button type="primary" @click="addItem" v-if="$power(['add'])">新建标签</a-button></a-col>
        </a-row>
        <a-table :columns="labelColumns" :dataSource="labelData" :loading="loading" rowKey="hash_id" :pagination="false">
          <template slot="group_list" slot-scope="group_list">
            <a-tag v-for="(item, index) in group_list" :key="index">{{item.name}}</a-tag>
            <span v-if="!group_list.length">无</span>
          </template>
          <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
          <template slot="action" slot-scope="action">
            <a href="javascript:;" @click="editLabel(action)" v-if="$power(['edit'])">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="是否确定删除?" @confirm="removeLabel(action)" okText="确定" cancelText="取消" v-if="$power(['remove'])">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="标签组管理" key="2" v-if="$power(['groupList'])">
        <a-row>
          <a-col><a-button type="primary" @click="addGroup" v-if="$power(['groupAdd'])">新建标签组</a-button></a-col>
        </a-row>
        <a-table :columns="groupColumns" :dataSource="groupData" :loading="loading" rowKey="hash_group_id" :pagination="false">
          <template slot="label_list" slot-scope="label_list">
            <a-tag v-for="(item, index) in label_list" :key="index">{{item.name}}</a-tag>
            <span v-if="!label_list.length">无</span>
          </template>
          <template slot="action" slot-scope="action">
            <a href="javascript:;" @click="editGroup(action)" v-if="$power(['groupEdit'])">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="是否确定删除?" @confirm="removeGroup(action)" okText="确定" cancelText="取消" v-if="$power(['groupRemove'])">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <a-modal title="编辑标签" :visible="labelEdit" @cancel="labelCancel" @ok="labelSave">
      <a-form :form="labelItem" @submit="labelSave">
        <a-form-item label="标签名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
          <a-input placeholder="请输入标签名称"
          v-decorator="['name', { rules: [{ required: true, message: '请输入标签名称！' }] }]"/>
        </a-form-item>
        <a-form-item label="hash_id" v-show="false">
          <a-input-number :min="0" v-decorator="['hash_id']" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="编辑标签组" :visible="groupEdit" @cancel="groupCancel" @ok="groupSave">
      <a-form :form="groupItem" @submit="groupSave">
        <a-form-item label="标签组名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
          <a-input placeholder="请输入标签组名称"
          v-decorator="['name', { rules: [{ required: true, message: '请输入标签组名称！' }] }]"/>
        </a-form-item>
        <a-form-item label="包含标签" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
          <a-select mode="tags" placeholder="请选择标签" style="width: 100%" dropdownClassName="myDropdown"
          v-decorator="['hash_label_ids', { rules: [{ required: true, message: '请选择标签！' }] }]">
            <a-select-option v-for="item in labelData" :key="item.hash_id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="hash_group_id" v-show="false">
          <a-input-number :min="0" v-decorator="['hash_group_id']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const labelColumns = [
  {title: '名称', dataIndex: 'name', key: 'name'},
  {title: '所属标签组', dataIndex: 'group_list', key: 'group_list', scopedSlots: { customRender: 'group_list' }, align: 'center', width: 160},
  {title: '添加时间', dataIndex: 'created_at', key: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 200},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 150}
]
const groupColumns = [
  {title: '标签组名称', dataIndex: 'name', key: 'name'},
  {title: '包含标签', dataIndex: 'label_list', key: 'label_list', scopedSlots: { customRender: 'label_list' }, align: 'center', width: 200},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 150}
]
export default {
  name: 'tag',
  data () {
    return {
      loading: false,
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      labelEdit: false,
      groupEdit: false,
      labelColumns,
      groupColumns,
      labelData: [],
      groupData: [],
      labelItem: this.$form.createForm(this, {name: 'labelItem'}),
      groupItem: this.$form.createForm(this, {name: 'groupItem'})
    }
  },
  mounted () {
    this.getLabelList()
    this.getGroupList()
  },
  methods: {
    getLabelList () {
      this.$api.label.list().then(res => {
        this.labelData = res.data
      })
    },
    getGroupList () {
      this.$api.labelGroup.list().then(res => {
        this.groupData = res.data
      })
    },
    addItem () {
      this.labelEdit = true
      this.$nextTick(() => {
        this.labelItem.setFieldsValue({
          name: '',
          hash_id: ''
        })
      })
    },
    editLabel (item) {
      this.labelEdit = true
      this.$nextTick(() => {
        this.labelItem.setFieldsValue({
          name: item.name,
          hash_id: item.hash_id
        })
      })
    },
    removeLabel (item) {
      this.$api.label.remove({hash_id: item.hash_id}).then(res => {
        this.getLabelList()
      })
    },
    labelSave (e) {
      var _self = this
      e.preventDefault()
      _self.labelItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (values.hash_id) {
            this.$api.label.edit(values).then(res => {
              this.labelEdit = false
              this.getLabelList()
            })
          } else {
            this.$api.label.add(values).then(res => {
              this.labelEdit = false
              this.getLabelList()
            })
          }
        }
      })
    },
    labelCancel () {
      this.labelEdit = false
    },
    addGroup () {
      this.groupEdit = true
      this.$nextTick(() => {
        this.groupItem.setFieldsValue({
          name: '',
          hash_group_id: '',
          hash_label_ids: []
        })
      })
    },
    editGroup (item) {
      this.groupEdit = true
      this.$nextTick(() => {
        this.groupItem.setFieldsValue({
          name: item.name,
          hash_group_id: item.hash_group_id,
          hash_label_ids: item.label_list.map(item => {
            return item.id
          })
        })
      })
    },
    removeGroup (item) {
      this.$api.labelGroup.remove({hash_group_id: item.hash_group_id}).then(res => {
        this.getGroupList()
        this.getLabelList()
      })
    },
    groupSave (e) {
      var _self = this
      e.preventDefault()
      _self.groupItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.label_names = this.getLabelsName(values.hash_label_ids)
          values.hash_label_ids = this.getLabelsId(values.hash_label_ids)
          if (values.hash_group_id) {
            this.$api.labelGroup.edit(values).then(res => {
              this.groupEdit = false
              this.getLabelList()
              this.getGroupList()
            })
          } else {
            this.$api.labelGroup.add(values).then(res => {
              this.groupEdit = false
              this.getLabelList()
              this.getGroupList()
            })
          }
        }
      })
    },
    groupCancel () {
      this.groupEdit = false
    },
    getLabelsId (labels) {
      return labels.filter(id => {
        return this.labelData.filter(label => id === label.hash_id).length
      })
    },
    getLabelsName (labels) {
      return labels.filter(id => {
        return !this.labelData.filter(label => id === label.hash_id).length
      })
    },
    btnCancel () {
      this.labelEdit = false
      this.groupEdit = false
    }
  }
}
</script>

<style scope>

</style>
