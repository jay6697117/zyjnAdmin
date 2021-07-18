<template>
<div class="planContent">
  <a-row>
    <a-col :span="24">
      <a-button type="primary" @click="addTask" v-if="$power(['taskAdd'])">添加任务</a-button>
    </a-col>
  </a-row>
  <a-table :columns="columns" :dataSource="taskListData" :loading="loading" :pagination="false" rowKey="hash_task_id">
    <template slot="order" slot-scope="order, txt, index">
      <span class="order">{{(index + 1) > 9 ? (index + 1) :('0' + (index + 1))}}</span>
    </template>
    <template slot="name" slot-scope="name, item">
      <span v-if="(item.resource_type === 'course')"><a-icon type="book" />【课程】</span>
      <span v-if="(item.resource_type === 'exam')"><a-icon type="edit" />【考试】</span>
      <span>{{item.title}}</span>
    </template>
    <template slot="task_num" slot-scope="task_num, item">
      <span v-if="item.resource_type === 'exam'">{{item.real_task_num}}</span>
      <span v-else>{{item.real_task_num}} / {{item.task_num}}</span>
    </template>
    <template slot="action" slot-scope="action, item, index">
      <a href="javascript:;" v-show="(index!==0)" @click="move(item, index, 'up')" v-if="$power(['taskSort'])">上移</a>
      <a-divider type="vertical" v-show="(index !== 0)"/>
      <a href="javascript:;" @click="move(item, index, 'down')" v-show="(index !== length  -1)" v-if="$power(['taskSort'])">下移</a>
      <a-divider type="vertical" v-show="(index !== length - 1)"/>
      <a href="javascript:;" @click="contentTask(action)" v-if="$power(['content:course:content'])">内容管理</a>
      <a-divider type="vertical"/>
      <a href="javascript:;" @click="editTask(action)" v-if="$power(['content:course:edit'])">编辑</a>
      <a-divider type="vertical"/>
      <i-remove :id="action.hash_task_id" :parmas="courseOperate" action="unbind" @reset="getTaskList" @loading="setLoading" v-if="action.resource_type === 'course' && $power(['taskRemove'])">
        <a href="javascript:;" slot="operation">移除</a>
      </i-remove>
      <i-remove :id="action.hash_task_id" :parmas="paperOperate" action="unbind" @reset="getTaskList" @loading="setLoading" v-if="action.resource_type === 'exam' && $power(['taskRemove'])">
        <a href="javascript:;" slot="operation">移除</a>
      </i-remove>
    </template>
  </a-table>
  <a-modal :visible="visible" title="选择任务类型" @cancel="handleCancel" :footer="null" width="50%" class="taskModal">
    <ul class="chose_box">
      <li @click="addContent">
        <a-icon type="book" class="icon"/>
        <p style="font-size:18px;">添加课程</p>
      </li><li @click="addExamInfo">
        <a-icon type="edit" class="icon"/>
        <p style="font-size:18px;">添加考试</p>
      </li>
    </ul>
  </a-modal>
  <exam-Info :flag="examShow" @ok="onhandleOk" @cancel="onhandleCancel" :planId="plan_id" @funcOne="getTaskExam" :paperInfo="paperInfo" :key="keyIndex"></exam-Info>
  <i-choose :params="params" @ok="getTaskCourse" @cancel="cancel" type="plan" :plan_id="plan_id"/>
</div>
</template>
<script>
import examInfo from '@/pages/components/content/examInfo.vue'
const columns = [
  {title: '序号', key: 'order', scopedSlots: { customRender: 'order' }, align: 'center', width: 60},
  {title: '任务名称', key: 'name', scopedSlots: { customRender: 'name' }, align: 'left'},
  {title: '任务数量', key: 'task_num', dataIndex: 'task_num', scopedSlots: { customRender: 'task_num' }, align: 'center', width: 120},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 320}
]
export default {
  name: 'cList',
  data () {
    return {
      params: {
        type: 'course', // 请求方法的路径
        name: '课程', // 名称
        show: false, // 展示
        tableKey: 'hash_id',
        selectionType: 'checkbox', // 多选 'checkbox'
        haveCreateButton: true, // 新建按钮
        filters: {
          search_content: ''
        }, // 筛选条件 无=={}
        otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
        selectedRowKeys: [], // 列表中的已选项 无==[]
        columns: [
          {title: '课程名称', dataIndex: 'title', key: 'title', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'pic' }, align: 'left'},
          {title: '上架时间', dataIndex: 'publishTime', key: 'publishTime', scopedSlots: { customRender: 'publishTime' }, align: 'center', width: 220}
        ]
      },
      columns,
      visible: false,
      hash_item_ids: [],
      taskListData: [],
      loading: false,
      examShow: false,
      paperInfo: '',
      hash_task_id: '',
      planInfo: {},
      courseOperate: {
        path: 'plan',
        canRemove: false,
        searchBind: false,
        title: '移除课程',
        content: '移除会清空课程下学员的学习数据，是否移除？'
      },
      paperOperate: {
        path: 'plan',
        canRemove: false,
        searchBind: false,
        title: '移除考试',
        content: '移除会清空学员考试数据，是否移除？'
      },
      keyIndex: 0
    }
  },
  computed: {
    plan_id () {
      return this.$route.query.id
    }
  },
  components: {
    examInfo
  },
  mounted () {
    this.getTaskList()
    this.getInfo()
  },
  methods: {
    setLoading (loading) {
      this.loading = loading
    },
    getInfo () {
      this.$api.plan.getInfo({
        hash_id: this.plan_id
      }).then(res => {
        this.planInfo = res.data
      })
    },
    getTaskList () {
      this.loading = true
      this.$api.plan.itemList({
        hash_id: this.plan_id
      }).then(res => {
        this.loading = false
        if (res.code === 0) {
          if (res.data) {
            this.hash_item_ids = []
            this.taskListData = res.data
            this.length = res.data.length
            for (let i = 0; i < res.data.length; i++) {
              this.hash_item_ids.push(res.data[i].hash_item_ids)
            }
          }
          this.$store.commit('setRelatedId', this.hash_item_ids)
        }
      })
    },
    addTask () { // 添加任务
      this.visible = true
    },
    handleCancel () { // 取消任务添加
      this.visible = false
    },
    addContent () { // 添加内容产品
      this.visible = false
      this.params.show = true
    },
    onhandleOk (data) {
      this.examShow = data
    },
    onhandleCancel (data) {
      this.examShow = data
    },
    cancel () {
      this.params.show = false
    },
    getTaskCourse (data) { // 获取课程内容
      this.params.show = false
      this.hash_item_ids = []
      this.loading = true
      let flag = false
      let transData = {}
      transData.hash_id = this.plan_id
      transData.hash_item_ids = this.hash_item_ids
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (i >= data.length - 1) {
            flag = true
          }
          this.hash_item_ids.push(data[i])
          if (flag) {
            transData.hash_item_ids = this.hash_item_ids
            this.$api.plan.addOnlineCourse(transData).then(res => {
              if (res.code === 0) {
                this.visible = false
                this.loading = false
                this.getTaskList()
              }
            })
          }
        }
      } else {
        this.loading = false
        this.visible = false
      }
    },
    addExamInfo () { // 添加考试弹窗
      this.visible = false
      this.examShow = true
      this.paperInfo = ''
    },
    editTask (item) { // 编辑任务
      this.hash_task_id = item.hash_task_id
      if (item.resource_type === 'exam') {
        this.examShow = true
        this.paperInfo = item
      } else {
        this.$router.push({
          path: '/content/course/edit',
          query: {
            id: item.item_id
          }
        })
      }
    },
    move (item, index, type) {
      let data = this.taskListData
      if (type === 'up') {
        data[index] = data.splice(index - 1, 1, data[index])[0]
        let current = data[index].order_num
        data[index].order_num = data[index - 1].order_num
        data[index - 1].order_num = current
      } else {
        data[index] = data.splice(index + 1, 1, data[index])[0]
        let current = data[index].order_num
        data[index].order_num = data[index + 1].order_num
        data[index + 1].order_num = current
      }
      let transData = {}
      transData.sorts = []
      for (let i in data) {
        transData.sorts.push(data[i].hash_task_id + '_' + data[i].order_num)
      }
      this.$api.plan.sort(transData).then(res => {
        if (res.code === 0) {
          this.getTaskList()
        }
      })
    },
    contentTask (item) {
      if (item.resource_type === 'exam') {
        this.$router.push({
          path: '/content/paper/edit',
          query: {
            id: item.hash_exam_id
          }
        })
      } else {
        this.$router.push({
          path: '/content/course/relation',
          query: {
            id: item.item_id,
            tab: 1
          }
        })
      }
    },
    getTaskExam (data) { // 获得考试信息
      this.examShow = false
      if (this.hash_task_id) {
        this.$api.plan.updateOnlineExam({
          hash_task_id: this.hash_task_id,
          ...data
        }).then(res => {
          if (res.code === 0) {
            this.getTaskList()
          }
        })
      } else {
        this.$api.plan.addOnlineExam(data).then(res => {
          if (res.code === 0) {
            this.getTaskList()
          }
        })
      }
    }
  }
}
</script>
<style scope>
  .taskModal .ant-modal-content{height: 100%;display: flex;flex-direction: column;}
  .taskModal .ant-modal-content .ant-modal-header{flex:0 0 55px}
  .taskModal .ant-modal-content .ant-modal-body{flex:1;overflow-x: hidden;}
  .taskModal .chose_box{padding:0 20px;display: flex}
  .taskModal .chose_box li{width:45%;border:1px solid #999;text-align:center;padding:20px 20px 35px 20px;list-style: none;}
  .taskModal .chose_box li:first-child{margin-right:10%;}
  .taskModal .chose_box li .icon{font-size:50px;margin:30px 0;}
  .taskModal .order{color: #bbb;}
</style>
