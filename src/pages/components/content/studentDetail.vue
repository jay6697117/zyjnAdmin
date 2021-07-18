<template>
<div>
  <a-modal :title='`学员${detail.name}情况`' :visible="detail.show" @cancel="handleCancel" :footer="null" :width="960" class="userDetail">
    <div class="detailTop">
      <a-row>
        <a-col :span="15">
          <img :src="info.avatarUrl" class="bighead">
          {{info.nickname}}
        </a-col>
        <a-col :span="3" align="center">
          <strong>学习进度</strong>
          <div class="dataContent">{{detail.speed}}%</div>
        </a-col>
      </a-row>
    </div>
    <div v-if="courseData.length">
      <h2 class="modalTitle">学习详情</h2>
      <a-table :columns="courseColumns" :dataSource="courseData" :pagination="false" rowKey="hash_id">
        <template slot="name" slot-scope="td, tr">
          {{tr.order}} 【{{types[tr.mediaType]}}】 {{tr.name}}
        </template>
        <template slot="learning_duration" slot-scope="td">
          {{ td | durationFormat('秒') }}
        </template>
        <template slot="learned_percent" slot-scope="td">
          {{td}}%
        </template>
      </a-table>
    </div>
    <div v-if="studyData.length">
      <h2 class="modalTitle">学习详情</h2>
      <a-table :columns="studyColumns" :dataSource="studyData" :pagination="false" rowKey="index">
        <template slot="name" slot-scope="td, tr">
          {{getType(tr)}}
        </template>
        <template slot="learning_duration" slot-scope="td">
          {{ td | durationFormat('秒') }}
        </template>
        <template slot="learned_percent" slot-scope="td">
          {{td}}%
        </template>
      </a-table>
    </div>
    <div v-if="examData.length">
      <h2 class="modalTitle">考试详情</h2>
      <a-table :columns="examColumns" :dataSource="examData" :pagination="false" rowKey="index">
      </a-table>
    </div>
  </a-modal>
</div>
</template>
<script>
var studyColumns = [
  { title: '计划详情', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
  { title: '完成度', dataIndex: 'learned_percent', key: 'learned_percent', scopedSlots: { customRender: 'learned_percent' }, width: 100, align: 'center' },
  { title: '学习时长', dataIndex: 'learning_duration', key: 'learning_duration', scopedSlots: { customRender: 'learning_duration' }, width: 140, align: 'center' }
]
var courseColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
  { title: '完成度', dataIndex: 'learned_percent', key: 'learned_percent', scopedSlots: { customRender: 'learned_percent' }, width: 100, align: 'center' },
  { title: '学习时长', dataIndex: 'learning_duration', key: 'learning_duration', scopedSlots: { customRender: 'learning_duration' }, width: 140, align: 'center' }
]
var examColumns = [
  { title: '考试名称', dataIndex: 'title', key: 'title' },
  { title: '考试得分', dataIndex: 'score', key: 'score', width: 100, align: 'center' },
  { title: '是否通过', dataIndex: 'is_passed', key: 'is_passed', width: 100, align: 'center' }
]
export default {
  name: 'studentList',
  data () {
    return {
      types: {
        video: '视频',
        audio: '音频'
      },
      studyColumns,
      examColumns,
      courseColumns,
      info: {},
      courseData: [],
      studyData: [],
      examData: []
    }
  },
  props: ['detail'],
  watch: {
    'detail.show': function (show) {
      if (show) {
        this.info = this.detail.data.userInfo
        let studyData = []
        let examData = []
        let courseData = []
        this.detail.data.studyDetail.forEach((item, index) => {
          if (item.itemType === 'course') {
            let course = {
              order: index + 1,
              index: index,
              type: item.itemType,
              name: item.title,
              learned_percent: item.learned_percent,
              learning_duration: item.learning_duration,
              children: item.lessons.map((lesson, i) => {
                lesson.order = i + 1
                lesson.index = index + '' + i
                return lesson
              })
            }
            studyData.push(course)
          } else if (item.itemType === 'exam') {
            item.index = index
            examData.push(item)
          } else if (item.mediaType === 'video' || item.mediaType === 'audio') {
            item.index = index
            courseData.push(item)
          }
        })
        this.studyData = studyData
        this.examData = examData
        this.courseData = courseData
      }
    }
  },
  methods: {
    getType (tr) {
      var resoult = ''
      if (tr.type === 'course') {
        resoult = `第${tr.order}节： 【课程】${tr.name}`
      }
      if (tr.type === '视频') {
        resoult = `任务${tr.order}： 【视频】${tr.name}`
      }
      if (tr.type === '音频') {
        resoult = `任务${tr.order}： 【音频】${tr.name}`
      }
      if (tr.type === 'exam') {
        resoult = `第${tr.order}节： 【考试】${tr.name}`
      }
      return resoult
    },
    handleCancel (e) {
      this.$emit('cancel')
    }
  }
}
</script>

<style scope>
  .userDetail .detailTop{background: rgb(238,238,238); padding: 15px;}
  .userDetail .detailTop strong{display: block; margin-top: 10px;}
  .userDetail .modalTitle{margin: 15px 0; padding: 0 10px; border-left: 3px solid rgb(79,74,225);font-size: 16px;line-height: 1;}
  .userDetail .bighead{width: 80px;height: 80px;border-radius: 50%;margin-right: 15px;}
  .userDetail .ant-tag{margin: 0 5px;}
  .userDetail .dataContent{margin-top: 15px;}
</style>
