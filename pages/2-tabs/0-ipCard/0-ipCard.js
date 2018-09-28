// pages/2-tabs/0-ipCard/0-ipCard.js
const app = getApp();
Page({
  onPullDownRefresh: function () {
    this.onLoad();
  },
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '你好,我是' + that.data.brokerName + ',这是我的名片',
      path: '/pages/mine/IP-share-card/IP-share-card?brokerId=' + app.globalData.agentInfo.id + '&serverIP=' + app.globalData.severIp + '&brokerCardId=' + that.data.brokerCarId,
      imageUrl: 'http://oss.baoxian.xujinkeji.com/broker/send-no-red.jpg', 
     
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
        that.getShareCount();
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
    nowTime:'',
    visitor:'',
    brokerName:'',
    company:'',
    headUrl: '',
    year:'',
    praisedCount:'',
    browseCount:'',
    tuoguanCount:'',
    insuranceCount:'',
    brokerCarId:''// 经纪人名片id
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.getCardId(); // 获取名片id
  },

  // 名片分享次数接口
  getShareCount: function () {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerCard/share',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {

        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getCardId());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  onShow: function () {
    this.setData({
      headUrl: app.globalData.agentInfo.headUrl,
      company: app.globalData.companyName,
    })
  },
  // 获取名片id
  getCardId: function () {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerCard/init',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          // 判断是不是null
          if (data.data === null) {
            wx.showToast({
              title: '名片id为null',
            })
          } else {
            that.setData({
              brokerCarId: data.data,
            })
            that.ipInfo(); // 获取经纪人ip名片信息
          }
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getCardId());
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
  // 获取今日访客
  getVisiter:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerVisitor/total',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
            that.setData({
              visitor:data.data
            })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getVisiter());
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
  // 查看托管人数，保险分数
  brokerInfo: function () {
    // 获取经纪人基本信息接口
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/broker/home/info',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            tuoguanCount: data.data.customerCount,
            insuranceCount: data.data.insuranceCount,
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.brokerInfo());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    })
  },
  // 获取当前时间
  getNowTime:function() {
    var date = new Date();
    var year = date.getFullYear();
    var mouth = date.getMonth() + 1;
    var day = date.getDate();
    this.setData({
      nowTime: year + '年' + mouth + '月' + day + '日'
    })
  },
  // 托管
  startInvit:function() {
    wx.navigateTo({
      url: '../1-tuoguan/1-tuoguan',
    })
  },
  goIp:function() {
    wx.navigateTo({
      url: '../../mine/IP-card-canvas/IP-card-canvas',
    })
  },
  // 名片信息
  ipInfo:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerCard/query',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          app.globalData.companyName = data.data.brokerPersonalInfoModel.companyName; // 设置全局的保险公司名称
          that.setData({
            // visitor: data.data.visitor
            praisedCount: data.data.praisedCount,
            browseCount: data.data.browseCount,
            company: data.data.brokerPersonalInfoModel.companyName,
            brokerName: data.data.brokerPersonalInfoModel.realName,
            year: data.data.brokerPersonalInfoModel.term,
            headUrl: data.data.brokerPersonalInfoModel.headUrl
          })
          that.getNowTime(); // 获取当前时间
          that.brokerInfo(); // 客户托管人数
          that.getVisiter(); // 今日访客人数
          wx.stopPullDownRefresh();
          wx.hideLoading();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.ipInfo());
        } else {
          wx.showToast({
            title: data.msg,
            icon:'none',
            duration:2000
          })
        }
      }
    })
  },
  // 托管信息
  tuoguanInfo:function() {

  }
})