// pages/jw/jw.js
const App = getApp();

const token = require('/../../utils/token.js');
const AppConfig = require('/../../utils/config.js');
const jw = require('/../../utils/jw.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: {

    },
    // 是否显示了选择列表
    listShow: false,
    // 是否显示了成绩明细
    showSingleGrade: false,
    // 选择组件是否完成了滚动
    pickerFinish: true
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
      'hasGrade': false,
    });
    //渲染选择列表
    let yearList = new Array();
    let nowyear = new Date().getFullYear();
    let nowmonth = new Date().getMonth() + 1;
    let sclass;
    if (nowmonth >= 9 || nowmonth <= 2) {
      sclass = 1;
    }
    else if (nowmonth >= 3 && nowmonth <= 7) {
      sclass = 2;
    }
    else {
      sclass = 3;
    }
    for (let i = 2000; i <= nowyear; i++) {
      yearList.push(i);
    }
    this.data.syear = nowyear - 1;
    this.data.sclass = sclass;
    this.setData({
      'selectedYear': yearList,
      'selectedClass': [1, 2, 3],
      'syear': nowyear - 1,
      'sclass': sclass
    });
    this.setData({
      'selectValue': [9999, sclass - 1]
    });

    // 设置头像
    this.setData({
      'headImageUrl': App.globalData.headUrl
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 渲染用户信息
    if (AppConfig.has('userinfo')) {
      let userInfo = AppConfig.get('userinfo');
      this.setData({
        'studentName': userInfo['name'],
        'studentClass': userInfo['classInfo'],
        'gpa': userInfo['gpa']['gpa']
      });
    }
    let touch = require('/../../utils/touch.js');
    let touchObj = new touch(() => {
      this.listChange(false);
    }, () => {
      this.listChange(true);
    }, 1000, 120);
    this.touchStart = function (e) {
      touchObj.start(e);
    };
    this.touchMove = function (e) {
      touchObj.move(e);
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
   * 选择列表出现
   */
  listChange: function (show) {
    if (show === true) {
      this.data.listShow = false;
    }
    else if (show === false) {
      this.data.listShow = true;
    }
    this.setData({
      'selectListShow': this.data.listShow ? '' : 'selected-list',
    });
    this.data.listShow = !this.data.listShow;
  },
  /**
   * 列表切换更新值函数
   */
  selectChange: function (e) {
    this.data.syear = e.detail.value[0] + 2000;
    this.data.sclass = e.detail.value[1] + 1;
    this.setData({
      'syear': this.data.syear,
      'sclass': this.data.sclass
    });
  },
  /**
   * 查询函数
   */
  query: function () {
    if (!this.data.pickerFinish) {
      return;
    }
    // 隐藏区域
    this.listChange();
    // 显示等待提示
    wx.showToast({
      title: '请稍等',
      icon: 'loading',
      duration: 10000
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
    // 开始发送表单
    let THIS = this;
    let syear = this.data.syear;
    let sclass = this.data.sclass;
    jw.getAllGrade(syear, sclass, username, password, vpnusername, vpnpassword, function (res) {
      // 成功
      wx.hideToast();
      // 分析数据并展示
      if (!res.data.status) {
        wx.hideToast({
          complete: () => {
            wx.showToast({
              title: res.data.info,
              icon: 'none'
            });
          },
        })
        return;
      }
      let userInfo = res.data.sinfo;
      let data = res.data.data;
      if (data == undefined || data.items == undefined) {
        data = {
          items: []
        };
      }
      if (data.items.length == 0) {
        wx.showToast({
          title: '无成绩',
          image: '/images/icon/warn.png'
        })
        return;
      }
      let gradeRes = new Array();
      for (let i = 0; i < data.items.length; i++) {
        let obj = {};
        obj.score = data.items[i].xf;
        obj.grade = data.items[i].cj;
        obj.scorePoint = data.items[i].jd;
        let name = data.items[i].kcmc;
        obj.classNameFirstHalf = name.substr(0, parseInt(name.length / 2));
        obj.classNameSecondHalf = name.substr(parseInt(name.length / 2), name.length - parseInt(name.length / 2));
        obj.className = name;
        obj.syear = syear;
        obj.sclass = sclass;
        gradeRes.push(obj);
      }
      // 更新页面
      THIS.setData({
        'hasGrade': true,
        'allGradeInfo': gradeRes,
      });

      wx.setStorage({
        data: userInfo,
        key: 'userinfo',
      });
      THIS.setData({
        'studentName': userInfo['name'],
        'studentClass': userInfo['classInfo'],
        'gpa': userInfo['gpa']['gpa']
      });
    }, function (data) {
      // 失败
      wx.hideToast({
        complete: (res) => {
          wx.showToast({
            title: data.errMsg,
            image: '/images/icon/error.png'
          })
        },
      });
      console.log(data);
    });
  },
  /**
   * 得到单个成绩详情
   */
  getDetails: function (e) {
    // 显示等待提示
    wx.showToast({
      title: '请稍等',
      icon: 'loading',
      duration: 10000
    });
    let name = e.currentTarget.dataset.name;
    let syear = e.currentTarget.dataset.syear;
    let sclass = e.currentTarget.dataset.sclass;
    if (AppConfig.has('gradedetails')) {
      // 存在成绩详情的缓存
      let gradeDetails = AppConfig.get('gradedetails');
      // console.log(gradeDetails);
      if (gradeDetails[syear] && gradeDetails[syear][sclass] && gradeDetails[syear][sclass][name]) {
        wx.hideToast();
        this.data.showSingleGrade = true;
        this.setData({
          'showSingleGrade': this.data.showSingleGrade,
          'tr': gradeDetails[syear][sclass][name],
          'singleClassName': name
        });
        return;
      }
    }
    if (!AppConfig.has('userpass')) {
      console.log('not found userpass storage');
      wx.hideToast({
        complete: (res) => {
          wx.showToast({
            title: 'error',
            image: '/images/icon/error.png'
          })
        },
      })
      return false;
    }
    // 调用本地存储获得用户名密码
    let userInfo = AppConfig.get('userpass');
    let username = userInfo['username'];
    let password = userInfo['password'];
    let vpnusername = userInfo['username'];
    let vpnpassword = userInfo['vpnpassword'];
    // 发送表单
    jw.getSingleGrade(syear, sclass, name, username, password, vpnusername, vpnpassword, (rep) => {
      let data = rep.data.data;
      if (!rep.data.status) {
        wx.hideToast({
          complete: (res) => {
            wx.showToast({
              title: rep.data.info,
              image: '/images/icon/error.png'
            });
          },
        })
        return;
      }
      wx.hideToast();
      this.data.showSingleGrade = true;
      this.setData({
        'showSingleGrade': this.data.showSingleGrade,
        'tr': data,
        'singleClassName': name
      });
      // 存储到缓存中
      let gradeDetail = {};
      if (AppConfig.has('gradedetails')) {
        gradeDetail = AppConfig.get('gradedetails');
      }
      if (!gradeDetail[syear]) {
        gradeDetail[syear] = {};
      }
      if (!gradeDetail[syear][sclass]) {
        gradeDetail[syear][sclass] = {};
      }
      gradeDetail[syear][sclass][name] = data;
      wx.setStorage({
        data: gradeDetail,
        key: 'gradedetails',
      })
    }, (rep) => {
      // 失败
      wx.hideToast({
        complete: (res) => {
          wx.showToast({
            title: rep.errMsg,
            image: '/images/icon/error.png'
          })
        },
      });
      console.log(rep);
    });
  },
  /**
   * 隐藏成绩明细
   */
  hideSingleGrade: function (e) {
    if (e.target.id !== 'mask') {
      return;
    }
    this.data.showSingleGrade = false;
    this.setData({
      'showSingleGrade': this.data.showSingleGrade
    })
  },
  /**
   * pick开始
   */
  pickStart: function (e) {
    this.data.pickerFinish = false;
  },
  /**
   * pick结束
   */
  pickEnd: function (e) {
    this.data.pickerFinish = true;
  }
})
