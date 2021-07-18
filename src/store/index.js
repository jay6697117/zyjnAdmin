import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
const pageSize = 10 // 分页器每页条数
const currentNav = 1 // 菜单和路由是否已经加载
const navTree = [] // 导航菜单树
const isMobile = false
const collapsed = false
const layout = 'side'
const perms = [] // 用户前台界面访问权限标识集合
const apis = [] // 用户后台api访问权限标识集合
const user = {}
const token = ''
const uploadParmas = {}
const checkCategory = ['-1']
const expandedCategory = ['-1']
const multipage = true
const theme = 'dark'
const systemName = '运输技能'
const copyright = '2020 运输技能平台'
const paperQlist = []
const fromType = 'exam'
const stepOneShow = true
const stepTwoShow = false
const stepThreeShow = false
const transData = {}
const examDetail = {}
const relatedCourseData = []
const resourceIds = []
const deleteId = []
const questions = []
const relatedId = []
const questionTypes = ['', '单选题', '多选题', '判断题', '填空题']
const bannerItem = {}
const mallFilter = {}
const mallOrder = {}
const defaultSetting = {}
const todos = 0
const listParmas = {
  pagination: {
    type: '',
    total: 0,
    current_page: 1
  },
  filters: {}
}
const module = {
  state: {
    pageSize,
    currentNav,
    navTree,
    isMobile,
    collapsed,
    layout,
    perms,
    apis,
    user,
    token,
    uploadParmas,
    checkCategory,
    expandedCategory,
    multipage,
    theme,
    systemName,
    copyright,
    paperQlist,
    fromType,
    stepOneShow,
    stepTwoShow,
    stepThreeShow,
    transData,
    examDetail,
    relatedCourseData,
    resourceIds,
    deleteId,
    questions,
    relatedId,
    questionTypes,
    bannerItem,
    mallFilter,
    mallOrder,
    defaultSetting,
    listParmas,
    todos
  },
  mutations: {
    initListParmas (state) {
      state.listParmas = listParmas
    },
    initSotre (state) {
      state.pageSize = pageSize
      state.currentNav = currentNav
      state.navTree = navTree
      state.isMobile = isMobile
      state.collapsed = collapsed
      state.layout = layout
      state.perms = perms
      state.apis = apis
      state.user = user
      state.token = token
      state.uploadParmas = uploadParmas
      state.checkCategory = checkCategory
      state.expandedCategory = expandedCategory
      state.multipage = multipage
      state.theme = theme
      state.systemName = systemName
      state.copyright = copyright
      state.paperQlist = paperQlist
      state.fromType = fromType
      state.stepOneShow = stepOneShow
      state.stepTwoShow = stepTwoShow
      state.stepThreeShow = stepThreeShow
      state.transData = transData
      state.examDetail = examDetail
      state.relatedCourseData = relatedCourseData
      state.resourceIds = resourceIds
      state.deleteId = deleteId
      state.questions = questions
      state.relatedId = relatedId
      state.questionTypes = questionTypes
      state.bannerItem = bannerItem
      state.mallFilter = mallFilter
      state.mallOrder = mallOrder
      state.defaultSetting = defaultSetting
      state.listParmas = listParmas
      state.todos = todos
    },
    setTodos (state, todos) {
      state.todos = todos
    },
    setListPamars (state, listParmas) {
      state.listParmas = listParmas
    },
    setDefault (state, defaultSetting) {
      state.defaultSetting = defaultSetting
    },
    setCollapsed (state, collapsed) {
      state.collapsed = collapsed
    },
    setMallOrder (state, item) {
      state.mallOrder = item
    },
    setMallFilter (state, item) {
      state.mallFilter = item
    },
    setBannerItem (state, item) {
      state.bannerItem = item
    },
    setPageSize (state, pageSize) {
      state.pageSize = pageSize
    },
    setCopyright (state, copyright) {
      state.copyright = copyright
    },
    setSystemName (state, systemName) {
      state.systemName = systemName
    },
    setTheme (state, theme) {
      state.theme = theme
    },
    setMultipage (state, multipage) {
      state.multipage = multipage
    },
    setExpandedCategory (state, expandedCategory) { // 改变题库列表的分类树展开项
      state.expandedCategory = expandedCategory
    },
    setCheckCategory (state, checkCategory) { // 改变题库列表的分类树选中项
      state.checkCategory = checkCategory
    },
    setToken (state, token) { // 改变菜单和路由的加载状态
      state.token = token
    },
    setCurrentNav (state, id) { // 改变菜单和路由的加载状态
      state.currentNav = id
    },
    setNavTree (state, navTree) { // 设置导航菜单树
      state.navTree = navTree
    },
    setDevice (state, isMobile) {
      state.isMobile = isMobile
    },
    setPerms (state, perms) { // 用户前台界面访问权限标识集合
      console.log('页面权限集合：', perms)
      state.perms = perms
    },
    setApis (state, perms) { // 用户后台api访问权限标识集合
      console.log('接口访问权限集合：', perms)
      state.apis = perms
    },
    setuser (state, user) {
      state.user = user
    },
    setUploadParmas (state, uploadParmas) {
      state.uploadParmas = uploadParmas
    },
    setaddQues (state, params) { // 试卷添加题目
      state.paperQlist = params.paperQlist
    },
    setFromType (state, params) { // 添加课程时，类型是试卷还是专栏
      state.fromType = params
    },
    setStepShow (state, params) { // 添加试卷步骤展示
      state.stepOneShow = params.stepOneShow
      state.stepTwoShow = params.stepTwoShow
      state.stepThreeShow = params.stepThreeShow
    },
    setStepOneData (state, params) { // 存储第一步表单数据
      state.transData = params
    },
    setExamDetail (state, params) { // 试卷详情数据
      state.examDetail = params
    },
    setRelatedCourse (state, params) { // 关联课程数据、id、删除id  专栏添加课程
      console.log('store---', params)
      state.relatedCourseData = params.relatedCourseData
      state.resourceIds = params.resourceIds
      state.deleteId = params.deleteId
    },
    setExamQues (state, params) {
      state.questions = params
    },
    setRelatedId (state, params) { // 关联id
      state.relatedId = params
    }
  },
  plugins: [createPersistedState()]
}

const store = new Vuex.Store(module)

export default store
