//app.js
const AppConfig = require('/utils/config.js');
const token = require('/utils/token.js');
App({
    onLaunch: function () {
        this.reset();
        this.updateTheme();
        if(AppConfig.has('userheadInfo')) {
            this.globalData.headUrl = AppConfig.get('userheadInfo');
        }
        if(AppConfig.has('settings')) {
            this.globalData.config = AppConfig.get('settings');
        }

        // 请求首页轮播图信息
        token.request(AppConfig.APIAddress + AppConfig.swiperData, 'POST', {}, (res) => {
                if(res.data.status) {
                    this.indexSwiperData = res.data.data;
                }
                else {
                    console.log('轮播图获取失败')
                }
            }, (res) => {
                console.log(res.errMsg);
            },
            {
                'content-type' : 'application/x-www-form-urlencoded'
            }
        );
    },
    onShow: function() {

    },
    onError: function() {

    },
    onHide: function() {

    },
    globalData: {
       frontColor : '',
       backgroundColor : '',
       id : '',
       headUrl : '',
       config : AppConfig.funconfig
    },
    /**
     * 更新颜色信息
     */
    updateTheme : function() {
        // 读取本地存储的全局主题颜色
        if(AppConfig.has('theme')) {
            let colorSettings = AppConfig.get('theme');
            if(colorSettings.frontColor)
                this.globalData.frontColor = colorSettings.frontColor;
            if(colorSettings.backgroundColor)
                this.globalData.backgroundColor = colorSettings.backgroundColor;
            if(colorSettings.id || colorSettings.id === 0)
                this.globalData.id = colorSettings.id;
        }
    },
    /**
     * 设置顶栏颜色
     */
    setNavigatorColor : function() {
        // 修改本页面顶栏颜色
        wx.setNavigationBarColor({
            backgroundColor: this.globalData.backgroundColor,
            frontColor: this.globalData.frontColor
        });
    },
    /**
     * 设置对应页面的主题颜色
     */
    setPageColor : function(page) {
        // 设置该页面主题色
        page.setData({
            'globalBackgroundTheme' : this.globalData.backgroundColor,
            'globalFrontTheme' : this.globalData.frontColor
        });
    },
    /**
     * 恢复
     */
    reset: function() {
        this.globalData.frontColor = AppConfig.defaultFrontColor;
        this.globalData.backgroundColor = AppConfig.defaultBackgroundColor;
        this.globalData.id = AppConfig.defaultColorId;
    },
    /**
     * 首页轮播图信息
     */
    indexSwiperData : [
        {
            type : 'src',
            dataset : {
                src : '/pages/jwgrade/jwgrade',
                alertcontent : ''
            },
            image: 'https://s1.ax1x.com/2020/05/13/YamReS.png'
        },
        {
            type: 'src',
            dataset : {
                src : '/pages/help/help',
                alertcontent : ''
            },
            image: 'https://s1.ax1x.com/2020/05/13/YamgL8.png'
        },
        {
            type : 'alert',
            dataset : {
                src : '',
                alertcontent : '暂无'
            },
            image : 'https://s1.ax1x.com/2020/05/13/YamWdg.png'
        }
    ]
})

