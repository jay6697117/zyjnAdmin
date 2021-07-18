<template>
  <div>
    <a-tabs :defaultActiveKey="defaultKey" @change="callback">
      <a-tab-pane v-for="(item,i) in tabSourcesColumn" :key="i" :tab="item.title" :class="'type' + item.banner_type">
        <a-row>
          <a-col :sm="6" :xs="24">
            <a-button type="primary" @click="add(item)">新建{{item.typeName}}</a-button>
          </a-col>
          <a-col :sm="18" :xs="24" align="right">
            <i-filter :filters="filters" type="resource" :assign="item.assign" @search="onSearch" placeholder="名称"></i-filter>
          </a-col>
        </a-row>
        <a-table :columns="columns" :dataSource="tableData" rowKey="hash_id" :pagination="false" @change="handleTableChange" :loading="loading">
          <template slot="customTitle">{{item.typeName}}名称</template>
          <span class="customTd" slot="customTd" slot-scope="customTd, customTr">
            <img :src="customTr.coverUrl"/>
            <div class="description">
              <p>{{customTr.name}}</p>
            </div>
          </span>
          <template slot="jump_to" slot-scope="jump_to">{{jump_to === 'none' ? '无跳转' : (jump_to === 'url' ? '跳转外部链接' : '跳转到内容')}}</template>
          <template slot="terminal_types" slot-scope="terminal_types">
            <a-tag v-for="item in terminal_types" :key="item">{{item}}</a-tag>
          </template>
          <template slot="publishSetting" slot-scope="publishSetting">
            <a-badge status="success" text="已上架" v-if="publishSetting == '1'"/>
            <a-badge status="error" text="已下架" v-if="publishSetting == '-1'"/>
          </template>
          <template slot="updated_at" slot-scope="updated_at">{{updated_at | timeFormat('yyyy-MM-dd')}}</template>
          <template slot="length"  slot-scope="length">{{parseInt(Number(length) / 60)+'分'+parseInt(Number(length) % 60)+'秒'}}</template>
          <template slot="action" slot-scope="item">
            <i-operation :item="item" type="banner" :operation="operation" :pagination="pagination" :filters="filters" @reset="getList" @sort="sort" @edit="edit" @loading="setLoading"></i-operation>
          </template>
        </a-table>
        <i-pagination :pagination="pagination" @change="getList"/>
      </a-tab-pane>
    </a-tabs>
    <a-modal :visible="visible" :header="null" :footer="null" @cancel="btnCancel">
      <a-form :form="sortFrom" @submit="handleSubmit">
        <a-form-item label="移动至" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
          第
          <a-input type="number" placeholder="请输入大于0的整数" style="width: 120px"
            v-decorator="[
              'order_num',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入移动的位置'
                  },
                  {
                    pattern: /^([1-9][0-9]*)+$/,
                    message: '排序必须为大于0的整数'
                  }
                ]
              }
            ]"
          />
          位
        </a-form-item>
        <a-form-item align="center">
          <a-button type="primary" html-type="submit">确定</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {dataIndex: 'name', key: 'name', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'customTd' }},
  {title: '终端', dataIndex: 'terminal_types', key: 'terminal_types', scopedSlots: { customRender: 'terminal_types' }, align: 'center', width: 150},
  {title: '内容跳转', dataIndex: 'jump_to', key: 'jump_to', scopedSlots: { customRender: 'jump_to' }, align: 'center', width: 150},
  {title: '上架状态', dataIndex: 'publishSetting', key: 'publishSetting', scopedSlots: { customRender: 'publishSetting' }, align: 'center', width: 120, sorter: true},
  {title: '排序', dataIndex: 'order_num', key: 'order_num', align: 'center', width: 100, sorter: true},
  {title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', scopedSlots: { customRender: 'updated_at' }, align: 'center', width: 110, sorter: true},
  {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 120}
]
export default {
  data () {
    return {
      defaultKey: this.$route.query.banner_type ? (parseInt(this.$route.query.banner_type) - 1) : 0,
      mediaType: 'video',
      title: 'banner图',
      tabSourcesColumn: [
        {
          title: 'banner图',
          banner_type: '1',
          typeName: 'banner',
          assign: ['', '1', '2', '5'],
          tips: 'banner图指在PC和移动端轮播图位置展示的图片，请上传比例为5:2的图片，JPG/PNG格式，图片小于5M'
        },
        {
          title: '定制区',
          banner_type: '2',
          typeName: '定制区',
          assign: ['', '1', '2'],
          tips: '定制去图片指的是显示在移动端定制区的背景图片，请上传比例为2:1的图片，JPG/PNG格式，图片小于5M'
        },
        {
          title: '金刚区',
          banner_type: '3',
          typeName: '金刚区',
          assign: ['', '1', '2'],
          tips: '金刚取LOGO将直接显示在APP或者小程序首页，请上传比例为1:1的图片，JPG/PNG格式，图片小于5M'
        },
        {
          title: '首屏广告',
          banner_type: '4',
          typeName: '广告区',
          assign: ['', '1', '2'],
          tips: '首屏广告显示在开屏图之后，首页面之前，请上传比例为9:16的图片，JPG/PNG格式，图片小于5M'
        },
        {
          title: '启动图',
          banner_type: '5',
          typeName: '启动图',
          assign: ['', '1', '2'],
          tips: '启动图指在首屏广告之前，请上传比例为9:16的图片，JPG/PNG格式，图片小于5M'
        }
      ],
      filters: {
        search_content: '',
        client_type: ''
      },
      pagination: {
        type: 'banner',
        total: 0, // 总条数
        current_page: 1
      },
      tableData: [],
      columns,
      banner_type: this.$route.query.banner_type ? this.$route.query.banner_type : '1',
      loading: false,
      sortFrom: this.$form.createForm(this, { name: 'sortFrom' }),
      visible: false,
      hash_id: '',
      sortTotal: 0,
      operation: [
        {type: 'sort', name: '排序'},
        {
          type: 'shelf',
          name: '上架/下架',
          path: 'banner',
          canRemove: false,
          searchBind: false,
          title: '广告下架',
          content: '下架后将无法显示在客户端，是否下架？'
        },
        {type: 'edit', name: '编辑', url: '/operation/banner/edit'},
        {
          type: 'remove',
          name: '删除',
          path: 'banner',
          canRemove: false,
          searchBind: false,
          title: '广告删除',
          content: '广告删除后将无法恢复，是否删除？'
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      let listParmas = this.$store.state.listParmas
      if (listParmas.pagination.type === this.pagination.type) {
        this.onSearch(listParmas.filters, listParmas.pagination.current_page)
        this.$store.commit('initListParmas')
      } else {
        this.onSearch()
      }
    })
  },
  methods: {
    setLoading (loading) {
      this.loading = loading
    },
    onSearch (filters = this.filters, currentPage = 1) {
      this.filters = filters
      this.getList(currentPage)
    },
    getList (current_page = this.pagination.current_page, per_page = this.$store.state.pageSize, sortField, sortOrder) {
      // eslint-disable-next-line camelcase
      this.pagination.current_page = current_page
      this.loading = true
      this.$api.banner.list({
        current_page,
        per_page,
        ...this.filters,
        banner_type: this.banner_type,
        display_terminal_type_id: this.filters.client_type,
        order_by_column: sortField ? sortField.toString() : 'updated_at',
        order_by_direction: sortOrder ? (sortOrder === 'descend') ? sortOrder.toString().substring(0, 4) : sortOrder.toString().substring(0, 3) : 'desc'
      }).then(res => {
        if (res.data.list) {
          this.tableData = res.data.list.map((item) => {
            if (item.terminal_type === 'mobile') {
              item.terminal_types = item.display_terminal.map(item => item.terminal_name)
            } else {
              item.terminal_types = ['PC']
            }
            return item
          })
          this.pagination.total = res.data.info.total
        } else {
          this.tableData = []
          this.pagination.total = res.data.info.total
        }
        this.loading = false
      })
    },
    handleTableChange (pagination, filters, sorter) {
      this.getList(this.pagination.current_page, this.$store.state.pageSize, sorter.field, sorter.order)
    },
    callback (key) {
      this.banner_type = (key + 1).toString()
      this.filters.client_type = ''
      this.getList()
    },
    edit (item) {
      item.tips = this.tabSourcesColumn[item.banner_type - 1].tips
      item.typeName = this.tabSourcesColumn[item.banner_type - 1].typeName
      this.$store.commit('setBannerItem', item)
      this.$router.push({
        path: '/operation/banner/edit'
      })
    },
    sort (item) {
      this.sortTotal = item.total
      this.hash_id = item.hash_id
      this.visible = true
      this.$nextTick(() => {
        this.sortFrom.setFieldsValue({order_num: item.order_num})
      })
    },
    handleSubmit (e) { // 确定排序
      e.preventDefault()
      var _self = this
      _self.visible = false
      _self.sortFrom.validateFieldsAndScroll((err, values) => {
        if (!err) {
          _self.$api.banner.sort({
            hash_id: _self.hash_id,
            order_num: values.order_num
          }).then(res => {
            if (res.code === 0) {
              _self.visible = false
              _self.getList()
            }
          })
        }
      })
    },
    add (item) {
      item.hash_id = ''
      this.$store.commit('setBannerItem', item)
      this.$router.push({
        path: '/operation/banner/edit'
      })
    },
    btnCancel () {
      this.visible = false
    }
  }
}
</script>

<style scope>
  #app .type1 .customTd img {width:150px;height:60px;}
  #app .type2 .customTd img {width:150px;height:75px;}
  #app .type3 .customTd img {width:50px;height:50px;overflow: hidden;border-radius: 50%;}
  #app .type4 .customTd img {width:72px;height:128px;}
  #app .type5 .customTd img {width:72px;height:128px;}
</style>
