/**
 * 请求的返回数据类
 * @param {Number} code 返回代码
 * @param {String} msg 消息
 * @param {Object} data 数据
 */
module.exports = function ResData(code = 0, msg = '', data = null) {
    this.code = code
    this.msg = msg
    this.data = data

}





