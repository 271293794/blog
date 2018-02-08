var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = mongoose.Schema.Types.ObjectId
// 分类的表结构，此处的 ref 和 populate方法搭配使用
var logSchema = new Schema({
    title: String,
    type: {
        type: ObjectId,
        required: true,
        ref: 'Category'
    },
    createTime: {
        type: Date,
        default: new Date()
    },
    user: {
        type: ObjectId,
        ref: 'User'
    },
    views: {
        type: Number,
        default: 0
    },
    message: {
        type: String,
        default: '日志简介'

    },
    content: String,
    // 评论
    comments: {
        type: Array,
        default: []
    }
});

module.exports = logSchema