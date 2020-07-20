// 课程表解析等相关API

const scheduleFileName = wx.env.USER_DATA_PATH + '/schedule.json';
const file = require('./config.js')
/**
 * 覆盖写入课程表到文件
 * @param {object}} schedule 
 */
function write(schedule) {
    return file.write(scheduleFileName, schedule);
}

/**
 * 得到已经解析的所有课程表
 */
function read() {
    return file.read(scheduleFileName);
}

/**
 * 解析课程表，参数是教务系统返回的JSON格式课程表
 * @param {object} jwSchedule 
 */
function parse(jwSchedule) {
    let res = {};
    for(let i = 0; i < jwSchedule.length; i ++) {
        // 课程的某种ID，在每学期的课程表中并不唯一
        let cdid = jwSchedule[i]['cd_id'];
        if(res[cdid] == undefined) {
            res[cdid] = {};
        }
        else {
            // 该ID已经存在，所以给ID后面加一个序号
            let i = 0;
            while(res[cdid + i] != undefined) {
                i ++;
            }
            cdid += i;
            res[cdid] = {};
        }
        // 原始数据
        let jwData = {
            // 每天中的哪几节有课
            jcs : jwSchedule[i]['jcs'],
            // 课程名称
            kcmc : jwSchedule[i]['kcmc'],
            // 课程所在的星期
            xqj : jwSchedule[i]['xqj'],
            // 需要上课的周
            zcd : jwSchedule[i]['zcd'],
            // 课程地点
            cdmc : jwSchedule[i]['cdmc'],
            // 老师信息(姓名)
            xm : jwSchedule[i]['xm']
        }
        res[cdid].jwData = jwData;
        // 解析数据
        let classStartEndRange = __getA_BFormat(jwData.jcs);
        // 开始的节数
        res[cdid].startClassNum = parseInt(classStartEndRange[1]);
        // 结束的结束
        res[cdid].endClassNum = parseInt(classStartEndRange[2]);
        // 解析周
        let allWeekList = jwData.zcd.split(',').map((value) => {
            return value.replace('周', '');
            // .replace('(', '').replace(')', '').replace('双', '').replace('单', '');
        });
        res[cdid].week = new Array(20).fill(false);
        for(let j = 0; j < allWeekList.length; j ++) {
            if(allWeekList[j].indexOf('-') > -1) {
                if(allWeekList[j].indexOf('单') > -1) {
                    // 单周声明
                    allWeekList[j] = allWeekList[j].replace('(', '').replace(')', '').replace('单', '');
                    let range = __getA_BFormat(allWeekList[j]);
                    // 这几周都有课
                    range[1] = parseInt(range[1]);
                    range[2] = parseInt(range[2]);
                    for(let start = range[1]; start <= range[2]; start ++) {
                        if(start % 2 == 0) continue;
                        res[cdid].week[start] = true;
                    }
                }
                else if (allWeekList[j].indexOf('双') > -1) {
                    // 有双声明的周
                    allWeekList[j] = allWeekList[j].replace('(', '').replace(')', '').replace('双', '');
                    let range = __getA_BFormat(allWeekList[j]);
                    // 这几周都有课
                    range[1] = parseInt(range[1]);
                    range[2] = parseInt(range[2]);
                    for(let start = range[1]; start <= range[2]; start ++) {
                        if(start % 2 == 1) continue;
                        res[cdid].week[start] = true;
                    }
                }
                else {
                    // a-b周 格式
                    let range = __getA_BFormat(allWeekList[j]);
                    // 这几周都有课
                    range[1] = parseInt(range[1]);
                    range[2] = parseInt(range[2]);
                    for(let start = range[1]; start <= range[2]; start ++) {
                        res[cdid].week[start] = true;
                    }
                }
                
            }
            // 直接是一个数字，这一周有课
            res[cdid].week[parseInt(allWeekList[j])] = true;
        }
        // 解析星期
        // 按照0是星期天处理
        res[cdid].date = parseInt(jwData.xqj) % 7;
        // 解析课程名字
        res[cdid].className = jwData.kcmc;
        // 课程地点
        res[cdid].position = jwData.cdmc;
        // 课程老师名字
        res[cdid].teacherInfo = {
            name : jwData.xm
        }
    }
    return res;
}

/**
 * 得到第weekNum周星期date的所有课程
 * @param {integer} weekNum 
 * @param {integer} date 
 */
function getClassListInDay(weekNum, date) {
    const AllClassList = read();
    return __parseDayClass(AllClassList, weekNum, date);
}

/**
 * 得到第weekNum所有的课
 * @param {integer} weekNum 
 */
function getClassListInWeek(weekNum) {
    const AllClassList = read();
    let res = [];
    for(let i = 1; i <= 7; i ++) {
        res[i] = __parseDayClass(AllClassList, weekNum, i);
    }
    return res;
}

module.exports = {
    'read' : read,
    'write' : write,
    'getWeekDayClass' : getClassListInDay,
    'getWeekClass' : getClassListInWeek,
    'parse' : parse
}

// 以下为私有方法
/**
 * 解析格式如 a-b 的字符串，得到a和b的值
 */
function __getA_BFormat(str) {
    let pattern = /^(\d+?)\-(\d+?)$/
    return str.match(pattern);
}

/**
 * 从课程列表中获取某一周以及某一天的课程
 * @param {object} AllClassList 
 * @param {integer} weekNum 
 * @param {integer} date 
 */
function __parseDayClass(AllClassList, weekNum, date) {
    // 存储今天的课
    let res = {};
    for(let id in AllClassList) {
        // 遍历每一个课程
        if(!AllClassList[id].week[weekNum]) {
            // 该课本周没有课
            continue;
        }
        if(AllClassList[id].date != date) {
            // 本周的这一天也没有该课程
            continue;
        }
        // 将整个信息拷贝过去
        res[id] = AllClassList[id];
    }
    return res;
}
