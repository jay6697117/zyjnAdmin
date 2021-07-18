<template>
  <div>
    <a-row>
      <a-col class="gutter-row" :span="4">
        <a-button type="primary" @click="newType">新建组织类型</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col class="gutter-row" :span="24">
        <a-table :columns="columns" :dataSource="typeData" :pagination="false" :loading="loading" :rowKey="record => record.id">
            <span slot="status" slot-scope="status">
              <a-tag v-if="status" color="cyan">正常</a-tag>
              <a-tag v-else color="green">停用</a-tag>
            </span>
            <span slot="operation" slot-scope="text">
              <a-button type="dashed" icon="edit" @click="editorThis(text)">编辑</a-button>
              <a-popconfirm title="同时删除下辖渠道?" @confirm="deleteThis(text)" okText="确定" cancelText="取消">
                <a-button type="dashed" icon="delete">删除</a-button>
              </a-popconfirm>
            </span>
        </a-table>
      </a-col>
    </a-row>
    <a-modal :title="modalTitle" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel" cancelText="取消" okText="保存">
      <a-form :form="currentItem">
        <a-form-item label="组织类型名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入频道名称!"
            v-decorator="['name', { rules: [{ required: true, message: '请输入频道名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="组织类型编码" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入编码!"
            v-decorator="['code', { rules: [{ required: true, message: '请输入编码!' }] }]"
          />
        </a-form-item>
        <a-form-item label="组织类型状态" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-radio-group v-decorator="['status']">
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="0">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="id" v-show="false">
          <a-input-number :min="0" v-decorator="['id']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  { title: '组织类型名称', dataIndex: 'name', key: 'name' },
  { title: '组织类型编码', dataIndex: 'code', key: 'code', width: 200 },
  { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }, width: 100 },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 240, align: 'center' }
]
export default {
  name: 'orgType',
  data () {
    return {
      modalTitle: '',
      visible: false,
      confirmLoading: false,
      loading: false,
      currentItem: this.$form.createForm(this, {name: 'orgType'}),
      columns,
      typeData: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    handleOk (e) {
      let self = this
      self.currentItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          self.confirmLoading = true
          if (this.modalTitle === '新增组织类型') {
            self.$api.orgType.addType(values).then(res => {
              self.visible = false
              self.confirmLoading = false
              self.getList()
            })
          } else {
            self.$api.orgType.editType(values).then(res => {
              self.visible = false
              self.confirmLoading = false
              self.getList()
            })
          }
        }
      })
    },
    handleCancel (e) {
      this.visible = false
    },
    getList () {
      this.loading = true
      this.$api.orgType.list().then(res => {
        if (!res.code) {
          this.loading = false
          this.typeData = res.data
        }
      })
    },
    newType () {
      this.visible = true
      this.modalTitle = '新增组织类型'
      this.$nextTick(() => {
        this.currentItem.setFieldsValue({
          id: 0,
          status: 1,
          name: '',
          code: ''
        })
      })
    },
    editorThis (item) {
      console.log(item)
      this.visible = true
      this.modalTitle = '修改组织类型'
      this.$nextTick(() => {
        this.currentItem.setFieldsValue(item)
      })
    },
    deleteThis (item) {
      this.$api.orgType.delType({id: item.id}).then(res => {
        if (!res.code) {
          this.getList()
        }
      })
    }
  }
}
</script>

<style lang="less" scope>

</style>
