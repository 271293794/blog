/**
 * 根据对应的表结构创建配置类
 */
var mongoose = require('mongoose')
var categorySchema = require('../schemas/categorys')


var Category = mongoose.model('Category', categorySchema)

module.exports = Category;