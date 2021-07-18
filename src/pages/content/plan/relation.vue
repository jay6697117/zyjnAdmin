<template>
  <div>
    <r-detail :id="id" @updateState="updateState"></r-detail>
    <a-tabs :defaultActiveKey="tab">
      <a-tab-pane tab="学员管理" :key="0">
        <r-student-list :id="id" type="plan" :columns="planColumns" :can="canImport"></r-student-list>
      </a-tab-pane>
      <a-tab-pane tab="任务管理" :key="1">
        <r-task :plan_id="id"></r-task>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import rDetail from './planDetail.vue'
import rTask from './rTask.vue'
import rStudentList from '@/pages/components/content/rStudentList.vue'
export default {
  name: 'courseRelation',
  data () {
    return {
      canImport: false,
      planColumns: [
        { title: '学员', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'nickname' } },
        { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 150, align: 'center' },
        { title: '计划进度', dataIndex: 'learned_percent', key: 'learned_percent', scopedSlots: { customRender: 'learned_percent' }, width: 160, align: 'center' },
        { title: '学习时长', dataIndex: 'learning_duration', key: 'learning_duration', scopedSlots: { customRender: 'learning_duration' }, width: 140, align: 'center' },
        { title: '参与考试', dataIndex: 'exam_submit_num', key: 'exam_submit_num', scopedSlots: { customRender: 'exam_submit_num' }, width: 100, align: 'center' },
        { title: '通过率', dataIndex: 'exam_pass_percent', key: 'exam_pass_percent', scopedSlots: { customRender: 'exam_pass_percent' }, width: 100, align: 'center' },
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 100, align: 'center' }
      ]
    }
  },
  components: {
    rDetail,
    rTask,
    rStudentList
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    tab () {
      return this.$route.query.tab
    }
  },
  methods: {
    updateState (state) {
      this.canImport = state
    }
  }
}
</script>
