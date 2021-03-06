// pages/settings/settings.js
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
   * 清楚缓存
   */
  clearCache: function () {
    wx.showModal({
      title: '确认清除',
      content: '您确认清理所有缓存吗，这将重置所有设置、保存的用户名密码等信息',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage({
            complete: (res) => {
              wx.showToast({
                title: '清理完成,请重新打开小程序',
                duration: 700,
                icon: 'none'
              });
              App.reset();
              this.onShow();
            },
          })
        }
      }
    })
  },
  /**
  * 页面切换
  */
  changePage: function (e) {
    let src = e.target.dataset.src || e.currentTarget.dataset.src || false;
    if (src === false) {
      wx.showToast({
        title: '开发中',
        icon: 'none',
        duration: 400
      })
      return;
    }
    wx.navigateTo({
      url: src,
      success: function (e) {
        console.log(e.errMsg);
      },
      fail: function (e) {
        console.log(e.errMsg);
      }
    });
  }
})
