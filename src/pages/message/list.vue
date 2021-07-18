<template>
  <div>
    <a-row>
      <a-col :span="12">消息通知只保留三个月</a-col>
      <a-col :span="12" align="right"><a-button @click="all">全部标记为已读</a-button></a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="messageData" :loading="loading" rowKey="hash_id" :pagination="false">
      <div slot="customTd" slot-scope="customTd, customTr" @click="review(customTr)" class="messageList">
        <span :style="customTr.read_or_not ? '' : 'font-weight: 700'">课程《{{customTd.title}}》已提交审批, 请及时查看</span>
        <div>{{customTr.created_at | timeFormat('yyyy-MM-dd hh:mm')}}</div>
      </div>
      <template slot="action" slot-scope="item">
        <a href="javascript:;" @click="remove(item)"><a-icon type="delete" /></a>
      </template>
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <a-drawer title="审批历史" placement="right" :closable="false" :visible="visible" @close="onClose" width="300" :bodyStyle="{padding: '24px 18px'}" wrapClassName="historyDrawer">
      <a-empty :description="false" v-if="!history.length" />
      <a-collapse :default-active-key="active" :bordered="false" v-else>
        <a-collapse-panel :key="index"  v-for="(item, index) in history">
          <p slot="header">
            第{{item.index}}次审批结果
            <span v-if="item.result === 0">（审批中）</span>
            <span style="color:red" v-if="item.result === 2">（审批不通过）</span>
            <span style="color:green" v-if="item.result === 1">（审批通过）</span>
          </p>
          <a-timeline>
            <a-timeline-item v-for="(it, i) in item.history" :key="i">
              <a-icon slot="dot" type="info-circle" style="font-size: 14px;color: #999" v-if="it.type === 1" />
              <a-icon slot="dot" type="info-circle" style="font-size: 14px;color: #999" v-else-if="it.audit_status === 0" />
              <a-icon slot="dot" type="check-circle" style="font-size: 14px;color: #108ee9" v-else-if="it.audit_status === 1" />
              <a-icon slot="dot" type="close-circle" style="font-size: 14px;color: #f50" v-else-if="it.audit_status === 2" />
              <span style="float:right;">{{it.time | timeFormat('yyyy-MM-dd')}}</span>
              <span style="color: #2db7f5" v-if="it.type === 1">发起审批</span>
              <span style="color: #999" v-else-if="it.audit_status === 0">待审批</span>
              <strong style="color: #87d068" v-else-if="it.audit_status === 1">审批通过</strong>
              <strong style="color: #f50" v-else-if="it.audit_status === 2">审批不通过</strong>
              <div style="font-size: 12px;"><img :src="it.avatar" alt="">{{it.name}}</div>
            </a-timeline-item>
          </a-timeline>
        </a-collapse-panel>
      </a-collapse>
    </a-drawer>
  </div>
</template>
<script>
const columns = [
  {title: '消息列表', dataIndex: 'course', key: 'course', scopedSlots: { customRender: 'customTd' }, align: 'left'},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 80}
]
export default {
  name: 'home',
  data () {
    return {
      messageData: [],
      active: [],
      pagination: {
        type: 'message',
        total: 0, // 总条数
        current_page: 1
      },
      loading: false,
      columns,
      history: [],
      visible: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    all () {
      this.$api.message.all().then(() => {
        this.getList()
        this.$api.message.todo().then(res => {
          this.$store.commit('setTodos', res.data.unreadTotal)
        })
      })
    },
    review (item) {
      this.visible = true
      this.$api.examineCourse.history({hash_course_id: item.course.hash_id}).then(res => {
        if (!res.code) {
          let history = res.data.history
          if (history.length) {
            this.history = history.map(item => {
              item.history.reverse()
              return item
            }).reverse()
            this.active = [0]
          }
          this.$api.message.read({ hash_id: item.hash_id }).then(() => {
            this.getList()
            this.$api.message.todo().then(res => {
              this.$store.commit('setTodos', res.data.unreadTotal)
            })
          })
        }
      })
    },
    remove (item) {
      this.$api.message.remove({ hash_id: item.hash_id }).then(res => {
        this.$message.success('消息删除成功')
        this.getList()
      })
    },
    onClose () {
      this.visible = false
    },
    getList (current_page = this.pagination.current_page, pageSize = this.$store.state.pageSize, colum, direction) {
    // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.message.list({
        current_page: current_page,
        per_page: pageSize
      }).then(res => {
        if (res.data.list) {
          this.messageData = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.messageData = []
          this.pagination.total = 0
        }
        this.loading = false
      })
    }
  }
}
</script>

<style>
.historyDrawer .ant-drawer-body span{font-size: 14px;}
.historyDrawer .ant-drawer-body img{width:20px;height:20px;border-radius:50%;float:left;margin-right: 6px;}
.messageList{cursor: pointer;}
</style>
