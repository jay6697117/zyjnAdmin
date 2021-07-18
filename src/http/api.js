/*
 * 接口统一集成模块
 */
import * as login from './moudules/sys/login'
import * as user from './moudules/sys/user'
import * as org from './moudules/sys/org'
import * as dept from './moudules/sys/dept'
import * as role from './moudules/sys/role'
import * as roleCategory from './moudules/sys/roleCategory'
import * as menu from './moudules/sys/menu'
import * as account from './moudules/sys/account'
import * as root from './moudules/sys/root'
import * as dict from './moudules/sys/dict'
import * as log from './moudules/sys/log'
import * as orgType from './moudules/sys/orgType'
import * as channel from './moudules/classified/channel'
import * as classified from './moudules/classified/classified'
import * as category from './moudules/classified/category'
import * as station from './moudules/sys/station'
import * as stationGroup from './moudules/sys/stationGroup'
import * as label from './moudules/classified/label'
import * as labelGroup from './moudules/classified/labelGroup'
import * as upload from './moudules/content/upload'
import * as content from './moudules/content/content'
import * as column from './moudules/content/column'
import * as course from './moudules/content/course'
import * as plan from './moudules/content/plan'
import * as relation from './moudules/content/relation'
import * as questionCategory from './moudules/content/questionCategory'
import * as question from './moudules/content/question'
import * as paper from './moudules/content/paper'
import * as news from './moudules/operation/news'
import * as exam from './moudules/content/exam'
import * as resource from './moudules/content/resource'
import * as banner from './moudules/operation/banner'
import * as organ from './moudules/partner/organ'
import * as home from './moudules/home'
import * as mall from './moudules/mall/mall'
import * as order from './moudules/order/order'
import * as purchase from './moudules/content/purchase'
import * as courseData from './moudules/statistics/courseData'
import * as examData from './moudules/statistics/examData'
import * as planData from './moudules/statistics/planData'
import * as studentData from './moudules/statistics/studentData'
import * as timeData from './moudules/statistics/timeData'
import * as dealOrder from './moudules/deal/order'
import * as dealCash from './moudules/deal/cash'
import * as examine from './moudules/org/examine'
import * as apply from './moudules/partner/apply'
import * as certificate from './moudules/content/certificate'
import * as pageManagement from './moudules/operation/pageManagement'
import * as platform from './moudules/statistics/platform'
import * as enterprise from './moudules/statistics/enterprise'
import * as audit from './moudules/sys/audit'
import * as courseProduct from './moudules/mall/courseProduct'
import * as courseShop from './moudules/mall/courseShop'
import * as examineCourse from './moudules/examine/course'
import * as message from './moudules/examine/message'
// 默认全部导出
export default {
  login,
  user,
  org,
  dept,
  role,
  roleCategory,
  menu,
  account,
  root,
  dict,
  log,
  label,
  labelGroup,
  station,
  stationGroup,
  classified,
  category,
  channel,
  upload,
  content,
  questionCategory,
  question,
  paper,
  orgType,
  column,
  course,
  plan,
  relation,
  news,
  exam,
  resource,
  banner,
  organ,
  home,
  mall,
  order,
  purchase,
  courseData,
  examData,
  planData,
  studentData,
  timeData,
  dealOrder,
  dealCash,
  examine,
  apply,
  certificate,
  pageManagement,
  platform,
  enterprise,
  audit,
  courseProduct,
  courseShop,
  examineCourse,
  message
}
