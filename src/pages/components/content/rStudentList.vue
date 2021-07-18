<template>
  <div class="stundetList">
    <a-row class="selectTop">
      <a-col :span="6" style="padding-top:4px;">
        <a-button @click="openStudent" v-if="can && $power('add')">导入学员</a-button>
      </a-col>
      <a-col :span="18" align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="学员名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="data" :loading="loading" rowKey="hash_user_id" :pagination="false">
      <template slot="learning_duration" slot-scope="td">
        {{ td | durationFormat('秒') }}
      </template>
      <template slot="is_passed" slot-scope="text">
        <a-badge status="error" text="未通过" v-if="text == '0'"/>
        <a-badge status="success" text="已通过" v-if="text == '1'"/>
        <a-badge color="#000" text="未参加" v-if="text == '--'"/>
      </template>
      <span slot="submit_time" slot-scope="submit_time">{{submit_time | timeFormat('yyyy-MM-dd')}}</span>
      <template slot="learned_percent" slot-scope="td, tr">
        <span>{{td}}%</span>
        <a href="javascript:;" @click="review(td, tr)">查看详情</a>
      </template>
      <template slot="operation" slot-scope="item">
        <a-popconfirm title="确定移除该学员?" @confirm="deleteThis(item)" okText="确定" cancelText="取消">
          <a-button type="dashed" icon="delete" v-if="$power('remove')">移除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <i-choose :params="params" @ok="imported" @cancel="onhandleCancel" type="student" :objectId="id" :menuType="type"/>
    <student-detail :detail="detail" @cancel="closeDetail" />
  </div>
</template>

<script>
import studentDetail from './studentDetail.vue'

export default {
  name: 'cRelation',
  data () {
    return {
      data: [],
      loading: false,
      pagination: {
        type: '学员',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: ''
      },
      params: {
        type: 'account', // 请求方法的路径
        name: '学员', // 名称
        show: false, // 展示
        tableKey: 'hash_user_id', // 表格的key
        selectionType: 'checkbox', // 多选 'checkbox'
        haveCreateButton: false, // 新建按钮
        filters: { // 筛选条件 无=={}
          search_content: ''
        },
        selectedRowKeys: [], // 列表中的已选项 无==[]
        columns: [
          { title: '学员', dataIndex: 'user.username', key: 'user.username', scopedSlots: { customRender: 'user.username' } },
          { title: '姓名', dataIndex: 'nickname', key: 'nickname', width: 100 },
          { title: '手机号', dataIndex: 'user.mobile', key: 'user.mobile', width: 150 },
          { title: '状态', dataIndex: 'user.status', key: 'user.status', width: 120, scopedSlots: { customRender: 'userStatus' } }
        ]
      },
      detail: {
        show: false,
        name: '学习',
        type: 'plan',
        data: {}
      }
    }
  },
  components: {
    studentDetail
  },
  props: ['id', 'type', 'columns', 'can'],
  mounted () {
    this.getList()
  },
  methods: {
    onSearch (filters) {
      this.filters = filters
      this.getList(1)
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api[this.type].studentList({
        hash_id: this.id,
        current_page,
        per_page,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.data = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.data = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    deleteThis (item) {
      this.$api[this.type].studentRemove({
        hash_id: this.id,
        hash_ids: [item.hash_id]
      }).then(res => {
        if (res.code === 0) {
          this.getList()
        }
      })
    },
    openStudent () {
      this.params.show = true
    },
    onhandleCancel (e) {
      this.params.show = false
    },
    imported (keys) {
      this.$api[this.type].studentInsert({
        hash_id: this.id,
        items: [
          {key: 'uids', value: keys}
        ]
      }).then(res => {
        this.params.show = false
        if (res.code === 0) {
          this.getList(1)
        }
      })
    },
    review (speed, item) {
      this.$api[this.type].studyDetail({
        hash_id: this.id,
        hash_user_id: item.hash_user_id
      }).then(res => {
        this.detail.show = true
        this.detail.speed = speed
        this.detail.data = res.data
      })
    },
    closeDetail () {
      this.detail.show = false
    }
  }
}
</script>

<style scope>
  .selectTop{background: rgb(238, 234, 234);padding: 10px 15px;}
</style>
