

var express = require('express'),
    Log = require('../models/Log'),
    Category = require('../models/Category'),
    Config = require('../models/Config'),
    MarkdownIt = require('markdown-it'),
    md = new MarkdownIt(),
    markdown = require("markdown").markdown,
    PageUtil = require("../models/PageUtil")
var router = express.Router(),
    pageData = {}
/**
* 添加通用模版数据
*/
router.use((req, res, next) => {
    pageData = {}
    pageData.userInfo = req.userInfo
    Category.find((err, cArr) => {
        pageData.cList = cArr
        next()
    })

})
router.get('/', (req, res) => {


    var pageIndex = Number(req.query.pageIndex || 1),
        cid = req.query.cid || '',
        where = null;
    if (cid != '') where = { type: cid }

    var pageUtil = new PageUtil()

    var queryNumber = Log.where(where).count().then((count) => {
        pageUtil.totalCount = count
        Config.findOne({ key: 'showLogPageSize' }).then((config) => {
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

        Log.find().where(where).sort({ _id: -1 }).skip(skipNum).limit(pageUtil.pageSize).populate('type').populate('user').sort({
            createTime: -1
        }).then((arr) => {
            pageData.list = arr
            pageData.pageUtil = pageUtil
            pageData.cid = cid
            res.render('main/index', pageData);


        });
    }

})

router.get('/viewLog', (req, res) => {
    var lid = req.query.lid || '';
    Log.findOne({ _id: lid }).populate('user').then((entity) => {
        // 增加阅读数
        entity.views++
        entity.save()
        pageData.contentHTML =md.render(entity.content)

        pageData.entity = entity;

        res.render('main/viewLog', pageData)
    })

})
module.exports = router