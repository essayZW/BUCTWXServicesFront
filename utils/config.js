/**
 * 得到保存在本地的信息
 */
function get(name) {
    var returndata;
    try {
        returndata = wx.getStorageSync(name);
    } catch (e) {
        returndata = false;
        console.log(e);
    }
    return returndata;
}

/**
 * 是否存在某缓存key
 */
function has(name) {
    let data;
    try {
        data = wx.getStorageSync(name);
    } catch (error) {
        console.log(error);
        data = false;
    }
    return data ? true : false;
}
module.exports = {
    /**
     * 配置项
     */
    'APIAddress' : 'https://www.imessay.cn:8848',
    /**
     * 教务API配置
     */
    'jwAllGrade'    : '/jw/getAllGrade',
    'jwSingleGrade' : '/jw/getSingleGrade',
    /**
     * 函数
     */
    'get' : get,
    'has' : has
}