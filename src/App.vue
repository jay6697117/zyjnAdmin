<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import enquireScreen from './utils/device'
import '@/mock/index'
export default {
  name: 'App',
  created () {
    let _this = window.vue = this
    enquireScreen(isMobile => {
      _this.$store.commit('setDevice', isMobile)
    })
    this.$api.upload.first().then(res => { // 阿里云上传必要参数
      if (res) {
        this.$store.commit('setUploadParmas', res.data)
      }
    })
    window.addEventListener('popstate', function (e) {
      location.reload()
    }, false)
  }
}
</script>

<style lang="less">
  :global{
    //拖拽控件全局样式
    .dragable-ghost{
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
    .dragable-chose{
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
    .dragable-drag{
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
    //页面切换动画
    .page-toggle-enter-active{
      transition: all 0.2s ease-in 0.25s;
    }
    .page-toggle-leave-active{
      transition: all 0.2s ease-out 0s;
    }
    .page-toggle-enter, .page-toggle-leave-to{
      opacity: 0;
      padding: 0px;
    }
  }
  .adminContent{overflow-x: auto;}
  #app{
    font-weight: 500;
    .has-error .vue-html5-editor{border: 1px solid #f5222d}
    .has-error .vue-html5-editor>.toolbar>ul{border-bottom: 1px solid #f5222d;}
    .vue-html5-editor, .vue-html5-editor>.toolbar {z-index:100!important}
    .vue-html5-editor>.toolbar>.dashboard button{height: 30px;line-height: 18px;}
    .vue-html5-editor>.toolbar>.dashboard input[type=text], .vue-html5-editor>.toolbar>.dashboard input[type=number], .vue-html5-editor>.toolbar>.dashboard select{line-height: 16px;}
    .vue-html5-editor img{max-width: 100%;}
    .vue-html5-editor h1{font-size: 2em;}
    .ant-select-tree-dropdown{max-height: 300px!important;}
    .ant-dropdown-menu-item{text-align: center;}
    .ant-select-tree li{text-align-last: left;}
    .ant-select-dropdown-menu-item{text-align: left;}
    .customTd{display:flex;}
    .customTd img{width:100px;height:75px;margin-right:10px;vertical-align:top;cursor: pointer;}
    .description{flex:1;line-height:25px;}
    .description p{ height: 75px; margin:0;padding:0;cursor: pointer;overflow: hidden;word-break: break-all;color: #353535;}
    .ant-table{ color: #666;}
  }
  .ant-menu-sub.ant-menu-inline>.ant-menu-item{font-size: 13px;}
  .ant-menu-sub.ant-menu-inline>.ant-menu-submenu>.ant-menu-submenu-title{font-size: 13px;}
  .ant-menu-dark .ant-menu-item, .ant-menu-dark .ant-menu-item-group-title, .ant-menu-dark .ant-menu-item > a{color: rgba(255,255,255,0.8);}
  .ant-menu-sub.ant-menu-inline > .ant-menu-item, .ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title{line-height: 48px;height: 48px;}
  .ant-menu-vertical .ant-menu-item:not(:last-child), .ant-menu-vertical-left .ant-menu-item:not(:last-child), .ant-menu-vertical-right .ant-menu-item:not(:last-child), .ant-menu-inline .ant-menu-item:not(:last-child){margin-bottom: 4px;}
  .ant-menu-dark, .ant-menu-dark .ant-menu-sub{background: #161e42;}
  .content{
    img{
      &:hover{outline: 2px solid rgba(0,0,255,0.75);}
    }
    #editorImgBox {
      outline: 2px solid blue;position: relative;display: inline-block;
      span{ position: absolute; width: 12px; height: 12px; background: #fff; border-radius: 50%; border: 2px solid blue; }
      #bEditorImgBtn{ left: 50%; margin-left: -7px; bottom: -7px; cursor: n-resize; }
      #rEditorImgBtn{ right: -7px; margin-top: -7px; top: 50%; cursor: e-resize; }
      #rbEditorImgBtn{ right: -7px; bottom: -7px; cursor: nwse-resize; }
    }
  }
  .ant-table-tbody img{max-width: 100%;}
  @media (max-width: 480px) {
    .ant-table {
        width: 100%;
        overflow-x: auto;
    }
    .ant-table-tbody>tr>td, .ant-table-tbody>tr>th, .ant-table-thead>tr>td, .ant-table-thead>tr>th {white-space: pre;}
  }
  .ant-form {
    .ant-layout-sider-children{overflow-x: hidden;}
    .editCover{
      width: 240px;height:180px;float:left;display:flex;align-items:center;justify-content:center;margin-right:12px;
     .anticon {
        width:50%;height:50%;
        svg{width:100%;height:100%;}
      }
    }
    .coverTips{
      line-height: 130%;
      p{margin-top:12px;}
    }
    .ant-avatar{display: flex;}
  }
</style>
