var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 配置的表结构
var configSchema = new Schema({
    key: String,
    value: String,
    message: {
        type: String,
        default: '参数说明'
        
    }
});

module.exports = configSchema