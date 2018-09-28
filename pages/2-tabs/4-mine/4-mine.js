//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showMask:false,
    agenHeadImg:'',
    agentTuoguan: '',
    agentHTB:'',
    termCount:'',
    showVipIcon: false,
    showTips:false
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '百万保险顾问都在用的保单托管智能助理',
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
  onShow: function () {
    this.setData({
      agenHeadImg: app.globalData.agentInfo.headUrl,
    })
    this.mineDetail();
  },
  mineDetail:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/brokerInfo/query/' + app.globalData.agentInfo.id,
      method: 'GET',
      header: { 'openid': app.globalData.openId },
      success: function (res) {
        if (res.data.businessCode === '0000') {
          that.setData({
            agentHTB: res.data.data.dolphinCoin,
            agentTuoguan: res.data.data.trusteeshipCount,
            termCount: res.data.data.termCount
            // 是否为vip 0=非会员; 1=会员
            // showVipIcon: res.data.data.isMember == 0 ? false : true
          })
        } else if (res.data.businessCode === '0009'){
          app.getSessionKey(that.mineDetail());
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
  yqjl:function() {
    wx.navigateTo({
      url: '../../mine/mine-invitation-friends/mine-invitation-friends',
    })
  },
  goTeam:function() {
    wx.showLoading({
      title: '加载中...',
    })
    // 判断该经纪人是否有团队，是否过期。
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/select/my/broker/team',
      method: 'POST',
      data: {},
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        wx.hideLoading();
        var data = res.data;
        if (data.businessCode === '0000') { // 有团队
          wx.navigateTo({
            url: '../../mine/mine-team/mine-team',
          })
          app.globalData.teamData = data.data; // 开始存储有团队的团队数据
        } else if (data.businessCode === '0002') { // 没有团队
          wx.navigateTo({
            url: '../../mine/mine-team-no/mine-team-no',
          })
        } else if (data.businessCode === '0003') { // 支付中（从团队版开通流程到支付界面未支付，直接退出小程序）
          wx.navigateTo({
            url: '../../mine/buy-author/buy-author',
          })
        } else if (data.businessCode === '0004') { // 申请加入的团队管理员未审核
          wx.showToast({
            title: '您的申请管理员正在审核中',
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.goTeam());
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
  goChart:function() {
    wx.navigateTo({
      url: '../../mine/mine-charts/mine-charts',
    })
  },
  goChongzhi:function(e) {
    app.globalData.hasPaycharge = false;
    app.goNewPage(e);
  },
  // 托管记录，常见问题，VIP
  checkPage:function(e) {
    app.goNewPage(e);
  },
  goSelfInfo:function() {
    wx.navigateTo({
      url: '../../mine/mine-info/mine-info'
    })
  }
})
