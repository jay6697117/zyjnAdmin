<template>
  <div>
    <a-tabs defaultActiveKey="0" >
      <a-tab-pane tab="课程数据" key="0">
        <i-content type="course" :listColumns="courseList"></i-content>
      </a-tab-pane>
      <a-tab-pane tab="培训计划数据" key="1">
        <i-content type="project_plan" :listColumns="planList"></i-content>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import iContent from './content.vue'
const courseList = [
  { title: '课程名称', dataIndex: 'title', key: 'title' },
  { title: '内容类型', dataIndex: 'isPurchaseCourse', key: 'isPurchaseCourse', scopedSlots: { customRender: 'isPurchaseCourse' }, align: 'center', width: 110 },
  { title: '加入时间', dataIndex: 'created_at', key: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', sorter: true, width: 120 },
  { title: '已学/总讲数', dataIndex: 'studyNum', key: 'studyNum', scopedSlots: { customRender: 'studyNum' }, align: 'center', width: 160 },
  { title: '学习比例', dataIndex: 'learned_percent', key: 'learned_percent', scopedSlots: { customRender: 'learned_percent' }, align: 'center', width: 100 },
  { title: '学习时长', dataIndex: 'learning_duration', key: 'learning_duration', scopedSlots: { customRender: 'learning_duration' }, align: 'center', sorter: true, width: 140 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 100 }
]
const planList = [
  { title: '培训计划名称', dataIndex: 'title', key: 'title' },
  { title: '报名时间', dataIndex: 'created_at', key: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', sorter: true, width: 120 },
  { title: '上课结束时间', dataIndex: 'end_time', key: 'end_time', scopedSlots: { customRender: 'end_time' }, align: 'center', sorter: true, width: 120 },
  { title: '已学任务数/总任务数', dataIndex: 'studyNum', key: 'studyNum', scopedSlots: { customRender: 'studyNum' }, align: 'center', width: 160 },
  { title: '学习比例', dataIndex: 'learned_percent', key: 'learned_percent', scopedSlots: { customRender: 'learned_percent' }, align: 'center', width: 100 },
  { title: '学习时长', dataIndex: 'learning_duration', key: 'learning_duration', scopedSlots: { customRender: 'learning_duration' }, align: 'center', sorter: true, width: 140 },
  { title: '已参考/考试总数', dataIndex: 'examNum', key: 'examNum', scopedSlots: { customRender: 'examNum' }, align: 'center', width: 160 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 100 }
]
export default {
  name: 'studentDataDetail',
  components: {
    iContent
  },
  data () {
    return {
      courseList,
      planList
    }
  }
}
</script>
