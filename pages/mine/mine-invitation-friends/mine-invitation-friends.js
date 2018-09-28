const app = getApp();
Page({
  data: {
    showList: true,
    userList:[]
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '百万保险顾问都在用的保单托管智能助理',
      path: '/pages/1-register/4-mutipleVersion/4-mutipleVersion?jjrId=' + app.globalData.agentInfo.id,
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
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.httpList();
  },
  // 邀请成功好友列表
  httpList:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api//v1.0.0/brokerInviteInfo/query/' + app.globalData.agentInfo.id,
      method: 'GET',
      header: { 'openid': app.globalData.openId },
      success: function (res) {
        if (res.data.businessCode === '0000') {
          if (res.data.data.length == 0) {
            that.setData({
              showList: false,
              userList: res.data.data
            })
          } else {
            that.setData({
              showList: true,
              userList: res.data.data
            })
          }
          wx.hideLoading();
        } else if (res.data.businessCode === '0009') {
          app.getSessionKey(that.httpList());
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    })
  },
  shareFriend:function() {
    wx.showToast({
      title: '暂未开启',
      icon:'none',
      duration:2000
    })
  }
})
