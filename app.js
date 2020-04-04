//app.js
App({
    onLaunch: function () {
        wx.getStorage({
            key: 'userinfo',
            success : function(res){
                this.globalData.userinfo = res.data;
            }
        })
    },
    onShow: function() {

    },
    onError: function() {

    },
    onHide: function() {

    },
    globalData: {
        userinfo : null
    }
})

