// pages/themesetting/themesetting.js
const App = getApp();
const AppConfig = require('/../../utils/config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isSet : [],
        useBlack : false,
        edit : false
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

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        for(let i = 0; i < 8; i ++) {
            this.data.isSet[i] = false;
        }
        this.data.isSet[App.globalData.id] = true;
        this.data.useBlack = (App.globalData.frontColor === '#000000');
        this.inputData.color = App.globalData.backgroundColor;
        this.setData({
            'isSet' : this.data.isSet,
            'useBlack' : this.data.useBlack,
            'currentColorCode' : App.globalData.backgroundColor,
            'edit' : this.data.edit
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
     * 设置一个程序的全局颜色主题
     */
    setBackgroundTheme : function(color, id) {
        let data = {};
        if(AppConfig.has('theme')) {
            data = AppConfig.get('theme');
        }
        data.backgroundColor = color;
        data.id = id;
        wx.setStorage({
            data: data,
            key: 'theme',
            success: () => {
                App.updateTheme();
                App.setNavigatorColor();
                App.setPageColor(this);
            }
        });
    },
    /**
     * 设置文字颜色
     */
    setFrontTheme : function(color) {
        let data = {};
        if(AppConfig.has('theme')) {
            data = AppConfig.get('theme');
        }
        data.frontColor = color;
        wx.setStorage({
            data: data,
            key: 'theme',
            success: () => {
                App.updateTheme();
                App.setNavigatorColor();
                App.setPageColor(this);
            }
        });
    },
    /**
     * 系统预置主题颜色设置
     */
    setSystemColor : function(e) {
        let color = e.currentTarget.dataset.color;
        let id = e.currentTarget.dataset.id;
        this.setBackgroundTheme(color, id);
        for(let i = 0; i < 8; i ++) {
            this.data.isSet[i] = false;
        }
        this.data.isSet[id] = true;
        this.inputData.color = color;
        this.setData({
            'isSet' : this.data.isSet,
            'currentColorCode' : color
        });
    },
    /**
     * 用户自定义颜色设置
     */
    setUserColor : function(e) {
        this.setData({
            'showColorPicker' : true
        });
    },
    /**
     * 设置文字颜色
     */
    setSystemFrontColor : function(e) {
        let color = e.currentTarget.dataset.color;
        if(this.data.useBlack) {
            color = '#ffffff';
        }
        this.setFrontTheme(color);
        this.data.useBlack = (color === '#000000');
        this.setData({
            'useBlack' : this.data.useBlack
        });
    },
    /**
     * 颜色选择器颜色确认
     */
    confirmColor : function(e) {
        this.inputData.color = e.detail.value;
        this.setSystemColor({
            currentTarget : {
                dataset : {
                    color : e.detail.value,
                    id : 0
                }
            }
        });
    },
    /**
     * 用户输入颜色代码设置
     */
    inputColorCode : function() {
        this.data.edit = !this.data.edit;
        this.setData({
            'edit' : this.data.edit
        });
        if(this.data.edit) return;
        let color = this.inputData.color;
        this.setData({
            'edit' : this.data.edit,
        });

        this.setSystemColor({
            currentTarget : {
                dataset : {
                    color : color,
                    id : 0
                }
            }
        });
    },
    /**
     * 输入表单
     */
    inputValue : function(e) {
        this.inputData[e.target.id] = e.detail.value;
    },
    inputData : {
        'color' : ''
    }
})