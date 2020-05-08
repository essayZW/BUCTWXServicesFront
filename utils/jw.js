/**
 * 关于教务方面的API调用函数
 */
const AppConfig = require('./config.js');
const token = require('./token.js');
/**
 * 查询所有指定学年学期所有的成绩
 * @param {integer} xnm 
 * @param {integer} xqm 
 * @param {string} username
 * @param {string} password
 * @param {string} vpnusername
 * @param {string} vpnpassword
 * @param {function} successCallBack 
 * @param {function} failCallBack 
 */
function getAllGrade(xnm, xqm, username, password, vpnusername, vpnpassword, successCallBack, failCallBack){
    token.request(
        AppConfig.APIAddress + AppConfig.jwAllGrade,
        'POST',
        {
            'xqm' : xqm,
            'xnm' : xnm,
            'username' : username,
            'password' : password,
            'vpnusername' : vpnusername,
            'vpnpassword' : vpnpassword
        },
        successCallBack,
        failCallBack,
        {
            'content-type' : 'application/x-www-form-urlencoded'
        },
    );
}
/**
 * 查询指定学年指定学期的课程详细信息
 * @param {integer} xnm 
 * @param {integer} xqm 
 * @param {mixed} classm 
 * @param {string} username
 * @param {string} password
 * @param {string} vpnusername
 * @param {string} vpnpassword
 * @param {function} successCallBack 
 * @param {function} failCallBack 
 */
function getSingleGrade(xnm, xqm, classm, username, password, vpnusername, vpnpassword, successCallBack, failCallBack){
    let random = token.random(256);
    let timetoken = new Date().getTime();
    let rtoken = token.encrypt(timetoken, random);
    token.request(
        AppConfig.APIAddress + AppConfig.jwSingleGrade,
        'POST',
        {
            'xqm' : xqm,
            'xnm' : xnm,
            'classm' : classm,
            'username' : username,
            'password' : password,
            'vpnusername' : vpnusername,
            'vpnpassword' : vpnpassword
        },
        successCallBack,
        failCallBack,
        {
            'content-type' : 'application/x-www-form-urlencoded'
        }
    );
}
/**
 * 得到指定学年学期的考试信息
 * @param {integer} xnm 
 * @param {integer} xqm 
 * @param {string} username 
 * @param {string} password 
 * @param {string} vpnusername 
 * @param {string} vpnpassword 
 * @param {function} successCallBack 
 * @param {function} failCallBack 
 */
function getExamList(xnm, xqm, username, password, vpnusername, vpnpassword,successCallBack, failCallBack) {
    token.request(
        AppConfig.APIAddress + AppConfig.jwExam,
        'POST',
        {
            'xqm' : xqm,
            'xnm' : xnm,
            'username' : username,
            'password' : password,
            'vpnusername' : vpnusername,
            'vpnpassword' : vpnpassword
        },
        successCallBack,
        failCallBack,
        {
            'content-type' : 'application/x-www-form-urlencoded'
        }
    );
}
module.exports = {
    'getAllGrade' : getAllGrade,
    'getSingleGrade' : getSingleGrade,
    'getExamList' : getExamList
}