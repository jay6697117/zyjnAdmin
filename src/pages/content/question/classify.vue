<template>
    <div>
      <a-row>
        <a-col :span="24">
          <a-button type="primary" icon="plus" @click="addItem()" v-if="$power(['add'])">新建分类</a-button>
        </a-col>
      </a-row>
      <a-table :columns="columns" :dataSource="categoryList" :loading="loading" rowKey="key" :pagination="false">
        <span slot="action" slot-scope="item" v-if="!item.is_default">
          <a href="javascript:;" @click="addItem(item)" v-if="$power(['add'])">添加子分类</a>
          <a-divider type="vertical" />
          <a href="javascript:;" @click="upItem(item)" v-if="$power(['edit'])">重命名</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否确定删除?" @confirm="delItem(item)" okText="确定" cancelText="取消">
            <a href="javascript:;" v-if="$power(['remove'])">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <a-modal :visible="visible" :title="modalTitle" @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="保存" :confirmLoading="confirmLoading" width="50%">
        <a-form :form="currentItem">
          <a-form-item label="hash_parent_id" v-show="false">
            <a-input v-decorator="['hash_parent_id']" />
          </a-form-item>
          <a-form-item label="hash_id" v-show="false">
            <a-input v-decorator="['hash_id']" />
          </a-form-item>
          <a-form-item label="分类名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
            <a-input :maxLength="16"
              placeholder="不超十六个字"
              v-decorator="['name', { rules: [{ required: true, message: '请输入分类名称!' }] }]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
</template>
<script>
const columns = [
  {title: '分类名称', dataIndex: 'title', align: 'left'},
  {title: '题目数量', dataIndex: 'questionNum', align: 'center', width: 100},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 250}
]
export default {
  name: 'category',
  data () {
    return {
      categoryList: [],
      loading: false,
      columns,
      editName: '',
      modalTitle: '',
      visible: false,
      confirmLoading: false,
      currentItem: this.$form.createForm(this, {name: 'category'})
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      this.$api.questionCategory.tree().then(res => {
        this.categoryList = res.data
        this.loading = false
      })
    },
    addItem (item) {
      this.visible = true
      if (item) {
        this.modalTitle = '添加子分类'
        this.$nextTick(() => {
          this.currentItem.setFieldsValue({
            name: '',
            hash_parent_id: item.key,
            hash_id: ''
          })
        })
      } else {
        this.modalTitle = '新建分类'
        this.$nextTick(() => {
          this.currentItem.setFieldsValue({
            name: '',
            hash_parent_id: '',
            hash_id: ''
          })
        })
      }
    },
    upItem (item) {
      this.visible = true
      this.modalTitle = '重命名'
      this.$nextTick(() => {
        this.currentItem.setFieldsValue({
          name: item.title,
          hash_parent_id: '',
          hash_id: item.key
        })
      })
    },
    handleOk () {
      let self = this
      if (this.modalTitle === '重命名') {
        self.currentItem.validateFieldsAndScroll((err, values) => {
          if (!err) {
            self.confirmLoading = true
            self.$api.questionCategory.edit({
              hash_id: values.hash_id,
              name: values.name
            }).then(res => {
              self.visible = false
              self.confirmLoading = false
              self.getList()
            })
          }
        })
      } else {
        self.currentItem.validateFieldsAndScroll((err, values) => {
          if (!err) {
            self.confirmLoading = true
            console.log(values)
            self.$api.questionCategory.add({
              hash_parent_id: values.hash_parent_id,
              name: values.name
            }).then(res => {
              self.visible = false
              self.confirmLoading = false
              self.getList()
            })
          }
        })
      }
    },
    handleCancel (e) {
      this.visible = false
    },
    delItem (item) {
      this.$api.questionCategory.remove({
        hash_id: item.key
      }).then(res => {
        this.getList()
      })
    }
  }
}
</script>

<style>
</style>
