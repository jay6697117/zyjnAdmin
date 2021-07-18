<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-button type="primary" @click="onAddOpen()" v-if="$power(['categoryAdd'])">
          <a-icon type="plus" /> {{`新建${name}${type === 'station' ? '分类' : tName}`}}
        </a-button>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :pagination="false" :defaultExpandAllRows="true" :loading="loading" rowKey="key" class="categoryTable">
      <template slot="name" slot-scope="td, tr">
        <span :class="tr.disabled ? 'strong' : ''" v-if="state === '2'">{{td}}</span>
        <span v-else>{{td}}</span>
      </template>
      <template slot="sort" slot-scope="td, tr, index">
        <template v-if="index && $power('categorySort')">
          <a href="javascript:;" @click="move(tr, index, -1)">上移</a>
          <a-divider type="vertical" />
          <a href="javascript:;" @click="move(tr, index, 0)">置顶</a>
        </template>
      </template>
      <template slot="action" slot-scope="td, tr">
        <template v-if="!tr.is_default">
          <span v-if="tr.disabled && state === '2'">
            <a href="javascript:;" @click="onOpen(tr)" v-if="$power(['categoryEdit'])">编辑</a>
            <a-divider type="vertical" v-if="$power(['categoryEdit', 'categoryAdd'])" />
            <a href="javascript:;" @click="onAddOpen(tr)" v-if="$power(['categoryAdd'])">{{`添加${name}${tName}`}}</a>
            <a-divider type="vertical" v-if="$power(['categoryRemove', 'categoryAdd'])" />
            <a-popconfirm title="是否确定删除?" @confirm="onRemove(tr)" okText="确定" cancelText="取消" v-if="$power(['categoryRemove'])">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
          <span v-else-if="state === '3'">
            <a href="javascript:;" @click="onOpen(tr)" v-if="$power('categoryEdit')">编辑</a>
            <a-divider type="vertical" v-if="$power(['categoryEdit', 'categoryAdd'])" />
            <a href="javascript:;" @click="onAddOpen(tr)" v-if="$power(['categoryAdd'])">添加子{{tName}}</a>
            <a-divider type="vertical" v-if="$power(['categoryRemove', 'categoryAdd'])" />
            <a-popconfirm title="是否确定删除?" @confirm="onRemove(tr)" okText="确定" cancelText="取消" v-if="$power(['categoryRemove'])">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a href="javascript:;" @click="onOpen(tr)" v-if="$power(['categoryEdit'])">编辑</a>
            <a-divider type="vertical" v-if="$power(['categoryEdit', 'categoryRemove'])" />
            <a-popconfirm title="是否确定删除?" @confirm="onRemove(tr)" okText="确定" cancelText="取消" v-if="$power(['categoryRemove'])">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>

    <a-modal :title="title" :visible="visible" @ok="onOk" @cancel="onClose" :confirmLoading="confirmLoading" cancelText="取消" okText="保存">
      <a-form :form="form">
        <a-form-item :label="`名称`" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input :placeholder="`请输入名称`"
            v-decorator="['title', { rules: [{ required: true, message: `请输入名称!` }] }]"/>
        </a-form-item>
        <a-form-item label="hash_id" v-show="false">
          <a-input-number :min="0" v-decorator="['hash_id']" />
        </a-form-item>
        <a-form-item label="hash_parent_id" v-show="false">
          <a-input-number :min="0" v-decorator="['hash_parent_id']" />
        </a-form-item>
        <a-form-item label="type" v-show="false">
          <a-input-number :min="0" v-decorator="['type']" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal :title="title" :visible="addVisible" @ok="onAddOk" @cancel="onClose" :confirmLoading="addConfirmLoading" cancelText="取消" okText="保存">
      <a-form :form="addForm">
        <a-form-item :label="`名称`" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-textarea v-if="(name!=='资讯')" v-decorator="['titles', { rules: [{ required: true, message: `请输入分类名称!` }] }]"
          :autoSize="{ minRows: 5, maxRows: 10 }" style="height:150px" placeholder ="批量创建时，每个分类独占一行"/>
          <a-textarea v-else v-decorator="['titles', { rules: [{ required: true, message: `请输入栏目名称!` }] }]"
          :autoSize="{ minRows: 5, maxRows: 10 }" style="height:150px" placeholder ="批量创建时，每个栏目独占一行"/>
        </a-form-item>
        <a-form-item label="hash_parent_id" v-show="false">
          <a-input-number :min="0" v-decorator="['hash_parent_id']" />
        </a-form-item>
        <a-form-item label="type" v-show="false">
          <a-input-number :min="0" v-decorator="['type']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {title: '名称', dataIndex: 'title', key: 'title', scopedSlots: { customRender: 'name' }},
  {title: '快速排序', dataIndex: 'sort', key: 'sort', slots: { title: 'sort' }, scopedSlots: { customRender: 'sort', width: '100px', align: 'center' }},
  {title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' }, width: '240px', align: 'right'}
]

export default {
  name: 'iCategory',
  data () {
    return {
      title: '',
      visible: false,
      addVisible: false,
      form: this.$form.createForm(this, {name: 'category'}),
      addForm: this.$form.createForm(this, {name: 'addCategory'}),
      loading: false,
      confirmLoading: false,
      addConfirmLoading: false,
      data: [],
      columns,
      sort: {}
    }
  },
  computed: {
    tName () {
      if (this.type === 'news') {
        return '栏目'
      } else if (this.type === 'station') {
        return ''
      } else {
        return '分类'
      }
    }
  },
  props: ['type', 'state', 'name'],
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      this.$api.category.list({type: this.type}).then(res => {
        if (this.type === 'station') {
          this.data = res.data
        } else {
          this.data = res.data
        }
        this.loading = false
      })
    },
    onOpen (item) {
      let formData = {}
      this.visible = true
      if (!item && this.type === 'station') {
        item = {disabled: true}
      }
      let name = item.disabled ? (this.name + '分类') : (this.name + this.tName)
      this.title = '编辑' + name
      console.log(item)
      formData = {
        hash_id: item.key,
        hash_parent_id: item.hash_parent_id ? item.hash_parent_id : '',
        title: item.title,
        type: this.type
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(formData)
      })
    },
    onAddOpen (item) {
      let formData = {}
      this.addVisible = true
      if (!item && this.type === 'station') {
        item = {disabled: true}
      }
      let name = (this.type === 'station' && !item.key) ? (this.name + '分类') : (this.name + this.tName)
      this.title = '新建' + name
      formData = {
        hash_parent_id: item ? item.key : '',
        titles: '',
        type: this.type
      }
      this.$nextTick(() => {
        this.addForm.setFieldsValue(formData)
      })
    },
    onRemove (item) {
      this.$api.category.remove({
        hash_id: item.key,
        type: this.type
      }).then(res => {
        this.getList()
      })
    },
    onInit () {
      this.visible = false
      this.addVisible = false
      this.confirmLoading = false
      this.addConfirmLoading = false
      this.getList()
    },
    getParent (parentId, data) {
      if (!data || !data.length) { return }
      for (var item of data) {
        if (item.key === parentId) {
          this.sort = {
            hash_id: parentId,
            hash_children_ids: item.children.map(category => category.key),
            type: this.type
          }
        } else if (item && item.children) {
          this.getParent(parentId, item.children)
        }
      }
    },
    move (tr, index, target) {
      this.loading = true
      var parentId = tr.hash_parent_id
      if (parentId === '1rdzMDLxZpENwGKB') {
        this.sort = {
          hash_id: parentId,
          hash_children_ids: this.data.map(item => item.key),
          type: this.type
        }
      } else {
        this.getParent(parentId, this.data)
      }
      var children = this.sort.hash_children_ids
      if (target) {
        children[index] = children.splice(index + target, 1, children[index])[0]
      } else {
        var item = children[index]
        children.splice(index, 1)
        children.unshift(item)
      }
      this.sort.hash_children_ids = children
      this.$api.category.sort(this.sort).then(res => {
        this.getList()
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    onClose () {
      this.visible = false
      this.addVisible = false
    },
    onOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          this.$api.category.edit(values).then(res => {
            this.onInit()
          })
        }
      })
    },
    onAddOk () {
      this.addForm.validateFields((err, values) => {
        if (!err) {
          values.titles = values.titles.split(/[\r\n]/).filter(item => item)
          this.addConfirmLoading = true
          this.$api.category.add(values).then(res => {
            this.onInit()
          })
        }
      })
    }
  }
}
</script>

<style>
  .categoryTable .strong{font-weight: 700;}
  .ant-table-wrapper{margin-top: 15px;}
</style>
