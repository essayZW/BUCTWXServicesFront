//app.js
App({
    onLaunch: function () {
        // 读取本地存储的全局主题颜色
        const AppConfig = require('/utils/config.js');
        if(AppConfig.has('theme')) {
            let colorSettings = AppConfig.get('theme');
            this.globalData.frontColor = colorSettings.frontColor;
            this.globalData.backgroundColor = colorSettings.backgroundColor;
        }
    },
    onShow: function() {

    },
    onError: function() {

    },
    onHide: function() {

    },
    globalData: {
       frontColor : '#ffffff',
       backgroundColor : '#ffd21e'
    }
})

