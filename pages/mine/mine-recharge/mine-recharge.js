//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    nowTime:''
  },
  onLoad: function () {
    app.globalData.hasPaycharge = '';
  },
  goRechargeNotes:function(e) {
    if (e.target.dataset.id === '1') {
      app.goNewPage(e);
    } else if (e.target.dataset.id === '2') {
      app.goNewPage(e);
    }
  },
  // 支付接口
  rechargeMoney:function(e) {
    var that = this;
    var params = {
      brokerId: app.globalData.agentInfo.id, // 经纪人id
      money: e.target.dataset.money, //充值金额
      dolphinCoin: e.target.dataset.htb // 充值海豚币
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/brokerInfo/recharge',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      data:params,
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          //调微信支付
          wx.requestPayment({
            'timeStamp': data.data.timeStamp,
            'nonceStr': data.data.nonceStr,
            'package': data.data.package,
            'signType': 'MD5',
            'paySign': data.data.paySign,
            'success': function (res) {
              app.globalData.hasPaycharge = true;
              that.getNowTime();
              wx.navigateTo({
                url: '../mine-recharge-success/mine-recharge-success?htb=' + e.target.dataset.htb + '&money=' + e.target.dataset.money + '&orderId=' + data.data.orderId + '&nowTime=' + that.data.nowTime,
              })
              wx.showToast({
                title: '支付成功',
                icon: 'none',
                duration: 2000
              })
            },
            'fail': function (res) {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else if (data.businessCode === '0000') {
          app.getSessionKey(that.rechargeMoney());
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
  }
})
