<template>
  <a-dropdown>
    <a class="ant-dropdown-link"> 管理 <a-icon type="down" /> </a>
    <a-menu slot="overlay" @click="handleMenuClick">
      <template v-for="operate in operation">
        <a-menu-item :key="operate.type" v-if="$power([operate.type])" @click="handleMenu(operate)">
          <span v-if="operate.type === 'shelf' && item.publishSetting == -1">上架</span>
          <template v-else-if="operate.type === 'shelf' && item.publishSetting == 1">
            <i-remove :id="item.hash_id" :disabled="!!item.isFinish || item.use_total > 0" :parmas="operate" action="publish" @reset="reset" @loading="setLoading">
              <template slot="operation">下架</template>
            </i-remove>
          </template>
          <span v-else-if="operate.type === 'publish' && item.publishSetting == -1">发布</span>
          <template v-else-if="operate.type === 'publish' && item.publishSetting == 1">
            <i-remove :id="item.hash_id" :disabled="!!item.isFinish || item.use_total > 0" :parmas="operate" action="publish" @reset="reset" @loading="setLoading">
              <template slot="operation">取消发布</template>
            </i-remove>
          </template>
          <template v-else-if="operate.type === 'remove'">
            <i-remove :id="item.hash_id" :disabled="!!item.isFinish || item.use_total > 0" :parmas="operate" action="remove" @reset="reset" @loading="setLoading">
              <template slot="operation">{{operate.name}}</template>
            </i-remove>
          </template>
          <template v-else-if="operate.type === 'stop'">
            <span v-if="item.status">停用</span>
            <span v-else>启用</span>
          </template>
          <span v-else>{{operate.name}}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </a-dropdown>
</template>
<script>
export default {
  name: 'iOperation',
  data () {
    return {
      titles: {
        exam: '专项考试',
        plan: '培训计划',
        certificate: '证书',
        course: '课程',
        paper: '试卷',
        banner: 'banner',
        pageManagement: '自定义页面'
      },
      tips: {
        remove: '无法删除',
        publish: '无法下架',
        shelf: '无法取消发布',
        edit: '无法修改',
        question: '无法修改'
      }
    }
  },
  props: ['item', 'type', 'operation', 'pagination', 'filters'],
  methods: {
    reset () {
      this.$emit('reset')
    },
    setLoading (loading) {
      this.$emit('loading', loading)
    },
    handleMenu (menu) {
      if (menu.url) {
        this.$router.push({
          path: menu.url,
          query: {
            id: this.item.hash_id
          }
        })
      }
    },
    handleMenuClick (menu) {
      if (this.item.use_total > 0 && menu.key !== 'copy') {
        this.$message.error('本试卷已有学员作答，' + this.tips[menu.key])
        return
      }
      if (this.item.isFinish === 1 && (menu.key === 'remove' || menu.key === 'publish' || menu.key === 'shelf' || menu.key === 'edit')) {
        this.$message.error(this.titles[this.type] + '已结束，' + this.tips[menu.key])
      } else if (menu.key === 'remove') {
      } else if (menu.key === 'publish' || menu.key === 'shelf') {
        if (this.item.publishSetting + '' === '-1') {
          this.$api[this.type].publish({
            hash_id: this.item.hash_id
          }).then(res => {
            if (res.code === 0) {
              if (res.data.publish === true) {
                this.$emit('reset')
                this.$message.success(this.titles[this.type] + '上架成功')
              }
              if (this.type === 'pageManagement') {
                this.$emit('reset')
                this.$message.success(this.titles[this.type] + '发布成功')
              }
            }
          })
        }
      } else if (menu.key === 'sort') {
        this.$emit('sort', this.item)
      } else if (menu.key === 'stop') {
        this.$emit('stop', this.item)
      } else if (menu.key === 'copy') {
        let _self = this
        let modalItem = ''
        for (let i in _self.operation) {
          if (_self.operation[i].type === 'copy') {
            modalItem = _self.operation[i]
          }
        }
        const modal = _self.$confirm({
          title: modalItem.name,
          content: modalItem.name + '《' + _self.item.title + '》' + '?',
          onOk () {
            _self.$api[_self.type].copy({
              hash_id: _self.item.hash_id
            }).then(res => {
              modal.destroy()
              if (res.code === 0) {
                _self.$router.push({
                  path: '/content/' + _self.type + '/edit',
                  query: {
                    id: res.data.hash_id
                  }
                })
              }
            })
          },
          cancelText: '取消',
          onCancel () {}
        })
      } else if (menu.key === 'edit' || menu.key === 'question') {
        this.$store.commit('setListPamars', {
          pagination: this.pagination,
          filters: this.filters
        })
      } else if (this.type === 'banner' || this.type === 'pageManagement') {
        this.$emit('edit', this.item)
      } else if (menu.key === 'reset') {
        this.$emit('changePass', this.item)
      } else {
        console.log(menu.key, this.type, this.item)
      }
    }
  }
}
</script>
