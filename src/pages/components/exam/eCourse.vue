<template>
  <div>
    <a-modal class="courseModal" :visible="visible" title="基本信息" @ok="handleOk" @cancel="handleCancel" okText="确定" cancelText=" " width="80%" height="90%">
      <a-form layout="inline" :form="searchForm" @submit="handleSearch" v-show="false">
        <a-form-item>
          <a-input placeholder="输入课程名称" v-model="keyword" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">搜索</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="addNewCourse">新增课程</a-button>
        </a-form-item>
        <a-select defaultValue="新增课程" style="width: 120px" @change="handleChangeBtn" v-if="fromType === 'column'" :getPopupContainer="triggerNode => triggerNode.parentNode">
          <a-select-option value="video">视频</a-select-option>
          <a-select-option value="audio">音频</a-select-option>
        </a-select>
      </a-form>
      <a-tabs :defaultActiveKey="defaultKey" @change="callback" v-if="fromType === 'column'">
        <a-tab-pane v-for="(item,i) in tabSourcesColumn" :key="i" :tab="item.title">
          <r-course :type="item.type" :name="item.title" :keyword="keyword" :btnFlag="visible" :searchFlag='searchFlag' :vals="vals"></r-course>
        </a-tab-pane>
      </a-tabs>
      <a-tabs :defaultActiveKey="defaultKey" @change="callback" v-if="fromType === 'plan'">
        <a-tab-pane v-for="(item,i) in tabSourcesPlan" :key="i" :tab="item.title">
          <r-course :type="item.type" :name="item.title" :keyword="keyword" :btnFlag="visible" :searchFlag='searchFlag' :vals="vals"></r-course>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>
<script>
import rCourse from '@/pages/components/exam/rCourse.vue'
const substr = []
export default {
  name: 'eCourse',
  components: {
    rCourse
  },
  data () {
    return {
      searchFlag: false,
      fromType: this.$store.state.fromType,
      deleteCourseId: this.$store.state.deleteId,
      visible: false,
      substr,
      resourceIds: this.$store.state.resourceIds,
      tabSourcesColumn: [
        {
          title: '音频',
          type: 'audio'
        },
        {
          title: '视频',
          type: 'video'
        }
      ],
      tabSourcesPlan: [
        {
          title: '课程',
          type: 'column'
        }
      ],
      defaultKey: 0,
      vals: {},
      keyword: '',
      searchForm: this.$form.createForm(this, { name: 'searchForm' })
    }
  },
  watch: {
    flag: function () {
      this.visible = this.flag
    },
    resourcesId: function () {
      this.resourceIds = this.resourcesId
    },
    '$store.state.fromtype': function (val) {
      this.fromType = val
    },
    '$store.state.resourceIds': function (val) {
      this.resourceIds = val
    },
    '$store.state.deleteId': function (val) {
      this.deleteCourseId = val
    }
  },
  props: ['flag', 'planId'],
  mounted () {
    this.fromType = this.$store.state.fromType
    this.getCrows()
  },
  methods: {
    callback (key) {
      this.keyword = ''
    },
    handleCancel (e) {
      this.$emit('cancel', false)
    },
    handleOk () {
      this.substr = []
      if (this.fromType === 'plan') {
        if (localStorage.getItem('column') !== null) {
          this.substr = this.substr.concat(JSON.parse(localStorage.getItem('column')))
        }
      } else {
        if (localStorage.getItem('txt') !== null) {
          this.substr = this.substr.concat(JSON.parse(localStorage.getItem('txt')))
        }
        if (localStorage.getItem('audio') !== null) {
          this.substr = this.substr.concat(JSON.parse(localStorage.getItem('audio')))
        }
        if (localStorage.getItem('video') !== null) {
          this.substr = this.substr.concat(JSON.parse(localStorage.getItem('video')))
        }
      }
      this.substr = this.unique(this.substr)
      this.$store.commit('setRelatedCourse', {relatedCourseData: this.substr, resourceIds: this.resourceIds, deleteCourseId: this.deleteId})
      this.$emit('cancel', false)
      this.$emit('funcZero', this.substr)
      // this.btnFlag = false
    },
    handleSearch (e) {
      this.searchFlag = true
      e.preventDefault()
      this.searchForm.validateFieldsAndScroll((err, vals) => {
        if (!err) {
          this.vals = vals
        }
      })
    },
    handleChangeBtn (val) {
      this.$router.push({
        path: '/content/' + val + 'List'
      })
    },
    addNewCourse () {
      this.$router.push({
        path: '/content/columnDetail',
        query: {
          plan_id: this.planId
        }
      })
    },
    unique (arr) { // 数组去重
      return arr.filter(function (item, index, arr) {
        return arr.indexOf(item, 0) === index
      })
    }
  }
}
</script>
<style scope>
  .courseModal .ant-modal-footer .ant-btn{display:none;}
  .courseModal .ant-modal-footer .ant-btn-primary{display:block;margin:0 auto;}
</style>
