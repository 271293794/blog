var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 分类的表结构
var categorySchema = new Schema({
    name: String,
    message: {
        type: String,
        default: '分类说明'
        
    }
});

module.exports = categorySchema