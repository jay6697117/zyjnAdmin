<template>
    <a-modal
      title='导入学员'
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      okText="确认添加"
      cancelText="取消"
      :width="960"
      >
      <a-row style="padding: 0 15px 15px 15px;">
        <a-col>
          <a-form layout="inline" :form="searchStudent" @submit="handleSearch" v-show="false">
            <a-form-item>
              <a-input placeholder="按名称搜索" v-decorator="['keyword']"/>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit">搜索</a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
      <a-table :columns="columns" :dataSource="data" :loading="loading" :rowKey="record => record.user_id" class="components-table-demo-nested" :pagination="pagination" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelect: selectOne, onSelectAll: selectAll, getCheckboxProps: getCheckboxProps}">
        <a-popover placement="rightBottom" slot="user.username" slot-scope="text, item">
          <template slot="content">
            <div class="popBox">
              <a-row>
                <a-col :span="12">
                  <img :src="item.user.avatar" class="bighead">
                </a-col>
                <a-col :span="10" :push="2">
                  <div class="user.username">{{text}}</div>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">上次登录时间：{{item.entry_time | timeFormat('yyyy-MM-dd')}}</a-col>
              </a-row>
              <a-row>
                <a-col :span="24">入职时间：{{item.created_time |  timeFormat('yyyy-MM-dd')}}</a-col>
              </a-row>
              <a-row>
                <a-col :span="24">创建者：张三</a-col>
              </a-row>
            </div>
          </template>
          <a href="javascript:;"><img :src="item.user.avatar" class="userhead">{{text}}</a>
        </a-popover>
        <template slot="user.status" slot-scope="text">
          <a-tag color="blue" v-if="text === 1">正常</a-tag>
          <a-tag color="orange" v-if="text === 3">禁止登录</a-tag>
          <a-tag color="red" v-if="text === 4">停用</a-tag>
        </template>
      </a-table>
      <section class="code-box-meta">
        <h4>已选对象</h4>
        <div class="selecedBox">
          <a-tag v-for="item in selectedStudents" :key="item.user_id" closable @close="removeSelected(item)">{{item.nickname}}</a-tag>
        </div>
      </section>
    </a-modal>
</template>

<script>
const columns = [
  { title: '学员', dataIndex: 'user.username', key: 'user.username', scopedSlots: { customRender: 'user.username' } },
  { title: '姓名', dataIndex: 'nickname', key: 'nickname', width: 100 },
  { title: '手机号', dataIndex: 'user.mobile', key: 'user.mobile', width: 100 },
  { title: '状态', dataIndex: 'user.status', key: 'user.status', width: 120, scopedSlots: { customRender: 'user.status' } }
]
export default {
  name: 'cList',
  data () {
    let self = this
    return {
      confirmLoading: false,
      data: [],
      columns,
      loading: false,
      tableInfo: {},
      selectedRowKeys: [],
      selected: [],
      selectedStudents: [],
      pagination: {
        current_page: 1,
        pageSize: 3, // 默认每页显示数量
        showTotal: total => `学员总数 ${self.tableInfo.total} 个`, // 显示总数
        onChange: (page, pageSize) => self.getList(page, pageSize), // 点击页码事件
        total: 0 // 总条数
      },
      searchStudent: this.$form.createForm(this, { name: 'searchStudent' })
    }
  },
  props: ['listId', 'type', 'visible'],
  watch: {
    'visible': function (visible) {
      console.log(visible)
      if (visible) {
        this.selected = []
        this.$nextTick(() => {
          this.searchStudent.setFieldsValue({
            org_id: '0',
            keyword: ''
          })
          this.getList(1)
          this.pagination.current_page = 1
        })
      }
    }
  },
  methods: {
    handleSearch (e) {
      e.preventDefault()
      this.searchStudent.validateFieldsAndScroll((err, vals) => {
        if (!err) {
          this.getList(1)
        }
      })
    },
    getList (page, pageSize) {
      this.loading = true
      let searchStudent = this.searchStudent.getFieldsValue()
      this.$api.account.list({
        keyword: searchStudent.keyword,
        org_id: searchStudent.org_id,
        current_page: page,
        per_page: this.pagination.pageSize
      }).then(res => {
        if (res.data.list) {
          let list = res.data.list
          this.$api[this.type].studentFindUid({ // 编辑时请求远端数据
            resourceId: this.listId,
            userIds: list.map(item => item.user_id)
          }).then(res => {
            this.data = list.map((item) => {
              item.name = {
                url: item.mediaCoverUrl,
                caption: item.title
              }
              res.data.forEach(userid => {
                if (userid === item.user_id) {
                  item.selected = true
                }
              })
              return item
            })
          })
          this.tableInfo = res.data.info
          this.pagination.total = res.data.info.total
        } else {
          this.data = []
          this.tableInfo = {
            total: 0
          }
        }
        this.loading = false
      })
    },
    selectOne (record, selected, selectedRows) {
      if (!selected) {
        this.selectedStudents.splice(this.selectedStudents.findIndex(item => item.user_id === record.user_id), 1)
      }
    },
    selectAll (selected, selectedRows, changeRows) {
      if (!selected) {
        changeRows.forEach(item => {
          this.selectedStudents.splice(this.selectedStudents.findIndex(one => one.user_id === item.user_id), 1)
        })
      }
    },
    removeSelected (record) {
      this.selectedRowKeys.splice(this.selectedRowKeys.findIndex(item => item === record.user_id), 1)
    },
    onSelectChange (selectedRowKeys, items) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedStudents = this.distinct(items)
    },
    distinct (items) {
      let students = this.selectedStudents.concat(items)
      let obj = {}
      return students.reduce((cur, next) => {
        if (!obj[next.user_id]) {
          obj[next.user_id] = true && cur.push(next)
        }
        return cur
      }, [])
    },
    getCheckboxProps (record) {
      return {
        props: {
          disabled: record.selected,
          defaultChecked: record.selected
        }
      }
    },
    handleOk () {
      this.confirmLoading = true
      this.$api[this.type].studentInsert({
        resourceId: this.listId,
        items: [
          {key: 'uids', value: this.selectedRowKeys}
        ]
      }).then(res => {
        this.confirmLoading = false
        this.$emit('ok')
      })
    },
    handleCancel (e) {
      this.$emit('cancel')
    }
  }
}
</script>

<style scope>
  .code-box-meta {position: relative;padding: 18px 32px;border-radius: 0 0 2px 2px;transition: background-color 0.4s;width: 100%;font-size: 14px;border: 1px solid #e8e8e8;}
  .selecedBox{height: 80px; overflow-x: hidden;}
  .selecedBox .ant-tag{margin-bottom: 10px;}
  .code-box-meta > h4 {position: absolute;top: -14px;padding: 1px 8px;margin-left: -8px;color: #777;border-radius: 2px 2px 0 0;background: #fff;font-size: 14px;width: auto;}
  .userhead{width: 20px;vertical-align: middle;border-radius: 50%; margin-right: 5px;}
  .bighead{width: 120px;height: 120px;border-radius: 50%;}
  .popBox{width: 240px;}
  .popBox .ant-row{margin-bottom: 15px;}
  .nickname{padding-top: 40px;font-size: 16px;font-weight: 700;}
  .ant-tag-blue{border:0;background:none;}
</style>
