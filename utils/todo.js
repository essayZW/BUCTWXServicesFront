const TodoListJSONFileName = wx.env.USER_DATA_PATH + '/todo.json';
/**
 * 保存一个待办信息到某一天
 * @param {integer} year 
 * @param {integer} month 
 * @param {integer} day 
 * @param {integer} data 
 */

function add(year, month, day, data) {
    const file = require('./config.js');
    let hadTodoList = file.read(TodoListJSONFileName);
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
    return file.write(TodoListJSONFileName, hadTodoList);
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
    let hadTodoList = file.read(TodoListJSONFileName);
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
    return file.write(TodoListJSONFileName, hadTodoList);
}
/**
 * 修改指定待办的信息
 * @param {integer} year 
 * @param {integer} month 
 * @param {integer} day 
 * @param {integer} id 
 * @param {object} data 
 */
function changeTodo(year, month, day, id, data) {
    const file = require('./config.js');
    let hadTodoList = file.read(TodoListJSONFileName);
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
    return file.write(TodoListJSONFileName, hadTodoList);
}

/**
 * 得到某一天的所有待办信息
 * @param {integer} year 
 * @param {integer} month 
 * @param {integer} day 
 */
function getTodo(year, month, day) {
    // 得到指定的待办
    const file = require('./config.js');
    let hadTodoList = file.read(TodoListJSONFileName);
    if(!hadTodoList[year]) {
        return [];
    }
    if(!hadTodoList[year][month]) {
        return [];
    }
    if(!hadTodoList[year][month][day]) {
        return [];
    }
    return hadTodoList[year][month][day];
}

function getRangeTodo(fromYear, fromMonth, fromDay, toYear, toMonth, toDay, todoType = 'all') {
    if(fromYear > toYear) return [];
    if(fromYear == toYear && fromMonth > toMonth) return [];
    if(fromYear == toYear && fromMonth == toMonth && fromDay > toDay) return [];
    if(typeof(todoType) == typeof('')) {
        todoType = [todoType];
    }
    let res = [];
    const file = require('./config.js');
    let allTodoList = file.read(TodoListJSONFileName);
    for(let year = fromYear; year <= toYear; year ++) {
        if(!allTodoList[year]) continue;
        for(let month = fromMonth; month < toMonth; month ++) {
            if(!allTodoList[year][month]) continue;
            for(let day = fromDay; day <= toDay; day ++) {
                if(!allTodoList[year][month][day]) continue;
                // 便利该天的所有待办
                for(let i = 0; i < allTodoList[year][month][day].length; i ++) {
                    if(todoType.indexOf(allTodoList[year][month][day][i].type) == -1 && todoType.indexOf('all') == -1) {
                        continue;
                    }
                    res.push(allTodoList[year][month][day][i]);
                }
            }
        }
    }
    return res;
}
//  导出函数
module.exports = {
    'add' : add,
    'del' : del,
    'change' : changeTodo,
    'get' : getTodo,
    'range' : getRangeTodo,
    'filename' : TodoListJSONFileName
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