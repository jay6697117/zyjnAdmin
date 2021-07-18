<template>
<div>
  <a-modal :title='`选择${params.name}`' :visible="params.show" okText="确认选择" cancelText="取消" :width="960"
    @ok="handleOk" @cancel="handleCancel" >
    <a-row>
      <a-col :span="18">
        <i-filter :filters="params.filters" :type="params.type" @search="onSearch" :placeholder="`${params.name}名称`"></i-filter>
      </a-col>
      <a-col :span="6"  align="right" v-if="params.haveCreateButton">
        <router-link :to="`/content/${params.type}/edit`"><a-button type="primary">{{`新建${params.name}`}}</a-button></router-link>
      </a-col>
      <a-col :span="6"  align="right" v-if="params.questionCreateButton">
        <a-dropdown :getPopupContainer="triggerNode => triggerNode.parentNode">
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="1">单选题</a-menu-item>
            <a-menu-item key="2">多选题</a-menu-item>
            <a-menu-item key="3">判断题</a-menu-item>
            <a-menu-item key="4">填空题</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 新建试题 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </a-col>
    </a-row>
    <a-table :columns="params.columns" :dataSource="listData" :loading="loading" :rowKey="params.tableKey" :pagination="false"  :rowSelection="{type: params.selectionType, selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps: getCheckboxProps,onSelect: onSelect}">
      <span slot="nickname" slot-scope="td, tr">
        <a href="javascript:;"><img :src="tr.user.avatar" class="userhead">{{td}}</a>
      </span>
      <span slot="previewUrl" slot-scope="td, tr">
        <a href="javascript:;"><img :src="tr.cover" class="product">{{tr.title}}</a>
      </span>
      <span slot="dept_list" slot-scope="dept_list">
        <span v-for="(item, index) in dept_list" :key="index">{{item.name}}</span>
      </span>
      <span slot="station_list" slot-scope="station_list">
        <span v-for="(item, index) in station_list" :key="index">{{item.name}}</span>
      </span>
      <span slot="question_type" slot-scope="type">
        {{questionTypes[type]}}
      </span>
      <div slot="user" slot-scope="user">
        {{user.username}}
      </div>
      <div slot="userStatus" slot-scope="userStatus">
        <span v-if="userStatus === 1">正常</span>
        <span v-if="userStatus === 3">锁定</span>
        <span v-if="userStatus === 4">停用</span>
      </div>
      <template slot="content" slot-scope="content">
        <div v-html="content"></div>
      </template>
      <span slot="updated_at" slot-scope="updated_at">{{updated_at | timeFormat('yyyy-MM-dd')}}</span>
      <span slot="created_at" slot-scope="created_at">{{created_at | timeFormat('yyyy-MM-dd')}}</span>
      <span slot="publishTime" slot-scope="publishTime">{{publishTime | timeFormat('yyyy-MM-dd')}}</span>
    </a-table>
    <i-pagination v-if="type === 'certificate'" :pagination="pagination" @change="getCertificateSourceList"/>
    <i-pagination v-else :pagination="pagination" @change="getList"/>
    <div class="changeTips" v-if="params.examEdit">更换试卷将清空已产生的考试数据，学员需重新考试，是否确定更换？</div>
  </a-modal>
</div>
</template>
<script>
export default {
  name: 'iChoose',
  data () {
    return {
      listData: [],
      loading: false,
      pagination: {
        type: this.params.name,
        total: 0, // 总条数
        current_page: 1,
        hideSize: true // 弹窗内列表传次参数，其他不传
      },
      selectedRowKeys: [],
      questionTypes: this.$store.state.questionTypes,
      initRowKeys: [],
      selectedNames: []
    }
  },
  watch: {
    'params.show': function () {
      if (this.params.show) {
        if (this.type === 'certificate') {
          this.getSelectedResource()
        } else if (this.type === 'student') {
          this.getSelectedUser()
        } else if (this.type === 'plan') {
          this.getSelectedPlanItems()
        } else if (this.type === 'courseProduct') {
          this.getJoinedCourseIds()
        } else {
          this.getList()
        }
      }
    },
    'params.selectedRowKeys': function (keys) {
      if (this.params.name !== '审批员') {
        this.selectedRowKeys = keys
      }
      this.initRowKeys = keys
    },
    'params.selectedNames': function (names) {
      this.selectedNames = names
    }
  },
  props: ['params', 'type', 'objectId', 'menuType', 'plan_id'],
  methods: {
    getCheckboxProps (record) {
      if (this.params.type === 'account' && this.type !== 'teacher') { // 课程学员管理，新建课程选择老师
        return ({
          props: {
            disabled: this.initRowKeys.some(item => item === record.hash_user_id)
          }
        })
      } else if (this.params.type === 'course' || this.type === 'certificate' || this.type === 'plan' || this.type === 'bindProduct') { // 培训计划选择课程、试卷、证书管理
        return ({
          props: {
            disabled: this.initRowKeys.some(item => item === record.hash_id)
          }
        })
      } else if (this.type === 'courseProduct') { // 培训计划选择课程、试卷、证书管理
        return ({
          props: {
            disabled: this.initRowKeys.some(item => item === record.hash_id)
          }
        })
      } else {
        return ({
          props: {
            disabled: false
          }
        })
      }
    },
    handleMenuClick (e) {
      this.$router.push({
        path: '/content/question/edit?type=4',
        query: {
          type: e.key
        }
      })
    },
    onSearch (filters) {
      this.params.filters = filters
      if (this.type === 'certificate') {
        this.getCertificateSourceList(1)
      } else {
        this.getList(1)
      }
    },
    getJoinedCourseIds () {
      this.$api[this.type].getCourseIds({
        hash_id: this.objectId
      }).then(res => {
        this.selectedRowKeys = res.data
        this.initRowKeys = res.data
        this.getList()
      })
    },
    getSelectedUser () {
      this.$api[this.menuType].getSelectedUser({
        hash_id: this.objectId
      }).then(res => {
        this.selectedRowKeys = res.data
        this.initRowKeys = res.data
        this.getList()
      })
    },
    getSelectedResource () {
      this.$api.certificate.selectedResource({
        cert_type: this.params.type === 'plan' ? 'project_plan' : this.params.type
      }).then(res => {
        this.selectedRowKeys = res.data
        this.initRowKeys = res.data
        this.getCertificateSourceList()
      })
    },
    getSelectedPlanItems () {
      var typechange = this.params.type === 'paper' ? 'exam' : this.params.type
      typechange = typechange === 'plan' ? 'project_plan' : typechange
      this.$api.plan.getItems({
        hash_id: this.plan_id,
        item_type: typechange
      }).then(res => {
        this.selectedRowKeys = res.data
        this.initRowKeys = res.data
        this.getList()
      })
    },
    getCertificateSourceList (current_page = this.pagination.current_page, per_page = 10) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.certificate.resourceList({
        current_page,
        per_page,
        cert_type: this.params.type === 'plan' ? 'project_plan' : this.params.type,
        ...this.params.otherFilters,
        ...this.params.filters
      }).then(res => {
        if (res.code === 0) {
          if (res.data.list) {
            this.listData = res.data.list.map((item) => {
              item.name = {
                url: item.mediaCoverUrl
              }
              return item
            })
            this.pagination.total = res.data.info.total
          } else {
            this.listData = []
            this.pagination.total = 0
          }
          this.search = false
        }
        this.loading = false
      })
    },
    getList (current_page = this.pagination.current_page, per_page = 10) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      if (this.type === 'courseProduct') {
        this.$api.courseShop.courseList({
          current_page,
          per_page,
          is_official: 1,
          ...this.params.filters
        }).then(res => {
          if (res.code === 0) {
            if (res.data.list) {
              this.listData = res.data.list.map((item) => {
                item.name = {
                  url: item.cover
                }
                return item
              })
              this.pagination.total = res.data.info.total
            } else {
              this.listData = []
              this.pagination.total = 0
            }
            this.search = false
          }
          this.loading = false
        })
      } else {
        this.$api[this.params.type].list({
          current_page,
          per_page,
          shelf_state: '1',
          publish_state: '1',
          ...this.params.otherFilters,
          ...this.params.filters
        }).then(res => {
          if (res.code === 0) {
            if (res.data.list) {
              this.listData = res.data.list.map((item) => {
                item.name = {
                  url: item.mediaCoverUrl
                }
                return item
              })
              this.pagination.total = res.data.info.total
            } else {
              this.listData = []
              this.pagination.total = 0
            }
            this.search = false
          }
          this.loading = false
        })
      }
    },
    handleCancel (e) {
      this.$emit('cancel', false)
    },
    onSelectChange (selectedRowKeys, items) {
      if (this.type !== 'certificate') {
        this.selectedRowKeys = selectedRowKeys
        if (this.params.name === '审批员') {
          this.selectedNames = items.map(item => item.nickname)
        }
      }
    },
    onSelect (record, selected, selectedRows, nativeEvent) {
      if (this.type === 'certificate' || (this.type === 'plan' && this.params.type === 'paper')) {
        this.selectedRowKeys = this.initRowKeys.concat(record.hash_id)
      }
    },
    handleOk () { // 点击选择
      let selectedRowKeys = this.selectedRowKeys.filter(item => this.initRowKeys.indexOf(item) < 0)
      if (selectedRowKeys.length) {
        if (this.params.name === '审批员') {
          this.$emit('ok', {
            keys: selectedRowKeys,
            names: this.selectedNames
          })
        } else {
          this.$emit('ok', selectedRowKeys)
        }
      } else {
        this.$emit('cancel', false)
      }
    }
  }
}
</script>
<style>
  .changeTips{position: absolute;bottom: 10px;left: 24px;height: 32px; line-height: 32px; color: #f00;}
  .userhead{width: 20px;height: 20px;vertical-align: middle;border-radius: 50%; margin-right: 5px;}
  .product{width: 100px;height: 75px;vertical-align: middle;margin-right: 5px;}
</style>
