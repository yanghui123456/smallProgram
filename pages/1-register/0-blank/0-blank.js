// pages/1-register/0-blank/0-blank.js
//获取应用实例
const app = getApp()
Page({
  data: {
  
  },
  onLoad: function () {
  },
  onShow:function() {
    // 先去判断该微信用户是否注册过小程序
    wx.showLoading({
      title: '加载中...',
    })
    this.go_check_tel(); 
  },
  //查看经纪人审核是否通过
  go_check_tel: function () {
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/check/openid',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        // 0002=openid未注册或者审核拒绝  0004=openid被停用(目前不会返回),  0005=openid正在审核中, 0003=openid审核通过
        wx.hideLoading();
        // 无注册 - 开通页，正在审核中 - 开通页 ,注册成功 - tab页面，
        if (res.data.businessCode === '0002') {
          app.globalData.registerOpenid = 'false';
          // 新版的开通页
          wx.navigateTo({
            url: '/pages/1-register/4-mutipleVersion/4-mutipleVersion',
          })
        } else if (res.data.businessCode === '0003') {
          app.globalData.registerOpenid = 'true';
          app.globalData.agentInfo = res.data.data;
          wx.switchTab({
            // url: "/pages/2-tabs/1-tuoguan/1-tuoguan",
            url: "/pages/2-tabs/0-ipCard/0-ipCard",
          });
        } else if (res.data.businessCode === '0005') {
          app.globalData.registerOpenid = 'wait';
          wx.navigateTo({
            url: '/pages/1-register/4-mutipleVersion/4-mutipleVersion',
          })
          return;
        }
      }
    })
  } 
})