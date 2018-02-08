var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 用户的表结构
var usersSchema = new Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = usersSchema