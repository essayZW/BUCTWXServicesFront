// pages/calendar/calendar.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        let weekdatList = ['日', '一', '二', '三', '四', '五', '六'];
        let DateObj = new Date();
        let monthdayList = this.createCalendar(DateObj.getFullYear(), DateObj.getMonth());
        this.setData({
            'year' : DateObj.getFullYear(),
            'month' : DateObj.getMonth(),
            'weekday' : weekdatList[DateObj.getDay()],
            'day' : DateObj.getDate(),
            'weekdayList' : weekdatList,
            'monthdayList' : monthdayList
        });
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
     * 生成一个指定年月份的日历表
     */
    createCalendar : function(year, month) {
        // 获得当月的天数
        let dayNum = new Date(year, month + 1, 0).getDate();
        // 获得上个月的天数
        let lastDayNum = new Date(Date.UTC(year, month, 0)).getDate();
        // 获得本月的第一天的星期
        let firstWeekday = new Date(Date.UTC(year, month, 1)).getDay();
        let calendarRes = new Array(35);
        for(let i = firstWeekday; i < dayNum + firstWeekday; i ++) {
            calendarRes[i] = {
                'day' : i - firstWeekday + 1,
                'shortInfo' : '放假',
                'inThisMonth' : true
            };
        }
        for(let i = firstWeekday - 1; i >= 0; i --) {
            calendarRes[i] = {
                'day' : lastDayNum --,
                'shortInfo' : '放假中',
                'inThisMonth' : false
            }
        }
        for(let i = firstWeekday + dayNum; i < 35; i ++) {
            calendarRes[i] = {
                'day' : i - firstWeekday - dayNum + 1,
                'shortInfo' : '放假',
                'inThisMonth' : false
            }
        }
        return calendarRes;
    }
})