<template>
  <a-form layout="inline" :form="searchForm" @submit="handleSearch" class="filters">
    <a-form-item v-if="filters.coop_user_id !== undefined">
      <a-input placeholder="学员id" v-decorator="['coop_user_id']"/>
    </a-form-item>
    <a-form-item v-if="filters.username !== undefined">
      <a-input placeholder="学员姓名" v-decorator="['username']"/>
    </a-form-item>
    <a-form-item v-if="filters.course_name !== undefined">
      <a-input placeholder="课程名称" v-decorator="['course_name']"/>
    </a-form-item>
    <a-form-item v-if="filters.hash_dept_id !== undefined">
      <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
        style="width: 120px"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
        :treeData="deptList"
        placeholder='选择部门'
        :treeDefaultExpandedKeys = '[0]'
        v-decorator="['hash_dept_id']"
      >
      </a-tree-select>
    </a-form-item>
    <a-form-item v-if="filters.hash_station_id !== undefined">
      <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
        style="width: 120px"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
        :treeData="stationList"
        placeholder='选择岗位'
        :treeDefaultExpandedKeys = '[0]'
        v-decorator="['hash_station_id']"
      >
      </a-tree-select>
    </a-form-item>
    <a-form-item v-if="filters.lessonType !== undefined">
      <a-select style="width: 120px" placeholder="选择类型" v-decorator="['lessonType']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in lessonTypes" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.hash_category_id !== undefined">
      <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
        style="width: 140px"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
        :treeData="categoryTree"
        placeholder='选择分类'
        :treeDefaultExpandedKeys = '[0]'
        v-decorator="['hash_category_id']"
        v-if="categoryTree.length"
      >
      </a-tree-select>
    </a-form-item>
    <!-- <a-form-item v-if="filters.hash_category_id !== undefined && type !== 'question'">
      <a-select style="width: 150px" placeholder="选择分类" v-decorator="['hash_category_id']">
        <a-select-option :value="item.key" v-for="item in categories" :key="item.key">{{item.title}}</a-select-option>
      </a-select>
    </a-form-item> -->
    <a-form-item v-if="filters.cert_type !== undefined">
      <a-select style="width: 130px" placeholder="" v-decorator="['cert_type']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in certificateType" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.date_type !== undefined">
      <a-radio-group v-decorator="['date_type']" @change="searchTab" buttonStyle="solid">
        <a-radio-button value="week">近一周</a-radio-button>
        <a-radio-button value="month">近一月</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item v-if="filters.exam_state !== undefined">
      <a-select style="width: 120px" placeholder="考试状态" v-decorator="['exam_state']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in examStatus" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.examine_states !== undefined">
      <a-select style="width: 140px" placeholder="考试结果" v-decorator="['examine_states']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in examineStates" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.exam_pass_state !== undefined">
      <a-select style="width: 140px" placeholder="考试结果" v-decorator="['exam_pass_state']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in examPassStates" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.course_status !== undefined">
      <a-select style="width: 140px" placeholder="选择课程状态" v-decorator="['course_status']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in courseStatus" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.is_openup !== undefined">
      <a-select style="width: 140px" placeholder="选择报名状态" v-decorator="['is_openup']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in openStatus" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.shelf_state !== undefined">
      <a-select style="width: 120px" placeholder="选择状态" v-decorator="['shelf_state']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in shelfStates" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.user_type !== undefined">
      <a-select style="width: 120px" placeholder="选择类型" v-decorator="['user_type']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in userTypes" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.publish_state !== undefined">
      <a-select style="width: 120px" placeholder="选择状态" v-decorator="['publish_state']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in publishStates" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.signup_state !== undefined">
      <a-select style="width: 120px" placeholder="选择状态" v-decorator="['signup_state']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in signupStates" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.mediaType !== undefined">
      <a-select style="width: 120px" placeholder="选择类型" v-decorator="['mediaType']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in mediaTypes" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.user_status !== undefined">
      <a-select style="width: 120px" placeholder="选择状态" v-decorator="['user_status']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in userStates" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.content_provider_account_status !== undefined">
      <a-select style="width: 120px" placeholder="选择状态" v-decorator="['content_provider_account_status']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in account_status" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.client_type !== undefined">
      <a-select style="width: 120px" placeholder="选择状态" v-decorator="['client_type']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in clientTypes" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.question_type !== undefined">
      <a-select style="width: 120px" placeholder="选择状态" v-decorator="['question_type']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in questionTypes" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.test_type !== undefined">
      <a-select style="width: 120px" placeholder="选择状态" v-decorator="['test_type']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in testTypes" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.learn_state !== undefined">
      <a-select style="width: 120px" placeholder="学习状态" v-decorator="['learn_state']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in learnStates" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.study_state !== undefined">
      <a-select style="width: 120px" placeholder="学习状态" v-decorator="['study_state']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in studyStates" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.course_type !== undefined">
      <a-select style="width: 120px" placeholder="课程类型" v-decorator="['course_type']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in courseType" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.order_status !== undefined">
      <a-select style="width: 120px" placeholder="支付状态" v-decorator="['order_status']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in orderStatus" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.is_finished !== undefined">
      <a-select style="width: 120px" placeholder="支付状态" v-decorator="['is_finished']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in finishes" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.start_time !== undefined">
      <a-date-picker placeholder="开始时间" :disabled-date="disabledStartDate"
            v-decorator="['start_time']"/>
    </a-form-item>
    <a-form-item v-if="filters.end_time !== undefined">
      <a-date-picker placeholder="结束时间" :disabled-date="disabledEndDate"
            v-decorator="['end_time']"/>
    </a-form-item>
    <a-form-item v-if="filters.submit_start_time !== undefined">
      <a-date-picker placeholder="申请开始时间" :disabled-date="disabledSubmitStartDate"
            v-decorator="['submit_start_time']"/>
    </a-form-item>
    <a-form-item v-if="filters.submit_end_time !== undefined">
      <a-date-picker placeholder="申请结束时间" :disabled-date="disabledSubmitEndDate"
            v-decorator="['submit_end_time']"/>
    </a-form-item>
    <a-form-item v-if="filters.finished_start_time !== undefined">
      <a-date-picker placeholder="打款开始时间" :disabled-date="disabledFinishedStartDate"
            v-decorator="['finished_start_time']"/>
    </a-form-item>
    <a-form-item v-if="filters.finished_end_time !== undefined">
      <a-date-picker placeholder="打款结束时间" :disabled-date="disabledFinishedEndDate"
            v-decorator="['finished_end_time']"/>
    </a-form-item>
    <a-form-item v-if="filters.pay_type !== undefined">
      <a-select style="width: 130px" placeholder="支付方式" v-decorator="['pay_type']" :getPopupContainer="triggerNode => triggerNode.parentNode">
        <a-select-option :value="item.value" v-for="item in payTypes" :key="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="filters.search_content !== undefined">
      <a-input :placeholder="'按' + (placeholder || '名称') + '搜索'" v-decorator="['search_content']"/>
    </a-form-item>
    <a-form-item v-if="filters.name !== undefined">
      <a-input placeholder="按姓名搜索" v-decorator="['name']"/>
    </a-form-item>
    <a-form-item v-if="filters.mobile !== undefined">
      <a-input placeholder="按手机号搜索" v-decorator="['mobile']" :maxLength="11"/>
    </a-form-item>
    <a-form-item v-if="filters.company !== undefined">
      <a-input placeholder="按企业名称搜索" v-decorator="['company']"/>
    </a-form-item>
    <a-form-item v-if="filters.org_name !== undefined">
      <a-input placeholder="按组织名称搜索" v-decorator="['org_name']"/>
    </a-form-item>
    <a-form-item v-if="filters.order_no !== undefined">
      <a-input placeholder="按订单号搜索" v-decorator="['order_no']"/>
    </a-form-item>
    <a-form-item v-if="filters.user_id !== undefined">
      <a-input placeholder="学员id" v-decorator="['user_id']"/>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">搜索</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import moment from 'moment'
export default {
  name: 'iFilter',
  data () {
    return {
      examStatus: [ // 上架状态
        {value: '', name: '所有考试'},
        {value: '1', name: '未开始'},
        {value: '2', name: '进行中'},
        {value: '3', name: '已结束'}
      ],
      examineStates: [ // 上架状态
        {value: '', name: '全部状态'},
        {value: '1', name: '待审批'},
        {value: '2', name: '审批通过'}
      ],
      finishes: [ // 上架状态
        {value: '-1', name: '全部状态'},
        {value: '1', name: '已处理'},
        {value: '0', name: '待处理'}
      ],
      courseStatus: [ // 上架状态
        {value: '', name: '所有课程状态'},
        {value: '1', name: '可用'},
        {value: '0', name: '不可用'}
      ],
      examPassStates: [ // 上架状态
        {value: '', name: '所有结果'},
        {value: 'passed', name: '已通过'},
        {value: 'not_pass', name: '未通过'},
        {value: 'not_join', name: '未参加'}
      ],
      openStatus: [ // 上架状态
        {value: '', name: '所有报名状态'},
        {value: '1', name: '开启报名'},
        {value: '0', name: '关闭报名'}
      ],
      shelfStates: [ // 上架状态
        {value: '', name: '所有状态'},
        {value: '1', name: '已上架'},
        {value: '-1', name: '已下架'}
      ],
      publishStates: [ // 发布状态
        {value: '', name: '所有状态'},
        {value: '1', name: '已发布'},
        {value: '-1', name: '未发布'}
      ],
      signupStates: [ // 课程状态
        {value: '', name: '所有状态'},
        {value: '1', name: '未报名'},
        {value: '2', name: '报名中'},
        {value: '3', name: '待上课'},
        {value: '4', name: '上课中'},
        {value: '5', name: '已结束'}
      ],
      userStates: [ // 用户账号状态
        {value: '', name: '所有状态'},
        {value: '1', name: '正常'},
        {value: '3', name: '停用'}
      ],
      account_status: [ // 合作伙伴账号状态
        {value: '', name: '所有状态'},
        {value: '1', name: '正常'},
        {value: '0', name: '停用'}
      ],
      clientTypes: [ // 终端类型
        {value: '', name: '所有终端'},
        {value: '1', name: 'iPhone'},
        {value: '2', name: 'iPad'},
        {value: '3', name: 'Android'},
        {value: '4', name: 'PC'},
        {value: '5', name: '其他'}
      ],
      questionTypes: [ // 题目分类
        {value: '', name: '所有题型'},
        {value: '1', name: '单选题'},
        {value: '2', name: '多选题'},
        {value: '3', name: '判断题'},
        {value: '4', name: '填空题'}
        // {value: '5', name: '问答题'}
      ],
      testTypes: [ // 试卷类型
        {value: '', name: '所有试卷'},
        {value: '1', name: '随机卷'},
        {value: '2', name: '人工卷'}
      ],
      mediaTypes: [ // 资源类型
        {value: '', name: '所有类型'},
        {value: 'video', name: '视频'},
        {value: 'audio', name: '音频'}
      ],
      lessonTypes: [ // 资源类型
        {value: '', name: '全部'},
        {value: 'video', name: '视频'},
        {value: 'audio', name: '音频'}
      ],
      userTypes: [ // 用户身份
        {value: '', name: '所有身份'},
        {value: '2', name: '讲师'},
        {value: '3', name: '管理员'}
      ],
      learnStates: [ // 学习状态
        {value: '', name: '全部'},
        {value: '1', name: '未学'},
        {value: '2', name: '已学'},
        {value: '3', name: '完成'}
      ],
      studyStates: [ // 学习状态
        {value: '', name: '全部'},
        {value: '1', name: '已学习'},
        {value: '2', name: '未学习'}
      ],
      courseType: [ // 课程类型
        {value: '', name: '所有课程'},
        {value: '1', name: '内部课程'},
        {value: '2', name: '采购课程'}
      ],
      orderStatus: [ // 课程类型
        {value: '', name: '全部订单'},
        {value: '0', name: '待支付'},
        {value: '1', name: '支付成功'},
        {value: '2', name: '已取消'},
        {value: '4', name: '支付失败'},
        {value: '5', name: '审批中'}
      ],
      payTypes: [ // 课程类型
        {value: '', name: '全部付款类型'},
        {value: '1', name: '微信支付'},
        // {value: '2', name: '支付宝'},
        {value: '3', name: '线下汇款'}
      ],
      certificateType: [ // 证书类型
        {value: '', name: '所有类型'},
        {value: 'exam', name: '专项考试证书'},
        {value: 'project_plan', name: '培训计划证书'},
        {value: 'course', name: '课程证书'}
      ],
      categoryTree: [], // 分类树
      categories: [], // 分类列表
      deptList: [], // 部门列表
      stationList: [], // 岗位列表
      searchForm: this.$form.createForm(this, { name: 'searchForm' }),
      name: 'iFilter'
    }
  },
  props: ['filters', 'type', 'assign', 'placeholder'],
  mounted () {
    let filters = this.filters
    let requires = []
    let dataListKeys = []
    for (var key in filters) {
      if (filters[key] !== undefined) {
        switch (key) {
          case 'hash_dept_id':
            dataListKeys.push('deptList')
            requires.push(this.$api.dept.tree())
            break
          case 'hash_station_id':
            dataListKeys.push('stationList')
            requires.push(this.$api.category.list({type: 'station'}))
            break
          default:
            break
        }
      }
    }
    if (this.assign) {
      this.clientTypes = this.clientTypes.filter(item => {
        return this.assign.filter(type => type === item.value).length > 0
      })
    }
    if (this.type && this.type !== 'pageManagement' && this.type !== 'paper' && this.type !== 'account' && this.type !== 'certificate' && this.type !== 'courseProduct') {
      dataListKeys.push('categoryTree')
      if (this.type === 'question') {
        requires.push(this.$api.questionCategory.tree())
      } else if (this.type === 'purchase') {
        requires.push(this.$api.mall.list())
      } else if (this.type === 'courseShop') {
        requires.push(this.$api.courseShop.categories())
      } else if (this.type === 'examine') {
        requires.push(this.$api.examineCourse.categories())
      } else {
        requires.push(this.$api.category.list({type: this.type === 'plan' ? 'project_plan' : this.type}))
      }
    }
    Promise.all(requires).then(res => {
      dataListKeys.forEach((key, index) => {
        if (key === 'deptList') {
          this[key] = res[index].data
        } else if (key === 'categories') {
          this[key] = [{
            title: '所有分类',
            key: '0',
            value: '0'
          },
          ...res[index].data]
        } else if (key === 'stationList') {
          this[key] = [{
            title: '所有岗位',
            key: '0',
            value: '0'
          },
          ...res[index].data]
        } else if (key === 'categoryTree' && this.type === 'purchase') {
          let data = res[index].data.categories.map(item => {
            item.key = item.value = item.hash_id
            item.disabled = true
            item.children = item.children.map(it => {
              it.key = it.value = it.hash_id
              return it
            })
            return item
          })
          this.categoryTree = [{
            title: '所有课程分类',
            key: '0',
            value: '0'
          },
          ...data]
        } else if (key === 'categoryTree') {
          this[key] = [{
            title: '所有分类',
            key: '0',
            value: '0'
          },
          ...res[index].data]
        } else {
          this[key] = res[index].data
        }
      })
      this.$nextTick(() => {
        this.searchForm.setFieldsValue(filters)
      })
    })
  },
  methods: {
    moment,
    searchTab (e) {
      this.searchForm.setFieldsValue({
        start_time: null,
        end_time: null,
        date_type: e.target.value
      })
      this.handleSearch()
    },
    disabledStartDate (startValue) {
      const endValue = this.searchForm.getFieldValue('end_time')
      const nowValue = moment(Date.parse(new Date()))
      if (!endValue) {
        return startValue.valueOf() >= nowValue.valueOf()
      }
      return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() >= nowValue.valueOf() || endValue.valueOf() >= nowValue.valueOf()
    },
    disabledEndDate (endValue) {
      const startValue = this.searchForm.getFieldValue('start_time')
      const nowValue = moment(Date.parse(new Date()))
      if (!startValue) {
        return endValue.valueOf() >= nowValue.valueOf()
      }
      return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() >= nowValue.valueOf() || endValue.valueOf() >= nowValue.valueOf()
    },
    disabledSubmitStartDate (startValue) {
      const endValue = this.searchForm.getFieldValue('submit_end_time')
      const nowValue = moment(Date.parse(new Date()))
      if (!endValue) {
        return startValue.valueOf() >= nowValue.valueOf()
      }
      return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() >= nowValue.valueOf() || endValue.valueOf() >= nowValue.valueOf()
    },
    disabledSubmitEndDate (endValue) {
      const startValue = this.searchForm.getFieldValue('submit_start_time')
      const nowValue = moment(Date.parse(new Date()))
      if (!startValue) {
        return endValue.valueOf() >= nowValue.valueOf()
      }
      return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() >= nowValue.valueOf() || endValue.valueOf() >= nowValue.valueOf()
    },
    disabledFinishedStartDate (startValue) {
      const endValue = this.searchForm.getFieldValue('finished_end_time')
      const nowValue = moment(Date.parse(new Date()))
      if (!endValue) {
        return startValue.valueOf() >= nowValue.valueOf()
      }
      return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() >= nowValue.valueOf() || endValue.valueOf() >= nowValue.valueOf()
    },
    disabledFinishedEndDate (endValue) {
      const startValue = this.searchForm.getFieldValue('finished_start_time')
      const nowValue = moment(Date.parse(new Date()))
      if (!startValue) {
        return endValue.valueOf() >= nowValue.valueOf()
      }
      return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() >= nowValue.valueOf() || endValue.valueOf() >= nowValue.valueOf()
    },
    handleSearch (e) {
      e && e.preventDefault()
      this.searchForm.validateFields((err, vals) => {
        if (!err) {
          console.log('search', vals)
          this.$emit('search', vals)
          // 查询
        }
      })
    }
  }
}
</script>
<style>
  .filters .ant-form-item-control{line-height: 30px;}
  .filters.ant-form-inline{font-size: 0;}
  .filters.ant-form-inline .ant-form-item{margin-right: 8px;}
  @media (max-width: 480px) {
    .filters.ant-form-inline .ant-form-item{margin:8px 8px 0px 0;width: 47%;float: left;}
    .filters.ant-form-inline .ant-form-item>*{width: 100%;}
    .filters .ant-select, .filters .ant-cascader-picker, .filters .ant-btn{width: 100%!important;}
  }
</style>
