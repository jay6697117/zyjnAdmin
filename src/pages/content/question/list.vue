<template>
  <div class="testBody">
    <a-row>
      <a-col :sm="6" :xs="24">
        <a-dropdown :getPopupContainer="triggerNode => triggerNode.parentNode" v-if="$power(['edit'])">
          <a-button> 添加题目 <a-icon type="down" /> </a-button>
          <a-menu slot="overlay" @click="addTest">
            <a-menu-item :key="index" v-for="(item, index) in types">{{item}}</a-menu-item>
          </a-menu>
        </a-dropdown>
        <router-link to="/content/question/classify" v-if="$power(['classify'])"><a-button>分类管理</a-button></router-link>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" @search="onSearch" type="question" placeholder="题干内容"></i-filter>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <div v-if="hasSelected">
          已选择{{selectedRowKeys.length}}项
          <a href="javascript:;" @click="changeItem(selectedRowKeys)" v-if="$power(['transfer'])">转移</a>
        </div>
        <a-table :columns="columns" :dataSource="qustionData" :loading="loading" rowKey="hash_id" :pagination="false" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"> 选择行
          <template slot="content" slot-scope="content">
            <div v-html="content" class="stem"></div>
          </template>
          <span slot="question_type" slot-scope="question_type">
            {{types[question_type]}}
          </span>
          <span slot="updated_at" slot-scope="updated_at">{{updated_at | timeFormat('yyyy-MM-dd')}}</span>
          <span slot="action" slot-scope="action">
            <a-dropdown>
              <a class="ant-dropdown-link"> 管理 <a-icon type="down" /> </a>
              <a-menu slot="overlay">
                <a-menu-item v-if="$power(['copy'])">
                  <a href="javascript:;" @click="copy(action)">复制试题</a>
                </a-menu-item>
                <a-menu-item v-if="$power(['edit'])">
                  <a href="javascript:;" @click="editItem(action)">编辑</a>
                </a-menu-item>
                <a-menu-item v-if="$power(['transfer'])">
                  <a href="javascript:;" @click="changeItem([action.hash_id])">转移</a>
                </a-menu-item>
                <a-menu-item v-if="$power(['remove'])">
                  <i-remove :id="action.hash_id" :parmas="removeParmas" action="remove" @reset="getList" @loading="setLoading">
                    <a href="javascript:;" slot="operation" style="color:rgba(0, 0, 0, 0.65)">删除</a>
                  </i-remove>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </a-table>
        <i-pagination :pagination="pagination" @change="getList" />
      </a-col>
    </a-row>
    <a-modal :visible="transferModal" title="转移分类" @cancel="transferCancel" @ok="transferSubmit" style="height:auto;" cancelText="取消" okText="保存">
      <a-form :form="transferForm">
        <a-form-item label="选择分类" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
            style="width: 100%"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="categoryList"
            placeholder='请选择分类'
            :treeDefaultExpandedKeys = '["qc_no_category"]'
            v-decorator="[
              'hash_category_id',
              {rules: [{ required: true, message: '请选择分类!'}]}
            ]"
          >
          </a-tree-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <i-del-list ref="delList" />
  </div>
</template>
<script>
const columns = [
  {title: '题目', dataIndex: 'content', key: 'content', scopedSlots: { customRender: 'content' }, align: 'left'},
  {title: '题型', dataIndex: 'question_type', key: 'question_type', scopedSlots: { customRender: 'question_type' }, align: 'center', width: 100},
  {title: '最新更新', dataIndex: 'updated_at', key: 'updated_at', scopedSlots: { customRender: 'updated_at' }, align: 'center', width: 110},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 80}
]
export default {
  name: 'test',
  data () {
    return {
      types: this.$store.state.questionTypes,
      defaultExpandedKeys: [],
      columns,
      qustionData: [],
      loading: false,
      selectedRowKeys: [],
      ids: [],
      categoryList: [],
      transferModal: false,
      pagination: {
        type: 'question',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        hash_category_id: '0',
        search_content: '',
        question_type: ''
      },
      removeParmas: {
        title: '试题删除', // 提示框内的title
        path: 'question', // 接口的路径
        canRemove: false, // 查询到有绑定时 弹窗内是否有删除按钮
        searchBind: true, // 是否进行绑定查询
        tips: '试题已被使用，请先从试卷中移除，再执行删除操作！', // 有绑定信息时的提示
        content: '删除后试题将无法恢复，是否删除？' // 无绑定信息时的提示
      },
      transferForm: this.$form.createForm(this, { name: 'transfer' })
    }
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      let listParmas = this.$store.state.listParmas
      if (listParmas.pagination.type === this.pagination.type) {
        this.onSearch(listParmas.filters, listParmas.pagination.current_page)
        this.$store.commit('initListParmas')
      } else {
        this.onSearch()
      }
    })
    this.$api.questionCategory.tree().then(res => {
      this.categoryList = res.data
    })
  },
  methods: {
    setLoading (loading) {
      this.loading = loading
    },
    onSearch (filters = this.filters, currentPage = 1) {
      this.filters = filters
      this.getList(currentPage)
    },
    transferSubmit () {
      this.transferForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.$api.question.transfer({
            hash_category_id: values.hash_category_id,
            hash_ids: this.ids
          }).then(res => {
            this.getList()
            this.transferModal = false
          })
        }
      })
    },
    transferCancel () {
      this.transferModal = false
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.question.list({
        current_page,
        per_page,
        ...this.filters
      }).then(res => {
        this.qustionData = res.data.list
        this.pagination.total = res.data.info.total
        this.selectedRowKeys = []
        this.loading = false
      })
    },
    addTest (item) {
      this.$router.push({
        path: '/content/question/edit',
        query: {
          type: item.key,
          id: ''
        }
      })
    },
    editItem (item) {
      this.$store.commit('setListPamars', {
        pagination: this.pagination,
        filters: this.filters
      })
      this.$router.push({
        path: '/content/question/edit',
        query: {
          type: item.question_type,
          id: item.hash_id
        }
      })
    },
    changeItem (ids) {
      this.ids = ids
      this.transferModal = true
    },
    delItem (ids) {
      this.loading = true
      this.$api.question.remove({
        hash_ids: ids
      }).then(res => {
        this.loading = false
        if (res.data && res.data.length) {
          this.$refs.delList.onShowHandler({
            title: '试卷删除',
            tips: '试卷已被使用，请先从培训计划/专项考试中移除，再执行删除操作！',
            data: res.data
          })
        } else {
          this.getList()
        }
      })
    },
    copy (item) {
      var _self = this
      const modal = _self.$confirm({
        title: '复制试题',
        content: '复制已选的试题？',
        onOk () {
          return new Promise((resolve, reject) => {
            _self.$api.question.copy({
              hash_id: item.hash_id
            }).then(res => {
              modal.destroy()
              if (res.code === 0) {
                _self.$router.push({
                  path: '/content/question/edit',
                  query: {
                    type: item.question_type,
                    id: res.data.hash_id
                  }
                })
              }
            })
          }).catch(() => console.log('Oops errors!'))
        },
        cancelText: '取消',
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="less">
.testBody{
  .stem{
    img{max-width: 100px;max-height: 100px;}
  }
}
</style>
