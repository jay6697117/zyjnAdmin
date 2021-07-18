<template>
  <div class="process">
    <a-card title="开始" size="small" :hoverable="true" style="width: 180px">
      <a-input v-model="title" placeholder="请输入流程名称" />
      <div class="bottomArrow"><a-icon type="down" /></div>
    </a-card>
    <a-card title="提交审批" size="small" :hoverable="true" style="width: 180px">
      非官方合作伙伴
      <div class="bottomArrow"><a-icon type="down" /></div>
      <div class="leftArrow"><a-icon type="left" /></div>
    </a-card>
    <a-list :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-card title="审批" size="small" :hoverable="true" style="width: 180px">
          <a slot="extra" @click="remove(index)" v-if="data.length > 1"><a-icon type="close" /></a>
          <div @click="select(index)" v-if="!item.hash_id"><a-icon type="right" style="float:right" />选择审批人</div>
          <p v-else @click="select(index)">{{item.name}}</p>
          <div class="bottomArrow"><a-icon type="down" /></div>
          <div class="rightArrow"><span></span></div>
          <i-choose :params="params" @ok="choise" @cancel="onhandleCancel" type="account" :key="index"/>
        </a-card>
      </a-list-item>
    </a-list>
    <div class="processFoot">
      <div class="addButton" @click="add" v-if="data.length < 3"><a-icon type="plus" /></div>
      <a-button class="processEnd" size="large">结束</a-button>
    </div>
    <a-row :gutter="[12, 8]">
      <a-col :sm="12" :xs="24">
        <a-button type="primary" block @click="save">保存</a-button>
      </a-col>
      <a-col :sm="12" :xs="24">
        <a-button block @click="cacel">取消</a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  name: 'processEdit',
  data () {
    return {
      title: '',
      data: [
        { hash_id: '', name: '' },
        { hash_id: '', name: '' }
      ],
      checkIndex: 0,
      params: {
        type: 'account', // 请求方法的路径
        name: '审批员', // 名称
        show: false, // 展示
        tableKey: 'hash_user_id',
        selectionType: 'radio', // 多选 'checkbox' 'radio'
        haveCreateButton: false, // 新建按钮
        filters: {
          search_content: ''
        }, // 筛选条件 无=={}
        otherFilters: {}, // 其他固定筛选条件 例如： 讲师 无=={}
        selectedRowKeys: [], // 列表中的已选项 无==[]
        selectedNames: [],
        columns: [ // 表格列
          {title: '姓名', dataIndex: 'nickname', key: 'nickname', scopedSlots: { customRender: 'nickname' }},
          // {title: '用户名', dataIndex: 'user', key: 'user', scopedSlots: { customRender: 'user' }, align: 'center', width: 150},
          {title: '手机号', dataIndex: 'user.mobile', key: 'user.mobile', align: 'center', width: 200}
        ]
      }
    }
  },
  computed: {
    processId () {
      return this.$route.query.id
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      this.$api.audit.info({ hash_id: this.processId }).then(res => {
        if (!res.code) {
          this.title = res.data.title
          this.data = res.data.setting.map(item => {
            return {
              hash_id: item.hash_user_id,
              name: item.username
            }
          })
        }
      })
    },
    select (index) {
      this.checkIndex = index
      let items = this.data.filter((item, i) => i !== index && item.hash_id)
      this.params.selectedRowKeys = items.map(item => item.hash_id)
      this.params.selectedNames = items.map(item => item.name)
      this.params.show = true
    },
    choise (selected) {
      this.params.show = false
      this.data[this.checkIndex].hash_id = selected.keys[0]
      this.data[this.checkIndex].name = selected.names[0]
    },
    onhandleCancel (e) {
      this.params.show = false
    },
    add () {
      this.data.push({ hash_id: '', name: '' })
    },
    remove (index) {
      this.data.splice(index, 1)
    },
    cacel () {
      this.$router.push({
        path: '/sys/process/list'
      })
    },
    save () {
      if (this.data.filter(item => !item.hash_id).length) {
        this.$message.error('请选择审批人')
        return
      }
      if (!this.title) {
        this.$message.error('请输入流程名称')
        return
      }
      if (this.processId) {
        this.$api.audit.edit({
          hash_id: this.processId,
          title: this.title,
          setting: this.data.map(item => item.hash_id)
        }).then(res => {
          if (!res.code) {
            this.$router.push({
              path: '/sys/process/list',
              query: {
                unTips: true
              }
            })
          }
        })
      } else {
        this.$api.audit.add({
          title: this.title,
          setting: this.data.map(item => item.hash_id)
        }).then(res => {
          if (!res.code) {
            this.$router.push({
              path: '/sys/process/list',
              query: {
                unTips: true
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style>
.process{width:180px;margin:0 auto;}
.process .processStart, .process .processEnd{width: 180px;}
.process .ant-list-item{padding: 0;border-bottom: none;}
.process .ant-card{position: relative;margin-bottom: 70px;}
.process .ant-card .bottomArrow{position: absolute;bottom: -65px;left: 0px;}
.process .bottomArrow{height: 40px; width:2px;background: #aaa;margin: 10px 0 10px 90px;position: relative;}
.process .bottomArrow i.anticon-down{position: absolute;left: -6px;bottom: -5px;}
.process .leftArrow{height: 2px; width:40px;background: #aaa;position: absolute;right:-50px;top:40px;}
.process .leftArrow i.anticon-left{position: absolute;left: -5px;top: -6px;}
.process .rightArrow{height: 2px; width:40px;background: #aaa;position: absolute;right:-50px;top:40px;}
/* .process .rightArrow i.anticon-right{position: absolute;right: -5px;top: -6px;} */
.process .rightArrow span{height: 155px;width: 2px;background: #aaa;position: absolute;right:0;bottom:0;}
.processFoot{position: relative;margin-bottom: 24px;}
.process .addButton{position: absolute;top: -60px;left:100px;color: #fff; background: #1890ff;border-radius: 50%;display: inline-block;width: 28px;height: 28px;line-height: 28px;text-align: center;font-size: 20px;cursor: pointer;}
</style>
