//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasData: false,
    whList: []
  },
  // 页面加载
  onLoad: function () {
    this.getNotes();
  },
  getNotes:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/customer/query/' + app.globalData.agentInfo.id + '/' + app.globalData.whUserId,
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          // 是否为空
          if (data.data === null) {
              that.setData({
                hasData:true
              })
          } else {
            // '1:微信沟通 2:电话沟通 3:发送礼物 4:生成保障方案',
            that.setData({
              hasData: false,
              whList: data.data.custmerRecord
            })
          }
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getNotes());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }
})
