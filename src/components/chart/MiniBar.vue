<template>
  <div class="mini-chart">
    <div class="chart-content" :style="{height: 46}">
      <v-chart :force-fit="true" :height="height" :data="data" :padding="[36, 5, 18, 5]">
        <!-- <v-tooltip :showTitle="false"/> -->
        <v-tooltip :showTitle="false" :htmlContent="htmlContent"/>
        <v-bar position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y + 1
  })
]
export default {
  name: 'MiniBar',
  data () {
    return {
      data: [],
      tooltip,
      htmlContent: function (title, items) {
        return `<div class="g2-tooltip" style="position: absolute; visibility: hidden; z-index: 8; transition: visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s; background-color: rgba(255, 255, 255, 0.9); box-shadow: rgb(174, 174, 174) 0px 0px 10px; border-radius: 3px; color: rgb(87, 87, 87); font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif; line-height: 20px; padding: 10px 10px 6px; left: 42px; top: 36px; display: none;">
                <div class="g2-tooltip-title" style="margin-bottom: 4px;"></div>
                <ul class="g2-tooltip-list" style="margin: 0px; list-style-type: none; padding:2px 12px;">
                  <li data-index="0" style="margin-bottom: 4px;">
                    <span style="background-color: rgb(24, 144, 255); width: 5px; height: 5px; border-radius: 50%; display: inline-block; margin-right: 8px;" class="g2-tooltip-marker"></span>
                    ${title}
                    <span class="g2-tooltip-value" style="display: inline-block; float: right; margin-left: 30px;">${items[0].value}</span>
                  </li>
                </ul>
              </div>`
      },
      height: 100
    }
  },
  mounted () {
    this.getDataOverView()
  },
  methods: {
    getDataOverView () {
      this.$api.home.overView().then(res => {
        if (res && !res.code && res.data) {
          let studyTimes = res.data.studyTimes.studyTimes
          for (let i = 0; i < studyTimes.length; i += 1) {
            this.data.push({
              x: studyTimes[i].day,
              y: studyTimes[i].num
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "index.less";
</style>
