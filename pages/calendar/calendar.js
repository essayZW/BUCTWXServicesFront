// pages/calendar/calendar.js
const App = getApp();
const AppConfig = require('/../../utils/config.js');
const todoManage = require('/../../utils/todo.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        'weekdayChinese' : ['日', '一', '二', '三', '四', '五', '六'],
        'currentShowYear' : new Date().getFullYear(),
        'currentShowMonth' : new Date().getMonth(),
        'currentShowDay' : new Date().getDate(),
        'currentShowCalendar' : null,
        'currentTodoList' : null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 修改本页面顶栏颜色
        App.setNavigatorColor();
        // 实例化触摸类
        let touchObj = require('/../../utils/touch.js');
        touchObj = new touchObj(this.lastMonth, this.nextMonth)
        this.touchStart = function(e) {
            touchObj.start(e);
        }
        this.touchMove = function(e) {
            touchObj.move(e);
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let DateObj = new Date();
        this.changeDay(DateObj.getFullYear(), DateObj.getMonth(), DateObj.getDate());
        // 设置该页面主题色
        App.setPageColor(this);
        // 修改本页面顶栏颜色
        App.setNavigatorColor();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 回到今天按钮
     */
    goBackToday : function() {
        let DateObj = new Date();
        this.changeDay(DateObj.getFullYear(), DateObj.getMonth(), DateObj.getDate());
    },
    /**
     * 切换下一个月
     */
    nextMonth : function() {
        let newDay = 1;
        let newMonth = this.data.currentShowMonth - 1;
        let newYear = this.data.currentShowYear;
        if(newMonth < 0) {
            newMonth = 11;
            newYear --;
        }
        this.changeDay(newYear, newMonth, newDay);
    },
    /**
     * 切换上一个月
     */
    lastMonth : function() {
        let newDay = 1;
        let newMonth = (this.data.currentShowMonth + 1) % 12;
        let newYear = this.data.currentShowYear + (newMonth == 0 ? 1 : 0);
        this.changeDay(newYear, newMonth, newDay);
    },
    clickChangeDay : function(event) {
        let jumpYear = event.currentTarget.dataset.year;
        let jumpMonth = event.currentTarget.dataset.month;
        let jumpDay = event.currentTarget.dataset.day;
        this.changeDay(jumpYear, jumpMonth, jumpDay);
    },
    changeDay : function(jumpYear, jumpMonth, jumpDay) {
        let calendar;
        if(this.data.currentShowYear == jumpYear && this.data.currentShowMonth == jumpMonth && this.data.currentShowCalendar) {
            // 在当月不重新绘制日历
            calendar = this.data.currentShowCalendar;
            for(let i = 0; i < calendar.length; i ++) {
                calendar[i].currentDayBool = false;
                if(calendar[i].year == jumpYear && calendar[i].month == jumpMonth && calendar[i].day == jumpDay) {
                    calendar[i].currentDayBool = true;
                }
            }
            calendar = this.getShortInfo(calendar);
        }
        else {
            calendar = this.createCalendar(jumpYear, jumpMonth, jumpDay);
        }
        // 获取今天
        let DateObj = new Date();
        let showWeekDay;
        let isCurrentDay = false;
        if(jumpYear == DateObj.getFullYear() &&
           jumpMonth == DateObj.getMonth() &&
           jumpDay == DateObj.getDate()) {

            showWeekDay = '周' + this.data.weekdayChinese[DateObj.getDay()]
            isCurrentDay = true;
        }
        else {
            let jumpdayObj = new Date(jumpYear, jumpMonth, jumpDay);
            let todayObj = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            let days = (todayObj.getTime() - jumpdayObj.getTime()) / (1000 * 3600 * 24);
            showWeekDay = Math.abs(days) + '天' + (days > 0 ? '前' : '后');
            // 设置回到今天按钮
            isCurrentDay = false;
        }
        // 提取待办列表
        let todoList = this.getTodoList(jumpYear, jumpMonth, jumpDay);
        this.setData({
            'monthdayList' : calendar,
            'year' : jumpYear,
            'month' : jumpMonth + 1,
            'day' : jumpDay,
            'weekday' : showWeekDay,
            'isCurrentDay' : isCurrentDay,
            'weekdayList' : this.data.weekdayChinese,
            'todoList' : todoList
        });
        // 更新本地变量
        this.data.currentShowMonth = jumpMonth;
        this.data.currentShowYear = jumpYear;
        this.data.currentShowDay = jumpDay;
        this.data.currentShowCalendar = calendar;
        this.data.currentTodoList = todoList;
    },
    /**
     * 生成一个指定年月份的日历表
     */
    createCalendar : function(year, month, switchDay) {
        // 获得当月的天数
        let dayNum = new Date(year, month + 1, 0).getDate();
        // 获得上个月的天数
        let lastDayNum = new Date(Date.UTC(year, month, 0)).getDate();
        // 获得本月的第一天的星期
        let firstWeekday = new Date(Date.UTC(year, month, 1)).getDay();
        let calendarRes = new Array(35);
        // 渲染本月
        for(let i = firstWeekday; i < dayNum + firstWeekday; i ++) {
            calendarRes[i] = {
                'day' : i - firstWeekday + 1,
                'shortInfo' : '',
                'inThisMonth' : true,
                'currentDayBool' : i - firstWeekday + 1 == switchDay,
                'month' : month,
                'year' : year
            };
        }
        // 渲染上个月末尾
        for(let i = firstWeekday - 1; i >= 0; i --) {
            calendarRes[i] = {
                'day' : lastDayNum --,
                'shortInfo' : '',
                'inThisMonth' : false,
                'currentDayBool' : i - firstWeekday + 1 == switchDay,
                'month' : month - 1 < 0 ? 11 : month - 1,
                'year' : month - 1 < 0 ? year - 1 : year
            }
        }
        // 渲染下个月
        let endDay = Math.ceil((firstWeekday + dayNum) / 7) * 7;
        for(let i = firstWeekday + dayNum; i < endDay; i ++) {
            calendarRes[i] = {
                'day' : i - firstWeekday - dayNum + 1,
                'shortInfo' : '',
                'inThisMonth' : false,
                'currentDayBool' : i - firstWeekday + 1 == switchDay,
                'month' : (month + 1) % 12,
                'year' : month + 1 > 11 ? year + 1 : year
            }
        }
        // 给每一天加一个ID
        for(let i = 0; i < calendarRes.length; i ++) {
            calendarRes[i].id = i;
        }
        // 对calendar附加shortInfo
        calendarRes = this.getShortInfo(calendarRes);
        return calendarRes;
    },
    /**
     * 为日历中的每一天设置其当天日程
     */
    getTodoList : function(year, month, day) {
        let todoList = AppConfig.read(wx.env.USER_DATA_PATH + '/todo.json');
        if(todoList === {}) return [];
        if(todoList[year] && todoList[year][month] && todoList[year][month][day]) {
            return todoList[year][month][day];
        }
        return [];
    },
    /**
     * 得到每天的 shortInfo
     */
    getShortInfo : function(calendar) {
        let todoList = AppConfig.read(wx.env.USER_DATA_PATH + '/todo.json');
        if(todoList === {}) return calendar;
        for(let i = 0; i < calendar.length; i ++) {
            let year = calendar[i]['year'];
            let month = calendar[i]['month'];
            let day = calendar[i]['day'];
            if(todoList[year] && todoList[year][month] && todoList[year][month][day]) {
                calendar[i]['shortInfo'] = '';
                for(let j = 0; j < todoList[year][month][day].length; j ++) {
                    if(todoList[year][month][day][j].finish) continue;
                    calendar[i]['shortInfo'] = todoList[year][month][day][j].shortInfo;
                    break;
                }
            }
        }
        return calendar;
    },
    /**
     * 展示待办事件的详细信息
     */
    showDetail : function(e) {
        let title = e.currentTarget.dataset.title;
        let startTime = e.currentTarget.dataset.starttime;
        let endTime = e.currentTarget.dataset.endtime;
        let position = e.currentTarget.dataset.position;
        let content = e.currentTarget.dataset.content;
        let id = e.currentTarget.dataset.id;
        this.setData({
            'showDetail' : true,
            'detail' : {
                'title' : title,
                'startTime' : startTime,
                'endTime' : endTime,
                'position' : position,
                'content' : content,
                'id' : id
            }
        });
    },
    /**
     * 完成某个代办事件
     */
    finishTodo : function(e) {
        if(e.currentTarget.dataset.finish === true) {
            return;
        }
        let id = e.currentTarget.dataset.id;
        if(todoManage.finish(this.data.currentShowYear, this.data.currentShowMonth, this.data.currentShowDay, id)) {
            this.changeDay(this.data.currentShowYear, this.data.currentShowMonth, this.data.currentShowDay);
        }
        else {
            wx.showToast({
                title: '失败',
                image: '/images/icon/error.png'
            });
        }
    },
    /**
     * 隐藏细节展示区域
     */
    hideMask : function(e) {
        if(e.target.id !== 'mask') return;
        let type = e.target.dataset.type;
        if(type == 'add') {
            this.setData({
                'showAdd' : false
            });
            return;
        }
        this.setData({
            'showDetail' : false
        });
    },
    /**
     * 删除一个待办事件
     */
    deleteTodo : function(e) {
        wx.showModal({
            title: '确认',
            content : '确认是否删除这条待办',
            success: (res) => {
                if(!res.confirm) return;
                let id = e.target.dataset.id;
                if(todoManage.del(this.data.currentShowYear, this.data.currentShowMonth, this.data.currentShowDay, id)) {
                    wx.showToast({
                        title: '成功',
                    });
                    wx.showToast({
                        title: '成功',
                    });
                    this.hideMask({
                        target : {
                            id : 'mask',
                            dataset : {
                                type : 'detail'
                            }
                        }
                    });
                    this.changeDay(this.data.currentShowYear, this.data.currentShowMonth, this.data.currentShowDay);
                }
                else {
                    wx.showToast({
                        title: '失败',
                        image: '/images/icon/error.png'
                    });
                }
            }
        })
        
    },
    /**
     * 添加一个代办事件
     */
    addTodo : function() {
        let title = this.addTodoInput.title;
        let position = this.addTodoInput.position;
        if(position.length == 0) position = '无';
        let content = this.addTodoInput.content;
        if(content.length == 0) content = '无';
        let startTime = this.timeData.timePickerNowTime[0];
        let endTime = this.timeData.timePickerNowTime[1];
        let startTimeObj = new Date(this.data.currentShowYear, this.data.currentShowMonth, this.data.currentShowDay, startTime.substr(0, 2), startTime.substr(3, 2));
        let endTimeObj = new Date(this.data.currentShowYear, this.data.currentShowMonth, this.data.currentShowDay, endTime.substr(0, 2) == '00' ? 24 : parseInt(endTime.substr(0, 2)), parseInt(endTime.substr(3, 2)));
        // 判断事件是否符合规则，以及填入的表单是否符合规则
        if(startTimeObj.getTime() > endTimeObj.getTime() || !title.length || content.length > 100 || title.length > 10) {
            wx.showToast({
              title: title.length == 0 ? '标题不能空' : '失败',
              image : '/images/icon/error.png'
            });
            return;
        }
        let data = {
            'title' : title,
            'startTime' : startTime,
            'endTime' : endTime,
            'position' : position,
            'content' : content,
            'finish' : false,
            'shortInfo' : title.substr(0, 3),
            'sTime' : startTimeObj.getTime(),
            'eTime' : endTimeObj.getTime()
        };
        if(todoManage.add(this.data.currentShowYear, this.data.currentShowMonth, this.data.currentShowDay, data)){
            wx.showToast({
              title: '成功',
            });
            this.hideMask({
                target : {
                    id : 'mask',
                    dataset : {
                        type : 'add'
                    }
                }
            });
            for(let key in this.addTodoInput) {
                this.addTodoInput[key] = '';
            }
            this.changeDay(this.data.currentShowYear, this.data.currentShowMonth, this.data.currentShowDay);
        }
        else {
            wx.showToast({
              title: '失败',
              image: '/images/icon/error.png'
            });
        }
    },
    /**
     * 存储关于添加待办的变量
     */
    timeData : {
        timePickerNowTime : []
    },
    addTodoInput : {
        title : '',
        content : '',
        position : ''
    },
    /**
     * 展示待办添加区域
     */
    showAddArea : function() {
        let nowHover = new Date().getHours();
        let nowMinute = new Date().getMinutes();
        let endHover = (nowHover == 23 ? 0 : nowHover + 1).toString().padStart(2, '0');
        let endMinute = (nowHover == 23 ? 0 : nowMinute).toString().padStart(2, '0');
        nowHover = nowHover.toString().padStart(2, '0');
        nowMinute = nowMinute.toString().padStart(2, '0');
        let timePicker = [
            nowHover + ':' + nowMinute,
            endHover + ':' + endMinute
        ]
        this.setData({
            'showAdd' : true,
            'timePickerNowTime' : timePicker
        });
        // 更新变量
        this.timeData.timePickerNowTime = timePicker;
    },
    /**
     * 选择时间的改变
     */
    timeChange : function(e){
        let index = e.target.dataset.index;
        this.timeData.timePickerNowTime[index] = e.detail.value;
        this.setData({
            'timePickerNowTime' : this.timeData.timePickerNowTime
        });
    },
    /**
     * 保存输入表单的值
     */
    saveInput: function(e) {
        this.addTodoInput[e.target.id] = e.detail.value;
    }
})