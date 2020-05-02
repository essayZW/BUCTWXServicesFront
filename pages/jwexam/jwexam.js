// pages/jwexam/jwexam.js
const App = getApp();
const jw = require('/../../utils/jw.js');
const AppConfig = require('/../../utils/config.js');
const todoManage = require('/../../utils/todo.js');
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
    App.setNavigatorColor();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     // 查询考试信息
     wx.showToast({
      title: '查询中',
      icon: 'loading',
      duration: 10000
    });
    // 检测是否本地存储的有用户名密码
    if(!AppConfig.has('userpass')) {
        // 没有存好的用户名密码
        wx.hideToast();
        wx.showModal({
            content: '未配置教务用户名和密码，将要跳转到配置页面填写',
            title : '页面跳转提示',
            success: function(res) {
                if(res.confirm) {
                    wx.navigateTo({
                        url: '/pages/login/login'
                    })
                }
                else {
                    wx.showToast({
                        title: '失败',
                        image: '/images/icon/error.png'
                    })
                }
            }
        });
    }
    else {
        // 调用本地存储获得用户名密码
        let userInfo = AppConfig.get('userpass');
        let username = userInfo['username'];
        let password = userInfo['password'];
        let vpnusername = userInfo['username'];
        let vpnpassword = userInfo['vpnpassword'];
        // 开始发送表单
        let xnm = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let xqm;
        if((month >= 9 && month <= 12) || (month >= 1 && month <= 2)) {
            if(month >= 1 && month <= 2) {
                xnm --;
            }
            xqm = 1;
        }
        else if(month > 2 && month <= 6) {
            xnm --;
            xqm = 2;
        }
        else if(month > 6 && month < 9) {
            xnm --;
            xqm = 3;
        }
        // xqm = 1;
        jw.getExamList(xnm, xqm, username, password, vpnusername, vpnpassword, (rep) => {
            let examList = [];
            if(rep.data.status) {
              for(let i = 0; i < rep.data.data.length; i ++) {
                let obj = {};
                let now = rep.data.data[i];
                obj.name = now.kcmc;
                obj.nameHalf = now.kcmc.substr(0, parseInt(now.kcmc.length / 2));
                obj.nameLastHalf = now.kcmc.substr(parseInt(now.kcmc.length / 2), now.kcmc.length - parseInt(now.kcmc.length / 2));
                obj.position = now.cdmc;
                obj.time = now.kssj;
                obj.teacherName = now.jsxx;
                examList.push(obj);
              }
              this.setData({
                'examList' : examList
              });

              for(let i = 0; i < examList.length; i ++) {
                let res = this.pregMatchFromatDate(examList[i].time);
                let year = parseInt(res[1]);
                let month = parseInt(res[2]) - 1;
                let day = parseInt(res[3]);
                let startTime = res[4] + ':' + res[5];
                let endTime = res[6] + ':' + res[7];
                let startTimeObj = new Date(year, month, day, startTime.substr(0, 2), startTime.substr(3, 2));
                let endTimeObj = new Date(year, month, day, endTime.substr(0, 2) == '00' ? 24 : parseInt(endTime.substr(0, 2)), parseInt(endTime.substr(3, 2)));
                let content = examList[i].teacherName;
                let position = examList[i].position;
                let title = examList[i].name + '考试';
                let data = {
                  'title' : title,
                  'startTime' : startTime,
                  'endTime' : endTime,
                  'position' : position,
                  'content' : content,
                  'finish' : false,
                  'shortInfo' : title.substr(0, 3),
                  'sTime' : startTimeObj.getTime(),
                  'eTime' : endTimeObj.getTime()
                };
                todoManage.add(year, month, day, data);
              }
                             
            }
            else {
              wx.hideToast({
                  complete: (res) => {
                      wx.showToast({
                        title: rep.data.info,
                        icon: 'none'
                      });
                  }
              });
            }
        }, (rep) => {
            wx.hideToast({
                complete: (res) => {
                    wx.showToast({
                      title: '查询失败',
                      image : '/images/icon/error.png'
                    });
                }
            });
        })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      App.setPageColor(this);
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
   * 通过格式化日期字符串"yy-mm-dd(HH:MM-HH:MM)"匹配出年月日时分
   */
  pregMatchFromatDate : function(dateStr) {
    let pattern = /(\d+?)\-(\d+?)-(\d+?)\((\d+?):(\d+?)-(\d+?):(\d+?)\)/;
    let res = dateStr.match(pattern);
    return res;
  }
})