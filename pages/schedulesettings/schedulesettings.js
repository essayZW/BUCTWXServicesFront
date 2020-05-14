// pages/schedulesettings/schedulesettings.js
const App = getApp();
const AppConfig = require('/../../utils/config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectDay : {
            startDay : App.globalData.config.schedule.startDay
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 修改本页面顶栏颜色
        App.setNavigatorColor();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let today = AppConfig.getWeekFirstDay(new Date());
        let weekNum = (today - new Date(App.globalData.config.schedule.startDay).getTime()) / (86400000 * 7) + 1;
        this.setData({
            'today' : this.getFormatDate(new Date()),
            'startDay' : this.getFormatDate(new Date(App.globalData.config.schedule.startDay)),
            'weekNum' : parseInt(weekNum)
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
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
     * 得到YYYY-MM-DD格式时间
     */
    getFormatDate : function(dateObj) {
        let year = dateObj.getFullYear().toString();
        let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        let day = dateObj.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day;
    },
    /**
     * 设置日期
     */
    setDay : function(e) {
        let time = this.transFormatDate(e.detail.value);
        let dateObj = new Date(time[1], time[2] - 1, time[3]);
        if(dateObj.getDay() != 1) {
            wx.showToast({
              title: '所选日期不是星期一，自动调整到星期一',
              icon : 'none',
              duration: 600
            });
            time = AppConfig.getWeekFirstDay(dateObj);
            dateObj = new Date(time);
        }
        this.data.selectDay.startDay = dateObj.getTime();
        let today = AppConfig.getWeekFirstDay(new Date());
        let weekNum = parseInt((today - dateObj.getTime()) / (86400000 * 7) + 1);
        this.setData({
            startDay : this.getFormatDate(dateObj),
            weekNum : weekNum
        });
    },
    /**
     * 从YYYY-MM-DD 格式中得到年月日
     */
    transFormatDate : function(str) {
        let pattern = /^(\d+?)\-(\d+?)\-(\d+?)$/;
        return str.match(pattern);
    },
    /**
     * 保存设置
     */
    saveSettings : function() {
        App.globalData.config.schedule.startDay = this.data.selectDay.startDay;
        wx.setStorage({
          data: App.globalData.config,
          key: 'settings',
          success: function() {
            wx.showToast({
              title: '成功',
              duration: 600
            });

            setTimeout(() => {
                wx.navigateBack();
            }, 620);
          },
          fail: function() {
              wx.showToast({
                title: '保存失败',
                duration: 700,
                image : '/images/icon/error.png'
              });
          }
        });
    }
})