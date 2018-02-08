
var express = require('express'),
    swig = require('swig'),
    mongoose = require('mongoose'),
    bodyParser=require('body-parser'),
    cookies=require('cookies'),
    User = require('./models/User'),
    Config = require('./models/Config')

// 等同 http.createServer()
var app = express();
// swig.setDefaults({ autoescape: false });
// 设置静态文件路径
app.use('/public', express.static(__dirname + '/public'))
// 每次请求都会经过这里
app.use((req,res,next)=>{
    req.cookies=new cookies(req,res)
    // 请求前把待验证的身份信息添加到 req 对象上
    var strUserInfo=req.cookies.get('userInfo')
    if (strUserInfo) {
        try {
            req.userInfo=JSON.parse(strUserInfo)
            User.findById(req.userInfo.id,(err,user)=>{
                req.userInfo.isAdmin=Boolean(user.isAdmin)
                next()
            })
        } catch (error) {
            console.log(error)
        }
        
    }
    else{next()}

    
})
// 接口接收 post 中的数据用到的中间件(应在设置路由之前完成)
app.use(bodyParser.urlencoded({extended:true}))
// 设置子路由
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))

/**
 * 定义express 使用的模版引擎
 * 第一个参数，处理html后缀文件
 * 第二个参数，解析指定后缀文件所用的方法
 */
app.engine('html', swig.renderFile)
// 注册模版引擎，和上面定义时，的第一个参数一保持一致
app.set('view engine', 'html')
// 设置默视图的位置
app.set('views', './views')
// 不缓存
swig.setDefaults({ cache: false })

app.get('/', (req, res, next) => {
    res.render('index')
})

mongoose.connect('mongodb://127.0.0.1:27017/blog', (err) => { 
    if (err)
        console.log('连接失败')
    else {
        console.log('连接成功')
        app.listen(8080)

    }
});