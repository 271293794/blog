/**
 * 根据对应的表结构创建用户类
 */
var mongoose = require('mongoose')
var usersSchema=require('../schemas/users')


var User= mongoose.model('User',usersSchema)

module.exports=User;