<template>
  <div>
    <a-tabs :defaultActiveKey="0" >
      <a-tab-pane tab="课程数据" :key="0">
        <i-content type="course" :listColumns="courseList"></i-content>
      </a-tab-pane>
      <a-tab-pane tab="培训计划数据" :key="1">
        <i-content type="project_plan" :listColumns="planList"></i-content>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import iContent from './content.vue'
const courseList = [
  { title: '课程名称', dataIndex: 'course_name', key: 'course_name' },
  { title: '讲名称', dataIndex: 'lesson_name', key: 'lesson_name' },
  { title: '学习时间', dataIndex: 'created_at_day', key: 'created_at_day', scopedSlots: { customRender: 'created_at_day' }, align: 'center', sorter: true, width: 120 },
  { title: '学习时长', dataIndex: 'learned_duration', key: 'learned_duration', scopedSlots: { customRender: 'learned_duration' }, align: 'center', sorter: true, width: 140 }
]
const planList = [
  { title: '培训计划名称', dataIndex: 'plan_name', key: 'plan_name' },
  { title: '课程名称', dataIndex: 'course_name', key: 'course_name' },
  { title: '任务名称', dataIndex: 'lesson_name', key: 'lesson_name' },
  { title: '学习时间', dataIndex: 'created_at_day', key: 'created_at_day', scopedSlots: { customRender: 'created_at_day' }, align: 'center', sorter: true, width: 120 },
  { title: '学习时长', dataIndex: 'learned_duration', key: 'learned_duration', scopedSlots: { customRender: 'learned_duration' }, align: 'center', sorter: true, width: 140 }
]
export default {
  name: 'timeDataDetail',
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
