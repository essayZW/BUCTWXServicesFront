// pages/noticesettings/noticesettings.js
const App = getApp();
const AppConfig = require('/../../utils/config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectDay : {
            todo : App.globalData.config.notice.todo,
            exam : App.globalData.config.notice.exam
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
        let dayRange = [];
        for(let i = 0; i <= 14; i ++) {
            dayRange[i] = i;
        };
        this.data.selectDay = App.globalData.config.notice;
        this.setData({
            todoDay : this.data.selectDay.todo,
            examDay : this.data.selectDay.exam,
            dayRange : dayRange
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
     * 保存设置
     */
    saveSettings : function() {
        App.globalData.config.notice.todo = parseInt(this.data.selectDay['todo']);
        App.globalData.config.notice.exam = parseInt(this.data.selectDay['exam']);
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
    },
    /**
     * 选择数字
     */
    setDay : function(e) {
        this.data.selectDay[e.target.id] = e.detail.value;
        this.setData({
            todoDay : this.data.selectDay.todo,
            examDay : this.data.selectDay.exam
        });
    }
})