/**
 * 请求的返回数据类
 * @param {*返回代码} code 
 * @param {*消息} msg 
 * @param {*数据} data 
 */
module.exports = function ResData(code = 0, msg = '', data = null) {
    this.code = code
    this.msg = msg
    this.data = data

}





