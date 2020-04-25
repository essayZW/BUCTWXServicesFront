/**
 * 保存一个待办信息到某一天
 * @param {integer} year 
 * @param {integer} month 
 * @param {integer} day 
 * @param {integer} data 
 */

function add(year, month, day, data) {
    const file = require('./config.js');
    let hadTodoList = file.read(wx.env.USER_DATA_PATH + '/todo.json');
    if(!hadTodoList[year]) {
        hadTodoList[year] = {};
    }
    if(!hadTodoList[year][month]) {
        hadTodoList[year][month] = {};
    }
    if(!hadTodoList[year][month][day]) {
        hadTodoList[year][month][day] = [];
    }
    hadTodoList[year][month][day] = hadTodoList[year][month][day].concat([data]);
    // 对其排序
    hadTodoList[year][month][day].sort((a, b) => {
        if(a.finish != b.finish) return a.finish < b.finish;
        if(a.sTime == b.sTime) return a.eTime < b.eTime;
        return a.sTime < b.sTime;
    });
    for(let i = 0; i < hadTodoList[year][month][day].length; i ++) {
        hadTodoList[year][month][day][i].id = i;
    }
    return file.write(wx.env.USER_DATA_PATH + '/todo.json', hadTodoList);
}

module.exports = {
    'add' : add
}