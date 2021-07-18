<template>
  <div class="courseContent">
    <a-row>
      <a-col :sm="6" :xs="24">
        <a-button type="primary" @click="addLesson" v-if="$power(['courseAdd'])">创建新讲</a-button>
        <a-button type="primary" @click="addLessons" v-if="$power(['courseAdd'])">批量创建</a-button>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <i-filter :filters="filters" @search="onSearch" placeholder="名称"></i-filter>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="lessonData" :loading="loading" rowKey="hash_id" :pagination="false">
      <template slot="order" slot-scope="order, txt, index"><span class="order">{{(index + 1) > 9 ? (index + 1) :('0' + (index + 1))}}</span></template>
      <template slot="customTitle">{{name}}</template>
      <template class="customTd" slot-scope="customTd">{{customTd}}</template>
      <template slot="typeTitle">{{type}}</template>
      <template slot="mediaType" slot-scope="text">{{text.type}}</template>
      <template slot="duration" slot-scope="td">
        {{ td | durationFormat('秒') }}
      </template>
      <template slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</template>
      <template slot="action" slot-scope="action,item,index">
        <a href="javascript:;" v-show="(index!==0)" @click="move(item, index, 'up')" v-if="$power(['courseSort'])">上移</a>
        <a-divider type="vertical" v-show="(index !== 0)"/>
        <a href="javascript:;" @click="move(item, index, 'down')" v-show="(index !== length  -1)" v-if="$power(['courseSort'])">下移</a>
        <a-divider type="vertical" v-show="(index !== length - 1)"/>
        <a href="javascript:;" @click="editLesson(action)" v-if="$power(['courseEdit'])">编辑</a>
        <a-divider type="vertical"  v-if="$power(['courseEdit', 'courseRemove'])"/>
        <i-remove :id="action.hash_id" :parmas="removeParmas" action="deleteLesson" @reset="getInfo" @loading="setLoading" v-if="$power(['courseRemove'])">
          <a href="javascript:;" slot="operation">移除</a>
        </i-remove>
      </template>
    </a-table>
    <a-modal
      :title="ModalTitle"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      okText="确定"
      cancelText="我再想想"
    >
      <p>{{ModalText}}</p>
    </a-modal>
    <a-modal title="选择资源" :visible="courseChoise.show" okText="确认选择" cancelText="取消" :width="1200"
    @ok="handleCourseDone" @cancel="handleChoiseCancel" >
      <a-row :gutter="12">
        <a-col :span="14" class="choiseSomeBox">
          <i-filter :filters="courseChoise.filters" :type="courseChoise.type" @search="onSearchCourse" placeholder="课程"></i-filter>
          <a-table :columns="courseColumns" :dataSource="courseListData" :loading="loading" rowKey="hash_id" size="small" :pagination="false" :rowSelection="{type: 'checkbox', selectedRowKeys: selectedCourseRowKeys, onChange: onSelectCourseChange, onSelect: onSelectCourse, onSelectAll: onSelectAllCourse}">
            <template slot="mediaType" slot-scope="td">
              {{td === 'video' ? '视频' : '音频'}}
            </template>
          </a-table>
          <a-pagination
          :current="coursePagination.current_page"
          :total="coursePagination.total"
          size="small"
          @change="getCourse"
          />
        </a-col>
        <a-col :span="10">
          <div class="selectTemp" style="height: 500px">
            <div class="selectAlllessons" v-for="item in courseTemp" :key="item.hash_id">
              <a-icon type="profile" class="profile" />
              <span class="title">{{item.fileName.substring(0, item.fileName.lastIndexOf('.'))}}</span>
              <a-icon type="close" class="colse" @click="removeCourseTemp(item.hash_id)" />
            </div>
          </div>
        </a-col>
      </a-row>
    </a-modal>
    <r-edit :flag="resouceflag" :key="editId" :courseInfo="courseInfo" :lessonId="lesson_id" @reload="getInfo" @cancel="cancel"></r-edit>
  </div>
</template>
<script>
import rEdit from '@/pages/components/course/resourceEdit.vue'
const columns = [
  {title: '序号', key: 'order', dataIndex: 'order', scopedSlots: { customRender: 'order' }, align: 'center', width: 60},
  {title: '名称', dataIndex: 'name', key: 'name', scopedSlots: { title: 'customTitle' }, align: 'left'},
  {title: '类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'mediaType' }, align: 'left', width: 100},
  {title: '时长', key: 'duration', dataIndex: 'duration', scopedSlots: { customRender: 'duration' }, align: 'center', width: 140},
  {title: '创建时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 110},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 240}
]
const courseColumns = [
  { title: '资源名称', dataIndex: 'fileName', key: 'fileName', align: 'left' },
  { title: '资源类型', dataIndex: 'mediaType', key: 'mediaType', scopedSlots: { customRender: 'mediaType' }, align: 'center', width: 100 }
]
export default {
  name: 'columnContent',
  data () {
    return {
      editId: 0,
      ModalTitle: '删除课程',
      visible: false,
      ModalText: '删除后用户将无法使用，且不可恢复，确认删除吗？',
      confirmLoading: false,
      type: '资源类型',
      name: '名称',
      columns,
      courseColumns,
      courseChoise: {
        type: 'resource', // 请求方法的路径
        show: false, // 展示
        filters: { // 筛选条件 无=={}
          hash_category_id: '0',
          mediaType: '',
          search_content: ''
        }
      },
      coursePagination: {
        type: 'account',
        total: 0, // 总条数
        current_page: 1,
        hideSize: true // 弹窗内列表传次参数，其他不传
      },
      courseTemp: [],
      courseListData: [],
      selectedCourseRowKeys: [],
      loading: false,
      courseInfo: {},
      lessonData: [],
      resouceflag: false,
      showRelatedCourse: false,
      lessonmediaType: '',
      resource_ids: [],
      filters: {
        search_content: '',
        mediaType: ''
      },
      removeParmas: {
        parentId: this.$route.query.id,
        title: '移除讲',
        path: 'course',
        canRemove: true,
        searchBind: true,
        tips: '移除会清空本讲下学员的学习数据，包含下列关联的培训计划，是否移除？',
        content: '移除会清空本讲下学员的学习数据，是否移除？'
      },
      lesson_id: '',
      length: 0
    }
  },
  props: ['course_id'],
  components: {
    rEdit
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    removeOk () {
      this.$router.push({
        path: '/content/course/list'
      })
    },
    setLoading (loading) {
      this.loading = loading
    },
    onSearch (filters) {
      this.filters = filters
      this.getInfo()
    },
    getInfo () {
      this.loading = true
      let _self = this
      _self.$api.course.lessons({// 编辑时请求远端数据
        hash_resource_id: _self.course_id,
        mediaType: this.lessonmediaType,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.resource_ids = []
          this.lessonData = res.data.list.map((item) => {
            let type = ''
            if (item.mediaType === 'video') {
              type = '视频'
            }
            if (item.mediaType === 'audio') {
              type = '音频'
            }
            item.type = {
              type: type
            }
            return item
          })
          this.length = this.lessonData.length
          for (let i = 0; i < res.data.list.length; i++) {
            this.resource_ids.push(res.data.list[i].id)
          }
        } else {
          this.lessonData = []
        }
        this.$store.commit('setRelatedId', this.resource_ids)
        this.loading = false
        this.courseInfo = res.data.course_info
      })
    },
    edit (item) { // 编辑课程
      this.$router.push({
        path: '/content/course/edit',
        query: {
          id: this.course_id
        }
      })
    },
    upItem (item) { // 上下架课程
      this.loading = true
      var parmas = {
        hash_id: this.course_id,
        publishSetting: item.publishSetting
      }
      this.$api.course.publish(parmas).then(res => {
        this.loading = false
        this.getInfo()
      })
    },
    addLesson () { // 添加音频、视频、图文
      this.lesson_id = ''
      this.resouceflag = true
    },
    editLesson (item) { // 编辑讲
      this.lesson_id = item.hash_id
      this.resouceflag = true
    },
    handleOk (e) {
      this.$api.course.remove({
        id: this.course_id
      }).then(res => {
        if (res.code === 0) {
          this.loading = false
          this.$router.push({
            path: '/content/course/list'
          })
        }
      })
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel (e) {
      this.visible = false
    },
    cancel () {
      this.editId++
      this.resouceflag = false
    },
    move (item, index, type) {
      let data = this.lessonData
      if (type === 'up') {
        let current = data[index].hash_id
        data[index].hash_id = data[index - 1].hash_id
        data[index - 1].hash_id = current
      } else {
        let current = data[index].hash_id
        data[index].hash_id = data[index + 1].hash_id
        data[index + 1].hash_id = current
      }
      let transData = {}
      transData.hash_lesson_ids = []
      transData.hash_id = this.course_id
      for (let i in data) {
        transData.hash_lesson_ids.push(data[i].hash_id)
      }
      this.$api.course.sort(transData).then(res => {
        if (res.code === 0) {
          this.getInfo()
        }
      })
    },
    // course
    removeCourseTemp (user) {
      this.courseTemp = this.courseTemp.filter(item => item.hash_id !== user)
      this.selectedCourseRowKeys = this.selectedCourseRowKeys.filter(item => item !== user)
    },
    addLessons () {
      this.courseChoise.show = true
      this.getCourse(1)
    },
    onSearchCourse (filters) {
      this.filters = filters
      this.getCourse(1)
    },
    getCourse (current_page = this.coursePagination.current_page, per_page = 10) {
      // eslint-disable-next-line camelcase
      this.coursePagination.current_page = current_page
      this.loading = true
      this.$api.resource.list({
        current_page,
        per_page,
        ...this.filters
      }).then(res => {
        if (res.data.list) {
          this.courseListData = res.data.list
          this.coursePagination.total = res.data.info.total
        } else {
          this.data = []
          this.coursePagination.total = res.data.info.total
        }
        this.loading = false
      })
    },
    onSelectCourseChange (selectedCourseRowKeys, items) {
      this.selectedCourseRowKeys = selectedCourseRowKeys
    },
    onSelectCourse (record, selected, selectedRows, nativeEvent) {
      if (selected) {
        this.courseTemp.push(record)
      } else {
        this.courseTemp = this.courseTemp.filter(item => item.hash_id !== record.hash_id)
      }
    },
    onSelectAllCourse (selected, selectedRows, changeRows) {
      if (selected) {
        this.courseTemp = this.courseTemp.concat(changeRows)
      } else {
        let tempIds = changeRows.map(item => item.hash_id)
        this.courseTemp = this.courseTemp.filter(item => tempIds.indexOf(item.hash_id) < 0)
      }
    },
    handleCourseDone () {
      if (this.selectedCourseRowKeys.length) {
        this.$api.course.createList({
          hash_resource_id: this.course_id,
          hash_library_ids: this.courseTemp.map(item => item.hash_id)
        }).then(res => {
          if (!res.code) {
            this.getInfo()
            this.$message.success('创建成功')
          }
          this.selectedCourseRowKeys = []
          this.courseTemp = []
        })
      }
      this.courseChoise.show = false
    },
    handleChoiseCancel () {
      this.courseChoise.show = false
      this.courseTemp = []
      this.selectedCourseRowKeys = []
    }
  }
}
</script>
<style scope>
  .chose_box{padding:0 20px;}
  .chose_box li{cursor:pointer;width:46%;margin:1%;border:1px solid #999;display:inline-block;text-align:center;padding:20px 20px 35px 20px;}
  .chose_box li .icon{font-size:50px;margin:30px 0;}
  .courseContent .order{color: #bbb;}
  .ant-table-tbody .coursehead{width: 60px;height: 45px;margin-right: 8px;}
  .selectTemp{overflow-x: hidden;}
  .selectAlllessons{background: #eee;border: 2px solid #eee;border-radius: 25px; padding: 4px 36px; margin: 4px;position: relative;}
  .selectAlllessons.excess{border: 2px solid red;}
  .selectAlllessons.excess .excessTips{color: red;}
  .selectAlllessons img{width: 80px;height: 60px;vertical-align: top;float: left;margin-right: 4px;}
  .selectAlllessons .title{display: flex;height: 40px;line-height: 20px; overflow: hidden;align-items: center;}
  .selectAlllessons .type{position: absolute;display: block;height: 18px; line-height: 18px; width: 44px; text-align: center; left: 40px; top: 46px;font-size: 11px; background: #1890ff; color: #fff;border-radius: 6px 0 0 0;}
  .selectAlllessons .colse{position: absolute; top: 16px; right: 8px;}
  .selectAlllessons .profile{position: absolute; top: 16px; left: 8px;font-size: 18px;}
  .choiseSomeBox .ant-pagination{padding-top: 12px; text-align: right;}
</style>
