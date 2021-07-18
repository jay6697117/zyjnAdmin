<template>
  <div class="indexMain">
    <a-row :gutter="20" style="margin-bottom:20px">
      <a-col class="gutter-row" :push="20" :span="4">
        <a-button type="primary" icon="plus" @click="addRoot" v-if="$power('sys:root:insert')">新建api</a-button>
      </a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col class="gutter-row" :span="24">
        <a-table :columns="columns" :dataSource="rootData" :pagination="pagination" :rowKey="record => record.id" :loading="loading" >
          <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class='custom-filter-dropdown'>
            <a-input
              id="searchInput"
              :placeholder="`查询 ${column.title}`"
              :value="selectedKeys[0]"
              @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="() => handleSearch(selectedKeys, confirm)"
              style="width: 188px; margin-bottom: 8px; display: block;"
            />
            <a-button
              type='primary'
              @click="() => handleSearch(selectedKeys, confirm)"
              icon="search"
              size="small"
              style="width: 90px; margin-right: 8px"
            >查询</a-button>
            <a-button
              @click="() => handleReset(clearFilters)"
              size="small"
              style="width: 90px"
            >重置</a-button>
          </div>
          <a-icon slot="filterIcon" slot-scope="filtered" type='search' :style="{ color: filtered ? '#108ee9' : undefined }" />
          <template slot="customRender" slot-scope="text">
            <span v-if="searchText">
              <template v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))">
                <mark v-if="fragment.toLowerCase() === searchText.toLowerCase()" :key="i" class="highlight">{{fragment}}</mark>
                <template v-else>{{fragment}}</template>
              </template>
            </span>
            <template v-else>{{text}}</template>
          </template>
          <span slot="operation" slot-scope="text">
            <a-button type="dashed" icon="edit" @click="editorThis(text)" v-if="$power('sys:root:update')">编辑</a-button>
            <a-popconfirm title="同时删除下辖渠道?" @confirm="deleteThis(text)" okText="确定" cancelText="取消" v-if="$power('sys:root:delete')">
              <a-button type="danger" icon="delete">删除</a-button>
            </a-popconfirm>
          </span>
          <span slot="is_default" slot-scope="is_default">
            <a-tag v-if="is_default == 0" color="cyan">需要</a-tag>
            <a-tag v-if="is_default == 1">无需</a-tag>
          </span>
        </a-table>
      </a-col>
    </a-row>
    <i-root-edit :title="modalTitle" :flag="visible" @ok="onhandleOk" @cancel="onhandleCancel" :itemdata="itemdata"></i-root-edit>
  </div>
</template>
<script type="text/ecmascript-6">
import iRootEdit from '@/pages/components/sys/iRootEdit.vue'
export default {
  name: 'roots',
  data () {
    return {
      rootData: [],
      keyWords: '',
      loading: false,
      searchText: '',
      searchInput: null,
      columns: [{
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender'
        },
        onFilter: (value, record) => {
          if (record.name.toLowerCase().includes(value.toLowerCase())) {
            this.pagination.total++
            return record
          }
        },
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              document.getElementById('searchInput').focus()
            }, 0)
          }
        },
        width: 220
      }, {
        title: 'url',
        dataIndex: 'url',
        key: 'url',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender'
        },
        onFilter: (value, record) => {
          if (record.url.toLowerCase().includes(value.toLowerCase())) {
            this.pagination.total++
            return record
          }
        },
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              document.getElementById('searchInput').focus()
            })
          }
        }
      }, {
        title: '需要授权',
        dataIndex: 'is_default',
        key: 'is_default',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'is_default'
        },
        onFilter: (value, record) => {
          if (record.is_default.toLowerCase().includes(value.toLowerCase())) {
            this.pagination.total++
            return record
          }
        },
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              document.getElementById('searchInput').focus()
            })
          }
        },
        width: 200
      },
      { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: 240, align: 'center' }],
      visible: false,
      modalTitle: '新建api',
      rootTemp: {
        'id': 0,
        'name': '',
        'url': '',
        'is_default': 0
      },
      itemdata: this.rootTemp,
      pagination: {}
    }
  },
  components: {
    iRootEdit
  },
  methods: {
    searchRoot () {
      this.getApis({
        keyWords: this.keyWords
      })
    },
    addRoot () {
      this.visible = true
      this.modalTitle = '新建api'
      this.itemdata = JSON.parse(JSON.stringify(this.rootTemp))
    },
    editorThis (item) {
      this.visible = true
      this.itemdata = JSON.parse(JSON.stringify(item))
      this.modalTitle = '编辑 <' + this.itemdata.name + '>'
    },
    deleteThis (item) {
      var _self = this
      _self.$api.root.remove({
        id: item.id
      }).then(res => {
        if (!res.code) {
          _self.$message.success('成功删除 <' + item.name + '>', 3)
          _self.getApis()
        }
      })
    },
    onhandleOk () {
      this.visible = false
      this.getApis()
    },
    onhandleCancel () {
      this.visible = false
    },
    handleSearch (selectedKeys, confirm) {
      confirm()
      this.pagination.total = 0
      this.searchText = selectedKeys[0]
    },
    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
    },
    getApis (params = {}) {
      this.loading = true
      this.$api.root.list(params).then(res => {
        this.pagination.total = res.data.length
        this.loading = false
        res.data.map(item => {
          return item
        })
        this.rootData = res.data
      })
    }
  },
  mounted () {
    this.getApis()
  }
}
</script>

<style scoped>
.custom-filter-dropdown {
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
}

.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
