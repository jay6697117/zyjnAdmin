<template>
  <div>
    <r-detail :id="id" @updateState="updateState"></r-detail>
    <a-tabs :defaultActiveKey="tab">
      <a-tab-pane tab="学员管理" :key="0">
        <r-student-list :id="id" type="course" :columns="courseColumns" :can="canImport"></r-student-list>
      </a-tab-pane>
      <a-tab-pane tab="内容管理" :key="1">
        <r-content :course_id="id"></r-content>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import rDetail from './courseDetail.vue'
import rContent from './rContent.vue'
import rStudentList from '@/pages/components/content/rStudentList.vue'
export default {
  name: 'courseRelation',
  data () {
    return {
      canImport: false,
      courseColumns: [
        { title: '学员', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'nickname' } },
        { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 150, align: 'center' },
        { title: '学习进度', dataIndex: 'learned_percent', key: 'learned_percent', scopedSlots: { customRender: 'learned_percent' }, width: 150 },
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 100, align: 'center' }
      ]
    }
  },
  components: {
    rDetail,
    rContent,
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
