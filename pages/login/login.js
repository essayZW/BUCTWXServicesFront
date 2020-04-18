// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputData : {
      'username' : '',
      'password' : '',
      'vpnpassword' : ''
    }
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
   * 保存输入信息
   */
  saveInput : function(e) {
    this.data.inputData[e.target.id] = e.detail.value;
  },
  /**
   * 存储用户密码信息
   */
  userpassSave: function() {
    let savedata = {
      'username': this.data.inputData['username'],
      'password': this.data.inputData['password'],
      'vpnpassword': this.data.inputData['vpnpassword'],
      'vpnusername': this.data.inputData['vpnusername']
    }
    wx.setStorage({
      data: savedata,
      key: 'userpass',
      success: function() {
        wx.showToast({
          title: '成功',
          icon: 'success',
        });
      },
      fail:function() {
        wx.showToast({
          title: '失败',
          image: '/images/icon/error.png'
        })
      }
    });
  }
})