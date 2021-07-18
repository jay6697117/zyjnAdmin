<template>
  <div>
    <a-tabs :defaultActiveKey="0" >
      <a-tab-pane tab="视频资源" :key="0" v-if="$power(['videoList'])">
        <i-resource type="video" name="视频"></i-resource>
      </a-tab-pane>
      <a-tab-pane tab="音频资源" :key="1" v-if="$power(['audioList'])">
        <i-resource type="audio" name="音频"></i-resource>
      </a-tab-pane>
      <a-tab-pane tab="资源分类" :key="2" v-if="$power(['categoryList'])">
        <i-category type="resource" state="3" name="资源"></i-category>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import iResource from './resource.vue'
export default {
  name: 'resource',
  components: {
    iResource
  }
}
</script>
