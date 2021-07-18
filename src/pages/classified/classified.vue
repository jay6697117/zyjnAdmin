<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-button type="primary" size="large" @click="addClass">添加分类</a-button>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :pagination="false" rowKey="id" :loading="loading">
      <span slot="action" slot-scope="text, item">
        <a href="javascript:;" @click="editorSelf(item)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="insertChild(item)">添加子分类</a>
        <a-divider type="vertical" />
        <a-popconfirm title="是否确定删除?" @confirm="deleteSelf(item)" okText="确定" cancelText="取消">
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </span>
    </a-table>
    <a-modal :title="modalTitle" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel" cancelText="取消" okText="保存">
      <a-form :form="currentItem">
        <a-form-item label="分类名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入分类名称"
            v-decorator="['name', { rules: [{ required: true, message: '请输入分类名称!' }] }]"/>
        </a-form-item>
        <a-form-item label="编码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入编码"
            v-decorator="['code', { rules: [{ required: true, message: '请输入编码!' }] }]"/>
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
    key: 'name'
  },
  {
    title: '编码',
    dataIndex: 'code',
    key: 'code',
    width: '12%'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: '25%'
  }
]

export default {
  name: 'classified',
  data () {
    return {
      modalTitle: '',
      visible: false,
      confirmLoading: false,
      loading: false,
      currentItem: this.$form.createForm(this, {name: 'classified'}),
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
      this.$api.classified.list().then(res => {
        this.data = res.data
        this.loading = false
      })
    },
    handleOk (e) {
      let self = this
      self.currentItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          self.confirmLoading = true
          self.$api.classified.save(values).then(res => {
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
      this.modalTitle = '编辑分类'
      this.$nextTick(() => {
        this.currentItem.setFieldsValue({
          id: item.id,
          parent_id: 0,
          name: item.name,
          code: item.code
        })
      })
    },
    addClass () {
      this.visible = true
      this.modalTitle = '添加分类'
      this.$nextTick(() => {
        this.currentItem.setFieldsValue({
          id: 0,
          parent_id: 0,
          name: '',
          code: ''
        })
      })
    },
    insertChild (item) {
      this.visible = true
      this.modalTitle = '添加子分类'
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
      this.$api.classified.remove({id: item.id}).then(res => {
        this.getList()
      })
    }
  }
}
</script>

<style>
</style>
