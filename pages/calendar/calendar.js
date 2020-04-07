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
        let monthdayList = [];
        let DateObj = new Date();
        this.setData({
            'year' : DateObj.getFullYear(),
            'month' : DateObj.getMonth() + 1,
            'weekday' : DateObj.getDay(),
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

    }
})