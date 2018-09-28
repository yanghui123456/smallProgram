//logs.js
Page({
  data: {
    logs: []
  },
  onLoad: function () {
  },
  authorization: function() {
    // 调起客户端小程序设置界面
    console.log(1);
    wx.openSetting({
      success: (res) => {
        console.log(res.authSetting);
      }
    })
  }
})
