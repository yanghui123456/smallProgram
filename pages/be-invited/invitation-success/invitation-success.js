//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    brokerId:'',//经纪人id
    severIp: '',//后台请求的ip地址
    openId: '',//用户的openid
    headImg:'',
    realName: '',//经纪人名字
    company:'',
    year: ''
  },
  //事件处理函数
  onLoad: function (res) {
    console.log(res);
    //上个页面url带过来的经纪人id
    this.setData({
      brokerId: res.brokerId,
      severIp:res.ip,
      openId: res.openid
    })
    //获取经纪人信息进行展示
    this.getBrokerDetail();
  },
  getBrokerDetail:function() {
    var that = this;
    wx.request({
      url: that.data.severIp + '/insurance/broker/api/v1.0.0/broker/home/info',
      method: 'POST',
      data: {
        brokerId: that.data.brokerId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            headImg: data.data.headUrl,
            realName: data.data.realName,
            company: data.data.brokerCompanyName,
            year: data.data.term
          })
          // 根据后台返回判断该用户是否已经被托管，进而展示不同的页面
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getBrokerDetail);
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
