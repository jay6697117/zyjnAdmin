<template>
  <vue-html5-editor :height="500" :auto-height="false" :show-module-name="false" :content="content" @change="updateData"></vue-html5-editor>
</template>
<script>

export default {
  name: 'edit',
  props: ['connotation', 'errShow'],
  data () {
    return {
      id: '',
      content: ''
    }
  },
  methods: {
    updateData (e) {
      this.content = e
    }
  }
}
</script>
