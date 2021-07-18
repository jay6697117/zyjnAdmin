<template>
  <div>
    <a-row>
      <a-col align="right">
        <i-filter :filters="filters"  @search="onSearch" placeholder="学员姓名"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columnsCourse" :dataSource="tableData" rowKey="hash_user_id" :loading="loading" :pagination="false" @change="handleTableChange">
      <template slot="study_state" slot-scope="study_state">
        <span v-if="study_state === 1">已学习</span>
        <span v-if="study_state === 2">未学习</span>
      </template>
      <template slot="join" slot-scope="td, tr">
        {{tr.joined_course_num}} / {{tr.joined_plan_num}}
      </template>
      <template slot="studyNum" slot-scope="td, tr">
        {{tr.not_learn_num}} / {{tr.learning_num}} / {{tr.complete_num}}
      </template>
      <template slot="learned_percent" slot-scope="td">
        <span v-if="!td">--</span>
        <span v-else>{{td}}%</span>
      </template>
      <template slot="last_learned_time" slot-scope="td">
        {{ td | timeFormat("yyyy-MM-dd hh:mm") }}
      </template>
      <template slot="learned_duration" slot-scope="td">
        {{ td | durationFormat('分') }}
      </template>
      <span slot="action" slot-scope="action">
        <a href="javascript:;" @click="toDetails(action)">查看详情</a>
      </span>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </div>
</template>
<script>
const columnsCourse = [
  { title: '学员姓名', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '学习状态', key: 'study_state', dataIndex: 'study_state', scopedSlots: { customRender: 'study_state' }, align: 'center', width: 110 },
  { title: '上次学习时间', key: 'last_learned_time', dataIndex: 'last_learned_time', scopedSlots: { customRender: 'last_learned_time' }, align: 'center', sorter: true, width: 110 },
  { title: '累计学习天数', key: 'learned_days', dataIndex: 'learned_days', align: 'center', sorter: true, width: 110 },
  { title: '累计学习时长', key: 'learned_duration', dataIndex: 'learned_duration', scopedSlots: { customRender: 'learned_duration' }, align: 'center', width: 140 },
  { title: '加入课程/培训计划', key: 'join', dataIndex: 'join', scopedSlots: { customRender: 'join' }, align: 'center', width: 110 },
  { title: '未学/在学/学完', key: 'studyNum', dataIndex: 'studyNum', scopedSlots: { customRender: 'studyNum' }, align: 'center', width: 110 },
  { title: '学习比例', key: 'learned_percent', dataIndex: 'learned_percent', scopedSlots: { customRender: 'learned_percent' }, align: 'center', width: 110 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 100 }
]
export default {
  name: 'planListData',
  data () {
    return {
      loading: false,
      columnsCourse,
      pagination: {
        type: '资源',
        total: 0, // 总条数
        current_page: 1
      },
      filters: {
        search_content: '',
        study_state: ''
      },
      tableData: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    onSearch (filters) {
      this.filters = filters
      this.getList(1)
    },
    handleTableChange (pagination, filters, sorter) {
      if (sorter.order) {
        let order = sorter.order === 'descend' ? 'desc' : 'asc'
        this.getList(this.pagination.current_page, this.$store.state.pageSize, sorter.field, order)
      } else {
        this.getList(this.pagination.current_page, this.$store.state.pageSize)
      }
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize, colum, direction) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.studentData.list({
        current_page,
        per_page,
        order_by_column: colum,
        order_by_direction: direction,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.tableData = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.tableData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    },
    toDetails (item) {
      this.$router.push({
        path: '/statistics/student/detail',
        query: {
          id: item.hash_user_id
        }
      })
    }
  }
}
</script>
<style scope></style>
