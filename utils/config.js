/**
 * 得到保存在本地的信息
 */
function get(name) {
  var returndata;
  try {
    returndata = wx.getStorageSync(name);
  } catch (e) {
    returndata = null;
    console.error(e);
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
// 以缓存存储的文件的前缀
const fileprefix = '__file_';
/**
 * 缓存文件是否存在
 * @param string filename
 */
function fileHas(filename) {
  return has(fileprefix + filename);
}
/**
 * 读取文件缓存
 */
function readJSONFile(filename) {
  let res = get(fileprefix + filename);
  if (res == null || res == '') res = {};
  return res;
}
/**
 * 覆盖写入JSON文件
 */
function writeJSONFile(filename, obj) {
  let flag = true;
  try {
    wx.setStorageSync(fileprefix + filename, obj);
  }
  catch (error) {
    flag = false;
    console.error(error);
  }
  return flag;
}

module.exports = {
  /**
   * 配置项
   */
  'APIAddress': 'https://imessay.cn:8848',
  /**
   * 教务API配置
   */

  //  查询所有成绩API接口
  'jwAllGrade': '/jw/getAllGrade',
  // 查询单个成绩API接口
  'jwSingleGrade': '/jw/getSingleGrade',
  // 查询考试信息API接口
  'jwExam': '/jw/getExamInfo',
  // 查询学生信息接口
  'jwStuInfo': '/jw/getStuInfo',
  // 查询课程表接口
  'jwSchedule': '/jw/getSchedule',

  /**
   * 设置API配置
   */
  'swiperData': '/swiper/getAll',

  /**
   *  反馈界面的一些配置
   */

  //  反馈内容添加接口
  'feedBackAPI': '/feedBack/add',
  //  最大的反馈内容长度
  'maxFeedBackContentLength': 400,
  /**
   * App配置
   */

  // 默认背景色
  'defaultBackgroundColor': '#ffd21e',
  // 默认前景色
  'defaultFrontColor': '#ffffff',
  // 默认颜色ID
  'defaultColorId': 2,
  // 默认头像地址
  'defaultHeadUrl': '/images/test1.jpg',

  /**
   * 功能默认配置
   */
  'funconfig': {
    'notice': {
      // 通知界面的默认设置
      // 待办事件默认1天前通知
      'todo': 1,
      // 考试信息默认7天谴通知
      'exam': 7
    },
    'schedule': {
      // 课程表功能的相关设置
      // 本学期第一周第一天的时间戳
      'startDay': getWeekFirstDay(new Date()),
      // 学年
      'xnm': 0,
      // 学期
      'xqm': 1
    },
    'calendar': {
      // 日历界面的相关设置
      // 是否启用
      'activate': false
    }
  },

  /**
   * 函数
   */
  'get': get,
  'has': has,
  'read': readJSONFile,
  'write': writeJSONFile,
  'getWeekFirstDay': getWeekFirstDay,
  'fileHas': fileHas
}

function getWeekFirstDay(dateObj) {
  let today = dateObj.getTime();
  let day = dateObj.getDay();
  if (day == 0) day = 7;
  today -= (Math.abs(day - 1) * 86400000);
  return today;
}
