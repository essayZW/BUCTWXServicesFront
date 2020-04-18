/**
 * 关于教务方面的API调用函数
 */
const AppConfig = require('./config.js');
const token = require('./token.js');
/**
 * 查询所有指定学年学期所有的成绩
 * @param {integer} xnm 
 * @param {integer} xqm 
 * @param {function} successCallBack 
 * @param {function} failCallBack 
 */
function getAllGrade(xnm, xqm, username, password, vpnusername, vpnpassword, successCallBack, failCallBack){
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
            'xnm' : xnm,
            'username' : username,
            'password' : password,
            'vpnusername' : vpnusername,
            'vpnpassword' : vpnpassword
        },
        success: successCallBack,
        fail: failCallBack
    });
}
/**
 * 查询指定学年指定学期的课程详细信息
 * @param {integer} xqm 
 * @param {integer} xnm 
 * @param {mixed} classm 
 * @param {function} successCallBack 
 * @param {function} failCallBack 
 */
function getSingleGrade(xqm, xnm, classm, successCallBack, failCallBack){
    let random = token.random(256);
    let timetoken = new Date().getTime();
    let rtoken = token.encrypt(timetoken, random);
    wx.request({
        url: AppConfig.APIAddress + AppConfig.jwSingleGrade + '?token=' + rtoken + "&timetoken=" + timetoken + "&random=" + random,
        method: 'POST',
        header : {
            'content-type' : 'application/x-www-form-urlencoded'
        },
        data : {
            'xqm' : xqm,
            'xnm' : xnm,
            'classm' : classm
        },
        success: successCallBack,
        fail: failCallBack
    });
}
module.exports = {
    'getAllGrade' : getAllGrade,
    'getSingleGrade' : getSingleGrade
}