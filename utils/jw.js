/**
 * 关于教务方面的API调用函数
 */
const AppConfig = require('./config.js');
const token = require('./token.js');
function getAllGrade(xnm, xqm, successCallBack, failCallBack){
    let random = token.random(256);
    let timetoken = new Date().getTime();
    let rtoken = token.encrypt(timetoken, random);
    wx.request({
        url: AppConfig.APIAddress + AppConfig.jwAllGrade + '?token=' + rtoken + "&timetoken=" + timetoken + "&random=" + random,
        method: 'POST',
        header : {
            'content-type' : 'application/x-www-form-urlencoded'
        },
        data : {
            'xqm' : xqm,
            'xnm' : xnm
        },
        success: successCallBack,
        fail: failCallBack
    })
}

module.exports = {
    'getAllGrade' : getAllGrade
}