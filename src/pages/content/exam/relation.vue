<template>
  <i-relation :id="id" type="exam"></i-relation>
</template>
<script>
import iRelation from '@/pages/components/content/iRelation.vue'
export default {
  name: 'examRelation',
  components: {
    iRelation
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  }
}
</script>
