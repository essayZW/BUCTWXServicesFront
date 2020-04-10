// pages/jw/jw.js
const App = getApp();

const token = require('/../../utils/token.js');
const AppCofig = require('/../../utils/config.js');
const jw = require('/../../utils/jw.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue : {

        },
        listShow : false
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
        this.setData({
            'hasGrade' : false,
            'noGradeInfo' : '暂时无成绩!'
        });
        let touch = require('/../../utils/touch.js');
        let touchObj = new touch(() => {
            this.listChange(false);
        }, () => {
            this.listChange(true);
        });
        this.touchStart = function(e) {
            touchObj.start(e);
        };
        this.touchMove = function(e) {
            touchObj.move(e);
        }
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
     * 选择列表出现
     */
    listChange : function(show) {
        if(show === true){
            this.data.listShow = false;
        }
        else if(show === false) {
            this.data.listShow = true;
        }
        this.setData({
            'selectListShow' : this.data.listShow ? '' : 'selected-list',
        });
        this.data.listShow = !this.data.listShow;
    },

})