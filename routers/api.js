

var express = require('express'),
    ResData = require("../models/ResData"),
    Comment = require("../models/Comment"),
    User = require('../models/User'),
    Log = require('../models/Log'),
    cookies = require('cookies')


var router = express.Router()

router.get('/post', (req, res, next) => {
    res.send('post')
})
router.post('/register', (req, res, next) => {
    if (!(req.body.username && req.body.password)) {
        var resData = new ResData(0, '用户名或密码不能为空')
        res.send(resData)
    }


    var user = new User({
        username: req.body.username,
        password: req.body.password
    })

    User.findOne({ username: req.body.username }).then((queryUser) => {
        if (queryUser) {
            res.send(new ResData(0, '用户名已注册'))
        } else {
            return user.save();
        }

    }).then((newUser) => {
        console.log(newUser)
        res.send(new ResData(1, '注册成功'))

    })




})

router.post('/login', (req, res, next) => {
    if (!(req.body.username && req.body.password)) {
        var resData = new ResData(0, '用户名或密码不能为空')
        res.send(resData)
    }


    User.findOne({
        username: req.body.username,
        password: req.body.password
    }).then((queryUser) => {
        // 找到了用户名和密码都匹配的记录
        if (queryUser) {
            var cookieData = { id: queryUser._id, username: queryUser.username }
            // 设置cookie(在send之前 )
            req.cookies.set('userInfo', JSON.stringify(cookieData))
            res.send(new ResData(1, '登录成功', cookieData))
        } else {
            res.send(new ResData(0, '用户名或密码错误'))
        }

    })




})
router.get('/logout', (req, res, next) => {
    req.cookies.set('userInfo', null)
    res.send(new ResData(1, '退出'))
})
// 提交评论
router.post('/comment/post', (req, res, next) => {
    var comment = new Comment()
    comment.username = req.userInfo.username
    comment.comment = req.body.comment
    // 来自哪篇文章的评论
    comment.lid = req.body.lid
    Log.findOne({ _id: comment.lid }).then((entity) => {
        entity.comments.push(comment)
        return entity.save()
    }).then((newEntity) => {
        var comments = newEntity.comments;
        comments.sort({time:-1})
        res.send(new ResData(1, '评论成功', comment))

    })


})
module.exports = router
