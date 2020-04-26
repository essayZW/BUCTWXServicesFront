// pages/login/login.js
const App = getApp();
const AppConfig= require('/../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputData : {
      'username' : '',
      'password' : '',
      'vpnpassword' : ''
    },
    focusList : {
      'username' : false,
      'password' : false,
      'vpnpassword' : false
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    if(AppConfig.has('userpass')) {
      let userpass = AppConfig.get('userpass');
      for(let key in this.data.focusList) {
        this.data.focusList[key] = true;
      }
      for(let key in this.data.inputData) {
        this.data.inputData[key] = userpass[key];
      }
      this.setData({
        'storageData' : userpass,
        'active' : this.data.focusList
      })
    }

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
    if(!this.data.inputData['username'] || !this.data.inputData['password'] || !this.data.inputData['vpnpassword']) {
      wx.showToast({
        title: '失败',
        image: '/images/icon/error.png'
      });
      return;
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
  },
  /**
   * 输入框获得焦点
   */
  getFocus : function(e) {
    this.data.focusList[e.target.id] = true;
    this.setData({
      'active' : this.data.focusList
    })
  },
  /**
   * 输入框失去焦点
   */
  lostFocus: function(e) {
    if(e.detail.value.length) return;
    this.data.focusList[e.target.id] = false;
    this.setData({
      'active' : this.data.focusList
    });
  }
})