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

/**
 * 读取某个JSON文件并转化为对象返回
 */
function readJSONFile(filename) {
    let flag;
    try {
        wx.getFileSystemManager().accessSync(filename);
        flag = true;
    } catch (error) {
        console.log(filename + ' don\'t exists');
        flag = false;
    }
    if(!flag) return {};
    let res = wx.getFileSystemManager().readFileSync(filename, 'utf-8');
    return JSON.parse(res);
}
/**
 * 覆盖写入JSON文件
 */
function writeJSONFile(filename, obj) {
    let flag;
    try{
        wx.getFileSystemManager().writeFileSync(filename, JSON.stringify(obj), 'utf8');
        flag = true;
    }
    catch(e) {
        flag = false;
    }
    return flag;
}
module.exports = {
    /**
     * 配置项
     */
    'APIAddress' : 'https://www.imessay.cn:8848',
    /**
     * 教务API配置
     */
    
    //  查询所有成绩API接口
    'jwAllGrade'    : '/jw/getAllGrade',
    // 查询单个成绩API接口
    'jwSingleGrade' : '/jw/getSingleGrade',
    // 查询考试信息API接口
    'jwExam'        : '/jw/getExamInfo',
    /**
     *  反馈界面的一些配置
     */

    //  反馈内容添加接口
    'feedBackAPI' : '/feedBack/add',
    //  最大的反馈内容长度
    'maxFeedBackContentLength' : 400,
    /**
     * 函数
     */
    'get' : get,
    'has' : has,
    'read' : readJSONFile,
    'write' : writeJSONFile
}