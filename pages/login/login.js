// pages/login/login.js
const App = getApp();
const AppConfig= require('/../../utils/config.js');
const token = require('/../../utils/token.js');
const jw = require('/../../utils/jw.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputData : {
      'username' : '',
      'password' : '',
      'vpnpassword' : 'bucter'
    },
    focusList : {
      'username' : false,
      'password' : false,
      'vpnpassword' : false
    },
    activeFocus : {
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
    if(AppConfig.has('userpass')) {
      let userpass = AppConfig.get('userpass');
      for(let key in this.data.focusList) {
        this.data.focusList[key] = true;
      }
      for(let key in this.data.inputData) {
        this.data.inputData[key] = token.base64decrypt(userpass[key]);
      }
      this.setData({
        'storageData' : this.data.inputData,
        'active' : this.data.focusList
      });
    }
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
      'username': token.base64encrypt(this.data.inputData['username']),
      'password': token.base64encrypt(this.data.inputData['password']),
      'vpnpassword': token.base64encrypt(this.data.inputData['vpnpassword']),
      'vpnusername': token.base64encrypt(this.data.inputData['username'])
    }
    if(!this.data.inputData['username'] || !this.data.inputData['password'] || !this.data.inputData['vpnpassword']) {
      wx.showToast({
        title: '失败',
        image: '/images/icon/error.png'
      });
      return;
    }
    wx.showToast({
      title: '验证中',
      icon: 'loading',
      duration: 10000
    });
    jw.getStuInfo(savedata.username, savedata.password, savedata.vpnusername, savedata.vpnpassword,
        (res) => {
          // 请求成功
          if(!res.data.status) {
            wx.hideToast({
              complete: () => {
                wx.showToast({
                  title: res.data.info,
                  icon : 'none',
                  duration: 700
                });
              },
            });
            return;
          }
          // 验证成功
          wx.setStorage({
            data: res.data.data,
            key: 'userinfo',
            success: () => {
              // 存储用户名密码信息
              wx.setStorage({
                data: savedata,
                key: 'userpass',
              })
              // 清空成绩详情缓存
              wx.setStorage({
                data: {},
                key: 'gradedetails'
              });
              wx.hideToast({
                complete: (res) => {
                  wx.showToast({
                    title: '成功',
                    duration: 800,
                    complete: () => {
                      setTimeout(() => {
                        wx.navigateBack();
                      }, 600);
                    }
                  });
                }
              });
            },
            fail: () => {
              wx.hideToast({
                complete: (res) => {
                  wx.showToast({
                    title: '失败',
                    image: '/images/icon/error.png',
                    duration: 700
                  });
                }
              });
            }
          })
        },
        (res) => {
          // 请求失败
          wx.hideToast({
            complete: (res) => {
              wx.showToast({
                title: '验证失败，请稍后再试',
                icon: 'none',
                duration: 700
              });
            },
          })
        }
    );
  },
  /**
   * 输入框获得焦点
   */
  getFocus : function(e) {
    this.data.focusList[e.target.id] = true;
    this.setData({
      'active' : this.data.focusList
    });
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
  },
  /**
   * 点击文字获得焦点 
   */
  getFocusByWord : function(e) {
    for(let key in this.data.activeFocus) {
      this.data.activeFocus[key] = false;
    }
    this.data.activeFocus[e.target.id] = true;
    this.setData({
      'activeFocus' : this.data.activeFocus
    });
  }
})