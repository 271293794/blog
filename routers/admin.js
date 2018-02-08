

var express = require('express'),
    ResData = require("../models/ResData"),
    User = require('../models/User'),
    Log = require('../models/Log'),
    Category = require('../models/Category'),
    Config = require('../models/Config'),
    PageUtil = require("../models/PageUtil")




var router = express.Router()


/**
 * 权限验证
 */
router.use((req, res, next) => {
    // 非管理员用户
    if (!req.userInfo.isAdmin) {
        res.send(new ResData(1, '权限不足'))
        return;
    }
    next()
})
router.get('/', (req, res, next) => {
    // res.send('管理首页')
    res.render('admin/index', { userInfo: req.userInfo })
})
// 用户列表
router.get('/allUser', (req, res, next) => {
    var pageIndex = Number(req.query.pageIndex || 1)
    var pageUtil = new PageUtil()

    var queryNumber = User.count().then((count) => {
        pageUtil.totalCount = count
        Config.findOne({ key: 'userPageSize' }).then((config) => {
            pageUtil.pageSize = Number(config.value)
            pageUtil.totalPage = Math.ceil(count / pageUtil.pageSize)
            pageUtil.pageIndex = pageIndex < 1 ? 1 : pageIndex > pageUtil.totalPage ? pageUtil.totalPage : pageIndex;
            findAll(config)

        }).catch((e) => {
            console.log(e + '1')
        })
    })
    console.log('--------------------------')



    function findAll(config) {

        var skipNum = (pageUtil.pageIndex - 1) * pageUtil.pageSize
        if (skipNum < 0) skipNum = 0

        User.find().skip(skipNum).limit(pageUtil.pageSize).then((arr) => {
            res.render('admin/allUser', { userInfo: req.userInfo, userList: arr, pageUtil: pageUtil });
        });
    }



})
// 获取添加页面
router.get('/add', (req, res, next) => {
    res.render('admin/addCategory', { userInfo: req.userInfo })
})
// 添加页面提交
router.post('/add', (req, res, next) => {
    var name = req.body.name || '',
        message = req.body.message || '',
        effect = '',
        tpl = ''

    if (name == '') {
        effect = '分类名称不能为空'
        tpl = 'error'
        res.render(tpl, { userInfo: req.userInfo, effect: effect })

    }
    else {
        // 查询是否重名
        Category.findOne({ name: name }).then((entity) => {
            if (entity) {
                effect = '名称重复'
                tpl = 'error'
            } else {
                new Category({ name: name, message: message }).save()
                effect = '添加成功'
                tpl = 'admin/addCategory'
            }
            res.render(tpl, { userInfo: req.userInfo, effect: effect })

        }).catch((e) => {
            console.log(e)
        })


    }

})
// 分类首页
router.get('/allCategory', (req, res, next) => {
    var pageIndex = Number(req.query.pageIndex || 1)
    var pageUtil = new PageUtil()

    var queryNumber = Category.count().then((count) => {
        pageUtil.totalCount = count
        Config.findOne({ key: 'categoryPageSize' }).then((config) => {
            pageUtil.pageSize = Number(config.value)
            pageUtil.totalPage = Math.ceil(count / pageUtil.pageSize)
            pageUtil.pageIndex = pageIndex < 1 ? 1 : pageIndex > pageUtil.totalPage ? pageUtil.totalPage : pageIndex;
            findAll(config)

        }).catch((e) => {
            console.log(e)
        })
    })



    function findAll(config) {

        var skipNum = (pageUtil.pageIndex - 1) * pageUtil.pageSize
        if (skipNum < 0) skipNum = 0

        Category.find().sort({ _id: -1 }).skip(skipNum).limit(pageUtil.pageSize).then((arr) => {
            res.render('admin/allCategory', { userInfo: req.userInfo, list: arr, pageUtil: pageUtil });
        });
    }
})
// 获取修改分类页面
router.get('/allCategory/alter', (req, res, next) => {
    var id = req.query.cid || '';
    Category.findById(id).then((entity) => {
        res.render('admin/alterCategory', { userInfo: req.userInfo, entity: entity })
    }).catch((e) => {
        res.render('error', { effect: e.toString() })
    })

})
// 修改分类页面提交
router.post('/allCategory/alter', (req, res, next) => {
    var cid = req.query.cid || '',
        reName = req.body.name || '',
        reMessage = req.body.message || '',
        tpl = '',
        effect = ''
    // 查询名称是否重复
    Category.findOne({ name: reName, _id: { $ne: cid } }).then((obj) => {
        if (!obj) {
            Category.update({ _id: cid }, { name: reName, message: reMessage }, (err, raw) => {
                if (err)
                    tpl = 'error', effect = err.toString()
                else
                    tpl = 'admin/alterCategory', effect = '修改成功'

                res.render(tpl, { userInfo: req.userInfo, effect: effect, entity: { name: reName, message: reMessage, _id: cid } })
            })
        } else {
            tpl = 'error', effect = '分类名称重复'
            res.render(tpl, { userInfo: req.userInfo, effect: effect })
        }


    })





})
router.get('/allCategory/delete', (req, res, next) => {
    var tpl = '', effect = ''
    Category.remove({ _id: req.query.cid }, (e) => {
        if (e) {
            tpl = 'error', effect = e.toString()
            res.render(tpl, { userInfo: req.userInfo, effect: effect })

        }
        else {
            // 重定向
            res.redirect('/admin/allCategory')
        }
    })
})
// 所有日志列表
router.get('/allLog', (req, res) => {
    // var tpl = 'admin/allLog', effect = ''
    // Log.find((err,arr)=>{
    //     res.render(tpl, { userInfo: req.userInfo, effect: effect ,list:arr})

    // })

    var pageIndex = Number(req.query.pageIndex || 1)
    var pageUtil = new PageUtil()

    var queryNumber = Log.count().then((count) => {
        pageUtil.totalCount = count
        Config.findOne({ key: 'logPageSize' }).then((config) => {
            pageUtil.pageSize = Number(config.value)
            pageUtil.totalPage = Math.ceil(count / pageUtil.pageSize)
            pageUtil.pageIndex = pageIndex < 1 ? 1 : pageIndex > pageUtil.totalPage ? pageUtil.totalPage : pageIndex;
            findAll(config)

        }).catch((e) => {
            console.log(e)
        })
    })



    function findAll(config) {

        var skipNum = (pageUtil.pageIndex - 1) * pageUtil.pageSize
        if (skipNum < 0) skipNum = 0
        // populate 方法：把type字段从ObjectId类型转化为相关联表中的一个对象
        Log.find().skip(skipNum).limit(pageUtil.pageSize).populate('type').populate('user').then((arr) => {
            res.render('admin/allLog', { userInfo: req.userInfo, list: arr, pageUtil: pageUtil });
        });
    }



})
router.get('/addLog', (req, res) => {
    var tpl = 'admin/addLog', effect = ''
    Category.find((err, cArr) => {
        res.render(tpl, { userInfo: req.userInfo, effect: effect, cArr: cArr })
    })
})
// 添加日志
router.post('/addLog', (req, res) => {
    var tpl = 'success', effect = '添加日志成功',
        title = req.body.title || '',
        cType = req.body.cType || '',
        message = req.body.message || '',
        content = req.body.content || ''

    if (title == '' || cType == '' || content == '') {
        tpl = 'error', effect = '标题、类型、内容不能为空'
    } else {
        new Log({ title: title, type: cType, message: message, content: content, user: req.userInfo.id.toString() }).save()
    }


    res.render(tpl, { userInfo: req.userInfo, effect: effect })

})
router.get('/allLog/alter', (req, res) => {
    var tpl = 'admin/alterLog', effect = ''
    var lid = req.query.lid || ''
    Log.findOne({ _id: lid }).then((entity) => {
        if (entity) {

        } else {
            tpl = 'error', effect = '不存在对应的日志'
        }

        Category.find((err, cArr) => {
            res.render(tpl, { userInfo: req.userInfo, effect: effect, entity: entity, cArr: cArr })
        })
    })
})
router.post('/allLog/alter', (req, res) => {
    var lid = req.query.lid || '',
        reTitle = req.body.title || '',
        reType = req.body.cType || '',
        reMessage = req.body.message || '',
        reContent = req.body.content || '',
        tpl = 'success',
        effect = '修改成功'
    if (reTitle == '' || reType == '' || reContent == '') {
        tpl = 'error', effect = '标题、类型、内容不能为空'
        res.render(tpl, { userInfo: req.userInfo, effect: effect })
    } else {
        Log.update({ _id: lid }, { title: reTitle, type: reType, message: reMessage, content: reContent }, (err, raw) => {
            if (err)
                tpl = 'error', effect = err.toString()
            res.render(tpl, { userInfo: req.userInfo, effect: effect })
        })
    }





})
// 删除日志
router.get('/allLog/delete', (req, res, next) => {
    var tpl = '', effect = ''
    Log.remove({ _id: req.query.lid }, (e) => {
        if (e) {
            tpl = 'error', effect = e.toString()
            res.render(tpl, { userInfo: req.userInfo, effect: effect })
        }
        else {
            // 重定向
            res.redirect('/admin/allLog')
        }
    })
})
module.exports = router

