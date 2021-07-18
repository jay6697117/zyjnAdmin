/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

// 后台管理系统服务器地址
const env = require('./config')
const HOST = process.env.HOST || 'dev'
const NODE_ENV = process.env.NODE_ENV || 'development'

let formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  },
  buttonCol: {
    xs: { span: 24 },
    sm: { span: 16, offset: 8 }
  }
}
let dubbleColumn = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  },
  buttonCol: {
    xs: { span: 24 },
    sm: { span: 16, offset: 8 }
  }
}
let bigFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: {span: 4},
    xl: {span: 3}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
}
let midFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: {span: 4},
    xl: {span: 3}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
}
let smallFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: {span: 4},
    xl: {span: 3}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  }
}
let btnFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3, offset: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 3, offset: 1 }
  }
}
let modalbtnFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3, offset: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 3, offset: 1 }
  }
}

export default {
  HOST,
  NODE_ENV,
  dubbleColumn,
  bigFormLayout,
  midFormLayout,
  btnFormLayout,
  modalbtnFormLayout,
  formItemLayout,
  smallFormLayout,
  prefix: env[HOST].prefix,
  baseUrl: env[HOST].baseUrl,
  proName: env[HOST].proName,
  adminLogo: NODE_ENV === 'development' ? '/' + env[HOST].adminLogo : (env[HOST].baseUrl + env[HOST].prefix + env[HOST].adminLogo),
  adminLogoBig: NODE_ENV === 'development' ? '/' + env[HOST].adminLogoBig : (env[HOST].baseUrl + env[HOST].prefix + env[HOST].adminLogoBig),
  adminLogoBlack: NODE_ENV === 'development' ? '/' + env[HOST].adminLogoBlack : (env[HOST].baseUrl + env[HOST].prefix + env[HOST].adminLogoBlack)
}
