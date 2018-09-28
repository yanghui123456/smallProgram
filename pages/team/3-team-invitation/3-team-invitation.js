// pages/team/3-team-invitation/3-team-invitation.js
const app = getApp()
Page({
  data: {
    useropenId:'',
    serverIP:'',
    brokerTeamId:'',
    name:'',
    imgUrl:'',
    hasJoin:'',
    headUrls:''
  },
  onLoad: function (res) {
    console.log(res);
    this.setData({
      serverIP: res.serverIp,
      brokerTeamId: res.brokerTeamId,
      name: res.brokerName,
    })
    this.getOpenid();
  },
  // 获取用户的openid
  getOpenid: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var params = {
          code: res.code
        }
        wx.request({
          url: that.data.serverIP + '/insurance/broker/api/v1.0.0/select/openid',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: params,
          success: function (res) {
            // 已经获取被邀请用户的openid
            that.data.useropenId = res.data.data;
            that.acceptUser();
          }
        })
      }
    })
  },
  // 接受经纪人邀请人的头像
  acceptUser:function() {
    var that = this;
    wx.request({
      url: that.data.serverIP  + '/insurance/broker/team/api/v2.0.0/receive/broker/team/application/view',
      method: 'POST',
      data: {
        brokerTeamId: that.data.brokerTeamId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        console.log(data);
        if (data.businessCode === '0000') {
          that.setData({
            hasJoin: data.data.headUrls,
            headUrls: data.data.adminHead
          })
          wx.hideLoading();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.acceptUser());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading();
      }
    })    
  },
  // 接受邀请
  acceptInvitation:function() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    wx.request({
      url: that.data.serverIP + '/insurance/broker/team/api/v2.0.0/receive/broker/team/application',
      method: 'POST',
      data: {
        brokerTeamId: that.data.brokerTeamId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        console.log(data);
        if (data.businessCode === '0000') { // 接受邀请，并且已经注册过个人版
          wx.showToast({
            title: '接受邀请',
            icon:'success',
            duration:2000
          })
          wx.switchTab({
            url: "/pages/2-tabs/0-ipCard/0-ipCard"
          });
        } else if (data.businessCode === '0002') { //接受邀请，并且未注册过小程序==注册个人版 。注册个人版成功再次调接受邀请接口
          app.globalData.beInvitTeamId = that.data.brokerTeamId;
          wx.navigateTo({
            url: '../../1-register/2-telCheck/2-telCheck',
          })
        } else if (data.businessCode === '0003') { // 已经加入了团队
          wx.showToast({
            title: '您已经加入了团队',
            icon: 'none',
            duration: 2000
          })
        }  else if (data.businessCode === '0009') {
          app.getSessionKey(that.acceptInvitation());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading();
      }
    }) 
  },
  // 弹出授权
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.errMsg === 'getUserInfo:ok') {
      // 授权失败，授权成功
      app.globalData.userInfo = e.detail.userInfo
      console.log('用户允许');
      this.acceptInvitation();
    } else {
      console.log('用户拒绝');
      wx.showToast({
        title: '授权后才可接受邀请哦',
        icon: 'none',
        duration: 2000
      })
    }
  }
})