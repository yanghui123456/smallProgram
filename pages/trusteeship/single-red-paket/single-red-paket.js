//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    jjrName: '',
    jjrHtb:'',
    time:'',
    serverIp:'',
    brokerId: '',//经纪人id
    userId:'',//经纪人在小程序给id为userId的用户发送红包
    useropenId:'',//用户openid
    giftId:'',
    imageUrl:'',
    isSamePerson:true,
    noSamePerson:false,
    paketGuoqi:false,
    hasGet:false
  },
  //事件处理函数
  onLoad: function (res) {
    console.log(res);
    this.setData({
      brokerId: res.brokerId,
      jjrHtb:res.htb,
      serverIp: res.serverIp,
      userId: res.userId,
      giftId: res.giftId
    })
    // 客户领取红包
    this.getOpenid();
  },
  getGift:function() {
    var that = this;
    wx.request({
      url: that.data.serverIp + '/insurance/broker/api/v1.0.0/oneRedEnvelope/receive',
      method: 'POST',
      data: {
        brokerGiftId: that.data.giftId,
        userId: that.data.userId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          // 判断经纪人发送的客户与领取红包的用户是否是同一人 isSamePerson=true同一人，false非同一人
          if(data.data.isSamePerson=== true) {
            that.setData({
              time: data.data.receiveTime,
              imageUrl: data.data.brokerHeadUrl,
              jjrName: data.data.brokerRealName,
              isSamePerson: true,
              noSamePerson:false,
              paketGuoqi:false,
              hasGet:false
            })
          } else if(data.data.isSamePerson === false)  {
            that.setData({
              isSamePerson: false,
              noSamePerson: true,
              paketGuoqi: false,
              hasGet: false,
              imageUrl: data.data.brokerHeadUrl
            })
          }
        } else if (data.businessCode === '0002') {
          //红包已过期
          that.setData({
            isSamePerson: false,
            noSamePerson: false,
            paketGuoqi:true,
            hasGet: false,
            imageUrl: data.data.brokerHeadUrl
          })
        } else if (data.businessCode === '0004') {
          //用户已经领取过该红包
          that.setData({
            isSamePerson: false,
            noSamePerson: false,
            paketGuoqi: false,
            hasGet: true,
            imageUrl: data.data.brokerHeadUrl
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getGift());
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
  getOpenid: function () {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code);
        var params = {
          code: res.code
        }
        wx.request({
          url: that.data.serverIp + '/insurance/broker/api/v1.0.0/select/openid',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: params,
          success: function (res) {
            // 已经获取被邀请用户的openid
            that.data.useropenId = res.data.data;
            that.getGift();
          }
        })
      }
    })
  },
  getDetail: function () {
    var that = this;
    wx.request({
      url: that.data.serverIp + '/insurance/broker/api/v1.0.0/broker/home/info',
      method: 'POST',
      data: {
        brokerId: that.data.brokerId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            headImg: data.data.headUrl,
            nickName: data.data.nickName,
            realName: data.data.realName,
            company: data.data.brokerCompanyName,
            tel: data.data.phoneNo,
            year: data.data.term,
            insuranceCount: data.data.insuranceCount,
            customerCount: data.data.customerCount
          })
          // 根据后台返回判断该用户是否已经被托管，进而展示不同的页面
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getDetail());
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
  }
})
