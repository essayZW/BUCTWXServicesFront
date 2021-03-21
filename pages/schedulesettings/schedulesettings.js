// pages/schedulesettings/schedulesettings.js
const App = getApp();
const AppConfig = require('/../../utils/config.js');
const jw = require('/../../utils/jw.js');
const schedule = require('/../../utils/schedule.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectDay: {
      startDay: App.globalData.config.schedule.startDay
    },
    selectRange: [
      [], [1, 2, 3]
    ],
    datePickerRange: []
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
    let thisWeekFirstDay = AppConfig.getWeekFirstDay(new Date());
    let weekNum = (thisWeekFirstDay - new Date(App.globalData.config.schedule.startDay).getTime()) / (86400000 * 7) + 1;
    let todayObj = new Date();
    let today = todayObj.getTime();
    let pickerStartDay = new Date(todayObj.getFullYear() - 4, todayObj.getMonth(), todayObj.getDate());
    pickerStartDay = AppConfig.getWeekFirstDay(pickerStartDay);
    // 构建日期范围
    let pickerRange = [];
    let num = 0;
    let startDayIndex = 0;
    while (pickerStartDay <= today) {
      if (pickerStartDay == App.globalData.config.schedule.startDay) {
        startDayIndex = num;
      }
      let dateObj = new Date(pickerStartDay);
      pickerRange[num] = dateObj.getFullYear();
      pickerRange[num] += '-' + (dateObj.getMonth() + 1).toString().padStart(2, '0');
      pickerRange[num] += '-' + dateObj.getDate().toString().padStart(2, '0');
      num++;
      pickerStartDay += 604800000;
    }
    if (startDayIndex == 0) {
      startDayIndex = pickerRange.length - 1;
    }
    this.data.datePickerRange = pickerRange;
    this.setData({
      'nowDatePickerIndex': startDayIndex,
      'datePickerRange': pickerRange,
      'weekNum': parseInt(weekNum),
    });

    // 课表数据更新设置的相关数据绑定
    let year = new Date().getFullYear();
    for (let i = 2000; i <= year; i++) {
      this.data.selectRange[0][i - 2000] = i;
    }
    let xnm = App.globalData.config.schedule.xnm;
    let xqm = App.globalData.config.schedule.xqm;
    if (xnm == 0) {
      let month = new Date().getMonth() + 1;
      xnm = new Date().getFullYear();
      if ((month >= 9 && month <= 12) || (month >= 1 && month <= 2)) {
        xqm = 1;
        if (month >= 1 && month <= 2) xnm--;
      }
      else if (month > 2 && month <= 6) {
        xqm = 2;
        xnm--;

      }
      else {
        xqm = 3;
        xnm--;
      }
    }
    this.data.selectIndex = [xnm - 2000, xqm - 1];
    this.setData({
      selectRange: this.data.selectRange,
      nowSelectedIndex: [xnm - 2000, xqm - 1],
      nowSelected: xnm + '~' + (xnm + 1) + '学年第' + xqm + '学期'
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
  getFormatDate: function (dateObj) {
    let year = dateObj.getFullYear().toString();
    let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    let day = dateObj.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
  },
  /**
   * 设置日期
   */
  setDay: function (e) {
    let time = this.transFormatDate(this.data.datePickerRange[parseInt(e.detail.value)]);
    let dateObj = new Date(time[1], time[2] - 1, time[3]);
    this.data.selectDay.startDay = dateObj.getTime();
    let today = AppConfig.getWeekFirstDay(new Date());
    let weekNum = parseInt((today - dateObj.getTime()) / (86400000 * 7) + 1);
    if (weekNum > 20) {
      wx.showToast({
        title: '不能大于20周',
        image: '/images/icon/error.png',
        duration: 700
      });
      return;
    }
    this.setData({
      nowDatePickerIndex: parseInt(e.detail.value),
      weekNum: weekNum
    });
  },
  /**
   * 从YYYY-MM-DD 格式中得到年月日
   */
  transFormatDate: function (str) {
    let pattern = /^(\d+?)\-(\d+?)\-(\d+?)$/;
    return str.match(pattern);
  },
  /**
   * 保存设置
   */
  saveSettings: function () {
    App.globalData.config.schedule.startDay = this.data.selectDay.startDay;
    wx.setStorage({
      data: App.globalData.config,
      key: 'settings',
      success: function () {
        wx.showToast({
          title: '成功',
          duration: 600
        });

        setTimeout(() => {
          wx.navigateBack();
        }, 620);
      },
      fail: function () {
        wx.showToast({
          title: '保存失败',
          duration: 700,
          image: '/images/icon/error.png'
        });
      }
    });
  },
  /**
   * 更新选择的学期学年信息
   */
  dateSelectChange: function (e) {
    this.data.selectIndex = e.detail.value;
    let xnm = this.data.selectRange[0][e.detail.value[0]];
    let xqm = this.data.selectRange[1][e.detail.value[1]];
    this.setData({
      nowSelectedIndex: [e.detail.value[0], e.detail.value[1]],
      nowSelected: xnm + '~' + (xnm + 1) + '学年第' + xqm + '学期'
    });
  },
  /**
   * 更新本地课程表信息
   */
  updateScheduleInfo: function () {
    let xnm = this.data.selectRange[0][this.data.selectIndex[0]];
    let xqm = this.data.selectRange[1][this.data.selectIndex[1]];
    wx.showToast({
      title: '更新中',
      duration: 10000,
      icon: 'loading'
    });
    // 检测是否本地存储的有用户名密码
    if (!AppConfig.has('userpass')) {
      // 没有存好的用户名密码
      wx.hideToast();
      wx.showModal({
        content: '未配置教务用户名和密码，将要跳转到配置页面填写',
        title: '页面跳转提示',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
          else {
            wx.showToast({
              title: '需要配置用户信息',
              icon: 'none',
              duration: 700
            })
          }
        }
      })
      return;
    }
    // 调用本地存储获得用户名密码
    let userInfo = AppConfig.get('userpass');
    let username = userInfo['username'];
    let password = userInfo['password'];
    let vpnusername = userInfo['username'];
    let vpnpassword = userInfo['vpnpassword'];
    jw.getSchedule(xnm, xqm, username, password, vpnusername, vpnpassword, (rep) => {
      if (!rep.data.status) {
        wx.hideToast({
          complete: (res) => {
            wx.showToast({
              title: rep.data.info,
              icon: 'none',
              duration: 700
            });
          }
        });
        return;
      }
      let parsedData = schedule.parse(rep.data.data['kbList']);
      if (schedule.write(parsedData)) {
        // 保存课表的学年和学期
        App.globalData.config.schedule.xnm = xnm;
        App.globalData.config.schedule.xqm = xqm;
        wx.setStorage({
          data: App.globalData.config,
          key: 'settings',
        });
        wx.hideToast({
          complete: (res) => {
            wx.showToast({
              title: '成功',
              duration: 600,
            });
            setTimeout(() => {
              this.saveSettings();
            }, 620);
          }
        });
      }
      else {
        wx.hideToast({
          complete: (res) => {
            wx.showToast({
              title: '课表保存失败',
              duration: 700,
              image: '/images/icon/error.png'
            });
          },
        })
      }
    }, (rep) => {
      wx.hideToast({
        complete: (res) => {
          wx.showToast({
            title: '更新失败',
            duration: 700,
            image: '/images/icon/error.png'
          });
        }
      });
    });
  }
})
