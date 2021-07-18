'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
let HOST = process.env.npm_config_host || 'dev';
module.exports = merge(prodEnv, {
 NODE_ENV: '"development"',
 HOST: '"'+HOST+'"'
})