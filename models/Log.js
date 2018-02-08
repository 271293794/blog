/**
 * 根据对应的表结构创建配置类
 */
var mongoose = require('mongoose')
var logSchema = require('../schemas/logs')


var Log = mongoose.model('Log', logSchema)

module.exports = Log;