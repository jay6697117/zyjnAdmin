<template>
  <div class="columnContent">
    <div class="detail-header">
      <div class="detail-left">
        <img class="detail-img" :src="columnData.mediaCoverUrl">
        <div class="detail-info">
          <div>
            <div class="title">{{columnData.title}}</div>
            <div class="desc">{{columnData.describe}}</div>
            <div class="price-wrapper"></div>
            <div>学员人数：{{columnData.subscribeTotal}}</div>
          </div>
          <div class="view-num">
            <div class="click-num">单品点击量：{{columnData.clicks}}</div>
          </div>
        </div>
      </div>
      <div class="detail-right">
        <div class="operation-wrapper">
          <a href="javascript:void(0);" class="operation-item" @click="edit(columnData)">编辑</a>
          <div class="line">|</div>
          <div class="operation-item" v-if="columnData.publishSetting === 1" @click="upItem(columnData, 0)">下架</div>
          <div class="operation-item" v-if="columnData.publishSetting === -2" @click="upItem(columnData, 1)">上架</div>
          <div class="line">|</div>
          <div class="operation-item" @click="del(columnData)">删除</div>
        </div>
        <div class="update">更新至第0期<span>(更新中)</span></div>
      </div>
    </div>
    <a-row>
      <a-col :sm="6" :xs="24">
        <a-button type="primary" icon="plus" @click="addCourse">添加课程</a-button>
      </a-col>
      <a-col :sm="18" :xs="24" align="right">
        <a-form layout="inline">
          <a-form-item>
            <a-select defaultValue="" style="width: 120px" @change="handleChange" :getPopupContainer="triggerNode => triggerNode.parentNode">
              <a-select-option value="">全部状态</a-select-option>
              <a-select-option value="1">已上架</a-select-option>
              <a-select-option value="-1">待上架</a-select-option>
              <a-select-option value="-2">已下架</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select defaultValue="" style="width: 120px" @change="handleChangeOne" :getPopupContainer="triggerNode => triggerNode.parentNode">
              <a-select-option value="">课程类型</a-select-option>
              <a-select-option value="video">视频</a-select-option>
              <a-select-option value="audio">音频</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input placeholder="输入课程名称" v-model="keyword" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="getContent(1)">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="courseData" :loading="loading" rowKey="id" :pagination="pagination">
      <span slot="customTitle">{{name}}</span>
      <div class="customTd" slot="pic" slot-scope="text">
        <img :src="text.url"/>
        <div class="description">
          <p>{{text.caption}}</p>
        </div>
      </div>
      <span slot="typeTitle">{{type}}</span>
      <div slot="mediaType" slot-scope="text">
        <p>{{text.type}}</p>
      </div>
      <span slot="publishSetting" slot-scope="publishSetting">
        <a-tag v-if="publishSetting == '1'" color="blue">已上架</a-tag>
        <a-tag v-if="publishSetting == '-1'" color="blue">待上架</a-tag>
        <a-tag v-if="publishSetting == '-2'" color="green">已下架</a-tag>
      </span>
      <span slot="action" slot-scope="action">
        <a href="javascript:;" @click="edit(action)">编辑</a>
        <!-- <a-divider type="vertical" />
        <div class="move_up" v-show="(index!==0)" @click="move_up(index)"><a-icon type="up-circle"/>上移</div>
        <a-divider type="vertical" />
        <div class="move_down" @click="move_down(index)"><a-icon type="down-circle"/>下移</div> -->
      </span>
    </a-table>
    <e-course :flag="showRelatedCourse" @ok="onhandleOk" @cancel="onhandleCancel" @funcZero="getRelatedCourse" :fromType="fromType" :deleteId="deleteId" :resourcesId="resource_ids"></e-course>
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
  </div>
</template>
<script>
import eCourse from '@/pages/components/exam/eCourse.vue'
const columns = [
  {dataIndex: 'name', key: 'name', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'pic' }, align: 'left'},
  {dataIndex: 'type', key: 'type', slots: { title: 'typeTitle' }, scopedSlots: { customRender: 'mediaType' }, align: 'left', width: 100},
  {title: '点击量', dataIndex: 'clicks', key: 'clicks', align: 'center', width: 100},
  {title: '状态', dataIndex: 'publishSetting', key: 'publishSetting', scopedSlots: { customRender: 'publishSetting' }, align: 'center', width: 100},
  {title: '上架时间', key: 'publishTime', dataIndex: 'publishTime', align: 'center', width: 150},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 200}
]
export default {
  name: 'columnContent',
  data () {
    return {
      deleteId: '',
      ModalTitle: '删除专栏',
      visible: false,
      ModalText: '删除后用户将无法使用，且不可恢复，确认删除吗？',
      confirmLoading: false,
      fromType: 'column',
      type: '类型',
      name: '单品名称',
      keyword: '',
      columns,
      loading: false,
      columnData: '',
      courseData: [],
      column_id: this.$route.query.id,
      pagination: {
        pageNo: 1,
        pageSize: 15, // 默认每页显示数量
        total: 0 // 总条数
      },
      showRelatedCourse: false,
      coursepublishSetting: '',
      coursemediaType: '',
      resource_ids: []
    }
  },
  components: {
    eCourse
  },
  mounted () {
    localStorage.removeItem('txt')
    localStorage.removeItem('audio')
    localStorage.removeItem('video')
    localStorage.removeItem('column')
    this.getContent(1)
  },
  methods: {
    getContent (page, pageSize) {
      this.loading = true
      let _self = this
      _self.$api.column.courses({// 编辑时请求远端数据
        column_id: _self.column_id,
        keyword: this.keyword,
        current_page: page,
        per_page: this.pagination.pageSize,
        publishSetting: this.coursepublishSetting,
        mediaType: this.coursemediaType
      }).then(res => {
        if (res.data.list) {
          this.resource_ids = []
          this.courseData = res.data.list.map((item) => {
            item.name = {
              url: item.mediaCoverUrl,
              caption: item.title
            }
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
          this.tableInfo = res.data.info
          for (let i = 0; i < res.data.list.length; i++) {
            this.resource_ids.push(res.data.list[i].id)
          }
        } else {
          this.courseData = []
          this.pagination.total = 0
        }
        this.$store.commit('setRelatedId', this.resource_ids)
        this.loading = false
        this.columnData = res.data.column_info
      })
    },
    edit (item) { // 点击编辑
      this.$router.push({
        path: '/content/' + item.mediaType + 'Edit',
        query: {
          resourceId: item.id
        }
      })
    },
    del (item) { // 点击刪除
      this.visible = true
    },
    upItem (item, offline) { // 发布、停止
      this.loading = true
      var parmas = {}
      if (offline === 0) {
        parmas = {
          url: '/column/publish',
          id: item.id,
          publishSetting: -2
        }
        this.columnData.publishSetting = -2
      } else {
        parmas = {
          url: '/column/publish',
          id: item.id,
          publishSetting: 1
        }
        this.columnData.publishSetting = 1
      }
      this.$api.content.list(parmas).then(res => {
        this.getList()
      })
    },
    handleChange (val) {
      this.coursepublishSetting = val
    },
    handleChangeOne (val) {
      this.coursemediaType = val
    },
    addCourse () { // 点击新建
      this.$store.commit('setFromType', 'column')
      this.showRelatedCourse = true
    },
    onhandleOk (data) {
      this.showRelatedCourse = data
    },
    onhandleCancel (data) {
      this.showRelatedCourse = data
    },
    getRelatedCourse (data) {
      this.resource_ids = []
      this.loading = true
      let flag = false
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (i >= data.length - 1) {
            flag = true
          }
          this.resource_ids.push(data[i])
          if (flag) {
            this.$api.column.addCourses({
              courseIds: this.resource_ids,
              id: this.column_id
            }).then(res => {
              if (res.code === 0) {
                this.getContent(1)
              }
            })
          }
        }
      } else {
        this.$api.column.addCourses({
          courseIds: this.resource_ids,
          id: this.column_id
        }).then(res => {
          if (res.code === 0) {
            this.getContent(1)
          }
        })
      }
    },
    handleOk (e) {
      this.$api.column.clear({
        id: this.column_id
      }).then(res => {
        this.$router.push({
          path: '/content/specialColumn'
        })
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
    move_up (index) {
      this.courseData[index] = this.courseData.splice(index - 1, 1, this.courseData[index])[0]
    },
    move_down (index) {
      this.courseData[index] = this.courseData.splice(index + 1, 1, this.courseData[index])[0]
    }
  }
}
</script>
<style scope>
  .columnContent .detail-header{width: 100%;height: 160px;padding: 20px;background-color: #f5f7fa;display: -webkit-flex;display: flex;box-sizing: border-box;-webkit-justify-content: space-between;justify-content: space-between;position: relative;margin-bottom:20px;}
  .columnContent .detail-header .detail-left{display: -webkit-flex;display: flex;}
  .columnContent .detail-header .detail-left .detail-img{width: 160px;height: 120px;margin-right: 20px;}
  .columnContent .detail-header .detail-left .detail-info{display: -webkit-flex;display: flex;-webkit-flex-direction: column;flex-direction: column;-webkit-justify-content: space-between;justify-content: space-between;}
  .columnContent .detail-header .detail-left .detail-info .title{font-size: 16px;font-weight: 600;color: #353535;white-space: pre-wrap;max-width: 550px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
  .columnContent .detail-header .detail-left .detail-info .desc{margin-top: 6px;}
  .columnContent .detail-header .detail-left .detail-info .price-wrapper{margin-top: 10px;display: -webkit-flex;display: flex;}
  .columnContent .detail-header .detail-left .detail-info .view-num{display: -webkit-flex;display: flex;}
  .columnContent .detail-header .detail-right{display: -webkit-flex;display: flex;-webkit-flex-direction: column;flex-direction: column;-webkit-justify-content: space-between;justify-content: space-between;-webkit-align-items: flex-end;align-items: flex-end;position: absolute;right: 20px;top: 20px;bottom: 0}
  .columnContent .operation-wrapper {width: 100%;display: -webkit-flex;display: flex;-webkit-justify-content: flex-end;justify-content: flex-end;-webkit-align-items: center;align-items: center;position: relative;}
  .columnContent .operation-wrapper .operation-item {color: #2a75ed;cursor: pointer;}
  .columnContent .detail-header .detail-right .update{padding-bottom: 20px;}
  .columnContent .operation-wrapper .line {margin: 0 3px;color: #2a75ed;}
  .columnContent .customTd{display:flex;}
  .columnContent .customTd img{width:90px;height:90px;margin-right:10px;vertical-align:top;cursor: pointer;}
  .columnContent .description{flex:1;}
  .columnContent .description p{line-height:25px; height: 50px; margin:0;padding:0;cursor: pointer;overflow: hidden;}
  .columnContent .ant-modal-content{height: 100%;display: flex;flex-direction: column;}
  .columnContent .ant-modal-content .ant-modal-header{flex:0 0 55px}
  .columnContent .ant-modal-content .ant-modal-body{flex:1;overflow-x: hidden;}
  .columnContent .move_up, .move_down{color:#1890ff;display:inline-block;}
</style>
