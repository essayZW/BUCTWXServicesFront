//app.js
App({
    onLaunch: function () {
        this.updateTheme();
    },
    onShow: function() {

    },
    onError: function() {

    },
    onHide: function() {

    },
    globalData: {
       frontColor : '#ffffff',
       backgroundColor : '#ffd21e',
       id : 2
    },
    /**
     * 更新颜色信息
     */
    updateTheme : function() {
        // 读取本地存储的全局主题颜色
        const AppConfig = require('/utils/config.js');
        if(AppConfig.has('theme')) {
            let colorSettings = AppConfig.get('theme');
            if(colorSettings.frontColor)
                this.globalData.frontColor = colorSettings.frontColor;
            if(colorSettings.backgroundColor)
                this.globalData.backgroundColor = colorSettings.backgroundColor;
            if(colorSettings.id)
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
    }
})

