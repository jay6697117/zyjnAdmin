<template>
  <a-drawer :title="title" placement="right" :closable="false"  @close="handleCancel" :visible="visible" width="300" >
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="global.formItemLayout" label="上级菜单">
        <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
          style="width: 100%"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="standardTree"
          placeholder='请选择上级菜单'
          :treeDefaultExpandedKeys = '[0]'
          v-decorator="['parent_id']"
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="菜单类型" v-show="title == '新建同级菜单' || title == '新建子菜单'">
        <a-radio-group name="radioGroup" v-decorator="['type', {rules: [{ required: true }]}]">
          <a-radio :value="0">目录</a-radio>
          <a-radio :value="1">菜单</a-radio>
          <a-radio :value="3">功能</a-radio>
          <a-radio :value="2">操作</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="菜单名称">
        <a-input placeholder="请输入菜单名称或操作名称"
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入菜单名称或操作名称!', whitespace: true }]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="url" v-show="urlShow">
        <a-input placeholder="请输入页面展示地址" v-decorator="['url']" />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="api" v-show="apiShow">
        <a-select mode="multiple" style="width: 100%" optionLabelProp="label" placeholder="请选择api" v-decorator="['routes']"
         @change="handleAPIChange" :filterOption="filterOption"
        :getPopupContainer="triggerNode => triggerNode.parentNode">
          <a-select-option v-for="item in apis" :key="item.url" :value="item.id" :label="item.name">{{item.name}}--{{item.url}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="授权标识">
        <a-input placeholder="多个用逗号分割" v-decorator="['authorization_sign', {rules: [{ required: true, whitespace: true }]}]" />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="链接目标">
        <a-select style='width: 100%' v-decorator="['target', {rules: [{ required: true }]}]" :getPopupContainer="triggerNode => triggerNode.parentNode">
          <a-select-option :value="0">当前窗口</a-select-option>
          <a-select-option :value="1">新开窗口</a-select-option>
          <a-select-option :value="2">弹出窗口</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="显示顺序" v-show="indexShow">
        <a-input-number :min="0" :max="100" v-decorator="['order']" />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="层级" v-show="false">
        <a-input-number :min="0" :max="10" v-decorator="['level']" />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="id" v-show="false">
        <a-input-number :min="0" v-decorator="['id']" />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="父级名称" v-show="false">
        <a-input v-decorator="['parent_name']" />
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="图标" v-show="iconShow">
        <a-select style="width: 100%" placeholder="请选择图标" v-decorator="['icon']" :getPopupContainer="triggerNode => triggerNode.parentNode">
          <a-select-option v-for="item in icons" :key="item"><a-icon :type="item" /> {{item}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="状态" v-show="invisibleShow">
        <a-radio-group name="radioGroup" v-decorator="['is_hide']">
          <a-radio :value="0">可见</a-radio>
          <a-radio :value="1">隐藏</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-bind="global.formItemLayout" label="备注">
        <a-textarea placeholder="请输入备注" :rows="4" v-decorator="['remark']"/>
      </a-form-item>
      <a-form-item :wrapper-col="global.formItemLayout.buttonCol">
        <a-button type="primary" html-type="submit" :loading="loading" block>保存</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
var icons = [
  'step-backward', 'step-forward', 'fast-backward', 'fast-forward', 'shrink', 'arrows-alt', 'down', 'up', 'left', 'right', 'caret-up', 'caret-down', 'caret-left', 'caret-right', 'up-circle', 'down-circle', 'left-circle', 'right-circle', 'double-right', 'double-left', 'vertical-left', 'vertical-right', 'forward', 'backward', 'rollback', 'enter', 'retweet', 'swap', 'swap-left', 'swap-right', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'play-circle', 'up-square', 'down-square', 'left-square', 'right-square', 'login', 'logout', 'menu-fold', 'menu-unfold', 'border-bottom', 'border-horizontal', 'border-inner', 'border-left', 'border-right', 'border-top', 'border-verticle', 'pic-center', 'pic-left', 'pic-right', 'radius-bottomleft', 'radius-bottomright', 'radius-upleft', 'fullscreen', 'fullscreen-exit', 'question', 'question-circle', 'plus', 'plus-circle', 'pause', 'pause-circle', 'minus', 'minus-circle', 'plus-square', 'minus-square', 'info', 'info-circle', 'exclamation', 'exclamation-circle', 'close', 'close-circle', 'close-square', 'check', 'check-circle', 'check-square', 'clock-circle', 'warning', 'issues-close', 'stop', 'edit', 'form', 'copy', 'scissor', 'delete', 'snippets', 'diff', 'highlight', 'align-center', 'align-left', 'align-right', 'bg-colors', 'bold', 'italic', 'underline', 'strikethrough', 'redo', 'undo', 'zoom-in', 'zoom-out', 'font-colors', 'font-size', 'line-height', 'colum-height', 'dash', 'small-dash', 'sort-ascending', 'sort-descending', 'drag', 'ordered-list', 'radius-setting', 'lock', 'unlock', 'bars', 'book', 'calendar', 'cloud', 'cloud-download', 'code', 'credit-card', 'desktop', 'download', 'ellipsis', 'file', 'file-text', 'file-unknown', 'file-pdf', 'file-word', 'file-excel', 'file-jpg', 'file-ppt', 'file-markdown', 'file-add', 'folder', 'folder-open', 'folder-add', 'hdd', 'frown', 'meh', 'smile', 'inbox', 'laptop', 'appstore', 'link', 'mail', 'mobile', 'notification', 'paper-clip', 'picture', 'poweroff', 'reload', 'search', 'setting', 'share-alt', 'shopping-cart', 'tablet', 'tag', 'tags', 'to-top', 'upload', 'user', 'video-camera', 'home', 'loading', 'loading-3-quarters', 'cloud-upload', 'star', 'heart', 'environment', 'eye', 'eye-invisible', 'camera', 'save', 'team', 'solution', 'phone', 'filter', 'exception', 'export', 'customer-service', 'qrcode', 'scan', 'like', 'dislike', 'message', 'pay-circle', 'calculator', 'pushpin', 'bulb', 'select', 'switcher', 'rocket', 'bell', 'disconnect', 'database', 'compass', 'barcode', 'hourglass', 'key', 'flag', 'layout', 'printer', 'sound', 'usb', 'skin', 'tool', 'sync', 'wifi', 'car', 'schedule', 'user-add', 'user-delete', 'usergroup-add', 'usergroup-delete', 'man', 'woman', 'shop', 'gift', 'idcard', 'medicine-box', 'red-envelope', 'coffee', 'copyright', 'trademark', 'safety', 'wallet', 'bank', 'trophy', 'contacts', 'global', 'shake', 'api', 'fork', 'dashboard', 'table', 'profile', 'alert', 'audit', 'branches', 'build', 'border', 'crown', 'experiment', 'fire', 'money-collect', 'property-safety', 'read', 'reconciliation', 'rest', 'security-scan', 'insurance', 'interation', 'safety-certificate', 'project', 'thunderbolt', 'block', 'cluster', 'deployment-unit', 'dollar', 'euro', 'pound', 'file-done', 'file-exclamation', 'file-protect', 'file-search', 'file-sync', 'gateway', 'gold', 'robot', 'shopping'
]
export default {
  name: 'iMenuEdit',
  data () {
    return {
      loading: false,
      visible: false,
      urlShow: true,
      apiShow: true,
      iconShow: true,
      invisibleShow: true,
      indexShow: true,
      menuTemp: {
        'id': 0,
        'parent_id': '0',
        'name': '',
        'url': '',
        'authorization_sign': '',
        'icon': '',
        'parent_name': '',
        'index': 0,
        'type': '',
        'is_hide': 0,
        'target': 0,
        'level': 0,
        'remark': '',
        'routes': []
      },
      standardTree: [],
      apis: [],
      icons,
      parentAuth: ''
    }
  },
  props: ['title', 'flag', 'itemdata', 'treedata'],
  watch: {
    flag: function () {
      this.visible = this.flag
      if (this.visible) {
        this.$nextTick(() => {
          // 删除子级
          delete this.itemdata.children
          // 删除是否需要授权
          delete this.itemdata.is_default
          delete this.itemdata.is_public
          this.itemdata.authorization_sign = this.itemdata.authorization_sign.split(':').pop()
          this.standardTree = this.initTree(this.itemdata.type, this.treedata)
          this.form.setFieldsValue(this.itemdata)
        })
      }
    }
  },
  created () {
    var _self = this
    this.$api.root.list().then(res => {
      this.apis = res.data
    })
    _self.form = _self.$form.createForm(_self, {
      onFieldsChange: (_, changedFields) => {},
      mapPropsToFields: () => {
        return {
          name: _self.$form.createFormField({
            value: _self.menuTemp.name
          })
        }
      },
      onValuesChange (_, item) {
        if (item.type === 0) {
          _self.urlShow = false
          _self.apiShow = false
          _self.iconShow = true
          _self.invisibleShow = true
          _self.indexShow = true
        } else if (item.type === 1) {
          _self.urlShow = true
          _self.apiShow = false
          _self.iconShow = true
          _self.invisibleShow = true
          _self.indexShow = true
        } else if (item.type === 2) {
          _self.urlShow = false
          _self.apiShow = true
          _self.iconShow = false
          _self.invisibleShow = false
          _self.indexShow = false
        } else if (item.type === 3) {
          _self.urlShow = true
          _self.apiShow = true
          _self.iconShow = false
          _self.invisibleShow = false
          _self.indexShow = false
        }
        _self.standardTree = _self.initTree(item.type, JSON.parse(JSON.stringify(_self.treedata)))
      }
    })
  },
  methods: {
    initTree (type, tree) {
      var standard = []
      for (var key in tree) {
        var item = tree[key]
        if (tree[key].children && tree[key].children.length > 0) {
          item.children = this.initTree(type, tree[key].children)
        }
        if (type === 2) {
          item.disabled = tree[key].type !== 1 && tree[key].type !== 3
        } else {
          item.disabled = tree[key].type !== 0
        }
        standard.push(item)
      }
      return standard
    },
    handleCancel () {
      this.$emit('cancel', false)
    },
    searchAuth (parent, tree) {
      for (var item of tree) {
        if (item.key === parent) {
          this.parentAuth = item.authorization_sign
        } else if (item && item.children && item.children.length) {
          this.searchAuth(parent, item.children)
        }
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.loading = true
      this.form.validateFieldsAndScroll((err, val) => {
        if (!err) {
          if (val.type === 2 || val.type === 3) {
            val.icon = ''
          }
          if (val.type === 3) {
            val.is_hide = 1
          }
          this.searchAuth(val.parent_id, this.treedata)
          if (this.parentAuth) {
            val.authorization_sign = this.parentAuth + ':' + val.authorization_sign
          }
          if (this.title === '新建同级菜单' || this.title === '新建子菜单') {
            this.$api.menu.add(val).then(res => {
              this.loading = false
              if (!res.code) {
                this.$message.success('添加成功', 3)
              }
              this.$emit('ok', false)
            })
          } else {
            this.$api.menu.edit(val).then(res => {
              this.loading = false
              if (!res.code) {
                this.$message.success('保存成功', 3)
              }
              this.$emit('ok', false)
            })
          }
        }
      })
    },
    handleAPIChange (value) {
      console.log(`selected ${value}`)
    },
    handleConfirmBlur  (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>
