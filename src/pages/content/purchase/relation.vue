<template>
  <i-relation :id="id" type="purchase"></i-relation>
</template>
<script>
import iRelation from '@/pages/components/content/iRelation.vue'
export default {
  name: 'purchaseRelation',
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
