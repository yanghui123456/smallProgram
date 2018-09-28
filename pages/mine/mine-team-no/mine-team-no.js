// pages/mine/mine-team-no/mine-team-no.js
Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'BOSS好，快给我们开通团队版吧，业绩好的团队都在用',
      path: '/pages/1-register/4-mutipleVersion/4-mutipleVersion',
      imageUrl: 'http://oss.baoxian.xujinkeji.com/broker/send-no-red.jpg',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  data: {
  
  },
  onLoad: function (options) {
  
  },
  creatTeam:function() {
    wx.navigateTo({
      url: '../buy-author/buy-author',
    })
  }
})