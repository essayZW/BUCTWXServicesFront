// pages/mine/mine.js
const App = getApp();
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
    // 修改本页面顶栏颜色
    App.setNavigatorColor();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      'headImg' : App.globalData.headUrl
    })
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
   * wechat信息绑定
   */
  getWechatInfo : function() {
    wx.authorize({
      scope: 'scope.userInfo',
      success: () => {
        // 已经授权
        wx.getUserInfo({
          success: (res) => {
            wx.showToast({
              title: '成功',
              duration: 600
            });
            // 更新变量值
            App.globalData.headUrl =  res.userInfo.avatarUrl;
            // 更新当前页面
            this.onReady();
            wx.setStorage({
              data: App.globalData.headUrl,
              key: 'userheadInfo',
            });
          },
          fail: (res) => {
            wx.showToast({
              title: '失败',
              image: '/images/icon/error.png',
              duration: 700
            });
          }
        });
      },
      fail: () => {
        // 没有授权
        wx.showToast({
          title: '没有权限',
          image: '/images/icon/error.png',
          duration: 700
        })
      }
    });
  },
  /**
   * 显示分享界面
   */
  share : function() {
    this.setData({
      'showShare' : true
    });
  },
  /**
   * 隐藏分享
   */
  hideShare : function() {
    this.setData({
      'showShare' : false
    });
  }
})