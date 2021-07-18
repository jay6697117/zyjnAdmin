<template>
<div class="cEdit">
  <a-form :form="currentItem" @submit="handleSubmit" v-show="loaded">
    <a-form-item label="resourceId" v-show="false">
      <a-input-number :min="0" v-decorator="['resourceId']" />
    </a-form-item>
    <a-form-item :label="name+'名称'" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
      <a-input
        placeholder="请输入视频名称（建议14个字以内，不超过45个字）"
        v-decorator="['title', { rules: [{ required: true, message: '请输入编码!' }] }]"
      />
    </a-form-item>
    <a-form-item :label="name+'上传'" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" v-if="type == 'video' || type == 'audio'">
      <a-row>
        <a-col :span="4">
          <i-upload :type="type" used="source" @ok="handleOk"></i-upload>
        </a-col>
        <a-col :span="8">
          {{mediaName}}
          <a-input v-show="false"
            v-decorator="['mediaId', { rules: [{ required: true, message: '请上传音频!' }] }]" />
        </a-col>
        <a-col :span="10"><div class="tips">{{tips[type].upload}}</div></a-col>
      </a-row>
    </a-form-item>
    <a-form-item :label="name+'封面'" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
      <a-row>
        <a-col :span="22">
          <a-avatar shape="square" icon="picture" class="editCover" :src="mediaCoverUrl"/>
          <div class="coverTips">
            <a-input v-show="false"
            v-decorator="['mediaCoverId', { rules: [{ required: true, message: '请上传计划封面!' }] }]" />
            <i-upload :type="type" used="cover" @ok="handleOk"></i-upload>
            <span v-if="uploadFlag"> <a-spin size="small" />{{loadTxt}}</span>
            <p>{{tips[type].cover}}</p>
          </div>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item :label="name+'详情'" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" v-if="type == 'txt'" class="txtDetail">
      <vue-html5-editor :height="240" :auto-height="false" :show-module-name="false"
      v-decorator="['content',{rules: [{ required: true, message: '您还未填写题目信息'}]}]"></vue-html5-editor>
    </a-form-item>
    <a-form-item label="视频贴片" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" v-if="type == 'video'">
      <a-row>
        <a-col :span="4">
          <i-upload :type="type" used="videoCover" @ok="handleOk"></i-upload>
        </a-col>
        <a-col :span="8">
          <a-avatar shape="square" icon="picture" :size="150" class="cover" :src="videoCoverUrl" />
          <a-input v-show="false"
            v-decorator="['videoCoverUrlId', { rules: [{ required: true, message: '请上传视频贴片!' }] }]" />
        </a-col>
        <a-col :span="10"><div class="tips">{{tips.video.paster}}</div></a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="分类" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
      <a-tree-select :getPopupContainer="triggerNode => triggerNode.parentNode"
        :dropdownStyle="dropdownStyle"
        :treeData="classified"
        placeholder='请选择分类'
        v-decorator="['categoryIds', { rules: [{ required: true, message: '请选择分类！' }] },]">
      </a-tree-select>
    </a-form-item>
    <a-form-item label="标签" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
      <span v-if="!tags.length">
        暂无标签数据，
        <router-link to="/classified/tag"> 前往标签管理 </router-link>
      </span>
      <a-tag :color="item.checked ? '#2db7f5' : 'blue'" v-for="item in tags" :key="item.id" @click="checkTag(item)">{{item.name}}</a-tag>
    </a-form-item>
    <a-form-item label="上架设置" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
      <a-radio-group v-decorator="['publishSetting']"  @change="onRadioChange" width="100%" class="radioGroup">
        <a-radio :value="1">立即上架</a-radio>
        <a-radio :value="0">
          定时上架
          <a-date-picker
            :mode="mode"
            showTime
            :disabled="disabled"
            format="YYYY-MM-DD HH:mm:ss"
            @openChange="handleOpenChange"
            @panelChange="handlePanelChange"
            v-decorator="['publishSettingTime']" />
        </a-radio>
        <a-radio :value="-1">暂不上架</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="显示设置" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
      <a-checkbox v-decorator="['show']" :checked="currentItem.getFieldValue('show')">勾选后仅在专栏中显示</a-checkbox>
    </a-form-item>
    <a-form-item label="视频设置" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
      <a-checkbox v-decorator="['playControl']" :checked="currentItem.getFieldValue('playControl')">首次学习进度条不可拖动</a-checkbox>
    </a-form-item>
    <a-form-item label="课程学分" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
      <a-input-number style="width: 100px;margin-right:10px;"
        v-decorator="['score']"
      />
      <span>分</span>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 8, offset: 3 }">
      <a-button type="primary" html-type="submit" style="width:100%">保存</a-button>
    </a-form-item>
  </a-form>
</div>
</template>
<script>
import moment from 'moment'

export default {
  name: 'cEditor',
  data () {
    return {
      confirmLoading: false,
      loaded: false,
      gotSelectList: false,
      tips: {
        video: {
          upload: '格式支持MP4，大小不超过2G，建议视频分辨率为1280×720',
          cover: '视频封面是指在商品列表展示的图片。建议尺寸750*560px或4：3，JPG、PNG格式， 图片小于5M',
          paster: '视频贴片是指视频播放器在播放前展示的图片。建议尺寸750*422px或16：9，JPG、PNG格式， 图片小于5M'
        },
        audio: {
          upload: '格式支持mp3、m4a，为保证音频加载与播放的流畅性，建议上传大小不超过500M',
          cover: '音频封面是指在商品列表展示的图片。建议尺寸750*560px或4：3，JPG、PNG格式， 图片小于5M'
        },
        txt: {
          cover: '图文封面是指在商品列表展示的图片。建议尺寸750*560px或4：3，JPG、PNG格式， 图片小于5M'
        }
      },
      tags: [],
      classified: [],
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      timePicker: '',
      mode: 'time',
      disabled: true,
      number: 1,
      mediaName: '',
      mediaCoverUrl: '',
      videoCoverUrl: '',
      currentItem: this.$form.createForm(this, {name: 'editor'})
    }
  },
  computed: {
    resourceId () {
      return this.$route.query.resourceId
    }
  },
  mounted () {
    this.getDetails()
  },
  props: ['type', 'name'],
  methods: {
    moment,
    initTree (treeData) {
      return treeData.map(item => {
        let child = {
          title: item.name,
          key: item.id,
          value: item.id + ''
        }
        if (item.children) {
          child.children = this.initTree(item.children)
        }
        return child
      })
    },
    getDetails () {
      let _self = this
      _self.loaded = false
      if (_self.gotSelectList) {
        _self.initData()
      } else {
        Promise.all([
          _self.$api.label.list(),
          _self.$api.classified.list()
        ]).then(results => {
          _self.tags = results[0].data
          _self.classified = _self.initTree(results[1].data)
          _self.gotSelectList = true
          _self.initData()
        })
      }
    },
    initData () {
      let _self = this
      if (_self.resourceId) {
        _self.$api.content.list({// 编辑时请求远端数据
          url: '/' + _self.type + '/get',
          resourceId: _self.resourceId
        }).then(res => {
          _self.loaded = true
          _self.initForm(res.data)
        })
      } else {
        _self.loaded = true
        _self.initForm({ // 添加时的默认值设置
          resourceId: _self.resourceId, // 课程id
          title: '',
          mediaCoverId: '',
          categoryIds: '',
          tagIds: [],
          score: 0,
          publishSetting: -1,
          playControl: false,
          mediaId: '',
          videoCoverUrlId: '',
          videoCoverUrl: '',
          mediaName: '',
          content: '',
          mediaCoverUrl: '',
          show: false
        })
      }
    },
    initForm (data) {
      let _self = this
      _self.tags = _self.tags.map(item => {
        item.checked = false
        data.tagIds.forEach(tag => {
          if (tag === item.id) {
            item.checked = true
          }
        })
        return item
      })
      let fieldsValue = {
        resourceId: _self.resourceId, // 课程id
        title: data.title, // 课程标题
        mediaCoverId: data.mediaCoverId, // 封面图片id
        categoryIds: data.categoryIds, // 分类id
        score: data.score, // 分数
        show: data.show === 1, // 展示设置
        publishSetting: data.publishSetting > 1 ? 0 : data.publishSetting, // 上架状态
        publishSettingTime: data.publishSetting > 1 ? _self.moment(new Date(data.publishSetting * 1000).toLocaleDateString()) : _self.moment(new Date().toLocaleDateString())
      }
      if (_self.type === 'video') { // 视频特殊处理
        fieldsValue.playControl = data.playControl === 1 // 是否允许拖动
        fieldsValue.mediaId = data.mediaId // 视频资源id
        fieldsValue.videoCoverUrlId = data.videoCoverUrlId // 贴片图片id
        _self.videoCoverUrl = data.videoCoverUrl // 贴片地址
        _self.mediaName = data.mediaName // 资源名称
      } else if (_self.type === 'audio') { // 音频特殊处理
        fieldsValue.playControl = data.playControl === 1 // 是否允许拖动
        fieldsValue.mediaId = data.mediaId // 音频资源id
        _self.mediaName = data.mediaName // 资源名称
      }
      _self.currentItem.setFieldsValue(fieldsValue) // 给表单赋值
      _self.mediaCoverUrl = data.mediaCoverUrl // 封面地址
    },
    checkTag (item) {
      this.tags = this.tags.map(child => {
        if (item.id === child.id) {
          child.checked = !child.checked
        }
        return child
      })
    },
    onRadioChange (e) {
      this.disabled = e.target.value !== 0
    },
    handleOpenChange (open) {
      if (open) {
        this.mode = 'time'
      }
    },
    handlePanelChange (value, mode) {
      this.mode = mode
    },
    handleOk (target) { // 上传成功
      if (target.used === 'source' && // 资源
        (target.type === 'video' || target.type === 'audio')) {
        this.mediaName = target.name
        this.currentItem.setFieldsValue({mediaId: target.resourceId}) // 给表单赋值
      } else if (target.used === 'videoCover') { // 贴片
        this.videoCoverUrl = target.url
        this.currentItem.setFieldsValue({videoCoverUrlId: target.resourceId}) // 给表单赋值
      } else if (target.used === 'cover') { // 封面
        this.mediaCoverUrl = target.url
        this.currentItem.setFieldsValue({mediaCoverId: target.resourceId}) // 给表单赋值
      }
    },
    handleSubmit (e) {
      var _self = this
      e.preventDefault()
      _self.currentItem.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.publishSetting = values.publishSetting === 0 ? new Date(values.publishSettingTime._d).getTime() / 1000 : values.publishSetting
          delete values.publishSettingTime
          values.categoryIds = _self.idsToArray(values.categoryIds)
          values.tagIds = _self.tags.filter(item => item.checked).map(item => item.id)
          values.playControl = 0 + values.playControl
          values.show = 0 + values.show
          if (values.resourceId) { // 编辑
            values.url = '/' + _self.type + '/edit'
          } else { // 添加
            values.url = '/' + _self.type + '/add'
          }
          _self.$api.content.list(values).then(res => {
            _self.$router.push({
              path: '/content/' + _self.type + 'List'
            })
          })
        }
      })
    },
    idsToArray (val = []) {
      return Array.isArray(val) ? val : [val]
    }
  }
}
</script>
<style scope>
  .cEdit .ant-modal-content{height: 100%;display: flex;flex-direction: column;}
  .cEdit .ant-modal-content .ant-modal-header{flex:0 0 55px}
  .cEdit .ant-modal-content .ant-modal-body{flex:1;overflow-x: hidden;}
  .cEdit .mediaName{border: 0;cursor: default;background: none; color: #303030;}
  .cEdit .radioGroup .ant-calendar-picker{margin-left: 10px;}
  .cEdit .txtDetail label:before{display: inline-block;margin-right: 4px;color: #f5222d;font-size: 14px;font-family: SimSun, sans-serif;line-height: 1;content: '*'}
</style>
