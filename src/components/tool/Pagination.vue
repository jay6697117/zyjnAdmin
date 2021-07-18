<template>
  <a-row style="margin-top:20px" v-if="pagination.total">
    <a-col align="right">
      <a-pagination
      :current="pagination.current_page"
      :total="pagination.total"
      :showSizeChanger="!pagination.hideSize"
      :pageSize="pagination.per_page ? pagination.per_page : (pagination.hideSize ? 10 : pageSize)"
      :showTotal="total => `共 ${total} 条`"
      :pageSizeOptions="['10', '20', '30', '40', '50']"
      :showQuickJumper="quick"
      @showSizeChange="onShowSizeChange"
      @change="onChange"
      />
    </a-col>
  </a-row>
</template>
<script>
export default {
  name: 'iPagination',
  data () {
    return {}
  },
  props: ['pagination'],
  computed: {
    quick () {
      return this.pagination.total / (this.pagination.hideSize ? 10 : this.$store.state.pageSize) > 5
    },
    pageSize () {
      return this.$store.state.pageSize
    }
  },
  methods: {
    onShowSizeChange (page, size) {
      this.$store.commit('setPageSize', size)
      this.$emit('change', page, size)
    },
    onChange (page, size) {
      this.$emit('change', page, size)
    }
  }
}
</script>
