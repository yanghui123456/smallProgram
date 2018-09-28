//index.js
//获取应用实例
const app = getApp()

Page({
  onPullDownRefresh:function() {
    wx.stopPullDownRefresh();
    this.setData({
      activeTab: 1
    })
    this.onLoad();
   
  },
  data: {
    showList: true,
    showYxList:false,
    showMask:false,
    weihuList: [], // 托管客户列表
    yixiangList:[],
    sendMsgTel: '',
    nowTime:'',
    userId: '',
    nickName:'',
    brokerName: '',
    activeTab:1,
    formId:''
  },
  // 页面加载
  onLoad: function (res) {
    wx.showLoading({
      title: '加载中...',
    })
    this.weihuDetail();
    this.setData({
      brokerName: app.globalData.agentInfo.realName
    })
  },
  tabClick:function(e) {
    this.setData({
      activeTab:e.target.dataset.tab
    })
  },
  // 托管用户列表
  weihuDetail:function() {
    var that = this;
    // 客户维护列表
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/customerList/query/' + app.globalData.agentInfo.id,
      method: 'get',
      header: {'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          if (data.data.customerList.length === 0) {
            that.setData({
              weihuList: data.data.customerList,
              showList: true
            })
          } else {
            that.setData({
              weihuList: data.data.customerList,
              showList: false
            })
          }
          that.yixiangDetail(); // 获取意向客户列表
          wx.hideLoading();
        } else if (data.businessCode === '0009') {
          // sessionKey过期，重新获取
          app.getSessionKey(that.weihuDetail());
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
  // 意向用户列表
  yixiangDetail:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerVisitor/query',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          // 意向客户列表与后台联调
          if (data.data.length === 0) {
            that.setData({
              yixiangList: data.data,
              showYxList:true
            })
          } else {
            that.setData({
              yixiangList: data.data,
              showYxList:false
            })
          }
        } else if (data.businessCode === '0009') {
          // sessionKey过期，重新获取
          app.getSessionKey(that.yixiangDetail());
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
  hasSend:function() {
    wx.showToast({
      title: '重新分享名片才可继续发送托管邀请',
      icon:'none',
      duration:2000
    })
  },
  yaoqingYh1:function() {
    wx.navigateTo({
      url: '../../trusteeship/trusteeship-invitation/Invitation?content=' + '我是海豚保管的保险管家' + app.globalData.agentInfo.realName + '，邀请您接受我的保单管理服务',
    })
  },
  yaoqingYh:function(e) {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/send/trusteeship/template',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id,
        customerOpenId:e.target.dataset.openid,
        formId: e.target.dataset.formid
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          wx.showToast({
            title: '发送成功',
          })
          // 刷新列表
          that.yixiangDetail(); // 获取意向客户列表
        } else if (data.businessCode === '0009') {
          // sessionKey过期，重新获取
          app.getSessionKey(that.yaoqingYh());
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
  downApp:function(e) {
    this.setData({
      showMask: true,
      sendMsgTel: e.target.dataset.tel,
      nickName: e.target.dataset.nickname
    })
  },
  // 点击用户列表
  seeDetail:function(e) {
    app.globalData.whUserId = e.target.dataset.userid;
    wx.navigateTo({
      url: '../../weihu/1-detail/1-detail?userid=' + e.target.dataset.userid,
    })
  },
  // 发送短信
  sendMsg:function() {
    // sendMsgTel 用户下发短信的手机号码
    var thats = this;
    var params = {
      mobilePhone: thats.data.sendMsgTel,
      nickName: app.globalData.agentInfo.realName
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/customerDetail/sendMessage',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded','openid': app.globalData.openId },
      data: params,
      success: function (res) {
        if (res.data.businessCode === '0000') {
          wx.showToast({
            title: '短信已发送成功',
            icon: 'success',
            duration: 2000
          })
        } else if (res.data.businessCode === '0009') {
          app.getSessionKey(thats.sendMsg());
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        thats.setData({
          showMask:false
        })
      }
    })
  },
  // 去详情页
  goDetail:function() {
    wx.navigateTo({
      url: '../../weihu/1-detail/1-detail',
    })
  },
  closeMask:function() {
    this.setData({
      showMask: false
    })
  },
  callPhone:function(e) {
    var that = this;
    that.setData({
      userId: e.target.dataset.userid
    })
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel,
      success: function () {
        // 添加维护记录
        that.getNowTime();
        that.addWeihuNotes();
      }
    })
  },
  getNowTime: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    this.setData({
      nowTime: year + '-' + month + '-' + day + '-' + hour + ':' + minute + ':' + second
    })
  },
  addWeihuNotes: function () {
    var that = this;
    var params = {
      vindicateTime: that.data.nowTime,
      type: 2,
      userId: that.data.userId,
      brokerId: app.globalData.agentInfo.id
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/customer/add',
      method: 'POST',
      data: params,
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {

        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.addWeihuNotes());
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
  invitationPerson:function() {
    wx.showToast({
      title: '去邀请',
      icon:'none',
      duration:2000
    })
  },
  // 剪切板
  copyContent:function() {
    var that = this;
    wx.setClipboardData({
      data: '亲爱的客户，我是您的保险管家' + app.globalData.agentInfo.realName + '。请下载海豚智保APP让我为您进行保单年检、投保、理赔等一对一贴心服务。马上下载还可抢创世大礼包哦https://app.baoxian.xujinkeji.com/wx/#/',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            that.setData({
              showMask: false
            })
          }
        })
      }
    })
  }
})
