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

        //渲染选择列表
        let yearList = new Array();
        let nowyear = new Date().getFullYear();
        let nowmonth = new Date().getMonth() + 1;
        let sclass;
        if(nowmonth >= 9 || nowmonth <= 2) {
            sclass = 1;
        }
        else if(nowmonth >= 3 && nowmonth <= 7) {
            sclass = 2;
        }
        else {
            sclass = 3;
        }
        for(let i = 2000; i < nowyear; i ++) {
            yearList.push(i);
        }
        this.data.syear = nowyear - 1;
        this.data.sclass = sclass;
        this.setData({
            'selectedYear' : yearList,
            'selectedClass' : [1, 2, 3],
            'syear' : nowyear - 1,
            'sclass': sclass
        });
        this.setData({
            'selectValue' : [9999, sclass - 1]
        });
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
    /**
     * 列表切换更新值函数
     */
    selectChange : function(e) {
        this.data.syear = e.detail.value[0] + 2000;
        this.data.sclass = e.detail.value[1] + 1;
        this.setData({
            'syear' : this.data.syear,
            'sclass' : this.data.sclass
        });
    },
    /**
     * 查询函数
     */
    query : function() {
        // 隐藏区域
        this.listChange();
        // 显示等待提示
        wx.showToast({
          title: '请稍等',
          icon: 'loading',
          duration: 10000
        });
        // 检测是否本地存储的有用户名密码
        if(!AppCofig.has('userpass')) {
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
            })
            return;
        }
        // 调用本地存储获得用户名密码
        let userInfo = AppCofig.get('userpass');
        let username = userInfo['username'];
        let password = userInfo['password'];
        let vpnusername = userInfo['username'];
        let vpnpassword = userInfo['vpnpassword'];
        // 开始发送表单
        let THIS = this;
        console.log(this.data.syear);
        console.log(this.data.sclass);
        jw.getAllGrade(this.data.syear, this.data.sclass, username, password, vpnusername, vpnpassword, function(data) {
            // 成功
            wx.hideToast();
            // 分析数据并展示
            if(!data.data.status) {
                wx.showToast({
                  title: data.info,
                  image: '/images/icon/error.png'
                });
                return;
            }
            data = data.data.data;
            if(data.items.length == 0) {
                wx.showToast({
                  title: '无成绩',
                  image: '/images/icon/warn.png'
                })
                return;
            }
            let gradeRes = new Array();
            for(let i = 0; i < data.items.length; i ++) {
                let obj = {};
                obj.score = data.items[i].xf;
                obj.grade = data.items[i].cj;
                obj.scorePoint = data.items[i].jd;
                let name = data.items[i].kcmc;
                obj.classNameFirstHalf = name.substr(0, parseInt(name.length / 2));
                obj.classNameSecondHalf = name.substr(parseInt(name.length / 2), name.length - parseInt(name.length / 2));
                gradeRes.push(obj);
            }
            // 更新页面
            THIS.setData({
                'hasGrade' : true,
                'allGradeInfo': gradeRes
            });
            // 检查是否本地存有登陆信息
            if(!AppCofig.has('userinfo')) {

            }
        }, function(data) {
            // 失败
            wx.hideToast({
                complete: (res) => {
                    wx.showToast({
                        title: '失败',
                        image: '/images/icon/error.png'
                    })
                },
            });
            console.log(data);
        });
    }
})