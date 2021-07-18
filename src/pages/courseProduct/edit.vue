<template>
  <div>
    <a-row style="background:#ccc;padding:20px;">
      <a-col :sm="18" :xs="24">
        <a-row :gutter="12">
          <a-col :sm="8" :xs="24">
            <img width="100%" :src="detail.cover">
          </a-col>
          <a-col :sm="16" :xs="24">
            <div class="title">{{detail.title}}</div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :sm="6" :xs="24" align="right">
      </a-col>
    </a-row>
    <div class="productContent">
      <a-row>
        <a-col :sm="6" :xs="24">
          <a-button type="primary" @click="relatedCourses">关联课程</a-button>
        </a-col>
        <a-col :sm="18" :xs="24" align="right">
          <i-filter :filters="filters" type="courseShop" @search="onSearch" placeholder="名称"></i-filter>
        </a-col>
      </a-row>
      <a-table :columns="columns" :dataSource="courseData" :loading="loading" rowKey="hash_course_id" :pagination="false">
        <div class="customTd" slot="customTd" slot-scope="customTd, customTr">
          <img :src="customTr.cover"/>
          <div class="description"><a href="javascript:;" @click="gotoReview(customTr)">{{customTr.course_name}}</a></div>
        </div>
        <template slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</template>
        <template slot="action" slot-scope="action, item">
          <a href="javascript:;" @click="remove(item)">移除</a>
        </template>
      </a-table>
    </div>
    <i-choose :params="params" @ok="getTaskCourse" @cancel="cancel" type="courseProduct" :objectId="product_id"/>
  </div>
</template>
<script>
const columns = [
  {title: '课程名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'customTd' }, align: 'left'},
  {title: '课程分类', dataIndex: 'category', key: 'category', align: 'left'},
  {title: '包含讲数', key: 'lesson_num', dataIndex: 'lesson_num', align: 'center', width: 140},
  {title: '关联时间', key: 'created_at', dataIndex: 'created_at', scopedSlots: { customRender: 'created_at' }, align: 'center', width: 110},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'right', width: 100}
]
export default {
  name: 'home',
  data () {
    return {
      detail: '',
      params: {
        type: 'courseShop', // 请求方法的路径
        name: '课程', // 名称
        show: false, // 展示
        tableKey: 'hash_id',
        selectionType: 'checkbox', // 多选 'checkbox'
        haveCreateButton: false, // 新建按钮
        filters: {
          search_content: '',
          hash_category_id: '0'
        }, // 筛选条件 无=={}
        otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
        selectedRowKeys: [], // 列表中的已选项 无==[]
        columns: [
          {title: '课程名称', dataIndex: 'title', key: 'title', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'pic' }, align: 'left'}
        ]
      },
      courseData: [],
      filters: {
        search_content: '',
        hash_category_id: '0'
      },
      loading: false,
      columns
    }
  },
  computed: {
    product_id () {
      return this.$route.query.id
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    onSearch (filters) {
      this.filters = filters
      this.getInfo()
    },
    getInfo () {
      this.$api.courseProduct.getInfo({ // 获取详情
        hash_id: this.product_id
      }).then(res => {
        this.detail = res.data
        this.getCourseList()
      })
    },
    relatedCourses () {
      this.params.show = true
    },
    getTaskCourse (data) { // 获取课程内容
      this.params.show = false
      this.hash_item_ids = []
      this.loading = true
      let flag = false
      let transData = {}
      transData.hash_id = this.product_id
      transData.hash_course_ids = this.hash_item_ids
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (i >= data.length - 1) {
            flag = true
          }
          this.hash_item_ids.push(data[i])
          if (flag) {
            transData.hash_course_ids = this.hash_item_ids
            this.$api.courseProduct.addCourse(transData).then(res => {
              if (res.code === 0) {
                this.visible = false
                this.loading = false
                this.getCourseList()
              }
            })
          }
        }
      } else {
        this.loading = false
        this.visible = false
      }
    },
    getCourseList () {
      this.$api.courseProduct.courses({ // 获取详情
        hash_id: this.product_id,
        ...this.filters
      }).then(res => {
        this.courseData = res.data
      })
    },
    cancel () {
      this.params.show = false
    },
    remove (item) {
      this.$api.courseProduct.removeCourse({hash_id: this.product_id, hash_course_id: item.hash_course_id}).then(res => {
        if (res.code === 0) {
          this.visible = false
          this.loading = false
          this.getCourseList()
        }
      })
    },
    gotoReview (item) {
      this.$router.push({
        path: '/course/detail',
        query: {
          hash_id: item.hash_id
        }
      })
    }
  }
}
</script>
<style>
  .productContent{margin-top:20px;}
  .productContent .ant-table-wrapper{margin-top:20px;}
</style>
