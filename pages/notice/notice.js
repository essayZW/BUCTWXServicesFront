// pages/notice/notice.js
const App = getApp();
const todoManage = require('/../../utils/todo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeTitle : {
      'exam' : '即将到来的考试!',
      'calendar' : '还要做的事!',
      'schedule' : '今天的课程!',
    },
    typeClassName : {
      'exam' : 'exam',
      'calendar' : 'todo',
      'schedule' : 'course'
    },
    secondTypeClassName : {
      'exam' : 'exam',
      'calendar' : 'course',
      'schedule' : 'course'
    },
    weekDay : ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
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
      typeTitle : this.data.typeTitle,
      typeClassName : this.data.typeClassName,
      secondTypeClassName : this.data.secondTypeClassName
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 或许今日待办
    let todayEvent = this.getTodayEvent();
    this.setData({
      'eventList' : todayEvent
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
   * 得到今天的待办，考试，课程等信息
   */
  getTodayEvent : function() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let day = new Date().getDate();
    // 存储结果
    let res = [];
    // 得到待办列表
    let todoList = todoManage.get(year, month, day);
    res = this.changeTodoTONotice(todoList);
    // 查找一定范围天数的考试事件
    let today = new Date().getTime();
    // 减去一定的时间得到几天后的时间戳
    let startDay = today + App.globalData.config.notice.exam * (1000 * 60 * 60 * 24);
    let startDayObj = new Date(startDay);
    // 不包括今天的考试
    today += 1000 * 60 * 60 * 24;
    let todayObj = new Date(today);
    let rangeExam = todoManage.range(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate(),startDayObj.getFullYear(), startDayObj.getMonth(), startDayObj.getDate(), 'exam');
    res = res.concat(this.changeTodoTONotice(rangeExam));
    today -= 1000 * 60 * 60 * 24;
    startDay = today + App.globalData.config.notice.todo * (1000 * 60 * 60 * 24);
    startDayObj = new Date(startDay);
    rangeExam = todoManage.range(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate(),startDayObj.getFullYear(), startDayObj.getMonth(), startDayObj.getDate(), 'calendar');
    res = res.concat(this.changeTodoTONotice(rangeExam));
    return res;
  },
  /**
   * 对今天的事件排序
   */
  sortEvent : function(list) {
    // 先根据是否置顶排序，后根据是否过期排序，再根据开始/结束时间排序
    let now = new Date().getTime();
    list.sort((a, b) => {
      if(a.onTop != b.onTop) return -(a.onTop - b.onTop);
      if((a.endTime - now) * (b.endTime - now) < 0) return -(a.endTime - b.endTime);
      if(a.startTime != a.startTime) return a.startTime - b.startTime;
      return a.endTime - b.endTime;
    });
    return list;
  },
  /**
   * 通过时间戳得到格式化的时间（HH:mm)格式
   */
  timeFormat : function(time) {
    let timeObj = new Date(time);
    let hour = timeObj.getHours().toString().padStart(2, '0');
    let miniute = timeObj.getMinutes().toString().padStart(2, '0');
    return hour + ':' + miniute;
  },
  /**
   * 对todo待办对象转化为通知对象
   */
  changeTodoTONotice : function(todoList) {
    let res = [];
    // 遍历待办列表
    for(let i = 0; i < todoList.length; i ++) {
      if(todoList[i].finish) continue;
      let obj = {};
      obj.type = todoList[i].type;
      obj.startTime = parseInt(todoList[i].sTime);
      obj.endTime = parseInt(todoList[i].eTime);
      obj.title = todoList[i].title;
      obj.position = todoList[i].position;
      obj.sTime = this.timeFormat(obj.startTime);
      obj.eTime = this.timeFormat(obj.endTime);
      if(obj.type == 'exam') {
        // 是一条考试信息
        obj.secondTitle = todoList[i].content;
      }
      else if(obj.type == 'calendar') {
        let eMonth = new Date(obj.startTime).getMonth() + 1;
        let eDay = new Date(obj.startTime).getDate();
        let weekDay = new Date(obj.startTime).getDay();
        obj.secondTitle = eMonth + '月' + eDay + '日 ' + this.data.weekDay[weekDay];
      }
      else {
        obj.secondTitle = '';
      }
      // 默认不置顶
      obj.onTop = false;
      // 放入结果
      res.push(obj);
    }
    return this.sortEvent(res);
  }
})