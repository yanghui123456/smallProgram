// pages/1-register/4-mutipleVersion/4-mutipleVersion.js
//获取应用实例
const app = getApp()
Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      'http://oss.baoxian.xujinkeji.com/broker/team.png',
      'http://oss.baoxian.xujinkeji.com/broker/vipVersion.png',
      'http://oss.baoxian.xujinkeji.com/broker/personal.png'
    ],
    indicatorDots: true,
    autoplay: false,
    circular:true,
    interval: 2000,
    duration: 1000,
    currentImg:0
  },
  onLoad: function (res) {
    console.log('当前的索引' + this.data.currentImg)
    console.log(res);
    // 从我的-邀请用户转发携带转打者的经纪人id
    if (JSON.stringify(res) == "{}") {
      app.globalData.shareJjrId = '';
    } else {
      app.globalData.shareJjrId = res.jjrId;
    }
    console.log(app.globalData.shareJjrId);
    // 是否退出小程序
    if (app.globalData.signOut) {//如果flag为true，退出
      wx.navigateBack({
        delta: 1
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function () {
    wx.showLoading({
      title: '正在查看审核状态'
    })
    this.go_check_tel();//正在审核中的经纪人如果审核通过就会直接跳转至tab页面，质保托管、我的分析也走该流程
  },
  swiperChange:function(e) {
    // console.log(e.detail.current); //当前是哪一个页面
    this.setData({
      currentImg: e.detail.current
    })
    console.log('当前的索引' + this.data.currentImg)
  },
  // 弹出授权
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.errMsg === 'getUserInfo:ok') {
      // 授权失败，授权成功
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      console.log('用户允许');
      console.log(app.globalData.registerOpenid);
      if (app.globalData.registerOpenid == 'false') {
        // openid未注册，判断用户点击的是哪个版本
        this.clickImg();
        // wx.navigateTo({
        //   url: '../2-telCheck/2-telCheck',
        // })
      } else if (app.globalData.registerOpenid == 'true') {
        // app.js以及做了跳转
      } else if (app.globalData.registerOpenid == 'wait') {
        wx.showToast({
          title: '您的申请正在审核中...',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      console.log('用户拒绝');
      wx.showToast({
        title: '授权后才可继续进行哦',
        icon: 'none',
        duration: 2000
      })
    }
  },
  go_check_tel: function () {
    //查看经纪人审核是否通过
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/check/openid',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        // 0002=openid未注册或者审核拒绝  0004=openid被停用(目前不会返回),  0005=openid正在审核中, 0003=openid审核通过
        wx.hideLoading();
        if (res.data.businessCode === '0002') {
          app.globalData.registerOpenid = 'false';
        } else if (res.data.businessCode === '0003') {
          app.globalData.registerOpenid = 'true';
          app.globalData.agentInfo = res.data.data;
          wx.switchTab({
            url: "/pages/2-tabs/0-ipCard/0-ipCard"
          });
        } else if (res.data.businessCode === '0005') {
          app.globalData.registerOpenid = 'wait';
          wx.showToast({
            title: '您的申请正在审核中...',
            icon: 'none',
            duration: 2000
          });
          return;
        }
      }
    })
  },
  // 已授权的按钮
  go_check_tel2: function () {
    //查看经纪人审核是否通过
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/check/openid',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        // 0002=openid未注册或者审核拒绝  0004=openid被停用(目前不会返回),  0005=openid正在审核中, 0003=openid审核通过
        wx.hideLoading();
        if (res.data.businessCode === '0002') {
          app.globalData.registerOpenid = 'false';
          that.clickImg();
        } else if (res.data.businessCode === '0003') {
          app.globalData.registerOpenid = 'true';
          app.globalData.agentInfo = res.data.data;
          wx.switchTab({
            url: "/pages/2-tabs/0-ipCard/0-ipCard"
          });
        } else if (res.data.businessCode === '0005') {
          app.globalData.registerOpenid = 'wait';
          wx.showToast({
            title: '您的申请正在审核中...',
            icon: 'none',
            duration: 2000
          });
          return;
        }
      }
    })
  },
  clickImg:function() {
    console.log('当前的索引' + this.data.currentImg)
    // 查看是否授权，已授权，跳转对应的页面，无授权提示用户授权
    if (this.data.currentImg == 0) {
      // 团队版 = 0
      wx.navigateTo({
        url: '../../team/1-kaitong/1-kaitong',
      })
    } else if (this.data.currentImg == 2) {
      // 个人版 = 2
      wx.navigateTo({
        url: '../2-telCheck/2-telCheck',
      })
    } else if (this.data.currentImg == 1) {
      // 专享版 = 2
     wx.showToast({
       title: '敬请期待...',
       icon:'none',
       duration:2000
     })
    }
  }
})