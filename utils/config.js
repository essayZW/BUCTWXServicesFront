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
    'jwAllGrade'    : '/jw/getAllGrade',
    'jwSingleGrade' : '/jw/getSingleGrade',
    /**
     * 函数
     */
    'get' : get,
    'has' : has,
    'read' : readJSONFile,
    'write' : writeJSONFile
}