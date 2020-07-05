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
            let configs = AppConfig.get('settings');
            for(let key in configs) {
                this.globalData.config[key] = configs[key];    
            }
        }

        // 请求首页轮播图信息
        token.request(AppConfig.APIAddress + AppConfig.swiperData, 'POST', {}, (res) => {
                if(res.data.status) {
                    if(res.data.data.swiper != undefined) {
                        this.indexSwiperData = res.data.data.swiper;
                    }
                    if(res.data.data.notice != undefined) {
                        this.globalData.notice = res.data.data.notice;
                    }
                }
                else {
                    wx.showToast({
                        title: '服务器繁忙，连接失败!',
                        icon: "none"
                    });
                    throw new Error("轮播图等信息获取失败!\n");
                }
            }, (res) => {
                throw new Error("轮播图等信息获取失败!\n" + res.errMsg);
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
       config : AppConfig.funconfig,
       notice : {
           id : '',
           content : ''
       }
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
                alertcontent : '服务器连接繁忙，内容获取失败!'
            },
            image : 'https://s1.ax1x.com/2020/05/13/YamWdg.png'
        }
    ]
})

