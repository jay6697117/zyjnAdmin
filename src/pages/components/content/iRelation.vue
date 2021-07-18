<template>
  <div>
    <r-detail :id="id" :type="type" @updateState="updateState"></r-detail>
    <template v-if="type === 'plan'">
      <a-tabs defaultActiveKey="0">
        <a-tab-pane tab="学员管理" key="0">
          <r-student-list :id="id" :type="type" :columns="planColumns" :can="canImport"></r-student-list>
        </a-tab-pane>
        <!-- <a-tab-pane tab="任务数据" key="1">
          <r-task-list :id="id" :type="type"></r-task-list>
        </a-tab-pane> -->
      </a-tabs>
    </template>
    <template v-if="type === 'exam'">
      <a-tabs defaultActiveKey="0">
        <a-tab-pane tab="学员管理" key="0">
          <r-student-list :id="id" :type="type" :columns="examColumns" :can="canImport"></r-student-list>
        </a-tab-pane>
      </a-tabs>
    </template>
    <template v-if="type === 'purchase'">
      <a-tabs defaultActiveKey="0">
        <a-tab-pane tab="学员管理" key="0">
          <r-student-list :id="id" :type="type" :columns="purchaseColumns" :can="canImport"></r-student-list>
        </a-tab-pane>
      </a-tabs>
    </template>
  </div>
</template>
<script>
import rDetail from './rDetail.vue'
import rStudentList from './rStudentList.vue'
import rTaskList from './rTaskList.vue'

export default {
  name: 'relation',
  components: {
    rDetail,
    rStudentList,
    rTaskList
  },
  data () {
    return {
      canImport: false,
      examColumns: [
        { title: '学员', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'nickname' } },
        { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 150, align: 'center' },
        { title: '考试得分', dataIndex: 'score', key: 'score', scopedSlots: { customRender: 'score' }, width: 120, align: 'center' },
        { title: '考试结果', dataIndex: 'is_passed', key: 'is_passed', scopedSlots: { customRender: 'is_passed' }, width: 120, align: 'center' },
        { title: '提交时间', dataIndex: 'submit_time', key: 'submit_time', scopedSlots: { customRender: 'submit_time' }, width: 200, align: 'center' },
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 100, align: 'center' }
      ],
      planColumns: [
        { title: '学员', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'nickname' } },
        { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 150, align: 'center' },
        { title: '计划进度', dataIndex: 'learned_percent', key: 'learned_percent', scopedSlots: { customRender: 'learned_percent' }, width: 160, align: 'center' },
        { title: '学习时长', dataIndex: 'learning_duration', key: 'learning_duration', scopedSlots: { customRender: 'learning_duration' }, width: 100, align: 'center' },
        { title: '参与考试', dataIndex: 'exam_submit_num', key: 'exam_submit_num', scopedSlots: { customRender: 'exam_submit_num' }, width: 100, align: 'center' },
        { title: '通过率', dataIndex: 'exam_pass_percent', key: 'exam_pass_percent', scopedSlots: { customRender: 'exam_pass_percent' }, width: 100, align: 'center' },
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 100, align: 'center' }
      ],
      courseColumns: [
        { title: '学员', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'nickname' } },
        { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 150, align: 'center' },
        { title: '学习进度', dataIndex: 'learned_percent', key: 'learned_percent', scopedSlots: { customRender: 'learned_percent' }, width: 150 },
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 100, align: 'center' }
      ],
      purchaseColumns: [
        { title: '学员', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'nickname' } },
        { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 150, align: 'center' },
        { title: '课程进度', dataIndex: 'learned_percent', key: 'learned_percent', scopedSlots: { customRender: 'learned_percent' }, width: 150 },
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 100, align: 'center' }
      ]
    }
  },
  props: ['id', 'type'],
  methods: {
    updateState (state) {
      this.canImport = state
    }
  }
}
</script>
