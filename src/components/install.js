import iFilter from './tool/Filter'
import iPagination from './tool/Pagination'
import iCategory from './tool/Category'
import iDelList from './tool/DelList'
import iChoose from './tool/Choose'
import iOperation from './tool/Operation'
import iRemove from './tool/Remove'
import uploadImg from './tool/uploadImg'

// 添加install方法
const custom = {
  install (Vue) {
    Vue.component(iFilter.name, iFilter)
    Vue.component(iPagination.name, iPagination)
    Vue.component(iDelList.name, iDelList)
    Vue.component(iCategory.name, iCategory)
    Vue.component(iChoose.name, iChoose)
    Vue.component(iOperation.name, iOperation)
    Vue.component(iRemove.name, iRemove)
    Vue.component(uploadImg.name, uploadImg)
  }
}
export default custom
