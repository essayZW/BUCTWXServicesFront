// pages/about/about.js
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
    if(options.open) {
      if(options.open == "statement") {
        this.showMask({
          currentTarget : {
            id : 'statement'
          }
        });
      }
    }
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
   * 隐藏蒙版
   */
  hideMask : function(e) {
    if(e.target.id != 'mask') return;
    this.setData({
        'showMask' : false
    });
},
  /**
   * 显示内容蒙版
   */
  showMask : function(e) {
    this.setData({
      'showMask' : true,
      'alertContent' : this.alertContent[e.currentTarget.id]
    });
  },
  /**
   * 弹出的信息
   */
  alertContent : {
    'about' : `# 联系我们
email: essaybeihai@gmail.com`,
    'statement' : `# 隐私协议声明
## 一. 本程序所使用的信息
1. 学号，校园网密码，教务密码
2. 授权情况下的微信头像，用户名等信息
> 以上信息均由用户主动提供，同时也是小程序提供查询服务所必须的一些基础信息
##  二.信息的使用以及保存方式
### 使用
用户提供的教务用户名密码等信息用来服务器上爬虫模拟登陆抓取相关的成绩等信息，且传输过程中采用非明文方式传输
### 存储
**服务器不会存储用户的任何的信息， 同时也不会收集任何信息，所有的信息均以缓存或者文件的形式保存在用户本地设备上**
## 三. 本地存储的部分信息
1. 用户名密码等信息
2. 设置等信息
3. 已查询的成绩详情
4. 解析的课表数据
5. 查询的考试信息
> 本地存储的信息可以在 设置>清除缓存 中清理`
  }
});