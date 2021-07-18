<template>
  <div>
    <a-tabs :defaultActiveKey="0" >
      <a-tab-pane tab="课程数据" :key="0">
        <i-content type="course" :listColumns="courseList" :detailColumns="courseDetail"></i-content>
      </a-tab-pane>
      <a-tab-pane tab="考试数据" :key="1">
        <i-content type="exam" :listColumns="examList" :detailColumns="examDetail"></i-content>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import iContent from './content.vue'
const courseList = [
  { title: '课程名称', dataIndex: 'course_name', key: 'course_name', scopedSlots: { customRender: 'course_name' } },
  { title: '任务名称', dataIndex: 'lesson_name', key: 'lesson_name', scopedSlots: { customRender: 'lesson_name' } },
  { title: '报名总人数', dataIndex: 'subscribeTotal', key: 'subscribeTotal', align: 'center', width: 110 },
  { title: '未学/在学/学完人数', dataIndex: 'studyNum', key: 'studyNum', scopedSlots: { customRender: 'studyNum' }, align: 'center', width: 160 },
  { title: '完成比例', dataIndex: 'complete_precent', key: 'complete_precent', scopedSlots: { customRender: 'complete_precent' }, align: 'center', width: 100 },
  { title: '任务时长', dataIndex: 'duration', key: 'duration', scopedSlots: { customRender: 'duration' }, align: 'center', width: 140 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 100 }
]
const courseDetail = [
  { title: '学员姓名', dataIndex: 'nickname', key: 'nickname', width: 120 },
  // { title: '是否完成', key: 'is_complete', dataIndex: 'is_complete', scopedSlots: { customRender: 'is_complete' }, align: 'center', width: 110 },
  { title: '学习状态', key: 'learn_state', dataIndex: 'learn_state', scopedSlots: { customRender: 'learn_state' }, align: 'center', width: 110 },
  { title: '学习时长', key: 'learning_duration', dataIndex: 'learning_duration', scopedSlots: { customRender: 'duration' }, align: 'center', width: 140 }
]
const examList = [
  { title: '考试名称', dataIndex: 'paper_name', key: 'paper_name' },
  { title: '报名总人数', dataIndex: 'subscribeTotal', key: 'subscribeTotal', align: 'center', width: 110 },
  { title: '未参考/参考/通过', dataIndex: 'testNum', key: 'testNum', scopedSlots: { customRender: 'testNum' }, align: 'center', width: 160 },
  { title: '通过率', dataIndex: 'complete_precent', key: 'complete_precent', scopedSlots: { customRender: 'complete_precent' }, align: 'center', width: 100 },
  { title: '满分', dataIndex: 'totalScore', key: 'totalScore', align: 'center', width: 100 },
  { title: '及格分', dataIndex: 'pass_score', key: 'pass_score', align: 'center', width: 100 },
  { title: '考试时长', key: 'duration', dataIndex: 'duration', scopedSlots: { customRender: 'duration' }, align: 'center', width: 140 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 100 }
]
const examDetail = [
  { title: '学员姓名', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '考试得分', key: 'score', dataIndex: 'score', align: 'center', width: 110 },
  { title: '考试结果', key: 'exam_pass_state', dataIndex: 'exam_pass_state', scopedSlots: { customRender: 'exam_pass_state' }, align: 'center', width: 110 },
  { title: '考试时长', key: 'duration', dataIndex: 'duration', scopedSlots: { customRender: 'duration' }, align: 'center', width: 140 }
]
export default {
  name: 'detail',
  components: {
    iContent
  },
  data () {
    return {
      courseList,
      courseDetail,
      examList,
      examDetail
    }
  }
}
</script>
