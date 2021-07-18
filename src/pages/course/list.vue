<template>
  <div class="mallResult">
    <div class="mallFilter">
      <a-row>
        <a-col :span="1"><div class="label"> 分类: </div></a-col>
        <a-col :span="23" class="category">
          <span :class="filters.firstLevel ? '' : 'on'" @click="checkParent">全部</span>
          <span v-for="item in category" :key="item.hash_id" @click="checkParent(item)" :class="filters.firstLevel === item.hash_id ? 'on' : ''">{{item.title}}</span>
        </a-col>
      </a-row>
      <a-row v-if="itemChild && itemChild.length">
        <a-col :span="1"><div class="label"> 分类: </div></a-col>
        <a-col :span="23" class="category">
          <span :class="filters.secondLevel ? '' : 'on'" @click="checkChild">全部</span>
          <span v-for="item in itemChild" :key="item.hash_id" @click="checkChild(item)" :class="filters.secondLevel === item.hash_id ? 'on' : ''">{{item.title}}</span>
        </a-col>
      </a-row>
    </div>
    <div class="mallList" v-if="courseList && courseList.length">
      <a-spin tip="Loading..." :spinning="Loading">
        <a-row :gutter="24">
          <a-col :span="6" v-for="item in courseList" :key="item.hash_id" class="commodity">
            <a-card hoverable style="width: 100%;position:relative" @click="getDetail(item)">
              <img :src="item.cover_url" slot="cover"/>
              <a-card-meta>
                <template slot="title">
                  <a-tooltip :title="item.title">
                    {{item.title}}
                  </a-tooltip>
                </template>
                <template slot="description">
                  <span class="lessonNo">共 {{item.lesson_num}} 讲</span>
                  <a-row>
                    <a-col :span="6"> 共{{item.lesson_num}}讲 </a-col>
                    <a-col :span="18" align="right" class="learnedTotal">
                      <a-icon type="user" /> {{item.learned_total}} 人学过
                    </a-col>
                  </a-row>
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
      <i-pagination :pagination="pagination" @change="getList" />
    </div>
    <a-empty v-else />
  </div>
</template>
<script>
import global from '@/utils/global'
export default {
  name: 'mallResult',
  data () {
    return {
      global,
      Loading: true,
      courseList: [],
      category: [],
      itemChild: [],
      filters: this.$store.state.mallFilter,
      pagination: {
        type: '课程',
        total: 0, // 总条数
        current_page: 1,
        per_page: 12,
        hideSize: true // 弹窗内列表传次参数，其他不传
      }
    }
  },
  watch: {
    '$store.state.mallFilter' (newVal) {
      newVal.is_free = !!newVal.is_free
      this.filters = newVal
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList (current_page = this.pagination.current_page) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.Loading = true
      let filters = JSON.parse(JSON.stringify(this.filters))
      this.$store.commit('setMallFilter', filters)
      filters.hash_category_id = filters.secondLevel ? filters.secondLevel : filters.firstLevel
      this.$api.courseShop.courseList({
        is_official: 1,
        current_page,
        per_page: this.pagination.per_page,
        hash_category_id: filters.secondLevel ? filters.secondLevel : filters.firstLevel,
        search_content: filters.search_content
      }).then(res => {
        this.Loading = false
        if (res.data.list) {
          this.courseList = res.data.list
          this.pagination.total = res.data.info.total
        } else {
          this.pagination.total = 0
          this.courseList = []
        }
        this.category = res.data.categories.map(item => {
          if (item.hash_id === filters.firstLevel) {
            this.itemChild = item.children
          }
          return item
        })
      })
    },
    onSearch () {
      this.getList(1)
    },
    checkParent (item) {
      if (this.filters.firstLevel === item.hash_id) return
      if (item) {
        this.itemChild = item.children
        this.filters.firstLevel = item.hash_id
      } else {
        this.itemChild = []
        this.filters.firstLevel = ''
      }
      this.filters.secondLevel = ''
      this.filters.search_content = ''
      this.getList()
    },
    checkChild (item) {
      if (this.filters.secondLevel === item.hash_id) return
      this.filters.secondLevel = item.hash_id
      this.filters.search_content = ''
      this.getList()
    },
    checkIsFree () {
      this.getList()
    },
    sort () {
      this.getList()
    },
    radioButton (type) {
      if (type === this.filters.order_by_column) {
        this.filters.order_by_direction = this.filters.order_by_direction === 'asc' ? 'desc' : 'asc'
        this.getList()
      }
    },
    getDetail (item) {
      this.$router.push({
        path: '/course/detail',
        query: {
          hash_id: item.hash_id
        }
      })
    }
  }
}
</script>

<style lang="less">
  .mallResult{
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 24px;
    .ant-pagination{text-align: center;}
  }
  .mallHeader {
    margin-bottom: 20px;
    img{height: 40px;}
  }
  .mallFilter {
    .ant-row{margin-bottom: 12px;}
    .label {height: 32px;line-height: 32px;}
    .category{
      line-height: 0;
      padding: 4px 0;
      span {
        display: inline-block;margin: 0 2px 6px 0;cursor: pointer;padding: 0 5px;height: 24px;line-height: 24px;
        &.on{background: #1890ff; color: #fff;}
      }
    }
    .freeCheck{margin-left: 20px;}
  }
  .mallList {
    margin-bottom: 20px;
    .indexTitle{margin-bottom: 12px;font-size: 18px;font-weight: 700;}
    .commodity{
      margin-bottom: 24px;
      img {width: 280px;height: 210px;}
      .lessonNo{position:absolute;top:189px;right:0;z-index: 100;background: rgb(120, 200, 250);;color: #fff;height: 21px;line-height: 21px;width: 54px; text-align: center;border-radius: 5px 0 0 0;}
      .ant-card-body{padding: 16px 8px 8px 8px;}
      .price{
        font-size: 20px;color: #f40;height: 30px;line-height: 30px;
        span{font-size: 16px;}
        strong{font-size: 16px;display: block;font-weight: 500;}
      }
      .ant-card-meta-title{font-weight: 500;}
      .learnedTotal{height: 30px;line-height: 30px;font-weight: 500;}
    }
  }
</style>
