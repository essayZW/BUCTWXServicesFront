// pages/feedback/feedback.js
const App = getApp();
const token = require('/../../utils/token.js');
const AppConfig = require('/../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useScore: 0,
    styleScore: 0,
    funScore: 0,
    scoreWord: [
      '', '非常差', '很差', '一般', '很好', '非常好'
    ],
    input: {
      content: '',
      email: ''
    }
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
    // 设置星星初始值
    this.setData({
      'useScore': this.data.useScore,
      'styleScore': this.data.styleScore,
      'funScore': this.data.funScore,
      'scoreWord': this.data.scoreWord
    });
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
   * 星星打分
   */
  starClick: function (e) {
    this.data[e.target.dataset.id] = parseInt(e.target.dataset.score)
    this.setData({
      'useScore': this.data.useScore,
      'styleScore': this.data.styleScore,
      'funScore': this.data.funScore
    });
  },
  /**
   * 保存输入数据
   */
  inputData: function (e) {
    this.data.input[e.target.id] = e.detail.value;
  },
  /**
   * 提交反馈
   */
  submitFeedBack: function () {
    let content = this.data.input.content;
    let email = this.data.input.email;
    if (!content || content.length == 0 || content.length > AppConfig.maxFeedBackContentLength) {
      wx.showToast({
        title: '评价内容必填',
        image: '/images/icon/error.png',
        duration: 600
      });
      return;
    }
    let useScore = this.data.useScore;
    if (useScore == 0) useScore = -1;
    let styleScore = this.data.styleScore;
    if (styleScore == 0) styleScore = -1;
    let funScore = this.data.funScore;
    if (funScore == 0) funScore = -1;
    token.request(
      AppConfig.APIAddress + AppConfig.feedBackAPI,
      'POST',
      {
        content: content,
        email: email,
        use_score: useScore,
        style_score: styleScore,
        function_score: funScore,
        time: new Date().getTime()
      },
      (rep) => {
        if (!rep.data.status) {
          wx.showToast({
            title: rep.data.info,
            icon: 'none',
            duration: 700,
          });
          return;
        }
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        });
      },
      (rep) => {
        wx.showToast({
          title: '提交失败',
          image: '/images/icon/error.png',
          duration: 700
        });
      },
      {
        'content-type': 'application/x-www-form-urlencoded'
      }
    )
  }
})
