// pages/calendar/calendar.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        'weekdayChinese' : ['日', '一', '二', '三', '四', '五', '六'],
        'currentShowYear' : new Date().getFullYear(),
        'currentShowMonth' : new Date().getMonth(),
        'currentShowDay' : new Date().getDate()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        let calendar = this.createCalendar(jumpYear, jumpMonth, jumpDay);
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
        this.setData({
            'monthdayList' : calendar,
            'year' : jumpYear,
            'month' : jumpMonth + 1,
            'day' : jumpDay,
            'weekday' : showWeekDay,
            'isCurrentDay' : isCurrentDay
        });
        // 更新本地变量
        this.data.currentShowMonth = jumpMonth;
        this.data.currentShowYear = jumpYear;
        this.data.currentShowDay = jumpDay;
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
                'shortInfo' : '放假',
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
                'shortInfo' : '放假中',
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
                'shortInfo' : '放假',
                'inThisMonth' : false,
                'currentDayBool' : i - firstWeekday + 1 == switchDay,
                'month' : (month + 1) % 12,
                'year' : month + 1 > 11 ? year + 1 : year
            }
        }
        return calendarRes;
    }
})