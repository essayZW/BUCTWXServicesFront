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
    // 去重
    // console.log(data);
    for(let i = 0; i < hadTodoList[year][month][day].length; i ++) {
        let now = hadTodoList[year][month][day][i];
        let flag = true;
        // console.log(now);
        for(let key in now) {
            if(['id', 'finish'].indexOf(key) != -1) continue;
            if(now[key] != data[key]) {
                flag = false;
                break;
            }
        }
        if(flag) {
            return false;
        }
    }
    hadTodoList[year][month][day] = hadTodoList[year][month][day].concat([data]);
    // 对其排序
    hadTodoList[year][month][day] = sortTodo(hadTodoList[year][month][day]);
    return file.write(wx.env.USER_DATA_PATH + '/todo.json', hadTodoList);
}

/**
 * 删除一个待办事件
 * @param {integer} year 
 * @param {integer} month 
 * @param {integer} day 
 * @param {integer} id 
 */
function del(year, month, day, id) {
    const file = require('./config.js');
    let hadTodoList = file.read(wx.env.USER_DATA_PATH + '/todo.json');
    if(!hadTodoList[year]) {
        return false;
    }
    if(!hadTodoList[year][month]) {
        return false;
    }
    if(!hadTodoList[year][month][day] || hadTodoList[year][month][day].length < id + 1) {
        return false;
    }
    hadTodoList[year][month][day].splice(id, 1);
    // 对其排序
    hadTodoList[year][month][day] = sortTodo(hadTodoList[year][month][day]);
    return file.write(wx.env.USER_DATA_PATH + '/todo.json', hadTodoList);
}

function changeTodo(year, month, day, id, data) {
    const file = require('./config.js');
    let hadTodoList = file.read(wx.env.USER_DATA_PATH + '/todo.json');
    if(!hadTodoList[year]) {
        return false;
    }
    if(!hadTodoList[year][month]) {
        return false;
    }
    if(!hadTodoList[year][month][day] || hadTodoList[year][month][day].length < id + 1) {
        return false;
    }
    for(let key in data) {
        hadTodoList[year][month][day][id][key] = data[key];
    }
    hadTodoList[year][month][day] = sortTodo(hadTodoList[year][month][day]);
    return file.write(wx.env.USER_DATA_PATH + '/todo.json', hadTodoList);
}

module.exports = {
    'add' : add,
    'del' : del,
    'change' : changeTodo
}

function sortTodo(todo) {
    // 对其排序
    todo.sort((a, b) => {
        if(a.finish != b.finish) return a.finish - b.finish;
        if(a.sTime == b.sTime) return a.eTime - b.eTime;
        return a.sTime - b.sTime;
    });
    for(let i = 0; i < todo.length; i ++) {
        todo[i].id = i;
    }
    return todo;
}