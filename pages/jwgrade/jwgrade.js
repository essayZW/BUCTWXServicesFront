// pages/jw/jw.js
const App = getApp();

const token = require('/../../utils/token.js');
const AppCofig = require('/../../utils/config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue : {
            'xnm' : '',
            'xqm' : ''
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
     * 得到指定学年学期所有的成绩
     */
    getAllGrade : function(){

    },
    /**
     * 得到某学年学期指定科目的成绩明细
     */
    getSingleGrade : function(){

    },
    /**
     * 记录input输入
     */
    storeInputValue : function(e) {
        this.data.inputValue[e.currentTarget.id] = e.detail.value;
    }
})