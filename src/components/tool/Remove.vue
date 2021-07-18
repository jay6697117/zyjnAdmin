<template>
  <div class="removeBox">
    <span @click="del">
      <slot name="operation"></slot>
    </span>
    <i-del-list ref="delList" @remove="remove" />
  </div>
</template>
<script>
export default {
  name: 'iRemove',
  data () {
    return {}
  },
  props: ['id', 'parmas', 'action', 'disabled'],
  methods: {
    del () {
      if (this.disabled) return
      if (!this.parmas.searchBind) {
        this.confirm()
      } else {
        this.$emit('loading', true)
        var parmas = {}
        if (this.parmas.path === 'question') {
          parmas.hash_ids = [this.id]
        } else if (this.parmas.parentId) {
          parmas.hash_id = this.parmas.parentId
        } else {
          parmas.hash_id = this.id
        }
        if (parmas.hash_id || parmas.hash_ids) {
          this.$api[this.parmas.path].getBindList(parmas).then(res => {
            this.$emit('loading', false)
            if (!res.code) {
              if (res.data && res.data.length) {
                this.$refs.delList.onShowHandler({
                  title: this.parmas.title,
                  tips: this.parmas.tips,
                  canRemove: this.parmas.canRemove,
                  data: res.data
                })
              } else {
                this.confirm()
              }
            }
          })
        }
      }
    },
    confirm () {
      this.$confirm({
        title: this.parmas.title,
        content: this.parmas.content,
        okText: '确认',
        cancelText: '取消',
        onOk: this.remove
      })
    },
    remove () {
      var parmas = {}
      if (this.action === 'edit') {
        this.$emit('reset')
      } else {
        if (this.parmas.path === 'question') {
          parmas.hash_ids = [this.id]
        } else if (this.action === 'unbind') {
          parmas.hash_task_id = this.id
        } else {
          parmas.hash_id = this.id
        }
        if (this.id) {
          this.$api[this.parmas.path][this.action](parmas).then(res => {
            if (!res.code) {
              this.$message.success(this.parmas.title + '成功')
              this.$emit('reset')
            }
          })
        }
      }
    }
  }
}
</script>

<style>
  .removeBox{display: inline-block;}
</style>
