<template>
  <a-row>
    <a-col :span="12">
      <a-table :columns="taskColumns" :dataSource="taskList" :pagination="false" rowKey="hash_id">
        <template slot="customTitle" slot-scope="list, tr, index">
          <span v-if="tr.type === 'course'">第{{index + 1}}节 <a-icon type="book" /> 【课程】{{tr.title}}</span>
          <span v-else-if="tr.type === 'exam'">第{{index + 1}}节 <a-icon type="edit" /> 【考试】{{tr.title}}</span>
          <span v-else>任务{{index + 1}} 【{{tr.type}}】{{tr.title}}</span>
        </template>
        <template slot="action" slot-scope="item">
          <a href="javascript:;" @click="reviewTask(item)" v-if="item.type !== 'course'">查看详情</a>
        </template>
      </a-table>
    </a-col>
    <a-col :span="12">
      <a-table :columns="currentItem.type === 'exam' ? detailExamColumns : detailLessonColumns" :dataSource="taskDetail" :loading="loading" rowKey="hash_id" :pagination="false">
        <template slot="is_complete" slot-scope="text">
          <span v-if="text === '--'">--</span>
          <a-tag v-else>{{text ? '已通过' : '未通过'}}</a-tag>
        </template>
      </a-table>
      <i-pagination :pagination="pagination" @change="getStudents" />
    </a-col>
  </a-row>
</template>

<script>
var taskColumns = [
  { title: '名称', dataIndex: 'title', key: 'title', scopedSlots: { customRender: 'customTitle' } },
  { title: '完成度', dataIndex: 'learned_percent', key: 'learned_percent', width: 100, align: 'center' },
  { title: '', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 100 }
]
var detailLessonColumns = [
  { title: '学员姓名', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'name' } },
  { title: '是否完成', dataIndex: 'is_complete', key: 'is_complete', scopedSlots: { customRender: 'is_complete' }, width: 100, align: 'center' },
  { title: '学习时长', dataIndex: 'learning_duration', key: 'learning_duration', width: 100, align: 'center' }
]
var detailExamColumns = [
  { title: '学员姓名', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'name' } },
  { title: '考试得分', dataIndex: 'score', key: 'score', width: 100, align: 'center' },
  { title: '考试结果', dataIndex: 'is_passed', key: 'is_passed', scopedSlots: { customRender: 'is_passed' }, width: 100, align: 'center' }
]
export default {
  name: 'rTaskList',
  data () {
    return {
      loading: false,
      taskColumns,
      detailLessonColumns,
      detailExamColumns,
      taskList: [],
      taskDetail: [],
      currentItem: {},
      pagination: {
        type: '学员',
        total: 0, // 总条数
        current_page: 1
      }
    }
  },
  props: ['id', 'type'],
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.$api[this.type].taskList({hash_id: this.id}).then(res => {
        res.data.forEach((item, index) => {
          item.hash_id = item.type + item.hash_id
          if (item.lessons && item.lessons.length) {
            item.children = item.lessons.map(item => {
              item.title = item.name
              return item
            })
          }
          this.taskList.push(item)
        })
      })
    },
    getStudents (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      let item = this.currentItem
      if (item.type === 'exam') {
        this.$api[this.type].examDetail({
          current_page,
          per_page,
          hash_task_id: item.hash_id.replace('exam', ''),
          hash_id: this.id
        }).then(res => {
          this.loading = false
          this.taskDetail = res.data.list
          this.pagination.total = res.data.info.total
        })
      } else {
        this.$api[this.type].lessonDetail({
          current_page,
          per_page,
          hash_lesson_id: item.hash_id,
          hash_id: this.id
        }).then(res => {
          this.loading = false
          this.taskDetail = res.data.list
          this.pagination.total = res.data.info.total
        })
      }
    },
    reviewTask (item) {
      this.currentItem = item
      this.getStudents()
    }
  }
}
</script>
