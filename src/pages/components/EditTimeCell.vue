<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <!-- <a-input style="width:200px;margin-right:12px" :value="value"  @change="handleChange" /> -->
      <a-date-picker style="width:120px;margin-right:12px" size="small" :default-value="moment(new Date(value * 1000), 'YYYY/MM/DD')" format="YYYY/MM/DD"  @change="handleChange"/>
      <a-button size="small" @click="check"> 保存 </a-button>
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value | timeFormat('yyyy-MM-dd') }}
      <a-icon type="edit" class="editable-cell-icon" style="color: #1890ff" @click="edit"/>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'EditableCell',
  props: {
    text: Number
  },
  data () {
    return {
      value: this.text,
      editable: false
    }
  },
  methods: {
    moment,
    handleChange (e) {
      this.value = new Date(e._d).getTime() / 1000
    },
    check () {
      this.editable = false
      this.$emit('change', this.value)
    },
    edit () {
      this.editable = true
    }
  }
}
</script>
