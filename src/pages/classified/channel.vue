<template>
  <div>
    <a-table :columns="columns" :dataSource="data" :pagination="false" :defaultExpandAllRows="true" rowKey="id" :loading="loading">
      <template slot="action" slot-scope="text, item">
        <a href="javascript:;" @click="editorSelf(item)" v-if="$power('classified:channel:update')">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="insertChild(item)" v-if="$power('classified:channel:update')">添加子频道</a>
        <a-divider type="vertical" />
        <a-popconfirm title="是否确定删除?" @confirm="deleteSelf(item)" okText="确定" cancelText="取消" v-if="!item.isRoot && $power('classified:channel:delete')">
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal :title="modalTitle" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel" cancelText="取消" okText="保存">
      <a-form :form="currentItem">
        <a-form-item label="频道名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入频道名称!"
            v-decorator="['name', { rules: [{ required: true, message: '请输入频道名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="编码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入编码!"
            v-decorator="['code', { rules: [{ required: true, message: '请输入编码!' }] }]"
          />
        </a-form-item>
        <a-form-item label="id" v-show="false">
          <a-input-number :min="0" v-decorator="['id']" />
        </a-form-item>
        <a-form-item label="parent_id" v-show="false">
          <a-input-number :min="0" v-decorator="['parent_id']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: '40%'
  },
  {
    title: '编码',
    dataIndex: 'code',
    key: 'code',
    width: '10%'
  },
  {
    title: '下辖机构',
    dataIndex: 'number',
    key: 'number',
    width: '10%'
  },
  {
    title: '创建者',
    dataIndex: 'created_name',
    key: 'created_name',
    width: '15%'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: '25%'
  }
]

export default {
  name: 'channle',
  data () {
    return {
      modalTitle: '',
      visible: false,
      confirmLoading: false,
      loading: false,
      currentItem: this.$form.createForm(this, {name: 'channel'}),
      data: [],
      columns
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      this.$api.channel.list().then(res => {
        let treeData = res.data
        treeData[0].isRoot = true
        this.data = treeData
        this.loading = false
      })
    },
    handleOk (e) {
      let self = this
      self.currentItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          self.confirmLoading = true
          self.$api.channel.save(values).then(res => {
            self.visible = false
            self.confirmLoading = false
            self.getList()
          })
        }
      })
    },
    handleCancel (e) {
      this.visible = false
    },
    editorSelf (item) {
      this.visible = true
      this.modalTitle = '编辑频道'
      this.$nextTick(() => {
        this.currentItem.setFieldsValue({
          id: item.id,
          parent_id: item.parent_id,
          name: item.name,
          code: item.code
        })
      })
    },
    insertChild (item) {
      this.visible = true
      this.modalTitle = '添加子频道'
      this.$nextTick(() => {
        this.currentItem.setFieldsValue({
          id: 0,
          parent_id: item.id,
          name: '',
          code: ''
        })
      })
    },
    deleteSelf (item) {
      this.$api.channel.remove(item).then(res => {
        this.getList()
      })
    }
  }
}
</script>

<style>
</style>
