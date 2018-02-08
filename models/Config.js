/**
 * 根据对应的表结构创建配置类
 */
var mongoose = require('mongoose')
var configSchema = require('../schemas/configs')


var Config = mongoose.model('Config', configSchema)

module.exports = Config;