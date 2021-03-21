// pages/index/index.js
const App = getApp();
const AppConfig = require('/../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前的页面
    currentDots : 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(App.globalData.notice.id.length) {
      // 有通知
      let noticeId = "";
      if(AppConfig.has('noticeId')) {
        noticeId = AppConfig.get('noticeId');
      }
      if(noticeId != App.globalData.notice.id) {
        // 新的通知，或者未阅读过的通知
        this.setData({
          'showMask' : true,
          'alertContent' : App.globalData.notice.content
        });
        wx.setStorage({
          data: App.globalData.notice.id,
          key: 'noticeId',
        });
      }
    }
    // 修改本页面顶栏颜色
    App.setNavigatorColor();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      swiperData : App.indexSwiperData
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      'currentDots' : this.data.currentDots
    });

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
   * 轮播图滑块变化
   */
  changeDots : function(e){
    this.setData({
      'currentDots' : e.detail.current + 1
    });
  },
  /**
   * 页面切换
   */
  changePage : function(e) {
    let src = e.target.dataset.src || e.currentTarget.dataset.src || false;
    if(src === false) {
      wx.showToast({
        title: '开发中',
        icon: 'none',
        duration: 400
      })
      return;
    }
    wx.navigateTo({
      url: src,
      success : function(e) {
        console.log(e.errMsg);
      },
      fail: function(e) {
        console.log(e.errMsg);
      }
    });
  },
  /**
   * 首页轮播图点击事件处理
   */
  swiperClick : function(e) {
    let id = e.target.dataset.id;
    let type = e.target.dataset.type;

    if(type === 'src') {
      let src = App.indexSwiperData[id].dataset.src;
      if(src == undefined) {
        wx.showToast({
          title: '开发中',
          icon: 'none',
          duration: 600
        });
      }
      else {
        wx.navigateTo({
          url: src
        });
      }
    }
    else if(type === 'alert') {
      let alertContent = App.indexSwiperData[id].dataset.alertcontent;
      this.setData({
        'showMask' : true,
        'alertContent' : alertContent
      });
    }
  },
  /**
   * 隐藏蒙版
   */
  hideMask : function(e) {
    if(e.target.id != 'mask') return;
    this.setData({
      'showMask' : false
    });
  }
})
