// pages/schedule/schedule.js
const App = getApp();
const ScheduleManager = require('/../../utils/schedule.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDay: new Date().getTime(),
    dayToStr: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    pickerRange: [],
    thisWeekNum: 1,
    isOpen: true
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
    this.data.isOpen = true;
    // 获取本学期的第一天
    this.data.startDay = App.globalData.config.schedule.startDay;
    for (let i = 1; i <= 20; i++) {
      this.data.pickerRange[i - 1] = '第' + i + '周';
    }
    // 构建时间表
    let timeTable = [];
    let halfTimeTable = [
      ['08:00', '08:45'],
      ['08:50', '09:35'],
      ['09:50', '10:35'],
      ['10:45', '11:30'],
      ['11:35', '12:20'],
      ['13:00', '13:45'],
      ['13:50', '14:35'],
      ['14:45', '15:30'],
      ['15:40', '16:25'],
      ['16:30', '17:15'],
      ['18:00', '18:45'],
      ['18:50', '19:35'],
      ['19:40', '20:25']
    ];
    for (let i = 0; i < 13; i++) {
      timeTable[i] = {};
      timeTable[i].id = i + 1;
      timeTable[i].startTime = halfTimeTable[i][0];
      timeTable[i].endTime = halfTimeTable[i][1];
    }
    this.setData({
      'pickerRange': this.data.pickerRange,
      'timeTable': timeTable
    });
    let today = new Date().getTime();
    let weekNum = (today - this.data.startDay) / 604800000;
    weekNum = Math.ceil(weekNum);
    if (weekNum > 20) weekNum = 20;
    this.data.thisWeekNum = weekNum;
    this.changeWeek(weekNum);
    // 修改本页面顶栏颜色
    App.setNavigatorColor();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let xnm = App.globalData.config.schedule.xnm;
    if (xnm == undefined) xnm = 0;
    let xqm = App.globalData.config.schedule.xqm;
    if (xqm == undefined) xqm = 1;
    this.setData({
      xnm: xnm,
      xqm: xqm
    });
    if (!ScheduleManager.has()) {
      // 未配置课表信息
      wx.showModal({
        content: "检测到未配置课程表信息，是否前往设置页面配置",
        title: '未配置课表信息',
        cancelText: '暂不配置',
        confirmText: '前往配置',
        success: (res) => {
          if (res.confirm) {
            this.data.isOpen = false;
            wx.navigateTo({
              url: '/pages/schedulesettings/schedulesettings',
            });
          }
        }
      });
    }
    if (!this.data.isOpen) {
      this.onReady();
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
   * 更换周
   */
  changeWeek: function (num) {
    let weekday = this.data.startDay + (num - 1) * 604800000;
    let data = [];
    data.length = 7;
    let today = new Date().getDay();
    if (today == 0) today = 7;
    let todayMonth = new Date().getMonth();
    let todayDate = new Date().getDate();
    let showBackMenu = false;
    for (let i = 0; i < 7; i++) {
      data[i] = {};
      data[i].id = i + 1;
      data[i].month = new Date(weekday).getMonth();
      data[i].date = new Date(weekday).getDate();
      data[i].isActive = (i + 1 == today && data[i].month == todayMonth && data[i].date == todayDate);
      showBackMenu |= data[i].isActive;
      data[i].month = this.zeroBeforeNum(data[i].month + 1);
      data[i].date = this.zeroBeforeNum(data[i].date);
      data[i].classinfo = [];
      weekday += 86400000;
    }
    // 获得所有的课程信息
    let allSchedule = ScheduleManager.getWeekClass(num);
    let classTable = [];
    let nums = 0;
    for (let i = 1; i < allSchedule.length; i++) {
      for (let key in allSchedule[i]) {
        classTable[nums] = {}
        classTable[nums].className = allSchedule[i][key].className;
        classTable[nums].class = "";
        classTable[nums].class += ('row-start-' + allSchedule[i][key].startClassNum + ' ');
        classTable[nums].class += ('row-end-' + allSchedule[i][key].endClassNum + ' ');
        classTable[nums].class += `column-start-${i} column-end-${i}`;
        classTable[nums].position = allSchedule[i][key].position;
        classTable[nums].color = this.getRandomColor();
        classTable[nums].teacherName = allSchedule[i][key].teacherInfo.name;
        nums++;
      }
    }
    this.setData({
      'classInfo': data,
      'weekNum': num,
      'classTable': classTable,
      'showBackMenu': showBackMenu
    });
  },
  getRandomColor: function () {
    let colorPool = ['255, 196, 80', '255, 157, 216', '255, 161, 125', '175, 236, 53', '89, 240, 163', '89, 240, 163'];
    let random = Math.round(Math.random() * 10) % colorPool.length;
    return colorPool[random];
  },
  /**
   * 将单个数字转化为0前缀的
   */
  zeroBeforeNum: function (num) {
    num = num.toString();
    return num.padStart(2, '0');
  },
  /**
   * 周改变
   */
  pickerChangeWeek: function (e) {
    this.changeWeek(parseInt(e.detail.value) + 1);
  },
  /**
   * 返回到这周
   */
  backToday: function () {
    this.changeWeek(this.data.thisWeekNum);
  },
  /**
   * 页面跳转
   */
  navigatorTo: function (e) {
    if (!e.currentTarget.dataset.src) return;
    this.data.isOpen = false;
    wx.navigateTo({
      url: e.currentTarget.dataset.src,
    });
  }
})
