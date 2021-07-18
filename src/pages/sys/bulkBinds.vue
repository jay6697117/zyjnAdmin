<template>
  <div class="bulkBox">
    <div class="selectedBody">
      <div class="selectedChild">
        <div class="selectedHeader">
          <a-row>
            <a-col :span="18">
              <a-button type="primary" style="margin-right:20px" @click="choiseStudent">选择学员</a-button>
              <a-popconfirm title="清空已选学员?" @confirm="clearStudent" okText="确定" cancelText="取消">
                <a-button type="dashed"><a-icon type="delete" />清空已选</a-button>
              </a-popconfirm>
            </a-col>
            <a-col :span="6" align="right"> 已选 {{accountData.length}} 人 </a-col>
          </a-row>
        </div>
        <div class="selectedContent">
          <div class="selectAllStudent" v-for="item in accountData" :key="item.hash_user_id">
            <a-avatar icon="user" :src="item.avatar" />
            {{item.username}}
            <a-icon type="close" @click="removeStudent(item.hash_user_id)" />
          </div>
        </div>
      </div>
    </div>
    <div class="selectedBody">
      <div class="selectedChild">
        <div class="selectedHeader">
          <a-row>
            <a-col :span="18">
              <a-button type="primary" style="margin-right:20px" @click="choiseCourse">选择课程</a-button>
              <a-popconfirm title="清空已选课程?" @confirm="clearCourse" okText="确定" cancelText="取消">
                <a-button type="dashed"><a-icon type="delete" />清空已选</a-button>
              </a-popconfirm>
            </a-col>
            <a-col :span="6" align="right"> 已选 {{courseData.length}} 个课程 </a-col>
          </a-row>
        </div>
        <div class="selectedContent">
          <div class="selectAllCourse" v-for="item in courseData" :key="item.hash_id" :class="item.excess ? 'excess' : ''">
            <img :src="item.mediaCoverUrl" alt="">
            <span class="title">{{item.title}}</span>
            <span class="type">{{item.isPurchaseCourse ? '采购课' : '内部课'}}</span>
            <span v-if="item.isPurchaseCourse" class="excessTips">剩余: {{item.buyout ? '无限' : (item.pay_number - item.subscribeTotal)}}</span>
            <span v-if="item.excessTotal" class="excessTips">超出:{{item.excessTotal}}</span>
            <a-icon type="close" @click="removeCourse(item.hash_id)" />
          </div>
        </div>
      </div>
    </div>
    <a-row style="padding-top: 12px" justify="center" type="flex" :gutter="[24, 12]">
      <a-col :sm="3" :xs="24">
        <a-button type="primary" block @click="bindAll">确定</a-button>
      </a-col>
      <a-col :sm="3" :xs="24">
        <a-button block @click="cancel">返回</a-button>
      </a-col>
    </a-row>
    <a-modal title="选择学员" :visible="studentChoise.show" okText="确认选择" cancelText="取消" :width="1200"
    @ok="handleStudentDone" @cancel="handleCancel" >
      <a-row :gutter="[12, 12]">
        <a-col :sm="12" :xs="24" class="choiseSomeBox">
          <i-filter :filters="studentChoise.filters" :type="studentChoise.type" @search="onSearchStudent" placeholder="姓名"></i-filter>
          <a-table :columns="accountColumns" :dataSource="studentListData" :loading="loading" rowKey="hash_user_id" :pagination="false" :rowSelection="{type: 'checkbox', selectedRowKeys: selectedStudentRowKeys, onChange: onSelectStudentChange, onSelect: onSelectStudent, onSelectAll: onSelectAllStudent}">
            <template slot="nickname" slot-scope="text, item">
              <a href="javascript:;"><img :src="item.user.avatar" class="userhead">{{text}}</a>
            </template>
          </a-table>
          <a-pagination
          :current="studentPagination.current_page"
          :total="studentPagination.total"
          size="small"
          @change="getStudent"
          />
        </a-col>
        <a-col :sm="12" :xs="24">
          <div class="selectTemp">
            <div class="selectAllStudent" v-for="item in accountTemp" :key="item.hash_user_id">
              <a-avatar icon="user" :src="item.avatar" />
              {{item.username}}
              <a-icon type="close" @click="removeStudentTemp(item.hash_user_id)" />
            </div>
          </div>
        </a-col>
      </a-row>
    </a-modal>
    <a-modal title="选择课程" :visible="courseChoise.show" okText="确认选择" cancelText="取消" :width="1200"
    @ok="handleCourseDone" @cancel="handleCancel" >
      <a-row :gutter="[12, 12]">
        <a-col :sm="11" :xs="24" class="choiseSomeBox">
          <i-filter :filters="courseChoise.filters" :type="courseChoise.type" @search="onSearchCourse" placeholder="课程"></i-filter>
          <a-table :columns="courseColumns" :dataSource="courseListData" :loading="loading" rowKey="hash_id" size="small" :pagination="false" :rowSelection="{type: 'checkbox', selectedRowKeys: selectedCourseRowKeys, onChange: onSelectCourseChange, onSelect: onSelectCourse, onSelectAll: onSelectAllCourse,getCheckboxProps: getCheckboxProps}">
            <template slot="limit" slot-scope="td, tr">
              <span v-if="!tr.isPurchaseCourse">无限</span>
              <span v-else>
                {{tr.buyout ? '无限' : tr.pay_number - tr.subscribeTotal}}
              </span>
            </template>
            <template slot="customTd" slot-scope="td, tr">
              <img :src="tr.mediaCoverUrl" class="coursehead" style="float:left">
              <div class="customTdTitle">{{td}}</div>
            </template>
          </a-table>
          <a-pagination
          :current="coursePagination.current_page"
          :total="coursePagination.total"
          size="small"
          @change="getCourse"
          />
        </a-col>
        <a-col :sm="13" :xs="24">
          <div class="selectTemp" style="height: 700px">
            <div class="selectAllCourse" v-for="item in courseTemp" :key="item.hash_id">
            <img :src="item.mediaCoverUrl" alt="">
            <span class="title">{{item.title}}</span>
            <span class="type" style="background: #8568d5" v-if="item.isPurchaseCourse">采购课</span>
            <span class="type" v-else>内部课</span>
            <span v-if="item.isPurchaseCourse">
              剩余:
              <span v-if="item.buyout">无限</span>
              <span v-else>{{(item.pay_number - item.subscribeTotal) > 0 ? (item.pay_number - item.subscribeTotal) : 0}}</span>
            </span>
            <a-icon type="close" @click="removeCourseTemp(item.hash_id)" />
          </div>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
const accountColumns = [
  { title: '员工', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'nickname' } },
  { title: '电话', dataIndex: 'user.mobile', key: 'user.mobile', width: 130 }
]
const courseColumns = [
  { title: '课程', dataIndex: 'title', key: 'title', scopedSlots: { customRender: 'customTd' }, align: 'left' },
  { title: '剩余名额', dataIndex: 'pay_number', key: 'pay_number', scopedSlots: { customRender: 'limit' }, align: 'center', width: 100 }
]
export default {
  name: 'bulkBinds',
  data () {
    return {
      accountColumns,
      courseColumns,
      accountData: [],
      accountTemp: [],
      studentListData: [],
      selectedStudentRowKeys: [],
      courseData: [],
      courseTemp: [],
      courseListData: [],
      selectedCourseRowKeys: [],
      studentChoise: {
        type: 'account', // 请求方法的路径
        show: false, // 展示
        filters: { // 筛选条件 无=={}
          search_content: ''
        }
      },
      courseChoise: {
        type: 'course', // 请求方法的路径
        show: false, // 展示
        filters: { // 筛选条件 无=={}
          hash_category_id: '0',
          search_content: ''
        }
      },
      loading: false,
      studentPagination: {
        type: 'account',
        total: 0, // 总条数
        current_page: 1,
        hideSize: true // 弹窗内列表传次参数，其他不传
      },
      coursePagination: {
        type: 'account',
        total: 0, // 总条数
        current_page: 1,
        hideSize: true // 弹窗内列表传次参数，其他不传
      }
    }
  },
  methods: {
    getCheckboxProps (record) {
      return ({
        props: {
          disabled: (record.isPurchaseCourse && (record.buyout === 0) && (record.pay_number - record.subscribeTotal === 0))
        }
      })
    },
    bindAll () {
      if (!this.selectedStudentRowKeys.length) {
        this.$message.error('请选择学员')
      } else if (!this.selectedCourseRowKeys.length) {
        this.$message.error('请选择课程')
      } else {
        this.$api.account.bindStudent({
          hash_user_ids: this.selectedStudentRowKeys,
          hash_course_ids: this.selectedCourseRowKeys
        }).then(res => {
          if (res.code) {
            let data = res.data
            this.courseData = this.courseData.map(item => {
              for (var i in data) {
                if (data[i].hash_id === item.hash_id) {
                  item.excess = true
                  item.excessTotal = data[i].excessTotal
                }
              }
              return item
            })
          } else {
            this.$message.success('绑定成功')
            this.accountData = []
            this.selectedStudentRowKeys = []
            this.courseData = []
            this.selectedCourseRowKeys = []
          }
        })
      }
    },
    cancel () {
      this.$router.go(-1)
    },
    clearStudent () {
      this.accountData = []
      this.selectedStudentRowKeys = []
    },
    removeStudentTemp (user) {
      this.accountTemp = this.accountTemp.filter(item => item.hash_user_id !== user)
      this.selectedStudentRowKeys = this.selectedStudentRowKeys.filter(item => item !== user)
    },
    removeStudent (user) {
      this.accountData = this.accountData.filter(item => item.hash_user_id !== user)
      this.selectedStudentRowKeys = this.selectedStudentRowKeys.filter(item => item !== user)
    },
    choiseStudent () {
      this.accountTemp = this.accountData
      this.studentChoise.show = true
      this.getStudent(1)
    },
    onSearchStudent (filters) {
      this.studentChoise.filters = filters
      this.getStudent(1)
    },
    getStudent (current_page = this.studentPagination.current_page, per_page = 10) {
      // eslint-disable-next-line camelcase
      this.studentPagination.current_page = current_page
      this.loading = true
      this.$api.account.list({
        current_page,
        per_page,
        ...this.studentChoise.filters
      }).then(res => {
        if (res.data.list) {
          this.studentListData = res.data.list
          this.studentPagination.total = res.data.info.total
        } else {
          this.data = []
          this.studentPagination.total = res.data.info.total
        }
        this.loading = false
      })
    },
    onSelectStudentChange (selectedStudentRowKeys, items) {
      this.selectedStudentRowKeys = selectedStudentRowKeys
    },
    onSelectStudent (record, selected, selectedRows, nativeEvent) {
      if (selected) {
        this.accountTemp.push({
          username: record.user.username,
          avatar: record.user.avatar,
          hash_user_id: record.hash_user_id
        })
      } else {
        this.accountTemp = this.accountTemp.filter(item => item.hash_user_id !== record.hash_user_id)
      }
    },
    onSelectAllStudent (selected, selectedRows, changeRows) {
      if (selected) {
        this.accountTemp = this.accountTemp.concat(changeRows.map(item => {
          return {
            username: item.user.username,
            avatar: item.user.avatar,
            hash_user_id: item.hash_user_id
          }
        }))
      } else {
        let tempIds = changeRows.map(item => item.hash_user_id)
        this.accountTemp = this.accountTemp.filter(item => tempIds.indexOf(item.hash_user_id) < 0)
      }
    },
    handleStudentDone () {
      this.accountData = this.accountTemp
      this.studentChoise.show = false
    },
    // course
    clearCourse () {
      this.courseData = []
      this.selectedCourseRowKeys = []
    },
    removeCourseTemp (user) {
      this.courseTemp = this.courseTemp.filter(item => item.hash_id !== user)
      this.selectedCourseRowKeys = this.selectedCourseRowKeys.filter(item => item !== user)
    },
    removeCourse (user) {
      this.courseData = this.courseData.filter(item => item.hash_id !== user)
      this.selectedCourseRowKeys = this.selectedCourseRowKeys.filter(item => item !== user)
    },
    choiseCourse () {
      this.courseTemp = this.courseData
      this.courseChoise.show = true
      this.getCourse(1)
    },
    onSearchCourse (filters) {
      this.courseChoise.filters = filters
      this.getCourse(1)
    },
    getCourse (current_page = this.coursePagination.current_page, per_page = 10) {
      // eslint-disable-next-line camelcase
      this.coursePagination.current_page = current_page
      this.loading = true
      this.$api.course.allCourse({
        current_page,
        per_page,
        ...this.courseChoise.filters
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
      this.courseData = this.courseTemp
      this.courseChoise.show = false
    },
    handleCancel () {
      this.studentChoise.show = false
      this.courseChoise.show = false
    }
  }
}
</script>

<style scope>
  .selectAllStudent i{margin: 0px 6px; cursor: pointer;}
  .ant-table-tbody .userhead{width: 32px;height: 32px;margin-right: 8px;}
  .ant-table-tbody .coursehead{width: 60px;height: 45px;margin-right: 8px;}
  .bulkBox{flex: 1;display: flex; flex-direction: column;}
  .selectedBody{flex: 1;position: relative;}
  .selectedChild{position: absolute;height: 100%;width: 100%;display: flex; flex-direction: column;}
  .selectedHeader{flex: 0 0 65px; padding: 15px 0;}
  .selectedContent{flex: 1; border: 1px solid #ddd;overflow-x: hidden;padding: 8px;}
  .selectAllStudent{padding: 6px; border: 1px solid #ddd;float: left; border-radius: 24px;margin: 4px;}
  .selectAllCourse{background: #eee;border: 2px solid #eee; padding: 4px 26px 4px 4px; margin: 4px; float: left; width: 285px;height:70px;position: relative;}
  .selectAllCourse.excess{border: 2px solid red;}
  .selectAllCourse.excess .excessTips{color: red;}
  .selectAllCourse img{width: 80px;height: 60px;vertical-align: top;float: left;margin-right: 4px;}
  .selectAllCourse .title{display: block;height: 40px;line-height: 20px; overflow: hidden;}
  .selectAllCourse .type{position: absolute;display: block;height: 18px; line-height: 18px; width: 44px; text-align: center; left: 40px; top: 46px;font-size: 11px; background: #1890ff; color: #fff;border-radius: 6px 0 0 0;}
  .selectAllCourse .anticon{position: absolute; top: 8px; right: 6px;}
  .choiseSomeBox .ant-pagination{padding-top: 12px; text-align: right;}
  .selectTemp{padding: 6px; border: 1px solid #ddd;height: 580px;overflow-x: hidden;}
  .customTdTitle{display:block;margin-left:65px;height: 42px;overflow: hidden;}
</style>
