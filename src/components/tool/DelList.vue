<template>
  <a-modal :title="delData.title" :visible="visible" @cancel="cancelDel" @ok="remove" :class="delData.canRemove ? '' : 'noFoot'">
    <p>{{delData.tips}}</p>
    <div v-for="group in delData.data" :key="group.type" class="delList">
      <a-list class="del-other-list" itemLayout="horizontal" :dataSource="group.children">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <a slot="title">{{item.title}}<div class="delMarker">{{group.name}}</div></a>
            <img class="delCover" slot="avatar" :src="item.coverUrl" v-if="item.coverUrl">
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
  </a-modal>
</template>
<script>

export default {
  name: 'iDelList',
  data () {
    return {
      visible: false,
      delData: {
        title: '',
        tips: '',
        canRemove: false,
        data: []
      }
    }
  },
  methods: {
    onShowHandler (data) {
      this.visible = true
      this.delData = data
    },
    cancelDel (e) {
      this.visible = false
    },
    remove () {
      this.visible = false
      this.$emit('remove')
    }
  }
}
</script>
<style>
  .noFoot .ant-modal-footer{display: none;}
  .delList {padding-top: 12px;}
  .delList .ant-list-item{position: relative;background: rgb(240, 240, 240);padding: 5px; margin: 5px 0;}
  .delList .del-other-list .ant-list-item-meta-title{padding-right: 60px;}
  .delList .delMarker{position: absolute;top: 0;right: 0;z-index: 1; background: salmon;color: #fff;padding: 4px 8px;border-radius: 0 0 0 8px;font-size: 12px;}
  .delList .ant-list-item-meta-avatar{margin-right: 8px;}
  .delList .delCover{width: 120px;}
</style>
